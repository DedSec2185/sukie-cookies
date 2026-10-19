import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { menuData } from '../data/menuData';

const MenuContext = createContext();

const STORAGE_KEYS = {
  MENU: 'sukie_custom_menu',
  CONFIG: 'sukie_store_config',
  REVIEWS: 'sukie_custom_reviews',
  ORDERS: 'sukie_orders',
  INQUIRIES: 'sukie_bulk_inquiries',
  AUTH: 'sukie_admin_auth',
};

// Rich realistic bakery orders seed for immediate enterprise CRM data analysis
const INITIAL_DEMO_ORDERS = [
  {
    id: 'SUK-4921',
    customer: {
      name: 'Ananya Sharma',
      phone: '9820145892',
      email: 'ananya.s@gmail.com',
      slot: 'Today Evening (5:00 PM – 8:00 PM)',
      note: 'Sending Dunzo courier for pickup at 6 PM sharp',
      paymentMethod: 'upi',
      isBulkOrder: false,
    },
    items: [
      { id: 1, name: 'Triple Chocolate Overload', price: 299, weight: '170g (6oz)', quantity: 2 },
      { id: 3, name: 'Pistachio White Gianduja', price: 349, weight: '170g (6oz)', quantity: 2 },
    ],
    totalItems: 4,
    totalPrice: 1296,
    packagingFee: 49,
    finalTotal: 1345,
    status: 'Ready for Collection',
    channel: 'courier',
    deliveryArea: 'Vikhroli Atelier (Pickup)',
    date: '27 Sep 2026',
    time: '11:30 AM',
  },
  {
    id: 'SUK-3814',
    customer: {
      name: 'Kabir Mehta',
      phone: '9819234812',
      email: 'kabir.m@mehtacap.com',
      slot: 'Today Evening (5:00 PM – 8:00 PM)',
      note: 'Please add birthday ribbon note for Rhea',
      paymentMethod: 'cod',
      isBulkOrder: false,
    },
    items: [
      { id: 2, name: 'Gooey Two-Chip', price: 279, weight: '170g (6oz)', quantity: 2 },
      { id: 4, name: "Cupid's Ruby Chocolate", price: 379, weight: '170g (6oz)', quantity: 1 },
      { id: 5, name: 'Popcorn Praliné Toffee', price: 349, weight: '170g (6oz)', quantity: 1 },
    ],
    totalItems: 4,
    totalPrice: 1286,
    packagingFee: 49,
    finalTotal: 1335,
    status: 'Kitchen Prepping',
    channel: 'pickup',
    deliveryArea: 'Vikhroli Atelier (Pickup)',
    date: '27 Sep 2026',
    time: '01:15 PM',
  },
  {
    id: 'SUK-5102',
    customer: {
      name: 'Tara Shroff',
      phone: '9820011928',
      email: 'tara.shroff@studio.in',
      slot: 'Today Evening (5:00 PM – 8:00 PM)',
      note: 'Customer will collect personally at 7 PM',
      paymentMethod: 'upi',
      isBulkOrder: false,
    },
    items: [
      { id: 1, name: 'Triple Chocolate Overload', price: 299, weight: '170g (6oz)', quantity: 3 },
      { id: 3, name: 'Pistachio White Gianduja', price: 349, weight: '170g (6oz)', quantity: 3 },
    ],
    totalItems: 6,
    totalPrice: 1944,
    packagingFee: 49,
    finalTotal: 1993,
    status: 'Kitchen Prepping',
    channel: 'pickup',
    deliveryArea: 'Vikhroli Atelier (Pickup)',
    date: '27 Sep 2026',
    time: '02:45 PM',
  },
  {
    id: 'SUK-5088',
    customer: {
      name: 'Devendra Parekh',
      phone: '9833409182',
      email: 'd.parekh@godrejgroup.com',
      slot: 'Tomorrow Morning (11:00 AM – 2:00 PM)',
      note: 'Executive meeting hospitality. Hand over to Reception Tower 4.',
      paymentMethod: 'upi',
      isBulkOrder: true,
      address: 'Tower 4, Executive Floor, Godrej One, Vikhroli East, Mumbai',
    },
    items: [
      { id: 7, name: 'The Royal Assorted Gift Box (4 Pack)', price: 1199, weight: '680g (4x 170g)', quantity: 8 },
      { id: 1, name: 'Triple Chocolate Overload', price: 299, weight: '170g (6oz)', quantity: 8 },
    ],
    totalItems: 16,
    totalPrice: 11984,
    packagingFee: 0,
    finalTotal: 11984,
    status: 'Pending',
    channel: 'bulk',
    deliveryArea: 'Vikhroli Atelier (Pickup)',
    date: '27 Sep 2026',
    time: '03:10 PM',
  },
  {
    id: 'SUK-2719',
    customer: {
      name: 'Pooja Singhania',
      phone: '9930481290',
      email: 'pooja.singhania@apex.com',
      slot: 'Tomorrow Morning (11:00 AM – 2:00 PM)',
      note: 'Corporate client gifting with festive sleeves',
      paymentMethod: 'upi',
      isBulkOrder: true,
      address: 'Floor 12, Maker Chambers V, Nariman Point, Mumbai',
    },
    items: [
      { id: 7, name: 'The Royal Assorted Gift Box (4 Pack)', price: 1199, weight: '680g (4x 170g)', quantity: 4 },
      { id: 1, name: 'Triple Chocolate Overload', price: 299, weight: '170g (6oz)', quantity: 4 },
    ],
    totalItems: 8,
    totalPrice: 5992,
    packagingFee: 0,
    finalTotal: 5992,
    status: 'Pending',
    channel: 'bulk',
    deliveryArea: 'Vikhroli Atelier (Pickup)',
    date: '26 Sep 2026',
    time: '04:45 PM',
  },
  {
    id: 'SUK-4612',
    customer: {
      name: 'Siddharth Roy',
      phone: '9820556712',
      email: 'siddharth@rediffmail.com',
      slot: 'Tomorrow Evening (5:00 PM – 8:00 PM)',
      note: 'Arranging Porter two-wheeler courier at 5:30 PM',
      paymentMethod: 'upi',
      isBulkOrder: false,
    },
    items: [
      { id: 1, name: 'Triple Chocolate Overload', price: 299, weight: '170g (6oz)', quantity: 2 },
      { id: 5, name: 'Popcorn Praliné Toffee', price: 349, weight: '170g (6oz)', quantity: 2 },
    ],
    totalItems: 4,
    totalPrice: 1296,
    packagingFee: 49,
    finalTotal: 1345,
    status: 'Ready for Collection',
    channel: 'courier',
    deliveryArea: 'Vikhroli Atelier (Pickup)',
    date: '26 Sep 2026',
    time: '05:30 PM',
  },
  {
    id: 'SUK-1980',
    customer: {
      name: 'Vikram Merchant',
      phone: '9821093412',
      email: 'v.merchant@gmail.com',
      slot: 'Yesterday Evening (5:00 PM – 8:00 PM)',
      note: '',
      paymentMethod: 'upi',
      isBulkOrder: false,
    },
    items: [
      { id: 1, name: 'Triple Chocolate Overload', price: 299, weight: '170g (6oz)', quantity: 2 },
      { id: 2, name: 'Gooey Two-Chip', price: 279, weight: '170g (6oz)', quantity: 2 },
    ],
    totalItems: 4,
    totalPrice: 1156,
    packagingFee: 49,
    finalTotal: 1205,
    status: 'Collected',
    channel: 'pickup',
    deliveryArea: 'Vikhroli Atelier (Pickup)',
    date: '25 Sep 2026',
    time: '06:10 PM',
  },
  {
    id: 'SUK-1420',
    customer: {
      name: 'Natasha Poonawalla',
      phone: '9820199411',
      email: 'natasha@couture.in',
      slot: '24 Sep (5:00 PM – 8:00 PM)',
      note: 'Driver will pick up with order token #SUK-1420',
      paymentMethod: 'upi',
      isBulkOrder: false,
    },
    items: [
      { id: 7, name: 'The Royal Assorted Gift Box (4 Pack)', price: 1199, weight: '680g (4x 170g)', quantity: 2 },
      { id: 4, name: "Cupid's Ruby Chocolate", price: 379, weight: '170g (6oz)', quantity: 2 },
    ],
    totalItems: 4,
    totalPrice: 3156,
    packagingFee: 98,
    finalTotal: 3254,
    status: 'Collected',
    channel: 'pickup',
    deliveryArea: 'Vikhroli Atelier (Pickup)',
    date: '24 Sep 2026',
    time: '04:20 PM',
  },
];

