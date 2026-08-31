const fs = require('fs');

const code = `import React, { useState, useRef } from 'react';
import { Download, Printer, RefreshCw, Plus, Trash2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Language } from '../../types';

interface FamilyMember {
  id: string;
  name: string;
  fatherName: string;
  relation: string;
  dob: string;
  gender: string;
  maritalStatus: string;
  isDeceased: boolean;
  dod: string;
}

interface VanshavaliCertificateProps {
  language: Language;
}

const RELATIONS = ['स्वयं', 'पिता', 'माता', 'पति', 'पत्नी', 'पुत्र', 'पुत्री', 'भाई', 'बहन', 'दादा', 'दादी', 'पोता', 'पोती', 'अन्य'];
const GENDERS = ['पुरुष', 'महिला', 'अन्य'];
const MARITAL_STATUS = ['लागू नहीं', 'विवाहित', 'अविवाहित', 'विधवा', 'विधुर', 'तलाकशुदा'];
const APPLICANT_RELATIONS = ['पुत्र', 'पुत्री', 'पत्नी'];

export const VanshavaliCertificate: React.FC<VanshavaliCertificateProps> = ({ language }) => {
  const isHindi = language === 'hi';
  const previewRef = useRef<HTMLDivElement>(null);

  // Form State
  const [applicantName, setApplicantName] = useState('');
  const [applicantRelation, setApplicantRelation] = useState('पुत्र');
  const [fatherName, setFatherName] = useState('');
  const [address, setAddress] = useState('');
  const [panchayat, setPanchayat] = useState('नगर पंचायत तम्बौर अहमदाबाद');
  const [tehsil, setTehsil] = useState('लहरपुर');
  const [district, setDistrict] = useState('सीतापुर');
  
  // Signatory State
  const [signDesignation, setSignDesignation] = useState('अध्यक्ष');

  const initialMember = (): FamilyMember => ({
    id: Date.now().toString(),
    name: '',
    fatherName: '',
    relation: 'स्वयं',
    dob: '',
    gender: 'पुरुष',
    maritalStatus: 'लागू नहीं',
    isDeceased: false,
    dod: ''
  });

  const [members, setMembers] = useState<FamilyMember[]>([initialMember()]);

  const today = new Date().toISOString().split('T')[0];

  const addMember = () => {
    setMembers([...members, initialMember()]);
  };

  const removeMember = (id: string) => {
    if (members.length > 1) {
      setMembers(members.filter(m => m.id !== id));
    }
  };

  const updateMember = <K extends keyof FamilyMember>(id: string, field: K, value: FamilyMember[K]) => {
    setMembers(members.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const resetForm = () => {
    if (window.confirm(isHindi ? 'क्या आप फॉर्म रीसेट करना चाहते हैं?' : 'Are you sure you want to reset?')) {
      setApplicantName('');
      setFatherName('');
      setAddress('');
      setMembers([initialMember()]);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;
    
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
      pdf.save(\`Vanshavali_Certificate_\${applicantName || 'Applicant'}.pdf\`);
    } catch (err) {
      console.error('PDF Generation failed:', err);
      alert('PDF तैयार करने में त्रुटि हुई।');
    }
  };

  const getCalculatedAgeRaw = (dob: string, isDeceased: boolean, dod: string): string => {
    if (!dob) return '';
    // If deceased but no DOD is provided, we can't reliably calculate age at time of death
    if (isDeceased && !dod) return ''; 

    const birthDate = new Date(dob);
    const endDate = (isDeceased && dod) ? new Date(dod) : new Date();
    
    if (birthDate > endDate) return ''; // Invalid DOB

    let ageYears = endDate.getFullYear() - birthDate.getFullYear();
    const m = endDate.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && endDate.getDate() < birthDate.getDate())) {
      ageYears--;
    }
    
    if (ageYears < 0) return '';
    return ageYears.toString();
  };

  const getCalculatedAgeDisplay = (dob: string, isDeceased: boolean, dod: string): string => {
    const rawAge = getCalculatedAgeRaw(dob, isDeceased, dod);
    if (!rawAge) return '';
    return \`\${rawAge} वर्ष लगभग\`;
  };

  const getDisplayRelation = (member: FamilyMember): string => {
    let rel = member.relation;
    
    if (member.gender === 'महिला' && (member.maritalStatus === 'अविवाहित' || member.maritalStatus === 'विवाहित')) {
      rel = \`\${rel} (\${member.maritalStatus})\`;
    }
    
    if (member.isDeceased) {
      rel = \`\${rel} (मृतक)\`;
    }
    
    return rel;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">
          {isHindi ? 'वंशावली प्रमाण-पत्र मेकर' : 'Family Tree Certificate Maker'}
        </h2>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* FORM SECTION */}
        <div className="xl:col-span-4 space-y-5 print:hidden max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
          
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 border-b pb-2">आवेदक का विवरण (Applicant Details)</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">आवेदक का नाम</label>
                <input
                  type="text"
                  value={applicantName}
                  onChange={e => setApplicantName(e.target.value)}
                  placeholder="उदा. कामरान"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-blue-500 outline-none transition-all"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">सम्बन्ध</label>
                  <select
                    value={applicantRelation}
                    onChange={e => setApplicantRelation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-blue-500 outline-none"
                  >
                    {APPLICANT_RELATIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">पिता/पति का नाम</label>
                  <input
                    type="text"
                    value={fatherName}
                    onChange={e => setFatherName(e.target.value)}
                    placeholder="उदा. नसीर खां"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">निवासी (मोहल्ला/ग्राम)</label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="उदा. मो0 अहमदाबाद गंज"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">नगर पंचायत/नगर पालिका</label>
                  <input
                    type="text"
                    value={panchayat}
                    onChange={e => setPanchayat(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">तहसील</label>
                  <input
                    type="text"
                    value={tehsil}
                    onChange={e => setTehsil(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">जनपद (District)</label>
                <input
                  type="text"
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-slate-800">परिवार के सदस्य (Family Members)</h3>
              <button 
                onClick={addMember}
                className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded transition-colors"
              >
                <Plus className="w-3 h-3" /> सदस्य जोड़ें
              </button>
            </div>
            
            <div className="space-y-4">
              {members.map((member, index) => (
                <div key={member.id} className="relative p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
                  <div className="absolute -top-2 -left-2 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow">
                    {index + 1}
                  </div>
                  {members.length > 1 && (
                    <button 
                      onClick={() => removeMember(member.id)}
                      className="absolute top-2 right-2 text-slate-400 hover:text-red-600 transition-colors p-1 bg-white rounded-md shadow-sm border border-slate-100"
                      title="हटाएं"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">नाम</label>
                      <input
                        type="text"
                        value={member.name}
                        onChange={e => updateMember(member.id, 'name', e.target.value)}
                        placeholder="नाम"
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded text-xs outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">पिता/पति का नाम</label>
                      <input
                        type="text"
                        value={member.fatherName}
                        onChange={e => updateMember(member.id, 'fatherName', e.target.value)}
                        placeholder="पिता/पति का नाम"
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded text-xs outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">सम्बन्ध</label>
                      <select
                        value={member.relation}
                        onChange={e => updateMember(member.id, 'relation', e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded text-xs outline-none focus:border-blue-500"
                      >
                        {RELATIONS.map(rel => <option key={rel} value={rel}>{rel}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">लिंग</label>
                      <select
                        value={member.gender}
                        onChange={e => updateMember(member.id, 'gender', e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded text-xs outline-none focus:border-blue-500"
                      >
                        {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">वैवाहिक स्थिति</label>
                      <select
                        value={member.maritalStatus}
                        onChange={e => updateMember(member.id, 'maritalStatus', e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded text-xs outline-none focus:border-blue-500"
                      >
                        {MARITAL_STATUS.map(ms => <option key={ms} value={ms}>{ms}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* DOB & AUTO AGE calculation row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end bg-slate-100/50 p-2 rounded-lg border border-slate-100">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase text-blue-700">जन्म तिथि (DOB)</label>
                      <input
                        type="date"
                        max={today}
                        value={member.dob}
                        onChange={e => updateMember(member.id, 'dob', e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-blue-200 rounded text-xs outline-none focus:border-blue-500 text-slate-800 font-medium"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">आयु (Auto-calculated)</label>
                      <div className="w-full px-2 py-1.5 bg-slate-200/70 border border-slate-200 rounded text-xs text-slate-700 font-bold h-[30px] flex items-center cursor-not-allowed">
                        {getCalculatedAgeRaw(member.dob, member.isDeceased, member.dod) 
                          ? \`\${getCalculatedAgeRaw(member.dob, member.isDeceased, member.dod)} वर्ष\` 
                          : '--'}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 h-[30px] pb-1 pl-1">
                      <input
                        type="checkbox"
                        id={\`deceased-\${member.id}\`}
                        checked={member.isDeceased}
                        onChange={e => {
                          updateMember(member.id, 'isDeceased', e.target.checked);
                          if (!e.target.checked) updateMember(member.id, 'dod', '');
                        }}
                        className="w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
                      />
                      <label htmlFor={\`deceased-\${member.id}\`} className="text-xs font-bold text-red-700 cursor-pointer">
                        मृतक
                      </label>
                    </div>
                  </div>

                  {member.isDeceased && (
                    <div className="pt-2 border-t border-red-100 mt-2">
                      <label className="block text-[10px] font-bold text-red-700 mb-1 uppercase">मृत्यु की तिथि (DOD)</label>
                      <input
                        type="date"
                        max={today}
                        value={member.dod}
                        onChange={e => updateMember(member.id, 'dod', e.target.value)}
                        className="w-full sm:w-1/2 px-2 py-1.5 bg-white border border-red-200 rounded text-xs outline-none focus:border-red-500 text-slate-700"
                      />
                      <p className="text-[9.5px] text-slate-500 mt-1.5">मृत्यु के समय की उम्र निकालने हेतु यह तिथि भरें।</p>
                    </div>
                  )}

                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 border-b pb-2">हस्ताक्षरकर्ता (Signatory)</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">पद (Designation)</label>
                <input
                  type="text"
                  value={signDesignation}
                  onChange={e => setSignDesignation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 sticky bottom-0 bg-slate-50 p-2 pb-4 pt-4 border-t border-slate-200 z-10">
            <button
              onClick={handlePrint}
              className="col-span-1 px-3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md transition-colors flex items-center justify-center gap-1.5"
            >
              <Printer className="w-4 h-4" /> प्रिंट करें
            </button>
            <button
              onClick={handleDownloadPDF}
              className="col-span-1 px-3 py-2.5 bg-slate-800 hover:bg-black text-white font-bold rounded-xl text-sm shadow-md transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4" /> PDF डाउनलोड
            </button>
            <button
              onClick={resetForm}
              className="col-span-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4" /> रीसेट करें
            </button>
          </div>
        </div>

        {/* LIVE PREVIEW SECTION */}
        <div className="xl:col-span-8 bg-slate-100 p-2 sm:p-8 rounded-xl border border-slate-200 overflow-x-auto w-full flex justify-center">
          <div 
            className="print-exact bg-white shadow-2xl relative text-black flex flex-col shrink-0"
            style={{ 
              width: '210mm',
              minHeight: '297mm',
              padding: '25mm 20mm', // Standard margins for A4
              fontFamily: '"Tiro Devanagari Hindi", Arial, sans-serif'
            }}
            ref={previewRef}
          >
            
            {/* Title */}
            <div className="flex justify-center mb-10 mt-4">
              <h1 className="text-[34px] font-black border-b-[3px] border-black pb-1 px-4 tracking-wide">
                वंशावली प्रमाण–पत्र
              </h1>
            </div>

            {/* Declaration Body */}
            <div className="text-[17px] leading-[1.8] text-justify mb-8 font-medium">
              <p>
                प्रमाणित किया जाता है कि प्रार्थी <strong>{applicantName || '____________________'}</strong> <strong>{applicantRelation}</strong> <strong>{fatherName || '____________________'}</strong> निवासी <strong>{address || '____________________'} {panchayat}</strong> तहसील <strong>{tehsil}</strong> जिला <strong>{district}</strong> के परिवार का विवरण गवाहों व वार्ड सदस्य की आख्या के अनुसार निम्नवत है। यदि प्रस्तुत साक्ष्य में किसी प्रकार का कोई तथ्य छिपाया गया या इसमें कोई त्रुटि पाई जाती है। तो उसका उत्तरदायित्व शपथकर्ता / शपथकर्ती का होगा। जो निम्नवत है।
              </p>
            </div>

            {/* Table */}
            <div className="mb-16">
              <table className="w-full border-collapse border border-black text-center text-[15px] font-medium">
                <thead>
                  <tr className="border-b border-black">
                    <th className="border-r border-black py-2 px-1 w-[8%] font-bold">क्रo सo</th>
                    <th className="border-r border-black py-2 px-2 w-[28%] font-bold">नाम</th>
                    <th className="border-r border-black py-2 px-2 w-[28%] font-bold">पिता/पति का नाम</th>
                    <th className="border-r border-black py-2 px-2 w-[18%] font-bold">सम्बन्ध</th>
                    <th className="py-2 px-2 w-[18%] font-bold">आयु</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((m, idx) => (
                    <tr key={m.id} className="border-b border-black last:border-b-0">
                      <td className="border-r border-black py-1.5 px-1">{idx + 1}</td>
                      <td className="border-r border-black py-1.5 px-2 text-left">{m.name || '\u00A0'}</td>
                      <td className="border-r border-black py-1.5 px-2 text-left">{m.fatherName || '\u00A0'}</td>
                      <td className="border-r border-black py-1.5 px-2">{getDisplayRelation(m) || '\u00A0'}</td>
                      <td className="py-1.5 px-2">{getCalculatedAgeDisplay(m.dob, m.isDeceased, m.dod) || '\u00A0'}</td>
                    </tr>
                  ))}
                  {/* Fill empty rows to make it look standard if few members */}
                  {Array.from({ length: Math.max(0, 5 - members.length) }).map((_, idx) => (
                    <tr key={\`empty-\${idx}\`} className="border-b border-black last:border-b-0 h-9">
                      <td className="border-r border-black py-1.5 px-1">{members.length + idx + 1}</td>
                      <td className="border-r border-black py-1.5 px-2"></td>
                      <td className="border-r border-black py-1.5 px-2"></td>
                      <td className="border-r border-black py-1.5 px-2"></td>
                      <td className="py-1.5 px-2"></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Signatures */}
            <div className="mt-auto flex justify-end pr-8">
              <div className="flex flex-col items-center w-[40%] text-center">
                <div className="text-[17px] font-bold leading-snug">
                  {signDesignation}<br/>
                  {panchayat}<br/>
                  जनपद {district}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{\`
        @import url('https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Hindi:ital@0;1&display=swap');
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
            background-color: white;
          }
          body * {
            visibility: hidden;
          }
          .print-exact, .print-exact * {
            visibility: visible;
          }
          .print-exact {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm !important;
            min-height: 297mm !important;
            transform: none !important;
            margin: 0 !important;
            padding: 25mm 20mm !important;
            box-shadow: none !important;
            border: none !important;
            page-break-after: always;
          }
          .print\\\\:hidden {
            display: none !important;
          }
        }
      \`}</style>
    </div>
  );
};
`
fs.writeFileSync('src/components/tools/VanshavaliCertificate.tsx', code);
console.log("Updated VanshavaliCertificate.tsx");
