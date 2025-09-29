"use client";

import { useState, useEffect } from "react";
import { TopBar } from "@/components/top-bar";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  X,
  Crown,
  Star,
  Zap,
  Users,
  Database,
  MessageSquare,
  Mail,
  ArrowUpDown,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";

const PlanAndBillingPage = () => {
  const { userId, isLoading, isLoggedIn, apiCall, userInfo } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState("free"); // This would come from your API
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [activeTab, setActiveTab] = useState("my-plan");
  const [pricingData, setPricingData] = useState<any>(null);
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState<any[]>([]);
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(false);

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

  // Fetch subscription data from API
  const fetchSubscriptionData = async () => {
    setLoadingSubscriptions(true);
    try {
      // Get stripe customer ID from Auth0 Management API
      let stripeCustomerId = null;
      
      if (userId) {
        try {
          // Encode the userId for URL (replace | with %7C)
          const encodedUserId = encodeURIComponent(userId);
          const auth0UserResponse = await fetch(`https://dev-findsocial.eu.auth0.com/api/v2/users/${encodedUserId}`, {
            headers: {
              'Authorization': `Bearer ${userInfo?.user_metadata?.token || ''}`
            }
          });
          
          if (auth0UserResponse.ok) {
            const auth0UserData = await auth0UserResponse.json();
            console.log('Auth0 user data:', auth0UserData);
            
            // Get stripe_customer_id from app_metadata
            if (auth0UserData.app_metadata && auth0UserData.app_metadata.stripe_customer_id) {
              stripeCustomerId = auth0UserData.app_metadata.stripe_customer_id;
              console.log('Found stripe_customer_id in app_metadata:', stripeCustomerId);
            }
          } else {
            console.error('Failed to fetch Auth0 user data:', auth0UserResponse.status);
          }
        } catch (auth0Error) {
          console.error('Error fetching Auth0 user data:', auth0Error);
        }
      }
      
      // Fallback to hardcoded ID if not found
      if (!stripeCustomerId) {
        console.warn('Stripe customer ID not found in Auth0, using fallback');
        stripeCustomerId = "cus_SW01RY9rUuyDMW";
      }
      
      const response = await fetch(`https://dev-api.findsocial.io/stripe-subscriptions?customer_id=${stripeCustomerId}`);
      if (response.ok) {
        const data = await response.json();
        setSubscriptionData(data);
        console.log('Successfully loaded subscriptions:', data.length);
      } else {
        console.error('Failed to fetch subscriptions:', response.status);
      }
    } catch (error) {
      console.error('Error fetching subscription data:', error);
    } finally {
      setLoadingSubscriptions(false);
    }
  };
  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/login");
    }
  }, [isLoading, isLoggedIn, router]);

  // Fetch pricing data and subscription data on component mount
  useEffect(() => {
    fetchPricingData();
    
    // Only fetch subscriptions if we have userId and userInfo
    if (userId && userInfo) {
      fetchSubscriptionData();
    }
  }, [userId, userInfo]); // Add userId and userInfo as dependencies

  // Helper function to format timestamp to readable date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper function to get plan name from product ID
  const getPlanName = (productId: string) => {
    const planNames: { [key: string]: string } = {
      'prod_PNxHmYORboUyb7': 'Professional'
    };
    return planNames[productId] || 'Unknown Plan';
  };

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

  // Process subscription data for display
  const processedSubscriptions = subscriptionData.map((subscription: any) => {
    const plan = subscription.plan || subscription.items?.data[0]?.plan;
    const planName = getPlanName(plan?.product || '');
    const amount = plan?.amount || 0;
    const currency = plan?.currency || subscription.currency;
    
    return {
      id: subscription.id,
      title: planName,
      price: formatPrice(amount, currency),
      startPeriod: formatDate(subscription.start_date),
      endPeriod: formatDate(subscription.current_period_end || subscription.items?.data[0]?.current_period_end),
      recurring: plan?.interval === 'year' ? 'Annually' : 'Monthly',
      status: subscription.status === 'active' ? 'Active' : subscription.status,
      statusColor: subscription.status === 'active' ? 'bg-[#1570ef]' : 'bg-[#da1e28]',
      raw: subscription, // Keep raw data for reference
    };
  });

  // Get current active plan from subscriptions
  const getCurrentPlanFromSubscriptions = () => {
    const activeSubscription = subscriptionData.find((sub: any) => sub.status === 'active');
    if (activeSubscription) {
      const plan = activeSubscription.plan || activeSubscription.items?.data[0]?.plan;
      const planName = getPlanName(plan?.product || '');
      return planName.toLowerCase();
    }
    return 'free';
  };

  // Update current plan based on subscriptions
  const currentPlanFromAPI = getCurrentPlanFromSubscriptions();

  // Create dynamic plans from API data
  const createPlansFromAPI = () => {
    if (!pricingData || !pricingData.prices) {
      return staticPlans; // Return static plans as fallback
    }

    const prices = pricingData.prices;
    const monthlyPrices = prices.filter((p: any) => p.recurring?.interval === 'month');
    const yearlyPrices = prices.filter((p: any) => p.recurring?.interval === 'year');

    // Sort by price
    monthlyPrices.sort((a: any, b: any) => a.unit_amount - b.unit_amount);
    yearlyPrices.sort((a: any, b: any) => a.unit_amount - b.unit_amount);

    const dynamicPlans = [
      {
        id: "free",
        name: "Free Plan",
        description: "Perfect for getting started",
        price: { monthly: 0, yearly: 0 },
        priceId: { monthly: null, yearly: null },
        icon: <Star className="w-6 h-6" />,
        features: [
          { name: "100 leads per month", included: true },
          { name: "1 list", included: true },
          { name: "Basic search filters", included: true },
          { name: "Email support", included: true },
          { name: "Advanced analytics", included: false },
          { name: "Custom templates", included: false },
          { name: "Priority support", included: false },
          { name: "API access", included: false },
        ],
        popular: false,
      }
    ];

    // Add plans based on API data
    if (monthlyPrices.length >= 1) {
      const starterMonthly = monthlyPrices[0];
      const starterYearly = yearlyPrices.find((p: any) => 
        getPriceForPlan(p, 'usd') <= getPriceForPlan(starterMonthly, 'usd') * 10
      );

      dynamicPlans.push({
        id: "starter",
        name: "Starter",
        description: "For growing businesses",
        price: { 
          monthly: getPriceForPlan(starterMonthly, 'usd') / 100,
          yearly: starterYearly ? getPriceForPlan(starterYearly, 'usd') / 100 : (getPriceForPlan(starterMonthly, 'usd') * 10) / 100
        },
        priceId: { 
          monthly: starterMonthly.id, 
          yearly: starterYearly?.id || null
        },
        icon: <Zap className="w-6 h-6" />,
        features: [
          { name: "5,000 leads per month", included: true },
          { name: "10 lists", included: true },
          { name: "Advanced search filters", included: true },
          { name: "Email support", included: true },
          { name: "Advanced analytics", included: true },
          { name: "Custom templates", included: true },
          { name: "Priority support", included: false },
          { name: "API access", included: false },
        ],
        popular: true,
      });
    }

    if (monthlyPrices.length >= 2) {
      const proMonthly = monthlyPrices[1];
      const proYearly = yearlyPrices.find((p: any) => 
        Math.abs(getPriceForPlan(p, 'usd') - getPriceForPlan(proMonthly, 'usd') * 10) <= 
        getPriceForPlan(proMonthly, 'usd') * 2
      );

      dynamicPlans.push({
        id: "professional",
        name: "Professional",
        description: "For large organizations",
        price: { 
          monthly: getPriceForPlan(proMonthly, 'usd') / 100,
          yearly: proYearly ? getPriceForPlan(proYearly, 'usd') / 100 : (getPriceForPlan(proMonthly, 'usd') * 10) / 100
        },
        priceId: { 
          monthly: proMonthly.id, 
          yearly: proYearly?.id || null
        },
        icon: <Crown className="w-6 h-6" />,
        features: [
          { name: "25,000 leads per month", included: true },
          { name: "50 lists", included: true },
          { name: "Advanced search filters", included: true },
          { name: "Email support", included: true },
          { name: "Advanced analytics", included: true },
          { name: "Custom templates", included: true },
          { name: "Priority support", included: true },
          { name: "API access", included: false },
        ],
        popular: false,
      });
    }

    if (monthlyPrices.length >= 3) {
      const enterpriseMonthly = monthlyPrices[2];
      const enterpriseYearly = yearlyPrices.find((p: any) => 
        getPriceForPlan(p, 'usd') > getPriceForPlan(enterpriseMonthly, 'usd') * 8
      );

      dynamicPlans.push({
        id: "enterprise",
        name: "Enterprise",
        description: "For enterprise solutions",
        price: { 
          monthly: getPriceForPlan(enterpriseMonthly, 'usd') / 100,
          yearly: enterpriseYearly ? getPriceForPlan(enterpriseYearly, 'usd') / 100 : (getPriceForPlan(enterpriseMonthly, 'usd') * 10) / 100
        },
        priceId: { 
          monthly: enterpriseMonthly.id, 
          yearly: enterpriseYearly?.id || null
        },
        icon: <Crown className="w-6 h-6" />,
        features: [
          { name: "Unlimited leads", included: true },
          { name: "Unlimited lists", included: true },
          { name: "Advanced search filters", included: true },
          { name: "Email support", included: true },
          { name: "Advanced analytics", included: true },
          { name: "Custom templates", included: true },
          { name: "Priority support", included: true },
          { name: "API access", included: true },
        ],
        popular: false,
      });
    }

    return dynamicPlans;
  };

  // Static plans as fallback
  const staticPlans = [
    {
      id: "free",
      name: "Free Plan",
      description: "Perfect for getting started",
      price: { monthly: 0, yearly: 0 },
      priceId: { monthly: null, yearly: null },
      icon: <Star className="w-6 h-6" />,
      features: [
        { name: "100 leads per month", included: true },
        { name: "1 list", included: true },
        { name: "Basic search filters", included: true },
        { name: "Email support", included: true },
        { name: "Advanced analytics", included: false },
        { name: "Custom templates", included: false },
        { name: "Priority support", included: false },
        { name: "API access", included: false },
      ],
      popular: false,
    },
    {
      id: "pro",
      name: "Pro Plan",
      description: "For growing businesses",
      price: { monthly: 29, yearly: 290 },
      priceId: { monthly: null, yearly: null },
      icon: <Zap className="w-6 h-6" />,
      features: [
        { name: "5,000 leads per month", included: true },
        { name: "10 lists", included: true },
        { name: "Advanced search filters", included: true },
        { name: "Email support", included: true },
        { name: "Advanced analytics", included: true },
        { name: "Custom templates", included: true },
        { name: "Priority support", included: false },
        { name: "API access", included: false },
      ],
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "For large organizations",
      price: { monthly: 99, yearly: 990 },
      priceId: { monthly: null, yearly: null },
      icon: <Crown className="w-6 h-6" />,
      features: [
        { name: "Unlimited leads", included: true },
        { name: "Unlimited lists", included: true },
        { name: "Advanced search filters", included: true },
        { name: "Email support", included: true },
        { name: "Advanced analytics", included: true },
        { name: "Custom templates", included: true },
        { name: "Priority support", included: true },
        { name: "API access", included: true },
      ],
      popular: false,
    },
  ];

  // Use dynamic plans if API data is available, otherwise fallback to static plans
  const activePlans = pricingData ? createPlansFromAPI() : staticPlans;
  const tabsData = [
    { id: "my-plan", label: "My Plan" },
    { id: "subscriptions", label: "Subscriptions" },
    { id: "invoices", label: "Invoices" },
    { id: "payment-method", label: "Payment Method" },
  ];

  const features = [
    "10000 searches per month",
    "Instagram search",
    "Spotify artists search",
    "SoundCloud search",
    "YouTube search",
    "Export of results",
    "Direct message",
  ];

  const premiumFeatures = [
    "10000 searches per month",
    "Instagram URL imports feature",
    "Spotify playlists search",
    "TikTok search",
    "Deep search",
    "Priority support",
  ];

  const invoices = [
    {
      id: "FSA-177166",
      plan: "Professional",
      paidAt: "September 7, 2024",
      amount: "$ 176.00",
    },
    {
      id: "FSA-177392",
      plan: "Starter",
      paidAt: "Jun 1, 2024",
      amount: "$22.00",
    },
  ];

