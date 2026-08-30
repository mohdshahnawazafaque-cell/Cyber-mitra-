import React, { useRef } from 'react';
import {
  FolderSync,
  Upload,
  Download,
  Trash2,
  FileImage,
  FileText,
  Printer,
  Sliders,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { Language, SessionFile } from '../../types';
import { getBase64SizeKB } from '../../utils/imageUtils';

interface FileWorkspaceProps {
  language: Language;
  activeFiles: SessionFile[];
  onAddFiles: (files: SessionFile[]) => void;
  onRemoveFile: (id: string) => void;
  onClearFiles: () => void;
  onNavigateToPhotoTool: (file: SessionFile) => void;
  onSendToPrintQueue: (title: string, dataUrl: string, paperSize: string) => void;
}

export const FileWorkspace: React.FC<FileWorkspaceProps> = ({
  language,
  activeFiles,
  onAddFiles,
  onRemoveFile,
  onClearFiles,
  onNavigateToPhotoTool,
  onSendToPrintQueue,
}) => {
  const isHindi = language === 'hi';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles: SessionFile[] = [];
    const fileList: File[] = Array.from(files);
    fileList.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        const isPdf = file.type.includes('pdf') || file.name.endsWith('.pdf');
        newFiles.push({
          id: 'file_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
          name: file.name,
          sizeKB: getBase64SizeKB(dataUrl),
          type: isPdf ? 'pdf' : 'image',
          dataUrl,
          timestamp: new Date().toISOString(),
          category: isPdf ? 'pdf' : 'photo',
        });

        if (newFiles.length === fileList.length) {
          onAddFiles(newFiles);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDownload = (file: SessionFile) => {
    const a = document.createElement('a');
    a.href = file.dataUrl;
    a.download = file.name;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-100 text-indigo-800">
              <FolderSync className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800">
              {isHindi ? 'यूनिवर्सल फाइल वर्कस्पेस' : 'Universal File Workspace'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isHindi
              ? 'ग्राहक के सभी दस्तावेज (फोटो, आधार, मार्कशीट, आवेदन पत्र) एक जगह रखें और किसी भी टूल में तुरंत उपयोग करें।'
              : 'Central hub for current customer files. Upload once, pass freely across Photo, PDF, and Print tools.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>{isHindi ? 'फाइल जोड़ें (Upload)' : 'Add Files'}</span>
          </button>
          {activeFiles.length > 0 && (
            <button
              onClick={onClearFiles}
              className="px-3.5 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-xl text-xs sm:text-sm border border-red-200"
            >
              {isHindi ? 'सभी साफ़ करें' : 'Clear All'}
            </button>
          )}
        </div>
      </div>

      {/* Files Grid */}
      {activeFiles.length === 0 ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50/40 rounded-2xl p-16 text-center cursor-pointer transition-all"
        >
          <FolderSync className="w-12 h-12 mx-auto text-indigo-400 mb-3" />
          <h3 className="font-bold text-base text-slate-800">
            {isHindi ? 'वर्तमान सत्र में कोई फाइल नहीं है' : 'Workspace is currently empty'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {isHindi
              ? 'यहाँ ग्राहक के आधार, फोटो, हस्ताक्षर अपलोड करें या टूल्स से सेव करें।'
              : 'Upload customer documents here or save them directly from tools.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeFiles.map((file) => (
            <div
              key={file.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-slate-100 text-slate-700">
                      {file.type === 'image' ? (
                        <FileImage className="w-5 h-5 text-blue-600" />
                      ) : (
                        <FileText className="w-5 h-5 text-red-600" />
                      )}
                    </span>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-800 line-clamp-1">
                        {file.name}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {file.sizeKB} KB • {new Date(file.timestamp).toLocaleTimeString('hi-IN')}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveFile(file.id)}
                    className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Thumbnail Preview */}
                <div className="h-32 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center p-2 mb-3 border border-slate-200">
                  {file.type === 'image' ? (
                    <img
                      src={file.dataUrl}
                      alt={file.name}
                      className="max-h-full max-w-full object-contain rounded"
                    />
                  ) : (
                    <div className="text-center text-slate-500">
                      <FileText className="w-8 h-8 mx-auto mb-1 text-red-600" />
                      <span className="text-xs font-bold">PDF Document</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                {file.type === 'image' && (
                  <button
                    onClick={() => onNavigateToPhotoTool(file)}
                    className="flex-1 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold rounded-lg text-xs flex items-center justify-center gap-1 border border-amber-200"
                    title="Open in Photo Tools"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>{isHindi ? 'रिसाइज' : 'Resize'}</span>
                  </button>
                )}

                <button
                  onClick={() => handleDownload(file)}
                  className="flex-1 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg text-xs flex items-center justify-center gap-1 border border-blue-200"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'डाउनलोड' : 'Download'}</span>
                </button>

                <button
                  onClick={() => onSendToPrintQueue(file.name, file.dataUrl, 'A4')}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
                  title="Send to Print"
                >
                  <Printer className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
