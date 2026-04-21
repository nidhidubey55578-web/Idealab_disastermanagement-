import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, AlertCircle, TrendingUp } from 'lucide-react';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-8 pb-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 sm:p-12 text-white shadow-2xl flex flex-col items-center text-center">
        <div className="absolute top-0 right-0 -m-16 w-64 h-64 bg-primary/20 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -m-16 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl opacity-50"></div>
        
        <div className="z-10 max-w-2xl">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-300">
            {t('app_name')}
          </h2>
          <p className="text-lg text-slate-300 mb-8 max-w-xl mx-auto">
            Stay safe with real-time alerts, AI-verified news, and instant access to emergency services across India.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/verify" className="bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-8 rounded-full shadow-lg shadow-primary/30 transition-all transform hover:scale-105 hover:shadow-xl flex items-center gap-2">
              <ShieldCheck className="w-5 h-5"/>
              {t('verify')} Now
            </Link>
            <Link to="/alerts" className="bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-white font-semibold py-3 px-8 rounded-full transition-all backdrop-blur-sm flex items-center gap-2 transform hover:scale-105">
              <MapPin className="w-5 h-5"/>
              View {t('alerts')}
            </Link>
          </div>
        </div>
      </section>

      {/* Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Trending Fake News */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 transition-all hover:shadow-md group">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-red-100 dark:bg-red-500/10 rounded-xl">
              <TrendingUp className="text-red-500 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">{t('trending_fake_news')}</h3>
          </div>
          <div className="space-y-4">
            {/* Mock Item */}
            <div className="group-hover:translate-x-2 transition-transform duration-300 p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50 flex flex-col gap-2 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-red-400"></div>
               <span className="text-xs font-bold text-red-500 uppercase tracking-wider">Debunked</span>
               <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                 "Massive 8.0 Earthquake predicted in Mumbai tomorrow at 4 PM."
               </p>
            </div>
            {/* Mock Item */}
            <div className="group-hover:translate-x-2 transition-transform duration-300 delay-75 p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50 flex flex-col gap-2 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-red-400"></div>
               <span className="text-xs font-bold text-red-500 uppercase tracking-wider">Debunked</span>
               <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                 "Viral video claims Cyclone over Chennai is highly destructive—it is from 2015."
               </p>
            </div>
          </div>
        </div>

        {/* Safety Tips */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 transition-all hover:shadow-md group">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 dark:bg-blue-500/10 rounded-xl">
              <AlertCircle className="text-blue-500 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">{t('safety_tips')}</h3>
          </div>
          <ul className="space-y-4">
            <li className="flex gap-3 text-sm text-slate-700 dark:text-slate-300 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl items-start">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
              <span>Do not panic or spread unverified rumors on WhatsApp. Use this app to verify claims instantly.</span>
            </li>
            <li className="flex gap-3 text-sm text-slate-700 dark:text-slate-300 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl items-start">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
              <span>Keep an emergency kit ready with first aid, torch, and drinking water during cyclone warnings.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
