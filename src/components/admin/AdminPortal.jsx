import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Cookie,
  TrendingUp,
  Phone,
  MessageSquare,
  CheckCircle2,
  Clock,
  Search,
  Plus,
  X,
  Lock,
  Trash2,
  Edit3,
  Sliders,
  Download,
  ExternalLink,
  Sparkles,
  Flame,
  Star,
  Check,
} from 'lucide-react';
import { useMenu } from '../../context/MenuContext';
import ProductEditorModal from './ProductEditorModal';
import NewOrderModal from './NewOrderModal';
import NotificationModal from './NotificationModal';

export default function AdminPortal({ onClose }) {
  const {
    products,
    storeConfig,
    orders,
    reviews,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductAvailability,
    updateStoreConfig,
    updateOrderStatus,
    deleteOrder,
    deleteReview,
    changePin,
  } = useMenu();

  // 4 Core Tabs: 'orders' | 'menu' | 'overview' | 'settings'
  const [activeTab, setActiveTab] = useState('orders');

  // Modals
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [selectedNotificationOrder, setSelectedNotificationOrder] = useState(null);

  // Orders Filters
  const [orderFilter, setOrderFilter] = useState('all'); // 'all' | 'pending' | 'prepping' | 'ready' | 'collected'
  const [searchQuery, setSearchQuery] = useState('');

  // Settings PIN Change State
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinMessage, setPinMessage] = useState({ text: '', isError: false });

  // Toast Notification
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Lock & Sign Out
  const handleLockStudio = () => {
    sessionStorage.removeItem('sukie_admin_auth');
    onClose();
  };

  // Order Counts
  const orderCounts = useMemo(() => {
    return {
      all: orders.length,
      pending: orders.filter((o) => (o.status || 'Pending').toLowerCase().includes('pending')).length,
      prepping: orders.filter((o) => (o.status || '').toLowerCase().includes('prep')).length,
      ready: orders.filter((o) => (o.status || '').toLowerCase().includes('ready')).length,
      collected: orders.filter((o) => (o.status || '').toLowerCase().includes('collect')).length,
    };
  }, [orders]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const status = (order.status || 'Pending').toLowerCase();
      if (orderFilter === 'pending' && !status.includes('pending')) return false;
      if (orderFilter === 'prepping' && !status.includes('prep')) return false;
      if (orderFilter === 'ready' && !status.includes('ready')) return false;
      if (orderFilter === 'collected' && !status.includes('collect')) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = (order.id || '').toLowerCase().includes(q);
        const matchesName = (order.customer?.name || '').toLowerCase().includes(q);
        const matchesPhone = (order.customer?.phone || '').includes(q);
        const matchesItem = (order.items || []).some((it) => it.name.toLowerCase().includes(q));
        return matchesId || matchesName || matchesPhone || matchesItem;
      }
      return true;
    });
  }, [orders, orderFilter, searchQuery]);

  // Simple Analytics
  const analytics = useMemo(() => {
    const totalRev = orders.reduce((sum, o) => sum + (o.finalTotal || o.totalPrice || 0), 0);
    const totalUnits = orders.reduce((sum, o) => sum + (o.totalItems || 0), 0);

    const flavorCounts = {};
    orders.forEach((o) => {
      (o.items || []).forEach((item) => {
        flavorCounts[item.name] = (flavorCounts[item.name] || 0) + (item.quantity || 1);
      });
    });

    const topFlavors = Object.entries(flavorCounts)
      .map(([name, units]) => ({ name, units }))
      .sort((a, b) => b.units - a.units)
      .slice(0, 5);

    return { totalRev, totalUnits, topFlavors };
  }, [orders]);

  // Export CSV
  const handleExportCSV = () => {
    if (orders.length === 0) {
      showToast('No orders to export.');
      return;
    }
    const headers = ['Order ID', 'Date', 'Time', 'Customer Name', 'Phone', 'Slot', 'Items', 'Total Amount', 'Status'];
    const rows = orders.map((o) => [
      `"${o.id}"`,
      `"${o.date || ''}"`,
      `"${o.time || ''}"`,
      `"${o.customer?.name || ''}"`,
      `"${o.customer?.phone || ''}"`,
      `"${o.customer?.slot || ''}"`,
      `"${(o.items || []).map((i) => `${i.name} (x${i.quantity})`).join(', ')}"`,
      `"${o.finalTotal || o.totalPrice || 0}"`,
      `"${o.status || 'Pending'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sukie_orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Orders CSV downloaded.');
  };

  // Helper for quick next status
  const advanceOrderStatus = (order) => {
    const status = (order.status || 'Pending').toLowerCase();
    if (status.includes('pending')) {
      updateOrderStatus(order.id, 'Kitchen Prepping');
      showToast(`Order #${order.id} moved to In The Ovens ♨`);
    } else if (status.includes('prep')) {
      updateOrderStatus(order.id, 'Ready for Collection');
      showToast(`Order #${order.id} Boxed & Ready for Pickup ✓`);
    } else if (status.includes('ready')) {
      updateOrderStatus(order.id, 'Collected');
      showToast(`Order #${order.id} completed & handed over 🤝`);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] bg-[#07132B] text-stone-100 font-sans overflow-y-auto">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-[400] bg-gradient-to-r from-[#C5A059] to-[#E5C77F] text-stone-950 font-bold px-5 py-2.5 rounded-full shadow-2xl text-xs flex items-center gap-2 border border-white/40 tracking-wide"
          >
            <Sparkles className="w-4 h-4 fill-stone-950" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* UNCLUTTERED, ELEGANT STICKY HEADER                                        */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-[#07132B]/95 backdrop-blur-xl border-b border-[#C5A059]/20 px-4 sm:px-8 py-3.5 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl p-0.5 bg-gradient-to-b from-[#F3E5AB] via-[#C5A059] to-[#8C6D2B] shadow-md shrink-0">
                <img
                  src="/images/logo.png"
                  alt="Sukié Logo"
                  className="w-full h-full rounded-[10px] object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-heading font-bold text-base text-white tracking-wide leading-none">
                    Sukié Atelier
                  </h1>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                </div>
                <span className="text-[10px] text-[#C5A059] font-mono tracking-widest uppercase">
                  Founder Studio
                </span>
              </div>
            </div>

            {/* Mobile Exit Button */}
            <button
              type="button"
              onClick={onClose}
              className="md:hidden p-2 rounded-xl bg-white/10 text-white/80 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tab Pills */}
          <nav className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#030B1C]/80 border border-white/10 overflow-x-auto max-w-full no-scrollbar">
            {[
              {
                id: 'orders',
                label: 'Orders',
                icon: ShoppingBag,
                badge: orderCounts.pending > 0 ? `${orderCounts.pending} New` : null,
              },
              {
                id: 'menu',
                label: 'Menu & Drops',
                icon: Cookie,
                badge: `${products.length}`,
              },
              {
                id: 'overview',
                label: 'Overview',
                icon: TrendingUp,
              },
              {
                id: 'settings',
                label: 'Settings',
                icon: Sliders,
              },
            ].map((tab) => {
              const active = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                    active
                      ? 'bg-[#C5A059] text-stone-950 font-bold shadow-md'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-stone-950' : 'text-[#C5A059]'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                        active ? 'bg-stone-950 text-[#F3E5AB]' : 'bg-white/10 text-white/80'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Status Switch & Exit Studio */}
          <div className="hidden md:flex items-center gap-3">
            {/* Storefront Mode Switch */}
            <button
              type="button"
              onClick={() => {
                const updated = !storeConfig.isComingSoon;
                updateStoreConfig({ isComingSoon: updated });
                showToast(updated ? 'Switched to Coming Soon Teaser' : 'Switched to Live Storefront');
              }}
              className={`px-3 py-1.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                storeConfig.isComingSoon
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${storeConfig.isComingSoon ? 'bg-amber-400' : 'bg-emerald-400'}`} />
              <span>{storeConfig.isComingSoon ? 'Teaser Mode' : 'Store Live'}</span>
            </button>

            {/* Exit Studio Button */}
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer border border-white/10"
            >
              <X className="w-3.5 h-3.5" />
              <span>Exit</span>
            </button>
          </div>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* SPACIOUS, EASY-TO-SCROLL MAIN CONTAINER                                  */}
      {/* ========================================================================= */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-28 sm:pb-20 space-y-8">

        {/* ======================================================================= */}
        {/* TAB 1: ORDERS (THE DAILY WORKSPACE)                                     */}
        {/* ======================================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            
            {/* Orders Header & Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[#091A3E]/80 border border-white/10 shadow-lg">
              <div>
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-wide">
                  Customer Orders
                </h2>
                <p className="text-xs text-white/60 mt-0.5">
                  Track pickups, oven preparation, and send WhatsApp notifications with one click.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewOrderModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#E5C77F] text-stone-950 font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-110 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Log Walk-in Order</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all cursor-pointer border border-white/10"
                  title="Download CSV"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter Pills & Search Input */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Status Filter Chips */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {[
                  { id: 'all', label: 'All Orders', count: orderCounts.all },
                  { id: 'pending', label: 'Awaiting Ovens', count: orderCounts.pending, color: 'text-amber-400' },
                  { id: 'prepping', label: 'In Ovens (160°C)', count: orderCounts.prepping, color: 'text-blue-400' },
                  { id: 'ready', label: 'Ready for Pickup', count: orderCounts.ready, color: 'text-emerald-400' },
                  { id: 'collected', label: 'Completed', count: orderCounts.collected, color: 'text-stone-400' },
                ].map((f) => {
                  const isCurrent = orderFilter === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setOrderFilter(f.id)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                        isCurrent
                          ? 'bg-[#C5A059] text-stone-950 font-bold shadow-md'
                          : 'bg-[#091A3E] text-white/70 hover:text-white border border-white/10'
                      }`}
                    >
                      <span>{f.label}</span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                          isCurrent ? 'bg-stone-950 text-[#F3E5AB]' : 'bg-white/10 text-white/70'
                        }`}
                      >
                        {f.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search Box */}
              <div className="relative min-w-[260px] md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name, phone, or #ID..."
                  className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#091A3E] border border-white/15 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#C5A059]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-white/50 hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Orders Cards Stack */}
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-[#091A3E]/40 border border-white/10 space-y-2">
                <ShoppingBag className="w-10 h-10 mx-auto text-white/30" />
                <h3 className="font-heading text-lg font-bold text-white">No Orders Found</h3>
                <p className="text-xs text-white/50">There are no orders matching this status or search query.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const status = order.status || 'Pending';
                  const isPending = status.toLowerCase().includes('pending');
                  const isPrepping = status.toLowerCase().includes('prep');
                  const isReady = status.toLowerCase().includes('ready');
                  const isCollected = status.toLowerCase().includes('collect');

                  return (
                    <div
                      key={order.id}
                      className="p-5 sm:p-6 rounded-3xl bg-[#091A3E] border border-white/10 hover:border-[#C5A059]/40 transition-all shadow-md space-y-4"
                    >
                      {/* Card Header Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                        <div className="flex items-center gap-3">
                          <span className="font-heading font-black text-lg text-[#F3E5AB] tracking-wide">
                            #{order.id}
                          </span>
                          <span className="text-xs text-white/45 font-mono">
                            {order.date || 'Today'} • {order.time || 'Recent'}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 self-start sm:self-auto">
                          {/* Live Status Pill */}
                          <select
                            value={status}
                            onChange={(e) => {
                              updateOrderStatus(order.id, e.target.value);
                              showToast(`Order #${order.id} moved to ${e.target.value}`);
                            }}
                            className={`px-3 py-1 rounded-full text-xs font-bold border focus:outline-none cursor-pointer ${
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
                            <option value="Kitchen Prepping" className="bg-[#091A3E] text-white">In Ovens (160°C)</option>
                            <option value="Ready for Collection" className="bg-[#091A3E] text-white">Ready for Pickup</option>
                            <option value="Collected" className="bg-[#091A3E] text-white">Handed Over</option>
                          </select>

                          <span className="font-heading text-lg font-bold text-white font-mono">
                            ₹{(order.finalTotal || order.totalPrice || 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* Customer Details & Pickup Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        {/* Customer */}
                        <div className="p-3.5 rounded-2xl bg-black/30 border border-white/5 space-y-1.5">
                          <span className="text-[10px] font-mono text-[#C5A059] uppercase tracking-wider block font-bold">
                            Customer Details
                          </span>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-white">
                              {order.customer?.name || 'Customer'}
                            </span>
                            <div className="flex items-center gap-2">
                              {order.customer?.phone && (
                                <>
                                  <a
                                    href={`tel:${order.customer.phone}`}
                                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                                    title="Call Customer"
                                  >
                                    <Phone className="w-3.5 h-3.5" />
                                  </a>
                                  <a
                                    href={`https://wa.me/91${order.customer.phone.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white transition-colors"
                                    title="WhatsApp Customer"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5" />
                                  </a>
                                </>
                              )}
                            </div>
                          </div>
                          <span className="text-white/60 font-mono block">
                            Phone: {order.customer?.phone || 'Not provided'}
                          </span>
                          <span className="text-white/40 font-mono text-[11px] block">
                            Payment: {order.customer?.paymentMethod?.toUpperCase() || 'UPI'} Paid
                          </span>
                        </div>

                        {/* Pickup Slot & Notes */}
                        <div className="p-3.5 rounded-2xl bg-black/30 border border-white/5 space-y-1.5">
                          <span className="text-[10px] font-mono text-[#C5A059] uppercase tracking-wider block font-bold">
                            Collection Slot &amp; Instructions
                          </span>
                          <div className="flex items-center gap-1.5 text-white font-medium">
                            <Clock className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                            <span>{order.customer?.slot || 'Today Evening (5:00 PM – 8:00 PM)'}</span>
                          </div>
                          <p className="text-[11px] text-white/50 font-mono">
                            Hub: Vikhroli East Atelier (Pickups Only)
                          </p>
                          {order.customer?.note && (
                            <p className="text-[11px] text-amber-200/90 italic bg-amber-500/10 p-1.5 rounded-lg border border-amber-400/20">
                              Note: &ldquo;{order.customer.note}&rdquo;
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Items Pills */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider block">
                          Ordered Cookies ({order.totalItems || order.items?.length || 0} total)
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {(order.items || []).map((it, idx) => (
                            <div
                              key={idx}
                              className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 flex items-center gap-2 text-xs"
                            >
                              <span className="text-white font-medium">{it.name}</span>
                              <span className="text-[10px] text-white/50 font-mono">({it.weight || '170g'})</span>
                              <span className="px-1.5 py-0.2 rounded bg-[#C5A059] text-stone-950 font-mono font-bold text-[10px]">
                                x{it.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Row */}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/10">
                        {/* Status Advancement Button */}
                        {!isCollected ? (
                          <button
                            type="button"
                            onClick={() => advanceOrderStatus(order)}
                            className="px-4 py-2 rounded-xl bg-[#0C419C] hover:bg-[#1B3A8C] border border-[#C5A059]/40 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                          >
                            {isPending && <span>Start Baking ♨</span>}
                            {isPrepping && <span>Mark Ready for Pickup ✓</span>}
                            {isReady && <span>Complete Handover 🤝</span>}
                          </button>
                        ) : (
                          <span className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>Order Fulfilled</span>
                          </span>
                        )}

                        <div className="flex items-center gap-2">
                          {/* Send WhatsApp Notification */}
                          <button
                            type="button"
                            onClick={() => setSelectedNotificationOrder(order)}
                            className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Notify Customer</span>
                          </button>

                          {/* Delete Order (for test or cancellations) */}
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete order #${order.id}?`)) {
                                deleteOrder(order.id);
                                showToast(`Order #${order.id} deleted.`);
                              }
                            }}
                            className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 transition-all cursor-pointer"
                            title="Delete Order"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

        {/* ======================================================================= */}
        {/* TAB 2: MENU & DROPS (QUARTERLY 3-MONTH DROP STUDIO)                    */}
        {/* ======================================================================= */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[#091A3E]/80 border border-white/10 shadow-lg">
              <div>
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-wide">
                  Quarterly Menu Drops
                </h2>
                <p className="text-xs text-white/60 mt-0.5">
                  Update cookie photos, names, prices, descriptions, and toggle stock availability in real time.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setIsEditorOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#E5C77F] text-stone-950 font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-110 transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shrink-0"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Add New Cookie Drop</span>
              </button>
            </div>

            {/* Cookie Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((product) => {
                const isAvailable = product.available !== false;

                return (
                  <div
                    key={product.id}
                    className={`rounded-3xl overflow-hidden bg-[#091A3E] border transition-all shadow-lg flex flex-col justify-between ${
                      isAvailable ? 'border-white/10 hover:border-[#C5A059]/50' : 'border-stone-800 opacity-75'
                    }`}
                  >
                    {/* Cookie Image with Availability Badge */}
                    <div className="relative h-48 w-full bg-stone-900 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#091A3E] via-transparent to-black/30" />

                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[#C5A059] text-[10px] font-mono font-bold uppercase tracking-wider border border-[#C5A059]/30">
                          {product.category || 'Drop'}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3">
                        <button
                          type="button"
                          onClick={() => {
                            toggleProductAvailability(product.id);
                            showToast(`${product.name} marked as ${isAvailable ? 'Sold Out' : 'In Stock'}`);
                          }}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider shadow-md cursor-pointer transition-all ${
                            isAvailable
                              ? 'bg-emerald-500 text-stone-950 hover:bg-emerald-400'
                              : 'bg-red-500/80 text-white hover:bg-red-500'
                          }`}
                        >
                          {isAvailable ? 'In Stock ✓' : 'Sold Out ✕'}
                        </button>
                      </div>

                      <div className="absolute bottom-2 left-3 text-[10px] font-mono text-white/70">
                        {product.weight || '170g (6oz)'}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-baseline justify-between gap-2">
                          <h3 className="font-heading font-bold text-lg text-white leading-tight">
                            {product.name}
                          </h3>
                          <span className="font-heading font-bold text-lg text-[#F3E5AB]">
                            ₹{product.price}
                          </span>
                        </div>
                        <p className="text-xs text-white/60 line-clamp-2 mt-1.5 leading-relaxed">
                          {product.shortDesc || product.description || 'NYC style giant molten cookie.'}
                        </p>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProduct(product);
                            setIsEditorOpen(true);
                          }}
                          className="flex-1 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-white/10"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>Edit Details &amp; Photo</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete "${product.name}" from menu?`)) {
                              deleteProduct(product.id);
                              showToast(`Removed "${product.name}"`);
                            }
                          }}
                          className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 transition-all cursor-pointer"
                          title="Delete Cookie"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 3: OVERVIEW (CLEAN & SIMPLE NUMBERS)                                */}
        {/* ======================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Header */}
            <div className="p-5 rounded-3xl bg-[#091A3E]/80 border border-white/10 shadow-lg">
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-wide">
                Atelier Sales Overview
              </h2>
              <p className="text-xs text-white/60 mt-0.5">
                Quick numbers on your cafe&apos;s revenue and popular cookie drops.
              </p>
            </div>

            {/* 3 Large, Clean Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-6 rounded-3xl bg-[#091A3E] border border-[#C5A059]/40 shadow-xl space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[#C5A059] block font-bold">
                  Total Gross Revenue
                </span>
                <span className="font-heading text-3xl sm:text-4xl font-bold text-white block">
                  ₹{analytics.totalRev.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-white/50 font-mono block">
                  Across {orders.length} total orders
                </span>
              </div>

              <div className="p-6 rounded-3xl bg-[#091A3E] border border-white/10 shadow-xl space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-blue-300 block font-bold">
                  Total Orders Logged
                </span>
                <span className="font-heading text-3xl sm:text-4xl font-bold text-white block">
                  {orders.length}
                </span>
                <span className="text-[11px] text-amber-300 font-mono block">
                  {orderCounts.pending} awaiting ovens
                </span>
              </div>

              <div className="p-6 rounded-3xl bg-[#091A3E] border border-white/10 shadow-xl space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-300 block font-bold">
                  170g Giant Cookies Baked
                </span>
                <span className="font-heading text-3xl sm:text-4xl font-bold text-white block">
                  {analytics.totalUnits}
                </span>
                <span className="text-[11px] text-white/50 font-mono block">
                  ~{(analytics.totalUnits * 0.17).toFixed(1)} kg dough crafted
                </span>
              </div>
            </div>

            {/* Top Demanded Flavors List */}
            <div className="p-6 rounded-3xl bg-[#091A3E] border border-white/10 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="font-heading text-lg font-bold text-white">
                  Most Demanded Cookie Drops
                </h3>
                <span className="text-xs font-mono text-white/50">Ranked by volume</span>
              </div>

              <div className="space-y-3">
                {analytics.topFlavors.map((flavor, idx) => (
                  <div
                    key={flavor.name}
                    className="p-4 rounded-2xl bg-black/30 border border-white/5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-xl bg-[#C5A059] text-stone-950 font-mono text-xs font-bold flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <span className="font-bold text-white text-sm">{flavor.name}</span>
                    </div>

                    <span className="font-mono font-bold text-[#F3E5AB] text-sm">
                      {flavor.units} units sold
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB 4: SETTINGS & REVIEWS                                               */}
        {/* ======================================================================= */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            
            {/* Header */}
            <div className="p-5 rounded-3xl bg-[#091A3E]/80 border border-white/10 shadow-lg">
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-wide">
                Atelier Settings &amp; Reviews
              </h2>
              <p className="text-xs text-white/60 mt-0.5">
                Configure your public storefront status, change your admin access PIN, and manage customer reviews.
              </p>
            </div>

            {/* Storefront Mode Card */}
            <div className="p-6 rounded-3xl bg-[#091A3E] border border-white/10 shadow-xl space-y-4">
              <h3 className="font-heading text-lg font-bold text-white">
                Website Display Mode
              </h3>
              <p className="text-xs text-white/60">
                Choose whether visitors see the live ordering menu or the luxury Coming Soon launch teaser.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    updateStoreConfig({ isComingSoon: false });
                    showToast('Website is now LIVE for public orders!');
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex-1 ${
                    !storeConfig.isComingSoon
                      ? 'bg-emerald-500/15 border-emerald-400 text-white'
                      : 'bg-black/30 border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  <span className="font-bold text-sm block mb-1">🛍️ Public Live Storefront</span>
                  <span className="text-xs text-white/60 block">
                    Customers can browse drops, build their box, and place orders.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    updateStoreConfig({ isComingSoon: true });
                    showToast('Website is now showing Coming Soon Teaser.');
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex-1 ${
                    storeConfig.isComingSoon
                      ? 'bg-amber-500/15 border-amber-400 text-white'
                      : 'bg-black/30 border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  <span className="font-bold text-sm block mb-1">⏳ Coming Soon Teaser Mode</span>
                  <span className="text-xs text-white/60 block">
                    Displays the private VIP waitlist and launch countdown.
                  </span>
                </button>
              </div>
            </div>

            {/* Change Admin PIN Card */}
            <div className="p-6 rounded-3xl bg-[#091A3E] border border-white/10 shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#C5A059]" />
                <h3 className="font-heading text-lg font-bold text-white">
                  Change Admin Studio PIN
                </h3>
              </div>
              <p className="text-xs text-white/60">
                Update the 4-digit PIN used to access this admin panel. (Default is 8467).
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md pt-1">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-white/60 mb-1">
                    New 4-Digit PIN
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 8467"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-center font-mono text-base tracking-widest text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-white/60 mb-1">
                    Confirm PIN
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="Repeat PIN"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/20 text-center font-mono text-base tracking-widest text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              {pinMessage.text && (
                <p className={`text-xs ${pinMessage.isError ? 'text-red-400' : 'text-emerald-400'}`}>
                  {pinMessage.text}
                </p>
              )}

              <button
                type="button"
                onClick={() => {
                  if (newPin.length !== 4) {
                    setPinMessage({ text: 'PIN must be exactly 4 digits.', isError: true });
                    return;
                  }
                  if (newPin !== confirmPin) {
                    setPinMessage({ text: 'PINs do not match.', isError: true });
                    return;
                  }
                  changePin(newPin);
                  setNewPin('');
                  setConfirmPin('');
                  setPinMessage({ text: 'PIN updated successfully!', isError: false });
                  showToast('Admin PIN updated.');
                }}
                className="px-5 py-2 rounded-xl bg-[#C5A059] hover:bg-[#D4B86A] text-stone-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Save New PIN
              </button>
            </div>

            {/* Customer Reviews Moderation */}
            <div className="p-6 rounded-3xl bg-[#091A3E] border border-white/10 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <h3 className="font-heading text-lg font-bold text-white">
                    Customer Tasting Reviews
                  </h3>
                  <p className="text-xs text-white/60">
                    Reviews submitted by customers on sukiecookies.com
                  </p>
                </div>
                <span className="text-xs font-mono text-[#C5A059]">{reviews.length} reviews</span>
              </div>

              {reviews.length === 0 ? (
                <p className="text-xs text-white/40 italic">No customer reviews yet.</p>
              ) : (
                <div className="space-y-3">
                  {reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-2xl bg-black/30 border border-white/5 flex items-start justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs">{rev.name}</span>
                          <span className="text-[10px] text-amber-400 font-mono">
                            {'★'.repeat(rev.stars || 5)}
                          </span>
                          {rev.cookie && (
                            <span className="text-[10px] text-white/50 font-mono">• {rev.cookie}</span>
                          )}
                        </div>
                        <p className="text-xs text-white/80 leading-relaxed font-light">
                          &ldquo;{rev.comment}&rdquo;
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm('Delete this review?')) {
                            deleteReview(rev.id);
                            showToast('Review removed.');
                          }
                        }}
                        className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer shrink-0"
                        title="Delete review"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Lock & Log Out */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleLockStudio}
                className="px-5 py-2.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-200 border border-red-800/40 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Lock &amp; Exit Admin Studio</span>
              </button>
            </div>

          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* MODALS                                                                    */}
      {/* ========================================================================= */}
      {/* 1. Walk-in Order Modal */}
      <NewOrderModal
        isOpen={isNewOrderModalOpen}
        onClose={() => setIsNewOrderModalOpen(false)}
        onOrderCreated={(createdOrder) => {
          showToast(`Order #${createdOrder.id} logged!`);
        }}
      />

      {/* 2. Product / Seasonal Drop Editor Modal */}
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

      {/* 3. Instant WhatsApp Notification Modal */}
      <NotificationModal
        isOpen={Boolean(selectedNotificationOrder)}
        order={selectedNotificationOrder}
        onClose={() => setSelectedNotificationOrder(null)}
        onUpdateStatus={(orderId, newStatus) => {
          updateOrderStatus(orderId, newStatus);
        }}
        showToast={showToast}
      />
    </div>
  );
}
