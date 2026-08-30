import React, { useState, useEffect, useRef } from 'react';
import {
  FileCode,
  Printer,
  Download,
  Copy,
  Sparkles,
  UserCheck,
  CheckCircle2,
  RefreshCw,
  Eye,
  FileCheck,
} from 'lucide-react';
import { ApplicationTemplate, CustomerData, Language, SessionFile } from '../../types';
import { createApplicationPdf } from '../../utils/pdfUtils';

interface ApplicationBuilderProps {
  language: Language;
  templates: ApplicationTemplate[];
  customer: CustomerData;
  onAddToWorkspace: (file: SessionFile) => void;
  onSendToPrintQueue: (title: string, dataUrl: string, paperSize: string) => void;
  onOpenCustomerModal: () => void;
  onNavigateToAiWriter: (presetSubject: string) => void;
}

export const ApplicationBuilder: React.FC<ApplicationBuilderProps> = ({
  language,
  templates,
  customer,
  onAddToWorkspace,
  onSendToPrintQueue,
  onOpenCustomerModal,
  onNavigateToAiWriter,
}) => {
  const isHindi = true; // Forced to Hindi as requested
  const printAreaRef = useRef<HTMLDivElement>(null);

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || '');
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [notification, setNotification] = useState<string | null>(null);

  const activeTemplate = templates.find((t) => t.id === selectedTemplateId) || templates[0];

  // Initialize fields on template change
  useEffect(() => {
    if (activeTemplate) {
      const initial: Record<string, string> = {};
      activeTemplate.fields.forEach((f) => {
        initial[f.id] = f.defaultValue || '';
      });
      setFieldValues(initial);
    }
  }, [selectedTemplateId, activeTemplate]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleFieldChange = (fieldId: string, value: string) => {
    setFieldValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  // Helper to replace customer tags & field tags in template string
  const compileTemplateText = (rawText: string) => {
    let result = rawText;

    // Customer session replacements
    result = result.replace(/\{\{name\}\}/g, customer.name || '[आवेदक का नाम]');
    result = result.replace(/\{\{fatherMotherName\}\}/g, customer.fatherMotherName || '[पिता/पति का नाम]');
    result = result.replace(/\{\{address\}\}/g, customer.address || '[पता]');
    result = result.replace(/\{\{villageTown\}\}/g, customer.villageTown || '[ग्राम/कस्बा]');
    result = result.replace(/\{\{district\}\}/g, customer.district || '[जनपद]');
    result = result.replace(/\{\{state\}\}/g, customer.state || '[राज्य]');
    result = result.replace(/\{\{mobile\}\}/g, customer.mobile || '[मोबाइल]');
    result = result.replace(/\{\{aadhaarNumber\}\}/g, customer.aadhaarNumber || '[आधार नंबर]');

    // Template specific fields
    Object.keys(fieldValues).forEach((key) => {
      const val = fieldValues[key] || `[${key}]`;
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      result = result.replace(regex, val);
    });

    return result;
  };

  const compiledRecipient = activeTemplate ? compileTemplateText(isHindi ? activeTemplate.recipientHi : activeTemplate.recipientEn) : '';
  const compiledSubject = activeTemplate ? compileTemplateText(isHindi ? activeTemplate.subjectHi : activeTemplate.subjectEn) : '';
  const compiledBody = activeTemplate ? compileTemplateText(isHindi ? activeTemplate.templateBodyHi : activeTemplate.templateBodyEn) : '';
  const title = activeTemplate ? (isHindi ? activeTemplate.titleHi : activeTemplate.titleEn) : '';
  const requiredDocs = activeTemplate ? (isHindi ? activeTemplate.requiredDocumentsHi : activeTemplate.requiredDocumentsEn) : [];

  // Direct Print
  const handlePrint = () => {
    window.print();
  };

  // PDF Generation
  const handleDownloadPdf = () => {
    const doc = createApplicationPdf(
      title,
      compiledRecipient,
      compiledSubject,
      compiledBody,
      customer.name || 'आवेदक',
      new Date().toLocaleDateString('hi-IN'),
      requiredDocs
    );
    doc.save(`CyberMitra_${activeTemplate?.id || 'Application'}.pdf`);
    showToast(isHindi ? 'प्रार्थना पत्र पीडीएफ डाउनलोड हो गया!' : 'Application PDF downloaded!');
  };

  // Copy full text
  const handleCopyText = () => {
    const fullText = `${compiledRecipient}\n\n${compiledSubject}\n\n${compiledBody}\n\nभवदीय,\n${customer.name || 'आवेदक'}\nदिनांक: ${new Date().toLocaleDateString('hi-IN')}`;
    navigator.clipboard.writeText(fullText);
    showToast(isHindi ? 'आवेदन पत्र कॉपी हो गया!' : 'Text copied to clipboard!');
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
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <FileCode className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800">
              {isHindi ? 'आवेदन पत्र निर्माता (Application Letter Builder)' : 'Application Letter Builder'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isHindi
              ? 'तहसीलदार, उपजिलाधिकारी, विद्युत विभाग, बैंक शाखा एवं पूर्ति निरीक्षक हेतु मानक प्रार्थना पत्र।'
              : 'Standard formal letter formats with automatic session autofill, editable fields, and instant printing.'}
          </p>
        </div>

        {/* AI Writer trigger */}
        <button
          onClick={() => onNavigateToAiWriter(compiledSubject)}
          className="px-4 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 border border-purple-200 transition-colors"
        >
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>{isHindi ? 'AI से नया पत्र लिखवाएं' : 'Write Custom with AI'}</span>
        </button>
      </div>

      {/* Main Builder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Template Selector & Custom Field Controls */}
        <div className="lg:col-span-5 space-y-4">
          {/* 1. Template Picker */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
            <label className="block text-xs font-bold text-slate-700 mb-2">
              {isHindi ? 'प्रार्थना पत्र प्रारूप चुनें (Select Template)' : 'Select Application Template'}
            </label>
            <select
              value={selectedTemplateId}
              onChange={(e) => setSelectedTemplateId(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none"
            >
              {templates.map((tpl) => (
                <option key={tpl.id} value={tpl.id}>
                  {isHindi ? tpl.titleHi : tpl.titleEn}
                </option>
              ))}
            </select>

            <p className="text-xs text-slate-500 mt-2 font-normal">
              {isHindi ? activeTemplate?.descriptionHi : activeTemplate?.descriptionEn}
            </p>
          </div>

          {/* 2. Customer Session Autofill Status */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <UserCheck className="w-5 h-5 text-blue-700 shrink-0" />
              <div>
                <div className="font-bold text-xs text-blue-900">
                  {customer.name ? `${customer.name} (${customer.district})` : (isHindi ? 'कोई ग्राहक चयनित नहीं' : 'No Customer Set')}
                </div>
                <div className="text-[11px] text-blue-700">
                  {isHindi ? 'ग्राहक सत्र से विवरण स्वतः भरा गया है' : 'Auto-filled from active session'}
                </div>
              </div>
            </div>

            <button
              onClick={onOpenCustomerModal}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 underline"
            >
              {isHindi ? 'संशोधन करें' : 'Edit'}
            </button>
          </div>

          {/* 3. Template Dynamic Field Inputs */}
          {activeTemplate && activeTemplate.fields.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
              <h3 className="font-bold text-xs sm:text-sm text-slate-800 pb-2 border-b border-slate-100">
                {isHindi ? 'आवेदन पत्र के विशिष्ट विवरण' : 'Template Specific Fields'}
              </h3>

              {activeTemplate.fields.map((field) => (
                <div key={field.id}>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {isHindi ? field.labelHi : field.labelEn} {field.required && '*'}
                  </label>
                  {field.type === 'select' && field.options ? (
                    <select
                      value={fieldValues[field.id] || field.defaultValue || ''}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    >
                      {field.options.map((opt, i) => (
                        <option key={i} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      rows={3}
                      value={fieldValues[field.id] || field.defaultValue || ''}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={fieldValues[field.id] || field.defaultValue || ''}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      placeholder={isHindi ? field.placeholderHi : field.placeholderEn}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 4. Enclosures Checklist */}
          {requiredDocs.length > 0 && (
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4">
              <h4 className="font-bold text-xs text-slate-700 mb-2 flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isHindi ? 'संलग्न किए जाने वाले दस्तावेज' : 'Attached Documents'}</span>
              </h4>
              <ul className="space-y-1 text-xs text-slate-600">
                {requiredDocs.map((doc, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column: Live Printable Document Preview */}
        <div className="lg:col-span-7 space-y-4">
          {/* Action Toolbar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-3 flex flex-wrap items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
              <Eye className="w-4 h-4 text-blue-600" />
              <span>{isHindi ? 'लाइव प्रिंट प्रारूप (A4 Format)' : 'A4 Document Preview'}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyText}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs flex items-center gap-1"
                title="Copy Text"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{isHindi ? 'कॉपी करें' : 'Copy'}</span>
              </button>

              <button
                onClick={handleDownloadPdf}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isHindi ? 'PDF डाउनलोड' : 'PDF'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{isHindi ? 'प्रिंट निकालें (Print)' : 'Print'}</span>
              </button>
            </div>
          </div>

          {/* Actual Sheet Container (A4 Printable Canvas) */}
          <div
            ref={printAreaRef}
            className="bg-white rounded-2xl border border-slate-300 shadow-md p-6 sm:p-10 font-sans text-slate-900 leading-relaxed text-sm min-h-[580px]"
          >
            {/* Header Box */}
            <div className="text-center pb-4 mb-6 border-b-2 border-slate-800">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
                {isHindi ? 'प्रार्थना पत्र / औपचारिक आवेदन' : 'Formal Application / Official Request'}
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-950 font-serif">
                {title}
              </h2>
            </div>

            {/* Recipient */}
            <div className="mb-4 font-semibold text-slate-900 whitespace-pre-line leading-relaxed">
              {compiledRecipient}
            </div>

            {/* Subject */}
            <div className="mb-5 bg-slate-100 p-2.5 rounded border-l-4 border-blue-700 font-bold text-slate-950">
              {compiledSubject}
            </div>

            {/* Body */}
            <div className="mb-8 whitespace-pre-line leading-loose text-justify text-slate-800 font-normal">
              {compiledBody}
            </div>

            {/* Attached Docs List */}
            {requiredDocs.length > 0 && (
              <div className="mb-8 text-xs text-slate-700">
                <p className="font-bold text-slate-900 mb-1">
                  {isHindi ? 'संलग्नक (दस्तावेज सूची):' : 'Enclosures (Required Documents):'}
                </p>
                <ol className="list-decimal pl-5 space-y-0.5">
                  {requiredDocs.map((doc, idx) => (
                    <li key={idx}>{doc}</li>
                  ))}
                </ol>
              </div>
            )}

            {/* Footer Signature Box */}
            <div className="pt-8 border-t border-slate-300 flex items-end justify-between text-xs sm:text-sm">
              <div>
                <p className="font-bold">
                  {isHindi ? 'दिनांक:' : 'Date:'} {new Date().toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN')}
                </p>
                <p className="font-semibold text-slate-600">
                  {isHindi ? 'स्थान:' : 'Place:'} {customer.district || '........................'}
                </p>
              </div>

              <div className="text-right">
                <div className="h-10 border-b border-dashed border-slate-400 w-40 ml-auto mb-1"></div>
                <p className="font-bold">
                  {isHindi ? 'हस्ताक्षर / निशानी अंगूठा' : 'Signature / Thumb Impression'}
                </p>
                <p className="text-xs text-slate-600">
                  ({customer.name || (isHindi ? 'प्रार्थी का नाम' : 'Applicant Name')})
                </p>
                <p className="text-[11px] text-slate-500">
                  {isHindi ? 'मो०:' : 'Mobile:'} {customer.mobile || '....................'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
