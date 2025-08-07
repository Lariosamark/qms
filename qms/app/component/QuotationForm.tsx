'use client';

import { useState, useRef } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

type Item = {
  qty: string;
  description: string;
  unitPrice: string;
  total: string;
};

export default function QuotationForm() {
  const router = useRouter();
  const printRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    position: '',
    address: '',
    through: '',
    refNo: '',
    date: '',
    subject: '',
    description: '',
    items: [{ qty: '', description: '', unitPrice: '', total: '' }] as Item[],
  });

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { qty: '', description: '', unitPrice: '', total: '' }],
    });
  };

  const updateItem = (index: number, field: keyof Item, value: string) => {
    const updated = [...formData.items];
    updated[index] = { ...updated[index], [field]: value };

    if (field === 'qty' || field === 'unitPrice') {
      const qty = parseFloat(updated[index].qty || '0');
      const price = parseFloat(updated[index].unitPrice || '0');
      updated[index].total = (qty * price).toFixed(2);
    }

    setFormData({ ...formData, items: updated });
  };

  const totalPrice = formData.items.reduce((sum, item) => sum + parseFloat(item.total || '0'), 0);
  const vat = totalPrice * 0.12;
  const grandTotal = totalPrice + vat;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, 'quotations'), {
      ...formData,
      totalPrice,
      vat,
      grandTotal,
      createdAt: Timestamp.now(),
    });
    alert('Quotation submitted!');
    router.refresh();
  };

  return (
    <div className="flex justify-center px-2 sm:px-4">
      <div className="w-full max-w-7xl p-4 sm:p-6 md:p-8 bg-white shadow-md border rounded-lg" ref={printRef}>
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Quotation Form</h2>

        <form onSubmit={handleSubmit} className="space-y-6 text-sm">
          {/* Grid Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="border p-2 rounded w-full"
              required
            />
            <input
              placeholder="Reference No."
              value={formData.refNo}
              onChange={(e) => setFormData({ ...formData, refNo: e.target.value })}
              className="border p-2 rounded w-full"
              required
            />
            <input
              placeholder="Customer Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border p-2 rounded w-full md:col-span-2"
              required
            />
            <input
              placeholder="Position"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              className="border p-2 rounded w-full md:col-span-2"
            />
            <input
              placeholder="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="border p-2 rounded w-full md:col-span-2"
            />
            <input
              placeholder="Through"
              value={formData.through}
              onChange={(e) => setFormData({ ...formData, through: e.target.value })}
              className="border p-2 rounded w-full md:col-span-2"
            />
            <input
              placeholder="Subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="border p-2 rounded w-full md:col-span-2"
            />
          </div>

          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full border p-2 rounded h-24"
          />

          {/* Items Table */}
          <div>
            <h3 className="font-semibold mb-2">Items</h3>
            <div className="overflow-auto">
              <table className="min-w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">Qty</th>
                    <th className="border p-2">Description</th>
                    <th className="border p-2">Unit Price</th>
                    <th className="border p-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items.map((item, i) => (
                    <tr key={i}>
                      <td className="border p-2">
                        <input
                          type="number"
                          className="w-full"
                          value={item.qty}
                          onChange={(e) => updateItem(i, 'qty', e.target.value)}
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          className="w-full"
                          value={item.description}
                          onChange={(e) => updateItem(i, 'description', e.target.value)}
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="number"
                          className="w-full"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(i, 'unitPrice', e.target.value)}
                        />
                      </td>
                      <td className="border p-2 text-right">{item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              type="button"
              onClick={addItem}
              className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              + Add Item
            </button>
          </div>

          {/* Totals */}
          <div className="text-right space-y-1">
            <p>Total: <strong>₱ {totalPrice.toFixed(2)}</strong></p>
            <p>VAT (12%): <strong>₱ {vat.toFixed(2)}</strong></p>
            <p>Grand Total: <strong>₱ {grandTotal.toFixed(2)}</strong></p>
          </div>

          {/* Submit Button */}
          <div className="flex flex-wrap justify-end gap-4 mt-6">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Submit Quotation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
