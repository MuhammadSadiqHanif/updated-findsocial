"use client";

import { useState } from "react";
import { CheckCircle, X, Home, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName?: string;
  amount?: number;
  onGoToDashboard?: () => void;
  onViewBilling?: () => void;
}

export function PaymentSuccessModal({
  isOpen,
  onClose,
  planName = "Premium",
  amount = 0,
  onGoToDashboard,
  onViewBilling,
}: PaymentSuccessModalProps) {
  
  // Debug log
  console.log("PaymentSuccessModal props:", { isOpen, planName, amount });
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 gap-0">
        <div className="relative p-8 text-center">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          {/* Success Message */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {planName} Plan Activated!
          </h2>
          
          <p className="text-gray-600 mb-6">
            Thank you for your subscription. Your {planName} plan has been activated successfully.
          </p>

          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-2">Payment Details</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Plan:</span>
                <span className="font-medium">{planName}</span>
              </div>
              {/* <div className="flex justify-between">
                <span>Amount:</span>
                <span className="font-medium">${amount.toFixed(2)}</span>
              </div> */}
              <div className="flex justify-between">
                <span>Date:</span>
                <span className="font-medium">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={onGoToDashboard}
              className="cursor-pointer w-full bg-[#7F56D9] hover:bg-[#6941C6] text-white h-12"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
            
            <Button 
              onClick={onViewBilling}
              variant="outline"
              className="cursor-pointer w-full border-[#7F56D9] text-[#7F56D9] hover:bg-[#7F56D9]/5 h-12"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              View Billing
            </Button>
          </div>

          {/* Footer */}
          <p className="text-xs text-gray-500 mt-6">
            You will receive a confirmation email shortly with your receipt.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}