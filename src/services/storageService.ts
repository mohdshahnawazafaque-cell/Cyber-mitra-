import {
  AppState,
  CustomerData,
  GovernmentService,
  ServiceHistoryItem,
  SessionFile,
  PrintJob,
  ApplicationTemplate,
  AdminActivityLog,
} from '../types';
import { INITIAL_SERVICES, INITIAL_STATES, INITIAL_AD_SLOTS } from '../data/initialData';
import { INITIAL_APPLICATION_TEMPLATES } from '../data/initialTemplates';

const STORAGE_KEY = 'CYBER_MITRA_DATA_V1';

export const DEFAULT_CUSTOMER: CustomerData = {
  id: 'cust_default',
  name: '',
  fatherMotherName: '',
  dob: '',
  gender: 'Male',
  address: '',
  villageTown: '',
  district: '',
  state: 'Uttar Pradesh',
  pincode: '',
  mobile: '',
  aadhaarNumber: '',
  category: 'General',
  purpose: '',
  notes: '',
  dateCreated: new Date().toISOString(),
};

export const INITIAL_PROMOS: PromoItem[] = [
  {
    id: 'promo-1',
    title: 'सभी सरकारी योजनाएं',
    subtitle: 'PM किसान, पेंशन और अन्य आवेदन',
    imageUrl: 'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    linkUrl: '#',
    isActive: true,
    order: 1
  },
  {
    id: 'promo-2',
    title: 'पैन कार्ड एवं पहचान पत्र',
    subtitle: 'नया पैन कार्ड बनाएं या सुधार करें',
    imageUrl: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    linkUrl: '#',
    isActive: true,
    order: 2
  },
  {
    id: 'promo-3',
    title: 'प्रोमो डिज़ाइनर व बिलिंग',
    subtitle: 'बिज़नेस के लिए पोस्टर और बिल बनाएं',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    linkUrl: '#',
    isActive: true,
    order: 3
  },
  {
    id: 'promo-4',
    title: 'ई-डिस्ट्रिक्ट सेवाएं',
    subtitle: 'आय, जाति, निवास व जन्म प्रमाण पत्र',
    imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    linkUrl: '#',
    isActive: true,
    order: 4
  },
  {
    id: 'promo-5',
    title: 'बैंकिंग व बिल भुगतान',
    subtitle: 'बिजली बिल, मनी ट्रान्सफर और बीमा',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    linkUrl: '#',
    isActive: true,
    order: 5
  }
];

export const DEFAULT_STATE: AppState = {
  language: 'en',
  selectedState: 'UP',
  services: INITIAL_SERVICES,
  favorites: ['uidai-aadhaar', 'pan-card-services', 'up-edistrict-services', 'pm-kisan-portal'],
  recentlyUsed: [
    {
      id: 'rec-1',
      itemId: 'uidai-aadhaar',
      itemTitleHi: 'आधार कार्ड सेवाएं (UIDAI)',
      itemTitleEn: 'Aadhaar Services (UIDAI)',
      type: 'service',
      timestamp: new Date().toISOString(),
      url: 'https://myaadhaar.uidai.gov.in/',
    },
    {
      id: 'rec-2',
      itemId: 'up-edistrict-services',
      itemTitleHi: 'यूपी ई-डिस्ट्रिक्ट (आय/जाति/निवास)',
      itemTitleEn: 'UP eDistrict Services',
      type: 'service',
      timestamp: new Date().toISOString(),
      url: 'https://edistrict.up.gov.in/',
    },
  ],
  customer: DEFAULT_CUSTOMER,
  activeFiles: [],
  printQueue: [],
  applicationTemplates: INITIAL_APPLICATION_TEMPLATES,
  states: INITIAL_STATES,
  adSlots: INITIAL_AD_SLOTS,
  activityLogs: [
    {
      id: 'log-1',
      actionHi: 'सिस्टम प्रारंभ',
      actionEn: 'System Initialized',
      details: 'Cyber Mitra Cyber Cafe Work Portal Ready.',
      timestamp: new Date().toISOString(),
    },
  ],
  isAdminLoggedIn: false,
  activeView: 'home',
  adminEmail: 'mohdshahnawaz.afaque@gmail.com',
  adminPassword: 'Sh@sahiba9653',
  autoCleanupMinutes: 60,
  theme: 'professional',
  promos: INITIAL_PROMOS,
};

