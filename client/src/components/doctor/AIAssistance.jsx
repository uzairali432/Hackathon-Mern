import { useState } from 'react';
import { Lightbulb, AlertCircle, Search, FileText, Activity, BrainCircuit, HeartPulse, ShieldCheck, ChevronRight } from 'lucide-react';
import axios from 'axios';

export default function AIAssistance({ patientId = null }) {
  const [symptoms, setSymptoms] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState('');
  const [patientIdInput, setPatientIdInput] = useState(patientId || '');
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGetSuggestions = async (e) => {
    e.preventDefault();
    setError('');
    // setSuggestions(null); // Keep previous to prevent jarring jump

    if (!symptoms.trim()) {
      setError('Please enter clear clinical symptoms for analysis.');
      return;
    }

    setLoading(true);

    try {
      const symptomsArray = symptoms
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s);

      const token = localStorage.getItem('accessToken');
      const response = await axios.post(
        'http://localhost:5000/api/v1/doctors/ai-assistance',
        {
          symptoms: symptomsArray,
          patientAge: patientAge || null,
          patientGender: patientGender || null,
          patientId: patientIdInput || null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuggestions(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to connect to MedConnect AI services.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E9ECEF] p-6 sm:p-8 relative overflow-hidden shadow-sm">
      {/* Decorative header accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00A896] to-[#02C39A]"></div>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[#E0F4F1] flex items-center justify-center border border-[#00A896]/20 shadow-sm relative overflow-hidden">
           <div className="absolute inset-0 bg-[#00A896] opacity-10 animate-pulse"></div>
           <BrainCircuit className="text-[#00A896] w-5 h-5 relative z-10" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-[#212529] flex items-center gap-2">
            MedConnect AI Diagnostic Assistant <span className="px-2 py-0.5 bg-[#00A896]/10 text-[#00A896] text-[10px] font-black uppercase tracking-widest rounded border border-[#00A896]/20">Pro</span>
          </h3>
          <p className="text-sm text-[#6C757D] font-medium">
            Clinical decision support using advanced symptom-vector analysis
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-5 space-y-6">
            {/* Input Form */}
            <form onSubmit={handleGetSuggestions} className="bg-[#F8F9FA] p-6 rounded-2xl border border-[#DEE2E6] space-y-5">
              
              <div className="flex items-center justify-between mb-2">
                 <h4 className="font-bold text-[#495057] uppercase tracking-wide text-sm flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-[#2E86AB]" /> Clinical Input Array
                 </h4>
              </div>

              {/* Symptoms */}
              <div>
                <label className="block text-xs font-bold text-[#495057] uppercase tracking-wider mb-2">
                  Presenting Symptoms <span className="text-[#DC3545] text-lg leading-none">*</span>
                </label>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="e.g. persistent cough, fever (39C), dyspnea, fatigue"
                  rows="3"
                  className="w-full px-4 py-3 border border-[#CED4DA] rounded-xl text-[#212529] focus:outline-none focus:ring-2 focus:ring-[#00A896]/20 focus:border-[#00A896] transition-colors resize-y placeholder:text-[#A0AEC0] shadow-sm bg-white"
                />
                <p className="text-[10px] uppercase font-bold text-[#6C757D] mt-1.5 tracking-wide">Separate symptom descriptors with commas</p>
              </div>

              {/* Age and Gender */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#495057] uppercase tracking-wider mb-2">Age <span className="text-[#A0AEC0] font-normal lowercase tracking-normal">(Opt)</span></label>
                  <input
                    type="number"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    placeholder="e.g. 45"
                    min="0"
                    max="150"
                    className="w-full px-4 py-2.5 border border-[#CED4DA] rounded-xl text-[#212529] bg-white focus:outline-none focus:ring-2 focus:ring-[#00A896]/20 focus:border-[#00A896] transition-colors shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#495057] uppercase tracking-wider mb-2">Sex <span className="text-[#A0AEC0] font-normal lowercase tracking-normal">(Opt)</span></label>
                  <div className="relative">
                     <select
                       value={patientGender}
                       onChange={(e) => setPatientGender(e.target.value)}
                       className="w-full px-4 py-2.5 border border-[#CED4DA] rounded-xl text-[#212529] bg-white focus:outline-none focus:ring-2 focus:ring-[#00A896]/20 focus:border-[#00A896] transition-colors shadow-sm appearance-none cursor-pointer"
                     >
                       <option value="">Select</option>
                       <option value="male">Male</option>
                       <option value="female">Female</option>
                       <option value="other">Other</option>
                     </select>
                  </div>
                </div>
              </div>

              {/* Patient ID */}
              <div>
                <label className="block text-xs font-bold text-[#495057] uppercase tracking-wider mb-2">Contextual Record ID <span className="text-[#A0AEC0] font-normal lowercase tracking-normal">(Opt)</span></label>
                <input
                  type="text"
                  value={patientIdInput}
                  onChange={(e) => setPatientIdInput(e.target.value)}
                  placeholder="Paste ID for historical context correlation"
                  className="w-full px-4 py-2.5 border border-[#CED4DA] rounded-xl text-[#212529] bg-white focus:outline-none focus:ring-2 focus:ring-[#00A896]/20 focus:border-[#00A896] transition-colors font-mono text-sm shadow-sm"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-gradient-to-r from-[#00A896] to-[#02C39A] text-white py-3 rounded-xl font-bold shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="tracking-wide">Computing Vectors...</span>
                  </>
                ) : (
                  <>
                    <BrainCircuit size={18} className="group-hover:scale-110 transition-transform" />
                    <span className="tracking-wide">Execute Clinical Analysis</span>
                  </>
                )}
              </button>
            </form>

            {/* Error Message */}
            {error && (
              <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <p className="font-medium">{error}</p>
              </div>
            )}
         </div>

         <div className="lg:col-span-7">
            {/* Empty State */}
            {!suggestions && !loading && (
              <div className="h-full min-h-[400px] border-2 border-dashed border-[#DEE2E6] rounded-2xl flex flex-col items-center justify-center p-8 text-center bg-[#F8F9FA]/50">
                <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mb-6">
                   <BrainCircuit size={40} className="text-[#DEE2E6]" />
                </div>
                <h4 className="text-[#495057] font-bold text-lg mb-2">Awaiting Clinical Input</h4>
                <p className="text-[#6C757D] text-sm max-w-sm leading-relaxed">
                  Enter presenting symptoms and relevant patient demographics in the input array to generate AI-assisted diagnostic insights, risk assessments, and recommended investigative pathways.
                </p>
              </div>
            )}

            {loading && !suggestions && (
              <div className="h-full min-h-[400px] border border-[#DEE2E6] rounded-2xl flex flex-col items-center justify-center p-8 text-center bg-[#F8F9FA]/50">
                 <div className="w-20 h-20 relative flex items-center justify-center mb-6">
                    <div className="absolute inset-0 border-4 border-[#00A896]/20 rounded-full animate-ping"></div>
                    <div className="absolute inset-2 border-4 border-[#00A896]/40 rounded-full animate-pulse"></div>
                    <BrainCircuit size={32} className="text-[#00A896] animate-pulse relative z-10" />
                 </div>
                 <h4 className="text-[#00A896] font-bold text-lg mb-2">Analyzing Clinical Vectors</h4>
                 <p className="text-[#6C757D] text-sm animate-pulse">Correlating symptoms against medical databases...</p>
              </div>
            )}

            {/* Results */}
            {suggestions && (
               <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  
                  {/* Analysis Header & Risk */}
                  <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                     {suggestions?.riskLevel && (
                       <div className={`flex-1 p-5 rounded-2xl border ${
                         suggestions.riskLevel === 'Critical' ? 'bg-red-50 border-red-200' :
                         suggestions.riskLevel === 'High' ? 'bg-orange-50 border-orange-200' :
                         suggestions.riskLevel === 'Medium' ? 'bg-amber-50 border-amber-200' :
                         'bg-emerald-50 border-emerald-200'
                       }`}>
                         <div className="flex items-center gap-4">
                           <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                             suggestions.riskLevel === 'Critical' ? 'bg-red-100 text-red-600' :
                             suggestions.riskLevel === 'High' ? 'bg-orange-100 text-orange-600' :
                             suggestions.riskLevel === 'Medium' ? 'bg-amber-100 text-amber-600' :
                             'bg-emerald-100 text-emerald-600'
                           }`}>
                             <HeartPulse size={24} />
                           </div>
                           <div>
                             <p className="text-[10px] font-bold text-[#6C757D] uppercase tracking-widest mb-0.5">Assessed Risk Tier</p>
                             <h4 className={`text-2xl font-black uppercase tracking-tight ${
                               suggestions.riskLevel === 'Critical' ? 'text-red-700' :
                               suggestions.riskLevel === 'High' ? 'text-orange-700' :
                               suggestions.riskLevel === 'Medium' ? 'text-amber-700' :
                               'text-emerald-700'
                             }`}>{suggestions.riskLevel}</h4>
                           </div>
                         </div>
                       </div>
                     )}

                     <div className="flex-1 bg-[#212529] rounded-2xl p-5 border border-[#343A40] relative overflow-hidden flex flex-col justify-center">
                        <ShieldCheck className="absolute right-[-10px] bottom-[-10px] w-24 h-24 text-white/5 pointer-events-none" />
                        <h4 className="text-white font-bold text-sm mb-1.5 flex items-center gap-2">
                           <Lightbulb className="w-4 h-4 text-emerald-400" />
                           Clinical Support Tool
                        </h4>
                        <p className="text-[#ADB5BD] text-xs leading-relaxed">
                          This AI analysis is designed to augment, not replace, professional clinical judgment. Verify all findings independently.
                        </p>
                     </div>
                  </div>

                  {/* Warnings */}
                  {suggestions?.warnings && suggestions.warnings.length > 0 && (
                     <div className="space-y-3">
                       {suggestions.warnings.map((warning, idx) => (
                         <div key={idx} className="flex gap-3 p-4 bg-red-50 border-l-4 border-l-red-500 border-y border-r border-[#E9ECEF] rounded-r-xl text-red-800 text-sm shadow-sm">
                           <AlertCircle size={18} className="flex-shrink-0 mt-0.5 text-red-600" />
                           <p className="font-bold">{warning}</p>
                         </div>
                       ))}
                     </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {/* Suggested Tests */}
                     {suggestions?.suggestedTests && suggestions.suggestedTests.length > 0 && (
                       <div className="bg-white border border-[#DEE2E6] rounded-2xl p-6 shadow-sm">
                         <h4 className="font-black text-[#212529] mb-4 flex items-center gap-2 uppercase tracking-wide text-sm border-b border-[#E9ECEF] pb-3">
                           <FileText size={16} className="text-[#2E86AB]" /> Recommended Screenings
                         </h4>
                         <ul className="space-y-2.5">
                           {suggestions.suggestedTests.map((test, idx) => (
                             <li key={idx} className="flex items-start gap-3 bg-[#F8F9FA] p-3 rounded-xl border border-[#E9ECEF] group hover:border-[#2E86AB]/30 transition-colors">
                               <div className="w-5 h-5 rounded bg-[#E8F4F8] flex items-center justify-center flex-shrink-0 mt-0.5">
                                 <span className="text-[#2E86AB] font-bold text-[10px]">{idx + 1}</span>
                               </div>
                               <span className="text-sm text-[#495057] font-semibold">{test}</span>
                             </li>
                           ))}
                         </ul>
                       </div>
                     )}

                     {/* Suggestions List */}
                     {suggestions?.suggestions && suggestions.suggestions.length > 0 && (
                       <div className="bg-white border border-[#DEE2E6] rounded-2xl p-6 shadow-sm">
                         <h4 className="font-black text-[#212529] mb-4 flex items-center gap-2 uppercase tracking-wide text-sm border-b border-[#E9ECEF] pb-3">
                           <BrainCircuit size={16} className="text-[#A23B72]" /> Differential Diagnoses
                         </h4>
                         <div className="space-y-4">
                           {suggestions.suggestions.map((suggestion, idx) => (
                             <div key={idx} className="bg-white border border-[#E9ECEF] rounded-xl p-4 hover:border-[#A23B72]/30 hover:shadow-sm transition-all relative overflow-hidden">
                               <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#A23B72]/20"></div>
                               
                               <div className="flex items-start justify-between mb-3">
                                 <div>
                                   <h5 className="font-bold text-[#212529] text-base leading-tight mb-0.5">{suggestion.condition}</h5>
                                   {suggestion.icdCode && (
                                     <span className="inline-block px-1.5 py-0.5 bg-[#F8F9FA] border border-[#DEE2E6] text-[#6C757D] text-[10px] font-mono font-bold rounded">
                                       ICD-10: {suggestion.icdCode}
                                     </span>
                                   )}
                                 </div>
                                 <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-black tracking-wide border border-emerald-100">
                                   {Math.round(parseFloat(suggestion.confidence || "0") * 100) || suggestion.confidence}% Match
                                 </span>
                               </div>

                               {/* Recommendations */}
                               {suggestion.recommendations && suggestion.recommendations.length > 0 && (
                                 <div className="bg-[#F8F9FA] rounded-lg p-3 border border-[#E9ECEF] mt-3">
                                   <p className="text-[10px] font-black text-[#495057] uppercase tracking-wider mb-2">Clinical Next Steps</p>
                                   <ul className="space-y-1.5">
                                     {suggestion.recommendations.map((rec, i) => (
                                       <li key={i} className="flex items-start gap-2 text-xs text-[#495057] font-medium leading-relaxed">
                                         <ChevronRight size={14} className="text-[#A23B72] flex-shrink-0 mt-[1px]" />
                                         <span>{rec}</span>
                                       </li>
                                     ))}
                                   </ul>
                                 </div>
                               )}
                             </div>
                           ))}
                         </div>
                       </div>
                     )}
                  </div>

               </div>
            )}
         </div>
      </div>
    </div>
  );
}
