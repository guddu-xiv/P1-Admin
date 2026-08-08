import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "data", "db.json");
const BACKUPS_DIR = path.join(process.cwd(), "data", "backups");

// Ensure directories exist
if (!fs.existsSync(path.dirname(DB_FILE))) {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
}
if (!fs.existsSync(BACKUPS_DIR)) {
  fs.mkdirSync(BACKUPS_DIR, { recursive: true });
}

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Permissive CORS middleware to allow cross-origin requests from downloaded standalone student apps
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  next();
});

// DB Helper functions
function getDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Error reading database file", e);
  }
  return { config: {}, students: [], analytics: {}, leaderboards: {}, logs: [] };
}

function saveDB(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (e) {
    console.error("Error writing database file", e);
    return false;
  }
}

// Log admin activities
function logAdminAction(action: string, adminName: string = "Super Admin") {
  const db = getDB();
  db.logs = db.logs || [];
  const now = new Date();
  
  // Clean Indian Standard Date/Time components manual padding
  const dateStr = now.toISOString().split("T")[0];
  const timeStr = now.toTimeString().substring(0, 5);

  db.logs.unshift({
    id: "log_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
    action,
    date: dateStr,
    time: timeStr,
    adminName
  });

  // Limit logs to last 1000 items
  if (db.logs.length > 1000) {
    db.logs = db.logs.slice(0, 1000);
  }
  
  saveDB(db);
}

// Automatically create scheduled backups (Daily/Weekly based on dates)
function runAutoBackupSystem() {
  const db = getDB();
  const dateStr = new Date().toISOString().split("T")[0];
  const dailyPath = path.join(BACKUPS_DIR, `auto-daily-backup-${dateStr}.json`);
  
  if (!fs.existsSync(dailyPath)) {
    fs.writeFileSync(dailyPath, JSON.stringify(db, null, 2), "utf-8");
    console.log(`[BACKUP] Automated daily snapshot saved: ${dailyPath}`);
  }
}
setInterval(runAutoBackupSystem, 60 * 60 * 1000); // Trigger every hour to check dates

// ==================== API ENDPOINTS ====================

// Dynamic favicon and logo router for search engine crawlers and browsers
app.get("/logo.svg", (req, res) => {
  const db = getDB();
  const logoUrl = db.config?.logoUrl;
  if (logoUrl && logoUrl !== "https://iili.io/CKMOrGI.md.png") {
    res.redirect(logoUrl);
  } else {
    res.sendFile(path.join(process.cwd(), "public", "logo.svg"));
  }
});

app.get("/favicon.ico", (req, res) => {
  const db = getDB();
  const logoUrl = db.config?.logoUrl;
  if (logoUrl && logoUrl !== "https://iili.io/CKMOrGI.md.png") {
    res.redirect(logoUrl);
  } else {
    res.sendFile(path.join(process.cwd(), "public", "logo.svg"));
  }
});

