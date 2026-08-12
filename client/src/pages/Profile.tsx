import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/_core/hooks/useAuth';
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Heart,
  LogOut,
  MapPin,
  Package,
  User,
  Plus,
  Edit2,
  Trash2,
  Lock,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

const translations = {
  en: {
    profile: "My Profile",
    profileInfo: "Profile Information",
    addresses: "Addresses",
    orders: "Orders",
    favorites: "Favorites",
    fullName: "Full Name",
    email: "Email",
    phone: "Phone",
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    changePassword: "Change Password",
    currentPassword: "Current Password",
    newPassword: "New Password",
    confirmPassword: "Confirm Password",
    update: "Update Profile",
    logout: "Log Out",
    noAddresses: "No addresses yet",
    addAddress: "Add Address",
    editAddress: "Edit Address",
    deleteAddress: "Delete",
    addressType: "Address Type",
    recipientName: "Recipient Name",
    recipientPhone: "Recipient Phone",
    street: "Street Address",
    city: "City",
    postalCode: "Postal Code",
    country: "Country",
    noOrders: "No orders yet",
    orderDate: "Order Date",
    orderTotal: "Total",
    status: "Status",
    noFavorites: "No favorite products yet",
    browseProducts: "Browse Products",
    back: "Back",
    loading: "Loading...",
    error: "An error occurred",
    success: "Changes saved successfully",
    passwordChanged: "Password changed successfully",
    addressAdded: "Address added successfully",
    addressUpdated: "Address updated successfully",
    addressDeleted: "Address deleted successfully",
    label: "Label (Home, Work, etc.)",
    welcome: "Welcome",
    requiredFields: "Please fill in all required fields",
    deleteConfirm: "Are you sure you want to delete this address?",
    completed: "Completed",
    cancelled: "Cancelled",
    passwordsNotMatch: "Passwords don't match",
    items: "Items",
    orderNumber: "Order Number",
    paymentMethod: "Payment Method",
    paymentStatus: "Payment Status",
    deliveryStatus: "Delivery Status",
    pending: "Pending",
    processing: "Processing",
    paid: "Paid",
    failed: "Failed",
    refunded: "Refunded",
    partiallyRefunded: "Partially Refunded",
    notSpecified: "Not specified",
  },
  ka: {
    profile: "ჩემი პროფილი",
    profileInfo: "პროფილის ინფორმაცია",
    addresses: "მისამართები",
    orders: "შეკვეთები",
    favorites: "რჩეულები",
    fullName: "სრული სახელი",
    email: "ელ-ფოსტა",
    phone: "ტელეფონი",
    edit: "რედაქტირება",
    save: "შენახვა",
    cancel: "გაუქმება",
    changePassword: "პაროლის შეცვლა",
    currentPassword: "ამჟამინდელი პაროლი",
    newPassword: "ახალი პაროლი",
    confirmPassword: "პაროლის დადასტურება",
    update: "პროფილის განახლება",
    logout: "გამოსვლა",
    noAddresses: "მისამართები ჯერ არ დამატებულა",
    addAddress: "მისამართის დამატება",
    editAddress: "მისამართის რედაქტირება",
    deleteAddress: "წაშლა",
    addressType: "მისამართის ტიპი",
    recipientName: "მიმღების სახელი",
    recipientPhone: "მიმღების ტელეფონი",
    street: "ქუჩის მისამართი",
    city: "ქალაქი",
    postalCode: "საფოსტო კოდი",
    country: "ქვეყანა",
    noOrders: "შეკვეთები ჯერ არ გაკეთებულა",
    orderDate: "შეკვეთის თარიღი",
    orderTotal: "ჯამი",
    status: "სტატუსი",
    noFavorites: "რჩეული პროდუქტები ჯერ არ დაგიმატებიათ",
    browseProducts: "პროდუქტების ნახვა",
    back: "უკან",
    loading: "იტვირთება...",
    error: "შეცდომა",
    success: "ცვლილებები შენახულია",
    passwordChanged: "პაროლი წარმატებით შეიცვალა",
    addressAdded: "მისამართი წარმატებით დაემატა",
    addressUpdated: "მისამართი წარმატებით განახლდა",
    addressDeleted: "მისამართი წარმატებით წაიშალა",
    label: "დასახელება (სახლი, სამუშაო და ა.შ.)",
    welcome: "კეთილი იყოს თქვენი მობრძანება",
    requiredFields: "გთხოვთ შეავსოთ ყველა აუცილებელი ველი",
    deleteConfirm: "დარწმუნებული ხართ, რომ გსურთ ამ მისამართის წაშლა?",

    completed: "დასრულებული",
    cancelled: "გაუქმებული",
    passwordsNotMatch: "პაროლები არ ემთხვევა",
    items: "ელემენტები",
    orderNumber: "შეკვეთის ნომერი",
    paymentMethod: "გადახდის მეთოდი",
    paymentStatus: "გადახდის სტატუსი",
    deliveryStatus: "მიტანის სტატუსი",
    pendingPayment: "გადახდის მოლოდინში",
    processing: "გადახდა მუშავდება",
    paid: "გადახდილია",
    failed: "გადახდა ვერ შესრულდა",
    refunded: "თანხა დაბრუნებულია",
    partiallyRefunded: "თანხა ნაწილობრივ დაბრუნებულია",
    pending: "მოლოდინშია",
    notSpecified: "არ არის მითითებული",
  },
};

