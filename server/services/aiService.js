/**
 * AI Service
 * Centralized AI service with graceful fallbacks
 * AI must enhance experience, not block system
 */

import axios from 'axios';

export class AIService {
  /**
   * Get Gemini API configuration
   */
  static getGeminiConfig() {
    return {
      key: process.env.GEMINI_API_KEY,
      url: process.env.GEMINI_API_URL,
    };
  }

  /**
   * Call Gemini API with error handling
   */
  static async callGeminiAPI(prompt, options = {}) {
    const { key, url } = this.getGeminiConfig();
    const { timeout = 15000, retries = 1 } = options;

    if (!key || !url) {
      throw new Error('AI service not configured');
    }

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await axios.post(`${url}?key=${key}`, { prompt }, { timeout });

        // Extract text from various response formats
        let text = '';
        if (response.data) {
          if (response.data.candidates && response.data.candidates.length) {
            text = response.data.candidates[0].content || '';
          } else if (response.data.output && response.data.output[0] && response.data.output[0].content) {
            text = response.data.output[0].content;
          } else if (response.data.outputs && response.data.outputs.length && response.data.outputs[0].content) {
            text = response.data.outputs[0].content[0]?.text || response.data.outputs[0].content;
          } else if (typeof response.data === 'string') {
            text = response.data;
          } else {
            text = JSON.stringify(response.data);
          }
        }

        return text || '';
      } catch (err) {
        if (attempt === retries) {
          console.error('Gemini API request failed:', err.message || err);
          throw new Error('AI service temporarily unavailable');
        }
        // Wait before retry
        await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }

  /**
   * Feature 1: Enhanced Smart Symptom Checker
   * Returns: Possible conditions, risk level, suggested tests
   */
  static async smartSymptomChecker(symptoms, patientAge, patientGender, patientHistory = null) {
    const symptomText = Array.isArray(symptoms) ? symptoms.join(', ') : String(symptoms || '');
    
    // Build history context
    let historyContext = '';
    if (patientHistory) {
      const recentConditions = patientHistory.diagnoses?.slice(0, 5).map(d => d.condition).join(', ') || '';
      const recentMedications = patientHistory.prescriptions?.slice(0, 5)
        .flatMap(p => p.medications.map(m => m.name)).join(', ') || '';
      
      historyContext = `\n\nPatient Medical History:
- Recent Conditions: ${recentConditions || 'None'}
- Recent Medications: ${recentMedications || 'None'}
- Total Appointments: ${patientHistory.appointments || 0}`;
    }

    const prompt = `As a medical AI assistant, analyze these symptoms and provide a structured response:

Patient Information:
- Symptoms: ${symptomText}
- Age: ${patientAge || 'unknown'}
- Gender: ${patientGender || 'unknown'}${historyContext}

Please provide:
1. Top 3-5 possible conditions with ICD codes (if available)
2. Risk level assessment (Low/Medium/High/Critical)
3. Suggested diagnostic tests
4. Immediate recommendations

Format your response clearly with sections for each.`;

    try {
      const aiResponse = await this.callGeminiAPI(prompt);
      
      // Parse AI response (basic parsing - can be enhanced)
      return {
        success: true,
        conditions: this.parseConditions(aiResponse),
        riskLevel: this.parseRiskLevel(aiResponse),
        suggestedTests: this.parseSuggestedTests(aiResponse),
        recommendations: this.parseRecommendations(aiResponse),
        rawResponse: aiResponse,
        disclaimer: 'AI suggestions are for reference only. Clinical judgment and patient examination are required for diagnosis.',
      };
    } catch (error) {
      // Fallback to rule-based analysis
      return this.fallbackSymptomChecker(symptomText, patientAge, patientGender, patientHistory);
    }
  }

