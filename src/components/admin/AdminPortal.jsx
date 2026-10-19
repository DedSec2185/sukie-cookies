import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  ChefHat,
  Cookie,
  TrendingUp,
  BarChart3,
  Clock,
  Phone,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Calendar,
  DollarSign,
  PackageCheck,
  Search,
  Filter,
  ArrowUpRight,
  Download,
  ExternalLink,
  ShieldCheck,
  Sliders,
  Sparkles,
  RefreshCw,
  Plus,
  ChevronRight,
  Eye,
  MoreHorizontal,
  Truck,
  Building2,
  Flame,
  Star,
  X,
  Lock,
  Check,
  Kanban,
  Table as TableIcon,
  FileSpreadsheet,
  UserCheck,
  Receipt,
  Activity,
  ArrowRight,
  Tag,
  SlidersHorizontal,
  Menu as MenuIcon,
  BellRing,
  Zap,
} from 'lucide-react';
import { useMenu } from '../../context/MenuContext';
import ProductEditorModal from './ProductEditorModal';
import NewOrderModal from './NewOrderModal';
import CustomerDrawer from './CustomerDrawer';
import NotificationModal from './NotificationModal';

export default function AdminPortal({ onClose }) {
  const {
    products,
    categories,
    storeConfig,
    orders,
    reviews,
    bulkInquiries = [],
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductAvailability,
    setAllProductsAvailability,
    resetToDefaultMenu,
    updateStoreConfig,
    updateOrderStatus,
    deleteOrder,
    addReview,
    deleteReview,
    updateBulkInquiryStatus,
    changePin,
  } = useMenu();

  // Navigation tab: 'analytics' | 'orders' | 'customers' | 'bulk' | 'menu' | 'kitchen' | 'reviews' | 'settings'
  const [activeTab, setActiveTab] = useState('analytics');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    setIsMobileSidebarOpen(false);
  };

  // Orders View Mode: 'table' | 'kanban'
  const [ordersViewMode, setOrdersViewMode] = useState('table');

  // Time Period Filter for Analytics: 'all' | 'quarter' | 'week' | 'today'
  const [analyticsPeriod, setAnalyticsPeriod] = useState('all');

  // Modals & Drawers
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [selectedOrderDrawer, setSelectedOrderDrawer] = useState(null);
  const [selectedCustomerDossier, setSelectedCustomerDossier] = useState(null);
  const [selectedNotificationOrder, setSelectedNotificationOrder] = useState(null);

  // Orders Filter & Search state
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderChannelFilter, setOrderChannelFilter] = useState('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Customer Filter
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [customerSegmentFilter, setCustomerSegmentFilter] = useState('all'); // 'all' | 'vip' | 'bulk'

  // Menu Search & Category Filter
  const [menuCategoryFilter, setMenuCategoryFilter] = useState('all');
  const [menuSearchQuery, setMenuSearchQuery] = useState('');

  // Bulk Inquiries Filter
  const [bulkStatusFilter, setBulkStatusFilter] = useState('all');

  // Kitchen Prep Checklist state (item names checked off by baker)
  const [checkedBakeItems, setCheckedBakeItems] = useState({});

  // Toast notification state
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3400);
  };

  // Reviews modal state
  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);
  const [newReviewForm, setNewReviewForm] = useState({
    name: '',
    cookie: '',
    stars: 5,
    comment: '',
  });

  // Settings PIN Change state
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinChangeError, setPinChangeError] = useState('');

  // Live Digital Clock with IST
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const currentDateFormatted = currentTime.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const liveTimeString = currentTime.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  // Keyboard shortcut listener for Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setActiveTab('orders');
        const input = document.getElementById('order-search-input');
        if (input) input.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock & Sign Out
  const handleLockStudio = () => {
    sessionStorage.removeItem('sukie_admin_auth');
    onClose();
  };

  // --- ANALYTICS CALCULATIONS ---
  const analytics = useMemo(() => {
    let filteredOrders = orders;
    if (analyticsPeriod === 'today') {
      filteredOrders = orders.filter((o) => o.date?.includes('27 Sep') || o.date?.includes('Today'));
    } else if (analyticsPeriod === 'week') {
      filteredOrders = orders.filter((o) => !o.date?.includes('24 Sep'));
    }

    const totalOrdersCount = filteredOrders.length;
    let grossRevenue = 0;
    let totalUnits = 0;

    const cookieDemandMap = {};
    const slotDemandMap = {};
    const channelMap = { pickup: 0, courier: 0, bulk: 0 };

    filteredOrders.forEach((ord) => {
      grossRevenue += ord.finalTotal || 0;
      totalUnits += ord.totalItems || 0;

      // Track items demand
      ord.items?.forEach((item) => {
        const key = item.name;
        if (!cookieDemandMap[key]) {
          cookieDemandMap[key] = {
            id: item.id,
            name: item.name,
            weight: item.weight || '170g',
            units: 0,
            revenue: 0,
          };
        }
        cookieDemandMap[key].units += item.quantity || 1;
        cookieDemandMap[key].revenue += (item.price || 0) * (item.quantity || 1);
      });

      // Track pickup slot demand
      const slot = ord.customer?.slot || 'Other Slots';
      slotDemandMap[slot] = (slotDemandMap[slot] || 0) + 1;

      // Track channel
      if (ord.customer?.isBulkOrder || ord.channel === 'bulk') {
        channelMap.bulk += 1;
      } else if (
        ord.channel === 'courier' ||
        (ord.customer?.note &&
          (ord.customer.note.toLowerCase().includes('courier') ||
            ord.customer.note.toLowerCase().includes('dunzo') ||
            ord.customer.note.toLowerCase().includes('porter')))
      ) {
        channelMap.courier += 1;
      } else {
        channelMap.pickup += 1;
      }
    });

    const averageOrderValue = totalOrdersCount > 0 ? Math.round(grossRevenue / totalOrdersCount) : 0;
    const totalDoughKg = (totalUnits * 0.17).toFixed(1);

    // Sort cookies by units sold descending
    const topDemandedCookies = Object.values(cookieDemandMap).sort((a, b) => b.units - a.units);
    const maxUnits = topDemandedCookies.length > 0 ? topDemandedCookies[0].units : 1;

    // 7-day velocity mock bar data calculated from order history
    const weeklyVelocity = [
      { day: 'Mon', revenue: 4200, orders: 3 },
      { day: 'Tue', revenue: 5800, orders: 4 },
      { day: 'Wed', revenue: 3900, orders: 2 },
      { day: 'Thu', revenue: 8400, orders: 5 },
      { day: 'Fri', revenue: 11980, orders: 7 },
      { day: 'Sat', revenue: 18450, orders: 11 },
      { day: 'Sun (Today)', revenue: grossRevenue || 14200, orders: totalOrdersCount || 8, isToday: true },
    ];
    const maxWeeklyRevenue = Math.max(...weeklyVelocity.map((w) => w.revenue));

    return {
      totalOrdersCount,
      grossRevenue,
      totalUnits,
      totalDoughKg,
      averageOrderValue,
      topDemandedCookies,
      maxUnits,
      slotDemandMap,
      channelMap,
      weeklyVelocity,
      maxWeeklyRevenue,
    };
  }, [orders, analyticsPeriod]);

  // --- KITCHEN BATCH CALCULATOR (Dough needed for pending + prepping) ---
  const kitchenBatchData = useMemo(() => {
    const activeBakes = {};
    let totalCookiesToBake = 0;

    orders
      .filter((o) => {
        const s = (o.status || '').toLowerCase();
        return s.includes('pending') || s.includes('prep');
      })
      .forEach((order) => {
        order.items?.forEach((item) => {
          const qty = item.quantity || 1;
          const name = item.name;
          if (!activeBakes[name]) {
            activeBakes[name] = {
              name,
              units: 0,
              weight: item.weight || '170g',
              ordersCount: 0,
            };
          }
          activeBakes[name].units += qty;
          activeBakes[name].ordersCount += 1;
          totalCookiesToBake += qty;
        });
      });

    return {
      items: Object.values(activeBakes).sort((a, b) => b.units - a.units),
      totalCookiesToBake,
      totalDoughKg: (totalCookiesToBake * 0.17).toFixed(2),
    };
  }, [orders]);

  // --- CUSTOMER CRM DIRECTORY DERIVATION ---
  const customerDirectory = useMemo(() => {
    const customerMap = {};

    orders.forEach((ord) => {
      const phone = ord.customer?.phone || 'Unknown';
      const name = ord.customer?.name || 'Guest Client';
      if (!customerMap[phone]) {
        customerMap[phone] = {
          phone,
          name,
          email: ord.customer?.email || '—',
          totalOrders: 0,
          totalSpent: 0,
          lastOrderDate: ord.date,
          lastOrderId: ord.id,
          isBulk: ord.customer?.isBulkOrder || false,
          favoriteCookie: ord.items?.[0]?.name || 'Signature Drop',
        };
      }
      customerMap[phone].totalOrders += 1;
      customerMap[phone].totalSpent += ord.finalTotal || 0;
      if (ord.customer?.isBulkOrder) customerMap[phone].isBulk = true;
    });

    return Object.values(customerMap).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders]);

  // Filtered Customers
  const filteredCustomers = useMemo(() => {
    return customerDirectory.filter((client) => {
      const q = customerSearchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        client.name.toLowerCase().includes(q) ||
        client.phone.includes(q) ||
        client.email.toLowerCase().includes(q);

      if (customerSegmentFilter === 'vip') return matchesSearch && (client.totalSpent > 2500 || client.isBulk);
      if (customerSegmentFilter === 'bulk') return matchesSearch && client.isBulk;
      return matchesSearch;
    });
  }, [customerDirectory, customerSearchQuery, customerSegmentFilter]);

  // --- ORDERS FILTERING ---
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus =
        orderStatusFilter === 'all' ||
        (order.status || 'Pending').toLowerCase().includes(orderStatusFilter.toLowerCase());

      const isBulk = order.customer?.isBulkOrder || order.channel === 'bulk';
      const isCourier =
        order.channel === 'courier' ||
        (order.customer?.note &&
          (order.customer.note.toLowerCase().includes('courier') ||
            order.customer.note.toLowerCase().includes('dunzo') ||
            order.customer.note.toLowerCase().includes('porter')));

      let matchesChannel = true;
      if (orderChannelFilter === 'bulk') matchesChannel = isBulk;
      else if (orderChannelFilter === 'courier') matchesChannel = isCourier;
      else if (orderChannelFilter === 'pickup') matchesChannel = !isBulk && !isCourier;

      const q = orderSearchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        order.id?.toLowerCase().includes(q) ||
        order.customer?.name?.toLowerCase().includes(q) ||
        order.customer?.phone?.includes(q) ||
        order.items?.some((i) => i.name.toLowerCase().includes(q));

      return matchesStatus && matchesChannel && matchesSearch;
    });
  }, [orders, orderStatusFilter, orderChannelFilter, orderSearchQuery]);

  // Order Counts by Status
  const orderCounts = useMemo(() => {
    const counts = { all: orders.length, pending: 0, prepping: 0, ready: 0, collected: 0 };
    orders.forEach((ord) => {
      const s = (ord.status || 'Pending').toLowerCase();
      if (s.includes('pending')) counts.pending += 1;
      else if (s.includes('prep')) counts.prepping += 1;
      else if (s.includes('ready')) counts.ready += 1;
      else if (s.includes('collect')) counts.collected += 1;
    });
    return counts;
  }, [orders]);

  // Filtered Products for Catalog tab
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        menuCategoryFilter === 'all' || p.category === menuCategoryFilter;
      const q = menuSearchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.shortDesc?.toLowerCase().includes(q) ||
        p.ingredients?.some((ing) => ing.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [products, menuCategoryFilter, menuSearchQuery]);

  // Filtered Corporate Inquiries
  const filteredInquiries = useMemo(() => {
    return bulkInquiries.filter((inq) => {
      if (bulkStatusFilter === 'all') return true;
      return inq.status?.toLowerCase().includes(bulkStatusFilter.toLowerCase());
    });
  }, [bulkInquiries, bulkStatusFilter]);

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      'Order ID',
      'Date',
      'Time',
      'Customer Name',
      'Phone',
      'Email',
      'Fulfillment Slot',
      'Channel',
      'Items Detail',
      'Item Count',
      'Final Total (INR)',
      'Payment Method',
      'Status',
    ];
    const rows = orders.map((o) => [
      o.id,
      o.date,
      o.time,
      `"${o.customer?.name || ''}"`,
      `"${o.customer?.phone || ''}"`,
      `"${o.customer?.email || ''}"`,
      `"${o.customer?.slot || ''}"`,
      o.customer?.isBulkOrder ? 'Bulk Corporate' : o.channel || 'Pickup',
      `"${o.items?.map((i) => `${i.name} (${i.weight}) x${i.quantity}`).join('; ')}"`,
      o.totalItems,
      o.finalTotal,
      o.customer?.paymentMethod?.toUpperCase() || 'UPI',
      o.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sukie_enterprise_orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Enterprise Orders CSV successfully exported.');
  };

  // WhatsApp Order Connect
  const getWhatsAppOrderLink = (order, newStatus) => {
    const phone = (order.customer?.phone || '').replace(/\D/g, '');
    const cleanPhone = phone.length === 10 ? `91${phone}` : phone;
    const customerFirstName = order.customer?.name?.split(' ')[0] || 'there';

    let message = '';
    if (newStatus === 'Ready for Collection') {
      message = `Hello ${customerFirstName}! 🍪 Your fresh artisanal bakes for Order #${order.id} are boxed and ready for collection at Sukié Atelier (Vikhroli East, Mumbai). If booking a Dunzo/Porter courier, please share Order #${order.id}. See you soon!`;
    } else if (newStatus === 'Kitchen Prepping') {
      message = `Hello ${customerFirstName}! 🍪 Your Sukié cookies for Order #${order.id} are now freshly prepared and baked in our ovens for your slot (${order.customer?.slot}). We will ping you the moment they are boxed!`;
    } else {
      message = `Hello ${customerFirstName}! 🍪 This is Sukié Atelier regarding your Order #${order.id}. Please let us know if you need any assistance with collection or warming!`;
    }

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="fixed inset-0 z-[150] w-screen h-screen flex bg-[#040A18] text-slate-100 font-sans overflow-hidden antialiased select-none">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -25, scale: 0.95 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-[400] bg-gradient-to-r from-[#C5A059] to-[#E5C77F] text-stone-950 font-bold px-6 py-2.5 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-xs flex items-center gap-2 border border-white/40 tracking-wide"
          >
            <Sparkles className="w-4 h-4 fill-stone-950" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 1. LEFT OPERATIONS SIDEBAR (Responsive Mobile Drawer + 280px Widescreen)  */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-xs z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed inset-y-0 left-0 z-50 lg:static w-72 xl:w-80 bg-[#07132B] border-r border-[#C5A059]/25 flex flex-col justify-between shrink-0 shadow-2xl transition-transform duration-300 ease-out ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Atelier Brand Emblem & Ops Badge */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between gap-3.5 bg-gradient-to-b from-[#091C44] via-[#071533] to-[#07132B]">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl p-0.5 bg-gradient-to-b from-[#F3E5AB] via-[#C5A059] to-[#8C6D2B] shadow-xl shrink-0">
                <img
                  src="/images/logo.png"
                  alt="Sukié Logo"
                  className="w-full h-full rounded-2xl object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="font-heading font-black text-base tracking-wide text-white truncate">
                    Sukié Atelier
                  </h1>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-[#F3E5AB] font-mono tracking-widest uppercase font-semibold">
                    Commerce CRM
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-white/60">
                    v3.5 Pro
                  </span>
                </div>
              </div>
            </div>

            {/* Close Drawer Button on Mobile */}
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center shrink-0 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Omnibox Search Trigger */}
          <div className="px-4 pt-3.5 pb-2">
            <button
              type="button"
              onClick={() => {
                handleSelectTab('orders');
                setTimeout(() => {
                  const input = document.getElementById('order-search-input');
                  if (input) input.focus();
                }, 100);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 hover:border-[#C5A059]/40 text-xs text-white/50 flex items-center justify-between transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-white/40 group-hover:text-[#C5A059]" />
                <span className="group-hover:text-white/80">Search CRM &amp; Orders...</span>
              </div>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-mono text-white/50">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Categorized Navigation Suite */}
          <nav className="p-3.5 space-y-4 flex-1">
            {/* Section 1: Operations & Intelligence */}
            <div>
              <div className="px-3 pb-1.5 text-[9px] font-mono uppercase tracking-[0.2em] text-[#C5A059] font-bold">
                Operations &amp; Intelligence
              </div>
              <div className="space-y-1">
                {[
                  { id: 'analytics', label: 'Executive Overview', icon: LayoutDashboard, badge: 'Live GMV' },
                  { id: 'kitchen', label: 'Kitchen Display (KDS)', icon: ChefHat, badge: kitchenBatchData.totalCookiesToBake > 0 ? `${kitchenBatchData.totalCookiesToBake} bakes` : null, badgeColor: 'bg-amber-500/20 text-amber-300' },
                ].map((item) => {
                  const active = activeTab === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectTab(item.id)}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide flex items-center justify-between transition-all cursor-pointer ${
                        active
                          ? 'bg-[#C5A059] text-stone-950 font-bold shadow-lg shadow-[#C5A059]/20'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${active ? 'text-stone-950' : 'text-[#C5A059]'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                            active ? 'bg-stone-950 text-[#F3E5AB]' : item.badgeColor || 'bg-white/10 text-white/70'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Orders & Dispatch */}
            <div>
              <div className="px-3 pb-1.5 text-[9px] font-mono uppercase tracking-[0.2em] text-[#C5A059] font-bold">
                Orders &amp; Dispatch
              </div>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => handleSelectTab('orders')}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide flex items-center justify-between transition-all cursor-pointer ${
                    activeTab === 'orders'
                      ? 'bg-[#C5A059] text-stone-950 font-bold shadow-lg shadow-[#C5A059]/20'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag className={`w-4 h-4 ${activeTab === 'orders' ? 'text-stone-950' : 'text-[#C5A059]'}`} />
                    <span>Orders Command</span>
                  </div>
                  <span
                    className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      activeTab === 'orders' ? 'bg-stone-950 text-[#F3E5AB]' : 'bg-amber-400/20 text-amber-300'
                    }`}
                  >
                    {orderCounts.pending > 0 ? `${orderCounts.pending} New` : `${orders.length} total`}
                  </span>
                </button>
              </div>
            </div>

            {/* Section 3: Client Relationships (CRM) */}
            <div>
              <div className="px-3 pb-1.5 text-[9px] font-mono uppercase tracking-[0.2em] text-[#C5A059] font-bold">
                Client Relationships (CRM)
              </div>
              <div className="space-y-1">
                {[
                  { id: 'customers', label: 'Customer Directory', icon: Users, badge: `${customerDirectory.length}` },
                  { id: 'bulk', label: 'Corporate & Bulk B2B', icon: Building2, badge: `${bulkInquiries.length} leads`, badgeColor: 'bg-purple-500/20 text-purple-300' },
                ].map((item) => {
                  const active = activeTab === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectTab(item.id)}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide flex items-center justify-between transition-all cursor-pointer ${
                        active
                          ? 'bg-[#C5A059] text-stone-950 font-bold shadow-lg shadow-[#C5A059]/20'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${active ? 'text-stone-950' : 'text-[#C5A059]'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                            active ? 'bg-stone-950 text-[#F3E5AB]' : item.badgeColor || 'bg-white/10 text-white/70'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 4: Catalog & Craft */}
            <div>
              <div className="px-3 pb-1.5 text-[9px] font-mono uppercase tracking-[0.2em] text-[#C5A059] font-bold">
                Catalog &amp; Craft
              </div>
              <div className="space-y-1">
                {[
                  { id: 'menu', label: 'Quarterly Drops Studio', icon: Cookie, badge: `${products.length} drops` },
                  { id: 'reviews', label: 'Tasting Reviews & Praise', icon: Star, badge: `${reviews.length}` },
                ].map((item) => {
                  const active = activeTab === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectTab(item.id)}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide flex items-center justify-between transition-all cursor-pointer ${
                        active
                          ? 'bg-[#C5A059] text-stone-950 font-bold shadow-lg shadow-[#C5A059]/20'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${active ? 'text-stone-950' : 'text-[#C5A059]'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                            active ? 'bg-stone-950 text-[#F3E5AB]' : 'bg-white/10 text-white/70'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 5: System Controls */}
            <div>
              <div className="px-3 pb-1.5 text-[9px] font-mono uppercase tracking-[0.2em] text-[#C5A059] font-bold">
                System
              </div>
              <button
                type="button"
                onClick={() => handleSelectTab('settings')}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide flex items-center gap-2.5 transition-all cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-[#C5A059] text-stone-950 font-bold shadow-lg shadow-[#C5A059]/20'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Sliders className={`w-4 h-4 ${activeTab === 'settings' ? 'text-stone-950' : 'text-[#C5A059]'}`} />
                <span>Atelier Controls &amp; PIN</span>
              </button>
            </div>
          </nav>
        </div>

        {/* Sidebar Footer: Founder Profile & Actions */}
        <div className="p-4 border-t border-white/10 bg-[#061026] space-y-3 shrink-0">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/50 flex items-center justify-center font-bold text-xs text-[#F3E5AB]">
                SK
              </div>
              <div className="leading-tight">
                <span className="font-bold text-white block text-xs">Chef Patissier</span>
                <span className="text-[10px] text-white/50 font-mono">Central Kitchen, Vikhroli</span>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400" title="System Online" />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="py-1.5 px-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Live Store</span>
            </button>
            <button
              type="button"
              onClick={handleLockStudio}
              className="py-1.5 px-2 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-200 border border-red-800/40 text-[11px] font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <Lock className="w-3 h-3" />
              <span>Lock Studio</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN EXECUTIVE WORKSPACE (Full Mobile + Widescreen Canvas)             */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden bg-gradient-to-br from-[#07132B] via-[#050C1C] to-[#030712]">
        
        {/* Top Executive Command Bar */}
        <header className="h-14 sm:h-16 px-3.5 sm:px-6 lg:px-8 border-b border-white/10 bg-[#071533]/95 backdrop-blur-md flex items-center justify-between gap-2 shrink-0 shadow-lg z-20">
          {/* Mobile Menu Trigger + Breadcrumb & Clock */}
          <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              aria-label="Open CRM Navigation"
              className="lg:hidden w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-[#C5A059]/30 text-[#F3E5AB] flex items-center justify-center shrink-0 cursor-pointer"
            >
              <MenuIcon className="w-4 h-4" />
            </button>

            <div className="min-w-0">
              <div className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-[#C5A059] flex items-center gap-1.5 truncate">
                <span>Atelier Command</span>
                <span className="text-white/30">/</span>
                <span className="text-white/60 capitalize">{activeTab}</span>
              </div>
              <h2 className="font-heading text-sm sm:text-lg font-bold text-white capitalize leading-tight truncate">
                {activeTab === 'analytics' && 'Executive Commerce Overview'}
                {activeTab === 'orders' && 'Live Orders Command Pipeline'}
                {activeTab === 'customers' && 'Customer CRM & Dossier'}
                {activeTab === 'bulk' && 'Corporate & Bulk B2B Leads'}
                {activeTab === 'menu' && 'Quarterly 3-Month Drops Studio'}
                {activeTab === 'kitchen' && 'Kitchen Oven Queue & KDS'}
                {activeTab === 'reviews' && 'Tasting Reviews & Praise'}
                {activeTab === 'settings' && 'Atelier Controls & Security'}
              </h2>
            </div>

            {/* Live IST Clock */}
            <div className="hidden xl:flex items-center gap-2 pl-4 border-l border-white/10 text-xs font-mono text-white/50">
              <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="text-white/90 font-bold">{liveTimeString}</span>
              <span>•</span>
              <span>{currentDateFormatted}</span>
              <span>•</span>
              <span className="text-[#F3E5AB]">Mumbai HQ</span>
            </div>
          </div>

          {/* Right Action Suite */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Global Metrics Strip */}
            <div className="hidden 2xl:flex items-center gap-4 px-4 py-1.5 rounded-full bg-black/40 border border-white/10 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="text-white/50">Today:</span>
                <span className="font-bold text-[#F3E5AB]">₹{analytics.grossRevenue.toLocaleString('en-IN')}</span>
              </div>
              <div className="w-[1px] h-3 bg-white/20" />
              <div className="flex items-center gap-1.5">
                <span className="text-white/50">Ovens:</span>
                <span className="font-bold text-amber-300">{kitchenBatchData.totalCookiesToBake} bakes</span>
              </div>
              <div className="w-[1px] h-3 bg-white/20" />
              <div className="flex items-center gap-1.5">
                <span className="text-white/50">Ready:</span>
                <span className="font-bold text-emerald-400">{orderCounts.ready} pkp</span>
              </div>
            </div>

            {/* Public Storefront Mode Switch */}
            <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-black/50 border border-white/10 text-xs font-mono">
              <span className="hidden md:inline text-white/60 text-[11px]">Store:</span>
              <button
                type="button"
                onClick={() => {
                  const updated = !storeConfig.isComingSoon;
                  updateStoreConfig({ isComingSoon: updated });
                  showToast(updated ? 'Switched to Coming Soon Teaser' : 'Switched to Live Public Storefront');
                }}
                className={`px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  storeConfig.isComingSoon
                    ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/30'
                    : 'bg-emerald-500 text-stone-950 shadow-md shadow-emerald-500/30'
                }`}
              >
                {storeConfig.isComingSoon ? 'Teaser' : 'Live'}
              </button>
            </div>

            {/* Quick Action: Log Walk-in Order */}
            <button
              type="button"
              onClick={() => setIsNewOrderModalOpen(true)}
              className="px-2.5 sm:px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer border border-white/10"
              title="Quickly record offline walk-in or WhatsApp order"
            >
              <Plus className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="hidden sm:inline">Walk-in Order</span>
            </button>

            {/* Quick Action: Add Seasonal Drop */}
            <button
              type="button"
              onClick={() => {
                setEditingProduct(null);
                setIsEditorOpen(true);
              }}
              className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#E3C378] text-stone-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden md:inline">New Drop</span>
            </button>

            {/* Exit Studio */}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
              title="Close Admin Panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Dynamic Content Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-7 lg:p-8 pb-24 lg:pb-8 space-y-6">

          {/* ========================================================================= */}
          {/* TAB 1: EXECUTIVE ANALYTICS & SALES INTELLIGENCE                           */}
          {/* ========================================================================= */}
          {activeTab === 'analytics' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Period Filter Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-3xl bg-[#091A3E]/90 border border-[#C5A059]/40 shadow-xl">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#F3E5AB] font-bold flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>FINANCIAL INTELLIGENCE &amp; PRODUCTION VELOCITY</span>
                  </span>
                  <h3 className="font-heading text-lg font-bold text-white mt-0.5">
                    Executive Performance Overview
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 bg-black/40 p-1.5 rounded-2xl border border-white/10">
                  {[
                    { id: 'all', label: 'All-Time' },
                    { id: 'quarter', label: '3-Month Rotation' },
                    { id: 'week', label: 'Past 7 Days' },
                    { id: 'today', label: 'Today (Active)' },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setAnalyticsPeriod(filter.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                        analyticsPeriod === filter.id
                          ? 'bg-[#C5A059] text-stone-950 font-bold shadow-md'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5 High-Density Executive KPI Metric Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {/* Gross Commerce GMV */}
                <div className="p-5 rounded-3xl bg-[#091A3E] border border-[#C5A059]/50 shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#C5A059]/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center justify-between text-xs text-[#F3E5AB] font-mono uppercase tracking-wider mb-2">
                    <span>Gross Revenue</span>
                    <DollarSign className="w-4 h-4 text-[#C5A059]" />
                  </div>
                  <div className="font-heading text-2xl lg:text-3xl font-bold text-white tracking-tight">
                    ₹{analytics.grossRevenue.toLocaleString('en-IN')}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono mt-2 font-bold">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>+24.5% vs cycle</span>
                  </div>
                </div>

                {/* Orders Handled */}
                <div className="p-5 rounded-3xl bg-[#091A3E] border border-white/10 shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between text-xs text-white/70 font-mono uppercase tracking-wider mb-2">
                    <span>Total Orders</span>
                    <ShoppingBag className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="font-heading text-2xl lg:text-3xl font-bold text-white tracking-tight">
                    {analytics.totalOrdersCount}
                  </div>
                  <div className="text-[11px] text-amber-300 font-mono mt-2">
                    {orderCounts.pending} awaiting ovens
                  </div>
                </div>

                {/* Units Baked */}
                <div className="p-5 rounded-3xl bg-[#091A3E] border border-white/10 shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between text-xs text-white/70 font-mono uppercase tracking-wider mb-2">
                    <span>170g Bakes</span>
                    <Cookie className="w-4 h-4 text-[#C5A059]" />
                  </div>
                  <div className="font-heading text-2xl lg:text-3xl font-bold text-white tracking-tight">
                    {analytics.totalUnits}
                  </div>
                  <div className="text-[11px] text-white/50 font-mono mt-2">
                    {analytics.totalDoughKg} kg dough crafted
                  </div>
                </div>

                {/* AOV */}
                <div className="p-5 rounded-3xl bg-[#091A3E] border border-white/10 shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between text-xs text-white/70 font-mono uppercase tracking-wider mb-2">
                    <span>Avg Order Value</span>
                    <Sparkles className="w-4 h-4 text-[#F3E5AB]" />
                  </div>
                  <div className="font-heading text-2xl lg:text-3xl font-bold text-[#F3E5AB] tracking-tight">
                    ₹{analytics.averageOrderValue.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-white/50 font-mono mt-2">
                    ~{(analytics.totalUnits / (analytics.totalOrdersCount || 1)).toFixed(1)} cookies / box
                  </div>
                </div>

                {/* Fulfillment Punctuality */}
                <div className="col-span-2 md:col-span-1 p-5 rounded-3xl bg-[#091A3E] border border-white/10 shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between text-xs text-white/70 font-mono uppercase tracking-wider mb-2">
                    <span>Fulfillment Rate</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="font-heading text-2xl lg:text-3xl font-bold text-emerald-400 tracking-tight">
                    98.8%
                  </div>
                  <div className="text-[11px] text-white/50 font-mono mt-2">
                    Zero transit damages
                  </div>
                </div>
              </div>

              {/* Live Atelier Operations & 1-Tap Action Center */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Ovens & KDS Shortcut */}
                <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-[#0A1E46] to-[#071533] border border-amber-400/30 shadow-xl flex items-center justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-amber-300 font-bold">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      <span>160°C Kitchen Queue</span>
                    </span>
                    <h4 className="font-heading text-base sm:text-lg font-bold text-white truncate">
                      {kitchenBatchData.totalCookiesToBake} Cookies to Bake
                    </h4>
                    <p className="text-[11px] text-white/60 font-mono">
                      {orderCounts.pending} pending • {orderCounts.prepping} in ovens
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSelectTab('kitchen')}
                    className="px-3.5 py-2.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500 hover:text-stone-950 border border-amber-400/40 text-amber-300 font-mono text-[11px] font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer"
                  >
                    Open KDS →
                  </button>
                </div>

                {/* 2. Ready for Pickup & WhatsApp Dispatch Shortcut */}
                <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-[#0A1E46] to-[#071533] border border-emerald-400/30 shadow-xl flex items-center justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-emerald-300 font-bold">
                      <BellRing className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Pickup Dispatch Engine</span>
                    </span>
                    <h4 className="font-heading text-base sm:text-lg font-bold text-white truncate">
                      {orderCounts.ready} Boxes Ready Now
                    </h4>
                    <p className="text-[11px] text-white/60 font-mono">
                      1-Tap WhatsApp + Live Tracker Link
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const readyOrd = orders.find((o) => (o.status || '').toLowerCase().includes('ready')) || orders[0];
                      if (readyOrd) {
                        setSelectedNotificationOrder(readyOrd);
                      } else {
                        handleSelectTab('orders');
                      }
                    }}
                    className="px-3.5 py-2.5 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500 hover:text-stone-950 border border-emerald-400/40 text-emerald-300 font-mono text-[11px] font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer"
                  >
                    Notify Ready →
                  </button>
                </div>

                {/* 3. Quarterly Menu Rotation Studio */}
                <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-[#0A1E46] to-[#071533] border border-[#C5A059]/40 shadow-xl flex items-center justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-[#F3E5AB] font-bold">
                      <Cookie className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>3-Month Menu Studio</span>
                    </span>
                    <h4 className="font-heading text-base sm:text-lg font-bold text-white truncate">
                      {products.filter((p) => p.available).length} of {products.length} Drops Active
                    </h4>
                    <p className="text-[11px] text-white/60 font-mono">
                      Edit photos, prices &amp; stock anytime
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSelectTab('menu')}
                    className="px-3.5 py-2.5 rounded-2xl bg-[#C5A059]/20 hover:bg-[#C5A059] hover:text-stone-950 border border-[#C5A059]/50 text-[#F3E5AB] font-mono text-[11px] font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer"
                  >
                    Edit Menu →
                  </button>
                </div>
              </div>

              {/* Middle Section: Revenue Velocity Chart & Demand Leaderboard */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 1. 7-Day Revenue Velocity Chart (2 Cols) */}
                <div className="lg:col-span-2 p-6 rounded-3xl bg-[#091A3E] border border-white/10 shadow-xl space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C5A059] font-bold">
                        SALES VELOCITY &amp; TRENDS
                      </span>
                      <h4 className="font-heading text-lg font-bold text-white">
                        7-Day Commercial Revenue Trajectory
                      </h4>
                    </div>
                    <span className="text-xs text-white/50 font-mono">
                      Daily Receipts (INR)
                    </span>
                  </div>

                  {/* Visual CSS Bar Chart */}
                  <div className="pt-2">
                    <div className="h-48 flex items-end gap-3 sm:gap-6 pt-6 pb-2 px-2">
                      {analytics.weeklyVelocity.map((w, idx) => {
                        const heightPct = Math.round((w.revenue / (analytics.maxWeeklyRevenue || 1)) * 100);
                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                            {/* Hover Tooltip */}
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 bg-black/90 border border-[#C5A059]/60 px-2.5 py-1 rounded-lg text-[10px] font-mono text-white pointer-events-none whitespace-nowrap z-20 shadow-xl">
                              ₹{w.revenue.toLocaleString('en-IN')} • {w.orders} orders
                            </div>

                            {/* Bar Column */}
                            <div className="w-full bg-white/5 rounded-t-xl h-full flex items-end overflow-hidden">
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${heightPct}%` }}
                                transition={{ duration: 0.6, delay: idx * 0.08 }}
                                className={`w-full rounded-t-xl transition-all ${
                                  w.isToday
                                    ? 'bg-gradient-to-t from-[#0C419C] via-[#C5A059] to-[#F3E5AB]'
                                    : 'bg-gradient-to-t from-[#0C419C]/60 to-[#3B82F6]'
                                } group-hover:brightness-125`}
                              />
                            </div>

                            {/* Day Label */}
                            <span className={`text-[11px] font-mono ${w.isToday ? 'text-[#F3E5AB] font-bold' : 'text-white/60'}`}>
                              {w.day}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 2. Dispatch Channels & Logistics Breakdown (1 Col) */}
                <div className="p-6 rounded-3xl bg-[#091A3E] border border-white/10 shadow-xl space-y-5 flex flex-col justify-between">
                  <div>
                    <div className="pb-3 border-b border-white/10">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C5A059] font-bold">
                        COLLECTION CHANNELS
                      </span>
                      <h4 className="font-heading text-lg font-bold text-white">
                        Dispatch Velocity
                      </h4>
                    </div>

                    <div className="space-y-4 pt-4">
                      <div>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-white/80 flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                            <span>Direct Customer Pickups</span>
                          </span>
                          <span className="font-mono font-bold text-[#F3E5AB]">
                            {analytics.channelMap.pickup} orders
                          </span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${(analytics.channelMap.pickup / (analytics.totalOrdersCount || 1)) * 100}%` }}
                            className="h-full bg-emerald-400 rounded-full"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-white/80 flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                            <span>Courier (Dunzo / Porter)</span>
                          </span>
                          <span className="font-mono font-bold text-[#F3E5AB]">
                            {analytics.channelMap.courier} orders
                          </span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${(analytics.channelMap.courier / (analytics.totalOrdersCount || 1)) * 100}%` }}
                            className="h-full bg-blue-400 rounded-full"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-white/80 flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                            <span>Corporate Bulk B2B Drops</span>
                          </span>
                          <span className="font-mono font-bold text-[#F3E5AB]">
                            {analytics.channelMap.bulk} orders
                          </span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${(analytics.channelMap.bulk / (analytics.totalOrdersCount || 1)) * 100}%` }}
                            className="h-full bg-purple-400 rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quality Assurance Note */}
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 space-y-1 text-xs">
                    <span className="font-mono font-bold text-amber-300 text-[10px] uppercase block">
                      ✦ Central Kitchen Quality Standard
                    </span>
                    <p className="text-white/70 text-[11px] leading-relaxed">
                      All pickups are baked within 2 hours of handover slot to guarantee gooey molten centers and caramelized golden crusts.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Section: Cookie Demand Leaderboard & Export Ledger */}
              <div className="p-6 rounded-3xl bg-[#091A3E] border border-white/10 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C5A059] font-bold">
                      FLAVOR POPULARITY MATRIX
                    </span>
                    <h4 className="font-heading text-lg font-bold text-white">
                      Cookie Demand &amp; Revenue Leaderboard
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer border border-white/10"
                  >
                    <Download className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Export CSV Ledger</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                  {analytics.topDemandedCookies.map((cookie, idx) => {
                    const sharePercent = Math.round((cookie.units / (analytics.totalUnits || 1)) * 100);
                    const isLeader = idx === 0;

                    return (
                      <div
                        key={cookie.name}
                        className="p-4 rounded-2xl bg-black/30 border border-white/5 hover:border-[#C5A059]/40 transition-all space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono text-xs font-bold ${
                                isLeader ? 'bg-[#C5A059] text-stone-950' : 'bg-white/10 text-white/70'
                              }`}
                            >
                              #{idx + 1}
                            </span>
                            <div>
                              <span className="font-bold text-sm text-white block">{cookie.name}</span>
                              <span className="text-[10px] font-mono text-white/50">{cookie.weight}</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="font-bold text-white text-sm block">{cookie.units} units</span>
                            <span className="text-xs font-mono font-bold text-[#F3E5AB]">
                              ₹{cookie.revenue.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${sharePercent}%` }}
                              className={`h-full rounded-full ${
                                isLeader
                                  ? 'bg-gradient-to-r from-[#C5A059] to-[#F3E5AB]'
                                  : 'bg-gradient-to-r from-[#0C419C] to-[#3B82F6]'
                              }`}
                            />
                          </div>
                          <span className="text-[11px] font-mono text-white/50 w-10 text-right">
                            {sharePercent}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: LIVE ORDERS COMMAND PIPELINE (TABLE + KANBAN VIEW)                 */}
          {/* ========================================================================= */}
          {activeTab === 'orders' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              {/* Filter Controls Suite */}
              <div className="p-5 rounded-3xl bg-[#091A3E] border border-white/10 shadow-xl space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  {/* Omnibox Search Bar */}
                  <div className="relative flex-1 max-w-lg">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
                    <input
                      id="order-search-input"
                      type="text"
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      placeholder="Search customer name, phone, order ID #, or flavor..."
                      className="w-full pl-10 pr-8 py-2.5 bg-black/40 rounded-xl border border-white/20 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#C5A059]"
                    />
                    {orderSearchQuery && (
                      <button
                        onClick={() => setOrderSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/50 hover:text-white"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Channel & View Mode Selector */}
                  <div className="flex items-center gap-3">
                    {/* View Switcher: Table vs Kanban */}
                    <div className="flex items-center p-1 rounded-xl bg-black/50 border border-white/10">
                      <button
                        type="button"
                        onClick={() => setOrdersViewMode('table')}
                        className={`p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                          ordersViewMode === 'table'
                            ? 'bg-[#C5A059] text-stone-950 font-bold'
                            : 'text-white/60 hover:text-white'
                        }`}
                        title="Table View"
                      >
                        <TableIcon className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Table</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setOrdersViewMode('kanban')}
                        className={`p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                          ordersViewMode === 'kanban'
                            ? 'bg-[#C5A059] text-stone-950 font-bold'
                            : 'text-white/60 hover:text-white'
                        }`}
                        title="Kanban Board View"
                      >
                        <Kanban className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Pipeline</span>
                      </button>
                    </div>

                    {/* Channel Selector */}
                    <select
                      value={orderChannelFilter}
                      onChange={(e) => setOrderChannelFilter(e.target.value)}
                      className="bg-black/50 border border-white/20 rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-[#C5A059] cursor-pointer"
                    >
                      <option value="all">All Channels</option>
                      <option value="pickup">Direct Pickups</option>
                      <option value="courier">Dunzo / Porter</option>
                      <option value="bulk">Corporate Bulk</option>
                    </select>

                    <button
                      type="button"
                      onClick={handleExportCSV}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                      title="Export CSV"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Status Tabs with Counters */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-white/10">
                  {[
                    { id: 'all', label: 'All Pipeline', count: orderCounts.all },
                    { id: 'pending', label: 'Pending Kitchen', count: orderCounts.pending, color: 'text-amber-400' },
                    { id: 'prep', label: 'In The Ovens (190°C)', count: orderCounts.prepping, color: 'text-blue-400' },
                    { id: 'ready', label: 'Ready for Collection', count: orderCounts.ready, color: 'text-emerald-400' },
                    { id: 'collect', label: 'Fulfilled / Handed Over', count: orderCounts.collected, color: 'text-stone-400' },
                  ].map((filter) => {
                    const active = orderStatusFilter === filter.id;
                    return (
                      <button
                        key={filter.id}
                        type="button"
                        onClick={() => setOrderStatusFilter(filter.id)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                          active
                            ? 'bg-[#C5A059] text-stone-950 font-bold shadow-md'
                            : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/5'
                        }`}
                      >
                        <span>{filter.label}</span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                            active ? 'bg-stone-950 text-[#F3E5AB]' : 'bg-black/40 text-white/60'
                          }`}
                        >
                          {filter.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* TABLE VIEW (Mobile Cards + Widescreen Table) */}
              {ordersViewMode === 'table' && (
                <div className="rounded-3xl bg-[#091A3E] border border-white/10 overflow-hidden shadow-xl">
                  {filteredOrders.length === 0 ? (
                    <div className="p-16 text-center text-white/50 space-y-2">
                      <ShoppingBag className="w-10 h-10 mx-auto opacity-30" />
                      <h4 className="font-heading text-lg font-bold text-white">No Matching Orders Found</h4>
                      <p className="text-xs text-white/50">Adjust your status or search terms.</p>
                    </div>
                  ) : (
                    <>
                      {/* Mobile-First Touch-Friendly Order Cards (Visible on < md screens) */}
                      <div className="md:hidden divide-y divide-white/10">
                        {filteredOrders.map((order) => {
                          const status = order.status || 'Pending';
                          const isPending = status.toLowerCase().includes('pending');
                          const isPrepping = status.toLowerCase().includes('prep');
                          const isReady = status.toLowerCase().includes('ready');

                          return (
                            <div key={`mob-ord-${order.id}`} className="p-4 space-y-3 bg-[#091A3E]">
                              {/* Top Row: Order ID, Time & Amount */}
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono font-bold text-sm text-[#F3E5AB]">#{order.id}</span>
                                    <span
                                      className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase ${
                                        isPending
                                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                                          : isPrepping
                                          ? 'bg-blue-400/20 text-blue-300 border border-blue-400/40'
                                          : isReady
                                          ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40'
                                          : 'bg-stone-600/30 text-stone-300 border border-stone-500/40'
                                      }`}
                                    >
                                      {status}
                                    </span>
                                  </div>
                                  <span className="text-[10px] font-mono text-white/45 block mt-0.5">
                                    {order.date} • {order.time}
                                  </span>
                                </div>

                                <div className="text-right">
                                  <span className="font-heading font-bold text-base text-[#F3E5AB] block">
                                    ₹{order.finalTotal?.toLocaleString('en-IN')}
                                  </span>
                                  <span className="text-[9px] font-mono text-white/50 uppercase">
                                    {order.customer?.paymentMethod?.toUpperCase() || 'UPI'}
                                  </span>
                                </div>
                              </div>

                              {/* Customer & Slot */}
                              <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-black/30 border border-white/5 text-xs">
                                <div className="min-w-0">
                                  <span className="font-bold text-white block truncate">{order.customer?.name}</span>
                                  <span className="text-[10px] font-mono text-white/60">{order.customer?.phone}</span>
                                </div>
                                <div className="text-right shrink-0">
                                  <span className="text-[9px] font-mono text-[#C5A059] uppercase block">Pickup Slot</span>
                                  <span className="text-[10px] font-mono text-white/90 font-semibold">
                                    {order.customer?.slot?.split('(')[0] || 'Today'}
                                  </span>
                                </div>
                              </div>

                              {/* Items */}
                              <div className="flex flex-wrap gap-1">
                                {order.items?.map((item, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-0.5 rounded-lg bg-black/40 border border-white/10 text-[10px] text-white/90"
                                  >
                                    {item.name} <strong className="text-[#F3E5AB]">x{item.quantity}</strong>
                                  </span>
                                ))}
                              </div>

                              {/* Mobile Action Buttons */}
                              <div className="flex items-center gap-2 pt-1">
                                {isPending && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      updateOrderStatus(order.id, 'Kitchen Prepping');
                                      showToast(`Order #${order.id} in ovens!`);
                                    }}
                                    className="flex-1 py-2 px-3 rounded-xl bg-blue-600 text-white text-xs font-bold cursor-pointer"
                                  >
                                    Start Baking ♨
                                  </button>
                                )}
                                {isPrepping && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      updateOrderStatus(order.id, 'Ready for Collection');
                                      showToast(`Order #${order.id} Ready!`);
                                    }}
                                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer"
                                  >
                                    Mark Ready ✓
                                  </button>
                                )}
                                {isReady && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      updateOrderStatus(order.id, 'Collected');
                                      showToast(`Order #${order.id} Handed Over`);
                                    }}
                                    className="flex-1 py-2 px-3 rounded-xl bg-stone-700 text-white text-xs font-bold cursor-pointer"
                                  >
                                    Complete Handover
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => setSelectedNotificationOrder(order)}
                                  className="py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                  <span>Notify</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setSelectedOrderDrawer(order)}
                                  className="py-2 px-3 rounded-xl bg-white/10 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Ticket</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Widescreen Desktop Table (Visible on md+ screens) */}
                      <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left text-xs">
                        <thead className="bg-black/50 border-b border-white/10 text-[10px] font-mono uppercase tracking-wider text-white/50">
                          <tr>
                            <th className="p-4 pl-6">Order ID &amp; Time</th>
                            <th className="p-4">Customer Details</th>
                            <th className="p-4">Fulfillment Slot</th>
                            <th className="p-4">Itemized Bakes</th>
                            <th className="p-4">Total &amp; Payment</th>
                            <th className="p-4">Live Status</th>
                            <th className="p-4 pr-6 text-right">Quick Workflow</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {filteredOrders.map((order) => {
                            const status = order.status || 'Pending';
                            const isPending = status.toLowerCase().includes('pending');
                            const isPrepping = status.toLowerCase().includes('prep');
                            const isReady = status.toLowerCase().includes('ready');

                            return (
                              <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                {/* Order ID */}
                                <td className="p-4 pl-6 font-mono">
                                  <span className="font-bold text-[#F3E5AB] block text-sm">
                                    #{order.id}
                                  </span>
                                  <span className="text-[10px] text-white/40 block">
                                    {order.date} • {order.time}
                                  </span>
                                </td>

                                {/* Customer Profile */}
                                <td className="p-4">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-xl bg-[#0C419C] border border-[#C5A059]/40 flex items-center justify-center font-bold text-xs text-[#F3E5AB]">
                                      {order.customer?.name?.slice(0, 2).toUpperCase() || 'CU'}
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-1.5">
                                        <span className="font-bold text-white block">{order.customer?.name}</span>
                                        {order.customer?.isBulkOrder && (
                                          <span className="text-[8px] bg-purple-500/20 text-purple-300 font-mono font-bold px-1.5 py-0.2 rounded uppercase">
                                            Bulk B2B
                                          </span>
                                        )}
                                      </div>
                                      <span className="text-[11px] font-mono text-white/60">{order.customer?.phone}</span>
                                    </div>
                                  </div>
                                </td>

                                {/* Fulfillment Slot */}
                                <td className="p-4">
                                  <span className="font-mono text-white font-medium block">
                                    {order.customer?.slot}
                                  </span>
                                  {order.customer?.note && (
                                    <span className="text-[10px] text-amber-300/90 italic block mt-0.5 max-w-[200px] truncate">
                                      &ldquo;{order.customer.note}&rdquo;
                                    </span>
                                  )}
                                </td>

                                {/* Items Summary */}
                                <td className="p-4">
                                  <div className="flex flex-wrap gap-1 max-w-xs">
                                    {order.items?.map((item, idx) => (
                                      <span
                                        key={idx}
                                        className="px-2 py-0.5 rounded-lg bg-black/40 border border-white/10 text-[10px] text-white/90"
                                      >
                                        {item.name} <strong className="text-[#F3E5AB]">x{item.quantity}</strong>
                                      </span>
                                    ))}
                                  </div>
                                </td>

                                {/* Amount & Payment */}
                                <td className="p-4 font-mono">
                                  <span className="font-heading font-bold text-sm text-[#F3E5AB] block">
                                    ₹{order.finalTotal?.toLocaleString('en-IN')}
                                  </span>
                                  <span className="text-[9px] text-white/50 uppercase">
                                    {order.customer?.paymentMethod?.toUpperCase() || 'UPI'} Paid
                                  </span>
                                </td>

                                {/* Status Selector */}
                                <td className="p-4">
                                  <select
                                    value={status}
                                    onChange={(e) => {
                                      updateOrderStatus(order.id, e.target.value);
                                      showToast(`Order #${order.id} moved to ${e.target.value}`);
                                    }}
                                    className={`px-2.5 py-1 rounded-xl text-xs font-bold border focus:outline-none cursor-pointer ${
                                      isPending
                                        ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                                        : isPrepping
                                        ? 'bg-blue-400/20 text-blue-300 border-blue-400/40'
                                        : isReady
                                        ? 'bg-emerald-400/20 text-emerald-300 border-emerald-400/40 animate-pulse'
                                        : 'bg-stone-600/30 text-stone-300 border-stone-500/40'
                                    }`}
                                  >
                                    <option value="Pending" className="bg-[#091A3E] text-white">Pending</option>
                                    <option value="Kitchen Prepping" className="bg-[#091A3E] text-white">Kitchen Prepping</option>
                                    <option value="Ready for Collection" className="bg-[#091A3E] text-white">Ready for Collection</option>
                                    <option value="Collected" className="bg-[#091A3E] text-white">Collected</option>
                                  </select>
                                </td>

                                {/* Quick Actions */}
                                <td className="p-4 pr-6 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    {/* 1-Tap Workflow Advancement */}
                                    {isPending && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          updateOrderStatus(order.id, 'Kitchen Prepping');
                                          showToast(`Order #${order.id} in ovens!`);
                                        }}
                                        className="px-2.5 py-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold transition-all cursor-pointer"
                                      >
                                        Bake ♨
                                      </button>
                                    )}

                                    {isPrepping && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          updateOrderStatus(order.id, 'Ready for Collection');
                                          showToast(`Order #${order.id} Ready!`);
                                        }}
                                        className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-all cursor-pointer"
                                      >
                                        Boxed ✓
                                      </button>
                                    )}

                                    {isReady && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          updateOrderStatus(order.id, 'Collected');
                                          showToast(`Order #${order.id} Handed Over`);
                                        }}
                                        className="px-2.5 py-1 rounded-xl bg-stone-700 hover:bg-stone-600 text-white text-[11px] font-bold transition-all cursor-pointer"
                                      >
                                        Handover 🤝
                                      </button>
                                    )}

                                    {/* WhatsApp Notification Dispatch Modal Trigger */}
                                    <button
                                      type="button"
                                      onClick={() => setSelectedNotificationOrder(order)}
                                      className="p-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white transition-all cursor-pointer shadow-xs"
                                      title="Dispatch Order WhatsApp Notification"
                                    >
                                      <MessageSquare className="w-3.5 h-3.5" />
                                    </button>

                                    {/* Open Ticket Drawer */}
                                    <button
                                      type="button"
                                      onClick={() => setSelectedOrderDrawer(order)}
                                      className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                                      title="View Ticket"
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </>
                  )}
                </div>
              )}

              {/* KANBAN BOARD VIEW */}
              {ordersViewMode === 'kanban' && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  {[
                    { id: 'Pending', title: 'Pending Kitchen', count: orderCounts.pending, color: 'border-amber-400/40 text-amber-300' },
                    { id: 'Kitchen Prepping', title: 'In Ovens (190°C)', count: orderCounts.prepping, color: 'border-blue-400/40 text-blue-300' },
                    { id: 'Ready for Collection', title: 'Ready for Collection', count: orderCounts.ready, color: 'border-emerald-400/40 text-emerald-300' },
                    { id: 'Collected', title: 'Handed Over', count: orderCounts.collected, color: 'border-stone-500/40 text-stone-300' },
                  ].map((col) => {
                    const colOrders = orders.filter((o) =>
                      (o.status || 'Pending').toLowerCase().includes(col.id.toLowerCase())
                    );

                    return (
                      <div
                        key={col.id}
                        className="rounded-3xl bg-[#091A3E] border border-white/10 p-4 space-y-3 flex flex-col justify-between shadow-xl"
                      >
                        {/* Column Header */}
                        <div className="flex items-center justify-between pb-2 border-b border-white/10">
                          <span className={`font-mono text-xs uppercase font-bold tracking-wider ${col.color}`}>
                            {col.title}
                          </span>
                          <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-black/40 text-white font-bold">
                            {colOrders.length}
                          </span>
                        </div>

                        {/* Column Cards */}
                        <div className="space-y-3 flex-1 overflow-y-auto max-h-[650px] pr-1">
                          {colOrders.length === 0 ? (
                            <div className="p-8 text-center text-white/30 text-xs italic">
                              No orders in this stage.
                            </div>
                          ) : (
                            colOrders.map((ord) => (
                              <div
                                key={ord.id}
                                className="p-3.5 rounded-2xl bg-black/35 border border-white/10 hover:border-[#C5A059]/50 transition-all space-y-2.5 shadow-md"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-mono text-xs font-bold text-[#F3E5AB]">
                                    #{ord.id}
                                  </span>
                                  <span className="font-mono font-bold text-xs text-white">
                                    ₹{ord.finalTotal?.toLocaleString('en-IN')}
                                  </span>
                                </div>

                                <div>
                                  <span className="font-bold text-xs text-white block">{ord.customer?.name}</span>
                                  <span className="text-[10px] text-white/50 font-mono">{ord.customer?.slot}</span>
                                </div>

                                <div className="flex flex-wrap gap-1">
                                  {ord.items?.map((it, i) => (
                                    <span key={i} className="text-[9px] px-2 py-0.5 rounded bg-white/5 text-white/80">
                                      {it.name} (x{it.quantity})
                                    </span>
                                  ))}
                                </div>

                                {ord.customer?.note && (
                                  <p className="text-[10px] text-amber-200/90 italic line-clamp-1">
                                    &ldquo;{ord.customer.note}&rdquo;
                                  </p>
                                )}

                                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedNotificationOrder(ord)}
                                    className="text-[11px] text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1 cursor-pointer transition-colors"
                                  >
                                    <MessageSquare className="w-3 h-3" />
                                    <span>Notify</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => setSelectedOrderDrawer(ord)}
                                    className="text-[11px] text-white/60 hover:text-white font-mono flex items-center gap-1 cursor-pointer"
                                  >
                                    <span>Ticket</span>
                                    <ChevronRight className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: CUSTOMER CRM DIRECTORY & DOSSIER                                   */}
          {/* ========================================================================= */}
          {activeTab === 'customers' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="p-6 rounded-3xl bg-[#091A3E] border border-[#C5A059]/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#F3E5AB] font-bold flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>CLIENT RELATIONSHIP MANAGEMENT &amp; DOSSIER</span>
                  </span>
                  <h3 className="font-heading text-xl font-bold text-white mt-0.5">
                    Verified Customer Directory ({customerDirectory.length})
                  </h3>
                  <p className="text-xs text-white/60 font-light mt-1 max-w-xl">
                    Lifetime spend (LTV), repeat purchase frequency, preferred flavor profiles, and 1-tap WhatsApp VIP concierge.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono">
                    Avg LTV: <strong className="text-[#F3E5AB]">₹{analytics.averageOrderValue}</strong>
                  </div>
                </div>
              </div>

              {/* Search & Segments */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {[
                    { id: 'all', label: `All Clients (${customerDirectory.length})` },
                    { id: 'vip', label: '👑 VIP Patrons (> ₹2,500)' },
                    { id: 'bulk', label: '🏢 Corporate Accounts' },
                  ].map((seg) => (
                    <button
                      key={seg.id}
                      type="button"
                      onClick={() => setCustomerSegmentFilter(seg.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                        customerSegmentFilter === seg.id
                          ? 'bg-[#C5A059] text-stone-950 font-bold'
                          : 'bg-white/5 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      {seg.label}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
                  <input
                    type="text"
                    value={customerSearchQuery}
                    onChange={(e) => setCustomerSearchQuery(e.target.value)}
                    placeholder="Search client name, phone, email..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/20 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              {/* Customer Directory Table */}
              <div className="rounded-3xl bg-[#091A3E] border border-white/10 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-black/50 border-b border-white/10 text-[10px] font-mono uppercase tracking-wider text-white/50">
                      <tr>
                        <th className="p-4 pl-6">Client Profile</th>
                        <th className="p-4">Contact Phone</th>
                        <th className="p-4">Orders</th>
                        <th className="p-4">Lifetime Spend (LTV)</th>
                        <th className="p-4">Favorite Cookie</th>
                        <th className="p-4">Last Order</th>
                        <th className="p-4 pr-6 text-right">VIP Concierge</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredCustomers.map((client, idx) => {
                        const isVip = client.totalSpent > 2500 || client.isBulk;
                        return (
                          <tr
                            key={idx}
                            onClick={() => setSelectedCustomerDossier(client)}
                            className="hover:bg-white/5 transition-colors cursor-pointer group"
                          >
                            <td className="p-4 pl-6">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0C419C] to-[#1E60D5] border border-[#C5A059]/40 flex items-center justify-center font-bold text-xs text-[#F3E5AB] group-hover:scale-105 transition-transform">
                                  {client.name.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-white block text-sm">{client.name}</span>
                                    {isVip && (
                                      <span className="text-[8px] bg-amber-400/20 text-amber-300 font-mono font-bold px-1.5 py-0.2 rounded uppercase">
                                        VIP
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[10px] text-white/40">{client.email}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 font-mono text-white/80">{client.phone}</td>
                            <td className="p-4 font-mono">
                              <span className="font-bold text-white">{client.totalOrders}</span> orders
                            </td>
                            <td className="p-4 font-mono font-bold text-[#F3E5AB]">
                              ₹{client.totalSpent.toLocaleString('en-IN')}
                            </td>
                            <td className="p-4 text-white/80 truncate max-w-[200px]">{client.favoriteCookie}</td>
                            <td className="p-4 text-white/60 font-mono">{client.lastOrderDate}</td>
                            <td className="p-4 pr-6 text-right">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedCustomerDossier(client);
                                }}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] transition-all cursor-pointer"
                              >
                                <span>Inspect Dossier</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: CORPORATE & BULK INQUIRIES (B2B CRM LEADS)                         */}
          {/* ========================================================================= */}
          {activeTab === 'bulk' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="p-6 rounded-3xl bg-[#091A3E] border border-purple-500/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-purple-300 font-bold flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-purple-300" />
                    <span>CORPORATE GIFTING &amp; HIGH-TICKET B2B PIPELINE</span>
                  </span>
                  <h3 className="font-heading text-xl font-bold text-white mt-0.5">
                    Corporate Hamper Inquiries ({bulkInquiries.length})
                  </h3>
                  <p className="text-xs text-white/60 font-light mt-1 max-w-xl">
                    Track luxury bespoke hampers, wedding return favors, executive summit boxes, and dispatch schedules.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 rounded-2xl bg-purple-500/20 border border-purple-500/30 text-xs font-mono text-purple-200">
                    Total Pipeline: <strong className="text-white">₹2,63,780</strong>
                  </div>
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {[
                  { id: 'all', label: 'All Inquiries' },
                  { id: 'new', label: 'New Leads' },
                  { id: 'quote', label: 'Quote Sent' },
                  { id: 'confirmed', label: 'Confirmed & Paid' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setBulkStatusFilter(f.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                      bulkStatusFilter === f.id
                        ? 'bg-purple-600 text-white font-bold'
                        : 'bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Inquiries Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredInquiries.map((inq) => {
                  const cleanPhone = inq.phone.replace(/\D/g, '');
                  const waLink = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
                    `Hello ${inq.contactPerson}! 🍪 Greetings from Sukié Atelier Mumbai. We have prepared the bespoke luxury corporate quotation for ${inq.company} (${inq.estimatedUnits} boxes for ${inq.event}). Please let us know if we can assist with sample tastings!`
                  )}`;

                  return (
                    <div
                      key={inq.id}
                      className="p-5 rounded-3xl bg-[#091A3E] border border-white/15 hover:border-purple-400/50 transition-all flex flex-col justify-between space-y-4 shadow-xl"
                    >
                      <div>
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                          <div>
                            <span className="font-mono text-xs font-bold text-purple-300 block">
                              {inq.id}
                            </span>
                            <h4 className="font-heading text-lg font-bold text-white mt-0.5">
                              {inq.company}
                            </h4>
                          </div>
                          <select
                            value={inq.status}
                            onChange={(e) => {
                              updateBulkInquiryStatus(inq.id, e.target.value);
                              showToast(`Inquiry status updated to ${e.target.value}`);
                            }}
                            className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-xl bg-purple-900/60 text-purple-200 border border-purple-500/40 focus:outline-none cursor-pointer"
                          >
                            <option value="New Inquiry">New Inquiry</option>
                            <option value="In Discussion">In Discussion</option>
                            <option value="Quote Sent">Quote Sent</option>
                            <option value="Confirmed & Paid">Confirmed & Paid</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </div>

                        <div className="space-y-2 pt-3 text-xs">
                          <div className="flex justify-between">
                            <span className="text-white/60">Contact Person:</span>
                            <span className="font-bold text-white">{inq.contactPerson}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/60">Event / Occasion:</span>
                            <span className="text-white font-medium">{inq.event}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/60">Date Required:</span>
                            <span className="font-mono text-[#F3E5AB] font-bold">{inq.dateRequired}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/60">Estimated Quantity:</span>
                            <span className="font-mono text-white font-bold">{inq.estimatedUnits} Luxury Gift Boxes</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/60">Estimated Deal Value:</span>
                            <span className="font-heading text-base font-bold text-emerald-400">
                              ₹{inq.estimatedValue?.toLocaleString('en-IN')}
                            </span>
                          </div>

                          {inq.notes && (
                            <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-[11px] text-white/80 italic mt-2">
                              &ldquo;{inq.notes}&rdquo;
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/10">
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>WhatsApp Quotation &amp; Sample</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: QUARTERLY DROPS STUDIO (3-MONTH ROTATION CATALOG)                  */}
          {/* ========================================================================= */}
          {activeTab === 'menu' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Studio Header Bar */}
              <div className="p-6 rounded-3xl bg-[#091A3E] border border-[#C5A059]/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#F3E5AB] font-bold flex items-center gap-1.5">
                    <Cookie className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>3-MONTH ROTATION MANAGER &amp; PHOTO STUDIO</span>
                  </span>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-white mt-0.5">
                    Seasonal Drops &amp; Photos Studio
                  </h3>
                  <p className="text-xs text-white/60 font-light mt-1 max-w-xl">
                    Replace cookie photos directly from your phone/laptop, adjust pricing, edit 170g recipe ingredients, and toggle daily kitchen stock.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setAllProductsAvailability(true);
                      showToast('All menu drops marked In Stock.');
                    }}
                    className="px-3 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition-all cursor-pointer"
                  >
                    ✓ All In Stock
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAllProductsAvailability(false);
                      showToast('All menu drops marked Sold Out for today.');
                    }}
                    className="px-3 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 text-xs font-semibold transition-all cursor-pointer"
                  >
                    ✕ All Sold Out
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Restore factory default recipe menu?')) {
                        resetToDefaultMenu();
                        showToast('Reset to original factory menu.');
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-xs font-semibold border border-white/10 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(null);
                      setIsEditorOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#E3C378] text-stone-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Seasonal Drop</span>
                  </button>
                </div>
              </div>

              {/* Category Filter Pills & Search */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setMenuCategoryFilter('all')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                      menuCategoryFilter === 'all'
                        ? 'bg-[#C5A059] text-stone-950 font-bold'
                        : 'bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    All Drops ({products.length})
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setMenuCategoryFilter(c.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide whitespace-nowrap transition-all cursor-pointer ${
                        menuCategoryFilter === c.id
                          ? 'bg-[#C5A059] text-stone-950 font-bold'
                          : 'bg-white/5 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
                  <input
                    type="text"
                    value={menuSearchQuery}
                    onChange={(e) => setMenuSearchQuery(e.target.value)}
                    placeholder="Search drops by flavor..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/20 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredProducts.map((product) => {
                  const isAvailable = product.available !== false;

                  return (
                    <div
                      key={product.id}
                      className={`p-5 rounded-3xl bg-[#091A3E] border transition-all flex flex-col justify-between space-y-4 shadow-xl ${
                        isAvailable
                          ? 'border-white/15 hover:border-[#C5A059]/70'
                          : 'border-red-500/30 opacity-75 bg-[#06122C]'
                      }`}
                    >
                      <div>
                        {/* High-Res Photo & Action Overlay */}
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-900 border border-white/10 shadow-inner mb-3.5 group">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              if (e.target.parentElement) {
                                e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-[#0C419C] text-4xl">🍪</div>`;
                              }
                            }}
                          />

                          {/* Category Badge */}
                          <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-mono uppercase font-bold text-[#F3E5AB] border border-white/20">
                            {product.category}
                          </span>

                          {/* Availability Pill */}
                          <span
                            className={`absolute top-2.5 right-2.5 px-3 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold tracking-wider ${
                              isAvailable ? 'bg-emerald-500 text-white' : 'bg-red-600 text-white'
                            }`}
                          >
                            {isAvailable ? 'In Stock' : 'Sold Out'}
                          </span>

                          {/* Quick Replace Photo Hover Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProduct(product);
                              setIsEditorOpen(true);
                            }}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 backdrop-blur-xs flex items-center justify-center text-xs font-bold text-white transition-opacity gap-2 cursor-pointer"
                          >
                            <span>📷 Change Photo &amp; Recipe</span>
                          </button>
                        </div>

                        {/* Title, Weight & Price */}
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="font-heading text-lg font-bold text-white leading-tight">
                              {product.name}
                            </h4>
                            <p className="text-[11px] text-white/50 font-mono mt-0.5">
                              {product.weight || '170g (6oz)'} • Serves {product.serves || '1-2'}
                            </p>
                          </div>
                          <span className="font-heading text-xl font-bold text-[#F3E5AB] shrink-0">
                            ₹{product.price}
                          </span>
                        </div>

                        {/* Sensory Description */}
                        <p className="text-xs text-white/70 line-clamp-2 mt-2 font-light leading-relaxed">
                          {product.shortDesc || product.description}
                        </p>

                        {/* Ingredients Tag preview */}
                        {product.ingredients && product.ingredients.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {product.ingredients.slice(0, 3).map((ing, i) => (
                              <span key={i} className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-white/60">
                                {ing}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Card Action Controls */}
                      <div className="pt-3 border-t border-white/10 space-y-2">
                        {/* Daily Stock Toggle */}
                        <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-xl border border-white/10">
                          <span className="text-xs font-mono text-white/80">Oven Availability:</span>
                          <button
                            type="button"
                            onClick={() => {
                              toggleProductAvailability(product.id);
                              showToast(`${product.name} marked ${isAvailable ? 'Sold Out' : 'In Stock'}`);
                            }}
                            className={`px-3.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              isAvailable
                                ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/50'
                                : 'bg-red-600/30 text-red-300 border border-red-500/40 hover:bg-red-600/50'
                            }`}
                          >
                            {isAvailable ? '✓ In Stock' : '✕ Sold Out'}
                          </button>
                        </div>

                        {/* Edit & Archive Buttons */}
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProduct(product);
                              setIsEditorOpen(true);
                            }}
                            className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <span>✏ Edit &amp; Photo</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to archive "${product.name}"?`)) {
                                deleteProduct(product.id);
                                showToast(`Archived ${product.name}`);
                              }
                            }}
                            className="w-full py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer border border-red-800/30"
                          >
                            <span>🗑 Archive</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: KITCHEN DISPLAY SYSTEM (OVEN PREP & BATCH CALCULATOR)              */}
          {/* ========================================================================= */}
          {activeTab === 'kitchen' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-6 max-w-4xl"
            >
              <div className="p-6 rounded-3xl bg-[#091A3E] border border-white/10 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-300 font-bold flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-300" />
                    <span>CENTRAL KITCHEN DISPATCH &amp; OVEN DISPLAY</span>
                  </span>
                  <h3 className="font-heading text-xl font-bold text-white mt-0.5">
                    Live Oven Prep &amp; Batch Calculator
                  </h3>
                  <p className="text-xs text-white/60 font-light mt-1">
                    Real-time count of 170g cookies required for upcoming pickup slots today.
                  </p>
                </div>

                <div className="flex items-center gap-4 bg-black/40 p-3.5 rounded-2xl border border-white/10">
                  <div className="text-center">
                    <span className="text-[10px] font-mono text-white/50 uppercase block">Total Bakes</span>
                    <span className="font-heading text-2xl font-bold text-[#F3E5AB]">
                      {kitchenBatchData.totalCookiesToBake}
                    </span>
                  </div>
                  <div className="w-[1px] h-8 bg-white/10" />
                  <div className="text-center">
                    <span className="text-[10px] font-mono text-white/50 uppercase block">Total Dough</span>
                    <span className="font-heading text-2xl font-bold text-emerald-400">
                      {kitchenBatchData.totalDoughKg} kg
                    </span>
                  </div>
                </div>
              </div>

              {/* Itemized Baking Sheet */}
              <div className="rounded-3xl bg-[#091A3E] border border-white/10 overflow-hidden shadow-xl p-6 space-y-4">
                <h4 className="font-heading text-base font-bold text-white flex items-center justify-between">
                  <span>Flavor Production Breakdown</span>
                  <span className="text-xs font-mono text-white/50 font-normal">Check off as baked</span>
                </h4>

                {kitchenBatchData.items.length === 0 ? (
                  <div className="p-8 text-center text-white/50 text-xs">
                    No active pending bakes right now. All pre-orders have been boxed!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {kitchenBatchData.items.map((item, idx) => {
                      const isChecked = !!checkedBakeItems[item.name];

                      return (
                        <div
                          key={idx}
                          className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
                            isChecked
                              ? 'bg-emerald-950/20 border-emerald-500/40 opacity-75'
                              : 'bg-black/30 border-white/10 hover:border-[#C5A059]/40'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                setCheckedBakeItems((prev) => ({
                                  ...prev,
                                  [item.name]: e.target.checked,
                                }));
                              }}
                              className="w-5 h-5 rounded-md accent-[#C5A059] cursor-pointer"
                            />
                            <div>
                              <span className={`font-bold text-sm block ${isChecked ? 'line-through text-white/50' : 'text-white'}`}>
                                {item.name}
                              </span>
                              <span className="text-[11px] text-white/50 font-mono">
                                Across {item.ordersCount} {item.ordersCount === 1 ? 'order' : 'orders'}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="font-heading text-2xl font-bold text-[#F3E5AB]">
                              {item.units} <span className="text-sm font-sans font-normal text-white/60">units</span>
                            </span>
                            <span className="text-[10px] text-emerald-400 font-mono block">
                              ~{(item.units * 0.17).toFixed(2)} kg dough
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* TAB 7: TASTING REVIEWS & SOCIAL PROOF                                     */}
          {/* ========================================================================= */}
          {activeTab === 'reviews' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="p-6 rounded-3xl bg-[#091A3E] border border-white/10 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C5A059] font-bold flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>TASTING NOTES &amp; CLIENT TESTIMONIALS</span>
                  </span>
                  <h3 className="font-heading text-xl font-bold text-white mt-0.5">
                    Reviews Moderation ({reviews.length})
                  </h3>
                  <p className="text-xs text-white/60 font-light mt-1">
                    Live feedback displayed in the Care Lounge and tasting sections.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddReviewOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#C5A059] hover:bg-[#D4B86A] text-stone-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-md cursor-pointer shrink-0 flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Client Review</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-2xl bg-[#091A3E] border border-white/10 shadow-md flex flex-col justify-between space-y-3 hover:border-[#C5A059]/40 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <span className="font-bold text-white text-sm">{rev.name}</span>
                        <div className="flex text-amber-400 text-xs">
                          {Array.from({ length: rev.stars || 5 }).map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>
                      </div>

                      {rev.cookie && (
                        <span className="text-[11px] font-mono text-[#F3E5AB] block mt-2">
                          Bake: {rev.cookie}
                        </span>
                      )}

                      <p className="text-xs text-white/80 italic font-light mt-2 leading-relaxed">
                        &ldquo;{rev.comment}&rdquo;
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-white/40">
                      <span>{rev.date || 'Recent'}</span>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm('Delete this review?')) {
                            deleteReview(rev.id);
                            showToast('Review removed.');
                          }
                        }}
                        className="text-red-400 hover:text-red-300 font-mono text-[11px] cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* TAB 8: ATELIER CONFIGURATION & SECURITY SETTINGS                          */}
          {/* ========================================================================= */}
          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-6 max-w-3xl"
            >
              {/* Store View Mode */}
              <div className="p-6 rounded-3xl bg-[#091A3E] border border-[#C5A059]/40 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#F3E5AB] font-bold">
                      PUBLIC STOREFRONT
                    </span>
                    <h3 className="font-heading text-lg font-bold text-white mt-0.5">
                      Store Operating Mode
                    </h3>
                    <p className="text-xs text-white/60 font-light mt-1">
                      Choose what regular customers see when visiting <code className="text-[#F3E5AB]">sukiecookies.com</code>.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const updated = !storeConfig.isComingSoon;
                      updateStoreConfig({ isComingSoon: updated });
                      showToast(updated ? 'Switched to Coming Soon Landing' : 'Switched to Live Store');
                    }}
                    className={`relative w-14 h-8 rounded-full transition-colors cursor-pointer p-1 ${
                      storeConfig.isComingSoon ? 'bg-amber-600' : 'bg-emerald-600'
                    }`}
                  >
                    <motion.div
                      layout
                      className="w-6 h-6 rounded-full bg-white shadow-md"
                      style={{
                        marginLeft: storeConfig.isComingSoon ? '0px' : 'auto',
                      }}
                    />
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs flex items-center gap-3">
                  <span className="text-2xl">{storeConfig.isComingSoon ? '⏳' : '🛍️'}</span>
                  <div>
                    <span className="font-bold text-white block">
                      {storeConfig.isComingSoon ? 'Coming Soon Mode Active' : 'Live Store Active'}
                    </span>
                    <span className="text-white/60 text-[11px]">
                      {storeConfig.isComingSoon
                        ? 'Visitors land on the luxury royal blue & gold animated teaser with waitlist.'
                        : 'Visitors see the full menu drops, box builder, and checkout.'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Live Ticker Headline */}
              <div className="p-6 rounded-3xl bg-[#091A3E] border border-white/10 shadow-xl space-y-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C5A059] font-bold">
                    OVEN BROADCAST TICKER
                  </span>
                  <h3 className="font-heading text-lg font-bold text-white mt-0.5">
                    Live Menu Status Banner
                  </h3>
                  <p className="text-xs text-white/60 font-light mt-1">
                    Updates the prominent headline ticker pill on the public menu.
                  </p>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    defaultValue={storeConfig.ovenStatusText}
                    onBlur={(e) => {
                      updateStoreConfig({ ovenStatusText: e.target.value });
                      showToast('Live ticker updated.');
                    }}
                    placeholder="e.g. Ovens Fired Today • 170g Fresh Levain Bakes Ready"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-black/40 border border-white/20 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      const input = e.currentTarget.previousSibling;
                      if (input && input.value) {
                        updateStoreConfig({ ovenStatusText: input.value });
                        showToast('Live ticker updated.');
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#D4B86A] text-stone-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </div>

              {/* Update PIN */}
              <div className="p-6 rounded-3xl bg-[#091A3E] border border-white/10 shadow-xl space-y-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-300 font-bold">
                    ATELIER SECURITY
                  </span>
                  <h3 className="font-heading text-lg font-bold text-white mt-0.5">
                    Change Founder 4-Digit PIN
                  </h3>
                  <p className="text-xs text-white/60 font-light mt-1">
                    Current PIN is active. Enter a new 4-digit code to update studio authorization.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-white/70 block mb-1">New 4-Digit PIN</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={newPin}
                      onChange={(e) => {
                        setNewPin(e.target.value.replace(/\D/g, ''));
                        setPinChangeError('');
                      }}
                      placeholder="e.g. 1234"
                      className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/20 text-center font-mono text-base tracking-widest text-white focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-white/70 block mb-1">Confirm PIN</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={confirmPin}
                      onChange={(e) => {
                        setConfirmPin(e.target.value.replace(/\D/g, ''));
                        setPinChangeError('');
                      }}
                      placeholder="Repeat 4 digits"
                      className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/20 text-center font-mono text-base tracking-widest text-white focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                {pinChangeError && <p className="text-xs text-red-400 font-medium">{pinChangeError}</p>}

                <button
                  type="button"
                  onClick={() => {
                    if (newPin.length !== 4) {
                      setPinChangeError('PIN must be exactly 4 digits.');
                      return;
                    }
                    if (newPin !== confirmPin) {
                      setPinChangeError('PIN codes do not match.');
                      return;
                    }
                    changePin(newPin);
                    setNewPin('');
                    setConfirmPin('');
                    showToast('Founder PIN successfully updated.');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#D4B86A] text-stone-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Save New PIN
                </button>
              </div>
            </motion.div>
          )}

        </main>

        {/* Mobile-First Bottom Operations Bar (Visible on < lg screens) */}
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-[#07132B]/95 backdrop-blur-xl border-t border-[#C5A059]/30 px-2 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex items-center justify-around shadow-[0_-10px_30px_rgba(0,0,0,0.65)]">
          {[
            { id: 'analytics', label: 'Overview', icon: LayoutDashboard },
            { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: orderCounts.pending > 0 ? orderCounts.pending : null },
            { id: 'kitchen', label: 'Kitchen', icon: ChefHat, badge: kitchenBatchData.totalCookiesToBake > 0 ? kitchenBatchData.totalCookiesToBake : null },
            { id: 'menu', label: 'Drops', icon: Cookie },
            { id: 'customers', label: 'CRM', icon: Users },
          ].map((item) => {
            const active = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={`mob-nav-${item.id}`}
                type="button"
                onClick={() => handleSelectTab(item.id)}
                className={`relative py-1.5 px-3 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                  active ? 'bg-[#C5A059] text-stone-950 font-bold shadow-md' : 'text-white/65 hover:text-white'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-4 h-4 ${active ? 'text-stone-950' : 'text-[#F3E5AB]'}`} />
                  {item.badge && (
                    <span
                      className={`absolute -top-1.5 -right-2.5 px-1 min-w-[14px] h-3.5 rounded-full text-[8px] font-mono font-bold flex items-center justify-center ${
                        active ? 'bg-stone-950 text-[#F3E5AB]' : 'bg-amber-500 text-stone-950'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[9px] font-mono uppercase tracking-wider leading-none mt-0.5">
                  {item.label}
                </span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(true)}
            className="py-1.5 px-3 rounded-xl flex flex-col items-center justify-center gap-0.5 text-white/65 hover:text-white cursor-pointer"
          >
            <MoreHorizontal className="w-4 h-4 text-[#F3E5AB]" />
            <span className="text-[9px] font-mono uppercase tracking-wider leading-none mt-0.5">
              More
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. ORDER DETAIL SLIDE-OVER DRAWER                                         */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedOrderDrawer && (
          <div className="fixed inset-0 z-[250] overflow-hidden flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrderDrawer(null)}
              className="absolute inset-0 bg-black/75 backdrop-blur-xs"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative w-full max-w-lg bg-[#091A3E] border-l border-[#C5A059]/40 shadow-2xl flex flex-col justify-between overflow-hidden text-white"
            >
              {/* Drawer Header */}
              <div className="p-6 bg-gradient-to-r from-[#07132B] via-[#0A2254] to-[#07132B] border-b border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C5A059] font-bold">
                    DISPATCH TICKET
                  </span>
                  <h3 className="font-heading text-xl font-bold text-white mt-0.5">
                    Order #{selectedOrderDrawer.id}
                  </h3>
                  <p className="text-xs text-white/50 font-mono mt-0.5">
                    Placed {selectedOrderDrawer.date} at {selectedOrderDrawer.time}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedOrderDrawer(null)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold transition-all cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Drawer Body */}
              <div className="p-6 overflow-y-auto space-y-5 flex-1">
                {/* Status Selector in Drawer */}
                <div className="p-4 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-between">
                  <span className="text-xs font-mono text-white/70">Fulfillment Status:</span>
                  <select
                    value={selectedOrderDrawer.status}
                    onChange={(e) => {
                      updateOrderStatus(selectedOrderDrawer.id, e.target.value);
                      setSelectedOrderDrawer((prev) => ({ ...prev, status: e.target.value }));
                      showToast(`Order status updated to ${e.target.value}`);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#0C419C] text-white text-xs font-bold border border-[#C5A059]/50 focus:outline-none cursor-pointer"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Kitchen Prepping">Kitchen Prepping</option>
                    <option value="Ready for Collection">Ready for Collection</option>
                    <option value="Collected">Collected</option>
                  </select>
                </div>

                {/* Customer Details */}
                <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-2 text-xs">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#F3E5AB] font-bold block">
                    Customer Information
                  </span>
                  <div className="flex justify-between">
                    <span className="text-white/50">Name:</span>
                    <span className="font-bold text-white">{selectedOrderDrawer.customer?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Mobile / WhatsApp:</span>
                    <span className="font-mono text-white">{selectedOrderDrawer.customer?.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Pickup Slot:</span>
                    <span className="text-[#F3E5AB] font-bold">{selectedOrderDrawer.customer?.slot}</span>
                  </div>
                  {selectedOrderDrawer.customer?.isBulkOrder && selectedOrderDrawer.customer?.address && (
                    <div className="pt-2 border-t border-white/10">
                      <span className="text-white/50 block mb-0.5">Bulk Delivery Address:</span>
                      <span className="text-white font-medium">{selectedOrderDrawer.customer.address}</span>
                    </div>
                  )}
                </div>

                {/* Courier / Instruction Callout */}
                {selectedOrderDrawer.customer?.note && (
                  <div className="p-3.5 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-xs text-amber-200">
                    <strong className="block text-[10px] font-mono uppercase tracking-wider mb-1">
                      Customer Handover Note:
                    </strong>
                    <p className="italic leading-relaxed">&ldquo;{selectedOrderDrawer.customer.note}&rdquo;</p>
                  </div>
                )}

                {/* Itemized Bakes */}
                <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#F3E5AB] font-bold block">
                    Itemized Artisanal Bakes
                  </span>
                  <div className="space-y-2">
                    {selectedOrderDrawer.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs">
                        <span className="text-white">
                          • {item.name} <span className="text-white/50 font-mono">({item.weight}) x{item.quantity}</span>
                        </span>
                        <span className="font-mono text-white/80">
                          ₹{(item.price || 0) * (item.quantity || 1)}
                        </span>
                      </div>
                    ))}

                    {selectedOrderDrawer.packagingFee > 0 && (
                      <div className="flex justify-between text-xs text-[#C5A059]">
                        <span>🎁 Luxury Gift Ribbon &amp; Box</span>
                        <span className="font-mono">₹{selectedOrderDrawer.packagingFee}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-white/10 flex justify-between items-baseline font-bold text-sm">
                    <span className="text-white/80">Total Amount</span>
                    <span className="font-heading text-xl text-[#F3E5AB]">
                      ₹{selectedOrderDrawer.finalTotal?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Drawer Actions Footer */}
              <div className="p-6 border-t border-white/10 bg-[#07132B] space-y-2">
                <button
                  type="button"
                  onClick={() => setSelectedNotificationOrder(selectedOrderDrawer)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <span>Dispatch WhatsApp Notification</span>
                  <MessageSquare className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedOrderDrawer(null)}
                  className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all cursor-pointer"
                >
                  Close Ticket
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 4. CUSTOMER PROFILE DOSSIER DRAWER                                        */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedCustomerDossier && (
          <CustomerDrawer
            customer={selectedCustomerDossier}
            orders={orders}
            onClose={() => setSelectedCustomerDossier(null)}
            onSelectOrder={(ord) => {
              setSelectedCustomerDossier(null);
              setSelectedOrderDrawer(ord);
            }}
          />
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 5. NEW WALK-IN / PHONE ORDER MODAL                                        */}
      {/* ========================================================================= */}
      <NewOrderModal
        isOpen={isNewOrderModalOpen}
        onClose={() => setIsNewOrderModalOpen(false)}
        onOrderCreated={(createdOrder) => {
          showToast(`Order #${createdOrder.id} logged in CRM pipeline!`);
        }}
      />

      {/* ========================================================================= */}
      {/* 6. PRODUCT / SEASONAL DROP EDITOR MODAL                                   */}
      {/* ========================================================================= */}
      {isEditorOpen && (
        <ProductEditorModal
          product={editingProduct}
          onSave={(savedProduct) => {
            if (editingProduct) {
              updateProduct(editingProduct.id, savedProduct);
              showToast(`Updated "${savedProduct.name}"`);
            } else {
              addProduct(savedProduct);
              showToast(`Added "${savedProduct.name}" to menu`);
            }
            setIsEditorOpen(false);
            setEditingProduct(null);
          }}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingProduct(null);
          }}
        />
      )}

      {/* ========================================================================= */}
      {/* 7. ADD REVIEW MODAL                                                       */}
      {/* ========================================================================= */}
      {isAddReviewOpen && (
        <div className="fixed inset-0 z-[260] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-[#091B3E] border-2 border-[#C5A059]/70 rounded-3xl p-6 text-white space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h4 className="font-heading text-lg font-bold text-white">
                Add Client Testimonial
              </h4>
              <button
                type="button"
                onClick={() => setIsAddReviewOpen(false)}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-white/70 mb-1">Customer Name</label>
                <input
                  type="text"
                  value={newReviewForm.name}
                  onChange={(e) =>
                    setNewReviewForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g. Priya Somaiya"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1">Cookie / Gift Box Mentioned</label>
                <input
                  type="text"
                  value={newReviewForm.cookie}
                  onChange={(e) =>
                    setNewReviewForm((prev) => ({ ...prev, cookie: e.target.value }))
                  }
                  placeholder="e.g. Triple Chocolate Overload"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1">Star Rating</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setNewReviewForm((prev) => ({ ...prev, stars: s }))}
                      className={`text-xl cursor-pointer ${
                        s <= newReviewForm.stars ? 'text-amber-400' : 'text-stone-600'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white/70 mb-1">Review Quote / Comment</label>
                <textarea
                  rows={3}
                  value={newReviewForm.comment}
                  onChange={(e) =>
                    setNewReviewForm((prev) => ({ ...prev, comment: e.target.value }))
                  }
                  placeholder="Paste comment from Instagram DM, WhatsApp, or Tasting..."
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white focus:outline-none focus:border-[#C5A059] resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsAddReviewOpen(false)}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!newReviewForm.name || !newReviewForm.comment) return;
                  addReview(newReviewForm);
                  setIsAddReviewOpen(false);
                  setNewReviewForm({ name: '', cookie: '', stars: 5, comment: '' });
                  showToast('Customer review added successfully.');
                }}
                className="px-4 py-2 rounded-xl bg-[#C5A059] hover:bg-[#D4B86A] text-stone-950 font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Save Review
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* 8. INSTANT NOTIFICATION DISPATCH MODAL */}
      <NotificationModal
        isOpen={Boolean(selectedNotificationOrder)}
        order={selectedNotificationOrder}
        onClose={() => setSelectedNotificationOrder(null)}
        onUpdateStatus={(orderId, newStatus) => {
          updateOrderStatus(orderId, newStatus);
          showToast(`Order #${orderId} moved to ${newStatus}`);
        }}
        showToast={showToast}
      />
    </div>
  );
}
