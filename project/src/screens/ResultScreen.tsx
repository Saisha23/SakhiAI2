import type { Language, UserInput, Result, AIAnalysisResult } from '../types';
import { getT } from '../utils/i18n';
import { generateResult } from '../utils/resultEngine';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { detectEmergency, getEmergencySeverity } from '../utils/emergencyDetection';
import EmergencyBanner from '../components/EmergencyBanner';
import ChatPanel from '../components/ChatPanel';
import AIChat from '../components/AIChat';
import '../components/AIComponents.css';


interface ResultScreenProps {
  language: Language;
  userInput: UserInput;
  aiResult: AIAnalysisResult | null;
  usedFallback: boolean;
  onStartOver: () => void;
  onDownloadReport?: () => void;
  onLocateNearestClinic?: () => void;
}

function mapUrgency(urgency: string): 'urgent' | 'attention' | 'normal' {
  if (urgency === 'urgent') return 'urgent';
  if (urgency === 'attention') return 'attention';
  return 'normal';
}

function aiToResult(ai: AIAnalysisResult): Result {
  return {
    urgency: mapUrgency(ai.urgency),
    explanation: ai.explanation,
    recommendations: ai.recommendations,
    doctorAdvice: ai.doctor_advice,
    preventiveScreenings: ai.preventive_screenings,
    riskScore: ai.risk_score,
    conditionTags: ai.condition_tags,
    hasPregnancyAlert: ai.has_pregnancy_alert,
  };
}

function ResultScreen({
  language,
  userInput,
  aiResult,
  usedFallback,
  onStartOver,
  onDownloadReport,
  onLocateNearestClinic
}: ResultScreenProps) {
  const t = getT(language);
  const ruleResult = generateResult(userInput, language === 'auto' ? 'en' : language);
  const result: Result = aiResult ? aiToResult(aiResult) : ruleResult;
  
  // Emergency detection - check both AI result and text analysis
  const emergencyText = aiResult?.report || userInput.naturalLanguageInput || userInput.additionalNotes || '';
  const isEmergencyKeyword = detectEmergency(emergencyText);
  const isEmergencyRisk = result.urgency === 'urgent' || aiResult?.emergency;
  const shouldShowEmergency = isEmergencyKeyword || isEmergencyRisk;

  const { speak, stop, isSpeaking, isSupported: ttsSupported } = useTextToSpeech(language);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return '#EF4444';
      case 'attention': return '#F59E0B';
      case 'normal': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return t.urgentCare as string;
      case 'attention': return t.needsAttention as string;
      case 'normal': return t.normalCare as string;
      default: return '';
    }
  };

  const getRiskLevel = (score: number) => {
    if (score >= 70) return t.riskHigh as string;
    if (score >= 40) return t.riskModerate as string;
    return t.riskLow as string;
  };

  const reportText = [
    result.explanation,
    ...result.recommendations,
    result.doctorAdvice,
  ].join('. ');

  const handleListen = () => {
    if (isSpeaking) stop();
    else speak(reportText);
  };

  return (
    <div className="screen result-screen">
      <div className="content">
        {shouldShowEmergency && (
          <EmergencyBanner
            language={language}
            isVisible={true}
            riskLevel={result.urgency === 'urgent' ? 'Emergency' : 'High'}
            onLocateClinic={onLocateNearestClinic}
          />
        )}

        {usedFallback && (
          <div className="fallback-notice">{t.fallbackNotice as string}</div>
        )}

        {aiResult && (
          <div className="ai-badge result-ai-badge">{t.aiPowered as string}</div>
        )}

        <div className="result-header">
          <div
            className="urgency-badge"
            style={{ backgroundColor: getUrgencyColor(result.urgency) }}
          >
            {getUrgencyLabel(result.urgency)}
          </div>
        </div>

        <div className="result-metrics">
          <div className="metric-card">
            <div className="metric-label">{t.riskScore as string}</div>
            <div className="metric-bar">
              <div
                className="metric-progress"
                style={{
                  width: `${result.riskScore}%`,
                  backgroundColor: getUrgencyColor(result.urgency)
                }}
              />
            </div>
            <div className="metric-value">
              {result.riskScore}/100 - {aiResult?.risk_level || getRiskLevel(result.riskScore)}
            </div>
          </div>
        </div>

        {result.conditionTags.length > 0 && (
          <div className="tags-container">
            {result.conditionTags.map((tag, index) => (
              <span key={index} className="condition-tag">{tag}</span>
            ))}
          </div>
        )}

        {aiResult && aiResult.symptoms.length > 0 && (
          <section className="result-section report-card">
            <h3 className="section-title">{t.selectedSymptoms as string}</h3>
            <ul className="recommendation-list">
              {aiResult.symptoms.map((s, i) => (
                <li key={i} className="recommendation-item">{s}</li>
              ))}
            </ul>
          </section>
        )}

        {aiResult && aiResult.possible_conditions.length > 0 && (
          <section className="result-section report-card">
            <h3 className="section-title">{t.possibleConditions as string}</h3>
            <ul className="recommendation-list">
              {aiResult.possible_conditions.map((c, i) => (
                <li key={i} className="recommendation-item">{c}</li>
              ))}
            </ul>
          </section>
        )}

        {result.hasPregnancyAlert && (
          <div className="pregnancy-alert">
            <div className="alert-icon">⚠️</div>
            <div className="alert-content">
              <div className="alert-title">{t.pregnancyAlert as string}</div>
              <div className="alert-text">{t.pregnancyWarning as string}</div>
            </div>
          </div>
        )}

        <div className="result-sections">
          <section className="result-section report-card">
            <h3 className="section-title">{t.whyThisMatters as string}</h3>
            <p className="section-text">{result.explanation}</p>
          </section>

          <section className="result-section report-card">
            <h3 className="section-title">{t.recommendations as string}</h3>
            <ul className="recommendation-list">
              {result.recommendations.map((rec, index) => (
                <li key={index} className="recommendation-item">{rec}</li>
              ))}
            </ul>
          </section>

          <section className="result-section doctor-section report-card">
            <h3 className="section-title">{t.whenToSeeDoctor as string}</h3>
            <p className="section-text doctor-advice">{result.doctorAdvice}</p>
          </section>

          <section className="result-section report-card">
            <h3 className="section-title">{t.preventiveScreenings as string}</h3>
            <ul className="recommendation-list">
              {result.preventiveScreenings.map((screening, index) => (
                <li key={index} className="recommendation-item">{screening}</li>
              ))}
            </ul>
          </section>
        </div>

        {ttsSupported && (
          <button className="secondary-btn listen-btn" onClick={handleListen} type="button">
            {isSpeaking ? (t.stopListening as string) : (t.listenToReport as string)} 🔊
          </button>
        )}

        <ChatPanel
          language={language}
          pregnant={!!userInput.isPregnant}
          contextSummary={result.explanation.slice(0, 120)}
        />

        <AIChat
          language={language}
          pregnant={!!userInput.isPregnant}
          contextSummary={`Risk Level: ${result.urgency}`}
        />

        <div className="action-buttons">
          <button className="secondary-btn try-again-btn" onClick={onStartOver}>
            {t.tryAgain as string}
          </button>
          <button className="secondary-btn download-btn" onClick={onDownloadReport}>
            {t.downloadReport as string}
          </button>
          {(shouldShowEmergency || result.urgency === 'urgent' || (result.riskScore && result.riskScore > 60)) && (
            <button className="secondary-btn clinic-btn" onClick={onLocateNearestClinic}>
              {t.locateNearestClinic as string}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResultScreen;
