import type { Language } from '../types';
import { getEmergencySeverity, getEmergencyMessage } from '../utils/emergencyDetection';
import { resolveLanguage } from '../data/languages';

interface EmergencyBannerProps {
  language: Language;
  isVisible: boolean;
  riskLevel?: string;
  onLocateClinic?: () => void;
}

export default function EmergencyBanner({
  language,
  isVisible,
  riskLevel,
  onLocateClinic,
}: EmergencyBannerProps) {
  if (!isVisible) return null;

  const lang = resolveLanguage(language);
  const severity = getEmergencySeverity('', riskLevel);
  const message = getEmergencyMessage(lang, severity);

  const getSeverityColor = (sev: 'critical' | 'high' | 'medium' | 'low'): string => {
    switch (sev) {
      case 'critical':
        return '#DC2626';
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      default:
        return '#3B82F6';
    }
  };

  const getIcon = (sev: 'critical' | 'high' | 'medium' | 'low'): string => {
    switch (sev) {
      case 'critical':
        return '🚨';
      case 'high':
        return '⚠️';
      case 'medium':
        return '⚡';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div
      className="emergency-banner"
      style={{
        backgroundColor: getSeverityColor(severity),
        borderLeft: `4px solid ${getSeverityColor(severity)}`,
      }}
      role="alert"
    >
      <div className="emergency-banner-content">
        <span className="emergency-icon" style={{ fontSize: '24px', marginRight: '12px' }}>
          {getIcon(severity)}
        </span>
        <div className="emergency-message">
          <strong>{message}</strong>
        </div>
      </div>
      {onLocateClinic && (
        <button
          className="emergency-action-btn"
          onClick={onLocateClinic}
          type="button"
        >
          📍 Locate Clinic
        </button>
      )}
    </div>
  );
}

