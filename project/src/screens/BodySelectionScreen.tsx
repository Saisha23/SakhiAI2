import type { Language, BodyPart } from '../types';
import { getT, tStr } from '../utils/i18n';

interface BodySelectionScreenProps {
  language: Language;
  onSelect: (bodyPart: BodyPart) => void;
  onBack: () => void;
}

function BodySelectionScreen({ language, onSelect, onBack }: BodySelectionScreenProps) {
  const t = getT(language);

  const bodyParts: { id: BodyPart; labelKey: string; top: string; left: string }[] = [
    { id: 'head', labelKey: 'head', top: '8%', left: '50%' },
    { id: 'chest', labelKey: 'chest', top: '25%', left: '50%' },
    { id: 'abdomen', labelKey: 'abdomen', top: '40%', left: '50%' },
    { id: 'pelvis', labelKey: 'pelvis', top: '52%', left: '50%' },
    { id: 'legs', labelKey: 'legs', top: '75%', left: '50%' },
    { id: 'skin', labelKey: 'skin', top: '92%', left: '50%' },
  ];

  return (
    <div className="screen body-selection-screen">
      <div className="content">
        <button className="back-btn" onClick={onBack}>
          ← {t.backBtn as string}
        </button>

        <div className="question-section">
          <h2 className="question-title">{t.selectBodyPart as string}</h2>
          <p className="subtitle">{t.tapTheArea as string}</p>

          <div className="body-diagram-container">
            <svg viewBox="0 0 200 400" className="body-diagram">
              <ellipse cx="100" cy="35" rx="25" ry="30" fill="#FFE4E4" stroke="#E8B4D4" strokeWidth="2" />
              <rect x="75" y="60" width="50" height="40" rx="10" fill="#FFE4E4" stroke="#E8B4D4" strokeWidth="2" />
              <rect x="70" y="95" width="60" height="50" rx="10" fill="#FFE4E4" stroke="#E8B4D4" strokeWidth="2" />
              <rect x="75" y="140" width="50" height="35" rx="10" fill="#FFE4E4" stroke="#E8B4D4" strokeWidth="2" />
              <rect x="70" y="170" width="25" height="130" rx="8" fill="#FFE4E4" stroke="#E8B4D4" strokeWidth="2" />
              <rect x="105" y="170" width="25" height="130" rx="8" fill="#FFE4E4" stroke="#E8B4D4" strokeWidth="2" />
              <circle cx="50" cy="380" r="15" fill="#E8B4D4" opacity="0.3" />
            </svg>

            {bodyParts.map((part) => (
              <button
                key={part.id}
                className="body-part-btn"
                style={{ top: part.top, left: part.left }}
                onClick={() => onSelect(part.id)}
              >
                {tStr(t, part.labelKey, part.labelKey)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BodySelectionScreen;
