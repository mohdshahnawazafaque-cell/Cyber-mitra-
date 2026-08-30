import React, { useState, useRef, useEffect } from 'react';
import {
  Printer,
  Upload,
  Download,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  Layers,
  Settings,
  CreditCard,
  UserCheck,
  RefreshCw,
  Share2,
} from 'lucide-react';
import { CustomerData, Language, PrintJob, SessionFile } from '../../types';
import {
  generatePassportPhotoSheet,
  generateIdCardSheet,
  PassportSheetConfig,
} from '../../utils/imageUtils';

interface PrintCenterProps {
  language: Language;
  customer: CustomerData;
  printQueue: PrintJob[];
  onUpdatePrintQueue: (jobs: PrintJob[]) => void;
  onAddToWorkspace: (file: SessionFile) => void;
}

export const PrintCenter: React.FC<PrintCenterProps> = ({
  language,
  customer,
  printQueue,
  onUpdatePrintQueue,
  onAddToWorkspace,
}) => {
  const isHindi = language === 'hi';
  const passportPhotoInputRef = useRef<HTMLInputElement>(null);
  const idFrontInputRef = useRef<HTMLInputElement>(null);
  const idBackInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'passport' | 'idcard' | 'queue'>('passport');

  // Passport Sheet State
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [paperSize, setPaperSize] = useState<'4x6' | 'A4'>('4x6');
  const [photoCount, setPhotoCount] = useState<number>(6); // 4, 6, 8, 12, 16, 32
  const [showCutLines, setShowCutLines] = useState<boolean>(true);
  const [showBorders, setShowBorders] = useState<boolean>(true);
  const [stampName, setStampName] = useState<string>(customer.name || '');
  const [stampDate, setStampDate] = useState<string>(
    customer.dob ? customer.dob : ''
  );
  const [sheetPreviewUrl, setSheetPreviewUrl] = useState<string | null>(null);
  const [isGeneratingSheet, setIsGeneratingSheet] = useState<boolean>(false);

  // ID Card State
  const [idFrontUrl, setIdFrontUrl] = useState<string | null>(null);
  const [idBackUrl, setIdBackUrl] = useState<string | null>(null);
  const [idSheetPreviewUrl, setIdSheetPreviewUrl] = useState<string | null>(null);

  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Sync stamp name when customer changes
  useEffect(() => {
    if (customer.name) {
      setStampName(customer.name);
    }
  }, [customer.name]);

  // Generate Passport Sheet
  const handleGeneratePassportSheet = async () => {
    if (!photoDataUrl) return;
    setIsGeneratingSheet(true);

    let cols = 3;
    let rows = 2; // 6 photos default on 4x6

    if (paperSize === '4x6') {
      if (photoCount === 4) {
        cols = 2;
        rows = 2;
      } else if (photoCount === 6) {
        cols = 3;
        rows = 2;
      } else if (photoCount === 61) {
        cols = 6;
        rows = 1; // 6 in 1 line
      } else if (photoCount === 8) {
        cols = 4;
        rows = 2;
      } else if (photoCount === 12) {
        cols = 4;
        rows = 3; 
      } else if (photoCount === 16) {
        cols = 4;
        rows = 4; // Stamp size
      }
    } else {
      // A4 (6 photos per row for easy strip cutting)
      if (photoCount <= 6) {
        cols = 6;
        rows = 1;
      } else if (photoCount <= 12) {
        cols = 6;
        rows = 2;
      } else if (photoCount <= 18) {
        cols = 6;
        rows = 3;
      } else if (photoCount <= 24) {
        cols = 6;
        rows = 4;
      } else if (photoCount <= 30) {
        cols = 6;
        rows = 5;
      } else {
        cols = 6;
        rows = 6;
      }
    }

    try {
      const config: PassportSheetConfig = {
        paperSize,
        cols,
        rows,
        alignTop: paperSize === 'A4' || rows === 1,
        showCutLines,
        showBorders,
        stampName: stampName.trim() || undefined,
        stampDate: stampDate.trim() || undefined,
      };

      const result = await generatePassportPhotoSheet(photoDataUrl, config);
      setSheetPreviewUrl(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingSheet(false);
    }
  };

  // Trigger auto re-generation when settings change
  useEffect(() => {
    if (photoDataUrl) {
      handleGeneratePassportSheet();
    }
  }, [photoDataUrl, paperSize, photoCount, showCutLines, showBorders, stampName, stampDate]);

  // Generate ID Card Sheet
  const handleGenerateIdSheet = async () => {
    if (!idFrontUrl) return;
    try {
      const result = await generateIdCardSheet(idFrontUrl, idBackUrl || undefined);
      setIdSheetPreviewUrl(result);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (idFrontUrl) {
      handleGenerateIdSheet();
    }
  }, [idFrontUrl, idBackUrl]);

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhotoDataUrl(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Direct Print Single Canvas
  const handlePrintSheet = (dataUrl: string) => {
    const win = window.open('', '_blank');
    if (!win) {
      window.print();
      return;
    }
    win.document.write(`
      <html>
        <head>
          <title>CYBER MITRA PRINT</title>
          <style>
            @page { margin: 0; size: auto; }
            body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; }
            img { max-width: 100%; height: auto; display: block; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <img src="${dataUrl}" />
        </body>
      </html>
    `);
    win.document.close();
  };

  // Download Sheet
  const handleDownloadSheet = (dataUrl: string, namePrefix: string) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `CyberMitra_${namePrefix}_${Date.now()}.jpg`;
    a.click();
    showToast(isHindi ? 'डाउनलोड शुरू हो गया!' : 'Downloaded photo sheet!');
  };

  // WhatsApp Share
  const handleWhatsAppShare = async (dataUrl: string, namePrefix: string) => {
    try {
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], `CyberMitra_${namePrefix}.jpg`, { type: 'image/jpeg' });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `CyberMitra ${namePrefix}`,
        });
      } else {
        showToast(isHindi ? 'आपका ब्राउज़र सीधे फाइल शेयरिंग सपोर्ट नहीं करता (कृपया पहले डाउनलोड करें)।' : 'Browser does not support direct file share (please download).');
      }
    } catch (e) {
      console.error(e);
      showToast(isHindi ? 'शेयर करने में त्रुटि हुई।' : 'Error sharing file.');
    }
  };

  // Remove from Print Queue
  const handleRemoveQueueItem = (id: string) => {
    onUpdatePrintQueue(printQueue.filter((j) => j.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-700 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-sm font-semibold animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-100 text-blue-800">
              <Printer className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800">
              {isHindi ? 'प्रिंट केंद्र (Print Center)' : 'Print Center'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isHindi
              ? '4x6 व A4 पासपोर्ट फोटो शीट मेकर, आईडी कार्ड डुप्लेक्स लेआउट, और प्रिंट जॉब्स।'
              : '4x6 and A4 passport photo sheet maker, ID card duplex printable layout, and print queue.'}
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('passport')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'passport'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📸 {isHindi ? 'पासपोर्ट शीट' : 'Passport Sheet'}
          </button>
          <button
            onClick={() => setActiveTab('idcard')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'idcard'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🪪 {isHindi ? 'आईडी कार्ड प्रिंट' : 'ID Card Duo'}
          </button>
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'queue'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🖨️ {isHindi ? 'प्रिंट कतार' : 'Print Queue'}</span>
            {printQueue.length > 0 && (
              <span className="w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                {printQueue.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 1. PASSPORT PHOTO SHEET MAKER */}
      {activeTab === 'passport' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-800 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span>{isHindi ? 'शीट कॉन्फ़िगरेशन' : 'Sheet Configuration'}</span>
                <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">
                  300 DPI High-Res
                </span>
              </h3>

              {/* Select Photo */}
              <div>
                <input
                  ref={passportPhotoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <button
                  onClick={() => passportPhotoInputRef.current?.click()}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-300"
                >
                  <Upload className="w-4 h-4 text-blue-600" />
                  <span>
                    {photoDataUrl
                      ? isHindi
                        ? 'फोटो बदलें (Change Photo)'
                        : 'Change Photo'
                      : isHindi
                      ? 'पासपोर्ट फोटो अपलोड करें'
                      : 'Upload Passport Photo'}
                  </span>
                </button>
              </div>

              {/* Paper Size */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {isHindi ? 'कागज़ का आकार (Paper Size)' : 'Paper Size'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setPaperSize('4x6');
                      setPhotoCount(6);
                    }}
                    className={`py-2 rounded-lg text-xs font-bold border transition-colors ${
                      paperSize === '4x6'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    4 × 6 Inch (फोटो पेपर)
                  </button>
                  <button
                    onClick={() => {
                      setPaperSize('A4');
                      setPhotoCount(16);
                    }}
                    className={`py-2 rounded-lg text-xs font-bold border transition-colors ${
                      paperSize === 'A4'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    A4 Full Paper
                  </button>
                </div>
              </div>

              {/* Number of Photos */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {isHindi ? 'फोटो की संख्या (Photo Count)' : 'Photo Count'}
                </label>
                {paperSize === '4x6' ? (
                  <div className="grid grid-cols-3 gap-2">
                    {[4, 6, 61, 8, 12, 16].map((num) => (
                      <button
                        key={num}
                        onClick={() => setPhotoCount(num)}
                        className={`py-1.5 rounded-lg text-xs font-bold border leading-tight ${
                          photoCount === num
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {num === 16 ? 'Stamp' : num === 61 ? '6 (1 Line)' : `${num}`}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {[6, 12, 18, 24, 30, 36].map((num) => (
                      <button
                        key={num}
                        onClick={() => setPhotoCount(num)}
                        className={`py-1.5 rounded-lg text-xs font-bold border ${
                          photoCount === num
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {num} Photos
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Guidelines & Borders checkboxes */}
              <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
                <label className="flex items-center gap-2 text-slate-700 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showCutLines}
                    onChange={(e) => setShowCutLines(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>✂️ {isHindi ? 'कैंची काटने के निशान (Cut Lines)' : 'Show Cutting Guidelines'}</span>
                </label>

                <label className="flex items-center gap-2 text-slate-700 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showBorders}
                    onChange={(e) => setShowBorders(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>🔳 {isHindi ? 'ब्लैक बॉर्डर लगाएँ' : 'Add Black Border'}</span>
                </label>
              </div>

              {/* Name & Date Stamp on Photo */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <h4 className="text-xs font-bold text-slate-700">
                  {isHindi ? 'फोटो पर नाम व तारीख स्टैम्प (Name & Date Stamp)' : 'Name & Date Stamp'}
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={stampName}
                    onChange={(e) => setStampName(e.target.value)}
                    placeholder={isHindi ? 'नाम (Name)' : 'Name'}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none"
                  />
                  <input
                    type="text"
                    value={stampDate}
                    onChange={(e) => setStampDate(e.target.value)}
                    placeholder={isHindi ? 'तारीख (DOB/Date)' : 'Date'}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sheet Canvas Preview Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs flex flex-col justify-between min-h-[480px]">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-800">
                    {paperSize === '4x6' ? '4 × 6 Inch Sheet' : 'A4 Photo Sheet'} ({photoCount} {isHindi ? 'फोटो' : 'photos'})
                  </h3>

                  {sheetPreviewUrl && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDownloadSheet(sheetPreviewUrl, `Passport_${paperSize}`)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>JPG</span>
                      </button>
                      <button
                        onClick={() => handleWhatsAppShare(sheetPreviewUrl, `Passport_${paperSize}`)}
                        className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 font-bold rounded-lg text-xs flex items-center gap-1 border border-green-200"
                        title="Share on WhatsApp"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share</span>
                      </button>
                      <button
                        onClick={() => handlePrintSheet(sheetPreviewUrl)}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow-xs"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>{isHindi ? '1-क्लिक प्रिंट' : 'Print'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {!photoDataUrl ? (
                  <div
                    onClick={() => passportPhotoInputRef.current?.click()}
                    className="py-20 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 cursor-pointer hover:bg-blue-50/40 transition-colors"
                  >
                    <ImageIcon className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                    <p className="font-bold text-sm text-slate-700">
                      {isHindi ? 'पासपोर्ट फोटो चुनें' : 'Upload photo to generate sheet'}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {isHindi ? '6, 8, 12, 16 फोटो की रेडी-टू-प्रिंट शीट स्वतः तैयार होगी' : 'Automatic instant grid generation'}
                    </p>
                  </div>
                ) : (
                  <div className="bg-slate-100 p-3 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden max-h-[420px]">
                    {sheetPreviewUrl && (
                      <img
                        src={sheetPreviewUrl}
                        alt="Passport Sheet Preview"
                        className="max-h-[390px] w-auto object-contain rounded shadow-md border border-white"
                      />
                    )}
                  </div>
                )}
              </div>

              {sheetPreviewUrl && (
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Standard 3.5 × 4.5 cm Ratio</span>
                  <span className="font-semibold text-blue-700">CYBER MITRA Studio Print</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. ID CARD DUPLEX (FRONT & BACK) */}
      {activeTab === 'idcard' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-800 pb-2 border-b border-slate-100">
                {isHindi ? 'आईडी कार्ड फ्रंट एवं बैक' : 'ID Card Front & Back (CR80)'}
              </h3>

              {/* Front Upload */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {isHindi ? '1. आईडी कार्ड सामने का भाग (Front Side)' : '1. Front Side'}
                </label>
                <input
                  ref={idFrontInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const r = new FileReader();
                    r.onload = (ev) => setIdFrontUrl(ev.target?.result as string);
                    r.readAsDataURL(file);
                  }}
                  className="hidden"
                />
                <button
                  onClick={() => idFrontInputRef.current?.click()}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-xs border border-slate-300 flex items-center justify-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5 text-blue-600" />
                  <span>{idFrontUrl ? (isHindi ? 'फ्रंट साइड बदला गया' : 'Front Loaded') : (isHindi ? 'फ्रंट साइड फोटो अपलोड करें' : 'Upload Front Side')}</span>
                </button>
              </div>

              {/* Back Upload */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {isHindi ? '2. आईडी कार्ड पीछे का भाग (Back Side - Optional)' : '2. Back Side (Optional)'}
                </label>
                <input
                  ref={idBackInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const r = new FileReader();
                    r.onload = (ev) => setIdBackUrl(ev.target?.result as string);
                    r.readAsDataURL(file);
                  }}
                  className="hidden"
                />
                <button
                  onClick={() => idBackInputRef.current?.click()}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-xs border border-slate-300 flex items-center justify-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5 text-blue-600" />
                  <span>{idBackUrl ? (isHindi ? 'बैक साइड बदला गया' : 'Back Loaded') : (isHindi ? 'बैक साइड फोटो अपलोड करें' : 'Upload Back Side')}</span>
                </button>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900 leading-relaxed">
                💡 {isHindi
                  ? 'मानक पीवीसी कार्ड आकार (85.6mm × 53.98mm) में दोनों साइड अगल-बगल प्रिंट होगा जिसे मोड़कर या लेमिनेट करके तुरंत दिया जा सकता है।'
                  : 'Generates standard CR80 format side-by-side ready for lamination or PVC cutting.'}
              </div>
            </div>
          </div>

          {/* ID Preview */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs min-h-[440px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-800">
                    {isHindi ? 'आईडी कार्ड प्रिंट लेआउट' : 'ID Card Printable Layout'}
                  </h3>

                  {idSheetPreviewUrl && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDownloadSheet(idSheetPreviewUrl, 'IDCard_Sheet')}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>JPG</span>
                      </button>
                      <button
                        onClick={() => handleWhatsAppShare(idSheetPreviewUrl, 'IDCard_Sheet')}
                        className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 font-bold rounded-lg text-xs flex items-center gap-1 border border-green-200"
                        title="Share on WhatsApp"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share</span>
                      </button>
                      <button
                        onClick={() => handlePrintSheet(idSheetPreviewUrl)}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow-xs"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>{isHindi ? 'प्रिंट निकालें' : 'Print'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {!idFrontUrl ? (
                  <div
                    onClick={() => idFrontInputRef.current?.click()}
                    className="py-16 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 cursor-pointer"
                  >
                    <CreditCard className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                    <p className="font-bold text-sm text-slate-700">
                      {isHindi ? 'आधार / पैन / वोटर कार्ड का फोटो अपलोड करें' : 'Upload ID card photo to preview'}
                    </p>
                  </div>
                ) : (
                  <div className="bg-slate-100 p-3 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden max-h-[380px]">
                    {idSheetPreviewUrl && (
                      <img
                        src={idSheetPreviewUrl}
                        alt="ID Card Print Sheet"
                        className="max-h-[350px] w-auto object-contain rounded shadow-md border border-white"
                      />
                    )}
                  </div>
                )}
              </div>

              {idSheetPreviewUrl && (
                <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
                  Standard CR80 Size (85.6mm × 53.98mm)
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. PRINT QUEUE */}
      {activeTab === 'queue' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-800 flex items-center gap-2">
              <Printer className="w-4 h-4 text-blue-600" />
              <span>
                {isHindi ? 'सक्रिय प्रिंट कतार (Active Print Queue)' : 'Active Print Queue'} ({printQueue.length})
              </span>
            </h3>
            {printQueue.length > 0 && (
              <button
                onClick={() => onUpdatePrintQueue([])}
                className="text-xs text-red-600 hover:text-red-800 font-semibold"
              >
                {isHindi ? 'कतार साफ़ करें' : 'Clear Queue'}
              </button>
            )}
          </div>

          {printQueue.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <Printer className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="font-bold text-sm text-slate-600">
                {isHindi ? 'प्रिंट कतार अभी खाली है' : 'Print queue is empty'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {isHindi ? 'फोटो टूल्स या आवेदन पत्र से "प्रिंट भेजें" पर क्लिक करके यहाँ जोड़ें।' : 'Send items here from Photo Tools or Application Builder.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {printQueue.map((job) => (
                <div
                  key={job.id}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-4 hover:bg-blue-50/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                      {job.paperSize}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-800">{job.title}</h4>
                      <p className="text-xs text-slate-500">
                        {new Date(job.timestamp).toLocaleTimeString('hi-IN')} • {job.copies} {isHindi ? 'प्रति' : 'copies'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePrintSheet(job.dataUrl)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>{isHindi ? 'प्रिंट करें' : 'Print'}</span>
                    </button>
                    <button
                      onClick={() => handleRemoveQueueItem(job.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