// Rich corporate & bulk inquiries for B2B CRM pipeline
const INITIAL_BULK_INQUIRIES = [
  {
    id: 'INQ-901',
    company: 'Reliance Jio Infocomm',
    contactPerson: 'Sameer Singhania',
    phone: '9820491021',
    email: 'sameer.s@ril.com',
    event: 'Quarterly Executive Leadership Summit',
    dateRequired: '04 Oct 2026',
    estimatedUnits: 60,
    estimatedValue: 71940,
    status: 'Quote Sent', // 'New Inquiry' | 'In Discussion' | 'Quote Sent' | 'Confirmed & Paid' | 'Delivered'
    notes: 'Require custom midnight blue satin ribbon with silver logo emboss tag. 4-pack assortment.',
  },
  {
    id: 'INQ-882',
    company: 'Lodha Luxury Sales Gallery',
    contactPerson: 'Ritika Advani',
    phone: '9819034291',
    email: 'ritika.a@lodhagroup.com',
    event: 'Penthouse Handover VIP Welcome Hampers',
    dateRequired: '12 Oct 2026',
    estimatedUnits: 40,
    estimatedValue: 47960,
    status: 'In Discussion',
    notes: 'Client requests fresh bake same-day delivery to Lower Parel with warm tasting guide.',
  },
  {
    id: 'INQ-755',
    company: 'Mehta & Shroff Wedding',
    contactPerson: 'Karan Mehta',
    phone: '9821884019',
    email: 'karan@mehtacap.com',
    event: 'Bespoke Wedding Return Favours',
    dateRequired: '18 Oct 2026',
    estimatedUnits: 120,
    estimatedValue: 143880,
    status: 'Confirmed & Paid',
    notes: 'Paid 50% advance via NEFT. 120 4-packs customized with monogram packaging.',
  },
];

