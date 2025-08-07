'use client';

import { useRef } from 'react';

type Props = {
  quotation: any;
};

export default function QuotationPreview({ quotation }: Props) {
  const q = quotation;
  const printRef = useRef<HTMLDivElement | null>(null);

  const handlePrint = () => {
    if (!printRef.current) return;

    const printContents = printRef.current.innerHTML;
    const printWindow = window.open('', '', 'width=800,height=600');

    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 1rem;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 1rem;
              }
              td, th {
                border: 1px solid #999;
                padding: 8px;
              }
              .signature {
                margin-top: 4rem;
                display: flex;
                justify-content: space-between;
              }
              .signature-box {
                width: 45%;
                text-align: center;
              }
              .signature-line {
                border-top: 1px solid #000;
                margin-top: 3rem;
              }
              img.logo {
                max-width: 800px;
                height: auto;
                margin: 0 auto 1rem;
                display: block;
              }
              .ref-date {
                text-align: right;
                margin-top: -1rem;
                margin-bottom: 1.5rem;
                font-size: 0.95rem;
              }
                .total{
                 text-align: right;
                margin-top: 0rem;
                margin-bottom: 1.5rem;
                font-size: 0.95rem;
                }
            </style>
          </head>
          <body>
            <div class="text-center">
              <img src="/logo1.png" alt="Multifactors Logo" class="logo" />
            </div>


            ${printContents}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }
  };

  return (
    <div>
      {/* Print Button */}
      <div className="text-right mb-4">
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          🖨️ Print
        </button>
      </div>

      {/* Printable Area */}
      <div
        ref={printRef}
        className="w-[210mm] min-h-[297mm] mx-auto bg-white text-black px-12 py-8 text-sm"
        style={{ fontFamily: 'Arial, sans-serif' }}
      >
        {/* Header Info */}
        <div className="mb-4 space-y-1">
            <div className="ref-date">
              <div><strong>Reference No:</strong> {q.refNo}</div>
              <div><strong>Date:</strong> {q.date}</div>
            </div>
          <p><strong>Customer Name:</strong> {q.name}</p>
          {q.position && <p><strong>Position:</strong> {q.position}</p>}
          {q.address && <p><strong>Address:</strong> {q.address}</p>}
          {q.through && <p><strong>Through:</strong> {q.through}</p>}
          {q.subject && <p><strong>Subject:</strong> {q.subject}</p>}
        </div>

        {/* Description */}
        {q.description && (
          <div className="mt-4 mb-6">
            <p className="whitespace-pre-line">
              <strong>Description:</strong><br />
              {q.description}
            </p>
          </div>
        )}

        {/* Items Table */}
        {q.items && q.items.length > 0 && (
          <table className="w-full text-sm border border-gray-300 border-collapse mb-6">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 p-2">Qty</th>
                <th className="border border-gray-300 p-2">Description</th>
                <th className="border border-gray-300 p-2 text-right">Unit Price</th>
                <th className="border border-gray-300 p-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {q.items.map((item: any, idx: number) => (
                <tr key={idx}>
                  <td className="border border-gray-300 p-2 text-center">{item.qty}</td>
                  <td className="border border-gray-300 p-2">{item.description}</td>
                  <td className="border border-gray-300 p-2 text-right">
                    ₱ {parseFloat(item.unitPrice || '0').toFixed(2)}
                  </td>
                  <td className="border border-gray-300 p-2 text-right">
                    ₱ {parseFloat(item.total || '0').toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Totals */}
        <div className="total">
          <p><strong>Total:</strong> ₱ {Number(q.totalPrice || 0).toFixed(2)}</p>
          <p><strong>VAT (12%):</strong> ₱ {Number(q.vat || 0).toFixed(2)}</p>
          <p><strong>Grand Total:</strong> <span className="font-bold">₱ {Number(q.grandTotal || 0).toFixed(2)}</span></p>
        </div>

        {/* Signatures */}
        <div className="signature mt-16 flex justify-between">
          <div className="signature-box">
            <div className="signature-line"></div>
            <p className="text-sm mt-1">Prepared by</p>
          </div>
          <div className="signature-box">
            <div className="signature-line"></div>
            <p className="text-sm mt-1">Approved by</p>
          </div>
        </div>
      </div>
    </div>
  );
}
