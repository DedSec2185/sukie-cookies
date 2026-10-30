import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Sparkles,
  BarChart3,
  Users,
  Palette,
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  Clock,
  Flame,
  Phone,
  Lock,
  ExternalLink,
  Copy,
  Check,
  MessageSquare,
  Calendar,
  Download,
  RotateCcw,
  Building2,
  CreditCard,
  TrendingUp,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Upload,
} from 'lucide-react';
import { useMenu } from '../../context/MenuContext';
import ProductEditorModal from './ProductEditorModal';
import NotificationModal from './NotificationModal';
import CustomerDrawer from './CustomerDrawer';

const BRAND_COLOR_PRESETS = [
  {
    id: 'royal_cobalt',
    name: 'Sukié Royal Cobalt & Gold',
    desc: 'Official signature royal blue, champagne gold & warm cream',
    primary: '#0C419C',
    accent: '#C5A059',
    surface: '#FAF6EE',
  },
  {
    id: 'midnight_navy',
    name: 'Midnight Navy & Champagne',
    desc: 'Deep Parisian midnight blue with bright gold foil',
    primary: '#091D42',
    accent: '#D4AF37',
    surface: '#FDFBF7',
  },
  {
    id: 'espresso_gold',
    name: 'Artisanal Cocoa & Gold',
    desc: 'Rich Belgian dark chocolate brown with warm caramel gold',
    primary: '#3B1F14',
    accent: '#C89D54',
    surface: '#FAF5EE',
  },
  {
    id: 'emerald_patisserie',
    name: 'Emerald Patisserie & Gold',
    desc: 'Classic European botanical emerald with antique gold',
    primary: '#0F4C45',
    accent: '#C5A059',
    surface: '#F7FAF8',
  },
];

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

  const logoInputRef = useRef(null);

  // Live Brand Values
  const brandPrimary = storeConfig?.primaryColor || '#0C419C';
  const brandAccent = storeConfig?.accentColor || '#C5A059';
  const brandLogo = storeConfig?.logoUrl || '/images/logo.png';
  const brandTitle = storeConfig?.brandName || 'Sukié';

  // 5 Short, Clear Mobile-First Tabs (Zero Horizontal Scroll)
  const [activeTab, setActiveTab] = useState('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [crmSubTab, setCrmSubTab] = useState('vip');

  // Progressive Disclosure States (Keeps UI Calm & Spacious!)
  const [showBakeSheet, setShowBakeSheet] = useState(false);
  const [expandedOrderIds, setExpandedOrderIds] = useState({});
  const [expandedMenuIds, setExpandedMenuIds] = useState({});

  // Modals & Drawers
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmResetMenu, setConfirmResetMenu] = useState(false);
  const [notifyModalOrder, setNotifyModalOrder] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [isNewB2BOpen, setIsNewB2BOpen] = useState(false);

  // Inline Quick Price Editing State
  const [inlinePriceId, setInlinePriceId] = useState(null);
  const [inlinePriceValue, setInlinePriceValue] = useState('');

  // Editable Drafts in Brand & Studio
  const [bannerTextDraft, setBannerTextDraft] = useState(
    storeConfig?.ovenStatusText || 'Ovens Fired Today • Pre-Orders Active'
  );
  const [brandNameDraft, setBrandNameDraft] = useState(brandTitle);

  const [newReviewForm, setNewReviewForm] = useState({
    name: '',
    cookie: 'Triple Chocolate Overload',
    stars: 5,
    comment: '',
  });

  const [newB2BForm, setNewB2BForm] = useState({
    company: '',
    contact: '',
    phone: '',
    occasion: 'Corporate Gifting Boxes',
    units: 30,
    budget: '₹25,000',
    deliveryDate: 'This Month',
    notes: '',
  });

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

  // Toast Feedback
  const [toast, setToast] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const toggleOrderExpand = (id) => {
    setExpandedOrderIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleMenuExpand = (id) => {
    setExpandedMenuIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyText = (text, id) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    showToast('Copied link to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Logo Upload Handler (Compressed via Canvas)
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX = 400;
        const scale = img.width > MAX ? MAX / img.width : 1;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png', 0.9);
        updateStoreConfig({ logoUrl: dataUrl });
        showToast('Updated brand logo live!');
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  // ============================================================================
  // METRICS & COMPLETE BREAKDOWNS
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

    // Active Oven Queue Breakdown
    const activeKitchenMap = {};
    let activeCookiesToBake = 0;
    orders.forEach((o) => {
      const s = (o.status || '').toLowerCase();
      if (s === 'pending' || s.includes('prep') || s.includes('bake')) {
        (o.items || []).forEach((item) => {
          const qty = Number(item.quantity) || 1;
          activeCookiesToBake += qty;
          if (!activeKitchenMap[item.name]) {
            activeKitchenMap[item.name] = { name: item.name, qty: 0 };
          }
          activeKitchenMap[item.name].qty += qty;
        });
      }
    });
    const activeBakeList = Object.values(activeKitchenMap).sort((a, b) => b.qty - a.qty);
    const activeDoughKg = ((activeCookiesToBake * 170) / 1000).toFixed(1);

    // Product Sales Breakdown
    const productStatsMap = {};
    products.forEach((p) => {
      productStatsMap[p.name] = {
        id: p.id,
        name: p.name,
        image: p.image,
        price: p.price,
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
      upi: { label: 'Instant UPI', count: 0, revenue: 0 },
      cod: { label: 'Pay on Handover', count: 0, revenue: 0 },
      card: { label: 'Card / Online', count: 0, revenue: 0 },
    };
    orders.forEach((o) => {
      const method = (o.customer?.paymentMethod || 'upi').toLowerCase();
      const bucket = paymentBreakdown[method] ? method : 'upi';
      paymentBreakdown[bucket].count += 1;
      paymentBreakdown[bucket].revenue += Number(o.finalTotal) || 0;
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

    // Customer Directory
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
      slotBreakdown: Object.values(slotBreakdown),
      customersList,
    };
  }, [orders, products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.shortDesc || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

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
      showToast(`Saved "${productData.name}"`);
    } else {
      addProduct(productData);
      showToast(`Added "${productData.name}" to menu`);
    }
    setIsEditorOpen(false);
    setEditingProduct(null);
  };

  const handleDuplicateProduct = (product) => {
    const { id: _unused, ...rest } = product;
    addProduct({
      ...rest,
      name: `${product.name} (New Drop)`,
      available: false,
    });
    showToast(`Duplicated "${product.name}"`);
  };

  const handleSaveInlinePrice = (product) => {
    const parsed = Number(inlinePriceValue);
    if (!parsed || parsed < 1) return;
    updateProduct(product.id, { price: parsed });
    setInlinePriceId(null);
    showToast(`${product.name} updated to ₹${parsed}`);
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
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
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
    const headers = ['Order ID', 'Date', 'Customer', 'Phone', 'Slot', 'Items', 'Total INR', 'Status'];
    const rows = orders.map((o) => [
      o.id,
      o.date,
      `"${(o.customer?.name || '').replace(/"/g, '""')}"`,
      o.customer?.phone || '',
      `"${(o.customer?.slot || '').replace(/"/g, '""')}"`,
      `"${(o.items || []).map((i) => `${i.name} x${i.quantity}`).join('; ')}"`,
      o.finalTotal || 0,
      o.status || 'Pending',
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `sukie_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Downloaded Orders CSV');
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
    setPinMessage({ type: 'success', text: 'PIN updated!' });
    showToast('Security PIN updated');
    setTimeout(() => setPinMessage({ type: '', text: '' }), 3000);
  };

  // Next logical 1-tap action for an order card
  const getNextOrderAction = (statusStr) => {
    const s = (statusStr || '').toLowerCase();
    if (s === 'pending') {
      return { label: 'Start Baking →', next: 'Kitchen Prepping', pillBg: 'bg-amber-100 text-amber-900', badge: 'Pending' };
    }
    if (s.includes('prep') || s.includes('bake')) {
      return { label: 'Mark Ready for Pickup →', next: 'Ready for Collection', pillBg: 'bg-blue-100 text-blue-900', badge: 'In Ovens' };
    }
    if (s.includes('ready')) {
      return { label: 'Mark Collected ✓', next: 'Collected', pillBg: 'bg-emerald-100 text-emerald-900', badge: 'Ready' };
    }
    return { label: null, next: null, pillBg: 'bg-stone-100 text-stone-600', badge: 'Collected ✓' };
  };

  // Short 1-word mobile-first navigation items (fits 5-across on mobile without ANY horizontal scroll!)
  const navTabs = [
    {
      id: 'orders',
      shortLabel: 'Orders',
      fullLabel: 'Orders & Kitchen',
      icon: ShoppingBag,
      badge: metrics.pendingCount + metrics.preppingCount || null,
    },
    {
      id: 'menu',
      shortLabel: 'Menu',
      fullLabel: 'Menu & Prices',
      icon: Sparkles,
      badge: null,
    },
    {
      id: 'analytics',
      shortLabel: 'Sales',
      fullLabel: 'Sales Breakdown',
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'customers',
      shortLabel: 'Clients',
      fullLabel: 'Clients & Bulk',
      icon: Users,
      badge: null,
    },
    {
      id: 'settings',
      shortLabel: 'Brand',
      fullLabel: 'Logo, Colors & Site',
      icon: Palette,
      badge: null,
    },
  ];

  return (
    <div className="fixed inset-0 z-[150] bg-[#F6F3EC] text-[#07132B] overflow-y-auto font-sans">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed top-4 right-4 z-[320] px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-white"
            style={{ backgroundColor: brandPrimary }}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: brandAccent }} />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* =================================================================== */}
        {/* DESKTOP LEFT SIDEBAR (Clean, Spacious, Zero Top Header Clutter)     */}
        {/* =================================================================== */}
        <aside
          className="hidden lg:flex w-68 shrink-0 flex-col justify-between p-6 text-white sticky top-0 h-screen"
          style={{ backgroundColor: '#07132B' }}
        >
          <div className="space-y-8">
            {/* Brand Identity */}
            <div className="flex items-center gap-3.5 pb-6 border-b border-white/10">
              <img
                src={brandLogo}
                alt={brandTitle}
                className="w-12 h-12 rounded-full object-cover ring-2 shrink-0"
                style={{ '--tw-ring-color': brandAccent }}
              />
              <div className="min-w-0">
                <h1 className="font-heading text-xl font-bold text-white truncate">
                  {brandTitle} Studio
                </h1>
                <span className="text-[11px] text-emerald-300 flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {storeConfig?.isComingSoon ? 'Teaser Mode' : 'Storefront Live'}
                </span>
              </div>
            </div>

            {/* Vertical Spacious Navigation */}
            <nav className="space-y-2">
              {navTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all flex items-center justify-between cursor-pointer ${
                      isActive
                        ? 'text-stone-950 font-bold shadow-md'
                        : 'text-white/75 hover:bg-white/10 hover:text-white'
                    }`}
                    style={isActive ? { backgroundColor: brandAccent } : undefined}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{tab.fullLabel}</span>
                    </span>
                    {tab.badge && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                          isActive ? 'bg-stone-950 text-white' : 'bg-white/15 text-white'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Bottom Actions */}
          <div className="space-y-3 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsNewOrderOpen(true)}
              className="w-full py-3 px-4 rounded-2xl text-xs font-bold uppercase tracking-wider text-white flex items-center justify-center gap-2 shadow-md cursor-pointer"
              style={{ backgroundColor: brandPrimary }}
            >
              <Plus className="w-4 h-4" />
              <span>New Order</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Back to Website</span>
              <ExternalLink className="w-3.5 h-3.5" style={{ color: brandAccent }} />
            </button>
          </div>
        </aside>

        {/* =================================================================== */}
        {/* MOBILE TOP HEADER (Ultra-Clean, Zero Horizontal Scrolling!)         */}
        {/* =================================================================== */}
        <header
          className="lg:hidden sticky top-0 z-40 px-4 py-3.5 text-white flex items-center justify-between shadow-md"
          style={{ backgroundColor: '#07132B' }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={brandLogo}
              alt={brandTitle}
              className="w-9 h-9 rounded-full object-cover ring-2 shrink-0"
              style={{ '--tw-ring-color': brandAccent }}
            />
            <div className="min-w-0">
              <h1 className="font-heading text-base font-bold text-white truncate leading-tight">
                {brandTitle} Studio
              </h1>
              <span className="text-[10px] text-emerald-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {storeConfig?.isComingSoon ? 'Teaser Active' : 'Live Store'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsNewOrderOpen(true)}
              className="px-3 py-2 rounded-xl text-stone-950 text-xs font-bold flex items-center gap-1 cursor-pointer"
              style={{ backgroundColor: brandAccent }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Order</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-xl bg-white/10 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Site</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </header>

        {/* =================================================================== */}
        {/* MAIN WORKSPACE (Airy Padding, Huge Breathing Space, Mobile-First)   */}
        {/* =================================================================== */}
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-8 lg:px-10 py-6 sm:py-10 pb-28 lg:pb-16">
          {/* ================================================================= */}
          {/* TAB 1: ORDERS & KITCHEN (CALM, SPACIOUS, PROGRESSIVE DISCLOSURE)  */}
          {/* ================================================================= */}
          {activeTab === 'orders' && (
            <div className="space-y-7">
              {/* Page Title */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <div>
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#07132B]">
                    Orders &amp; Kitchen
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 mt-1">
                    Tap an order&apos;s main button to move it forward, or send a 1-tap WhatsApp update.
                  </p>
                </div>
              </div>

              {/* 3 Calm, High-Contrast Summary Tiles */}
              <div className="grid grid-cols-3 gap-3 sm:gap-5">
                <div className="p-4 sm:p-6 rounded-3xl bg-white border border-stone-200/80 shadow-xs">
                  <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider block">
                    To Bake
                  </span>
                  <p className="font-heading text-2xl sm:text-3xl font-bold text-[#07132B] mt-1.5">
                    {metrics.activeCookiesToBake}
                  </p>
                  <span className="text-[11px] text-stone-400 block mt-0.5">
                    cookies ({metrics.activeDoughKg} kg)
                  </span>
                </div>

                <div className="p-4 sm:p-6 rounded-3xl bg-white border border-stone-200/80 shadow-xs">
                  <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block">
                    Ready
                  </span>
                  <p className="font-heading text-2xl sm:text-3xl font-bold text-[#07132B] mt-1.5">
                    {metrics.readyCount}
                  </p>
                  <span className="text-[11px] text-stone-400 block mt-0.5">
                    boxes waiting
                  </span>
                </div>

                <div className="p-4 sm:p-6 rounded-3xl bg-white border border-stone-200/80 shadow-xs">
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                    Sales
                  </span>
                  <p
                    className="font-heading text-xl sm:text-3xl font-bold mt-1.5"
                    style={{ color: brandPrimary }}
                  >
                    ₹{metrics.totalRevenue.toLocaleString('en-IN')}
                  </p>
                  <span className="text-[11px] text-stone-400 block mt-0.5">
                    {orders.length} orders
                  </span>
                </div>
              </div>

              {/* Clean Collapsible Oven Bake Sheet (Collapsed by default so screen breathes!) */}
              <div className="rounded-3xl bg-white border border-stone-200/90 shadow-xs overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowBakeSheet(!showBakeSheet)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-stone-50/80 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0"
                      style={{ backgroundColor: brandPrimary }}
                    >
                      <Flame className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-heading text-base sm:text-lg font-bold text-[#07132B]">
                        Today&apos;s Oven Bake Sheet
                      </h3>
                      <p className="text-xs text-stone-500">
                        {metrics.activeCookiesToBake === 0
                          ? 'All orders are baked & boxed!'
                          : `${metrics.activeCookiesToBake} cookies needed across ${metrics.activeBakeList.length} flavours`}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-stone-500 flex items-center gap-1 shrink-0">
                    <span>{showBakeSheet ? 'Hide' : 'View'}</span>
                    {showBakeSheet ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>

                {showBakeSheet && (
                  <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-stone-100">
                    {metrics.activeBakeList.length === 0 ? (
                      <p className="text-xs text-emerald-700 font-medium py-2">
                        ✓ Nothing waiting for the oven right now.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                        {metrics.activeBakeList.map((item) => (
                          <div
                            key={item.name}
                            className="p-3.5 rounded-2xl bg-[#F8F6F0] border border-stone-200/70 flex items-center justify-between gap-3"
                          >
                            <span className="text-xs sm:text-sm font-semibold text-[#07132B] truncate">
                              {item.name}
                            </span>
                            <span
                              className="px-3 py-1 rounded-xl text-white font-mono font-bold text-xs shrink-0"
                              style={{ backgroundColor: brandPrimary }}
                            >
                              ×{item.qty}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Wrapped Status Filter Pills (Zero Horizontal Scroll!) */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'all', label: `All (${orders.length})` },
                  { id: 'pending', label: `Pending (${metrics.pendingCount})` },
                  { id: 'prepping', label: `In Ovens (${metrics.preppingCount})` },
                  { id: 'ready', label: `Ready (${metrics.readyCount})` },
                  { id: 'collected', label: `Done (${metrics.collectedCount})` },
                ].map((f) => {
                  const active = orderStatusFilter === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setOrderStatusFilter(f.id)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        active
                          ? 'text-white shadow-sm'
                          : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
                      }`}
                      style={active ? { backgroundColor: brandPrimary } : undefined}
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>

              {/* Clean, Breathable Order Cards */}
              <div className="space-y-5">
                {filteredOrders.length === 0 ? (
                  <div className="p-12 rounded-3xl bg-white border border-stone-200/80 text-center space-y-2">
                    <ShoppingBag className="w-8 h-8 text-stone-400 mx-auto" />
                    <h3 className="font-heading text-lg font-bold text-[#07132B]">
                      No orders in this stage
                    </h3>
                    <p className="text-xs text-stone-500">
                      Tap another filter pill above or add a new walk-in / WhatsApp order.
                    </p>
                  </div>
                ) : (
                  filteredOrders.map((ord) => {
                    const action = getNextOrderAction(ord.status);
                    const isExpanded = !!expandedOrderIds[ord.id];

                    return (
                      <div
                        key={ord.id}
                        className="p-5 sm:p-7 rounded-3xl bg-white border border-stone-200/90 shadow-xs space-y-5 transition-all"
                      >
                        {/* Row 1: Customer Name, Status Badge & Total */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-heading text-lg sm:text-xl font-bold text-[#07132B]">
                                {ord.customer?.name}
                              </h3>
                              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${action.pillBg}`}>
                                {action.badge}
                              </span>
                              {ord.customer?.isBulkOrder && (
                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-900">
                                  Bulk Delivery
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-stone-500 flex flex-wrap items-center gap-x-3 gap-y-1">
                              <span className="font-mono font-semibold text-stone-700">#{ord.id}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-stone-400" />
                                {ord.customer?.slot || 'Today Evening'}
                              </span>
                            </p>
                          </div>

                          <div className="text-right shrink-0">
                            <span
                              className="font-heading text-xl sm:text-2xl font-bold block"
                              style={{ color: brandPrimary }}
                            >
                              ₹{(ord.finalTotal || 0).toLocaleString('en-IN')}
                            </span>
                            <span className="text-[11px] text-stone-400 uppercase font-mono">
                              {ord.customer?.paymentMethod || 'UPI'}
                            </span>
                          </div>
                        </div>

                        {/* Row 2: Clean Cookie List */}
                        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#F8F6F0] border border-stone-200/60 space-y-2">
                          {(ord.items || []).map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs sm:text-sm">
                              <span className="font-semibold text-[#07132B]">
                                <span
                                  className="inline-block font-mono font-bold mr-2 px-2 py-0.5 rounded-md text-white text-xs"
                                  style={{ backgroundColor: brandPrimary }}
                                >
                                  {item.quantity}×
                                </span>
                                {item.name}
                              </span>
                              <span className="font-mono text-stone-500 text-xs">
                                ₹{((item.price || 299) * (item.quantity || 1)).toLocaleString('en-IN')}
                              </span>
                            </div>
                          ))}

                          {(ord.customer?.note || ord.customer?.address) && (
                            <div className="pt-2 mt-2 border-t border-stone-200/80 text-xs text-amber-900 space-y-1">
                              {ord.customer?.note && (
                                <p>
                                  <strong>Note:</strong> {ord.customer.note}
                                </p>
                              )}
                              {ord.customer?.address && (
                                <p>
                                  <strong>Address:</strong> {ord.customer.address}
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Row 3: Simple Thumb-Friendly Primary Actions */}
                        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
                          <div className="flex flex-wrap items-center gap-2.5 flex-1">
                            {action.next && (
                              <button
                                type="button"
                                onClick={() => {
                                  updateOrderStatus(ord.id, action.next);
                                  showToast(`Order #${ord.id} → ${action.next}`);
                                }}
                                className="px-4 sm:px-5 py-2.5 rounded-xl text-white text-xs font-bold shadow-xs cursor-pointer transition-transform active:scale-98"
                                style={{ backgroundColor: brandPrimary }}
                              >
                                {action.label}
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => setNotifyModalOrder(ord)}
                              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleOrderExpand(ord.id)}
                            className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <span>{isExpanded ? 'Less' : 'Breakdown'}</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        {/* Expandable Full Breakdown & Manual Stage Controls (Hidden until tapped!) */}
                        {isExpanded && (
                          <div className="pt-4 border-t border-stone-200/80 space-y-4 text-xs">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70">
                              <div>
                                <span className="text-stone-400 block">Customer Phone</span>
                                <a
                                  href={`tel:${ord.customer?.phone}`}
                                  className="font-mono font-bold text-[#07132B] hover:underline flex items-center gap-1 mt-0.5"
                                >
                                  <Phone className="w-3 h-3" />
                                  {ord.customer?.phone}
                                </a>
                              </div>
                              <div>
                                <span className="text-stone-400 block">Bill Breakdown</span>
                                <span className="font-mono text-stone-800 block mt-0.5">
                                  Cookies: ₹{(ord.totalPrice || ord.finalTotal - (ord.packagingFee || 0)).toLocaleString('en-IN')} • Box: {ord.packagingFee > 0 ? `₹${ord.packagingFee}` : 'Free'}
                                </span>
                              </div>
                              <div>
                                <span className="text-stone-400 block">Placed On</span>
                                <span className="font-mono text-stone-800 block mt-0.5">
                                  {ord.date} at {ord.time} ({ord.channel || 'Website'})
                                </span>
                              </div>
                            </div>

                            {/* Change to Any Stage */}
                            <div>
                              <span className="text-[11px] font-semibold text-stone-500 block mb-2">
                                Set Order Stage Manually:
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {['Pending', 'Kitchen Prepping', 'Ready for Collection', 'Collected'].map((st) => {
                                  const isCurr = (ord.status || 'Pending') === st;
                                  return (
                                    <button
                                      key={st}
                                      type="button"
                                      onClick={() => {
                                        updateOrderStatus(ord.id, st);
                                        showToast(`Order #${ord.id} → ${st}`);
                                      }}
                                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                                        isCurr
                                          ? 'text-white'
                                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                                      }`}
                                      style={isCurr ? { backgroundColor: brandPrimary } : undefined}
                                    >
                                      {st}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                              <button
                                type="button"
                                onClick={() =>
                                  handleCopyText(
                                    `${window.location.origin}/#track=${ord.id}`,
                                    `track-${ord.id}`
                                  )
                                }
                                className="text-stone-600 hover:text-stone-950 font-semibold flex items-center gap-1.5 cursor-pointer"
                              >
                                {copiedId === `track-${ord.id}` ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                                <span>Copy Customer Live Tracking Link</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  deleteOrder(ord.id);
                                  showToast(`Deleted Order #${ord.id}`);
                                }}
                                className="text-red-600 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete Order</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: MENU & PRICES (SIMPLE, SPACIOUS, 1-TAP CONTROLS)           */}
          {/* ================================================================= */}
          {activeTab === 'menu' && (
            <div className="space-y-7">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#07132B]">
                    Menu &amp; Prices
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 mt-1">
                    Change prices, mark flavours sold out, or add seasonal cookies anytime.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setIsEditorOpen(true);
                  }}
                  className="px-5 py-3 rounded-2xl text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm cursor-pointer self-start sm:self-auto"
                  style={{ backgroundColor: brandPrimary }}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Cookie / Box</span>
                </button>
              </div>

              {/* Search & Wrapped Category Pills (Zero Horizontal Scroll) */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search cookies or gift boxes..."
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-stone-200 text-xs sm:text-sm text-[#07132B] focus:outline-none focus:border-stone-400"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-full text-xs font-semibold cursor-pointer ${
                      selectedCategory === 'all'
                        ? 'text-white shadow-xs'
                        : 'bg-white text-stone-600 border border-stone-200'
                    }`}
                    style={selectedCategory === 'all' ? { backgroundColor: brandPrimary } : undefined}
                  >
                    All ({products.length})
                  </button>
                  {categories.map((cat) => {
                    const active = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-4 py-2 rounded-full text-xs font-semibold cursor-pointer ${
                          active
                            ? 'text-white shadow-xs'
                            : 'bg-white text-stone-600 border border-stone-200'
                        }`}
                        style={active ? { backgroundColor: brandPrimary } : undefined}
                      >
                        {cat.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Clean Spacious Product Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProducts.map((product) => {
                  const moreOpen = !!expandedMenuIds[product.id];
                  return (
                    <div
                      key={product.id}
                      className="rounded-3xl bg-white border border-stone-200/90 shadow-xs overflow-hidden flex flex-col justify-between"
                    >
                      <div>
                        {/* Photo + Clean Stock Badge */}
                        <div className="relative h-52 bg-stone-900 overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/20" />

                          <span
                            className={`absolute top-3.5 left-3.5 px-3 py-1 rounded-full text-[11px] font-bold shadow-sm ${
                              product.available
                                ? 'bg-emerald-600 text-white'
                                : 'bg-red-600 text-white'
                            }`}
                          >
                            {product.available ? '● In Stock' : '○ Sold Out'}
                          </span>

                          <span className="absolute bottom-3.5 right-3.5 px-2.5 py-1 rounded-xl bg-black/65 text-white text-xs font-mono">
                            {product.weight}
                          </span>
                        </div>

                        {/* Title, Quick Price & Description */}
                        <div className="p-5 sm:p-6 space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="font-heading text-lg sm:text-xl font-bold text-[#07132B] leading-snug">
                              {product.name}
                            </h3>

                            {/* 1-Tap Inline Price Control */}
                            {inlinePriceId === product.id ? (
                              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-300 shrink-0">
                                <span className="text-xs font-mono pl-1.5">₹</span>
                                <input
                                  type="number"
                                  value={inlinePriceValue}
                                  onChange={(e) => setInlinePriceValue(e.target.value)}
                                  className="w-16 px-1.5 py-1 rounded-lg bg-white text-xs font-mono font-bold focus:outline-none"
                                  autoFocus
                                />
                                <button
                                  type="button"
                                  onClick={() => handleSaveInlinePrice(product)}
                                  className="px-2.5 py-1 rounded-lg text-white text-[11px] font-bold cursor-pointer"
                                  style={{ backgroundColor: brandPrimary }}
                                >
                                  Save
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setInlinePriceId(product.id);
                                  setInlinePriceValue(String(product.price));
                                }}
                                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#F8F6F0] hover:bg-stone-200/70 border border-stone-200/80 shrink-0 cursor-pointer"
                                title="Tap to edit price"
                              >
                                <span
                                  className="font-heading text-lg font-bold"
                                  style={{ color: brandPrimary }}
                                >
                                  ₹{product.price}
                                </span>
                                <Edit3 className="w-3 h-3 text-stone-400" />
                              </button>
                            )}
                          </div>

                          <p className="text-xs sm:text-sm text-stone-500 line-clamp-2 leading-relaxed">
                            {product.shortDesc}
                          </p>
                        </div>
                      </div>

                      {/* Simple 2-Button Footer + Quiet Expandable Options */}
                      <div className="px-5 sm:px-6 pb-5 sm:pb-6 space-y-3">
                        <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-stone-100">
                          <button
                            type="button"
                            onClick={() => {
                              toggleProductAvailability(product.id);
                              showToast(
                                product.available
                                  ? `"${product.name}" marked Sold Out`
                                  : `"${product.name}" marked In Stock`
                              );
                            }}
                            className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                              product.available
                                ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200'
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
                            className="py-2.5 px-3 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                            style={{ backgroundColor: brandPrimary }}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit Recipe &amp; Photo</span>
                          </button>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1">
                          <button
                            type="button"
                            onClick={() => toggleMenuExpand(product.id)}
                            className="text-stone-400 hover:text-stone-700 font-medium cursor-pointer"
                          >
                            {moreOpen ? 'Hide extra actions ▲' : 'More actions (Duplicate / Delete) ▾'}
                          </button>
                        </div>

                        {moreOpen && (
                          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70 flex items-center justify-between text-xs">
                            <button
                              type="button"
                              onClick={() => handleDuplicateProduct(product)}
                              className="font-semibold text-stone-700 hover:text-stone-950 flex items-center gap-1.5 cursor-pointer"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>Duplicate Item</span>
                            </button>

                            {confirmDeleteId === product.id ? (
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    deleteProduct(product.id);
                                    setConfirmDeleteId(null);
                                    showToast(`Deleted "${product.name}"`);
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-red-600 text-white font-bold cursor-pointer"
                                >
                                  Confirm
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteId(null)}
                                  className="text-stone-500 cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(product.id)}
                                className="font-semibold text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quiet Safety Net Box at Bottom */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-heading text-base font-bold text-[#07132B]">
                    Quick Menu Safety Controls
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Restock all items in one tap or restore the original Sukié menu if you ever make a mistake.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setAllProductsAvailability(true);
                      showToast('All items marked In Stock!');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold cursor-pointer"
                  >
                    Mark All In Stock
                  </button>

                  {confirmResetMenu ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          resetToDefaultMenu();
                          setConfirmResetMenu(false);
                          showToast('Restored original Sukié menu!');
                        }}
                        className="px-4 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold cursor-pointer"
                      >
                        Confirm Reset
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmResetMenu(false)}
                        className="px-3 py-2 text-xs text-stone-500 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmResetMenu(true)}
                      className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restore Default Menu</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: SALES BREAKDOWN (CLEAN, SPACIOUS INSIGHTS)                 */}
          {/* ================================================================= */}
          {activeTab === 'analytics' && (
            <div className="space-y-7">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#07132B]">
                    Sales &amp; Breakdown
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 mt-1">
                    Complete breakdown of revenue, cookie performance, payments, and pickup slots.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="px-4 py-2.5 rounded-2xl bg-white border border-stone-200 hover:bg-stone-50 text-[#07132B] text-xs font-bold flex items-center gap-2 shadow-2xs cursor-pointer self-start sm:self-auto"
                >
                  <Download className="w-4 h-4" style={{ color: brandPrimary }} />
                  <span>Download Orders CSV</span>
                </button>
              </div>

              {/* 3 Spacious Financial Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-xs">
                  <span className="text-xs font-semibold text-stone-400 uppercase">Total Revenue</span>
                  <p
                    className="font-heading text-3xl font-bold mt-2"
                    style={{ color: brandPrimary }}
                  >
                    ₹{metrics.totalRevenue.toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    Cookies: ₹{metrics.cookiesSubtotalRev.toLocaleString('en-IN')} • Boxes: ₹{metrics.totalPackagingRev.toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-xs">
                  <span className="text-xs font-semibold text-stone-400 uppercase">Average Order</span>
                  <p className="font-heading text-3xl font-bold text-[#07132B] mt-2">
                    ₹{metrics.avgOrderValue.toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    Across {orders.length} orders
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-xs">
                  <span className="text-xs font-semibold text-stone-400 uppercase">Cookies Sold</span>
                  <p className="font-heading text-3xl font-bold text-emerald-700 mt-2">
                    {metrics.totalCookiesBaked}
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    {((metrics.totalCookiesBaked * 170) / 1000).toFixed(1)} kg total baked
                  </p>
                </div>
              </div>

              {/* Flavour-by-Flavour Breakdown */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-5">
                <div>
                  <h3 className="font-heading text-xl font-bold text-[#07132B]">
                    Sales by Cookie &amp; Box
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    See which flavours bring in the highest revenue.
                  </p>
                </div>

                <div className="space-y-4">
                  {metrics.productBreakdown.map((item) => {
                    const pct =
                      metrics.totalRevenue > 0
                        ? Math.min(100, Math.round((item.revenue / metrics.totalRevenue) * 100))
                        : 0;
                    return (
                      <div key={item.id} className="space-y-2">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 rounded-xl object-cover shrink-0"
                            />
                            <div className="min-w-0">
                              <span className="text-sm font-bold text-[#07132B] block truncate">
                                {item.name}
                              </span>
                              <span className="text-xs text-stone-400">
                                {item.qty} sold • ₹{item.price} each
                              </span>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="font-heading text-base font-bold text-[#07132B] block">
                              ₹{item.revenue.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[11px] font-mono text-stone-400">{pct}%</span>
                          </div>
                        </div>

                        <div className="h-2 w-full rounded-full bg-stone-100 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.max(4, pct)}%`,
                              backgroundColor: brandPrimary,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Payment Modes & Pickup Slots */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-4">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" style={{ color: brandPrimary }} />
                    <h4 className="font-heading text-lg font-bold text-[#07132B]">
                      Payment Methods
                    </h4>
                  </div>
                  <div className="space-y-2.5">
                    {metrics.paymentBreakdown.map((pm) => (
                      <div
                        key={pm.label}
                        className="p-3.5 rounded-2xl bg-[#F8F6F0] flex items-center justify-between"
                      >
                        <div>
                          <span className="text-xs font-bold text-[#07132B] block">{pm.label}</span>
                          <span className="text-[11px] text-stone-500">{pm.count} orders</span>
                        </div>
                        <span className="font-heading font-bold text-base text-[#07132B]">
                          ₹{pm.revenue.toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" style={{ color: brandPrimary }} />
                    <h4 className="font-heading text-lg font-bold text-[#07132B]">
                      Popular Pickup Slots
                    </h4>
                  </div>
                  <div className="space-y-2.5">
                    {metrics.slotBreakdown.map((sl) => (
                      <div
                        key={sl.label}
                        className="p-3.5 rounded-2xl bg-[#F8F6F0] flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-[#07132B] block truncate">
                            {sl.label}
                          </span>
                          <span className="text-[11px] text-stone-500">{sl.count} orders</span>
                        </div>
                        <span
                          className="px-2.5 py-1 rounded-xl text-white font-mono text-xs font-bold shrink-0"
                          style={{ backgroundColor: brandPrimary }}
                        >
                          {sl.cookies} cookies
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 4: CLIENTS & BULK B2B                                         */}
          {/* ================================================================= */}
          {activeTab === 'customers' && (
            <div className="space-y-7">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#07132B]">
                    Clients &amp; Corporate Orders
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 mt-1">
                    Tap any client to view their complete order history, or manage bulk event leads.
                  </p>
                </div>

                {crmSubTab === 'b2b' && (
                  <button
                    type="button"
                    onClick={() => setIsNewB2BOpen(true)}
                    className="px-4 py-2.5 rounded-2xl text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                    style={{ backgroundColor: brandPrimary }}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Bulk Lead</span>
                  </button>
                )}
              </div>

              {/* Clean 2-Button Switch */}
              <div className="inline-flex p-1.5 rounded-2xl bg-white border border-stone-200">
                <button
                  type="button"
                  onClick={() => setCrmSubTab('vip')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    crmSubTab === 'vip' ? 'text-white shadow-xs' : 'text-stone-600'
                  }`}
                  style={crmSubTab === 'vip' ? { backgroundColor: brandPrimary } : undefined}
                >
                  Regular Clients ({metrics.customersList.length})
                </button>
                <button
                  type="button"
                  onClick={() => setCrmSubTab('b2b')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    crmSubTab === 'b2b' ? 'text-white shadow-xs' : 'text-stone-600'
                  }`}
                  style={crmSubTab === 'b2b' ? { backgroundColor: brandPrimary } : undefined}
                >
                  Bulk &amp; Corporate ({bulkInquiries?.length || 0})
                </button>
              </div>

              {crmSubTab === 'vip' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {metrics.customersList.map((cust) => (
                    <div
                      key={cust.id}
                      onClick={() => setSelectedCustomer(cust)}
                      className="p-6 rounded-3xl bg-white border border-stone-200/90 hover:border-stone-400 transition-all cursor-pointer flex items-center justify-between gap-4 shadow-xs"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-heading text-lg font-bold text-[#07132B] truncate">
                            {cust.name}
                          </h3>
                          {(cust.totalSpent >= 2500 || cust.isBulk) && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                              VIP
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500 font-mono">{cust.phone}</p>
                        <p className="text-xs text-stone-500 truncate">
                          Loves: <strong className="text-stone-800">{cust.favoriteCookie}</strong>
                        </p>
                      </div>

                      <div className="text-right shrink-0 flex items-center gap-2">
                        <div>
                          <span
                            className="font-heading text-lg font-bold block"
                            style={{ color: brandPrimary }}
                          >
                            ₹{cust.totalSpent.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[11px] text-stone-400">
                            {cust.totalOrders} {cust.totalOrders === 1 ? 'order' : 'orders'}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-stone-400" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {(bulkInquiries || []).map((inq) => {
                    const contactName = inq.contact || inq.contactPerson || 'Client';
                    const occasionName = inq.occasion || inq.event || 'Corporate Gifting';
                    const unitCount = inq.units || inq.estimatedUnits || 25;
                    const budgetDisplay =
                      inq.budget ||
                      (inq.estimatedValue
                        ? `₹${Number(inq.estimatedValue).toLocaleString('en-IN')}`
                        : 'Custom');
                    const dateDisplay = inq.deliveryDate || inq.dateRequired || 'Upcoming';
                    const cleanPhone = (inq.phone || '').replace(/\D/g, '');
                    const waPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
                    const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(
                      `Hello ${contactName}! 🍪 Greetings from ${brandTitle} Mumbai regarding your ${occasionName} inquiry (${unitCount} boxes).`
                    )}`;

                    return (
                      <div
                        key={inq.id}
                        className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-xs space-y-4 flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[11px] font-semibold text-stone-400 uppercase block">
                                {occasionName}
                              </span>
                              <h3 className="font-heading text-xl font-bold text-[#07132B]">
                                {inq.company}
                              </h3>
                              <p className="text-xs text-stone-500 mt-0.5">
                                {contactName} • {inq.phone}
                              </p>
                            </div>
                            <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                              {inq.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-[#F8F6F0] text-xs">
                            <div>
                              <span className="text-stone-400 block text-[10px]">Boxes</span>
                              <span className="font-bold text-[#07132B]">{unitCount}</span>
                            </div>
                            <div>
                              <span className="text-stone-400 block text-[10px]">Estimate</span>
                              <span className="font-bold text-[#07132B]">{budgetDisplay}</span>
                            </div>
                            <div>
                              <span className="text-stone-400 block text-[10px]">Date</span>
                              <span className="font-bold text-[#07132B]">{dateDisplay}</span>
                            </div>
                          </div>

                          {inq.notes && (
                            <p className="text-xs text-stone-600 italic">&ldquo;{inq.notes}&rdquo;</p>
                          )}
                        </div>

                        <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap gap-1.5">
                            {['New Inquiry', 'Sample Sent', 'Confirmed'].map((st) => (
                              <button
                                key={st}
                                type="button"
                                onClick={() => {
                                  updateBulkInquiryStatus(inq.id, st);
                                  showToast(`${inq.company} → ${st}`);
                                }}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer ${
                                  inq.status === st
                                    ? 'text-white'
                                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                }`}
                                style={inq.status === st ? { backgroundColor: brandPrimary } : undefined}
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
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>
                            <button
                              type="button"
                              onClick={() => {
                                deleteBulkInquiry(inq.id);
                                showToast('Removed bulk lead');
                              }}
                              className="p-1.5 text-stone-400 hover:text-red-600 cursor-pointer"
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

          {/* ================================================================= */}
          {/* TAB 5: LOGO, COLORS & SITE CONTROLS (EASY TO HANDLE ANYTHING!)    */}
          {/* ================================================================= */}
          {activeTab === 'settings' && (
            <div className="space-y-7">
              <div>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#07132B]">
                  Logo, Colors &amp; Website Controls
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mt-1">
                  Customize your brand logo, color combination, live website status, banner text, reviews, and PIN in one tap.
                </p>
              </div>

              {/* 1. BRAND LOGO & NAME CARD */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/90 shadow-xs space-y-5">
                <div>
                  <h3 className="font-heading text-xl font-bold text-[#07132B]">
                    1. Brand Logo &amp; Name
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Updates your logo immediately across the Website Header, Coming Soon page, Story section, Footer, and Studio.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-5 p-4 rounded-2xl bg-[#F8F6F0] border border-stone-200/70">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-18 h-18 rounded-2xl p-2 flex items-center justify-center shadow-sm shrink-0"
                      style={{ backgroundColor: brandPrimary }}
                    >
                      <img
                        src={brandLogo}
                        alt="Logo preview"
                        className="w-14 h-14 rounded-full object-cover ring-2"
                        style={{ '--tw-ring-color': brandAccent }}
                      />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#07132B] block">Live Brand Emblem</span>
                      <span className="text-[11px] text-stone-500">Shown on your Royal Blue header</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 sm:ml-auto">
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="px-4 py-2.5 rounded-xl text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
                      style={{ backgroundColor: brandPrimary }}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload New Logo</span>
                    </button>
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />

                    {brandLogo !== '/images/logo.png' && (
                      <button
                        type="button"
                        onClick={() => {
                          updateStoreConfig({ logoUrl: '/images/logo.png' });
                          showToast('Restored original Sukié logo');
                        }}
                        className="px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-700 text-xs font-semibold cursor-pointer"
                      >
                        Reset Default Logo
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="text"
                    value={brandNameDraft}
                    onChange={(e) => setBrandNameDraft(e.target.value)}
                    placeholder="Brand Name (e.g. Sukié)"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#F8F6F0] border border-stone-200 text-sm text-[#07132B] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      updateStoreConfig({ brandName: brandNameDraft.trim() || 'Sukié' });
                      showToast('Saved brand name!');
                    }}
                    className="px-5 py-2.5 rounded-xl text-white text-xs font-bold cursor-pointer"
                    style={{ backgroundColor: brandPrimary }}
                  >
                    Save Brand Name
                  </button>
                </div>
              </div>

              {/* 2. BRAND COLOR COMBINATION CARD */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/90 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-heading text-xl font-bold text-[#07132B]">
                      2. Brand Color Combination
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Tap a curated luxury palette or pick custom colors. Changes apply live across your website &amp; studio.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      updateStoreConfig({
                        themePreset: 'royal_cobalt',
                        primaryColor: '#0C419C',
                        accentColor: '#C5A059',
                        surfaceColor: '#FAF6EE',
                      });
                      showToast('Restored Sukié Royal Cobalt & Gold palette');
                    }}
                    className="text-xs font-semibold text-stone-500 hover:text-stone-900 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Official Colors</span>
                  </button>
                </div>

                {/* 4 Curated Color Combination Presets */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {BRAND_COLOR_PRESETS.map((preset) => {
                    const isSelected =
                      (storeConfig?.primaryColor || '#0C419C').toLowerCase() ===
                      preset.primary.toLowerCase();
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          updateStoreConfig({
                            themePreset: preset.id,
                            primaryColor: preset.primary,
                            accentColor: preset.accent,
                            surfaceColor: preset.surface,
                          });
                          showToast(`Applied "${preset.name}"`);
                        }}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'border-stone-900 bg-[#F8F6F0] shadow-xs'
                            : 'border-stone-200 hover:border-stone-300 bg-white'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#07132B] truncate">
                              {preset.name}
                            </span>
                            {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                          </div>
                          <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
                            {preset.desc}
                          </p>
                        </div>

                        <div className="flex items-center -space-x-1.5 shrink-0">
                          <span
                            className="w-7 h-7 rounded-full border-2 border-white shadow-xs"
                            style={{ backgroundColor: preset.primary }}
                          />
                          <span
                            className="w-7 h-7 rounded-full border-2 border-white shadow-xs"
                            style={{ backgroundColor: preset.accent }}
                          />
                          <span
                            className="w-7 h-7 rounded-full border-2 border-stone-200 shadow-xs"
                            style={{ backgroundColor: preset.surface }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Fine-Tune Custom Color Swatches */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <label className="p-3.5 rounded-2xl bg-[#F8F6F0] border border-stone-200/70 flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="text-xs font-bold text-[#07132B] block">Primary Color</span>
                      <span className="text-[11px] font-mono text-stone-500">{brandPrimary}</span>
                    </div>
                    <input
                      type="color"
                      value={brandPrimary}
                      onChange={(e) =>
                        updateStoreConfig({ primaryColor: e.target.value, themePreset: 'custom' })
                      }
                      className="w-9 h-9 rounded-lg cursor-pointer border-0 bg-transparent"
                    />
                  </label>

                  <label className="p-3.5 rounded-2xl bg-[#F8F6F0] border border-stone-200/70 flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="text-xs font-bold text-[#07132B] block">Gold / Accent</span>
                      <span className="text-[11px] font-mono text-stone-500">{brandAccent}</span>
                    </div>
                    <input
                      type="color"
                      value={brandAccent}
                      onChange={(e) =>
                        updateStoreConfig({ accentColor: e.target.value, themePreset: 'custom' })
                      }
                      className="w-9 h-9 rounded-lg cursor-pointer border-0 bg-transparent"
                    />
                  </label>

                  <label className="p-3.5 rounded-2xl bg-[#F8F6F0] border border-stone-200/70 flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="text-xs font-bold text-[#07132B] block">Cream Surface</span>
                      <span className="text-[11px] font-mono text-stone-500">
                        {storeConfig?.surfaceColor || '#FAF6EE'}
                      </span>
                    </div>
                    <input
                      type="color"
                      value={storeConfig?.surfaceColor || '#FAF6EE'}
                      onChange={(e) =>
                        updateStoreConfig({ surfaceColor: e.target.value, themePreset: 'custom' })
                      }
                      className="w-9 h-9 rounded-lg cursor-pointer border-0 bg-transparent"
                    />
                  </label>
                </div>
              </div>

              {/* 3. WEBSITE MODE & LIVE BANNER TEXT */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/90 shadow-xs space-y-5">
                <div>
                  <h3 className="font-heading text-xl font-bold text-[#07132B]">
                    3. Storefront Mode &amp; Oven Banner
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Switch between accepting live orders or showing the Coming Soon teaser page.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <button
                    type="button"
                    onClick={() => {
                      updateStoreConfig({ isComingSoon: false });
                      showToast('Website is now LIVE for orders!');
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      !storeConfig?.isComingSoon
                        ? 'bg-emerald-50 border-emerald-500'
                        : 'bg-white border-stone-200'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-sm text-[#07132B]">
                      <span>Live Ordering Storefront</span>
                      {!storeConfig?.isComingSoon && <Check className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className="text-xs text-stone-500 mt-1">
                      Visitors see your full menu and can place pickup pre-orders.
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
                        ? 'bg-amber-50 border-amber-500'
                        : 'bg-white border-stone-200'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-sm text-[#07132B]">
                      <span>Coming Soon Teaser</span>
                      {storeConfig?.isComingSoon && <Check className="w-4 h-4 text-amber-600" />}
                    </div>
                    <p className="text-xs text-stone-500 mt-1">
                      Shows the royal blue teaser page while preparing your next drop.
                    </p>
                  </button>
                </div>

                <div className="pt-3 border-t border-stone-100 space-y-2.5">
                  <label className="text-xs font-bold text-[#07132B] block">
                    Live Menu Oven Status Text
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <input
                      type="text"
                      value={bannerTextDraft}
                      onChange={(e) => setBannerTextDraft(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-[#F8F6F0] border border-stone-200 text-xs sm:text-sm text-[#07132B] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        updateStoreConfig({ ovenStatusText: bannerTextDraft });
                        showToast('Saved live oven banner text!');
                      }}
                      className="px-5 py-2.5 rounded-xl text-white text-xs font-bold cursor-pointer"
                      style={{ backgroundColor: brandPrimary }}
                    >
                      Save Banner
                    </button>
                  </div>
                </div>
              </div>

              {/* 4. REVIEWS & SECURITY PIN */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Reviews Card */}
                <div className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200/90 shadow-xs space-y-4">
                  <h3 className="font-heading text-lg font-bold text-[#07132B]">
                    Customer Reviews ({reviews.length})
                  </h3>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newReviewForm.name.trim() || !newReviewForm.comment.trim()) return;
                      addReview({
                        name: newReviewForm.name.trim(),
                        cookie: newReviewForm.cookie,
                        stars: 5,
                        comment: newReviewForm.comment.trim(),
                      });
                      setNewReviewForm({
                        name: '',
                        cookie: products[0]?.name || 'Triple Chocolate Overload',
                        stars: 5,
                        comment: '',
                      });
                      showToast('Added review to website!');
                    }}
                    className="space-y-2.5"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Customer Name"
                        value={newReviewForm.name}
                        onChange={(e) =>
                          setNewReviewForm({ ...newReviewForm, name: e.target.value })
                        }
                        className="px-3.5 py-2 rounded-xl bg-[#F8F6F0] border border-stone-200 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Cookie Flavour"
                        value={newReviewForm.cookie}
                        onChange={(e) =>
                          setNewReviewForm({ ...newReviewForm, cookie: e.target.value })
                        }
                        className="px-3.5 py-2 rounded-xl bg-[#F8F6F0] border border-stone-200 text-xs"
                      />
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Paste customer review..."
                        value={newReviewForm.comment}
                        onChange={(e) =>
                          setNewReviewForm({ ...newReviewForm, comment: e.target.value })
                        }
                        className="flex-1 px-3.5 py-2 rounded-xl bg-[#F8F6F0] border border-stone-200 text-xs"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl text-white text-xs font-bold cursor-pointer shrink-0"
                        style={{ backgroundColor: brandPrimary }}
                      >
                        Add
                      </button>
                    </div>
                  </form>

                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-3 rounded-2xl bg-[#F8F6F0] flex items-start justify-between gap-2 text-xs"
                      >
                        <div>
                          <span className="font-bold text-[#07132B]">{rev.name}</span>{' '}
                          <span className="text-amber-500">{'★'.repeat(rev.stars || 5)}</span>
                          <p className="text-stone-600 mt-0.5">&ldquo;{rev.comment}&rdquo;</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            deleteReview(rev.id);
                            showToast('Removed review');
                          }}
                          className="text-stone-400 hover:text-red-600 shrink-0 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Security PIN Card */}
                <div className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200/90 shadow-xs space-y-4">
                  <div className="flex items-center gap-2.5">
                    <Lock className="w-5 h-5" style={{ color: brandPrimary }} />
                    <div>
                      <h3 className="font-heading text-lg font-bold text-[#07132B]">
                        Studio Security PIN
                      </h3>
                      <p className="text-xs text-stone-500">
                        Active PIN: <strong className="font-mono">{storeConfig?.adminPin || '8467'}</strong>
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handlePinSubmit} className="space-y-3">
                    <input
                      type="password"
                      inputMode="numeric"
                      maxLength={8}
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="New 4-Digit PIN"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F8F6F0] border border-stone-200 text-xs font-mono"
                    />
                    <input
                      type="password"
                      inputMode="numeric"
                      maxLength={8}
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="Confirm New PIN"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F8F6F0] border border-stone-200 text-xs font-mono"
                    />
                    {pinMessage.text && (
                      <p
                        className={`text-xs font-bold ${
                          pinMessage.type === 'error' ? 'text-red-600' : 'text-emerald-600'
                        }`}
                      >
                        {pinMessage.text}
                      </p>
                    )}
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl text-white font-bold text-xs cursor-pointer"
                      style={{ backgroundColor: brandPrimary }}
                    >
                      Update PIN
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ===================================================================== */}
      {/* MOBILE FIXED BOTTOM NAVIGATION BAR (5 Even Tabs, ZERO Horizontal Scroll) */}
      {/* ===================================================================== */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-xl border-t border-stone-200 px-1 py-1.5 pb-safe shadow-[0_-8px_25px_rgba(0,0,0,0.06)]">
        <div className="grid grid-cols-5 gap-0.5 max-w-md mx-auto">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative py-1.5 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
                  isActive ? 'font-bold' : 'text-stone-400 hover:text-stone-700'
                }`}
                style={isActive ? { color: brandPrimary } : undefined}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {tab.badge && (
                    <span
                      className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-mono font-bold text-white flex items-center justify-center"
                      style={{ backgroundColor: brandPrimary }}
                    >
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] leading-none tracking-tight">{tab.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ===================================================================== */}
      {/* MODALS & DRAWERS                                                      */}
      {/* ===================================================================== */}
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

      <NotificationModal
        isOpen={!!notifyModalOrder}
        onClose={() => setNotifyModalOrder(null)}
        order={notifyModalOrder}
        onUpdateStatus={updateOrderStatus}
        showToast={showToast}
      />

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

      {/* Manual Walk-in / WhatsApp Order Modal */}
      <AnimatePresence>
        {isNewOrderOpen && (
          <div className="fixed inset-0 z-[220] flex items-center justify-center p-4 overflow-y-auto">
            <div
              onClick={() => setIsNewOrderOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 text-[#07132B] shadow-2xl z-10 space-y-5 my-auto"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <h3 className="font-heading text-xl font-bold">
                  New WhatsApp / Walk-in Order
                </h3>
                <button
                  type="button"
                  onClick={() => setIsNewOrderOpen(false)}
                  className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateManualOrder} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={manualOrder.name}
                    onChange={(e) => setManualOrder({ ...manualOrder, name: e.target.value })}
                    placeholder="Customer Name *"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F0] border border-stone-200 text-xs"
                  />
                  <input
                    type="tel"
                    required
                    value={manualOrder.phone}
                    onChange={(e) => setManualOrder({ ...manualOrder, phone: e.target.value })}
                    placeholder="WhatsApp Phone *"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F0] border border-stone-200 text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-500 block mb-1.5">
                    Select Cookie / Box
                  </label>
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
                              ? 'text-white font-bold border-transparent'
                              : 'bg-[#F8F6F0] border-stone-200 text-stone-700'
                          }`}
                          style={isSel ? { backgroundColor: brandPrimary } : undefined}
                        >
                          <span className="truncate pr-2">{p.name}</span>
                          <span className="font-mono shrink-0">₹{p.price}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-stone-500 block mb-1">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={manualOrder.quantity}
                      onChange={(e) => setManualOrder({ ...manualOrder, quantity: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F0] border border-stone-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-stone-500 block mb-1">Pickup Slot</label>
                    <input
                      type="text"
                      value={manualOrder.slot}
                      onChange={(e) => setManualOrder({ ...manualOrder, slot: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F0] border border-stone-200 text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsNewOrderOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-stone-100 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-white text-xs font-bold cursor-pointer"
                    style={{ backgroundColor: brandPrimary }}
                  >
                    Save Order
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Log Corporate B2B Lead Modal */}
      <AnimatePresence>
        {isNewB2BOpen && (
          <div className="fixed inset-0 z-[220] flex items-center justify-center p-4 overflow-y-auto">
            <div
              onClick={() => setIsNewB2BOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 text-[#07132B] shadow-2xl z-10 space-y-4 my-auto"
            >
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="font-heading text-xl font-bold">
                  Add Bulk / Corporate Lead
                </h3>
                <button
                  type="button"
                  onClick={() => setIsNewB2BOpen(false)}
                  className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-xs cursor-pointer"
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
                  showToast(`Added bulk lead: ${newB2BForm.company}`);
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F0] border border-stone-200 text-xs"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Contact Person *"
                    value={newB2BForm.contact}
                    onChange={(e) => setNewB2BForm({ ...newB2BForm, contact: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F0] border border-stone-200 text-xs"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={newB2BForm.phone}
                    onChange={(e) => setNewB2BForm({ ...newB2BForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F0] border border-stone-200 text-xs"
                  />
                  <input
                    type="number"
                    placeholder="Boxes"
                    value={newB2BForm.units}
                    onChange={(e) =>
                      setNewB2BForm({ ...newB2BForm, units: Number(e.target.value) || 25 })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F0] border border-stone-200 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Est. Budget"
                    value={newB2BForm.budget}
                    onChange={(e) => setNewB2BForm({ ...newB2BForm, budget: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F0] border border-stone-200 text-xs"
                  />
                </div>
                <textarea
                  rows={2}
                  placeholder="Custom box / delivery notes..."
                  value={newB2BForm.notes}
                  onChange={(e) => setNewB2BForm({ ...newB2BForm, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F0] border border-stone-200 text-xs"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsNewB2BOpen(false)}
                    className="px-4 py-2 rounded-xl bg-stone-100 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-white font-bold text-xs cursor-pointer"
                    style={{ backgroundColor: brandPrimary }}
                  >
                    Save Lead
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
