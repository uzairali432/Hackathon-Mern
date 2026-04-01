import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, CheckCircle2, AlertCircle, CreditCard, Sparkles, ShieldCheck } from 'lucide-react';
import { useCheckoutSubscriptionMutation } from '../services/userApi';

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
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, loading: isAuthLoading } = useSelector((state) => state.auth);
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [checkoutSubscription, { isLoading }] = useCheckoutSubscriptionMutation();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [optimisticSubscription, setOptimisticSubscription] = useState(null);

  const effectiveSubscription = optimisticSubscription || user?.subscription;
  const currentPlan = useMemo(() => String(effectiveSubscription?.plan || 'free').toLowerCase(), [effectiveSubscription]);
  const currentStatus = useMemo(() => String(effectiveSubscription?.status || 'inactive').toLowerCase(), [effectiveSubscription]);
  const isCurrentSelectionActive = selectedPlan === currentPlan && currentStatus === 'active';
  const showSkeletons = isAuthLoading || !user;

  useEffect(() => {
    const status = searchParams.get('status');
    if (!status) return;

    if (status === 'success') {
      setSuccessMessage('Payment completed. Your subscription will update shortly.');
      setErrorMessage('');
    }

    if (status === 'cancelled') {
      setErrorMessage('Checkout was cancelled. No charge was made.');
      setSuccessMessage('');
    }

    const cleanedParams = new URLSearchParams(searchParams);
    cleanedParams.delete('status');
    cleanedParams.delete('session_id');
    setSearchParams(cleanedParams, { replace: true });
  }, [searchParams, setSearchParams]);

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
    if (isCurrentSelectionActive || isLoading) {
      return;
    }

    try {
      setErrorMessage('');
      setSuccessMessage(`Starting secure checkout for ${selectedPlan.toUpperCase()}...`);
      setOptimisticSubscription(null);

      const response = await checkoutSubscription({ plan: selectedPlan }).unwrap();
      const checkoutUrl = response?.data?.checkoutUrl;

      if (!checkoutUrl) {
        throw new Error('Stripe checkout URL was not returned by the server.');
      }

      window.location.assign(checkoutUrl);
    } catch (error) {
      setOptimisticSubscription(null);
      setSuccessMessage('');
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
                {showSkeletons ? (
                  Array.from({ length: 2 }).map((_, idx) => (
                    <div key={`plan-skeleton-${idx}`} className="rounded-2xl border border-[#E5E7EB] p-5 animate-pulse">
                      <div className="w-11 h-11 rounded-xl bg-[#E5E7EB] mb-4" />
                      <div className="h-5 w-2/3 bg-[#E5E7EB] rounded mb-3" />
                      <div className="h-6 w-1/2 bg-[#DBEAFE] rounded mb-3" />
                      <div className="h-4 w-full bg-[#E5E7EB] rounded mb-2" />
                      <div className="h-4 w-5/6 bg-[#E5E7EB] rounded mb-4" />
                      <div className="space-y-2">
                        <div className="h-4 w-full bg-[#E5E7EB] rounded" />
                        <div className="h-4 w-4/5 bg-[#E5E7EB] rounded" />
                        <div className="h-4 w-3/5 bg-[#E5E7EB] rounded" />
                      </div>
                    </div>
                  ))
                ) : (
                  PLANS.map((plan) => {
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
                  })
                )}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
              {showSkeletons ? (
                <div className="animate-pulse">
                  <div className="h-3 w-1/3 bg-[#E5E7EB] rounded" />
                  <div className="h-8 w-1/2 bg-[#E5E7EB] rounded mt-3" />
                  <div className="h-4 w-2/3 bg-[#E5E7EB] rounded mt-3" />
                  <div className="h-4 w-2/3 bg-[#E5E7EB] rounded mt-2" />
                  <div className="h-11 w-full bg-[#E5E7EB] rounded-xl mt-6" />
                </div>
              ) : (
                <>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Current Subscription</p>
                  <p className="mt-2 text-2xl font-black text-[#111827] capitalize">{currentPlan}</p>
                  <p className="mt-1 text-sm text-[#6B7280] capitalize">Status: {currentStatus}</p>
                  <p className="mt-1 text-sm text-[#6B7280]">Expires: {formatDate(effectiveSubscription?.expiresAt)}</p>

                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={isLoading || isCurrentSelectionActive}
                    className="mt-6 w-full py-3 px-4 bg-[#111827] text-white font-semibold rounded-xl hover:bg-[#1F2937] disabled:bg-[#D1D5DB] disabled:text-[#6B7280] disabled:cursor-not-allowed transition-all"
                  >
                    {isLoading
                      ? 'Processing...'
                      : isCurrentSelectionActive
                      ? `${selectedPlan.toUpperCase()} is your active plan`
                      : `Checkout ${selectedPlan.toUpperCase()}`}
                  </button>
                </>
              )}
            </div>

            <div className="bg-[#ECFDF3] border border-[#BBF7D0] rounded-2xl p-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#047857] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Billing Note
              </h3>
              <p className="mt-2 text-sm text-[#065F46]">
                Payments are processed securely by Stripe. Subscription status is synchronized via webhook events.
              </p>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
