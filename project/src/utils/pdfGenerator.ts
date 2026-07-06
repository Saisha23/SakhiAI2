import type { UserInput, Result, Language } from '../types';
import { translations } from '../data/translations';
import { bodyAreas } from '../data/symptoms';
import { resolveLanguage } from '../data/languages';

type TranslatedLang = 'en' | 'hi' | 'ta' | 'bn';

export function generatePDF(
  language: Language,
  userInput: UserInput,
  result: Result,
  filename: string = 'health-report.pdf'
) {
  const lang = resolveLanguage(language) as TranslatedLang;
  const selectedArea = bodyAreas.find(area => area.id === userInput.selectedBodyPart);
  const selectedSymptomObjects = selectedArea?.symptoms.filter(s =>
    userInput.selectedSymptoms.includes(s.id)
  ) || [];

  const htmlContent = generateHTMLContent(
    lang,
    userInput,
    result,
    selectedArea?.name || '',
    selectedSymptomObjects.map(s => s.name)
  );

  downloadAsHTML(htmlContent, filename);
}

function generateHTMLContent(
  language: TranslatedLang,
  userInput: UserInput,
  result: Result,
  areaName: string,
  symptomNames: string[]
): string {
  const t = translations[language];
  const urgencyLabel = {
    urgent: t.urgentCare as string,
    attention: t.needsAttention as string,
    normal: t.normalCare as string
  }[result.urgency];

  const timestamp = new Date().toLocaleString(language === 'en' ? 'en-US' : language === 'hi' ? 'hi-IN' : language === 'ta' ? 'ta-IN' : 'bn-IN');

  return `
<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.appTitle} - ${t.saveReport}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
      line-height: 1.6;
      color: #333;
      padding: 40px 20px;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 3px solid #E91E63;
      padding-bottom: 20px;
    }
    .app-title {
      font-size: 28px;
      font-weight: 700;
      color: #E91E63;
      margin-bottom: 5px;
    }
    .tagline {
      font-size: 14px;
      color: #666;
      margin-bottom: 10px;
    }
    .timestamp {
      font-size: 12px;
      color: #999;
    }
    .urgency-badge {
      display: inline-block;
      padding: 10px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 600;
      font-size: 14px;
      margin-top: 10px;
      ${
        result.urgency === 'urgent'
          ? 'background-color: #EF4444;'
          : result.urgency === 'attention'
            ? 'background-color: #F59E0B;'
            : 'background-color: #10B981;'
      }
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      font-size: 18px;
      font-weight: 700;
      color: #E91E63;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 2px solid #FFF5F7;
    }
    .section-content {
      font-size: 14px;
      line-height: 1.8;
      color: #555;
    }
    .list-item {
      margin-bottom: 8px;
      padding-left: 20px;
      position: relative;
    }
    .list-item:before {
      content: '✓';
      position: absolute;
      left: 0;
      color: #10B981;
      font-weight: bold;
    }
    .metrics {
      background: #FFF5F7;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .metric-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 14px;
    }
    .metric-label {
      font-weight: 600;
      color: #666;
    }
    .metric-value {
      font-weight: 700;
      color: #E91E63;
    }
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 20px;
    }
    .tag {
      display: inline-block;
      padding: 6px 12px;
      background: #F3E5F5;
      color: #6B3880;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
    }
    .pregnancy-alert {
      background: #FEF3C7;
      border-left: 4px solid #FBBF24;
      padding: 12px;
      margin-bottom: 20px;
      border-radius: 4px;
      font-size: 13px;
      color: #92400E;
    }
    .doctor-section {
      background: #FFF5F7;
      padding: 15px;
      border-left: 4px solid #E91E63;
      border-radius: 4px;
      margin-bottom: 20px;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #E5E7EB;
      font-size: 12px;
      color: #999;
    }
    @media print {
      body {
        padding: 0;
      }
      .container {
        max-width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="app-title">${t.appTitle}</div>
      <div class="tagline">${t.tagline}</div>
      <div class="timestamp">${timestamp}</div>
      <div class="urgency-badge">${urgencyLabel}</div>
    </div>

    <!-- Symptoms Summary -->
    <div class="section">
      <h2 class="section-title">${t.symptomsSummary}</h2>
      <div class="section-content">
        <strong>${t.selectedSymptoms}:</strong> ${symptomNames.join(', ') || 'N/A'}
        <div style="margin-top: 8px; color: #666;">
          <strong>${areaName || 'N/A'}</strong>
        </div>
      </div>
    </div>

    <!-- Metrics -->
    <div class="metrics">
      <div class="metric-row">
        <span class="metric-label">${t.riskScore}:</span>
        <span class="metric-value">${result.riskScore}/100</span>
      </div>
      <div class="metric-row">
        <span class="metric-label">${t.conditionTags}:</span>
        <span class="metric-value">${result.conditionTags.slice(0, 2).join(', ')}</span>
      </div>
    </div>

    <!-- Condition Tags -->
    ${
      result.conditionTags.length > 0
        ? `<div class="tags">${result.conditionTags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>`
        : ''
    }

    <!-- Pregnancy Alert -->
    ${
      userInput.isPregnant && result.hasPregnancyAlert
        ? `<div class="pregnancy-alert"><strong>${t.pregnancyAlert}:</strong> ${t.pregnancyWarning}</div>`
        : ''
    }

    <!-- Explanation -->
    <div class="section">
      <h2 class="section-title">${t.whyThisMatters}</h2>
      <div class="section-content">${result.explanation}</div>
    </div>

    <!-- Recommendations -->
    <div class="section">
      <h2 class="section-title">${t.recommendations}</h2>
      <div class="section-content">
        ${result.recommendations.map(rec => `<div class="list-item">${rec}</div>`).join('')}
      </div>
    </div>

    <!-- Doctor Advice (Highlighted) -->
    <div class="doctor-section">
      <strong>${t.whenToSeeDoctor}:</strong>
      <div style="margin-top: 8px;">${result.doctorAdvice}</div>
    </div>

    <!-- Preventive Screenings -->
    <div class="section">
      <h2 class="section-title">${t.screeningTitle}</h2>
      <div class="section-content">
        ${result.preventiveScreenings.map(screening => `<div class="list-item">${screening}</div>`).join('')}
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>${t.appTitle} - ${t.tagline}</p>
      <p style="margin-top: 10px; color: #666; font-size: 11px;">
        This report is for informational purposes only and should not replace professional medical advice. 
        Please consult with a healthcare provider for accurate diagnosis and treatment.
      </p>
    </div>
  </div>

  <script>
    // Auto-print on load
    window.onload = function() {
      window.print();
    };
  </script>
</body>
</html>
  `;
}

function downloadAsHTML(htmlContent: string, filename: string) {
  // Create a blob from the HTML content
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);

  // Create a temporary link element
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.replace('.pdf', '.html');

  // Append to body and click
  document.body.appendChild(link);
  link.click();

  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Alternative: If jsPDF is added to dependencies in the future
export function generatePDFWithJSPDF(
  _language: Language,
  _userInput: UserInput,
  _result: Result,
  _filename: string = 'health-report.pdf'
) {
  // This is a placeholder for when jsPDF is added
  // For now, we use the HTML approach above
  console.log('PDF generation with jsPDF would be implemented here');
}
