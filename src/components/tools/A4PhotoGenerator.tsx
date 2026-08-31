import React, { useState, useRef, useEffect, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import {
  Upload,
  Printer,
  Download,
  Settings,
  Scissors,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  RefreshCw,
  Share2
} from 'lucide-react';
import { Language, SessionFile } from '../../types';

interface A4PhotoGeneratorProps {
  language: Language;
  onSendToPrintQueue: (title: string, dataUrl: string, paperSize: string) => void;
  onAddToWorkspace?: (file: SessionFile) => void;
}

const A4_WIDTH_PX = 2480; // 210mm at 300 DPI
const A4_HEIGHT_PX = 3508; // 297mm at 300 DPI
const MM_TO_PX = 11.811;

type PresetSize = 'passport' | 'pan' | 'custom' | 'mini_passport';

export const A4PhotoGenerator: React.FC<A4PhotoGeneratorProps> = ({
  language,
  onSendToPrintQueue,
}) => {
  const isHindi = language === 'hi';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  
  const [preset, setPreset] = useState<PresetSize>('passport');
  const [photoWidthMm, setPhotoWidthMm] = useState<number>(35);
  const [photoHeightMm, setPhotoHeightMm] = useState<number>(45);
  const [totalPhotos, setTotalPhotos] = useState<number>(12);
  const [gapMm, setGapMm] = useState<number>(3);
  
  const [showName, setShowName] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [nameText, setNameText] = useState('');
  const [dateText, setDateText] = useState('');
  const [showBorders, setShowBorders] = useState(true);
  const [showCutLines, setShowCutLines] = useState(true);
  
  const [pages, setPages] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    if (preset === 'passport') {
      setPhotoWidthMm(35);
      setPhotoHeightMm(45);
    } else if (preset === 'pan') {
      setPhotoWidthMm(25);
      setPhotoHeightMm(35);
    } else if (preset === 'mini_passport') {
      setPhotoWidthMm(30);
      setPhotoHeightMm(40);
    }
  }, [preset]);

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setCroppedImage(null);
      setPages([]);
    };
    reader.readAsDataURL(file);
  };

  const getCroppedImg = async (): Promise<string> => {
    if (!imageSrc || !croppedAreaPixels) return '';
    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => (image.onload = resolve));

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    return canvas.toDataURL('image/jpeg', 0.95);
  };

  const generateSheets = async () => {
    if (!imageSrc) return;
    setIsProcessing(true);
    
    try {
      // 1. Get cropped image
      const croppedDataUrl = await getCroppedImg();
      setCroppedImage(croppedDataUrl);

      const photo = new Image();
      photo.src = croppedDataUrl;
      await new Promise((resolve) => (photo.onload = resolve));

      // 2. Calculate Layout
      const marginMm = 5; // 5mm margin on A4 edges
      
      let pWidth = Math.round(photoWidthMm * MM_TO_PX);
      let pHeight = Math.round(photoHeightMm * MM_TO_PX);
      const gapPx = Math.round(gapMm * MM_TO_PX);
      const marginPx = Math.round(marginMm * MM_TO_PX);

      const availableW = A4_WIDTH_PX - marginPx * 2;
      const availableH = A4_HEIGHT_PX - marginPx * 2;

      let cols = Math.min(6, Math.floor((availableW + gapPx) / (pWidth + gapPx)));
      if (cols < 1) cols = 1;

      // Check if user wants 6 and we force shrink (Optional, let's keep exact size and max 6)
      
      const rowsPerPage = Math.floor((availableH + gapPx) / (pHeight + gapPx));
      const photosPerPage = cols * rowsPerPage;
      const numPages = Math.ceil(totalPhotos / photosPerPage);

      const newPages: string[] = [];
      let photosDrawn = 0;

      for (let page = 0; page < numPages; page++) {
        const canvas = document.createElement('canvas');
        canvas.width = A4_WIDTH_PX;
        canvas.height = A4_HEIGHT_PX;
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;

        // White background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, A4_WIDTH_PX, A4_HEIGHT_PX);

        const photosOnThisPage = Math.min(photosPerPage, totalPhotos - photosDrawn);

        // Center the grid horizontally
        const gridWidth = cols * pWidth + (cols - 1) * gapPx;
        const startX = (A4_WIDTH_PX - gridWidth) / 2;
        const startY = marginPx; // start from top margin

        for (let i = 0; i < photosOnThisPage; i++) {
          const r = Math.floor(i / cols);
          const c = i % cols;

          const x = startX + c * (pWidth + gapPx);
          const y = startY + r * (pHeight + gapPx);

          // Draw photo
          ctx.drawImage(photo, x, y, pWidth, pHeight);

          // Draw border
          if (showBorders) {
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 3;
            ctx.strokeRect(x, y, pWidth, pHeight);
          }

          // Draw name/date stamp
          if (showName || showDate) {
            const stampHeight = Math.round(pHeight * 0.16);
            const stampY = y + pHeight - stampHeight;
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.fillRect(x, stampY, pWidth, stampHeight);
            
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, stampY, pWidth, stampHeight);

            ctx.fillStyle = '#000000';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const fontSize = Math.round(stampHeight * 0.4);
            ctx.font = `bold ${fontSize}px sans-serif`;

            const centerX = x + pWidth / 2;
            if (showName && showDate) {
              ctx.fillText(nameText || 'NAME', centerX, stampY + stampHeight * 0.35, pWidth * 0.9);
              ctx.font = `normal ${Math.round(fontSize * 0.8)}px sans-serif`;
              ctx.fillText(dateText || 'DD/MM/YYYY', centerX, stampY + stampHeight * 0.75, pWidth * 0.9);
            } else if (showName) {
              ctx.fillText(nameText || 'NAME', centerX, stampY + stampHeight * 0.5, pWidth * 0.9);
            } else if (showDate) {
              ctx.fillText(dateText || 'DD/MM/YYYY', centerX, stampY + stampHeight * 0.5, pWidth * 0.9);
            }
          }

          // Draw cutting lines
          if (showCutLines) {
            ctx.strokeStyle = '#94a3b8'; // light slate
            ctx.lineWidth = 1;
            ctx.setLineDash([8, 8]);
            // Draw a clear dashed cut-box around each photo with a tiny padding
            const cutPadding = Math.min(gapPx / 2, 4); // Don't let padding exceed half the gap
            ctx.strokeRect(x - cutPadding, y - cutPadding, pWidth + cutPadding * 2, pHeight + cutPadding * 2);
            ctx.setLineDash([]);
          }
        }

        newPages.push(canvas.toDataURL('image/jpeg', 0.98));
        photosDrawn += photosOnThisPage;
      }

      setPages(newPages);
      setCurrentPage(0);
      showToast(isHindi ? 'A4 शीट सफलतापूर्वक जेनरेट हो गई!' : 'A4 Sheets generated successfully!');
    } catch (e) {
      console.error(e);
      showToast('Error generating sheets');
    } finally {
      setIsProcessing(false);
    }
  };


  const handlePrintPage = (pageIndex: number) => {
    const win = window.open('', '_blank');
    if (!win) {
      alert(isHindi ? 'कृपया पॉप-अप ब्लॉकर्स को बंद करें' : 'Please disable pop-up blockers');
      return;
    }
    win.document.write(`
      <html>
        <head>
          <title>A4 Photo Sheet</title>
          <style>
            @page { margin: 0; size: A4 portrait; }
            body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: flex-start; }
            img { width: 100%; max-width: 210mm; max-height: 297mm; display: block; }
          </style>
        </head>
        <body onload="setTimeout(() => { window.print(); window.close(); }, 500);">
          <img src="${pages[pageIndex]}" />
        </body>
      </html>
    `);
    win.document.close();
  };

  const handleDownloadPage = (pageIndex: number) => {
    const a = document.createElement('a');
    a.href = pages[pageIndex];
    a.download = `A4_Photo_Sheet_Page_${pageIndex + 1}.jpg`;
    a.click();
  };

  const handleWhatsAppShare = async (pageIndex: number) => {
    try {
      const response = await fetch(pages[pageIndex]);
      const blob = await response.blob();
      const file = new File([blob], `A4_Photo_Sheet_Page_${pageIndex + 1}.jpg`, { type: 'image/jpeg' });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `A4 Photo Sheet`,
        });
      } else {
        showToast(language === 'hi' ? 'आपका ब्राउज़र सीधे फाइल शेयरिंग सपोर्ट नहीं करता।' : 'Browser does not support direct file share.');
      }
    } catch (e) {
      console.error(e);
      showToast(language === 'hi' ? 'शेयर करने में त्रुटि हुई।' : 'Error sharing file.');
    }
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-700 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-sm font-semibold animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Setup & Crop */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
            <h3 className="font-extrabold text-slate-800 flex items-center gap-2 mb-4 text-sm sm:text-base">
              <Settings className="w-4 h-4 text-blue-600" />
              {isHindi ? '1. फोटो और लेआउट सेटिंग्स' : '1. Photo & Layout Settings'}
            </h3>

            <div className="space-y-4">
              {/* Image Upload */}
              {!imageSrc && (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/50 rounded-xl p-6 text-center cursor-pointer transition-all"
                >
                  <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-600">{isHindi ? 'फोटो अपलोड करें' : 'Upload Photo'}</p>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />

              {imageSrc && (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs"
                >
                  {isHindi ? 'दूसरी फोटो चुनें' : 'Change Photo'}
                </button>
              )}

              {/* Size Preset */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  {isHindi ? 'फोटो का साइज (Size)' : 'Photo Size'}
                </label>
                <select 
                  value={preset} 
                  onChange={(e) => setPreset(e.target.value as PresetSize)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-blue-500"
                >
                  <option value="passport">Passport (35 x 45 mm)</option>
                  <option value="mini_passport">Form Size / 6 in a row (30 x 40 mm)</option>
                  <option value="pan">PAN / Mini Form (25 x 35 mm)</option>
                  <option value="custom">Custom Size</option>
                </select>
              </div>

              {/* Custom Size Inputs */}
              {preset === 'custom' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Width (mm)</label>
                    <input 
                      type="number" value={photoWidthMm} onChange={(e) => setPhotoWidthMm(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Height (mm)</label>
                    <input 
                      type="number" value={photoHeightMm} onChange={(e) => setPhotoHeightMm(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                    />
                  </div>
                </div>
              )}

              {/* Total Photos & Gap */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">{isHindi ? 'कुल फोटो (Total)' : 'Total Photos'}</label>
                  <input 
                    type="number" value={totalPhotos} onChange={(e) => setTotalPhotos(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">{isHindi ? 'फोटो गैप (Gap mm)' : 'Gap (mm)'}</label>
                  <input 
                    type="number" value={gapMm} onChange={(e) => setGapMm(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input type="checkbox" checked={showBorders} onChange={(e) => setShowBorders(e.target.checked)} className="rounded text-blue-600" />
                  {isHindi ? 'फोटो पर बॉर्डर लगाएँ' : 'Add Black Border'}
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input type="checkbox" checked={showCutLines} onChange={(e) => setShowCutLines(e.target.checked)} className="rounded text-blue-600" />
                  {isHindi ? 'काटने के निशान (Cut Lines)' : 'Show Cutting Guidelines'}
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input type="checkbox" checked={showName} onChange={(e) => setShowName(e.target.checked)} className="rounded text-blue-600" />
                  {isHindi ? 'नाम प्रिंट करें (Name)' : 'Print Name'}
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input type="checkbox" checked={showDate} onChange={(e) => setShowDate(e.target.checked)} className="rounded text-blue-600" />
                  {isHindi ? 'तारीख प्रिंट करें (Date)' : 'Print Date'}
                </label>
              </div>

              {(showName || showDate) && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {showName && (
                    <input 
                      type="text" placeholder={isHindi ? "नाम दर्ज करें" : "Enter Name"} value={nameText} onChange={(e) => setNameText(e.target.value)}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs"
                    />
                  )}
                  {showDate && (
                    <input 
                      type="text" placeholder="Date" value={dateText} onChange={(e) => setDateText(e.target.value)}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs"
                    />
                  )}
                </div>
              )}

              <button
                onClick={generateSheets}
                disabled={!imageSrc || isProcessing}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-black rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
              >
                {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Layers className="w-5 h-5" />}
                {isHindi ? 'A4 शीट जेनरेट करें' : 'Generate A4 Sheets'}
              </button>

            </div>
          </div>
        </div>

        {/* Right Col: Cropper & Preview */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Crop Area */}
          {imageSrc && pages.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
              <h3 className="font-extrabold text-slate-800 flex items-center gap-2 mb-4 text-sm sm:text-base">
                <Scissors className="w-4 h-4 text-amber-500" />
                {isHindi ? '2. फोटो क्रॉप और सेट करें' : '2. Crop & Adjust Photo'}
              </h3>
              <div className="relative w-full h-[400px] bg-slate-900 rounded-xl overflow-hidden">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={photoWidthMm / photoHeightMm}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
              <div className="mt-4 flex items-center gap-4">
                <span className="text-xs font-bold text-slate-600">Zoom</span>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1"
                />
              </div>
            </div>
          )}

          {/* Generated A4 Previews */}
          {pages.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h3 className="font-extrabold text-slate-800 flex items-center gap-2 text-sm sm:text-base">
                  <Printer className="w-4 h-4 text-emerald-600" />
                  {isHindi ? '3. लाइव A4 प्रीव्यू' : '3. Live A4 Preview'}
                </h3>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handlePrintPage(currentPage)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-2 transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                    {isHindi ? 'प्रिंट करें (A4)' : 'Print (A4)'}
                  </button>
                  <button
                    onClick={() => handleDownloadPage(currentPage)}
                    className="px-4 py-2 bg-slate-800 hover:bg-black text-white font-bold rounded-lg text-xs flex items-center gap-2 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    {isHindi ? 'डाउनलोड' : 'Download'}
                  </button>
                  <button
                    onClick={() => handleWhatsAppShare(currentPage)}
                    className="px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 font-bold rounded-lg text-xs flex items-center gap-2 border border-green-200 transition-colors"
                    title="Share on WhatsApp"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                  <button
                    onClick={() => {
                      onSendToPrintQueue(`A4_Photo_Sheet_Page_${currentPage + 1}`, pages[currentPage], 'A4');
                      showToast(isHindi ? 'प्रिंट कतार में जोड़ा गया' : 'Added to Print Queue');
                    }}
                    className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold rounded-lg text-xs flex items-center gap-2 border border-blue-300 transition-colors"
                  >
                    <Layers className="w-4 h-4" />
                    {isHindi ? 'कतार में भेजें' : 'Send to Queue'}
                  </button>
                </div>
              </div>

              {pages.length > 1 && (
                <div className="flex items-center justify-center gap-2 mb-4 bg-slate-50 p-2 rounded-lg border border-slate-200">
                  {pages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx)}
                      className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                        currentPage === idx 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isHindi ? `पेज ${idx + 1}` : `Page ${idx + 1}`}
                    </button>
                  ))}
                  <span className="text-[10px] text-slate-500 font-semibold ml-2">
                    {totalPhotos} Photos = {pages.length} Pages
                  </span>
                </div>
              )}

              <div className="bg-slate-100 rounded-xl p-4 flex items-center justify-center overflow-auto border border-slate-200 max-h-[700px]">
                <img 
                  src={pages[currentPage]} 
                  alt={`A4 Page ${currentPage + 1}`} 
                  className="max-w-full h-auto shadow-sm border border-slate-300"
                  style={{ maxHeight: '800px', width: 'auto' }}
                />
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};
