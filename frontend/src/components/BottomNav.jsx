import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, ShieldCheck, MapPin, PhoneCall } from 'lucide-react';

const BottomNav = () => {
  const { t } = useTranslation();

  const navItems = [
    { to: "/", icon: Home, label: "home" },
    { to: "/verify", icon: ShieldCheck, label: "verify" },
    { to: "/alerts", icon: MapPin, label: "alerts" },
    { to: "/emergency", icon: PhoneCall, label: "emergency" }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 flex justify-around items-center z-50 md:hidden pb-safe">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => 
            `flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
              isActive ? 'text-primary' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`
          }
        >
          <item.icon className="w-6 h-6" />
          <span className="text-[10px] font-medium">{t(item.label)}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default BottomNav;
