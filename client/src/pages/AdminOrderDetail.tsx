import { useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/_core/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Trash2, X, ArrowLeft, Package, MapPin, CreditCard, Clock, AlertCircle } from 'lucide-react';

const PAYMENT_STATUS_KA: Record<string, string> = {
  pending_payment: 'გადახდის მოლოდინში',
  paid: 'გადახდილია',
  failed: 'ვერ შესრულდა',
  cancelled: 'გაუქმებულია',
  refunded: 'თანხა დაბრუნებულია',
};

const PAYMENT_STATUS_EN: Record<string, string> = {
  pending_payment: 'Pending Payment',
  paid: 'Paid',
  failed: 'Failed',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

const DELIVERY_STATUS_KA: Record<string, string> = {
  new: 'ახალი შეკვეთა',
  processing: 'მუშავდება',
  preparing: 'მზადდება',
  courier: 'კურიერს გადაეცა',
  delivered: 'მიტანილია',
  cancelled: 'გაუქმებულია',
};

const DELIVERY_STATUS_EN: Record<string, string> = {
  new: 'New Order',
  processing: 'Processing',
  preparing: 'Preparing',
  courier: 'With Courier',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const PAYMENT_METHOD_KA: Record<string, string> = {
  whatsapp: 'WhatsApp',
  cash: 'ნაღდი ფული',
  card: 'საქართველოს ბანკი',
  bank_transfer: 'ბანკის გადარიცხვა',
};

const PAYMENT_METHOD_EN: Record<string, string> = {
  whatsapp: 'WhatsApp',
  cash: 'Cash',
  card: 'Bank of Georgia',
  bank_transfer: 'Bank Transfer',
};

const PAYMENT_STATUS_COLOR: Record<string, string> = {
  pending_payment: 'bg-amber-50 text-amber-700 border border-amber-200',
  paid: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  failed: 'bg-red-50 text-red-700 border border-red-200',
  cancelled: 'bg-slate-50 text-slate-700 border border-slate-200',
  refunded: 'bg-blue-50 text-blue-700 border border-blue-200',
};

const DELIVERY_STATUS_COLOR: Record<string, string> = {
  new: 'bg-blue-50 text-blue-700 border border-blue-200',
  processing: 'bg-orange-50 text-orange-700 border border-orange-200',
  preparing: 'bg-purple-50 text-purple-700 border border-purple-200',
  courier: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
  delivered: 'bg-green-50 text-green-700 border border-green-200',
  cancelled: 'bg-gray-50 text-gray-700 border border-gray-200',
};

export default function AdminOrderDetail() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { language } = useLanguage();
  const params = useParams();
  const orderId = parseInt(params?.id || '0');

  const [newDeliveryStatus, setNewDeliveryStatus] = useState<string>('');
  const [adminComment, setAdminComment] = useState('');
  const [isUpdatingDelivery, setIsUpdatingDelivery] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isDeletingOrder, setIsDeletingOrder] = useState(false);
  const [isCancellingOrder, setIsCancellingOrder] = useState(false);
  const [isReconciling, setIsReconciling] = useState(false);

  const translations = {
    en: {
      back: 'Back to Orders',
      order: 'Order',
      customerInfo: 'Customer Information',
      deliveryInfo: 'Delivery Information',
      orderItems: 'Order Items',
      paymentInfo: 'Payment Information',
      orderHistory: 'Order History',
      deliveryStatus: 'Delivery Status',
      currentStatus: 'Current Status',
      updateStatus: 'Update Status',
      selectStatus: 'Select new status...',
      adminNotes: 'Admin Notes',
      updateButton: 'Update Status',
      updating: 'Updating...',
      orderDate: 'Order Date',
      lastUpdated: 'Last Updated',
      totalAmount: 'Total Amount',
      noItems: 'No items in this order',
      paymentMethod: 'Payment Method',
      paymentStatus: 'Payment Status',
      bogOrderId: 'BOG Order ID',
      transactionId: 'Transaction ID',
      bogPaymentStatus: 'BOG Payment Status',
      paymentDate: 'Payment Date',
      callbackReceived: 'Callback Received',
      yes: 'Yes',
      no: 'No',
      actions: 'Actions',
      cancel: 'Cancel Order',
      delete: 'Delete Order',
      deleteConfirm: 'Are you sure you want to delete this order?',
      deleteWarning: 'This action cannot be undone.',
      cancelConfirm: 'Are you sure you want to cancel this order?',
      cancelWarning: 'For paid orders, ensure refund is processed first.',
      confirmDelete: 'Delete',
      confirmCancel: 'Cancel Order',
      cancelButton: 'Cancel',
      orderDeleted: 'Order deleted successfully',
      orderCancelled: 'Order cancelled successfully',
      statusUpdated: 'Status updated successfully',
      errorUpdating: 'Failed to update status',
      errorDeleting: 'Failed to delete order',
      errorCancelling: 'Failed to cancel order',
      createdAt: 'Order Created',
      statusChanged: 'Status Changed',
      notesAdded: 'Admin Notes Added',
      name: 'Name',
      phone: 'Phone',
      email: 'Email',
      recipientName: 'Recipient Name',
      recipientPhone: 'Recipient Phone',
      address: 'Delivery Address',
      deliveryDate: 'Delivery Date',
      deliveryTime: 'Delivery Time',
      giftMessage: 'Gift Message',
      product: 'Product',
      quantity: 'Quantity',
      price: 'Price',
      total: 'Total',
      notSpecified: 'Not specified',
      summary: 'Order Summary',
      bankPaymentInfo: 'Bank Payment Information',
      orderNumber: 'Order Number',
      bogExternalOrderId: 'BOG External Order ID',
      paymentAmount: 'Payment Amount',
      paidAmount: 'Paid Amount',
      currency: 'Currency',
      rrn: 'RRN / Transaction ID',
      authorizationCode: 'Authorization Code',
      payerIdentifier: 'Masked Payer Identifier',
      paymentTime: 'Payment Time',
      lastSyncTime: 'Last Sync Time',
      failureReason: 'Failure Reason',
      reconcileButton: 'Update Status from BOG',
      reconciling: 'Updating...',
      reconcileSuccess: 'Status updated successfully',
      reconcileError: 'Failed to update status',
    },
    ka: {
      back: 'შეკვეთებში დაბრუნება',
      order: 'შეკვეთა',
      customerInfo: 'მომხმარებლის ინფორმაცია',
      deliveryInfo: 'მიტანის ინფორმაცია',
      orderItems: 'შეკვეთის პროდუქტები',
      paymentInfo: 'გადახდის ინფორმაცია',
      orderHistory: 'შეკვეთის ისტორია',
      deliveryStatus: 'მიტანის სტატუსი',
      currentStatus: 'მიმდინარე სტატუსი',
      updateStatus: 'სტატუსის განახლება',
      selectStatus: 'აირჩიეთ ახალი სტატუსი...',
      adminNotes: 'ადმინისტრატორის შენიშვნა',
      updateButton: 'სტატუსის განახლება',
      updating: 'განახლდება...',
      orderDate: 'შეკვეთის თარიღი',
      lastUpdated: 'ბოლო განახლება',
      totalAmount: 'ჯამური თანხა',
      noItems: 'ამ შეკვეთაში ელემენტები არ არის',
      paymentMethod: 'გადახდის მეთოდი',
      paymentStatus: 'გადახდის სტატუსი',
      bogOrderId: 'BOG შეკვეთის ID',
      transactionId: 'ტრანზაქციის ID',
      bogPaymentStatus: 'BOG გადახდის სტატუსი',
      paymentDate: 'გადახდის თარიღი',
      callbackReceived: 'კოლბეკი მიღებული',
      yes: 'დიახ',
      no: 'არა',
      actions: 'მოქმედებები',
      cancel: 'შეკვეთის გაუქმება',
      delete: 'შეკვეთის წაშლა',
      deleteConfirm: 'დარწმუნებული ხართ, რომ გსურთ ამ შეკვეთის წაშლა?',
      deleteWarning: 'ეს მოქმედება შეუქცევადია.',
      cancelConfirm: 'დარწმუნებული ხართ, რომ გსურთ ამ შეკვეთის გაუქმება?',
      cancelWarning: 'გადახდილი შეკვეთებისთვის დარწმუნდით, რომ დაბრუნება დამუშავდა.',
      confirmDelete: 'წაშლა',
      confirmCancel: 'გაუქმება',
      cancelButton: 'გაუქმება',
      orderDeleted: 'შეკვეთა წაშლილია',
      orderCancelled: 'შეკვეთა გაუქმებულია',
      statusUpdated: 'სტატუსი განახლდა',
      errorUpdating: 'სტატუსის განახლება ვერ მოხერხდა',
      errorDeleting: 'შეკვეთის წაშლა ვერ მოხერხდა',
      errorCancelling: 'შეკვეთის გაუქმება ვერ მოხერხდა',
      createdAt: 'შეკვეთა შეიქმნა',
      statusChanged: 'სტატუსი შეიცვალა',
      notesAdded: 'შენიშვნა დამატებული',
      name: 'სახელი',
      phone: 'ტელეფონი',
      email: 'ელ-ფოსტა',
      recipientName: 'მიმღების სახელი',
      recipientPhone: 'მიმღების ტელეფონი',
      address: 'მიტანის მისამართი',
      deliveryDate: 'მიტანის თარიღი',
      deliveryTime: 'მიტანის დრო',
      giftMessage: 'საჩუქრის შეტყობინება',
      product: 'პროდუქტი',
      quantity: 'რაოდენობა',
      price: 'ფასი',
      total: 'სულ',
      notSpecified: 'არ არის მითითებული',
      summary: 'შეკვეთის შეჯამება',
      bankPaymentInfo: 'ბანკის გადახდის ინფორმაცია',
      orderNumber: 'საიტის შეკვეთის ნომერი',
      bogExternalOrderId: 'BOG გარე შეკვეთის ID',
      paymentAmount: 'გადახდის თანხა',
      paidAmount: 'გადახდილი თანხა',
      currency: 'ვალუტა',
      rrn: 'RRN / ტრანზაქციის ID',
      authorizationCode: 'ავტორიზაციის კოდი',
      payerIdentifier: 'გადახდის მომხმარებლის მასკირებული ID',
      paymentTime: 'გადახდის დრო',
      lastSyncTime: 'ბოლო სინქრონიზაციის დრო',
      failureReason: 'უარყოფის მიზეზი',
      reconcileButton: 'სტატუსის განახლება BOG-დან',
      reconciling: 'განახლდება...',
      reconcileSuccess: 'სტატუსი წარმატებით განახლდა',
      reconcileError: 'სტატუსის განახლება ვერ მოხერხდა',
    },
  };

  const t = translations[language as keyof typeof translations] || translations.en;
  const PAYMENT_STATUS = language === 'ka' ? PAYMENT_STATUS_KA : PAYMENT_STATUS_EN;
  const DELIVERY_STATUS = language === 'ka' ? DELIVERY_STATUS_KA : DELIVERY_STATUS_EN;
  const PAYMENT_METHOD = language === 'ka' ? PAYMENT_METHOD_KA : PAYMENT_METHOD_EN;

  const { data: order, isLoading, error, refetch } = trpc.admin.orders.getById.useQuery({ id: orderId });
  const utils = trpc.useUtils();
  
  const updateDeliveryStatusMutation = trpc.admin.orders.updateDeliveryStatus.useMutation({
    onSuccess: () => {
      toast.success(t.statusUpdated);
      setNewDeliveryStatus('');
      setAdminComment('');
      setIsUpdatingDelivery(false);
      refetch();
      utils.admin.orders.list.invalidate();
      utils.admin.orders.stats.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || t.errorUpdating);
      setIsUpdatingDelivery(false);
    },
  });

  const cancelOrderMutation = trpc.admin.orders.cancelOrder.useMutation({
    onSuccess: () => {
      toast.success(t.orderCancelled);
      setShowCancelConfirm(false);
      setIsCancellingOrder(false);
      utils.admin.orders.list.invalidate();
      utils.admin.orders.stats.invalidate();
      setTimeout(() => navigate('/admin/orders'), 500);
    },
    onError: (error) => {
      toast.error(error.message || t.errorCancelling);
      setIsCancellingOrder(false);
    },
  });

  const deleteOrderMutation = trpc.admin.orders.deleteOrder.useMutation({
    onSuccess: () => {
      toast.success(t.orderDeleted);
      setShowDeleteConfirm(false);
      setIsDeletingOrder(false);
      utils.admin.orders.list.invalidate();
      utils.admin.orders.stats.invalidate();
      setTimeout(() => navigate('/admin/orders'), 500);
    },
    onError: (error) => {
      toast.error(error.message || t.errorDeleting);
      setIsDeletingOrder(false);
    },
  });

  const reconcileFromBOGMutation = trpc.admin.orders.reconcileFromBOG.useMutation({
    onSuccess: () => {
      toast.success(t.reconcileSuccess);
      setIsReconciling(false);
      refetch();
      utils.admin.orders.list.invalidate();
      utils.admin.orders.stats.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || t.reconcileError);
      setIsReconciling(false);
    },
  });

  const handleDeleteOrderClick = async () => {
    setIsDeletingOrder(true);
    try {
      await deleteOrderMutation.mutateAsync({ orderId });
    } catch (error: any) {
      toast.error(error.message || t.errorDeleting);
      setIsDeletingOrder(false);
    }
  };

  const handleCancelOrderClick = async () => {
    setIsCancellingOrder(true);
    try {
      await cancelOrderMutation.mutateAsync({ orderId });
    } catch (error: any) {
      toast.error(error.message || t.errorCancelling);
      setIsCancellingOrder(false);
    }
  };

  const handleReconcileFromBOG = async () => {
    setIsReconciling(true);
    try {
      await reconcileFromBOGMutation.mutateAsync({ orderId });
    } catch (error: any) {
      toast.error(error.message || t.reconcileError);
      setIsReconciling(false);
    }
  };

  const handleUpdateDeliveryStatus = async () => {
    if (!newDeliveryStatus) {
      toast.error('Please select a delivery status');
      return;
    }

    setIsUpdatingDelivery(true);
    await updateDeliveryStatusMutation.mutateAsync({
      orderId,
      deliveryStatus: newDeliveryStatus as any,
      additionalComment: adminComment || undefined,
    });
  };

  if (user?.role !== 'admin') {
    return (
      <div className="admin-page min-h-screen bg-[#F5F2EE] p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-500">Unauthorized</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="admin-page min-h-screen bg-[#F5F2EE] p-6 flex items-center justify-center">
        <Spinner className="w-8 h-8 text-amber-700" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="admin-page min-h-screen bg-[#F5F2EE] p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-red-500">{error?.message || 'Order not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <div className="admin-page min-h-screen bg-[#F5F2EE] p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            onClick={() => navigate('/admin/orders')}
            variant="outline"
            className="border-[#8B6F47] text-[#8B6F47] hover:bg-white hover:border-[#A0845C] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.back}
          </Button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#1C1C1C]">
                {t.order} #{order.orderNumber || order.id}
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                {new Date(order.createdAt).toLocaleDateString(language === 'ka' ? 'ka-GE' : 'en-US')}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Badge className={`text-xs font-medium ${PAYMENT_STATUS_COLOR[order.paymentStatus as string] || 'bg-gray-100 text-gray-800'}`}>
                {PAYMENT_STATUS[order.paymentStatus as string] || order.paymentStatus}
              </Badge>
              <Badge className={`text-xs font-medium ${DELIVERY_STATUS_COLOR[(order.deliveryStatus || 'new') as string]}`}>
                {DELIVERY_STATUS[(order.deliveryStatus || 'new') as string]}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-base text-[#1C1C1C]">{t.customerInfo}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">მომხმარებლის სახელი</p>
                    <p className="font-semibold text-[#1C1C1C] mt-1">{(order as any).customerName || t.notSpecified}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">ტელეფონის ნომერი</p>
                    <p className="font-semibold text-[#1C1C1C] mt-1">{(order as any).customerPhone || t.notSpecified}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">ელფოსტა</p>
                    <p className="font-semibold text-[#1C1C1C] mt-1">{(order as any).customerEmail || t.notSpecified}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Information */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <MapPin className="w-5 h-5 text-orange-600" />
                  </div>
                  <CardTitle className="text-base text-[#1C1C1C]">{t.deliveryInfo}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">{t.address}</p>
                  <p className="font-semibold text-[#1C1C1C] mt-1">{order.deliveryAddress}</p>
                </div>
                {order.latitude && order.longitude && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs text-gray-600 font-medium uppercase tracking-wide mb-2">მდებარეობა</p>
                        <div className="text-sm text-gray-700 font-mono space-y-1">
                          <div>Lat: {parseFloat(order.latitude.toString()).toFixed(6)}</div>
                          <div>Lon: {parseFloat(order.longitude.toString()).toFixed(6)}</div>
                        </div>
                      </div>
                      <a
                        href={`https://www.openstreetmap.org/?mlat=${order.latitude}&mlon=${order.longitude}&zoom=17`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded text-sm font-medium transition-colors whitespace-nowrap"
                      >
                        რუკაზე
                      </a>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">{t.deliveryDate}</p>
                    <p className="font-semibold text-[#1C1C1C] mt-1">{order.deliveryDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">{t.deliveryTime}</p>
                    <p className="font-semibold text-[#1C1C1C] mt-1">{order.deliveryTime || t.notSpecified}</p>
                  </div>
                </div>
                {(order.building || order.entrance || order.apartment) && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-600 font-medium uppercase tracking-wide mb-2">დამაგებითი ინფორმაცია</p>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      {order.building && (
                        <div>
                          <span className="text-gray-600">კორპუსი:</span>
                          <p className="font-semibold text-[#1C1C1C]">{order.building}</p>
                        </div>
                      )}
                      {order.entrance && (
                        <div>
                          <span className="text-gray-600">დადარბაზო:</span>
                          <p className="font-semibold text-[#1C1C1C]">{order.entrance}</p>
                        </div>
                      )}
                      {order.apartment && (
                        <div>
                          <span className="text-gray-600">ბინა:</span>
                          <p className="font-semibold text-[#1C1C1C]">{order.apartment}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {order.giftMessage && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">{t.giftMessage}</p>
                    <p className="text-gray-900 mt-1 bg-gray-50 p-3 rounded text-sm">{order.giftMessage}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Package className="w-5 h-5 text-purple-600" />
                  </div>
                  <CardTitle className="text-base text-[#1C1C1C]">{t.orderItems}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {items.length > 0 ? (
                    items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-start py-4 border-b last:border-b-0">
                        <div className="flex-1">
                          <p className="font-semibold text-[#1C1C1C]">{item.productName || `${t.product} #${item.productId}`}</p>
                          {item.selectedColorNameEn && (
                            <p className="text-xs text-gray-600 mt-1">
                              {item.selectedColorNameKa || item.selectedColorNameEn}
                            </p>
                          )}
                          <p className="text-sm text-gray-600 mt-1">{t.quantity}: {item.quantity}</p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-semibold text-[#1C1C1C]">₾{parseFloat(item.price || '0').toFixed(2)}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            ₾{(parseFloat(item.price || '0') * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600 text-sm py-4">{t.noItems}</p>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                  <p className="font-semibold text-[#1C1C1C] uppercase text-xs tracking-wide">{t.total}</p>
                  <p className="text-2xl font-bold text-[#8B6F47]">₾{parseFloat(order.totalPrice || '0').toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <CreditCard className="w-5 h-5 text-emerald-600" />
                  </div>
                  <CardTitle className="text-base text-[#1C1C1C]">{t.paymentInfo}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">{t.paymentMethod}</p>
                    <p className="font-semibold text-[#1C1C1C] mt-1">
                      {order.paymentMethod ? PAYMENT_METHOD[order.paymentMethod as keyof typeof PAYMENT_METHOD] || order.paymentMethod : t.notSpecified}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">{t.paymentStatus}</p>
                    <Badge className={`text-xs font-medium mt-1 ${PAYMENT_STATUS_COLOR[order.paymentStatus as string] || 'bg-gray-100 text-gray-800'}`}>
                      {PAYMENT_STATUS[order.paymentStatus as string] || order.paymentStatus}
                    </Badge>
                  </div>
                </div>

                {/* BOG Payment Details */}
                {order.paymentMethod === 'card' && (
                  <div className="pt-4 border-t border-gray-200 space-y-4">
                    <p className="font-semibold text-[#1C1C1C] text-sm">{t.bankPaymentInfo}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      {order.orderNumber && (
                        <div>
                          <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">{t.orderNumber}</p>
                          <p className="font-medium text-gray-900 mt-1">#{order.orderNumber}</p>
                        </div>
                      )}
                      {order.bogExternalOrderId && (
                        <div>
                          <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">{t.bogExternalOrderId}</p>
                          <p className="font-medium text-gray-900 break-all text-xs mt-1">{order.bogExternalOrderId}</p>
                        </div>
                      )}
                      {order.bogOrderId && (
                        <div>
                          <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">{t.bogOrderId}</p>
                          <p className="font-medium text-gray-900 break-all text-xs mt-1">{order.bogOrderId.substring(0, 8)}...{order.bogOrderId.substring(order.bogOrderId.length - 4)}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">{t.paymentAmount}</p>
                        <p className="font-medium text-gray-900 mt-1">₾{parseFloat(order.totalPrice || '0').toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">{t.currency}</p>
                        <p className="font-medium text-gray-900 mt-1">GEL</p>
                      </div>
                      {order.bogTransactionId && (
                        <div>
                          <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">{t.rrn}</p>
                          <p className="font-medium text-gray-900 break-all text-xs mt-1">{order.bogTransactionId}</p>
                        </div>
                      )}
                      {order.paidAt && (
                        <div>
                          <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">{t.paymentTime}</p>
                          <p className="font-medium text-gray-900 mt-1">
                            {new Date(order.paidAt).toLocaleString(language === 'ka' ? 'ka-GE' : 'en-US')}
                          </p>
                        </div>
                      )}
                      {order.paymentLastCheckedAt && (
                        <div>
                          <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">{t.lastSyncTime}</p>
                          <p className="font-medium text-gray-900 mt-1">
                            {new Date(order.paymentLastCheckedAt).toLocaleString(language === 'ka' ? 'ka-GE' : 'en-US')}
                          </p>
                        </div>
                      )}
                      {order.bogPaymentStatus && (
                        <div>
                          <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">{t.bogPaymentStatus}</p>
                          <p className="font-medium text-gray-900 mt-1">{String(order.bogPaymentStatus)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Status Management & Actions */}
          <div className="space-y-6">
            {/* Delivery Status Management */}
            <Card className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold text-[#1C1C1C] uppercase tracking-wide">{t.deliveryStatus}</CardTitle>
                    <p className="text-xs text-gray-500 mt-0.5">Manage order delivery progress</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5 pt-5">
                {/* Current Status Section */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-25 border border-blue-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <p className="text-xs text-blue-700 font-medium uppercase tracking-wide mb-3">{t.currentStatus}</p>
                  <Badge className={`text-sm font-bold px-4 py-2 ${DELIVERY_STATUS_COLOR[(order.deliveryStatus || 'new') as string]}`}>
                    {DELIVERY_STATUS[(order.deliveryStatus || 'new') as string]}
                  </Badge>
                </div>

                {/* Update Status Section */}
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="text-xs font-medium text-gray-600 uppercase tracking-wide block mb-2.5">{t.updateStatus}</label>
                    <Select value={newDeliveryStatus || "none"} onValueChange={(val) => setNewDeliveryStatus(val === "none" ? "" : val)}>
                      <SelectTrigger className="w-full h-11 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:border-[#8B6F47] focus:ring-2 focus:ring-amber-100 transition-all hover:border-gray-400 font-medium">
                        <SelectValue placeholder={t.selectStatus} />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                        <SelectItem value="none" className="text-sm">{t.selectStatus}</SelectItem>
                        {Object.entries(DELIVERY_STATUS).map(([key, label]) => (
                          <SelectItem key={key} value={key} className="text-sm">{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-600 uppercase tracking-wide block mb-2.5">{t.adminNotes}</label>
                    <Textarea
                      placeholder={t.adminNotes}
                      value={adminComment}
                      onChange={(e) => setAdminComment(e.target.value)}
                      className="min-h-28 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-[#8B6F47] focus:ring-2 focus:ring-amber-100 transition-all hover:border-gray-400 resize-none p-3.5 leading-relaxed"
                    />
                  </div>

                  <Button
                    onClick={handleUpdateDeliveryStatus}
                    disabled={isUpdatingDelivery || !newDeliveryStatus}
                    className="w-full bg-gradient-to-r from-[#8B6F47] to-[#A0845C] hover:from-[#A0845C] hover:to-[#B89968] text-white h-11 text-sm font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                  >
                    {isUpdatingDelivery ? t.updating : t.updateButton}
                  </Button>
                </div>

                {/* Previous Notes */}
                {order.additionalComment && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                    <p className="text-xs text-amber-800 font-medium uppercase tracking-wide mb-2.5">📝 {t.adminNotes}</p>
                    <p className="text-gray-900 text-sm leading-relaxed">{order.additionalComment}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base text-[#1C1C1C]">{t.summary}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-xs font-medium uppercase tracking-wide">{t.orderDate}</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString(language === 'ka' ? 'ka-GE' : 'en-US')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-xs font-medium uppercase tracking-wide">{t.lastUpdated}</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(order.updatedAt).toLocaleDateString(language === 'ka' ? 'ka-GE' : 'en-US')}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span className="text-gray-600 text-xs font-medium uppercase tracking-wide">{t.totalAmount}</span>
                  <span className="text-xl font-bold text-[#8B6F47]">
                    ₾{parseFloat(order.totalPrice || '0').toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* BOG Reconciliation */}
            {order.paymentMethod === 'card' && order.bogExternalOrderId && (
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base text-[#1C1C1C]">Payment Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      {language === 'ka' 
                        ? 'BOG გადახდის სტატუსი ავტომატურად განახლდება BOG-ის კოლბეკის მეშვეობით' 
                        : 'BOG payment status is automatically updated via BOG callbacks'}
                    </p>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium mb-1">
                      {language === 'ka' ? 'მიმდინარე სტატუსი:' : 'Current Status:'}
                    </p>
                    <p className="text-gray-700">
                      {language === 'ka' 
                        ? PAYMENT_STATUS_KA[order.paymentStatus] || order.paymentStatus 
                        : PAYMENT_STATUS_EN[order.paymentStatus] || order.paymentStatus}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <CardTitle className="text-base text-red-600">{t.actions}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={() => setShowCancelConfirm(true)}
                  variant="outline"
                  className="w-full h-10 border-amber-300 text-amber-700 hover:bg-amber-50 text-sm font-medium"
                >
                  {t.cancel}
                </Button>
                <Button
                  onClick={() => setShowDeleteConfirm(true)}
                  variant="outline"
                  className="w-full h-10 border-red-300 text-red-700 hover:bg-red-50 text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t.delete}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.deleteConfirm}</AlertDialogTitle>
            <AlertDialogDescription>{t.deleteWarning}</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>{t.cancelButton}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteOrderClick}
              disabled={isDeletingOrder}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeletingOrder ? t.updating : t.confirmDelete}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.cancelConfirm}</AlertDialogTitle>
            <AlertDialogDescription>{t.cancelWarning}</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>{t.cancelButton}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelOrderClick}
              disabled={isCancellingOrder}
              className="bg-amber-600 hover:bg-amber-700"
            >
              {isCancellingOrder ? t.updating : t.confirmCancel}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
