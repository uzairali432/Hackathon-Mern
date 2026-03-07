import { useState } from 'react';
import { useAddDiagnosisMutation } from "../../services/doctorApi";
import { AlertCircle, FileText, CheckCircle2, ChevronDown, Activity, AlignLeft, BrainCircuit, NotepadText } from 'lucide-react';

export default function DiagnosisForm({ appointmentId, patientId, onSuccess }) {
  const [addDiagnosis] = useAddDiagnosisMutation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    condition: '',
    severity: 'mild',
    description: '',
    aiSuggestion: '',
    notes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await addDiagnosis({
        appointmentId,
        patientId,
        ...formData,
      }).unwrap();

      // Reset form
      setFormData({
        condition: '',
        severity: 'mild',
        description: '',
        aiSuggestion: '',
        notes: '',
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      onSuccess?.();
    } catch (err) {
      setError(err.data?.message || 'Failed to securely save diagnosis record.');
    } finally {
      setLoading(false);
    }
  };

  const severityOptions = [
    { value: 'mild', label: 'Mild - No immediate risk', color: 'text-emerald-700', bg: 'bg-emerald-50' },
    { value: 'moderate', label: 'Moderate - Requires monitoring', color: 'text-amber-700', bg: 'bg-amber-50' },
    { value: 'severe', label: 'Severe - Significant impairment', color: 'text-orange-700', bg: 'bg-orange-50' },
    { value: 'critical', label: 'Critical - Immediate action required', color: 'text-red-700', bg: 'bg-red-50' },
  ];

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E9ECEF] p-6 sm:p-8 relative overflow-hidden">
      {/* Decorative header accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#2E86AB] to-[#1A5F7A]"></div>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[#E8F4F8] flex items-center justify-center border border-[#2E86AB]/20 shadow-sm">
          <FileText className="text-[#2E86AB] w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-[#212529]">Clinical Assessment</h3>
          <p className="text-sm text-[#6C757D] font-medium">Document ICD-10 compatible conditions</p>
        </div>
      </div>

      {error && (
        <div className="flex gap-3 p-4 mb-6 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm animate-in fade-in slide-in-from-top-2">
          <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex gap-3 p-4 mb-6 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" />
          <p className="font-medium">Diagnosis record securely saved to patient chart.</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Linked Encounter (readonly) */}
        <div>
          <label className="block text-xs font-bold text-[#495057] uppercase tracking-wider mb-2">Linked Encounter ID</label>
          <div className="relative">
            <input
              type="text"
              value={appointmentId}
              disabled
              className="w-full px-4 py-3 border border-[#E9ECEF] rounded-xl bg-[#F8F9FA] text-[#6C757D] font-mono text-sm cursor-not-allowed"
            />
            <div className="absolute right-3 top-3 px-2 py-0.5 bg-[#E9ECEF] text-[#495057] text-[10px] font-bold uppercase tracking-wider rounded">Auto-Linked</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Condition */}
          <div className="md:col-span-1">
            <label className="block text-xs font-bold text-[#495057] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#2E86AB]" />
              Primary Condition <span className="text-[#DC3545] text-lg leading-none">*</span>
            </label>
            <input
              type="text"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              placeholder="e.g. Essential Hypertension"
              required
              className="w-full px-4 py-3 border border-[#DEE2E6] rounded-xl text-[#212529] focus:outline-none focus:ring-2 focus:ring-[#2E86AB]/20 focus:border-[#2E86AB] transition-colors font-medium placeholder:font-normal placeholder:text-[#A0AEC0]"
            />
          </div>

          {/* Severity */}
          <div className="md:col-span-1">
            <label className="block text-xs font-bold text-[#495057] uppercase tracking-wider mb-2">Acuity / Severity</label>
            <div className="relative">
              <select
                name="severity"
                value={formData.severity}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#DEE2E6] rounded-xl text-[#212529] bg-white focus:outline-none focus:ring-2 focus:ring-[#2E86AB]/20 focus:border-[#2E86AB] transition-colors font-medium appearance-none cursor-pointer"
              >
                {severityOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#6C757D]">
                <ChevronDown size={18} />
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-[#495057] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <AlignLeft className="w-3.5 h-3.5 text-[#2E86AB]" />
            Clinical Findings <span className="text-[#DC3545] text-lg leading-none">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Document patient's history of present illness (HPI), symptoms, and objective findings..."
            required
            rows="4"
            className="w-full px-4 py-3 border border-[#DEE2E6] rounded-xl text-[#212529] focus:outline-none focus:ring-2 focus:ring-[#2E86AB]/20 focus:border-[#2E86AB] transition-colors resize-y min-h-[100px] placeholder:text-[#A0AEC0]"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold text-[#495057] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <NotepadText className="w-3.5 h-3.5 text-[#6C757D]" />
            Internal Notes <span className="text-[#A0AEC0] font-normal lowercase tracking-normal">(Optional)</span>
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Additional context not visible to patient..."
            rows="2"
            className="w-full px-4 py-3 border border-[#DEE2E6] rounded-xl text-[#212529] bg-[#F8F9FA] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2E86AB]/20 focus:border-[#2E86AB] transition-colors resize-y placeholder:text-[#A0AEC0]"
          />
        </div>

        {/* AI Suggestion */}
        <div className="bg-[#E0F4F1]/40 border border-[#00A896]/30 rounded-xl p-4">
          <label className="block text-xs font-bold text-[#00A896] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <BrainCircuit className="w-4 h-4" />
            AI Diagnostic Insights <span className="text-[#00A896]/60 font-normal lowercase tracking-normal">(Optional context)</span>
          </label>
          <textarea
            name="aiSuggestion"
            value={formData.aiSuggestion}
            onChange={handleChange}
            placeholder="Paste or type relevant AI-assisted diagnostic suggestions here..."
            rows="2"
            className="w-full px-4 py-3 border border-[#00A896]/20 rounded-lg text-[#212529] bg-white focus:outline-none focus:ring-2 focus:ring-[#00A896]/30 focus:border-[#00A896] transition-colors resize-y placeholder:text-[#00A896]/40"
          />
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-[#E9ECEF] flex flex-col sm:flex-row justify-end gap-3">
        <button
          type="button"
          onClick={() => {
            setFormData({ condition: '', severity: 'mild', description: '', aiSuggestion: '', notes: '' });
          }}
          disabled={loading}
          className="px-6 py-2.5 rounded-xl text-sm font-bold text-[#6C757D] bg-white border border-[#DEE2E6] hover:bg-[#F8F9FA] hover:text-[#495057] transition-all disabled:opacity-50"
        >
          Clear Fields
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-2.5 bg-[#2E86AB] text-white rounded-xl text-sm font-bold shadow-sm hover:bg-[#1A5F7A] hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Saving Record...</span>
            </>
          ) : (
            <>
              <CheckCircle2 size={18} />
              <span>Sign & Save Diagnosis</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
