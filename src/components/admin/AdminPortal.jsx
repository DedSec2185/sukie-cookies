import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Sparkles,
  BarChart3,
  Users,
  Settings,
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  Clock,
  Flame,
  Package,
  Phone,
  Lock,
  ExternalLink,
  Copy,
  Check,
  MessageSquare,
  Award,
  Layers,
  MapPin,
  Calendar,
  Download,
  RotateCcw,
  Building2,
  Star,
  CreditCard,
  TrendingUp,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useMenu } from '../../context/MenuContext';
import ProductEditorModal from './ProductEditorModal';
import NotificationModal from './NotificationModal';
import CustomerDrawer from './CustomerDrawer';

export default function AdminPortal({ onClose }) {
  const {
    products,
    categories,
    storeConfig,
    orders,
    reviews,
    bulkInquiries,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductAvailability,
    setAllProductsAvailability,
    resetToDefaultMenu,
    updateStoreConfig,
    updateOrderStatus,
    addOrder,
    deleteOrder,
    addReview,
    deleteReview,
    addBulkInquiry,
    updateBulkInquiryStatus,
    deleteBulkInquiry,
    changePin,
  } = useMenu();

  // 5 Clear, Stress-Free Navigation Tabs
  const [activeTab, setActiveTab] = useState('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Sub-view inside Customers & B2B tab ('vip' | 'b2b')
  const [crmSubTab, setCrmSubTab] = useState('vip');

  // Modals & Drawers
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmResetMenu, setConfirmResetMenu] = useState(false);
  const [notifyModalOrder, setNotifyModalOrder] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [showBakeSheet, setShowBakeSheet] = useState(true);

  // Inline Quick Price Editing State in Menu Studio
  const [inlinePriceId, setInlinePriceId] = useState(null);
  const [inlinePriceValue, setInlinePriceValue] = useState('');

  // Website Banner Text Inline State
  const [bannerTextDraft, setBannerTextDraft] = useState(
    storeConfig?.ovenStatusText || 'Ovens Fired Today • Pre-Orders Active'
  );

  // Add Review Form State (in Atelier Controls)
  const [newReviewForm, setNewReviewForm] = useState({
    name: '',
    cookie: 'Triple Chocolate Overload',
    stars: 5,
    comment: '',
  });

  // Add B2B Inquiry Form State
  const [isNewB2BOpen, setIsNewB2BOpen] = useState(false);
  const [newB2BForm, setNewB2BForm] = useState({
    company: '',
    contact: '',
    phone: '',
    occasion: 'Corporate Gifting Boxes',
    units: 30,
    budget: '₹15,000',
    deliveryDate: 'This Week',
    notes: '',
  });

  // Walk-in / WhatsApp Order Entry State
  const [manualOrder, setManualOrder] = useState({
    name: '',
    phone: '',
    channel: 'WhatsApp Direct',
    slot: 'Today Evening (5:00 PM – 8:00 PM)',
    paymentMethod: 'upi',
    selectedProductId: products[0]?.id || 1,
    quantity: 2,
    packagingFee: 0,
    note: '',
  });

  // PIN Update State
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinMessage, setPinMessage] = useState({ type: '', text: '' });

  // Toast Notification
  const [toast, setToast] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  };

  const handleCopyText = (text, id) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    showToast('Copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ============================================================================
  // COMPLETE ANALYTICS, KITCHEN BAKE SHEET & FINANCIAL BREAKDOWN
  // ============================================================================
  const metrics = useMemo(() => {
    const totalRevenue = orders.reduce((acc, o) => acc + (Number(o.finalTotal) || 0), 0);
    const totalCookiesBaked = orders.reduce((acc, o) => acc + (Number(o.totalItems) || 0), 0);
    const totalPackagingRev = orders.reduce((acc, o) => acc + (Number(o.packagingFee) || 0), 0);
    const cookiesSubtotalRev = totalRevenue - totalPackagingRev;
    const avgOrderValue = orders.length ? Math.round(totalRevenue / orders.length) : 0;

    const pendingCount = orders.filter((o) => (o.status || '').toLowerCase() === 'pending').length;
    const preppingCount = orders.filter((o) => {
      const s = (o.status || '').toLowerCase();
      return s.includes('prep') || s.includes('bake');
    }).length;
    const readyCount = orders.filter((o) => (o.status || '').toLowerCase().includes('ready')).length;
    const collectedCount = orders.filter((o) => {
      const s = (o.status || '').toLowerCase();
      return s.includes('collect') || s.includes('complete');
    }).length;

    // Active Oven Queue Breakdown (Orders that are Pending or Kitchen Prepping)
    const activeKitchenMap = {};
    let activeCookiesToBake = 0;
    orders.forEach((o) => {
      const s = (o.status || '').toLowerCase();
      if (s === 'pending' || s.includes('prep') || s.includes('bake')) {
        (o.items || []).forEach((item) => {
          const qty = Number(item.quantity) || 1;
          activeCookiesToBake += qty;
          if (!activeKitchenMap[item.name]) {
            activeKitchenMap[item.name] = { name: item.name, qty: 0, ordersCount: 0 };
          }
          activeKitchenMap[item.name].qty += qty;
          activeKitchenMap[item.name].ordersCount += 1;
        });
      }
    });
    const activeBakeList = Object.values(activeKitchenMap).sort((a, b) => b.qty - a.qty);
    const activeDoughKg = ((activeCookiesToBake * 170) / 1000).toFixed(2);

    // Product Sales Breakdown
    const productStatsMap = {};
    products.forEach((p) => {
      productStatsMap[p.name] = {
        id: p.id,
        name: p.name,
        image: p.image,
        price: p.price,
        available: p.available,
        qty: 0,
        revenue: 0,
      };
    });
    orders.forEach((o) => {
      (o.items || []).forEach((i) => {
        if (!productStatsMap[i.name]) {
          productStatsMap[i.name] = {
            id: i.id || i.name,
            name: i.name,
            image: '/images/triple_chocolate.jpg',
            price: i.price || 299,
            available: true,
            qty: 0,
            revenue: 0,
          };
        }
        productStatsMap[i.name].qty += Number(i.quantity) || 1;
        productStatsMap[i.name].revenue += (Number(i.quantity) || 1) * (Number(i.price) || 299);
      });
    });
    const productBreakdown = Object.values(productStatsMap).sort((a, b) => b.revenue - a.revenue);

    // Payment Mode Breakdown
    const paymentBreakdown = {
      upi: { label: 'Instant UPI Transfer', count: 0, revenue: 0 },
      cod: { label: 'Pay on Collection / Handover', count: 0, revenue: 0 },
      card: { label: 'Online Cards / NetBanking', count: 0, revenue: 0 },
    };
    orders.forEach((o) => {
      const method = (o.customer?.paymentMethod || 'upi').toLowerCase();
      const bucket = paymentBreakdown[method] ? method : 'upi';
      paymentBreakdown[bucket].count += 1;
      paymentBreakdown[bucket].revenue += Number(o.finalTotal) || 0;
    });

    // Fulfillment Channel Breakdown
    const channelBreakdown = {};
    orders.forEach((o) => {
      const ch = o.customer?.isBulkOrder
        ? 'Bulk Delivery Dispatch'
        : o.channel || 'Website Pre-Order (Pickup)';
      if (!channelBreakdown[ch]) {
        channelBreakdown[ch] = { label: ch, count: 0, revenue: 0 };
      }
      channelBreakdown[ch].count += 1;
      channelBreakdown[ch].revenue += Number(o.finalTotal) || 0;
    });

    // Pickup Slot Breakdown
    const slotBreakdown = {};
    orders.forEach((o) => {
      const slot = o.customer?.slot || 'Today Evening (5:00 PM – 8:00 PM)';
      if (!slotBreakdown[slot]) {
        slotBreakdown[slot] = { label: slot, count: 0, cookies: 0 };
      }
      slotBreakdown[slot].count += 1;
      slotBreakdown[slot].cookies += Number(o.totalItems) || 0;
    });

    // Customer Directory Aggregation
    const customerMap = {};
    orders.forEach((o) => {
      const phoneKey = (o.customer?.phone || '').replace(/\D/g, '') || o.customer?.name || o.id;
      if (!customerMap[phoneKey]) {
        customerMap[phoneKey] = {
          id: phoneKey,
          name: o.customer?.name || 'Valued Guest',
          phone: o.customer?.phone || '—',
          email: o.customer?.email || '—',
          totalOrders: 0,
          totalSpent: 0,
          totalCookies: 0,
          lastOrderDate: o.date || 'Today',
          favoriteCookie: o.items?.[0]?.name || 'Triple Chocolate Overload',
          isBulk: !!o.customer?.isBulkOrder,
        };
      }
      customerMap[phoneKey].totalOrders += 1;
      customerMap[phoneKey].totalSpent += Number(o.finalTotal) || 0;
      customerMap[phoneKey].totalCookies += Number(o.totalItems) || 0;
      if (o.customer?.isBulkOrder) customerMap[phoneKey].isBulk = true;
    });
    const customersList = Object.values(customerMap).sort((a, b) => b.totalSpent - a.totalSpent);

    return {
      totalRevenue,
      cookiesSubtotalRev,
      totalPackagingRev,
      totalCookiesBaked,
      avgOrderValue,
      pendingCount,
      preppingCount,
      readyCount,
      collectedCount,
      activeCookiesToBake,
      activeDoughKg,
      activeBakeList,
      productBreakdown,
      paymentBreakdown: Object.values(paymentBreakdown),
      channelBreakdown: Object.values(channelBreakdown),
      slotBreakdown: Object.values(slotBreakdown),
      customersList,
    };
  }, [orders, products]);

  // Filtered Products for Menu Studio
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.shortDesc || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Filtered Orders for Orders & Kitchen Tab
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      if (orderStatusFilter === 'all') return true;
      const status = (ord.status || '').toLowerCase();
      if (orderStatusFilter === 'pending') return status === 'pending';
      if (orderStatusFilter === 'prepping') return status.includes('prep') || status.includes('bake');
      if (orderStatusFilter === 'ready') return status.includes('ready');
      if (orderStatusFilter === 'collected') return status.includes('collect') || status.includes('complete');
      return true;
    });
  }, [orders, orderStatusFilter]);

  // ============================================================================
  // HANDLERS
  // ============================================================================
  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      showToast(`Saved changes to "${productData.name}"`);
    } else {
      addProduct(productData);
      showToast(`Added "${productData.name}" to live menu`);
    }
    setIsEditorOpen(false);
    setEditingProduct(null);
  };

  const handleDuplicateProduct = (product) => {
    const { id: _unusedId, ...rest } = product;
    addProduct({
      ...rest,
      name: `${product.name} ( Seasonal Drop )`,
      available: false,
    });
    showToast(`Duplicated "${product.name}" (Paused so you can edit it safely)`);
  };

  const handleSaveInlinePrice = (product) => {
    const parsed = Number(inlinePriceValue);
    if (!parsed || parsed < 1) {
      showToast('Please enter a valid price');
      return;
    }
    updateProduct(product.id, { price: parsed });
    setInlinePriceId(null);
    showToast(`Updated ${product.name} price to ₹${parsed}`);
  };

  const handleCreateManualOrder = (e) => {
    e.preventDefault();
    if (!manualOrder.name.trim() || !manualOrder.phone.trim()) return;
    const chosenProd =
      products.find((p) => String(p.id) === String(manualOrder.selectedProductId)) || products[0];
    const qty = Math.max(1, Number(manualOrder.quantity) || 1);
    const subTotal = (chosenProd?.price || 299) * qty;
    const packFee = Number(manualOrder.packagingFee) || 0;
    const orderId = `SUK-${Math.floor(1000 + Math.random() * 9000)}`;

    addOrder({
      id: orderId,
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      channel: manualOrder.channel,
      totalItems: qty,
      totalPrice: subTotal,
      packagingFee: packFee,
      finalTotal: subTotal + packFee,
      customer: {
        name: manualOrder.name.trim(),
        phone: manualOrder.phone.trim(),
        slot: manualOrder.slot,
        paymentMethod: manualOrder.paymentMethod,
        note: manualOrder.note.trim(),
        isBulkOrder: qty >= 20,
      },
      items: [
        {
          id: chosenProd?.id || 1,
          name: chosenProd?.name || 'Triple Chocolate Overload',
          quantity: qty,
          price: chosenProd?.price || 299,
          weight: chosenProd?.weight || '170g (6oz)',
          image: chosenProd?.image || '/images/triple_chocolate.jpg',
        },
      ],
    });

    setIsNewOrderOpen(false);
    setManualOrder({
      name: '',
      phone: '',
      channel: 'WhatsApp Direct',
      slot: 'Today Evening (5:00 PM – 8:00 PM)',
      paymentMethod: 'upi',
      selectedProductId: products[0]?.id || 1,
      quantity: 2,
      packagingFee: 0,
      note: '',
    });
    showToast(`Logged Order #${orderId}`);
  };

  const handleExportCSV = () => {
    const headers = ['Order ID', 'Date', 'Time', 'Customer', 'Phone', 'Slot', 'Items', 'Packaging Fee', 'Total INR', 'Status'];
    const rows = orders.map((o) => [
      o.id,
      o.date,
      o.time,
      `"${(o.customer?.name || '').replace(/"/g, '""')}"`,
      o.customer?.phone || '',
      `"${(o.customer?.slot || '').replace(/"/g, '""')}"`,
      `"${(o.items || []).map((i) => `${i.name} x${i.quantity}`).join('; ')}"`,
      o.packagingFee || 0,
      o.finalTotal || 0,
      o.status || 'Pending',
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sukie_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Downloaded Orders CSV Ledger');
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (newPin.length < 4) {
      setPinMessage({ type: 'error', text: 'PIN must be at least 4 digits.' });
      return;
    }
    if (newPin !== confirmPin) {
      setPinMessage({ type: 'error', text: 'PINs do not match.' });
      return;
    }
    changePin(newPin);
    setNewPin('');
    setConfirmPin('');
    setPinMessage({ type: 'success', text: 'Admin PIN updated!' });
    showToast('Security PIN updated');
    setTimeout(() => setPinMessage({ type: '', text: '' }), 3000);
  };

  const getOrderStepIndex = (statusStr) => {
    const s = (statusStr || '').toLowerCase();
    if (s.includes('collect') || s.includes('complete')) return 3;
    if (s.includes('ready')) return 2;
    if (s.includes('prep') || s.includes('bake')) return 1;
    return 0;
  };

  const navTabs = [
    {
      id: 'orders',
      label: 'Orders & Kitchen',
      icon: ShoppingBag,
      badge: metrics.pendingCount + metrics.preppingCount || null,
    },
    {
      id: 'menu',
      label: 'Menu Studio',
      icon: Sparkles,
      badge: `${products.filter((p) => p.available).length}/${products.length}`,
    },
    {
      id: 'analytics',
      label: 'Sales & Breakdown',
      icon: BarChart3,
    },
    {
      id: 'customers',
      label: 'Customers & B2B',
      icon: Users,
      badge: metrics.customersList.length + (bulkInquiries?.length || 0),
    },
    {
      id: 'settings',
      label: 'Atelier Controls',
      icon: Settings,
    },
  ];

  return (
    <div className="fixed inset-0 z-[150] bg-[#061024] text-white overflow-y-auto selection:bg-[#C5A059] selection:text-stone-950 font-sans">
      {/* Subtle Ambient Royal Glow */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-[#0C419C]/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[450px] h-[450px] bg-[#C5A059]/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Toast Feedback Banner */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-[300] bg-gradient-to-r from-[#091E46] to-[#0C317A] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-semibold border border-[#C5A059]"
          >
            <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================================================================== */}
      {/* CLEAN, SPACIOUS STICKY HEADER                                         */}
      {/* ===================================================================== */}
      <header className="sticky top-0 z-40 bg-[#061024]/90 backdrop-blur-xl border-b border-[#C5A059]/25 px-4 sm:px-8 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left: Brand Identity & Reassurance */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0C419C] to-[#082256] p-1 border border-[#C5A059]/60 flex items-center justify-center shadow-md shrink-0">
                <img src="/images/logo.png" alt="Sukié" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-heading text-lg sm:text-xl font-bold text-white tracking-wide">
                    Sukié Founder Studio
                  </h1>
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Auto-Save Active
                  </span>
                </div>
                <p className="text-xs text-white/60">
                  Complete control over orders, oven batches, 3-month menu drops &amp; revenue
                </p>
              </div>
            </div>

            {/* Mobile Exit Button */}
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-white/15"
            >
              <span>Storefront</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#C5A059]" />
            </button>
          </div>

          {/* Center: 5 Clean Navigation Pills */}
          <nav className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#C5A059] to-[#DFBD73] text-stone-950 font-bold shadow-[0_4px_20px_rgba(197,160,89,0.35)]'
                      : 'bg-white/[0.05] text-white/75 hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        isActive ? 'bg-stone-950 text-[#F3E5AB]' : 'bg-[#0C419C] text-white'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Desktop Return to Website Button */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer border border-[#C5A059]/30"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#C5A059]" />
            </button>
          </div>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* MAIN CONTENT CONTAINER (SPACIOUS & NATURALLY SCROLLABLE)              */}
      {/* ===================================================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-10 pb-28 space-y-8 relative z-10">
        {/* =================================================================== */}
        {/* TAB 1: ORDERS & KITCHEN (COMPLETE DAILY DISPATCH & OVEN SHEET)      */}
        {/* =================================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-8">
            {/* Top 4 Executive Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#0A1E46] to-[#071533] border border-[#C5A059]/30 shadow-xl">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#F3E5AB] block">
                  Total Revenue
                </span>
                <p className="font-heading text-2xl sm:text-3xl font-bold text-white mt-2">
                  ₹{metrics.totalRevenue.toLocaleString('en-IN')}
                </p>
                <span className="text-xs text-white/55 mt-1 block">
                  Across {orders.length} atelier orders
                </span>
              </div>

              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#0A1E46] to-[#071533] border border-amber-400/30 shadow-xl">
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-300 block">
                  To Bake Right Now
                </span>
                <p className="font-heading text-2xl sm:text-3xl font-bold text-amber-300 mt-2">
                  {metrics.activeCookiesToBake} Cookies
                </p>
                <span className="text-xs text-white/55 mt-1 block">
                  {metrics.pendingCount + metrics.preppingCount} orders in active queue ({metrics.activeDoughKg} kg dough)
                </span>
              </div>

              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#0A1E46] to-[#071533] border border-emerald-400/30 shadow-xl">
                <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-300 block">
                  Ready for Pickup
                </span>
                <p className="font-heading text-2xl sm:text-3xl font-bold text-emerald-400 mt-2">
                  {metrics.readyCount} Boxes
                </p>
                <span className="text-xs text-white/55 mt-1 block">
                  Awaiting customer / courier
                </span>
              </div>

              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#0A1E46] to-[#071533] border border-white/10 shadow-xl">
                <span className="text-[11px] font-mono uppercase tracking-wider text-white/60 block">
                  Completed Handovers
                </span>
                <p className="font-heading text-2xl sm:text-3xl font-bold text-white mt-2">
                  {metrics.collectedCount} Orders
                </p>
                <span className="text-xs text-white/55 mt-1 block">
                  {metrics.totalCookiesBaked} total 170g cookies sold
                </span>
              </div>
            </div>

            {/* Collapsible "Today's Kitchen Oven Bake Sheet" Breakdown */}
            <div className="rounded-3xl bg-gradient-to-r from-[#0A1F4A] via-[#0D285E] to-[#0A1F4A] border border-[#C5A059]/40 p-5 sm:p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#C5A059]/20 border border-[#C5A059]/50 flex items-center justify-center text-[#F3E5AB]">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading text-lg font-bold text-white">
                        Kitchen Oven Bake Breakdown
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#C5A059]/20 text-[#F3E5AB] text-[10px] font-mono font-bold uppercase">
                        {metrics.activeCookiesToBake} Cookies Needed
                      </span>
                    </div>
                    <p className="text-xs text-white/65">
                      Exact count of cookies needed for all <strong className="text-white">Pending</strong> &amp; <strong className="text-white">In-Oven</strong> orders right now
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowBakeSheet(!showBakeSheet)}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-[#F3E5AB] cursor-pointer self-start sm:self-auto"
                >
                  {showBakeSheet ? 'Hide Bake Sheet' : 'Show Bake Sheet'}
                </button>
              </div>

              {showBakeSheet && (
                <div className="mt-5 pt-5 border-t border-white/10">
                  {metrics.activeBakeList.length === 0 ? (
                    <p className="text-xs text-emerald-300 font-medium">
                      ✓ All current orders are already boxed or collected! No pending cookies waiting for the oven.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {metrics.activeBakeList.map((item) => (
                        <div
                          key={item.name}
                          className="p-3.5 rounded-2xl bg-black/35 border border-white/10 flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">{item.name}</p>
                            <span className="text-[11px] text-white/50 font-mono">
                              Across {item.ordersCount} {item.ordersCount === 1 ? 'order' : 'orders'} • {(item.qty * 0.17).toFixed(2)} kg
                            </span>
                          </div>
                          <span className="px-3 py-1.5 rounded-xl bg-[#C5A059] text-stone-950 font-mono font-bold text-sm shrink-0">
                            ×{item.qty}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Filter Pills & Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                {[
                  { id: 'all', label: `All Orders (${orders.length})` },
                  { id: 'pending', label: `Pending (${metrics.pendingCount})` },
                  { id: 'prepping', label: `In Ovens (${metrics.preppingCount})` },
                  { id: 'ready', label: `Ready for Pickup (${metrics.readyCount})` },
                  { id: 'collected', label: `Collected (${metrics.collectedCount})` },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setOrderStatusFilter(f.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      orderStatusFilter === f.id
                        ? 'bg-[#0C419C] text-white border border-[#C5A059]'
                        : 'bg-[#0A1E46] text-white/70 hover:text-white border border-white/10'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer border border-white/15"
                >
                  <Download className="w-4 h-4 text-[#C5A059]" />
                  <span>Export CSV</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsNewOrderOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#DFBD73] hover:brightness-105 text-stone-950 text-xs font-bold flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log Walk-in / WhatsApp Order</span>
                </button>
              </div>
            </div>

            {/* Order Cards List with Complete Item & Financial Breakdown */}
            <div className="space-y-5">
              {filteredOrders.length === 0 ? (
                <div className="p-12 rounded-3xl bg-[#0A1E46]/70 border border-white/10 text-center space-y-2">
                  <ShoppingBag className="w-8 h-8 text-[#C5A059] mx-auto opacity-80" />
                  <h3 className="font-heading text-lg font-bold text-white">
                    No orders in this filter
                  </h3>
                  <p className="text-xs text-white/60">
                    Switch filters above or log a new WhatsApp / Walk-in order.
                  </p>
                </div>
              ) : (
                filteredOrders.map((ord) => {
                  const stepIdx = getOrderStepIndex(ord.status);
                  const steps = ['Pending', 'Kitchen Prepping', 'Ready for Collection', 'Collected'];

                  return (
                    <div
                      key={ord.id}
                      className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#0A1E46] via-[#091A3E] to-[#07132E] border border-[#C5A059]/25 hover:border-[#C5A059]/50 transition-all shadow-xl space-y-5"
                    >
                      {/* Top Row: Order ID, Channel, Customer Info & Price Breakdown */}
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-white/10">
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="font-mono text-base font-bold text-[#F3E5AB] bg-black/30 px-3 py-1 rounded-xl border border-[#C5A059]/30">
                              #{ord.id}
                            </span>
                            <span className="text-xs text-white/60 font-mono">
                              {ord.date} • {ord.time}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-[#0C419C]/40 text-blue-200 border border-blue-400/30">
                              {ord.channel || 'Website Pickup'}
                            </span>
                            {ord.customer?.isBulkOrder && (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-amber-500/20 text-amber-300 border border-amber-400/30 font-bold">
                                ★ Bulk Delivery Order
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 pt-1">
                            <h3 className="font-heading text-xl font-bold text-white">
                              {ord.customer?.name}
                            </h3>
                            <a
                              href={`tel:${ord.customer?.phone}`}
                              className="text-xs text-emerald-300 hover:underline font-mono flex items-center gap-1.5"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>{ord.customer?.phone}</span>
                            </a>
                            <span className="text-xs text-white/75 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                              <span>Slot: <strong className="text-white">{ord.customer?.slot || 'Today Evening'}</strong></span>
                            </span>
                          </div>
                        </div>

                        {/* Itemized Financial Breakdown Box */}
                        <div className="flex flex-wrap items-center gap-4 bg-black/30 p-3.5 rounded-2xl border border-white/10">
                          <div className="text-xs space-y-0.5 pr-4 border-r border-white/10">
                            <div className="text-white/60 flex justify-between gap-4">
                              <span>Cookies ({ord.totalItems || 1}):</span>
                              <span className="font-mono text-white">
                                ₹{(ord.totalPrice || ord.finalTotal - (ord.packagingFee || 0)).toLocaleString('en-IN')}
                              </span>
                            </div>
                            <div className="text-white/60 flex justify-between gap-4">
                              <span>Gift Box:</span>
                              <span className="font-mono text-[#F3E5AB]">
                                {ord.packagingFee > 0 ? `+₹${ord.packagingFee}` : (ord.totalItems >= 4 ? 'FREE (4+ Box)' : 'Standard')}
                              </span>
                            </div>
                            <div className="text-white/60 flex justify-between gap-4">
                              <span>Payment:</span>
                              <span className="font-mono uppercase text-emerald-300">
                                {ord.customer?.paymentMethod || 'UPI'}
                              </span>
                            </div>
                          </div>

                          <div className="text-right pr-1">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 block">
                              Final Total
                            </span>
                            <span className="font-heading text-2xl font-bold text-[#F3E5AB]">
                              ₹{(ord.finalTotal || 0).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Middle Row: Ordered Cookies Pills + Special Notes */}
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          {(ord.items || []).map((item, idx) => (
                            <div
                              key={idx}
                              className="px-3.5 py-2 rounded-xl bg-black/35 border border-white/10 text-xs flex items-center gap-2.5"
                            >
                              <span className="w-6 h-6 rounded-lg bg-[#C5A059]/20 text-[#F3E5AB] font-mono font-bold flex items-center justify-center text-xs">
                                {item.quantity}×
                              </span>
                              <div>
                                <span className="text-white font-semibold block">{item.name}</span>
                                <span className="text-[10px] text-white/50 font-mono">
                                  ₹{item.price || 299} each • ₹{((item.price || 299) * (item.quantity || 1)).toLocaleString('en-IN')}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {(ord.customer?.note || ord.customer?.address) && (
                          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-400/25 text-xs text-amber-100 space-y-1">
                            {ord.customer?.note && (
                              <p>
                                <strong className="text-amber-300">Kitchen / Courier Note:</strong> {ord.customer.note}
                              </p>
                            )}
                            {ord.customer?.address && (
                              <p>
                                <strong className="text-amber-300">Bulk Delivery Address:</strong> {ord.customer.address}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Bottom Row: 1-Click 4-Step Kitchen Status Bar & WhatsApp Notification */}
                      <div className="pt-3 border-t border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* 4-Step Interactive Status Pills (No ugly native <select>!) */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-mono uppercase tracking-wider text-white/50 mr-1">
                            1-Click Stage:
                          </span>
                          {steps.map((st, idx) => {
                            const isCurrent = stepIdx === idx;
                            const isDone = stepIdx > idx;
                            return (
                              <button
                                key={st}
                                type="button"
                                onClick={() => {
                                  updateOrderStatus(ord.id, st);
                                  showToast(`Order #${ord.id} → ${st}`);
                                }}
                                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                                  isCurrent
                                    ? 'bg-[#C5A059] text-stone-950 font-bold shadow-md'
                                    : isDone
                                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                    : 'bg-white/[0.05] text-white/65 hover:bg-white/10 border border-white/10'
                                }`}
                              >
                                <span>{isDone ? '✓' : `${idx + 1}.`}</span>
                                <span>{st === 'Kitchen Prepping' ? 'In Ovens 160°C' : st}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Right Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => setNotifyModalOrder(ord)}
                            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span>Send WhatsApp Update</span>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleCopyText(
                                `${window.location.origin}/#track=${ord.id}`,
                                `track-${ord.id}`
                              )
                            }
                            className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white/85 text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-white/10"
                            title="Copy Customer Live Tracking Link"
                          >
                            {copiedId === `track-${ord.id}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-[#C5A059]" />
                            )}
                            <span>Copy Tracker Link</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              deleteOrder(ord.id);
                              showToast(`Removed Order #${ord.id}`);
                            }}
                            className="p-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-300 transition-colors cursor-pointer"
                            title="Delete Order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: MENU STUDIO (STRESS-FREE 3-MONTH MENU, INLINE PRICE & STOCK) */}
        {/* =================================================================== */}
        {activeTab === 'menu' && (
          <div className="space-y-8">
            {/* Stress-Free Reassurance & Quick Batch Controls Banner */}
            <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-[#0A1E46] via-[#0D285E] to-[#0A1E46] border border-[#C5A059]/40 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#C5A059]/20 text-[#F3E5AB] text-[10px] font-mono uppercase tracking-wider font-bold">
                    ✦ Stress-Free Menu Studio
                  </span>
                  <span className="text-xs text-emerald-300 font-mono">
                    • Instant Live Sync
                  </span>
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                  Quarterly Drops, Prices &amp; Stock Control
                </h2>
                <p className="text-xs sm:text-sm text-white/70 max-w-2xl">
                  Change any price directly on the card, mark a flavor Sold Out in 1 click, or launch a new seasonal cookie. Made a mistake? You can restore the default menu anytime.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setAllProductsAvailability(true);
                    showToast('All cookies marked In Stock on website!');
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-semibold cursor-pointer"
                >
                  Mark All In Stock
                </button>

                <button
                  type="button"
                  onClick={() => setConfirmResetMenu(true)}
                  className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 border border-white/15 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Restore Default Menu</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setIsEditorOpen(true);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#DFBD73] hover:brightness-105 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Cookie / Box</span>
                </button>
              </div>
            </div>

            {/* Confirmation bar for Restore Default Menu */}
            {confirmResetMenu && (
              <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-400/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-xs text-amber-100">
                  <strong>Restore Original Sukié Menu?</strong> This will reset all cookie photos, prices, and descriptions to the official default collection.
                </p>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      resetToDefaultMenu();
                      setConfirmResetMenu(false);
                      showToast('Restored default Sukié menu collection');
                    }}
                    className="px-4 py-2 rounded-xl bg-[#C5A059] text-stone-950 font-bold text-xs cursor-pointer"
                  >
                    Yes, Restore Defaults
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmResetMenu(false)}
                    className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Category Filter & Search */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap ${
                    selectedCategory === 'all'
                      ? 'bg-[#0C419C] text-white border border-[#C5A059]'
                      : 'bg-[#0A1E46] text-white/70 hover:text-white border border-white/10'
                  }`}
                >
                  All Items ({products.length})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap ${
                      selectedCategory === cat.id
                        ? 'bg-[#0C419C] text-white border border-[#C5A059]'
                        : 'bg-[#0A1E46] text-white/70 hover:text-white border border-white/10'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search cookie or box..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0A1E46] border border-white/15 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            {/* Product Grid with Stress-Free Inline Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={`rounded-3xl bg-gradient-to-br from-[#0A1E46] to-[#071533] border transition-all overflow-hidden flex flex-col justify-between shadow-xl ${
                    product.available
                      ? 'border-[#C5A059]/30 hover:border-[#C5A059]/60'
                      : 'border-red-500/30 opacity-85'
                  }`}
                >
                  <div>
                    {/* Product Image & Stock Pill */}
                    <div className="relative h-52 bg-stone-950 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#071533] via-black/20 to-transparent" />

                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider shadow-md ${
                            product.available
                              ? 'bg-emerald-600 text-white'
                              : 'bg-red-600 text-white'
                          }`}
                        >
                          {product.available ? '● In Stock' : '○ Sold Out'}
                        </span>
                      </div>

                      {/* Quick Edit Photo Button on Image */}
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProduct(product);
                          setIsEditorOpen(true);
                        }}
                        className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/70 hover:bg-[#C5A059] text-white hover:text-stone-950 text-[10px] font-semibold backdrop-blur-md border border-white/20 transition-colors cursor-pointer"
                      >
                        Change Photo / Recipe
                      </button>

                      {/* Bottom Row on Image: Inline Price Editor */}
                      <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                        {inlinePriceId === product.id ? (
                          <div className="flex items-center gap-1.5 bg-black/85 p-1.5 rounded-xl border border-[#C5A059]">
                            <span className="text-xs font-mono text-[#F3E5AB] pl-1">₹</span>
                            <input
                              type="number"
                              value={inlinePriceValue}
                              onChange={(e) => setInlinePriceValue(e.target.value)}
                              className="w-20 px-2 py-1 rounded-lg bg-white/10 text-white font-mono text-sm font-bold focus:outline-none"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveInlinePrice(product)}
                              className="px-2.5 py-1 rounded-lg bg-[#C5A059] text-stone-950 text-[11px] font-bold cursor-pointer"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setInlinePriceId(null)}
                              className="px-2 py-1 text-white/60 hover:text-white text-[11px] cursor-pointer"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-heading text-2xl font-bold text-[#F3E5AB]">
                              ₹{product.price}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setInlinePriceId(product.id);
                                setInlinePriceValue(String(product.price));
                              }}
                              className="px-2 py-0.5 rounded-lg bg-white/15 hover:bg-white/25 text-[10px] text-white/90 font-mono cursor-pointer"
                              title="Quick change price"
                            >
                              Edit ₹
                            </button>
                          </div>
                        )}
                        <span className="text-xs text-white/80 font-mono bg-black/50 px-2.5 py-1 rounded-lg">
                          {product.weight}
                        </span>
                      </div>
                    </div>

                    {/* Product Title, Description & Ingredients Preview */}
                    <div className="p-5 space-y-2.5">
                      <h3 className="font-heading text-lg font-bold text-white leading-snug">
                        {product.name}
                      </h3>
                      <p className="text-xs text-white/65 line-clamp-2 leading-relaxed">
                        {product.shortDesc}
                      </p>
                      {product.ingredients && product.ingredients.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {product.ingredients.slice(0, 3).map((ing, i) => (
                            <span
                              key={i}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.05] text-white/60 border border-white/10"
                            >
                              {ing}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer Controls */}
                  <div className="p-5 pt-0 space-y-2">
                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => {
                          toggleProductAvailability(product.id);
                          showToast(
                            product.available
                              ? `"${product.name}" marked Sold Out`
                              : `"${product.name}" is back In Stock`
                          );
                        }}
                        className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                          product.available
                            ? 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {product.available ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>Mark Sold Out</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>Mark In Stock</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingProduct(product);
                          setIsEditorOpen(true);
                        }}
                        className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-white/10"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>Full Edit</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => handleDuplicateProduct(product)}
                        className="text-[11px] text-white/50 hover:text-[#F3E5AB] flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Duplicate for Next Drop</span>
                      </button>

                      {confirmDeleteId === product.id ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              deleteProduct(product.id);
                              setConfirmDeleteId(null);
                              showToast(`Deleted "${product.name}"`);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-red-600 text-white text-[10px] font-bold cursor-pointer"
                          >
                            Confirm Delete
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-2 py-1 text-white/60 text-[10px] cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(product.id)}
                          className="text-[11px] text-white/40 hover:text-red-400 flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: SALES & BREAKDOWN (COMPLETE FINANCIAL & FLAVOR BREAKDOWN)    */}
        {/* =================================================================== */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Top 4 Financial Pillar Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0A1E46] to-[#071533] border border-[#C5A059]/35 shadow-xl">
                <span className="text-xs text-[#F3E5AB] font-mono uppercase">Gross Revenue</span>
                <p className="font-heading text-3xl font-bold text-white mt-2">
                  ₹{metrics.totalRevenue.toLocaleString('en-IN')}
                </p>
                <span className="text-xs text-white/55 mt-1 block">
                  Cookies: ₹{metrics.cookiesSubtotalRev.toLocaleString('en-IN')} • Gift Boxes: ₹{metrics.totalPackagingRev.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0A1E46] to-[#071533] border border-white/10 shadow-xl">
                <span className="text-xs text-white/60 font-mono uppercase">Average Order Value</span>
                <p className="font-heading text-3xl font-bold text-[#F3E5AB] mt-2">
                  ₹{metrics.avgOrderValue.toLocaleString('en-IN')}
                </p>
                <span className="text-xs text-white/55 mt-1 block">
                  Across {orders.length} total orders
                </span>
              </div>

              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0A1E46] to-[#071533] border border-white/10 shadow-xl">
                <span className="text-xs text-white/60 font-mono uppercase">Total Cookies Sold</span>
                <p className="font-heading text-3xl font-bold text-emerald-400 mt-2">
                  {metrics.totalCookiesBaked} Units
                </p>
                <span className="text-xs text-white/55 mt-1 block">
                  {((metrics.totalCookiesBaked * 170) / 1000).toFixed(1)} kg total artisanal batch weight
                </span>
              </div>

              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0A1E46] to-[#071533] border border-white/10 shadow-xl">
                <span className="text-xs text-white/60 font-mono uppercase">Repeat &amp; VIP Patrons</span>
                <p className="font-heading text-3xl font-bold text-white mt-2">
                  {metrics.customersList.length} Clients
                </p>
                <span className="text-xs text-white/55 mt-1 block">
                  {bulkInquiries?.length || 0} Corporate B2B leads logged
                </span>
              </div>
            </div>

            {/* Complete Product-by-Product Revenue & Unit Share Breakdown */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0A1E46] to-[#071533] border border-[#C5A059]/30 shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-heading text-xl font-bold text-white">
                    Complete Cookie &amp; Box Sales Breakdown
                  </h3>
                  <p className="text-xs text-white/60">
                    Exact units sold, revenue generated, and share of total bakery sales for every menu item
                  </p>
                </div>
                <span className="text-xs font-mono text-[#F3E5AB]">
                  Sorted by Highest Revenue
                </span>
              </div>

              <div className="space-y-4">
                {metrics.productBreakdown.map((item, idx) => {
                  const sharePct =
                    metrics.totalRevenue > 0
                      ? Math.min(100, Math.round((item.revenue / metrics.totalRevenue) * 100))
                      : 0;
                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-7 h-7 rounded-lg bg-[#C5A059]/20 text-[#F3E5AB] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                            #{idx + 1}
                          </span>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 rounded-xl object-cover border border-white/15 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="font-bold text-sm text-white block truncate">
                              {item.name}
                            </span>
                            <span className="text-[11px] text-white/50 font-mono">
                              ₹{item.price} per unit • {item.qty} sold
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-heading text-lg font-bold text-[#F3E5AB] block">
                            ₹{item.revenue.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-300">
                            {sharePct}% of sales
                          </span>
                        </div>
                      </div>

                      <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#0C419C] via-[#C5A059] to-[#F3E5AB]"
                          style={{ width: `${Math.max(4, sharePct)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3-Column Operational Breakdown: Payment Modes, Channels & Pickup Slots */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Payment Mode Breakdown */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0A1E46] to-[#071533] border border-white/10 shadow-xl space-y-4">
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-5 h-5 text-[#C5A059]" />
                  <h4 className="font-heading text-lg font-bold text-white">
                    Payment Mode Breakdown
                  </h4>
                </div>
                <div className="space-y-3">
                  {metrics.paymentBreakdown.map((pm) => (
                    <div
                      key={pm.label}
                      className="p-3.5 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-between"
                    >
                      <div>
                        <span className="text-xs font-bold text-white block">{pm.label}</span>
                        <span className="text-[11px] text-white/50 font-mono">
                          {pm.count} {pm.count === 1 ? 'order' : 'orders'}
                        </span>
                      </div>
                      <span className="font-heading font-bold text-base text-[#F3E5AB]">
                        ₹{pm.revenue.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Channel Breakdown */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0A1E46] to-[#071533] border border-white/10 shadow-xl space-y-4">
                <div className="flex items-center gap-2.5">
                  <TrendingUp className="w-5 h-5 text-[#C5A059]" />
                  <h4 className="font-heading text-lg font-bold text-white">
                    Order Source Breakdown
                  </h4>
                </div>
                <div className="space-y-3">
                  {metrics.channelBreakdown.map((ch) => (
                    <div
                      key={ch.label}
                      className="p-3.5 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-between"
                    >
                      <div>
                        <span className="text-xs font-bold text-white block">{ch.label}</span>
                        <span className="text-[11px] text-white/50 font-mono">
                          {ch.count} {ch.count === 1 ? 'order' : 'orders'}
                        </span>
                      </div>
                      <span className="font-heading font-bold text-base text-emerald-300">
                        ₹{ch.revenue.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pickup Slot Demand Breakdown */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0A1E46] to-[#071533] border border-white/10 shadow-xl space-y-4">
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-5 h-5 text-[#C5A059]" />
                  <h4 className="font-heading text-lg font-bold text-white">
                    Pickup Slot Popularity
                  </h4>
                </div>
                <div className="space-y-3">
                  {metrics.slotBreakdown.map((sl) => (
                    <div
                      key={sl.label}
                      className="p-3.5 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-white block truncate">
                          {sl.label}
                        </span>
                        <span className="text-[11px] text-white/50 font-mono">
                          {sl.count} {sl.count === 1 ? 'pickup' : 'pickups'}
                        </span>
                      </div>
                      <span className="px-2.5 py-1 rounded-xl bg-[#C5A059]/20 text-[#F3E5AB] font-mono text-xs font-bold shrink-0">
                        {sl.cookies} cookies
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 4: CUSTOMERS & B2B (VIP CLIENT DOSSIER & CORPORATE LEADS)       */}
        {/* =================================================================== */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            {/* Sub-tab Switcher between VIP Patrons & Corporate B2B Leads */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCrmSubTab('vip')}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-all ${
                    crmSubTab === 'vip'
                      ? 'bg-[#C5A059] text-stone-950 shadow-md'
                      : 'bg-[#0A1E46] text-white/75 hover:text-white border border-white/10'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>VIP Customer Directory ({metrics.customersList.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCrmSubTab('b2b')}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-all ${
                    crmSubTab === 'b2b'
                      ? 'bg-[#C5A059] text-stone-950 shadow-md'
                      : 'bg-[#0A1E46] text-white/75 hover:text-white border border-white/10'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Corporate &amp; Bulk Inquiries ({bulkInquiries?.length || 0})</span>
                </button>
              </div>

              {crmSubTab === 'b2b' && (
                <button
                  type="button"
                  onClick={() => setIsNewB2BOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#DFBD73] text-stone-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log Corporate / Event Lead</span>
                </button>
              )}
            </div>

            {crmSubTab === 'vip' ? (
              <div className="space-y-4">
                <p className="text-xs text-white/60">
                  Click any patron card below to open their full <strong>VIP Client Dossier</strong> (complete order history, lifetime spend, favorite cookie, and 1-click WhatsApp concierge chat).
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {metrics.customersList.map((cust) => (
                    <div
                      key={cust.id}
                      onClick={() => setSelectedCustomer(cust)}
                      className="p-6 rounded-3xl bg-gradient-to-br from-[#0A1E46] to-[#071533] border border-[#C5A059]/25 hover:border-[#C5A059] transition-all cursor-pointer flex flex-col justify-between gap-4 shadow-xl group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-[#0C419C] border border-[#C5A059]/50 flex items-center justify-center font-heading font-bold text-sm text-[#F3E5AB]">
                              {cust.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="font-heading text-base font-bold text-white group-hover:text-[#F3E5AB] transition-colors">
                                {cust.name}
                              </h3>
                              <span className="text-xs text-white/55 font-mono block">
                                {cust.phone}
                              </span>
                            </div>
                          </div>

                          {(cust.totalSpent >= 2500 || cust.isBulk) && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-amber-500/20 text-amber-300 border border-amber-400/30 font-bold">
                              ★ VIP
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2.5 pt-2">
                          <div className="p-3 rounded-2xl bg-black/30 border border-white/10">
                            <span className="text-[10px] text-white/45 font-mono uppercase block">
                              Lifetime Spend
                            </span>
                            <span className="font-heading text-lg font-bold text-[#F3E5AB]">
                              ₹{cust.totalSpent.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div className="p-3 rounded-2xl bg-black/30 border border-white/10">
                            <span className="text-[10px] text-white/45 font-mono uppercase block">
                              Orders Placed
                            </span>
                            <span className="font-heading text-lg font-bold text-white">
                              {cust.totalOrders} ({cust.totalCookies} cookies)
                            </span>
                          </div>
                        </div>

                        <div className="text-xs text-white/65 flex items-center justify-between pt-1">
                          <span>Favorite: <strong className="text-white">{cust.favoriteCookie}</strong></span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#C5A059] font-semibold">
                        <span>Open Client Dossier &amp; History</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Corporate & Bulk B2B Inquiries */
              <div className="space-y-4">
                {(!bulkInquiries || bulkInquiries.length === 0) ? (
                  <div className="p-10 rounded-3xl bg-[#0A1E46] border border-white/10 text-center">
                    <p className="text-sm text-white/70">No corporate inquiries logged yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {bulkInquiries.map((inq) => {
                      const cleanPhone = (inq.phone || '').replace(/\D/g, '');
                      const waPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
                      const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(
                        `Hello ${inq.contact}! 🍪 Greetings from Sukié Mumbai Atelier regarding your ${inq.occasion} inquiry (${inq.units} boxes).`
                      )}`;

                      return (
                        <div
                          key={inq.id}
                          className="p-6 rounded-3xl bg-gradient-to-br from-[#0A1E46] to-[#071533] border border-[#C5A059]/30 shadow-xl space-y-4 flex flex-col justify-between"
                        >
                          <div className="space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="text-[10px] font-mono text-[#C5A059] uppercase tracking-wider block">
                                  {inq.id} • {inq.occasion}
                                </span>
                                <h3 className="font-heading text-xl font-bold text-white mt-0.5">
                                  {inq.company}
                                </h3>
                                <p className="text-xs text-white/65">
                                  Contact: <strong className="text-white">{inq.contact}</strong> • {inq.phone}
                                </p>
                              </div>

                              <span className="px-3 py-1 rounded-full bg-[#C5A059]/20 text-[#F3E5AB] text-[10px] font-mono font-bold uppercase border border-[#C5A059]/40">
                                {inq.status}
                              </span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-black/30 border border-white/10 text-xs">
                              <div>
                                <span className="text-[10px] text-white/45 font-mono block">Quantity</span>
                                <span className="font-bold text-white">{inq.units} Boxes</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-white/45 font-mono block">Est. Budget</span>
                                <span className="font-bold text-[#F3E5AB]">{inq.budget}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-white/45 font-mono block">Target Date</span>
                                <span className="font-bold text-emerald-300">{inq.deliveryDate}</span>
                              </div>
                            </div>

                            {inq.notes && (
                              <p className="text-xs text-white/75 italic bg-white/[0.03] p-3 rounded-xl border border-white/10">
                                &ldquo;{inq.notes}&rdquo;
                              </p>
                            )}
                          </div>

                          <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              {['New Inquiry', 'Sample Dispatched', 'Quote Approved'].map((st) => (
                                <button
                                  key={st}
                                  type="button"
                                  onClick={() => {
                                    updateBulkInquiryStatus(inq.id, st);
                                    showToast(`${inq.company} → ${st}`);
                                  }}
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold cursor-pointer ${
                                    inq.status === st
                                      ? 'bg-[#C5A059] text-stone-950 font-bold'
                                      : 'bg-white/10 text-white/70 hover:text-white'
                                  }`}
                                >
                                  {st}
                                </button>
                              ))}
                            </div>

                            <div className="flex items-center gap-2">
                              <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>WhatsApp</span>
                              </a>
                              <button
                                type="button"
                                onClick={() => {
                                  deleteBulkInquiry(inq.id);
                                  showToast('Removed inquiry');
                                }}
                                className="p-1.5 text-white/40 hover:text-red-400 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 5: ATELIER CONTROLS (BANNER TEXT, MODE, REVIEWS & PIN)          */}
        {/* =================================================================== */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. Storefront Mode & Live Oven Banner Text Control */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0A1E46] to-[#071533] border border-[#C5A059]/30 shadow-xl space-y-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] block">
                  Live Storefront Controls
                </span>
                <h3 className="font-heading text-xl font-bold text-white mt-1">
                  Website Mode &amp; Oven Status Banner
                </h3>
              </div>

              {/* Storefront Mode Switch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    updateStoreConfig({ isComingSoon: false });
                    showToast('Storefront is now LIVE for orders!');
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    !storeConfig?.isComingSoon
                      ? 'bg-emerald-500/15 border-emerald-400 text-white shadow-lg'
                      : 'bg-black/25 border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm">Live Ordering Storefront</span>
                    {!storeConfig?.isComingSoon && <Check className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <p className="text-xs text-white/60">
                    Customers can browse the menu, build boxes, and place pre-orders.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    updateStoreConfig({ isComingSoon: true });
                    showToast('Switched public site to Coming Soon Teaser');
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    storeConfig?.isComingSoon
                      ? 'bg-amber-500/15 border-[#C5A059] text-white shadow-lg'
                      : 'bg-black/25 border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm">Coming Soon Teaser</span>
                    {storeConfig?.isComingSoon && <Check className="w-4 h-4 text-[#C5A059]" />}
                  </div>
                  <p className="text-xs text-white/60">
                    Shows the luxury teaser screen while you prepare the next drop.
                  </p>
                </button>
              </div>

              {/* Live Website Oven Status Badge Editor */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <label className="block text-xs font-bold text-[#F3E5AB]">
                  Website Menu Live Status Pill Text
                </label>
                <p className="text-xs text-white/60">
                  This text appears with the pulsing green dot at the top of your public Menu section.
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={bannerTextDraft}
                    onChange={(e) => setBannerTextDraft(e.target.value)}
                    placeholder="e.g. Ovens Fired Today • Pre-Orders Active"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      updateStoreConfig({ ovenStatusText: bannerTextDraft });
                      showToast('Updated live website oven banner text!');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#C5A059] text-stone-950 font-bold text-xs cursor-pointer shrink-0"
                  >
                    Save Text
                  </button>
                </div>
                {/* Quick Preset Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    'Ovens Fired Today • Pre-Orders Active',
                    'Weekend Batch Open • Limited Boxes Left',
                    'Festive Gifting Drops Now Live',
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setBannerTextDraft(preset);
                        updateStoreConfig({ ovenStatusText: preset });
                        showToast('Applied banner preset!');
                      }}
                      className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/15 text-white/70 border border-white/10 cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Security PIN Control */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0A1E46] to-[#071533] border border-white/10 shadow-xl space-y-5">
              <div className="flex items-center gap-2.5">
                <Lock className="w-5 h-5 text-[#C5A059]" />
                <div>
                  <h3 className="font-heading text-xl font-bold text-white">
                    Founder Security PIN
                  </h3>
                  <p className="text-xs text-white/60">
                    Current Active PIN:{' '}
                    <span className="font-mono text-[#F3E5AB] font-bold">
                      {storeConfig?.adminPin || '8467'}
                    </span>
                  </p>
                </div>
              </div>

              <form onSubmit={handlePinSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={8}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="New 4-Digit PIN"
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-sm text-white font-mono focus:outline-none focus:border-[#C5A059]"
                  />
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={8}
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="Confirm New PIN"
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-sm text-white font-mono focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                {pinMessage.text && (
                  <p
                    className={`text-xs font-semibold ${
                      pinMessage.type === 'error' ? 'text-red-400' : 'text-emerald-400'
                    }`}
                  >
                    {pinMessage.text}
                  </p>
                )}
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#C5A059] text-stone-950 font-bold text-xs cursor-pointer"
                >
                  Update Security PIN
                </button>
              </form>
            </div>

            {/* 3. Customer Reviews & Testimonials Manager (Full Width) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0A1E46] to-[#071533] border border-white/10 lg:col-span-2 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-heading text-xl font-bold text-white">
                    Customer Tasting Reviews ({reviews.length})
                  </h3>
                  <p className="text-xs text-white/60">
                    Manage reviews submitted on the website or add a screenshot/DM review from Instagram or WhatsApp.
                  </p>
                </div>
              </div>

              {/* Add a Featured Review Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newReviewForm.name.trim() || !newReviewForm.comment.trim()) return;
                  addReview({
                    name: newReviewForm.name.trim(),
                    cookie: newReviewForm.cookie,
                    stars: Number(newReviewForm.stars) || 5,
                    comment: newReviewForm.comment.trim(),
                  });
                  setNewReviewForm({
                    name: '',
                    cookie: products[0]?.name || 'Triple Chocolate Overload',
                    stars: 5,
                    comment: '',
                  });
                  showToast('Published review to website!');
                }}
                className="p-4 rounded-2xl bg-black/30 border border-[#C5A059]/30 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
              >
                <input
                  type="text"
                  value={newReviewForm.name}
                  onChange={(e) => setNewReviewForm({ ...newReviewForm, name: e.target.value })}
                  placeholder="Patron Name (e.g. Rhea K.)"
                  className="sm:col-span-3 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                />
                <input
                  type="text"
                  value={newReviewForm.cookie}
                  onChange={(e) => setNewReviewForm({ ...newReviewForm, cookie: e.target.value })}
                  placeholder="Cookie Tasted"
                  className="sm:col-span-3 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                />
                <input
                  type="text"
                  value={newReviewForm.comment}
                  onChange={(e) => setNewReviewForm({ ...newReviewForm, comment: e.target.value })}
                  placeholder="Paste Instagram / WhatsApp praise..."
                  className="sm:col-span-4 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                />
                <button
                  type="submit"
                  className="sm:col-span-2 py-2.5 px-4 rounded-xl bg-[#C5A059] text-stone-950 font-bold text-xs cursor-pointer"
                >
                  + Add Review
                </button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl bg-black/30 border border-white/10 flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white">{rev.name}</span>
                        <span className="text-amber-400 text-xs">{'★'.repeat(rev.stars || 5)}</span>
                      </div>
                      <span className="text-[11px] text-[#C5A059] font-mono block mt-0.5">
                        {rev.cookie}
                      </span>
                      <p className="text-xs text-white/75 mt-2 leading-relaxed">
                        &ldquo;{rev.comment}&rdquo;
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px] text-white/40">
                      <span>{rev.date}</span>
                      <button
                        type="button"
                        onClick={() => {
                          deleteReview(rev.id);
                          showToast('Removed review');
                        }}
                        className="text-red-400 hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ===================================================================== */}
      {/* MODALS & DRAWERS                                                      */}
      {/* ===================================================================== */}

      {/* 1. Product Editor Modal */}
      <ProductEditorModal
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        categories={categories}
        onSave={handleSaveProduct}
      />

      {/* 2. Customer WhatsApp Notification Modal */}
      <NotificationModal
        isOpen={!!notifyModalOrder}
        onClose={() => setNotifyModalOrder(null)}
        order={notifyModalOrder}
        onUpdateStatus={updateOrderStatus}
        showToast={showToast}
      />

      {/* 3. VIP Customer Dossier Drawer */}
      <AnimatePresence>
        {selectedCustomer && (
          <CustomerDrawer
            customer={selectedCustomer}
            orders={orders}
            onClose={() => setSelectedCustomer(null)}
            onSelectOrder={(ord) => {
              setSelectedCustomer(null);
              setActiveTab('orders');
              setNotifyModalOrder(ord);
            }}
          />
        )}
      </AnimatePresence>

      {/* 4. Manual Walk-in / WhatsApp Order Modal */}
      <AnimatePresence>
        {isNewOrderOpen && (
          <div className="fixed inset-0 z-[220] flex items-center justify-center p-4 overflow-y-auto">
            <div
              onClick={() => setIsNewOrderOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative w-full max-w-lg bg-[#091A3E] border border-[#C5A059]/40 rounded-3xl p-6 sm:p-7 text-white shadow-2xl z-10 space-y-5 my-auto"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] block">
                    Quick Kitchen Entry
                  </span>
                  <h3 className="font-heading text-xl font-bold">
                    Log WhatsApp / Walk-in Order
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewOrderOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateManualOrder} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-white/70 block mb-1">Customer Name *</label>
                    <input
                      type="text"
                      required
                      value={manualOrder.name}
                      onChange={(e) => setManualOrder({ ...manualOrder, name: e.target.value })}
                      placeholder="e.g. Rohan Mehta"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/70 block mb-1">WhatsApp Phone *</label>
                    <input
                      type="tel"
                      required
                      value={manualOrder.phone}
                      onChange={(e) => setManualOrder({ ...manualOrder, phone: e.target.value })}
                      placeholder="98201 12345"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                {/* Product Pill Picker */}
                <div>
                  <label className="text-xs text-white/70 block mb-1.5">Select Cookie / Box</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                    {products.map((p) => {
                      const isSel = String(manualOrder.selectedProductId) === String(p.id);
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() =>
                            setManualOrder({ ...manualOrder, selectedProductId: p.id })
                          }
                          className={`p-2.5 rounded-xl border text-left text-xs flex items-center justify-between cursor-pointer ${
                            isSel
                              ? 'bg-[#0C419C] border-[#C5A059] text-white font-bold'
                              : 'bg-black/30 border-white/10 text-white/70 hover:text-white'
                          }`}
                        >
                          <span className="truncate pr-2">{p.name}</span>
                          <span className="font-mono text-[#F3E5AB] shrink-0">₹{p.price}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-white/70 block mb-1">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={manualOrder.quantity}
                      onChange={(e) => setManualOrder({ ...manualOrder, quantity: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/70 block mb-1">Collection Slot</label>
                    <input
                      type="text"
                      value={manualOrder.slot}
                      onChange={(e) => setManualOrder({ ...manualOrder, slot: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsNewOrderOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/10 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#C5A059] text-stone-950 text-xs font-bold cursor-pointer"
                  >
                    Save Order
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. Log Corporate B2B Lead Modal */}
      <AnimatePresence>
        {isNewB2BOpen && (
          <div className="fixed inset-0 z-[220] flex items-center justify-center p-4 overflow-y-auto">
            <div
              onClick={() => setIsNewB2BOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative w-full max-w-lg bg-[#091A3E] border border-[#C5A059]/40 rounded-3xl p-6 text-white shadow-2xl z-10 space-y-4 my-auto"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-heading text-xl font-bold">
                  Log Corporate / Bulk Event Lead
                </h3>
                <button
                  type="button"
                  onClick={() => setIsNewB2BOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newB2BForm.company.trim() || !newB2BForm.contact.trim()) return;
                  addBulkInquiry(newB2BForm);
                  setIsNewB2BOpen(false);
                  showToast(`Added corporate lead: ${newB2BForm.company}`);
                }}
                className="space-y-3"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Company / Event Name *"
                    value={newB2BForm.company}
                    onChange={(e) => setNewB2BForm({ ...newB2BForm, company: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Contact Person *"
                    value={newB2BForm.contact}
                    onChange={(e) => setNewB2BForm({ ...newB2BForm, contact: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={newB2BForm.phone}
                    onChange={(e) => setNewB2BForm({ ...newB2BForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white"
                  />
                  <input
                    type="number"
                    placeholder="Boxes Needed"
                    value={newB2BForm.units}
                    onChange={(e) =>
                      setNewB2BForm({ ...newB2BForm, units: Number(e.target.value) || 20 })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Est. Budget (e.g. ₹25,000)"
                    value={newB2BForm.budget}
                    onChange={(e) => setNewB2BForm({ ...newB2BForm, budget: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white"
                  />
                </div>
                <textarea
                  rows={2}
                  placeholder="Custom sleeve / ribbon or delivery notes..."
                  value={newB2BForm.notes}
                  onChange={(e) => setNewB2BForm({ ...newB2BForm, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsNewB2BOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/10 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#C5A059] text-stone-950 font-bold text-xs cursor-pointer"
                  >
                    Save B2B Lead
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
