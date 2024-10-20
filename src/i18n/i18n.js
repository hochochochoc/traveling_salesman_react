import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    ca: {
      translation: {
        graph_headline: "Despeses - Última setmana",
        comparison: "respecte a ahir",
        total_balance: "Balanç total",
        expenses_today: "Despeses avui",
      },
    },
    en: {
      translation: {
        graph_headline: "Expenses - Last week",
        comparison: "compared to yesterday",
        total_balance: "Total balance",
        expenses_today: "Expenses today",
      },
    },
    es: {
      translation: {
        graph_headline: "Gastos - Última semana",
        comparison: "respecto a ayer",
        total_balance: "Balance total",
        expenses_today: "Gastos hoy",
      },
    },
  },
  lng: "ca",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
