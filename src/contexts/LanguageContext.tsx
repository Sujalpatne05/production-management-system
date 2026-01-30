import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "en" | "es" | "fr" | "ar" | "bn";

interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  shortCode: string;
}

export const languages: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸", shortCode: "US" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸", shortCode: "ES" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", shortCode: "FR" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦", shortCode: "SA" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇧🇩", shortCode: "BD" },
];

// Translation strings
const translations: Record<Language, Record<string, string>> = {
  en: {
    dashboard: "Dashboard",
    overview: "Overview",
    home: "Home",
    production: "Production",
    sales: "Sales",
    purchases: "Purchases",
    parties: "Parties",
    customers: "Customers",
    suppliers: "Suppliers",
    attendance: "Attendance",
    expenses: "Expenses",
    accounting: "Accounting",
    payments: "Payments",
    payroll: "Payroll",
    itemSetup: "Item Setup",
    wastes: "Wastes",
    quotations: "Quotations",
    reports: "Reports",
    users: "Users",
    settings: "Settings",
    checkIn: "Check In",
    checkOut: "Check Out",
    language: "Language",
    profile: "Profile",
    logout: "Logout",
    search: "Search",
    add: "Add",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    export: "Export",
    welcome: "Welcome",
    total: "Total",
    today: "Today",
  },
  es: {
    dashboard: "Panel",
    overview: "Resumen",
    home: "Inicio",
    production: "Producción",
    sales: "Ventas",
    purchases: "Compras",
    parties: "Partes",
    customers: "Clientes",
    suppliers: "Proveedores",
    attendance: "Asistencia",
    expenses: "Gastos",
    accounting: "Contabilidad",
    payments: "Pagos",
    payroll: "Nómina",
    itemSetup: "Config. Artículos",
    wastes: "Residuos",
    quotations: "Cotizaciones",
    reports: "Informes",
    users: "Usuarios",
    settings: "Configuración",
    checkIn: "Entrada",
    checkOut: "Salida",
    language: "Idioma",
    profile: "Perfil",
    logout: "Cerrar Sesión",
    search: "Buscar",
    add: "Agregar",
    edit: "Editar",
    delete: "Eliminar",
    save: "Guardar",
    cancel: "Cancelar",
    export: "Exportar",
    welcome: "Bienvenido",
    total: "Total",
    today: "Hoy",
  },
  fr: {
    dashboard: "Tableau de bord",
    overview: "Aperçu",
    home: "Accueil",
    production: "Production",
    sales: "Ventes",
    purchases: "Achats",
    parties: "Parties",
    customers: "Clients",
    suppliers: "Fournisseurs",
    attendance: "Présence",
    expenses: "Dépenses",
    accounting: "Comptabilité",
    payments: "Paiements",
    payroll: "Paie",
    itemSetup: "Config. Articles",
    wastes: "Déchets",
    quotations: "Devis",
    reports: "Rapports",
    users: "Utilisateurs",
    settings: "Paramètres",
    checkIn: "Entrée",
    checkOut: "Sortie",
    language: "Langue",
    profile: "Profil",
    logout: "Déconnexion",
    search: "Rechercher",
    add: "Ajouter",
    edit: "Modifier",
    delete: "Supprimer",
    save: "Sauvegarder",
    cancel: "Annuler",
    export: "Exporter",
    welcome: "Bienvenue",
    total: "Total",
    today: "Aujourd'hui",
  },
  ar: {
    dashboard: "لوحة التحكم",
    overview: "نظرة عامة",
    home: "الرئيسية",
    production: "الإنتاج",
    sales: "المبيعات",
    purchases: "المشتريات",
    parties: "الأطراف",
    customers: "العملاء",
    suppliers: "الموردين",
    attendance: "الحضور",
    expenses: "المصروفات",
    accounting: "المحاسبة",
    payments: "المدفوعات",
    payroll: "الرواتب",
    itemSetup: "إعداد الأصناف",
    wastes: "المهدر",
    quotations: "عروض الأسعار",
    reports: "التقارير",
    users: "المستخدمين",
    settings: "الإعدادات",
    checkIn: "تسجيل الدخول",
    checkOut: "تسجيل الخروج",
    language: "اللغة",
    profile: "الملف الشخصي",
    logout: "تسجيل الخروج",
    search: "بحث",
    add: "إضافة",
    edit: "تعديل",
    delete: "حذف",
    save: "حفظ",
    cancel: "إلغاء",
    export: "تصدير",
    welcome: "مرحباً",
    total: "المجموع",
    today: "اليوم",
  },
  bn: {
    dashboard: "ড্যাশবোর্ড",
    overview: "সংক্ষিপ্ত বিবরণ",
    home: "হোম",
    production: "উৎপাদন",
    sales: "বিক্রয়",
    purchases: "ক্রয়",
    parties: "পক্ষসমূহ",
    customers: "গ্রাহক",
    suppliers: "সরবরাহকারী",
    attendance: "উপস্থিতি",
    expenses: "ব্যয়",
    accounting: "হিসাবরক্ষণ",
    payments: "পেমেন্ট",
    payroll: "বেতন",
    itemSetup: "আইটেম সেটআপ",
    wastes: "অপচয়",
    quotations: "কোটেশন",
    reports: "রিপোর্ট",
    users: "ব্যবহারকারী",
    settings: "সেটিংস",
    checkIn: "চেক ইন",
    checkOut: "চেক আউট",
    language: "ভাষা",
    profile: "প্রোফাইল",
    logout: "লগআউট",
    search: "খুঁজুন",
    add: "যোগ করুন",
    edit: "সম্পাদনা",
    delete: "মুছুন",
    save: "সংরক্ষণ",
    cancel: "বাতিল",
    export: "এক্সপোর্ট",
    welcome: "স্বাগতম",
    total: "মোট",
    today: "আজ",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  currentLanguage: LanguageOption;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("app-language");
    return (saved as Language) || "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("app-language", lang);
    
    // Set RTL direction for Arabic
    if (lang === "ar") {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    }
  };

  useEffect(() => {
    if (language === "ar") {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    }
  }, []);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const currentLanguage = languages.find(l => l.code === language) || languages[0];
  const isRTL = language === "ar";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, currentLanguage, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
