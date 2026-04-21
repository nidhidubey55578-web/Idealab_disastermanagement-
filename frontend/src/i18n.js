import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      "app_name": "DisasterAlert India",
      "home": "Home",
      "verify": "Verify",
      "alerts": "Alerts",
      "emergency": "Emergency",
      "verify_placeholder": "Paste news, link, or message to verify...",
      "verify_btn": "Verify News",
      "live_alerts_title": "Live Disaster Alerts",
      "emergency_contacts": "Emergency Contacts",
      "police": "Police",
      "ambulance": "Ambulance",
      "ndma_helpline": "NDMA Helpline",
      "trending_fake_news": "Trending Fake News",
      "safety_tips": "Safety Tips",
      "status_true": "TRUE",
      "status_false": "FAKE",
      "status_unverified": "UNVERIFIED",
      "confidence": "Confidence Score",
      "sources": "Sources",
      "report_fake": "Report Fake News"
    }
  },
  hi: {
    translation: {
      "app_name": "आपदा चेतावनी भारत",
      "home": "होम",
      "verify": "जांचें",
      "alerts": "अलर्ट",
      "emergency": "आपातकाल",
      "verify_placeholder": "सत्यापित करने के लिए समाचार या लिंक पेस्ट करें...",
      "verify_btn": "समाचार जांचें",
      "live_alerts_title": "लाइव आपदा अलर्ट",
      "emergency_contacts": "आपातकालीन संपर्क",
      "police": "पुलिस",
      "ambulance": "एम्बुलेंस",
      "ndma_helpline": "एनडीएमए हेल्पलाइन",
      "trending_fake_news": "ट्रेंडिंग फर्जी खबरें",
      "safety_tips": "सुरक्षा सुझाव",
      "status_true": "सच",
      "status_false": "फर्जी",
      "status_unverified": "असत्यापित",
      "confidence": "विश्वास स्कोर",
      "sources": "स्रोत",
      "report_fake": "फर्जी खबर की रिपोर्ट करें"
    }
  },
  mr: {
    translation: {
      "app_name": "आपत्ती सूचना भारत",
      "home": "मुख्य पृष्ठ",
      "verify": "तपासा",
      "alerts": "सूचना",
      "emergency": "आणीबाणी",
      "verify_placeholder": "तपासण्यासाठी बातमी किंवा लिंक पेस्ट करा...",
      "verify_btn": "बातमी तपासा",
      "live_alerts_title": "थेट आपत्ती सूचना",
      "emergency_contacts": "आणीबाणी संपर्क",
      "police": "पोलीस",
      "ambulance": "रुग्णवाहिका",
      "ndma_helpline": "NDMA हेल्पलाइन",
      "trending_fake_news": "ट्रेंडिंग खोट्या बातम्या",
      "safety_tips": "सुरक्षा टिप्स",
      "status_true": "सत्य",
      "status_false": "खोटी",
      "status_unverified": "अपूर्ण",
      "confidence": "खात्री स्कोर",
      "sources": "स्त्रोत",
      "report_fake": "खोट्या बातमीची तक्रार करा"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", 
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
