import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, CheckCircle2, AlertCircle, CreditCard, Sparkles, ShieldCheck } from 'lucide-react';
import { useCheckoutSubscriptionMutation } from '../services/userApi';
import { setUser } from '../store/slices/authSlice';

const PLANS = [
  {
    key: 'basic',
    name: 'Basic',
    price: '$9.99/mo',
    description: 'Reliable operations for growing clinics.',
    features: ['Up to 25 patients', 'Appointment workflows', 'Secure records access'],
    accent: 'from-sky-500 to-cyan-500',
  },
  {
    key: 'pro',
    name: 'Pro',
    price: '$29.99/mo',
    description: 'Advanced capabilities for scaling teams.',
    features: ['Unlimited patients', 'AI-powered features', 'Advanced analytics'],
    accent: 'from-emerald-500 to-teal-500',
  },
];

const formatDate = (value) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString();
};

export default function SubscriptionPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [checkoutSubscription, { isLoading }] = useCheckoutSubscriptionMutation();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const currentPlan = useMemo(() => String(user?.subscription?.plan || 'free').toLowerCase(), [user]);

  const getDashboardUrl = () => {
    switch (user?.role) {
      case 'patient':
        return '/patient-dashboard';
      case 'doctor':
        return '/doctor-dashboard';
      case 'receptionist':
        return '/receptionist-dashboard';
      default:
        return '/admin';
    }
  };

  const handleCheckout = async () => {
    try {
      setErrorMessage('');
      setSuccessMessage('');
      const response = await checkoutSubscription({ plan: selectedPlan }).unwrap();
      const updatedUser = response?.data;

      if (updatedUser) {
        dispatch(setUser(updatedUser));
      }

      setSuccessMessage(`Subscription upgraded to ${selectedPlan.toUpperCase()} successfully.`);
    } catch (error) {
      setErrorMessage(error?.data?.message || 'Subscription checkout failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7F9] text-[#1F2937] font-['Inter'] pb-12">
      <nav className="bg-white border-b border-[#E5E7EB] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/settings')}
                className="w-10 h-10 rounded-full flex items-center justify-center text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#2563EB] transition-colors"
                aria-label="Back to settings"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold text-[#111827] tracking-tight">Subscription</h1>
            </div>

            <button
              onClick={() => navigate(getDashboardUrl())}
              className="text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
            >
              Dashboard
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
        {successMessage && (
          <div className="mb-6 rounded-xl bg-emerald-50 border border-emerald-200 p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="text-emerald-800 text-sm font-medium">{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800 text-sm font-medium">{errorMessage}</p>
          </div>
        )}

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Choose Plan</p>
                  <h2 className="text-2xl font-bold text-[#111827] mt-1">Flexible for clinic growth</h2>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE]">
                  <Sparkles className="w-4 h-4 text-[#2563EB]" />
                  <span className="text-xs font-semibold text-[#2563EB]">Upgrade Anytime</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PLANS.map((plan) => {
                  const isActiveChoice = selectedPlan === plan.key;
                  const isCurrent = currentPlan === plan.key;

                  return (
                    <button
                      key={plan.key}
                      type="button"
                      onClick={() => setSelectedPlan(plan.key)}
                      className={`text-left rounded-2xl border p-5 transition-all ${
                        isActiveChoice
                          ? 'border-[#2563EB] shadow-[0_6px_20px_rgba(37,99,235,0.18)] bg-[#F8FAFC]'
                          : 'border-[#E5E7EB] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${plan.accent} text-white flex items-center justify-center mb-4`}>
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-[#111827]">{plan.name}</h3>
                        {isCurrent && (
                          <span className="text-[11px] font-bold uppercase tracking-wide text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-1 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-[#2563EB] font-extrabold text-xl mt-1">{plan.price}</p>
                      <p className="text-sm text-[#6B7280] mt-2">{plan.description}</p>
                      <ul className="mt-4 space-y-2">
                        {plan.features.map((feature) => (
                          <li key={feature} className="text-sm text-[#374151] flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Current Subscription</p>
              <p className="mt-2 text-2xl font-black text-[#111827] capitalize">{currentPlan}</p>
              <p className="mt-1 text-sm text-[#6B7280] capitalize">Status: {user?.subscription?.status || 'inactive'}</p>
              <p className="mt-1 text-sm text-[#6B7280]">Expires: {formatDate(user?.subscription?.expiresAt)}</p>

              <button
                type="button"
                onClick={handleCheckout}
                disabled={isLoading}
                className="mt-6 w-full py-3 px-4 bg-[#111827] text-white font-semibold rounded-xl hover:bg-[#1F2937] disabled:bg-[#D1D5DB] disabled:text-[#6B7280] disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? 'Processing...' : `Checkout ${selectedPlan.toUpperCase()}`}
              </button>
            </div>

            <div className="bg-[#ECFDF3] border border-[#BBF7D0] rounded-2xl p-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#047857] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Billing Note
              </h3>
              <p className="mt-2 text-sm text-[#065F46]">
                This environment uses simulated checkout for hackathon demos. Plan activation is immediate.
              </p>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
