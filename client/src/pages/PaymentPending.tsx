import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PaymentPending() {
  const [, navigate] = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    // Auto-redirect to success after 5 seconds if payment was successful
    // In production, this would be triggered by a webhook callback
    const timer = setTimeout(() => {
      // Check if payment was confirmed via webhook
      // For now, just show the pending state
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const content = {
    en: {
      title: "Payment Processing",
      message: "Your payment is being processed.",
      waitMessage: "Please wait while we confirm your payment.",
      orderId: "Order ID",
      checkStatus: "Check Status",
      returnHome: "Return Home",
      note: "You will be notified once your payment is confirmed.",
    },
    ka: {
      title: "გადახდის დამუშავება",
      message: "თქვენი გადახდა დამუშავდება.",
      waitMessage: "გთხოვთ, დაელოდოთ თქვენი გადახდის დადასტურებას.",
      orderId: "შეკვეთის ID",
      checkStatus: "სტატუსის შემოწმება",
      returnHome: "მთავარ გვერდზე დაბრუნება",
      note: "თქვენ შეტყობინებას მიიღებთ, როდესაც თქვენი გადახდა დადასტურდება.",
    },
  };

  const t = content[language as keyof typeof content] || content.en;
  const orderId = new URLSearchParams(window.location.search).get("orderId");

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md p-8 text-center border-blue-200 shadow-lg">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Clock className="w-16 h-16 text-blue-500 animate-spin" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-blue-900 mb-4">{t.title}</h1>
          <p className="text-gray-600 mb-2">{t.message}</p>
          <p className="text-sm text-gray-500 mb-6">{t.waitMessage}</p>

          {orderId && (
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">{t.orderId}</p>
              <p className="text-lg font-mono font-bold text-blue-900">
                {orderId}
              </p>
            </div>
          )}

          <p className="text-sm text-blue-700 mb-8 italic">{t.note}</p>

          <div className="flex flex-col gap-3">
            <Button
              onClick={() => navigate("/profile")}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
            >
              {t.checkStatus}
            </Button>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="w-full border-blue-300 text-blue-900 hover:bg-blue-50"
            >
              {t.returnHome}
            </Button>
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
