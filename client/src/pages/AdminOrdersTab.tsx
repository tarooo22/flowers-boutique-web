'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { useLocation } from 'wouter';

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
  pending_payment: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800',
  refunded: 'bg-blue-100 text-blue-800',
};

const DELIVERY_STATUS_COLOR: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  processing: 'bg-orange-100 text-orange-800',
  preparing: 'bg-purple-100 text-purple-800',
  courier: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-800',
};

export default function AdminOrdersTab() {
  const [, navigate] = useLocation();
  const { language } = useLanguage();
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('');
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  const translations = {
    en: {
      totalOrders: 'Total Orders',
      paidOrders: 'Paid Orders',
      totalRevenue: 'Total Revenue',
      filters: 'Filters',
      searchPlaceholder: 'Search by name or phone...',
      allPaymentStatuses: 'All Payment Statuses',
      allDeliveryStatuses: 'All Delivery Statuses',
      clearFilters: 'Clear Filters',
      orderNumber: 'Order #',
      customer: 'Customer',
      phone: 'Phone',
      amount: 'Amount',
      payment: 'Payment',
      delivery: 'Delivery',
      date: 'Date',
      action: 'Action',
      view: 'View',
      noOrders: 'No orders found',
    },
    ka: {
      totalOrders: 'ჯამი შეკვეთები',
      paidOrders: 'გადახდილი შეკვეთები',
      totalRevenue: 'ჯამი შემოსავალი',
      filters: 'ფილტრები',
      searchPlaceholder: 'ძებნა სახელით ან ტელეფონით...',
      allPaymentStatuses: 'ყველა გადახდის სტატუსი',
      allDeliveryStatuses: 'ყველა მიწოდების სტატუსი',
      clearFilters: 'ფილტრების გასუფთავება',
      orderNumber: 'შეკვეთა #',
      customer: 'კლიენტი',
      phone: 'ტელეფონი',
      amount: 'ჯამი',
      payment: 'გადახდა',
      delivery: 'მიწოდება',
      date: 'თარიღი',
      action: 'მოქმედება',
      view: 'ნახვა',
      noOrders: 'შეკვეთები არ მოიძებნა',
    },
  };

  const t = translations[language as keyof typeof translations] || translations.en;
  const PAYMENT_STATUS = language === 'ka' ? PAYMENT_STATUS_KA : PAYMENT_STATUS_EN;
  const DELIVERY_STATUS = language === 'ka' ? DELIVERY_STATUS_KA : DELIVERY_STATUS_EN;

  const { data: orders, isLoading } = trpc.admin.orders.list.useQuery({
    paymentStatus: paymentStatusFilter || undefined,
    deliveryStatus: deliveryStatusFilter || undefined,
    searchTerm: searchTerm || undefined,
  });

  const { data: stats } = trpc.admin.orders.stats.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div>
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-[#E8E4DF] p-4">
            <p className="text-sm text-gray-600">{t.totalOrders}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
          </div>
          <div className="bg-white rounded-lg border border-[#E8E4DF] p-4">
            <p className="text-sm text-gray-600">{t.paidOrders}</p>
            <p className="text-2xl font-bold text-green-600 mt-2">{stats.paid}</p>
          </div>
          <div className="bg-white rounded-lg border border-[#E8E4DF] p-4">
            <p className="text-sm text-gray-600">{t.totalRevenue}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">₾{stats.totalRevenue.toFixed(2)}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg border border-[#E8E4DF] p-6 mb-6">
        <p className="font-semibold text-gray-900 mb-4">{t.filters}</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
            <option value="">{t.allPaymentStatuses}</option>
            {Object.entries(PAYMENT_STATUS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </Select>
          <Select value={deliveryStatusFilter} onValueChange={setDeliveryStatusFilter}>
            <option value="">{t.allDeliveryStatuses}</option>
            {Object.entries(DELIVERY_STATUS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </Select>
          <Button
            onClick={() => {
              setSearchTerm('');
              setPaymentStatusFilter('');
              setDeliveryStatusFilter('');
            }}
            variant="outline"
            className="w-full"
          >
            {t.clearFilters}
          </Button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-[#E8E4DF] overflow-hidden overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-[#E8E4DF]">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">
                {t.orderNumber}
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">
                {t.customer}
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">
                {t.phone}
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">
                {t.amount}
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">
                {t.payment}
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">
                {t.delivery}
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">
                {t.date}
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">
                {t.action}
              </th>
            </tr>
          </thead>
          <tbody>
            {orders && orders.length > 0 ? (
              orders.map((order: any) => (
                <tr key={order.id} className="border-b border-[#E8E4DF] hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">#{order.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{order.recipientName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.recipientPhone}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    ₾{parseFloat(order.totalPrice || '0').toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${PAYMENT_STATUS_COLOR[order.paymentStatus || 'pending_payment']}`}>
                      {PAYMENT_STATUS[order.paymentStatus || 'pending_payment']}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${DELIVERY_STATUS_COLOR[order.deliveryStatus || 'new']}`}>
                      {DELIVERY_STATUS[order.deliveryStatus || 'new']}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString(language === 'ka' ? 'ka-GE' : 'en-US')}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Button
                      onClick={() => navigate(`/admin/orders/${order.id}`)}
                      variant="outline"
                      size="sm"
                    >
                      {t.view}
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                  {t.noOrders}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
