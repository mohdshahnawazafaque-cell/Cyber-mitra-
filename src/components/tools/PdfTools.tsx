import React, { useState, useRef } from 'react';
import {
  FileText,
  Upload,
  Download,
  Trash2,
  MoveUp,
  MoveDown,
  Layers,
  CheckCircle2,
  Printer,
  FolderPlus,
  RefreshCw,
  Eye,
  Plus,
} from 'lucide-react';
import { Language, SessionFile } from '../../types';
import { createPdfFromImages, ImagesToPdfConfig } from '../../utils/pdfUtils';
import { getBase64SizeKB } from '../../utils/imageUtils';

interface PdfToolsProps {
  language: Language;
  onAddToWorkspace: (file: SessionFile) => void;
  onSendToPrintQueue: (title: string, dataUrl: string, paperSize: string) => void;
}

interface UploadedImageItem {
  id: string;
  name: string;
  dataUrl: string;
  sizeKB: number;
}

export const PdfTools: React.FC<PdfToolsProps> = ({
  language,
  onAddToWorkspace,
  onSendToPrintQueue,
}) => {
  const isHindi = language === 'hi';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<UploadedImageItem[]>([]);
  const [pageSize, setPageSize] = useState<'a4' | 'letter'>('a4');
  const [orientation, setOrientation] = useState<'p' | 'l'>('p');
  const [marginMm, setMarginMm] = useState<number>(10);
  const [pdfFileName, setPdfFileName] = useState<string>('CyberMitra_Document.pdf');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList: File[] = Array.from(files);
    fileList.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const newItem: UploadedImageItem = {
          id: 'img_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
          name: file.name,
          dataUrl,
          sizeKB: getBase64SizeKB(dataUrl),
        };
        setImages((prev) => [...prev, newItem]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= images.length) return;

    const copy = [...images];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;
    setImages(copy);
  };

  const handleRemove = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleGeneratePdf = async (action: 'download' | 'workspace' | 'print' | 'preview') => {
    if (images.length === 0) {
      showToast(isHindi ? 'कृपया पहले कम से कम एक फोटो जोड़ें' : 'Please add at least one image');
      return;
    }

    setIsGenerating(true);
    try {
      const config: ImagesToPdfConfig = {
        orientation,
        pageSize,
        marginMm,
        quality: 0.92,
      };

      const doc = await createPdfFromImages(
        images.map((img) => img.dataUrl),
        config
      );

      if (action === 'download') {
        doc.save(pdfFileName.endsWith('.pdf') ? pdfFileName : `${pdfFileName}.pdf`);
        showToast(isHindi ? 'पीडीएफ सफलतापूर्वक डाउनलोड हो गई!' : 'PDF downloaded successfully!');
      } else if (action === 'workspace') {
        const pdfDataUri = doc.output('datauristring');
        const sessionFile: SessionFile = {
          id: 'file_' + Date.now(),
          name: pdfFileName.endsWith('.pdf') ? pdfFileName : `${pdfFileName}.pdf`,
          sizeKB: Math.round(pdfDataUri.length / 1024),
          type: 'pdf',
          dataUrl: pdfDataUri,
          timestamp: new Date().toISOString(),
          category: 'pdf',
        };
        onAddToWorkspace(sessionFile);
        showToast(isHindi ? 'पीडीएफ वर्कस्पेस में सुरक्षित कर दी गई' : 'PDF saved to Workspace');
      } else if (action === 'print') {
        const pdfDataUri = doc.output('datauristring');
        onSendToPrintQueue(pdfFileName, pdfDataUri, pageSize.toUpperCase());
        showToast(isHindi ? 'प्रिंट केंद्र में भेजा गया' : 'Sent to Print Center');
      } else if (action === 'preview') {
        const blobUrl = doc.output('bloburl');
        setPreviewPdfUrl(blobUrl.toString());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
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
            <span className="p-2 rounded-xl bg-red-100 text-red-700">
              <FileText className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800">
              {isHindi ? 'फोटो व स्कैन से पीडीएफ बनाएं (Images to PDF)' : 'Images & Scans to PDF Tools'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isHindi
              ? 'मल्टीपल फोटो, मार्कशीट, आधार, व कागजात को जोड़कर 1-क्लिक में एक स्वच्छ A4 PDF बनाएं।'
              : 'Combine multiple photos, marksheets, and scans into a single standard A4 PDF document.'}
          </p>
        </div>

        {/* Upload Buttons */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{isHindi ? '+ फोटो / स्कैन जोड़ें' : '+ Add Photos / Scans'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Sequence / Pages List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-extrabold text-slate-800 text-sm sm:text-base flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>
                  {isHindi ? 'पीडीएफ पृष्ठ क्रम (Pages Order)' : 'PDF Page Sequence'} ({images.length} {isHindi ? 'पृष्ठ' : 'pages'})
                </span>
              </h3>
              {images.length > 0 && (
                <button
                  onClick={() => setImages([])}
                  className="text-xs text-red-600 hover:text-red-800 font-semibold"
                >
                  {isHindi ? 'सभी हटाएं' : 'Clear All'}
                </button>
              )}
            </div>

            {images.length === 0 ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/50 rounded-xl p-8 text-center cursor-pointer transition-all"
              >
                <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                <p className="font-bold text-sm text-slate-700">
                  {isHindi ? 'कम से कम एक या अधिक फोटो जोड़ें' : 'Click to select one or more photos to merge'}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  (मार्कशीट, राशन कार्ड, आधार, पैन, प्रमाण पत्र स्कैन आदि)
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {images.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 hover:bg-blue-50/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <img
                        src={item.dataUrl}
                        alt="thumb"
                        className="w-12 h-14 object-cover rounded border border-slate-300 bg-white"
                      />
                      <div>
                        <p className="font-bold text-xs sm:text-sm text-slate-800 line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-slate-500">{item.sizeKB} KB</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMove(index, 'up')}
                        disabled={index === 0}
                        className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30"
                        title="Move Up"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMove(index, 'down')}
                        disabled={index === images.length - 1}
                        className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30"
                        title="Move Down"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: PDF Settings & Output Actions */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-800">
              {isHindi ? 'पीडीएफ सेटिंग्स (Page Setup)' : 'PDF Page Setup'}
            </h3>

            {/* Document Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isHindi ? 'पीडीएफ फाइल का नाम' : 'PDF File Name'}
              </label>
              <input
                type="text"
                value={pdfFileName}
                onChange={(e) => setPdfFileName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            {/* Page Size */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isHindi ? 'कागज़ का आकार (Page Size)' : 'Page Size'}
              </label>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value as 'a4' | 'letter')}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                <option value="a4">A4 (210 × 297 mm) - Standard</option>
                <option value="letter">Letter (8.5 × 11 in)</option>
              </select>
            </div>

            {/* Orientation */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isHindi ? 'अभिविन्यास (Orientation)' : 'Orientation'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOrientation('p')}
                  className={`py-2 rounded-lg text-xs font-bold transition-colors ${
                    orientation === 'p'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {isHindi ? 'खड़ा (Portrait)' : 'Portrait'}
                </button>
                <button
                  type="button"
                  onClick={() => setOrientation('l')}
                  className={`py-2 rounded-lg text-xs font-bold transition-colors ${
                    orientation === 'l'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {isHindi ? 'आड़ा (Landscape)' : 'Landscape'}
                </button>
              </div>
            </div>

            {/* Margin */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isHindi ? 'मार्जिन (Margin)' : 'Page Margin'}
              </label>
              <select
                value={marginMm}
                onChange={(e) => setMarginMm(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                <option value={0}>{isHindi ? 'कोई मार्जिन नहीं (0 mm)' : 'No Margin (0 mm)'}</option>
                <option value={5}>{isHindi ? 'छोटा मार्जिन (5 mm)' : 'Small Margin (5 mm)'}</option>
                <option value={10}>{isHindi ? 'सामान्य मार्जिन (10 mm)' : 'Normal (10 mm)'}</option>
                <option value={15}>{isHindi ? 'चौड़ा मार्जिन (15 mm)' : 'Wide (15 mm)'}</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <button
                onClick={() => handleGeneratePdf('download')}
                disabled={images.length === 0 || isGenerating}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md disabled:opacity-50 transition-all"
              >
                {isGenerating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>{isHindi ? 'पीडीएफ डाउनलोड करें (Download PDF)' : 'Download Combined PDF'}</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleGeneratePdf('workspace')}
                  disabled={images.length === 0 || isGenerating}
                  className="py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-indigo-200 disabled:opacity-50"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'वर्कस्पेस में रखें' : 'Save Workspace'}</span>
                </button>

                <button
                  onClick={() => handleGeneratePdf('print')}
                  disabled={images.length === 0 || isGenerating}
                  className="py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-amber-200 disabled:opacity-50"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'प्रिंट भेजें' : 'Send to Print'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
