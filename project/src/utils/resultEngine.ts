import type { UserInput, Result, Language } from '../types';
import { bodyAreas } from '../data/symptoms';
import { translations } from '../data/translations';
import { getSymptomName } from '../data/symptomTranslations';
import { resolveLanguage } from '../data/languages';

type TranslatedLang = 'en' | 'hi' | 'ta' | 'bn';

function asStringArray(val: unknown): string[] {
  return Array.isArray(val) ? val as string[] : [];
}

function asString(val: unknown): string {
  return typeof val === 'string' ? val : '';
}

export function generateResult(input: UserInput, language: Language): Result {
  const lang = resolveLanguage(language) as TranslatedLang;
  const t = translations[lang];
  const selectedArea = bodyAreas.find(area => area.id === input.selectedBodyPart);
  const selectedSymptomObjects = selectedArea?.symptoms.filter(s =>
    input.selectedSymptoms.includes(s.id)
  ) || [];

  const hasSeriousSymptom = selectedSymptomObjects.some(s => s.severity === 'serious');
  const hasModerateSymptom = selectedSymptomObjects.some(s => s.severity === 'moderate');

  let urgency: 'urgent' | 'attention' | 'normal' = 'normal';
  if (hasSeriousSymptom) {
    urgency = 'urgent';
  } else if (hasModerateSymptom) {
    urgency = 'attention';
  }

  const riskScore = calculateRiskScore(selectedSymptomObjects, input.isPregnant);
  const conditionTags = generateConditionTags(selectedArea, selectedSymptomObjects, urgency, lang);
  const hasPregnancyAlert = !!input.isPregnant && urgency !== 'normal';
  const symptomNames = selectedSymptomObjects.map(s => getSymptomName(s.id, lang)).join(', ');

  const explanations = {
    urgent: `${asString(t.urgentExplanation)} (${symptomNames})`,
    attention: `${asString(t.attentionExplanation)} (${symptomNames})`,
    normal: `${asString(t.normalExplanation)} (${symptomNames})`
  };

  const recommendationsByUrgency = {
    urgent: asStringArray(t.urgentRecommendations),
    attention: asStringArray(t.attentionRecommendations),
    normal: asStringArray(t.normalRecommendations)
  };

  const doctorAdviceByUrgency = {
    urgent: asString(t.urgentDoctorAdvice),
    attention: asString(t.attentionDoctorAdvice),
    normal: asString(t.normalDoctorAdvice)
  };

  const preventiveScreenings = asString(t.generalScreenings)
    .split(',')
    .map((item: string) => item.trim())
    .filter((item: string) => item.length > 0);

  if (input.isPregnant) {
    preventiveScreenings.unshift(
      ...asString(t.pregnancyScreenings)
        .split(',')
        .map((item: string) => item.trim())
        .filter((item: string) => item.length > 0)
    );
  }

  return {
    urgency,
    explanation: explanations[urgency],
    recommendations: recommendationsByUrgency[urgency],
    doctorAdvice: doctorAdviceByUrgency[urgency],
    preventiveScreenings,
    riskScore,
    conditionTags,
    hasPregnancyAlert
  };
}

function calculateRiskScore(symptoms: typeof bodyAreas[0]['symptoms'], isPregnant: boolean | null): number {
  let score = 0;
  const seriousCount = symptoms.filter(s => s.severity === 'serious').length;
  const moderateCount = symptoms.filter(s => s.severity === 'moderate').length;

  score += seriousCount * 30;
  score += moderateCount * 15;

  if (isPregnant && seriousCount > 0) {
    score = Math.min(100, score + 15);
  }

  return Math.min(100, score);
}

function generateConditionTags(
  area: typeof bodyAreas[0] | undefined,
  symptoms: typeof bodyAreas[0]['symptoms'],
  urgency: string,
  language: TranslatedLang
): string[] {
  const t = translations[language];
  const tags: string[] = [];

  if (!area) return tags;

  tags.push(`${asString(t[area.id as keyof typeof t]) || area.name} ${asString(t.relatedTagSuffix)}`);

  if (urgency === 'urgent') {
    tags.push(asString(t.highPriority));
  } else if (urgency === 'attention') {
    tags.push(asString(t.moderatePriority));
  } else {
    tags.push(asString(t.lowPriority));
  }

  if (symptoms.some(s => s.severity === 'serious')) {
    tags.push(asString(t.seriousSymptomsTag));
  }
  if (symptoms.some(s => s.severity === 'moderate')) {
    tags.push(asString(t.moderateSymptomsTag));
  }

  return tags;
}
