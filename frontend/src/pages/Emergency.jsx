import React from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Shield, Truck, LifeBuoy, HeartPulse, Building } from 'lucide-react';

const Emergency = () => {
    const { t } = useTranslation();

    const contacts = [
        {
            title: t('police'),
            number: '100',
            icon: Shield,
            color: 'bg-blue-100 text-blue-600',
            bg: 'hover:bg-blue-50 dark:hover:bg-blue-900/10'
        },
        {
            title: t('ambulance'),
            number: '108',
            icon: Truck,
            color: 'bg-red-100 text-red-600',
            bg: 'hover:bg-red-50 dark:hover:bg-red-900/10'
        },
        {
            title: t('ndma_helpline'),
            number: '1078',
            icon: LifeBuoy,
            color: 'bg-orange-100 text-orange-600',
            bg: 'hover:bg-orange-50 dark:hover:bg-orange-900/10'
        },
        {
            title: 'Women Helpline',
            number: '1091',
            icon: HeartPulse,
            color: 'bg-pink-100 text-pink-600',
            bg: 'hover:bg-pink-50 dark:hover:bg-pink-900/10'
        },
        {
            title: 'Fire Brigade',
            number: '101',
            icon: Building,
            color: 'bg-red-100 text-red-600',
            bg: 'hover:bg-red-50 dark:hover:bg-red-900/10'
        }
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 mb-4 ring-4 ring-red-50 dark:ring-red-500/10">
                    <Phone className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-2">{t('emergency_contacts')}</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
                    In case of a severe emergency, tap on any number to dial instantly. Please do not make mock calls to these lines.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contacts.map((contact, index) => (
                    <a 
                        key={index} 
                        href={`tel:${contact.number}`}
                        className={`group flex items-center p-6 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all ${contact.bg}`}
                    >
                        <div className={`p-4 rounded-2xl ${contact.color} mr-6 transition-transform group-hover:scale-110`}>
                            <contact.icon className="w-8 h-8" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1 group-hover:text-primary transition-colors">{contact.title}</h3>
                            <p className="text-slate-500 text-sm">Tap to call immediately</p>
                        </div>
                        <div className="text-3xl font-black text-slate-300 dark:text-slate-700 group-hover:text-primary/30 transition-colors">
                            {contact.number}
                        </div>
                    </a>
                ))}
            </div>

            <div className="mt-12 bg-slate-800 text-white rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <h3 className="text-2xl font-bold mb-4 relative z-10">Need Community Help?</h3>
                <p className="text-slate-300 max-w-md mb-6 relative z-10">
                    Connect with local volunteers for rescue and immediate aid. Keep your location services enabled.
                </p>
                <button className="bg-primary hover:bg-primary-dark text-white rounded-full px-8 py-3 font-semibold transition-transform transform hover:scale-105 active:scale-95 shadow-lg relative z-10">
                    Request Help
                </button>
            </div>
        </div>
    );
};

export default Emergency;
