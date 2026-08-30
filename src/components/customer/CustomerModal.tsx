import React, { useState, useEffect } from 'react';
import { User, Phone, MapPin, Calendar, CreditCard, Save, X, Trash2, CheckCircle2 } from 'lucide-react';
import { CustomerData, Language } from '../../types';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerData;
  onSaveCustomer: (customer: CustomerData) => void;
  onClearCustomer: () => void;
  language: Language;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({
  isOpen,
  onClose,
  customer,
  onSaveCustomer,
  onClearCustomer,
  language,
}) => {
  const isHindi = language === 'hi';
  const [formData, setFormData] = useState<CustomerData>(customer);

  useEffect(() => {
    setFormData(customer);
  }, [customer, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: keyof CustomerData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCustomer(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/70 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 bg-blue-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5" />
            <h2 className="font-extrabold text-base sm:text-lg">
              {isHindi ? 'ग्राहक कार्य सत्र (Customer Work Session)' : 'Customer Work Session'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-blue-800 hover:bg-blue-900 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-900">
          💡 {isHindi
            ? 'यहाँ ग्राहक का विवरण एक बार भरें। यह सभी आवेदन पत्रों, फोटो शीट एवं प्रिंट कार्यों में अपने-आप भर जाएगा।'
            : 'Fill customer info once here. It will auto-fill in all Application templates and Print jobs.'}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Customer Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isHindi ? 'ग्राहक का नाम (Customer Name) *' : 'Customer Name *'}
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder={isHindi ? 'उदा० रमेश कुमार' : 'e.g. Ramesh Kumar'}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            {/* Father / Mother / Husband Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isHindi ? 'पिता / माता / पति का नाम *' : "Father / Mother / Spouse Name *"}
              </label>
              <input
                type="text"
                required
                value={formData.fatherMotherName}
                onChange={(e) => handleChange('fatherMotherName', e.target.value)}
                placeholder={isHindi ? 'उदा० श्री रामप्रसाद' : 'e.g. Shri Ram Prasad'}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isHindi ? 'मोबाइल नंबर (Mobile Number) *' : 'Mobile Number *'}
              </label>
              <input
                type="tel"
                maxLength={10}
                value={formData.mobile}
                onChange={(e) => handleChange('mobile', e.target.value)}
                placeholder="10 अंकों का मोबाइल नंबर"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isHindi ? 'जन्म तिथि (Date of Birth)' : 'Date of Birth'}
              </label>
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => handleChange('dob', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            {/* Gender & Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isHindi ? 'लिंग (Gender)' : 'Gender'}
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                <option value="Male">{isHindi ? 'पुरुष (Male)' : 'Male'}</option>
                <option value="Female">{isHindi ? 'महिला (Female)' : 'Female'}</option>
                <option value="Other">{isHindi ? 'अन्य (Other)' : 'Other'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isHindi ? 'आरक्षण श्रेणी (Category)' : 'Category'}
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                <option value="General">{isHindi ? 'सामान्य (General)' : 'General'}</option>
                <option value="OBC">{isHindi ? 'अन्य पिछड़ा वर्ग (OBC)' : 'OBC'}</option>
                <option value="SC">{isHindi ? 'अनुसूचित जाति (SC)' : 'SC'}</option>
                <option value="ST">{isHindi ? 'अनुसूचित जनजाति (ST)' : 'ST'}</option>
                <option value="EWS">{isHindi ? 'ईडब्ल्यूएस (EWS)' : 'EWS'}</option>
              </select>
            </div>

            {/* Aadhaar Number (Optional) */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isHindi ? 'आधार नंबर (Aadhaar Number - Optional)' : 'Aadhaar Number (Optional)'}
              </label>
              <input
                type="text"
                maxLength={14}
                value={formData.aadhaarNumber || ''}
                onChange={(e) => handleChange('aadhaarNumber', e.target.value)}
                placeholder="XXXX-XXXX-XXXX"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none font-mono"
              />
            </div>

            {/* Address */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isHindi ? 'मकान नंबर / पूरा पता (Full Address)' : 'Full Address'}
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder={isHindi ? 'उदा० मकान नं० 42, सिविल लाइन्स' : 'e.g. House No. 42, Civil Lines'}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            {/* Village / Town */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isHindi ? 'ग्राम / मोहल्ला / कस्बा' : 'Village / Ward / Town'}
              </label>
              <input
                type="text"
                value={formData.villageTown}
                onChange={(e) => handleChange('villageTown', e.target.value)}
                placeholder="उदा० रसूलपुर"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            {/* District */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isHindi ? 'जनपद (District)' : 'District'}
              </label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => handleChange('district', e.target.value)}
                placeholder="उदा० लखनऊ / प्रयागराज"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            {/* State & Pincode */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isHindi ? 'राज्य (State)' : 'State'}
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => handleChange('state', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isHindi ? 'पिनकोड (Pincode)' : 'Pincode'}
              </label>
              <input
                type="text"
                maxLength={6}
                value={formData.pincode}
                onChange={(e) => handleChange('pincode', e.target.value)}
                placeholder="226001"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                onClearCustomer();
                onClose();
              }}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-lg text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>{isHindi ? 'सत्र मिटाएं (Clear)' : 'Clear Session'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs sm:text-sm"
              >
                {isHindi ? 'रद्द करें' : 'Cancel'}
              </button>

              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs sm:text-sm flex items-center gap-1.5 shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>{isHindi ? 'सत्र में सहेजें (Save Session)' : 'Save in Session'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
