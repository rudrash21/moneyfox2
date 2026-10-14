import React, { useState } from 'react';
import { Search, ExternalLink, ArrowRight, FileText, CheckCircle2, Clock } from 'lucide-react';
import { BRAND_ASSETS, INITIAL_ORDERS } from '../../data/mockData';
import { OrderRecord } from '../../types';

interface ShopOrdersProps {
  onSelectOrderTimeline: (order: OrderRecord) => void;
  onOpenInvoice: (order: OrderRecord) => void;
}

export const ShopOrdersView: React.FC<ShopOrdersProps> = ({
  onSelectOrderTimeline,
  onOpenInvoice,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord>(INITIAL_ORDERS[0]);

  const filteredOrders = INITIAL_ORDERS.filter((order) => {
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || order.shipmentStatus.toLowerCase().includes(statusFilter.toLowerCase());
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Title & Subtitle */}
      <div>
        <p className="text-xs font-mono uppercase tracking-luxury text-amberfox-gold">
          PRIVATE GUILD / MEMBER EXPERIENCE
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-parchment-100 uppercase tracking-wider mt-1">
          Shop orders
        </h1>
        <p className="text-xs text-parchment-400 font-light mt-1">
          Your merchandise, shipment progress and invoices in one ledger.
        </p>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-noir-900 hairline-border p-6 space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-luxury text-parchment-400">
            ORDERS
          </span>
          <div className="font-serif text-4xl text-amberfox font-bold">3</div>
          <p className="text-[11px] font-mono text-parchment-400">All merchandise orders</p>
        </div>

        <div className="bg-noir-900 hairline-border p-6 space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-luxury text-parchment-400">
            IN TRANSIT
          </span>
          <div className="font-serif text-4xl text-parchment-100 font-bold">1</div>
          <p className="text-[11px] font-mono text-amberfox-gold">Noir edition • L</p>
        </div>

        <div className="bg-noir-900 hairline-border p-6 space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-luxury text-parchment-400">
            DELIVERED
          </span>
          <div className="font-serif text-4xl text-parchment-100 font-bold">1</div>
          <p className="text-[11px] font-mono text-emerald-400">Invoice available</p>
        </div>
      </div>

      {/* Order Ledger Container */}
      <div className="bg-noir-900 hairline-border p-6 sm:p-8 space-y-6">
        <h2 className="font-serif text-2xl uppercase tracking-wider text-parchment-100">
          Order ledger
        </h2>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div>
            <label className="block text-[10px] uppercase tracking-luxury text-parchment-400 mb-1">
              Search orders
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Order reference, product or invoice..."
                className="w-full bg-noir-950 hairline-border px-3 py-2.5 text-xs text-parchment-100 focus:outline-none focus:border-amberfox"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-luxury text-parchment-400 mb-1">
              Shipment status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-noir-950 hairline-border px-3 py-2.5 text-xs text-parchment-100 focus:outline-none focus:border-amberfox"
            >
              <option value="all">All statuses</option>
              <option value="transit">In transit</option>
              <option value="delivered">Delivered</option>
              <option value="pending">Verification pending</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-luxury text-parchment-400 mb-1">
              Date range
            </label>
            <input
              type="text"
              readOnly
              value="October 2025 • Current Batch"
              className="w-full bg-noir-950 hairline-border px-3 py-2.5 text-xs text-parchment-400"
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto pt-2">
          {filteredOrders.length > 0 ? (
            <table className="w-full text-left font-mono text-xs divide-y divide-amberfox/15">
              <thead>
                <tr className="text-[10px] uppercase tracking-luxury text-parchment-400">
                  <th className="py-2.5">Order / Date</th>
                  <th className="py-2.5">Merchandise</th>
                  <th className="py-2.5">Total</th>
                  <th className="py-2.5">Shipment</th>
                  <th className="py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amberfox/10 text-[11px]">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.orderId}
                    onClick={() => setSelectedOrder(order)}
                    className={`hover:bg-noir-950/60 cursor-pointer transition-colors ${
                      selectedOrder.orderId === order.orderId ? 'bg-noir-950/80' : ''
                    }`}
                  >
                    <td className="py-3.5">
                      <p className="font-semibold text-parchment-100">{order.orderId}</p>
                      <span className="text-[10px] text-parchment-400">{order.date}</span>
                    </td>
                    <td className="py-3.5 text-parchment-200">
                      {order.productName} • {order.size}
                    </td>
                    <td className="py-3.5 font-semibold text-amberfox">₹{order.total}</td>
                    <td className="py-3.5">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] uppercase tracking-luxury hairline-border ${
                          order.shipmentStatus === 'Delivered'
                            ? 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40'
                            : order.shipmentStatus === 'In transit'
                            ? 'text-amberfox-gold border-amberfox/40 bg-amber-950/40'
                            : 'text-amberfox border-amberfox/30 bg-noir-950'
                        }`}
                      >
                        {order.shipmentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 text-right space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenInvoice(order);
                        }}
                        className="text-amberfox-gold hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>View / Invoice</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-8 text-center text-xs font-mono text-parchment-400">
              No orders matched your search criteria.
            </div>
          )}
        </div>

        <div className="pt-4 flex flex-col sm:flex-row justify-between items-center text-[11px] font-mono text-parchment-600 gap-4">
          <p>Showing {filteredOrders.length} of 3 orders • ₹2,000 per unit includes 12% GST</p>
          <button
            onClick={() => window.print()}
            className="hairline-border px-3 py-1.5 hover:border-amberfox text-parchment-300 uppercase tracking-luxury text-[10px]"
          >
            EXPORT ORDER LIST
          </button>
        </div>
      </div>

      {/* Selected Order & Empty Search Showcase Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Selected Order Box */}
        <div className="lg:col-span-7 bg-noir-900 hairline-border p-6 sm:p-8 space-y-6">
          <h3 className="font-serif text-xl uppercase tracking-wider text-parchment-100">
            Selected order • {selectedOrder.orderId}
          </h3>

          <div className="flex gap-4 items-center">
            <img
              src={BRAND_ASSETS.noirTeeImage}
              alt="Noir Tee"
              className="w-20 h-20 object-cover hairline-border bg-noir-850"
            />
            <div>
              <span className="text-[10px] font-mono text-parchment-400 uppercase">NOIR EDITION • 280 GSM</span>
              <h4 className="font-serif text-lg uppercase text-parchment-100">{selectedOrder.productName}</h4>
              <p className="text-xs font-mono text-parchment-400">Size {selectedOrder.size} • Quantity 1</p>
              <p className="text-sm font-mono text-amberfox font-semibold mt-1">₹2,000 • Inclusive of 12% GST</p>
            </div>
          </div>

          <div className="inline-block bg-noir-950 hairline-border px-3 py-1 text-xs font-mono text-amberfox-gold">
            {selectedOrder.shipmentStatus} • {selectedOrder.carrier}
          </div>

          <div>
            <button
              onClick={() => onSelectOrderTimeline(selectedOrder)}
              className="btn-gold-sheen text-noir-950 px-6 py-3.5 text-xs font-bold uppercase tracking-luxury flex items-center shadow-amber-glow cursor-pointer"
            >
              <span>VIEW SHIPMENT TIMELINE</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>

        {/* Search State Inspector Box */}
        <div className="lg:col-span-5 bg-noir-900 hairline-border p-6 sm:p-8 space-y-4">
          <span className="font-mono text-[10px] uppercase tracking-luxury text-amberfox-gold block">
            SEARCH / NO MATCHES
          </span>
          <h4 className="font-serif text-xl uppercase tracking-wider text-parchment-100">
            Empty-search state
          </h4>
          <input
            type="text"
            readOnly
            value="ORD-MFX-00000"
            className="w-full bg-noir-950 hairline-border p-2.5 text-xs font-mono text-parchment-400"
          />
          <div className="border-l-2 border-amberfox bg-noir-950 p-3 text-xs font-mono space-y-1">
            <span className="text-amberfox font-semibold block">No orders match this search</span>
            <p className="text-[11px] text-parchment-400 font-light">
              Try a different order reference or clear the date and shipment filters. Your other orders are still in the ledger.
            </p>
          </div>
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}
            className="hairline-border px-4 py-2 text-xs font-mono uppercase tracking-wider text-parchment-300 hover:border-amberfox hover:text-amberfox cursor-pointer"
          >
            CLEAR SEARCH &amp; FILTERS
          </button>
        </div>
      </div>
    </div>
  );
};
