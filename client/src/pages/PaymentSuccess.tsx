import { useRef } from "react";
import { useLocation } from "wouter";
import { AlertCircle, CheckCircle2, Clock3, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";

const FINAL_STATUSES = new Set(["paid", "failed"]);
const POLL_WINDOW_MS = 60_000;

export default function PaymentSuccess() {
  const [, navigate] = useLocation();
  const { language } = useLanguage();
  const pollingStartedAt = useRef(Date.now());
  const orderId = new URLSearchParams(window.location.search).get("orderId") ?? "";
  const validOrderId = /^FLR-\d{6,}$/.test(orderId);

  const paymentQuery = trpc.payments.getPaymentStatus.useQuery(
    { orderId },
    {
      enabled: validOrderId,
      retry: 1,
      refetchInterval: query => {
        const status = query.state.data?.status;
        if (status && FINAL_STATUSES.has(status)) return false;
        if (Date.now() - pollingStartedAt.current >= POLL_WINDOW_MS) return false;
        return 3_000;
      },
    },
  );

  const status = paymentQuery.data?.status ?? "pending";
  const ka = language === "ka";
  const copy = {
    pending: {
      title: ka ? "გადახდა მოწმდება" : "Payment is being verified",
      message: ka
        ? "ბანკის საბოლოო პასუხს ველოდებით. ეს გვერდი გადახდის სტატუსს მხოლოდ კითხულობს."
        : "We are waiting for the bank's final response. This page only reads payment status.",
    },
    processing: {
      title: ka ? "გადახდა მუშავდება" : "Payment is processing",
      message: ka
        ? "ბანკმა გადახდა მიიღო და ამუშავებს. სტატუსი ავტომატურად განახლდება."
        : "The bank received the payment and is processing it. The status will refresh automatically.",
    },
    paid: {
      title: ka ? "გადახდა დადასტურებულია" : "Payment confirmed",
      message: ka
        ? "გადახდა ბანკის სანდო პასუხით დადასტურდა. მადლობა შეკვეთისთვის."
        : "The payment was confirmed by the bank. Thank you for your order.",
    },
    failed: {
      title: ka ? "გადახდა ვერ დადასტურდა" : "Payment was not confirmed",
      message: ka
        ? "გადახდა უარყოფილია ან ვერ დასრულდა. შეგიძლიათ სტატუსი ხელახლა შეამოწმოთ."
        : "The payment was rejected or could not be completed. You can refresh the status.",
    },
  }[status];

  const invalidOrUnavailable = !validOrderId || paymentQuery.isError;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 to-white">
      <Navbar />
      <main id="main-content" className="flex-1 flex items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md p-8 text-center border-gold/20 shadow-lg">
          <div className="flex justify-center mb-6" aria-live="polite">
            {paymentQuery.isLoading || paymentQuery.isFetching ? (
              <Loader2 className="w-16 h-16 animate-spin text-amber-700" aria-hidden="true" />
            ) : invalidOrUnavailable || status === "failed" ? (
              <AlertCircle className="w-16 h-16 text-red-600" aria-hidden="true" />
            ) : status === "paid" ? (
              <CheckCircle2 className="w-16 h-16 text-green-600" aria-hidden="true" />
            ) : (
              <Clock3 className="w-16 h-16 text-amber-700" aria-hidden="true" />
            )}
          </div>

          <h1 className="text-3xl font-bold text-amber-900 mb-4">
            {invalidOrUnavailable
              ? ka ? "სტატუსი ვერ მოიძებნა" : "Status unavailable"
              : copy.title}
          </h1>
          <p className="text-gray-700 mb-6">
            {invalidOrUnavailable
              ? ka
                ? "შეკვეთის ნომერი არასწორია ან ამ შეკვეთაზე წვდომა არ გაქვთ."
                : "The order number is invalid or you do not have access to this order."
              : copy.message}
          </p>

          {orderId && (
            <div className="bg-amber-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">{ka ? "შეკვეთის ნომერი" : "Order number"}</p>
              <p className="text-lg font-mono font-bold text-amber-900">{orderId}</p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {validOrderId && status !== "paid" && (
              <Button
                type="button"
                variant="outline"
                onClick={() => void paymentQuery.refetch()}
                disabled={paymentQuery.isFetching}
                className="w-full border-amber-300 text-amber-900 hover:bg-amber-50"
              >
                <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
                {ka ? "სტატუსის განახლება" : "Refresh status"}
              </Button>
            )}
            <Button
              type="button"
              onClick={() => navigate("/profile")}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white"
            >
              {ka ? "ჩემი შეკვეთები" : "View my orders"}
            </Button>
            <Button
              type="button"
              onClick={() => navigate("/")}
              variant="outline"
              className="w-full border-amber-300 text-amber-900 hover:bg-amber-50"
            >
              {ka ? "მთავარ გვერდზე დაბრუნება" : "Return to shop"}
            </Button>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
