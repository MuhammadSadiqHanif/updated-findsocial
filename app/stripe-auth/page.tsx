"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PaymentSuccessModal } from "@/components/payment-success-modal";
import { useAuth } from "@/hooks/use-auth";
import { getUserMetadata } from "@/lib/auth";

export default function StripeAuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userId } = useAuth();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [sessionData, setSessionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to get plan amount based on plan name and period
  const getPlanAmount = (planName: string, period: string) => {
    const plans: any = {
      "Starter": period === "monthly" ? 2500 : 25000, // $25 or $250
      "Medium": period === "monthly" ? 10000 : 100000, // $100 or $1000  
      "Pro": period === "monthly" ? 20000 : 200000, // $200 or $2000
      "Free plan": 0
    };
    return plans[planName] || 2500; // Default to Starter monthly
  };

  // Handle payment success and update Auth0 user metadata
  const handlePaymentSuccess = async (sessionId: string, planName: string, period: string) => {
    try {
      const customerId = await getUserMetadata(userId || '');
      
      if (!customerId?.app_metadata?.stripe_customer_id) {
        console.error('No Stripe customer ID found');
        throw new Error('No Stripe customer ID found');
      }

      // 1️⃣ GET /stripe-subscriptions
      const subscriptionsResponse = await fetch(
        `https://dev-api.findsocial.io/stripe-subscriptions?customer_id=${customerId.app_metadata.stripe_customer_id}`
      );
      
      if (!subscriptionsResponse.ok) {
        throw new Error('Failed to fetch subscriptions');
      }
      
      const subscriptionsData = await subscriptionsResponse.json();
      const subscriptionData = subscriptionsData[0];

      // 2️⃣ GET /stripe-checkout-session
      const checkoutResponse = await fetch(
        `https://dev-api.findsocial.io/stripe-checkout-session?session_id=${sessionId}`
      );
      
      if (!checkoutResponse.ok) {
        throw new Error('Failed to fetch checkout session');
      }
      
      const checkoutData = await checkoutResponse.json();

      if (checkoutData?.status === 'complete') {
        // 3️⃣ GET /stripe-plan-price
        const priceResponse = await fetch(
          `https://dev-api.findsocial.io/stripe-plan-price?price_id=${checkoutData?.metadata?.productId}`
        );
        
        if (!priceResponse.ok) {
          throw new Error('Failed to fetch price data');
        }
        
        const priceData = await priceResponse.json();
        
        // Determine plan details based on price
        const isYearly = priceData.data?.plan?.interval === 'year' || 
                        priceData.data?.recurring?.interval === 'year' ||
                        period === 'annual';
        const amount = priceData.data?.unit_amount / 100; // Convert from cents

        let detectedPlanName = '';
        let credits = 0;
        let searches = 0;
        let results = 0;

        // Map amount to plan name and credits exactly like App.js environment variables
        if (isYearly) {
          if (amount === 249) { // €249 yearly (REACT_APP_STRIPE_PRICE_STARTER_Yearly)
            detectedPlanName = 'Starter';
            credits = 1200; // REACT_APP_STRIPE_CREDITS_STARTER_Yearly equivalent
          } else if (amount === 1920) { // €1920 yearly (REACT_APP_STRIPE_PRICE_MEDIUM_Yearly)
            detectedPlanName = 'Medium';
            credits = 120000; // REACT_APP_STRIPE_CREDITS_MEDIUM_Yearly equivalent
          } else if (amount >= 2000) { // €2000+ yearly (REACT_APP_STRIPE_PRICE_PRO_Yearly)
            detectedPlanName = 'Pro';
            credits = 600000; // REACT_APP_STRIPE_CREDITS_PRO_Yearly equivalent
          }
        } else {
          if (amount === 25) { // €25 monthly (REACT_APP_STRIPE_PRICE_STARTER_MONTHLY)
            detectedPlanName = 'Starter';
            credits = 100; // REACT_APP_STRIPE_CREDITS_STARTER_MONTHLY equivalent
          } else if (amount === 160) { // €160 monthly (REACT_APP_STRIPE_PRICE_MEDIUM_MONTHLY)
            detectedPlanName = 'Medium';
            credits = 10000; // REACT_APP_STRIPE_CREDITS_MEDIUM_MONTHLY equivalent
          } else if (amount >= 200) { // €200+ monthly (REACT_APP_STRIPE_PRICE_PRO_MONTHLY)
            detectedPlanName = 'Pro';
            credits = 50000; // REACT_APP_STRIPE_CREDITS_PRO_MONTHLY equivalent
          }
        }

        // Use planName from URL or detected plan name
        const finalPlanName = planName || detectedPlanName;

        // Get existing user metadata first (similar to scrapper_frontend App.js)
        const currentUserData = await getUserMetadata(userId || '');
        
        // Prepare user metadata update exactly like scrapper_frontend App.js
        const user_metadata = isYearly ? {
          subscriptionPlan: finalPlanName,
          remainingCredits: credits + (currentUserData?.user_metadata?.remainingCredits || 0),
          credits: credits + (currentUserData?.user_metadata?.credits || 0),
          month: typeof subscriptionData?.start_date === 'string'
            ? new Date(subscriptionData?.start_date)
            : new Date(subscriptionData?.start_date * 1000),
          result: currentUserData?.user_metadata?.result || 0,
          search: currentUserData?.user_metadata?.search || 0,
        } : {
          subscriptionPlan: finalPlanName,
          remainingCredits: credits + (currentUserData?.user_metadata?.remainingCredits || 0),
          credits: credits + (currentUserData?.user_metadata?.credits || 0), 
          month: typeof subscriptionData?.start_date === 'string'
            ? new Date(subscriptionData?.start_date)
            : new Date(subscriptionData?.start_date * 1000),
          result: currentUserData?.user_metadata?.result || 0,
          search: currentUserData?.user_metadata?.search || 0,
        };

        console.log('Updating Auth0 user metadata:', user_metadata);

        // 4️⃣ Update Auth0 user metadata exactly like App.js using Management API
        const managementTokenResponse = await fetch('/api/auth0/management-token', {
          method: 'POST',
        });
        const managementTokenData = await managementTokenResponse.json();

        const auth0UpdateResponse = await fetch(
          `https://dev-findsocial.eu.auth0.com/api/v2/users/${userId}`,
          {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${managementTokenData.access_token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_metadata: {
                ...user_metadata,
                token: managementTokenData.access_token, // Include token like App.js
              },
            }),
          }
        );

        if (auth0UpdateResponse.ok) {
          console.log('✅ Auth0 user metadata updated successfully');
          
          // Set session data for success modal
          setSessionData({
            plan_name: finalPlanName,
            amount_total: amount * 100, // Convert back to cents for display
            status: "complete",
            metadata: {
              plan_name: finalPlanName,
              billing_period: isYearly ? 'yearly' : 'monthly',
            },
            currency: priceData.data?.currency || 'eur',
          });
          
          // Clear payment intent from localStorage
          localStorage.removeItem('payment-intent');
          
        } else {
          console.error('❌ Failed to update Auth0 user metadata');
          throw new Error('Failed to update user metadata');
        }
      } else {
        throw new Error('Payment session not complete');
      }
    } catch (error) {
      console.error('Error handling payment success:', error);
      setError('Failed to process payment success');
      throw error;
    }
  };

  useEffect(() => {
    const handleStripeAuth = async () => {
      try {
        // Get URL parameters
        const sessionId = searchParams?.get("session_id");
        const plan = searchParams?.get("plan") || "Medium"; // Default to Medium for testing
        const period = searchParams?.get("period") || "monthly";
        
        console.log("URL Params:", { sessionId, plan, period });
        console.log("Plan from URL:", plan);
        
        // If session_id exists, handle payment success and update Auth0
        if (sessionId && userId) {
          console.log("Processing payment success with session ID:", sessionId);
          await handlePaymentSuccess(sessionId, plan, period);
        } else if (!sessionId) {
          console.log("No session ID found, showing success popup directly");
          
          // Create mock session data for success popup
          const mockSessionData = {
            plan_name: plan, // This should be the plan name from URL
            amount_total: getPlanAmount(plan, period),
            status: "complete",
            metadata: {
              plan_name: plan,
              billing_period: period
            }
          };
          
          console.log("Mock session data created:", mockSessionData);
          console.log("Plan name in mock data:", mockSessionData.plan_name);
          
          setSessionData(mockSessionData);
          setShowSuccessModal(true);
          setLoading(false);
          
          console.log("Mock session data created:", mockSessionData);
          return;
        }

        // If session_id exists, verify with backend
        const checkoutResponse = await fetch(
          `https://dev-api.findsocial.io/stripe-checkout-session?session_id=${sessionId}`
        );

        if (!checkoutResponse.ok) {
          throw new Error("Failed to verify checkout session");
        }

        const checkoutData = await checkoutResponse.json();
        console.log(checkoutData, "checkoutRes");

        if (checkoutData?.status === "complete") {
          // Get plan price details
          const priceResponse = await fetch(
            `https://dev-api.findsocial.io/stripe-plan-price?price_id=${checkoutData?.metadata?.productId}`
          );

          if (priceResponse.ok) {
            const priceData = await priceResponse.json();
            
            // Update user metadata with new subscription
            if (userId) {
              await updateUserSubscription(checkoutData, priceData);
            }

            // Set session data for modal
            setSessionData({
              ...checkoutData,
              plan_name: checkoutData?.metadata?.plan_name || "Premium",
              amount_total: checkoutData?.amount_total || 0,
              priceData
            });

            // Show success modal
            setShowSuccessModal(true);
          } else {
            console.error("Failed to get price data");
            setShowSuccessModal(true);
            setSessionData(checkoutData);
          }
        } else {
          setError("Payment was not completed successfully");
        }
      } catch (err) {
        console.error("Error handling stripe auth:", err);
        setError("An error occurred while processing your payment");
      } finally {
        setLoading(false);
      }
    };

    handleStripeAuth();
  }, [searchParams, userId]);

  // Debug useEffect to log sessionData changes
  useEffect(() => {
    if (sessionData) {
      console.log("Session data updated:", sessionData);
      console.log("Plan name being passed to modal:", sessionData?.plan_name);
    }
  }, [sessionData]);

  // Debug useEffect to log modal state
  useEffect(() => {
    if (showSuccessModal) {
      console.log("Success modal is open with data:", {
        planName: sessionData?.plan_name || "Premium",
        amount: (sessionData?.amount_total || 0) / 100
      });
    }
  }, [showSuccessModal, sessionData]);

  const updateUserSubscription = async (checkoutData: any, priceData: any) => {
    try {
      // Get user metadata
      const userMetadata = await getUserMetadata(userId || "");
      
      if (!userMetadata?.app_metadata?.stripe_customer_id) {
        console.error("No stripe customer ID found");
        return;
      }

      // Get subscription data to determine start date
      const subscriptionResponse = await fetch(
        `https://dev-api.findsocial.io/stripe-subscriptions?customer_id=${userMetadata.app_metadata.stripe_customer_id}`
      );
      
      let subscriptionData = null;
      if (subscriptionResponse.ok) {
        const subscriptions = await subscriptionResponse.json();
        subscriptionData = subscriptions[0]; // Get the first subscription
      }

      // Determine plan details based on price and interval
      const planInterval = priceData?.recurring?.interval || "month";
      const planAmount = priceData?.unit_amount || 0; // Amount in cents
      const planAmountInDollars = planAmount / 100;

      let subscriptionPlan = "Starter";
      let credits = 1000;
      let remainingCredits = 1000;

      // Map amount to plan based on our pricing structure
      if (planInterval === "month") {
        // Monthly plans
        if (planAmountInDollars === 25) {
          subscriptionPlan = "Starter";
          credits = 1000;
          remainingCredits = userMetadata?.user_metadata?.subscriptionPlan 
            ? 1000 + (userMetadata?.user_metadata?.remainingCredits || 0)
            : 1000;
        } else if (planAmountInDollars === 100) {
          subscriptionPlan = "Medium";
          credits = 10000;
          remainingCredits = userMetadata?.user_metadata?.subscriptionPlan 
            ? 10000 + (userMetadata?.user_metadata?.remainingCredits || 0)
            : 10000;
        } else if (planAmountInDollars === 200) {
          subscriptionPlan = "Pro";
          credits = 50000;
          remainingCredits = userMetadata?.user_metadata?.subscriptionPlan 
            ? 50000 + (userMetadata?.user_metadata?.remainingCredits || 0)
            : 50000;
        }
      } else if (planInterval === "year") {
        // Annual plans (usually discounted)
        if (planAmountInDollars === 250) { // $25 * 10 months equivalent
          subscriptionPlan = "Starter";
          credits = 12000; // 12 months worth
          remainingCredits = userMetadata?.user_metadata?.subscriptionPlan 
            ? 12000 + (userMetadata?.user_metadata?.remainingCredits || 0)
            : 12000;
        } else if (planAmountInDollars === 1000) { // $100 * 10 months equivalent
          subscriptionPlan = "Medium";
          credits = 120000; // 12 months worth
          remainingCredits = userMetadata?.user_metadata?.subscriptionPlan 
            ? 120000 + (userMetadata?.user_metadata?.remainingCredits || 0)
            : 120000;
        } else if (planAmountInDollars === 2000) { // $200 * 10 months equivalent
          subscriptionPlan = "Pro";
          credits = 600000; // 12 months worth
          remainingCredits = userMetadata?.user_metadata?.subscriptionPlan 
            ? 600000 + (userMetadata?.user_metadata?.remainingCredits || 0)
            : 600000;
        }
      }

      // Create user_metadata object like scrapper_frontend
      const user_metadata = {
        subscriptionPlan,
        remainingCredits,
        credits,
        month: subscriptionData?.start_date 
          ? (typeof subscriptionData.start_date === 'string' 
              ? new Date(subscriptionData.start_date) 
              : new Date(subscriptionData.start_date * 1000))
          : new Date(),
        result: 0,
        search: 0,
        billing_period: planInterval,
        last_payment_date: new Date(),
        payment_status: "active"
      };

      console.log("Updating Auth0 user metadata:", user_metadata);

      // Update Auth0 user metadata using our Auth0 management API
      const auth0UpdateResponse = await fetch('/api/auth0/update-metadata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          user_metadata: user_metadata
        })
      });

      if (auth0UpdateResponse.ok) {
        console.log("Successfully updated Auth0 user metadata");
        // Optionally refresh user data in your app state
      } else {
        console.error("Failed to update Auth0 user metadata");
      }
      
    } catch (error) {
      console.error("Error updating user subscription:", error);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    router.push("/Dashboard");
  };

  const handleGoToDashboard = () => {
    setShowSuccessModal(false);
    router.push("/Dashboard");
  };

  const handleViewBilling = () => {
    setShowSuccessModal(false);
    router.push("/PlanAndBilling");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7F56D9] mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing Payment...</h2>
          <p className="text-gray-600">Please wait while we confirm your payment.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7F56D9] mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>

      <PaymentSuccessModal
        isOpen={showSuccessModal}
        onClose={handleModalClose}
        planName={sessionData?.plan_name || "Premium"}
        amount={(sessionData?.amount_total || 0) / 100}
        onGoToDashboard={handleGoToDashboard}
        onViewBilling={handleViewBilling}
      />
    </>
  );
}