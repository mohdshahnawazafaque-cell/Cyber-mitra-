export type Language = 'hi' | 'en';

export type ServiceCategory =
  | 'id_services'
  | 'certificates'
  | 'schemes'
  | 'applications'
  | 'payments'
  | 'land_records'
  | 'police_legal'
  | 'finance'
  | 'other';

export interface OfficialLinks {
  apply?: string;
  newApply?: string;
  correction?: string;
  status?: string;
  download?: string;
  print?: string;
  officialPortal?: string;
  renewal?: string;
}

export interface ServiceLinkStatus {
  isReachable: boolean;
  httpStatus?: number;
  lastChecked: string;
  error?: string;
}

export interface GovernmentService {
  id: string;
  titleHi: string;
  titleEn: string;
  category: ServiceCategory;
  stateCode: string; // 'UP', 'ALL', etc.
  descHi: string;
  descEn: string;
  isPopular: boolean;
  isQuickAccess: boolean;
  isFavorite?: boolean;
  order: number;
  active: boolean;
  officialLinks: OfficialLinks;
  requiredDocsHi: string[];
  requiredDocsEn: string[];
  smartPresets?: string[];
  tags: string[];
  linkStatus?: ServiceLinkStatus;
}

export interface TemplateField {
  id: string;
  labelHi: string;
  labelEn: string;
  type: 'text' | 'textarea' | 'date' | 'number' | 'select';
  options?: string[];
  required: boolean;
  defaultValue?: string;
  placeholderHi?: string;
  placeholderEn?: string;
}

export interface ApplicationTemplate {
  id: string;
  titleHi: string;
  titleEn: string;
  category: ServiceCategory | 'general';
  stateCode?: string;
  descriptionHi: string;
  descriptionEn: string;
  subjectHi: string;
  subjectEn: string;
  recipientHi: string;
  recipientEn: string;
  templateBodyHi: string;
  templateBodyEn: string;
  fields: TemplateField[];
  requiredDocumentsHi: string[];
  requiredDocumentsEn: string[];
}

export interface CustomerData {
  id: string;
  name: string;
  fatherMotherName: string;
  dob: string;
  gender: string;
  address: string;
  villageTown: string;
  district: string;
  state: string;
  pincode: string;
  mobile: string;
  aadhaarNumber?: string;
  category: string; // Gen, OBC, SC, ST, EWS
  purpose?: string;
  notes?: string;
  dateCreated: string;
}

export interface SessionFile {
  id: string;
  name: string;
  type: string; // image/jpeg, image/png, application/pdf, etc.
  dataUrl: string;
  sizeKB: number;
  dimensions?: { width: number; height: number };
  createdAt?: string;
  timestamp?: string;
  category?: 'photo' | 'signature' | 'document' | 'id_card' | 'pdf' | 'generated' | string;
}

export interface PrintJob {
  id: string;
  title: string;
  fileDataUrl?: string;
  dataUrl?: string;
  fileType?: 'image' | 'pdf' | 'text' | string;
  layout?: 'passport-sheet' | 'id-card-duo' | 'a4-doc' | 'custom' | string;
  copies?: number;
  paperSize: 'A4' | '4x6' | 'Letter' | string;
  photoGridCols?: number;
  photoGridRows?: number;
  showBorders?: boolean;
  showCutLines?: boolean;
  stampName?: string;
  stampDate?: string;
  marginMm?: number;
  createdAt?: string;
  timestamp?: string;
  status?: string;
}

export interface ServiceHistoryItem {
  id: string;
  itemId: string;
  itemTitleHi: string;
  itemTitleEn: string;
  type: 'service' | 'tool' | 'template' | 'print';
  timestamp: string;
  url?: string;
}

export interface AdSlotConfig {
  id: string;
  name: string;
  placement?: 'header' | 'sidebar' | 'content' | 'footer' | 'mobile_top' | string;
  enabled: boolean;
  adType?: 'adsense' | 'custom_image';
  imageUrl?: string;
  linkUrl?: string;
  customCode?: string;
  code?: string;
  size?: string;
}

export interface AdminActivityLog {
  id: string;
  actionHi: string;
  actionEn: string;
  details: string;
  timestamp: string;
}

export interface StateItem {
  code: string;
  nameHi: string;
  nameEn: string;
  active: boolean;
  isDefault: boolean;
}

export interface PromoItem {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
  order: number;
}

export interface AppState {
  language: Language;
  selectedState: string;
  services: GovernmentService[];
  favorites: string[];
  recentlyUsed: ServiceHistoryItem[];
  customer: CustomerData;
  activeFiles: SessionFile[];
  printQueue: PrintJob[];
  applicationTemplates: ApplicationTemplate[];
  promos: PromoItem[];
  states: StateItem[];
  adSlots: AdSlotConfig[];
  activityLogs: AdminActivityLog[];
  isAdminLoggedIn: boolean;
  activeView?: string;
  adminEmail?: string;
  adminPassword?: string;
  autoCleanupMinutes: number;
  theme?: 'professional' | 'high-contrast';
}
