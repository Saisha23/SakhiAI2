import { useState } from 'react';
import type { UserInput, Language, AIAnalysisResult } from './types';
import HomeScreen from './screens/HomeScreen';
import PregnancyCheckScreen from './screens/PregnancyCheckScreen';
import BodySelectionScreen from './screens/BodySelectionScreen';
import SymptomSelectionScreen from './screens/SymptomSelectionScreen';
import ResultScreen from './screens/ResultScreen';
import AILoadingIndicator from './components/AILoadingIndicator';
import { generateResult } from './utils/resultEngine';
import { generatePDF } from './utils/pdfGenerator';
import { useAnalyzeSymptoms } from './hooks/useAnalyzeSymptoms';
import { getSymptomName } from './data/symptomTranslations';
import { getT } from './utils/i18n';
import './App.css';

type Screen = 'home' | 'pregnancy' | 'body' | 'symptoms' | 'analyzing' | 'result';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [userInput, setUserInput] = useState<UserInput>({
    language: 'auto',
    isPregnant: null,
    selectedBodyPart: null,
    selectedSymptoms: [],
    additionalNotes: '',
    naturalLanguageInput: '',
  });
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const [usedFallback, setUsedFallback] = useState(false);
  const { analyze, loading: analyzeLoading, error: analyzeError } = useAnalyzeSymptoms();

  const updateInput = (updates: Partial<UserInput>) => {
    setUserInput(prev => ({ ...prev, ...updates }));
  };

  const goToScreen = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const resetApp = () => {
    setUserInput({
      language: userInput.language,
      isPregnant: null,
      selectedBodyPart: null,
      selectedSymptoms: [],
      additionalNotes: '',
      naturalLanguageInput: '',
    });
    setAiResult(null);
    setUsedFallback(false);
    setCurrentScreen('home');
  };

  const buildAnalysisText = (): string => {
    const parts: string[] = [];
    if (userInput.naturalLanguageInput?.trim()) {
      parts.push(userInput.naturalLanguageInput.trim());
    }
    if (userInput.selectedSymptoms.length > 0) {
      const lang = userInput.language === 'auto' ? 'en' : userInput.language;
      const names = userInput.selectedSymptoms.map(id => getSymptomName(id, lang));
      parts.push(`Selected symptoms: ${names.join(', ')}`);
    }
    if (userInput.additionalNotes?.trim()) {
      parts.push(userInput.additionalNotes.trim());
    }
    if (userInput.selectedBodyPart) {
      parts.push(`Body area: ${userInput.selectedBodyPart}`);
    }
    return parts.join('. ');
  };

  const handleAnalyze = async () => {
    goToScreen('analyzing');
    const text = buildAnalysisText();

    try {
      const result = await analyze({
        text,
        language: userInput.language,
        pregnant: !!userInput.isPregnant,
        selectedSymptoms: userInput.selectedSymptoms,
        bodyPart: userInput.selectedBodyPart,
      });
      setAiResult(result);
      setUsedFallback(false);
    } catch {
      setAiResult(null);
      setUsedFallback(true);
    }
    goToScreen('result');
  };

  const handleDownloadReport = () => {
    const lang = userInput.language === 'auto' ? 'en' : userInput.language;
    const result = aiResult
      ? {
          urgency: (aiResult.urgency === 'urgent' ? 'urgent' : aiResult.urgency === 'attention' ? 'attention' : 'normal') as 'urgent' | 'attention' | 'normal',
          explanation: aiResult.explanation,
          recommendations: aiResult.recommendations,
          doctorAdvice: aiResult.doctor_advice,
          preventiveScreenings: aiResult.preventive_screenings,
          riskScore: aiResult.risk_score,
          conditionTags: aiResult.condition_tags,
          hasPregnancyAlert: aiResult.has_pregnancy_alert,
        }
      : generateResult(userInput, lang);
    const timestamp = new Date().toISOString().slice(0, 10);
    generatePDF(lang, userInput, result, `SakhiAI-Report-${timestamp}.html`);
  };

  const handleLocateNearestClinic = () => {
    window.open('https://www.google.com/maps/search/nearest+clinic/', '_blank', 'noopener,noreferrer');
  };

  const t = getT(userInput.language);

  return (
    <div className="app">
      {currentScreen === 'home' && (
        <HomeScreen
          language={userInput.language}
          onLanguageChange={(lang: Language) => updateInput({ language: lang })}
          onStart={() => goToScreen('pregnancy')}
        />
      )}
      {currentScreen === 'pregnancy' && (
        <PregnancyCheckScreen
          language={userInput.language === 'auto' ? 'en' : userInput.language}
          onSelect={(isPregnant: boolean) => {
            updateInput({ isPregnant });
            goToScreen('body');
          }}
          onBack={() => goToScreen('home')}
        />
      )}
      {currentScreen === 'body' && (
        <BodySelectionScreen
          language={userInput.language === 'auto' ? 'en' : userInput.language}
          onSelect={(bodyPart) => {
            updateInput({ selectedBodyPart: bodyPart });
            goToScreen('symptoms');
          }}
          onBack={() => goToScreen('pregnancy')}
        />
      )}
      {currentScreen === 'symptoms' && (
        <SymptomSelectionScreen
          language={userInput.language}
          bodyPart={userInput.selectedBodyPart!}
          selectedSymptoms={userInput.selectedSymptoms}
          additionalNotes={userInput.additionalNotes}
          naturalLanguageInput={userInput.naturalLanguageInput || ''}
          isPregnant={userInput.isPregnant}
          onSymptomsChange={(symptoms) => updateInput({ selectedSymptoms: symptoms })}
          onNotesChange={(notes) => updateInput({ additionalNotes: notes })}
          onNaturalLanguageChange={(text) => updateInput({ naturalLanguageInput: text })}
          onContinue={handleAnalyze}
          onBack={() => goToScreen('body')}
        />
      )}
      {currentScreen === 'analyzing' && (
        <div className="screen analyzing-screen">
          <AILoadingIndicator message={t.aiAnalyzing as string} />
        </div>
      )}
      {currentScreen === 'result' && (
        <ResultScreen
          language={userInput.language}
          userInput={userInput}
          aiResult={aiResult}
          usedFallback={usedFallback}
          onStartOver={resetApp}
          onDownloadReport={handleDownloadReport}
          onLocateNearestClinic={handleLocateNearestClinic}
        />
      )}
    </div>
  );
}

export default App;
