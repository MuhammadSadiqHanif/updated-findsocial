"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check, X, Gift, Bell, Layers } from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { Sidebar } from "@/components/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { getUserMetadata } from "@/lib/auth";

// Subscription type for fetched data
interface Subscription {
  plan?: { interval?: string; amount?: number };
  start_date?: string | number;
}

interface Plan {
  name: string;
  price: number;
  period: string;
  billing: string;
  description: string;
  features: { name: string; included: boolean; }[];
  isBestValue?: boolean;
}

const plans: Plan[] = [
  {
    name: "Free plan",
    price: 0,
    period: "Month",
    billing: "Always Free",
    description: "Perfect for getting started",
    features: [
      { name: "100 credits per month", included: true },
      { name: "Instagram search", included: true },
      { name: "Instagram URL imports feature", included: true },
      { name: "Spotify artists search", included: true },
      { name: "Spotify playlists search", included: true },
      { name: "SoundCloud search", included: true },
      { name: "TikTok search", included: true },
      { name: "YouTube search", included: true },
      { name: "Twitter search", included: true },
      { name: "Deep search", included: false },
      { name: "Export of results", included: false },
      { name: "Priority support", included: false },
      { name: "Direct message", included: false },
    ],
  },
  {
    name: "Starter",
    price: 25,
    period: "Month", 
    billing: "Bill Monthly",
    description: "Best suits for small businesses",
    features: [
      { name: "1000 credits per month", included: true },
      { name: "Instagram search", included: true },
      { name: "Instagram URL imports feature", included: true },
      { name: "Spotify artists search", included: true },
      { name: "Spotify playlists search", included: true },
      { name: "SoundCloud search", included: true },
      { name: "TikTok search", included: true },
      { name: "YouTube search", included: true },
      { name: "Twitter search", included: true },
      { name: "Export of results", included: true },
      { name: "Priority support", included: false },
      { name: "Direct message", included: false },
    ],
  },
  {
    name: "Medium",
    price: 100,
    period: "Month",
    billing: "Bill Monthly", 
    description: "Best suits for medium size businesses",
    isBestValue: true,
    features: [
      { name: "10000 credits per month", included: true },
      { name: "Instagram search", included: true },
      { name: "Instagram URL imports feature", included: true },
      { name: "Spotify artists search", included: true },
      { name: "Spotify playlists search", included: true },
      { name: "SoundCloud search", included: true },
      { name: "TikTok search", included: true },
      { name: "YouTube search", included: true },
      { name: "Twitter search", included: true },
      { name: "Export of results", included: true },
      { name: "Priority support", included: true },
      { name: "Direct message", included: false },
    ],
  },
  {
    name: "Pro",
    price: 200,
    period: "Month",
    billing: "Bill Monthly",
    description: "Best suits for large businesses", 
    features: [
      { name: "50000 credits per month", included: true },
      { name: "Instagram search", included: true },
      { name: "Instagram URL imports feature", included: true },
      { name: "Spotify artists search", included: true },
      { name: "Spotify playlists search", included: true },
      { name: "SoundCloud search", included: true },
      { name: "TikTok search", included: true },
      { name: "YouTube search", included: true },
      { name: "Twitter search", included: true },
      { name: "Export of results", included: true },
      { name: "Priority support", included: true },
      { name: "Direct message", included: true },
    ],
  },
];

interface UpgradePlanPageProps {
  onBack: () => void;
}

