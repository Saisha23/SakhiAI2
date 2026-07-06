import type { Language } from '../types';

/** Multilingual healthcare terminology dictionary */
export const symptomDictionary: Record<string, Partial<Record<Language, string>>> = {
  fever: {
    en: 'Fever', hi: 'बुखार', bn: 'জ্বর', ta: 'காய்ச்சல்', te: 'జ్వరం',
    mr: 'ताप', gu: 'તાવ', kn: 'ಜ್ವರ', ml: 'പനി', pa: 'ਬੁਖਾਰ', or: 'ଜ୍ୱର', ur: 'بukhār',
  },
  headache: {
    en: 'Headache', hi: 'सिरदर्द', bn: 'মাথাব্যথা', ta: 'தலைவலி', te: 'తలనొప్పి',
    mr: 'डोकेदुखी', gu: 'માથાનો દુખાવો', kn: 'ತಲೆನೋವು', ml: 'തലവേദന', pa: 'ਸਿਰ ਦਰਦ',
  },
  abdominal_pain: {
    en: 'Abdominal pain', hi: 'पेट दर्द', bn: 'পেটে ব্যথা', ta: 'வயிற்று வலி', te: 'బద్దకం నొప్పి',
    mr: 'पोटदुखी', gu: 'પેટમાં દુઃખાવો', kn: 'ಹೊಟ್ಟೆನೋವು', ml: 'വയറുവേദന', pa: 'ਪੇਟ ਦਰਦ',
  },
  bleeding: {
    en: 'Bleeding', hi: 'खून बहना', bn: 'রক্তপাত', ta: 'இரத்தப்போக்கு', te: 'రక్తస్రావం',
    mr: 'रक्तस्त्राव', gu: 'રક્તસ્રાવ', kn: 'ರಕ್ತಸ್ರಾವ', ml: 'രക്തസ്രാവം', pa: 'ਖੂਨ',
  },
  nausea: {
    en: 'Nausea', hi: 'मतली', bn: 'বমি বমি ভাব', ta: 'வாந்தி', te: 'వాకరింపు',
    mr: 'मळ मळ', gu: 'મચકોડ', kn: 'ವಾಕರಿಕೆ', ml: 'ഛരദി', pa: 'ਜੀ ਮਿਚਲਾਨਾ',
  },
  fatigue: {
    en: 'Fatigue', hi: 'थकान', bn: 'ক্লান্তি', ta: 'சோர்வு', te: ' అలసట',
    mr: 'थकवा', gu: 'થાક', kn: ' ಆಯಸ್ಸು', ml: 'ക്ഷീണം', pa: 'थकान',
  },
  dizziness: {
    en: 'Dizziness', hi: 'चक्कर आना', bn: 'মাথা ঘোরা', ta: 'தலைச்சுற்றல்', te: 'తలతిరగడం',
    mr: 'गiddy', gu: 'ચક્કર', kn: 'ತಲೆತಿರುಗುವಿಕೆ', ml: 'തലകറക്കം', pa: 'ਚਕਰ ਆਉਣਾ',
  },
  chest_pain: {
    en: 'Chest pain', hi: 'सीने में दर्द', bn: 'বুকে ব্যথা', ta: 'மார்பு வலி', te: 'ఛాతీ నొప్పి',
    mr: 'छातीत दुख', gu: 'છાતીમાં દુઃખાવો', kn: 'ಎದೆನೋವು', ml: 'നെഞ്ചുവേദന', pa: 'ਸੀਨੇ ਵਿੱਚ ਦਰਦ',
  },
  shortness_of_breath: {
    en: 'Shortness of breath', hi: 'सांस लेने में तकलीफ', bn: 'শ্বাসকষ্ট', ta: 'மூச்சுத்திணறல்', te: 'ఊపిరి తక్కువ',
    mr: 'श्वास लागणे', gu: 'શ્વાસ લેવામાં તકલીફ', kn: 'ಉಸಿರಾಟದ ತೊಂದರೆ', ml: 'ശ്വാസതടസ്സം', pa: 'ਸਾਹ ਲੈਣ ਵਿੱਚ ਤਕਲੀਫ',
  },
  irregular_periods: {
    en: 'Irregular periods', hi: 'अनियमित माहवारी', bn: 'অনিয়মিত মাসিক', ta: 'ஒழுங்கற்ற மாதவிடாய்', te: 'అనియమిత పీరియడ్స్',
    mr: 'अनियमित मासिक पाळी', gu: 'અનિયમિત માસિક', kn: ' ಅನಿಯಮಿತ ಮುಟ್ಟು', ml: 'അനിയമിത ആർത്തവം', pa: 'ਅਨਿਯਮਿਤ ਮਾਹਵਾਰੀ',
  },
};

export function getSymptomTerm(key: string, lang: Language): string {
  const entry = symptomDictionary[key];
  if (!entry) return key;
  const resolved = lang === 'auto' ? 'en' : lang;
  return entry[resolved] || entry.en || key;
}

export const symptomExamples: Partial<Record<Language, string[]>> = {
  en: [
    'I have had fever and body ache for 3 days',
    'Heavy bleeding during periods with severe pain',
    'Feeling dizzy and blurred vision while pregnant',
  ],
  hi: [
    '3 दिन से बुखार और शरीर में दर्द है',
    'माहवारी में भारी खून बह रहा है',
    'गर्भावस्था में चक्कर और धुंधला दिखना',
  ],
  ta: [
    '3 நாட்களாக காய்ச்சல் மற்றும் உடல் வலி',
    'மாதவிடாயில் அதிக இரத்தப்போக்கு',
    'கர்ப்பத்தில் தலைச்சுற்றல்',
  ],
  bn: [
    '৩ দিন ধরে জ্বর ও শরীরে ব্যথা',
    'মাসিকে প্রচুর রক্তপাত',
    'গর্ভাবস্থায় মাথা ঘোরা',
  ],
};

export function getExamples(lang: Language): string[] {
  const resolved = lang === 'auto' ? 'en' : lang;
  return symptomExamples[resolved] || symptomExamples.en || [];
}
