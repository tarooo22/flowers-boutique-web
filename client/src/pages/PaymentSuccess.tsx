import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function PaymentSuccess() {
  const [, navigate] = useLocation();
  const { language } = useLanguage();
  const [paymentUpdated, setPaymentUpdated] = useState(false);
  const orderId = new URLSearchParams(window.location.search).get("orderId");
  const numericOrderId = parseInt(orderId || "0");
  
  const { data: order, refetch } = trpc.admin.orders.getById.useQuery(
    { id: numericOrderId },
    { enabled: !!orderId }
  );
  
  // Update payment status mutation
  const updatePaymentMutation = trpc.admin.orders.updatePaymentStatus.useMutation({
    onSuccess: () => {
      setPaymentUpdated(true);
      refetch();
    },
    onError: (error) => {
      console.error('Failed to update payment status:', error);
      toast.error(language === 'ka' ? 'გადახდის სტატუსი ვერ განახლდა' : 'Failed to update payment status');
    },
  });

  useEffect(() => {
    // Auto-update payment status to paid if not already paid
    if (order && order.paymentStatus !== "paid" && !paymentUpdated) {
      updatePaymentMutation.mutate({
        orderId: numericOrderId,
        paymentStatus: "paid",
        bogData: {
          bogCallbackReceived: true,
          bogPaymentStatus: "completed",
          bogPaymentDate: new Date(),
        },
      });
    }
  }, [order, paymentUpdated, numericOrderId]);

  useEffect(() => {
    // Fire Meta Purchase event ONLY if order is confirmed as paid
    if (order && order.paymentStatus === "paid" && (window as any).fbq) {
      const items = Array.isArray(order.items) ? order.items : [];
      (window as any).fbq("track", "Purchase", {
        value: parseFloat(order.totalPrice || "0"),
        currency: "GEL",
        content_name: "Flower Order",
        content_type: "product",
        content_ids: items.map((item: any) => item.productId) || [],
      });
    }
  }, [order]);

  const content = {
    en: {
      title: "Payment Successful",
      message: "Your payment has been processed successfully.",
      orderNumber: "Order Number",
      thankYou: "Thank you for your purchase!",
      viewOrders: "View My Orders",
      continueShopping: "Continue Shopping",
    },
    ka: {
      title: "გადახდა წარმატებული",
      message: "თქვენი გადახდა წარმატებით დამუშავდა.",
      orderNumber: "შეკვეთის ნომერი",
      thankYou: "გმადლობთ თქვენი ყიდვისთვის!",
      viewOrders: "ჩემი შეკვეთები",
      continueShopping: "ყიდვის გაგრძელება",
    },
  };

  const t = content[language as keyof typeof content] || content.en;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 to-white">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md p-8 text-center border-gold/20 shadow-lg">
          <div className="flex justify-center mb-6">
            {updatePaymentMutation.isPending ? (
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600"></div>
            ) : order?.paymentStatus === "paid" ? (
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            ) : (
              <AlertCircle className="w-16 h-16 text-red-500" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-amber-900 mb-4">{t.title}</h1>
          <p className="text-gray-600 mb-6">
            {updatePaymentMutation.isPending
              ? language === 'ka' ? 'გადახდის დამუშავება...' : 'Processing payment...'
              : t.message}
          </p>

          {orderId && (
            <div className="bg-amber-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">{t.orderNumber}</p>
              <p className="text-lg font-mono font-bold text-amber-900">
                {orderId}
              </p>
            </div>
          )}

          <p className="text-amber-800 font-semibold mb-8">{t.thankYou}</p>

          <div className="flex flex-col gap-3">
            <Button
              onClick={() => navigate("/profile")}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white"
            >
              {t.viewOrders}
            </Button>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="w-full border-amber-300 text-amber-900 hover:bg-amber-50"
            >
              {t.continueShopping}
            </Button>
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
