import { useState } from 'react';
import type { Language, BodyPart } from '../types';
import { getT } from '../utils/i18n';
import { bodyAreas } from '../data/symptoms';
import { getSymptomName } from '../data/symptomTranslations';
import { getExamples } from '../data/symptomDictionary';
import VoiceInputButton from '../components/VoiceInputButton';

interface SymptomSelectionScreenProps {
  language: Language;
  bodyPart: BodyPart;
  selectedSymptoms: string[];
  additionalNotes: string;
  naturalLanguageInput: string;
  isPregnant: boolean | null;
  onSymptomsChange: (symptoms: string[]) => void;
  onNotesChange: (notes: string) => void;
  onNaturalLanguageChange: (text: string) => void;
  onContinue: () => void;
  onBack: () => void;
}

function SymptomSelectionScreen({
  language,
  bodyPart,
  selectedSymptoms,
  additionalNotes,
  naturalLanguageInput,
  isPregnant,
  onSymptomsChange,
  onNotesChange,
  onNaturalLanguageChange,
  onContinue,
  onBack
}: SymptomSelectionScreenProps) {
  const t = getT(language);
  const area = bodyAreas.find(a => a.id === bodyPart);
  const examples = getExamples(language);
  const [showExamples, setShowExamples] = useState(false);

  const toggleSymptom = (symptomId: string) => {
    if (selectedSymptoms.includes(symptomId)) {
      onSymptomsChange(selectedSymptoms.filter(id => id !== symptomId));
    } else {
      onSymptomsChange([...selectedSymptoms, symptomId]);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'serious': return '#EF4444';
      case 'moderate': return '#F59E0B';
      case 'mild': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'serious': return '🔴';
      case 'moderate': return '🟡';
      case 'mild': return '🟢';
      default: return '⚪';
    }
  };

  const hasInput = selectedSymptoms.length > 0 || naturalLanguageInput.trim().length > 0;

  return (
    <div className="screen symptom-selection-screen">
      <div className="content">
        <button className="back-btn" onClick={onBack}>
          ← {t.backBtn as string}
        </button>

        <div className="question-section">
          <h2 className="question-title">{t.selectSymptoms as string}</h2>
          <p className="subtitle">{t.areaLabel as string}: {area ? (t[area.id as keyof typeof t] as string) || area.name : ''}</p>

          {/* Natural Language Symptom Analysis */}
          <div className="nl-section">
            <h3 className="nl-title">{t.nlSectionTitle as string}</h3>
            <p className="nl-subtitle">{t.describeYourSymptoms as string}</p>
            <div className="nl-input-row">
              <textarea
                className="notes-input nl-input"
                value={naturalLanguageInput}
                onChange={(e) => onNaturalLanguageChange(e.target.value)}
                placeholder={t.describeSymptoms as string}
                rows={3}
              />
              <VoiceInputButton
                language={language}
                label={t.voiceInput as string}
                onTranscript={(text) => onNaturalLanguageChange(naturalLanguageInput ? `${naturalLanguageInput} ${text}` : text)}
              />
            </div>
            <button className="text-btn examples-toggle" type="button" onClick={() => setShowExamples(!showExamples)}>
              {t.nlExamples as string} ▾
            </button>
            {showExamples && (
              <ul className="examples-list">
                {examples.map((ex, i) => (
                  <li key={i}>
                    <button type="button" className="example-btn" onClick={() => onNaturalLanguageChange(ex)}>
                      "{ex}"
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="divider"><span>{t.selectSymptoms as string}</span></div>

          <div className="symptoms-list">
            {area?.symptoms.map(symptom => (
              <button
                key={symptom.id}
                className={`symptom-btn ${selectedSymptoms.includes(symptom.id) ? 'selected' : ''}`}
                onClick={() => toggleSymptom(symptom.id)}
                style={{
                  borderColor: selectedSymptoms.includes(symptom.id)
                    ? getSeverityColor(symptom.severity)
                    : '#E5E7EB'
                }}
              >
                <span className="symptom-icon">{getSeverityIcon(symptom.severity)}</span>
                <span className="symptom-name">{getSymptomName(symptom.id, language === 'auto' ? 'en' : language)}</span>
                {selectedSymptoms.includes(symptom.id) && (
                  <span className="check-icon">✓</span>
                )}
              </button>
            ))}
          </div>

          <div className="notes-section">
            <label className="section-label">{t.additionalNotes as string}</label>
            <textarea
              className="notes-input"
              value={additionalNotes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder={t.describeSymptoms as string}
              rows={3}
            />
          </div>

          {isPregnant && (
            <div className="pregnancy-alert-card">
              <div className="alert-icon">⚠️</div>
              <div>
                <div className="alert-title">{t.pregnancyAlert as string}</div>
                <div className="alert-text">{t.pregnancyWarning as string}</div>
              </div>
            </div>
          )}

          <button
            className="primary-btn continue-btn"
            onClick={onContinue}
            disabled={!hasInput}
          >
            {t.getResults as string}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SymptomSelectionScreen;
