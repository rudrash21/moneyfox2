import { supabase } from './supabase';
import { DeliveryAddress, SponsorInfo } from '../types';

export interface DbPayment {
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
  id: string;
  moneyfox_id: string;
  name: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export interface DbWaitingBench {
  id: string;
  moneyfox_id: string;
  name: string;
  entry_date: string;
  left_date: string | null;
  created_at: string;
}

export const dbService = {
  /**
   * Fetch all payments from Supabase
   */
  async fetchPayments(): Promise<DbPayment[]> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching payments:', error);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error('Fetch payments error:', err);
      return [];
    }
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
        console.error('Error fetching users:', error);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error('Fetch users error:', err);
      return [];
    }
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
        console.error('Error fetching waiting bench:', error);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error('Fetch waiting bench error:', err);
      return [];
    }
  },

  /**
   * Submit a live UPI payment and save delivery information into Supabase
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
  }): Promise<{ success: boolean; orderId?: string; error?: string }> {
    try {
      const {
        userId,
        moneyfoxId,
        utrNumber,
        upiVpa,
        amount = 2000,
        deliveryAddress,
      } = params;

      const cleanUtr = utrNumber.trim();
      const timestamp = Date.now();
      const random = Math.floor(1000 + Math.random() * 9000);
      const orderId = `ORD-MFX-${timestamp.toString().slice(-5)}${random.toString().slice(-2)}`;
      const idempotencyKey = `UPI-${userId}-${timestamp}-${random}`;

      // Insert or update payment in 'payments' table (user_id is primary key)
      const { error: payError } = await supabase
        .from('payments')
        .upsert(
          {
            user_id: userId,
            moneyfox_id: moneyfoxId,
            order_id: orderId,
            transaction_id: cleanUtr,
            upi_id: upiVpa,
            amount: amount,
            payment_method: 'upi',
            status: 'pending',
            idempotency_key: idempotencyKey,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );

      if (payError) {
        console.error('Supabase payments upsert error:', payError);
        return { success: false, error: payError.message };
      }

      // Format physical delivery address string
      const fullAddressString = [
        deliveryAddress.apartment,
        deliveryAddress.street,
        deliveryAddress.city,
        `${deliveryAddress.state} - ${deliveryAddress.pinCode}`,
      ].filter(Boolean).join(', ');

      // Insert delivery info into 'delivery' table
      const { error: delError } = await supabase
        .from('delivery')
        .insert({
          moneyfox_id: moneyfoxId,
          name: deliveryAddress.fullName,
          phone: deliveryAddress.mobile,
          address: fullAddressString,
        });

      if (delError) {
        console.warn('Delivery record insert notice:', delError.message);
      }

      return { success: true, orderId };
    } catch (err: any) {
      console.error('submitPayment error:', err);
      return { success: false, error: err.message || 'Payment submission failed' };
    }
  },

  /**
   * Admin: Approve a payment, activate user, and enqueue into waiting bench
   */
  async approvePayment(transactionId: string, moneyfoxId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // 1. Update payment status to 'verified'
      const { error: payError } = await supabase
        .from('payments')
        .update({
          status: 'verified',
          updated_at: new Date().toISOString(),
        })
        .eq('transaction_id', transactionId);

      if (payError) {
        console.error('Approve payment error:', payError);
        return { success: false, error: payError.message };
      }

      // 2. Activate user in 'users' table
      const todayDate = new Date().toISOString().split('T')[0];
      const { error: userError } = await supabase
        .from('users')
        .update({
          payment_completed: true,
          payment_method: 'upi',
          payment_date: todayDate,
          updated_at: new Date().toISOString(),
        })
        .eq('moneyfox_id', moneyfoxId);

      if (userError) {
        console.warn('User status update error:', userError);
      }

      // 3. Enqueue into global_waiting_bench
      await supabase
        .from('global_waiting_bench')
        .insert({
          moneyfox_id: moneyfoxId,
          name: '',
          entry_date: todayDate,
        });

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
      const { error } = await supabase
        .from('payments')
        .update({
          status: 'rejected',
          updated_at: new Date().toISOString(),
        })
        .eq('transaction_id', transactionId);

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Rejection failed' };
    }
  },
};
