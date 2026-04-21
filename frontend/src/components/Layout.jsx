import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Navbar from './Navbar';
import BottomNav from './BottomNav';
import { Home, ShieldCheck, MapPin, PhoneCall } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Layout = () => {
    const { t } = useTranslation();
    const navItems = [
        { to: "/", icon: Home, label: "home" },
        { to: "/verify", icon: ShieldCheck, label: "verify" },
        { to: "/alerts", icon: MapPin, label: "alerts" },
        { to: "/emergency", icon: PhoneCall, label: "emergency" }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 font-sans">
            <Navbar />
            
            <div className="flex h-screen pt-16">
                {/* Desktop Sidebar */}
                <aside className="hidden md:flex flex-col w-64 border-r border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shrink-0">
                    <div className="flex flex-col gap-2 mt-4">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) => 
                                    `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                                        isActive 
                                        ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light' 
                                        : 'text-slate-600 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800'
                                    }`
                                }
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{t(item.label)}</span>
                            </NavLink>
                        ))}
                    </div>
                </aside>
                
                {/* Main Content Area */}
                <main className="flex-1 overflow-auto bg-gray-50 dark:bg-slate-950 relative pb-16 md:pb-0">
                    <div className="mx-auto max-w-5xl p-4 md:p-8 animate-fade-in">
                        <Outlet />
                    </div>
                </main>
            </div>
            
            <BottomNav />
        </div>
    );
};

export default Layout;
