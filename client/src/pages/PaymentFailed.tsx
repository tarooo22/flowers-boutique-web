import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { XCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PaymentFailed() {
  const [, navigate] = useLocation();
  const { language } = useLanguage();

  const content = {
    en: {
      title: "Payment Failed",
      message: "Unfortunately, your payment could not be processed.",
      reason: "Reason",
      tryAgain: "Try Again",
      contactSupport: "Contact Support",
      returnHome: "Return Home",
    },
    ka: {
      title: "გადახდა ვერ მოხერხდა",
      message: "სამწუხაროდ, თქვენი გადახდა ვერ დამუშავდა.",
      reason: "მიზეზი",
      tryAgain: "ხელახლა სცადეთ",
      contactSupport: "დაკონტაქტეთ მხარდამჭერი",
      returnHome: "მთავარ გვერდზე დაბრუნება",
    },
  };

  const t = content[language as keyof typeof content] || content.en;
  const errorReason =
    new URLSearchParams(window.location.search).get("reason") ||
    "Unknown error";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-red-50 to-white">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md p-8 text-center border-red-200 shadow-lg">
          <div className="flex justify-center mb-6">
            <XCircle className="w-16 h-16 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-red-900 mb-4">{t.title}</h1>
          <p className="text-gray-600 mb-6">{t.message}</p>

          {errorReason && (
            <div className="bg-red-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">{t.reason}</p>
              <p className="text-sm text-red-700 font-semibold">{errorReason}</p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button
              onClick={() => navigate("/checkout")}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
            >
              {t.tryAgain}
            </Button>
            <Button
              onClick={() => navigate("/contact")}
              variant="outline"
              className="w-full border-red-300 text-red-900 hover:bg-red-50"
            >
              {t.contactSupport}
            </Button>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="w-full border-gray-300 text-gray-900 hover:bg-gray-50"
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