  /**
   * Feature 2: Enhanced Prescription Explanation
   * Includes: Simple explanation, lifestyle recommendations, preventive advice, Urdu mode
   */
  static async prescriptionExplanation(prescription, language = 'english') {
    const medicationsList = prescription.medications
      .map((med) => `${med.name} (${med.dosage}, ${med.frequency}, ${med.duration})`)
      .join(', ');

    const languageInstruction = language === 'urdu' 
      ? 'Please respond in Urdu (Roman Urdu or Urdu script).'
      : 'Please respond in English.';

    const prompt = `As a medical AI assistant, explain this prescription in simple, patient-friendly ${language === 'urdu' ? 'Urdu' : 'English'}:

Prescription Details:
- Condition: ${prescription.diagnosisId?.condition || 'Not specified'}
- Medications: ${medicationsList}
- Instructions: ${prescription.instructions}
- Duration: ${prescription.medications[0]?.duration || 'As prescribed'}

Please provide:
1. What each medication does (in simple terms)
2. Why it was prescribed
3. Important things to remember when taking it
4. Potential side effects to watch for
5. When to contact the doctor
6. Lifestyle recommendations (diet, exercise, rest, etc.)
7. Preventive advice to avoid recurrence

${languageInstruction}

Keep the explanation clear, concise, and easy to understand for a patient.`;

    try {
      const aiResponse = await this.callGeminiAPI(prompt);
      
      return {
        success: true,
        explanation: aiResponse,
        language,
        generatedAt: new Date(),
      };
    } catch (error) {
      // Fallback explanation
      return {
        success: false,
        explanation: this.fallbackPrescriptionExplanation(prescription, language),
        language,
        generatedAt: new Date(),
        note: 'AI service temporarily unavailable. Showing basic explanation.',
      };
    }
  }

  /**
   * Feature 3: Risk Flagging System
   * Detects: Repeated infection patterns, chronic symptoms
   */
  static async analyzeRiskFlags(patientId, diagnoses, prescriptions, appointments) {
    const flags = [];
    const conditionFrequency = {};
    const symptomPatterns = {};
    const timeWindow = 90; // days
    const now = new Date();
    const cutoffDate = new Date(now.getTime() - timeWindow * 24 * 60 * 60 * 1000);

    // Analyze diagnoses for repeated patterns
    const recentDiagnoses = diagnoses.filter(d => new Date(d.createdAt) >= cutoffDate);
    
    recentDiagnoses.forEach(diagnosis => {
      const condition = diagnosis.condition.toLowerCase();
      conditionFrequency[condition] = (conditionFrequency[condition] || 0) + 1;
      
      // Extract symptoms from description
      const symptoms = this.extractSymptoms(diagnosis.description);
      symptoms.forEach(symptom => {
        symptomPatterns[symptom] = (symptomPatterns[symptom] || 0) + 1;
      });
    });

    // Flag 1: Repeated Infections (same condition 3+ times in 90 days)
    Object.entries(conditionFrequency).forEach(([condition, count]) => {
      if (count >= 3) {
        flags.push({
          type: 'repeated_infection',
          severity: count >= 5 ? 'high' : 'medium',
          message: `Patient has been diagnosed with "${condition}" ${count} times in the last ${timeWindow} days. Consider further investigation.`,
          condition,
          frequency: count,
          recommendation: 'Consider specialist referral or comprehensive diagnostic workup.',
        });
      }
    });

    // Flag 2: Chronic Symptoms (same symptom pattern 4+ times)
    Object.entries(symptomPatterns).forEach(([symptom, count]) => {
      if (count >= 4) {
        flags.push({
          type: 'chronic_symptom',
          severity: count >= 6 ? 'high' : 'medium',
          message: `Recurring symptom pattern detected: "${symptom}" appears ${count} times in recent diagnoses.`,
          symptom,
          frequency: count,
          recommendation: 'Consider chronic condition evaluation and long-term management plan.',
        });
      }
    });

    // Flag 3: High Frequency Visits (5+ appointments in 90 days)
    const recentAppointments = appointments.filter(a => new Date(a.startTime) >= cutoffDate);
    if (recentAppointments.length >= 5) {
      flags.push({
        type: 'high_frequency_visits',
        severity: recentAppointments.length >= 8 ? 'high' : 'medium',
        message: `Patient has ${recentAppointments.length} appointments in the last ${timeWindow} days.`,
        visitCount: recentAppointments.length,
        recommendation: 'Review overall health status and consider comprehensive health assessment.',
      });
    }

    // Flag 4: Multiple Prescriptions (5+ active prescriptions)
    const activePrescriptions = prescriptions.filter(p => p.status === 'active');
    if (activePrescriptions.length >= 5) {
      flags.push({
        type: 'multiple_prescriptions',
        severity: 'medium',
        message: `Patient has ${activePrescriptions.length} active prescriptions.`,
        prescriptionCount: activePrescriptions.length,
        recommendation: 'Review medication interactions and consider medication reconciliation.',
      });
    }

    // Use AI to analyze patterns if available
    if (flags.length > 0) {
      try {
        const aiAnalysis = await this.getAIRiskAnalysis(flags, recentDiagnoses);
        return {
          flags,
          aiAnalysis,
          summary: this.generateRiskSummary(flags),
        };
      } catch (error) {
        // Return flags even if AI analysis fails
        return {
          flags,
          aiAnalysis: null,
          summary: this.generateRiskSummary(flags),
        };
      }
    }

    return {
      flags: [],
      aiAnalysis: null,
      summary: 'No significant risk patterns detected.',
    };
  }

