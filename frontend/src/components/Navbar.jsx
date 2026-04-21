import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldAlert, Globe } from 'lucide-react';

const Navbar = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-4 z-50 shadow-sm">
      <div className="flex items-center gap-2">
        <ShieldAlert className="text-red-500 w-8 h-8" />
        <h1 className="font-bold text-lg text-slate-800 dark:text-white hidden sm:block tracking-tight">
          {t('app_name')}
        </h1>
        <h1 className="font-bold text-lg text-slate-800 dark:text-white sm:hidden tracking-tight">
          SafeIndia
        </h1>
      </div>
      
      <div className="flex items-center gap-2">
        <Globe className="w-5 h-5 text-gray-500" />
        <select 
          onChange={changeLanguage} 
          value={i18n.language}
          className="bg-gray-100 dark:bg-slate-800 text-sm rounded-md px-2 py-1 border-none focus:ring-2 focus:ring-primary outline-none text-slate-700 dark:text-slate-200"
        >
          <option value="en">English</option>
          <option value="hi">हिंदी</option>
          <option value="mr">मराठी</option>
        </select>
      </div>
    </nav>
  );
};

export default Navbar;
