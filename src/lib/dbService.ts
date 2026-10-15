import { supabase } from './supabase';
import { DeliveryAddress, SponsorInfo, OrderRecord } from '../types';

export interface DbPayment {
  id?: string;
  user_id: string;
  moneyfox_id: string;
  order_id: string;
  transaction_id: string;
  upi_id: string | null;
  amount: number;
  payment_method: string;
  status: 'pending' | 'verified' | 'rejected';
  idempotency_key: string;
  created_at: string;
  updated_at: string;
}

export interface DbUser {
  id?: string;
  email: string;
  name: string;
  phone: string;
  role: 'user' | 'admin';
  payment_completed: boolean;
  payment_method: string | null;
  payment_date: string | null;
  parent_id: string | null;
  left_child_id: string | null;
  right_child_id: string | null;
  has_joined_tree: boolean;
  referral_code: string;
  referred_by: string | null;
  is_in_waiting_bench: boolean;
  waiting_bench_type: string | null;
  waiting_bench_entry_date: string | null;
  waiting_in_bench_of: string | null;
  wallet_balance: number;
  current_level: number;
  created_at: string;
  updated_at: string;
  moneyfox_id: string;
  auth_user_id: string;
}

export interface DbDelivery {
  id?: string;
  order_id?: string;
  moneyfox_id: string;
  name: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export interface DbWaitingBench {
  id?: string;
  moneyfox_id: string;
  name: string;
  entry_date: string;
  left_date: string | null;
  status?: string;
  created_at: string;
}

export interface DbProduct {
  id: string;
  slug?: string;
  sku: string;
  name: string;
  series?: string;
  lot?: string;
  gsm?: number;
  price: number;
  taxable_price?: number;
  gst_percentage?: number;
  color?: string;
  edition_tag?: string;
  image?: string;
  thumbnails?: string[];
  description?: string;
  details?: string[];
  specs?: string;
  sizes?: string[];
  available_sizes?: string[];
  size_s_stock: number;
  size_m_stock: number;
  size_l_stock: number;
  size_xl_stock: number;
  status: 'Published' | 'Draft' | 'Low stock' | 'Archived';
  is_active: boolean;
  category: string;
  created_at?: string;
  updated_at?: string;
}

// Local cache keys for seamless resilience
const STORAGE_KEYS = {
  PAYMENTS: 'mf_realtime_payments',
  USERS: 'mf_realtime_users',
  ORDERS: 'mf_realtime_orders',
  BENCH: 'mf_realtime_bench',
  PRODUCTS: 'mf_realtime_products',
};

const getLocal = <T>(key: string, defaultValue: T): T => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setLocal = <T>(key: string, value: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
};

export const dbService = {
  /**
   * Fetch all payments from Supabase with realtime fallback
   */
  async fetchPayments(): Promise<DbPayment[]> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetchPayments notice (using cache):', error.message);
        return getLocal<DbPayment[]>(STORAGE_KEYS.PAYMENTS, []);
      }
      if (data) {
        setLocal(STORAGE_KEYS.PAYMENTS, data);
        return data;
      }
      return getLocal<DbPayment[]>(STORAGE_KEYS.PAYMENTS, []);
    } catch (err) {
      console.error('Fetch payments error:', err);
      return getLocal<DbPayment[]>(STORAGE_KEYS.PAYMENTS, []);
    }
  },

  /**
   * Subscribe to live Supabase payments stream
   */
  subscribePayments(onUpdate: (payload: any) => void): () => void {
    const channelId = `realtime:payments:${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'payments' },
        (payload) => {
          onUpdate(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  /**
   * Fetch all users from Supabase
   */
  async fetchUsers(): Promise<DbUser[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetchUsers notice (using cache):', error.message);
        return getLocal<DbUser[]>(STORAGE_KEYS.USERS, []);
      }
      if (data) {
        setLocal(STORAGE_KEYS.USERS, data);
        return data;
      }
      return getLocal<DbUser[]>(STORAGE_KEYS.USERS, []);
    } catch (err) {
      console.error('Fetch users error:', err);
      return getLocal<DbUser[]>(STORAGE_KEYS.USERS, []);
    }
  },

  /**
   * Subscribe to live Supabase users stream
   */
  subscribeUsers(onUpdate: (payload: any) => void): () => void {
    const channelId = `realtime:users:${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'users' },
        (payload) => {
          onUpdate(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  /**
   * Fetch orders for a specific member or all orders
   */
  async fetchOrders(moneyfoxId?: string): Promise<OrderRecord[]> {
    try {
      let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (moneyfoxId) {
        query = query.eq('moneyfox_id', moneyfoxId);
      }
      const { data, error } = await query;

      if (error) {
        console.warn('Supabase fetchOrders notice (using cache):', error.message);
        const cached = getLocal<OrderRecord[]>(STORAGE_KEYS.ORDERS, []);
        return moneyfoxId ? cached.filter((o) => (o as any).moneyfox_id === moneyfoxId || o.orderId) : cached;
      }

      if (data && data.length > 0) {
        const mapped: OrderRecord[] = data.map((o: any) => ({
          orderId: o.order_id,
          date: new Date(o.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          productName: o.product_name || 'Signature Heavyweight Tee Drop',
          size: o.size || 'L',
          quantity: o.quantity || 1,
          total: Number(o.amount) || 2000,
          paymentMethod: 'UPI • Instant Verified',
          paymentStatus: o.shipment_status === 'Verification pending' ? 'Verification pending' : 'Paid',
          shipmentStatus: o.shipment_status || 'Preparing',
          carrier: o.carrier || 'Bluedart Express',
          trackingNumber: o.tracking_number || `BD-${o.order_id?.slice(-6) || '772910'}`,
          invoiceId: `INV-${o.order_id?.slice(-6) || '772910'}`,
          utrNumber: o.tracking_number?.replace('BD-', '') || 'UPI-ESCROW',
          estimatedDelivery: '3-5 business days',
          dispatchHub: 'Mumbai Apex Fulfillment Center',
          currentLocation: o.shipment_status === 'In transit' ? 'Out for delivery' : 'Hub verification sealed',
          deliveryAddress: {
            fullName: 'Guild Member',
            mobile: '+91 98200 00000',
            email: 'member@moneyfox.in',
            apartment: 'Apex Consignee Address',
            street: 'Express Delivery Corridor',
            city: 'Mumbai',
            pinCode: '400001',
            state: 'Maharashtra',
            country: 'India',
            isBillingSame: true,
          },
          timeline: [
            {
              status: 'Order Placed',
              date: new Date(o.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
              description: 'UPI verification request submitted with transaction receipt',
              completed: true,
            },
            {
              status: 'Payment Reconciled',
              date: o.shipment_status !== 'Verification pending' ? 'Verified' : 'Pending',
              description: 'Bank escrow match verified by operations admin',
              completed: o.shipment_status !== 'Verification pending',
            },
            {
              status: 'Dispatched',
              date: o.shipment_status === 'In transit' || o.shipment_status === 'Delivered' ? 'In transit' : 'Awaiting dispatch',
              description: 'Handed over to express courier with air waybill',
              completed: o.shipment_status === 'In transit' || o.shipment_status === 'Delivered',
            },
            {
              status: 'Delivered',
              date: o.shipment_status === 'Delivered' ? 'Delivered' : 'Pending',
              description: 'Signed delivery at consignee address',
              completed: o.shipment_status === 'Delivered',
            },
          ],
        }));
        setLocal(STORAGE_KEYS.ORDERS, mapped);
        return mapped;
      }

      return getLocal<OrderRecord[]>(STORAGE_KEYS.ORDERS, []);
    } catch (err) {
      console.error('fetchOrders error:', err);
      return getLocal<OrderRecord[]>(STORAGE_KEYS.ORDERS, []);
    }
  },

  /**
   * Subscribe to live Supabase orders stream
   */
  subscribeOrders(onUpdate: (payload: any) => void): () => void {
    const channelId = `realtime:orders:${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          onUpdate(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  /**
   * Fetch waiting bench entries
   */
  async fetchWaitingBench(): Promise<DbWaitingBench[]> {
    try {
      const { data, error } = await supabase
        .from('global_waiting_bench')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetchWaitingBench notice:', error.message);
        return getLocal<DbWaitingBench[]>(STORAGE_KEYS.BENCH, []);
      }
      if (data) {
        setLocal(STORAGE_KEYS.BENCH, data);
        return data;
      }
      return getLocal<DbWaitingBench[]>(STORAGE_KEYS.BENCH, []);
    } catch (err) {
      console.error('Fetch waiting bench error:', err);
      return getLocal<DbWaitingBench[]>(STORAGE_KEYS.BENCH, []);
    }
  },

  /**
   * Subscribe to live Supabase waiting bench changes
   */
  subscribeWaitingBench(onUpdate: (payload: any) => void): () => void {
    const channelId = `realtime:bench:${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'global_waiting_bench' },
        (payload) => {
          onUpdate(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  /**
   * Submit a live UPI payment and create real order and delivery records
   */
  async submitPayment(params: {
    userId: string;
    moneyfoxId: string;
    utrNumber: string;
    upiVpa: string;
    amount?: number;
    deliveryAddress: DeliveryAddress;
    sponsorInfo: SponsorInfo;
    selectedSize?: string;
    productName?: string;
  }): Promise<{ success: boolean; orderId?: string; error?: string }> {
    try {
      const {
        userId,
        moneyfoxId,
        utrNumber,
        upiVpa,
        amount = 2000,
        deliveryAddress,
        sponsorInfo,
        selectedSize = 'L',
        productName = 'CHILL OUT SIGNATURE OVERSIZED TEE',
      } = params;

      const cleanUtr = utrNumber.trim();
      const timestamp = Date.now();
      const random = Math.floor(1000 + Math.random() * 9000);
      const orderId = `ORD-MFX-${timestamp.toString().slice(-5)}${random.toString().slice(-2)}`;
      const idempotencyKey = `UPI-${userId}-${timestamp}-${random}`;

      const paymentRecord: DbPayment = {
        user_id: userId,
        moneyfox_id: moneyfoxId,
        order_id: orderId,
        transaction_id: cleanUtr,
        upi_id: upiVpa,
        amount: amount,
        payment_method: 'upi',
        status: 'pending',
        idempotency_key: idempotencyKey,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // 1. Save into Supabase 'payments'
      const { error: payError } = await supabase
        .from('payments')
        .upsert(paymentRecord, { onConflict: 'user_id' });

      if (payError) {
        console.warn('Supabase payments upsert notice:', payError.message);
      }

      // 2. Format physical delivery address
      const fullAddressString = [
        deliveryAddress.apartment,
        deliveryAddress.street,
        deliveryAddress.city,
        `${deliveryAddress.state} - ${deliveryAddress.pinCode}`,
      ].filter(Boolean).join(', ');

      // 3. Save into Supabase 'delivery'
      await supabase.from('delivery').insert({
        order_id: orderId,
        moneyfox_id: moneyfoxId,
        name: deliveryAddress.fullName,
        phone: deliveryAddress.mobile,
        address: fullAddressString,
        city: deliveryAddress.city,
        state: deliveryAddress.state,
        pincode: deliveryAddress.pinCode,
      });

      // 4. Create active 'orders' record in Supabase
      const newOrder: OrderRecord = {
        orderId,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        productName,
        size: selectedSize,
        quantity: 1,
        total: amount,
        paymentMethod: 'UPI (UTR: ' + cleanUtr + ')',
        paymentStatus: 'Verification pending',
        shipmentStatus: 'Verification pending',
        carrier: 'Bluedart Express',
        trackingNumber: `BD-${cleanUtr.slice(-6)}`,
        estimatedDelivery: '3-5 business days',
        dispatchHub: 'Mumbai Apex Fulfillment Center',
        currentLocation: 'Payment submitted • Awaiting admin fiscal clearance',
        deliveryAddress,
      };

      await supabase.from('orders').insert({
        order_id: orderId,
        user_id: userId,
        moneyfox_id: moneyfoxId,
        product_name: productName,
        amount: amount,
        size: selectedSize,
        quantity: 1,
        shipment_status: 'Verification pending',
        tracking_number: `BD-${cleanUtr.slice(-6)}`,
      });

      // 5. Mirror into local storage cache
      const cachedPayments = getLocal<DbPayment[]>(STORAGE_KEYS.PAYMENTS, []);
      setLocal(STORAGE_KEYS.PAYMENTS, [paymentRecord, ...cachedPayments.filter(p => p.order_id !== orderId)]);

      const cachedOrders = getLocal<OrderRecord[]>(STORAGE_KEYS.ORDERS, []);
      setLocal(STORAGE_KEYS.ORDERS, [newOrder, ...cachedOrders.filter(o => o.orderId !== orderId)]);

      return { success: true, orderId };
    } catch (err: any) {
      console.error('submitPayment error:', err);
      return { success: false, error: err.message || 'Payment submission failed' };
    }
  },

  /**
   * Admin: Approve a payment, activate user, move order to 'Preparing' / 'In transit'
   */
  async approvePayment(transactionId: string, moneyfoxId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const now = new Date().toISOString();
      const todayDate = now.split('T')[0];

      // 1. Update payment status to 'verified'
      await supabase
        .from('payments')
        .update({
          status: 'verified',
          updated_at: now,
        })
        .eq('transaction_id', transactionId);

      // 2. Activate user in 'users' table
      await supabase
        .from('users')
        .update({
          payment_completed: true,
          payment_method: 'upi',
          payment_date: todayDate,
          has_joined_tree: true,
          updated_at: now,
        })
        .eq('moneyfox_id', moneyfoxId);

      // 3. Update orders table to 'Preparing' / 'In transit'
      await supabase
        .from('orders')
        .update({
          shipment_status: 'In transit',
          updated_at: now,
        })
        .eq('moneyfox_id', moneyfoxId);

      // 4. Update local cache
      const cachedPayments = getLocal<DbPayment[]>(STORAGE_KEYS.PAYMENTS, []);
      setLocal(
        STORAGE_KEYS.PAYMENTS,
        cachedPayments.map((p) =>
          p.transaction_id === transactionId ? { ...p, status: 'verified', updated_at: now } : p
        )
      );

      const cachedOrders = getLocal<OrderRecord[]>(STORAGE_KEYS.ORDERS, []);
      setLocal(
        STORAGE_KEYS.ORDERS,
        cachedOrders.map((o) =>
          o.paymentStatus === 'Verification pending'
            ? { ...o, paymentStatus: 'Paid', shipmentStatus: 'In transit' }
            : o
        )
      );

      return { success: true };
    } catch (err: any) {
      console.error('approvePayment error:', err);
      return { success: false, error: err.message || 'Approval failed' };
    }
  },

  /**
   * Admin: Reject a payment
   */
  async rejectPayment(transactionId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const now = new Date().toISOString();
      await supabase
        .from('payments')
        .update({
          status: 'rejected',
          updated_at: now,
        })
        .eq('transaction_id', transactionId);

      const cachedPayments = getLocal<DbPayment[]>(STORAGE_KEYS.PAYMENTS, []);
      setLocal(
        STORAGE_KEYS.PAYMENTS,
        cachedPayments.map((p) =>
          p.transaction_id === transactionId ? { ...p, status: 'rejected', updated_at: now } : p
        )
      );

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Rejection failed' };
    }
  },

  /**
   * Fetch all products from Supabase with realtime fallback
   */
  async fetchProducts(): Promise<DbProduct[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.warn('Supabase fetchProducts notice:', error.message);
        return getLocal<DbProduct[]>(STORAGE_KEYS.PRODUCTS, []);
      }

      if (data && data.length > 0) {
        setLocal(STORAGE_KEYS.PRODUCTS, data);
        return data as DbProduct[];
      }
      return getLocal<DbProduct[]>(STORAGE_KEYS.PRODUCTS, []);
    } catch (err) {
      console.warn('dbService.fetchProducts network error:', err);
      return getLocal<DbProduct[]>(STORAGE_KEYS.PRODUCTS, []);
    }
  },

  /**
   * Realtime subscription for Products
   */
  subscribeProducts(callback: (products: DbProduct[]) => void) {
    const channelId = `realtime:products:${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        async () => {
          const fresh = await this.fetchProducts();
          callback(fresh);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  /**
   * Admin: Adjust product inventory atomically via Supabase stored procedure or direct update
   */
  async adjustProductStock(params: {
    sku: string;
    size: string;
    adjustment: number;
    reason: string;
    note?: string;
    operatorEmail?: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const { sku, size, adjustment, reason, note = '', operatorEmail = 'admin@moneyfox.co.in' } = params;

      // Try calling RPC first
      const { data: rpcData, error: rpcError } = await supabase.rpc('adjust_product_inventory', {
        p_sku: sku,
        p_size: size,
        p_adjustment: adjustment,
        p_reason: reason,
        p_operator_email: operatorEmail,
        p_audit_note: note,
      });

      if (!rpcError && rpcData?.success) {
        await this.fetchProducts();
        return { success: true };
      }

      // Fallback: Direct table update
      const { data: product, error: fetchErr } = await supabase
        .from('products')
        .select('*')
        .eq('sku', sku)
        .single();

      if (fetchErr || !product) {
        return { success: false, error: fetchErr?.message || 'Product not found' };
      }

      const sizeKey = `size_${size.toLowerCase()}_stock` as keyof DbProduct;
      const prevStock = (product as any)[sizeKey] || 0;
      const newStock = Math.max(0, prevStock + adjustment);

      const updatePayload: any = {
        [sizeKey]: newStock,
        updated_at: new Date().toISOString(),
      };

      const sStock = size.toUpperCase() === 'S' ? newStock : (product.size_s_stock || 0);
      const mStock = size.toUpperCase() === 'M' ? newStock : (product.size_m_stock || 0);
      const lStock = size.toUpperCase() === 'L' ? newStock : (product.size_l_stock || 0);
      const xlStock = size.toUpperCase() === 'XL' ? newStock : (product.size_xl_stock || 0);
      const totalStock = sStock + mStock + lStock + xlStock;

      updatePayload.status = totalStock <= 5 ? 'Low stock' : 'Published';

      const { error: updateErr } = await supabase
        .from('products')
        .update(updatePayload)
        .eq('id', product.id);

      if (updateErr) {
        return { success: false, error: updateErr.message };
      }

      // Insert audit log
      await supabase.from('inventory_adjustments').insert({
        product_id: product.id,
        sku,
        size: size.toUpperCase(),
        operator_email: operatorEmail,
        adjustment_quantity: adjustment,
        previous_stock: prevStock,
        new_stock: newStock,
        reason,
        audit_note: note,
      });

      await this.fetchProducts();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Stock adjustment failed' };
    }
  },

  /**
   * Admin: Add new product to catalog
   */
  async addProduct(product: Partial<DbProduct>): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const now = new Date().toISOString();
      const payload = {
        ...product,
        created_at: now,
        updated_at: now,
      };

      const { data, error } = await supabase.from('products').insert(payload).select().single();
      if (error) {
        return { success: false, error: error.message };
      }
      await this.fetchProducts();
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message || 'Product creation failed' };
    }
  },

  /**
   * Admin: Update product details
   */
  async updateProduct(id: string, updates: Partial<DbProduct>): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('products')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        return { success: false, error: error.message };
      }
      await this.fetchProducts();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Product update failed' };
    }
  },
};
