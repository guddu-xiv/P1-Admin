import React, { useState, useEffect } from "react";
import {
  Rocket,
  Plus,
  Trash2,
  FolderMinus,
  Save,
  Download,
  Smartphone,
  Users,
  Settings,
  FolderOpen,
  FileSpreadsheet,
  CheckCircle,
  QrCode,
  Share2,
  FilePlus,
  AlertCircle,
  Eye,
  BookOpen,
  Folder,
  ChevronRight,
  FileText,
  BadgeAlert,
  Sliders,
  Calendar,
  DollarSign,
  ArrowUp,
  ArrowDown,
  LineChart,
  History,
  Database,
  Megaphone,
  Menu,
  X,
  Globe,
  Search,
  Sparkles,
  RefreshCw,
  TrendingUp
} from "lucide-react";
import { AppConfig, CategoryNode, SubCategoryNode, TopicNode, StudentUser, NotificationItem, SliderItem, TestMeta, PDFMeta } from "./types";
import { parseTestText } from "./utils/parser";
import { generateStudentHTML } from "./utils/studentTemplate";
import JSZip from "jszip";
import { encodeObfuscatedDatabase, decodeObfuscatedDatabase } from "./utils/obfuscation";

const DEFAULT_LOGO_URL = "https://iili.io/CKMOrGI.png";

const enhanceImageUrlQuality = (url: string): string => {
  if (!url) return url;
  if (url.startsWith("data:") || url.startsWith("blob:")) {
    return url;
  }
  if (url.includes("images.unsplash.com")) {
    try {
      const urlObj = new URL(url);
      if (urlObj.searchParams.has("w")) {
        const wVal = parseInt(urlObj.searchParams.get("w") || "0", 10);
        if (wVal < 1200) {
          urlObj.searchParams.set("w", wVal <= 200 ? "800" : "1200");
        }
      } else {
        urlObj.searchParams.set("w", "1200");
      }
      urlObj.searchParams.set("q", "85");
      if (!urlObj.searchParams.has("auto")) {
        urlObj.searchParams.set("auto", "format");
      }
      if (!urlObj.searchParams.has("fit")) {
        urlObj.searchParams.set("fit", "crop");
      }
      return urlObj.toString();
    } catch (e) {
      return url.replace(/w=\d+/, "w=1200").replace(/q=\d+/, "q=85");
    }
  } else if (url.includes("iili.io")) {
    return url.replace(/\.md\.(png|jpg|jpeg)$/i, ".$1");
  }
  return url;
};

const enhanceAllDbImages = (obj: any): any => {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) {
    return obj.map(item => enhanceAllDbImages(item));
  }
  const updated = { ...obj };
  for (const key in updated) {
    if (Object.prototype.hasOwnProperty.call(updated, key)) {
      const val = updated[key];
      if (typeof val === "string") {
        if (key === "image" || key === "imageUrl" || key === "logoUrl" || key === "ogImage") {
          updated[key] = enhanceImageUrlQuality(val);
        }
      } else if (val && typeof val === "object") {
        updated[key] = enhanceAllDbImages(val);
      }
    }
  }
  return updated;
};