export const loadAppState = (): AppState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    // Merge new services that might have been added to INITIAL_SERVICES but are missing in local storage
    const mergedServices = INITIAL_SERVICES.map(initService => {
      const existing = parsed.services?.find((s: any) => s.id === initService.id);
      if (existing) {
        // Always force update officialLinks from INITIAL_SERVICES so any bug fixes or URL updates apply immediately
        existing.officialLinks = { ...initService.officialLinks };
        return existing;
      }
      return initService;
    });

    return {
      ...DEFAULT_STATE,
      ...parsed,
      activeView: parsed.activeView || 'home',
      language: parsed.language || 'hi',
      adminEmail: parsed.adminEmail || 'mohdshahnawaz.afaque@gmail.com',
      adminPassword: parsed.adminPassword || 'Sh@sahiba9653',
      theme: parsed.theme || 'professional',
      promos: parsed.promos?.length ? parsed.promos : INITIAL_PROMOS,
      services: mergedServices,
      applicationTemplates: parsed.applicationTemplates?.length
        ? parsed.applicationTemplates
        : INITIAL_APPLICATION_TEMPLATES,
      states: parsed.states?.length ? parsed.states : INITIAL_STATES,
      adSlots: parsed.adSlots?.length ? parsed.adSlots : INITIAL_AD_SLOTS,
      customer: parsed.customer || DEFAULT_CUSTOMER,
      activeFiles: parsed.activeFiles || [],
      printQueue: parsed.printQueue || [],
      favorites: parsed.favorites || DEFAULT_STATE.favorites,
      recentlyUsed: parsed.recentlyUsed || DEFAULT_STATE.recentlyUsed,
      activityLogs: parsed.activityLogs || DEFAULT_STATE.activityLogs,
    };
  } catch (e) {
    console.error('Failed to load Cyber Mitra state from localStorage', e);
    return DEFAULT_STATE;
  }
};

export const saveAppState = (state: AppState) => {
  try {
    // Only persist non-huge blobs in storage if possible
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Storage quota exceeded or error while saving state, trimming files', e);
    try {
      const trimmedState = {
        ...state,
        activeFiles: state.activeFiles.slice(-5), // keep last 5 active files
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedState));
    } catch (e2) {
      console.error('Final fallback save failed', e2);
    }
  }
};

export const addHistoryLog = (
  state: AppState,
  item: Omit<ServiceHistoryItem, 'id' | 'timestamp'>
): AppState => {
  const newLog: ServiceHistoryItem = {
    ...item,
    id: 'hist_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    timestamp: new Date().toISOString(),
  };

  const filtered = state.recentlyUsed.filter((h) => h.itemId !== item.itemId);
  const updatedRecentlyUsed = [newLog, ...filtered].slice(0, 30);

  const updatedState = {
    ...state,
    recentlyUsed: updatedRecentlyUsed,
  };
  saveAppState(updatedState);
  return updatedState;
};

export const addAdminLog = (
  state: AppState,
  actionHi: string,
  actionEn: string,
  details: string
): AppState => {
  const newLog: AdminActivityLog = {
    id: 'act_' + Date.now(),
    actionHi,
    actionEn,
    details,
    timestamp: new Date().toISOString(),
  };
  const updatedState = {
    ...state,
    activityLogs: [newLog, ...(state.activityLogs || [])].slice(0, 100),
  };
  saveAppState(updatedState);
  return updatedState;
};

export const clearCustomerSessionData = (state: AppState): AppState => {
  const clearedState: AppState = {
    ...state,
    customer: {
      ...DEFAULT_CUSTOMER,
      id: 'cust_' + Date.now(),
      dateCreated: new Date().toISOString(),
    },
    activeFiles: [],
  };
  saveAppState(clearedState);
  return clearedState;
};

export const clearCustomerSession = (state: AppState): AppState => {
  return clearCustomerSessionData(state);
};

export const recordActivityLog = (state: AppState, actionEn: string, details: string): AppState => {
  return addAdminLog(state, actionEn, actionEn, details);
};

export const exportBackupJSON = (state: AppState): string => {
  const backupData = {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    services: state.services,
    applicationTemplates: state.applicationTemplates,
    states: state.states,
    adSlots: state.adSlots,
    favorites: state.favorites,
    activityLogs: state.activityLogs,
  };
  return JSON.stringify(backupData, null, 2);
};

export const importBackupJSON = (state: AppState, jsonString: string): AppState => {
  const data = JSON.parse(jsonString);
  const updatedState: AppState = {
    ...state,
    services: Array.isArray(data.services) ? data.services : state.services,
    applicationTemplates: Array.isArray(data.applicationTemplates)
      ? data.applicationTemplates
      : state.applicationTemplates,
    states: Array.isArray(data.states) ? data.states : state.states,
    adSlots: Array.isArray(data.adSlots) ? data.adSlots : state.adSlots,
    favorites: Array.isArray(data.favorites) ? data.favorites : state.favorites,
    promos: Array.isArray(data.promos) ? data.promos : state.promos,
  };
  saveAppState(updatedState);
  return updatedState;
};
