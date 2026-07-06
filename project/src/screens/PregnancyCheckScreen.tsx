import type { Language } from '../types';
import { getT } from '../utils/i18n';

interface PregnancyCheckScreenProps {
  language: Language;
  onSelect: (isPregnant: boolean) => void;
  onBack: () => void;
}

function PregnancyCheckScreen({ language, onSelect, onBack }: PregnancyCheckScreenProps) {
  const t = getT(language);

  return (
    <div className="screen pregnancy-screen">
      <div className="content">
        <button className="back-btn" onClick={onBack}>
          ← {t.backBtn as string}
        </button>

        <div className="question-section">
          <h2 className="question-title">{t.areYouPregnant as string}</h2>

          <div className="choice-buttons">
            <button
              className="choice-btn yes-btn"
              onClick={() => onSelect(true)}
            >
              <span className="choice-icon">✓</span>
              <span className="choice-text">{t.yes as string}</span>
            </button>

            <button
              className="choice-btn no-btn"
              onClick={() => onSelect(false)}
            >
              <span className="choice-icon">✗</span>
              <span className="choice-text">{t.no as string}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PregnancyCheckScreen;