const paymentMethods = [
  {
    id: 1,
    type: "mastercard",
    number: "559049******8091",
    expiry: "Expiry 2027-07",
    isDefault: true,
  },
  {
    id: 2,
    type: "visa",
    number: "559049******8091",
    expiry: "Expiry 2027-04",
    isDefault: false,
  },
]

  const currentPlanData = activePlans.find((plan: any) => plan.id === (subscriptionData.length > 0 ? currentPlanFromAPI : currentPlan));

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7F56D9] mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

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
        <TopBar title="Plan & Billing">
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
          <div className="p-4 lg:p-8">
            {/* API Loading Status */}
            {loadingPrices && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm text-blue-800">Loading latest pricing...</span>
                </div>
              </div>
            )}
            {/* {pricingData && !loadingPrices && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-sm text-green-800">Pricing loaded from live API</span>
                </div>
              </div>
            )} */}

            {/* Tabs */}
            <div className="mb-8">
              <div className="border-b border-[#eaecf0] overflow-x-auto">
                <nav className="flex space-x-8 min-w-max">
                  {tabsData.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`cursor-pointer py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                        activeTab === tab.id
                          ? "border-[#7f56d9] text-[#7f56d9]"
                          : "border-transparent text-[#667085] hover:text-[#344054] hover:border-[#d0d5dd]"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {activeTab === "my-plan" && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left column - About Plan */}
                <div className="xl:col-span-2 space-y-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-[#101828]">
                        About Plan
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-[#344054] mb-2">
                          Type
                        </label>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex-1">
                            <div className="px-4 py-2 bg-[#f9fafb] border border-[#d0d5dd] rounded-lg text-[#344054]">
                              {subscriptionData.length > 0 && processedSubscriptions.find((sub: any) => sub.status === 'Active')?.title || 'Free Plan'}
                            </div>
                          </div>
                          <Button className="bg-[#7f56d9] hover:bg-[#6941c6] text-white px-6 cursor-pointer" onClick={() => {router.push("/upgrade-plan")}}>
                            Change Plan
                          </Button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#344054] mb-2">
                          Credit Renewal date
                        </label>
                        <div className="px-4 py-2 bg-[#f9fafb] border border-[#d0d5dd] rounded-lg text-[#344054]">
                          {subscriptionData.length > 0 && processedSubscriptions.find((sub: any) => sub.status === 'Active')?.endPeriod || 'N/A'}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-[#101828]">
                        Credit Usage
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-[#344054]">
                            Searches completed
                          </span>
                          <span className="text-sm text-[#667085]">
                            4078/ 10000
                          </span>
                        </div>
                        <Progress value={40.78} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-[#344054]">
                            Results generated
                          </span>
                          <span className="text-sm text-[#667085]">
                            5048/ 10000
                          </span>
                        </div>
                        <Progress value={50.48} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right column - Plan Details */}
                <div className="xl:col-span-1">
                  <Card className="sticky top-4">
                    <CardHeader className="text-center pb-4">
                      <div className="flex justify-center mb-2">
                        <Badge className="bg-[#1570ef] hover:bg-[#1570ef] text-white">
                          Current Plan
                        </Badge>
                      </div>
                      <CardTitle className="text-2xl font-bold text-[#101828]">
                        {subscriptionData.length > 0 && processedSubscriptions.find((sub: any) => sub.status === 'Active')?.title || 'Free Plan'}
                      </CardTitle>
                      <p className="text-sm text-[#667085]">
                        Best suits for medium size businesses
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-[#101828]">
                          {loadingPrices ? (
                            <div className="animate-pulse bg-gray-200 h-10 w-20 mx-auto rounded"></div>
                          ) : (
                            <>
                              ${currentPlanData?.price[billingCycle]}
                              <span className="text-lg font-normal text-[#667085]">
                                /{billingCycle === 'monthly' ? 'month' : 'year'}
                              </span>
                            </>
                          )}
                        </div>
                        {!loadingPrices && (
                          <p className="text-sm text-[#667085] mt-1">
                            Bill {billingCycle === 'monthly' ? 'Monthly' : 'Annually'}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
                        <div className="space-y-3">
                          {features.map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-3"
                            >
                              <div className="flex-shrink-0 w-5 h-5 bg-[#17b26a] rounded-full flex items-center justify-center">
                                <Check className="h-3 w-3 text-white" />
                              </div>
                              <span className="text-sm text-[#344054]">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="space-y-3">
                          {premiumFeatures.map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-3"
                            >
                              <div className="flex-shrink-0 w-5 h-5 bg-[#17b26a] rounded-full flex items-center justify-center">
                                <Check className="h-3 w-3 text-white" />
                              </div>
                              <span className="text-sm text-[#344054]">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button onClick={() => {router.push("/upgrade-plan")}} className="cursor-pointer w-full bg-[#7f56d9] hover:bg-[#6941c6] text-white py-3">
                        Upgrade Plan
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {loadingSubscriptions && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm text-blue-800">Loading subscriptions...</span>
                </div>
              </div>
            )}
            {/* {subscriptionData.length > 0 && !loadingSubscriptions && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-sm text-green-800">{subscriptionData.length} subscription(s) loaded from API</span>
                </div>
              </div>
            )} */}
            
            {activeTab === "subscriptions" && (
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-[#101828]">
                      Subscription
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {processedSubscriptions.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                          <thead>
                            <tr className="border-b border-[#eaecf0]">
                              <th className="text-left py-3 px-4 text-sm font-medium text-[#667085]">
                                <div className="flex items-center space-x-1">
                                  <span>Title</span>
                                  <ArrowUpDown className="h-4 w-4" />
                                </div>
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-[#667085]">
                                Price
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-[#667085]">
                                Start Period
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-[#667085]">
                                End Period
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-[#667085]">
                                Recurring
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-[#667085]">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {processedSubscriptions.map((subscription: any) => (
                              <tr
                                key={subscription.id}
                                className="border-b border-[#f2f4f7] hover:bg-[#f9fafb]"
                              >
                                <td className="py-4 px-4 text-sm font-medium text-[#101828]">
                                  {subscription.title}
                                </td>
                                <td className="py-4 px-4 text-sm text-[#667085]">
                                  {subscription.price}
                                </td>
                                <td className="py-4 px-4 text-sm text-[#667085]">
                                  {subscription.startPeriod}
                                </td>
                                <td className="py-4 px-4 text-sm text-[#667085]">
                                  {subscription.endPeriod}
                                </td>
                                <td className="py-4 px-4 text-sm text-[#667085]">
                                  {subscription.recurring}
                                </td>
                                <td className="py-4 px-4">
                                  <Badge
                                    className={`${subscription.statusColor} hover:${subscription.statusColor} text-white text-xs`}
                                  >
                                    {subscription.status}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : !loadingSubscriptions ? (
                      <div className="text-center py-8">
                        <div className="text-[#667085] text-sm">
                          No subscriptions found. 
                          <Button 
                            onClick={() => {router.push("/upgrade-plan")}} 
                            variant="link" 
                            className="text-[#7f56d9] p-0 ml-1 h-auto"
                          >
                            Subscribe to a plan
                          </Button>
                        </div>
                      </div>
                    ) : null}

                    {/* Mobile-friendly card layout for small screens */}
                    {processedSubscriptions.length > 0 && (
                      <div className="block sm:hidden space-y-4 mt-4">
                        {processedSubscriptions.map((subscription: any) => (
                          <Card key={subscription.id} className="p-4">
                            <div className="space-y-3">
                              <div className="flex justify-between items-start">
                                <h3 className="font-medium text-[#101828]">
                                  {subscription.title}
                                </h3>
                                <Badge
                                  className={`${subscription.statusColor} hover:${subscription.statusColor} text-white text-xs`}
                                >
                                  {subscription.status}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <span className="text-[#667085]">Price:</span>
                                  <div className="text-[#101828]">
                                    {subscription.price}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-[#667085]">
                                    Recurring:
                                  </span>
                                  <div className="text-[#101828]">
                                    {subscription.recurring}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-[#667085]">Start:</span>
                                  <div className="text-[#101828]">
                                    {subscription.startPeriod}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-[#667085]">End:</span>
                                  <div className="text-[#101828]">
                                    {subscription.endPeriod}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "invoices" && (
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-[#101828]">
                      Invoices
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[600px]">
                        <thead>
                          <tr className="border-b border-[#eaecf0]">
                            <th className="text-left py-3 px-4 text-sm font-medium text-[#667085]">
                              <div className="flex items-center space-x-1">
                                <span>Invoice ID</span>
                                <ArrowUpDown className="h-4 w-4" />
                              </div>
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-[#667085]">
                              Plan
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-[#667085]">
                              Paid at
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-[#667085]">
                              Amount
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-[#667085]"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoices.map((invoice) => (
                            <tr
                              key={invoice.id}
                              className="border-b border-[#f2f4f7] hover:bg-[#f9fafb]"
                            >
                              <td className="py-4 px-4 text-sm font-medium text-[#101828]">
                                {invoice.id}
                              </td>
                              <td className="py-4 px-4 text-sm text-[#667085]">
                                {invoice.plan}
                              </td>
                              <td className="py-4 px-4 text-sm text-[#667085]">
                                {invoice.paidAt}
                              </td>
                              <td className="py-4 px-4 text-sm text-[#667085]">
                                {invoice.amount}
                              </td>
                              <td className="py-4 px-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-[#344054] border-[#d0d5dd] bg-transparent"
                                >
                                  View Invoice
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile-friendly card layout for small screens */}
                    <div className="block sm:hidden space-y-4 mt-4">
                      {invoices.map((invoice) => (
                        <Card key={invoice.id} className="p-4">
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium text-[#101828]">
                                {invoice.id}
                              </h3>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-[#344054] border-[#d0d5dd] bg-transparent"
                              >
                                View Invoice
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-[#667085]">Plan:</span>
                                <div className="text-[#101828]">
                                  {invoice.plan}
                                </div>
                              </div>
                              <div>
                                <span className="text-[#667085]">Amount:</span>
                                <div className="text-[#101828]">
                                  {invoice.amount}
                                </div>
                              </div>
                              <div className="col-span-2">
                                <span className="text-[#667085]">Paid at:</span>
                                <div className="text-[#101828]">
                                  {invoice.paidAt}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "payment-method" && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-[#101828] mb-2">
                      Payment method list
                    </h2>
                    <p className="text-sm text-[#667085]">
                      Manage your saved payment options. You can add a new card
                      or update existing details anytime.
                    </p>
                  </div>
                  <Button className="bg-[#7f56d9] hover:bg-[#6941c6] text-white px-6 shrink-0">
                    New Payment Method
                  </Button>
                </div>

                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <Card key={method.id} className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-8 bg-gradient-to-r from-[#eb001b] to-[#f79e1b] rounded flex items-center justify-center">
                            {method.type === "mastercard" ? (
                              <div className="flex space-x-[-2px]">
                                <div className="w-4 h-4 bg-[#eb001b] rounded-full opacity-90" />
                                <div className="w-4 h-4 bg-[#f79e1b] rounded-full opacity-90" />
                              </div>
                            ) : (
                              <div className="text-white font-bold text-xs">
                                VISA
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center space-x-3">
                              <span className="text-sm font-medium text-[#101828]">
                                {method.number}
                              </span>
                              {method.isDefault && (
                                <Badge className="bg-[#f2f4f7] text-[#344054] hover:bg-[#f2f4f7] text-xs">
                                  DEFAULT METHOD
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-sm text-[#667085]">
                                Credit Card
                              </span>
                              <span className="text-sm text-[#667085]">
                                {method.expiry}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {!method.isDefault && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-[#7f56d9] border-[#7f56d9] hover:bg-[#7f56d9] hover:text-white bg-transparent"
                            >
                              Make Default
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-[#344054] border-[#d0d5dd] bg-transparent"
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PlanAndBillingPage;