  /**
   * Get AI analysis for risk flags
   */
  static async getAIRiskAnalysis(flags, diagnoses) {
    const flagSummary = flags.map(f => `${f.type}: ${f.message}`).join('\n');
    const recentConditions = diagnoses.slice(0, 10).map(d => d.condition).join(', ');

    const prompt = `As a medical AI assistant, analyze these patient risk flags:

Risk Flags Detected:
${flagSummary}

Recent Diagnoses:
${recentConditions || 'None'}

Provide:
1. Overall risk assessment
2. Potential underlying causes
3. Recommended actions
4. Priority level

Keep response concise and actionable.`;

    try {
      const aiResponse = await this.callGeminiAPI(prompt);
      return {
        assessment: aiResponse,
        generatedAt: new Date(),
      };
    } catch (error) {
      return null;
    }
  }

  // Helper methods for parsing AI responses
  static parseConditions(text) {
    // Basic parsing - can be enhanced with better NLP
    const conditions = [];
    const lines = text.split('\n');
    
    for (const line of lines) {
      if (line.toLowerCase().includes('condition') || line.match(/^\d+\./)) {
        conditions.push(line.trim());
      }
    }
    
    return conditions.slice(0, 5);
  }

  static parseRiskLevel(text) {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('critical') || lowerText.includes('emergency')) return 'Critical';
    if (lowerText.includes('high risk') || lowerText.includes('severe')) return 'High';
    if (lowerText.includes('medium') || lowerText.includes('moderate')) return 'Medium';
    if (lowerText.includes('low')) return 'Low';
    return 'Medium'; // Default
  }

  static parseSuggestedTests(text) {
    const tests = [];
    const lines = text.split('\n');
    
    for (const line of lines) {
      if (line.toLowerCase().includes('test') || line.toLowerCase().includes('lab')) {
        tests.push(line.trim());
      }
    }
    
    return tests.slice(0, 5);
  }

  static parseRecommendations(text) {
    const recommendations = [];
    const lines = text.split('\n');
    
    for (const line of lines) {
      if (line.toLowerCase().includes('recommend') || line.match(/^[-•]/)) {
        recommendations.push(line.trim());
      }
    }
    
    return recommendations.slice(0, 5);
  }

  static extractSymptoms(description) {
    // Basic symptom extraction - can be enhanced
    const commonSymptoms = [
      'fever', 'cough', 'pain', 'headache', 'nausea', 'vomiting', 'diarrhea',
      'fatigue', 'dizziness', 'shortness of breath', 'chest pain', 'abdominal pain',
    ];
    
    const lowerDesc = description.toLowerCase();
    return commonSymptoms.filter(symptom => lowerDesc.includes(symptom));
  }

  static generateRiskSummary(flags) {
    if (flags.length === 0) return 'No significant risk patterns detected.';
    
    const highSeverity = flags.filter(f => f.severity === 'high').length;
    const mediumSeverity = flags.filter(f => f.severity === 'medium').length;
    
    if (highSeverity > 0) {
      return `⚠️ ${highSeverity} high-priority risk flag(s) detected. Immediate attention recommended.`;
    }
    if (mediumSeverity > 0) {
      return `⚠️ ${mediumSeverity} medium-priority risk flag(s) detected. Review recommended.`;
    }
    
    return `${flags.length} risk flag(s) detected.`;
  }

  // Fallback methods
  static fallbackSymptomChecker(symptomText, patientAge, patientGender, patientHistory) {
    const lowerSymptoms = symptomText.toLowerCase();
    
    // Basic rule-based analysis
    const conditions = [];
    const suggestedTests = [];
    let riskLevel = 'Low';

    if (lowerSymptoms.includes('fever') && lowerSymptoms.includes('cough')) {
      conditions.push({ condition: 'Upper Respiratory Infection', icdCode: 'J00', confidence: '65%' });
      suggestedTests.push('Complete Blood Count (CBC)', 'Chest X-ray if persistent');
      riskLevel = 'Medium';
    }

    if (lowerSymptoms.includes('chest pain')) {
      conditions.push({ condition: 'Chest Pain - Requires Evaluation', icdCode: 'R06.02', confidence: 'N/A' });
      suggestedTests.push('ECG', 'Troponin levels', 'Chest X-ray');
      riskLevel = 'High';
    }

    if (lowerSymptoms.includes('abdominal pain')) {
      conditions.push({ condition: 'Abdominal Pain', icdCode: 'R10.9', confidence: '50%' });
      suggestedTests.push('Complete Blood Count', 'Abdominal Ultrasound');
      riskLevel = 'Medium';
    }

    // Default fallback
    if (conditions.length === 0) {
      conditions.push({ condition: 'Symptom Evaluation Needed', icdCode: 'N/A', confidence: 'N/A' });
      suggestedTests.push('Physical Examination', 'Basic Blood Work');
    }

    return {
      success: false,
      conditions,
      riskLevel,
      suggestedTests,
      recommendations: ['Physical examination required', 'Monitor symptoms', 'Follow up if symptoms worsen'],
      disclaimer: 'AI suggestions are for reference only. Clinical judgment and patient examination are required for diagnosis.',
    };
  }

  static fallbackPrescriptionExplanation(prescription, language) {
    const meds = prescription.medications.map((med) => med.name).join(', ');
    
    if (language === 'urdu') {
      return `یہ نسخہ مندرجہ ذیل ادویات پر مشتمل ہے: ${meds}۔

براہ کرم اپنے ڈاکٹر کی دی گئی ہدایات پر عمل کریں:
- ${prescription.instructions}

اہم یاد دہانیاں:
- ادویات تجویز کردہ طریقے سے لیں
- مکمل کورس مکمل کریں جب تک کہ دوسری صورت میں مشورہ نہ دیا جائے
- اگر آپ کو کوئی غیر معمولی ضمنی اثرات محسوس ہوں تو اپنے ڈاکٹر سے رابطہ کریں
- تمام ادویات بچوں کی پہنچ سے دور رکھیں

اگر آپ کے نسخے کے بارے میں کوئی سوالات ہیں تو براہ کرم اپنے ہیلتھ کیئر فراہم کنندہ سے رابطہ کریں۔`;
    }

    return `This prescription includes the following medications: ${meds}.

Please follow the instructions provided by your doctor:
- ${prescription.instructions}

Important reminders:
- Take medications as prescribed
- Complete the full course unless advised otherwise
- Contact your doctor if you experience any unusual side effects
- Keep all medications out of reach of children

Lifestyle Recommendations:
- Maintain a balanced diet
- Stay hydrated
- Get adequate rest
- Follow up with your doctor as scheduled

Preventive Advice:
- Practice good hygiene
- Follow preventive measures as advised
- Monitor your symptoms
- Report any concerns promptly

If you have questions about your prescription, please contact your healthcare provider.`;
  }
}