// Dynamic SEO XML Sitemap engine for Google Search Console & Sitelinks discovery
app.get("/sitemap.xml", (req, res) => {
  const db = getDB();
  const config = db.config || {};
  const baseUrl = (config.seo?.canonicalUrl || "https://prayasone.in").replace(/\/$/, "");
  
  function toUrlSegment(str: string): string {
    if (!str) return "";
    return str.toString().trim()
      .replace(/[^a-zA-Z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  const urls: string[] = [];
  // Primary core tabs that the user wants indexed as Google Sitelinks!
  urls.push(baseUrl + "/");
  urls.push(baseUrl + "/home");
  urls.push(baseUrl + "/tests");
  urls.push(baseUrl + "/pdfs");
  urls.push(baseUrl + "/accounts");

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
    let priority = "0.7";
    if (url === baseUrl + "/") {
      priority = "1.0";
    } else if (url.endsWith("/tests") || url.endsWith("/pdfs") || url.endsWith("/accounts") || url.endsWith("/home")) {
      priority = "0.9";
    }
    
    return `  <url>\n    <loc>${escapedUrl}</loc>\n    <changefreq>daily</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
  }).join("\n");

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlNodes}\n</urlset>`;
  
  res.header("Content-Type", "application/xml");
  res.send(sitemapXml);
});

app.get("/robots.txt", (req, res) => {
  const db = getDB();
  const config = db.config || {};
  const baseUrl = (config.seo?.canonicalUrl || "https://prayasone.in").replace(/\/$/, "");
  const robotsTxt = `User-agent: *\nAllow: /\n\nSitemap: ${baseUrl}/sitemap.xml\n`;
  res.header("Content-Type", "text/plain");
  res.send(robotsTxt);
});

// Helper to generate beautifully styled legal layouts
function getLegalLayout(title: string, content: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Prayas One</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Inter', sans-serif;
      line-height: 1.6;
      color: #1e293b;
      background-color: #f8fafc;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 750px;
      margin: 30px auto;
      padding: 30px;
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.02);
      border: 1px solid #e2e8f0;
    }
    .header {
      border-bottom: 2px solid #f1f5f9;
      padding-bottom: 16px;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .logo {
      width: 44px;
      height: 44px;
      background-color: #FF6B35;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 800;
      font-size: 18px;
    }
    h1 {
      font-size: 24px;
      font-weight: 800;
      color: #0f172a;
      margin: 0;
      letter-spacing: -0.5px;
    }
    .subtitle {
      font-size: 13px;
      color: #64748b;
      margin-top: 2px;
      font-weight: 500;
    }
    h2 {
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
      margin-top: 22px;
      margin-bottom: 8px;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 4px;
    }
    p, li {
      font-size: 14px;
      color: #334155;
      margin-top: 0;
      margin-bottom: 10px;
    }
    ul {
      padding-left: 20px;
      margin-top: 6px;
      margin-bottom: 12px;
    }
    li {
      margin-bottom: 6px;
    }
    .footer {
      margin-top: 30px;
      border-top: 1px solid #f1f5f9;
      padding-top: 16px;
      font-size: 12px;
      color: #64748b;
      text-align: center;
      line-height: 1.5;
    }
    .btn-back {
      display: inline-flex;
      align-items: center;
      padding: 6px 12px;
      background: #f1f5f9;
      color: #334155;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      font-size: 12.5px;
      margin-bottom: 16px;
      transition: background 0.2s;
    }
    .btn-back:hover {
      background: #e2e8f0;
    }
    @media (max-width: 640px) {
      .container {
        margin: 12px;
        padding: 20px;
      }
      h1 {
        font-size: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <a href="/" class="btn-back">← Back to Home</a>
    <div class="header">
      <div class="logo">P1</div>
      <div>
        <h1>${title}</h1>
        <div class="subtitle">Prayas One • Last Updated: July 2026</div>
      </div>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      &copy; 2026 Prayas One (prayasone.in). All rights reserved.<br>
      For compliance, copyright declarations, or query resolutions, reach out at <a href="mailto:good4xo@gmail.com" style="color: #FF6B35; text-decoration: none; font-weight: 600;">good4xo@gmail.com</a>
    </div>
  </div>
</body>
</html>`;
}

// 1. Privacy Policy route
app.get("/privacy-policy", (req, res) => {
  const content = `
    <p>Welcome to <strong>Prayas One</strong> (accessible at <a href="https://prayasone.in" style="color: #FF6B35; text-decoration: none; font-weight: 600;">https://prayasone.in</a>). We are fully committed to protecting the privacy of our students and portal visitors.</p>
    
    <h2>1. Information We Collect</h2>
    <p>To provide high-quality practice and testing services, we utilize:</p>
    <ul>
      <li><strong>Aspirant Portals:</strong> Emails and mobile numbers provided during student registration to facilitate secure access control.</li>
      <li><strong>Practice Analytics:</strong> Mock test scores, correct/incorrect responses, progress charts, and performance scorecard statistics.</li>
      <li><strong>Local State Synchronization:</strong> Bookmarks and saved questions stored locally to provide fluid study sessions.</li>
    </ul>

    <h2>2. Google AdSense & Cookies</h2>
    <p>We display advertising units provided by <strong>Google AdSense</strong>:</p>
    <ul>
      <li>Google uses cookies to serve ads on <strong>https://prayasone.in</strong> based on prior visits.</li>
      <li>Advertising cookies allow Google and its partners to serve relevant, personalized advertisements.</li>
      <li>You can choose to opt out of personalized advertising by visiting <a href="https://settings.google.com/ads" target="_blank" style="color: #FF6B35; text-decoration: none; font-weight: 600;">Google Ads Settings</a>.</li>
    </ul>

    <h2>3. How We Use Information</h2>
    <p>All stored data is strictly used to authenticate users, display student dashboards, generate leaderboard ranking lists, and deliver context-aware support. We never sell, lease, or share registration data with external advertisers.</p>
  `;
  res.send(getLegalLayout("Privacy Policy", content));
});

// 2. Terms & Conditions route
app.get("/terms-conditions", (req, res) => {
  const content = `
    <p>These terms and conditions outline the usage rules for the <strong>Prayas One</strong> platform at <a href="https://prayasone.in" style="color: #FF6B35; text-decoration: none; font-weight: 600;">https://prayasone.in</a>.</p>
    
    <h2>1. Platform Access</h2>
    <p>By accessing this website, you agree to these terms. Access to our paid practice test packages and premium mock examination papers is exclusively reserved for registered, authorized aspirants.</p>

    <h2>2. Account Security & Concurrent Limits</h2>
    <ul>
      <li>Credentials must be kept strictly confidential. Sharing login credentials with third parties is prohibited.</li>
      <li>Our system uses security monitors to detect concurrent session access and automatically log out any concurrent sessions.</li>
    </ul>

    <h2>3. Intellectual Property Rights</h2>
    <p>All content compiled on this platform is owned by Prayas One. You are prohibited from republishing, copying, scraping, or distributing mock questions, exam answers, or platform assets to third parties without prior written consent.</p>
  `;
  res.send(getLegalLayout("Terms & Conditions", content));
});

// 3. Disclaimer route
app.get("/disclaimer", (req, res) => {
  const content = `
    <p>For any queries regarding our site disclosures, please email us at <strong>good4xo@gmail.com</strong>.</p>
    
    <h2>1. Educational and Self-Practice Purposes Only</h2>
    <p>All mock exam sets, practice questions, bilingual worksheets, and scorecard metrics on <strong>https://prayasone.in</strong> are published in good faith for personal self-evaluation and competitive test preparation.</p>

    <h2>2. Strict No-Government Affiliation Declaration</h2>
    <p style="background: #fef2f2; border: 1.5px solid #fee2e2; padding: 14px; border-radius: 12px; font-weight: 600; color: #991b1b; line-height: 1.5;">
      <strong>NOTICE:</strong> Prayas One is an <strong>independent, privately managed educational portal</strong>. We are <strong>NOT affiliated, associated, or officially connected</strong> with any state or central government organization, public service commission, or exam recruitment board (such as SSC, UPSC, RRB, Banking Boards, etc.). All materials are privately prepared to assist student self-study.
    </p>

    <h2>3. Third-Party Links & Disclaimers</h2>
    <p>We do not control the content or policies of third-party reference links or advertisements, which should be visited at the user's discretion.</p>
  `;
  res.send(getLegalLayout("Legal Disclaimer", content));
});

// 4. Copyright Policy / Originality Statement route
app.get("/copyright-policy", (req, res) => {
  const content = `
    <p>At <strong>Prayas One</strong>, we hold ourselves to the highest standards of academic integrity and originality. This Copyright and Original Content Policy explains how we design and safeguard our educational resources.</p>
    
    <h2>1. 100% Original & Self-Created Questions</h2>
    <p>We take pride in our study and test materials. All mock test papers, competitive practice sets, question databases, bilingual explanations, and scorecard materials published on <a href="https://prayasone.in" style="color: #FF6B35; text-decoration: none; font-weight: 600;">https://prayasone.in</a> are:</p>
    <ul>
      <li><strong>Independently Curated:</strong> Designed and drafted from scratch by our in-house educators and administrators.</li>
      <li><strong>No Copied Content:</strong> We do not copy, scrape, or lift question banks from other online portals, publications, or books.</li>
      <li><strong>Unique Explanations:</strong> Every single problem is backed by originally written bilingual steps, notes, and rationales to provide premium learning quality.</li>
    </ul>

    <h2>2. Protection of Original Materials</h2>
    <p>All intellectual property rights are fully reserved under Prayas One. Any unauthorized redistribution, commercial usage, or public scraping of our mock tests will be met with immediate termination of access and legal remedies under copyright protection laws.</p>

    <h2>3. Respect for Others' IP</h2>
    <p>We respect intellectual property rights. If you believe any material on our portal mistakenly duplicates existing educational property, please notify us immediately with supporting details at <strong>good4xo@gmail.com</strong> for prompt review.</p>
  `;
  res.send(getLegalLayout("Original Content & Copyright Policy", content));
});

// Secure Date/Time verification route
app.get("/api/time", (req, res) => {
  res.json({ timestamp: Date.now() });
});

// Retrieve whole state (Used by admin)
app.get("/api/admin/db", (req, res) => {
  res.json(getDB());
});

// Save whole config or part (Used by admin)
app.post("/api/admin/save", (req, res) => {
  const payload = req.body;
  const db = getDB();
  
  if (payload.config) {
    db.config = payload.config;
    if (db.config && db.config.students) {
      delete db.config.students;
    }
  }
  if (payload.students) db.students = payload.students;
  if (payload.analytics) db.analytics = payload.analytics;
  if (payload.leaderboards) db.leaderboards = payload.leaderboards;
  if (payload.logs) db.logs = payload.logs;

  const saved = saveDB(db);
  if (saved) {
    logAdminAction(payload.adminActionLog || "Updated dynamic system configuration");
    res.json({ success: true, message: "System state has been updated securely." });
  } else {
    res.status(500).json({ success: false, message: "Could not write to disk write limits." });
  }
});

// Logs Endpoint
app.get("/api/admin/logs", (req, res) => {
  const db = getDB();
  res.json(db.logs || []);
});

app.post("/api/admin/logs", (req, res) => {
  const { action, adminName } = req.body;
  logAdminAction(action, adminName);
  res.json({ success: true });
});

// Student configuration fetching (used by student app)
app.get("/api/config", (req, res) => {
  const db = getDB();
  
  // Send back config stripped of students file details to never leak them!
  // Send coupons and active student references
  const strippedConfig = JSON.parse(JSON.stringify(db.config || {}));
  if (strippedConfig && strippedConfig.students) {
    delete strippedConfig.students;
  }
  
  // Satisfies "Student CSV data must never be exposed publicly"
  res.json({
    config: strippedConfig,
    studentsCount: (db.students || []).length
  });
});

// Verify Premium Member Authentications (Security verified server-side!)
app.post("/api/auth/login", (req, res) => {
  const { emailOrMobile, password } = req.body;
  if (!emailOrMobile || !password) {
    return res.status(400).json({ success: false, message: "Missing credentials fields." });
  }

  const db = getDB();
  const matched = (db.students || []).find(
    (s: any) => s.emailOrMobile && s.emailOrMobile.trim().toLowerCase() === emailOrMobile.trim().toLowerCase() && s.password && s.password.toString().trim() === password.toString().trim()
  );

  if (matched) {
    // Generate new unique session token
    const newSessionToken = "sess_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();
    matched.sessionToken = newSessionToken;
    saveDB(db); // Save back to db.json!

    // Audit active membership duration
    const today = new Date();
    const todayClean = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const purchase = matched.purchaseDate ? new Date(matched.purchaseDate) : new Date();
    const expiry = matched.expiryDate ? new Date(matched.expiryDate) : null;

    let remainingDays = 0;
    let isExpired = false;

    if (expiry) {
      const expiryClean = new Date(expiry.getFullYear(), expiry.getMonth(), expiry.getDate());
      const diffTime = expiryClean.getTime() - todayClean.getTime();
      remainingDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      isExpired = remainingDays <= 0;
    } else {
      remainingDays = 365; // standard
    }

    res.json({
      success: true,
      user: {
        id: matched.id,
        name: matched.name,
        emailOrMobile: matched.emailOrMobile,
        purchaseDate: matched.purchaseDate,
        expiryDate: matched.expiryDate,
        unlockedCategoryIds: matched.unlockedCategoryIds || [],
        categoryDates: matched.categoryDates || {},
        membershipStatus: isExpired ? "expired" : "active",
        remainingDays,
        sessionToken: newSessionToken // Return token!
      }
    });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials. Unauthorized access." });
  }
});

// Verify user premium details instantly on actions (Strict date and validity checking)
app.post("/api/premium/verify", (req, res) => {
  const { userId, sessionToken } = req.body;
  const db = getDB();
  const matched = (db.students || []).find((s: any) => s.id === userId);

  if (matched) {
    const today = new Date();
    const expiry = matched.expiryDate ? new Date(matched.expiryDate) : null;
    let isExpired = false;

    if (expiry) {
      const todayClean = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const expiryClean = new Date(expiry.getFullYear(), expiry.getMonth(), expiry.getDate());
      isExpired = expiryClean.getTime() < todayClean.getTime();
    }

    // Single session concurrent login validation
    if (sessionToken && matched.sessionToken && matched.sessionToken !== sessionToken) {
      return res.json({
        success: true,
        active: false,
        status: "logged_out",
        message: "You have been logged in from another device or window."
      });
    }

    res.json({
      success: true,
      active: !isExpired,
      status: isExpired ? "expired" : "active",
      user: {
        id: matched.id,
        name: matched.name,
        emailOrMobile: matched.emailOrMobile,
        purchaseDate: matched.purchaseDate,
        expiryDate: matched.expiryDate,
        unlockedCategoryIds: matched.unlockedCategoryIds || [],
        categoryDates: matched.categoryDates || {},
        membershipStatus: isExpired ? "expired" : "active",
        sessionToken: matched.sessionToken
      }
    });
  } else {
    res.json({ success: false, active: false });
  }
});

const DUMMY_NAMES = [
  "Amit Sharma", "Priya Patel", "Rohan Verma", "Sneha Gupta", "Vikram Singh",
  "Anjali Joshi", "Deepak Kumar", "Manish Mishra", "Karan Malhotra", "Preeti Sen",
  "Aditya Rao", "Meera Nair", "Rahul Yadav", "Sunita Choudhary", "Abhishek Das",
  "Suresh Raina", "Neha Sharma", "Rajesh Khanna", "Pooja Hegde", "Siddharth Malhotra"
];

// Student exam leaderboard endpoints (Trophy board)
app.post("/api/leaderboard", (req, res) => {
  const { testId, activeRecord } = req.body;
  if (!testId || !activeRecord) {
    return res.status(400).json({ success: false, message: "Invalid leaderboard submission" });
  }

  const db = getDB();
  db.leaderboards = db.leaderboards || {};
  
  // Clear old dummies and regenerate to match the exact test marks scale of the submission!
  let list = db.leaderboards[testId] || [];
  const userSubmissions = list.filter((r: any) => r && r.studentName && !DUMMY_NAMES.includes(r.studentName) && r.studentName !== activeRecord.studentName);
  
  const totalPossible = activeRecord.totalMarksPossible || 100;
  const newList = [...userSubmissions];
  
  // Pick a random count of dummy competitors (10 to 14)
  const shuffled = [...DUMMY_NAMES].sort(() => 0.5 - Math.random());
  const count = 10 + Math.floor(Math.random() * 5);
  
  for (let i = 0; i < count; i++) {
    const dName = shuffled[i];
    // Generate scores ranging from 35% to 95% of total score
    const pct = 0.35 + Math.random() * 0.60;
    const dMarks = Math.max(0, Math.min(totalPossible, Math.round(pct * totalPossible)));
    const dSecs = 150 + Math.floor(Math.random() * 700);
    const minutes = Math.floor(dSecs / 60);
    const seconds = dSecs % 60;
    const durationStr = `${minutes} min ${seconds} sec`;
    
    newList.push({
      studentName: dName,
      score: dMarks,
      obtainedMarks: dMarks,
      totalMarksPossible: totalPossible,
      attemptNum: 1,
      duration: durationStr,
      date: new Date().toISOString().split("T")[0],
      timeTaken: dSecs
    });
  }
  
  // Check if activeRecord (user's current submission) is better than their previous one
  const existingUserIdx = newList.findIndex((r: any) => r && r.studentName === activeRecord.studentName);
  if (existingUserIdx !== -1) {
    const oldRec = newList[existingUserIdx];
    const isBetter = activeRecord.obtainedMarks > (oldRec.obtainedMarks || 0) ||
                     (activeRecord.obtainedMarks === (oldRec.obtainedMarks || 0) && activeRecord.timeTaken < (oldRec.timeTaken || Infinity));
    if (isBetter) {
      newList[existingUserIdx] = activeRecord;
    }
  } else {
    newList.push(activeRecord);
  }
  
  // Sort everything: 1. Higher marks, 2. Shorter time, 3. Attempt number
  newList.sort((a: any, b: any) => {
    const m_a = a.obtainedMarks || 0;
    const m_b = b.obtainedMarks || 0;
    if (m_b !== m_a) return m_b - m_a;
    const t_a = a.timeTaken || 0;
    const t_b = b.timeTaken || 0;
    if (t_a !== t_b) return t_a - t_b;
    return (a.attemptNum || 1) - (b.attemptNum || 1);
  });
  
  db.leaderboards[testId] = newList;
  saveDB(db);
  res.json({ success: true, leaderboard: newList });
});

// Fetch active leaderboards for a test
app.get("/api/leaderboard/:testId", (req, res) => {
  const { testId } = req.params;
  const db = getDB();
  db.leaderboards = db.leaderboards || {};
  let list = db.leaderboards[testId] || [];
  
  // If leaderboard is fresh or empty, pre-populate standard candidates on get!
  if (list.length < 5) {
    const defaultTotalPossible = 100;
    const shuffled = [...DUMMY_NAMES].sort(() => 0.5 - Math.random());
    const count = 10 + Math.floor(Math.random() * 5);
    const existingUserSubmissions = list.filter((r: any) => r && r.studentName && !DUMMY_NAMES.includes(r.studentName));
    const newList = [...existingUserSubmissions];
    
    for (let i = 0; i < count; i++) {
       const dName = shuffled[i];
       const pct = 0.45 + Math.random() * 0.45; // 45% to 90%
       const dMarks = Math.round(pct * defaultTotalPossible);
       const dSecs = 150 + Math.floor(Math.random() * 600);
       const minutes = Math.floor(dSecs / 60);
       const seconds = dSecs % 60;
       const durationStr = `${minutes} min ${seconds} sec`;
       
       newList.push({
         studentName: dName,
         score: dMarks,
         obtainedMarks: dMarks,
         totalMarksPossible: defaultTotalPossible,
         attemptNum: 1,
         duration: durationStr,
         date: new Date().toISOString().split("T")[0],
         timeTaken: dSecs
       });
    }
    
    newList.sort((a: any, b: any) => {
      const m_a = a.obtainedMarks || 0;
      const m_b = b.obtainedMarks || 0;
      if (m_b !== m_a) return m_b - m_a;
      const t_a = a.timeTaken || 0;
      const t_b = b.timeTaken || 0;
      if (t_a !== t_b) return t_a - t_b;
      return (a.attemptNum || 1) - (b.attemptNum || 1);
    });
    
    db.leaderboards[testId] = newList;
    saveDB(db);
    list = newList;
  }
  
  res.json(list);
});

// Student Activity & Performance Analytics
app.get("/api/admin/analytics", (req, res) => {
  const db = getDB();
  res.json(db.analytics || {});
});

app.post("/api/analytics/submit", (req, res) => {
  const { email, obtainedScore, totalScore, timeTakenSecs } = req.body;
  if (!email) return res.status(400).json({ success: false });

  const db = getDB();
  db.analytics = db.analytics || {};
  
  const studentProfile = db.analytics[email] || {
    totalTestsAttempted: 0,
    bestScore: 0,
    averageScore: 0,
    highestRank: 999,
    totalTimeSpent: 0,
    lastActivityDate: ""
  };

  const count = studentProfile.totalTestsAttempted;
  studentProfile.totalTestsAttempted = count + 1;
  studentProfile.bestScore = Math.max(studentProfile.bestScore, obtainedScore);
  studentProfile.totalTimeSpent += timeTakenSecs;
  studentProfile.averageScore = parseFloat(((studentProfile.averageScore * count + obtainedScore) / (count + 1)).toFixed(2));
  studentProfile.lastActivityDate = new Date().toISOString().split("T")[0];

  db.analytics[email] = studentProfile;
  saveDB(db);
  res.json({ success: true, profile: studentProfile });
});

// Sync saved questions across student devices
app.get("/api/student/saved-questions", (req, res) => {
  const { emailOrMobile } = req.query;
  if (!emailOrMobile) {
    return res.status(400).json({ success: false, message: "Missing email or mobile" });
  }
  const db = getDB();
  const student = (db.students || []).find(
    (s: any) => s.emailOrMobile && s.emailOrMobile.trim().toLowerCase() === (emailOrMobile as string).trim().toLowerCase()
  );
  if (student) {
    res.json({ success: true, savedQuestions: student.savedQuestions || [] });
  } else {
    res.json({ success: true, savedQuestions: [] });
  }
});

app.post("/api/student/saved-questions", (req, res) => {
  const { emailOrMobile, savedQuestions } = req.body;
  if (!emailOrMobile) {
    return res.status(400).json({ success: false, message: "Missing email or mobile" });
  }
  const db = getDB();
  const student = (db.students || []).find(
    (s: any) => s.emailOrMobile && s.emailOrMobile.trim().toLowerCase() === (emailOrMobile as string).trim().toLowerCase()
  );
  if (student) {
    student.savedQuestions = savedQuestions || [];
    saveDB(db);
    res.json({ success: true, message: "Saved questions synced successfully" });
  } else {
    res.status(404).json({ success: false, message: "Student not found" });
  }
});

// Fetch historical attempts for a specific student name across all leaderboards (Feature 25 & 26)
app.get("/api/student/attempts/:studentName", (req, res) => {
  const { studentName } = req.params;
  const db = getDB();
  const results: any[] = [];
  
  const leaderboards = db.leaderboards || {};
  Object.keys(leaderboards).forEach(testId => {
    const records = leaderboards[testId] || [];
    records.forEach((rec: any) => {
      if (rec.studentName && rec.studentName.toLowerCase() === studentName.toLowerCase()) {
        // Try to match test Title
        let quizTitle = testId;
        const productsVisible = db.config?.products || [];
        productsVisible.forEach((prod: any) => {
          if (prod.id === testId) quizTitle = prod.title;
        });

        results.push({
          testId: testId,
          quizTitle: quizTitle,
          score: rec.score,
          correct: rec.correct,
          incorrect: rec.incorrect,
          duration: rec.duration,
          date: rec.date
        });
      }
    });
  });

  res.json({ success: true, attempts: results });
});

// Backup & Recovery System APIs
app.get("/api/admin/backups", (req, res) => {
  try {
    const files = fs.readdirSync(BACKUPS_DIR).filter(f => f.endsWith(".json"));
    const backupList = files.map(file => {
      const filePath = path.join(BACKUPS_DIR, file);
      const stat = fs.statSync(filePath);
      return {
        filename: file,
        size: (stat.size / 1024).toFixed(1) + " KB",
        createdAt: stat.mtime.toISOString().replace("T", " ").substring(0, 16)
      };
    });
    // Add current db.json in listing
    res.json(backupList);
  } catch (e) {
    res.status(500).json({ success: false, message: "Directory reading failed" });
  }
});

app.post("/api/admin/backup/create", (req, res) => {
  const { customName } = req.body;
  try {
    const db = getDB();
    const cleanName = (customName || "manual-backup").replace(/[^a-zA-Z0-9_-]/g, "");
    const dateStr = new Date().toISOString().split("T")[0];
    const timeStr = Date.now();
    const filename = `manual-${cleanName}-${dateStr}-${timeStr}.json`;
    const dest = path.join(BACKUPS_DIR, filename);

    fs.writeFileSync(dest, JSON.stringify(db, null, 2), "utf-8");
    logAdminAction(`Created manual database backup snapshot: ${filename}`);
    res.json({ success: true, filename });
  } catch (e) {
    res.status(500).json({ success: false, message: "Backup creation failed" });
  }
});

app.post("/api/admin/backup/restore", (req, res) => {
  const { filename } = req.body;
  try {
    const src = path.join(BACKUPS_DIR, filename);
    if (!fs.existsSync(src)) {
      return res.status(404).json({ success: false, message: "Backup file not found" });
    }

    const data = JSON.parse(fs.readFileSync(src, "utf-8"));
    saveDB(data);
    logAdminAction(`Restored active system database state from backup: ${filename}`);
    res.json({ success: true, message: "Database state completely restored." });
  } catch (e) {
    res.status(500).json({ success: false, message: "Restoration failed structural verify." });
  }
});

app.get("/api/admin/backup/download/:filename", (req, res) => {
  const { filename } = req.params;
  const src = path.join(BACKUPS_DIR, filename);
  if (fs.existsSync(src)) {
    res.download(src);
  } else {
    res.status(404).send("Backup file not found");
  }
});

// ==================== BIND SERVER ====================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Vite Dev Mode Middleware mount and routing
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static files router
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SERVER] Full-Stack PRAYAS ONE Backend online at http://localhost:${PORT}`);
  });
}

startServer();
