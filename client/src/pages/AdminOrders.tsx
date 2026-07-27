import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Package, TrendingUp, DollarSign, Clock, CheckCircle, AlertCircle, Eye, Search, X, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

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

export default function AdminOrders() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { language } = useLanguage();
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('');
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState<string>('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  const translations = {
    en: {
      adminOrders: 'Orders Management',
      allOrders: 'Manage all orders, payments, and deliveries',
      back: 'Back to Admin',
      totalOrders: 'Total Orders',
      newOrders: 'New Orders',
      pendingPayment: 'Pending Payment',
      paidOrders: 'Paid Orders',
      deliveredOrders: 'Delivered Orders',
      totalRevenue: 'Total Revenue',
      filters: 'Filters',
      searchPlaceholder: 'Search by order #, name, or phone...',
      allPaymentStatuses: 'All Payment Statuses',
      allDeliveryStatuses: 'All Delivery Statuses',
      allPaymentMethods: 'All Payment Methods',
      clearFilters: 'Clear Filters',
      orderNumber: 'Order #',
      customer: 'Customer',
      phone: 'Phone',
      products: 'Products',
      amount: 'Amount',
      paymentMethod: 'Payment Method',
      paymentStatus: 'Payment Status',
      deliveryStatus: 'Delivery Status',
      date: 'Date',
      action: 'Action',
      view: 'View',
      noOrders: 'No orders found',
      activeFilters: 'Active filters',
    },
    ka: {
      adminOrders: 'შეკვეთების მართვა',
      allOrders: 'ყველა შეკვეთის, გადახდის და მიწოდების მართვა',
      back: 'ადმინ პანელში დაბრუნება',
      totalOrders: 'ყველა შეკვეთა',
      newOrders: 'ახალი შეკვეთები',
      pendingPayment: 'გადახდის მოლოდინში',
      paidOrders: 'გადახდილი შეკვეთები',
      deliveredOrders: 'მიტანილი შეკვეთები',
      totalRevenue: 'ჯამი შემოსავალი',
      filters: 'ფილტრები',
      searchPlaceholder: 'ძებნა შეკვეთის #, სახელით ან ტელეფონით...',
      allPaymentStatuses: 'ყველა გადახდის სტატუსი',
      allDeliveryStatuses: 'ყველა მიწოდების სტატუსი',
      allPaymentMethods: 'ყველა გადახდის მეთოდი',
      clearFilters: 'ფილტრების გასუფთავება',
      orderNumber: 'შეკვეთა #',
      customer: 'კლიენტი',
      phone: 'ტელეფონი',
      products: 'პროდუქტები',
      amount: 'ჯამი',
      paymentMethod: 'გადახდის მეთოდი',
      paymentStatus: 'გადახდის სტატუსი',
      deliveryStatus: 'მიწოდების სტატუსი',
      date: 'თარიღი',
      action: 'მოქმედება',
      view: 'ნახვა',
      noOrders: 'შეკვეთები არ მოიძებნა',
      activeFilters: 'აქტიური ფილტრები',
    },
  };

  const t = translations[language as keyof typeof translations] || translations.en;
  const PAYMENT_STATUS = language === 'ka' ? PAYMENT_STATUS_KA : PAYMENT_STATUS_EN;
  const DELIVERY_STATUS = language === 'ka' ? DELIVERY_STATUS_KA : DELIVERY_STATUS_EN;
  const PAYMENT_METHOD = language === 'ka' ? PAYMENT_METHOD_KA : PAYMENT_METHOD_EN;

  const { data: orders, isLoading, error } = trpc.admin.orders.list.useQuery({
    paymentStatus: paymentStatusFilter || undefined,
    deliveryStatus: deliveryStatusFilter || undefined,
    searchTerm: searchTerm || undefined,
  });

  const { data: stats } = trpc.admin.orders.stats.useQuery();

  // Calculate filtered stats
  const filteredStats = useMemo(() => {
    if (!orders) return null;
    
    const newOrders = orders.filter(o => o.deliveryStatus === 'new').length;
    const pendingPayment = orders.filter(o => o.paymentStatus === 'pending_payment').length;
    const deliveredOrders = orders.filter(o => o.deliveryStatus === 'delivered').length;
    
    return {
      newOrders,
      pendingPayment,
      deliveredOrders,
    };
  }, [orders]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (paymentStatusFilter) count++;
    if (deliveryStatusFilter) count++;
    if (paymentMethodFilter) count++;
    if (searchTerm) count++;
    return count;
  }, [paymentStatusFilter, deliveryStatusFilter, paymentMethodFilter, searchTerm]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setPaymentStatusFilter('');
    setDeliveryStatusFilter('');
    setPaymentMethodFilter('');
  };

  // Check admin access - AFTER all hooks
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
        <Loader2 className="w-8 h-8 animate-spin text-amber-700" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page min-h-screen bg-[#F5F2EE] p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-red-500">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page min-h-screen bg-[#F5F2EE] p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            onClick={() => navigate('/admin')}
            variant="outline"
            className="border-[#8B6F47] text-[#8B6F47] hover:bg-white hover:border-[#A0845C] transition-colors"
          >
            ← {t.back}
          </Button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1C1C1C]">{t.adminOrders}</h1>
          <p className="text-gray-600 mt-2 text-sm">{t.allOrders}</p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
            {/* Total Orders */}
            <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow h-full">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">{t.totalOrders}</p>
                    <p className="text-3xl font-bold text-[#1C1C1C] mt-2">{stats.totalOrders}</p>
                  </div>
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Package className="w-5 h-5 text-gray-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* New Orders */}
            {filteredStats && (
              <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow h-full">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">{t.newOrders}</p>
                      <p className="text-3xl font-bold text-blue-600 mt-2">{filteredStats.newOrders}</p>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pending Payment */}
            {filteredStats && (
              <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow h-full">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">{t.pendingPayment}</p>
                      <p className="text-3xl font-bold text-amber-600 mt-2">{filteredStats.pendingPayment}</p>
                    </div>
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Clock className="w-5 h-5 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Paid Orders */}
            <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow h-full">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">{t.paidOrders}</p>
                    <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.paid}</p>
                  </div>
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivered Orders */}
            {filteredStats && (
              <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow h-full">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">{t.deliveredOrders}</p>
                      <p className="text-3xl font-bold text-teal-600 mt-2">{filteredStats.deliveredOrders}</p>
                    </div>
                    <div className="p-2 bg-teal-100 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-teal-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Total Revenue */}
            <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow h-full">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">{t.totalRevenue}</p>
                    <p className="text-3xl font-bold text-[#8B6F47] mt-2">₾{stats.totalRevenue.toFixed(0)}</p>
                  </div>
                  <div className="p-2 bg-amber-50 rounded-lg">
                    <DollarSign className="w-5 h-5 text-[#8B6F47]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-sm mb-6 hover:shadow-md transition-shadow">
          <CardHeader className="pb-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-[#1C1C1C] uppercase tracking-wide">{t.filters}</CardTitle>
                <p className="text-xs text-gray-500 mt-1">Refine your order search</p>
              </div>
              {activeFilterCount > 0 && (
                <Badge className="bg-amber-100 text-amber-800 border border-amber-300 font-medium">
                  {activeFilterCount} {t.activeFilters}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3 sm:space-y-0 sm:flex sm:flex-wrap sm:gap-2 items-end">
              {/* Search Input */}
              <div className="flex-1 min-w-[200px]">
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide block mb-1.5">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder={t.searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-10 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:border-[#8B6F47] focus:ring-2 focus:ring-amber-100 transition-all hover:border-gray-400"
                  />
                </div>
              </div>

              {/* Payment Method Select */}
              <div className="flex-1 min-w-[160px]">
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide block mb-1.5">Payment Method</label>
                <Select value={paymentMethodFilter || "all"} onValueChange={(val) => setPaymentMethodFilter(val === "all" ? "" : val)}>
                  <SelectTrigger className="w-full h-10 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:border-[#8B6F47] focus:ring-2 focus:ring-amber-100 transition-all hover:border-gray-400">
                    <SelectValue placeholder={t.allPaymentMethods} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                    <SelectItem value="all" className="text-sm">{t.allPaymentMethods}</SelectItem>
                    {Object.entries(PAYMENT_METHOD).map(([key, label]) => (
                      <SelectItem key={key} value={key} className="text-sm">{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Status Select */}
              <div className="flex-1 min-w-[160px]">
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide block mb-1.5">Payment Status</label>
                <Select value={paymentStatusFilter || "all"} onValueChange={(val) => setPaymentStatusFilter(val === "all" ? "" : val)}>
                  <SelectTrigger className="w-full h-10 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:border-[#8B6F47] focus:ring-2 focus:ring-amber-100 transition-all hover:border-gray-400">
                    <SelectValue placeholder={t.allPaymentStatuses} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                    <SelectItem value="all" className="text-sm">{t.allPaymentStatuses}</SelectItem>
                    {Object.entries(PAYMENT_STATUS).map(([key, label]) => (
                      <SelectItem key={key} value={key} className="text-sm">{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Delivery Status Select */}
              <div className="flex-1 min-w-[160px]">
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide block mb-1.5">Delivery Status</label>
                <Select value={deliveryStatusFilter || "all"} onValueChange={(val) => setDeliveryStatusFilter(val === "all" ? "" : val)}>
                  <SelectTrigger className="w-full h-10 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:border-[#8B6F47] focus:ring-2 focus:ring-amber-100 transition-all hover:border-gray-400">
                    <SelectValue placeholder={t.allDeliveryStatuses} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                    <SelectItem value="all" className="text-sm">{t.allDeliveryStatuses}</SelectItem>
                    {Object.entries(DELIVERY_STATUS).map(([key, label]) => (
                      <SelectItem key={key} value={key} className="text-sm">{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters Button */}
              <Button
                onClick={handleClearFilters}
                className="h-10 px-4 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 text-sm font-medium rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap"
              >
                <X className="w-4 h-4" />
                {t.clearFilters}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table - Desktop */}
        <div className="hidden md:block bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    {t.orderNumber}
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    {t.customer}
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    {t.phone}
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    {t.amount}
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    {t.paymentMethod}
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    {t.paymentStatus}
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    {t.deliveryStatus}
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    {t.date}
                  </th>
                  <th className="px-5 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    {t.action}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders && orders.length > 0 ? (
                  orders.map((order, index) => (
                    <tr key={order.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-5 py-4 text-sm font-medium text-[#1C1C1C]">
                        #{order.id}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-900">
                        {order.recipientName}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {order.recipientPhone}
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-[#1C1C1C]">
                        ₾{parseFloat(order.totalPrice.toString()).toFixed(2)}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {PAYMENT_METHOD[order.paymentMethod as string] || order.paymentMethod}
                      </td>
                      <td className="px-5 py-4">
                        <Badge className={`text-xs font-medium ${PAYMENT_STATUS_COLOR[order.paymentStatus as string] || 'bg-gray-100 text-gray-800'}`}>
                          {PAYMENT_STATUS[order.paymentStatus as string] || order.paymentStatus}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <Badge className={`text-xs font-medium ${DELIVERY_STATUS_COLOR[(order.deliveryStatus || 'new') as string] || 'bg-gray-100 text-gray-800'}`}>
                          {DELIVERY_STATUS[(order.deliveryStatus || 'new') as string] || order.deliveryStatus}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString(language === 'ka' ? 'ka-GE' : 'en-US')}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <Button
                          onClick={() => navigate(`/admin/orders/${order.id}`)}
                          size="sm"
                          className="bg-[#8B6F47] hover:bg-[#A0845C] text-white h-8 px-3 text-xs"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          {t.view}
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-5 py-8 text-center text-gray-500 text-sm">
                      {t.noOrders}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Orders Cards - Mobile */}
        <div className="md:hidden space-y-4">
          {orders && orders.length > 0 ? (
            orders.map((order) => (
              <Card key={order.id} className="bg-white border-gray-200 shadow-sm">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-gray-600 font-medium uppercase">#{order.id}</p>
                        <p className="text-lg font-bold text-[#1C1C1C] mt-1">{order.recipientName}</p>
                      </div>
                      <Badge className={`text-xs font-medium ${DELIVERY_STATUS_COLOR[(order.deliveryStatus || 'new') as string]}`}>
                        {DELIVERY_STATUS[(order.deliveryStatus || 'new') as string]}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-gray-600">{t.amount}</p>
                        <p className="font-semibold text-[#1C1C1C]">₾{parseFloat(order.totalPrice.toString()).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">{t.phone}</p>
                        <p className="font-semibold text-gray-900">{order.recipientPhone}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-600">{t.paymentStatus}</p>
                        <Badge className={`text-xs font-medium mt-1 ${PAYMENT_STATUS_COLOR[order.paymentStatus as string]}`}>
                          {PAYMENT_STATUS[order.paymentStatus as string]}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">{t.paymentMethod}</p>
                        <p className="text-sm font-medium text-gray-900 mt-1">{PAYMENT_METHOD[order.paymentMethod as string]}</p>
                      </div>
                    </div>

                    <Button
                      onClick={() => navigate(`/admin/orders/${order.id}`)}
                      className="w-full bg-[#8B6F47] hover:bg-[#A0845C] text-white h-9 text-sm mt-2"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {t.view}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-white border-gray-200">
              <CardContent className="p-8 text-center">
                <p className="text-gray-500 text-sm">{t.noOrders}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
