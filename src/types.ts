export interface SliderItem {
  id: string;
  image: string;
  title: string;
  link: string;
  scheduledAt?: string;
}

export interface NotificationItem {
  id: string;
  image: string;
  title: string;
  message: string;
  buttonName: string;
  link: string;
  scheduledAt?: string;
}

export interface ParsedQuestion {
  q: string;
  o: string[];
  c: number; // correct option (1-indexed index mapping to options array)
  s: string; // explanation
  source?: string; // source reference
  image?: string; // optional image url for reasoning/math questions
  oa?: string[]; // option-specific analyses/explanations
}

export interface CouponConfig {
  code: string;
  startDate: string;
  endDate: string;
  maxAttempts: string; // "unlimited" or number string
}

export interface TestMeta {
  id: string;
  title: string;
  questionsEn: ParsedQuestion[];
  questionsHi: ParsedQuestion[];
  questionsOther?: { [langKey: string]: ParsedQuestion[] };
  duration: number; // in mins
  freeAttempts: number; // default free limit
  unlimitedAttempts: boolean;
  onlyUsers: string; // text with emails/mobiles restricted to (one per line or comma sep)
  coupon: CouponConfig | null;
  posMarks: number;
  negMarks: number;
  instructions: string;
  isPaid?: boolean;
  scheduledAt?: string; // ISO or YYYY-MM-DDTHH:mm string
}

export interface PDFMeta {
  id: string;
  title: string;
  url: string;
  isPaid?: boolean;
  scheduledAt?: string; // ISO or YYYY-MM-DDTHH:mm- string
}

export interface TopicNode {
  id: string;
  name: string;
  image?: string;
  test: TestMeta | null;
  pdf: PDFMeta | null;
  scheduledAt?: string;
  couponCode?: string;
  coupon?: CouponConfig | null;
  topics?: TopicNode[];
}

export interface SubCategoryNode {
  id: string;
  name: string;
  image: string;
  topics: TopicNode[];
  test: TestMeta | null;
  pdf: PDFMeta | null;
  scheduledAt?: string;
  couponCode?: string;
  coupon?: CouponConfig | null;
}

export interface CategoryNode {
  id: string;
  name: string;
  image: string;
  subCategories: SubCategoryNode[];
  test: TestMeta | null;
  pdf: PDFMeta | null;
  scheduledAt?: string;
  couponCode?: string;
  coupon?: CouponConfig | null;
  isPaid?: boolean;
  paymentAmount?: string;
  paymentValidityDays?: string;
  paymentBenefits?: string;
  paymentQr?: string;
  paymentUrl?: string;
}

export interface StudentUser {
  id: string;
  name: string;
  emailOrMobile: string; // matches email or phone
  phoneNo?: string;
  password: string;
  purchaseDate?: string; // YYYY-MM-DD
  expiryDate?: string; // YYYY-MM-DD
  unlockedCategoryIds?: string[];
  categoryDates?: {
    [catId: string]: {
      purchaseDate?: string;
      expiryDate?: string;
      isLifetime?: boolean;
    };
  };
}

export interface CustomSocialLink {
  id: string;
  name: string;
  url: string;
  color?: string;
  icon?: string;
}

export interface WebsitePopup {
  id: string;
  title: string;
  text: string;
  imageUrl: string;
  redirectUrl: string;
  startTime: string; // YYYY-MM-DDTHH:mm
  endTime: string; // YYYY-MM-DDTHH:mm
  order: number; // for sorting order prioritization
  isActive: boolean;
}

export interface AdSenseConfig {
  enabled: boolean;
  publisherId: string;
  homeTopSlotId?: string;
  homeBottomSlotId?: string;
  sidebarSlotId?: string;
}

export interface AppConfig {
  appName: string;
  logoUrl: string;
  studentGreeting: string;
  studentSubGreeting?: string;
  sliders: SliderItem[];
  notifications: NotificationItem[];
  testCategories: CategoryNode[];
  pdfCategories: CategoryNode[];
  students: StudentUser[];
  popups?: WebsitePopup[];
  adsense?: AdSenseConfig;
  social: {
    whatsapp: string;
    telegram: string;
    instagram?: string;
    youtube?: string;
    other?: string;
    otherName?: string;
    paymentQr: string;
    paymentAmount: string;
    customLinks?: CustomSocialLink[];
    premiumPrice?: string;
    premiumDurationText?: string;
    premiumValidityText?: string;
    premiumBenefitsText?: string;
    hideSourceOnStudent?: boolean;
    qrDownloadText?: string;
    qrDownloadLink?: string;
    googleVerificationId?: string;
    apkUrl?: string;
    apkDownloadText?: string;
    paymentContactLink?: string;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    canonicalUrl?: string;
    ogImage?: string;
    author?: string;
    googleSiteVerification?: string;
    bingSiteVerification?: string;
    schemaBusinessName?: string;
    schemaRatingValue?: string;
    schemaReviewCount?: string;
  };
}
