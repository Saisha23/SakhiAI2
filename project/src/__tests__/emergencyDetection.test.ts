import { describe, it, expect, beforeEach, vi } from 'vitest';
import { detectEmergency, getEmergencySeverity, getEmergencyMessage } from '../utils/emergencyDetection';

describe('Emergency Detection', () => {
  describe('detectEmergency', () => {
    it('should detect severe bleeding keyword', () => {
      expect(detectEmergency('I have severe bleeding')).toBe(true);
    });

    it('should detect chest pain keyword', () => {
      expect(detectEmergency('experiencing chest pain')).toBe(true);
    });

    it('should detect loss of consciousness', () => {
      expect(detectEmergency('loss of consciousness')).toBe(true);
    });

    it('should be case insensitive', () => {
      expect(detectEmergency('SEVERE BLEEDING')).toBe(true);
    });

    it('should return false for normal symptoms', () => {
      expect(detectEmergency('I have a headache')).toBe(false);
    });
  });

  describe('getEmergencySeverity', () => {
    it('should return critical for critical keywords', () => {
      expect(getEmergencySeverity('loss of consciousness')).toBe('critical');
      expect(getEmergencySeverity('severe bleeding')).toBe('critical');
      expect(getEmergencySeverity("can't breathe")).toBe('critical');
    });

    it('should return high for high-severity keywords', () => {
      expect(getEmergencySeverity('chest pain')).toBe('high');
      expect(getEmergencySeverity('pregnancy bleeding')).toBe('high');
    });

    it('should return high for Emergency risk level', () => {
      expect(getEmergencySeverity('', 'Emergency')).toBe('high');
    });

    it('should return low for normal text', () => {
      expect(getEmergencySeverity('headache')).toBe('low');
    });
  });

  describe('getEmergencyMessage', () => {
    it('should return English critical message by default', () => {
      const msg = getEmergencyMessage('en', 'critical');
      expect(msg).toContain('emergency services');
    });

    it('should return Hindi critical message', () => {
      const msg = getEmergencyMessage('hi', 'critical');
      expect(msg).toContain('आपातकाल');
    });

    it('should return Tamil high severity message', () => {
      const msg = getEmergencyMessage('ta', 'high');
      expect(msg).toContain('அவசரம்');
    });

    it('should return Bengali medium severity message', () => {
      const msg = getEmergencyMessage('bn', 'medium');
      expect(msg).toContain('সাবধানতা');
    });
  });
});