const INITIAL_STORE_CONFIG = {
  isComingSoon: true, // Default public view
  ovenStatusText: 'Ovens Fired Today • Pre-Orders Active',
  adminPin: '8467', // Default PIN matching contact number digits 8467
  storeOpen: true,
};

export function MenuProvider({ children }) {
  // 1. Dynamic Menu Products
  const [products, setProducts] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MENU);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return menuData?.products || [];
  });

  // 2. Store Configuration
  const [storeConfig, setStoreConfig] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CONFIG);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          return { ...INITIAL_STORE_CONFIG, ...parsed };
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_STORE_CONFIG;
  });

  // 3. Customer Orders
  const [orders, setOrders] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_DEMO_ORDERS;
  });

  // 4. Customer Reviews
  const [reviews, setReviews] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return [
      {
        id: 1,
        name: 'Rohan M.',
        stars: 5,
        cookie: 'Triple Chocolate Overload',
        comment: 'The molten 54.5% ganache lava core is out of this world. Massive 170g size and 100% pure eggless perfection.',
        date: '2 days ago',
      },
      {
        id: 2,
        name: 'Simran K.',
        stars: 5,
        cookie: 'Pistachio White Gianduja',
        comment: 'The roasted Sicilian pistachios and smooth white chocolate gianduja are sheer luxury. Best cookie in Mumbai.',
        date: 'Yesterday',
      },
      {
        id: 3,
        name: 'Arjun V.',
        stars: 5,
        cookie: 'Gooey Two-Chip',
        comment: 'Maldon sea salt flakes with the gooey chocolate center balance the sweetness flawlessly.',
        date: '3 days ago',
      },
    ];
  });

  // Sync products to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(products));
    } catch (err) {
      console.error('Failed to save menu to localStorage', err);
    }
  }, [products]);

  // Sync store config to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(storeConfig));
    } catch (err) {
      console.error('Failed to save store config to localStorage', err);
    }
  }, [storeConfig]);

  // Sync orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (err) {
      console.error('Failed to save orders to localStorage', err);
    }
  }, [orders]);

  // Sync reviews to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    } catch (err) {
      console.error('Failed to save reviews to localStorage', err);
    }
  }, [reviews]);

  // 5. Corporate Bulk Inquiries (B2B CRM Pipeline)
  const [bulkInquiries, setBulkInquiries] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_BULK_INQUIRIES;
  });

  // Sync inquiries to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(bulkInquiries));
    } catch (err) {
      console.error('Failed to save bulk inquiries to localStorage', err);
    }
  }, [bulkInquiries]);

  // --- CRUD ACTIONS FOR MENU PRODUCTS ---
  const addProduct = useCallback((newProduct) => {
    setProducts((prev) => {
      const id = Date.now();
      const productWithId = {
        ...newProduct,
        id,
        available: newProduct.available ?? true,
        tags: newProduct.tags || ['New Drop'],
        weight: newProduct.weight || '170g (6oz)',
        serves: newProduct.serves || '1-2',
        provenanceHighlights: newProduct.provenanceHighlights || [],
        ingredients: newProduct.ingredients || [],
      };
      return [productWithId, ...prev];
    });
  }, []);

  const updateProduct = useCallback((id, updatedFields) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
  }, []);

  const deleteProduct = useCallback((id) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toggleProductAvailability = useCallback((id) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, available: !item.available } : item))
    );
  }, []);

  const setAllProductsAvailability = useCallback((isAvailable) => {
    setProducts((prev) => prev.map((item) => ({ ...item, available: isAvailable })));
  }, []);

  const resetToDefaultMenu = useCallback(() => {
    setProducts(menuData.products);
    try {
      localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(menuData.products));
    } catch {
      // Ignore
    }
  }, []);

  // --- STORE CONFIG ACTIONS ---
  const updateStoreConfig = useCallback((newFields) => {
    setStoreConfig((prev) => ({ ...prev, ...newFields }));
  }, []);

  // --- ORDER ACTIONS ---
  const updateOrderStatus = useCallback((orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
  }, []);

  const addOrder = useCallback((newOrder) => {
    setOrders((prev) => [{ ...newOrder, status: 'Pending' }, ...prev]);
  }, []);

  const deleteOrder = useCallback((orderId) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  }, []);

  // --- REVIEWS ACTIONS ---
  const addReview = useCallback((newReview) => {
    setReviews((prev) => [{ id: Date.now(), ...newReview, date: 'Just now' }, ...prev]);
  }, []);

  const deleteReview = useCallback((id) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  }, []);

  // --- CORPORATE & BULK INQUIRY ACTIONS ---
  const addBulkInquiry = useCallback((newInquiry) => {
    setBulkInquiries((prev) => [
      { id: `INQ-${Math.floor(100 + Math.random() * 900)}`, status: 'New Inquiry', ...newInquiry },
      ...prev,
    ]);
  }, []);

  const updateBulkInquiryStatus = useCallback((inquiryId, newStatus) => {
    setBulkInquiries((prev) =>
      prev.map((inq) => (inq.id === inquiryId ? { ...inq, status: newStatus } : inq))
    );
  }, []);

  const deleteBulkInquiry = useCallback((inquiryId) => {
    setBulkInquiries((prev) => prev.filter((inq) => inq.id !== inquiryId));
  }, []);

  // --- PIN VERIFICATION ---
  const verifyPin = useCallback(
    (enteredPin) => {
      return enteredPin === storeConfig.adminPin;
    },
    [storeConfig.adminPin]
  );

  const changePin = useCallback((newPin) => {
    setStoreConfig((prev) => ({ ...prev, adminPin: newPin }));
  }, []);

  return (
    <MenuContext.Provider
      value={{
        categories: menuData?.categories || [],
        products,
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
        verifyPin,
        changePin,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
}
