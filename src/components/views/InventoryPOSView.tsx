import React, { useState } from 'react';
import { useDigits } from '../../context/DigitsContext';
import {
  Boxes,
  Barcode,
  Printer,
  Sparkles,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Package,
  Layers,
  ArrowRight,
  TrendingDown
} from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  hsnCode: string;
  category: 'Pharmaceutical' | 'Electronics' | 'FMCG / Trade' | 'Commodity';
  primaryUOM: string; // e.g. Box
  secondaryUOM: string; // e.g. Strip
  tertiaryUOM: string; // e.g. Tablet
  convRatio1to2: number; // 1 Box = 10 Strips
  convRatio2to3: number; // 1 Strip = 10 Tablets
  stockPrimaryQty: number; // In Boxes
  stockTertiaryTotal: number; // Total Tablets
  mrp: number; // Maximum Retail Price (inclusive of tax)
  wholesalePrice: number; // Before tax
  gstRate: number; // 18% or 12%
  batchNumber?: string;
  expiryDate?: string;
  imeiTracking?: boolean;
}

export const InventoryPOSView: React.FC = () => {
  const { currentEntity, formatAmount, showNotification } = useDigits();

  const [activeTab, setActiveTab] = useState<'inventory' | 'pos'>('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [posCart, setPosCart] = useState<{ item: InventoryItem; qtyTertiary: number }[]>([]);
  const [barcodeInput, setBarcodeInput] = useState('');

  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: 'inv-item-1',
      name: 'Augmentin 625 Duo Tablets (Pharma)',
      hsnCode: '300420',
      category: 'Pharmaceutical',
      primaryUOM: 'Box',
      secondaryUOM: 'Strip',
      tertiaryUOM: 'Tablet',
      convRatio1to2: 10,
      convRatio2to3: 10,
      stockPrimaryQty: 45,
      stockTertiaryTotal: 4500,
      mrp: 220,
      wholesalePrice: 160,
      gstRate: 12,
      batchNumber: 'AUG-24-0982',
      expiryDate: '2026-04-30'
    },
    {
      id: 'inv-item-2',
      name: 'Apple iPad Pro M4 256GB (Electronics)',
      hsnCode: '847130',
      category: 'Electronics',
      primaryUOM: 'Master Carton',
      secondaryUOM: 'Pack',
      tertiaryUOM: 'Unit',
      convRatio1to2: 5,
      convRatio2to3: 1,
      stockPrimaryQty: 6,
      stockTertiaryTotal: 30,
      mrp: 99900,
      wholesalePrice: 82000,
      gstRate: 18,
      imeiTracking: true
    },
    {
      id: 'inv-item-3',
      name: 'Tata Steel TMT Rebars 12mm (Commodity)',
      hsnCode: '721420',
      category: 'Commodity',
      primaryUOM: 'Metric Ton (MT)',
      secondaryUOM: 'Quintal (Qtl)',
      tertiaryUOM: 'Kilogram (Kg)',
      convRatio1to2: 10,
      convRatio2to3: 100,
      stockPrimaryQty: 18,
      stockTertiaryTotal: 18000,
      mrp: 75,
      wholesalePrice: 58,
      gstRate: 18
    },
    {
      id: 'inv-item-4',
      name: 'Premium Basmati Rice 25Kg (FMCG)',
      hsnCode: '100630',
      category: 'FMCG / Trade',
      primaryUOM: 'Pallet',
      secondaryUOM: 'Bag (25Kg)',
      tertiaryUOM: 'Kg',
      convRatio1to2: 40,
      convRatio2to3: 25,
      stockPrimaryQty: 8,
      stockTertiaryTotal: 8000,
      mrp: 140,
      wholesalePrice: 110,
      gstRate: 5,
      batchNumber: 'BAS-OCT26-04'
    }
  ]);

  const handleAddToCart = (item: InventoryItem, qty: number = 10) => {
    setPosCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      if (existing) {
        return prev.map((c) => (c.item.id === item.id ? { ...c, qtyTertiary: c.qtyTertiary + qty } : c));
      }
      return [...prev, { item, qtyTertiary: qty }];
    });
    showNotification(`Added ${qty} ${item.tertiaryUOM}s of ${item.name} to POS Cart.`);
  };

  const handlePrintReceipt = () => {
    showNotification('Thermal POS 80mm Receipt dispatched to printer.');
  };

  const cartTotal = posCart.reduce((sum, c) => {
    // Back-calculate taxable from MRP
    const pricePerUnit = c.item.mrp;
    return sum + pricePerUnit * c.qtyTertiary;
  }, 0);

  const cartGst = cartTotal - cartTotal / 1.18;
  const cartTaxable = cartTotal - cartGst;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#006948]/10 text-[#006948]">
              <Boxes className="w-5 h-5 stroke-[2.2]" />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-[#131b2e]">
              Multi-Unit Inventory (3-UOM) & POS Billing
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#006948]/10 text-[#006948] text-[11px] font-semibold tracking-wide">
              Box → Strip → Tablet • MT → Qtl → Kg
            </span>
          </div>
          <p className="text-xs text-[#6d7a72] pl-10">
            Native support for up to 3 Units of Measurement, pharma batch/expiry tracking, IMEI serial numbers, and high-speed thermal POS retail checkout.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'inventory'
                ? 'bg-[#006948] text-white shadow-sm'
                : 'bg-white text-[#3d4a42] hover:bg-[#eaedff] border border-[#eaedff]'
            }`}
          >
            Inventory Master (3-UOM)
          </button>
          <button
            onClick={() => setActiveTab('pos')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'pos'
                ? 'bg-[#006948] text-white shadow-sm'
                : 'bg-white text-[#3d4a42] hover:bg-[#eaedff] border border-[#eaedff]'
            }`}
          >
            <Barcode className="w-3.5 h-3.5" />
            <span>POS Retail Terminal</span>
          </button>
        </div>
      </div>

      {/* 4 Inventory KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#6d7a72] uppercase tracking-wider">
              Total Stock Valuation
            </span>
            <span className="p-1.5 rounded-lg bg-[#006948]/10 text-[#006948]">
              <Package className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-[#131b2e]">
              {formatAmount(3850000)}
            </div>
            <div className="text-[11px] text-[#006948] mt-1 font-medium">
              4 Active Warehouse Locations
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#6d7a72] uppercase tracking-wider">
              Multi-UOM Items Active
            </span>
            <span className="p-1.5 rounded-lg bg-[#006948]/10 text-[#006948]">
              <Layers className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-[#006948]">
              100% 3-UOM Linked
            </div>
            <div className="text-[11px] text-[#6d7a72] mt-1 font-medium">
              Primary, Secondary & Tertiary
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#6d7a72] uppercase tracking-wider">
              Pharma Expiry Watch
            </span>
            <span className="p-1.5 rounded-lg bg-[#3b82f6]/10 text-[#3b82f6]">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-[#131b2e]">
              1 Batch (2026-04)
            </div>
            <div className="text-[11px] text-[#6d7a72] mt-1 font-medium">
              Batch #AUG-24-0982 safe &gt; 180d
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#6d7a72] uppercase tracking-wider">
              POS Daily Counter Billing
            </span>
            <span className="p-1.5 rounded-lg bg-[#ea580c]/10 text-[#ea580c]">
              <Barcode className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-[#131b2e]">
              {formatAmount(142500)}
            </div>
            <div className="text-[11px] text-[#6d7a72] mt-1 font-medium">
              Auto-reconciled with Day Cash
            </div>
          </div>
        </div>
      </div>

      {/* Tab 1: Inventory Master with 3-UOM Hierarchy */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] shadow-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#eaedff] bg-[#f8f9ff]/70 text-[10px] font-mono text-[#6d7a72] uppercase tracking-wider">
                  <th className="py-3 px-4">Item Name & HSN</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">3-UOM Hierarchy (Conversion Ratios)</th>
                  <th className="py-3 px-4">Current Stock</th>
                  <th className="py-3 px-4">Wholesale vs MRP</th>
                  <th className="py-3 px-4">Batch / IMEI Status</th>
                  <th className="py-3 px-4 text-right">Quick POS Add</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eaedff] font-medium">
                {inventory.map((item) => (
                  <tr key={item.id} className="hover:bg-[#f2f3ff]/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#131b2e]">{item.name}</div>
                      <div className="font-mono text-[10px] text-[#006948] font-bold">
                        HSN {item.hsnCode} • GST {item.gstRate}%
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#f2f3ff] text-[#3d4a42] border border-[#eaedff]">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      <div className="flex items-center gap-1.5 text-[#131b2e] font-semibold">
                        <span>1 {item.primaryUOM}</span>
                        <ArrowRight className="w-3 h-3 text-[#6d7a72]" />
                        <span>{item.convRatio1to2} {item.secondaryUOM}s</span>
                        <ArrowRight className="w-3 h-3 text-[#6d7a72]" />
                        <span>{item.convRatio1to2 * item.convRatio2to3} {item.tertiaryUOM}s</span>
                      </div>
                      <div className="text-[10px] text-[#6d7a72] mt-0.5">
                        Native Indian multi-tier unit conversion
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-[#131b2e]">
                        {item.stockPrimaryQty} {item.primaryUOM}s
                      </div>
                      <div className="text-[10px] text-[#006948]">
                        ({item.stockTertiaryTotal.toLocaleString('en-IN')} {item.tertiaryUOM}s total)
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <div className="text-[#131b2e] font-bold">
                        MRP: ₹{item.mrp.toLocaleString('en-IN')} <span className="text-[10px] text-[#6d7a72] font-normal">(incl tax)</span>
                      </div>
                      <div className="text-[10px] text-[#6d7a72]">
                        Wholesale: ₹{item.wholesalePrice.toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      {item.batchNumber ? (
                        <div>
                          <div className="font-bold text-[#131b2e]">Batch: {item.batchNumber}</div>
                          <div className="text-[10px] text-[#006948]">Exp: {item.expiryDate}</div>
                        </div>
                      ) : item.imeiTracking ? (
                        <span className="text-[10px] font-bold text-[#3b82f6] bg-[#3b82f6]/10 px-2 py-0.5 rounded">
                          IMEI / Serial Serialized
                        </span>
                      ) : (
                        <span className="text-[#6d7a72]">Standard Stock</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleAddToCart(item, item.convRatio2to3 || 10)}
                        className="px-3 py-1.5 rounded-lg bg-[#006948] hover:bg-[#00855d] text-white font-semibold text-[11px] shadow-sm transition-all"
                      >
                        + Add to POS
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: POS Retail Terminal & Thermal Receipt Preview */}
      {activeTab === 'pos' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Counter Items Grid */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#eaedff] flex items-center gap-3">
              <Barcode className="w-5 h-5 text-[#006948]" />
              <input
                type="text"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                placeholder="Scan barcode or search item name..."
                className="flex-1 bg-[#f2f3ff] rounded-xl px-4 py-2 text-xs text-[#131b2e] focus:bg-white focus:outline-none border border-transparent focus:border-[#006948]"
              />
              <button
                onClick={() => {
                  handleAddToCart(inventory[0], 10);
                  setBarcodeInput('');
                }}
                className="px-4 py-2 rounded-xl bg-[#006948] hover:bg-[#00855d] text-white text-xs font-semibold shadow-sm"
              >
                Scan (Enter)
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {inventory.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleAddToCart(item, 5)}
                  className="p-4 rounded-2xl bg-white/90 backdrop-blur-xl border border-[#eaedff] hover:border-[#006948] cursor-pointer transition-all shadow-sm group"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-[#131b2e] group-hover:text-[#006948] transition-colors">
                      {item.name}
                    </span>
                    <span className="font-mono text-xs font-bold text-[#006948]">
                      ₹{item.mrp}
                    </span>
                  </div>
                  <div className="font-mono text-[10px] text-[#6d7a72] mt-1">
                    HSN {item.hsnCode} • Unit: {item.tertiaryUOM}
                  </div>
                  <div className="mt-3 flex justify-between items-center text-[10px] text-[#6d7a72]">
                    <span>In Stock: {item.stockTertiaryTotal} {item.tertiaryUOM}s</span>
                    <span className="font-semibold text-[#006948]">+ Click to Bill</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Thermal POS Receipt Preview (80mm) */}
          <div className="p-6 rounded-3xl bg-[#faf8ff] border-2 border-[#eaedff] shadow-lg flex flex-col justify-between font-mono text-xs">
            <div className="space-y-4">
              <div className="text-center border-b-2 border-dashed border-[#d1d5db] pb-3 space-y-1">
                <div className="font-bold text-sm text-[#131b2e] uppercase">{currentEntity.name}</div>
                <div className="text-[10px] text-[#6d7a72]">GSTIN: {currentEntity.gstin || '29AABCA1234F1Z8'}</div>
                <div className="text-[10px] text-[#6d7a72]">TAX INVOICE • POS COUNTER #01</div>
                <div className="text-[10px] text-[#6d7a72]">Date: {new Date().toLocaleString('en-IN')}</div>
              </div>

              {/* Items in Cart */}
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {posCart.length === 0 ? (
                  <div className="text-center py-6 text-[#6d7a72] text-[11px]">
                    Cart is empty. Click items on the left to bill.
                  </div>
                ) : (
                  posCart.map((c, i) => (
                    <div key={i} className="flex justify-between items-center text-[11px] border-b border-[#f2f3ff] pb-1">
                      <div className="truncate pr-2">
                        <div className="font-semibold text-[#131b2e] truncate">{c.item.name}</div>
                        <div className="text-[10px] text-[#6d7a72]">
                          {c.qtyTertiary} {c.item.tertiaryUOM}s @ ₹{c.item.mrp}
                        </div>
                      </div>
                      <div className="font-bold text-[#131b2e] shrink-0">
                        ₹{(c.qtyTertiary * c.item.mrp).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Tax & Total Calculation */}
              <div className="border-t-2 border-dashed border-[#d1d5db] pt-3 space-y-1 text-xs">
                <div className="flex justify-between text-[#6d7a72]">
                  <span>Taxable Subtotal:</span>
                  <span>₹{cartTaxable.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#6d7a72]">
                  <span>CGST (9%) + SGST (9%):</span>
                  <span>₹{cartGst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-[#131b2e] pt-2 border-t border-[#eaedff]">
                  <span>Total Amount (MRP):</span>
                  <span className="text-[#006948]">₹{cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-2 border-t-2 border-dashed border-[#d1d5db]">
              <button
                onClick={handlePrintReceipt}
                disabled={posCart.length === 0}
                className="w-full py-2.5 rounded-xl bg-[#006948] hover:bg-[#00855d] text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Printer className="w-4 h-4" />
                <span>Print Thermal Receipt (80mm)</span>
              </button>

              <button
                onClick={() => setPosCart([])}
                className="w-full py-1.5 rounded-xl bg-white hover:bg-[#f2f3ff] text-[#6d7a72] text-[11px] font-semibold border border-[#eaedff] transition-all"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