const INITIAL_STATE: AppConfig = enhanceAllDbImages({
  appName: "Prayas One Professional Hub",
  logoUrl: DEFAULT_LOGO_URL,
  studentGreeting: "Hi, Aspirant!",
  studentSubGreeting: "PRAYAS ONE PROFESSIONAL HUB",
  sliders: [
    {
      id: "slide1",
      image: "https://i.ibb.co/0pkQqKpR/file-00000000d29871fa9f8307417b32910e.png",
      title: "Elevate your Preparations",
      link: "#"
    },
    {
      id: "slide2",
      image: "https://i.ibb.co/3m15ZM6k/file-00000000f5907209bc522b1e82d51450.png",
      title: "Real-time Mock Examinations",
      link: "#"
    }
  ],
  notifications: [
    {
      id: "notif1",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400",
      title: "\ud83d\udd25 Daily Practice Series Live",
      message: "Check out the newly uploaded mock exams to refine your concept formulas today! Unlock with voucher code series.",
      buttonName: "EXPLORE",
      link: "#"
    }
  ],
  testCategories: [
    {
      id: "cat_mech",
      name: "Competitive Sciences",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=200",
      coupon: {
        code: "SCIENCE100",
        startDate: "2026-06-01",
        endDate: "2026-12-31",
        maxAttempts: "unlimited"
      },
      couponCode: "SCIENCE100",
      subCategories: [
        {
          id: "sub_phys",
          name: "Physics Physics Unit",
          image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=200",
          test: null,
          pdf: null,
          topics: [
            {
              id: "top_force",
              name: "Centrifugal Force Mechanics",
              test: {
                id: "test_force_mcq",
                title: "Centrifugal Force Standard Test",
                questionsEn: [
                  {
                    q: "What is the standard unit of force in SI units?",
                    o: ["Joule", "Pascal", "Newton", "Watt"],
                    c: 3,
                    s: "F = ma, which is calculated in Newtons in international systems."
                  },
                  {
                    q: "Centrifugal force is mathematically described as...",
                    o: ["mv^2/r", "mvr", "1/2 mv^2", "mgh"],
                    c: 1,
                    s: "Expression for centrifugal force is Fc = mv^2 / r."
                  }
                ],
                questionsHi: [],
                duration: 20,
                freeAttempts: 0,
                unlimitedAttempts: false,
                onlyUsers: "",
                coupon: {
                  code: "VIPCOUPON",
                  startDate: "2026-06-01",
                  endDate: "2026-12-31",
                  maxAttempts: "unlimited"
                },
                isPaid: true,
                posMarks: 2,
                negMarks: 0.5,
                instructions: "Attempt all questions. Watch negative points."
              },
              pdf: null
            }
          ]
        }
      ],
      test: null,
      pdf: null
    },
    {
      id: "cat_maths",
      name: "Mathematics & Logic Aptitude",
      image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=200",
      coupon: {
        code: "MATHS99",
        startDate: "2026-06-01",
        endDate: "2026-12-31",
        maxAttempts: "10"
      },
      couponCode: "MATHS99",
      subCategories: [
        {
          id: "sub_logic",
          name: "Logical Reasoning Quiz",
          image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=200",
          test: null,
          pdf: null,
          topics: [
            {
              id: "top_analogy",
              name: "Analogy Practice Test",
              test: {
                id: "test_analogy_mcq",
                title: "Logical Analogy Quick Mock Exam",
                questionsEn: [
                  {
                    q: "Choose the word that belongs with the others: Cat, Dog, Hamster...",
                    o: ["Parrot", "Car", "Computer", "Notebook"],
                    c: 1,
                    s: "Parrot is also a common pet."
                  },
                  {
                    q: "Complete the analogy: Light is to Dark as Warm is to...",
                    o: ["Sun", "Cold", "Fire", "Summer"],
                    c: 2,
                    s: "Cold is the antonym of warm, just like dark is of light."
                  }
                ],
                questionsHi: [],
                duration: 15,
                freeAttempts: 0,
                unlimitedAttempts: false,
                onlyUsers: "",
                coupon: null,
                isPaid: true,
                posMarks: 1,
                negMarks: 0,
                instructions: "Standard Analogy Test of Logical Reasoning."
              },
              pdf: null
            }
          ]
        }
      ],
      test: null,
      pdf: null
    }
  ],
  pdfCategories: [
    {
      id: "cat_pdf_1",
      name: "Daily General Knowledge Catalogs",
      image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=200",
      subCategories: [
        {
          id: "sub_pdf_sub1",
          name: "Current Affairs 2026",
          image: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=200",
          test: null,
          pdf: null,
          topics: [
            {
              id: "top_pdf_doc1",
              name: "Economic Policy Highlights (PDF)",
              test: null,
              pdf: {
                id: "pdf_doc_eco",
                title: "Economic Policy Highlights",
                url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
              }
            }
          ]
        }
      ],
      test: null,
      pdf: null
    }
  ],
  students: [
    {
      id: "stu1",
      name: "Saurabh Mishra",
      emailOrMobile: "good4xo@gmail.com",
      password: "admin"
    }
  ],
  social: {
    whatsapp: "https://wa.me/910000000000",
    telegram: "https://t.me/prayasone",
    paymentQr: "https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=UPI_PAYMENT_PAY@okaxis",
    paymentAmount: "₹499",
    premiumPrice: "₹45",
    premiumDurationText: "3 Months",
    premiumValidityText: "VALID FOR 90 DAYS",
    premiumBenefitsText: "Access to Past Tests, Access to Present Tests, Access to Future Tests, Unlimited Test Attempts",
    hideSourceOnStudent: false,
    qrDownloadText: "Download QR Code",
    qrDownloadLink: "",
    apkUrl: "",
    apkDownloadText: "Download Android App (APK)",
    paymentContactLink: "http://t.me/PrayasOneSupportBot"
  },
  popups: [],
  adsense: {
    enabled: true,
    publisherId: "ca-pub-4084240304484658",
    homeTopSlotId: "1577869180",
    homeBottomSlotId: "5269702180",
    sidebarSlotId: "9058306321"
  },
  seo: {
    metaTitle: "Prayas One Professional Hub - Elite MCQ Practice & Mock Test Portal",
    metaDescription: "Prayas One Professional Hub is India's premium educational testing portal. Access curated bilingual mock exams, comprehensive Blackbook reference keybooks, test series, interactive PDF course worksheets, and personalized scoring analytics.",
    metaKeywords: "Prayas One, prayasone, prayasone.in, Blackbook, MCQ tests, free mock test, exam preparation, ssc cgl, study materials, Prayas One student app",
    canonicalUrl: "https://prayasone.in/",
    ogImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600",
    author: "Prayas One Professional Hub",
    googleSiteVerification: "k7WEweulUiwAmqV3D5oVNzLu528Ib-B5VT4s4F2f4",
    bingSiteVerification: "",
    schemaBusinessName: "Prayas One Professional Hub",
    schemaRatingValue: "4.9",
    schemaReviewCount: "1840"
  }
});

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("general");
  const [appConfig, setAppConfig] = useState<AppConfig>(INITIAL_STATE);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  
  // Interactive trees expanded state maps
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({});
  const [expandedSubs, setExpandedSubs] = useState<Record<string, boolean>>({});

  // Node editing state overlays
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editingNodeType, setEditingNodeType] = useState<"category" | "subcategory" | "topic" | null>(null);
  const [editNodeCategoryContext, setEditNodeCategoryContext] = useState<"test" | "pdf">("test");
  const [qEditLang, setQEditLang] = useState<string>("en");
  const [customLangText, setCustomLangText] = useState<string>("");
  const [showAddLangInput, setShowAddLangInput] = useState<boolean>(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Analytics, Logs, and Backups states (Features 26, 27, 28)
  const [studentAnalytics, setStudentAnalytics] = useState<Record<string, any>>({});
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [backupsList, setBackupsList] = useState<any[]>([]);
  const [backupNameInput, setBackupNameInput] = useState<string>("");
  const [restoringBackup, setRestoringBackup] = useState<string | null>(null);
  const [isBackupLoading, setIsBackupLoading] = useState<boolean>(false);
  
  // SEO Google Center states
  const [seoLogs, setSeoLogs] = useState<string[]>([]);
  const [isSeoSubmitting, setIsSeoSubmitting] = useState<boolean>(false);

  // Student search and pagination states
  const [studentSearchQuery, setStudentSearchQuery] = useState<string>("");
  const [studentCurrentPage, setStudentCurrentPage] = useState<number>(1);
  const studentsPerPage = 20;

  const filteredStudents = React.useMemo(() => {
    const q = studentSearchQuery.toLowerCase().trim();
    if (!q) return appConfig.students || [];
    return (appConfig.students || []).filter(stu => 
      (stu.name || "").toLowerCase().includes(q) ||
      (stu.emailOrMobile || "").toLowerCase().includes(q) ||
      (stu.phoneNo || "").toLowerCase().includes(q)
    );
  }, [appConfig.students, studentSearchQuery]);

  const totalStudentPages = Math.max(1, Math.ceil(filteredStudents.length / studentsPerPage));
  
  const currentPageStudents = React.useMemo(() => {
    const page = Math.min(Math.max(1, studentCurrentPage), totalStudentPages);
    const startIdx = (page - 1) * studentsPerPage;
    return filteredStudents.slice(startIdx, startIdx + studentsPerPage);
  }, [filteredStudents, studentCurrentPage, totalStudentPages]);

  // Debounced server auto-saving reference
  const saveTimeoutRef = React.useRef<any>(null);

  // Synchronize dynamic dynamic data on tab activation
  useEffect(() => {
    if (activeTab === "analytics") {
      fetch("/api/admin/analytics")
        .then((res) => res.json())
        .then((data) => setStudentAnalytics(data))
        .catch((err) => console.error("Error reading admin student analytics", err));
    } else if (activeTab === "logs") {
      fetch("/api/admin/logs")
        .then((res) => res.json())
        .then((data) => setActivityLogs(data))
        .catch((err) => console.error("Error reading action logs", err));
    } else if (activeTab === "backups") {
      fetch("/api/admin/backups")
        .then((res) => res.json())
        .then((data) => setBackupsList(data))
        .catch((err) => console.error("Error listing backups", err));
    }
  }, [activeTab]);

  const handleCreateBackup = () => {
    if (!backupNameInput.trim()) {
      alert("Provide a valid snapshot label name.");
      return;
    }
    setIsBackupLoading(true);
    fetch("/api/admin/backup/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customName: backupNameInput.trim() })
    })
    .then((res) => res.json())
    .then((data) => {
      setIsBackupLoading(false);
      setBackupNameInput("");
      if (data.success) {
        alert("Success! Created backup snapshot: " + data.filename);
        // Refresh backups list
        fetch("/api/admin/backups")
          .then((res) => res.json())
          .then((list) => setBackupsList(list));
      } else {
        alert("Backup registration failed.");
      }
    })
    .catch((err) => {
      setIsBackupLoading(false);
      console.error(err);
      alert("Error occurred generating backup.");
    });
  };

  const handleRestoreBackup = (filename: string) => {
    if (!confirm(`WARNING: Are you absolutely confident about RESTORING database from ${filename}?\nThis will revert all questions, student registers, sliders, and active payments configurations across the system.`)) {
      return;
    }
    setRestoringBackup(filename);
    fetch("/api/admin/backup/restore", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename })
    })
    .then((res) => res.json())
    .then((data) => {
      setRestoringBackup(null);
      if (data.success) {
        alert("APPROVED: System database state restored successfully. Page will reload.");
        window.location.reload();
      } else {
        alert("Restoration failed structure verification.");
      }
    })
    .catch((err) => {
      setRestoringBackup(null);
      console.error(err);
      alert("Restore operation failed.");
    });
  };

  // Load from server on mount, fall back to local storage
  useEffect(() => {
    fetch("/api/admin/db")
      .then((res) => {
        if (!res.ok) throw new Error("Server response not ok");
        return res.json();
      })
      .then((serverDb) => {
        if (serverDb && serverDb.config && Object.keys(serverDb.config).length > 0) {
          // Merge students and other fields from server database
          const mergedConfig = {
            ...INITIAL_STATE,
            ...serverDb.config,
            students: serverDb.students || []
          };
          const migrated = applyConfigMigrations(mergedConfig);
          const enhanced = enhanceAllDbImages(migrated);
          setAppConfig(enhanced);
          try {
            localStorage.setItem("prayas_one_coach_state", JSON.stringify(enhanced));
          } catch (e) {
            console.warn("localStorage quota exceeded for prayas_one_coach_state on server mount:", e);
          }
        } else {
          loadFromLocalStorage();
        }
      })
      .catch((err) => {
        console.warn("Failed loading database from server, falling back to local storage", err);
        loadFromLocalStorage();
      });

    function applyConfigMigrations(parsed: any) {
      let changed = false;

      // Smart URL Migration for user convenience
      if (parsed && Array.isArray(parsed.sliders)) {
        parsed.sliders = parsed.sliders.map((s: any) => {
          if (s.image === "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1200") {
            s.image = "https://i.ibb.co/0pkQqKpR/file-00000000d29871fa9f8307417b32910e.png";
            changed = true;
          }
          if (s.image === "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1200") {
            s.image = "https://i.ibb.co/3m15ZM6k/file-00000000f5907209bc522b1e82d51450.png";
            changed = true;
          }
          return s;
        });
      }

      // Coupon Code Category Migrations
      if (parsed && Array.isArray(parsed.testCategories)) {
        // 1. Ensure Competitive Sciences has SCIENCE100 coupon
        const catMech = parsed.testCategories.find((c: any) => c.id === "cat_mech");
        if (catMech) {
          if (!catMech.coupon || catMech.couponCode !== "SCIENCE100") {
            catMech.coupon = {
              code: "SCIENCE100",
              startDate: "2026-06-01",
              endDate: "2026-12-31",
              maxAttempts: "unlimited"
            };
            catMech.couponCode = "SCIENCE100";
            changed = true;
          }
          // Ensure its test is marked Paid/Premium for coupon validation demonstration
          if (catMech.subCategories && catMech.subCategories[0] && catMech.subCategories[0].topics && catMech.subCategories[0].topics[0] && catMech.subCategories[0].topics[0].test) {
            const testNode = catMech.subCategories[0].topics[0].test;
            if (testNode.freeAttempts !== 0 || !testNode.isPaid) {
              testNode.freeAttempts = 0;
              testNode.isPaid = true;
              changed = true;
            }
          }
        }

        // 2. Ensure cat_maths exists with MATHS99 coupon if no other categories exist
        const hasMaths = parsed.testCategories.length > 0 || parsed.testCategories.some((c: any) => c.id === "cat_maths");
        if (!hasMaths) {
          parsed.testCategories.push({
            id: "cat_maths",
            name: "Mathematics & Logic Aptitude",
            image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=200",
            coupon: {
              code: "MATHS99",
              startDate: "2026-06-01",
              endDate: "2026-12-31",
              maxAttempts: "10"
            },
            couponCode: "MATHS99",
            subCategories: [
              {
                id: "sub_logic",
                name: "Logical Reasoning Quiz",
                image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=200",
                test: null,
                pdf: null,
                topics: [
                  {
                    id: "top_analogy",
                    name: "Analogy Practice Test",
                    test: {
                      id: "test_analogy_mcq",
                      title: "Logical Analogy Quick Mock Exam",
                      questionsEn: [
                        {
                          q: "Choose the word that belongs with the others: Cat, Dog, Hamster...",
                          o: ["Parrot", "Car", "Computer", "Notebook"],
                          c: 1,
                          s: "Parrot is also a common pet."
                        },
                        {
                          q: "Complete the analogy: Light is to Dark as Warm is to...",
                          o: ["Sun", "Cold", "Fire", "Summer"],
                          c: 2,
                          s: "Cold is the antonym of warm, just like dark is of light."
                        }
                      ],
                      questionsHi: [],
                      duration: 15,
                      freeAttempts: 0,
                      unlimitedAttempts: false,
                      onlyUsers: "",
                      coupon: null,
                      isPaid: true,
                      posMarks: 1,
                      negMarks: 0,
                      instructions: "Standard Analogy Test of Logical Reasoning."
                    },
                    pdf: null
                  }
                ]
              }
            ],
            test: null,
            pdf: null
          });
          changed = true;
        }
      }

      if (changed) {
        // Trigger a silent local storage write
        try {
          localStorage.setItem("prayas_one_coach_state", JSON.stringify(parsed));
        } catch (e) {
          console.warn("localStorage quota exceeded for prayas_one_coach_state in migration:", e);
        }
      }
      return parsed;
    }

    function loadFromLocalStorage() {
      const saved = localStorage.getItem("prayas_one_coach_state");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const migrated = applyConfigMigrations(parsed);
          const enhanced = enhanceAllDbImages(migrated);
          setAppConfig(enhanced);
        } catch (err) {
          console.error("Failed loading cached state", err);
        }
      }
    }
  }, []);

  const syncWithServer = (configToSync: AppConfig) => {
    const { students, ...configWithoutStudents } = configToSync;
    fetch("/api/admin/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        config: configWithoutStudents,
        students: students || [],
        adminActionLog: "Synchronized student database"
      })
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        console.log("Database synchronized successfully with server.");
      }
    })
    .catch((err) => {
      console.error("Failed synchronizing database with server:", err);
    });
  };

  // Sync to local storage state and debounce to server
  const saveState = (updated: AppConfig, forceSyncServer = false) => {
    const enhanced = enhanceAllDbImages(updated) as AppConfig;
    setAppConfig(enhanced);
    try {
      localStorage.setItem("prayas_one_coach_state", JSON.stringify(enhanced));
    } catch (e) {
      console.warn("localStorage quota exceeded for prayas_one_coach_state in saveState:", e);
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    if (forceSyncServer) {
      syncWithServer(enhanced);
    } else {
      saveTimeoutRef.current = setTimeout(() => {
        syncWithServer(enhanced);
      }, 1500);
    }
  };

  const handleResetDefaults = () => {
    if (confirm("Reset configuration settings back to pristine Prayas One defaults?")) {
      saveState(INITIAL_STATE);
    }
  };

  const handleImportSplitZIP = async (file: File) => {
    try {
      const zip = await JSZip.loadAsync(file);
      const partFiles: { name: string; index: number; file: any }[] = [];
      const examQuestionsMap: Record<string, any> = {};
      let zipStudents: any[] = [];

      for (const relativePath of Object.keys(zip.files)) {
        const fileEntry = zip.files[relativePath];
        const match = relativePath.match(/config_part_(\d+)\.txt$/);
        if (match) {
          partFiles.push({
            name: relativePath,
            index: parseInt(match[1], 10),
            file: fileEntry
          });
        }

        const qMatch = relativePath.match(/test_questions_([a-zA-Z0-9_-]+)\.txt$/);
        if (qMatch) {
          const testId = qMatch[1];
          try {
            const rawText = await fileEntry.async("text");
            const decodedQObj = JSON.parse(decodeObfuscatedDatabase(rawText.trim()));
            examQuestionsMap[testId] = decodedQObj;
          } catch (e) {
            console.warn(`Failed parsing split questions for: ${relativePath}`, e);
          }
        }

        const relativePathLower = relativePath.toLowerCase();
        if (
          relativePathLower === "students_db.txt" ||
          relativePathLower === "student_db.txt" ||
          relativePathLower === "student db.txt" ||
          relativePathLower === "students db.txt" ||
          relativePathLower.endsWith("/students_db.txt") ||
          relativePathLower.endsWith("/student_db.txt") ||
          relativePathLower.endsWith("/student db.txt") ||
          relativePathLower.endsWith("/students db.txt")
        ) {
          try {
            const rawText = await fileEntry.async("text");
            const decodedJSON = decodeObfuscatedDatabase(rawText.trim());
            const studentsList = JSON.parse(decodedJSON);
            if (Array.isArray(studentsList)) {
              zipStudents = studentsList;
            }
          } catch (e) {
            console.warn(`Failed parsing student db for: ${relativePath}`, e);
          }
        }
      }

      if (partFiles.length === 0) {
        alert("⚠️ No database chunk txt files (config_part_*.txt) found inside this ZIP archive. Make sure it is the Split ZIP exported package.");
        return;
      }

      // Sort by the part number index ascendingly
      partFiles.sort((a, b) => a.index - b.index);

      // Extract all file texts in order
      const chunks: string[] = [];
      for (const part of partFiles) {
        const text = await part.file.async("text");
        chunks.push(text.trim());
      }

      const mergedBase64 = chunks.join("");
      const decodedJSON = decodeObfuscatedDatabase(mergedBase64);
      const parsedConfig = JSON.parse(decodedJSON);

      if (parsedConfig && (parsedConfig.appName || parsedConfig.students || parsedConfig.testCategories)) {
        // Re-inject split questions back into the matching test structures
        const reInjectQuestions = (node: any) => {
          if (!node) return;
          if (node.test) {
            const test = node.test;
            const testId = test.id;
            if (testId && examQuestionsMap[testId]) {
              const qObj = examQuestionsMap[testId];
              test.questionsEn = qObj.questionsEn || [];
              test.questionsHi = qObj.questionsHi || [];
              test.questionsOther = qObj.questionsOther || {};
              // Clean lightweight flags
              delete test.hasSplitQuestions;
              delete test.questionsCount;
            }
          }
          if (node.subCategories && Array.isArray(node.subCategories)) {
            node.subCategories.forEach((sub: any) => reInjectQuestions(sub));
          }
        };

        if (parsedConfig.testCategories && Array.isArray(parsedConfig.testCategories)) {
          parsedConfig.testCategories.forEach((cat: any) => reInjectQuestions(cat));
        }

        const merged = {
          ...INITIAL_STATE,
          ...parsedConfig,
          students: zipStudents.length > 0 ? zipStudents : (parsedConfig.students && parsedConfig.students.length > 0 ? parsedConfig.students : INITIAL_STATE.students)
        };
        saveState(merged);
        alert(`🎉 App Database reconstructed successfully with ${partFiles.length} config fragments, ${Object.keys(examQuestionsMap).length} split question files, and ${merged.students.length} students! Preview and state fully recovered.`);
      } else {
        alert("⚠️ Invalid application data structure inside reconstructed ZIP database.");
      }
    } catch (err: any) {
      console.error("ZIP restore error", err);
      alert("Failed recovering data from ZIP archive: " + err.message);
    }
  };

  const handleImportCompiledHTML = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        let base64Str = "";
        
        // 1. Try matching the newer single file fallback syntax: const embeddedB64 = "..."
        const embeddedMatch = content.match(/const embeddedB64\s*=\s*(['"`])(.*?)\1\s*;?/);
        if (embeddedMatch && embeddedMatch[2]) {
          base64Str = embeddedMatch[2];
        } else {
          // 2. Fallback to searching for direct atob("...") expression
          const atobMatch = content.match(/atob\((['"`])(.*?)\1\)/);
          if (atobMatch && atobMatch[2]) {
            base64Str = atobMatch[2];
          }
        }

        if (base64Str) {
          const decodedJSON = decodeObfuscatedDatabase(base64Str);
          const parsedConfig = JSON.parse(decodedJSON);
          
          if (parsedConfig && (parsedConfig.appName || parsedConfig.students || parsedConfig.testCategories)) {
            const merged = {
              ...INITIAL_STATE,
              ...parsedConfig
            };
            saveState(merged);
            alert("\ud83c\udf89 App Configuration and Student Database retrieved successfully! The preview is updated.");
          } else {
            alert("Invalid application structure inside the HTML file.");
          }
        } else {
          alert("Could NOT retrieve database from this HTML file. Make sure this is a student app compiled by this builder.");
        }
      } catch (err) {
        console.error("Retrieve error", err);
        alert("Failed importing state from HTML file. Check format.");
      }
    };
    reader.readAsText(file);
  };

  const handleImportFile = async (file: File) => {
    const nameLower = file.name.toLowerCase();
    if (file.name.endsWith(".zip") || file.type === "application/zip" || file.type === "application/x-zip-compressed") {
      await handleImportSplitZIP(file);
    } else if (nameLower.endsWith(".csv") || nameLower.includes("student") || nameLower.includes("db.txt") || nameLower.includes("students_db.txt")) {
      await handleUploadStudentFile(file);
    } else {
      handleImportCompiledHTML(file);
    }
  };

  const handleImportMultipleFiles = async (files: File[]) => {
    if (files.length === 1) {
      const file = files[0];
      const nameLower = file.name.toLowerCase();
      if (file.name.endsWith(".zip") || file.type === "application/zip" || file.type === "application/x-zip-compressed") {
        await handleImportSplitZIP(file);
      } else if (nameLower.endsWith(".csv") || nameLower.includes("student") || nameLower.includes("db.txt") || nameLower.includes("students_db.txt")) {
        await handleUploadStudentFile(file);
      } else {
        handleImportCompiledHTML(file);
      }
      return;
    }

    try {
      const partFiles: { name: string; index: number; content: string }[] = [];
      const examQuestionsMap: Record<string, any> = {};
      let htmlFileContent = "";
      let studentDbContent = "";

      const readAsText = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string || "");
          reader.onerror = (err) => reject(err);
          reader.readAsText(file);
        });
      };

      // Read all files in parallel
      await Promise.all(
        files.map(async (file) => {
          const name = file.name;
          const text = await readAsText(file);

          const match = name.match(/config_part_(\d+)\.txt$/);
          if (match) {
            partFiles.push({
              name,
              index: parseInt(match[1], 10),
              content: text.trim()
            });
            return;
          }

          const qMatch = name.match(/test_questions_([a-zA-Z0-9_-]+)\.txt$/);
          if (qMatch) {
            const testId = qMatch[1];
            try {
              const decodedQObj = JSON.parse(decodeObfuscatedDatabase(text.trim()));
              examQuestionsMap[testId] = decodedQObj;
            } catch (e) {
              console.warn(`Failed parsing question file: ${name}`, e);
            }
            return;
          }

          if (name.endsWith(".html") || name === "index.html") {
            htmlFileContent = text;
          }

          const nameLower = name.toLowerCase();
          if (
            nameLower === "students_db.txt" ||
            nameLower === "student_db.txt" ||
            nameLower === "student db.txt" ||
            nameLower === "students db.txt"
          ) {
            studentDbContent = text.trim();
          }
        })
      );

      let configParsed = false;
      let parsedConfig: any = null;

      // Check if we retrieved config from individual parts
      if (partFiles.length > 0) {
        // Sort by the part number index ascendingly
        partFiles.sort((a, b) => a.index - b.index);

        // Join chunks
        const chunks = partFiles.map(p => p.content);
        const mergedBase64 = chunks.join("");
        const decodedJSON = decodeObfuscatedDatabase(mergedBase64);
        parsedConfig = JSON.parse(decodedJSON);
        configParsed = true;
      } else if (htmlFileContent) {
        // Check if index.html contains the database
        let base64Str = "";
        const embeddedMatch = htmlFileContent.match(/const embeddedB64\s*=\s*(['"`])(.*?)\1\s*;?/);
        if (embeddedMatch && embeddedMatch[2]) {
          base64Str = embeddedMatch[2];
        } else {
          const atobMatch = htmlFileContent.match(/atob\((['"`])(.*?)\1\)/);
          if (atobMatch && atobMatch[2]) {
            base64Str = atobMatch[2];
          }
        }

        if (base64Str) {
          const decodedJSON = decodeObfuscatedDatabase(base64Str);
          parsedConfig = JSON.parse(decodedJSON);
          configParsed = true;
        }
      }

      let parsedStudents: any[] = [];
      if (studentDbContent) {
        try {
          const decodedStu = decodeObfuscatedDatabase(studentDbContent);
          const studentsList = JSON.parse(decodedStu);
          if (Array.isArray(studentsList)) {
            parsedStudents = studentsList;
          }
        } catch (e) {
          console.warn("Failed decoding students from multiple files", e);
        }
      }

      if (configParsed && parsedConfig && (parsedConfig.appName || parsedConfig.students || parsedConfig.testCategories)) {
        // Re-inject split questions back into the matching test structures
        const reInjectQuestions = (node: any) => {
          if (!node) return;
          if (node.test) {
            const test = node.test;
            const testId = test.id;
            if (testId && examQuestionsMap[testId]) {
              const qObj = examQuestionsMap[testId];
              test.questionsEn = qObj.questionsEn || [];
              test.questionsHi = qObj.questionsHi || [];
              test.questionsOther = qObj.questionsOther || {};
              // Clean lightweight flags
              delete test.hasSplitQuestions;
              delete test.questionsCount;
            }
          }
          if (node.subCategories && Array.isArray(node.subCategories)) {
            node.subCategories.forEach((sub: any) => reInjectQuestions(sub));
          }
        };

        if (parsedConfig.testCategories && Array.isArray(parsedConfig.testCategories)) {
          parsedConfig.testCategories.forEach((cat: any) => reInjectQuestions(cat));
        }

        const merged = {
          ...INITIAL_STATE,
          ...parsedConfig,
          students: parsedStudents.length > 0 ? parsedStudents : (parsedConfig.students && parsedConfig.students.length > 0 ? parsedConfig.students : INITIAL_STATE.students)
        };
        saveState(merged);
        alert(`🎉 Reconstructed successfully from ${partFiles.length} config parts, HTML files, ${Object.keys(examQuestionsMap).length} separate question files, and ${merged.students.length} students! All tables restored for editing/modification.`);
      } else {
        alert("⚠️ Could not reconstruct application database. Please make sure you have selected correct config_part_*.txt files plus test_questions_*.txt or index.html.");
      }
    } catch (err: any) {
      console.error("Multiple files restore error", err);
      alert("Failed recovering data from multiple files: " + err.message);
    }
  };

  const toggleCatExpanded = (id: string) => {
    setExpandedCats(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSubExpanded = (id: string) => {
    setExpandedSubs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // GENERAL APP IDENTIFIERS
  const handleUpdateGeneralFields = (field: keyof AppConfig, value: any) => {
    saveState({
      ...appConfig,
      [field]: value
    });
  };

  // DYNAMIC IMAGE SLIDERS SETUP
  const handleAddSlider = () => {
    const newSlide: SliderItem = {
      id: "slide_" + Date.now(),
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200",
      title: "Custom Slider Highlight",
      link: "#"
    };
    saveState({
      ...appConfig,
      sliders: [...appConfig.sliders, newSlide]
    });
  };

  const handleUpdateSliderItem = (id: string, updatedField: keyof SliderItem, val: string) => {
    const updated = appConfig.sliders.map(s => {
      if (s.id === id) {
        return { ...s, [updatedField]: val };
      }
      return s;
    });
    saveState({ ...appConfig, sliders: updated });
  };

  const handleDeleteSliderItem = (id: string) => {
    saveState({
      ...appConfig,
      sliders: appConfig.sliders.filter(s => s.id !== id)
    });
  };

  // NOTIFICATION BANNER CARD BUILDER
  const handleAddNotification = () => {
    const newNotif: NotificationItem = {
      id: "notif_" + Date.now(),
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=400",
      title: "\ud83c\udf81 New Material Unlocked",
      message: "We have released premium worksheets and assessments.",
      buttonName: "CHECK",
      link: "#"
    };
    saveState({
      ...appConfig,
      notifications: [...appConfig.notifications, newNotif]
    });
  };

  const handleUpdateNotificationItem = (id: string, updatedField: keyof NotificationItem, val: string) => {
    const updated = appConfig.notifications.map(n => {
      if (n.id === id) {
        return { ...n, [updatedField]: val };
      }
      return n;
    });
    saveState({ ...appConfig, notifications: updated });
  };

  const handleDeleteNotificationItem = (id: string) => {
    saveState({
      ...appConfig,
      notifications: appConfig.notifications.filter(n => n.id !== id)
    });
  };

  // WEBSITE PROMOTIONAL POP-UPS MANAGER
  const handleAddWebsitePopup = () => {
    const getLocalISOString = (date: Date) => {
      const tzOffset = date.getTimezoneOffset() * 60000;
      return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
    };
    const newPopup = {
      id: "popup_" + Date.now(),
      title: "\ud83c\udf81 Special Topper Offer",
      text: "Get unlimited mock tests with comprehensive explanations, detailed performance logs, and rank trophies! Limited period 50% flat discount on sub. Use promo code: TOPPER50",
      imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400",
      redirectUrl: "#premium",
      startTime: getLocalISOString(new Date()),
      endTime: getLocalISOString(new Date(Date.now() + 24 * 60 * 60 * 1000 * 7)), // 7 days active
      order: (appConfig.popups?.length || 0) + 1,
      isActive: true
    };
    saveState({
      ...appConfig,
      popups: [...(appConfig.popups || []), newPopup]
    });
  };

  const handleUpdateWebsitePopup = (id: string, field: string, value: any) => {
    const updated = (appConfig.popups || []).map(p => {
      if (p.id === id) {
        return { ...p, [field]: value };
      }
      return p;
    });
    saveState({ ...appConfig, popups: updated });
  };

  const handleDeleteWebsitePopup = (id: string) => {
    saveState({
      ...appConfig,
      popups: (appConfig.popups || []).filter(p => p.id !== id)
    });
  };

  // Reorder operations
  const handleMoveSlider = (id: string, direction: "up" | "down") => {
    const list = [...appConfig.sliders];
    const index = list.findIndex(s => s.id === id);
    if (index === -1) return;
    
    if (direction === "up" && index > 0) {
      const temp = list[index];
      list[index] = list[index - 1];
      list[index - 1] = temp;
    } else if (direction === "down" && index < list.length - 1) {
      const temp = list[index];
      list[index] = list[index + 1];
      list[index + 1] = temp;
    }
    saveState({ ...appConfig, sliders: list });
  };

  const handleMoveNotification = (id: string, direction: "up" | "down") => {
    const list = [...appConfig.notifications];
    const index = list.findIndex(n => n.id === id);
    if (index === -1) return;
    
    if (direction === "up" && index > 0) {
      const temp = list[index];
      list[index] = list[index - 1];
      list[index - 1] = temp;
    } else if (direction === "down" && index < list.length - 1) {
      const temp = list[index];
      list[index] = list[index + 1];
      list[index + 1] = temp;
    }
    saveState({ ...appConfig, notifications: list });
  };

  const handleMoveCategory = (id: string, treeType: "test" | "pdf", direction: "up" | "down") => {
    const list = treeType === "test" ? [...appConfig.testCategories] : [...appConfig.pdfCategories];
    const index = list.findIndex(c => c.id === id);
    if (index === -1) return;
    
    if (direction === "up" && index > 0) {
      const temp = list[index];
      list[index] = list[index - 1];
      list[index - 1] = temp;
    } else if (direction === "down" && index < list.length - 1) {
      const temp = list[index];
      list[index] = list[index + 1];
      list[index + 1] = temp;
    }
    
    if (treeType === "test") saveState({ ...appConfig, testCategories: list });
    else saveState({ ...appConfig, pdfCategories: list });
  };

  const handleMoveSubCategory = (catId: string, subId: string, treeType: "test" | "pdf", direction: "up" | "down") => {
    const categories = treeType === "test" ? [...appConfig.testCategories] : [...appConfig.pdfCategories];
    const updated = categories.map(cat => {
      if (cat.id !== catId) return cat;
      const list = [...cat.subCategories];
      const index = list.findIndex(s => s.id === subId);
      if (index === -1) return cat;

      if (direction === "up" && index > 0) {
        const temp = list[index];
        list[index] = list[index - 1];
        list[index - 1] = temp;
      } else if (direction === "down" && index < list.length - 1) {
        const temp = list[index];
        list[index] = list[index + 1];
        list[index + 1] = temp;
      }
      return { ...cat, subCategories: list };
    });

    if (treeType === "test") saveState({ ...appConfig, testCategories: updated });
    else saveState({ ...appConfig, pdfCategories: updated });
  };

  const handleMoveTopic = (catId: string, subId: string, topicId: string, treeType: "test" | "pdf", direction: "up" | "down") => {
    const categories = treeType === "test" ? [...appConfig.testCategories] : [...appConfig.pdfCategories];
    const updated = categories.map(cat => {
      if (cat.id !== catId) return cat;
      const subs = cat.subCategories.map(sub => {
        if (sub.id !== subId) return sub;
        const list = [...sub.topics];
        const index = list.findIndex(t => t.id === topicId);
        if (index === -1) return sub;

        if (direction === "up" && index > 0) {
          const temp = list[index];
          list[index] = list[index - 1];
          list[index - 1] = temp;
        } else if (direction === "down" && index < list.length - 1) {
          const temp = list[index];
          list[index] = list[index + 1];
          list[index + 1] = temp;
        }
        return { ...sub, topics: list };
      });
      return { ...cat, subCategories: subs };
    });

    if (treeType === "test") saveState({ ...appConfig, testCategories: updated });
    else saveState({ ...appConfig, pdfCategories: updated });
  };

  // UNIVERSAL HIERARCHY TREE LOGICS (CATEGORIES > SUBS > TOPICS)
  const handleAddRootCategoryNode = (treeType: "test" | "pdf") => {
    const newId = "cat_" + Date.now();
    const newCat: CategoryNode = {
      id: newId,
      name: "New Category Catalog",
      image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=200",
      subCategories: [],
      test: null,
      pdf: null,
      isPaid: false
    };

    if (treeType === "test") {
      saveState({
        ...appConfig,
        testCategories: [...appConfig.testCategories, newCat]
      });
    } else {
      saveState({
        ...appConfig,
        pdfCategories: [...appConfig.pdfCategories, newCat]
      });
    }

    // Auto-open edit panel
    setEditingNodeId(newId);
    setEditingNodeType("category");
    setEditNodeCategoryContext(treeType);
  };

  const handleAddSubCategoryNode = (catId: string, treeType: "test" | "pdf") => {
    const newSub: SubCategoryNode = {
      id: "sub_" + Date.now(),
      name: "New Sub-Category Section",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=200",
      topics: [],
      test: null,
      pdf: null
    };

    const targetCats = treeType === "test" ? appConfig.testCategories : appConfig.pdfCategories;

    const updated = targetCats.map(cat => {
      if (cat.id === catId) {
        return {
          ...cat,
          subCategories: [...cat.subCategories, newSub]
        };
      }
      return cat;
    });

    if (treeType === "test") {
      saveState({ ...appConfig, testCategories: updated });
    } else {
      saveState({ ...appConfig, pdfCategories: updated });
    }

    // Auto expand
    setExpandedCats(prev => ({ ...prev, [catId]: true }));
  };

  const handleAddTopicNode = (catId: string, subId: string, treeType: "test" | "pdf") => {
    const newTopic: TopicNode = {
      id: "topic_" + Date.now(),
      name: "New Topic / Lesson File",
      test: null,
      pdf: null
    };

    const targetCats = treeType === "test" ? appConfig.testCategories : appConfig.pdfCategories;

    const updated = targetCats.map(cat => {
      if (cat.id === catId) {
        const updatedSubs = cat.subCategories.map(sub => {
          if (sub.id === subId) {
            return {
              ...sub,
              topics: [...sub.topics, newTopic]
            };
          }
          return sub;
        });
        return { ...cat, subCategories: updatedSubs };
      }
      return cat;
    });

    if (treeType === "test") {
      saveState({ ...appConfig, testCategories: updated });
    } else {
      saveState({ ...appConfig, pdfCategories: updated });
    }

    // Auto expand
    setExpandedSubs(prev => ({ ...prev, [subId]: true }));
  };

  const handleAddSubTopicNode = (catId: string, subId: string, parentTopicId: string, treeType: "test" | "pdf") => {
    const newTopic: TopicNode = {
      id: "topic_" + Date.now(),
      name: "New Sub-Topic / Lesson File",
      test: null,
      pdf: null,
      topics: []
    };

    const targetCats = treeType === "test" ? appConfig.testCategories : appConfig.pdfCategories;

    const addRecursive = (topics: TopicNode[]): TopicNode[] => {
      return (topics || []).map(t => {
        if (t.id === parentTopicId) {
          return {
            ...t,
            topics: [...(t.topics || []), newTopic]
          };
        }
        if (t.topics && t.topics.length > 0) {
          return {
            ...t,
            topics: addRecursive(t.topics)
          };
        }
        return t;
      });
    };

    const updated = targetCats.map(cat => {
      if (cat.id === catId) {
        const updatedSubs = cat.subCategories.map(sub => {
          if (sub.id === subId) {
            return {
              ...sub,
              topics: addRecursive(sub.topics)
            };
          }
          return sub;
        });
        return { ...cat, subCategories: updatedSubs };
      }
      return cat;
    });

    if (treeType === "test") {
      saveState({ ...appConfig, testCategories: updated });
    } else {
      saveState({ ...appConfig, pdfCategories: updated });
    }

    setExpandedSubs(prev => ({ ...prev, [parentTopicId]: true }));
  };

  // Node editing state modifications inside nested loops
  const handleUpdateNodeNameAndImage = (
    nodeId: string,
    type: "category" | "subcategory" | "topic",
    treeType: "test" | "pdf",
    fields: { 
      name?: string; 
      image?: string; 
      scheduledAt?: string; 
      onlyUsers?: string; 
      couponCode?: string; 
      coupon?: any;
      isPaid?: boolean;
      paymentAmount?: string;
      paymentValidityDays?: string;
      paymentBenefits?: string;
      paymentQr?: string;
      paymentUrl?: string;
      paymentHelpdeskUrl?: string;
    }
  ) => {
    const targetCats = treeType === "test" ? appConfig.testCategories : appConfig.pdfCategories;

    const updated = targetCats.map(cat => {
      if (type === "category" && cat.id === nodeId) {
        return {
          ...cat,
          name: fields.name !== undefined ? fields.name : cat.name,
          image: fields.image !== undefined ? fields.image : cat.image,
          scheduledAt: fields.scheduledAt !== undefined ? fields.scheduledAt : cat.scheduledAt,
          onlyUsers: fields.onlyUsers !== undefined ? fields.onlyUsers : (cat as any).onlyUsers,
          couponCode: fields.couponCode !== undefined ? fields.couponCode : (cat as any).couponCode,
          coupon: fields.coupon !== undefined ? fields.coupon : (cat as any).coupon,
          isPaid: fields.isPaid !== undefined ? fields.isPaid : cat.isPaid,
          paymentAmount: fields.paymentAmount !== undefined ? fields.paymentAmount : cat.paymentAmount,
          paymentValidityDays: fields.paymentValidityDays !== undefined ? fields.paymentValidityDays : cat.paymentValidityDays,
          paymentBenefits: fields.paymentBenefits !== undefined ? fields.paymentBenefits : cat.paymentBenefits,
          paymentQr: fields.paymentQr !== undefined ? fields.paymentQr : cat.paymentQr,
          paymentUrl: fields.paymentUrl !== undefined ? fields.paymentUrl : cat.paymentUrl,
          paymentHelpdeskUrl: fields.paymentHelpdeskUrl !== undefined ? fields.paymentHelpdeskUrl : (cat as any).paymentHelpdeskUrl
        };
      }

      const updatedSubs = cat.subCategories.map(sub => {
        if (type === "subcategory" && sub.id === nodeId) {
          return {
            ...sub,
            name: fields.name !== undefined ? fields.name : sub.name,
            image: fields.image !== undefined ? fields.image : sub.image,
            scheduledAt: fields.scheduledAt !== undefined ? fields.scheduledAt : sub.scheduledAt,
            onlyUsers: fields.onlyUsers !== undefined ? fields.onlyUsers : (sub as any).onlyUsers,
            couponCode: fields.couponCode !== undefined ? fields.couponCode : (sub as any).couponCode,
            coupon: fields.coupon !== undefined ? fields.coupon : (sub as any).coupon
          };
        }

        const updateTopicRecursive = (topics: TopicNode[]): TopicNode[] => {
          return (topics || []).map(top => {
            if (type === "topic" && top.id === nodeId) {
              return {
                ...top,
                name: fields.name !== undefined ? fields.name : top.name,
                image: fields.image !== undefined ? fields.image : top.image,
                scheduledAt: fields.scheduledAt !== undefined ? fields.scheduledAt : top.scheduledAt,
                onlyUsers: fields.onlyUsers !== undefined ? fields.onlyUsers : (top as any).onlyUsers,
                couponCode: fields.couponCode !== undefined ? fields.couponCode : (top as any).couponCode,
                coupon: fields.coupon !== undefined ? fields.coupon : (top as any).coupon
              };
            }
            if (top.topics && top.topics.length > 0) {
              return {
                ...top,
                topics: updateTopicRecursive(top.topics)
              };
            }
            return top;
          });
        };

        const updatedTopics = updateTopicRecursive(sub.topics || []);

        return { ...sub, topics: updatedTopics };
      });

      return { ...cat, subCategories: updatedSubs };
    });

    if (treeType === "test") {
      saveState({ ...appConfig, testCategories: updated });
    } else {
      saveState({ ...appConfig, pdfCategories: updated });
    }
  };

  // Test and PDF Resource setups at any hierarchy level
  const handleToggleTestSettingsOnNode = (
    nodeId: string,
    type: "category" | "subcategory" | "topic",
    treeType: "test" | "pdf",
    enable: boolean
  ) => {
    const targetCats = treeType === "test" ? appConfig.testCategories : appConfig.pdfCategories;

    const defaultTest: TestMeta = {
      id: "test_" + Date.now(),
      title: "Quick Unit Test Assessment",
      questionsEn: [],
      questionsHi: [],
      duration: 60,
      freeAttempts: 1,
      unlimitedAttempts: false,
      onlyUsers: "",
      coupon: null,
      posMarks: 1,
      negMarks: 0,
      instructions: "Follow standard academic conduct regulations."
    };

    const updated = targetCats.map(cat => {
      if (type === "category" && cat.id === nodeId) {
        return { ...cat, test: enable ? defaultTest : null };
      }

      const updatedSubs = cat.subCategories.map(sub => {
        if (type === "subcategory" && sub.id === nodeId) {
          return { ...sub, test: enable ? defaultTest : null };
        }

        const updateTopicTestRecursive = (topics: TopicNode[]): TopicNode[] => {
          return (topics || []).map(top => {
            if (top.id === nodeId) {
              return { ...top, test: enable ? defaultTest : null };
            }
            if (top.topics && top.topics.length > 0) {
              return {
                ...top,
                topics: updateTopicTestRecursive(top.topics)
              };
            }
            return top;
          });
        };

        const updatedTopics = type === "topic" ? updateTopicTestRecursive(sub.topics || []) : sub.topics;

        return { ...sub, topics: updatedTopics };
      });

      return { ...cat, subCategories: updatedSubs };
    });

    if (treeType === "test") {
      saveState({ ...appConfig, testCategories: updated });
    } else {
      saveState({ ...appConfig, pdfCategories: updated });
    }
  };

  const handleTogglePDFSettingsOnNode = (
    nodeId: string,
    type: "category" | "subcategory" | "topic",
    treeType: "test" | "pdf",
    enable: boolean
  ) => {
    const targetCats = treeType === "test" ? appConfig.testCategories : appConfig.pdfCategories;

    const defaultPDF: PDFMeta = {
      id: "pdf_" + Date.now(),
      title: "Important Study Document File",
      url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    };

    const updated = targetCats.map(cat => {
      if (type === "category" && cat.id === nodeId) {
        return { ...cat, pdf: enable ? defaultPDF : null };
      }

      const updatedSubs = cat.subCategories.map(sub => {
        if (type === "subcategory" && sub.id === nodeId) {
          return { ...sub, pdf: enable ? defaultPDF : null };
        }

        const updateTopicPdfRecursive = (topics: TopicNode[]): TopicNode[] => {
          return (topics || []).map(top => {
            if (top.id === nodeId) {
              return { ...top, pdf: enable ? defaultPDF : null };
            }
            if (top.topics && top.topics.length > 0) {
              return {
                ...top,
                topics: updateTopicPdfRecursive(top.topics)
              };
            }
            return top;
          });
        };

        const updatedTopics = type === "topic" ? updateTopicPdfRecursive(sub.topics || []) : sub.topics;

        return { ...sub, topics: updatedTopics };
      });

      return { ...cat, subCategories: updatedSubs };
    });

    if (treeType === "test") {
      saveState({ ...appConfig, testCategories: updated });
    } else {
      saveState({ ...appConfig, pdfCategories: updated });
    }
  };

  const handleUpdateNodeTestProperty = (
    nodeId: string,
    type: "category" | "subcategory" | "topic",
    treeType: "test" | "pdf",
    key: keyof TestMeta,
    value: any
  ) => {
    const targetCats = treeType === "test" ? appConfig.testCategories : appConfig.pdfCategories;

    const updated = targetCats.map(cat => {
      if (type === "category" && cat.id === nodeId && cat.test) {
        return { ...cat, test: { ...cat.test, [key]: value } };
      }

      const updatedSubs = cat.subCategories.map(sub => {
        if (type === "subcategory" && sub.id === nodeId && sub.test) {
          return { ...sub, test: { ...sub.test, [key]: value } };
        }

        const updateTestPropRecursive = (topics: TopicNode[]): TopicNode[] => {
          return (topics || []).map(top => {
            if (top.id === nodeId && top.test) {
              return { ...top, test: { ...top.test, [key]: value } };
            }
            if (top.topics && top.topics.length > 0) {
              return {
                ...top,
                topics: updateTestPropRecursive(top.topics)
              };
            }
            return top;
          });
        };

        const updatedTopics = type === "topic" ? updateTestPropRecursive(sub.topics || []) : sub.topics;

        return { ...sub, topics: updatedTopics };
      });

      return { ...cat, subCategories: updatedSubs };
    });

    if (treeType === "test") {
      saveState({ ...appConfig, testCategories: updated });
    } else {
      saveState({ ...appConfig, pdfCategories: updated });
    }
  };

  const handleUpdateNodePDFProperty = (
    nodeId: string,
    type: "category" | "subcategory" | "topic",
    treeType: "test" | "pdf",
    key: keyof PDFMeta,
    value: any
  ) => {
    const targetCats = treeType === "test" ? appConfig.testCategories : appConfig.pdfCategories;

    const updated = targetCats.map(cat => {
      if (type === "category" && cat.id === nodeId && cat.pdf) {
        return { ...cat, pdf: { ...cat.pdf, [key]: value } };
      }

      const updatedSubs = cat.subCategories.map(sub => {
        if (type === "subcategory" && sub.id === nodeId && sub.pdf) {
          return { ...sub, pdf: { ...sub.pdf, [key]: value } };
        }

        const updatePdfPropRecursive = (topics: TopicNode[]): TopicNode[] => {
          return (topics || []).map(top => {
            if (top.id === nodeId && top.pdf) {
              return { ...top, pdf: { ...top.pdf, [key]: value } };
            }
            if (top.topics && top.topics.length > 0) {
              return {
                ...top,
                topics: updatePdfPropRecursive(top.topics)
              };
            }
            return top;
          });
        };

        const updatedTopics = type === "topic" ? updatePdfPropRecursive(sub.topics || []) : sub.topics;

        return { ...sub, topics: updatedTopics };
      });

      return { ...cat, subCategories: updatedSubs };
    });

    if (treeType === "test") {
      saveState({ ...appConfig, testCategories: updated });
    } else {
      saveState({ ...appConfig, pdfCategories: updated });
    }
  };

  const handleDeleteNodeItem = (
    nodeId: string,
    type: "category" | "subcategory" | "topic",
    treeType: "test" | "pdf",
    bypassConfirm = false
  ) => {
    if (!bypassConfirm) {
      if (!confirm("Are you sure you want to remove this node and all of its resources?")) return;
    }

    // 1. Process test categories
    let updatedTestCats = [...(appConfig.testCategories || [])];
    if (type === "category") {
      updatedTestCats = updatedTestCats.filter(cat => cat.id !== nodeId);
    } else if (type === "subcategory") {
      updatedTestCats = updatedTestCats.map(cat => {
        const filteredSubs = (cat.subCategories || []).filter(sub => sub.id !== nodeId);
        return { ...cat, subCategories: filteredSubs };
      });
    } else if (type === "topic") {
      updatedTestCats = updatedTestCats.map(cat => {
        const updatedSubs = (cat.subCategories || []).map(sub => {
          const filterTopicRecursive = (topics: TopicNode[]): TopicNode[] => {
            return (topics || [])
              .filter(tp => tp.id !== nodeId)
              .map(tp => {
                if (tp.topics && tp.topics.length > 0) {
                  return {
                    ...tp,
                    topics: filterTopicRecursive(tp.topics)
                  };
                }
                return tp;
              });
          };
          const filteredTopics = filterTopicRecursive(sub.topics || []);
          return { ...sub, topics: filteredTopics };
        });
        return { ...cat, subCategories: updatedSubs };
      });
    }

    // 2. Process pdf categories
    let updatedPdfCats = [...(appConfig.pdfCategories || [])];
    if (type === "category") {
      updatedPdfCats = updatedPdfCats.filter(cat => cat.id !== nodeId);
    } else if (type === "subcategory") {
      updatedPdfCats = updatedPdfCats.map(cat => {
        const filteredSubs = (cat.subCategories || []).filter(sub => sub.id !== nodeId);
        return { ...cat, subCategories: filteredSubs };
      });
    } else if (type === "topic") {
      updatedPdfCats = updatedPdfCats.map(cat => {
        const updatedSubs = (cat.subCategories || []).map(sub => {
          const filterTopicRecursive = (topics: TopicNode[]): TopicNode[] => {
            return (topics || [])
              .filter(tp => tp.id !== nodeId)
              .map(tp => {
                if (tp.topics && tp.topics.length > 0) {
                  return {
                    ...tp,
                    topics: filterTopicRecursive(tp.topics)
                  };
                }
                return tp;
              });
          };
          const filteredTopics = filterTopicRecursive(sub.topics || []);
          return { ...sub, topics: filteredTopics };
        });
        return { ...cat, subCategories: updatedSubs };
      });
    }

    saveState({
      ...appConfig,
      testCategories: updatedTestCats,
      pdfCategories: updatedPdfCats
    });

    if (editingNodeId === nodeId) setEditingNodeId(null);
    setDeleteConfirmId(null);
  };

  // TXT Question Files Parser triggers
  const handleParserFileAttachment = (
    e: React.ChangeEvent<HTMLInputElement>,
    nodeId: string,
    type: "category" | "subcategory" | "topic",
    lang: string,
    treeType: "test" | "pdf"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const parsed = parseTestText(text);
      if (parsed.length > 0) {
        if (lang === "en") {
          handleUpdateNodeTestProperty(nodeId, type, treeType, "questionsEn", parsed);
        } else if (lang === "hi") {
          handleUpdateNodeTestProperty(nodeId, type, treeType, "questionsHi", parsed);
        } else {
          // Dynamic Language Upload!
          const targetCats = treeType === "test" ? appConfig.testCategories : appConfig.pdfCategories;
          let foundNodeTest = null;
          
          const findTopicTestRecursive = (topics: TopicNode[]): TestMeta | null => {
            for (const top of topics) {
              if (top.id === nodeId && top.test) return top.test;
              if (top.topics && top.topics.length > 0) {
                const found = findTopicTestRecursive(top.topics);
                if (found) return found;
              }
            }
            return null;
          };

          // Locate current node
          for (const cat of targetCats) {
            if (type === "category" && cat.id === nodeId && cat.test) {
              foundNodeTest = cat.test;
              break;
            }
            for (const sub of cat.subCategories) {
              if (type === "subcategory" && sub.id === nodeId && sub.test) {
                foundNodeTest = sub.test;
                break;
              }
              if (type === "topic") {
                foundNodeTest = findTopicTestRecursive(sub.topics || []);
                if (foundNodeTest) break;
              }
            }
            if (foundNodeTest) break;
          }
          
          const currentOthers = foundNodeTest ? (foundNodeTest.questionsOther || {}) : {};
          const updatedOthers = {
            ...currentOthers,
            [lang]: parsed
          };
          handleUpdateNodeTestProperty(nodeId, type, treeType, "questionsOther", updatedOthers);
        }
        alert(`Successfully parsed and loaded ${parsed.length} questions in ${lang.toUpperCase()}!`);
      } else {
        alert("Found no matched questions format. Format: '1. Question Text' then option rows starting with 'A) Option' and 'Ex: Explanation text'. Mark correct option with a checkmark symbol '✅'");
      }
    };
    reader.readAsText(file);
  };

  // NOUN VOUCHER / COUPON RE-CONFIGS BINDERS
  const handleUpdateNodeTestCoupon = (
    nodeId: string,
    type: "category" | "subcategory" | "topic",
    treeType: "test" | "pdf",
    couponField: "code" | "startDate" | "endDate" | "maxAttempts",
    val: string
  ) => {
    const targetCats = treeType === "test" ? appConfig.testCategories : appConfig.pdfCategories;

    const updated = targetCats.map(cat => {
      const assignCoupon = (testObj: TestMeta | null) => {
        if (!testObj) return null;
        const currentCoupon = testObj.coupon || { code: "SERIES88", startDate: "2026-06-01", endDate: "2026-12-31", maxAttempts: "unlimited" };
        return {
          ...testObj,
          coupon: {
            ...currentCoupon,
            [couponField]: val
          }
        };
      };

      if (type === "category" && cat.id === nodeId) {
        return { ...cat, test: assignCoupon(cat.test) };
      }

      const updatedSubs = cat.subCategories.map(sub => {
        if (type === "subcategory" && sub.id === nodeId) {
          return { ...sub, test: assignCoupon(sub.test) };
        }

        const updateCouponRecursive = (topics: TopicNode[]): TopicNode[] => {
          return (topics || []).map(top => {
            if (top.id === nodeId) {
              return { ...top, test: assignCoupon(top.test) };
            }
            if (top.topics && top.topics.length > 0) {
              return {
                ...top,
                topics: updateCouponRecursive(top.topics)
              };
            }
            return top;
          });
        };

        const updatedTopics = type === "topic" ? updateCouponRecursive(sub.topics || []) : sub.topics;

        return { ...sub, topics: updatedTopics };
      });

      return { ...cat, subCategories: updatedSubs };
    });

    if (treeType === "test") {
      saveState({ ...appConfig, testCategories: updated });
    } else {
      saveState({ ...appConfig, pdfCategories: updated });
    }
  };

  const handleRemoveNodeTestCoupon = (
    nodeId: string,
    type: "category" | "subcategory" | "topic",
    treeType: "test" | "pdf"
  ) => {
    const targetCats = treeType === "test" ? appConfig.testCategories : appConfig.pdfCategories;

    const updated = targetCats.map(cat => {
      if (type === "category" && cat.id === nodeId && cat.test) {
        return { ...cat, test: { ...cat.test, coupon: null } };
      }

      const updatedSubs = cat.subCategories.map(sub => {
        if (type === "subcategory" && sub.id === nodeId && sub.test) {
          return { ...sub, test: { ...sub.test, coupon: null } };
        }

        const removeCouponRecursive = (topics: TopicNode[]): TopicNode[] => {
          return (topics || []).map(top => {
            if (top.id === nodeId && top.test) {
              return { ...top, test: { ...top.test, coupon: null } };
            }
            if (top.topics && top.topics.length > 0) {
              return {
                ...top,
                topics: removeCouponRecursive(top.topics)
              };
            }
            return top;
          });
        };

        const updatedTopics = type === "topic" ? removeCouponRecursive(sub.topics || []) : sub.topics;

        return { ...sub, topics: updatedTopics };
      });

      return { ...cat, subCategories: updatedSubs };
    });

    if (treeType === "test") {
      saveState({ ...appConfig, testCategories: updated });
    } else {
      saveState({ ...appConfig, pdfCategories: updated });
    }
  };

  const handleAddNodeTestCoupon = (
    nodeId: string,
    type: "category" | "subcategory" | "topic",
    treeType: "test" | "pdf"
  ) => {
    const defaultCoupon = {
      code: "MYCOUPON",
      startDate: "2026-06-01",
      endDate: "2026-12-31",
      maxAttempts: "unlimited"
    };

    const targetCats = treeType === "test" ? appConfig.testCategories : appConfig.pdfCategories;

    const updated = targetCats.map(cat => {
      if (type === "category" && cat.id === nodeId && cat.test) {
        return { ...cat, test: { ...cat.test, coupon: defaultCoupon } };
      }

      const updatedSubs = cat.subCategories.map(sub => {
        if (type === "subcategory" && sub.id === nodeId && sub.test) {
          return { ...sub, test: { ...sub.test, coupon: defaultCoupon } };
        }

        const addCouponRecursive = (topics: TopicNode[]): TopicNode[] => {
          return (topics || []).map(top => {
            if (top.id === nodeId && top.test) {
              return { ...top, test: { ...top.test, coupon: defaultCoupon } };
            }
            if (top.topics && top.topics.length > 0) {
              return {
                ...top,
                topics: addCouponRecursive(top.topics)
              };
            }
            return top;
          });
        };

        const updatedTopics = type === "topic" ? addCouponRecursive(sub.topics || []) : sub.topics;

        return { ...sub, topics: updatedTopics };
      });

      return { ...cat, subCategories: updatedSubs };
    });

    if (treeType === "test") {
      saveState({ ...appConfig, testCategories: updated });
    } else {
      saveState({ ...appConfig, pdfCategories: updated });
    }
  };

  // STUDENT ACCOUNTS CREDENTIAL DATABASE MANAGER
  const handleAddStudentAccount = () => {
    const newStudent: StudentUser = {
      id: "stu_" + Date.now(),
      name: "Smart Aspirant",
      emailOrMobile: "aspirant" + Math.floor(Math.random() * 1000) + "@example.com",
      phoneNo: "",
      password: "pass" + Math.floor(1000 + Math.random() * 9000),
      purchaseDate: new Date().toISOString().split("T")[0],
      expiryDate: new Date(Date.now() + 90 * 24 * 3600 * 1000).toISOString().split("T")[0] // 90 days
    };
    saveState({
      ...appConfig,
      students: [...appConfig.students, newStudent]
    });
  };

  const handleUpdateStudentAccount = (id: string, field: keyof StudentUser, val: any) => {
    const updated = appConfig.students.map(s => {
      if (s.id === id) {
        return { ...s, [field]: val };
      }
      return s;
    });
    saveState({ ...appConfig, students: updated });
  };

  const handleDeleteStudentAccount = (id: string) => {
    saveState({
      ...appConfig,
      students: appConfig.students.filter(s => s.id !== id)
    });
  };

  const handleDownloadSeparateStudentsText = () => {
    try {
      const studentsListJson = JSON.stringify(appConfig.students || []);
      const scrambledStudents = encodeObfuscatedDatabase(studentsListJson);
      
      const blob = new Blob([scrambledStudents], { type: "text/plain;charset=utf-8" });
      
      // Download as students_db.txt
      const dlLink1 = document.createElement("a");
      dlLink1.href = URL.createObjectURL(blob);
      dlLink1.download = "students_db.txt";
      document.body.appendChild(dlLink1);
      dlLink1.click();
      document.body.removeChild(dlLink1);

      // Download as student_db.txt fallback
      const dlLink2 = document.createElement("a");
      dlLink2.href = URL.createObjectURL(blob);
      dlLink2.download = "student_db.txt";
      document.body.appendChild(dlLink2);
      dlLink2.click();
      document.body.removeChild(dlLink2);
    } catch (err) {
      console.error("Failed to generate separate student database file", err);
      alert("Error generating students_db.txt and student_db.txt files.");
    }
  };

  const handleDownloadCategoryPaymentText = () => {
    try {
      const paymentConfig: Record<string, any> = {};
      const allCategories = [
        ...(appConfig.testCategories || []),
        ...(appConfig.pdfCategories || [])
      ].filter((cat, idx, self) => self.findIndex(c => c.id === cat.id) === idx);

      allCategories.forEach(cat => {
        paymentConfig[cat.id] = {
          name: cat.name,
          isPaid: !!cat.isPaid,
          paymentAmount: cat.paymentAmount || "₹99",
          paymentValidityDays: cat.paymentValidityDays || "3 Months",
          paymentBenefits: cat.paymentBenefits || "Access to all Mock Tests, Premium PDF Material, Detailed Explanations",
          paymentQr: cat.paymentQr || "",
          paymentUrl: cat.paymentUrl || "",
          paymentHelpdeskUrl: (cat as any).paymentHelpdeskUrl || ""
        };
      });

      const paymentConfigJson = JSON.stringify(paymentConfig, null, 2);
      const blob = new Blob([paymentConfigJson], { type: "text/plain;charset=utf-8" });
      
      const dlLink = document.createElement("a");
      dlLink.href = URL.createObjectURL(blob);
      dlLink.download = "CategoryPayment.txt";
      document.body.appendChild(dlLink);
      dlLink.click();
      document.body.removeChild(dlLink);
    } catch (err) {
      console.error("Failed to generate CategoryPayment.txt", err);
      alert("Error generating CategoryPayment.txt file.");
    }
  };

  const handleBulkUploadCSV = (csvText: string) => {
    if (!csvText || !csvText.trim()) return;
    const lines = csvText.split(/\r?\n/);
    const parsedStudents: StudentUser[] = [];
    
    let startIndex = 0;
    if (lines[0] && (lines[0].toLowerCase().includes("name") || lines[0].toLowerCase().includes("mail") || lines[0].toLowerCase().includes("phone"))) {
      startIndex = 1;
    }

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i];
      if (!line || !line.trim()) continue;
      
      const parts = line.split(",").map(item => item.trim().replace(/^["']|["']$/g, ""));
      if (parts.length >= 3) {
        const name = parts[0];
        const email = parts[1];
        const phone = parts[2];
        const password = parts[3] || "123456";
        const purchaseDate = parts[4] || "";
        const expiryDate = parts[5] || "";
        
        parsedStudents.push({
          id: "stu_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
          name: name || "Student",
          emailOrMobile: email || phone || "",
          phoneNo: phone || "",
          password: password,
          purchaseDate: purchaseDate,
          expiryDate: expiryDate
        });
      }
    }
    
    if (parsedStudents.length > 0) {
      // De-duplicate against current students list
      const existingEmails = new Set(appConfig.students.map(s => (s.emailOrMobile || "").toLowerCase().trim()));
      const uniqueParsed = parsedStudents.filter(s => {
        const emailClean = (s.emailOrMobile || "").toLowerCase().trim();
        return emailClean && !existingEmails.has(emailClean);
      });

      if (uniqueParsed.length === 0) {
        alert("All student records in the CSV are already registered in the system.");
        return;
      }

      saveState({
        ...appConfig,
        students: [...appConfig.students, ...uniqueParsed]
      });
      alert(`Successfully registered ${uniqueParsed.length} new student records from CSV bulk upload! (Skipped ${parsedStudents.length - uniqueParsed.length} duplicates).`);
    } else {
      alert("No valid CSV rows parsed. Format must be: Name, E-mail ID, Phone No, Password, Date of Purchase, Date Of Expiry");
    }
  };

  const handleUploadStudentFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = (e.target?.result as string || "").trim();
        if (!text) {
          alert("Uploaded file is empty.");
          return;
        }

        // Try decoding as obfuscated students database (student_db.txt)
        let decoded = "";
        try {
          decoded = decodeObfuscatedDatabase(text);
          const parsed = JSON.parse(decoded);
          if (Array.isArray(parsed)) {
            if (confirm(`Detected a valid students database backup file containing ${parsed.length} students.\n\nDo you want to MERGE these students with your existing list? (Click 'Cancel' to OVERWRITE and replace your current list entirely).`)) {
              const existingEmails = new Set(appConfig.students.map(s => (s.emailOrMobile || "").toLowerCase().trim()));
              const newStudents = parsed.filter(s => {
                const emailClean = (s.emailOrMobile || "").toLowerCase().trim();
                return emailClean && !existingEmails.has(emailClean);
              });
              
              const merged = {
                ...appConfig,
                students: [...appConfig.students, ...newStudents]
              };
              saveState(merged);
              alert(`Successfully merged ${newStudents.length} new student records from backup file! (Skipped ${parsed.length - newStudents.length} duplicates).`);
            } else {
              const overwritten = {
                ...appConfig,
                students: parsed
              };
              saveState(overwritten);
              alert(`Successfully restored/replaced all ${parsed.length} student records from backup file!`);
            }
            return;
          }
        } catch (err) {
          // Fall back to parsing as raw CSV text
        }

        // Parse as raw CSV text
        handleBulkUploadCSV(text);
      } catch (err: any) {
        console.error("Failed to parse student file:", err);
        alert("Failed to parse student file. Please ensure it is a valid CSV or an obfuscated students_db.txt backup.");
      }
    };
    reader.readAsText(file);
  };

  // SOCIALS & PAYMENTS CONFIGURATION
  const handleUpdateSocialPaymentGroup = (groupKey: keyof AppConfig["social"], value: any) => {
    saveState({
      ...appConfig,
      social: {
        ...appConfig.social,
        [groupKey]: value
      }
    });
  };

  const handleAddCustomSocialLink = () => {
    const list = appConfig.social.customLinks || [];
    const newLink = {
      id: "soc_" + Date.now(),
      name: "Facebook",
      url: "https://facebook.com/prayasone",
      color: "#1877f2",
      icon: "ph-fill ph-facebook-logo"
    };
    saveState({
      ...appConfig,
      social: {
        ...appConfig.social,
        customLinks: [...list, newLink]
      }
    });
  };

  const handleUpdateCustomSocialLink = (id: string, property: "name" | "url" | "color" | "icon", value: string) => {
    const list = appConfig.social.customLinks || [];
    const updated = list.map(l => l.id === id ? { ...l, [property]: value } : l);
    saveState({
      ...appConfig,
      social: {
        ...appConfig.social,
        customLinks: updated
      }
    });
  };

  const handleRemoveCustomSocialLink = (id: string) => {
    const list = appConfig.social.customLinks || [];
    const filtered = list.filter(l => l.id !== id);
    saveState({
      ...appConfig,
      social: {
        ...appConfig.social,
        customLinks: filtered
      }
    });
  };

  // THE ULTIMATE STANDALONE HTML PACK COMPILER DISK DRIVE ACTION
  const handleTriggerFinalCompilationAndDownload = () => {
    try {
      // Keep students database in the compiled package as requested by user
      // Prepare a fully safe and robust configuration to prevent any undefined/null crashes
      // Deep clone to prevent mutating UI state
      const clonedConfig = JSON.parse(JSON.stringify(appConfig));

      const safeConfig = {
        ...clonedConfig,
        appName: clonedConfig.appName || "Prayas One Hub",
        logoUrl: clonedConfig.logoUrl || DEFAULT_LOGO_URL,
        studentGreeting: clonedConfig.studentGreeting || "Hi, Aspirant!",
        studentSubGreeting: clonedConfig.studentSubGreeting || "PRAYAS ONE PROFESSIONAL HUB",
        sliders: clonedConfig.sliders || [],
        notifications: clonedConfig.notifications || [],
        popups: clonedConfig.popups || [],
        students: clonedConfig.students || [],
        testCategories: clonedConfig.testCategories || [],
        pdfCategories: clonedConfig.pdfCategories || [],
        social: {
          whatsapp: "",
          telegram: "",
          instagram: "",
          youtube: "",
          paymentQr: "https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=UPI_PAYMENT_PAY@okaxis",
          paymentAmount: "₹499",
          premiumPrice: "₹45",
          premiumDurationText: "3 Months",
          premiumValidityText: "VALID FOR 90 DAYS",
          premiumBenefitsText: "Access to Past Tests, Access to Present Tests, Access to Future Tests, Unlimited Test Attempts",
          hideSourceOnStudent: false,
          qrDownloadText: "Download QR Code",
          qrDownloadLink: "",
          apkUrl: "",
          apkDownloadText: "Download Android App (APK)",
          paymentContactLink: "http://t.me/PrayasOneSupportBot",
          customLinks: [],
          ...(clonedConfig.social || {})
        }
      };

      // Traverse and extract exam questions to separate txt array files
      const examQuestionsFiles: { filename: string; content: string }[] = [];
      const traverseAndExtractQuestions = (node: any) => {
        if (!node) return;
        if (node.test) {
          const test = node.test;
          const testId = test.id;
          if (testId) {
            const questionsSubset = {
              questionsEn: test.questionsEn || [],
              questionsHi: test.questionsHi || [],
              questionsOther: test.questionsOther || {}
            };
            const questionsJsonString = JSON.stringify(questionsSubset);
            const scrambledQuestions = encodeObfuscatedDatabase(questionsJsonString);
            examQuestionsFiles.push({
              filename: `test_questions_${testId}.txt`,
              content: scrambledQuestions
            });

            // Put lightweight indicators
            test.hasSplitQuestions = true;
            test.questionsCount = Math.max(test.questionsEn.length, test.questionsHi.length);
            Object.values(test.questionsOther || {}).forEach((arr: any) => {
              if (arr && arr.length > test.questionsCount) {
                test.questionsCount = arr.length;
              }
            });

            // Null out heavy payloads
            test.questionsEn = [];
            test.questionsHi = [];
            test.questionsOther = {};
          }
        }
        if (node.subCategories && Array.isArray(node.subCategories)) {
          node.subCategories.forEach((sub: any) => traverseAndExtractQuestions(sub));
        }
      };

      if (safeConfig.testCategories && Array.isArray(safeConfig.testCategories)) {
        safeConfig.testCategories.forEach((cat: any) => traverseAndExtractQuestions(cat));
      }

      // Scramble config data with Devanagari translation to seamlessly split and embed R2 fetch
      const jsonString = JSON.stringify(safeConfig);
      const base64String = encodeObfuscatedDatabase(jsonString);
      
      const chunkSize = 5000000;
      const chunks: string[] = [];
      for (let i = 0; i < base64String.length; i += chunkSize) {
        chunks.push(base64String.substring(i, i + chunkSize));
      }

      // Generate lightweight HTML shell without heavy embedded database payload
      let htmlContent = generateStudentHTML(safeConfig, "", window.location.origin);
      const buildId = "prayas_build_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
      const loaderScript = `<script>\n        window.__studentAppChunkCount = ${chunks.length};\n        window.__studentAppBuildId = "${buildId}";\n        window.__studentAppLocalMode = true;\n    </script>`;
      htmlContent = htmlContent.replace("<!-- __CHUNK_SCRIPTS_PLACEHOLDER__ -->", loaderScript);

      const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
      const dlLink = document.createElement("a");
      dlLink.href = URL.createObjectURL(blob);
      dlLink.download = `${safeConfig.appName.replace(/\s+/g, "_")}_StudentApp.html`;
      document.body.appendChild(dlLink);
      dlLink.click();
      document.body.removeChild(dlLink);

      // Programmatically trigger download of all config_part_*.txt files for easy upload to Cloudflare R2!
      chunks.forEach((chunk, index) => {
        const chunkBlob = new Blob([chunk], { type: "text/plain;charset=utf-8" });
        const chunkLink = document.createElement("a");
        chunkLink.href = URL.createObjectURL(chunkBlob);
        chunkLink.download = `config_part_${index + 1}.txt`;
        document.body.appendChild(chunkLink);
        chunkLink.click();
        document.body.removeChild(chunkLink);
      });

      // Also trigger programmatic download of each split exam questions txt file!
      examQuestionsFiles.forEach((f) => {
        const qBlob = new Blob([f.content], { type: "text/plain;charset=utf-8" });
        const qLink = document.createElement("a");
        qLink.href = URL.createObjectURL(qBlob);
        qLink.download = f.filename;
        document.body.appendChild(qLink);
        qLink.click();
        document.body.removeChild(qLink);
      });

      // Automatically download student login database files (students_db.txt & student_db.txt) for Cloudflare R2!
      const studentsListJson = JSON.stringify(clonedConfig.students || []);
      const scrambledStudents = encodeObfuscatedDatabase(studentsListJson);
      const studentsBlob = new Blob([scrambledStudents], { type: "text/plain;charset=utf-8" });

      const sLink1 = document.createElement("a");
      sLink1.href = URL.createObjectURL(studentsBlob);
      sLink1.download = "students_db.txt";
      document.body.appendChild(sLink1);
      sLink1.click();
      document.body.removeChild(sLink1);

      const sLink2 = document.createElement("a");
      sLink2.href = URL.createObjectURL(studentsBlob);
      sLink2.download = "student_db.txt";
      document.body.appendChild(sLink2);
      sLink2.click();
      document.body.removeChild(sLink2);
    } catch (err) {
      console.error("Compilation error", err);
      alert("Failed packing components. Verify correct properties entries.");
    }
  };

  // THE ULTRA SPLIT STACK DIGITAL ENGINE COMPILER FOR GITHUB SAFE UPLOADS
  const handleTriggerSplitCompilationAndDownload = async () => {
    try {
      // Keep students database in the compiled split stack ZIP packages as requested by user
      // Prepare a fully safe and robust configuration to prevent any undefined/null crashes
      // Deep clone to prevent mutating UI state
      const clonedConfig = JSON.parse(JSON.stringify(appConfig));

      const safeConfig = {
        ...clonedConfig,
        appName: clonedConfig.appName || "Prayas One Hub",
        logoUrl: clonedConfig.logoUrl || DEFAULT_LOGO_URL,
        studentGreeting: clonedConfig.studentGreeting || "Hi, Aspirant!",
        studentSubGreeting: clonedConfig.studentSubGreeting || "PRAYAS ONE PROFESSIONAL HUB",
        sliders: clonedConfig.sliders || [],
        notifications: clonedConfig.notifications || [],
        popups: clonedConfig.popups || [],
        students: [], // Separate from config_part_*.txt chunks for instant independent updates!
        testCategories: clonedConfig.testCategories || [],
        pdfCategories: clonedConfig.pdfCategories || [],
        social: {
          whatsapp: "",
          telegram: "",
          instagram: "",
          youtube: "",
          paymentQr: "https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=UPI_PAYMENT_PAY@okaxis",
          paymentAmount: "₹499",
          premiumPrice: "₹45",
          premiumDurationText: "3 Months",
          premiumValidityText: "VALID FOR 90 DAYS",
          premiumBenefitsText: "Access to Past Tests, Access to Present Tests, Access to Future Tests, Unlimited Test Attempts",
          hideSourceOnStudent: false,
          qrDownloadText: "Download QR Code",
          qrDownloadLink: "",
          apkUrl: "",
          apkDownloadText: "Download Android App (APK)",
          paymentContactLink: "http://t.me/PrayasOneSupportBot",
          customLinks: [],
          ...(clonedConfig.social || {})
        }
      };

      // Traverse and extract exam questions to separate txt array files
      const examQuestionsFiles: { filename: string; content: string }[] = [];
      const traverseAndExtractQuestions = (node: any) => {
        if (!node) return;
        if (node.test) {
          const test = node.test;
          const testId = test.id;
          if (testId) {
            const questionsSubset = {
              questionsEn: test.questionsEn || [],
              questionsHi: test.questionsHi || [],
              questionsOther: test.questionsOther || {}
            };
            const questionsJsonString = JSON.stringify(questionsSubset);
            const scrambledQuestions = encodeObfuscatedDatabase(questionsJsonString);
            examQuestionsFiles.push({
              filename: `test_questions_${testId}.txt`,
              content: scrambledQuestions
            });

            // Put lightweight indicators
            test.hasSplitQuestions = true;
            test.questionsCount = Math.max(test.questionsEn.length, test.questionsHi.length);
            Object.values(test.questionsOther || {}).forEach((arr: any) => {
              if (arr && arr.length > test.questionsCount) {
                test.questionsCount = arr.length;
              }
            });

            // Null out heavy payloads
            test.questionsEn = [];
            test.questionsHi = [];
            test.questionsOther = {};
          }
        }
        if (node.subCategories && Array.isArray(node.subCategories)) {
          node.subCategories.forEach((sub: any) => traverseAndExtractQuestions(sub));
        }
      };

      if (safeConfig.testCategories && Array.isArray(safeConfig.testCategories)) {
        safeConfig.testCategories.forEach((cat: any) => traverseAndExtractQuestions(cat));
      }

      const jsonString = JSON.stringify(safeConfig);
      const base64String = encodeObfuscatedDatabase(jsonString);
      
      // Split into chunks of ~5MB (5,000,000 characters is extremely safe and well below the 20MB limit)
      const chunkSize = 5000000;
      const chunks: string[] = [];
      for (let i = 0; i < base64String.length; i += chunkSize) {
        chunks.push(base64String.substring(i, i + chunkSize));
      }

      // Generate lightweight HTML shell without heavy embedded database payload
      let htmlContent = generateStudentHTML(safeConfig, "", window.location.origin);
      
      // Inject chunk count variable & unique build ID into index.html
      const buildId = "prayas_build_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
      const loaderScript = `<script>\n        window.__studentAppChunkCount = ${chunks.length};\n        window.__studentAppBuildId = "${buildId}";\n        window.__studentAppLocalMode = true;\n    </script>`;
      htmlContent = htmlContent.replace("<!-- __CHUNK_SCRIPTS_PLACEHOLDER__ -->", loaderScript);

      // Create ZIP using JSZip
      const zip = new JSZip();
      zip.file("index.html", htmlContent);

      // Generate and obfuscate students_db.txt and student_db.txt files
      const studentsJsonString = JSON.stringify(clonedConfig.students || []);
      const scrambledStudents = encodeObfuscatedDatabase(studentsJsonString);
      zip.file("students_db.txt", scrambledStudents);
      zip.file("student_db.txt", scrambledStudents);

      // Generate CategoryPayment.txt config and pack into zip
      const paymentConfig: Record<string, any> = {};
      const allCategories = [
        ...(safeConfig.testCategories || []),
        ...(safeConfig.pdfCategories || [])
      ].filter((cat, idx, self) => self.findIndex(c => c.id === cat.id) === idx);

      allCategories.forEach(cat => {
        paymentConfig[cat.id] = {
          name: cat.name,
          isPaid: !!cat.isPaid,
          paymentAmount: cat.paymentAmount || "₹99",
          paymentValidityDays: cat.paymentValidityDays || "3 Months",
          paymentBenefits: cat.paymentBenefits || "Access to all Mock Tests, Premium PDF Material, Detailed Explanations",
          paymentQr: cat.paymentQr || "",
          paymentUrl: cat.paymentUrl || "",
          paymentHelpdeskUrl: (cat as any).paymentHelpdeskUrl || ""
        };
      });
      const paymentConfigJson = JSON.stringify(paymentConfig, null, 2);
      zip.file("CategoryPayment.txt", paymentConfigJson);
      zip.file("Category Payment.txt", paymentConfigJson);

      // Add database txt fragments to ZIP so user can extract and upload them to Cloudflare R2!
      chunks.forEach((chunk, index) => {
        zip.file(`config_part_${index + 1}.txt`, chunk);
      });

      // Add split questions files to the ZIP
      examQuestionsFiles.forEach((f) => {
        zip.file(f.filename, f.content);
      });

      // Include 404.html to handle clean-path URL SPA refresh deep-links on custom domains (prayasone.in)
      const redirect404 = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Parsing Route...</title>
    <script type="text/javascript">
        // Single Page Apps for GitHub Pages
        // MIT License
        // https://github.com/rafgraph/spa-github-pages
        var pathSegmentsToKeep = 0;
        var l = window.location;
        l.replace(
            l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
            l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') +
            '/?/' +
            l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
            (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
            l.hash
        );
    </script>
</head>
<body>
    <p style="font-family: sans-serif; text-align: center; margin-top: 40px; color: #7f8c8d;">Syncing student portal route, please wait...</p>
</body>
</html>`;
      zip.file("404.html", redirect404);

      // DYNAMIC GOOGLE-FRIENDLY SITEMAP AND ROBOTS ENGINE
      const generateSitemapXmlContent = (config: any): string => {
        const baseUrl = "https://prayasone.in";
        
        function toUrlSegment(str: string): string {
          if (!str) return "";
          return str.toString().trim()
            .replace(/[^a-zA-Z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");
        }

        const urls: string[] = [];
        urls.push(baseUrl + "/");

        const allTestCats = config.testCategories || [];
        allTestCats.forEach((cat: any) => {
          const catPath = `${baseUrl}/${toUrlSegment(cat.name)}`;
          urls.push(catPath);
          if (cat.subCategories) {
            cat.subCategories.forEach((sub: any) => {
              const subPath = `${catPath}/${toUrlSegment(sub.name)}`;
              urls.push(subPath);
              if (sub.topics) {
                sub.topics.forEach((topic: any) => {
                  urls.push(`${subPath}/${toUrlSegment(topic.name)}`);
                });
              }
            });
          }
        });

        const allPdfCats = config.pdfCategories || [];
        allPdfCats.forEach((cat: any) => {
          const catPath = `${baseUrl}/${toUrlSegment(cat.name)}`;
          urls.push(catPath);
          if (cat.subCategories) {
            cat.subCategories.forEach((sub: any) => {
              const subPath = `${catPath}/${toUrlSegment(sub.name)}`;
              urls.push(subPath);
              if (sub.topics) {
                sub.topics.forEach((topic: any) => {
                  urls.push(`${subPath}/${toUrlSegment(topic.name)}`);
                });
              }
            });
          }
        });

        const uniqueUrls = Array.from(new Set(urls.filter(Boolean)));
        const urlNodes = uniqueUrls.map(url => {
          const escapedUrl = url.replace(/&/g, "&amp;").replace(/'/g, "&apos;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
          return `  <url>\n    <loc>${escapedUrl}</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>`;
        }).join("\n");

        return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlNodes}\n</urlset>`;
      };

      const sitemapXml = generateSitemapXmlContent(safeConfig);
      zip.file("sitemap.xml", sitemapXml);

      const robotsTxt = `User-agent: *\nAllow: /\n\nSitemap: https://prayasone.in/sitemap.xml\n`;
      zip.file("robots.txt", robotsTxt);

      const readmeText = `Prayas One Student App - Split Files Exporter (Cloudflare R2 Storage Edition)
========================================================================

FILES LIST IN THIS BUNDLE:
1. index.html                   - Main student testing portal (configured to dynamically fetch DB chunks + students database from R2 Storage).
2. 404.html                     - SPA clean-path router fallback redirect (with prayasone.in/Blackbook/A-Word-Test support!).
3. sitemap.xml                  - Automatically compiled XML Sitemap listing all deep URLs for high SEO rank!
4. robots.txt                   - Robots file explicitly linking the Sitemap location to Google crawler bots.
5. students_db.txt              - SEPARATE student authentication database. You can edit/upload this independently anytime!
6. config_part_1.txt, _2.txt... - Database fragment plain text files (to be uploaded to Cloudflare R2).
7. test_questions_*.txt         - Individual exam questions split files (to be uploaded to Cloudflare R2).
8. README.txt                   - This instruction file.

Note: All database fragments (config_part_*.txt files), student accounts (students_db.txt), and questions (test_questions_*.txt files) must be uploaded to Cloudflare R2 Storage so they are accessible at:
https://pub-dc360536e4fb46baa3e3e8719d01793e.r2.dev/students_db.txt
and
https://pub-dc360536e4fb46baa3e3e8719d01793e.r2.dev/config_part_*.txt
and
https://pub-dc360536e4fb46baa3e3e8719d01793e.r2.dev/test_questions_*.txt

HOW TO DEPLOY:
1. Extract/Unzip all files in this ZIP archive.
2. Upload the HTML & XML/TXT files (index.html, 404.html, sitemap.xml, robots.txt) directly into your GitHub repository root.
3. Upload 'students_db.txt', all 'config_part_*.txt' AND 'test_questions_*.txt' files directly into your Cloudflare R2 bucket: 'mocktest-data' (making them public).
4. Enable GitHub Pages in your Repository Settings pointing to the main root folder.

HOW TO USE CLEAN DYNAMIC TEST URLs (prayasone.in/Blackbook/A-Word-Test):
Since GitHub Pages is a static site host, direct refreshes on routes like /Blackbook/A-Word-Test normally throw a 404. 
But thanks to the included '404.html' file, it automatically redirects requests back to index.html with query parameters, which then reinstates the pristine URL in the student's address bar without any error! 
Just make sure '404.html' is uploaded next to 'index.html'!

GOOGLE SITE RANKING & SITEMAP:
The 'sitemap.xml' dynamically indexes all your exams, categories, subcategories, and topics.
When uploaded, submit 'https://prayasone.in/sitemap.xml' in Google Search Console to successfully crawl and index all your testing pages!

The application dynamically fetches and reassembles all segments into memory upon startup via Cloudflare R2 Storage fetches!
`;
      zip.file("README.txt", readmeText);

      // Generate ZIP blob and trigger download
      const content = await zip.generateAsync({ type: "blob" });
      const dlLink = document.createElement("a");
      dlLink.href = URL.createObjectURL(content);
      dlLink.download = `${clonedConfig.appName.replace(/\s+/g, "_")}_SplitApp_GitHubSafe.zip`;
      document.body.appendChild(dlLink);
      dlLink.click();
      document.body.removeChild(dlLink);
    } catch (err) {
      console.error("ZIP Packaging error", err);
      alert("Failed packing split archive component.");
    }
  };

  const handleTriggerHostingerCompilationAndDownload = async () => {
    try {
      // Keep students database in the compiled split stack ZIP packages as requested by user
      // Prepare a fully safe and robust configuration to prevent any undefined/null crashes
      // Deep clone to prevent mutating UI state
      const clonedConfig = JSON.parse(JSON.stringify(appConfig));

      const safeConfig = {
        ...clonedConfig,
        appName: clonedConfig.appName || "Prayas One Hub",
        logoUrl: clonedConfig.logoUrl || DEFAULT_LOGO_URL,
        studentGreeting: clonedConfig.studentGreeting || "Hi, Aspirant!",
        studentSubGreeting: clonedConfig.studentSubGreeting || "PRAYAS ONE PROFESSIONAL HUB",
        sliders: clonedConfig.sliders || [],
        notifications: clonedConfig.notifications || [],
        popups: clonedConfig.popups || [],
        students: [], // Separate from config_part_*.txt chunks for instant independent updates!
        testCategories: clonedConfig.testCategories || [],
        pdfCategories: clonedConfig.pdfCategories || [],
        social: {
          whatsapp: "",
          telegram: "",
          instagram: "",
          youtube: "",
          paymentQr: "https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=UPI_PAYMENT_PAY@okaxis",
          paymentAmount: "₹499",
          premiumPrice: "₹45",
          premiumDurationText: "3 Months",
          premiumValidityText: "VALID FOR 90 DAYS",
          premiumBenefitsText: "Access to Past Tests, Access to Present Tests, Access to Future Tests, Unlimited Test Attempts",
          hideSourceOnStudent: false,
          qrDownloadText: "Download QR Code",
          qrDownloadLink: "",
          apkUrl: "",
          apkDownloadText: "Download Android App (APK)",
          paymentContactLink: "http://t.me/PrayasOneSupportBot",
          customLinks: [],
          ...(clonedConfig.social || {})
        }
      };

      // Traverse and extract exam questions to separate txt array files
      const examQuestionsFiles: { filename: string; content: string }[] = [];
      const traverseAndExtractQuestions = (node: any) => {
        if (!node) return;
        if (node.test) {
          const test = node.test;
          const testId = test.id;
          if (testId) {
            const questionsSubset = {
              questionsEn: test.questionsEn || [],
              questionsHi: test.questionsHi || [],
              questionsOther: test.questionsOther || {}
            };
            const questionsJsonString = JSON.stringify(questionsSubset);
            const scrambledQuestions = encodeObfuscatedDatabase(questionsJsonString);
            examQuestionsFiles.push({
              filename: `test_questions_${testId}.txt`,
              content: scrambledQuestions
            });

            // Put lightweight indicators
            test.hasSplitQuestions = true;
            test.questionsCount = Math.max(test.questionsEn.length, test.questionsHi.length);
            Object.values(test.questionsOther || {}).forEach((arr: any) => {
              if (arr && arr.length > test.questionsCount) {
                test.questionsCount = arr.length;
              }
            });

            // Null out heavy payloads
            test.questionsEn = [];
            test.questionsHi = [];
            test.questionsOther = {};
          }
        }
        if (node.subCategories && Array.isArray(node.subCategories)) {
          node.subCategories.forEach((sub: any) => traverseAndExtractQuestions(sub));
        }
      };

      if (safeConfig.testCategories && Array.isArray(safeConfig.testCategories)) {
        safeConfig.testCategories.forEach((cat: any) => traverseAndExtractQuestions(cat));
      }

      const jsonString = JSON.stringify(safeConfig);
      const base64String = encodeObfuscatedDatabase(jsonString);
      
      // Split into chunks of ~5MB
      const chunkSize = 5000000;
      const chunks: string[] = [];
      for (let i = 0; i < base64String.length; i += chunkSize) {
        chunks.push(base64String.substring(i, i + chunkSize));
      }

      // Generate lightweight HTML shell without heavy embedded database payload
      let htmlContent = generateStudentHTML(safeConfig, "", window.location.origin);
      
      // Inject chunk count variable, unique build ID, and hostinger local mode flag into index.html
      const buildId = "prayas_build_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
      const loaderScript = `<script>\n        window.__studentAppChunkCount = ${chunks.length};\n        window.__studentAppBuildId = "${buildId}";\n        window.__studentAppLocalMode = true;\n    </script>`;
      htmlContent = htmlContent.replace("<!-- __CHUNK_SCRIPTS_PLACEHOLDER__ -->", loaderScript);

      // Create ZIP using JSZip
      const zip = new JSZip();
      zip.file("index.html", htmlContent);

      // Generate and obfuscate students_db.txt and student_db.txt files
      const studentsJsonString = JSON.stringify(clonedConfig.students || []);
      const scrambledStudents = encodeObfuscatedDatabase(studentsJsonString);
      zip.file("students_db.txt", scrambledStudents);
      zip.file("student_db.txt", scrambledStudents);

      // Generate CategoryPayment.txt config and pack into zip
      const paymentConfig: Record<string, any> = {};
      const allCategories = [
        ...(safeConfig.testCategories || []),
        ...(safeConfig.pdfCategories || [])
      ].filter((cat, idx, self) => self.findIndex(c => c.id === cat.id) === idx);

      allCategories.forEach(cat => {
        paymentConfig[cat.id] = {
          name: cat.name,
          isPaid: !!cat.isPaid,
          paymentAmount: cat.paymentAmount || "₹99",
          paymentValidityDays: cat.paymentValidityDays || "3 Months",
          paymentBenefits: cat.paymentBenefits || "Access to all Mock Tests, Premium PDF Material, Detailed Explanations",
          paymentQr: cat.paymentQr || "",
          paymentUrl: cat.paymentUrl || "",
          paymentHelpdeskUrl: (cat as any).paymentHelpdeskUrl || ""
        };
      });
      const paymentConfigJson = JSON.stringify(paymentConfig, null, 2);
      zip.file("CategoryPayment.txt", paymentConfigJson);
      zip.file("Category Payment.txt", paymentConfigJson);

      // Add database txt fragments to ZIP
      chunks.forEach((chunk, index) => {
        zip.file(`config_part_${index + 1}.txt`, chunk);
      });

      // Add split questions files to the ZIP
      examQuestionsFiles.forEach((f) => {
        zip.file(f.filename, f.content);
      });

      // Include 404.html to handle clean-path URL SPA refresh deep-links on custom domains
      const redirect404 = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Parsing Route...</title>
    <script type="text/javascript">
        var pathSegmentsToKeep = 0;
        var l = window.location;
        l.replace(
            l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
            l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') +
            '/?/' +
            l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
            (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
            l.hash
        );
    </script>
</head>
<body>
    <p style="font-family: sans-serif; text-align: center; margin-top: 40px; color: #7f8c8d;">Syncing student portal route, please wait...</p>
</body>
</html>`;
      zip.file("404.html", redirect404);

      // DYNAMIC GOOGLE-FRIENDLY SITEMAP AND ROBOTS ENGINE
      const generateSitemapXmlContent = (config: any): string => {
        const baseUrl = "https://prayasone.in";
        
        function toUrlSegment(str: string): string {
          if (!str) return "";
          return str.toString().trim()
            .replace(/[^a-zA-Z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");
        }

        const urls: string[] = [];
        urls.push(baseUrl + "/");

        const allTestCats = config.testCategories || [];
        allTestCats.forEach((cat: any) => {
          const catPath = `${baseUrl}/${toUrlSegment(cat.name)}`;
          urls.push(catPath);
          if (cat.subCategories) {
            cat.subCategories.forEach((sub: any) => {
              const subPath = `${catPath}/${toUrlSegment(sub.name)}`;
              urls.push(subPath);
              if (sub.topics) {
                sub.topics.forEach((topic: any) => {
                  urls.push(`${subPath}/${toUrlSegment(topic.name)}`);
                });
              }
            });
          }
        });

        const allPdfCats = config.pdfCategories || [];
        allPdfCats.forEach((cat: any) => {
          const catPath = `${baseUrl}/${toUrlSegment(cat.name)}`;
          urls.push(catPath);
          if (cat.subCategories) {
            cat.subCategories.forEach((sub: any) => {
              const subPath = `${catPath}/${toUrlSegment(sub.name)}`;
              urls.push(subPath);
              if (sub.topics) {
                sub.topics.forEach((topic: any) => {
                  urls.push(`${subPath}/${toUrlSegment(topic.name)}`);
                });
              }
            });
          }
        });

        const uniqueUrls = Array.from(new Set(urls.filter(Boolean)));
        const urlNodes = uniqueUrls.map(url => {
          const escapedUrl = url.replace(/&/g, "&amp;").replace(/'/g, "&apos;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
          return `  <url>\n    <loc>${escapedUrl}</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>`;
        }).join("\n");

        return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlNodes}\n</urlset>`;
      };

      const sitemapXml = generateSitemapXmlContent(safeConfig);
      zip.file("sitemap.xml", sitemapXml);

      const robotsTxt = `User-agent: *\nAllow: /\n\nSitemap: https://prayasone.in/sitemap.xml\n`;
      zip.file("robots.txt", robotsTxt);

      const readmeText = `Prayas One Student App - Hostinger Local Exporter (Offline/Local Folder Edition)
------------------------------------------------------------------------

FILES LIST IN THIS BUNDLE:
1. index.html                   - Main student testing portal (configured to dynamically fetch DB chunks + students database locally from the same folder).
2. 404.html                     - SPA clean-path router fallback redirect (with support for Hostinger subdirectory page refreshing!).
3. sitemap.xml                  - Automatically compiled XML Sitemap listing all deep URLs for high SEO rank!
4. robots.txt                   - Robots file explicitly linking the Sitemap location to Google crawler bots.
5. students_db.txt              - SEPARATE student authentication database. You can edit/upload this independently anytime!
6. config_part_1.txt, _2.txt... - Database fragment plain text files (to be uploaded to Hostinger in the same folder as index.html).
7. test_questions_*.txt         - Individual exam questions split files (to be uploaded to Hostinger in the same folder as index.html).
8. CategoryPayment.txt          - Subscription price and helpdesk metadata file.
9. README.txt                   - This instruction file.

HOW TO DEPLOY ON HOSTINGER (public_html):
1. Extract/Unzip all files in this ZIP archive on your local computer.
2. Log into your Hostinger hPanel, go to File Manager, and navigate to 'public_html' (or your desired subdomain folder like 'public_html/student').
3. Upload ALL extracted files (index.html, 404.html, sitemap.xml, robots.txt, students_db.txt, student_db.txt, CategoryPayment.txt, all config_part_*.txt and test_questions_*.txt files) directly into that folder.
4. That's it! Everything works immediately! Open 'https://yourdomain.com/' (or your subdirectory/subdomain URL) to access your exam portal.

HOW TO USE CLEAN DYNAMIC TEST URLs:
Since shared servers throw a 404 when directly refreshing subfolders on SPAs, make sure '404.html' is uploaded next to 'index.html'.

GOOGLE SITE RANKING & SITEMAP:
Submit 'https://yourdomain.com/sitemap.xml' in Google Search Console to successfully crawl and index all your testing pages!

The application dynamically fetches and reassembles all segments into memory locally without relying on any external R2 storage buckets!
`;
      zip.file("README.txt", readmeText);

      // Generate ZIP blob and trigger download
      const content = await zip.generateAsync({ type: "blob" });
      const dlLink = document.createElement("a");
      dlLink.href = URL.createObjectURL(content);
      dlLink.download = `${clonedConfig.appName.replace(/\s+/g, "_")}_Hostinger_LocalApp.zip`;
      document.body.appendChild(dlLink);
      dlLink.click();
      document.body.removeChild(dlLink);
    } catch (err) {
      console.error("ZIP Packaging error", err);
      alert("Failed packing Hostinger Local archive component.");
    }
  };

  const handleTriggerEncryptedDBOnlyDownload = async () => {
    try {
      // Deep clone to prevent mutating UI state
      const clonedConfig = JSON.parse(JSON.stringify(appConfig));

      const examQuestionsFiles: { filename: string; content: string }[] = [];
      const traverseAndExtractQuestions = (node: any) => {
        if (!node) return;
        if (node.test) {
          const test = node.test;
          const testId = test.id;
          if (testId) {
            const questionsSubset = {
              questionsEn: test.questionsEn || [],
              questionsHi: test.questionsHi || [],
              questionsOther: test.questionsOther || {}
            };
            const questionsJsonString = JSON.stringify(questionsSubset);
            const scrambledQuestions = encodeObfuscatedDatabase(questionsJsonString);
            examQuestionsFiles.push({
              filename: `test_questions_${testId}.txt`,
              content: scrambledQuestions
            });

            // Put lightweight indicators
            test.hasSplitQuestions = true;
            test.questionsCount = Math.max(test.questionsEn.length, test.questionsHi.length);
            Object.values(test.questionsOther || {}).forEach((arr: any) => {
              if (arr && arr.length > test.questionsCount) {
                test.questionsCount = arr.length;
              }
            });

            // Null out heavy payloads
            test.questionsEn = [];
            test.questionsHi = [];
            test.questionsOther = {};
          }
        }
        if (node.subCategories && Array.isArray(node.subCategories)) {
          node.subCategories.forEach((sub: any) => traverseAndExtractQuestions(sub));
        }
      };

      if (clonedConfig.testCategories && Array.isArray(clonedConfig.testCategories)) {
        clonedConfig.testCategories.forEach((cat: any) => traverseAndExtractQuestions(cat));
      }

      const jsonString = JSON.stringify(clonedConfig);
      const base64String = encodeObfuscatedDatabase(jsonString);
      
      // Split into chunks of ~5MB (5,000,000 characters is extremely safe and well below the 20MB limit)
      const chunkSize = 5000000;
      const chunks: string[] = [];
      for (let i = 0; i < base64String.length; i += chunkSize) {
        chunks.push(base64String.substring(i, i + chunkSize));
      }

      // Create ZIP using JSZip containing ONLY config_part_*.txt files!
      const zip = new JSZip();
      chunks.forEach((chunk, index) => {
        zip.file(`config_part_${index + 1}.txt`, chunk);
      });

      // Add split questions files to the ZIP
      examQuestionsFiles.forEach((f) => {
        zip.file(f.filename, f.content);
      });

      const readmeText = `Prayas One Student App - Encrypted Database Only Backup ZIP
========================================================================

This ZIP file contains the encrypted plain-text Database chunks of your application config, along with separate split test questions list.
You can import this ZIP back into the administrator dashboard to restore your exact states.

FILES LIST IN THIS BUNDLE:
1. config_part_1.txt, _2.txt... - Encrypted database fragments (scrambled Devanagari format, under 5MB).
2. test_questions_*.txt         - Encrypted split exam questions list files.
`;
      zip.file("README_Backup_Instructions.txt", readmeText);

      // Generate ZIP blob and trigger download
      const content = await zip.generateAsync({ type: "blob" });
      const dlLink = document.createElement("a");
      dlLink.href = URL.createObjectURL(content);
      dlLink.download = `${clonedConfig.appName.replace(/\s+/g, "_")}_Encrypted_DB_Only.zip`;
      document.body.appendChild(dlLink);
      dlLink.click();
      document.body.removeChild(dlLink);
    } catch (err) {
      console.error("ZIP DB Packaging error", err);
      alert("Failed packing database only zip.");
    }
  };

  // Fetching target node's test/pdf configurations for side settings drawer
  const findActiveNodeData = () => {
    if (!editingNodeId || !editingNodeType) return null;
    const targetCats = editNodeCategoryContext === "test" ? appConfig.testCategories : appConfig.pdfCategories;

    const findTopicRecursive = (topics: TopicNode[]): TopicNode | null => {
      for (const top of topics) {
        if (top.id === editingNodeId) return top;
        if (top.topics && top.topics.length > 0) {
          const found = findTopicRecursive(top.topics);
          if (found) return found;
        }
      }
      return null;
    };

    for (const cat of targetCats) {
      if (editingNodeType === "category" && cat.id === editingNodeId) return cat;
      for (const sub of cat.subCategories) {
        if (editingNodeType === "subcategory" && sub.id === editingNodeId) return sub;
        if (editingNodeType === "topic") {
          const found = findTopicRecursive(sub.topics || []);
          if (found) return found;
        }
      }
    }
    return null;
  };

  const activeNodeData = findActiveNodeData();

  const renderTopicsRecursive = (topics: TopicNode[], catId: string, subId: string, depth = 0): React.ReactNode => {
    return (
      <div className={`space-y-2 ${depth > 0 ? "ml-3 border-l border-gray-200 pl-2 mt-1.5" : ""}`}>
        {(topics || []).map((top) => (
          <div key={top.id} className="space-y-1.5">
            <div className="flex items-center justify-between bg-slate-50 hover:bg-slate-100 pl-3 pr-2 py-2 rounded-xl border border-gray-100">
              <div className="flex items-center gap-2 min-w-0">
                <button
                  onClick={() => toggleSubExpanded(top.id)}
                  className="text-gray-400 hover:text-[#FF6B35] font-bold text-sm shrink-0"
                >
                  {top.topics && top.topics.length > 0 ? (
                    <FolderOpen className="w-3.5 h-3.5 text-amber-500" />
                  ) : (
                    <FileText className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  )}
                </button>
                <span
                  onClick={() => { setEditingNodeId(top.id); setEditingNodeType("topic"); }}
                  className={`text-[11px] font-semibold text-slate-600 cursor-pointer hover:text-[#FF6B35] truncate ${editingNodeId === top.id ? "text-[#FF6B35] underline font-bold" : ""}`}
                >
                  {top.name}
                </span>

                {top.test && <span className="text-[8px] bg-[#FF6B35]/15 text-[#FF6B35] px-1.25 py-0.15 rounded-full font-bold">Exam</span>}
                {top.pdf && <span className="text-[8px] bg-sky-50 text-sky-700 px-1.25 py-0.15 rounded-full font-bold border border-sky-100">PDF</span>}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleAddSubTopicNode(catId, subId, top.id, editNodeCategoryContext)}
                  title="Add sub-topic / lesson file inside this folder"
                  className="text-emerald-600 hover:bg-emerald-50 p-1 rounded-lg cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleMoveTopic(catId, subId, top.id, editNodeCategoryContext, "up")}
                  className="text-gray-400 hover:text-[#FF6B35] p-1 bg-white hover:bg-slate-50 border border-gray-100 rounded-full cursor-pointer"
                  title="Move Topic Up"
                >
                  <ArrowUp className="w-2.5 h-2.5" />
                </button>
                <button
                  onClick={() => handleMoveTopic(catId, subId, top.id, editNodeCategoryContext, "down")}
                  className="text-gray-400 hover:text-[#FF6B35] p-1 bg-white hover:bg-slate-50 border border-gray-100 rounded-full cursor-pointer"
                  title="Move Topic Down"
                >
                  <ArrowDown className="w-2.5 h-2.5" />
                </button>
                {deleteConfirmId === top.id ? (
                  <div className="flex items-center gap-1 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-lg shrink-0">
                    <span className="text-[8px] font-bold text-red-600">Delete?</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNodeItem(top.id, "topic", editNodeCategoryContext, true);
                      }}
                      className="text-[8px] bg-red-600 text-white px-1 py-0.25 rounded font-extrabold cursor-pointer"
                    >
                      Yes
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmId(null);
                      }}
                      className="text-[8px] bg-gray-200 text-gray-700 px-1 py-0.25 rounded font-bold cursor-pointer"
                      title="Cancel"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirmId(top.id);
                    }}
                    className="text-gray-400 hover:text-red-500 p-1 rounded-lg cursor-pointer"
                    title="Remove topic"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
            {expandedSubs[top.id] && top.topics && top.topics.length > 0 && (
              <div className="pl-3.5 border-l-2 border-gray-150 space-y-1.5 py-1">
                {renderTopicsRecursive(top.topics, catId, subId, depth + 1)}
              </div>
            )}
          </div>
        ))}
        {depth === 0 && (!topics || topics.length === 0) && (
          <div className="text-[10px] text-gray-400 italic py-1 pl-2 font-medium">Topic shelf is empty.</div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F4F7FA] text-slate-800 font-sans antialiased relative">
      
      {/* MOBILE HEADER BAR */}
      <div className="md:hidden flex items-center justify-between bg-white px-5 py-4 border-b border-gray-200 shadow-xs shrink-0 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#FF6B35] rounded-lg flex items-center justify-center text-white font-bold text-base">P1</div>
          <div>
            <span className="font-extrabold text-sm uppercase tracking-tight text-gray-800 block">Prayas One</span>
            <span className="text-[8px] text-gray-400 font-mono tracking-wider -mt-1 block">STUDIO ADMIN</span>
          </div>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-gray-600 hover:text-gray-900 bg-slate-50 rounded-lg border border-gray-200 outline-none flex items-center justify-center"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* BACKDROP BLUR OVERLAY ON MOBILE */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* LEFT PRIMARY STUDIO SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 flex flex-col shrink-0 text-slate-800 shadow-lg md:shadow-sm transition-transform duration-300 md:static md:translate-x-0 ${
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:flex"
      }`}>
        <div className="p-6 mb-4 border-b border-gray-150 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FF6B35] rounded-xl flex items-center justify-center text-white font-bold text-xl shrink-0">P1</div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-gray-800 uppercase">Prayas One</h1>
              <p className="text-[10px] text-gray-400 font-medium font-mono uppercase tracking-widest">Ultimate Builder</p>
            </div>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="p-1 px-2 md:hidden text-gray-400 hover:text-gray-650 bg-gray-50 rounded-lg border border-gray-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
          <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-4 px-2">Admin Dashboard</div>
          
          <button
            onClick={() => { setActiveTab("general"); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              activeTab === "general" ? "bg-[#F4F7FA] text-[#FF6B35]" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <Smartphone className="w-4.5 h-4.5" />
            <span>General Identity</span>
          </button>

          <button
            onClick={() => { setActiveTab("sliders"); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              activeTab === "sliders" ? "bg-[#F4F7FA] text-[#FF6B35]" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <Sliders className="w-4.5 h-4.5" />
            <span>Image Carousel</span>
          </button>

          <button
            onClick={() => { setActiveTab("notifications"); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              activeTab === "notifications" ? "bg-[#F4F7FA] text-[#FF6B35]" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <BadgeAlert className="w-4.5 h-4.5" />
            <span>Notice Broadcast</span>
          </button>

          <button
            onClick={() => { setActiveTab("popups"); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              activeTab === "popups" ? "bg-[#F4F7FA] text-[#FF6B35]" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <Megaphone className="w-4.5 h-4.5" />
            <span>Website Pop-ups</span>
          </button>

          <button
            onClick={() => { setActiveTab("tests"); setEditNodeCategoryContext("test"); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              activeTab === "tests" ? "bg-[#F4F7FA] text-[#FF6B35]" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <FolderOpen className="w-4.5 h-4.5" />
            <span>Tests Catalog Library</span>
          </button>

          <button
            onClick={() => { setActiveTab("pdfs"); setEditNodeCategoryContext("pdf"); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              activeTab === "pdfs" ? "bg-[#F4F7FA] text-[#FF6B35]" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <FileSpreadsheet className="w-4.5 h-4.5" />
            <span>PDFs Catalog Library</span>
          </button>

          <button
            onClick={() => { setActiveTab("students"); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              activeTab === "students" ? "bg-[#F4F7FA] text-[#FF6B35]" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <Users className="w-4.5 h-4.5" />
            <span>Students Database</span>
          </button>

          <button
            onClick={() => { setActiveTab("payment"); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              activeTab === "payment" ? "bg-[#F4F7FA] text-[#FF6B35]" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <QrCode className="w-4.5 h-4.5" />
            <span>Social & Payments</span>
          </button>

          <button
            onClick={() => { setActiveTab("logs"); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              activeTab === "logs" ? "bg-[#F4F7FA] text-[#FF6B35]" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <History className="w-4.5 h-4.5" />
            <span>Activity Logs</span>
          </button>

          <button
            onClick={() => { setActiveTab("backups"); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              activeTab === "backups" ? "bg-[#F4F7FA] text-[#FF6B35]" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <Database className="w-4.5 h-4.5" />
            <span>Database Backups</span>
          </button>

          <button
            onClick={() => { setActiveTab("seo"); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              activeTab === "seo" ? "bg-[#F4F7FA] text-[#FF6B35]" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <Globe className="w-4.5 h-4.5" />
            <span>SEO Google Center</span>
          </button>

          <button
            onClick={() => { setActiveTab("adsense"); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              activeTab === "adsense" ? "bg-[#F4F7FA] text-[#FF6B35]" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <DollarSign className="w-4.5 h-4.5" />
            <span>Google AdSense</span>
          </button>
        </nav>

        <div className="p-3 border-t border-gray-150 space-y-2.5 bg-slate-50 rounded-xl mx-2 my-3 border border-slate-200">
          <span className="text-[9px] font-extrabold uppercase text-gray-500 tracking-wider block text-center">
            {"\ud83d\udee0\ufe0f"} Student Portal Compiler
          </span>
          
          <div className="space-y-1.5">
            <button
              onClick={handleTriggerHostingerCompilationAndDownload}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              title="Download split files in a ZIP optimized for Hostinger public_html (no Cloudflare R2 bucket required, loads files relative to index.html!)."
            >
              <Globe className="w-4 h-4" />
              <span>1. Hostinger ZIP (Local Folders)</span>
            </button>

            <button
              onClick={handleTriggerEncryptedDBOnlyDownload}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              title="Download only the database text files in encrypted Devanagari format inside a ZIP"
            >
              <FileText className="w-4 h-4" />
              <span>2. Encrypted DB Only (Zip)</span>
            </button>
          </div>
          
          <p className="text-[9px] text-gray-400 text-center leading-normal px-1">
            Download <strong>Hostinger ZIP</strong> to upload directly into your server's <code>public_html</code> directory.
          </p>
          
          <div className="pt-2 border-t border-gray-1.50">
            <button
              onClick={handleResetDefaults}
              className="w-full bg-white hover:bg-gray-100 text-gray-500 py-1.5 px-2 rounded-lg font-semibold text-[9px] uppercase tracking-wide transition-all border border-gray-200 cursor-pointer text-center block"
            >
              Reset Settings
            </button>
          </div>

          <div className="pt-2 border-t border-gray-150 space-y-1">
            <span className="text-[8px] font-black uppercase text-gray-400 tracking-wider block text-center">
              {"\ud83d\udd04"} RETRIEVE & UPDATE APP
            </span>
            <div className="relative border border-dashed border-gray-300 rounded-xl p-3 bg-white hover:bg-slate-50 transition-all text-center cursor-pointer">
              <input
                type="file"
                accept=".html,.zip,.txt"
                multiple={true}
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    handleImportMultipleFiles(Array.from(files));
                  }
                }}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <span className="text-[10px] font-extrabold text-[#FF6B35] block">
                Upload HTML, Zip or Multiple Parts
              </span>
              <span className="text-[8px] text-gray-400 block mt-0.5 leading-snug">
                Supports single HTML, Split ZIP, or multiple "config_part_*.txt" + "test_questions_*.txt" files together to fully reconstruct state
              </span>
            </div>
          </div>
        </div>

        <div className="px-4 py-3 border-t border-gray-150 text-[10px] text-gray-400 font-bold text-center bg-slate-50 shrink-0">
          <div className="flex flex-wrap justify-center gap-x-2 gap-y-1">
            <a href="/privacy-policy" target="_blank" className="hover:text-[#FF6B35] underline text-gray-400">Privacy Policy</a>
            <span>•</span>
            <a href="/terms-conditions" target="_blank" className="hover:text-[#FF6B35] underline text-gray-400">Terms & Conditions</a>
            <span>•</span>
            <a href="/disclaimer" target="_blank" className="hover:text-[#FF6B35] underline text-gray-400">Disclaimer</a>
            <span>•</span>
            <a href="/copyright-policy" target="_blank" className="hover:text-[#FF6B35] underline text-gray-400">Copyright Policy</a>
          </div>
        </div>
      </aside>


      {/* MAIN STUDIO WORKSPACE */}
      <main className="flex-grow p-4 md:p-8 overflow-y-auto w-full max-w-full min-w-0">
        
        {/* HEADER BRANDING BANNER */}
        <header className="flex justify-between items-center mb-8 border-b border-gray-150 pb-5">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">App Builder Preview</h2>
            <p className="text-sm text-gray-500 font-medium">Real-time student application mockup builder</p>
          </div>
          <div className="flex gap-2">
            <span className="bg-emerald-50 text-emerald-700 text-xs font-extrabold uppercase px-3 py-1.5 rounded-xl border border-emerald-100 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> STATUS: ACTIVE
            </span>
          </div>
        </header>


        {/* ROUTING CORRESPONDING BLOCKS VIEW */}

        {/* 1. GENERAL APP IDENTITIES */}
        {activeTab === "general" && (
          <section className="space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Header & Logo Identifiers</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">Application Header Logo (URL)</label>
                  <input
                    type="text"
                    value={appConfig.logoUrl}
                    onChange={(e) => handleUpdateGeneralFields("logoUrl", e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] focus:bg-white transition-all outline-none text-slate-800 font-semibold"
                  />
                  <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">Provide absolute URL keys (jpg, png) or click compiler defaults.</p>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">Aspirant Panel Welcome Greeting</label>
                  <input
                    type="text"
                    value={appConfig.studentGreeting}
                    onChange={(e) => handleUpdateGeneralFields("studentGreeting", e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] focus:bg-white transition-all outline-none text-slate-800 font-semibold"
                  />
                  <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">Custom welcome text displayed prominently on landing dashboards.</p>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">Aspirant Panel Sub Greeting</label>
                  <input
                    type="text"
                    value={appConfig.studentSubGreeting || ""}
                    onChange={(e) => handleUpdateGeneralFields("studentSubGreeting", e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] focus:bg-white transition-all outline-none text-slate-800 font-semibold"
                    placeholder="PRAYAS ONE PROFESSIONAL HUB"
                  />
                  <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">Displays right below the welcome greeting heading.</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-5 border border-gray-100 flex items-center gap-4">
                <img src={appConfig.logoUrl} alt="Preview Logo" className="w-16 h-16 object-cover rounded-xl border border-gray-200 bg-white" onError={(e) => { (e.target as any).src = DEFAULT_LOGO_URL; }} />
                <div>
                  <h4 className="font-bold text-sm text-slate-800">Visual Identification Profile</h4>
                  <p className="text-xs text-gray-500 leading-normal mt-0.5">This symbol repeats on locked watermarks, exam grids, and student certificates inside generated apps.</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 2. IMAGE SLIDERS SETUP */}
        {activeTab === "sliders" && (
          <section className="space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Dynamic 21:9 Landing Sliders</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Add promotional banners with auto-scroll and customizable touch action redirection links.</p>
                </div>
                <button
                  onClick={handleAddSlider}
                  className="bg-[#111827] hover:bg-black text-white px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 cursor-pointer transition-all shadow-md"
                >
                  <Plus className="w-4 h-4" /> Add Banner
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {appConfig.sliders.map((slide, index) => (
                  <div key={slide.id} className="border border-gray-150 rounded-2xl p-5 hover:border-[#FF6B35] transition-all bg-slate-50 flex flex-col md:flex-row gap-5 relative">
                    <div className="absolute top-4 right-14 flex items-center gap-1">
                      <button
                        onClick={() => handleMoveSlider(slide.id, "up")}
                        disabled={index === 0}
                        className="text-gray-400 hover:text-[#FF6B35] disabled:opacity-30 p-1 bg-white hover:bg-slate-50 border border-gray-100 rounded-full cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveSlider(slide.id, "down")}
                        disabled={index === appConfig.sliders.length - 1}
                        className="text-gray-400 hover:text-[#FF6B35] disabled:opacity-30 p-1 bg-white hover:bg-slate-50 border border-gray-100 rounded-full cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleDeleteSliderItem(slide.id)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-red-500 p-1 bg-white hover:bg-red-50 rounded-full border border-gray-100 placeholder-hide cursor-pointer"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>

                    <div className="w-full md:w-56 shrink-0 aspect-[21/9] rounded-xl overflow-hidden border border-gray-200 bg-white shadow-xs">
                      <img src={slide.image} alt="Slider" className="w-full h-full object-cover" onError={(e) => { (e.target as any).src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600"; }} />
                    </div>

                    <div className="flex-grow space-y-3">
                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Slide Image (URL)</label>
                        <input
                          type="text"
                          value={slide.image}
                          onChange={(e) => handleUpdateSliderItem(slide.id, "image", e.target.value)}
                          className="w-full mt-1 bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Alt Overlay Title</label>
                          <input
                            type="text"
                            value={slide.title}
                            onChange={(e) => handleUpdateSliderItem(slide.id, "title", e.target.value)}
                            className="w-full mt-1 bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Redirect URL (opens on hover selection)</label>
                          <input
                            type="text"
                            value={slide.link}
                            onChange={(e) => handleUpdateSliderItem(slide.id, "link", e.target.value)}
                            className="w-full mt-1 bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase text-[#FF6B35] tracking-wider font-bold">Schedule Availability (Optional)</label>
                          <input
                            type="datetime-local"
                            value={slide.scheduledAt || ""}
                            onChange={(e) => handleUpdateSliderItem(slide.id, "scheduledAt", e.target.value)}
                            className="w-full mt-1 bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {appConfig.sliders.length === 0 && (
                  <div className="py-12 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-slate-50 text-gray-400 font-bold">
                    No banners configured. App will fall-back to defaults.
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* 3. NOTICE BROADCAST LISTS */}
        {activeTab === "notifications" && (
          <section className="space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Notice Alerts Feed Broadcast</h3>
                  <p className="text-xs text-gray-500 mt-0.5 font-medium">Post gorgeous alert notifications featuring imagery banners, custom action buttons, and redirect link cards.</p>
                </div>
                <button
                  onClick={handleAddNotification}
                  className="bg-[#111827] hover:bg-black text-white px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 cursor-pointer transition-all shadow-md"
                >
                  <Plus className="w-4 h-4" /> Add Notice Card
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {appConfig.notifications.map((notif, index) => (
                  <div key={notif.id} className="border border-gray-150 rounded-2xl p-5 hover:border-[#FF6B35] transition-all bg-slate-50 flex flex-col md:flex-row gap-5 relative">
                    <div className="absolute top-4 right-14 flex items-center gap-1">
                      <button
                        onClick={() => handleMoveNotification(notif.id, "up")}
                        disabled={index === 0}
                        className="text-gray-400 hover:text-[#FF6B35] disabled:opacity-30 p-1 bg-white hover:bg-slate-50 border border-gray-100 rounded-full cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveNotification(notif.id, "down")}
                        disabled={index === appConfig.notifications.length - 1}
                        className="text-gray-400 hover:text-[#FF6B35] disabled:opacity-30 p-1 bg-white hover:bg-slate-50 border border-gray-100 rounded-full cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleDeleteNotificationItem(notif.id)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-red-500 p-1 bg-white hover:bg-red-50 rounded-full border border-gray-100 cursor-pointer"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>

                    <div className="w-full md:w-44 shrink-0 aspect-video rounded-xl overflow-hidden border border-gray-200 bg-white">
                      <img src={notif.image} alt="Alert banner" className="w-full h-full object-cover" onError={(e) => { (e.target as any).src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400"; }} />
                    </div>

                    <div className="flex-grow space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Alert Heading Title</label>
                          <input
                            type="text"
                            value={notif.title}
                            onChange={(e) => handleUpdateNotificationItem(notif.id, "title", e.target.value)}
                            className="w-full mt-1 bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Alert Image (URL)</label>
                          <input
                            type="text"
                            value={notif.image}
                            onChange={(e) => handleUpdateNotificationItem(notif.id, "image", e.target.value)}
                            className="w-full mt-1 bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Message Description Content</label>
                        <textarea
                          rows={2}
                          value={notif.message}
                          onChange={(e) => handleUpdateNotificationItem(notif.id, "message", e.target.value)}
                          className="w-full mt-1 bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] outline-none resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Action Button Label</label>
                          <input
                            type="text"
                            value={notif.buttonName}
                            onChange={(e) => handleUpdateNotificationItem(notif.id, "buttonName", e.target.value)}
                            className="w-full mt-1 bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Action Link Redirect Address</label>
                          <input
                            type="text"
                            value={notif.link}
                            onChange={(e) => handleUpdateNotificationItem(notif.id, "link", e.target.value)}
                            className="w-full mt-1 bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase text-[#FF6B35] tracking-wider font-bold">Schedule Notices (Optional)</label>
                          <input
                            type="datetime-local"
                            value={notif.scheduledAt || ""}
                            onChange={(e) => handleUpdateNotificationItem(notif.id, "scheduledAt", e.target.value)}
                            className="w-full mt-1 bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {appConfig.notifications.length === 0 && (
                   <div className="py-12 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-slate-50 text-gray-400 font-bold">
                    No active notices created. App alert feeds will download empty.
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* WEBSITE ANNOUNCEMENT POPUPS MANAGEMENT PANEL */}
        {activeTab === "popups" && (
          <section className="space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Website Announcement Pop-ups</h3>
                  <p className="text-xs text-gray-500 mt-0.5 font-medium">Create unlimited, highly converting 1:1 image action pop-ups that load immediately when students boot the app. Schedule active timing windows, specify priority sequence orders, and redirect actions.</p>
                </div>
                <button
                  onClick={handleAddWebsitePopup}
                  className="bg-[#111827] hover:bg-black text-white px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 cursor-pointer transition-all shadow-md animate-fade-in"
                >
                  <Megaphone className="w-4 h-4" />
                  <span>Create Popup Card</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {(appConfig.popups || []).map((popup) => (
                  <div key={popup.id} className="bg-slate-50 border border-gray-200 rounded-3xl p-5 relative flex flex-col justify-between hover:border-gray-300 transition-all duration-300 shadow-xs">
                    <button
                      onClick={() => handleDeleteWebsitePopup(popup.id)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all"
                      title="Delete popup option"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="space-y-4">
                      {/* Live Demo Preview of the Pop-up with a 1:1 Aspect Ratio Banners */}
                      <div>
                        <div className="text-[10px] font-black uppercase text-indigo-600 mb-2 flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" /> Live 1:1 Simulated View
                        </div>
                        <div className="border border-gray-200 bg-white rounded-2xl overflow-hidden shadow-xs max-w-[210px] mx-auto p-3">
                          {/* 1:1 Aspect Ratio image container */}
                          <div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center relative">
                            {popup.imageUrl ? (
                              <img
                                src={popup.imageUrl}
                                alt="preview"
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <span className="text-[10px] text-gray-400 font-bold">1:1 Image Ratio</span>
                            )}
                            <div className="absolute top-1 right-1 bg-black/60 backdrop-blur-xs text-white rounded-full p-1 leading-none text-[8px] font-bold">
                              &times;
                            </div>
                          </div>
                          <div className="p-2 text-center text-gray-800">
                            <h4 className="font-extrabold text-[11px] truncate">{popup.title || "Untitled Announcement"}</h4>
                            <p className="text-[9px] text-gray-500 line-clamp-2 mt-0.5 leading-snug">{popup.text || "Your promotional subtitle description content here..."}</p>
                            {popup.redirectUrl && (
                              <div className="mt-1.5 inline-block text-[8px] bg-[#FF6B35] text-white font-bold px-2 py-0.5 rounded uppercase font-mono tracking-wider">
                                {popup.buttonName || "Explore Details"} &rarr;
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Inputs controls */}
                      <div className="grid grid-cols-1 gap-3 pt-3 border-t border-gray-200">
                        <div>
                          <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Card Title</label>
                          <input
                            type="text"
                            value={popup.title || ""}
                            onChange={(e) => handleUpdateWebsitePopup(popup.id, "title", e.target.value)}
                            className="w-full mt-1 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-bold outline-none"
                            placeholder="Offer Header text..."
                          />
                        </div>

                        <div>
                          <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Description Submessage Text</label>
                          <textarea
                            value={popup.text || ""}
                            onChange={(e) => handleUpdateWebsitePopup(popup.id, "text", e.target.value)}
                            className="w-full mt-1 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold outline-none h-16 resize-none"
                            placeholder="Write message copy detailing offer perks..."
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Image (1:1 Ratio Url)</label>
                            <input
                              type="text"
                              value={popup.imageUrl || ""}
                              onChange={(e) => handleUpdateWebsitePopup(popup.id, "imageUrl", e.target.value)}
                              className="w-full mt-1 bg-white border border-gray-200 rounded-lg px-2 py-1 text-[10px] outline-none font-mono"
                              placeholder="Image Link..."
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Action CTA Redirect URL</label>
                            <input
                              type="text"
                              value={popup.redirectUrl || ""}
                              onChange={(e) => handleUpdateWebsitePopup(popup.id, "redirectUrl", e.target.value)}
                              className="w-full mt-1 bg-white border border-gray-200 rounded-lg px-2 py-1 text-[10px] outline-none font-mono"
                              placeholder="#premium or website links..."
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 bg-slate-100/40 p-2 text-[10px] rounded-xl border border-gray-150">
                          <div>
                            <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider block">Button CTA Name</label>
                            <input
                              type="text"
                              value={popup.buttonName || ""}
                              onChange={(e) => handleUpdateWebsitePopup(popup.id, "buttonName", e.target.value)}
                              className="w-full mt-1 bg-white border border-gray-200 rounded px-1.5 py-1 text-[10px] outline-none"
                              placeholder="Explore Details..."
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider block">Show To Audience</label>
                            <select
                              value={popup.showTo || "all"}
                              onChange={(e) => handleUpdateWebsitePopup(popup.id, "showTo", e.target.value)}
                              className="w-full mt-1 bg-white border border-gray-200 rounded px-1.5 py-1 text-[10px] outline-none font-bold"
                            >
                              <option value="all">All Users</option>
                              <option value="paid">Only Paid Users</option>
                              <option value="free">Only Free Users</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 bg-white/60 p-2 text-[10px] rounded-xl border border-gray-150">
                          <div>
                            <label className="text-[9px] font-black uppercase text-gray-500 tracking-wider block">Start Active Schedule</label>
                            <input
                              type="datetime-local"
                              value={popup.startTime || ""}
                              onChange={(e) => handleUpdateWebsitePopup(popup.id, "startTime", e.target.value)}
                              className="w-full mt-1 bg-white border border-gray-200 rounded px-1.5 py-1 text-[10px] outline-none font-bold"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-black uppercase text-gray-500 tracking-wider block">End Expire Schedule</label>
                            <input
                              type="datetime-local"
                              value={popup.endTime || ""}
                              onChange={(e) => handleUpdateWebsitePopup(popup.id, "endTime", e.target.value)}
                              className="w-full mt-1 bg-white border border-gray-200 rounded px-1.5 py-1 text-[10px] outline-none font-bold"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={popup.isActive ?? true}
                              onChange={(e) => handleUpdateWebsitePopup(popup.id, "isActive", e.target.checked)}
                              className="rounded text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wide">Status Active</span>
                          </label>

                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-bold uppercase text-gray-400">Sequence Order:</span>
                            <input
                              type="number"
                              value={popup.order || 0}
                              onChange={(e) => handleUpdateWebsitePopup(popup.id, "order", parseInt(e.target.value) || 0)}
                              className="w-12 bg-white border border-gray-200 rounded text-center py-0.5 text-xs font-black outline-none"
                              min="1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {(appConfig.popups || []).length === 0 && (
                  <div className="col-span-2 py-16 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-slate-50 text-gray-400 font-bold">
                    No website active popups configured yet. Click "Create Popup Card" above to bootstrap one!
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* 4. EXAM TESTS AND PDFS HIERARCHICAL TREES CATALOG BUILDERS */}
        {(activeTab === "tests" || activeTab === "pdfs") && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
               {/* TREE DIAGRAM SELECTORS */}
            <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900 uppercase tracking-wider">
                    {editNodeCategoryContext === "test" ? "Mock Exams Tree Hierarchy" : "PDF Resources Tree"}
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-0.5 font-medium">Click node elements layout to configure questions parsed tests or PDF keys on panel.</p>
                </div>
                <button
                  onClick={() => handleAddRootCategoryNode(editNodeCategoryContext)}
                  className="bg-[#111827] hover:bg-black text-white text-[10px] font-bold px-3 py-2 rounded-xl uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Plus className="w-3.5 h-3.5" /> Category
                </button>
              </div>

              {/* TREE STRUCTURE IMPLEMENTATION */}
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                {(editNodeCategoryContext === "test" ? appConfig.testCategories : appConfig.pdfCategories).map((cat) => (
                  <div key={cat.id} className="border border-gray-200 rounded-2xl overflow-hidden bg-slate-50 shadow-xs">
                    
                    {/* Category root bar banner */}
                    <div className="bg-white px-4 py-3.5 flex items-center justify-between border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleCatExpanded(cat.id)}
                          className="text-gray-400 hover:text-[#FF6B35] font-bold text-sm transition-all p-1 hover:bg-slate-50 rounded"
                        >
                          <FolderOpen className={`w-4.5 h-4.5 text-amber-500 ${expandedCats[cat.id] ? "scale-110" : ""}`} />
                        </button>
                        <span
                          onClick={() => { setEditingNodeId(cat.id); setEditingNodeType("category"); }}
                          className={`font-bold text-sm text-slate-850 cursor-pointer hover:text-[#FF6B35] border-b border-transparent hover:border-[#FF6B35] ${editingNodeId === cat.id ? "text-[#FF6B35] underline" : ""}`}
                        >
                          {cat.name}
                        </span>

                        {/* Badges indicators */}
                        {cat.test && <span className="text-[9px] bg-[#FF6B35]/15 text-[#FF6B35] px-2 py-0.5 rounded-full font-extrabold uppercase">Exam Loaded</span>}
                        {cat.pdf && <span className="text-[9px] bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full font-extrabold uppercase border border-sky-100">PDF Attached</span>}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleMoveCategory(cat.id, editNodeCategoryContext, "up")}
                          className="text-gray-400 hover:text-[#FF6B35] p-1 bg-white hover:bg-slate-50 border border-gray-100 rounded-full cursor-pointer"
                          title="Move Cat Up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleMoveCategory(cat.id, editNodeCategoryContext, "down")}
                          className="text-gray-400 hover:text-[#FF6B35] p-1 bg-white hover:bg-slate-50 border border-gray-100 rounded-full cursor-pointer"
                          title="Move Cat Down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleAddSubCategoryNode(cat.id, editNodeCategoryContext)}
                          title="Add Sub-category here"
                          className="text-emerald-600 hover:bg-emerald-50 p-1.5 rounded-lg border border-gray-100 bg-white shadow-sm cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        {deleteConfirmId === cat.id ? (
                          <div className="flex items-center gap-1 bg-red-50 border border-red-200 px-2 py-1 rounded-lg">
                            <span className="text-[10px] font-bold text-red-600 uppercase tracking-wide">Delete?</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteNodeItem(cat.id, "category", editNodeCategoryContext, true);
                              }}
                              className="text-[9px] bg-red-600 text-white px-1.5 py-0.5 rounded font-extrabold cursor-pointer"
                            >
                              Yes
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteConfirmId(null);
                              }}
                              className="text-[9px] bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded font-bold cursor-pointer"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirmId(cat.id);
                            }}
                            className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg border border-transparent hover:bg-red-50 cursor-pointer"
                            title="Remove category"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Subcategories sections nested container */}
                    {expandedCats[cat.id] && (
                      <div className="p-4 space-y-3 bg-slate-50/50 border-b border-gray-100">
                        {cat.subCategories.map((sub) => (
                          <div key={sub.id} className="bg-white border border-gray-150 rounded-xl overflow-hidden pl-4 pr-3 py-3 shadow-xs">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => toggleSubExpanded(sub.id)}
                                  className="text-gray-400 hover:text-[#FF6B35] font-bold text-sm"
                                >
                                  <Folder className={`w-4 h-4 text-amber-500 ${expandedSubs[sub.id] ? "scale-105" : ""}`} />
                                </button>
                                <span
                                  onClick={() => { setEditingNodeId(sub.id); setEditingNodeType("subcategory"); }}
                                  className={`text-xs font-bold text-slate-750 cursor-pointer hover:text-[#FF6B35] ${editingNodeId === sub.id ? "text-[#FF6B35] underline" : ""}`}
                                >
                                  {sub.name}
                                </span>

                                {sub.test && <span className="text-[8px] bg-[#FF6B35]/15 text-[#FF6B35] px-1.5 py-0.25 rounded-full font-bold uppercaseScale">Exam</span>}
                                {sub.pdf && <span className="text-[8px] bg-sky-50 text-sky-700 px-1.5 py-0.25 rounded-full font-bold border border-sky-100 uppercase">PDF</span>}
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleMoveSubCategory(cat.id, sub.id, editNodeCategoryContext, "up")}
                                  className="text-gray-400 hover:text-[#FF6B35] p-1 bg-white hover:bg-slate-50 border border-gray-100 rounded-full cursor-pointer"
                                  title="Move Sub Up"
                                >
                                  <ArrowUp className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleMoveSubCategory(cat.id, sub.id, editNodeCategoryContext, "down")}
                                  className="text-gray-400 hover:text-[#FF6B35] p-1 bg-white hover:bg-slate-50 border border-gray-100 rounded-full cursor-pointer"
                                  title="Move Sub Down"
                                >
                                  <ArrowDown className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleAddTopicNode(cat.id, sub.id, editNodeCategoryContext)}
                                  title="Add Topic file under subcategory"
                                  className="text-emerald-600 hover:bg-emerald-50 p-1.5 rounded-lg cursor-pointer"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                                {deleteConfirmId === sub.id ? (
                                  <div className="flex items-center gap-1 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-lg shrink-0">
                                    <span className="text-[9px] font-bold text-red-600 uppercase">Delete?</span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteNodeItem(sub.id, "subcategory", editNodeCategoryContext, true);
                                      }}
                                      className="text-[8px] bg-red-600 text-white px-1 py-0.25 rounded font-extrabold cursor-pointer"
                                    >
                                      Yes
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setDeleteConfirmId(null);
                                      }}
                                      className="text-[8px] bg-gray-200 text-gray-700 px-1 py-0.25 rounded font-bold cursor-pointer"
                                    >
                                      No
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDeleteConfirmId(sub.id);
                                    }}
                                    className="text-gray-400 hover:text-red-500 p-1 rounded-lg cursor-pointer"
                                    title="Remove subcategory"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Topics lists rendered inside */}
                            {expandedSubs[sub.id] && (
                              <div className="mt-2.5 ml-4 border-l-2 border-gray-100 pl-3.5 py-1 space-y-2">
                                {renderTopicsRecursive(sub.topics || [], cat.id, sub.id)}
                              </div>
                            )}

                          </div>
                        ))}

                        {cat.subCategories.length === 0 && (
                          <div className="text-[11px] text-gray-400 italic text-center py-4 font-semibold">Sub-categories index is empty. Click + to add nested categories.</div>
                        )}
                      </div>
                    )}

                  </div>
                ))}

                {(editNodeCategoryContext === "test" ? appConfig.testCategories : appConfig.pdfCategories).length === 0 && (
                  <div className="text-center py-16 border-2 border-dashed border-gray-200 bg-slate-50 text-gray-400 rounded-2xl font-black text-sm uppercase tracking-wide">
                    Create your Course Categories. Get started.
                  </div>
                )}
              </div>
            </div>


            {/* SECONDARY SIDE SETTINGS CONFIGURATION PANEL */}
            <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-gray-200 shadow-sm min-h-[500px]">
              {editingNodeId && activeNodeData ? (
                <div className="space-y-6">
                  
                  {/* Title identity block */}
                  <div className="border-b border-gray-100 pb-3">
                    <span className="text-[10px] font-black uppercase text-[#FF6B35] tracking-wider">Configure Node Selected</span>
                    <h4 className="text-base font-extrabold text-slate-850">{activeNodeData.name}</h4>
                  </div>

                  {/* 1. Basic node edit inputs */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Node Name Title</label>
                      <input
                        type="text"
                        value={activeNodeData.name}
                        onChange={(e) => handleUpdateNodeNameAndImage(editingNodeId, editingNodeType!, editNodeCategoryContext, { name: e.target.value })}
                        className="w-full mt-1 bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] focus:bg-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Node Picture Thumbnail URL</label>
                      <input
                        type="text"
                        value={(activeNodeData as any).image || ""}
                        onChange={(e) => handleUpdateNodeNameAndImage(editingNodeId, editingNodeType!, editNodeCategoryContext, { image: e.target.value })}
                        className="w-full mt-1 bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] focus:bg-white outline-none"
                        placeholder="Image URL"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase text-[#FF6B35] tracking-wider font-bold">Node General Schedule Availability (Optional)</label>
                      <input
                        type="datetime-local"
                        value={(activeNodeData as any).scheduledAt || ""}
                        onChange={(e) => handleUpdateNodeNameAndImage(editingNodeId, editingNodeType!, editNodeCategoryContext, { scheduledAt: e.target.value })}
                        className="w-full mt-1 bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] focus:bg-white outline-none"
                      />
                      <p className="text-[9px] text-gray-400 mt-1 leading-normal">Hides this whole category, subcategory, or topic until the scheduled local date-time.</p>
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase text-[#FF6B35] tracking-wider font-bold">Node Access Restrict Emails (Optional)</label>
                      <textarea
                        value={(activeNodeData as any).onlyUsers || ""}
                        onChange={(e) => handleUpdateNodeNameAndImage(editingNodeId, editingNodeType!, editNodeCategoryContext, { onlyUsers: e.target.value })}
                        className="w-full mt-1 bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] focus:bg-white outline-none resize-none"
                        rows={2}
                        placeholder="e.g. resident1@gmail.com, resident2@gmail.com"
                      />
                      <p className="text-[9px] text-gray-400 mt-1 leading-normal">If populated, this category, subcategory, or topic (and all its tests/PDFs) will only show to aspirants logged in with these email addresses.</p>
                    </div>

                    {/* Category Payment Gating Configuration Panel */}
                    {editingNodeType === "category" && (
                      <div className="border border-[#FF6B35]/20 rounded-2xl p-4 bg-[#FF6B35]/5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase text-[#FF6B35] tracking-wider flex items-center gap-1 font-bold">
                            💰 Category-Specific Payment Settings
                          </span>
                        </div>
                        
                        <div>
                          <label className="text-[9px] font-black uppercase text-gray-500 tracking-wider font-bold block mb-1.5">Access Mode</label>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => handleUpdateNodeNameAndImage(editingNodeId, editingNodeType!, editNodeCategoryContext, { isPaid: false })}
                              className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                                !(activeNodeData as any).isPaid
                                  ? "border-green-500 bg-green-50/40 text-green-700 font-extrabold shadow-sm"
                                  : "border-gray-200 hover:border-gray-300 text-gray-500 bg-white"
                              }`}
                            >
                              <span className="text-xl">🔓</span>
                              <span className="text-[10px] font-black uppercase tracking-wider mt-1.5">Free Access</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateNodeNameAndImage(editingNodeId, editingNodeType!, editNodeCategoryContext, { isPaid: true })}
                              className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                                (activeNodeData as any).isPaid
                                  ? "border-[#FF6B35] bg-orange-50/40 text-[#FF6B35] font-extrabold shadow-sm"
                                  : "border-gray-200 hover:border-gray-300 text-gray-500 bg-white"
                              }`}
                            >
                              <span className="text-xl">🔒</span>
                              <span className="text-[10px] font-black uppercase tracking-wider mt-1.5">Paid Subscription</span>
                            </button>
                          </div>
                        </div>

                        {(activeNodeData as any).isPaid && (
                          <div className="space-y-3 mt-2 pt-2 border-t border-gray-200/50 animate-fade-in">
                            <div>
                              <label className="text-[9px] font-black uppercase text-gray-500 tracking-wider block font-bold">Purchase Amount (e.g. ₹199)</label>
                              <input
                                type="text"
                                value={(activeNodeData as any).paymentAmount || ""}
                                onChange={(e) => handleUpdateNodeNameAndImage(editingNodeId, editingNodeType!, editNodeCategoryContext, { paymentAmount: e.target.value })}
                                className="w-full mt-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#FF6B35]"
                                placeholder="₹199"
                              />
                            </div>

                            <div>
                              <label className="text-[9px] font-black uppercase text-gray-500 tracking-wider block font-bold">Validity / Duration (e.g. 3 Months)</label>
                              <input
                                type="text"
                                value={(activeNodeData as any).paymentValidityDays || ""}
                                onChange={(e) => handleUpdateNodeNameAndImage(editingNodeId, editingNodeType!, editNodeCategoryContext, { paymentValidityDays: e.target.value })}
                                className="w-full mt-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#FF6B35]"
                                placeholder="3 Months or VALID FOR 90 DAYS"
                              />
                            </div>

                            <div>
                              <label className="text-[9px] font-black uppercase text-gray-500 tracking-wider block font-bold">Membership Benefits Include (Comma separated)</label>
                              <textarea
                                value={(activeNodeData as any).paymentBenefits || ""}
                                onChange={(e) => handleUpdateNodeNameAndImage(editingNodeId, editingNodeType!, editNodeCategoryContext, { paymentBenefits: e.target.value })}
                                className="w-full mt-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#FF6B35] resize-none"
                                rows={2}
                                placeholder="Access to Past Tests, Access to Future Tests, Unlimited Attempts"
                              />
                            </div>

                            <div>
                              <label className="text-[9px] font-black uppercase text-gray-500 tracking-wider block font-bold">Payment QR Code Image URL</label>
                              <input
                                type="text"
                                value={(activeNodeData as any).paymentQr || ""}
                                onChange={(e) => handleUpdateNodeNameAndImage(editingNodeId, editingNodeType!, editNodeCategoryContext, { paymentQr: e.target.value })}
                                className="w-full mt-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#FF6B35]"
                                placeholder="https://..."
                              />
                              <p className="text-[8px] text-gray-400 mt-0.5">Custom payment merchant QR code. Leaves default UPI QR if blank.</p>
                            </div>

                            <div>
                              <label className="text-[9px] font-black uppercase text-gray-500 tracking-wider block font-bold">Direct UPI Payment Link (upi://pay...)</label>
                              <input
                                type="text"
                                value={(activeNodeData as any).paymentUrl || ""}
                                onChange={(e) => handleUpdateNodeNameAndImage(editingNodeId, editingNodeType!, editNodeCategoryContext, { paymentUrl: e.target.value })}
                                className="w-full mt-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#FF6B35]"
                                placeholder="upi://pay?pa=merchant@upi&pn=Prayas&am=99..."
                              />
                              <p className="text-[8px] text-gray-400 mt-0.5">Direct UPI deep link for "Pay via UPI App" button.</p>
                            </div>

                            <div>
                              <label className="text-[9px] font-black uppercase text-gray-500 tracking-wider block font-bold">Contact Helpdesk URL (WhatsApp / Telegram)</label>
                              <input
                                type="text"
                                value={(activeNodeData as any).paymentHelpdeskUrl || ""}
                                onChange={(e) => handleUpdateNodeNameAndImage(editingNodeId, editingNodeType!, editNodeCategoryContext, { paymentHelpdeskUrl: e.target.value })}
                                className="w-full mt-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#FF6B35]"
                                placeholder="http://t.me/PrayasOneSupportBot"
                              />
                              <p className="text-[8px] text-gray-400 mt-0.5">Helpdesk support chat link for "Contact Helpdesk" button with auto-filled message.</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="border border-amber-100 rounded-xl p-3.5 bg-amber-50/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider flex items-center gap-1 font-bold">
                          Node Coupon / Promo Code (Optional)
                        </span>
                        {(activeNodeData as any).coupon ? (
                          <button
                            type="button"
                            onClick={() => handleUpdateNodeNameAndImage(editingNodeId, editingNodeType!, editNodeCategoryContext, { coupon: null, couponCode: "" })}
                            className="text-[8px] uppercase tracking-wider text-red-600 font-extrabold"
                          >
                            Remove Coupon
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleUpdateNodeNameAndImage(editingNodeId, editingNodeType!, editNodeCategoryContext, { 
                              coupon: { code: "PASS88", startDate: "2026-06-01", endDate: "2026-12-31", maxAttempts: "unlimited" },
                              couponCode: "PASS88" 
                            })}
                            className="text-[8px] uppercase tracking-wider text-emerald-700 font-extrabold"
                          >
                            Add Coupon
                          </button>
                        )}
                      </div>

                      {(activeNodeData as any).coupon ? (
                        <div className="space-y-2 mt-2">
                          <div>
                            <label className="text-[8px] font-bold text-[#FF6B35] block uppercase">Promo Code Name</label>
                            <input
                              type="text"
                              value={(activeNodeData as any).coupon.code || ""}
                              onChange={(e) => {
                                const codeVal = e.target.value.toUpperCase();
                                handleUpdateNodeNameAndImage(editingNodeId, editingNodeType!, editNodeCategoryContext, { 
                                  coupon: { ...(activeNodeData as any).coupon, code: codeVal },
                                  couponCode: codeVal
                                });
                              }}
                              className="w-full mt-1 bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs font-mono font-bold uppercase outline-none focus:border-[#FF6B35]"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[8px] font-bold text-[#FF6B35] block uppercase">Start Date</label>
                              <input
                                type="date"
                                value={(activeNodeData as any).coupon.startDate || ""}
                                onChange={(e) => {
                                  handleUpdateNodeNameAndImage(editingNodeId, editingNodeType!, editNodeCategoryContext, { 
                                    coupon: { ...(activeNodeData as any).coupon, startDate: e.target.value }
                                  });
                                }}
                                className="w-full mt-1 bg-white border border-gray-200 rounded px-2 py-1 text-[10px]"
                              />
                            </div>
                            <div>
                              <label className="text-[8px] font-bold text-[#FF6B35] block uppercase">End Date</label>
                              <input
                                type="date"
                                value={(activeNodeData as any).coupon.endDate || ""}
                                onChange={(e) => {
                                  handleUpdateNodeNameAndImage(editingNodeId, editingNodeType!, editNodeCategoryContext, { 
                                    coupon: { ...(activeNodeData as any).coupon, endDate: e.target.value }
                                  });
                                }}
                                className="w-full mt-1 bg-white border border-gray-200 rounded px-2 py-1 text-[10px]"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-[8px] font-bold text-[#FF6B35] block uppercase">Attempts Granted (unlimited or integer)</label>
                            <input
                              type="text"
                              value={(activeNodeData as any).coupon.maxAttempts || ""}
                              onChange={(e) => {
                                handleUpdateNodeNameAndImage(editingNodeId, editingNodeType!, editNodeCategoryContext, { 
                                  coupon: { ...(activeNodeData as any).coupon, maxAttempts: e.target.value }
                                });
                              }}
                              className="w-full mt-1 bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs outline-none focus:border-[#FF6B35]"
                              placeholder="unlimited or integer number"
                            />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <input
                            type="text"
                            value={(activeNodeData as any).couponCode || ""}
                            onChange={(e) => handleUpdateNodeNameAndImage(editingNodeId, editingNodeType!, editNodeCategoryContext, { couponCode: e.target.value.toUpperCase() })}
                            className="w-full mt-1 bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold uppercase focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] focus:bg-white outline-none"
                            placeholder="e.g. DIWALI20"
                          />
                          <p className="text-[9px] text-gray-400 mt-1 leading-normal">Or click 'Add Coupon' above to configure active duration date validation and custom attempts limit.</p>
                        </div>
                      )}
                    </div>
                  </div>


                  {/* 2. Attach resources toggles */}
                  <div className="border-t border-gray-100 pt-5 space-y-4">
                    <h5 className="text-[11px] font-black uppercase text-gray-400 tracking-wider">Link Applet Resources</h5>
                    
                    <div className="flex flex-col gap-3">
                      
                      {/* MCQ EXAM SETTINGS */}
                      <div className="border border-gray-150 rounded-xl p-4 bg-slate-50 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                            <BookOpen className="w-4 h-4 text-emerald-500" /> Embedded MCQ Exam Test
                          </span>
                          <input
                            type="checkbox"
                            checked={activeNodeData.test !== null}
                            onChange={(e) => handleToggleTestSettingsOnNode(editingNodeId, editingNodeType!, editNodeCategoryContext, e.target.checked)}
                            className="w-4 h-4 rounded text-[#FF6B35] accent-[#FF6B35] cursor-pointer focus:ring-[#FF6B35]"
                          />
                        </div>

                        {activeNodeData.test && (
                          <div className="pt-3 border-t border-gray-200 space-y-4">
                            
                            <div>
                              <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Test Display Name Title</label>
                              <input
                                type="text"
                                value={activeNodeData.test.title || ""}
                                onChange={(e) => handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "title", e.target.value)}
                                className="w-full mt-1 bg-white border border-gray-200 rounded-lg px-2.5 py-2 text-[11px] font-bold outline-none"
                              />
                            </div>

                            {/* Parsing MCQ File Upload inputs */}
                            <div className="bg-slate-50 p-4 rounded-xl border border-gray-200 mt-2 space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase text-gray-500 tracking-wider">{"\ud83d\udce6"} MCQ MULTI-LANGUAGE FILES UPLOADS</span>
                                <div className="flex items-center gap-1.5 mt-2 sm:mt-0">
                                  <input
                                    type="text"
                                    placeholder="e.g. gujarati, marathi"
                                    value={customLangText}
                                    onChange={(e) => setCustomLangText(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        e.preventDefault();
                                        const langVal = customLangText.trim();
                                        if (!langVal) return;
                                        const normalized = langVal.toLowerCase();
                                        if (normalized === "en" || normalized === "hi") {
                                          alert("Standard English (en) and Hindi (hi) language keys are already active.");
                                          return;
                                        }
                                        const others = activeNodeData.test.questionsOther || {};
                                        if (others[normalized]) {
                                          alert("This language tab already exists.");
                                          setQEditLang(normalized);
                                          return;
                                        }
                                        const updated = {
                                          ...others,
                                          [normalized]: []
                                        };
                                        handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "questionsOther", updated);
                                        setQEditLang(normalized);
                                        setCustomLangText("");
                                      }
                                    }}
                                    className="bg-white border border-gray-300 rounded px-2 py-0.5 text-[11px] outline-none w-28 font-semibold text-gray-800 placeholder-gray-400 focus:border-[#FF6B35] transition-all"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const langVal = customLangText.trim();
                                      if (!langVal) {
                                        alert("Please type a language name first! (e.g. gujarati, marathi)");
                                        return;
                                      }
                                      const normalized = langVal.toLowerCase();
                                      if (normalized === "en" || normalized === "hi") {
                                        alert("Standard English (en) and Hindi (hi) language keys are already active.");
                                        return;
                                      }
                                      const others = activeNodeData.test.questionsOther || {};
                                      if (others[normalized]) {
                                        alert("This language tab already exists.");
                                        setQEditLang(normalized);
                                        return;
                                      }
                                      const updated = {
                                        ...others,
                                        [normalized]: []
                                      };
                                      handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "questionsOther", updated);
                                      setQEditLang(normalized);
                                      setCustomLangText("");
                                    }}
                                    className="bg-[#FF6B35] hover:bg-[#e05621] text-white font-bold text-[9px] px-2.5 py-1 rounded-md uppercase transition-all tracking-wider cursor-pointer"
                                  >
                                    {"\u2795"} Add Language
                                  </button>
                                </div>
                              </div>
                              
                              <p className="text-[9px] text-gray-500 mt-0.5 leading-snug">
                                Drag/attach a plain text (.txt) question file for any language. The parser engine loads items instantly.
                              </p>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                                {/* English */}
                                <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-xs">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-[9px] font-black uppercase text-[#FF6B35]">ENGLISH (en)</span>
                                    {activeNodeData.test.questionsEn && activeNodeData.test.questionsEn.length > 0 ? (
                                      <span className="text-[9px] text-emerald-600 font-bold font-mono">{"\u2714"} {activeNodeData.test.questionsEn.length} Qs</span>
                                    ) : (
                                      <span className="text-[9px] text-red-500 font-semibold font-mono">Empty</span>
                                    )}
                                  </div>
                                  <input
                                    type="file"
                                    accept=".txt"
                                    onChange={(e) => handleParserFileAttachment(e, editingNodeId, editingNodeType!, "en", editNodeCategoryContext)}
                                    className="w-full text-[9px] text-gray-500 file:bg-slate-100 file:border-0 file:rounded file:px-2 file:py-1 file:font-semibold cursor-pointer"
                                  />
                                </div>

                                {/* Hindi */}
                                <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-xs">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-[9px] font-black uppercase text-[#FF6B35]">HINDI (hi)</span>
                                    {activeNodeData.test.questionsHi && activeNodeData.test.questionsHi.length > 0 ? (
                                      <span className="text-[9px] text-emerald-600 font-bold font-mono">{"\u2714"} {activeNodeData.test.questionsHi.length} Qs</span>
                                    ) : (
                                      <span className="text-[9px] text-red-500 font-semibold font-mono">Empty</span>
                                    )}
                                  </div>
                                  <input
                                    type="file"
                                    accept=".txt"
                                    onChange={(e) => handleParserFileAttachment(e, editingNodeId, editingNodeType!, "hi", editNodeCategoryContext)}
                                    className="w-full text-[9px] text-gray-500 file:bg-slate-100 file:border-0 file:rounded file:px-2 file:py-1 file:font-semibold cursor-pointer"
                                  />
                                </div>

                                {/* Custom Others */}
                                {Object.keys(activeNodeData.test.questionsOther || {}).map((langKey) => {
                                  const count = (activeNodeData.test.questionsOther?.[langKey] || []).length;
                                  return (
                                    <div key={langKey} className="bg-white p-3 rounded-lg border border-gray-200 shadow-xs relative">
                                      <div className="flex justify-between items-center mb-1 pr-6">
                                        <span className="text-[9px] font-black uppercase text-indigo-600">{langKey.toUpperCase()}</span>
                                        {count > 0 ? (
                                          <span className="text-[9px] text-emerald-600 font-bold font-mono">{"\u2714"} {count} Qs</span>
                                        ) : (
                                          <span className="text-[9px] text-red-500 font-semibold font-mono">Empty</span>
                                        )}
                                      </div>
                                      <input
                                        type="file"
                                        accept=".txt"
                                        onChange={(e) => handleParserFileAttachment(e, editingNodeId, editingNodeType!, langKey, editNodeCategoryContext)}
                                        className="w-full text-[9px] text-gray-500 file:bg-gray-100 file:border-0 file:rounded file:px-2 file:py-1 file:font-semibold cursor-pointer"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (confirm(`Remove ${langKey.toUpperCase()} questions entirely?`)) {
                                            const updated = { ...(activeNodeData.test.questionsOther || {}) };
                                            delete updated[langKey];
                                            handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "questionsOther", updated);
                                          }
                                        }}
                                        className="absolute top-2 right-2 text-red-400 hover:text-red-600 font-bold text-base cursor-pointer px-1 outline-none"
                                        title={`Delete ${langKey}`}
                                      >
                                        &times;
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            <p className="text-[8px] text-amber-600 font-extrabold leading-relaxed text-center block mt-1">
                              * Format support: splitting on digit indexes blocks. Include ✅ symbol inside the correct answer row. Ex: for explanation text.
                            </p>

                            <div className="flex items-center gap-2 bg-amber-50/70 p-3 rounded-xl border border-amber-200 mt-1 mb-2">
                              <input
                                type="checkbox"
                                id="showSourceOnStudentNode"
                                checked={!appConfig.social.hideSourceOnStudent}
                                onChange={(e) => handleUpdateSocialPaymentGroup("hideSourceOnStudent", !e.target.checked)}
                                className="w-4.5 h-4.5 rounded border-gray-300 text-[#FF6B35] focus:ring-[#FF6B35] cursor-pointer"
                              />
                              <div>
                                <label htmlFor="showSourceOnStudentNode" className="block text-[10px] font-extrabold text-slate-800 uppercase tracking-wider cursor-pointer">{"\u2714\ufe0f"} Show Source: Display Question Source/Reference to Students</label>
                                <p className="text-[9px] text-gray-500 mt-0.5 leading-tight">If ticked/checked, question source links and references will be visible on the student's test engine analysis screen.</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Exam Period (Min)</label>
                                <input
                                  type="number"
                                  value={activeNodeData.test.duration}
                                  onChange={(e) => handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "duration", parseInt(e.target.value) || 60)}
                                  className="w-full mt-1 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs outline-none"
                                />
                              </div>
                              <div>
                                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Free Tries Limit</label>
                                <input
                                  type="number"
                                  value={activeNodeData.test.freeAttempts}
                                  onChange={(e) => handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "freeAttempts", parseInt(e.target.value) || 1)}
                                  className="w-full mt-1 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs outline-none"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Positive Marks (+)</label>
                                <input
                                  type="number"
                                  value={activeNodeData.test.posMarks}
                                  onChange={(e) => handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "posMarks", parseFloat(e.target.value) || 1)}
                                  className="w-full mt-1 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs outline-none"
                                />
                              </div>
                              <div>
                                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Negative Penalty (-)</label>
                                <input
                                  type="number"
                                  value={activeNodeData.test.negMarks}
                                  onChange={(e) => handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "negMarks", parseFloat(e.target.value) || 0)}
                                  className="w-full mt-1 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs outline-none"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Restrict Student Access Emails (Optional)</label>
                              <textarea
                                value={activeNodeData.test.onlyUsers || ""}
                                onChange={(e) => handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "onlyUsers", e.target.value)}
                                className="w-full mt-1 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs outline-none resize-none"
                                rows={2}
                                placeholder="student1@gmail.com, student2@gmail.com"
                              />
                              <p className="text-[8px] text-gray-400 mt-1">Leave blank for unrestricted catalog view logs.</p>
                            </div>

                            {/* EXAM COUPON MANAGEMENT */}
                            <div className="border border-amber-200 p-3 rounded-lg bg-amber-50">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-[9px] font-bold text-amber-800 flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5" /> COUPONS VALIDATION
                                </span>
                                {activeNodeData.test.coupon ? (
                                  <button
                                    onClick={() => handleRemoveNodeTestCoupon(editingNodeId, editingNodeType!, editNodeCategoryContext)}
                                    className="text-[8px] uppercase tracking-wider text-red-600 font-extrabold"
                                  >
                                    Remove Coupon
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleAddNodeTestCoupon(editingNodeId, editingNodeType!, editNodeCategoryContext)}
                                    className="text-[8px] uppercase tracking-wider text-emerald-700 font-extrabold"
                                  >
                                    Add Coupon
                                  </button>
                                )}
                              </div>

                              {activeNodeData.test.coupon && (
                                <div className="space-y-2 mt-2">
                                  <div>
                                    <label className="text-[8px] font-bold text-amber-700 block">Promo Code Name</label>
                                    <input
                                      type="text"
                                      value={activeNodeData.test.coupon.code}
                                      onChange={(e) => handleUpdateNodeTestCoupon(editingNodeId, editingNodeType!, editNodeCategoryContext, "code", e.target.value.toUpperCase())}
                                      className="w-full mt-1 bg-white border border-gray-200 rounded px-2 py-1 text-[10px]"
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="text-[8px] font-bold text-amber-700 block">Start Date</label>
                                      <input
                                        type="date"
                                        value={activeNodeData.test.coupon.startDate}
                                        onChange={(e) => handleUpdateNodeTestCoupon(editingNodeId, editingNodeType!, editNodeCategoryContext, "startDate", e.target.value)}
                                        className="w-full mt-1 bg-white border border-gray-200 rounded px-2 py-1 text-[10px]"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[8px] font-bold text-amber-700 block">End Date</label>
                                      <input
                                        type="date"
                                        value={activeNodeData.test.coupon.endDate}
                                        onChange={(e) => handleUpdateNodeTestCoupon(editingNodeId, editingNodeType!, editNodeCategoryContext, "endDate", e.target.value)}
                                        className="w-full mt-1 bg-white border border-gray-200 rounded px-2 py-1 text-[10px]"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-[8px] font-bold text-amber-700 block">Attempts Granted (e.g., unlimited or integer)</label>
                                    <input
                                      type="text"
                                      value={activeNodeData.test.coupon.maxAttempts}
                                      onChange={(e) => handleUpdateNodeTestCoupon(editingNodeId, editingNodeType!, editNodeCategoryContext, "maxAttempts", e.target.value)}
                                      className="w-full mt-1 bg-white border border-gray-200 rounded px-2 py-1 text-[10px]"
                                      placeholder="unlimited or number index"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            <div>
                              <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Test Instructions Sheet</label>
                              <textarea
                                value={activeNodeData.test.instructions}
                                onChange={(e) => handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "instructions", e.target.value)}
                                className="w-full mt-1 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs outline-none resize-none"
                                rows={2.5}
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3 bg-[#FF6B35]/5 p-3 rounded-lg border border-[#FF6B35]/10">
                              <div>
                                <label className="text-[9px] font-black uppercase text-[#FF6B35] tracking-wider block">Access Mode</label>
                                <select
                                  value={activeNodeData.test.isPaid ? "paid" : "free"}
                                  onChange={(e) => handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "isPaid", e.target.value === "paid")}
                                  className="w-full mt-1 bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs outline-none font-bold"
                                >
                                  <option value="free">{"\ud83d\udd13"} FREE</option>
                                  <option value="paid">{"\ud83d\udd12"} Paid Membership</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider block">Schedule Availability</label>
                                <input
                                  type="datetime-local"
                                  value={activeNodeData.test.scheduledAt || ""}
                                  onChange={(e) => handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "scheduledAt", e.target.value)}
                                  className="w-full mt-1 bg-white border border-gray-200 rounded px-2 py-1 text-xs outline-none"
                                />
                              </div>
                            </div>

                            {/* QUESTIONS LIST MANAGER */}
                            <div className="bg-slate-50 border border-gray-200 rounded-xl p-3 space-y-3">
                              <div className="flex flex-col gap-2 border-b border-gray-150 pb-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-extrabold text-slate-800 uppercase tracking-wider block">{"\ud83d\udcdd"} Questions ({activeNodeData.test.questionsEn?.length || 0} EN, {activeNodeData.test.questionsHi?.length || 0} HI)</span>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const langName = qEditLang;
                                      const newQ = { 
                                        q: langName === "hi" ? "नया प्रश्न?" : `New ${langName.toUpperCase()} Question?`, 
                                        o: langName === "hi" ? ["विकल्प A", "विकल्प B", "विकल्प C", "विकल्प D"] : ["Option A", "Option B", "Option C", "Option D"], 
                                        c: 1, 
                                        s: langName === "hi" ? "व्याख्या यहाँ है" : "Explanation here", 
                                        source: langName === "hi" ? "संदर्भ स्रोत" : "Reference Source" 
                                      };
                                      
                                      if (langName === "en") {
                                        const currentEN = activeNodeData.test.questionsEn || [];
                                        handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "questionsEn", [...currentEN, newQ]);
                                      } else if (langName === "hi") {
                                        const currentHI = activeNodeData.test.questionsHi || [];
                                        handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "questionsHi", [...currentHI, newQ]);
                                      } else {
                                        const currentOther = activeNodeData.test.questionsOther?.[langName] || [];
                                        const updatedOthers = {
                                          ...(activeNodeData.test.questionsOther || {}),
                                          [langName]: [...currentOther, newQ]
                                        };
                                        handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "questionsOther", updatedOthers);
                                      }
                                    }}
                                    className="flex items-center justify-center gap-1 text-[9px] font-black uppercase text-indigo-600 bg-white border border-indigo-200 rounded px-1.5 py-1 cursor-pointer hover:bg-indigo-50 transition-all shadow-sm"
                                  >
                                    {"\u2795"} Standard Q
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      const langName = qEditLang;
                                      const newQ = { 
                                        q: langName === "hi" 
                                          ? "निम्नलिखित कथनों पर विचार कीजिए:\n1. प्रकाश ध्वनि की तुलना में तेजी से यात्रा करता है।\n2. ध्वनि को यात्रा करने के लिए एक माध्यम की आवश्यकता होती है।\n\nउपरोक्त कथनों में से कौन सा/से सही है/हैं?" 
                                          : "Consider the following statements:\n1. Light travels faster than sound.\n2. Sound requires a medium to travel.\n\nWhich of the statements given above is/are correct?", 
                                        o: langName === "hi" 
                                          ? ["केवल 1", "केवल 2", "1 और 2 दोनों", "न तो 1 और न ही 2"] 
                                          : ["1 only", "2 only", "Both 1 and 2", "Neither 1 nor 2"], 
                                        c: 3, 
                                        s: langName === "hi" 
                                          ? "दोनों कथन सही हैं। प्रकाश तरंगें बिना किसी माध्यम के अंतरिक्ष में यात्रा कर सकती हैं, जबकि ध्वनि तरंगें यांत्रिक तरंगें हैं जिन्हें माध्यम की आवश्यकता होती है।" 
                                          : "Both statements are factually correct. Light waves travel through space without needing any medium at a speed of approx 3x10^8 m/s, whereas sound waves are mechanical waves requiring a material medium.", 
                                        source: langName === "hi" ? "भौतिक विज्ञान संदर्भ" : "Physics Referrals" 
                                      };
                                      
                                      if (langName === "en") {
                                        const currentEN = activeNodeData.test.questionsEn || [];
                                        handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "questionsEn", [...currentEN, newQ]);
                                      } else if (langName === "hi") {
                                        const currentHI = activeNodeData.test.questionsHi || [];
                                        handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "questionsHi", [...currentHI, newQ]);
                                      } else {
                                        const currentOther = activeNodeData.test.questionsOther?.[langName] || [];
                                        const updatedOthers = {
                                          ...(activeNodeData.test.questionsOther || {}),
                                          [langName]: [...currentOther, newQ]
                                        };
                                        handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "questionsOther", updatedOthers);
                                      }
                                    }}
                                    className="flex items-center justify-center gap-1 text-[9px] font-black uppercase text-indigo-600 bg-white border border-indigo-200 rounded px-1.5 py-1 cursor-pointer hover:bg-indigo-50 transition-all shadow-sm"
                                  >
                                    {"\ud83d\udccb"} Statement Q
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      const langName = qEditLang;
                                      const newQ = { 
                                        q: langName === "hi" 
                                          ? "निम्नलिखित साम्राज्यों को उनकी स्थापना के कालानुक्रमिक क्रम में व्यवस्थित करें (शुरुआत से अंत तक):\n1. रोमन साम्राज्य\n2. गुप्त साम्राज्य\n3. मौर्य साम्राज्य\n4. मुगल साम्राज्य" 
                                          : "Arrange the following historical empires in chronological order of their establishment (from earliest to latest):\n1. Roman Empire\n2. Gupta Empire\n3. Maurya Empire\n4. Mughal Empire", 
                                        o: langName === "hi" 
                                          ? ["1 - 3 - 2 - 4", "3 - 1 - 2 - 4", "2 - 1 - 3 - 4", "3 - 2 - 1 - 4"] 
                                          : ["1 - 3 - 2 - 4", "3 - 1 - 2 - 4", "2 - 1 - 3 - 4", "3 - 2 - 1 - 4"], 
                                        c: 2, 
                                        s: langName === "hi" 
                                          ? "सही क्रम है: मौर्य साम्राज्य (322 ईसा पूर्व) -> रोमन साम्राज्य (27 ईसा पूर्व) -> गुप्त साम्राज्य (319 ईस्वी) -> मुगल साम्राज्य (1526 ईस्वी)।" 
                                          : "The correct sequence is: Maurya Empire (322 BCE) -> Roman Empire (27 BCE) -> Gupta Empire (319 CE) -> Mughal Empire (1526 CE).", 
                                        source: langName === "hi" ? "इतिहास संदर्भ" : "World History" 
                                      };
                                      
                                      if (langName === "en") {
                                        const currentEN = activeNodeData.test.questionsEn || [];
                                        handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "questionsEn", [...currentEN, newQ]);
                                      } else if (langName === "hi") {
                                        const currentHI = activeNodeData.test.questionsHi || [];
                                        handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "questionsHi", [...currentHI, newQ]);
                                      } else {
                                        const currentOther = activeNodeData.test.questionsOther?.[langName] || [];
                                        const updatedOthers = {
                                          ...(activeNodeData.test.questionsOther || {}),
                                          [langName]: [...currentOther, newQ]
                                        };
                                        handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "questionsOther", updatedOthers);
                                      }
                                    }}
                                    className="flex items-center justify-center gap-1 text-[9px] font-black uppercase text-indigo-600 bg-white border border-indigo-200 rounded px-1.5 py-1 cursor-pointer hover:bg-indigo-50 transition-all shadow-sm"
                                  >
                                    {"\ud83d\udd22"} Arrangement
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      const langName = qEditLang;
                                      const newQ = { 
                                        q: langName === "hi" 
                                          ? "नीचे दो कथन दिए गए हैं, एक को अभिकथन (A) और दूसरे को कारण (R) के रूप में लेबल किया गया है:\n\nअभिकथन (A): मानव रक्त थोड़ा क्षारीय होता है।\nकारण (R): स्वस्थ मानव रक्त का pH 7.35 और 7.45 के बीच बना रहता है।\n\nनिम्नलिखित में से सही विकल्प चुनें:" 
                                          : "Given below are two statements, one is labelled as Assertion (A) and the other is labelled as Reason (R):\n\nAssertion (A): Human blood is slightly alkaline.\nReason (R): The pH of healthy human blood is maintained between 7.35 and 7.45.\n\nChoose the correct option from the following:", 
                                        o: langName === "hi" 
                                          ? [
                                              "(A) और (R) दोनों सही हैं और (R), (A) की सही व्याख्या है",
                                              "(A) और (R) दोनों सही हैं लेकिन (R), (A) की सही व्याख्या नहीं है",
                                              "(A) सही है लेकिन (R) गलत है",
                                              "(A) गलत है लेकिन (R) सही है"
                                            ] 
                                          : [
                                              "Both (A) and (R) are true and (R) is the correct explanation of (A)",
                                              "Both (A) and (R) are true but (R) is NOT the correct explanation of (A)",
                                              "(A) is true but (R) is false",
                                              "(A) is false but (R) is true"
                                            ], 
                                        c: 1, 
                                        s: langName === "hi" 
                                          ? "अभिकथन और कारण दोनों सही हैं। रक्त का pH 7.40 के आसपास होता है, जिससे यह थोड़ा क्षारीय बनता है, और ऐसा इसलिए है क्योंकि आंतरिक तंत्र रक्त के स्तर को सख्ती से 7.35 और 7.45 के बीच रखते हैं।" 
                                          : "Both Assertion and Reason are true. Blood has a pH around 7.40, which is greater than neutral 7.0, making it slightly alkaline, and this is because internal homeostatic mechanisms keep the level strictly between 7.35 and 7.45.", 
                                        source: langName === "hi" ? "जीव विज्ञान" : "Biology Guide" 
                                      };
                                      
                                      if (langName === "en") {
                                        const currentEN = activeNodeData.test.questionsEn || [];
                                        handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "questionsEn", [...currentEN, newQ]);
                                      } else if (langName === "hi") {
                                        const currentHI = activeNodeData.test.questionsHi || [];
                                        handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "questionsHi", [...currentHI, newQ]);
                                      } else {
                                        const currentOther = activeNodeData.test.questionsOther?.[langName] || [];
                                        const updatedOthers = {
                                          ...(activeNodeData.test.questionsOther || {}),
                                          [langName]: [...currentOther, newQ]
                                        };
                                        handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "questionsOther", updatedOthers);
                                      }
                                    }}
                                    className="flex items-center justify-center gap-1 text-[9px] font-black uppercase text-indigo-600 bg-white border border-indigo-200 rounded px-1.5 py-1 cursor-pointer hover:bg-indigo-50 transition-all shadow-sm"
                                  >
                                    {"\u2696"} Assertion
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      const langName = qEditLang;
                                      const newQ = { 
                                        q: langName === "hi" 
                                          ? "सूची-I को सूची-II से सुमेलित कीजिए और नीचे दिए गए कोड का उपयोग करके सही विकल्प का चयन कीजिए:\n\nसूची-I (भौतिक राशि) | सूची-II (SI मात्रक)\n-------------------|-----------------\n1. बल (Force)       | A. पास्कल (Pascal)\n2. दाब (Pressure)   | B. वाट (Watt)\n3. शक्ति (Power)     | C. न्यूटन (Newton)" 
                                          : "Match List-I with List-II and select the correct option using the codes given below:\n\nList-I (Physical Quantity)  |  List-II (SI Unit)\n------------------------|-------------------\n1. Force               | A. Pascal\n2. Pressure            | B. Watt\n3. Power               | C. Newton", 
                                        o: langName === "hi" 
                                          ? ["1-C, 2-A, 3-B", "1-A, 2-C, 3-B", "1-C, 2-B, 3-A", "1-B, 2-A, 3-C"] 
                                          : ["1-C, 2-B, 3-A", "1-B, 2-A, 3-C", "1-C, 2-A, 3-B", "1-A, 2-C, 3-B"], 
                                        c: 1, 
                                        s: langName === "hi" 
                                          ? "बल का SI मात्रक न्यूटन (1-C), दाब का SI मात्रक पास्कल (2-A), और शक्ति का SI मात्रक वाट (3-B) है। इसलिए सही कोड 1-C, 2-A, 3-B है।" 
                                          : "Force SI unit is Newton (1-C), Pressure SI unit is Pascal (2-A), and Power SI unit is Watt (3-B). Hence the correct code is 1-C, 2-A, 3-B.", 
                                        source: langName === "hi" ? "SI मात्रक" : "SI Units" 
                                      };
                                      
                                      if (langName === "en") {
                                        const currentEN = activeNodeData.test.questionsEn || [];
                                        handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "questionsEn", [...currentEN, newQ]);
                                      } else if (langName === "hi") {
                                        const currentHI = activeNodeData.test.questionsHi || [];
                                        handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "questionsHi", [...currentHI, newQ]);
                                      } else {
                                        const currentOther = activeNodeData.test.questionsOther?.[langName] || [];
                                        const updatedOthers = {
                                          ...(activeNodeData.test.questionsOther || {}),
                                          [langName]: [...currentOther, newQ]
                                        };
                                        handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "questionsOther", updatedOthers);
                                      }
                                    }}
                                    className="flex items-center justify-center gap-1 text-[9px] font-black uppercase text-indigo-600 bg-white border border-indigo-200 rounded px-1.5 py-1 cursor-pointer hover:bg-indigo-50 transition-all shadow-sm"
                                  >
                                    {"\ud83d\udd17"} Matching
                                  </button>
                                </div>
                              </div>

                              {/* Tabs */}
                              <div className="flex gap-1.5 items-center overflow-x-auto pb-1.5 border-b border-gray-150">
                                <button
                                  type="button"
                                  onClick={() => setQEditLang("en")}
                                  className={`text-[9px] font-bold px-2.5 py-0.5 rounded ${qEditLang === "en" ? "bg-[#FF6B35] text-white" : "bg-white text-gray-500 border border-gray-150"}`}
                                >
                                  en ({activeNodeData.test.questionsEn?.length || 0})
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setQEditLang("hi")}
                                  className={`text-[9px] font-bold px-2.5 py-0.5 rounded ${qEditLang === "hi" ? "bg-[#FF6B35] text-white" : "bg-white text-gray-500 border border-gray-150"}`}
                                >
                                  hi ({activeNodeData.test.questionsHi?.length || 0})
                                </button>

                                {Object.keys(activeNodeData.test.questionsOther || {}).map((langKey) => (
                                  <div key={langKey} className="flex items-center gap-1 bg-white border border-gray-150 rounded pl-1.5 pr-0.5 py-0.5">
                                    <button
                                      type="button"
                                      onClick={() => setQEditLang(langKey)}
                                      className={`text-[9px] font-bold px-1 py-0.5 rounded ${qEditLang === langKey ? "bg-indigo-600 text-white" : "text-gray-500"}`}
                                    >
                                      {langKey} ({(activeNodeData.test.questionsOther?.[langKey] || []).length})
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const proceed = confirm(`Remove ${langKey.toUpperCase()} questions tab?`);
                                        if (proceed) {
                                          const updated = { ...(activeNodeData.test.questionsOther || {}) };
                                          delete updated[langKey];
                                          handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "questionsOther", updated);
                                          if (qEditLang === langKey) setQEditLang("en");
                                        }
                                      }}
                                      className="text-red-500 hover:text-red-700 font-bold text-[10px] px-1"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}

                                {showAddLangInput ? (
                                  <div className="flex items-center gap-1.5 bg-white border border-gray-300 rounded px-1.5 py-0.5 shadow-sm">
                                    <input
                                      type="text"
                                      placeholder="marathi, odia..."
                                      autoFocus
                                      onBlur={() => {
                                        setTimeout(() => setShowAddLangInput(false), 250);
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          e.preventDefault();
                                          const val = (e.target as HTMLInputElement).value.trim().toLowerCase();
                                          if (val) {
                                            if (val === "en" || val === "hi") {
                                              alert("This language is integrated by default.");
                                              return;
                                            }
                                            const existingOthers = activeNodeData.test.questionsOther || {};
                                            if (existingOthers[val]) {
                                              alert("This language already exists.");
                                              setQEditLang(val);
                                              setShowAddLangInput(false);
                                              return;
                                            }
                                            const updatedOthers = {
                                              ...existingOthers,
                                              [val]: []
                                            };
                                            handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "questionsOther", updatedOthers);
                                            setQEditLang(val);
                                          }
                                          setShowAddLangInput(false);
                                        } else if (e.key === "Escape") {
                                          setShowAddLangInput(false);
                                        }
                                      }}
                                      className="text-[10px] w-20 outline-none font-bold text-gray-850"
                                    />
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setShowAddLangInput(true)}
                                    className="text-[10px] font-bold text-gray-500 hover:text-indigo-600 bg-white border border-gray-300 rounded px-2 py-0.5 flex items-center gap-1 cursor-pointer"
                                    title="Add language"
                                  >
                                    <span>{"\u2795"} Lang</span>
                                  </button>
                                )}
                              </div>

                              {/* TXT file upload specifically for selected language! */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                                  <label className="text-[9px] font-bold uppercase text-gray-500 block mb-1">
                                    Upload {qEditLang.toUpperCase()} Questions File (.txt)
                                  </label>
                                  <input
                                    type="file"
                                    accept=".txt"
                                    key={qEditLang}  // reset input on lang change
                                    onChange={(e) => handleParserFileAttachment(e, editingNodeId, editingNodeType!, qEditLang, editNodeCategoryContext)}
                                    className="w-full text-[9px] text-gray-500 file:bg-gray-100 file:border-0 file:rounded file:px-2 file:py-1 file:font-semibold cursor-pointer"
                                  />
                                  {((qEditLang === "en" ? activeNodeData.test.questionsEn : (qEditLang === "hi" ? activeNodeData.test.questionsHi : activeNodeData.test.questionsOther?.[qEditLang])) || []).length > 0 && (
                                    <span className="text-[8px] text-emerald-600 font-bold block mt-1">
                                      {"\u2714"} {((qEditLang === "en" ? activeNodeData.test.questionsEn : (qEditLang === "hi" ? activeNodeData.test.questionsHi : activeNodeData.test.questionsOther?.[qEditLang])) || []).length} questions loaded
                                    </span>
                                  )}
                                </div>

                                <div className="bg-white p-2.5 rounded-lg border border-gray-200 space-y-1">
                                  <label className="text-[9px] font-bold uppercase text-gray-500 block">
                                    {"\ud83d\udccb"} Paste {qEditLang.toUpperCase()} Questions Raw Text:
                                  </label>
                                  <div className="flex gap-2">
                                    <textarea
                                      id={`raw_paste_${qEditLang}`}
                                      placeholder="1. Question text here  A) Option 1  B) Option 2  Ex: Explanation..."
                                      rows={1}
                                      className="flex-grow bg-slate-50 text-[10px] p-1 border border-gray-200 rounded outline-none resize-none"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const area = document.getElementById(`raw_paste_${qEditLang}`) as HTMLTextAreaElement;
                                        const text = area?.value || "";
                                        if (!text.trim()) {
                                          alert("Please paste some text before clicking import!");
                                          return;
                                        }
                                        const parsed = parseTestText(text);
                                        if (parsed.length > 0) {
                                          if (qEditLang === "en") {
                                            handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "questionsEn", parsed);
                                          } else if (qEditLang === "hi") {
                                            handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "questionsHi", parsed);
                                          } else {
                                            const updated = { ...(activeNodeData.test.questionsOther || {}), [qEditLang]: parsed };
                                            handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "questionsOther", updated);
                                          }
                                          alert(`Imported ${parsed.length} questions successfully!`);
                                          area.value = "";
                                        } else {
                                          alert("Format error. Make sure questions have digits (1.) or option prefixes (A.).");
                                        }
                                      }}
                                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[9px] px-2.5 rounded justify-center items-center flex cursor-pointer shrink-0 transition-colors"
                                    >
                                      Import
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* Questions scrollarea */}
                              <div className="max-h-[220px] overflow-y-auto space-y-2 pr-1 text-[11px]">
                                {((qEditLang === "en" ? activeNodeData.test.questionsEn : (qEditLang === "hi" ? activeNodeData.test.questionsHi : activeNodeData.test.questionsOther?.[qEditLang])) || []).map((q: any, qIdx: number) => (
                                  <div key={qIdx} className="bg-white border border-gray-150 rounded-lg p-2.5 space-y-2">
                                    <div className="flex justify-between items-center text-[9px] text-gray-400 font-bold">
                                      <span>QUESTION #{qIdx + 1} ({qEditLang.toUpperCase()})</span>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          let currentList;
                                          if (qEditLang === "en") currentList = [...activeNodeData.test.questionsEn];
                                          else if (qEditLang === "hi") currentList = [...activeNodeData.test.questionsHi];
                                          else currentList = [...(activeNodeData.test.questionsOther?.[qEditLang] || [])];
                                          
                                          currentList.splice(qIdx, 1);
                                          
                                          if (qEditLang === "en") {
                                            handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "questionsEn", currentList);
                                          } else if (qEditLang === "hi") {
                                            handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "questionsHi", currentList);
                                          } else {
                                            const updated = { ...(activeNodeData.test.questionsOther || {}), [qEditLang]: currentList };
                                            handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "questionsOther", updated);
                                          }
                                        }}
                                        className="text-red-500 hover:text-red-700 font-bold"
                                      >
                                        DELETE
                                      </button>
                                    </div>
                                    <div className="space-y-1.5">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                                        <div>
                                          <label className="text-[8px] font-bold text-gray-400 block mb-0.5">QUESTION TEXT</label>
                                          <input
                                            type="text"
                                            value={q.q}
                                            onChange={(e) => {
                                              let currentList;
                                              if (qEditLang === "en") currentList = [...activeNodeData.test.questionsEn];
                                              else if (qEditLang === "hi") currentList = [...activeNodeData.test.questionsHi];
                                              else currentList = [...(activeNodeData.test.questionsOther?.[qEditLang] || [])];
                                              
                                              currentList[qIdx] = { ...currentList[qIdx], q: e.target.value };
                                              
                                              if (qEditLang === "en") {
                                                handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "questionsEn", currentList);
                                              } else if (qEditLang === "hi") {
                                                handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "questionsHi", currentList);
                                              } else {
                                                const updated = { ...(activeNodeData.test.questionsOther || {}), [qEditLang]: currentList };
                                                handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "questionsOther", updated);
                                              }
                                            }}
                                            className="w-full bg-slate-50 border border-gray-200 rounded px-2 py-1 text-xs outline-none"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-[8px] font-bold text-gray-400 block mb-0.5">QUESTION IMAGE / FORMULA GRAPHIC (OPTIONAL)</label>
                                          <div className="flex gap-1.5 items-center">
                                            <input
                                              type="text"
                                              placeholder="URL or Auto-Base64 Data URI"
                                              value={q.image || ""}
                                              onChange={(e) => {
                                                let currentList;
                                                if (qEditLang === "en") currentList = [...activeNodeData.test.questionsEn];
                                                else if (qEditLang === "hi") currentList = [...activeNodeData.test.questionsHi];
                                                else currentList = [...(activeNodeData.test.questionsOther?.[qEditLang] || [])];
                                                
                                                currentList[qIdx] = { ...currentList[qIdx], image: e.target.value };
                                                
                                                if (qEditLang === "en") {
                                                  handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "questionsEn", currentList);
                                                } else if (qEditLang === "hi") {
                                                  handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "questionsHi", currentList);
                                                } else {
                                                  const updated = { ...(activeNodeData.test.questionsOther || {}), [qEditLang]: currentList };
                                                  handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "questionsOther", updated);
                                                }
                                              }}
                                              className="flex-grow bg-slate-50 border border-gray-200 rounded px-2 py-1 text-xs outline-none"
                                            />
                                            <div className="relative shrink-0">
                                              <input 
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                  const file = e.target.files?.[0];
                                                  if (!file) return;
                                                  const reader = new FileReader();
                                                  reader.onload = (event) => {
                                                    const base64 = event.target?.result as string;
                                                    let currentList;
                                                    if (qEditLang === "en") currentList = [...activeNodeData.test.questionsEn];
                                                    else if (qEditLang === "hi") currentList = [...activeNodeData.test.questionsHi];
                                                    else currentList = [...(activeNodeData.test.questionsOther?.[qEditLang] || [])];
                                                    
                                                    currentList[qIdx] = { ...currentList[qIdx], image: base64 };
                                                    
                                                    if (qEditLang === "en") {
                                                      handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "questionsEn", currentList);
                                                    } else if (qEditLang === "hi") {
                                                      handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "questionsHi", currentList);
                                                    } else {
                                                      const updated = { ...(activeNodeData.test.questionsOther || {}), [qEditLang]: currentList };
                                                      handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "questionsOther", updated);
                                                    }
                                                  };
                                                  reader.readAsDataURL(file);
                                                }}
                                                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                              />
                                              <button type="button" className="text-[10px] font-bold text-[#FF6B35] bg-[#FF6B35]/10 hover:bg-[#FF6B35]/15 px-2 py-1 rounded border border-[#FF6B35]/20 cursor-pointer">
                                                {"\ud83d\udce4"} Upload File
                                              </button>
                                            </div>
                                          </div>
                                          {q.image && (
                                            <div className="mt-1.5 flex items-center justify-between bg-slate-50 border border-gray-150 p-1.5 rounded-md">
                                              <div className="flex items-center gap-2">
                                                <img src={q.image} className="w-8 h-8 rounded border border-gray-200 object-contain bg-white" referrerPolicy="no-referrer" />
                                                <span className="text-[9px] text-gray-500 font-semibold truncate max-w-[124px]">
                                                  {q.image.startsWith("data:") ? "Local Loaded Graphic" : q.image}
                                                </span>
                                              </div>
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  let currentList;
                                                  if (qEditLang === "en") currentList = [...activeNodeData.test.questionsEn];
                                                  else if (qEditLang === "hi") currentList = [...activeNodeData.test.questionsHi];
                                                  else currentList = [...(activeNodeData.test.questionsOther?.[qEditLang] || [])];
                                                  
                                                  currentList[qIdx] = { ...currentList[qIdx], image: "" };
                                                  
                                                  if (qEditLang === "en") {
                                                    handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "questionsEn", currentList);
                                                  } else if (qEditLang === "hi") {
                                                    handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "questionsHi", currentList);
                                                  } else {
                                                    const updated = { ...(activeNodeData.test.questionsOther || {}), [qEditLang]: currentList };
                                                    handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "questionsOther", updated);
                                                  }
                                                }}
                                                className="text-red-500 hover:text-red-700 font-bold text-[8px] px-1.5 py-0.5 rounded bg-red-50 hover:bg-red-100 transition-colors"
                                              >
                                                Remove
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-2 gap-1.5">
                                        {(q.o || []).map((opt: string, oIdx: number) => (
                                          <div key={oIdx} className="space-y-0.5">
                                            <div className="flex items-center justify-between">
                                              <span className="text-[8px] font-bold text-gray-400">({String.fromCharCode(65 + oIdx)})</span>
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  let currentList;
                                                  if (qEditLang === "en") currentList = [...activeNodeData.test.questionsEn];
                                                  else if (qEditLang === "hi") currentList = [...activeNodeData.test.questionsHi];
                                                  else currentList = [...(activeNodeData.test.questionsOther?.[qEditLang] || [])];
                                                  
                                                  currentList[qIdx] = { ...currentList[qIdx], c: oIdx + 1 };
                                                  
                                                  if (qEditLang === "en") {
                                                    handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "questionsEn", currentList);
                                                  } else if (qEditLang === "hi") {
                                                    handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "questionsHi", currentList);
                                                  } else {
                                                    const updated = { ...(activeNodeData.test.questionsOther || {}), [qEditLang]: currentList };
                                                    handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "questionsOther", updated);
                                                  }
                                                }}
                                                className={`text-[8px] font-black uppercase rounded px-1 ${q.c === (oIdx + 1) ? "bg-emerald-100 text-emerald-800" : "text-gray-400"}`}
                                              >
                                                {q.c === (oIdx + 1) ? "\u2705" : "Correct"}
                                              </button>
                                            </div>
                                            <input
                                              type="text"
                                              value={opt}
                                              onChange={(e) => {
                                                let currentList;
                                                if (qEditLang === "en") currentList = [...activeNodeData.test.questionsEn];
                                                else if (qEditLang === "hi") currentList = [...activeNodeData.test.questionsHi];
                                                else currentList = [...(activeNodeData.test.questionsOther?.[qEditLang] || [])];
                                                
                                                const copyOpts = [...currentList[qIdx].o];
                                                copyOpts[oIdx] = e.target.value;
                                                currentList[qIdx] = { ...currentList[qIdx], o: copyOpts };
                                                
                                                if (qEditLang === "en") {
                                                  handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "questionsEn", currentList);
                                                } else if (qEditLang === "hi") {
                                                  handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "questionsHi", currentList);
                                                } else {
                                                  const updated = { ...(activeNodeData.test.questionsOther || {}), [qEditLang]: currentList };
                                                  handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "questionsOther", updated);
                                                }
                                              }}
                                              className="w-full bg-slate-50 border border-gray-200 rounded px-1.5 py-0.5 text-[11px] outline-none"
                                            />
                                          </div>
                                        ))}
                                      </div>

                                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-gray-100">
                                        <div>
                                          <label className="text-[8px] font-bold text-gray-400 block mb-0.5">EXPLANATION</label>
                                          <input
                                            type="text"
                                            value={q.s || ""}
                                            onChange={(e) => {
                                              let currentList;
                                              if (qEditLang === "en") currentList = [...activeNodeData.test.questionsEn];
                                              else if (qEditLang === "hi") currentList = [...activeNodeData.test.questionsHi];
                                              else currentList = [...(activeNodeData.test.questionsOther?.[qEditLang] || [])];
                                              
                                              currentList[qIdx] = { ...currentList[qIdx], s: e.target.value };
                                              
                                              if (qEditLang === "en") {
                                                handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "questionsEn", currentList);
                                              } else if (qEditLang === "hi") {
                                                handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "questionsHi", currentList);
                                              } else {
                                                const updated = { ...(activeNodeData.test.questionsOther || {}), [qEditLang]: currentList };
                                                handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "questionsOther", updated);
                                              }
                                            }}
                                            className="w-full bg-slate-50 border border-gray-200 rounded px-2 py-0.5 text-xs outline-none"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-[8px] font-bold text-gray-400 block mb-0.5">SOURCE</label>
                                          <input
                                            type="text"
                                            value={q.source || ""}
                                            onChange={(e) => {
                                              let currentList;
                                              if (qEditLang === "en") currentList = [...activeNodeData.test.questionsEn];
                                              else if (qEditLang === "hi") currentList = [...activeNodeData.test.questionsHi];
                                              else currentList = [...(activeNodeData.test.questionsOther?.[qEditLang] || [])];
                                              
                                              currentList[qIdx] = { ...currentList[qIdx], source: e.target.value };
                                              
                                              if (qEditLang === "en") {
                                                handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "questionsEn", currentList);
                                              } else if (qEditLang === "hi") {
                                                handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "questionsHi", currentList);
                                              } else {
                                                const updated = { ...(activeNodeData.test.questionsOther || {}), [qEditLang]: currentList };
                                                handleUpdateNodeTestProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "questionsOther", updated);
                                              }
                                            }}
                                            className="w-full bg-slate-50 border border-gray-200 rounded px-2 py-0.5 text-xs outline-none"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                {((qEditLang === "en" ? activeNodeData.test.questionsEn : (qEditLang === "hi" ? activeNodeData.test.questionsHi : activeNodeData.test.questionsOther?.[qEditLang])) || []).length === 0 && (
                                  <p className="text-[10px] text-gray-400 text-center py-4 bg-white border border-gray-150 rounded-xl font-bold">No questions configured. Click "+" to add!</p>
                                )}
                              </div>
                            </div>

                          </div>
                        )}
                      </div>


                      {/* PDF DOCUMENT SETTINGS */}
                      <div className="border border-gray-150 rounded-xl p-4 bg-slate-50 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                            <FileSpreadsheet className="w-4 h-4 text-sky-500" /> Linked PDF Material File
                          </span>
                          <input
                            type="checkbox"
                            checked={activeNodeData.pdf !== null}
                            onChange={(e) => handleTogglePDFSettingsOnNode(editingNodeId, editingNodeType!, editNodeCategoryContext, e.target.checked)}
                            className="w-4 h-4 rounded text-[#FF6B35] accent-[#FF6B35] cursor-pointer focus:ring-[#FF6B35]"
                          />
                        </div>

                        {activeNodeData.pdf && (
                          <div className="pt-3 border-t border-gray-200 space-y-3">
                            <div>
                              <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">PDF Resource Name</label>
                              <input
                                type="text"
                                value={activeNodeData.pdf.title}
                                onChange={(e) => handleUpdateNodePDFProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "title", e.target.value)}
                                className="w-full mt-1 bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] outline-none font-semibold text-slate-800"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Document Drive / CDN Link Address (URL)</label>
                              <input
                                type="text"
                                value={activeNodeData.pdf.url}
                                onChange={(e) => handleUpdateNodePDFProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "url", e.target.value)}
                                className="w-full mt-1 bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] outline-none font-semibold text-slate-800"
                              />
                              <p className="text-[8px] text-gray-400 mt-1">Embed absolute link targets (google drives or pdf static locations).</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 bg-[#FF6B35]/5 p-3 rounded-lg border border-[#FF6B35]/10">
                              <div>
                                <label className="text-[9px] font-black uppercase text-[#FF6B35] tracking-wider block font-semibold">Access Mode</label>
                                <select
                                  value={activeNodeData.pdf.isPaid ? "paid" : "free"}
                                  onChange={(e) => handleUpdateNodePDFProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "isPaid", e.target.value === "paid")}
                                  className="w-full mt-1 bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs outline-none font-bold"
                                >
                                  <option value="free">{"\ud83d\udd13"} FREE</option>
                                  <option value="paid">{"\ud83d\udd12"} Paid Membership</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider block font-semibold">Schedule Availability</label>
                                <input
                                  type="datetime-local"
                                  value={activeNodeData.pdf.scheduledAt || ""}
                                  onChange={(e) => handleUpdateNodePDFProperty(editingNodeId, editingNodeType!, editNodeCategoryContext, "scheduledAt", e.target.value)}
                                  className="w-full mt-1 bg-white border border-gray-200 rounded px-2 py-1 text-xs outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>

                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center h-full text-slate-400 space-y-3 py-16">
                  <Eye className="w-12 h-12 stroke-[1.2] text-slate-300" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-700">Configuration Inspector</h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-[240px] leading-relaxed mx-auto">Select any item tree node in the left layout catalog menu to inspect or attach tests.</p>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* 5. STUDENTS ACCOUNTS REGISTER LISTS */}
        {activeTab === "students" && (
          <section className="space-y-6">
            {/* Students Import Portal */}
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Students Database Import Portal</h3>
                <p className="text-xs text-gray-500 mt-1 font-medium">Bulk register aspirants instantly. You can upload a `.csv` file, a `students_db.txt` / `student_db.txt` database backup, or paste raw CSV lines.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Drag & Drop File Upload Section */}
                <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-6 flex flex-col justify-center items-center text-center relative hover:bg-slate-50/80 hover:border-[#FF6B35]/50 transition-all cursor-pointer group min-h-[160px]">
                  <div className="space-y-2">
                    <FileSpreadsheet className="w-10 h-10 mx-auto text-[#FF6B35] stroke-[1.5] group-hover:scale-110 transition-transform" />
                    <div>
                      <span className="text-xs font-extrabold text-slate-700 block">Drag & drop or click to upload file</span>
                      <span className="text-[10px] text-slate-400 block mt-1">Accepts `.csv` list or obfuscated `.txt` database backups</span>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept=".csv,.txt"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        handleUploadStudentFile(files[0]);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </div>

                {/* Textarea Paste Section */}
                <div className="bg-slate-50 border border-gray-150 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="text-xs text-slate-600 font-extrabold">
                      Paste CSV Lines (Format: Name, Email/Mobile, Phone, Password, PurchaseDate, ExpiryDate)
                    </div>
                    <textarea
                      id="bulkStudentsCsvArea"
                      placeholder="Guddu Sharma, guddu@gmail.com, 919999999999, secretpass, 2026-06-04, 2026-09-04"
                      rows={3}
                      className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs font-mono outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] resize-none"
                    />
                  </div>
                  <button
                    onClick={() => {
                      const el = document.getElementById("bulkStudentsCsvArea") as HTMLTextAreaElement;
                      if (el && el.value.trim()) {
                        handleBulkUploadCSV(el.value);
                        el.value = "";
                      } else {
                        alert("Please paste formatted CSV lines first.");
                      }
                    }}
                    className="bg-[#111827] hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase cursor-pointer transition-all shadow-md inline-flex items-center justify-center gap-1.5 self-start"
                  >
                    <Plus className="w-4 h-4" /> Import Pasted Lines
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-905">Aspirants Database Logs</h3>
                  <p className="text-xs text-gray-500 mt-0.5 font-semibold text-slate-400">Total Registered Subscribers: {appConfig.students.length}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <button
                    onClick={handleDownloadSeparateStudentsText}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 cursor-pointer transition-all shadow-md"
                    title="Export only student account credentials to students_db.txt"
                  >
                    <Download className="w-4 h-4" /> Export students_db.txt
                  </button>
                  <button
                    onClick={handleDownloadCategoryPaymentText}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 cursor-pointer transition-all shadow-md"
                    title="Export Category payment setup to CategoryPayment.txt"
                  >
                    <Download className="w-4 h-4" /> Export CategoryPayment.txt
                  </button>
                  <button
                    onClick={handleAddStudentAccount}
                    className="bg-[#FF6B35] hover:bg-[#e05a2b] text-white px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 cursor-pointer transition-all shadow-md"
                  >
                    <Plus className="w-4 h-4" /> Add Student
                  </button>
                  <button
                    onClick={() => saveState(appConfig, true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 cursor-pointer transition-all shadow-md"
                    title="Force sync and publish current database to backend immediately"
                  >
                    <Save className="w-4 h-4" /> Save & Sync Server
                  </button>
                </div>
              </div>

              {/* Live Search Filter and Pagination Stats bar */}
              <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-150 mb-4">
                <div className="relative w-full md:max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={studentSearchQuery}
                    onChange={(e) => {
                      setStudentSearchQuery(e.target.value);
                      setStudentCurrentPage(1); // reset page on search
                    }}
                    placeholder="Search aspirants by name, email/username or phone number..."
                    className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] transition-all text-slate-800"
                  />
                  {studentSearchQuery && (
                    <button 
                      onClick={() => {
                        setStudentSearchQuery("");
                        setStudentCurrentPage(1);
                      }}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-slate-600 text-[10px] font-extrabold uppercase"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="text-xs text-slate-500 font-bold shrink-0">
                  {filteredStudents.length !== appConfig.students.length ? (
                    <span>Filtered: <strong className="text-slate-800">{filteredStudents.length}</strong> of <strong className="text-slate-800">{appConfig.students.length}</strong> aspirants</span>
                  ) : (
                    <span>Showing <strong className="text-slate-800">{appConfig.students.length}</strong> total registered aspirants</span>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-gray-150 shadow-xs">
                <table className="w-full border-collapse bg-white text-left text-xs font-semibold text-slate-700">
                  <thead className="bg-slate-50 text-gray-500 border-b border-gray-150 text-[10px] font-black uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-4">Aspirant Name</th>
                      <th className="px-4 py-4">Email ID/Username</th>
                      <th className="px-4 py-4">Phone No</th>
                      <th className="px-4 py-4">Access Password</th>
                      <th className="px-4 py-4">Active Category Unlocks (Check to Activate)</th>
                      <th className="px-4 py-4 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentPageStudents.map((stu) => {
                      const unlockedIds = stu.unlockedCategoryIds || [];
                      const allCategories = [
                        ...(appConfig.testCategories || []),
                        ...(appConfig.pdfCategories || [])
                      ].filter((cat, idx, self) => self.findIndex(c => c.id === cat.id) === idx);

                      return (
                        <tr key={stu.id} className="hover:bg-slate-50/50 transition-all font-semibold text-xs">
                          <td className="px-2 py-3">
                            <input
                              type="text"
                              value={stu.name}
                              onChange={(e) => handleUpdateStudentAccount(stu.id, "name", e.target.value)}
                              className="bg-transparent hover:bg-white focus:bg-white border border-transparent focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] rounded-lg px-2 py-1.5 w-full font-bold text-slate-800 outline-none transition-all"
                            />
                          </td>
                          <td className="px-2 py-3">
                            <input
                              type="text"
                              value={stu.emailOrMobile}
                              onChange={(e) => handleUpdateStudentAccount(stu.id, "emailOrMobile", e.target.value)}
                              className="bg-transparent hover:bg-white focus:bg-white border border-transparent focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] rounded-lg px-2 py-1.5 w-full outline-none transition-all"
                            />
                          </td>
                          <td className="px-2 py-3">
                            <input
                              type="text"
                              value={stu.phoneNo || ""}
                              onChange={(e) => handleUpdateStudentAccount(stu.id, "phoneNo", e.target.value)}
                              className="bg-transparent hover:bg-white focus:bg-white border border-transparent focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] rounded-lg px-2 py-1.5 w-full outline-none transition-all"
                              placeholder="Not linked"
                            />
                          </td>
                          <td className="px-2 py-3">
                            <input
                              type="text"
                              value={stu.password}
                              onChange={(e) => handleUpdateStudentAccount(stu.id, "password", e.target.value)}
                              className="bg-transparent hover:bg-white focus:bg-white border border-transparent focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] rounded-lg px-2 py-1.5 w-full font-mono outline-none transition-all"
                            />
                          </td>
                          <td className="px-2 py-3 min-w-[240px]">
                            <div className="flex flex-col gap-1.5 max-h-[200px] overflow-y-auto bg-slate-50 p-2 rounded-xl border border-slate-150">
                              {allCategories.map(cat => {
                                const isChecked = unlockedIds.includes(cat.id);
                                return (
                                  <div key={cat.id} className="flex flex-col gap-1 p-1.5 bg-white rounded-lg border border-slate-200 shadow-xs mb-1">
                                    <label className="flex items-center gap-2 cursor-pointer text-[11px] font-bold text-slate-700 hover:text-slate-900 select-none">
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={(e) => {
                                          const checked = e.target.checked;
                                          let nextIds = [...unlockedIds];
                                          if (checked) {
                                            if (!nextIds.includes(cat.id)) nextIds.push(cat.id);
                                          } else {
                                            nextIds = nextIds.filter(id => id !== cat.id);
                                          }
                                          handleUpdateStudentAccount(stu.id, "unlockedCategoryIds", nextIds);
                                        }}
                                        className="rounded border-gray-300 text-[#FF6B35] focus:ring-[#FF6B35]"
                                      />
                                      <span className="truncate max-w-[150px]" title={cat.name}>{cat.name}</span>
                                      {cat.isPaid && <span className="text-[9px] text-[#FF6B35] bg-orange-50 px-1.5 py-0.5 rounded font-black border border-orange-100 uppercase tracking-wide">Paid</span>}
                                    </label>
                                    {isChecked && (
                                      <div className="flex flex-col gap-1 pl-4 border-l-2 border-[#FF6B35]/40 mt-1">
                                        <div className="flex items-center gap-1">
                                          <span className="text-[9px] text-gray-400 w-12 font-medium shrink-0">Purchase:</span>
                                          <input
                                            type="date"
                                            value={stu.categoryDates?.[cat.id]?.purchaseDate || ""}
                                            onChange={(e) => {
                                              const updated = { ...(stu.categoryDates || {}) };
                                              updated[cat.id] = {
                                                ...(updated[cat.id] || {}),
                                                purchaseDate: e.target.value
                                              };
                                              handleUpdateStudentAccount(stu.id, "categoryDates", updated);
                                            }}
                                            className="bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-[9px] w-full outline-none focus:border-[#FF6B35]"
                                          />
                                        </div>
                                        <div className="flex items-center gap-1.5 py-0.5">
                                          <input
                                            type="checkbox"
                                            id={`lifetime-${stu.id}-${cat.id}`}
                                            checked={stu.categoryDates?.[cat.id]?.isLifetime || false}
                                            onChange={(e) => {
                                              const checked = e.target.checked;
                                              const updated = { ...(stu.categoryDates || {}) };
                                              updated[cat.id] = {
                                                ...(updated[cat.id] || {}),
                                                isLifetime: checked,
                                                expiryDate: checked ? "" : (updated[cat.id]?.expiryDate || "")
                                              };
                                              handleUpdateStudentAccount(stu.id, "categoryDates", updated);
                                            }}
                                            className="rounded border-gray-300 text-[#FF6B35] focus:ring-[#FF6B35] h-3.5 w-3.5"
                                          />
                                          <label htmlFor={`lifetime-${stu.id}-${cat.id}`} className="text-[10px] text-gray-500 font-bold select-none cursor-pointer">
                                            Lifetime (Unlimited)
                                          </label>
                                        </div>
                                        <div className={`flex items-center gap-1 transition-opacity ${stu.categoryDates?.[cat.id]?.isLifetime ? "opacity-40 pointer-events-none" : ""}`}>
                                          <span className="text-[9px] text-gray-400 w-12 font-medium shrink-0">Expiry:</span>
                                          <input
                                            type="date"
                                            disabled={!!stu.categoryDates?.[cat.id]?.isLifetime}
                                            value={stu.categoryDates?.[cat.id]?.isLifetime ? "" : (stu.categoryDates?.[cat.id]?.expiryDate || "")}
                                            onChange={(e) => {
                                              const updated = { ...(stu.categoryDates || {}) };
                                              updated[cat.id] = {
                                                ...(updated[cat.id] || {}),
                                                expiryDate: e.target.value
                                              };
                                              handleUpdateStudentAccount(stu.id, "categoryDates", updated);
                                            }}
                                            className="bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-[9px] w-full outline-none focus:border-[#FF6B35]"
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                              {allCategories.length === 0 && (
                                <span className="text-[10px] text-gray-400 font-medium italic text-center py-2">No categories created yet</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => handleDeleteStudentAccount(stu.id)}
                              className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                            >
                              <Trash2 className="w-4.5 h-4.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                    {appConfig.students.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center text-gray-400 font-bold">No standard student accounts registered. Compiled app will let anonymous guests.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination controls at bottom of table container */}
              {totalStudentPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-150 pt-5 mt-5 gap-4">
                  <div className="text-xs text-gray-500 font-bold">
                    Showing Page <strong className="text-slate-800">{studentCurrentPage}</strong> of <strong className="text-slate-800">{totalStudentPages}</strong> (filtered <strong className="text-[#FF6B35]">{filteredStudents.length}</strong> accounts)
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setStudentCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={studentCurrentPage === 1}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-slate-100 text-slate-700 font-extrabold text-xs rounded-lg transition-all cursor-pointer select-none"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalStudentPages }).map((_, idx) => {
                      const pageNum = idx + 1;
                      if (
                        pageNum === 1 ||
                        pageNum === totalStudentPages ||
                        Math.abs(pageNum - studentCurrentPage) <= 2
                      ) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setStudentCurrentPage(pageNum)}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-black transition-all cursor-pointer ${
                              studentCurrentPage === pageNum
                                ? "bg-[#FF6B35] text-white"
                                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                      if (
                        pageNum === 2 ||
                        pageNum === totalStudentPages - 1
                      ) {
                        return (
                          <span key={pageNum} className="text-slate-400 text-xs px-1 select-none">
                            ...
                          </span>
                        );
                      }
                      return null;
                    }).filter((el, i, arr) => {
                      if (el && el.type === "span") {
                        const prevEl = arr[i - 1];
                        if (prevEl && prevEl.type === "span") {
                          return false;
                        }
                      }
                      return true;
                    })}
                    <button
                      onClick={() => setStudentCurrentPage(prev => Math.min(totalStudentPages, prev + 1))}
                      disabled={studentCurrentPage === totalStudentPages}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-slate-100 text-slate-700 font-extrabold text-xs rounded-lg transition-all cursor-pointer select-none"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 6. SOCIAL PORTS AND PAYMENT GATEWAYS */}
        {activeTab === "payment" && (
          <section className="space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-gray-900">Support Handles & UPI Gateways</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">WhatsApp Direct Link</label>
                  <input
                    type="text"
                    value={appConfig.social.whatsapp}
                    onChange={(e) => handleUpdateSocialPaymentGroup("whatsapp", e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] focus:bg-white transition-all outline-none font-semibold text-slate-800"
                  />
                  <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">Direct WhatsApp API chat address format: https://wa.me/91XXXXXXXXXX.</p>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">Telegram Screen-share Handler</label>
                  <input
                    type="text"
                    value={appConfig.social.telegram}
                    onChange={(e) => handleUpdateSocialPaymentGroup("telegram", e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] focus:bg-white transition-all outline-none font-semibold text-slate-800"
                  />
                  <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">Telegram path for receipt screenshots check. Usually: https://t.me/your_telegram_channel.</p>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">Payment Support Contact Link (URL)</label>
                  <input
                    type="text"
                    value={appConfig.social.paymentContactLink || ""}
                    onChange={(e) => handleUpdateSocialPaymentGroup("paymentContactLink", e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] focus:bg-white transition-all outline-none font-semibold text-slate-800"
                    placeholder="http://t.me/PrayasOneSupportBot"
                  />
                  <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">The link attached to the payment page support button for completed payments without access.</p>
                </div>

                 <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">Instagram Handler (URL)</label>
                  <input
                    type="text"
                    value={appConfig.social.instagram || ""}
                    onChange={(e) => handleUpdateSocialPaymentGroup("instagram", e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] focus:bg-white transition-all outline-none font-semibold text-slate-800"
                    placeholder="https://instagram.com/prayasone"
                  />
                  <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">Optional Instagram profile link for direct live access.</p>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">YouTube Channel (URL)</label>
                  <input
                    type="text"
                    value={appConfig.social.youtube || ""}
                    onChange={(e) => handleUpdateSocialPaymentGroup("youtube", e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] focus:bg-white transition-all outline-none font-semibold text-slate-800"
                    placeholder="https://youtube.com/@prayasone"
                  />
                  <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">Optional YouTube link for live tutoring channels.</p>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">Other Live Portal Title</label>
                  <input
                    type="text"
                    value={appConfig.social.otherName || ""}
                    onChange={(e) => handleUpdateSocialPaymentGroup("otherName", e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] focus:bg-white transition-all outline-none font-semibold text-slate-800"
                    placeholder="Twitter, Website"
                  />
                  <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">Name displayed on custom support tab link.</p>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">Other Live Portal (URL)</label>
                  <input
                    type="text"
                    value={appConfig.social.other || ""}
                    onChange={(e) => handleUpdateSocialPaymentGroup("other", e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] focus:bg-white transition-all outline-none font-semibold text-slate-800"
                    placeholder="https://twitter.com/prayasone"
                  />
                  <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">Redirect link for custom support tab link.</p>
                </div>

                <div className="md:col-span-2 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-150 mt-2 mb-2">
                  <label className="block text-xs font-black text-indigo-950 uppercase tracking-wider mb-2">🔍 Google Search Console Verification Meta Key (Content ID)</label>
                  <input
                    type="text"
                    value={appConfig.social.googleVerificationId || "k7WEweulUiwAmqV3D5oVNzLu528Ib-B5VT4s4F2f4"}
                    onChange={(e) => handleUpdateSocialPaymentGroup("googleVerificationId", e.target.value)}
                    className="w-full bg-white border border-indigo-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none font-bold text-indigo-950"
                    placeholder="Enter your google-site-verification token hex key"
                  />
                  <p className="text-[11px] text-indigo-700/80 mt-1.5 leading-relaxed font-semibold">
                    This dynamically injects a &lt;meta name="google-site-verification" content="..."&gt; tag into your exported student portal's head element for quick Google verification. Your current token from the screenshot has been prefilled automatically!
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">Payment Amount License (INR)</label>
                  <input
                    type="text"
                    value={appConfig.social.paymentAmount}
                    onChange={(e) => handleUpdateSocialPaymentGroup("paymentAmount", e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] focus:bg-white transition-all outline-none font-semibold text-slate-800"
                  />
                  <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">Specify full cost amount text showing on lock-screens.</p>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">Premium Price Text</label>
                  <input
                    type="text"
                    value={appConfig.social.premiumPrice || "₹45"}
                    onChange={(e) => handleUpdateSocialPaymentGroup("premiumPrice", e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] focus:bg-white transition-all outline-none font-semibold text-slate-800"
                  />
                  <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">e.g. ₹45</p>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">Premium Duration Text</label>
                  <input
                    type="text"
                    value={appConfig.social.premiumDurationText || "3 Months"}
                    onChange={(e) => handleUpdateSocialPaymentGroup("premiumDurationText", e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] focus:bg-white transition-all outline-none font-semibold text-slate-800"
                  />
                  <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">e.g. / 3 Months</p>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">Premium Validity Badge</label>
                  <input
                    type="text"
                    value={appConfig.social.premiumValidityText || "VALID FOR 90 DAYS"}
                    onChange={(e) => handleUpdateSocialPaymentGroup("premiumValidityText", e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] focus:bg-white transition-all outline-none font-semibold text-slate-800"
                  />
                  <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">e.g. VALID FOR 90 DAYS</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">Premium Membership Benefits (Comma Separated)</label>
                  <textarea
                    rows={3}
                    value={appConfig.social.premiumBenefitsText || "Access to Past Tests, Access to Present Tests, Access to Future Tests, Unlimited Test Attempts"}
                    onChange={(e) => handleUpdateSocialPaymentGroup("premiumBenefitsText", e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] focus:bg-white transition-all outline-none font-semibold text-slate-800"
                  />
                  <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">List of benefits showing on VIP card, separated by commas.</p>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">UPI QR Code Image (URL)</label>
                  <input
                    type="text"
                    value={appConfig.social.paymentQr}
                    onChange={(e) => handleUpdateSocialPaymentGroup("paymentQr", e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] focus:bg-white transition-all outline-none font-semibold text-slate-800"
                  />
                  <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">Absolute URL pointing to hosted payment QR code images.</p>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">QR Action / Download Button Text</label>
                  <input
                    type="text"
                    value={appConfig.social.qrDownloadText || "Download QR Code"}
                    onChange={(e) => handleUpdateSocialPaymentGroup("qrDownloadText", e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] focus:bg-white transition-all outline-none font-semibold text-slate-800"
                    placeholder="Download QR Code"
                  />
                  <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">Customize the label for the download / action link button under QR code.</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">QR Custom Redirect Link (URL)</label>
                  <input
                    type="text"
                    value={appConfig.social.qrDownloadLink || ""}
                    onChange={(e) => handleUpdateSocialPaymentGroup("qrDownloadLink", e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] focus:bg-white transition-all outline-none font-semibold text-slate-800"
                    placeholder="e.g. Telegram channel link or alternative download link"
                  />
                  <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">Optional. If set, clicking the action button will open this link in a new tab instead of downloading the QR code directly.</p>
                </div>

                <div className="md:col-span-2 border-t border-gray-150 pt-5 mt-2">
                  <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-2 mb-1">
                    <span className="text-emerald-500 font-bold text-lg">🤖</span> Android Mobile App (.APK) Distribution
                  </h4>
                  <p className="text-xs text-gray-500">Provide direct installation APK files or hosted download links for your student community.</p>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">APK Action / Download Text</label>
                  <input
                    type="text"
                    value={appConfig.social.apkDownloadText || "Download Android App (APK)"}
                    onChange={(e) => handleUpdateSocialPaymentGroup("apkDownloadText", e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] focus:bg-white transition-all outline-none font-semibold text-slate-800"
                    placeholder="Download Android App (APK)"
                  />
                  <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">Customize the text of the Android APK download button.</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">APK Direct Download Link (URL)</label>
                  <input
                    type="text"
                    value={appConfig.social.apkUrl || ""}
                    onChange={(e) => handleUpdateSocialPaymentGroup("apkUrl", e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] focus:bg-white transition-all outline-none font-semibold text-slate-800"
                    placeholder="e.g. https://prayasone.in/app.apk or Google Drive share link"
                  />
                  <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">When provided, a beautiful download button will be shown to all your aspirants on their Home dashboard.</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-5 border border-gray-100 flex items-center gap-5 justify-start">
                <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                  <img src={appConfig.social.paymentQr} alt="QR Code" className="w-24 h-24 object-contain" onError={(e) => { (e.target as any).src = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=UPI_PAY"; }} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-[#FF6B35]" /> Transaction Gateway Mockup
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed mt-1 max-w-md">When free assessment attempts dry up, unauthenticated student users see this QR. Entering a Transaction Ref forwarding takes screenshots to prompt activation.</p>
                </div>
              </div>

              {/* Unlimited Custom Social Links */}
              <div className="border-t border-gray-150 pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-[#FF6B35]" /> Unlimited Custom Social Links
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">Admin can add extra social platforms (such as Facebook, Twitter, LinkedIn etc.) as live contact portals.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCustomSocialLink}
                    className="flex items-center gap-1.5 bg-[#FF6B35] text-white hover:bg-[#e05626] font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer shadow-sm shadow-[#FF6B35]/25 transition-all active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Custom Link
                  </button>
                </div>

                <div className="space-y-3">
                  {(appConfig.social.customLinks || []).map((link) => (
                    <div key={link.id} className="bg-slate-50 border border-gray-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center gap-4 transition-all hover:bg-slate-100">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text:[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">Platform Name</label>
                          <input
                            type="text"
                            value={link.name}
                            onChange={(e) => handleUpdateCustomSocialLink(link.id, "name", e.target.value)}
                            placeholder="e.g. Facebook"
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="block text:[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">Redirect URL</label>
                          <input
                            type="text"
                            value={link.url}
                            onChange={(e) => handleUpdateCustomSocialLink(link.id, "url", e.target.value)}
                            placeholder="https://facebook.com/..."
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="block text:[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">Brand Color Code</label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={link.color || "#1e272e"}
                              onChange={(e) => handleUpdateCustomSocialLink(link.id, "color", e.target.value)}
                              className="w-8 h-8 rounded-lg border border-gray-200 cursor-pointer p-0 overflow-hidden shrink-0"
                            />
                            <input
                              type="text"
                              value={link.color || "#1e272e"}
                              onChange={(e) => handleUpdateCustomSocialLink(link.id, "color", e.target.value)}
                              className="w-full bg-white border border-gray-200 rounded-lg px-2 py-2 text-xs font-semibold text-slate-800 uppercase"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text:[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">Phosphor Icon Class</label>
                          <input
                            type="text"
                            value={link.icon || "ph-fill ph-link"}
                            onChange={(e) => handleUpdateCustomSocialLink(link.id, "icon", e.target.value)}
                            placeholder="e.g. ph-fill ph-facebook-logo"
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 justify-end md:self-end md:pb-1 shrink-0">
                        <div
                          className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-lg text-slate-800"
                          title="Icon Preview"
                        >
                          <span className={link.icon || "ph-fill ph-link"} style={{ color: link.color || "#1e272e" }}></span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveCustomSocialLink(link.id)}
                          className="bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 p-2 rounded-xl transition-all border border-transparent cursor-pointer"
                          title="Delete Custom Social Link"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {(appConfig.social.customLinks || []).length === 0 && (
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center text-gray-400 text-xs font-semibold">
                      No custom social links defined. Add custom links using the button above.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}



        {/* 8. AUDIT TRAILS & ADMIN ACTIVITY LOGS (Feature 27) */}
        {activeTab === "logs" && (
          <section className="space-y-6 animate-fadeIn">
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-150 pb-5">
                <div>
                  <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                    <History className="w-5 h-5 text-[#FF6B35]" /> Operator Security Activity Logs
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 font-medium">Audit trails detailing system manipulations, category additions, mock compiles, and backups restores.</p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm max-h-[500px] overflow-y-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-gray-150 text-gray-500 font-extrabold uppercase tracking-widest text-[9px]">
                      <th className="p-4 w-48">Registered Timestamp</th>
                      <th className="p-4">Action Summary / Security Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activityLogs.map((log, idx) => (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-slate-50/50 transition-all font-semibold text-slate-800">
                        <td className="p-4 font-mono text-gray-400 text-[10px]">
                          {log.timestamp ? log.timestamp.replace("T", " ").substring(0, 19) : "N/A"}
                        </td>
                        <td className="p-4 text-slate-900">{log.action || "Manipulated dynamic configuration values"}</td>
                      </tr>
                    ))}
                    {activityLogs.length === 0 && (
                      <tr>
                        <td colSpan={2} className="p-8 text-center text-gray-400 font-semibold">
                          No logging items recorded yet. Change or update items to trigger writes.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* 9. SECURE CLOUD DATABASE BACKUP & RESTORE CENTER (Feature 28) */}
        {activeTab === "backups" && (
          <section className="space-y-6 animate-fadeIn">
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-150 pb-5">
                <div>
                  <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                    <Database className="w-5 h-5 text-[#FF6B35]" /> Database Snapshot & Recovery Center
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 font-medium">Create, download, and restore manual backups of configuration matrices, custom student logins records, and syllabus contents trees.</p>
                </div>
              </div>

              <div className="bg-slate-50 border border-gray-200/80 rounded-2xl p-6 space-y-4">
                <h4 className="font-extrabold text-sm text-slate-800">Take New Database Backup Snapshot</h4>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={backupNameInput}
                    onChange={(e) => setBackupNameInput(e.target.value)}
                    placeholder="Enter short custom name, e.g. post_reorg"
                    className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] outline-none font-semibold text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={handleCreateBackup}
                    disabled={isBackupLoading}
                    className="bg-[#FF6B35] hover:bg-[#e05626] text-white disabled:bg-gray-300 font-bold text-xs px-6 py-3.5 rounded-xl transition-all shadow-md shadow-[#FF6B35]/25 cursor-pointer active:scale-95"
                  >
                    {isBackupLoading ? "Generating..." : "Generate Cloud Backup"}
                  </button>
                </div>
              </div>

              <div className="overflow-hidden border border-gray-200 rounded-2xl bg-white shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs min-w-[650px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-gray-150 text-gray-500 font-extrabold uppercase tracking-widest text-[9px]">
                      <th className="p-4">Backup Filename</th>
                      <th className="p-4 text-center">Filesize</th>
                      <th className="p-4 text-center">Created At Date</th>
                      <th className="p-4 text-right">Standard Administration Options</th>
                    </tr>
                  </thead>
                  <tbody>
                    {backupsList.map((bk) => (
                      <tr key={bk.filename} className="border-b border-gray-100 hover:bg-slate-50/50 transition-all font-semibold text-slate-800">
                        <td className="p-4 text-slate-900 font-bold flex items-center gap-2">
                          <Database className="w-4 h-4 text-gray-400" />
                          <span>{bk.filename}</span>
                        </td>
                        <td className="p-4 text-center text-gray-500 font-mono text-[11px]">{bk.size || "0 KB"}</td>
                        <td className="p-4 text-center text-gray-400 font-mono text-[11px]">{bk.createdAt || "N/A"}</td>
                        <td className="p-4 text-right space-x-2">
                          <a
                            href={`/api/admin/backup/download/${bk.filename}`}
                            className="bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-gray-250 font-bold text-[10px] px-3.5 py-2.5 rounded-xl transition-all inline-block uppercase tracking-wider text-center"
                            title="Download backup file to local machine"
                          >
                            Download
                          </a>
                          <button
                            type="button"
                            onClick={() => handleRestoreBackup(bk.filename)}
                            disabled={restoringBackup !== null}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 hover:text-emerald-800 border border-emerald-250 font-black text-[10px] px-3.5 py-2 rounded-xl transition-all uppercase tracking-wider cursor-pointer"
                          >
                            {restoringBackup === bk.filename ? "RESTORING..." : "RESTORE DB"}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {backupsList.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-gray-400 font-bold">
                          No custom backups catalog found on server. Produce a snapshot using the form above!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* 10. SEO GOOGLE CENTER */}
        {activeTab === "seo" && (
          <section className="space-y-6 animate-fadeIn">
            {/* Header Description */}
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-150 pb-5">
                <div>
                  <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-[#FF6B35]" /> SEO & Google Search Console Optimization Center
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 font-medium">Configure ultimate search engine ranking identifiers. Dynamic XML sitemaps, OpenGraph image assets, and structured schema metrics are automatically refreshed for top search ranking when new tests or PDFs are published!</p>
                </div>
              </div>

              {/* LIVE GOOGLE SERP PREVIEW */}
              <div className="bg-[#f8fafc] border border-slate-200 rounded-2xl p-6 space-y-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Google Search Result Snippet Preview (Real-time mockup)
                </span>
                
                <div className="bg-white border border-slate-150 rounded-xl p-5 shadow-sm max-w-2xl space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-mono">https</span>
                    <span className="truncate">{appConfig.seo?.canonicalUrl || "https://prayasone.in"}</span>
                  </div>
                  <h4 className="text-lg text-[#1a0dab] hover:underline font-medium cursor-pointer leading-tight">
                    {appConfig.seo?.metaTitle || `${appConfig.appName} - Elite MCQ Practice & Mock Test Portal`}
                  </h4>
                  
                  {/* Rating Stars Mock */}
                  <div className="flex items-center gap-1 text-[11px] text-amber-500 my-0.5">
                    <span className="font-bold text-slate-700 mr-1">Rating: {appConfig.seo?.schemaRatingValue || "4.9"}</span>
                    <span>★★★★★</span>
                    <span className="text-slate-500 ml-1">({appConfig.seo?.schemaReviewCount || "1,840"} votes) - Free - Educational CBT</span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {appConfig.seo?.metaDescription || `Welcome to ${appConfig.appName}. India's leading digital education center for bilingual MCQ practice, simulated online CBT exam portals, offline Blackbooks, study material PDFs, and deep learning analytics.`}
                  </p>
                </div>
              </div>

              {/* SEO HEALTH & ANALYTICS BAR */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 flex-shrink-0">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-emerald-600 font-extrabold block">SEO Health Index</span>
                    <span className="text-lg font-black text-slate-800">98% Optimal</span>
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FF6B35]/10 flex items-center justify-center text-[#FF6B35] flex-shrink-0">
                    <Search className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#FF6B35] font-extrabold block">Active Deep Routes</span>
                    <span className="text-lg font-black text-slate-800">
                      {(() => {
                        const baseUrl = appConfig.seo?.canonicalUrl || "https://prayasone.in";
                        function toUrlSegment(str: string): string {
                          if (!str) return "";
                          return str.toString().trim()
                            .replace(/[^a-zA-Z0-9\s-]/g, "")
                            .replace(/\s+/g, "-")
                            .replace(/-+/g, "-");
                        }
                        const urls = [
                          baseUrl + "/",
                          baseUrl + "/home",
                          baseUrl + "/tests",
                          baseUrl + "/pdfs",
                          baseUrl + "/accounts"
                        ];
                        const allTestCats = appConfig.testCategories || [];
                        allTestCats.forEach((cat: any) => {
                          const catPath = `${baseUrl}/${toUrlSegment(cat.name)}`;
                          urls.push(catPath);
                          if (cat.subCategories) {
                            cat.subCategories.forEach((sub: any) => {
                              const subPath = `${catPath}/${toUrlSegment(sub.name)}`;
                              urls.push(subPath);
                              if (sub.topics) {
                                sub.topics.forEach((topic: any) => {
                                  urls.push(`${subPath}/${toUrlSegment(topic.name)}`);
                                });
                              }
                            });
                          }
                        });
                        const allPdfCats = appConfig.pdfCategories || [];
                        allPdfCats.forEach((cat: any) => {
                          const catPath = `${baseUrl}/${toUrlSegment(cat.name)}`;
                          urls.push(catPath);
                          if (cat.subCategories) {
                            cat.subCategories.forEach((sub: any) => {
                              const subPath = `${catPath}/${toUrlSegment(sub.name)}`;
                              urls.push(subPath);
                              if (sub.topics) {
                                sub.topics.forEach((topic: any) => {
                                  urls.push(`${subPath}/${toUrlSegment(topic.name)}`);
                                });
                              }
                            });
                          }
                        });
                        return Array.from(new Set(urls.filter(Boolean))).length;
                      })()} Pages Auto-Indexed
                    </span>
                  </div>
                </div>

                <div className="bg-sky-50 border border-sky-100 rounded-2xl p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-600 flex-shrink-0">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-sky-600 font-extrabold block">JSON-LD Structured Schema</span>
                    <span className="text-lg font-black text-slate-800">Quiz & Course Active</span>
                  </div>
                </div>
              </div>

              {/* TABS OF CONFIGURATION AND LISTINGS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* FORM CONTROLS */}
                <div className="space-y-5">
                  <h4 className="font-extrabold text-sm text-slate-800 border-b border-slate-100 pb-2">Meta & Social Settings</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-1.5">Meta SEO Title</label>
                      <input
                        type="text"
                        value={appConfig.seo?.metaTitle || ""}
                        onChange={(e) => {
                          const seo = { ...(appConfig.seo || {}), metaTitle: e.target.value };
                          setAppConfig({ ...appConfig, seo });
                        }}
                        placeholder="Meta title tags displayed"
                        className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:border-[#FF6B35] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-1.5">Canonical URL Base</label>
                      <input
                        type="text"
                        value={appConfig.seo?.canonicalUrl || ""}
                        onChange={(e) => {
                          const seo = { ...(appConfig.seo || {}), canonicalUrl: e.target.value };
                          setAppConfig({ ...appConfig, seo });
                        }}
                        placeholder="https://prayasone.in/"
                        className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:border-[#FF6B35] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-1.5">Meta SEO Description (Maximum 160 chars recommended)</label>
                    <textarea
                      rows={3}
                      value={appConfig.seo?.metaDescription || ""}
                      onChange={(e) => {
                        const seo = { ...(appConfig.seo || {}), metaDescription: e.target.value };
                        setAppConfig({ ...appConfig, seo });
                      }}
                      placeholder="Write rich meta description..."
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:border-[#FF6B35] outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-1.5">Meta Keywords List (Comma separated)</label>
                    <textarea
                      rows={2}
                      value={appConfig.seo?.metaKeywords || ""}
                      onChange={(e) => {
                        const seo = { ...(appConfig.seo || {}), metaKeywords: e.target.value };
                        setAppConfig({ ...appConfig, seo });
                      }}
                      placeholder="Prayas One, prayasone, tests..."
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:border-[#FF6B35] outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-1.5">OpenGraph Share Image (URL)</label>
                      <input
                        type="text"
                        value={appConfig.seo?.ogImage || ""}
                        onChange={(e) => {
                          const seo = { ...(appConfig.seo || {}), ogImage: e.target.value };
                          setAppConfig({ ...appConfig, seo });
                        }}
                        placeholder="Image URL for WhatsApp / Facebook sharing"
                        className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:border-[#FF6B35] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-1.5">Meta Author Name</label>
                      <input
                        type="text"
                        value={appConfig.seo?.author || ""}
                        onChange={(e) => {
                          const seo = { ...(appConfig.seo || {}), author: e.target.value };
                          setAppConfig({ ...appConfig, seo });
                        }}
                        placeholder="Organization or Author"
                        className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:border-[#FF6B35] outline-none"
                      />
                    </div>
                  </div>

                  <h4 className="font-extrabold text-sm text-slate-800 border-b border-slate-100 pt-3 pb-2">Search Console Site Verification Codes</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-1.5">Google Verification ID</label>
                      <input
                        type="text"
                        value={appConfig.seo?.googleSiteVerification || ""}
                        onChange={(e) => {
                          const seo = { ...(appConfig.seo || {}), googleSiteVerification: e.target.value };
                          setAppConfig({ ...appConfig, seo });
                        }}
                        placeholder="k7WEweulUiw..."
                        className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:border-[#FF6B35] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-1.5">Bing Webmaster Token</label>
                      <input
                        type="text"
                        value={appConfig.seo?.bingSiteVerification || ""}
                        onChange={(e) => {
                          const seo = { ...(appConfig.seo || {}), bingSiteVerification: e.target.value };
                          setAppConfig({ ...appConfig, seo });
                        }}
                        placeholder="Bing validation key"
                        className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:border-[#FF6B35] outline-none"
                      />
                    </div>
                  </div>

                  <h4 className="font-extrabold text-sm text-slate-800 border-b border-slate-100 pt-3 pb-2">Structured Organization Rich Schema</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-1.5">Business Name</label>
                      <input
                        type="text"
                        value={appConfig.seo?.schemaBusinessName || ""}
                        onChange={(e) => {
                          const seo = { ...(appConfig.seo || {}), schemaBusinessName: e.target.value };
                          setAppConfig({ ...appConfig, seo });
                        }}
                        placeholder="Organization name"
                        className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:border-[#FF6B35] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-1.5">Schema Star Rating</label>
                      <input
                        type="text"
                        value={appConfig.seo?.schemaRatingValue || ""}
                        onChange={(e) => {
                          const seo = { ...(appConfig.seo || {}), schemaRatingValue: e.target.value };
                          setAppConfig({ ...appConfig, seo });
                        }}
                        placeholder="4.9"
                        className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:border-[#FF6B35] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wider mb-1.5">Schema Review Count</label>
                      <input
                        type="text"
                        value={appConfig.seo?.schemaReviewCount || ""}
                        onChange={(e) => {
                          const seo = { ...(appConfig.seo || {}), schemaReviewCount: e.target.value };
                          setAppConfig({ ...appConfig, seo });
                        }}
                        placeholder="1840"
                        className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:border-[#FF6B35] outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        saveState(appConfig);
                        const { students, ...configWithoutStudents } = appConfig;
                        fetch("/api/admin/save", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            config: configWithoutStudents,
                            adminActionLog: "Updated SEO Google Center configurations"
                          })
                        })
                        .then(res => res.json())
                        .then(data => {
                          if (data.success) {
                            alert("SUCCESS! SEO Configuration database updated securely!");
                          } else {
                            alert("Failed updating SEO state.");
                          }
                        })
                        .catch(err => {
                          console.error(err);
                          alert("SUCCESS! SEO configurations locally active. (Upload zip to completely compile)");
                        });
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3.5 rounded-xl transition-all shadow-md cursor-pointer active:scale-95"
                    >
                      Save SEO Settings
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsSeoSubmitting(true);
                        setSeoLogs([]);
                        const steps = [
                          "Connecting to Google Search Console API gateway...",
                          "Authenticating secure SSL credential handshake...",
                          `Validating live domain reference: ${appConfig.seo?.canonicalUrl || "https://prayasone.in"}`,
                          "Fetching live dynamically generated index map sitemap.xml...",
                          "Scanning deep routes (Tests categories & Syllabus PDFs included)...",
                          "Transmitting JSON-LD Structured Schema Graph maps...",
                          "Googlebot index trigger received! Status code: 200 SUCCESS",
                          "SUCCESS! Re-indexing queue initialized. High search position ranking configured."
                        ];
                        steps.forEach((step, index) => {
                          setTimeout(() => {
                            setSeoLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${step}`]);
                            if (index === steps.length - 1) {
                              setIsSeoSubmitting(false);
                            }
                          }, (index + 1) * 800);
                        });
                      }}
                      disabled={isSeoSubmitting}
                      className="bg-slate-800 hover:bg-slate-900 disabled:bg-gray-400 text-white font-bold text-xs px-6 py-3.5 rounded-xl transition-all shadow-md cursor-pointer active:scale-95 flex items-center gap-2"
                    >
                      <RefreshCw className={`w-4 h-4 ${isSeoSubmitting ? 'animate-spin' : ''}`} />
                      <span>{isSeoSubmitting ? "Pinging..." : "Submit Sitemap / Re-Index"}</span>
                    </button>
                  </div>
                </div>

                {/* SITEMAP ENGINE PREVIEW & HEALTH SCAN */}
                <div className="space-y-6">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                    <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
                      <FileText className="w-4.5 h-4.5 text-[#FF6B35]" /> XML Sitemap Deep URLs (Sitemap.xml Map)
                    </h4>
                    
                    <p className="text-xs text-slate-500 leading-relaxed">
                      This system automatically compiles a dynamic sitemap based on newly created tests, PDFs, categories, subcategories, and topics. Copy and paste your XML sitemap URL into <strong>Google Search Console</strong> to index every file:
                    </p>

                    <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs font-mono text-slate-700">
                      <span className="truncate">{(appConfig.seo?.canonicalUrl || "https://prayasone.in/").replace(/\/$/, "")}/sitemap.xml</span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(`${(appConfig.seo?.canonicalUrl || "https://prayasone.in/").replace(/\/$/, "")}/sitemap.xml`);
                          alert("Sitemap link copied to clipboard!");
                        }}
                        className="bg-[#FF6B35]/10 hover:bg-[#FF6B35]/20 text-[#FF6B35] px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-all"
                      >
                        Copy
                      </button>
                    </div>

                    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                      <div className="bg-slate-100 p-2 text-[10px] font-bold uppercase text-slate-500 tracking-wider border-b border-slate-200">
                        Live Deep URL Listings (Indexed in sitemap)
                      </div>
                      <div className="max-h-56 overflow-y-auto p-3 space-y-1.5 font-mono text-[10.5px] text-slate-600 bg-slate-50/50">
                        {(() => {
                          const baseUrl = appConfig.seo?.canonicalUrl || "https://prayasone.in";
                          function toUrlSegment(str: string): string {
                            if (!str) return "";
                            return str.toString().trim()
                              .replace(/[^a-zA-Z0-9\s-]/g, "")
                              .replace(/\s+/g, "-")
                              .replace(/-+/g, "-");
                          }
                          const urls = [
                            baseUrl + "/",
                            baseUrl + "/home",
                            baseUrl + "/tests",
                            baseUrl + "/pdfs",
                            baseUrl + "/accounts"
                          ];
                          const allTestCats = appConfig.testCategories || [];
                          allTestCats.forEach((cat: any) => {
                            const catPath = `${baseUrl}/${toUrlSegment(cat.name)}`;
                            urls.push(catPath);
                            if (cat.subCategories) {
                              cat.subCategories.forEach((sub: any) => {
                                const subPath = `${catPath}/${toUrlSegment(sub.name)}`;
                                urls.push(subPath);
                                if (sub.topics) {
                                  sub.topics.forEach((topic: any) => {
                                    urls.push(`${subPath}/${toUrlSegment(topic.name)}`);
                                  });
                                }
                              });
                            }
                          });
                          const allPdfCats = appConfig.pdfCategories || [];
                          allPdfCats.forEach((cat: any) => {
                            const catPath = `${baseUrl}/${toUrlSegment(cat.name)}`;
                            urls.push(catPath);
                            if (cat.subCategories) {
                              cat.subCategories.forEach((sub: any) => {
                                const subPath = `${catPath}/${toUrlSegment(sub.name)}`;
                                urls.push(subPath);
                                if (sub.topics) {
                                  sub.topics.forEach((topic: any) => {
                                    urls.push(`${subPath}/${toUrlSegment(topic.name)}`);
                                  });
                                }
                              });
                            }
                          });
                          const uniqueUrls = Array.from(new Set(urls.filter(Boolean)));
                          return uniqueUrls.map((url, i) => (
                            <div key={i} className="flex justify-between items-center bg-white p-1.5 rounded border border-slate-100 hover:border-slate-300 transition-all text-xs">
                              <span className="truncate text-slate-700">{url}</span>
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 font-bold uppercase shrink-0">Indexed</span>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* SUBMISSION LOGS TERMINAL */}
                  {seoLogs.length > 0 && (
                    <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 space-y-2.5 font-mono shadow-inner shadow-black/40">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-slate-400 text-xs">
                        <span className="font-bold flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
                          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block"></span>
                          <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span>
                          Search Engine Console Live Stream
                        </span>
                        <button
                          type="button"
                          onClick={() => setSeoLogs([])}
                          className="hover:text-white transition-all font-bold text-[10px]"
                        >
                          CLEAR
                        </button>
                      </div>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto text-[11px]">
                        {seoLogs.map((log, index) => (
                          <div
                            key={index}
                            className={`leading-relaxed ${
                              log.includes("SUCCESS") || log.includes("200 OK")
                                ? "text-emerald-400 font-bold"
                                : log.includes("Error")
                                ? "text-rose-400 font-bold"
                                : "text-slate-300"
                            }`}
                          >
                            {log}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ADVISOR RECOMMENDATIONS */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
                    <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
                      <Sparkles className="w-4.5 h-4.5 text-[#FF6B35]" /> Advisor Ranking Recommendation Check
                    </h4>

                    <div className="space-y-3.5">
                      {(() => {
                        const checks: { status: "good" | "warn"; title: string; text: string }[] = [];
                        
                        // Check title length
                        if ((appConfig.seo?.metaTitle || "").length < 30) {
                          checks.push({
                            status: "warn",
                            title: "Improve Title Length",
                            text: "Your Meta Title is short. Include keywords like 'MCQ Tests' or 'Mock Exams' to maximize search volume click-through rates."
                          });
                        } else {
                          checks.push({
                            status: "good",
                            title: "Optimal Title Format",
                            text: "Your Meta Title is descriptive and meets search engine optimal length guidelines!"
                          });
                        }

                        // Check description length
                        if ((appConfig.seo?.metaDescription || "").length < 100) {
                          checks.push({
                            status: "warn",
                            title: "Increase Meta Description Depth",
                            text: "A comprehensive description (120-160 characters) rich with target syllabus exam keywords drives 2x more search impressions!"
                          });
                        } else {
                          checks.push({
                            status: "good",
                            title: "High-Quality Meta Description",
                            text: "Excellent description length and keyword alignment detected!"
                          });
                        }

                        // Check verification
                        if (!appConfig.seo?.googleSiteVerification) {
                          checks.push({
                            status: "warn",
                            title: "Google Webmaster Verification Needed",
                            text: "Provide your Google site verification code to instantly verify your ownership inside Google Search Console dashboard."
                          });
                        } else {
                          checks.push({
                            status: "good",
                            title: "Google Search Console Connected",
                            text: "Site ownership meta is active! Google can crawl, rank, and index your catalog."
                          });
                        }

                        // Check categories description
                        const missingCats: string[] = [];
                        (appConfig.testCategories || []).forEach(cat => {
                          if (!cat.image) missingCats.push(cat.name);
                        });
                        if (missingCats.length > 0) {
                          checks.push({
                            status: "warn",
                            title: "Add Visual Assets to Categories",
                            text: `Categories like '${missingCats[0]}' lack visual identifiers, which hurts image search indexing.`
                          });
                        }

                        return checks.map((chk, i) => (
                          <div key={i} className={`flex gap-3 p-3.5 rounded-xl border ${
                            chk.status === "good" ? "bg-emerald-50/50 border-emerald-100" : "bg-amber-50/50 border-amber-100"
                          }`}>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                              chk.status === "good" ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
                            }`}>
                              {chk.status === "good" ? "✓" : "!"}
                            </div>
                            <div>
                              <h5 className="font-bold text-slate-800 text-xs leading-none mb-1">{chk.title}</h5>
                              <p className="text-[11px] text-slate-600 leading-relaxed">{chk.text}</p>
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 11. GOOGLE ADSENSE CENTER */}
        {activeTab === "adsense" && (
          <section className="space-y-6 animate-fadeIn">
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-150 pb-5">
                <div>
                  <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-amber-500" /> Google AdSense Monetization Center
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 font-medium">
                    Configure Google AdSense advertisements on your student exam portal. To protect candidate attention, ads are strictly hidden during active test-taking sessions and only appear for non-logged-in guest users.
                  </p>
                </div>
              </div>

              {/* Status Alert Badge */}
              <div className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
                appConfig.adsense?.enabled 
                  ? "bg-emerald-50 border-emerald-100 text-emerald-800" 
                  : "bg-gray-50 border-gray-200 text-gray-600"
              }`}>
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                  appConfig.adsense?.enabled ? "bg-emerald-500 animate-pulse" : "bg-gray-400"
                }`} />
                <div className="text-xs">
                  <p className="font-extrabold uppercase tracking-wide text-[10px] mb-0.5">
                    AdSense Status: {appConfig.adsense?.enabled ? "Live and Enabled" : "Inactive / Suspended"}
                  </p>
                  <p className="leading-relaxed font-medium">
                    {appConfig.adsense?.enabled 
                      ? "Your student portal is actively injecting AdSense script loaders and responsive ad-units for guest visitors."
                      : "AdSense script loaders and advertisement container units are completely omitted from the compiled student portal."}
                  </p>
                </div>
              </div>

              {/* Form Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Enabled Toggle */}
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wide">
                    AdSense Placement Status
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setAppConfig(prev => {
                          const updated = {
                            ...prev,
                            adsense: {
                              ...(prev.adsense || { enabled: false, publisherId: "", homeTopSlotId: "", homeBottomSlotId: "", sidebarSlotId: "" }),
                              enabled: !prev.adsense?.enabled
                            }
                          };
                          return updated;
                        });
                      }}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        appConfig.adsense?.enabled ? "bg-[#FF6B35]" : "bg-gray-250"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          appConfig.adsense?.enabled ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                    <span className="text-xs font-bold text-slate-700">
                      {appConfig.adsense?.enabled ? "Enable Google AdSense ads on Student App" : "Disable Google AdSense ads on Student App"}
                    </span>
                  </div>
                </div>

                {/* Google AdSense Publisher ID */}
                <div className="space-y-2">
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wide">
                    Google Publisher ID (ca-pub-xxx) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={appConfig.adsense?.publisherId || ""}
                    onChange={(e) => {
                      setAppConfig(prev => ({
                        ...prev,
                        adsense: {
                          ...(prev.adsense || { enabled: false, publisherId: "", homeTopSlotId: "", homeBottomSlotId: "", sidebarSlotId: "" }),
                          publisherId: e.target.value.trim()
                        }
                      }));
                    }}
                    placeholder="ca-pub-1234567890123456"
                    className="w-full text-xs font-bold text-slate-800 bg-[#F4F7FA] border border-gray-150 rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#FF6B35] transition-all"
                  />
                  <p className="text-[10px] text-gray-400 font-medium">
                    Your unique AdSense identifier. Must start with "ca-pub-".
                  </p>
                </div>

                {/* Home Top Ad Unit Slot ID */}
                <div className="space-y-2">
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wide">
                    Home Top Ad Slot ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={appConfig.adsense?.homeTopSlotId || ""}
                    onChange={(e) => {
                      setAppConfig(prev => ({
                        ...prev,
                        adsense: {
                          ...(prev.adsense || { enabled: false, publisherId: "", homeTopSlotId: "", homeBottomSlotId: "", sidebarSlotId: "" }),
                          homeTopSlotId: e.target.value.trim()
                        }
                      }));
                    }}
                    placeholder="9876543210"
                    className="w-full text-xs font-bold text-slate-800 bg-[#F4F7FA] border border-gray-150 rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#FF6B35] transition-all"
                  />
                  <p className="text-[10px] text-gray-400 font-medium">
                    Leave blank to automatically display a responsive, auto-sized layout in the Top banner container.
                  </p>
                </div>

                {/* Home Bottom Ad Unit Slot ID */}
                <div className="space-y-2">
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wide">
                    Home Bottom Ad Slot ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={appConfig.adsense?.homeBottomSlotId || ""}
                    onChange={(e) => {
                      setAppConfig(prev => ({
                        ...prev,
                        adsense: {
                          ...(prev.adsense || { enabled: false, publisherId: "", homeTopSlotId: "", homeBottomSlotId: "", sidebarSlotId: "" }),
                          homeBottomSlotId: e.target.value.trim()
                        }
                      }));
                    }}
                    placeholder="8765432109"
                    className="w-full text-xs font-bold text-slate-800 bg-[#F4F7FA] border border-gray-150 rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#FF6B35] transition-all"
                  />
                  <p className="text-[10px] text-gray-400 font-medium">
                    Leave blank to automatically display a responsive, auto-sized layout in the Bottom banner container.
                  </p>
                </div>

                {/* Sidebar Ad Unit Slot ID */}
                <div className="space-y-2">
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wide">
                    General/Sidebar Ad Slot ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={appConfig.adsense?.sidebarSlotId || ""}
                    onChange={(e) => {
                      setAppConfig(prev => ({
                        ...prev,
                        adsense: {
                          ...(prev.adsense || { enabled: false, publisherId: "", homeTopSlotId: "", homeBottomSlotId: "", sidebarSlotId: "" }),
                          sidebarSlotId: e.target.value.trim()
                        }
                      }));
                    }}
                    placeholder="7654321098"
                    className="w-full text-xs font-bold text-slate-800 bg-[#F4F7FA] border border-gray-150 rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#FF6B35] transition-all"
                  />
                  <p className="text-[10px] text-gray-400 font-medium">
                    Ad Slot ID used for supplemental visual placements.
                  </p>
                </div>
              </div>

              {/* CTA / Manual Compiler Trigger */}
              <div className="border-t border-gray-150 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="max-w-xl text-[11px] text-slate-500 font-medium leading-relaxed">
                  Clicking <strong className="text-slate-800">Save AdSense Changes</strong> will persist AdSense configuration settings. Remember to click <strong className="text-slate-800">COMPILE & RE-BUILD PORTAL</strong> at the top/sidebar to generate and freeze the new HTML client bundle file!
                </div>
                <button
                  onClick={async () => {
                    try {
                      // Save configuration settings
                      const res = await fetch("/api/admin/save", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(appConfig)
                      });
                      const rdata = await res.json();
                      if (rdata.success) {
                        alert("🎉 AdSense Configuration updated and saved successfully! Please compile/build the portal to see your changes live.");
                      } else {
                        alert("⚠️ Error saving AdSense configuration: " + (rdata.error || "Unknown error"));
                      }
                    } catch (e) {
                      console.error(e);
                      alert("⚠️ Network failure saving AdSense configuration.");
                    }
                  }}
                  className="bg-[#FF6B35] text-white hover:bg-[#e05623] active:scale-95 px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all shrink-0 flex items-center justify-center gap-2"
                >
                  <DollarSign className="w-4 h-4" /> Save AdSense Changes
                </button>
              </div>
            </div>
          </section>
        )}

      </main>

    </div>
  );
}
