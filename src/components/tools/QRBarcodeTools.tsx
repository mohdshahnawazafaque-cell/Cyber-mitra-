import React, { useState } from 'react';
import { QrCode, Download, Link, Type } from 'lucide-react';
import { Language } from '../../types';

interface QRBarcodeToolsProps {
  language: Language;
}

export const QRBarcodeTools: React.FC<QRBarcodeToolsProps> = ({ language }) => {
  const isHindi = language === 'hi';
  const [qrText, setQrText] = useState('https://cybermitra.in');
  const [size, setSize] = useState('200');

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(qrText || 'Cyber Mitra')}`;

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shadow-sm">
          <QrCode className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-800">
            {isHindi ? 'QR कोड जनरेटर' : 'QR Code Generator'}
          </h2>
          <p className="text-sm text-slate-500">
            {isHindi ? 'URL, टेक्स्ट या मोबाइल नंबर से QR कोड बनाएं' : 'Create QR code from URL, Text or Mobile Number'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">{isHindi ? 'डेटा डालें (Text / URL)' : 'Enter Data (Text / URL)'}</label>
            <textarea 
              value={qrText} 
              onChange={(e) => setQrText(e.target.value)} 
              className="w-full p-3 border border-slate-300 rounded-lg h-32 resize-none"
              placeholder="https://... or Any Text"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">{isHindi ? 'साइज चुनें (Size)' : 'Select Size'}</label>
            <select value={size} onChange={(e) => setSize(e.target.value)} className="w-full p-3 border border-slate-300 rounded-lg">
              <option value="150">150 x 150 px</option>
              <option value="200">200 x 200 px</option>
              <option value="300">300 x 300 px</option>
              <option value="500">500 x 500 px (HD)</option>
            </select>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center space-y-6">
          <div className="p-4 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50">
            {qrText ? (
              <img src={qrImageUrl} alt="QR Code" className="rounded-lg shadow-sm" style={{ width: `${size}px`, height: `${size}px` }} />
            ) : (
              <div className="w-[200px] h-[200px] flex items-center justify-center text-slate-400">
                <QrCode className="w-16 h-16 opacity-50" />
              </div>
            )}
          </div>
          <a
            href={qrImageUrl}
            download={`QR_Code_${Date.now()}.png`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            {isHindi ? 'QR कोड डाउनलोड करें' : 'Download QR Code'}
          </a>
        </div>
      </div>
    </div>
  );
};