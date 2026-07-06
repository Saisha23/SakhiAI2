export const EMERGENCY_KEYWORDS = [
  'severe bleeding',
  'heavy bleeding',
  'chest pain',
  'loss of consciousness',
  'pregnancy bleeding',
  'severe abdominal pain',
  'breathing difficulty',
  'difficulty breathing',
  'can\'t breathe',
  'unconscious',
  'unresponsive',
  'blackout',
  'syncope',
];

export function detectEmergency(text: string): boolean {
  const lowerText = text.toLowerCase();
  return EMERGENCY_KEYWORDS.some((keyword) => lowerText.includes(keyword));
}

export function getEmergencySeverity(text: string, riskLevel?: string): 'critical' | 'high' | 'medium' | 'low' {
  const lowerText = text.toLowerCase();

  // Critical keywords
  const criticalKeywords = [
    'loss of consciousness',
    'unconscious',
    'can\'t breathe',
    'severe bleeding',
    'heavy bleeding',
  ];
  if (criticalKeywords.some((kw) => lowerText.includes(kw))) {
    return 'critical';
  }

  // High keywords
  const highKeywords = [
    'chest pain',
    'severe abdominal pain',
    'breathing difficulty',
    'pregnancy bleeding',
  ];
  if (highKeywords.some((kw) => lowerText.includes(kw))) {
    return 'high';
  }

  // Check risk level
  if (riskLevel === 'Emergency' || riskLevel === 'High') {
    return 'high';
  }

  return 'medium';
}

export function getEmergencyMessage(language: string, severity: 'critical' | 'high' | 'medium' | 'low'): string {
  const messages: Record<string, Record<string, string>> = {
    en: {
      critical: 'EMERGENCY: Call emergency services immediately. Seek immediate medical attention.',
      high: 'WARNING: Seek immediate medical attention. Visit the nearest emergency room or clinic.',
      medium: 'CAUTION: Medical attention is recommended soon.',
      low: 'Please monitor your symptoms and consult a healthcare provider.',
    },
    hi: {
      critical: 'आपातकाल: तुरंत आपातकालीन सेवाओं को कॉल करें।',
      high: 'चेतावनी: तुरंत चिकित्सा सहायता लें। नजदीकी अस्पताल जाएं।',
      medium: 'सावधानी: जल्द ही चिकित्सा ध्यान दिया जाना अनुशंसित है।',
      low: 'अपने लक्षणों की निगरानी करें और स्वास्थ्य सेवा प्रदाता से सलाह लें।',
    },
    ta: {
      critical: 'அவசரம்: உடனடியாக அவசர சேவைகளை அழைக்கவும்.',
      high: 'எச்சரிக்கை: உடனடி மருத்துவ உதவி பெறுங்கள். அருகிலுள்ள ஆஸ்பத்திரியை பார்க்கவும்.',
      medium: 'எச்சரிக்கை: விரைவில் மருத்துவ கவனம் பரிந்துரைக்கப்படுகிறது.',
      low: 'உங்கள் அறிகுறிகளை கவனிக்கவும் மற்றும் சுகாதார வழங்குனரை ஆலோசிக்கவும்.',
    },
    bn: {
      critical: 'জরুরি: অবিলম্বে জরুরি সেবা কল করুন।',
      high: 'সতর্কতা: অবিলম্বে চিকিৎসা নিন। নিকটতম হাসপাতালে যান।',
      medium: 'সাবধানতা: শীঘ্রই চিকিৎসা পরামর্শ প্রয়োজন।',
      low: 'আপনার উপসর্গ পর্যবেক্ষণ করুন এবং স্বাস্থ্য সেবা প্রদানকারীর পরামর্শ নিন।',
    },
  };

  const langMessages = messages[language] || messages.en;
  return langMessages[severity] || langMessages.low;
}
