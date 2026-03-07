import { useState } from 'react';
import { useWritePrescriptionMutation } from "../../services/doctorApi";
import { AlertCircle, Plus, X, Pill, CheckCircle2, FlaskConical, Clock, CalendarIcon, Info, NotebookText, RefreshCw } from 'lucide-react';

export default function PrescriptionForm({ patientId, diagnosisId, onSuccess }) {
  const [writePrescription] = useWritePrescriptionMutation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [medications, setMedications] = useState([
    {
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: '',
    },
  ]);

  const [formData, setFormData] = useState({
    instructions: '',
    refillsAllowed: 0,
  });

  const handleMedicationChange = (index, field, value) => {
    const newMeds = [...medications];
    newMeds[index][field] = value;
    setMedications(newMeds);
  };

  const addMedication = () => {
    setMedications([
      ...medications,
      {
        name: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
      },
    ]);
  };

  const removeMedication = (index) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'refillsAllowed' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validate medications
    if (medications.some((m) => !m.name || !m.dosage || !m.frequency || !m.duration)) {
      setError('All mandatory medication fields (Name, Dosage, Frequency, Duration) are required.');
      return;
    }

    setLoading(true);

    try {
      await writePrescription({
        diagnosisId,
        patientId,
        medications,
        instructions: formData.instructions,
        refillsAllowed: formData.refillsAllowed,
      }).unwrap();

      // Reset form
      setMedications([
        {
          name: '',
          dosage: '',
          frequency: '',
          duration: '',
          instructions: '',
        },
      ]);
      setFormData({ instructions: '', refillsAllowed: 0 });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      onSuccess?.();
    } catch (err) {
      setError(err.data?.message || 'Failed to securely transmit e-prescription.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E9ECEF] p-6 sm:p-8 relative overflow-hidden">
      {/* Decorative header accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00A896] to-[#02C39A]"></div>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[#E0F4F1] flex items-center justify-center border border-[#00A896]/20 shadow-sm">
          <Pill className="text-[#00A896] w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-[#212529]">Electronic Prescription (eRx)</h3>
          <p className="text-sm text-[#6C757D] font-medium">Secure medication prescribing module</p>
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
          <p className="font-medium">e-Prescription securely signed and transmitted to patient profile.</p>
        </div>
      )}

      {/* Linked Diagnosis ID (readonly) */}
      {diagnosisId && (
        <div className="mb-6">
           <label className="block text-xs font-bold text-[#495057] uppercase tracking-wider mb-2">Linked Diagnosis ID</label>
           <div className="relative">
             <input
               type="text"
               value={diagnosisId}
               disabled
               className="w-full px-4 py-3 border border-[#E9ECEF] rounded-xl bg-[#F8F9FA] text-[#6C757D] font-mono text-sm cursor-not-allowed"
             />
             <div className="absolute right-3 top-3 px-2 py-0.5 bg-[#E0F4F1] text-[#00A896] text-[10px] font-bold uppercase tracking-wider rounded border border-[#00A896]/20">Linked</div>
           </div>
        </div>
      )}

      <div className="space-y-8">
        
        {/* Medications Section */}
        <div>
          <div className="flex items-center justify-between mb-4 border-b border-[#E9ECEF] pb-3">
            <h4 className="font-bold text-[#212529] flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-[#00A896]" /> Prescribed Medications
            </h4>
            <button
              type="button"
              onClick={addMedication}
              className="group flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#00A896] bg-[#E0F4F1] border border-[#00A896]/20 rounded-lg hover:bg-[#00A896] hover:text-white transition-all"
            >
              <Plus size={14} className="transition-transform group-hover:rotate-90" /> Add Medication
            </button>
          </div>

          <div className="space-y-6">
            {medications.map((med, index) => (
              <div key={index} className="relative bg-[#F8F9FA] border border-[#E9ECEF] hover:border-[#CED4DA] rounded-xl p-5 transition-colors">
                
                <div className="absolute top-4 right-4 flex items-center gap-2">
                   <div className="px-2.5 py-1 bg-white border border-[#DEE2E6] text-[#495057] text-[10px] font-bold uppercase tracking-wider rounded-md">
                     Med #{index + 1}
                   </div>
                   {medications.length > 1 && (
                     <button
                       type="button"
                       onClick={() => removeMedication(index)}
                       className="p-1.5 text-[#DC3545] bg-white border border-red-100 rounded-md hover:bg-red-50 hover:border-red-200 transition-colors"
                       aria-label="Remove medication"
                     >
                       <X size={14} />
                     </button>
                   )}
                </div>

                <div className="space-y-5 mt-2">
                  {/* Medication Name */}
                  <div className="pr-20">
                    <label className="block text-xs font-bold text-[#495057] uppercase tracking-wider mb-2">
                      Primary Drug Name <span className="text-[#DC3545] text-lg leading-none">*</span>
                    </label>
                    <input
                      type="text"
                      value={med.name}
                      onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                      placeholder="e.g. Lisinopril, Metformin Hydrochloride"
                      className="w-full px-4 py-3 border border-[#DEE2E6] rounded-xl text-[#212529] focus:outline-none focus:ring-2 focus:ring-[#00A896]/20 focus:border-[#00A896] transition-colors font-medium placeholder:font-normal placeholder:text-[#A0AEC0]"
                    />
                  </div>

                  {/* Grid for dosage, frequency, duration */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-[#495057] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <FlaskConical className="w-3.5 h-3.5 text-[#6C757D]" /> Dosage <span className="text-[#DC3545] text-lg leading-none">*</span>
                      </label>
                      <input
                        type="text"
                        value={med.dosage}
                        onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                        placeholder="e.g. 500mg, 1 Tablet"
                        className="w-full px-4 py-2.5 border border-[#DEE2E6] rounded-xl text-[#212529] focus:outline-none focus:ring-2 focus:ring-[#00A896]/20 focus:border-[#00A896] transition-colors placeholder:text-[#A0AEC0] text-sm font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#495057] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#6C757D]" /> Frequency <span className="text-[#DC3545] text-lg leading-none">*</span>
                      </label>
                      <input
                        type="text"
                        value={med.frequency}
                        onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                        placeholder="e.g. PO BID, Twice daily"
                        className="w-full px-4 py-2.5 border border-[#DEE2E6] rounded-xl text-[#212529] focus:outline-none focus:ring-2 focus:ring-[#00A896]/20 focus:border-[#00A896] transition-colors placeholder:text-[#A0AEC0] text-sm font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#495057] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <CalendarIcon className="w-3.5 h-3.5 text-[#6C757D]" /> Duration <span className="text-[#DC3545] text-lg leading-none">*</span>
                      </label>
                      <input
                        type="text"
                        value={med.duration}
                        onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                        placeholder="e.g. 7 days, 1 month"
                        className="w-full px-4 py-2.5 border border-[#DEE2E6] rounded-xl text-[#212529] focus:outline-none focus:ring-2 focus:ring-[#00A896]/20 focus:border-[#00A896] transition-colors placeholder:text-[#A0AEC0] text-sm font-medium"
                      />
                    </div>
                  </div>

                  {/* Specific Instructions */}
                  <div>
                    <label className="block text-xs font-bold text-[#495057] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-[#6C757D]" /> Specific Instructions <span className="text-[#A0AEC0] font-normal lowercase tracking-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                     value={med.instructions}
                      onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
                      placeholder="e.g. Take with food, swallow whole, do not crush"
                      className="w-full px-4 py-2.5 border border-[#DEE2E6] rounded-xl text-[#212529] bg-white focus:outline-none focus:ring-2 focus:ring-[#00A896]/20 focus:border-[#00A896] transition-colors placeholder:text-[#A0AEC0] text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6 bg-[#F8F9FA] border border-[#E9ECEF] p-5 rounded-xl">
           {/* General Instructions */}
           <div>
             <label className="block text-xs font-bold text-[#495057] uppercase tracking-wider mb-2 flex items-center gap-1.5">
               <NotebookText className="w-3.5 h-3.5 text-[#2E86AB]" />
               General Patient Instructions <span className="text-[#DC3545] text-lg leading-none">*</span>
             </label>
             <textarea
               name="instructions"
               value={formData.instructions}
               onChange={handleChange}
               placeholder="General guidelines for the patient regarding this prescription block (e.g. diet restrictions, follow-up advice)..."
               required
               rows="3"
               className="w-full px-4 py-3 border border-[#DEE2E6] rounded-xl text-[#212529] bg-white focus:outline-none focus:ring-2 focus:ring-[#2E86AB]/20 focus:border-[#2E86AB] transition-colors resize-y placeholder:text-[#A0AEC0] text-sm"
             />
           </div>

           {/* Refills */}
           <div>
             <label className="block text-xs font-bold text-[#495057] uppercase tracking-wider mb-2 flex items-center gap-1.5">
               <RefreshCw className="w-3.5 h-3.5 text-[#00A896]" /> Refills Authorized
             </label>
             <input
               type="number"
               name="refillsAllowed"
               value={formData.refillsAllowed}
               onChange={handleChange}
               min="0"
               max="12"
               className="w-full px-4 py-3 border border-[#DEE2E6] rounded-xl text-[#212529] bg-white focus:outline-none focus:ring-2 focus:ring-[#00A896]/20 focus:border-[#00A896] transition-colors font-bold text-center text-lg"
             />
             <p className="text-[10px] text-[#6C757D] font-semibold mt-1.5 text-center uppercase tracking-wide">Enter 0 for no refills</p>
           </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-[#E9ECEF] flex flex-col sm:flex-row justify-end gap-3">
        <button
          type="button"
          onClick={() => {
            setMedications([{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
            setFormData({ instructions: '', refillsAllowed: 0 });
          }}
          disabled={loading}
          className="px-6 py-2.5 rounded-xl text-sm font-bold text-[#6C757D] bg-white border border-[#DEE2E6] hover:bg-[#F8F9FA] hover:text-[#495057] transition-all disabled:opacity-50"
        >
          Clear Script
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-2.5 bg-[#00A896] text-white rounded-xl text-sm font-bold shadow-sm hover:bg-[#02C39A] hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Transmitting eRx...</span>
            </>
          ) : (
            <>
              <CheckCircle2 size={18} />
              <span>Sign & Transmit eRx</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
