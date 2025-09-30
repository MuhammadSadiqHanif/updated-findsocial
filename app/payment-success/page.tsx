"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Home, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userId } = useAuth();
  const [sessionData, setSessionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = searchParams?.get("session_id");
    
    if (sessionId) {
      // Verify payment session with backend
      verifyPaymentSession(sessionId);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const verifyPaymentSession = async (sessionId: string) => {
    try {
      const response = await fetch(
        `https://dev-api.findsocial.io/stripe-checkout-session?session_id=${sessionId}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setSessionData(data);
      }
    } catch (error) {
      console.error("Error verifying payment session:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToDashboard = () => {
    router.push("/Dashboard");
  };

  const handleViewBilling = () => {
    router.push("/PlanAndBilling");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7F56D9] mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#7F56D9]/5 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-xl border-0">
        <CardContent className="p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Thank you for your subscription. Your plan has been activated successfully.
          </p>

          {/* Payment Details */}
          {sessionData && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-2">Payment Details</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Plan:</span>
                  <span className="font-medium">{sessionData.plan_name || "Premium"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-medium">
                    ${(sessionData.amount_total / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="font-medium">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleGoToDashboard}
              className="w-full bg-[#7F56D9] hover:bg-[#6941C6] text-white h-12"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
            
            <Button 
              onClick={handleViewBilling}
              variant="outline"
              className="w-full border-[#7F56D9] text-[#7F56D9] hover:bg-[#7F56D9]/5 h-12"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              View Billing
            </Button>
          </div>

          {/* Footer */}
          <p className="text-xs text-gray-500 mt-6">
            You will receive a confirmation email shortly with your receipt.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}