export default function UpgradePlanPage({ onBack }: UpgradePlanPageProps) {
  const [billingPeriod, setBillingPeriod] = useState<"annual" | "monthly">(
    "annual"
  );
  const { userId, isLoading, isLoggedIn, apiCall, userInfo,apiCallWithUserId } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [pricingData, setPricingData] = useState<any>(null);
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  // Subscription state
  const [subscription, setSubscription] = useState<Subscription[] | null>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);

  // Function to create Stripe checkout session
  const createCheckoutSession = async (priceId: string, planName: string) => {
    setCheckoutLoading(planName);
    try {
       const CustomerId= await getUserMetadata(userId || '');
        console.log(CustomerId,"userInfo");
        
      if (!CustomerId?.app_metadata?.stripe_customer_id) {
        console.error('No Stripe customer ID found');
        alert('Unable to process payment. Please contact support.');
        return;
      }

      const checkoutData = {
        customer_id: CustomerId?.app_metadata?.stripe_customer_id,
        price_id: priceId,
        currency: "usd",
        query_string: `?plan=${planName}&period=${billingPeriod}`,
        metadata: {
          customerId: CustomerId?.app_metadata?.stripe_customer_id,
          productId: priceId,
          user_id: userId,
          plan_name: planName,
          billing_period: billingPeriod
        },
        success_url: `${window.location.origin}/stripe-auth?session_id={CHECKOUT_SESSION_ID}&plan=${planName}&period=${billingPeriod}`,
        cancel_url: `${window.location.origin}/upgrade-plan?canceled=true`
      };

      console.log("Checkout Data:", checkoutData);

      const response = await fetch('https://dev-api.findsocial.io/stripe-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData)
      });

      if (response.ok) {
        const checkoutSession = await response.json();
        console.log("Checkout Session Response:", checkoutSession);
        
        if (checkoutSession.url) {
          // Store payment intent and redirect to Stripe checkout
          localStorage.setItem('payment-intent', checkoutSession?.session_id);
          console.log("Redirecting to:", checkoutSession.url);
          window.location.assign(checkoutSession.url);
        } else {
          console.error('No checkout URL received');
          alert('Unable to create checkout session. Please try again.');
        }
      } else {
        const errorText = await response.text();
        console.error('Failed to create checkout session:', response.status, errorText);
        alert('Unable to create checkout session. Please try again.');
      }
      // After purchase, refetch subscription
      fetchUserSubscription();
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('An error occurred while processing your request. Please try again.');
    } finally {
      setCheckoutLoading(null);
    }
  };

  // Fetch user subscription from backend
  const fetchUserSubscription = async () => {
    setSubscriptionLoading(true);
    try {
      const CustomerId = await getUserMetadata(userId || '');
      if (!CustomerId?.app_metadata?.stripe_customer_id) {
        setSubscription(null);
        setCurrentPlan(null);
        return;
      }
      const response = await fetch(`https://dev-api.findsocial.io/stripe-subscriptions?customer_id=${CustomerId.app_metadata.stripe_customer_id}`);
      if (response.ok) {
        const data = await response.json();
        setSubscription(data);
        // Set current plan name if available
        if (data && data.length > 0 && data[0]?.plan) {
          // You can map amount to plan name if needed
          setCurrentPlan(data[0].plan.interval === 'year' ? 'Yearly' : 'Monthly');
        } else {
          setCurrentPlan(null);
        }
      } else {
        setSubscription(null);
        setCurrentPlan(null);
      }
    } catch (err) {
      setSubscription(null);
      setCurrentPlan(null);
    } finally {
      setSubscriptionLoading(false);
    }
  };

  // Function to handle plan selection and get price ID
  const handlePlanSelection = async (plan: any) => {
    if (plan.name === "Free plan") {
      return; // Free plan doesn't need checkout
    }

    // Get the appropriate price ID from API data
    let priceId = null;
    
    if (pricingData && pricingData.prices) {
      const prices = pricingData.prices;
      const targetInterval = billingPeriod === 'monthly' ? 'month' : 'year';
      
      // Find matching price based on plan and billing period
      if (plan.name === "Starter") {
        const starterPrices = prices.filter((p: any) => p.recurring?.interval === targetInterval);
        starterPrices.sort((a: any, b: any) => a.unit_amount - b.unit_amount);
        priceId = starterPrices[0]?.id;
      } else if (plan.name === "Professional") {
        const proPrices = prices.filter((p: any) => p.recurring?.interval === targetInterval);
        proPrices.sort((a: any, b: any) => a.unit_amount - b.unit_amount);
        priceId = proPrices[1]?.id;
      } else if (plan.name === "Business") {
        const businessPrices = prices.filter((p: any) => p.recurring?.interval === targetInterval);
        businessPrices.sort((a: any, b: any) => a.unit_amount - b.unit_amount);
        priceId = businessPrices[2]?.id;
      }
    }

    if (!priceId) {
      console.error('No price ID found for selected plan');
      alert('Unable to process this plan selection. Please try again.');
      return;
    }

    await createCheckoutSession(priceId, plan.name);
  };

  // Fetch pricing data from Stripe API
  const fetchPricingData = async () => {
    setLoadingPrices(true);
    try {
      const response = await fetch('https://dev-api.findsocial.io/stripe-prices');
      if (response.ok) {
        const data = await response.json();
        setPricingData(data);
      }
    } catch (error) {
      console.error('Error fetching pricing data:', error);
    } finally {
      setLoadingPrices(false);
    }
  };
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/login");
    }
  }, [isLoading, isLoggedIn, router]);

  // Fetch user subscription on mount and when userId changes
  useEffect(() => {
    if (userId) {
      fetchUserSubscription();
    }
  }, [userId]);

  // Check for checkout canceled in URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const canceled = urlParams.get('canceled');

    if (canceled === 'true') {
      // Handle canceled checkout
      console.log('Checkout was canceled');
      // You could show a toast or modal here
    }
  }, []);

  // Function to verify checkout session (optional)
  const verifyCheckoutSession = async (sessionId: string) => {
    try {
      const response = await fetch(`https://dev-api.findsocial.io/stripe-checkout-session?session_id=${sessionId}`);
      if (response.ok) {
        const sessionData = await response.json();
        console.log('Session verification:', sessionData);
        // Handle successful payment verification
      }
    } catch (error) {
      console.error('Error verifying checkout session:', error);
    }
  };

  // Fetch pricing data on component mount
  useEffect(() => {
    fetchPricingData();
  }, []);

  // Helper function to format price from cents to dollars
  const formatPrice = (amountInCents: number, currency: string = 'usd') => {
    const amount = amountInCents / 100;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  // Helper function to get price for specific currency and plan
  const getPriceForPlan = (price: any, currency: string = 'usd') => {
    if (price.currency_options && price.currency_options[currency]) {
      return price.currency_options[currency].unit_amount;
    }
    return price.unit_amount;
  };

  // Create dynamic plans from API data
  const getDynamicPlans = (): Plan[] => {
    if (!pricingData || !pricingData.prices) {
      return plans; // Return static plans as fallback
    }

    const prices = pricingData.prices;
    const monthlyPrices = prices.filter((p: any) => p.recurring?.interval === 'month');
    const yearlyPrices = prices.filter((p: any) => p.recurring?.interval === 'year');

    // Sort by price
    monthlyPrices.sort((a: any, b: any) => a.unit_amount - b.unit_amount);
    yearlyPrices.sort((a: any, b: any) => a.unit_amount - b.unit_amount);

    const dynamicPlans: Plan[] = [
      {
        name: "Free plan",
        price: 0,
        period: "Month",
        billing: "Always Free",
        description: "Perfect for getting started",
        features: [
          { name: "5 searches per month", included: true },
          { name: "250 results per month", included: true },
          { name: "Instagram search", included: true },
          { name: "Instagram URL imports feature", included: true },
          { name: "Spotify artists search", included: true },
          { name: "Spotify playlists search", included: true },
          { name: "SoundCloud search", included: true },
          { name: "TikTok search", included: true },
          { name: "YouTube search", included: true },
          { name: "Deep search", included: false },
          { name: "Exports of results", included: false },
          { name: "Priority support", included: false },
          { name: "Direct message", included: false },
        ],
      }
    ];

    // Add paid plans based on API data
    if (monthlyPrices.length >= 1) {
      const starterPrice = monthlyPrices[0];
      const starterYearlyPrice = yearlyPrices.find((p: any) => 
        getPriceForPlan(p, 'usd') <= getPriceForPlan(starterPrice, 'usd') * 10
      );

      const price = billingPeriod === 'monthly' 
        ? getPriceForPlan(starterPrice, 'usd') / 100
        : starterYearlyPrice ? getPriceForPlan(starterYearlyPrice, 'usd') / 100 : (getPriceForPlan(starterPrice, 'usd') * 10) / 100;

      dynamicPlans.push({
        name: "Starter",
        price: price,
        period: billingPeriod === 'monthly' ? 'Month' : 'Year',
        billing: billingPeriod === 'monthly' ? 'Bill Monthly' : 'Bill Annually',
        description: "Best suits for small businesses",
        features: [
          { name: "100 searches per month", included: true },
          { name: "2500 results per month", included: true },
          { name: "Instagram search", included: true },
          { name: "Instagram URL imports feature", included: true },
          { name: "Spotify artists search", included: true },
          { name: "Spotify playlists search", included: true },
          { name: "SoundCloud search", included: true },
          { name: "TikTok search", included: true },
          { name: "YouTube search", included: true },
          { name: "Deep search", included: true },
          { name: "Exports of results", included: true },
          { name: "Priority support", included: true },
          { name: "Direct message", included: false },
        ],
      });
    }

    if (monthlyPrices.length >= 2) {
      const proPrice = monthlyPrices[1];
      const proYearlyPrice = yearlyPrices.find((p: any) => 
        Math.abs(getPriceForPlan(p, 'usd') - getPriceForPlan(proPrice, 'usd') * 10) <= 
        getPriceForPlan(proPrice, 'usd') * 2
      );

      const price = billingPeriod === 'monthly' 
        ? getPriceForPlan(proPrice, 'usd') / 100
        : proYearlyPrice ? getPriceForPlan(proYearlyPrice, 'usd') / 100 : (getPriceForPlan(proPrice, 'usd') * 10) / 100;

      dynamicPlans.push({
        name: "Professional",
        price: price,
        period: billingPeriod === 'monthly' ? 'Month' : 'Year',
        billing: billingPeriod === 'monthly' ? 'Bill Monthly' : 'Bill Annually',
        description: "Best suits for medium size businesses",
        isBestValue: true,
        features: [
          { name: "1000 searches per month", included: true },
          { name: "25000 results per month", included: true },
          { name: "Instagram search", included: true },
          { name: "Instagram URL imports feature", included: true },
          { name: "Spotify artists search", included: true },
          { name: "Spotify playlists search", included: true },
          { name: "SoundCloud search", included: true },
          { name: "TikTok search", included: true },
          { name: "YouTube search", included: true },
          { name: "Deep search", included: true },
          { name: "Exports of results", included: true },
          { name: "Priority support", included: true },
          { name: "Direct message", included: false },
        ],
      });
    }

    if (monthlyPrices.length >= 3) {
      const businessPrice = monthlyPrices[2];
      const businessYearlyPrice = yearlyPrices.find((p: any) => 
        getPriceForPlan(p, 'usd') > getPriceForPlan(businessPrice, 'usd') * 8
      );

      const price = billingPeriod === 'monthly' 
        ? getPriceForPlan(businessPrice, 'usd') / 100
        : businessYearlyPrice ? getPriceForPlan(businessYearlyPrice, 'usd') / 100 : (getPriceForPlan(businessPrice, 'usd') * 10) / 100;

      dynamicPlans.push({
        name: "Business",
        price: price,
        period: billingPeriod === 'monthly' ? 'Month' : 'Year',
        billing: billingPeriod === 'monthly' ? 'Bill Monthly' : 'Bill Annually',
        description: "Best suits for large businesses",
        features: [
          { name: "10000 searches per month", included: true },
          { name: "100000 results per month", included: true },
          { name: "Instagram search", included: true },
          { name: "Instagram URL imports feature", included: true },
          { name: "Spotify artists search", included: true },
          { name: "Spotify playlists search", included: true },
          { name: "SoundCloud search", included: true },
          { name: "TikTok search", included: true },
          { name: "YouTube search", included: true },
          { name: "Deep search", included: true },
          { name: "Exports of results", included: true },
          { name: "Priority support", included: true },
          { name: "Direct message", included: true },
        ],
      });
    }

    return dynamicPlans;
  };

  // Use dynamic plans if available, otherwise fallback to static plans
  const activePlans = pricingData ? getDynamicPlans() : plans;
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setSidebarOpen(false)}
          ></div>
          <div className="absolute top-0 left-0 h-full">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-72">
        <TopBar title="Upgrade Plan">
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </TopBar>

        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold text-[#101828] mb-4">
                Upgrade Your Plan
              </h1>

              <div className="text-lg text-[#667085] mb-8">
                Choose the perfect plan for your business
              </div>

              {/* Show current plan */}
              {subscriptionLoading ? (
                <div className="text-center text-[#7f56d9]">Loading your subscription...</div>
              ) : currentPlan ? (
                <div className="text-center text-[#16b364] font-semibold">Current Plan: {currentPlan}</div>
              ) : (
                <div className="text-center text-[#d92d20]">No active subscription</div>
              )}

              {/* Billing Toggle */}
              <div className="inline-flex items-center bg-white rounded-full p-1 border border-[#d0d5dd]">
                <button
                  onClick={() => setBillingPeriod("annual")}
                  className={`cursor-pointer px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    billingPeriod === "annual"
                      ? "bg-[#7f56d9] text-white shadow-sm"
                      : "text-[#667085] hover:text-[#344054]"
                  }`}
                >
                  Annual
                  <span className="ml-2 text-xs bg-[#fff] text-[#7f56d9] px-2 py-1 rounded-full">
                    -25%
                  </span>
                </button>
                <button
                  onClick={() => setBillingPeriod("monthly")}
                  className={`cursor-pointer px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    billingPeriod === "monthly"
                      ? "bg-[#7f56d9] text-white shadow-sm"
                      : "text-[#667085] hover:text-[#344054]"
                  }`}
                >
                  Monthly
                </button>
              </div>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {loadingPrices ? (
                <div className="col-span-full flex justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7F56D9] mx-auto mb-4"></div>
                    <p>Loading pricing plans...</p>
                  </div>
                </div>
              ) : (
                activePlans.map((plan, index) => (
                  <Card
                    key={plan.name}
                    className={`relative bg-white border-2 transition-all hover:shadow-lg ${
                      (plan as any).isBestValue ? "border-[#7f56d9]" : "border-[#eaecf0]"
                    }`}
                  >
                    {(plan as any).isBestValue && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-[#7f56d9] hover:bg-[#7f56d9] text-white px-4 py-1">
                          BEST VALUE
                        </Badge>
                      </div>
                    )}

                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-xl font-bold text-[#101828] mb-2">
                      {plan.name}
                    </CardTitle>
                    <p className="text-sm text-[#667085] mb-6">
                      {plan.description}
                    </p>

                    <div className="mb-4">
                      <div className="text-4xl font-bold text-[#101828]">
                        ${plan.price}
                        <span className="text-lg font-normal text-[#667085]">
                          /{plan.period}
                        </span>
                      </div>
                      <p className="text-sm text-[#667085] mt-1">
                        {plan.billing}
                      </p>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-start space-x-3"
                        >
                          <div className="flex-shrink-0 mt-0.5">
                            {feature.included ? (
                              <div className="w-5 h-5 bg-[#16b364] rounded-full flex items-center justify-center">
                                <Check className="h-3 w-3 text-white" />
                              </div>
                            ) : (
                              <div className="w-5 h-5 bg-[#d92d20] rounded-full flex items-center justify-center">
                                <X className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </div>
                          <span
                            className={`text-sm ${
                              feature.included
                                ? "text-[#344054]"
                                : "text-[#98a2b3]"
                            }`}
                          >
                            {feature.name}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={() => handlePlanSelection(plan)}
                      disabled={checkoutLoading !== null || plan.name === "Free plan"}
                      className={`cursor-pointer w-full py-3 ${
                        (plan as any).isBestValue
                          ? "bg-[#7f56d9] hover:bg-[#6941c6] text-white"
                          : "bg-[#7f56d9] hover:bg-[#6941c6] text-white"
                      } ${plan.name === "Free plan" ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {checkoutLoading === plan.name ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Processing...</span>
                        </div>
                      ) : plan.name === "Free plan" ? (
                      currentPlan === 'Free' ? "Current Plan" : "Choose Free Plan"
                      ) : (
                        "Upgrade Plan"
                      )}
                    </Button>
                  </CardContent>
                </Card>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
