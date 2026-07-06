import type { BodyArea } from '../types';

export const bodyAreas: BodyArea[] = [
  {
    id: 'head',
    name: 'Head',
    symptoms: [
      { id: 'h1', name: 'Severe headache', severity: 'serious' },
      { id: 'h2', name: 'Dizziness', severity: 'moderate' },
      { id: 'h3', name: 'Vision problems', severity: 'serious' },
      { id: 'h4', name: 'Mild headache', severity: 'mild' },
      { id: 'h5', name: 'Fatigue', severity: 'mild' },
    ]
  },
  {
    id: 'chest',
    name: 'Chest',
    symptoms: [
      { id: 'c1', name: 'Chest pain', severity: 'serious' },
      { id: 'c2', name: 'Breathing difficulty', severity: 'serious' },
      { id: 'c3', name: 'Breast lump', severity: 'serious' },
      { id: 'c4', name: 'Breast tenderness', severity: 'moderate' },
      { id: 'c5', name: 'Mild cough', severity: 'mild' },
    ]
  },
  {
    id: 'abdomen',
    name: 'Abdomen',
    symptoms: [
      { id: 'a1', name: 'Severe abdominal pain', severity: 'serious' },
      { id: 'a2', name: 'Bloating', severity: 'mild' },
      { id: 'a3', name: 'Nausea/Vomiting', severity: 'moderate' },
      { id: 'a4', name: 'Constipation', severity: 'mild' },
      { id: 'a5', name: 'Blood in stool', severity: 'serious' },
    ]
  },
  {
    id: 'pelvis',
    name: 'Pelvis',
    symptoms: [
      { id: 'p1', name: 'Heavy bleeding', severity: 'serious' },
      { id: 'p2', name: 'Irregular periods', severity: 'moderate' },
      { id: 'p3', name: 'Pelvic pain', severity: 'serious' },
      { id: 'p4', name: 'Vaginal discharge (unusual)', severity: 'moderate' },
      { id: 'p5', name: 'Painful urination', severity: 'moderate' },
      { id: 'p6', name: 'Missed period', severity: 'moderate' },
    ]
  },
  {
    id: 'legs',
    name: 'Legs',
    symptoms: [
      { id: 'l1', name: 'Swelling', severity: 'moderate' },
      { id: 'l2', name: 'Pain/Cramping', severity: 'moderate' },
      { id: 'l3', name: 'Numbness', severity: 'serious' },
      { id: 'l4', name: 'Varicose veins', severity: 'mild' },
      { id: 'l5', name: 'Unable to walk', severity: 'serious' },
    ]
  },
  {
    id: 'skin',
    name: 'Skin',
    symptoms: [
      { id: 's1', name: 'New mole/growth', severity: 'serious' },
      { id: 's2', name: 'Rash', severity: 'moderate' },
      { id: 's3', name: 'Itching', severity: 'mild' },
      { id: 's4', name: 'Unusual bruising', severity: 'moderate' },
      { id: 's5', name: 'Dry skin', severity: 'mild' },
    ]
  },
];
