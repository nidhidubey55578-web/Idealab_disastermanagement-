import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Loader2, ShieldAlert, CheckCircle, AlertTriangle, ExternalLink, Flag } from 'lucide-react';
import axios from 'axios';
import { supabase } from '../supabaseClient';

const VerifyNews = () => {
    const { t } = useTranslation();
    const [newsText, setNewsText] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [reportStatus, setReportStatus] = useState("");

    const handleReportFake = async () => {
        if (!newsText.trim()) return;
        setReportStatus("Reporting...");
        try {
            const { error } = await supabase
                .from('reported_fake')
                .insert([{ news_text: newsText }]);
            if (error) throw error;
            setReportStatus("Reported successfully!");
            setTimeout(() => setReportStatus(""), 3000);
        } catch (err) {
            console.error("Report error:", err);
            setReportStatus("Failed to report.");
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!newsText.trim()) return;
        
        setLoading(true);
        setError("");
        setResult(null);

        try {
            const { data } = await axios.post("http://localhost:5000/api/verify-news", { newsText });
            setResult(data);
        } catch (err) {
            console.error("Verification failed", err);
            setError("Failed to verify. Please ensure the backend is running and API keys are set.");
            // Mock Fallback for UI demonstration if backend fails
            setResult({
                status: "UNVERIFIED",
                confidence: 45,
                explanation: "Could not connect to AI Verification server. Please try again later.",
                sources: []
            });
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        if (status === "TRUE") return { bg: "bg-green-100 dark:bg-green-500/10", text: "text-green-600", border: "border-green-200 dark:border-green-800", icon: CheckCircle };
        if (status === "FALSE") return { bg: "bg-red-100 dark:bg-red-500/10", text: "text-red-600", border: "border-red-200 dark:border-red-800", icon: ShieldAlert };
        return { bg: "bg-yellow-100 dark:bg-yellow-500/10", text: "text-yellow-600", border: "border-yellow-200 dark:border-yellow-800", icon: AlertTriangle };
    };

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-2 tracking-tight">AI Fact Checker</h2>
                <p className="text-slate-500 dark:text-slate-400">Paste any breaking news, WhatsApp forward, or alert warning to verify its authenticity.</p>
            </div>

            {/* Input Section */}
            <form onSubmit={handleVerify} className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                    type="text"
                    value={newsText}
                    onChange={(e) => setNewsText(e.target.value)}
                    className="block w-full pl-11 pr-32 py-5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all shadow-sm text-lg"
                    placeholder={t('verify_placeholder')}
                />
                <button
                    type="submit"
                    disabled={loading || !newsText.trim()}
                    className="absolute inset-y-2 right-2 flex items-center px-6 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('verify')}
                </button>
            </form>

            {error && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 text-sm border border-red-100 dark:border-red-800">
                    {error}
                </div>
            )}

            {/* Quick Report Actions */}
            <div className="flex justify-end pr-2 gap-2">
                <button
                    type="button"
                    onClick={handleReportFake}
                    className="text-sm font-medium flex items-center gap-1 text-slate-500 hover:text-red-500 transition-colors"
                >
                    <Flag className="w-4 h-4" /> 
                    {reportStatus || t('report_fake')}
                </button>
            </div>

            {/* Result Card */}
            {result && (
                <div className="animate-slide-up">
                    <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl transition-all ${getStatusColor(result.status).bg} ${getStatusColor(result.status).border} relative overflow-hidden`}>
                        {/* Decorative background circle */}
                        <div className={`absolute -right-16 -top-16 w-64 h-64 rounded-full blur-3xl opacity-20 bg-current ${getStatusColor(result.status).text}`}></div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-6">
                                {React.createElement(getStatusColor(result.status).icon, { className: `w-10 h-10 sm:w-14 sm:h-14 ${getStatusColor(result.status).text}` })}
                                <div>
                                    <h3 className={`text-2xl sm:text-4xl font-black ${getStatusColor(result.status).text} tracking-tight uppercase`}>
                                        {result.status === "TRUE" ? t('status_true') : result.status === "FALSE" ? t('status_false') : t('status_unverified')}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                                            {t('confidence')}: 
                                        </div>
                                        <div className="w-32 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full ${getStatusColor(result.status).text.replace('text-', 'bg-')}`} 
                                                style={{ width: `${result.confidence}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{result.confidence}%</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm rounded-2xl p-5 border border-white/20 dark:border-slate-800/50 shadow-inner">
                                <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-2 uppercase tracking-wide">Analysis</h4>
                                <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed">
                                    {result.explanation}
                                </p>
                            </div>

                            {result.sources && result.sources.length > 0 && (
                                <div className="mt-6 flex flex-wrap gap-2 items-center">
                                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400 mr-2">{t('sources')}:</span>
                                    {result.sources.map((src, idx) => (
                                        <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-white/80 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full text-xs font-medium text-slate-700 dark:text-slate-300 shadow-sm">
                                            {src} <ExternalLink className="w-3 h-3" />
                                        </span>
                                    ))}
                                </div>
                            )}

                            {result.status === "FALSE" && (
                                <div className="mt-6 p-4 bg-red-600 text-white rounded-xl shadow-lg border border-red-500 flex items-start gap-3">
                                    <AlertTriangle className="w-6 h-6 shrink-0" />
                                    <div>
                                        <h4 className="font-bold">Fake Alert Banner</h4>
                                        <p className="text-sm text-red-100">This information has been identified as false. Please DO NOT forward it to others to prevent panic.</p>
                                    </div>
                                </div>
                            )}
                            
                            {result.status === "TRUE" && (
                                <div className="mt-6 p-4 bg-blue-600 text-white rounded-xl shadow-lg border border-blue-500 flex items-start gap-3">
                                    <ShieldAlert className="w-6 h-6 shrink-0" />
                                    <div>
                                        <h4 className="font-bold">Verified Alert</h4>
                                        <p className="text-sm text-blue-100">This is a verified event. Please follow NDMA guidelines and stay safe.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VerifyNews;
