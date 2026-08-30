import React, { useState, useRef } from 'react';
import {
  Upload,
  Download,
  Sliders,
  RotateCw,
  Crop,
  CheckCircle2,
  FileImage,
  FolderPlus,
  Printer,
  Sparkles,
  Zap,
  RefreshCw,
  Layers,
} from 'lucide-react';
import { Language, SessionFile } from '../../types';
import {
  getBase64SizeKB,
  resizeImage,
  compressToTargetKB,
  rotateImage,
  enhanceSignature,
  generatePassportPhotoSheet,
} from '../../utils/imageUtils';
import { A4PhotoGenerator } from './A4PhotoGenerator';

interface PhotoToolsProps {
  language: Language;
  initialTab?: 'basic' | 'a4_grid';
  initialFile?: SessionFile | null;
  onAddToWorkspace: (file: SessionFile) => void;
  onSendToPrintQueue: (title: string, dataUrl: string, paperSize: string) => void;
  onNavigate: (view: string) => void;
}

export const PhotoTools: React.FC<PhotoToolsProps> = ({
  language,
  initialTab = 'basic',
  initialFile,
  onAddToWorkspace,
  onSendToPrintQueue,
  onNavigate,
}) => {
  const isHindi = language === 'hi';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'basic' | 'a4_grid'>(initialTab);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>('photo.jpg');
  const [originalKB, setOriginalKB] = useState<number>(0);
  const [currentKB, setCurrentKB] = useState<number>(0);
  const [width, setWidth] = useState<number>(600);
  const [height, setHeight] = useState<number>(600);
  const [keepAspect, setKeepAspect] = useState<boolean>(true);
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Target KB
  const [targetKBInput, setTargetKBInput] = useState<number>(50);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setCurrentImage(dataUrl);
      const kb = getBase64SizeKB(dataUrl);
      setOriginalKB(kb);
      setCurrentKB(kb);

      const img = new Image();
      img.onload = () => {
        setWidth(img.width);
        setHeight(img.height);
        setAspectRatio(img.width / img.height);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth);
    if (keepAspect && aspectRatio > 0) {
      setHeight(Math.round(newWidth / aspectRatio));
    }
  };

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight);
    if (keepAspect && aspectRatio > 0) {
      setWidth(Math.round(newHeight * aspectRatio));
    }
  };

  // 1. Quick Resize
  const handleApplyResize = async () => {
    if (!currentImage) return;
    setIsProcessing(true);
    try {
      const resized = await resizeImage(currentImage, width, height, 'image/jpeg', 0.92);
      setCurrentImage(resized);
      const newKb = getBase64SizeKB(resized);
      setCurrentKB(newKb);
      showToast(isHindi ? `फोटो रिसाइज सफल: ${width}x${height} px (${newKb} KB)` : `Resized to ${width}x${height} px`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  // 2. Compress to Target KB
  const handleCompressKB = async (targetKB: number) => {
    if (!currentImage) return;
    setIsProcessing(true);
    try {
      const res = await compressToTargetKB(currentImage, targetKB, 'image/jpeg');
      setCurrentImage(res.dataUrl);
      setCurrentKB(res.finalKB);
      setWidth(res.width);
      setHeight(res.height);
      setAspectRatio(res.width / res.height);
      showToast(isHindi ? `फाइल साइज सफलतापूर्वक ${res.finalKB} KB किया गया!` : `Compressed to ${res.finalKB} KB`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  // 3. Rotate
  const handleRotate = async (degrees: number) => {
    if (!currentImage) return;
    setIsProcessing(true);
    try {
      const rotated = await rotateImage(currentImage, degrees, 'image/jpeg');
      setCurrentImage(rotated);
      const img = new Image();
      img.onload = () => {
        setWidth(img.width);
        setHeight(img.height);
        setAspectRatio(img.width / img.height);
        setCurrentKB(getBase64SizeKB(rotated));
      };
      img.src = rotated;
      showToast(isHindi ? 'फोटो घूमा दी गई' : 'Rotated 90°');
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  // 4. Signature Enhancer
  const handleCleanSignature = async () => {
    if (!currentImage) return;
    setIsProcessing(true);
    try {
      const enhanced = await enhanceSignature(currentImage, 140, 1.4);
      // compress to < 20KB by default for signatures
      const compressed = await compressToTargetKB(enhanced, 20, 'image/jpeg');
      setCurrentImage(compressed.dataUrl);
      setCurrentKB(compressed.finalKB);
      setWidth(compressed.width);
      setHeight(compressed.height);
      setAspectRatio(compressed.width / compressed.height);
      showToast(isHindi ? 'हस्ताक्षर साफ और 20KB के अंदर तैयार है!' : 'Signature cleaned and compressed under 20KB!');
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  // 5. Passport Crop Preset (3.5cm x 4.5cm ~ 413x531 px at 300dpi)
  const handleApplyPassportPreset = async () => {
    if (!currentImage) return;
    setIsProcessing(true);
    try {
      // 413 x 531 px standard passport ratio
      const resized = await resizeImage(currentImage, 413, 531, 'image/jpeg', 0.9);
      const compressed = await compressToTargetKB(resized, 50, 'image/jpeg');
      setCurrentImage(compressed.dataUrl);
      setCurrentKB(compressed.finalKB);
      setWidth(compressed.width);
      setHeight(compressed.height);
      setAspectRatio(compressed.width / compressed.height);
      showToast(isHindi ? 'पासपोर्ट साइज (3.5x4.5cm, <50KB) तैयार है!' : 'Passport Size (3.5x4.5cm, <50KB) applied!');
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  // 6. Generate A4 Sheet with 6 Photos (1 Line)
  const handleGenerateA4SixPhotos = async () => {
    if (!currentImage) return;
    setIsProcessing(true);
    try {
      // First ensure the source image is standard passport size
      const passportImg = await resizeImage(currentImage, 413, 531, 'image/jpeg', 0.95);
      
      const sheet = await generatePassportPhotoSheet(passportImg, {
        paperSize: 'A4',
        cols: 6,
        rows: 5,
        totalPhotos: 6, // exactly a 6 photo set
        alignTop: true, // single row at the top
        showCutLines: true,
        showBorders: true,
      });
      
      setCurrentImage(sheet);
      setCurrentKB(getBase64SizeKB(sheet));
      const img = new Image();
      img.onload = () => {
        setWidth(img.width);
        setHeight(img.height);
        setAspectRatio(img.width / img.height);
      };
      img.src = sheet;
      showToast(isHindi ? 'A4 पर 6 फोटो का सेट तैयार है!' : 'A4 sheet with 6 photos generated!');
    } catch (e) {
      console.error(e);
      showToast('Error generating sheet');
    } finally {
      setIsProcessing(false);
    }
  };

  // 7. Download
  const handleDownload = () => {
    if (!currentImage) return;
    const a = document.createElement('a');
    a.href = currentImage;
    a.download = `cybermitra_${imageName.replace(/\.[^/.]+$/, '')}.jpg`;
    a.click();
    showToast(isHindi ? 'डाउनलोड शुरू हो गया है' : 'Downloaded file');
  };

  // 7. Save to Workspace
  const handleSaveToWorkspace = () => {
    if (!currentImage) return;
    const sessionFile: SessionFile = {
      id: 'file_' + Date.now(),
      name: `processed_${imageName}`,
      sizeKB: currentKB,
      type: 'image',
      dataUrl: currentImage,
      timestamp: new Date().toISOString(),
      category: 'photo',
    };
    onAddToWorkspace(sessionFile);
    showToast(isHindi ? 'फाइल वर्कस्पेस में सुरक्षित कर दी गई' : 'Saved to Workspace');
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
            <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Sliders className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800">
              {isHindi ? 'फोटो एवं हस्ताक्षर टूल्स' : 'Photo & Signature Tools'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isHindi
              ? 'सरकारी पोर्टल्स (UP eDistrict, PAN, SSC, UPSC) हेतु फोटो रिसाइज, सटीक KB कंप्रेशन, और हस्ताक्षर क्लीनर।'
              : 'Fast client-side photo resizing, exact KB target compression, and signature ink cleaning.'}
          </p>
        </div>

        {/* Upload Button */}
        {activeTab === 'basic' && (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95 text-sm"
            >
              <Upload className="w-4 h-4" />
              <span>{isHindi ? 'फोटो / हस्ताक्षर चुनें (Upload)' : 'Select Photo / Signature'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200 w-full sm:w-max">
        <button
          onClick={() => setActiveTab('basic')}
          className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'basic' ? 'bg-white text-blue-700 shadow-sm border border-slate-200' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          {isHindi ? 'रिसाइज व क्लीनर (Single Photo)' : 'Single Photo Resizer'}
        </button>
        <button
          onClick={() => setActiveTab('a4_grid')}
          className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'a4_grid' ? 'bg-white text-blue-700 shadow-sm border border-slate-200' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          {isHindi ? 'A4 ऑटो-ग्रिड जेनरेटर' : 'A4 Auto-Grid Generator'}
        </button>
      </div>

      {activeTab === 'a4_grid' ? (
        <A4PhotoGenerator language={language} onSendToPrintQueue={onSendToPrintQueue} onAddToWorkspace={onAddToWorkspace} />
      ) : !currentImage ? (
        /* Empty State Dropzone */
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/50 rounded-2xl p-10 sm:p-16 text-center cursor-pointer transition-all flex flex-col items-center justify-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
            <FileImage className="w-8 h-8" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-800">
            {isHindi ? 'फोटो या हस्ताक्षर यहाँ ड्रॉप करें या क्लिक करके चुनें' : 'Drop photo/signature here or click to browse'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md">
            JPG, PNG, WEBP समर्थित। 100% सुरक्षित ब्राउज़र प्रोसेसिंग (कोई फोटो सर्वर पर नहीं भेजी जाती)।
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs font-semibold text-slate-600">
            <span className="px-3 py-1 bg-white rounded-full border border-slate-200">⚡ 20KB हस्ताक्षर फिक्स</span>
            <span className="px-3 py-1 bg-white rounded-full border border-slate-200">⚡ 50KB पासपोर्ट फोटो</span>
            <span className="px-3 py-1 bg-white rounded-full border border-slate-200">⚡ 100KB ई-डिस्ट्रिक्ट</span>
          </div>
        </div>
      ) : (
        /* Image Processing Editor Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Image Preview & Quick Actions */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 flex flex-col justify-between shadow-xs">
            <div>
              {/* Image Meta Stats */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700">{imageName}</span>
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-100">
                    {width} × {height} px
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">
                    मूल: <span className="font-semibold text-slate-600">{originalKB} KB</span>
                  </span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    वर्तमान: {currentKB} KB
                  </span>
                </div>
              </div>

              {/* Live Canvas / Image Container */}
              <div className="my-4 min-h-[280px] max-h-[420px] bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center p-3 relative border border-slate-200">
                <img
                  src={currentImage}
                  alt="Working Preview"
                  className="max-h-[380px] w-auto max-w-full object-contain rounded shadow-xs"
                />
                {isProcessing && (
                  <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-2xs flex items-center justify-center text-white font-bold text-sm">
                    <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                    {isHindi ? 'प्रोसेसिंग चालू है...' : 'Processing...'}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Export & Save Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
              <button
                onClick={handleDownload}
                className="flex-1 min-w-[140px] px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Download className="w-4 h-4" />
                <span>{isHindi ? 'डाउनलोड करें (JPG)' : 'Download Image'}</span>
              </button>

              <button
                onClick={handleSaveToWorkspace}
                className="px-3.5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 border border-indigo-200 transition-colors"
                title={isHindi ? 'वर्कस्पेस में रखें' : 'Save to Workspace'}
              >
                <FolderPlus className="w-4 h-4" />
                <span>{isHindi ? 'वर्कस्पेस में रखें' : 'Workspace'}</span>
              </button>

              <button
                onClick={() => {
                  onSendToPrintQueue(`Photo_${imageName}`, currentImage, '4x6');
                  showToast(isHindi ? 'प्रिंट केंद्र में भेजा गया' : 'Sent to Print Center');
                }}
                className="px-3.5 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 border border-amber-200 transition-colors"
                title={isHindi ? 'प्रिंट केंद्र भेजें' : 'Send to Print Queue'}
              >
                <Printer className="w-4 h-4" />
                <span>{isHindi ? 'प्रिंट भेजें' : 'Print'}</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
              >
                {isHindi ? 'नई फोटो' : 'Change'}
              </button>
            </div>
          </div>

          {/* Right Column: Controls & Presets */}
          <div className="lg:col-span-5 space-y-4">
            {/* 1. Fast KB Target Compressor Box */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-amber-500" />
                <h3 className="font-extrabold text-sm sm:text-base text-slate-800">
                  {isHindi ? 'सटीक साइज फिक्स (Target KB)' : 'Exact KB Target Compressor'}
                </h3>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-3">
                <button
                  onClick={() => handleCompressKB(20)}
                  className="px-2 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-black transition-colors"
                >
                  ≤ 20 KB
                  <span className="block text-[9px] font-normal text-amber-700">हस्ताक्षर</span>
                </button>
                <button
                  onClick={() => handleCompressKB(50)}
                  className="px-2 py-2 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 rounded-lg text-xs font-black transition-colors"
                >
                  ≤ 50 KB
                  <span className="block text-[9px] font-normal text-blue-700">पासपोर्ट</span>
                </button>
                <button
                  onClick={() => handleCompressKB(100)}
                  className="px-2 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-lg text-xs font-black transition-colors"
                >
                  ≤ 100 KB
                  <span className="block text-[9px] font-normal text-emerald-700">ई-डिस्ट्रिक्ट</span>
                </button>
                <button
                  onClick={() => handleCompressKB(200)}
                  className="px-2 py-2 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-300 rounded-lg text-xs font-black transition-colors"
                >
                  ≤ 200 KB
                  <span className="block text-[9px] font-normal text-purple-700">मार्कशीट</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={5}
                  max={5000}
                  value={targetKBInput}
                  onChange={(e) => setTargetKBInput(Number(e.target.value))}
                  placeholder="कस्टम KB"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
                <button
                  onClick={() => handleCompressKB(targetKBInput)}
                  className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold rounded-lg text-xs transition-colors"
                >
                  {isHindi ? 'साइज सेट करें' : 'Apply KB'}
                </button>
              </div>
            </div>

            {/* 2. Special Cyber Cafe Presets */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-800 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                {isHindi ? '1-क्लिक स्पेशल साइबर टूल्स' : '1-Click Special Portal Tools'}
              </h3>

              <div className="space-y-2.5">
                <button
                  onClick={handleCleanSignature}
                  className="w-full text-left p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-blue-700">
                      ✍️ {isHindi ? 'हस्ताक्षर क्लीनर (Signature Clean & White BG)' : 'Signature Clean & B/W Ink'}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {isHindi ? 'मोबाइल फोटो से परछाई हटाकर गहरा काला इंक व 20KB साइज बनाएं' : 'Removes shadows, darkens ink, fixes to 20KB'}
                    </p>
                  </div>
                  <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-1 rounded">
                    Fix
                  </span>
                </button>

                <button
                  onClick={handleApplyPassportPreset}
                  className="w-full text-left p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-blue-700">
                      👤 {isHindi ? 'पासपोर्ट साइज अनुपात (3.5 × 4.5 cm)' : 'Passport Standard Ratio'}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {isHindi ? 'स्टैंडर्ड अनुपात 3.5x4.5 सेमी व 50 KB के भीतर सेट करें' : 'Standard official dimension for form upload'}
                    </p>
                  </div>
                  <span className="text-[10px] bg-amber-500 text-white font-bold px-2 py-1 rounded">
                    Fix
                  </span>
                </button>

                <button
                  onClick={handleGenerateA4SixPhotos}
                  className="w-full text-left p-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-emerald-700">
                      🖨️ {isHindi ? 'A4 6 फोटो सेट (एक लाइन)' : 'A4 6-Photo Set (Top Line)'}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {isHindi ? 'A4 शीट के ऊपरी हिस्से में 6 पासपोर्ट फोटो प्रिंट करने हेतु तैयार करें' : 'Generate A4 print sheet with 6 photos in a single row'}
                    </p>
                  </div>
                  <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-1 rounded">
                    Print
                  </span>
                </button>
              </div>
            </div>

            {/* 3. Manual Dimensions Resize & Rotate */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-800 mb-3">
                {isHindi ? 'आयाम व रोटेशन (Dimensions & Rotate)' : 'Custom Dimensions & Rotate'}
              </h3>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    {isHindi ? 'चौड़ाई (Width px)' : 'Width (px)'}
                  </label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => handleWidthChange(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    {isHindi ? 'ऊंचाई (Height px)' : 'Height (px)'}
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => handleHeightChange(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mb-3 text-xs">
                <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={keepAspect}
                    onChange={(e) => setKeepAspect(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>{isHindi ? 'अनुपात लॉक रखें (Lock Aspect)' : 'Maintain Aspect Ratio'}</span>
                </label>

                <button
                  onClick={handleApplyResize}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs"
                >
                  {isHindi ? 'रिसाइज लागू करें' : 'Apply Resize'}
                </button>
              </div>

              {/* Rotation buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleRotate(90)}
                  className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>90° दाएँ</span>
                </button>
                <button
                  onClick={() => handleRotate(270)}
                  className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1"
                >
                  <RotateCw className="w-3.5 h-3.5 -scale-x-100" />
                  <span>90° बाएँ</span>
                </button>
                <button
                  onClick={() => handleRotate(180)}
                  className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1"
                >
                  <span>180°</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
