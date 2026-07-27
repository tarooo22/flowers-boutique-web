import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { XCircle, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function PaymentFail() {
  const [, navigate] = useLocation();
  const { language } = useLanguage();
  const [isReconciling, setIsReconciling] = useState(true);
  const [reconciliationAttempts, setReconciliationAttempts] = useState(0);
  const orderId = new URLSearchParams(window.location.search).get("orderId");
  const numericOrderId = parseInt(orderId || "0");
  
  const { data: order, refetch, isLoading } = trpc.admin.orders.getById.useQuery(
    { id: numericOrderId },
    { enabled: !!orderId }
  );

  // Georgian failure reason messages
  const failureReasons: Record<string, { ka: string; en: string }> = {
    "insufficient_funds": {
      ka: "ანგარიშზე არასაკმარისი თანხაა",
      en: "Insufficient funds"
    },
    "expired": {
      ka: "გადახდის დრო ამოიწურა",
      en: "Payment expired"
    },
    "rejected": {
      ka: "გადახდა ვერ შესრულდა",
      en: "Payment rejected"
    },
    "cancelled": {
      ka: "გადახდა გაუქმდა",
      en: "Payment cancelled"
    },
    "unknown": {
      ka: "ბანკმა გადახდა ვერ დაადასტურა",
      en: "Bank could not confirm payment"
    }
  };

  const getFailureMessage = (reason?: string | null): string => {
    if (!reason) {
      return language === 'ka' ? 'გადახდა ვერ შესრულდა' : 'Payment failed';
    }
    
    // Try to match the reason to a known failure type
    const reasonKey = reason.toLowerCase().replace(/\s+/g, '_');
    const message = failureReasons[reasonKey];
    
    if (message) {
      return message[language as keyof typeof message] || reason;
    }
    
    // Return the raw reason if no match found
    return reason;
  };

  const content = {
    en: {
      title: "Payment Failed",
      message: "Your payment could not be processed.",
      reconciling: "Verifying payment status...",
      reason: "Reason",
      orderNumber: "Order Number",
      tryAgain: "Try Again",
      continueShopping: "Continue Shopping",
      contactSupport: "Contact Support",
      status: "Status",
      pending: "Pending",
      failed: "Failed",
      paid: "Paid",
    },
    ka: {
      title: "გადახდა ვერ შესრულდა",
      message: "თქვენი გადახდა ვერ დამუშავდა.",
      reconciling: "გადახდის სტატუსის შემოწმება...",
      reason: "მიზეზი",
      orderNumber: "შეკვეთის ნომერი",
      tryAgain: "ხელახლა სცადეთ",
      continueShopping: "ყიდვის გაგრძელება",
      contactSupport: "დაუკავშირდით მხარდამჭერს",
      status: "სტატუსი",
      pending: "მოლოდინში",
      failed: "ვერ შესრულდა",
      paid: "გადახდილია",
    },
  };

  const t = content[language as keyof typeof content] || content.en;

  // Reconciliation polling: check if callback arrived or payment succeeded
  useEffect(() => {
    if (!order || !isReconciling) return;

    // If order status is no longer pending, stop reconciling
    if (order.paymentStatus === 'paid') {
      setIsReconciling(false);
      toast.success(language === 'ka' ? 'გადახდა დადასტურდა!' : 'Payment confirmed!');
      setTimeout(() => navigate('/'), 2000);
      return;
    }

    if (order.paymentStatus === 'failed') {
      setIsReconciling(false);
      return;
    }

    // Maximum 20 seconds of reconciliation attempts (every 2 seconds)
    if (reconciliationAttempts >= 10) {
      setIsReconciling(false);
      return;
    }

    // Poll every 2 seconds
    const timer = setTimeout(() => {
      setReconciliationAttempts(prev => prev + 1);
      refetch();
    }, 2000);

    return () => clearTimeout(timer);
  }, [order, isReconciling, reconciliationAttempts, refetch, navigate, language]);

  // Determine status display text
  const getStatusText = (): string => {
    if (isReconciling) {
      return t.reconciling;
    }
    
    switch (order?.paymentStatus) {
      case 'paid':
        return t.paid;
      case 'failed':
        return t.failed;
      default:
        return t.pending;
    }
  };

  // Show loading state during initial query
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-red-50 to-white">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 py-16">
          <Card className="w-full max-w-md p-8 text-center">
            <div className="animate-pulse text-gray-400">
              {t.reconciling}
            </div>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-red-50 to-white">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md p-8 text-center border-red-200 shadow-lg">
          <div className="flex justify-center mb-6">
            {order?.paymentStatus === 'paid' ? (
              <div className="text-green-500">✓</div>
            ) : (
              <XCircle className="w-16 h-16 text-red-500" />
            )}
          </div>

          <h1 className="text-3xl font-bold text-red-700 mb-4">
            {order?.paymentStatus === 'paid' ? 
              (language === 'ka' ? 'გადახდა დადასტურდა' : 'Payment Confirmed') :
              t.title
            }
          </h1>
          
          <p className="text-gray-600 mb-6">
            {isReconciling ? t.reconciling : t.message}
          </p>

          {orderId && (
            <div className="bg-red-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">{t.orderNumber}</p>
              <p className="text-lg font-mono font-bold text-red-700">
                {orderId}
              </p>
            </div>
          )}

          {/* Display failure reason if available */}
          {order?.paymentFailureReason && order.paymentStatus === 'failed' && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-sm font-semibold text-amber-900 mb-1">{t.reason}</p>
                <p className="text-sm text-amber-800">
                  {getFailureMessage(order.paymentFailureReason)}
                </p>
              </div>
            </div>
          )}

          {/* Display current status */}
          {isReconciling && (
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">{t.status}</p>
              <p className="text-sm font-semibold text-blue-700 animate-pulse">
                {getStatusText()}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {order?.paymentStatus !== 'paid' && (
              <Button
                onClick={() => navigate("/checkout")}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white"
              >
                {t.tryAgain}
              </Button>
            )}
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="w-full border-amber-300 text-amber-900 hover:bg-amber-50"
            >
              {t.continueShopping}
            </Button>
            <Button
              onClick={() => navigate("/contact")}
              variant="outline"
              className="w-full border-red-300 text-red-700 hover:bg-red-50"
            >
              {t.contactSupport}
            </Button>
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