export default function Profile() {
  const [, navigate] = useLocation();
  const { language } = useLanguage();
  const t =
    translations[language as keyof typeof translations] || translations.en;
  const { user, loading, logout } = useAuth({
    redirectOnUnauthenticated: true,
  });

  // Handle back navigation
  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate("/");
    }
  };
  const utils = trpc.useUtils();

  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [newAddress, setNewAddress] = useState({
    label: "",
    recipientName: "",
    recipientPhone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  // Fetch profile data
  const { data: profileData, refetch: refetchProfile } =
    trpc.profile.me.useQuery();

  // Fetch addresses
  const { data: addresses = [], isLoading: addressesLoading } =
    trpc.addresses.list.useQuery();

  // Fetch orders
  const { data: orders = [], isLoading: ordersLoading } =
    trpc.profile.myOrders.list.useQuery();

  // Mutations
  const updateProfileMutation = trpc.profile.updateProfile.useMutation({
    onSuccess: () => {
      toast.success(t.success);
      setIsEditing(false);
      utils.profile.me.invalidate();
      refetchProfile();
    },
    onError: error => {
      toast.error(error.message || t.error);
    },
  });

  const changePasswordMutation = trpc.profile.changePassword.useMutation({
    onSuccess: () => {
      toast.success(t.passwordChanged);
      setIsChangingPassword(false);
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    },
    onError: error => {
      toast.error(error.message || t.error);
    },
  });

  const createAddressMutation = trpc.addresses.create.useMutation({
    onSuccess: () => {
      toast.success(t.addressAdded);
      setIsAddingAddress(false);
      setNewAddress({
        label: "",
        recipientName: "",
        recipientPhone: "",
        address: "",
        city: "",
        postalCode: "",
      });
      utils.addresses.list.invalidate();
    },
    onError: error => {
      toast.error(error.message || t.error);
    },
  });

  const updateAddressMutation = trpc.addresses.update.useMutation({
    onSuccess: () => {
      toast.success(t.addressUpdated);
      setEditingAddressId(null);
      setNewAddress({
        label: "",
        recipientName: "",
        recipientPhone: "",
        address: "",
        city: "",
        postalCode: "",
      });
      utils.addresses.list.invalidate();
    },
    onError: error => {
      toast.error(error.message || t.error);
    },
  });

  const deleteAddressMutation = trpc.addresses.delete.useMutation({
    onSuccess: () => {
      toast.success(t.addressDeleted);
      utils.addresses.list.invalidate();
    },
    onError: error => {
      toast.error(error.message || t.error);
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useAuth hook
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      toast.error(t.error);
    }
  };

  const handleSaveProfile = () => {
    updateProfileMutation.mutate({
      name: editData.name,
      phone: editData.phone,
    });
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error(t.passwordsNotMatch);
      return;
    }
    if (!passwordData.oldPassword || !passwordData.newPassword) {
      toast.error(t.requiredFields);
      return;
    }
    changePasswordMutation.mutate({
      oldPassword: passwordData.oldPassword,
      newPassword: passwordData.newPassword,
      confirmPassword: passwordData.confirmPassword,
    });
  };

  const handleAddAddress = () => {
    if (
      !newAddress.recipientName ||
      !newAddress.recipientPhone ||
      !newAddress.address ||
      !newAddress.city
    ) {
      toast.error(t.requiredFields);
      return;
    }
    createAddressMutation.mutate(newAddress);
  };

  const handleEditAddress = (address: any) => {
    setEditingAddressId(address.id);
    setNewAddress({
      label: address.label || "",
      recipientName: address.recipientName,
      recipientPhone: address.recipientPhone,
      address: address.address,
      city: address.city,
      postalCode: address.postalCode || "",
    });
  };

  const handleSaveEditAddress = () => {
    if (
      !newAddress.recipientName ||
      !newAddress.recipientPhone ||
      !newAddress.address ||
      !newAddress.city
    ) {
      toast.error(t.requiredFields);
      return;
    }
    if (editingAddressId !== null) {
      updateAddressMutation.mutate({
        id: editingAddressId,
        ...newAddress,
      });
    }
  };

  const handleDeleteAddress = (id: number) => {
    if (confirm(t.deleteConfirm)) {
      deleteAddressMutation.mutate({ id });
    }
  };

  const getStatusLabel = (status: string | null) => {
    if (!status) return t.pending;
    if (status === "completed") return t.completed;
    if (status === "cancelled") return t.cancelled;
    return status;
  };

  const getPaymentStatusLabel = (status: string | null) => {
    if (!status) return t.pending;
    if (status === "pending_payment") return t.pending;
    if (status === "processing") return t.processing;
    if (status === "paid") return t.paid;
    if (status === "failed") return t.failed;
    if (status === "refunded") return t.refunded;
    if (status === "partially_refunded") return t.partiallyRefunded;
    return status;
  };

  const getPaymentMethodLabel = (method: string | null) => {
    if (!method) return t.notSpecified;
    if (method === "whatsapp") return "WhatsApp";
    if (method === "cash") return language === 'ka' ? "ნაღდი ფული" : "Cash";
    if (method === "card") return language === 'ka' ? "საქართველოს ბანკი" : "Bank of Georgia";
    if (method === "bank_transfer") return language === 'ka' ? "ბანკის გადარიცხვა" : "Bank Transfer";
    return method;
  };

  return (
    <div className="fb-secondary-page min-h-screen">
      <Navbar />
      <main className="fb-profile-page px-4 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            onClick={handleBack}
            className="rounded-full px-6 py-2 bg-gradient-to-r from-[#A16207] to-[#D4AF37] text-white hover:shadow-lg hover:shadow-[#A16207]/20 transition-all w-full sm:w-auto"
          >
            ← {t.back}
          </Button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-4xl sm:text-5xl font-light text-[#1C1917] mb-2"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {t.profile}
          </h1>
          <p className="text-[#666]">
            {t.welcome}, {user.name}!
          </p>
        </div>

        {/* Main Content */}
        <Card className="rounded-3xl border border-[#D4AF37]/20 bg-white/40 backdrop-blur-sm shadow-xl overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 rounded-none border-b border-[#D4AF37]/10 bg-gradient-to-r from-[#D4AF37]/5 to-[#A16207]/5">
              <TabsTrigger
                value="profile"
                className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37]"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">
                  {t.profileInfo}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="addresses"
                className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37]"
              >
                <MapPin className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">{t.addresses}</span>
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37]"
              >
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">{t.orders}</span>
              </TabsTrigger>
              <TabsTrigger
                value="favorites"
                className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37]"
              >
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">{t.favorites}</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="p-8 space-y-6">
              {!isEditing && !isChangingPassword ? (
                <div className="space-y-6">
                  {/* Profile Display */}
                  <div className="space-y-4">
                    <h3
                      className="text-xl font-semibold text-[#1C1917]"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {t.profileInfo}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="fb-profile-info-card">
                        <label className="fb-profile-info-card__label">
                          {t.fullName}
                        </label>
                        <p className="text-lg font-medium text-[#1C1917]">
                          {user.name}
                        </p>
                      </div>
                      <div className="fb-profile-info-card">
                        <label className="fb-profile-info-card__label">
                          {t.email}
                        </label>
                        <p className="text-lg font-medium text-[#1C1917]">
                          {user.email}
                        </p>
                      </div>
                      <div className="fb-profile-info-card">
                        <label className="fb-profile-info-card__label">
                          {t.phone}
                        </label>
                        <p className="text-lg font-medium text-[#1C1917]">
                          {user.phone || "—"}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        setEditData({
                          name: user.name || "",
                          phone: user.phone || "",
                        });
                        setIsEditing(true);
                      }}
                      className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      {t.edit}
                    </Button>
                  </div>

                  {/* Change Password */}
                  <div className="border-t pt-6">
                    <Button
                      onClick={() => setIsChangingPassword(true)}
                      variant="outline"
                      className="border-purple-300 text-purple-600 hover:bg-purple-50"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      {t.changePassword}
                    </Button>
                  </div>
                </div>
              ) : isEditing ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t.edit} {t.profileInfo}
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.fullName}
                    </label>
                    <Input
                      value={editData.name}
                      onChange={e =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                      placeholder={t.fullName}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.phone}
                    </label>
                    <Input
                      value={editData.phone}
                      onChange={e =>
                        setEditData({ ...editData, phone: e.target.value })
                      }
                      placeholder={t.phone}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveProfile}
                      disabled={updateProfileMutation.isPending}
                      className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                    >
                      {updateProfileMutation.isPending ? t.loading : t.save}
                    </Button>
                    <Button
                      onClick={() => setIsEditing(false)}
                      variant="outline"
                    >
                      {t.cancel}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t.changePassword}
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.currentPassword}
                    </label>
                    <Input
                      type="password"
                      value={passwordData.oldPassword}
                      onChange={e =>
                        setPasswordData({
                          ...passwordData,
                          oldPassword: e.target.value,
                        })
                      }
                      placeholder={t.currentPassword}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.newPassword}
                    </label>
                    <Input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={e =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      placeholder={t.newPassword}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.confirmPassword}
                    </label>
                    <Input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={e =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      placeholder={t.confirmPassword}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleChangePassword}
                      disabled={changePasswordMutation.isPending}
                      className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                    >
                      {changePasswordMutation.isPending ? t.loading : t.update}
                    </Button>
                    <Button
                      onClick={() => setIsChangingPassword(false)}
                      variant="outline"
                    >
                      {t.cancel}
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses" className="p-6">
              {addressesLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
                </div>
              ) : addresses.length === 0 &&
                !isAddingAddress &&
                editingAddressId === null ? (
                <div className="text-center py-8 text-gray-500">
                  <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>{t.noAddresses}</p>
                  <Button
                    onClick={() => setIsAddingAddress(true)}
                    className="mt-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t.addAddress}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map(address =>
                    editingAddressId === address.id ? (
                      <Card
                        key={address.id}
                        className="p-4 border-2 border-pink-200 bg-pink-50"
                      >
                        <h3 className="font-semibold text-gray-900 mb-4">
                          {t.editAddress}
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {t.label}
                            </label>
                            <Input
                              value={newAddress.label}
                              onChange={e =>
                                setNewAddress({
                                  ...newAddress,
                                  label: e.target.value,
                                })
                              }
                              placeholder={t.label}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {t.recipientName}
                            </label>
                            <Input
                              value={newAddress.recipientName}
                              onChange={e =>
                                setNewAddress({
                                  ...newAddress,
                                  recipientName: e.target.value,
                                })
                              }
                              placeholder={t.recipientName}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {t.recipientPhone}
                            </label>
                            <Input
                              value={newAddress.recipientPhone}
                              onChange={e =>
                                setNewAddress({
                                  ...newAddress,
                                  recipientPhone: e.target.value,
                                })
                              }
                              placeholder={t.recipientPhone}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {t.street}
                            </label>
                            <Input
                              value={newAddress.address}
                              onChange={e =>
                                setNewAddress({
                                  ...newAddress,
                                  address: e.target.value,
                                })
                              }
                              placeholder={t.street}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {t.city}
                            </label>
                            <Input
                              value={newAddress.city}
                              onChange={e =>
                                setNewAddress({
                                  ...newAddress,
                                  city: e.target.value,
                                })
                              }
                              placeholder={t.city}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {t.postalCode}
                            </label>
                            <Input
                              value={newAddress.postalCode}
                              onChange={e =>
                                setNewAddress({
                                  ...newAddress,
                                  postalCode: e.target.value,
                                })
                              }
                              placeholder={t.postalCode}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={handleSaveEditAddress}
                              disabled={updateAddressMutation.isPending}
                              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                            >
                              {updateAddressMutation.isPending
                                ? t.loading
                                : t.save}
                            </Button>
                            <Button
                              onClick={() => {
                                setEditingAddressId(null);
                                setNewAddress({
                                  label: "",
                                  recipientName: "",
                                  recipientPhone: "",
                                  address: "",
                                  city: "",
                                  postalCode: "",
                                });
                              }}
                              variant="outline"
                            >
                              {t.cancel}
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ) : (
                      <Card key={address.id} className="p-4 border">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            {address.label && (
                              <p className="font-semibold text-gray-900">
                                {address.label}
                              </p>
                            )}
                            <p className="text-gray-700">
                              {address.recipientName}
                            </p>
                            <p className="text-gray-600">{address.address}</p>
                            <p className="text-gray-600">
                              {address.city} {address.postalCode}
                            </p>
                            <p className="text-gray-600">
                              {address.recipientPhone}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleEditAddress(address)}
                              variant="ghost"
                              size="sm"
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteAddress(address.id)}
                              disabled={deleteAddressMutation.isPending}
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    )
                  )}
                  {!isAddingAddress && editingAddressId === null && (
                    <Button
                      onClick={() => setIsAddingAddress(true)}
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {t.addAddress}
                    </Button>
                  )}
                </div>
              )}

              {isAddingAddress && editingAddressId === null && (
                <Card className="p-4 border-2 border-pink-200 bg-pink-50 mt-4">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    {t.addAddress}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t.label}
                      </label>
                      <Input
                        value={newAddress.label}
                        onChange={e =>
                          setNewAddress({
                            ...newAddress,
                            label: e.target.value,
                          })
                        }
                        placeholder={t.label}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t.recipientName} *
                      </label>
                      <Input
                        value={newAddress.recipientName}
                        onChange={e =>
                          setNewAddress({
                            ...newAddress,
                            recipientName: e.target.value,
                          })
                        }
                        placeholder={t.recipientName}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t.recipientPhone} *
                      </label>
                      <Input
                        value={newAddress.recipientPhone}
                        onChange={e =>
                          setNewAddress({
                            ...newAddress,
                            recipientPhone: e.target.value,
                          })
                        }
                        placeholder={t.recipientPhone}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t.street} *
                      </label>
                      <Input
                        value={newAddress.address}
                        onChange={e =>
                          setNewAddress({
                            ...newAddress,
                            address: e.target.value,
                          })
                        }
                        placeholder={t.street}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t.city} *
                      </label>
                      <Input
                        value={newAddress.city}
                        onChange={e =>
                          setNewAddress({ ...newAddress, city: e.target.value })
                        }
                        placeholder={t.city}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t.postalCode}
                      </label>
                      <Input
                        value={newAddress.postalCode}
                        onChange={e =>
                          setNewAddress({
                            ...newAddress,
                            postalCode: e.target.value,
                          })
                        }
                        placeholder={t.postalCode}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleAddAddress}
                        disabled={createAddressMutation.isPending}
                        className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                      >
                        {createAddressMutation.isPending ? t.loading : t.save}
                      </Button>
                      <Button
                        onClick={() => {
                          setIsAddingAddress(false);
                          setNewAddress({
                            label: "",
                            recipientName: "",
                            recipientPhone: "",
                            address: "",
                            city: "",
                            postalCode: "",
                          });
                        }}
                        variant="outline"
                      >
                        {t.cancel}
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="p-6">
              {ordersLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>{t.noOrders}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <Card key={order.id} className="p-4 border">
                      <div className="space-y-4">
                        {/* Order Header */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">{t.orderNumber}</p>
                            <p className="font-semibold text-gray-900 mt-1">#{order.orderNumber || order.id}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">{t.orderDate}</p>
                            <p className="font-semibold text-gray-900 mt-1">
                              {new Date(order.createdAt).toLocaleDateString(language === 'ka' ? 'ka-GE' : 'en-US')}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">{t.orderTotal}</p>
                            <p className="font-semibold text-gray-900 mt-1">₾{parseFloat(order.totalPrice || '0').toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">{t.items}</p>
                            <p className="font-semibold text-gray-900 mt-1">1</p>
                          </div>
                        </div>

                        {/* Payment & Delivery Status */}
                        <div className="border-t pt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">{t.paymentMethod}</p>
                            <p className="font-semibold text-gray-900 mt-1">{getPaymentMethodLabel(order.paymentMethod)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">{t.paymentStatus}</p>
                            <p className="font-semibold text-gray-900 mt-1">{getPaymentStatusLabel(order.paymentStatus)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">{t.deliveryStatus}</p>
                            <p className="font-semibold text-gray-900 mt-1 capitalize">{getStatusLabel(order.deliveryStatus)}</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Favorites Tab */}
            <TabsContent value="favorites" className="p-6">
              <div className="text-center py-8 text-gray-500">
                <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>{t.noFavorites}</p>
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Logout Button */}
        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2 border-red-300 text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            {t.logout}
          </Button>
        </div>
      </div>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
