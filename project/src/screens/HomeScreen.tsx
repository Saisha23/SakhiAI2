import type { Language } from '../types';
import { getT } from '../utils/i18n';
import { SUPPORTED_LANGUAGES } from '../data/languages';

interface HomeScreenProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onStart: () => void;
}

function HomeScreen({ language, onLanguageChange, onStart }: HomeScreenProps) {
  const t = getT(language);

  return (
    <div className="screen home-screen">
      <div className="content">
        <div className="header-section">
          <div className="logo-container">
            <span className="flower-icon">🌸</span>
            <h1 className="app-title">{t.appTitle as string}</h1>
          </div>
          <p className="tagline">{t.tagline as string}</p>
          <span className="ai-badge">{t.aiPowered as string}</span>
        </div>

        <div className="language-section">
          <label className="section-label">{t.selectLanguage as string}</label>
          <div className="language-grid expanded">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                className={`language-btn ${language === lang.code ? 'active' : ''}`}
                onClick={() => onLanguageChange(lang.code)}
              >
                {lang.native}
              </button>
            ))}
          </div>
        </div>

        <button className="primary-btn start-btn" onClick={onStart}>
          {t.startHealthCheck as string}
        </button>

        <div className="disclaimer">
          <p>{t.disclaimer as string}</p>
        </div>
      </div>
    </div>
  );
}

export default HomeScreen;
