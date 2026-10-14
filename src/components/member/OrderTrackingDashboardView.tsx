import React, { useState } from 'react';
import {
  Truck,
  Package,
  CheckCircle2,
  Clock,
  ExternalLink,
  Search,
  MapPin,
  ArrowRight,
  ShieldCheck,
  FileText,
  AlertCircle,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';
import { BRAND_ASSETS, INITIAL_ORDERS } from '../../data/mockData';
import { OrderRecord } from '../../types';

interface OrderTrackingDashboardProps {
  onSelectOrderDetail: (order: OrderRecord) => void;
  onOpenInvoice: (order: OrderRecord) => void;
  onOpenConcierge: () => void;
}

export type TrackingStatusFilter = 'all' | 'processing' | 'shipped' | 'delivered';

export const OrderTrackingDashboardView: React.FC<OrderTrackingDashboardProps> = ({
  onSelectOrderDetail,
  onOpenInvoice,
  onOpenConcierge,
}) => {
  const [activeFilter, setActiveFilter] = useState<TrackingStatusFilter>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(INITIAL_ORDERS[0].orderId);

  // Helper to map order status into the 3 standardized categories
  const getNormalizedStatus = (status: OrderRecord['shipmentStatus']): 'Processing' | 'Shipped' | 'Delivered' => {
    if (status === 'Delivered') return 'Delivered';
    if (status === 'In transit') return 'Shipped';
    return 'Processing'; // 'Preparing' or 'Verification pending'
  };

  const getStatusBadgeStyle = (status: 'Processing' | 'Shipped' | 'Delivered') => {
    switch (status) {
      case 'Delivered':
        return 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40';
      case 'Shipped':
        return 'text-amberfox-gold border-amberfox/50 bg-amber-950/40';
      case 'Processing':
        return 'text-amberfox border-amberfox/40 bg-noir-900';
    }
  };

  const getStepProgressIndex = (status: 'Processing' | 'Shipped' | 'Delivered', stage: number) => {
    if (status === 'Delivered') return 3; // all completed
    if (status === 'Shipped') return 2;
    return stage > 1 ? 1 : 0;
  };

  const filteredOrders = INITIAL_ORDERS.filter((order) => {
    const norm = getNormalizedStatus(order.shipmentStatus).toLowerCase();
    const matchesFilter = activeFilter === 'all' || norm === activeFilter;
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.utrNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.invoiceId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const processingCount = INITIAL_ORDERS.filter((o) => getNormalizedStatus(o.shipmentStatus) === 'Processing').length;
  const shippedCount = INITIAL_ORDERS.filter((o) => getNormalizedStatus(o.shipmentStatus) === 'Shipped').length;
  const deliveredCount = INITIAL_ORDERS.filter((o) => getNormalizedStatus(o.shipmentStatus) === 'Delivered').length;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div>
        <p className="text-xs font-mono uppercase tracking-luxury text-amberfox-gold">
          PRIVATE GUILD / LOGISTICS &amp; FULFILLMENT
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-parchment-100 uppercase tracking-wider mt-1">
          Order Tracking
        </h1>
        <p className="text-xs text-parchment-400 font-light mt-1">
          Consignment status telemetry across Processing, Shipped and Doorstep Delivered stages.
        </p>
      </div>

      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-noir-900 hairline-border p-6 space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block">
            TOTAL ACTIVE ORDERS
          </span>
          <div className="font-serif text-4xl text-parchment-100 font-bold">{INITIAL_ORDERS.length}</div>
          <p className="text-[11px] font-mono text-parchment-400">All registered garment orders</p>
        </div>

        <div
          onClick={() => setActiveFilter('processing')}
          className={`bg-noir-900 hairline-border p-6 space-y-2 cursor-pointer transition-colors ${
            activeFilter === 'processing' ? 'border-amberfox ring-1 ring-amberfox' : 'hover:border-amberfox/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox block">
              PROCESSING
            </span>
            <span className="w-2 h-2 rounded-full bg-amberfox animate-pulse" />
          </div>
          <div className="font-serif text-4xl text-amberfox font-bold">{processingCount}</div>
          <p className="text-[11px] font-mono text-parchment-400">Packaging &amp; manual review</p>
        </div>

        <div
          onClick={() => setActiveFilter('shipped')}
          className={`bg-noir-900 hairline-border p-6 space-y-2 cursor-pointer transition-colors ${
            activeFilter === 'shipped' ? 'border-amberfox ring-1 ring-amberfox' : 'hover:border-amberfox/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block">
              SHIPPED
            </span>
            <Truck className="w-3.5 h-3.5 text-amberfox-gold" />
          </div>
          <div className="font-serif text-4xl text-amberfox-gold font-bold">{shippedCount}</div>
          <p className="text-[11px] font-mono text-parchment-400">In transit • BlueDart Apex</p>
        </div>

        <div
          onClick={() => setActiveFilter('delivered')}
          className={`bg-noir-900 hairline-border p-6 space-y-2 cursor-pointer transition-colors ${
            activeFilter === 'delivered' ? 'border-amberfox ring-1 ring-amberfox' : 'hover:border-amberfox/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-luxury text-emerald-400 block">
              DELIVERED
            </span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="font-serif text-4xl text-emerald-400 font-bold">{deliveredCount}</div>
          <p className="text-[11px] font-mono text-parchment-400">Completed doorstep handoff</p>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="bg-noir-900 hairline-border p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 hairline-border-b">
          {/* Segmented Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-2 uppercase tracking-wider transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-amberfox text-noir-950 font-bold shadow-amber-glow'
                  : 'bg-noir-950 hairline-border text-parchment-300 hover:border-amberfox hover:text-parchment-100'
              }`}
            >
              All Orders ({INITIAL_ORDERS.length})
            </button>
            <button
              onClick={() => setActiveFilter('processing')}
              className={`px-3.5 py-2 uppercase tracking-wider transition-all cursor-pointer ${
                activeFilter === 'processing'
                  ? 'bg-amberfox text-noir-950 font-bold shadow-amber-glow'
                  : 'bg-noir-950 hairline-border text-parchment-300 hover:border-amberfox hover:text-parchment-100'
              }`}
            >
              Processing ({processingCount})
            </button>
            <button
              onClick={() => setActiveFilter('shipped')}
              className={`px-3.5 py-2 uppercase tracking-wider transition-all cursor-pointer ${
                activeFilter === 'shipped'
                  ? 'bg-amberfox text-noir-950 font-bold shadow-amber-glow'
                  : 'bg-noir-950 hairline-border text-parchment-300 hover:border-amberfox hover:text-parchment-100'
              }`}
            >
              Shipped ({shippedCount})
            </button>
            <button
              onClick={() => setActiveFilter('delivered')}
              className={`px-3.5 py-2 uppercase tracking-wider transition-all cursor-pointer ${
                activeFilter === 'delivered'
                  ? 'bg-amberfox text-noir-950 font-bold shadow-amber-glow'
                  : 'bg-noir-950 hairline-border text-parchment-300 hover:border-amberfox hover:text-parchment-100'
              }`}
            >
              Delivered ({deliveredCount})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72 font-mono text-xs">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search reference, SKU or UTR..."
              className="w-full bg-noir-950 hairline-border pl-8 pr-3 py-2 text-xs text-parchment-100 focus:outline-none focus:border-amberfox"
            />
            <Search className="w-3.5 h-3.5 text-parchment-500 absolute left-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Consignment Cards List */}
        <div className="space-y-6">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => {
              const normalizedStatus = getNormalizedStatus(order.shipmentStatus);
              const progressIdx = getStepProgressIndex(normalizedStatus, order.stage);
              const isExpanded = expandedOrderId === order.orderId;

              const stages = [
                { title: 'Order Confirmed', detail: 'Statutory GST file generated' },
                { title: 'Processing', detail: 'Packing & QA inspection' },
                { title: 'Shipped', detail: order.carrier },
                { title: 'Delivered', detail: 'Doorstep handoff' },
              ];

              return (
                <div
                  key={order.orderId}
                  className="bg-noir-950 hairline-border p-6 hover:border-amberfox/40 transition-all duration-300 space-y-6"
                >
                  {/* Card Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 hairline-border-b">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-serif text-lg text-parchment-100 font-semibold uppercase tracking-wider">
                        {order.orderId}
                      </span>
                      <span
                        className={`inline-block px-2.5 py-0.5 text-[10px] uppercase font-mono tracking-luxury hairline-border ${getStatusBadgeStyle(
                          normalizedStatus
                        )}`}
                      >
                        {normalizedStatus}
                      </span>
                      <span className="font-mono text-xs text-parchment-400">
                        Date: {order.date}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 font-mono text-xs">
                      <span className="font-serif text-lg font-bold text-amberfox">₹{order.total}</span>
                      <span className="text-[10px] text-parchment-500">(12% GST INCL.)</span>
                    </div>
                  </div>

                  {/* Merchandise Brief & Multi-Step Progress Tracker */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    {/* Merchandise Snapshot */}
                    <div className="lg:col-span-4 flex items-center space-x-4">
                      <div className="w-16 h-16 bg-noir-850 hairline-border shrink-0 overflow-hidden">
                        <img
                          src={
                            order.productName.includes('Ivory') || order.productName.includes('White')
                              ? BRAND_ASSETS.ivoryTeeImage
                              : BRAND_ASSETS.noirTeeImage
                          }
                          alt={order.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="font-mono text-xs">
                        <p className="font-serif text-sm font-semibold text-parchment-100">
                          {order.productName}
                        </p>
                        <p className="text-parchment-400 text-[11px] mt-0.5">Size {order.size} • Qty {order.quantity}</p>
                        <p className="text-[10px] text-amberfox-gold mt-1">UTR: {order.utrNumber}</p>
                      </div>
                    </div>

                    {/* Visual 4-Step Progress Line */}
                    <div className="lg:col-span-8 space-y-2">
                      <div className="grid grid-cols-4 gap-2 text-center font-mono">
                        {stages.map((stg, sIdx) => {
                          const isDone = sIdx < progressIdx;
                          const isCurrent = sIdx === progressIdx;

                          return (
                            <div key={sIdx} className="space-y-1">
                              <div className="flex items-center justify-center">
                                <div
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                    isDone
                                      ? 'bg-amberfox text-noir-950'
                                      : isCurrent
                                      ? 'bg-amberfox text-noir-950 ring-2 ring-amberfox/40 animate-pulse'
                                      : 'bg-noir-900 border border-parchment-600 text-parchment-600'
                                  }`}
                                >
                                  {isDone ? '✓' : sIdx + 1}
                                </div>
                              </div>
                              <p
                                className={`text-[11px] font-semibold uppercase tracking-wider truncate ${
                                  isDone || isCurrent ? 'text-parchment-100' : 'text-parchment-600'
                                }`}
                              >
                                {stg.title}
                              </p>
                              <p className="text-[9px] text-parchment-400 font-light truncate hidden sm:block">
                                {stg.detail}
                              </p>
                            </div>
                          );
                        })}
                      </div>

                      {/* Horizontal connecting track */}
                      <div className="w-full bg-noir-900 h-1.5 overflow-hidden flex">
                        <div
                          style={{
                            width:
                              progressIdx === 3
                                ? '100%'
                                : progressIdx === 2
                                ? '66%'
                                : progressIdx === 1
                                ? '33%'
                                : '10%',
                          }}
                          className="bg-amberfox transition-all duration-500 shadow-amber-glow"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Consignment Address & Waybill Dossier */}
                  <div className="bg-noir-900/60 hairline-border p-4 grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                    <div>
                      <span className="text-[10px] uppercase text-amberfox tracking-luxury block mb-0.5">
                        DISPATCH CARRIER
                      </span>
                      <p className="text-parchment-200 font-semibold">{order.carrier}</p>
                      <p className="text-[10px] text-parchment-400">Waybill: BLU-AIR-{order.orderId.replace('ORD-', '')}</p>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase text-amberfox tracking-luxury block mb-0.5">
                        DESTINATION ADDRESS
                      </span>
                      <p className="text-parchment-300 text-[11px] truncate">
                        {order.deliveryAddress.apartment}, {order.deliveryAddress.street}
                      </p>
                      <p className="text-[10px] text-parchment-400">{order.deliveryAddress.city} • PIN {order.deliveryAddress.pinCode}</p>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase text-amberfox tracking-luxury block mb-0.5">
                        STATUTORY TAX RECEIPT
                      </span>
                      <p className="text-amberfox-gold text-[11px] font-semibold">{order.invoiceId}</p>
                      <button
                        onClick={() => onOpenInvoice(order)}
                        className="text-[10px] text-parchment-300 hover:text-amberfox inline-flex items-center gap-1 cursor-pointer mt-0.5"
                      >
                        <FileText className="w-3 h-3 text-amberfox" />
                        <span>View / Print GST Invoice</span>
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons Row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center space-x-2 text-[11px] font-mono text-parchment-400">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Tamper-evident seal verified • BlueDart Air tracking synchronized</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => onOpenInvoice(order)}
                        className="hairline-border px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider text-parchment-300 hover:border-amberfox hover:text-amberfox cursor-pointer flex items-center gap-1"
                      >
                        <span>Invoice</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => onSelectOrderDetail(order)}
                        className="btn-gold-sheen text-noir-950 px-4 py-1.5 text-xs font-bold uppercase tracking-luxury flex items-center cursor-pointer shadow-amber-glow"
                      >
                        <span>Deep Timeline</span>
                        <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center font-mono text-xs text-parchment-400 space-y-2">
              <Package className="w-8 h-8 mx-auto text-parchment-600 mb-2" />
              <p className="text-parchment-200 font-semibold uppercase">No active orders matching this filter</p>
              <p className="text-[11px] text-parchment-500">
                Clear your search query or select "All Orders" to review all registered shipments.
              </p>
              <button
                onClick={() => {
                  setActiveFilter('all');
                  setSearchTerm('');
                }}
                className="mt-2 hairline-border px-4 py-1.5 uppercase tracking-luxury text-[10px] text-amberfox hover:border-amberfox cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Logistics & Air Waybill Assistance Notice */}
      <div className="border-l-2 border-amberfox bg-noir-900 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
        <div>
          <h4 className="font-serif text-sm text-amberfox font-semibold uppercase tracking-luxury">
            Need consignment expedited or delivery rescheduling?
          </h4>
          <p className="text-[11px] text-parchment-400 font-light mt-1">
            Our central concierge coordinates directly with BlueDart Apex Air hubs for pan-India consignments.
          </p>
        </div>
        <button
          onClick={onOpenConcierge}
          className="hairline-border px-5 py-2.5 uppercase tracking-luxury text-parchment-200 hover:border-amberfox hover:text-amberfox whitespace-nowrap cursor-pointer shrink-0"
        >
          CONTACT CONCIERGE DESK →
        </button>
      </div>
    </div>
  );
};
