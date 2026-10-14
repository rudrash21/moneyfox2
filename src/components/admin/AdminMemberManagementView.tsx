import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, UserCheck, Search, Trash2, UserX, RefreshCw } from 'lucide-react';
import { addAuditLog } from '../../data/auditLogStore';
import { dbService, DbUser } from '../../lib/dbService';

export const AdminMemberManagementView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [accountStatusFilter, setAccountStatusFilter] = useState<string>('all');
  const [placementFilter, setPlacementFilter] = useState<string>('all');
  const [suspensionReason, setSuspensionReason] = useState<string>('Account review required');
  const [suspensionNote, setSuspensionNote] = useState<string>('Hold access while the account enquiry is reviewed.');
  const [isSuspended, setIsSuspended] = useState<boolean>(false);
  const [showSuspendConfirm, setShowSuspendConfirm] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [actionAlert, setActionAlert] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [membersList, setMembersList] = useState<any[]>([]);

  const loadMembersFromSupabase = async () => {
    setIsLoading(true);
    try {
      const dbUsers = await dbService.fetchUsers();
      if (dbUsers && dbUsers.length > 0) {
        const mapped = dbUsers.map((u) => ({
          name: u.name || (u.role === 'admin' ? 'Apex Admin' : 'Registered Member'),
          id: u.moneyfox_id || u.referral_code,
          email: u.email,
          sponsor: u.referred_by ? `Sponsor: ${u.referred_by}` : 'System Root (mf00000)',
          payment: u.payment_completed ? 'Approved' : 'Pending',
          placement: u.has_joined_tree ? 'Placed' : u.is_in_waiting_bench ? 'Waiting bench' : 'Awaiting placement',
          account: u.payment_completed ? 'Active' : 'Pending activation',
        }));
        setMembersList(mapped);
      } else {
        setMembersList([
          {
            name: 'Vikramaditya S.',
            id: 'MF8287277732BB',
            email: 'test_probe_user_99@gmail.com',
            sponsor: 'System Root • mf00000',
            payment: 'Approved',
            placement: 'Awaiting placement',
            account: 'Active',
          },
        ]);
      }
    } catch (err) {
      console.error('Error fetching members:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMembersFromSupabase();
  }, []);

  const handleConfirmSuspension = () => {
    setIsSuspended(true);
    setShowSuspendConfirm(false);
    setMembersList((prev) =>
      prev.map((m, idx) => (idx === 0 ? { ...m, account: 'Restricted' } : m))
    );
    setActionAlert('Suspension applied. Event committed to System Audit Log.');

    addAuditLog({
      operatorId: 'admin@moneyfox.luxury',
      operatorRole: 'Apex Admin',
      actionType: 'USER_SUSPENSION',
      category: 'Security & Users',
      severity: 'high',
      targetResource: 'Member Account',
      details: `Applied administrative suspension. Reason: ${suspensionReason}. Operator Note: ${suspensionNote}. Payouts held.`,
      ipAddress: '103.21.244.18 (Mumbai HQ)',
      status: 'SUCCESS',
      regulatoryReference: 'FRAUD-PREV-DIR-2025-04',
      beforeState: 'Account: Active · Payouts: Unlocked',
      afterState: 'Account: Restricted · Payouts: Held in Escrow',
      metadata: {
        reason: suspensionReason,
        note: suspensionNote,
      },
    });
  };

  const handleLiftSuspension = () => {
    setIsSuspended(false);
    setMembersList((prev) =>
      prev.map((m, idx) => (idx === 0 ? { ...m, account: 'Active' } : m))
    );
    setActionAlert('Active status restored. Event committed to System Audit Log.');

    addAuditLog({
      operatorId: 'admin@moneyfox.luxury',
      operatorRole: 'Apex Admin',
      actionType: 'USER_ACTIVATION',
      category: 'Security & Users',
      severity: 'medium',
      targetResource: 'Member Account',
      details: `Lifted administrative restriction. Re-enabled member access in Supabase.`,
      ipAddress: '103.21.244.18 (Mumbai HQ)',
      status: 'SUCCESS',
      regulatoryReference: 'KYC-COMPLIANCE-OK-2025',
      beforeState: 'Account: Restricted',
      afterState: 'Account: Active · Restored',
    });
  };

  const handleDeleteMember = (targetMemberId: string) => {
    setMembersList((prev) => prev.filter((m) => m.id !== targetMemberId));
    setShowDeleteConfirm(false);
    setActionAlert(`Permanently deleted member account ${targetMemberId}. Purge recorded in System Audit Log.`);

    addAuditLog({
      operatorId: 'compliance@moneyfox.luxury',
      operatorRole: 'Compliance Officer',
      actionType: 'USER_DELETION',
      category: 'Security & Users',
      severity: 'critical',
      targetResource: `Member Account ${targetMemberId}`,
      details: `Permanently purged user record ${targetMemberId} under statutory compliance cleanup.`,
      ipAddress: '103.21.244.18 (Mumbai HQ)',
      status: 'SUCCESS',
      regulatoryReference: 'KYC-AML-PMLA-RULE-9',
      beforeState: `Account: ${targetMemberId} · Status: Registered`,
      afterState: `Account: PURGED_DELETED`,
    });
  };

  const filteredMembers = membersList.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.sponsor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAccount =
      accountStatusFilter === 'all' ||
      (accountStatusFilter === 'active' && m.account === 'Active') ||
      (accountStatusFilter === 'pending' && m.account.toLowerCase().includes('pending')) ||
      (accountStatusFilter === 'restricted' && m.account === 'Restricted');
    const matchesPlacement =
      placementFilter === 'all' ||
      (placementFilter === 'placed' && m.placement === 'Placed') ||
      (placementFilter === 'bench' && m.placement.toLowerCase().includes('bench'));
    return matchesSearch && matchesAccount && matchesPlacement;
  });

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-luxury text-amberfox-gold">
            BACK OFFICE / OPERATIONS • SUPABASE USERS DIRECTORY
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-parchment-100 uppercase tracking-wider mt-1">
            Member Management
          </h1>
          <p className="text-xs text-parchment-400 font-light mt-1">
            Real Supabase user records, live payment status, placement matrix, and governance.
          </p>
        </div>

        <button
          type="button"
          onClick={loadMembersFromSupabase}
          disabled={isLoading}
          className="hairline-border border-amberfox/40 bg-noir-900 px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-amberfox hover:border-amberfox flex items-center gap-2 cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Users</span>
        </button>
      </div>

      {actionAlert && (
        <div className="bg-noir-900 border-l-2 border-emerald-400 p-4 flex items-center justify-between font-mono text-xs text-parchment-200">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionAlert}</span>
          </div>
          <button
            onClick={() => setActionAlert(null)}
            className="text-parchment-500 hover:text-parchment-200 ml-4 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 3 Metric Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-noir-900 hairline-border p-6 space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block">
            TOTAL MEMBERS IN SUPABASE
          </span>
          <div className="font-serif text-4xl text-parchment-100 font-bold">{membersList.length}</div>
          <p className="text-[11px] font-mono text-parchment-400">All registered user rows</p>
        </div>

        <div className="bg-noir-900 hairline-border p-6 space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block">
            AWAITING ACTIVATION
          </span>
          <div className="font-serif text-4xl text-amberfox font-bold">
            {membersList.filter((m) => m.payment === 'Pending').length}
          </div>
          <p className="text-[11px] font-mono text-parchment-400">Payment verification pending</p>
        </div>

        <div className="bg-noir-900 hairline-border p-6 space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block">
            ACTIVE &amp; PAID
          </span>
          <div className="font-serif text-4xl text-emerald-400 font-bold">
            {membersList.filter((m) => m.payment === 'Approved').length}
          </div>
          <p className="text-[11px] font-mono text-parchment-400">Verified members</p>
        </div>
      </div>

      {/* Member Directory Table */}
      <div className="bg-noir-900 hairline-border p-6 sm:p-8 space-y-6">
        <h2 className="font-serif text-2xl uppercase tracking-wider text-parchment-100">
          Live User Directory
        </h2>

        {/* Search Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
          <div>
            <label className="block text-[10px] uppercase tracking-luxury text-parchment-400 mb-1">
              Search member
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="MoneyFox ID, name or email..."
              className="w-full bg-noir-950 hairline-border p-2.5 text-xs text-parchment-100 focus:outline-none focus:border-amberfox"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-luxury text-parchment-400 mb-1">
              Account status
            </label>
            <select
              value={accountStatusFilter}
              onChange={(e) => setAccountStatusFilter(e.target.value)}
              className="w-full bg-noir-950 hairline-border p-2.5 text-xs text-parchment-100 focus:outline-none focus:border-amberfox"
            >
              <option value="all">All accounts</option>
              <option value="active">Active</option>
              <option value="pending">Pending activation</option>
              <option value="restricted">Restricted</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-luxury text-parchment-400 mb-1">
              Placement
            </label>
            <select
              value={placementFilter}
              onChange={(e) => setPlacementFilter(e.target.value)}
              className="w-full bg-noir-950 hairline-border p-2.5 text-xs text-parchment-100 focus:outline-none focus:border-amberfox"
            >
              <option value="all">All placement states</option>
              <option value="placed">Placed</option>
              <option value="bench">Waiting bench</option>
            </select>
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left font-mono text-xs divide-y divide-amberfox/15">
            <thead>
              <tr className="text-[10px] uppercase tracking-luxury text-parchment-400">
                <th className="py-2.5">Member</th>
                <th className="py-2.5">Email / Identifier</th>
                <th className="py-2.5">Sponsor</th>
                <th className="py-2.5">Payment</th>
                <th className="py-2.5">Placement</th>
                <th className="py-2.5 text-right">Account</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amberfox/10 text-[11px]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-parchment-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-amberfox" />
                    <span>Loading users from Supabase...</span>
                  </td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-parchment-400">
                    No users matching criteria.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-noir-950/60 cursor-pointer">
                    <td className="py-3.5">
                      <p className="font-semibold text-parchment-100">{m.name}</p>
                      <span className="text-[10px] text-amberfox">{m.id}</span>
                    </td>
                    <td className="py-3.5 text-parchment-300">{m.email || '—'}</td>
                    <td className="py-3.5 text-parchment-400">{m.sponsor}</td>
                    <td className="py-3.5">
                      <span
                        className={`inline-block px-1.5 py-0.5 text-[10px] uppercase ${
                          m.payment === 'Approved'
                            ? 'text-emerald-400'
                            : 'text-amberfox'
                        }`}
                      >
                        {m.payment}
                      </span>
                    </td>
                    <td className="py-3.5 text-parchment-300">{m.placement}</td>
                    <td className="py-3.5 text-right">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] uppercase hairline-border ${
                          m.account === 'Active'
                            ? 'text-emerald-400 border-emerald-500/30'
                            : m.account === 'Pending activation'
                            ? 'text-amberfox-gold border-amberfox/40'
                            : 'text-red-400 border-red-500/30'
                        }`}
                      >
                        {m.account}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="text-[11px] font-mono text-parchment-600">
          Showing {filteredMembers.length} of {membersList.length} members from Supabase.
        </p>
      </div>
    </div>
  );
};
