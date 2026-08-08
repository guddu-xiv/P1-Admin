import { AppConfig } from "../types";

export function generateStudentHTML(config: AppConfig, base64Config: string, serverOrigin: string = ""): string {
  const seo = config.seo || {};
  const metaTitle = seo.metaTitle || `${config.appName || "Prayas One Professional Hub"} - Elite MCQ Practice & Mock Test Portal`;
  const metaDescription = seo.metaDescription || `Welcome to ${config.appName || "Prayas One Professional Hub"}. India's leading digital education center for bilingual MCQ practice, simulated online CBT exam portals, offline Blackbooks, study material PDFs, and deep learning analytics.`;
  const metaKeywords = seo.metaKeywords || "Prayas One, Prayas One Professional Hub, prayasone, prayasone.in, prayasone.in student, Prayas One App, Blackbook, ssc mock series, cgl cbt mockup, previous worksheets pdf, online exam testing, learn, test series";
  const canonicalUrl = seo.canonicalUrl || "https://prayasone.in/";
  const ogImage = seo.ogImage || config.logoUrl || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=300";
  const author = seo.author || config.appName || "Prayas One Professional Hub";
  const googleSiteVerification = seo.googleSiteVerification || config.social.googleVerificationId || "k7WEweulUiwAmqV3D5oVNzLu528Ib-B5VT4s4F2f4";
  const bingSiteVerification = seo.bingSiteVerification || "";
  const schemaBusinessName = seo.schemaBusinessName || config.appName || "Prayas One Professional Hub";
  const schemaRatingValue = seo.schemaRatingValue || "4.9";
  const schemaReviewCount = seo.schemaReviewCount || "1840";

  // Dynamically generate Course and Quiz schemas for added tests!
  let dynamicQuizSchemas = "";
  try {
    const list: any[] = [];
    if (config.testCategories && Array.isArray(config.testCategories)) {
      config.testCategories.forEach(cat => {
        if (cat.subCategories && Array.isArray(cat.subCategories)) {
          cat.subCategories.forEach(sub => {
            if (sub.topics && Array.isArray(sub.topics)) {
              sub.topics.forEach(topic => {
                if (topic.test) {
                  list.push({
                    "@context": "https://schema.org",
                    "@type": "Quiz",
                    "name": topic.test.title,
                    "description": topic.test.instructions || `Practice online CBT MCQ test on ${topic.name}. Download pdf or attempt interactive questions with feedback.`,
                    "educationalAlignment": {
                      "@type": "AlignmentObject",
                      "alignmentType": "educationalSubject",
                      "targetName": topic.name
                    },
                    "learningResourceType": "Exam",
                    "aggregateRating": {
                      "@type": "AggregateRating",
                      "ratingValue": schemaRatingValue,
                      "reviewCount": schemaReviewCount
                    },
                    "publisher": {
                      "@type": "Organization",
                      "name": schemaBusinessName,
                      "logo": config.logoUrl
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
    if (list.length > 0) {
      dynamicQuizSchemas = list.map(item => `    <script type="application/ld+json">${JSON.stringify(item)}</script>`).join("\n");
    }
  } catch(e){}

  // Dynamically generate Book schemas for PDFs!
  let dynamicBookSchemas = "";
  try {
    const list: any[] = [];
    if (config.pdfCategories && Array.isArray(config.pdfCategories)) {
      config.pdfCategories.forEach(cat => {
        if (cat.subCategories && Array.isArray(cat.subCategories)) {
          cat.subCategories.forEach(sub => {
            if (sub.topics && Array.isArray(sub.topics)) {
              sub.topics.forEach(topic => {
                if (topic.pdf) {
                  list.push({
                    "@context": "https://schema.org",
                    "@type": "CreativeWork",
                    "name": topic.pdf.title,
                    "description": `Download study guide and educational worksheet PDF for ${topic.name}. Prepare effectively.`,
                    "publisher": {
                      "@type": "Organization",
                      "name": schemaBusinessName
                    },
                    "educationalUse": "Study Guide",
                    "aggregateRating": {
                      "@type": "AggregateRating",
                      "ratingValue": schemaRatingValue,
                      "reviewCount": schemaReviewCount
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
    if (list.length > 0) {
      dynamicBookSchemas = list.map(item => `    <script type="application/ld+json">${JSON.stringify(item)}</script>`).join("\n");
    }
  } catch(e){}

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>${metaTitle}</title>
    
    ${config.adsense?.enabled && config.adsense?.publisherId ? `
    <!-- Google AdSense API Client Initialization -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.adsense.publisherId}" crossorigin="anonymous"></script>
    ` : ''}
    
    <meta name="description" content="${metaDescription}">
    <meta name="keywords" content="${metaKeywords}">
    <meta name="author" content="${author}">
    <meta name="robots" content="index, follow">
    <meta name="google-site-verification" content="${googleSiteVerification}">
    ${bingSiteVerification ? `<meta name="msvalidate.01" content="${bingSiteVerification}">` : ""}
    <link rel="canonical" href="${canonicalUrl}">

    <!-- Favicon and App Logo Metadata for Search Engines & Browsers -->
    <link rel="icon" type="image/svg+xml" href="${config.logoUrl || '/logo.svg'}" />
    <link rel="shortcut icon" href="${config.logoUrl || '/logo.svg'}" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="${config.logoUrl || '/logo.svg'}" />

    <!-- Open Graph (Facebook / WhatsApp / Telegram) -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="${metaTitle}">
    <meta property="og:description" content="${metaDescription}">
    <meta property="og:image" content="${ogImage}">
    <meta property="og:site_name" content="${config.appName || 'Prayas One Professional Hub'}">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:title" content="${metaTitle}">
    <meta property="twitter:description" content="${metaDescription}">
    <meta property="twitter:image" content="${ogImage}">

    <!-- Schema.org JSON-LD Structured Data for Rich Snippet & Google Sitelinks -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "${schemaBusinessName}",
      "alternateName": "Prayas One",
      "url": "${canonicalUrl}",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "${canonicalUrl}?search={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
    </script>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Portal Navigation Channels",
      "itemListElement": [
        {
          "@type": "SiteNavigationElement",
          "position": 1,
          "name": "Home",
          "description": "Primary student dashboard highlighting notifications, saved exam prep booklets, and latest board notices.",
          "url": "${canonicalUrl}home"
        },
        {
          "@type": "SiteNavigationElement",
          "position": 2,
          "name": "Tests",
          "description": "Simulate real computer based mock examinations, previous year papers, and performance card analytics.",
          "url": "${canonicalUrl}tests"
        },
        {
          "@type": "SiteNavigationElement",
          "position": 3,
          "name": "PDFs",
          "description": "Read official lesson books, dynamic worksheets, solutions manuals, and complete reference PDF blackbooks offline.",
          "url": "${canonicalUrl}pdfs"
        },
        {
          "@type": "SiteNavigationElement",
          "position": 4,
          "name": "Accounts",
          "description": "View student profile subscription license, payment transaction receipts, and solved exams history.",
          "url": "${canonicalUrl}accounts"
        }
      ]
    }
    </script>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": "${schemaBusinessName}",
      "description": "${metaDescription}",
      "logo": "${config.logoUrl || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=300'}",
      "url": "${canonicalUrl}",
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "INR",
        "lowPrice": "0",
        "highPrice": "${config.social.paymentAmount ? config.social.paymentAmount.replace(/[^0-9]/g, '') : '499'}"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "${schemaRatingValue}",
        "bestRating": "5",
        "worstRating": "1",
        "ratingCount": "${schemaReviewCount}"
      }
    }
    </script>
    
${dynamicQuizSchemas}
${dynamicBookSchemas}
    
    <!-- Google Fonts Imports -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Sahitya:wght@400;700&display=swap" rel="stylesheet">
    
    <!-- Phosphor Icons -->
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/css/style.css">
    <script src="https://unpkg.com/@phosphor-icons/web"></script>

    <!-- MathJax Configuration & Script for beautiful math typesetting -->
    <script>
    window.MathJax = {
      tex: {
        inlineMath: [['\\\\(', '\\\\)'], ['$', '$']],
        displayMath: [['\\\\[', '\\\\]'], ['$$', '$$']],
        processEscapes: true,
        processEnvironments: true
      },
      options: {
        skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']
      }
    };
    </script>
    <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>

    <style>
        :root {
            --primary: #FFB800;
            --primary-light: #FFF8E7;
            --dark: #111111;
            --light-grey: #FAF9F6;
            --border-color: #EFECE6;
            --green: #2ecc71;
            --blue: #3498db;
            --grey-text: #7f8c8d;
            --tap-active-bg: rgba(255, 184, 0, 0.22);
        }

        /* Fluid, Butter-Smooth Transitions for premium tap effects on all interactive elements */
        button,
        .outline-item-card,
        .option-button,
        .bottom-nav-item,
        .header-action-btn,
        .back-nav-btn,
        .category-card,
        .accordion-header,
        .opt-box,
        .notif-card,
        .notif-banner,
        .analysis-opt-box,
        .bottom-item,
        .social-link-btn,
        .library-card,
        .review-badge-btn,
        .btn-fill-prime,
        .drawer-sheet,
        .apk-download-banner {
            transition: background-color 0.22s cubic-bezier(0.4, 0, 0.2, 1),
                        border-color 0.22s cubic-bezier(0.4, 0, 0.2, 1),
                        color 0.22s cubic-bezier(0.4, 0, 0.2, 1),
                        box-shadow 0.22s cubic-bezier(0.4, 0, 0.2, 1),
                        transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
        }

        /* Seamless Active Tap Color Effect - works beautifully in both Days and Night modes */
        button:active,
        .outline-item-card:active,
        .option-button:active,
        .bottom-nav-item:active,
        .header-action-btn:active,
        .back-nav-btn:active,
        .category-card:active,
        .accordion-header:active,
        .opt-box:active,
        .notif-card:active,
        .notif-banner:active,
        .analysis-opt-box:active,
        .bottom-item:active,
        .social-link-btn:active,
        .library-card:active,
        .review-badge-btn:active,
        .btn-fill-prime:active,
        #themeToggleBtn:active,
        #bellIconBtn:active,
        .apk-download-banner:active {
            background-color: var(--tap-active-bg) !important;
            border-color: var(--primary) !important;
            box-shadow: 0 4px 14px rgba(255, 184, 0, 0.14) !important;
            transform: scale(0.96) !important;
            opacity: 0.95 !important;
        }

        /* High Contrast Guarantee: White-on-Yellow is extremely hard to read. Any element with a yellow background must have dark black text. */
        [style*="background: var(--primary)"],
        [style*="background:var(--primary)"],
        [style*="background: #FFB800"],
        [style*="background:#FFB800"],
        [style*="background: #ffb800"],
        [style*="background:#ffb800"] {
            color: #111111 !important;
        }

        /* Dark Mode Theme Overrides */
        body.dark-mode {
            background-color: #0e1015 !important;
            color: #f1f5f9 !important;
        }
        
        .dark-mode {
            --dark: #f8fafc;
            --light-grey: #171a22;
            --border-color: rgba(255, 255, 255, 0.08);
            --grey-text: #94a3b8;
            --tap-active-bg: rgba(255, 184, 0, 0.22);
            background-color: #0e1015 !important;
            color: #f1f5f9 !important;
        }

        /* Target inline text colors and automatically brighten them in dark-mode */
        .dark-mode [style*="color: #1e293b"],
        .dark-mode [style*="color:#1e293b"],
        .dark-mode [style*="color: #475569"],
        .dark-mode [style*="color:#475569"],
        .dark-mode [style*="color: #334155"],
        .dark-mode [style*="color:#334155"],
        .dark-mode [style*="color: #0f172a"],
        .dark-mode [style*="color:#0f172a"],
        .dark-mode [style*="color: #64748b"],
        .dark-mode [style*="color:#64748b"],
        .dark-mode [style*="color: #57606f"],
        .dark-mode [style*="color:#57606f"] {
            color: #f1f5f9 !important;
        }

        .dark-mode [style*="color: #b45309"],
        .dark-mode [style*="color:#b45309"] {
            color: #fbbf24 !important;
        }

        /* Dynamic Theme and Visibility Guardians for specific inline styles in dark-mode */
        .dark-mode div[style*="background: #ffffff"]:not(.app-logo):not(#displayPayQrImage),
        .dark-mode div[style*="background:#ffffff"]:not(.app-logo):not(#displayPayQrImage),
        .dark-mode div[style*="background: #fff"]:not(.app-logo):not(#displayPayQrImage),
        .dark-mode div[style*="background:#fff"]:not(.app-logo):not(#displayPayQrImage),
        .dark-mode div[style*="background-color: #ffffff"]:not(.app-logo):not(#displayPayQrImage),
        .dark-mode div[style*="background-color:#ffffff"]:not(.app-logo):not(#displayPayQrImage),
        .dark-mode div[style*="background-color: #fff"]:not(.app-logo):not(#displayPayQrImage),
        .dark-mode div[style*="background-color:#fff"]:not(.app-logo):not(#displayPayQrImage) {
            background-color: #171a22 !important;
            background: #171a22 !important;
            color: #f1f5f9 !important;
            border-color: rgba(255, 255, 255, 0.08) !important;
        }

        .dark-mode div[style*="background: #f8fafc"],
        .dark-mode div[style*="background:#f8fafc"],
        .dark-mode div[style*="background-color: #f8fafc"],
        .dark-mode div[style*="background-color:#f8fafc"],
        .dark-mode div[style*="background: #f1f5f9"],
        .dark-mode div[style*="background:#f1f5f9"],
        .dark-mode div[style*="background-color: #f1f5f9"],
        .dark-mode div[style*="background-color:#f1f5f9"],
        .dark-mode div[style*="background: #eef1f6"],
        .dark-mode div[style*="background:#eef1f6"],
        .dark-mode div[style*="background: #fafafa"],
        .dark-mode div[style*="background:#fafafa"] {
            background-color: #1c202a !important;
            background: #1c202a !important;
            color: #f1f5f9 !important;
            border-color: rgba(255, 255, 255, 0.08) !important;
        }

        .dark-mode div[style*="background: #fffbeb"],
        .dark-mode div[style*="background:#fffbeb"],
        .dark-mode div[style*="background: #fffde7"],
        .dark-mode div[style*="background:#fffde7"],
        .dark-mode div[style*="background: #fef3c7"],
        .dark-mode div[style*="background:#fef3c7"] {
            background-color: #261f12 !important;
            background: #261f12 !important;
            color: #fbbf24 !important;
            border-color: #b45309 !important;
        }

        .dark-mode div[style*="background: #e1f5fe"],
        .dark-mode div[style*="background:#e1f5fe"] {
            background-color: #0f2742 !important;
            background: #0f2742 !important;
            color: #93c5fd !important;
            border-color: #1e3a5f !important;
        }

        .dark-mode div[style*="background: #f1f2f6"],
        .dark-mode div[style*="background:#f1f2f6"] {
            background-color: #1d212b !important;
            background: #1d212b !important;
            color: #f1f5f9 !important;
            border-color: rgba(255, 255, 255, 0.08) !important;
        }

        .dark-mode div[style*="background: #fef2f2"],
        .dark-mode div[style*="background:#fef2f2"],
        .dark-mode div[style*="background: #fee2e2"],
        .dark-mode div[style*="background:#fee2e2"] {
            background-color: #441c1c !important;
            background: #441c1c !important;
            color: #fca5a5 !important;
            border-color: #ef4444 !important;
        }

        /* Button adaptive overrides in dark mode */
        .dark-mode button {
            background-color: #1c202a !important;
            color: #ffffff !important;
            border-color: rgba(255, 255, 255, 0.12) !important;
        }
        
        .dark-mode button.btn-fill-prime,
        .dark-mode .btn-fill-prime,
        .dark-mode button[style*="background: var(--primary)"],
        .dark-mode button[style*="background:var(--primary)"],
        .dark-mode button[style*="background: #FFB800"],
        .dark-mode button[style*="background:#FFB800"] {
            background-color: #FFB800 !important;
            background: #FFB800 !important;
            color: #111111 !important;
            border-color: #FFB800 !important;
        }

        /* Comprehensive Day/Night Visibility Guardians */
        .dark-mode body,
        .dark-mode .screen,
        .dark-mode .drawer-sheet,
        .dark-mode .modal-box,
        .dark-mode .custom-dialog {
            background-color: #0e1015 !important;
            color: #f1f5f9 !important;
        }

        .dark-mode h1,
        .dark-mode h2,
        .dark-mode h3,
        .dark-mode h4,
        .dark-mode h5,
        .dark-mode h6,
        .dark-mode strong {
            color: #ffffff !important;
        }

        .dark-mode p,
        .dark-mode span,
        .dark-mode label,
        .dark-mode li {
            color: #f1f5f9 !important;
        }

        /* Ensure modal boxes and overlay children are perfectly legible in dark mode */
        .dark-mode #websitePopupOverlayModal h1, .dark-mode #websitePopupOverlayModal h2, .dark-mode #websitePopupOverlayModal h3, .dark-mode #websitePopupOverlayModal h4, .dark-mode #websitePopupOverlayModal p, .dark-mode #websitePopupOverlayModal span,
        .dark-mode #paymentSuccessPopupModal h1, .dark-mode #paymentSuccessPopupModal h2, .dark-mode #paymentSuccessPopupModal h3, .dark-mode #paymentSuccessPopupModal h4, .dark-mode #paymentSuccessPopupModal p, .dark-mode #paymentSuccessPopupModal span,
        .dark-mode #premiumBlockerModal h1, .dark-mode #premiumBlockerModal h2, .dark-mode #premiumBlockerModal h3, .dark-mode #premiumBlockerModal h4, .dark-mode #premiumBlockerModal p, .dark-mode #premiumBlockerModal span,
        .dark-mode #testPauseResumeModal h1, .dark-mode #testPauseResumeModal h2, .dark-mode #testPauseResumeModal h3, .dark-mode #testPauseResumeModal h4, .dark-mode #testPauseResumeModal p, .dark-mode #testPauseResumeModal span,
        .dark-mode #submitConfirmModal h1, .dark-mode #submitConfirmModal h2, .dark-mode #submitConfirmModal h3, .dark-mode #submitConfirmModal h4, .dark-mode #submitConfirmModal p, .dark-mode #submitConfirmModal span,
        .dark-mode #reportQuestionModal h1, .dark-mode #reportQuestionModal h2, .dark-mode #reportQuestionModal h3, .dark-mode #reportQuestionModal h4, .dark-mode #reportQuestionModal p, .dark-mode #reportQuestionModal span,
        .dark-mode #paymentSuccessModal h1, .dark-mode #paymentSuccessModal h2, .dark-mode #paymentSuccessModal h3, .dark-mode #paymentSuccessModal h4, .dark-mode #paymentSuccessModal p, .dark-mode #paymentSuccessModal span,
        .dark-mode #scr-pay h1, .dark-mode #scr-pay h2, .dark-mode #scr-pay h3, .dark-mode #scr-pay h4, .dark-mode #scr-pay p, .dark-mode #scr-pay span, .dark-mode #scr-pay label {
            color: #ffffff !important;
        }

        /* Keep indicator colors clean and properly legible on dark mode backgrounds */
        .dark-mode .text-green,
        .dark-mode [style*="color: #22c55e"],
        .dark-mode [style*="color:#22c55e"],
        .dark-mode [style*="color: green"],
        .dark-mode [style*="color: rgb(34, 197, 94)"] {
            color: #2ecc71 !important;
        }
        .dark-mode .text-red,
        .dark-mode [style*="color: #ef4444"],
        .dark-mode [style*="color:#ef4444"],
        .dark-mode [style*="color: red"],
        .dark-mode [style*="color: rgb(239, 68, 68)"] {
            color: #ff6b35 !important;
        }
        .dark-mode .text-blue,
        .dark-mode [style*="color: #3b82f6"],
        .dark-mode [style*="color:#3b82f6"],
        .dark-mode [style*="color: blue"],
        .dark-mode [style*="color: rgb(59, 130, 246)"] {
            color: #3498db !important;
        }
        .dark-mode .text-purple,
        .dark-mode [style*="color: #a855f7"],
        .dark-mode [style*="color:#a855f7"],
        .dark-mode [style*="color: rgb(168, 85, 247)"] {
            color: #a855f7 !important;
        }
        .dark-mode .text-yellow,
        .dark-mode [style*="color: #eab308"],
        .dark-mode [style*="color:#eab308"],
        .dark-mode [style*="color: rgb(234, 179, 8)"] {
            color: #FFB800 !important;
        }

        .dark-mode .grey-text,
        .dark-mode [style*="color: rgba(255,255,255,0.5)"],
        .dark-mode [style*="color:rgba(255,255,255,0.5)"],
        .dark-mode [style*="color: rgba(0,0,0,0.5)"],
        .dark-mode [style*="color:rgba(0,0,0,0.5)"] {
            color: #A09E96 !important;
        }

        /* Input and form controls proper visibility */
        .dark-mode .form-input,
        .dark-mode input,
        .dark-mode select,
        .dark-mode textarea {
            background-color: #181818 !important;
            color: #ffffff !important;
            border: 1px solid #3A3A38 !important;
        }

        .dark-mode .form-input::placeholder,
        .dark-mode input::placeholder,
        .dark-mode textarea::placeholder {
            color: #666666 !important;
        }
        
        .dark-mode .header, .dark-mode .mainHeader {
            background: rgba(24, 24, 24, 0.95) !important;
            border: 1px solid #1c1c1e !important;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3) !important;
        }

        .dark-mode .greet-title, .dark-mode .greet-sub {
            color: #ffffff !important;
        }

        .dark-mode .back-nav-bar {
            background: rgba(24, 24, 24, 0.95) !important;
            border: 1px solid #1c1c1e !important;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3) !important;
        }

        .dark-mode .category-card, .dark-mode .accordion-item, .dark-mode .faq-item, .dark-mode .block-card, .dark-mode .notif-card {
            background-color: #181818 !important;
            border: 1px solid #2A2A28 !important;
            color: #ffffff !important;
        }

        .dark-mode .section-header h3, .dark-mode .section-header p, .dark-mode .section-title, .dark-mode .category-title {
            color: #ffffff !important;
        }

        .dark-mode select, .dark-mode input, .dark-mode textarea {
            background-color: #181818 !important;
            border: 1px solid #3A3A38 !important;
            color: #ffffff !important;
        }

        .dark-mode td, .dark-mode th {
            border-bottom: 1px solid #2A2A28 !important;
            color: #ffffff !important;
        }

        .dark-mode tr {
            background-color: transparent !important;
        }

        .dark-mode #mainFooter, .dark-mode .footer {
            background-color: #181818 !important;
            border-top: 1px solid #2A2A28 !important;
        }

        .dark-mode .app-logo {
            background-color: #ffffff !important;
            background: #ffffff !important;
            border-color: #ededed !important;
        }

        .dark-mode .qr-image-frame,
        .dark-mode #displayPayQrImage {
            background-color: #ffffff !important;
            background: #ffffff !important;
            border-color: #ededed !important;
            padding: 5px !important;
        }

        .dark-mode .bottom-nav-bar {
            background: rgba(24, 24, 24, 0.95) !important;
            border: 1px solid #1c1c1e !important;
            box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4), 0 4px 12px rgba(0, 0, 0, 0.2) !important;
        }

        .dark-mode .bottom-nav-item {
            color: #8e8e93;
        }

        .dark-mode .bottom-nav-item.active {
            background: rgba(255, 184, 0, 0.18) !important;
            color: #FFB800 !important;
        }

        .dark-mode .info-bullets {
            background: #181818 !important;
            border-color: #2c2c2e !important;
            color: #f1f2f6 !important;
        }

        .dark-mode #couponEntrySection {
            background: #1c1505 !important;
            border-color: #5d3f04 !important;
            color: #fbbf24 !important;
        }

        .dark-mode .btn-fill-prime,
        .dark-mode button[style*="background: var(--dark)"],
        .dark-mode button[style*="background:var(--dark)"] {
            background-color: #ffffff !important;
            background: #ffffff !important;
            color: #121212 !important;
        }

        .dark-mode .scorecard-block {
            background: linear-gradient(135deg, #1e272e 0%, #0f172a 100%) !important;
            border: 1px solid #2c2c2e !important;
            color: #ffffff !important;
        }

        .dark-mode #scr-pay div[style*="linear-gradient"] {
            background: linear-gradient(135deg, #1e272e 0%, #0f172a 100%) !important;
        }

        .dark-mode div[style*="background: #fef2f2"] {
            background: #4c1d1d !important;
            border-color: #ef4444 !important;
            color: #fca5a5 !important;
        }
        .dark-mode div[style*="background: #fef2f2"] p {
            color: #fca5a5 !important;
        }

        .dark-mode .outline-item-card,
        .dark-mode .library-card,
        .dark-mode .social-link-btn,
        .dark-mode .review-badge-btn,
        .dark-mode .bookmark-group-card,
        .dark-mode .palette-cell,
        .dark-mode .drawer-sheet,
        .dark-mode #analysisDetailViewerCard,
        .dark-mode .analysis-detail-modal {
            background-color: #181818 !important;
            background: #181818 !important;
            color: #f1f2f6 !important;
            border-color: #2A2A28 !important;
        }

        .dark-mode #test-engine-panel {
            background-color: #111111 !important;
            color: #ffffff !important;
        }

        .dark-mode .engine-header, 
        .dark-mode .engine-footer {
            background: rgba(28, 28, 30, 0.85) !important;
            border: 1.5px solid rgba(255, 255, 255, 0.08) !important;
            box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4), 0 4px 12px rgba(0, 0, 0, 0.2) !important;
            color: #ffffff !important;
        }

        .dark-mode #testEngineName,
        .dark-mode .engine-title-group,
        .dark-mode .engine-title-group h5,
        .dark-mode .engine-title-group div {
            color: #ffffff !important;
        }

        .dark-mode #test-engine-panel h1,
        .dark-mode #test-engine-panel h2,
        .dark-mode #test-engine-panel h3,
        .dark-mode #test-engine-panel h4,
        .dark-mode #test-engine-panel h5,
        .dark-mode #test-engine-panel h6,
        .dark-mode #test-engine-panel p,
        .dark-mode #test-engine-panel div,
        .dark-mode #test-engine-panel span,
        .dark-mode #test-engine-panel label {
            color: #ffffff !important;
        }

        /* Instructions Screen and Bullet items styling in dark mode */
        .dark-mode #scr-instructions,
        .dark-mode #scr-instructions h2,
        .dark-mode #scr-instructions .info-bullets,
        .dark-mode #scr-instructions .inst-item,
        .dark-mode #scr-instructions .inst-item div,
        .dark-mode #scr-instructions .inst-item strong,
        .dark-mode #scr-instructions .inst-item span {
            color: #ffffff !important;
        }

        .dark-mode #scr-instructions .inst-item p {
            color: #a4b0be !important;
        }

        .dark-mode #test-engine-panel #testTimerText {
            color: var(--primary) !important;
        }

        .dark-mode .engine-btn-nav {
            background-color: #181818 !important;
            background: #181818 !important;
            color: #ffffff !important;
            border-color: #2A2A28 !important;
        }

        .dark-mode .review-badge-btn {
            background-color: #181818 !important;
            background: #181818 !important;
            color: #ffffff !important;
            border-color: #2A2A28 !important;
        }

        .dark-mode .option-button {
            background: #181818 !important;
            border-color: #2A2A28 !important;
            color: #f1f2f6 !important;
        }

        .dark-mode .option-button:hover {
            background: #222220 !important;
        }

        .dark-mode .option-button.selected {
            background: rgba(255, 184, 0, 0.15) !important;
            border-color: var(--primary) !important;
        }

        .dark-mode .analysis-explanation-box {
            background: #111e2e !important;
            border: 1px solid #1e3a5f !important;
            color: #93c5fd !important;
        }

        .dark-mode .analysis-question-box {
            background: #181818 !important;
            border: 1px solid #2A2A28 !important;
            color: #ffffff !important;
        }

        .dark-mode .analysis-opt-box {
            background: #181818 !important;
            border-color: #2A2A28 !important;
            color: #ffffff !important;
        }

        .dark-mode .analysis-opt-a,
        .dark-mode .analysis-opt-b,
        .dark-mode .analysis-opt-c,
        .dark-mode .analysis-opt-d,
        .dark-mode .analysis-opt-e {
            background-color: #181818 !important;
            border-color: #2A2A28 !important;
            color: #ffffff !important;
        }

        .dark-mode .analysis-opt-box.correct {
            border-color: #2ed573 !important;
            background-color: rgba(46, 213, 115, 0.15) !important;
            color: #2ed573 !important;
        }

        .dark-mode .analysis-opt-box.wrong {
            border-color: #ef4444 !important;
            background-color: rgba(239, 68, 68, 0.15) !important;
            color: #f87171 !important;
        }

        .dark-mode .option-analysis-expandable-box {
            background-color: #121212 !important;
            border: 1.5px solid #2a2a2a !important;
            color: #94a3b8 !important;
        }

        .dark-mode .oa-box-a,
        .dark-mode .oa-box-b,
        .dark-mode .oa-box-c,
        .dark-mode .oa-box-d,
        .dark-mode .oa-box-e {
            background-color: #121212 !important;
            border: 1.5px solid #2a2a2a !important;
            color: #94a3b8 !important;
        }

        .dark-mode .oa-box-correct {
            background-color: rgba(34, 197, 94, 0.08) !important;
            border: 1.5px solid rgba(34, 197, 94, 0.3) !important;
            color: #4ade80 !important;
        }

        .dark-mode .oa-box-wrong {
            background-color: rgba(239, 68, 68, 0.08) !important;
            border: 1.5px solid rgba(239, 68, 68, 0.3) !important;
            color: #f87171 !important;
        }

        .dark-mode .engine-question-source {
            background: #1c1505 !important;
            border-left: 4px solid #b45309 !important;
            color: #fbbf24 !important;
        }

        .dark-mode [style*="background: white"]:not(img),
        .dark-mode [style*="background:white"]:not(img),
        .dark-mode [style*="background: #ffffff"]:not(img),
        .dark-mode [style*="background:#ffffff"]:not(img),
        .dark-mode [style*="background: #fff"]:not(img),
        .dark-mode [style*="background:#fff"]:not(img),
        .dark-mode [style*="background-color: white"]:not(img),
        .dark-mode [style*="background-color:white"]:not(img),
        .dark-mode [style*="background-color: #ffffff"]:not(img),
        .dark-mode [style*="background-color:#ffffff"]:not(img),
        .dark-mode [style*="background-color: #fff"]:not(img),
        .dark-mode [style*="background-color:#fff"]:not(img),
        .dark-mode [style*="background: rgb(255, 255, 255)"]:not(img),
        .dark-mode [style*="background:rgb(255, 255, 255)"]:not(img),
        .dark-mode [style*="background-color: rgb(255, 255, 255)"]:not(img),
        .dark-mode [style*="background-color:rgb(255, 255, 255)"]:not(img) {
            background-color: #181818 !important;
            background: #181818 !important;
            color: #f1f2f6 !important;
            border-color: #2A2A28 !important;
        }

        .dark-mode img#displayPayQrImage {
            background: #ffffff !important;
            border-color: #ffffff !important;
            padding: 5px !important;
        }

        .dark-mode div[style*="background: rgb(0, 0, 0)"],
        .dark-mode div[style*="background:rgb(0, 0, 0)"],
        .dark-mode div[style*="background: black"],
        .dark-mode div[style*="background:black"] {
            background-color: #000000 !important;
        }

        .dark-mode #websitePopupOverlayModal > div,
        .dark-mode #paymentSuccessPopupModal > div,
        .dark-mode #premiumBlockerModal > div,
        .dark-mode #testPauseResumeModal > div,
        .dark-mode #submitConfirmModal > div,
        .dark-mode #reportQuestionModal > div,
        .dark-mode #paymentSuccessModal > div,
        .dark-mode #scr-pay > div {
            background-color: #181818 !important;
            background: #181818 !important;
            color: #f1f2f6 !important;
            border: 1px solid #2A2A28 !important;
        }

        .dark-mode div[style*="background: #fffbeb"],
        .dark-mode div[style*="background:#fffbeb"] {
            background: #201a12 !important;
            color: #fbbf24 !important;
            border-color: #b45309 !important;
        }

        .dark-mode #leaderboardRankAlertBar,
        .dark-mode div[style*="background: #fef3c7"],
        .dark-mode div[style*="background:#fef3c7"] {
            background: #2d1c0c !important;
            color: #fbbf24 !important;
            border-color: #d97706 !important;
        }

        /* Generic custom language font support */
        [class^="lang-"], [class^="lang-"] *, [class^="lang-"] button, [class^="lang-"] span, [class^="lang-"] div {
            font-family: 'Sahitya', serif !important;
        }
        
        .lang-hi, .lang-hi *, .lang-hi button, .lang-hi span, .lang-hi div {
            font-family: 'Sahitya', serif !important;
        }

        /* Anti-Piracy styles */
        @media print {
            body { display: none !important; }
        }
        * {
            box-sizing: border-box;
            -webkit-tap-highlight-color: transparent;
            outline: none;
            user-select: none;
            -webkit-user-select: none;
        }

        button, input, textarea, select {
            font-family: inherit;
        }

        body {
            margin: 0;
            background-color: #ffffff;
            color: var(--dark);
            font-family: 'Sahitya', serif;
            overflow-x: hidden;
            position: relative;
        }

        /* Font switching helpers */
        .lang-en, .lang-en *, .lang-en button, .lang-en span, .lang-en div {
            font-family: 'Sahitya', serif !important;
        }
        
        .lang-hi, .lang-hi *, .lang-hi button, .lang-hi span, .lang-hi div {
            font-family: 'Sahitya', serif !important;
        }

        /* Prevent custom language fonts from breaking Phosphor icons */
        i.ph, i.ph-bold, i.ph-fill, i.ph-regular, [class^="ph-"], [class*=" ph-"] {
            font-family: 'Phosphor' !important;
        }

        /* Screen state controls */
        .screen {
            display: none;
            padding: 20px;
            padding-bottom: 100px;
            max-width: 768px;
            margin: 0 auto;
            animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .screen.active {
            display: block;
        }

        @keyframes slideUp {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes db-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .dark-mode #test-loading-overlay {
            background: #0f172a !important;
        }
        .dark-mode #test-loading-overlay h3 {
            color: #f8fafc !important;
        }

        /* Fixed Navigation Stack Back Button Header */
        .back-nav-bar {
            position: sticky;
            top: 12px;
            background: rgba(255, 255, 255, 0.88);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            z-index: 999;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: 12px;
            padding: 12px 18px !important;
            max-width: calc(100% - 24px);
            margin: 12px auto;
            border: 1.5px solid rgba(0, 0, 0, 0.05);
            border-radius: 20px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .back-nav-btn {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 20px;
            display: flex;
            align-items: center;
            color: var(--primary);
            font-weight: bold;
        }

        /* Headers & Branding styling */
        .header {
            position: sticky;
            top: 12px;
            background: rgba(255, 255, 255, 0.88);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            z-index: 999;
            padding: 12px 18px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border: 1.5px solid rgba(0, 0, 0, 0.05);
            border-radius: 20px;
            max-width: calc(100% - 24px);
            margin: 12px auto;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .app-branding {
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 0;
            flex-grow: 1;
            overflow: hidden;
        }

        .app-logo {
            width: 44px;
            height: 44px;
            border-radius: 12px;
            object-fit: contain;
            border: 1px solid var(--border-color);
            background: #ffffff !important;
            padding: 4px;
            flex-shrink: 0;
        }

        .greetings-box {
            display: flex;
            flex-direction: column;
            min-width: 0;
            overflow: hidden;
            justify-content: center;
        }

        .greet-title {
            margin: 0;
            font-weight: 900;
            font-size: 16px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .greet-sub {
            margin: 0;
            font-size: 10px;
            color: var(--primary);
            font-weight: bold;
            letter-spacing: 0.5px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 1.2;
        }

        @media (max-width: 380px) {
            .greet-sub {
                font-size: 8.5px;
                letter-spacing: 0px;
            }
            .greet-title {
                font-size: 14px;
            }
            .app-logo {
                width: 36px;
                height: 36px;
                border-radius: 9px;
                padding: 2px;
            }
            .app-branding {
                gap: 8px;
            }
            .header {
                padding: 10px 12px;
            }
        }

        /* Notifications style (Zomato/Swiggy style cards) */
        .scrolling-notifications {
            display: flex;
            gap: 15px;
            overflow-x: auto;
            padding: 10px 5px 20px;
            scroll-snap-type: x mandatory;
            scrollbar-width: none;
        }
        .scrolling-notifications::-webkit-scrollbar {
            display: none;
        }

        .notif-card {
            min-width: 280px;
            max-width: 320px;
            background: #ffffff;
            border: 1px solid var(--border-color);
            border-radius: 16px;
            overflow: hidden;
            scroll-snap-align: start;
            box-shadow: 0 4px 12px rgba(0,0,0,0.03);
            display: flex;
            flex-direction: column;
        }

        .notif-banner {
            width: 100%;
            aspect-ratio: 21/9;
            height: auto;
            object-fit: contain;
            background: #ffffff;
        }

        .notif-content {
            padding: 15px;
            display: flex;
            flex-direction: column;
            gap: 6px;
            flex-grow: 1;
        }

        .notif-title {
            margin: 0;
            font-size: 15px;
            font-weight: bold;
        }

        .notif-desc {
            margin: 0;
            font-size: 12px;
            color: var(--grey-text);
            line-height: 1.4;
        }

        .notif-action-btn {
            align-self: flex-start;
            margin-top: 8px;
            padding: 6px 14px;
            background: var(--primary);
            color: white;
            border-radius: 8px;
            text-decoration: none;
            font-size: 11px;
            font-weight: bold;
            transition: opacity 0.2s;
        }

        /* 21:9 Dynamic Sliding Banners */
        .slider-container {
            width: 100%;
            aspect-ratio: 21/9;
            border-radius: 20px; /* Enhanced rounded corners */
            overflow: hidden;
            margin-bottom: 25px;
            position: relative;
            background: #0c0c0b;
            border: 1.5px solid var(--border-color);
            box-shadow: 0 16px 36px -8px rgba(255, 184, 0, 0.12), 0 8px 24px rgba(0, 0, 0, 0.04);
            /* Force GPU layer clipping for WebKit / Chrome desktop compatibility */
            transform: translateZ(0);
            -webkit-mask-image: -webkit-radial-gradient(white, black);
            isolation: isolate;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .slider-container::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.5) 100%);
            z-index: 9;
            pointer-events: none;
            transition: opacity 0.3s ease;
        }

        .slider-container:hover {
            border-color: rgba(255, 184, 0, 0.35);
            box-shadow: 0 20px 45px -8px rgba(255, 184, 0, 0.18), 0 10px 30px rgba(0, 0, 0, 0.06);
        }

        .slides-wrapper {
            display: flex;
            width: 100%;
            height: 100%;
            transition: transform 0.65s cubic-bezier(0.16, 1, 0.3, 1);
            border-radius: 20px;
        }

        .slide-item {
            width: 100%;
            min-width: 100%;
            flex-shrink: 0;
            height: 100%;
            position: relative;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            background: #000000;
            border-radius: 20px;
        }

        .slide-item-blur {
            background-size: cover;
            background-position: center;
            filter: blur(20px) brightness(0.4);
            position: absolute;
            top: -20px;
            left: -20px;
            right: -20px;
            bottom: -20px;
            z-index: 1;
            pointer-events: none;
            opacity: 0.8;
            transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .slide-item-img {
            width: 100%;
            height: 100%;
            object-fit: cover !important;
            z-index: 2;
            position: relative;
            pointer-events: none;
            border-radius: 20px;
            transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Premium cinematic zoom on slide hover */
        .slide-item:hover .slide-item-img {
            transform: scale(1.05);
        }
        .slide-item:hover .slide-item-blur {
            transform: scale(1.08);
        }

        .slider-dots {
            position: absolute;
            bottom: 12px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            max-width: 90%;
            gap: 6px;
            z-index: 12;
        }

        .dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.35);
            border: 0.5px solid rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .dot.active {
            background: var(--primary) !important;
            width: 20px;
            border-radius: 4px;
            box-shadow: 0 0 10px rgba(255, 184, 0, 0.6);
        }

        /* Premium Glassmorphic Slider Navigation Arrows */
        .slider-arrow {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 40px;
            height: 40px;
            background: rgba(0, 0, 0, 0.35);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-size: 18px;
            cursor: pointer;
            z-index: 15;
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            pointer-events: auto;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
        }

        .slider-container:hover .slider-arrow {
            opacity: 1;
        }

        .slider-arrow:hover {
            background: var(--primary);
            color: #111111;
            transform: translateY(-50%) scale(1.08);
            border-color: var(--primary);
            box-shadow: 0 0 15px rgba(255, 184, 0, 0.4);
        }

        .slider-arrow-left {
            left: 12px;
        }

        .slider-arrow-right {
            right: 12px;
        }

        /* Layout Cards */
        .grid-blocks {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 25px;
        }

        .library-card {
            background: #ffffff;
            border-radius: 16px;
            border: 1px solid var(--border-color);
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 14px;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(0,0,0,0.02);
        }

        .library-icon {
            font-size: 32px;
            color: var(--primary);
        }

        .library-info {
            display: flex;
            flex-direction: column;
        }

        .library-info h3 {
            margin: 0;
            font-size: 16px;
            font-weight: bold;
        }

        .library-info p {
            margin: 2px 0 0;
            font-size: 11px;
            color: var(--grey-text);
        }

        /* Pure White design items list style */
        .outline-item-card {
            background: white;
            border-radius: 12px;
            border: 1px solid var(--border-color);
            margin-bottom: 12px;
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 15px;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.01);
            word-break: break-word;
            overflow-wrap: break-word;
        }

        .outline-item-img {
            width: 44px;
            height: 44px;
            border-radius: 10px;
            object-fit: contain;
            background: #ffffff;
            border: 1px solid var(--border-color);
            flex-shrink: 0;
            padding: 2px;
        }

        @keyframes pulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 1; }
        }

        @keyframes premiumBlink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.25; }
        }

        @keyframes altTextFade1 {
            0%, 40% { opacity: 1; transform: translateY(0); }
            45%, 95% { opacity: 0; transform: translateY(-8px); }
            100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes altTextFade2 {
            0%, 40% { opacity: 0; transform: translateY(8px); }
            45%, 90% { opacity: 1; transform: translateY(0); }
            95%, 100% { opacity: 0; transform: translateY(-8px); }
        }

        @keyframes badgeAltTextFade1 {
            0%, 40% { opacity: 1; transform: translateY(0); }
            45%, 95% { opacity: 0; transform: translateY(-15px); }
            100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes badgeAltTextFade2 {
            0%, 40% { opacity: 0; transform: translateY(15px); }
            45%, 90% { opacity: 1; transform: translateY(0); }
            95%, 100% { opacity: 0; transform: translateY(-15px); }
        }

        .outline-item-details {
            flex-grow: 1;
            min-width: 0;
            word-break: break-word;
            overflow-wrap: break-word;
        }

        .outline-item-title {
            margin: 0;
            font-size: 15px;
            font-weight: bold;
            word-break: break-word;
            overflow-wrap: break-word;
        }

        .outline-item-subtitle {
            margin: 2px 0 0;
            font-size: 11px;
            color: var(--grey-text);
            word-break: break-word;
            overflow-wrap: break-word;
        }

        /* Screen Header block */
        .section-header-title {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 18px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        /* Coming soon visual block styling */
        .coming-soon-box {
            border: 2px dashed #dedede;
            border-radius: 16px;
            padding: 30px;
            text-align: center;
            color: #b2bec3;
            font-weight: 900;
            text-transform: uppercase;
            font-size: 13px;
            letter-spacing: 1px;
            margin-top: 15px;
        }

        /* Social Media Connected block */
        .social-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
            gap: 12px;
            margin-top: 15px;
            margin-bottom: 25px;
            width: 100%;
        }

        .social-link-btn {
            background: white;
            border: 1.5px solid var(--border-color);
            border-radius: 14px;
            padding: 10px 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            cursor: pointer;
            text-decoration: none;
            color: var(--dark);
            font-size: 13px;
            font-weight: 800;
            box-shadow: 0 4px 12px rgba(0,0,0,0.02);
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            min-height: 48px;
            flex-shrink: 0;
        }

        .social-link-btn span {
            font-size: 12px;
            font-weight: 800;
            letter-spacing: 0.2px;
        }

        .social-link-btn i {
            font-size: 20px;
            flex-shrink: 0;
        }

        .social-link-btn:hover {
            transform: translateY(-2px) scale(1.03);
            border-color: var(--primary);
            box-shadow: 0 6px 16px rgba(255, 184, 0, 0.15);
            background: var(--light-grey);
        }

        .social-link-btn:active {
            transform: scale(0.96);
            border-color: var(--primary);
        }

        /* Buttons & Forms styling */
        .btn-fill-prime {
            width: 100%;
            background: var(--dark);
            color: white;
            border: none;
            padding: 16px;
            border-radius: 12px;
            font-size: 15px;
            font-weight: 900;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            transition: opacity 0.2s;
        }

        .btn-fill-prime:active {
            opacity: 0.9;
        }

        .form-input {
            width: 100%;
            background: #ffffff;
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 14px 16px;
            font-size: 14px;
            color: var(--dark);
            margin-bottom: 12px;
            transition: border-color 0.2s;
        }

        .form-input:focus {
            border-color: var(--primary);
        }

        /* Instructions list formatting */
        .info-bullets {
            display: flex;
            flex-direction: column;
            gap: 10px;
            background: #ffffff;
            border: 1px solid var(--border-color);
            border-radius: 16px;
            padding: 20px;
            margin: 20px 0;
            font-size: 13px;
            line-height: 1.5;
        }

        .inst-item {
            display: flex;
            gap: 8px;
            align-items: flex-start;
        }

        .inst-item i {
            color: var(--primary);
            font-size: 16px;
            margin-top: 2px;
        }

        /* Locked Premium screen styles */
        .lock-container {
            text-align: center;
            padding: 40px 15px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 15px;
        }

        .qr-image-frame {
            width: 220px;
            height: 220px;
            border-radius: 16px;
            border: 4px solid var(--border-color);
            padding: 10px;
            background: white;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
            object-fit: contain;
            margin: 15px 0;
        }

        /* Test Engine Fullscreen Mode */
        #test-engine-panel {
            position: fixed;
            inset: 0;
            background-color: var(--light-grey);
            z-index: 9999;
            display: none;
            flex-direction: column;
            overflow: hidden;
        }

        #test-engine-panel *:not(i):not([class^="ph"]):not([class*=" ph"]) {
            font-family: 'Sahitya', serif !important;
        }

        .engine-header {
            margin: 12px 12px 6px 12px;
            min-height: 65px;
            height: auto;
            border: 1.5px solid rgba(0, 0, 0, 0.05);
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 18px;
            background: rgba(255, 255, 255, 0.88);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.04);
            position: relative;
            z-index: 10;
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Standard CSS Classes for Modals Cancel/Close Elements - Perfect in both Day & Night modes */
        .modal-cancel-btn {
            background: #f1f2f6; 
            color: #2f3542; 
            border: 1px solid #dfe4ea; 
            border-radius: 12px; 
            padding: 12px 18px; 
            font-weight: bold; 
            font-size: 13px; 
            cursor: pointer; 
            font-family: inherit;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
        }
        .modal-cancel-btn:hover {
            background: #e4e7eb;
        }

        .dark-mode .modal-cancel-btn {
            background: rgba(255, 255, 255, 0.08) !important;
            color: #ffffff !important;
            border: 1.5px solid rgba(255, 255, 255, 0.15) !important;
        }
        .dark-mode .modal-cancel-btn:hover {
            background: rgba(255, 255, 255, 0.15) !important;
        }

        .drawer-close-btn {
            background: #f1f2f6;
            color: #1e272e;
            padding: 8px;
            border-radius: 10px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #dfe4ea;
            transition: all 0.2s ease;
        }
        .drawer-close-btn:hover {
            background: #e4e7eb;
        }

        .dark-mode .drawer-close-btn {
            background: rgba(255, 255, 255, 0.08) !important;
            color: #ffffff !important;
            border: 1.5px solid rgba(255, 255, 255, 0.15) !important;
        }
        .dark-mode .drawer-close-btn:hover {
            background: rgba(255, 255, 255, 0.15) !important;
        }

        .circle-close-btn {
            cursor: pointer; 
            padding: 6px; 
            background: #f1f2f6; 
            border: 1px solid #dfe4ea;
            color: #1e272e;
            border-radius: 50%; 
            width: 28px; 
            height: 28px; 
            display: flex; 
            align-items: center; 
            justify-content: center;
            transition: all 0.2s ease;
        }
        .circle-close-btn:hover {
            background: #e4e7eb;
        }
        .dark-mode .circle-close-btn {
            background: rgba(255, 255, 255, 0.08) !important;
            color: #ffffff !important;
            border: 1.5px solid rgba(255, 255, 255, 0.15) !important;
        }
        .dark-mode .circle-close-btn:hover {
            background: rgba(255, 255, 255, 0.15) !important;
        }

        .close-floating-btn {
            position: absolute; 
            top: 15px; 
            right: 15px; 
            width: 32px; 
            height: 32px; 
            border-radius: 50%; 
            border: none; 
            background: #f1f2f6; 
            color: #1e272e; 
            font-size: 20px; 
            font-weight: bold; 
            cursor: pointer; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            transition: all 0.2s;
        }
        .close-floating-btn:hover {
            background: #e4e7eb;
        }
        .dark-mode .close-floating-btn {
            background: rgba(255, 255, 255, 0.08) !important;
            color: #ffffff !important;
        }
        .dark-mode .close-floating-btn:hover {
            background: rgba(255, 255, 255, 0.15) !important;
        }

        /* Elegant container shape for header action buttons (Theme and Profile) in both Light and Dark mode */
        .header-action-btn {
            background: var(--light-grey) !important;
            border: 1.5px solid var(--border-color) !important;
            width: 38px;
            height: 38px;
            padding: 0px;
            border-radius: 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--dark) !important;
            transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
        }
        
        .header-action-btn:hover {
            background: #eef1f6 !important;
            border-color: #cbd5e1 !important;
            transform: translateY(-1px);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
        }

        .dark-mode .header-action-btn {
            background: rgba(255, 255, 255, 0.08) !important;
            border: 1.5px solid rgba(255, 255, 255, 0.14) !important;
            color: #ffffff !important;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        }

        .dark-mode .header-action-btn:hover {
            background: rgba(255, 255, 255, 0.15) !important;
            border-color: rgba(255, 255, 255, 0.22) !important;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        /* Styling for the detailed analysis previous/next buttons */
        .analysis-nav-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            padding: 9px 15px;
            border-radius: 12px;
            font-size: 12.5px;
            font-weight: 700;
            background: var(--light-grey) !important;
            color: var(--dark) !important;
            border: 1.5px solid var(--border-color) !important;
            cursor: pointer;
            transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
            user-select: none;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
        }

        .analysis-nav-btn:hover:not(:disabled) {
            background: #eef1f6 !important;
            border-color: #cbd5e1 !important;
            transform: translateY(-1px);
            box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }

        .analysis-nav-btn:disabled {
            opacity: 0.35 !important;
            cursor: not-allowed !important;
            background: var(--light-grey) !important;
            border-color: var(--border-color) !important;
            color: var(--grey-text) !important;
        }

        .dark-mode .analysis-nav-btn {
            background: rgba(255, 255, 255, 0.08) !important;
            border: 1.5px solid rgba(255, 255, 255, 0.14) !important;
            color: #ffffff !important;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        }

        .dark-mode .analysis-nav-btn:hover:not(:disabled) {
            background: rgba(255, 255, 255, 0.15) !important;
            border-color: rgba(255, 255, 255, 0.22) !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        .engine-title-group {
            display: flex;
            align-items: center;
            gap: 10px;
            overflow: hidden;
            flex: 1;
            min-width: 0;
        }

        #testEngineName {
            margin: 0;
            font-size: 11.5px;
            font-weight: 850;
            letter-spacing: -0.2px;
            color: var(--dark);
            line-height: 1.35;
            word-break: break-word;
            overflow-wrap: anywhere;
        }
        @media (min-width: 480px) {
            #testEngineName {
                font-size: 12px;
            }
        }
        @media (min-width: 768px) {
            #testEngineName {
                font-size: 13.5px;
            }
        }

        .guidelines-card {
            background: linear-gradient(to bottom, #fafafa, #ffffff);
            border: 1.5px solid var(--border-color);
            border-radius: 20px;
            padding: 20px;
            margin-bottom: 24px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.02);
            text-align: left;
        }

        .dark-mode .guidelines-card {
            background: linear-gradient(to bottom, #181818, #111111) !important;
            border-color: #2A2A28 !important;
        }

        .engine-submit-btn {
            background: var(--primary);
            color: white;
            font-weight: 900;
            border: none;
            border-radius: 8px;
            padding: 8px 16px;
            cursor: pointer;
            font-size: 12px;
        }

        .engine-tools-badge {
            background: var(--light-grey);
            border: 1px solid var(--border-color);
            color: var(--dark) !important;
            padding: 6px 12px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
            font-weight: 800;
            font-size: 12px;
        }

        /* Professional fixed background watermark */
        .watermark-container {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: flex !important;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            pointer-events: none;
            opacity: 0.07;
            z-index: 1;
            width: 100%;
            text-align: center;
        }

        .watermark-img {
            width: 180px;
            height: 180px;
            object-fit: contain;
            border-radius: 24px;
            margin-bottom: 15px;
        }

        .watermark-text {
            font-size: 26px;
            font-weight: 900;
            letter-spacing: 3px;
            color: var(--dark);
            text-transform: uppercase;
        }

        body.dark-mode .watermark-text {
            color: #ffffff !important;
        }

        body.dark-mode .watermark-container {
            opacity: 0.05 !important;
        }

        /* Exam questions container */
        .engine-content {
            flex-grow: 1;
            padding: 24px;
            overflow-y: auto;
            position: relative;
            z-index: 5;
        }

        .engine-question-num {
            font-size: 11px;
            font-weight: 900;
            color: var(--primary);
            letter-spacing: 1px;
            margin-bottom: 8px;
        }

        .engine-question-text {
            font-size: 18px;
            font-weight: bold;
            line-height: 1.5;
            margin-bottom: 25px;
            word-break: break-word;
            overflow-wrap: break-word;
        }

        .option-button {
            width: 100%;
            background: white;
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 16px;
            text-align: left;
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 12px;
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            word-break: break-word;
            overflow-wrap: break-word;
        }

        .option-button span {
            flex: 1;
            min-width: 0;
            word-break: break-word;
            overflow-wrap: break-word;
        }

        .option-button:active {
            transform: scale(0.99);
        }

        .option-button.selected {
            border-color: var(--primary);
            background: var(--primary-light);
            box-shadow: 0 4px 12px rgba(255, 184, 0, 0.05);
        }

        .option-badge {
            width: 24px;
            height: 24px;
            border-radius: 6px;
            border: 1.5px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            font-weight: 900;
            color: var(--grey-text);
            background: transparent;
        }

        .option-button.selected .option-badge {
            background: var(--primary);
            border-color: var(--primary);
            color: white;
        }

        .engine-footer {
            margin: 6px 12px 16px 12px;
            height: 66px;
            border: 1.5px solid rgba(0, 0, 0, 0.05);
            border-radius: 40px; /* Highly curved capsule style requested by the user */
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 20px;
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            box-shadow: 0 12px 35px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.05);
            position: relative;
            z-index: 10;
            transition: all 0.3s;
        }

        @media (max-width: 480px) {
            .engine-footer {
                padding: 0 12px;
                height: 60px;
                margin: 6px 8px 12px 8px;
            }
            .engine-btn-nav {
                width: 40px;
                height: 40px;
                font-size: 16px;
            }
            .review-badge-btn {
                padding: 8px 12px;
                font-size: 10px;
                gap: 4px;
            }
        }

        .engine-btn-nav {
            background: var(--light-grey);
            border: 1px solid var(--border-color);
            border-radius: 10px;
            width: 44px;
            height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 18px;
            color: var(--dark);
        }

        .engine-btn-nav:disabled {
            opacity: 0.4;
            cursor: not-allowed;
        }

        .review-badge-btn {
            background: #ffffff;
            border: 1px solid var(--border-color);
            padding: 10px 18px;
            font-size: 11px;
            color: var(--dark);
            border-radius: 20px;
            font-weight: 900;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .review-badge-btn.active {
            background: var(--blue);
            color: white;
            border-color: var(--blue);
        }

        /* Sliding Bottom Drawers / Modals */
        .drawer-sheet-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.4);
            z-index: 10000;
            display: none;
            backdrop-filter: blur(2px);
        }

        .drawer-sheet {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: white;
            border-radius: 24px 24px 0 0;
            z-index: 10001;
            padding: 25px;
            max-height: 75vh;
            display: none;
            flex-direction: column;
            box-shadow: 0 -10px 30px rgba(0,0,0,0.15);
            animation: drawUpDown 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes drawUpDown {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
        }

        .palette-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 10px;
            overflow-y: auto;
            padding: 15px 0;
            max-height: 40vh;
        }

        .palette-cell {
            aspect-ratio: 1;
            border-radius: 12px;
            border: 2px solid var(--border-color);
            background: white;
            font-size: 14px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s;
        }

        .palette-cell.answered {
            background: var(--green);
            color: white;
            border-color: var(--green);
        }

        .palette-cell.review-marked {
            background: var(--blue);
            color: white;
            border-color: var(--blue);
        }

        .palette-cell.not-visited {
            background: var(--light-grey);
            color: var(--grey-text);
            border-color: var(--border-color);
        }

        .palette-legend {
            display: flex;
            justify-content: space-around;
            padding: 10px 0;
            font-size: 10px;
            border-top: 1px solid var(--border-color);
            margin-top: 10px;
        }

        .legend-item {
            display: flex;
            align-items: center;
            gap: 4px;
            font-weight: bold;
        }

        /* Scorecard visual block styles */
        .scorecard-block {
            background: var(--dark);
            color: white;
            padding: 30px;
            border-radius: 20px;
            text-align: center;
            margin-bottom: 25px;
        }

        .stats-summary-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-top: 20px;
        }

        .stat-badge-cube {
            background: rgba(255, 255, 255, 0.08);
            border-radius: 12px;
            padding: 15px;
            text-align: center;
        }

        .stat-badge-cube p {
            margin: 0;
            font-size: 10px;
            text-transform: uppercase;
            opacity: 0.6;
            letter-spacing: 1px;
            font-weight: bold;
        }

        .stat-badge-cube h4 {
            margin: 5px 0 0;
            font-size: 18px;
            font-weight: bold;
        }

        /* Analysis Question Detail Modals */
        .analysis-detail-modal {
            position: fixed;
            inset: 0;
            background: white;
            z-index: 50000;
            display: none;
            flex-direction: column;
            padding: 24px;
        }

        .analysis-question-box {
            background: var(--light-grey);
            padding: 16px;
            border-radius: 12px;
            border: 1px solid var(--border-color);
            margin-bottom: 20px;
        }

        .analysis-opt-box {
            padding: 14px;
            border-radius: 10px;
            border: 1.5px solid var(--border-color);
            margin-bottom: 8px;
            font-weight: bold;
            background-color: #ffffff !important;
            color: var(--dark) !important;
        }

        .analysis-opt-a,
        .analysis-opt-b,
        .analysis-opt-c,
        .analysis-opt-d,
        .analysis-opt-e {
            background-color: #ffffff !important;
            border-color: var(--border-color) !important;
            color: var(--dark) !important;
        }

        .analysis-opt-box.correct {
            border-color: #2ecc71 !important;
            background-color: #eafaf1 !important;
            color: #155724 !important;
        }

        .analysis-opt-box.wrong {
            border-color: #e74c3c !important;
            background-color: #fdf2f2 !important;
            color: #721c24 !important;
        }

        /* Option analysis expandable box default styles */
        .option-analysis-expandable-box {
            margin-top: 8px;
            padding: 12px;
            border-radius: 8px;
            font-size: 12.5px;
            font-weight: 500;
            line-height: 1.4;
            transition: all 0.2s ease;
            background-color: #f8fafc !important;
            border: 1.5px solid #e2e8f0 !important;
            color: #475569 !important;
        }

        .oa-box-a,
        .oa-box-b,
        .oa-box-c,
        .oa-box-d,
        .oa-box-e {
            background-color: #f8fafc !important;
            border: 1.5px solid #e2e8f0 !important;
            color: #475569 !important;
        }

        .oa-box-correct {
            background-color: #eafaf1 !important;
            border: 1.5px solid #2ecc71 !important;
            color: #155724 !important;
        }

        .oa-box-wrong {
            background-color: #fdf2f2 !important;
            border: 1.5px solid #e74c3c !important;
            color: #721c24 !important;
        }

        .analysis-explanation-box {
            background: #e1f5fe;
            border: 1px solid #b3e5fc;
            padding: 16px;
            border-radius: 12px;
            font-size: 13px;
            color: #0277bd;
            margin-top: 15px;
        }

        /* Bottom Sticky tab bar navigation */
        .bottom-nav-bar {
            position: fixed;
            bottom: 16px;
            left: 50%;
            transform: translateX(-50%);
            width: calc(100% - 32px);
            max-width: 480px;
            height: 66px;
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1.5px solid rgba(0, 0, 0, 0.05);
            border-radius: 40px; /* Highly curved "curved mast sa lage" like the screenshot */
            display: flex;
            justify-content: space-around;
            align-items: center;
            z-index: 1000;
            box-shadow: 0 12px 35px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.05);
            padding: 0 8px;
            transition: all 0.3s;
        }

        .bottom-nav-item {
            text-decoration: none;
            color: #8f9ca2;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            font-weight: 800;
            gap: 2px;
            cursor: pointer;
            height: 52px;
            min-width: 72px;
            border-radius: 26px; /* Pill/capsule background shape */
            transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .bottom-nav-item.active {
            color: var(--primary) !important;
            background: rgba(255, 184, 0, 0.18) !important; /* Premium rich translucent golden glow */
            box-shadow: inset 0 1px 3px rgba(255, 184, 0, 0.12);
        }

        .bottom-nav-item i {
            font-size: 20px;
            transition: transform 0.2s ease;
        }

        .bottom-nav-item.active i {
            transform: translateY(-1px) scale(1.05);
        }

        @media (hover: hover) {
            .bottom-nav-item:hover:not(.active) {
                color: var(--primary);
                background: rgba(255, 184, 0, 0.04);
            }
        }

        /* Account profiles page visual elements */
        .profile-hero {
            background: var(--light-grey);
            border: 1px solid var(--border-color);
            border-radius: 20px;
            padding: 30px;
            text-align: center;
            margin-bottom: 20px;
        }

        .premium-unlocked-badge {
            background: var(--green);
            color: white;
            font-size: 11px;
            font-weight: 900;
            border-radius: 20px;
            padding: 5px 14px;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            margin-top: 10px;
        }

        /* Continuous Dynamic Screen watermark for anti-screenshot */
        .screen-anti-leak-layer {
            display: none !important;
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 999999;
            opacity: 0.025;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: repeat(4, 1fr);
            padding: 30px;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            color: var(--dark);
            font-weight: bold;
        }

        .leak-label {
            transform: rotate(-35deg);
            white-space: nowrap;
        }

        /* Prevent scrollbar lines or outlines during scroll */
        ::-webkit-scrollbar {
            width: 4px;
            height: 4px;
        }
        ::-webkit-scrollbar-track {
            background: transparent !important;
        }
        ::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.1) !important;
            border-radius: 10px !important;
        }
        .dark-mode ::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1) !important;
        }

        /* Premium/Promo Boxes Day & Night Mode Theme */
        .premium-promo-box {
            background: linear-gradient(135deg, #FFF9EB 0%, #FFECD1 100%) !important;
            border: 2px solid #FFD39B !important;
            color: #78350f !important;
            border-radius: 24px;
            padding: 22px;
            box-shadow: 0 10px 25px rgba(255,184,0,0.06);
            margin-bottom: 20px;
            position: relative;
            overflow: hidden;
            text-align: left;
        }
        .premium-promo-box h4 {
            color: #78350f !important;
        }
        .premium-promo-box p {
            color: #92400e !important;
        }
        .premium-promo-box span {
            color: #78350f !important;
        }
        .premium-promo-box .promo-inner {
            background: rgba(255,255,255,0.65) !important;
            border: 1px solid #FFE4C4 !important;
            color: #78350f !important;
        }
        .premium-promo-box .promo-inner div, .premium-promo-box .promo-inner span {
            color: #78350f !important;
        }

        /* Dark mode overrides for Premium Promo Box */
        .dark-mode .premium-promo-box {
            background: linear-gradient(135deg, #2A1F0D 0%, #1A1204 100%) !important;
            border: 2px solid #5C4314 !important;
            color: #FCD34D !important;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3) !important;
        }
        .dark-mode .premium-promo-box h4 {
            color: #FCD34D !important;
        }
        .dark-mode .premium-promo-box p {
            color: #FBBF24 !important;
        }
        .dark-mode .premium-promo-box span {
            color: #FCD34D !important;
        }
        .dark-mode .premium-promo-box .promo-inner {
            background: rgba(42, 31, 13, 0.4) !important;
            border: 1px solid #5C4314 !important;
            color: #FBBF24 !important;
        }
        .dark-mode .premium-promo-box .promo-inner div, .dark-mode .premium-promo-box .promo-inner span {
            color: #FBBF24 !important;
        }

        /* ==========================================
           MASTER RESPONSIVE & ADAPTIVE STYLING SHIELD
           Guarantees stunning layout across all 
           Mobile, Tablet, Laptop, and Desktop Models
           ========================================== */

        /* 1. Global Container Limits & Fluid Transitions */
        @media (max-width: 480px) {
            .screen {
                padding: 12px 12px 90px 12px !important;
            }
            .header, .back-nav-bar {
                padding: 10px 12px !important;
                border-radius: 14px !important;
                margin: 8px auto !important;
                max-width: calc(100% - 16px) !important;
            }
            .app-logo {
                width: 34px !important;
                height: 34px !important;
                border-radius: 8px !important;
            }
            .greet-title {
                font-size: 14.5px !important;
            }
            .greet-sub {
                font-size: 9px !important;
            }
            .back-nav-bar span {
                font-size: 13.5px !important;
            }
            
            /* Tighten outlines and cards list */
            .outline-item-card {
                padding: 12px !important;
                gap: 10px !important;
                border-radius: 10px !important;
                margin-bottom: 10px !important;
            }
            .outline-item-img {
                width: 38px !important;
                height: 38px !important;
                border-radius: 8px !important;
            }
            .outline-item-title {
                font-size: 13.5px !important;
            }
            .outline-item-subtitle {
                font-size: 10.5px !important;
            }
            
            /* Dynamic sliding banners on narrow screens */
            .slider-container {
                border-radius: 14px !important;
                margin-bottom: 16px !important;
            }
            .dot {
                width: 5px !important;
                height: 5px !important;
            }
            .dot.active {
                width: 14px !important;
            }
        }

        /* 2. Tablet Scaling Adjustments */
        @media (min-width: 481px) and (max-width: 1024px) {
            .screen {
                max-width: 90% !important;
                padding: 24px !important;
                padding-bottom: 110px !important;
            }
            .header, .back-nav-bar {
                max-width: 100% !important;
                border-radius: 20px !important;
            }
            .slider-container {
                border-radius: 24px !important;
            }
        }

        /* 3. Laptop & Desktop Optimization */
        @media (min-width: 1025px) {
            .screen {
                max-width: 768px !important; /* Retain focused premium app-like layout centered on desktop */
                box-shadow: 0 4px 30px rgba(0,0,0,0.02) !important;
                border-radius: 32px !important;
                background: rgba(255, 255, 255, 0.4) !important;
                margin-top: 20px !important;
                border: 1.5px solid var(--border-color) !important;
            }
            body.dark-mode .screen {
                background: rgba(24, 24, 24, 0.2) !important;
            }
        }

        /* 4. Bottom Tab Bar Responsiveness */
        @media (max-width: 360px) {
            .bottom-nav-bar {
                height: 58px !important;
                bottom: 8px !important;
                width: calc(100% - 16px) !important;
                padding: 0 4px !important;
            }
            .bottom-nav-item {
                min-width: 56px !important;
                height: 44px !important;
                font-size: 9px !important;
                border-radius: 22px !important;
            }
            .bottom-nav-item i {
                font-size: 16px !important;
            }
        }
        @media (min-width: 1025px) {
            .bottom-nav-bar {
                max-width: 440px !important;
                bottom: 24px !important;
            }
        }

        /* 5. Exam Engine Adaptive Framework */
        @media (max-width: 480px) {
            .engine-header {
                margin: 8px 8px 4px 8px !important;
                border-radius: 14px !important;
                padding: 8px 10px !important;
            }
            .engine-content {
                padding: 14px !important;
            }
            .engine-question-text {
                font-size: 16px !important;
                line-height: 1.45 !important;
                margin-bottom: 18px !important;
            }
            .option-button {
                padding: 12px !important;
                font-size: 13px !important;
                gap: 8px !important;
                margin-bottom: 8px !important;
                border-radius: 10px !important;
            }
            .option-badge {
                width: 22px !important;
                height: 22px !important;
                border-radius: 5px !important;
                font-size: 10px !important;
            }
            .engine-footer {
                height: 56px !important;
                margin: 4px 8px 10px 8px !important;
                border-radius: 28px !important;
            }
        }
        @media (min-width: 1025px) {
            #test-engine-panel {
                max-width: 768px !important;
                margin: auto !important;
                border-left: 1.5px solid var(--border-color) !important;
                border-right: 1.5px solid var(--border-color) !important;
                box-shadow: 0 0 50px rgba(0,0,0,0.08) !important;
            }
        }

        /* 6. Universal Modal Overlay Adaptability & Anti-Clipping Logic */
        #websitePopupOverlayModal,
        #paymentSuccessPopupModal,
        #premiumBlockerModal,
        #testPauseResumeModal,
        #submitConfirmModal,
        #reportQuestionModal,
        #helpdeskModalOverlay,
        #customDialogOverlay,
        #customPromptOverlay,
        #copyrightPdfOverlay {
            overflow-y: auto !important;
            padding: 12px !important;
            box-sizing: border-box !important;
        }

        #websitePopupOverlayModal[style*="display: flex"],
        #paymentSuccessPopupModal[style*="display: flex"],
        #premiumBlockerModal[style*="display: flex"],
        #testPauseResumeModal[style*="display: flex"],
        #submitConfirmModal[style*="display: flex"],
        #reportQuestionModal[style*="display: flex"],
        #helpdeskModalOverlay[style*="display: flex"],
        #customDialogOverlay[style*="display: flex"],
        #customPromptOverlay[style*="display: flex"],
        #copyrightPdfOverlay[style*="display: flex"] {
            display: flex !important;
            align-items: flex-start !important;
            justify-content: center !important;
        }

        @media (min-height: 641px) {
            #websitePopupOverlayModal[style*="display: flex"],
            #paymentSuccessPopupModal[style*="display: flex"],
            #premiumBlockerModal[style*="display: flex"],
            #testPauseResumeModal[style*="display: flex"],
            #submitConfirmModal[style*="display: flex"],
            #reportQuestionModal[style*="display: flex"],
            #helpdeskModalOverlay[style*="display: flex"],
            #customDialogOverlay[style*="display: flex"],
            #customPromptOverlay[style*="display: flex"],
            #copyrightPdfOverlay[style*="display: flex"] {
                align-items: center !important;
            }
        }

        #websitePopupOverlayModal > div,
        #paymentSuccessPopupModal > div,
        #premiumBlockerModal > div,
        #testPauseResumeModal > div,
        #submitConfirmModal > div,
        #reportQuestionModal > div,
        #helpdeskModalOverlay > div,
        #customDialogOverlay > div,
        #customPromptOverlay > div,
        #copyrightPdfOverlay > div {
            margin: auto !important;
            max-height: calc(100vh - 40px) !important;
            overflow-y: auto !important;
            box-sizing: border-box !important;
            width: 100% !important;
            border-radius: 20px !important;
            box-shadow: 0 20px 50px rgba(0,0,0,0.25) !important;
            border: 1px solid rgba(0, 0, 0, 0.05) !important;
        }

        body.dark-mode #websitePopupOverlayModal > div,
        body.dark-mode #paymentSuccessPopupModal > div,
        body.dark-mode #premiumBlockerModal > div,
        body.dark-mode #testPauseResumeModal > div,
        body.dark-mode #submitConfirmModal > div,
        body.dark-mode #reportQuestionModal > div,
        body.dark-mode #helpdeskModalOverlay > div,
        body.dark-mode #customDialogOverlay > div,
        body.dark-mode #customPromptOverlay > div,
        body.dark-mode #copyrightPdfOverlay > div {
            border: 1px solid rgba(255, 255, 255, 0.08) !important;
        }

        @media (max-height: 640px) {
            #websitePopupOverlayModal i,
            #paymentSuccessPopupModal i,
            #premiumBlockerModal i,
            #testPauseResumeModal i,
            #submitConfirmModal i,
            #helpdeskModalOverlay i,
            #customDialogOverlay i,
            #customPromptOverlay i {
                display: none !important;
            }
            #websitePopupOverlayModal h2,
            #paymentSuccessPopupModal h2,
            #premiumBlockerModal h2,
            #testPauseResumeModal h2,
            #submitConfirmModal h2,
            #helpdeskModalOverlay h3,
            #customDialogOverlay h3,
            #customPromptOverlay h3 {
                font-size: 16px !important;
                margin-bottom: 8px !important;
            }
            #websitePopupOverlayModal p,
            #paymentSuccessPopupModal p,
            #premiumBlockerModal p,
            #testPauseResumeModal p,
            #submitConfirmModal p,
            #helpdeskModalOverlay p,
            #customDialogOverlay p,
            #customPromptOverlay p {
                font-size: 12px !important;
                margin-bottom: 12px !important;
                line-height: 1.4 !important;
            }
            #websitePopupOverlayModal > div,
            #paymentSuccessPopupModal > div,
            #premiumBlockerModal > div,
            #testPauseResumeModal > div,
            #submitConfirmModal > div,
            #reportQuestionModal > div,
            #helpdeskModalOverlay > div,
            #customDialogOverlay > div,
            #customPromptOverlay > div,
            #copyrightPdfOverlay > div {
                padding: 16px !important;
                max-height: calc(100vh - 20px) !important;
            }
        }
    </style>
    <!-- __CHUNK_SCRIPTS_PLACEHOLDER__ -->
</head>
<body>
    <script>
        try {
            const stored = localStorage.getItem("_preemptive_theme_mode");
            let isDark = false;
            if (stored === "dark") {
                isDark = true;
            } else if (stored === "light") {
                isDark = false;
            } else {
                isDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
            }
            if (isDark) {
                document.body.classList.add("dark-mode");
            } else {
                document.body.classList.remove("dark-mode");
            }
        } catch(e){}
    </script>

    <!-- Continuous Floating Security Watermark Grid -->
    <div class="screen-anti-leak-layer" id="securityOverlay"></div>

    <!-- Beautiful Fullscreen Loading Overlay for Exams -->
    <div id="test-loading-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255, 255, 255, 0.98); z-index: 10000; flex-direction: column; align-items: center; justify-content: center; transition: opacity 0.3s ease;">
        <div style="text-align: center; max-width: 320px;">
            <div style="position: relative; width: 90px; height: 90px; margin: 0 auto 24px;">
                <div style="position: absolute; inset: 0; border: 4px solid rgba(255,107,53,0.1); border-top-color: var(--primary); border-radius: 50%; animation: db-spin 1s cubic-bezier(0.5, 0, 0.5, 1) infinite;"></div>
                <div style="position: absolute; inset: 10px; border: 3px solid rgba(34,197,94,0.05); border-bottom-color: #22c55e; border-radius: 50%; animation: db-spin 1.5s linear infinite reverse;"></div>
                <div style="position: absolute; inset: 20px; background: rgba(255,107,53,0.06); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <i class="ph-bold ph-exam" style="font-size: 26px; color: var(--primary);"></i>
                </div>
            </div>
            <h3 id="test-loading-title" style="margin: 0; font-weight: 900; font-size: 18px; color: var(--dark); letter-spacing: -0.3px;">Loading...</h3>
        </div>
    </div>

    <!-- MAIN EXAM ENGINE MODULE -->
    <div id="test-engine-panel">
        <div class="engine-header" style="justify-content: space-between; gap: 8px; padding: 8px 14px; min-height: 65px; height: auto;">
            <div style="display: flex; align-items: center; gap: 6px; min-width: 0; flex: 1; justify-content: flex-start;">
                <div class="engine-title-group" onclick="triggerTestInterruptionPause()" style="cursor: pointer; display: flex; align-items: center; gap: 8px; min-width: 0;" title="Pause / Exit Test">
                    <img id="testEngineLogo" class="app-logo" src="${config.logoUrl}" style="flex-shrink: 0; width: 34px; height: 34px; border-radius: 8px; padding: 2px;">
                    <div style="min-width: 0; display: flex; flex-direction: column; flex: 1;">
                        <span id="testEngineName" style="margin: 0; font-weight: 850; display: block; line-height: 1.35;">--</span>
                        <button class="engine-tools-badge" onclick="event.stopPropagation(); handleToggleLanguage()" id="translateBtn" style="margin-top: 1px; height: 18px; padding: 0 5px; font-size: 8px; border-radius: 4px; background: var(--light-grey); border: 1px solid var(--border-color); display: flex; align-items: center; gap: 3px; cursor: pointer;">
                            <i class="ph ph-translate" style="font-size: 9px;"></i> <span id="translateLabel" style="font-size: 8px;">TRANSLATE</span>
                        </button>
                    </div>
                </div>
            </div>
            
            <div style="font-weight: 900; color: var(--primary); font-size: 13.5px; font-family: monospace; background: rgba(255,107,53,0.08); padding: 5px 10px; border-radius: 8px; border: 1px solid rgba(255,107,53,0.15); display: flex; align-items: center; gap: 4px; white-space: nowrap; flex-shrink: 0;" id="testTimerTextContainer">
                <i class="ph ph-clock" style="font-size: 12px; font-weight: bold; color: var(--primary);"></i>
                <span id="testTimerText" style="font-family: monospace !important; font-weight: 950;">00:00</span>
            </div>

            <div style="display: flex; align-items: center; gap: 6px; flex-shrink: 0; justify-content: flex-end;">
                <button class="engine-tools-badge" id="btnToggleEngineAnswer" onclick="handleToggleEngineAnswer()" style="height: 34px; width: 34px; padding: 0; display: flex; align-items: center; justify-content: center; border-radius: 50%;" title="Show/Hide Answer & Explanation">
                    <i id="engineAnswerIcon" class="ph-bold ph-eye-slash" style="font-size: 14px;"></i>
                </button>
                <button class="engine-tools-badge" onclick="handleTogglePalette(true)" style="height: 34px; width: 34px; padding: 0; display: flex; align-items: center; justify-content: center; border-radius: 50%;" title="Questions Palette">
                    <i class="ph-bold ph-squares-four" style="font-size: 14px;"></i>
                </button>
                <button class="engine-submit-btn" onclick="handlePromptSubmitTest()" style="height: 34px; padding: 0 12px; font-size: 11px; border-radius: 8px; font-weight: bold; margin: 0; display: flex; align-items: center; justify-content: center;">SUBMIT</button>
            </div>
        </div>

        <div class="watermark-container">
            <img class="watermark-img" src="${config.logoUrl}">
            <div class="watermark-text">PRAYAS ONE</div>
        </div>

        <div class="engine-content" id="engineQsContent">
            <!-- Questions rendered here -->
        </div>

        <div class="engine-footer">
            <button class="engine-btn-nav" id="btnPrevQ" onclick="handlePrevQuestion()">
                <i class="ph-bold ph-caret-left"></i>
            </button>
            <button class="review-badge-btn" id="btnMarkReview" onclick="handleToggleMarkReview()">
                <i class="ph-bold ph-bookmark-simple"></i> MARK FOR REVIEW
            </button>
            <button class="engine-btn-nav" id="btnNextQ" onclick="handleNextQuestion()">
                <i class="ph-bold ph-caret-right"></i>
            </button>
        </div>
    </div>


    <!-- APP CORE NAVIGATION VISUAL HEADERS -->
    <div class="header" id="mainHeader">
        <div class="app-branding">
            <img class="app-logo" src="${config.logoUrl}">
            <div class="greetings-box">
                <h4 class="greet-title" id="displayGreetText">${config.studentGreeting}</h4>
                <p class="greet-sub" id="displayGreetSubtitle">${config.studentSubGreeting || 'PRAYAS ONE PROFESSIONAL HUB'}</p>
            </div>
        </div>
        <div style="display: flex; gap: 6px; align-items: center;">
            <div class="header-action-btn" id="themeToggleBtn" onclick="handleToggleThemeMode()">
                <i class="ph ph-sun" id="themeSunIcon" style="font-size: 20px; display: none;"></i>
                <i class="ph ph-moon" id="themeMoonIcon" style="font-size: 20px;"></i>
            </div>
            <div class="header-action-btn" onclick="handleTabNavigation('acc')">
                <i class="ph ph-user" id="headerAccountIcon" style="font-size: 20px;"></i>
            </div>
        </div>
    </div>

    <!-- BACK STACK PERSISTENT BAR FOR NESTED LIBS -->
    <div class="back-nav-bar" id="backNavigationHeader" style="display: none; padding: 12px 20px;">
        <button class="back-nav-btn" onclick="handleHistoryBack()">
            <i class="ph ph-arrow-left"></i>
            <span style="font-size: 13px; margin-left: 6px; font-weight: 800;">BACK</span>
        </button>
        <span style="font-size: 13px; font-weight: 900; color: var(--dark); margin-left: auto;" id="navHeaderBreadcrumb">--</span>
    </div>


    <!-- SCREENS CONTAINER -->

    <!-- Home screen -->
    <div id="scr-home" class="screen active">
        <!-- 21:9 Slider carousel -->
        <div class="slider-container" id="studentSliderBlock">
            <div class="slides-wrapper" id="studentSlidesWrapper">
                <!-- Javascript slides injected here -->
            </div>
            <div class="slider-dots" id="studentSliderDots"></div>
        </div>

        <!-- Google AdSense Home Top Ad Slot -->
        <div id="ad-container-home-top" style="margin: 14px 0 6px; display: none;"></div>

        <!-- Zomato style Notification Carousel -->
        <div class="section-header-title" id="notifScrollAnchor" style="font-size: 16px; margin-bottom: 6px;">
            <i class="ph-fill ph-bell-ringing" style="color: var(--primary);"></i> Important Notices
        </div>
        <div class="scrolling-notifications" id="studentNoticeBoard">
            <!-- Notices injected -->
        </div>

        <div id="androidApkDownloadBlock" style="display: none;">
            <div class="apk-download-banner" style="background: linear-gradient(135deg, #181818 0%, #111111 100%); color: #FAF6ED; border-radius: 20px; padding: 15px 18px; margin: 14px 0 20px; display: flex; align-items: center; justify-content: space-between; gap: 12px; cursor: pointer; border: 1.5px solid rgba(255, 184, 0, 0.35); box-shadow: 0 10px 25px -5px rgba(255, 184, 0, 0.12), 0 8px 16px -6px rgba(0,0,0,0.5);" onclick="handleApkRedirect()">
                <div style="display: flex; align-items: center; gap: 14px; min-width: 0; flex: 1;">
                    <div style="background: rgba(255, 184, 0, 0.15); width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 24px; box-shadow: inset 0 2px 4px rgba(255,184,0,0.1);">
                        <i class="ph-fill ph-android-logo" style="color: #FFB800;"></i>
                    </div>
                    <div style="min-width: 0; flex: 1;">
                        <h4 style="margin: 0; font-size: 13.5px; font-weight: 900; color: #FAF6ED; letter-spacing: -0.3px; display: flex; align-items: center; gap: 6px;">
                            <span id="apkButtonTextLabel">${config.social.apkDownloadText || "Download Android App (APK)"}</span>
                            <span style="font-size: 8px; background: rgba(255, 184, 0, 0.2); color: #FFB800; padding: 1px 4px; border-radius: 4px; font-weight: 800; border: 0.5px solid rgba(255,184,0,0.3);">OFFICIAL</span>
                        </h4>
                        <p style="margin: 3px 0 0; font-size: 10.5px; color: rgba(250, 246, 237, 0.85); font-weight: 600; line-height: 1.25; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Get direct notifications & premium test updates on your mobile!</p>
                    </div>
                </div>
                <div style="background: #FFB800; color: #111111; padding: 7px 12px; border-radius: 10px; font-size: 10.5px; font-weight: 900; white-space: nowrap; display: flex; align-items: center; gap: 5px; box-shadow: 0 4px 10px rgba(255, 184, 0, 0.2);">
                    GET APP <i class="ph-bold ph-download-simple" style="font-size: 11px;"></i>
                </div>
            </div>
        </div>

        <script>
            // Dynamically show the Android APK block and define redirect action
            (function() {
                var apkUrl = "${config.social.apkUrl || ''}";
                window.handleApkRedirect = function() {
                    if (apkUrl && apkUrl.trim() !== "") {
                        window.open(apkUrl, '_blank');
                    }
                };
                if (apkUrl && apkUrl.trim() !== "") {
                    var el = document.getElementById("androidApkDownloadBlock");
                    if (el) el.style.display = "block";
                }
            })();
        </script>

        <div class="section-header-title">
            <i class="ph-fill ph-grid-four" style="color: var(--primary)"></i> Quick Access Library
        </div>

        <div class="grid-blocks" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
            <div class="library-card" onclick="handleOpenCategoryLibrary('test')" style="background: white; border: 1.5px solid var(--border-color); border-radius: 18px; padding: 12px 14px; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: all 0.2s ease;">
                <div style="background: rgba(255, 107, 53, 0.1); width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; shrink-0;">
                    <i class="ph ph-exam" style="font-size: 22px; color: var(--primary);"></i>
                </div>
                <div class="library-info">
                    <h3 style="margin: 0; font-size: 13px; font-weight: 900; color: var(--dark);">Exam Centre</h3>
                    <p style="margin: 2px 0 0; font-size: 10px; color: var(--grey-text); font-weight: bold;">Practice Desk</p>
                </div>
            </div>
            
            <div class="library-card" onclick="handleOpenCategoryLibrary('pdf')" style="background: white; border: 1.5px solid var(--border-color); border-radius: 18px; padding: 12px 14px; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: all 0.2s ease;">
                <div style="background: rgba(34, 197, 94, 0.1); width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; shrink-0;">
                    <i class="ph ph-file-pdf" style="font-size: 22px; color: #22c55e;"></i>
                </div>
                <div class="library-info">
                    <h3 style="margin: 0; font-size: 13px; font-weight: 900; color: var(--dark);">PDF Books</h3>
                    <p style="margin: 2px 0 0; font-size: 10px; color: var(--grey-text); font-weight: bold;">E-Resource Books</p>
                </div>
            </div>
        </div>

        <!-- Saved Questions Hub dashboard segment -->
        <div id="savedQuestionsSection"></div>

        <!-- Google AdSense Home Bottom Ad Slot -->
        <div id="ad-container-home-bottom" style="margin: 20px 0; display: none;"></div>
    </div>

    <!-- Category screen -->
    <div id="scr-category" class="screen">
        <h3 class="section-header-title" id="categorySelectionTitle">--</h3>
        <div id="categoryGridArea"></div>
        <!-- Google AdSense Category Bottom Ad Slot -->
        <div id="ad-container-category-bottom" style="margin: 20px 0; display: none;"></div>
    </div>

    <!-- Sub-category screen -->
    <div id="scr-subcat" class="screen">
        <h3 class="section-header-title" id="subcategorySelectionTitle">--</h3>
        <div id="subcategoryGridArea"></div>
    </div>

    <!-- Topics/Contents lists -->
    <div id="scr-topics" class="screen">
        <h3 class="section-header-title" id="topicSelectionTitle">--</h3>
        <div id="topicsGridArea"></div>
    </div>


    <!-- Instructions / Preparation Screen -->
    <div id="scr-instructions" class="screen">
        <div style="text-align: center; margin-bottom: 24px; position: relative;">
            <div style="width: 72px; height: 72px; background: rgba(255,107,53,0.07); border: 2px solid rgba(255,107,53,0.15); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 14px;">
                <i class="ph ph-exam" style="font-size: 38px; color: var(--primary);"></i>
            </div>
            <h2 id="instExTitle" style="font-weight: 900; margin: 0 0 6px; font-size: 21px; color: var(--dark); letter-spacing: -0.3px;">--</h2>
            <span style="font-size: 11px; text-transform: uppercase; color: var(--grey-text); font-weight: bold; letter-spacing: 1px; background: var(--light-grey); padding: 4px 10px; border-radius: 20px; border: 1px solid var(--border-color);">Online Test Portal</span>
        </div>

        <!-- Professional Styled Meta Information Grid -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
            <div style="background: var(--light-grey); border: 1.5px solid var(--border-color); border-radius: 16px; padding: 14px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;">
                <i class="ph ph-clock" style="font-size: 20px; color: var(--primary);"></i>
                <span style="font-size: 10px; text-transform: uppercase; font-weight: 800; color: var(--grey-text); letter-spacing: 0.5px;">Duration Limit</span>
                <span id="instExDuration" style="font-size: 15px; font-weight: 900; color: var(--dark);">--</span>
            </div>
            <div style="background: var(--light-grey); border: 1.5px solid var(--border-color); border-radius: 16px; padding: 14px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;">
                <i class="ph ph-question" style="font-size: 20px; color: var(--primary);"></i>
                <span style="font-size: 10px; text-transform: uppercase; font-weight: 800; color: var(--grey-text); letter-spacing: 0.5px;">Total Questions</span>
                <span id="instExCount" style="font-size: 15px; font-weight: 900; color: var(--dark);">--</span>
            </div>
        </div>

        <!-- Marking Scheme Panels -->
        <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
            <div style="background: white; border: 1.5px solid var(--border-color); border-radius: 16px; padding: 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.015);">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <i class="ph ph-checks" style="font-size: 22px; color: #22c55e;"></i>
                    <div style="text-align: left;">
                        <h4 style="margin: 0; font-size: 11px; font-weight: 800; text-transform: uppercase; color: var(--grey-text); letter-spacing: 0.3px;">Standard Marking Scheme</h4>
                        <span style="font-size: 12px; font-weight: 700; color: var(--dark);">Correct response gains positive weight.</span>
                    </div>
                </div>
                <div style="background: rgba(34,197,94,0.08); color: #22c55e; border: 1px solid rgba(34,197,94,0.15); font-size: 10.5px; font-weight: 900; padding: 4px 8px; border-radius: 8px; white-space: nowrap; text-transform: uppercase;" id="instExPositiveLabel">
                    Correct: +<span id="instExPositive">-</span>
                </div>
            </div>

            <div style="background: white; border: 1.5px solid var(--border-color); border-radius: 16px; padding: 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.015);">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <i class="ph ph-x-circle" style="font-size: 22px; color: #ef4444;"></i>
                    <div style="text-align: left;">
                        <h4 style="margin: 0; font-size: 11px; font-weight: 800; text-transform: uppercase; color: var(--grey-text); letter-spacing: 0.3px;">Penalty (Negative Mark)</h4>
                        <span style="font-size: 12px; font-weight: 700; color: var(--dark);">Incorrect response results in reductions.</span>
                    </div>
                </div>
                <div style="background: rgba(239,68,68,0.08); color: #ef4444; border: 1px solid rgba(239,68,68,0.15); font-size: 10.5px; font-weight: 900; padding: 4px 8px; border-radius: 8px; white-space: nowrap; text-transform: uppercase;" id="instExNegativeLabel">
                    Wrong: -<span id="instExNegative">-</span>
                </div>
            </div>
        </div>

        <!-- Beautifully Formatted Guidelines Board -->
        <div class="guidelines-card">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px; border-bottom: 1.5px solid var(--border-color); padding-bottom: 12px;">
                <i class="ph-bold ph-shield-check" style="color: var(--primary); font-size: 22px;"></i>
                <h3 style="margin: 0; font-size: 13px; font-weight: 900; letter-spacing: -0.2px; text-transform: uppercase; color: var(--dark);">MOCK TEST GUIDELINES</h3>
            </div>
            
            <div style="color: var(--dark); font-size: 12.5px; line-height: 1.6; display: flex; flex-direction: column; gap: 14px;">
                <div style="display: flex; gap: 10px; align-items: flex-start;">
                    <span style="width: 20px; height: 20px; background: rgba(255,107,53,0.1); color: var(--primary); font-size: 11px; font-weight: 900; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;">1</span>
                    <div>
                        <strong>Secure Lockdown Mode:</strong>
                        <p style="margin: 2px 0 0 0; font-size: 11.5px; color: var(--grey-text);">Do not minimize the screen or change tabs. Loss of focus will instantaneously trigger safety pause state.</p>
                    </div>
                </div>

                <div style="display: flex; gap: 10px; align-items: flex-start;">
                    <span style="width: 20px; height: 20px; background: rgba(255,107,53,0.1); color: var(--primary); font-size: 11px; font-weight: 900; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;">2</span>
                    <div>
                        <strong>Bilingual Evaluation Options:</strong>
                        <p style="margin: 2px 0 0 0; font-size: 11.5px; color: var(--grey-text);">Toggle assessment languages anytime using the <strong>TRANSLATE</strong> option provided in header bar during interactive play.</p>
                    </div>
                </div>

                <div style="display: flex; gap: 10px; align-items: flex-start;">
                    <span style="width: 20px; height: 20px; background: rgba(255,107,53,0.1); color: var(--primary); font-size: 11px; font-weight: 900; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;">3</span>
                    <div>
                        <strong>Self-Saving & Bookmarking:</strong>
                        <p style="margin: 2px 0 0 0; font-size: 11.5px; color: var(--grey-text);">Bookmark hard or important questions during practice. Access them conveniently anytime directly from home workspace.</p>
                    </div>
                </div>

                <div style="display: flex; gap: 10px; align-items: flex-start; border-top: 1px dashed var(--border-color); padding-top: 14px;">
                    <span style="width: 20px; height: 20px; background: rgba(255,107,53,0.08); color: var(--primary); font-size: 11px; font-weight: 900; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; border: 1px solid rgba(255,107,53,0.18);"><i class="ph ph-article" style="font-size: 11px;"></i></span>
                    <div>
                        <strong>Guidelines:</strong>
                        <p id="instExDesc" style="margin: 4px 0 0; font-size: 11.5px; color: var(--grey-text); line-height: 1.5; font-weight: 600;">--</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Voucher Activation fields config -->
        <div id="couponEntrySection" style="display: none; background: #fffde7; border: 1px solid #fff59d; border-radius: 16px; padding: 20px; margin-bottom: 20px; text-align: left;">
            <div style="font-weight: bold; font-size: 13px; color: #f57f17; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
                <i class="ph-fill ph-ticket"></i> DO YOU HAVE A COUPON CODE?
            </div>
            <div style="display: flex; gap: 8px;">
                <input type="text" id="couponCodeInput" class="form-input" style="margin-bottom:0;" placeholder="Enter promo code">
                <button onclick="handleVerifyCouponSubmit()" style="background:var(--dark); color:white; border:none; border-radius:12px; padding: 12px 20px; font-weight:bold; font-size:12px; cursor:pointer;">APPLY</button>
            </div>
            <p id="couponFeedbackMsg" style="margin:6px 0 0; font-size:11px; font-weight:bold;"></p>
        </div>

        <button class="btn-fill-prime" onclick="handleBeginTestInitiation()">
            <i class="ph ph-play-circle" style="font-size: 20px;"></i> START TEST
        </button>
    </div>


    <!-- Locked Payment Premium Screen (Redesigned) -->
    <div id="scr-pay" class="screen">
        <div style="background: white; border-radius: 24px; border: 1px solid var(--border-color); padding: 28px; box-shadow: 0 10px 30px rgba(0,0,0,0.04); max-width: 520px; margin: 0 auto; overflow: hidden; position: relative;">
            <!-- Premium Header Accent Bar -->
            <div style="position: absolute; top: 0; left: 0; right: 0; height: 6px; background: linear-gradient(90deg, var(--primary) 0%, #ff8c42 50%, #f1c40f 100%);"></div>

            <div style="text-align: center; margin-bottom: 22px; margin-top: 5px;">
                <div style="display: inline-flex; align-items: center; justify-content: center; width: 68px; height: 68px; background: rgba(255, 107, 53, 0.08); border-radius: 50%; margin-bottom: 12px; border: 1.5px solid rgba(255, 107, 53, 0.15);">
                    <i class="ph-fill ph-crown" style="font-size: 38px; color: var(--primary);"></i>
                </div>
                
                <!-- Dynamic Category Plan Badge -->
                <div style="margin-bottom: 12px;">
                    <div id="pay-plan-badge" style="display: inline-flex; align-items: center; gap: 6px; background: rgba(255, 107, 53, 0.08); color: #FF6B35; border: 1px solid rgba(255, 107, 53, 0.2); border-radius: 99px; padding: 6px 14px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 2px 8px rgba(255,107,53,0.03);">
                        <i class="ph-fill ph-sparkles"></i> <span id="pay-plan-badge-text">Selected: General Premium Plan</span>
                    </div>
                </div>

                <h2 id="pay-screen-title" style="font-weight: 900; margin: 8px 0 4px 0; font-size: 24px; letter-spacing: -0.5px; color: #1e293b;">Upgrade to Premium</h2>
                <p id="pay-screen-desc" style="font-size: 13.5px; color: var(--grey-text); line-height: 1.45; margin: 0 auto; max-width: 360px;">
                    Gain full access to all Mock Exams, past papers, future series and worksheets today!
                </p>
            </div>

            <!-- Pricing Box -->
            <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: white; border-radius: 18px; padding: 22px; margin-bottom: 20px; position: relative; overflow: hidden; box-shadow: 0 8px 25px rgba(15, 23, 42, 0.12);">
                <!-- Decorative subtle circle background -->
                <div style="position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; background: rgba(255, 184, 0, 0.08); border-radius: 50%; pointer-events: none;"></div>
                
                <div style="display: flex; align-items: center; justify-content: space-between; position: relative; z-index: 1;">
                    <div>
                        <span style="font-size: 9.5px; text-transform: uppercase; letter-spacing: 1.5px; opacity: 0.8; font-weight: 800; color: #ffb800; display: block; margin-bottom: 4px;">ACTIVE LICENSE PLAN</span>
                        <h3 style="margin: 0; font-size: 30px; font-weight: 950; display: flex; align-items: baseline; gap: 4px; line-height: 1;">
                            <span id="pay-amount" style="color: #ffffff;">${config.social.premiumPrice || "₹45"}</span>
                            <span id="pay-duration" style="display: none;">/ ${config.social.premiumDurationText || "3 Months"}</span>
                        </h3>
                    </div>
                    <div style="text-align: right;">
                        <span style="font-size: 9px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.7; font-weight: bold; display: block; margin-bottom: 4px;">LICENSE DURATION</span>
                        <div id="pay-validity-text" style="background: rgba(255,184,0,0.15); border: 1.5px solid rgba(255,184,0,0.25); color: #ffb800; border-radius: 10px; padding: 6px 12px; font-size: 11px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; display: inline-block; line-height: 1.2;">
                            ${config.social.premiumValidityText || "VALID FOR 90 DAYS"}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Benefits Checklist -->
            <div style="background: var(--light-grey); border-radius: 18px; padding: 18px; margin-bottom: 22px; border: 1px solid var(--border-color);">
                <h4 style="margin: 0 0 12px 0; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.8px; color: #475569; display: flex; align-items: center; gap: 5px;">
                    <i class="ph-bold ph-shield-check" style="color: var(--primary); font-size: 15px;"></i> Membership Benefits Include:
                </h4>
                <ul id="pay-benefits-list" style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px;">
                    ${(config.social.premiumBenefitsText || "Access to Past Tests, Access to Present Tests, Access to Future Tests, Unlimited Test Attempts")
                        .split(",")
                        .map(b => b.trim())
                        .filter(Boolean)
                        .map(b => `
                            <li style="display: flex; align-items: flex-start; gap: 10px; font-size: 13px; font-weight: 700; color: #334155;">
                                <i class="ph-bold ph-check-circle" style="color: #22c55e; font-size: 17px; margin-top: 1px;"></i> <span>${b}</span>
                            </li>
                        `).join("")}
                </ul>
            </div>

            <!-- QR Payment Section -->
            <div style="text-align: center; border: 2px dashed #e2e8f0; background: #f8fafc; border-radius: 20px; padding: 22px; margin-bottom: 22px; position: relative;">
                <div style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: #2563eb; color: white; padding: 3px 12px; border-radius: 20px; font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 10px rgba(37, 99, 235, 0.2);">
                    SECURE INSTANT UPI
                </div>
                <div style="margin-top: 8px; margin-bottom: 4px;">
                    <span id="pay-scan-qr-header" style="font-size: 12px; font-weight: 800; color: #1e293b; text-transform: uppercase; letter-spacing: 0.5px;">Scan QR Code to Pay ${config.social.premiumPrice || "₹45"}</span>
                </div>
                
                <div style="margin: 15px 0;">
                    <div style="display: inline-block; background: white; padding: 12px; border-radius: 16px; box-shadow: 0 8px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
                        <img style="width: 160px; height: 160px; display: block; border-radius: 8px;" src="${config.social.paymentQr || 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=payee_prayas'}" id="displayPayQrImage">
                    </div>
                    <br/>
                    <a id="pay-qr-direct-link" href="#" target="_self" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; margin-top: 12px; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 10px 22px; border-radius: 12px; font-size: 13.5px; font-weight: 800; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(37,99,235,0.25); border: none; text-decoration: none; width: 85%; max-width: 320px;" onmouseover="this.style.transform='translateY(-1px)';" onmouseout="this.style.transform='none';">
                        <i class="ph-bold ph-lightning" style="font-size: 15px; color: #ffb800;"></i> Pay via UPI App
                    </a>
                </div>
                
                <div style="display: flex; flex-direction: row; flex-wrap: nowrap; align-items: center; justify-content: center; gap: 10px; margin-top: 16px; background: white; padding: 8px 12px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 2px 8px rgba(0,0,0,0.015); max-width: 100%; box-sizing: border-box; margin-left: auto; margin-right: auto; width: max-content;">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Google_Pay_Logo_%282020%29.svg" style="height: 12px; width: auto; object-fit: contain; flex-shrink: 0; display: block;" alt="Google Pay">
                    <div style="width: 1px; height: 10px; background: #e2e8f0; flex-shrink: 0;"></div>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg" style="height: 12px; width: auto; object-fit: contain; flex-shrink: 0; display: block;" alt="PhonePe">
                    <div style="width: 1px; height: 10px; background: #e2e8f0; flex-shrink: 0;"></div>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" style="height: 9px; width: auto; object-fit: contain; flex-shrink: 0; display: block;" alt="UPI">
                </div>
            </div>

            <!-- Form Inputs -->
            <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 22px;">
                <h4 style="margin: 0; font-size: 12.5px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.8px; color: #475569; display: flex; align-items: center; gap: 6px;">
                    <i class="ph-fill ph-note-pencil" style="color: var(--primary); font-size: 16px;"></i> Submit Payment Details:
                </h4>
                
                <div>
                    <label style="font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.3px; display: block; margin-bottom: 5px;">Aspirant Full Name</label>
                    <input type="text" id="payFormName" class="form-input" style="margin-bottom:0; width: 100%;" placeholder="Enter your full name">
                </div>
                <div>
                    <label style="font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.3px; display: block; margin-bottom: 5px;">Email ID</label>
                    <input type="email" id="payFormEmail" class="form-input" style="margin-bottom:0; width: 100%;" placeholder="student@example.com">
                </div>
                <div>
                    <label style="font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.3px; display: block; margin-bottom: 5px;">Phone Number</label>
                    <input type="tel" id="payFormPhone" class="form-input" style="margin-bottom:0; width: 100%;" placeholder="Enter mobile number">
                </div>
                <div>
                    <label style="font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.3px; display: block; margin-bottom: 5px;">UPI UTR / Transaction ID (12 Digits)</label>
                    <input type="text" id="payFormUTR" class="form-input" style="margin-bottom:0; width: 100%;" placeholder="e.g. 129038475812">
                </div>

            </div>

            <!-- Refund Policy -->
            <div style="background: #fef2f2; border: 1px solid #fca5a5; border-radius: 14px; padding: 14px; margin-bottom: 24px;">
                <p style="margin:0; font-size: 11.5px; color: #b91c1c; font-weight: 800; line-height: 1.45; display: flex; align-items: flex-start; gap: 6px;">
                    <span>⚠️</span>
                    <span>Refund Policy: "Once payment is completed, no refund will be provided. Please try the free tests first and then purchase Premium Membership."</span>
                </p>
            </div>

            <div style="display: flex; gap: 12px; margin-bottom: 22px;">
                <button id="btnSendPaymentEmail" class="btn-fill-prime" onclick="handleSendPaymentDetailsEmail()" style="background: var(--primary); margin: 0; flex: 1; border-radius: 14px; font-size: 12px; font-weight: 800; height: 44px; display: inline-flex; align-items: center; justify-content: center; gap: 6px; border: none; cursor: pointer; box-shadow: 0 4px 15px rgba(255, 107, 53, 0.2);">
                    <i class="ph-bold ph-envelope" style="font-size: 17px;"></i> SEND EMAIL
                </button>
                <button id="pay-contact-link-element" onclick="handleContactHelpdeskClick()" class="btn-fill-prime" style="background: #25d366; color: white; margin: 0; flex: 1; border-radius: 14px; font-size: 12px; font-weight: 800; height: 44px; display: inline-flex; align-items: center; justify-content: center; gap: 6px; border: none; cursor: pointer; box-shadow: 0 4px 15px rgba(37, 211, 102, 0.25);">
                    <i class="ph-bold ph-chats" style="font-size: 17px;"></i> Contact Helpdesk
                </button>
            </div>
        </div>
    </div>


    <!-- Account Portal screen (Redesigned with Short Texts and Day/Night Visibility) -->
    <div id="scr-acc" class="screen">
        <h3 class="section-header-title" style="margin-bottom: 20px;">Account</h3>

        <!-- GUEST / UNAUTHENTICATED STATE -->
        <div id="studentAuthFormPanel">
            <!-- Box 1: Curved Shape Box (Login Portal) -->
            <div style="background: var(--light-grey); border: 1px solid var(--border-color); border-radius: 24px; padding: 22px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); margin-bottom: 20px; text-align: left;">
                <div style="text-align: center; padding: 5px 0 18px 0;">
                    <div style="width: 52px; height: 52px; border-radius: 50%; background: var(--primary-light, rgba(255,184,0,0.08)); display: inline-flex; align-items: center; justify-content: center; margin-bottom: 12px; border: 1.5px solid var(--primary); box-shadow: 0 4px 12px rgba(255,184,0,0.1);">
                        <i class="ph-bold ph-user-focus" style="font-size: 24px; color: var(--primary);"></i>
                    </div>
                    <h3 style="margin: 0; font-weight: 900; font-size: 19px; letter-spacing: -0.4px; color: var(--dark);">Aspirant Portal</h3>
                    <p style="font-size: 12.5px; color: var(--grey-text); margin: 6px 0 0; line-height: 1.5; font-weight: 500;">
                        Sign in to access premium tests & results.
                    </p>
                </div>

                <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px;">
                    <div>
                        <label style="font-weight: 800; font-size: 10px; color: var(--grey-text); letter-spacing: 0.8px; text-transform: uppercase; display: block; margin-bottom: 6px;">Email or Phone</label>
                        <div style="position: relative;">
                            <i class="ph ph-envelope-simple" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--grey-text); font-size: 16px;"></i>
                            <input type="text" id="inputStudentCredMail" class="form-input" placeholder="student@example.com" style="padding-left: 42px; margin: 0; border-radius: 12px; height: 46px; font-size: 13px; width: 100%; box-sizing: border-box; border: 1.5px solid var(--border-color); background: rgba(0,0,0,0.01);">
                        </div>
                    </div>

                    <div>
                        <label style="font-weight: 800; font-size: 10px; color: var(--grey-text); letter-spacing: 0.8px; text-transform: uppercase; display: block; margin-bottom: 6px;">Password</label>
                        <div style="position: relative;">
                            <i class="ph ph-lock" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--grey-text); font-size: 16px;"></i>
                            <input type="password" id="inputStudentCredPass" class="form-input" placeholder="••••••••" style="padding-left: 42px; margin: 0; border-radius: 12px; height: 46px; font-size: 13px; width: 100%; box-sizing: border-box; border: 1.5px solid var(--border-color); background: rgba(0,0,0,0.01);">
                        </div>
                    </div>
                </div>

                <button class="btn-fill-prime" onclick="handleStudentAuthenticationProcess()" style="height: 48px; font-weight: 800; font-size: 13px; border-radius: 24px; background: var(--dark); color: var(--light-grey); border: none; display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; margin: 0; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    <i class="ph-bold ph-sign-in" style="font-size: 18px;"></i> Sign In
                </button>
            </div>
        </div>

        <!-- AUTHENTICATED / LOGGED IN STATE -->
        <div id="studentAuthenticatedProfileArea" style="display: none;">
            <!-- Box 1: Curved Shape Box (Profile Info) -->
            <div style="background: var(--light-grey); border: 1px solid var(--border-color); border-radius: 24px; padding: 22px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); margin-bottom: 20px; text-align: left;">
                <!-- Profile Hero Header -->
                <div style="text-align: center; padding: 5px 0 18px 0; border-bottom: 1px dashed var(--border-color); margin-bottom: 18px;">
                    <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--light-grey); display: inline-flex; align-items: center; justify-content: center; margin-bottom: 12px; border: 2px solid var(--primary); position: relative; box-shadow: 0 4px 12px rgba(255,184,0,0.15);">
                        <i class="ph-fill ph-user-circle" style="font-size: 40px; color: var(--dark);"></i>
                        <span style="position: absolute; bottom: 0; right: 0; background: #2ecc71; width: 14px; height: 14px; border-radius: 50%; border: 2px solid var(--light-grey); display: block;"></span>
                    </div>
                    <h2 id="studentUserHeaderName" style="margin: 0; font-weight: 900; font-size: 19px; color: var(--dark); letter-spacing: -0.4px;">Student Name</h2>
                    <span style="font-size: 11px; font-weight: 800; color: #2ecc71; background: rgba(46,204,113,0.1); padding: 2px 8px; border-radius: 12px; display: inline-flex; align-items: center; gap: 4px; margin-top: 6px;">
                        <span style="width: 6px; height: 6px; border-radius: 50%; background: #2ecc71;"></span> Online Account
                    </span>
                </div>

                <!-- Personal Information Grid -->
                <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 18px;">
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: rgba(0,0,0,0.01); border-radius: 14px; border: 1.5px solid var(--border-color);">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <i class="ph-bold ph-envelope-simple" style="font-size: 16px; color: var(--grey-text);"></i>
                            <span style="font-size: 12px; font-weight: 700; color: var(--grey-text);">Contact</span>
                        </div>
                        <span id="studentUserHeaderMail" style="font-size: 13px; font-weight: 800; color: var(--dark); text-align: right; max-width: 170px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">student@domain.com</span>
                    </div>

                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: rgba(0,0,0,0.01); border-radius: 14px; border: 1.5px solid var(--border-color);">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <i class="ph-bold ph-lock-key" style="font-size: 16px; color: var(--grey-text);"></i>
                            <span style="font-size: 12px; font-weight: 700; color: var(--grey-text);">Password</span>
                        </div>
                        <span style="font-size: 12px; font-weight: 800; color: var(--dark); letter-spacing: 2px;">••••••••</span>
                    </div>
                </div>

                <button class="btn-fill-prime" style="background: rgba(239, 68, 68, 0.08); color: #ef4444; border: 1.5px solid rgba(239, 68, 68, 0.15); border-radius: 20px; width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; height: 44px; font-size: 12.5px; font-weight: 800; margin: 0; cursor: pointer;" onclick="handleStudentSignOutProcess()">
                    <i class="ph-bold ph-sign-out" style="font-size: 16px;"></i> Sign Out
                </button>
            </div>

            <!-- Box 2: Premium Style Box (Active status for logged in student) -->
            <div class="premium-promo-box">
                <div style="position: absolute; top: -15px; right: -15px; background: rgba(255,184,0,0.15); width: 80px; height: 80px; border-radius: 50%;"></div>
                
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; position: relative; z-index: 2;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="background: var(--primary); width: 34px; height: 34px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(255,184,0,0.3);">
                            <i class="ph-fill ph-crown" style="color: #121212; font-size: 18px;"></i>
                        </div>
                        <h4 style="margin: 0; font-size: 14.5px; font-weight: 900; letter-spacing: -0.3px;">Premium Access</h4>
                    </div>
                    <!-- Subscription Badging -->
                    <div style="font-size: 11px; font-weight: 900; text-transform: uppercase; padding: 4px 10px; background: #fff; border: 1.5px solid #FFD39B; border-radius: 12px; color: #d97706; display: inline-flex; align-items: center; gap: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
                        <span id="profileRemainingDays">Active</span>
                    </div>
                </div>

                <div class="promo-inner" style="border-radius: 16px; padding: 14px; margin-bottom: 4px; position: relative; z-index: 2;">
                    <div style="font-size: 10px; font-weight: 850; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Unlocked Tracks</div>
                    <div id="profileExpiryDate" style="font-size: 12.5px; font-weight: 800; line-height: 1.5;">
                        No Unlocked Tracks
                    </div>
                </div>
            </div>

            <!-- Keep background DOM structures hidden elements to satisfy dynamic script queries & prevent runtime crashes -->
            <div style="display: none;">
                <h4 id="panelTotalAttempts">0 Tests</h4>
                <h4 id="panelHighestScore">0.00</h4>
                <h4 id="panelAverageScore">0%</h4>
                <h4 id="panelTotalStudyTime">0h Spent</h4>
                <div id="personalAttemptsTableArea">
                    <table>
                        <tbody id="personalAttemptsListBody"></tbody>
                    </table>
                </div>
                <div id="premiumBadgeEl"><span id="premiumStatusText"></span></div>
                <span id="profileAcctType"></span>
            </div>
        </div>

        <!-- Box 3: JSON Data Engine Box (Backup & Restore - ALWAYS VISIBLE) -->
        <div style="background: var(--light-grey); border: 1px solid var(--border-color); border-radius: 24px; padding: 22px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); margin-bottom: 20px; text-align: left; position: relative;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="background: rgba(52, 152, 219, 0.1); border: 1.5px solid rgba(52, 152, 219, 0.15); width: 34px; height: 34px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
                        <i class="ph-bold ph-file-code" style="color: #3498db; font-size: 16px;"></i>
                    </div>
                    <div>
                        <h4 style="margin: 0; font-size: 14px; font-weight: 900; color: var(--dark); letter-spacing: -0.3px;">Data Backup Sync</h4>
                    </div>
                </div>
                <span id="backupSyncBadge" style="font-size: 9px; color: #2ecc71; font-weight: 850; background: rgba(46,204,113,0.1); padding: 4px 8px; border-radius: 12px; display: inline-flex; align-items: center; gap: 4px; border: 1px solid rgba(46,204,113,0.12);">
                    <i id="backupSyncIcon" class="ph-bold ph-arrows-counter-clockwise" style="font-size: 10px;"></i> <span id="backupSyncText">Sync</span>
                </span>
            </div>

            <div style="display: flex; gap: 10px; margin-top: 18px;">
                <button onclick="handleExportAspirantBackup()" style="background: var(--primary); color: #121212; border: none; border-radius: 16px; font-size: 11.5px; font-weight: 900; height: 38px; display: inline-flex; align-items: center; justify-content: center; gap: 6px; flex: 1; margin: 0; cursor: pointer; transition: opacity 0.2s; box-shadow: 0 4px 10px rgba(255,184,0,0.15);">
                    <i class="ph-bold ph-download-simple" style="font-size: 13px; color: #121212;"></i>
                    <span>Export JSON</span>
                </button>
                <button onclick="document.getElementById('aspirantBackupFileInput').click()" style="background: rgba(120, 120, 120, 0.05); color: var(--dark); border: 1.5px solid var(--border-color); border-radius: 16px; font-size: 11.5px; font-weight: 900; height: 38px; display: inline-flex; align-items: center; justify-content: center; gap: 6px; flex: 1; margin: 0; cursor: pointer; transition: opacity 0.2s;">
                    <i class="ph-bold ph-upload-simple" style="font-size: 13px; color: #3498db;"></i>
                    <span>Import JSON</span>
                </button>
                <input type="file" id="aspirantBackupFileInput" accept=".json" style="display: none;" onchange="handleImportAspirantBackup(event)">
            </div>
            
            <!-- Short Status Message (शार्ट स्टेटस संदेश) -->
            <div id="backupStatusMessage" style="display: none; font-size: 11px; font-weight: 800; text-align: center; margin-top: 10px; color: #2ecc71; background: rgba(46,204,113,0.06); border: 1.5px solid rgba(46,204,113,0.15); border-radius: 12px; padding: 6px 10px;"></div>
        </div>

        <!-- Box 4: Connect Live Box (Social accounts box - ALWAYS VISIBLE) -->
        <div style="background: var(--light-grey); border: 1px solid var(--border-color); border-radius: 24px; padding: 22px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); margin-bottom: 20px; text-align: left;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px;">
                <div style="background: rgba(255, 107, 53, 0.1); border: 1.5px solid rgba(255, 107, 53, 0.15); width: 34px; height: 34px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
                    <i class="ph-fill ph-chats" style="color: #FF6B35; font-size: 16px;"></i>
                </div>
                <div>
                    <h4 style="margin: 0; font-size: 13.5px; font-weight: 900; color: var(--dark); letter-spacing: -0.3px;">Connect Live</h4>
                    <p style="margin: 2px 0 0; font-size: 10px; font-weight: 750; color: var(--grey-text);">Join our student support groups</p>
                </div>
            </div>

            <div class="social-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                ${config.social.whatsapp ? `
                <a href="${config.social.whatsapp}" target="_blank" class="social-link-btn" style="color: #25d366; background: rgba(37, 211, 102, 0.05); border: 1.5px solid rgba(37, 211, 102, 0.15); border-radius: 16px; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 10px; text-decoration: none; font-size: 12px; font-weight: 850;">
                    <i class="ph-fill ph-whatsapp-logo" style="font-size: 18px;"></i>
                    <span>WhatsApp</span>
                </a>` : ''}
                ${config.social.telegram ? `
                <a href="${config.social.telegram}" target="_blank" class="social-link-btn" style="color: #0088cc; background: rgba(0, 136, 204, 0.05); border: 1.5px solid rgba(0, 136, 204, 0.15); border-radius: 16px; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 10px; text-decoration: none; font-size: 12px; font-weight: 850;">
                    <i class="ph-fill ph-telegram-logo" style="font-size: 18px;"></i>
                    <span>Telegram</span>
                </a>` : ''}
                ${config.social.instagram ? `
                <a href="${config.social.instagram}" target="_blank" class="social-link-btn" style="color: #c13584; background: rgba(193, 53, 132, 0.05); border: 1.5px solid rgba(193, 53, 132, 0.15); border-radius: 16px; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 10px; text-decoration: none; font-size: 12px; font-weight: 850;">
                    <i class="ph-fill ph-instagram-logo" style="font-size: 18px;"></i>
                    <span>Instagram</span>
                </a>` : ''}
                ${config.social.youtube ? `
                <a href="${config.social.youtube}" target="_blank" class="social-link-btn" style="color: #ff0000; background: rgba(255, 0, 0, 0.05); border: 1.5px solid rgba(255, 0, 0, 0.15); border-radius: 16px; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 10px; text-decoration: none; font-size: 12px; font-weight: 850;">
                    <i class="ph-fill ph-youtube-logo" style="font-size: 18px;"></i>
                    <span>YouTube</span>
                </a>` : ''}
                ${(config.social.customLinks || []).map((link: any) => `
                <a href="${link.url}" target="_blank" class="social-link-btn" style="color: ${link.color || 'var(--dark)'}; background: rgba(120, 120, 120, 0.03); border: 1.5px solid var(--border-color); border-radius: 16px; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 10px; text-decoration: none; font-size: 12px; font-weight: 850;">
                    <i class="${link.icon || 'ph-fill ph-link'}" style="font-size: 18px;"></i>
                    <span>${link.title || 'Link'}</span>
                </a>`).join('')}
            </div>
        </div>

        <!-- Box 5: Legal & Compliance Box (ALWAYS VISIBLE for AdSense & Trust) -->
        <div style="background: var(--light-grey); border: 1px solid var(--border-color); border-radius: 24px; padding: 22px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); margin-bottom: 20px; text-align: left;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px;">
                <div style="background: rgba(120, 120, 120, 0.08); border: 1.5px solid var(--border-color); width: 34px; height: 34px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
                    <i class="ph-bold ph-shield-check" style="color: var(--dark); font-size: 16px;"></i>
                </div>
                <div>
                    <h4 style="margin: 0; font-size: 13.5px; font-weight: 900; color: var(--dark); letter-spacing: -0.3px;">Legal & Compliance</h4>
                    <p style="margin: 2px 0 0; font-size: 10px; font-weight: 750; color: var(--grey-text);">Policies and safety disclosures</p>
                </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 8px;">
                <button onclick="handleTriggerShowLegalModal('privacy')" style="background: none; border: none; padding: 10px 14px; background: rgba(0,0,0,0.01); border: 1.5px solid var(--border-color); border-radius: 14px; color: var(--dark); text-align: left; font-size: 12px; font-weight: 800; display: flex; align-items: center; justify-content: space-between; width: 100%; cursor: pointer;">
                    <span>Privacy Policy</span>
                    <i class="ph ph-caret-right" style="font-size: 14px; color: var(--grey-text);"></i>
                </button>
                <button onclick="handleTriggerShowLegalModal('terms')" style="background: none; border: none; padding: 10px 14px; background: rgba(0,0,0,0.01); border: 1.5px solid var(--border-color); border-radius: 14px; color: var(--dark); text-align: left; font-size: 12px; font-weight: 800; display: flex; align-items: center; justify-content: space-between; width: 100%; cursor: pointer;">
                    <span>Terms & Conditions</span>
                    <i class="ph ph-caret-right" style="font-size: 14px; color: var(--grey-text);"></i>
                </button>
                <button onclick="handleTriggerShowLegalModal('disclaimer')" style="background: none; border: none; padding: 10px 14px; background: rgba(0,0,0,0.01); border: 1.5px solid var(--border-color); border-radius: 14px; color: var(--dark); text-align: left; font-size: 12px; font-weight: 800; display: flex; align-items: center; justify-content: space-between; width: 100%; cursor: pointer;">
                    <span>Legal Disclaimer</span>
                    <i class="ph ph-caret-right" style="font-size: 14px; color: var(--grey-text);"></i>
                </button>
                <button onclick="handleTriggerShowLegalModal('copyright')" style="background: none; border: none; padding: 10px 14px; background: rgba(0,0,0,0.01); border: 1.5px solid var(--border-color); border-radius: 14px; color: var(--dark); text-align: left; font-size: 12px; font-weight: 800; display: flex; align-items: center; justify-content: space-between; width: 100%; cursor: pointer;">
                    <span>Copyright Policy</span>
                    <i class="ph ph-caret-right" style="font-size: 14px; color: var(--grey-text);"></i>
                </button>
            </div>
        </div>
    </div>


    <!-- Interactive Results and Analyses Dashboard (Redesigned) -->
    <div id="scr-results" class="screen">
        <div class="scorecard-block" style="background: linear-gradient(135deg, var(--dark) 0%, #1e293b 100%); color: white; border-radius: 24px; padding: 25px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); margin-bottom: 25px; position: relative; overflow: hidden;">
            <div style="position: absolute; top: -50px; right: -50px; width: 150px; height: 150px; background: rgba(255,107,53,0.1); border-radius: 50%; pointer-events: none;"></div>
            
            <h2 style="margin: 0 0 5px 0; font-size: 20px; font-weight: 900; letter-spacing: 0.5px; text-align: center;">MOCK TEST SCORECARD</h2>
            <p id="resultsTopicHeader" style="margin: 0 0 20px 0; font-size: 11px; text-transform: uppercase; color: var(--primary); font-weight: bold; text-align: center; letter-spacing: 1px;">GENERAL TEST</p>
            
            <!-- Main Score Big Banner -->
            <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 20px; text-align: center; margin-bottom: 20px;">
                <span style="font-size: 10px; color: rgba(255,255,255,0.6); text-transform: uppercase; font-weight: 800; letter-spacing: 1.5px;">Obtained Score / Marks</span>
                <div style="display: flex; align-items: baseline; justify-content: center; gap: 8px; margin-top: 5px;">
                    <h1 id="statTotalScoreCalcText" style="margin: 0; color: #22c55e; font-size: 40px; font-weight: 950; line-height: 1;">0.00</h1>
                    <span id="statTotalPossibleMarks" style="font-size: 16px; color: rgba(255,255,255,0.4); font-weight: bold;">/ 100.00</span>
                </div>
            </div>

            <!-- Dashboard Stats Grid -->
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 10px 12px; display: flex; align-items: center; gap: 10px;">
                    <i class="ph ph-list-numbers" style="font-size: 18px; color: var(--primary);"></i>
                    <div>
                        <p style="margin: 0; font-size: 9px; color: rgba(255,255,255,0.5); font-weight: bold; text-transform: uppercase;">Total Items</p>
                        <h4 id="statTotalItemsText" style="margin: 2px 0 0; font-size: 14px; font-weight: bold;">0</h4>
                    </div>
                </div>
                <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 10px 12px; display: flex; align-items: center; gap: 10px;">
                    <i class="ph ph-check-circle" style="font-size: 18px; color: #22c55e;"></i>
                    <div>
                        <p style="margin: 0; font-size: 9px; color: rgba(255,255,255,0.5); font-weight: bold; text-transform: uppercase;">Correct Choice</p>
                        <h4 id="statCorrectCountText" style="margin: 2px 0 0; font-size: 14px; font-weight: bold; color: #22c55e;">0</h4>
                    </div>
                </div>
                <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 10px 12px; display: flex; align-items: center; gap: 10px;">
                    <i class="ph ph-x-circle" style="font-size: 18px; color: #ef4444;"></i>
                    <div>
                        <p style="margin: 0; font-size: 9px; color: rgba(255,255,255,0.5); font-weight: bold; text-transform: uppercase;">Incorrect Choice</p>
                        <h4 id="statIncorrectCountText" style="margin: 2px 0 0; font-size: 14px; font-weight: bold; color: #ef4444;">0</h4>
                    </div>
                </div>
                <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 10px 12px; display: flex; align-items: center; gap: 10px;">
                    <i class="ph ph-minus-circle" style="font-size: 18px; color: #3b82f6;"></i>
                    <div>
                        <p style="margin: 0; font-size: 9px; color: rgba(255,255,255,0.5); font-weight: bold; text-transform: uppercase;">Unanswered</p>
                        <h4 id="statUnansweredCountText" style="margin: 2px 0 0; font-size: 14px; font-weight: bold; color: #3b82f6;">0</h4>
                    </div>
                </div>
                <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 10px 12px; display: flex; align-items: center; gap: 10px;">
                    <i class="ph ph-percent" style="font-size: 18px; color: #eab308;"></i>
                    <div>
                        <p style="margin: 0; font-size: 9px; color: rgba(255,255,255,0.5); font-weight: bold; text-transform: uppercase;">Accuracy Ratio</p>
                        <h4 id="statAccuracyPercent" style="margin: 2px 0 0; font-size: 14px; font-weight: bold; color: #eab308;">0%</h4>
                    </div>
                </div>
                <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 10px 12px; display: flex; align-items: center; gap: 10px;">
                    <i class="ph ph-clock" style="font-size: 18px; color: #a855f7;"></i>
                    <div>
                        <p style="margin: 0; font-size: 9px; color: rgba(255,255,255,0.5); font-weight: bold; text-transform: uppercase;">Duration Taken</p>
                        <h4 id="statDurationSpent" style="margin: 2px 0 0; font-size: 14px; font-weight: bold; color: #a855f7;">--</h4>
                    </div>
                </div>
                <div onclick="handleShowRevealedAnswersModal()" style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 12px; padding: 10px 12px; display: flex; align-items: center; gap: 10px; grid-column: span 2; cursor: pointer; transition: all 0.2s ease;" onmouseover="this.style.background='rgba(16, 185, 129, 0.15)'" onmouseout="this.style.background='rgba(16, 185, 129, 0.08)'">
                    <i class="ph-fill ph-eye" style="font-size: 20px; color: #10b981;"></i>
                    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                        <div>
                            <p style="margin: 0; font-size: 9px; color: #10b981; font-weight: bold; text-transform: uppercase;">Revealed (Eye Assist)</p>
                            <h4 id="statRevealedAnswersCount" style="margin: 2px 0 0; font-size: 14px; font-weight: bold; color: #10b981;">0</h4>
                        </div>
                        <span style="font-size: 10px; background: rgba(16, 185, 129, 0.15); color: #10b981; font-weight: bold; padding: 3px 8px; border-radius: 8px; display: flex; align-items: center; gap: 4px;">
                            View Slides <i class="ph-bold ph-caret-right" style="font-size: 10px;"></i>
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Live Test Leaderboard Board is removed -->
        <div id="resultsLeaderboardBlock" style="display: none !important;"></div>

        <h3 class="section-header-title" style="margin-top: 25px; margin-bottom: 8px;">
            <i class="ph ph-chart-bar"></i> Interactive Paper Analysis
        </h3>
        <p style="font-size: 12px; color: var(--grey-text); margin-top: 0; margin-bottom: 15px;">
            Tap on any question block below to instantly inspect correct answer choice, comprehensive evaluations, explanations, and direct references.
        </p>

        <!-- Horizontal Scrollable Selector Row -->
        <div id="analysisQuestionSelectorRow" style="display: flex; gap: 8px; overflow-x: auto; padding: 12px 6px; margin-bottom: 20px; background: var(--light-grey); border: 1px solid var(--border-color); border-radius: 16px; -webkit-overflow-scrolling: touch; scrollbar-width: none;">
            <!-- Rendered horizontally -->
        </div>

        <!-- Inline Detailed Analysis Card Container -->
        <div id="analysisDetailViewerCard" style="background: white; border: 1px solid var(--border-color); border-radius: 20px; padding: 20px; margin-bottom: 25px; min-height: 200px; box-shadow: 0 4px 15px rgba(0,0,0,0.01);">
            <!-- Active Selected Question render here -->
        </div>

        <!-- Google AdSense Results Bottom Ad Slot -->
        <div id="ad-container-results-bottom" style="margin: 20px 0; display: none;"></div>

        <button class="btn-fill-prime" onclick="handleTriggerRefreshReboot()" style="background: var(--dark); border-radius: 14px; padding: 14px; font-size: 14px; width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; margin-top: 20px;">
            <i class="ph ph-squares-four" style="font-size: 18px;"></i> Back To Dashboard
        </button>
    </div>


    <!-- Website Popup General Purpose Custom Modal -->
    <div id="websitePopupOverlayModal" class="analysis-detail-modal" style="display: none; align-items: center; justify-content: center; background: rgba(0,0,0,0.7); z-index: 30000; position: fixed; top: 0; left: 0; right: 0; bottom: 0; padding: 20px; backdrop-filter: blur(3px);">
        <div style="background: white; border-radius: 24px; padding: 30px; width: 100%; max-width: 400px; text-align: center; box-shadow: 0 15px 40px rgba(0,0,0,0.3); animation: zoomIn 0.3s ease; position: relative;">
            
            <!-- Close CUT icon -->
            <button onclick="handleCloseWebsiteActivePopup()" class="close-floating-btn" title="Close">
                &times;
            </button>

            <h2 id="p_modal_title" style="font-weight: 900; font-size: 19px; margin: 5px 0 15px; color: var(--dark); font-family: 'Sahitya', serif; padding-right: 25px; text-align: left;">
                Notice
            </h2>
            
            <!-- 1:1 image layout -->
            <div style="margin-bottom: 20px; overflow: hidden; border-radius: 16px; border: 1px solid var(--border-color); width: 100%; aspect-ratio: 1/1; background: #fafafa; display: flex; align-items: center; justify-content: center;">
                <img id="p_modal_image" src="" referrerPolicy="no-referrer" style="width: 100%; height: 100%; object-fit: cover; display: none;" alt="Popup Media" />
            </div>

            <p id="p_modal_text" style="font-size: 13.5px; line-height: 1.6; color: #57606f; margin: 0 0 24px; text-align: left; font-family: 'Sahitya', serif; white-space: pre-wrap; word-break: break-word;">
            </p>
            
            <a id="p_modal_link" href="#" target="_blank" class="btn-fill-prime" style="display: none; background: var(--primary); text-align: center; padding: 14px; border-radius: 12px; font-weight: bold; text-decoration: none; color: white;">
                Explore Details &rarr;
            </a>
        </div>
    </div>


    <!-- Payment Success Custom Modal Popup -->
    <div id="paymentSuccessPopupModal" class="analysis-detail-modal" style="display: none; align-items: center; justify-content: center; background: rgba(0,0,0,0.6); z-index: 10000; position: fixed; top: 0; left: 0; right: 0; bottom: 0; padding: 20px;">
        <div style="background: white; border-radius: 24px; padding: 30px; width: 100%; max-width: 440px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.15); animation: zoomIn 0.3s ease;">
            <i class="ph-fill ph-check-circle" style="font-size: 64px; color: #22c55e; margin-bottom: 15px; display: inline-block;"></i>
            <h2 style="font-weight: 900; font-size: 20px; margin: 0 0 10px; color: var(--dark); font-family: 'Sahitya', serif;">Submitted Successfully.</h2>
            <p style="font-size: 13.5px; line-height: 1.5; color: var(--grey-text); margin: 0 0 20px; font-family: 'Sahitya', serif;">Access will be granted within 4–24 hours.</p>
            
            <div style="background: var(--light-grey); border-radius: 12px; padding: 15px; text-align: left; margin-bottom: 20px; font-size: 12px; line-height: 1.5; border: 1px solid var(--border-color); font-family: 'Sahitya', serif;">
                <strong style="color: var(--dark); display: block; margin-bottom: 4px;">Support Desk:</strong>
                If you face any issue or do not receive access, please contact: <br>
                <a href="http://t.me/PrayasOneSupportBot" target="_blank" style="color: var(--primary); font-weight: bold; text-decoration: underline;">http://t.me/PrayasOneSupportBot</a>
                <p style="margin: 8px 0 0 0; font-size: 11px; color: var(--grey-text); font-style: italic;">
                    *Please provide your transaction details while contacting support.
                </p>
            </div>
            
            <button onclick="handleClosePaymentSuccessModal()" class="btn-fill-prime" style="margin: 0; width: 100%; background: var(--dark); padding: 12px; border-radius: 10px;">
                Done & Return Home
            </button>
        </div>
    </div>


    <!-- Gated Content Premium Blocker Custom Modal -->
    <div id="premiumBlockerModal" class="analysis-detail-modal" style="display: none; align-items: center; justify-content: center; background: rgba(0,0,0,0.6); z-index: 10000; position: fixed; top: 0; left: 0; right: 0; bottom: 0; padding: 20px;">
        <div style="background: white; border-radius: 24px; padding: 30px; width: 100%; max-width: 400px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.15); animation: zoomIn 0.3s ease;">
            <i class="ph-fill ph-lock-key" style="font-size: 64px; color: var(--primary); margin-bottom: 15px; display: inline-block;"></i>
            <h2 style="font-weight: 900; font-size: 20px; margin: 0 0 10px; color: var(--dark); font-family: 'Sahitya', serif;">Premium Membership Required</h2>
            <p style="font-size: 13px; line-height: 1.5; color: var(--grey-text); margin: 0 0 24px; font-family: 'Sahitya', serif;">This content is reserved for Premium Members. Gain access to all mock exams, manuals, and future worksheets instantly.</p>
            
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <button onclick="handleClosePremiumBlocker(); handleTabNavigation('acc')" class="btn-fill-prime" style="background: var(--primary); margin: 0; font-size: 13px; border-radius: 10px;">
                    <i class="ph ph-user"></i> Login to Premium Account
                </button>
                <button onclick="handleClosePremiumBlocker(); showGeneralPremiumPaymentScreen()" class="btn-fill-prime" style="background: var(--dark); margin: 0; font-size: 13px; border-radius: 10px;">
                    <i class="ph ph-crown"></i> Unlock Premium (${config.social.premiumPrice || "₹45"})
                </button>
                <button onclick="handleClosePremiumBlocker()" class="modal-cancel-btn">
                    Cancel
                </button>
            </div>
        </div>
    </div>


    <!-- Test Protection & Pause Resume Modal -->
    <div id="testPauseResumeModal" class="analysis-detail-modal" style="display: none; align-items: center; justify-content: center; background: rgba(0,0,0,0.8); z-index: 20000; position: fixed; top: 0; left: 0; right: 0; bottom: 0; padding: 20px; backdrop-filter: blur(5px);">
        <div style="background: white; border-radius: 24px; padding: 30px; width: 100%; max-width: 400px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.2); animation: zoomIn 0.3s ease;">
            <i class="ph-bold ph-warning-octagon" style="font-size: 64px; color: var(--primary); margin-bottom: 15px; display: inline-block;"></i>
            <h2 style="font-weight: 950; font-size: 20px; margin: 0 0 10px; color: var(--dark);">Assessment Paused</h2>
            <p style="font-size: 13px; line-height: 1.5; color: var(--grey-text); margin: 0 0 24px;">The test was auto-paused due to window context switching, loss of focus, application lock, or clicking the Back button. Your progress is completely protected.</p>
            
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <button onclick="handleResumeActiveTest()" class="btn-fill-prime" style="background: #22c55e; color: white; width: 100%; padding: 12px; border-radius: 12px; font-weight: bold; font-size: 13.5px; margin: 0; border: none; cursor: pointer;">
                    Resume Test
                </button>
                <button onclick="handleExitActiveTest()" class="modal-cancel-btn" style="width: 100%; border-radius: 12px; padding: 12px; font-size: 13.5px;">
                    Exit Test
                </button>
            </div>
        </div>
    </div>


    <!-- Submit Test Progress Stats Redesigned Custom Modal -->
    <div id="submitConfirmModal" class="analysis-detail-modal" style="display: none; align-items: center; justify-content: center; background: rgba(0,0,0,0.6); z-index: 10010; position: fixed; top: 0; left: 0; right: 0; bottom: 0; padding: 20px;">
        <div style="background: white; border-radius: 24px; padding: 30px; width: 100%; max-width: 420px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.15); animation: zoomIn 0.3s ease;">
            <i class="ph-bold ph-question" style="font-size: 54px; color: var(--primary); margin-bottom: 15px; display: inline-block;"></i>
            <h2 style="font-weight: 900; font-size: 20px; margin: 0 0 8px; color: var(--dark); font-family: 'Sahitya', serif;">Submit Your Mock Test?</h2>
            <p style="font-size: 13px; color: var(--grey-text); margin-bottom: 24px; font-family: 'Sahitya', serif;">Please review your progress before final evaluation. Once submitted, answers cannot be modified.</p>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 24px;">
                <div style="background: rgba(34, 197, 94, 0.08); border: 1.5px solid rgba(34, 197, 94, 0.2); border-radius: 16px; padding: 12px; text-align: center;">
                    <p style="margin: 0; font-size: 10px; font-weight: bold; color: rgb(21, 128, 61); text-transform: uppercase;">Attempted</p>
                    <h3 id="confirmAttemptedCount" style="margin: 4px 0 0; font-size: 24px; font-weight: 900; color: rgb(21, 128, 61);">0</h3>
                </div>
                <div style="background: rgba(239, 68, 68, 0.08); border: 1.5px solid rgba(239, 68, 68, 0.2); border-radius: 16px; padding: 12px; text-align: center;">
                    <p style="margin: 0; font-size: 10px; font-weight: bold; color: rgb(185, 28, 28); text-transform: uppercase;">Unattempted</p>
                    <h3 id="confirmUnattemptedCount" style="margin: 4px 0 0; font-size: 24px; font-weight: 900; color: rgb(185, 28, 28);">0</h3>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <button onclick="handleCloseSubmitConfirmModal()" class="modal-cancel-btn" style="padding: 14px; font-size: 13px;">
                    Cancel
                </button>
                <button onclick="handleConfirmSubmitTest()" class="btn-fill-prime" style="margin: 0; padding: 14px; font-size: 13px; background: var(--primary); border-radius: 12px;">
                    Submit Test
                </button>
            </div>
        </div>
    </div>


    <!-- Report Active Question Complaint Drawer-Modal Overlay -->
    <div id="reportQuestionModal" class="analysis-detail-modal" style="display: none; align-items: center; justify-content: center; background: rgba(0,0,0,0.6); z-index: 10020; position: fixed; top: 0; left: 0; right: 0; bottom: 0; padding: 20px;">
        <div style="background: white; border-radius: 24px; padding: 25px; width: 100%; max-width: 450px; text-align: left; box-shadow: 0 10px 25px rgba(0,0,0,0.15); animation: zoomIn 0.3s ease; display: flex; flex-direction: column; gap: 15px;">
            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">
                <h3 style="margin: 0; font-weight: 950; font-size: 17px; color: var(--dark); font-family: 'Sahitya', serif;">Report Question Discrepancy</h3>
                <div class="circle-close-btn" onclick="handleCloseReportModal()">
                    <i class="ph ph-x" style="font-size: 16px;"></i>
                </div>
            </div>
            
            <div>
                <label style="font-size: 11px; font-weight: bold; color: var(--grey-text); display: block; margin-bottom: 6px; text-transform: uppercase;">What is wrong with this question? (Optional)</label>
                <textarea id="reportComplaintTextArea" class="form-input" style="height: 110px; resize: none; margin-bottom: 0; font-family: inherit; font-size: 13px; border-radius: 12px; padding: 12px;" placeholder="Describe typo inaccuracies, incorrect correct options keys, solution explanations, or translation bugs..."></textarea>
            </div>
            
            <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 5px;">
                <button onclick="handleCloseReportModal()" class="modal-cancel-btn" style="padding: 12px 18px; font-size: 12px;">
                    Cancel
                </button>
                <button id="btnSendReportEmail" onclick="handleSendReportEmail()" class="btn-fill-prime" style="margin: 0; padding: 12px 20px; font-size: 12px; background: var(--primary); border-radius: 10px;">
                    <i class="ph ph-paper-plane"></i> Send Report Email
                </button>
            </div>
        </div>
    </div>


    <!-- Question Palette Drawer -->
    <div class="drawer-sheet-overlay" id="paletteDrawerOverlay" onclick="handleTogglePalette(false)"></div>
    <div class="drawer-sheet" id="paletteDrawerContainer">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 12px;">
            <h3 style="margin: 0; font-weight: 900;">Mock Exam Palette</h3>
            <div class="drawer-close-btn" onclick="handleTogglePalette(false)">
                <i class="ph ph-x" style="font-size: 18px;"></i>
            </div>
        </div>

        <div class="palette-grid" id="paletteGridContent"></div>

        <div class="palette-legend">
            <div class="legend-item"><div class="palette-cell answered" style="width:16px; height:16px; aspect-ratio:1;"></div> Answered</div>
            <div class="legend-item"><div class="palette-cell review-marked" style="width:16px; height:16px; aspect-ratio:1;"></div> Marked</div>
            <div class="legend-item"><div class="palette-cell not-visited" style="width:16px; height:16px; aspect-ratio:1;"></div> Not Visited</div>
        </div>

        <button class="btn-fill-prime" onclick="handleTogglePalette(false)" style="margin-top: 15px; padding: 12px;">
            CONTINUE TEST
        </button>
    </div>


    <!-- Revealed Answers Bottom Sheet Drawer -->
    <div class="drawer-sheet-overlay" id="revealedDrawerOverlay" onclick="handleToggleRevealedAnswers(false)"></div>
    <div class="drawer-sheet" id="revealedAnswersDrawer" style="display: none; padding: 20px; border-radius: 24px 24px 0 0; max-height: 85vh; overflow-y: hidden;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 12px; margin-bottom: 15px; flex-shrink: 0;">
            <div style="display: flex; align-items: center; gap: 8px;">
                <i class="ph-fill ph-eye" style="color: #10b981; font-size: 20px;"></i>
                <h3 style="margin: 0; font-weight: 900; font-size: 16px;">Revealed Practice Sheet</h3>
            </div>
            <div class="drawer-close-btn" onclick="handleToggleRevealedAnswers(false)" style="cursor: pointer; padding: 4px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: var(--light-grey); width: 28px; height: 28px; border: 1px solid var(--border-color);">
                <i class="ph ph-x" style="font-size: 16px; color: var(--dark);"></i>
            </div>
        </div>

        <!-- Horizontal Slide Container -->
        <div id="revealedCarouselContainer" style="display: flex; flex-direction: column; flex-grow: 1; overflow: hidden; height: 100%;">
            <!-- Navigation Indicator Row -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; background: var(--light-grey); padding: 8px 12px; border-radius: 12px; border: 1px solid var(--border-color); flex-shrink: 0;">
                <button onclick="handleSlideRevealedPrev()" id="btnSlideRevealedPrev" style="background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 4px; color: var(--dark);" title="Previous Revealed Question">
                    <i class="ph-bold ph-caret-left" style="font-size: 18px;"></i>
                </button>
                <span id="revealedSlideIndicatorText" style="font-size: 12px; font-weight: 800; color: var(--dark);">Question 1 of 1</span>
                <button onclick="handleSlideRevealedNext()" id="btnSlideRevealedNext" style="background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 4px; color: var(--dark);" title="Next Revealed Question">
                    <i class="ph-bold ph-caret-right" style="font-size: 18px;"></i>
                </button>
            </div>

            <!-- Scrollable Slides Viewport -->
            <div id="revealedSlidesViewport" style="display: flex; overflow-x: auto; scroll-snap-type: x mandatory; scroll-behavior: smooth; gap: 20px; width: 100%; flex-grow: 1; overflow-y: auto; padding-bottom: 15px; -webkit-overflow-scrolling: touch; scrollbar-width: none;">
                <!-- Dynamically filled with slides -->
            </div>
        </div>
    </div>


    <!-- BOTTOM NAVIGATION TABS -->
    <div class="bottom-nav-bar" id="studentMainTabsPanel">
        <div class="bottom-nav-item active" id="tab-home" onclick="handleTabNavigation('home')">
            <i class="ph ph-house"></i>
            <span>Home</span>
        </div>
        <div class="bottom-nav-item" id="tab-tests" onclick="handleTabNavigation('tests')">
            <i class="ph ph-exam"></i>
            <span>Tests</span>
        </div>
        <div class="bottom-nav-item" id="tab-pdfs" onclick="handleTabNavigation('pdfs')">
            <i class="ph ph-file-pdf"></i>
            <span>PDFs</span>
        </div>
        <div class="bottom-nav-item" id="tab-acc" onclick="handleTabNavigation('acc')">
            <i class="ph ph-user"></i>
            <span>Account</span>
        </div>
    </div>


    <!-- Beautiful Custom Legal Policy Modal -->
    <div id="legalPolicyModalOverlay" style="display: none; align-items: center; justify-content: center; background: rgba(15, 23, 42, 0.45); z-index: 9999999; position: fixed; top: 0; left: 0; right: 0; bottom: 0; padding: 20px; backdrop-filter: blur(8px); transition: all 0.2s ease;">
        <div class="custom-dialog-card" style="border-radius: 24px; padding: 24px; width: 100%; max-width: 500px; max-height: 80vh; display: flex; flex-direction: column; text-align: left; animation: customZoomIn 0.25s cubic-bezier(0.16, 1, 0.3, 1); box-sizing: border-box; background: var(--bg-card); border: 1.5px solid var(--border-color);">
            <!-- Modal Header -->
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; border-bottom: 1.5px solid var(--border-color); padding-bottom: 14px; flex-shrink: 0;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="background: rgba(255, 107, 53, 0.1); width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1.5px solid rgba(255, 107, 53, 0.2);">
                        <i class="ph-bold ph-shield-check" style="font-size: 18px; color: #FF6B35;"></i>
                    </div>
                    <div>
                        <h3 id="legalPolicyModalTitle" style="margin: 0; font-size: 16px; font-weight: 850; color: var(--dark);">Legal Policy</h3>
                    </div>
                </div>
                <button onclick="closeLegalPolicyModal()" style="background: none; border: none; color: var(--grey-text); cursor: pointer; padding: 4px; display: inline-flex; align-items: center; justify-content: center;">
                    <i class="ph-bold ph-x" style="font-size: 20px;"></i>
                </button>
            </div>
            <!-- Modal Content (Scrollable) -->
            <div id="legalPolicyModalContent" style="overflow-y: auto; flex-grow: 1; padding-right: 4px; font-size: 12.5px; color: var(--grey-text); line-height: 1.6;">
                <!-- Content injected dynamically -->
            </div>
            <!-- Modal Footer -->
            <div style="margin-top: 16px; border-top: 1.5px solid var(--border-color); padding-top: 14px; display: flex; justify-content: flex-end; flex-shrink: 0;">
                <button onclick="closeLegalPolicyModal()" class="btn-fill-prime" style="margin: 0; padding: 10px 24px; border-radius: 12px; font-weight: 800; font-size: 12px; cursor: pointer; height: auto;">
                    Understood & Close
                </button>
            </div>
        </div>
    </div>


    <!-- Beautiful Custom Helpdesk Contact Form Modal -->
    <div id="helpdeskModalOverlay" style="display: none; align-items: center; justify-content: center; background: rgba(15, 23, 42, 0.45); z-index: 999999; position: fixed; top: 0; left: 0; right: 0; bottom: 0; padding: 20px; backdrop-filter: blur(8px); transition: all 0.2s ease;">
        <div class="custom-dialog-card" style="border-radius: 24px; padding: 28px 24px; width: 100%; max-width: 400px; text-align: left; animation: customZoomIn 0.25s cubic-bezier(0.16, 1, 0.3, 1); box-sizing: border-box;">
            <!-- Modal Header -->
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px; border-bottom: 1.5px solid rgba(0,0,0,0.05); padding-bottom: 16px;">
                <div style="background: rgba(37, 211, 102, 0.1); width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1.5px solid rgba(37, 211, 102, 0.2); flex-shrink: 0;">
                    <i class="ph-fill ph-headset" style="font-size: 24px; color: #25d366;"></i>
                </div>
                <div>
                    <h3 style="margin: 0; font-size: 18px; font-weight: 850; color: #0f172a; font-family: 'Sahitya', serif; letter-spacing: -0.02em;">Contact Help Desk</h3>
                    <p style="margin: 2px 0 0 0; font-size: 11.5px; color: #64748b; font-weight: 600;">Fill details to pre-fill your support chat</p>
                </div>
            </div>

            <!-- Auto-detected details badge -->
            <div style="background: rgba(255, 107, 53, 0.05); border: 1px solid rgba(255, 107, 53, 0.15); border-radius: 12px; padding: 12px; margin-bottom: 18px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                    <span style="font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase;">Selected Plan:</span>
                    <span id="helpdeskDetectedCategory" style="font-size: 11.5px; font-weight: 800; color: var(--primary);">Loading...</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase;">Price:</span>
                    <span id="helpdeskDetectedAmount" style="font-size: 13px; font-weight: 900; color: #2ecc71;">₹00</span>
                </div>
            </div>

            <!-- Inputs -->
            <div style="display: flex; flex-direction: column; gap: 12px;">
                <div>
                    <label style="display: block; font-size: 11.5px; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.5px;">Full Name *</label>
                    <input id="helpdeskInputName" type="text" placeholder="Enter your full name" style="padding: 12px 14px; border-radius: 12px; border: 1.5px solid #cbd5e1; font-size: 13.5px; width: 100%; box-sizing: border-box; font-weight: 600; outline: none; background: #fff; color: #0f172a; transition: all 0.2s;" />
                </div>

                <div>
                    <label style="display: block; font-size: 11.5px; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.5px;">Email ID *</label>
                    <input id="helpdeskInputEmail" type="email" placeholder="Enter your registered email" style="padding: 12px 14px; border-radius: 12px; border: 1.5px solid #cbd5e1; font-size: 13.5px; width: 100%; box-sizing: border-box; font-weight: 600; outline: none; background: #fff; color: #0f172a; transition: all 0.2s;" />
                </div>

                <div>
                    <label style="display: block; font-size: 11.5px; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.5px;">Phone Number *</label>
                    <input id="helpdeskInputPhone" type="tel" placeholder="Enter your mobile number" style="padding: 12px 14px; border-radius: 12px; border: 1.5px solid #cbd5e1; font-size: 13.5px; width: 100%; box-sizing: border-box; font-weight: 600; outline: none; background: #fff; color: #0f172a; transition: all 0.2s;" />
                </div>
            </div>

            <!-- Error container -->
            <div id="helpdeskModalError" style="display: none; color: #ef4444; font-size: 12px; font-weight: 700; margin-top: 12px; text-align: center;"></div>

            <!-- Actions -->
            <div style="display: flex; gap: 12px; margin-top: 22px;">
                <button onclick="closeHelpdeskModal()" style="flex: 1; padding: 13px; border-radius: 12px; font-weight: 800; cursor: pointer; font-size: 12.5px; justify-content: center; margin: 0; height: auto; border: 1.5px solid #e2e8f0; background: #f8fafc; color: #475569; transition: all 0.2s; text-transform: uppercase; letter-spacing: 0.5px;">Close</button>
                <button onclick="submitHelpdeskModal()" class="btn-fill-prime" style="flex: 1.4; margin: 0; padding: 13px; border-radius: 12px; font-weight: 800; font-size: 12.5px; cursor: pointer; height: auto; background: #25d366; color: #ffffff; border: none; transition: all 0.2s; text-transform: uppercase; letter-spacing: 0.5px; display: inline-flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.2);"><i class="ph-bold ph-paper-plane-tilt" style="font-size: 14px;"></i> Open Chat</button>
            </div>
        </div>
    </div>


    <!-- Beautiful Custom Dialog Modal (Alert/Confirm) -->
    <div id="customDialogOverlay" style="display: none; align-items: center; justify-content: center; background: rgba(15, 23, 42, 0.45); z-index: 999999; position: fixed; top: 0; left: 0; right: 0; bottom: 0; padding: 20px; backdrop-filter: blur(8px); transition: all 0.2s ease;">
        <div id="customDialogBox" class="custom-dialog-card" style="border-radius: 24px; padding: 32px 24px; width: 100%; max-width: 380px; text-align: center; animation: customZoomIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);">
            <div id="customDialogIconContainer" style="margin-bottom: 18px; display: flex; align-items: center; justify-content: center;">
                <div style="background: rgba(249,115,22,0.1); width: 68px; height: 68px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid rgba(249,115,22,0.2); margin-bottom: 8px;">
                    <i class="ph-fill ph-warning" style="font-size: 34px; color: #f97316;"></i>
                </div>
            </div>
            <h3 id="customDialogTitle" style="margin: 0 0 10px 0; font-size: 20px; font-weight: 850; color: #0f172a; font-family: 'Sahitya', serif; letter-spacing: -0.02em;">System Alert</h3>
            <p id="customDialogMessage" style="margin: 0 0 24px 0; font-size: 14px; color: #475569; line-height: 1.6; font-weight: 600; font-family: 'Sahitya', serif; white-space: pre-line; padding: 0 4px;">Something happened.</p>
            <div style="display: flex; gap: 12px; justify-content: center;">
                <button id="customDialogCancelBtn" class="modal-cancel-btn" style="flex: 1; padding: 14px; border-radius: 14px; font-weight: 800; cursor: pointer; display: none; font-size: 13px; justify-content: center; margin: 0; height: auto; border: 1.5px solid #e2e8f0; background: #f8fafc; color: #475569; transition: all 0.2s;">CANCEL</button>
                <button id="customDialogOkBtn" class="btn-fill-prime" style="flex: 1; margin: 0; padding: 14px; border-radius: 14px; font-weight: 800; font-size: 13px; cursor: pointer; height: auto; background: #0f172a; color: #ffffff; border: none; transition: all 0.2s; text-transform: uppercase;">OK</button>
            </div>
        </div>
    </div>


    <!-- Beautiful Custom Prompt Modal for Password Authorization -->
    <div id="customPromptOverlay" style="display: none; align-items: center; justify-content: center; background: rgba(15, 23, 42, 0.45); z-index: 999999; position: fixed; top: 0; left: 0; right: 0; bottom: 0; padding: 20px; backdrop-filter: blur(8px); transition: all 0.2s ease;">
        <div class="custom-dialog-card" style="border-radius: 24px; padding: 32px 24px; width: 100%; max-width: 380px; text-align: center; animation: customZoomIn 0.25s cubic-bezier(0.16, 1, 0.3, 1); box-sizing: border-box;">
            <!-- Modal Icon -->
            <div style="margin-bottom: 18px; display: flex; align-items: center; justify-content: center;">
                <div style="background: rgba(255, 184, 0, 0.1); width: 68px; height: 68px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2.5px solid rgba(255, 184, 0, 0.2); box-shadow: 0 4px 10px rgba(255,184,0,0.08); margin-bottom: 8px;">
                    <i class="ph-fill ph-lock" style="font-size: 34px; color: var(--primary);"></i>
                </div>
            </div>
            
            <h3 id="customPromptTitle" style="margin: 0 0 10px 0; font-size: 20px; font-weight: 850; color: #0f172a; font-family: 'Sahitya', serif; letter-spacing: -0.02em;">Authorization</h3>
            <p id="customPromptMessage" style="margin: 0 0 18px 0; font-size: 13.5px; color: #475569; line-height: 1.5; font-weight: 600; padding: 0 4px;">Enter your password to proceed.</p>
            
            <!-- Input container -->
            <div style="position: relative; margin-bottom: 22px; width: 100%; text-align: left;">
                <i class="ph ph-lock" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--grey-text); font-size: 16px;"></i>
                <input type="password" id="customPromptInput" class="form-input" placeholder="••••••••" style="padding-left: 42px; padding-right: 42px; margin: 0; border-radius: 12px; height: 46px; font-size: 13px; width: 100%; box-sizing: border-box; border: 1.5px solid var(--border-color); background: rgba(0,0,0,0.01);">
                <button type="button" onclick="toggleCustomPromptPasswordVisibility()" style="position: absolute; right: 14px; top: 50%; transform: translateY(-50%); border: none; background: transparent; padding: 0; cursor: pointer; color: var(--grey-text); display: flex; align-items: center; justify-content: center;">
                    <i id="customPromptEyeIcon" class="ph ph-eye-slash" style="font-size: 18px;"></i>
                </button>
            </div>

            <!-- Buttons -->
            <div style="display: flex; gap: 12px; justify-content: center; width: 100%;">
                <button id="customPromptCancelBtn" class="modal-cancel-btn" style="flex: 1; padding: 14px; border-radius: 14px; font-weight: 800; cursor: pointer; font-size: 13px; justify-content: center; margin: 0; height: auto;">CANCEL</button>
                <button id="customPromptConfirmBtn" class="btn-fill-prime" style="flex: 1; margin: 0; padding: 14px; border-radius: 14px; font-weight: 800; font-size: 13px; cursor: pointer; height: auto; text-transform: uppercase;">CONFIRM</button>
            </div>
        </div>
    </div>

    <!-- Copyright DISCLAIMER PDF Safe Gate Modal (Popup) -->
    <div id="copyrightPdfOverlay" style="display: none; align-items: flex-start; justify-content: center; background: rgba(15,23,42,0.85); z-index: 1000000; position: fixed; top: 0; left: 0; right: 0; bottom: 0; padding: 20px; overflow-y: auto; backdrop-filter: blur(8px); transition: all 0.25s ease;">
        <div class="custom-dialog-card copyright-pdf-card" style="border-radius: 24px; padding: 32px 24px; width: 100%; max-width: 420px; text-align: center; margin: auto; position: relative; max-height: calc(100vh - 40px); overflow-y: auto; animation: customZoomIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);">
            <div style="margin-bottom: 18px; display: flex; align-items: center; justify-content: center;">
                <div class="copyright-warning-container" style="width: 68px; height: 68px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <i class="ph-fill ph-warning" style="font-size: 34px; color: #d97706;"></i>
                </div>
            </div>
            
            <h3 class="copyright-pdf-title" style="margin: 0 0 10px 0; font-size: 22px; font-weight: 850; font-family: 'Sahitya', serif; letter-spacing: -0.02em;">Notice</h3>
            <p id="copyrightPdfBookTitle" style="margin: 0 0 20px 0; font-size: 13.5px; color: var(--primary); font-family: 'Sahitya', serif; font-weight: 750; word-break: break-all; opacity: 0.95; line-height: 1.4;"></p>
            
            <div style="text-align: left; font-family: 'Sahitya', serif; font-size: 13.5px; line-height: 1.6;">
                
                <!-- For Educational Purpose Only (Badged layout) -->
                <div class="copyright-edu-box" style="border-radius: 12px; padding: 12px 16px; margin-bottom: 14px; display: flex; gap: 10px; align-items: flex-start;">
                    <i class="ph-fill ph-graduation-cap" style="color: var(--primary); font-size: 18px; margin-top: 2px; flex-shrink: 0;"></i>
                    <div>
                        <strong class="copyright-edu-title" style="font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 2px;">For Educational Purpose Only</strong>
                        <span class="copyright-edu-text" style="font-size: 12.5px; font-weight: 500;">This material is distributed strictly for guidance, study aids, and educational purposes.</span>
                    </div>
                </div>

                <!-- All Rights Block -->
                <div class="dialog-sub-box" style="margin-bottom: 20px; display: flex; gap: 10px; align-items: flex-start;">
                    <i class="ph-fill ph-info" style="color: #64748b; font-size: 18px; margin-top: 2px; flex-shrink: 0;"></i>
                    <div>
                        <strong class="sub-box-text" style="font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 2px;">All Rights Reserved</strong>
                        <span class="sub-box-text" style="font-size: 12.5px; font-weight: 500;">All copyrights, trademarks, and intellectual merits belong to their respective publishers & creators. We do not claim ownership of this content.</span>
                    </div>
                </div>

                <!-- Contact section -->
                <div class="copyright-contact-section" style="padding-top: 16px; margin-bottom: 24px;">
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <span class="copyright-contact-label" style="font-weight: 700; font-size: 13px;">Concerned or want it removed? Email us:</span>
                        <a id="copyrightEmailBtn" class="copyright-email-btn" href="#" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; font-weight: 800; text-decoration: none; padding: 12px 16px; border-radius: 14px; transition: all 0.2s; font-size: 13px; font-mono; letter-spacing: -0.01em;">
                            <i class="ph-fill ph-envelope-simple" style="font-size: 18px;"></i> prayasone@rediffmail.com
                        </a>
                    </div>
                </div>
            </div>

            <div style="display: flex; gap: 12px; justify-content: center;">
                <button id="copyrightPdfCancelBtn" class="modal-cancel-btn" style="flex: 1; padding: 14px; border-radius: 14px; font-weight: 800; cursor: pointer; font-size: 13px; margin: 0; height: auto;">CLOSE</button>
                <button id="copyrightPdfDownloadBtn" class="btn-fill-prime" style="flex: 1; margin: 0; padding: 14px; border-radius: 14px; font-weight: 800; font-size: 13px; cursor: pointer; height: auto; text-transform: uppercase; white-space: nowrap;">PROCEED DOWNLOAD</button>
            </div>
        </div>
    </div>
    <style>
        @keyframes customZoomIn {
            from { opacity: 0; transform: scale(0.92); }
            to { opacity: 1; transform: scale(1); }
        }
        
        /* High-End Premium Custom Dialog Box Styling */
        .custom-dialog-card {
            background: #ffffff !important;
            color: #0f172a !important;
            border: 1px solid rgba(15, 23, 42, 0.08) !important;
            box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.05), 0 10px 10px -5px rgba(15, 23, 42, 0.03) !important;
            transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        /* Copyright PDF safe gate modal day/night modes compatibility styling */
        .copyright-pdf-card::-webkit-scrollbar {
            width: 4px;
        }
        .copyright-pdf-card::-webkit-scrollbar-track {
            background: transparent;
        }
        .copyright-pdf-card::-webkit-scrollbar-thumb {
            background: rgba(155, 89, 182, 0.25);
            border-radius: 10px;
        }
        body.dark-mode .copyright-pdf-card::-webkit-scrollbar-thumb {
            background: rgba(155, 89, 182, 0.4);
        }

        @media (max-width: 480px) {
            .copyright-pdf-card {
                padding: 22px 18px !important;
                border-radius: 18px !important;
                max-height: calc(100vh - 30px) !important;
            }
            .copyright-pdf-card h3 {
                font-size: 18px !important;
            }
            .copyright-warning-container {
                width: 52px !important;
                height: 52px !important;
                margin-bottom: 12px !important;
            }
            .copyright-warning-container i {
                font-size: 26px !important;
            }
            .copyright-edu-box, .dialog-sub-box {
                padding: 10px 12px !important;
                margin-bottom: 10px !important;
                gap: 8px !important;
            }
            .copyright-edu-title, .sub-box-text {
                font-size: 11px !important;
            }
            .copyright-edu-text, .sub-box-text {
                font-size: 11.5px !important;
            }
            .copyright-contact-section {
                padding-top: 12px !important;
                margin-bottom: 16px !important;
            }
            .copyright-email-btn {
                padding: 10px 12px !important;
                font-size: 11.5px !important;
            }
            .copyright-pdf-card button {
                padding: 11px !important;
                font-size: 12px !important;
                border-radius: 10px !important;
            }
        }

        @media (max-height: 640px) {
            .copyright-pdf-card {
                padding: 16px 16px !important;
                border-radius: 16px !important;
                max-height: calc(100vh - 20px) !important;
            }
            .copyright-warning-container {
                display: none !important;
            }
            .copyright-pdf-card h3 {
                margin-bottom: 4px !important;
                font-size: 17px !important;
            }
            #copyrightPdfBookTitle {
                margin-bottom: 10px !important;
                font-size: 12px !important;
            }
            .copyright-edu-box, .dialog-sub-box {
                padding: 8px 10px !important;
                margin-bottom: 8px !important;
                gap: 6px !important;
            }
            .copyright-contact-section {
                padding-top: 8px !important;
                margin-bottom: 12px !important;
            }
            .copyright-email-btn {
                padding: 8px 12px !important;
                font-size: 11px !important;
            }
            .copyright-pdf-card button {
                padding: 10px !important;
                font-size: 11px !important;
                border-radius: 8px !important;
            }
        }

        .copyright-pdf-title {
            color: #0f172a !important;
        }
        body.dark-mode .copyright-pdf-title {
            color: #efece6 !important;
        }
        
        .copyright-warning-container {
            background: #fffbeb !important;
            border: 2px solid #fef3c7 !important;
        }
        body.dark-mode .copyright-warning-container {
            background: rgba(217, 119, 6, 0.15) !important;
            border-color: rgba(217, 119, 6, 0.3) !important;
        }

        .copyright-edu-box {
            background: rgba(255, 107, 53, 0.08) !important;
            border-left: 4px solid var(--primary) !important;
        }
        body.dark-mode .copyright-edu-box {
            background: rgba(255, 107, 53, 0.15) !important;
        }

        .copyright-edu-title {
            color: #c2410c !important;
        }
        body.dark-mode .copyright-edu-title {
            color: #ff8a58 !important;
        }

        .copyright-edu-text {
            color: #7c2d12 !important;
        }
        body.dark-mode .copyright-edu-text {
            color: #ffd8c6 !important;
        }

        .copyright-contact-section {
            border-top: 1.5px dashed #e2e8f0 !important;
        }
        body.dark-mode .copyright-contact-section {
            border-top: 1.5px dashed #3e3d39 !important;
        }

        .copyright-contact-label {
            color: #1e293b !important;
        }
        body.dark-mode .copyright-contact-label {
            color: #efece6 !important;
        }

        .copyright-email-btn {
            background: #fee2e2 !important;
            color: #991b1b !important;
            border: 1.5px solid #fecaca !important;
        }
        body.dark-mode .copyright-email-btn {
            background: rgba(239, 68, 68, 0.15) !important;
            color: #fca5a5 !important;
            border: 1.5px solid rgba(239, 68, 68, 0.3) !important;
        }
        
        /* Dark Mode Theme Overrides for Dialog Box */
        body.dark-mode .custom-dialog-card {
            background-color: #1a1a18 !important;
            border: 2px solid #3e3d39 !important;
            color: #efece6 !important;
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.65), 0 0 1px rgba(255,255,255,0.1) !important;
        }
        
        body.dark-mode #customDialogTitle {
            color: #ffffff !important;
        }
        
        body.dark-mode #customDialogMessage {
            color: #cbd5e1 !important;
        }

        /* Specific Dialogue Subcomponents styling for Day/Night Modes compatibility */
        .dialog-intro-text {
            color: #475569;
        }
        body.dark-mode .dialog-intro-text {
            color: #cbd5e1 !important;
        }

        .dialog-highlight-box {
            background: rgba(255, 184, 0, 0.07);
            border-left: 4px solid var(--primary);
            border-radius: 12px;
            padding: 12px 14px;
            margin-bottom: 12px;
            display: flex;
            gap: 10px;
            align-items: flex-start;
        }
        body.dark-mode .dialog-highlight-box {
            background: rgba(255, 184, 0, 0.12) !important;
        }

        .highlight-title {
            color: #b45309;
        }
        body.dark-mode .highlight-title {
            color: #f59e0b !important;
        }

        .highlight-desc {
            color: #78350f;
        }
        body.dark-mode .highlight-desc {
            color: #fef3c7 !important;
        }

        .dialog-sub-box {
            background: #f8fafc;
            border: 1.5px solid #f1f5f9;
            border-radius: 12px;
            padding: 12px 14px;
            display: flex;
            gap: 10px;
            align-items: flex-start;
        }
        body.dark-mode .dialog-sub-box {
            background: #232320 !important;
            border-color: #2e2e2a !important;
        }

        .sub-box-text {
            color: #475569;
        }
        body.dark-mode .sub-box-text {
            color: #d1d5db !important;
        }

        #customDialogOkBtn {
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        #customDialogOkBtn:hover {
            opacity: 0.92 !important;
            transform: translateY(-1px) scale(1.01) !important;
            background: #1e293b !important;
            box-shadow: 0 4px 12px rgba(15,23,42,0.15) !important;
        }
        #customDialogOkBtn:active {
            transform: translateY(1px) scale(0.98) !important;
        }
        body.dark-mode #customDialogOkBtn {
            background: var(--primary) !important;
            color: #0f172a !important;
        }
        body.dark-mode #customDialogOkBtn:hover {
            opacity: 0.9 !important;
            background: var(--primary) !important;
            box-shadow: 0 4px 12px rgba(255, 184, 0, 0.35) !important;
        }

        #customDialogCancelBtn {
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        #customDialogCancelBtn:hover {
            background: #f1f5f9 !important;
            color: #0f172a !important;
            border-color: #cbd5e1 !important;
        }
        #customDialogCancelBtn:active {
            transform: translateY(1px) !important;
        }
        body.dark-mode #customDialogCancelBtn {
            background: #232320 !important;
            color: #efece6 !important;
            border-color: #3e3d39 !important;
        }
        body.dark-mode #customDialogCancelBtn:hover {
            background: #2e2e2a !important;
            color: #ffffff !important;
        }
    </style>

    <!-- APP LOGICAL INTEGRATION SCRIPTS -->
    <script>
        // Determine the base path directory for the application dynamically at startup
        // This is crucial for local modes (Hostinger public_html) to support path resolution after routing history.pushState changes the URL path in the address bar.
        (function() {
            if (!window.__studentAppBaseDir) {
                var pathname = window.location.pathname || "/";
                // If it ends with index.html or student.html, strip it
                var baseDir = pathname;
                if (baseDir.endsWith("/index.html")) {
                    baseDir = baseDir.substring(0, baseDir.length - 10);
                } else if (baseDir.endsWith("/student.html")) {
                    baseDir = baseDir.substring(0, baseDir.length - 12);
                }
                // Ensure baseDir ends with a single slash
                if (!baseDir.endsWith("/")) {
                    baseDir += "/";
                }
                window.__studentAppBaseDir = baseDir;
            }
        })();

        // --- ASPIRANT STABLE STATE SYNCHRONIZER (LocalStorage + Cookies Mirroring & Backup) ---
        function setAspirantCookie(name, value, days) {
            var expires = "";
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toUTCString();
            }
            document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/; SameSite=Lax";
        }

        function getAspirantCookie(name) {
            var nameEQ = encodeURIComponent(name) + "=";
            var ca = document.cookie.split(';');
            for(var i=0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) == 0) return decodeURIComponent(c.substring(nameEQ.length,c.length));
            }
            return null;
        }

        function eraseAspirantCookie(name) {
            document.cookie = encodeURIComponent(name) + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax';
        }

        function backupLocalToCookie(key, value) {
            try {
                if (!key) return;
                var cookieName = "_pr_" + key;
                setAspirantCookie(cookieName, value, 1800); // ~5 years
            } catch(e) {
                console.warn("Failed to backup key to cookie", e);
            }
        }

        function restoreAllCookiesToLocalStorage() {
            try {
                var ca = document.cookie.split(';');
                var restoredAny = false;
                for(var i = 0; i < ca.length; i++) {
                    var c = ca[i].trim();
                    if (c.indexOf("_pr_") === 0 || c.indexOf("%5Fpr%5F") === 0) {
                        var eqIdx = c.indexOf('=');
                        if (eqIdx > 0) {
                            var encodedKey = c.substring(0, eqIdx);
                            var encodedVal = c.substring(eqIdx + 1);
                            var key = decodeURIComponent(encodedKey).substring(4); // remove "_pr_"
                            var val = decodeURIComponent(encodedVal);
                            if (key && val) {
                                var existingLocal = localStorage.getItem(key);
                                if (!existingLocal) {
                                    localStorage.setItem(key, val);
                                    restoredAny = true;
                                }
                            }
                        }
                    }
                }
                if (restoredAny) {
                    console.log("Successfully restored missing student data from Cookies to LocalStorage.");
                }
            } catch(e) {
                console.warn("Error restoring cookies to localStorage:", e);
            }
        }

        function backupAllLocalStorageToCookies() {
            try {
                for (var i = 0; i < localStorage.length; i++) {
                    var key = localStorage.key(i);
                    if (key && (
                        key.indexOf("attempts_test_") === 0 ||
                        key.indexOf("pdf_read_") === 0 ||
                        key.indexOf("_cat_attempts_") === 0 ||
                        key === "_secured_active_aspirant" ||
                        key === "_last_aspirant_name" ||
                        key === "prayas_applied_coupons" ||
                        key === "prayas_one_saved_questions_universal_v3" ||
                        key === "_preemptive_theme_mode" ||
                        key === "_student_active_tab_id"
                    )) {
                        var val = localStorage.getItem(key);
                        if (val !== null) {
                            backupLocalToCookie(key, val);
                        }
                    }
                }
            } catch(e) {
                console.warn("Error backing up all localStorage to cookies:", e);
            }
        }

        // Intercept setItem and removeItem to automatically sync changes
        try {
            var originalSetItem = localStorage.setItem;
            localStorage.setItem = function(key, value) {
                try {
                    originalSetItem.apply(this, arguments);
                } catch(e) {
                    console.warn("localStorage setItem failed:", e);
                }
                if (key && (
                    key.indexOf("attempts_test_") === 0 ||
                    key.indexOf("pdf_read_") === 0 ||
                    key.indexOf("_cat_attempts_") === 0 ||
                    key === "_secured_active_aspirant" ||
                    key === "_last_aspirant_name" ||
                    key === "prayas_applied_coupons" ||
                    key === "prayas_one_saved_questions_universal_v3" ||
                    key === "_preemptive_theme_mode" ||
                    key === "_student_active_tab_id"
                )) {
                    backupLocalToCookie(key, value);
                }
            };

            var originalRemoveItem = localStorage.removeItem;
            localStorage.removeItem = function(key) {
                try {
                    originalRemoveItem.apply(this, arguments);
                } catch(e) {
                    console.warn("localStorage removeItem failed:", e);
                }
                if (key) {
                    eraseAspirantCookie("_pr_" + key);
                }
            };
        } catch(err) {
            console.warn("Could not wrap localStorage:", err);
        }

        // Restore cookies first, then synchronize all to ensure both storages are fully populated
        try {
            restoreAllCookiesToLocalStorage();
            backupAllLocalStorageToCookies();
        } catch(e) {
            console.warn("Initial sync error:", e);
        }

        // JSON Backup Export/Import Handlers
        function substituteChars(str, fromAlphabet, toAlphabet) {
            var result = [];
            for (var i = 0; i < str.length; i++) {
                var char = str.charAt(i);
                var index = fromAlphabet.indexOf(char);
                if (index !== -1) {
                    result.push(toAlphabet.charAt(index));
                } else {
                    result.push(char);
                }
            }
            return result.join("");
        }

        function aspirantEncrypt(text) {
            var key = "prayas_secret_key_99";
            var utf8Text = unescape(encodeURIComponent(text));
            var obfuscatedBytes = [];
            for (var i = 0; i < utf8Text.length; i++) {
                var b = utf8Text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
                obfuscatedBytes.push(String.fromCharCode(b));
            }
            var latin1Str = obfuscatedBytes.join("");
            var standardB64 = btoa(latin1Str);
            
            var stdChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            var cstChars = "9876543210zyxwvutsrqponmlkjihgfedcbaZYXWVUTSRQPONMLKJIHGFEDCBA_+-";
            return substituteChars(standardB64, stdChars, cstChars);
        }

        function aspirantDecrypt(obfuscatedStr) {
            var stdChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            var cstChars = "9876543210zyxwvutsrqponmlkjihgfedcbaZYXWVUTSRQPONMLKJIHGFEDCBA_+-";
            var standardB64 = substituteChars(obfuscatedStr, cstChars, stdChars);
            
            var key = "prayas_secret_key_99";
            var latin1Str = atob(standardB64);
            var decryptedBytes = [];
            for (var i = 0; i < latin1Str.length; i++) {
                var b = latin1Str.charCodeAt(i) ^ key.charCodeAt(i % key.length);
                decryptedBytes.push(String.fromCharCode(b));
            }
            var utf8Text = decryptedBytes.join("");
            return decodeURIComponent(escape(utf8Text));
        }

        function handleExportAspirantBackup() {
            try {
                if (!_studentLoggedInUser) {
                    showCustomAlert("Sign In Required", "Please sign in to your Aspirant account first to export your data.");
                    return;
                }
                var expectedPass = (_studentLoggedInUser.password || "").toString().trim();
                
                showCustomPrompt(
                    "Authorization Required", 
                    "Enter your Aspirant account password to authorize Backup Export:", 
                    "Password", 
                    function(enteredPass) {
                        if (enteredPass.trim() !== expectedPass) {
                            showCustomAlert("Authorization Failed", "Incorrect password! Backup export denied.");
                            return;
                        }

                        // Spin Sync badge side indicator
                        var syncIcon = document.getElementById("backupSyncIcon");
                        var syncText = document.getElementById("backupSyncText");
                        if (syncIcon) syncIcon.className = "ph-bold ph-arrows-counter-clockwise ph-spin";
                        if (syncText) syncText.innerText = "Exporting...";

                        var backupData = {};
                        for (var i = 0; i < localStorage.length; i++) {
                            var key = localStorage.key(i);
                            if (key && (
                                key.indexOf("attempts_test_") === 0 ||
                                key.indexOf("pdf_read_") === 0 ||
                                key.indexOf("_cat_attempts_") === 0 ||
                                key === "_secured_active_aspirant" ||
                                key === "_last_aspirant_name" ||
                                key === "prayas_applied_coupons" ||
                                key === "prayas_one_saved_questions_universal_v3" ||
                                key === "_preemptive_theme_mode" ||
                                key === "_student_active_tab_id"
                            )) {
                                backupData[key] = localStorage.getItem(key);
                            }
                        }

                        var rawJsonString = JSON.stringify(backupData);
                        var encryptedPayload = aspirantEncrypt(rawJsonString);
                        var secureWrapper = {
                            p_data: encryptedPayload
                        };

                        var blob = new Blob([JSON.stringify(secureWrapper, null, 2)], { type: "application/json" });
                        var url = URL.createObjectURL(blob);
                        var a = document.createElement("a");
                        var dateStr = new Date().toISOString().split('T')[0];
                        a.href = url;
                        a.download = "prayas_one_student_backup_" + dateStr + ".json";
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        
                        var statusEl = document.getElementById("backupStatusMessage");
                        if (statusEl) {
                            statusEl.style.display = "block";
                            statusEl.style.color = "#2ecc71";
                            statusEl.style.borderColor = "rgba(46,204,113,0.15)";
                            statusEl.style.background = "rgba(46,204,113,0.06)";
                            statusEl.innerHTML = "<i class='ph-bold ph-check'></i> Backup successful! File saved.";
                            setTimeout(function() {
                                statusEl.style.display = "none";
                            }, 4000);
                        }

                        // Reset Sync badge side indicator
                        setTimeout(function() {
                            if (syncIcon) syncIcon.className = "ph-bold ph-arrows-counter-clockwise";
                            if (syncText) syncText.innerText = "Sync";
                        }, 2000);
                    },
                    function() {
                        // Cancelled
                    }
                );
            } catch(e) {
                var statusEl = document.getElementById("backupStatusMessage");
                if (statusEl) {
                    statusEl.style.display = "block";
                    statusEl.style.color = "#ef4444";
                    statusEl.style.borderColor = "rgba(239,68,68,0.15)";
                    statusEl.style.background = "rgba(239,68,68,0.06)";
                    statusEl.innerHTML = "<i class='ph-bold ph-x'></i> Export failed: " + e.message;
                }
            }
        }

        function handleImportAspirantBackup(event) {
            try {
                if (!_studentLoggedInUser) {
                    showCustomAlert("Sign In Required", "Please sign in to your Aspirant account first to import your data.");
                    event.target.value = "";
                    return;
                }
                var expectedPass = (_studentLoggedInUser.password || "").toString().trim();
                
                showCustomPrompt(
                    "Authorization Required", 
                    "Enter your Aspirant account password to authorize Backup Import:", 
                    "Password", 
                    function(enteredPass) {
                        if (enteredPass.trim() !== expectedPass) {
                            showCustomAlert("Authorization Failed", "Incorrect password! Backup import denied.");
                            event.target.value = "";
                            return;
                        }

                        // Spin Sync badge side indicator
                        var syncIcon = document.getElementById("backupSyncIcon");
                        var syncText = document.getElementById("backupSyncText");
                        if (syncIcon) syncIcon.className = "ph-bold ph-arrows-counter-clockwise ph-spin";
                        if (syncText) syncText.innerText = "Importing...";

                        var file = event.target.files[0];
                        if (!file) {
                            if (syncIcon) syncIcon.className = "ph-bold ph-arrows-counter-clockwise";
                            if (syncText) syncText.innerText = "Sync";
                            event.target.value = "";
                            return;
                        }
                        var reader = new FileReader();
                        reader.onload = function(e) {
                            try {
                                var parsedWrapper = JSON.parse(e.target.result);
                                if (!parsedWrapper || typeof parsedWrapper !== "object" || !parsedWrapper.p_data) {
                                    throw new Error("Invalid or tempered backup file.");
                                }

                                var decryptedJsonStr = aspirantDecrypt(parsedWrapper.p_data);
                                var parsed = JSON.parse(decryptedJsonStr);
                                if (!parsed || typeof parsed !== "object") {
                                    throw new Error("Invalid payload format");
                                }

                                var count = 0;
                                for (var key in parsed) {
                                    if (parsed.hasOwnProperty(key)) {
                                        localStorage.setItem(key, parsed[key]);
                                        backupLocalToCookie(key, parsed[key]);
                                        count++;
                                    }
                                }

                                var statusEl = document.getElementById("backupStatusMessage");
                                if (statusEl) {
                                    statusEl.style.display = "block";
                                    statusEl.style.color = "#2ecc71";
                                    statusEl.style.borderColor = "rgba(46,204,113,0.15)";
                                    statusEl.style.background = "rgba(46,204,113,0.06)";
                                    statusEl.innerHTML = "<i class='ph-bold ph-arrows-counter-clockwise ph-spin'></i> Success! Progress restored. Reloading...";
                                }
                                
                                setTimeout(function() {
                                    window.location.reload();
                                }, 1200);
                            } catch(err) {
                                var statusEl = document.getElementById("backupStatusMessage");
                                if (statusEl) {
                                    statusEl.style.display = "block";
                                    statusEl.style.color = "#ef4444";
                                    statusEl.style.borderColor = "rgba(239,68,68,0.15)";
                                    statusEl.style.background = "rgba(239,68,68,0.06)";
                                    statusEl.innerHTML = "<i class='ph-bold ph-x'></i> Import failed: " + err.message;
                                }
                                if (syncIcon) syncIcon.className = "ph-bold ph-arrows-counter-clockwise";
                                if (syncText) syncText.innerText = "Sync";
                            }
                        };
                        reader.readAsText(file);
                    },
                    function() {
                        event.target.value = "";
                    }
                );
            } catch(e) {
                var statusEl = document.getElementById("backupStatusMessage");
                if (statusEl) {
                    statusEl.style.display = "block";
                    statusEl.style.color = "#ef4444";
                    statusEl.style.borderColor = "rgba(239,68,68,0.15)";
                    statusEl.style.background = "rgba(239,68,68,0.06)";
                    statusEl.innerHTML = "<i class='ph-bold ph-x'></i> Error reading file: " + e.message;
                }
                event.target.value = "";
            }
        }

        // Global error logging for debugging
        window.onerror = function(msg, url, line, col, error) {
            console.error(msg, url, line, col, error);
            alert("Student App Error: " + msg + "\\nLine: " + line + ", Column: " + col);
            return false;
        };

        function showCustomAlert(title, message, onOk) {
            document.getElementById("customDialogTitle").innerText = title;
            document.getElementById("customDialogMessage").innerHTML = message;
            
            var iconContainer = document.getElementById("customDialogIconContainer");
            var cleanTitle = (title || "").toLowerCase();
            if (cleanTitle.includes("success") || cleanTitle.includes("done") || cleanTitle.includes("complete") || cleanTitle.includes("saved")) {
                iconContainer.innerHTML = '<div style="background: rgba(34,197,94,0.1); width: 68px; height: 68px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2.5px solid rgba(34,197,94,0.15); box-shadow: 0 4px 10px rgba(34,197,94,0.08); margin-bottom: 8px;"><i class="ph-fill ph-check-circle" style="font-size: 34px; color: #22c55e;"></i></div>';
            } else if (cleanTitle.includes("error") || cleanTitle.includes("fail") || cleanTitle.includes("wrong")) {
                iconContainer.innerHTML = '<div style="background: rgba(239,68,68,0.1); width: 68px; height: 68px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2.5px solid rgba(239,68,68,0.15); box-shadow: 0 4px 10px rgba(239,68,68,0.08); margin-bottom: 8px;"><i class="ph-fill ph-x-circle" style="font-size: 34px; color: #ef4444;"></i></div>';
            } else if (cleanTitle.includes("pending") || cleanTitle.includes("verification") || cleanTitle.includes("wait")) {
                iconContainer.innerHTML = '<div style="background: rgba(255,184,0,0.1); width: 68px; height: 68px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2.5px solid rgba(255,184,0,0.18); box-shadow: 0 4px 10px rgba(255,184,0,0.08); margin-bottom: 8px;"><i class="ph-fill ph-clock" style="font-size: 34px; color: var(--primary);"></i></div>';
            } else {
                // Warning, Alert, Expired
                iconContainer.innerHTML = '<div style="background: rgba(249,115,22,0.1); width: 68px; height: 68px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2.5px solid rgba(249,115,22,0.15); box-shadow: 0 4px 10px rgba(249,115,22,0.08); margin-bottom: 8px;"><i class="ph-fill ph-warning" style="font-size: 34px; color: #f97316;"></i></div>';
            }

            var cancelBtn = document.getElementById("customDialogCancelBtn");
            cancelBtn.style.display = "none";
            
            var okBtn = document.getElementById("customDialogOkBtn");
            okBtn.style.display = "inline-flex";
            okBtn.innerText = "OK";
            okBtn.onclick = function() {
                document.getElementById("customDialogOverlay").style.display = "none";
                if (typeof onOk === "function") {
                    onOk();
                }
            };
            
            document.getElementById("customDialogOverlay").style.display = "flex";
        }

        function showCustomConfirm(title, message, onConfirm, onCancel) {
            document.getElementById("customDialogTitle").innerText = title;
            document.getElementById("customDialogMessage").innerHTML = message;
            
            document.getElementById("customDialogIconContainer").innerHTML = '<div style="background: rgba(59,130,246,0.1); width: 68px; height: 68px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2.5px solid rgba(59,130,246,0.15); box-shadow: 0 4px 10px rgba(59,130,246,0.08); margin-bottom: 8px;"><i class="ph-fill ph-question" style="font-size: 34px; color: #3b82f6;"></i></div>';
            
            var cancelBtn = document.getElementById("customDialogCancelBtn");
            cancelBtn.style.display = "inline-flex";
            cancelBtn.onclick = function() {
                document.getElementById("customDialogOverlay").style.display = "none";
                if (typeof onCancel === "function") {
                    onCancel();
                }
            };
            
            var okBtn = document.getElementById("customDialogOkBtn");
            okBtn.style.display = "inline-flex";
            okBtn.innerText = "YES, CONFIRM";
            okBtn.onclick = function() {
                document.getElementById("customDialogOverlay").style.display = "none";
                if (typeof onConfirm === "function") {
                    onConfirm();
                }
            };
            
            document.getElementById("customDialogOverlay").style.display = "flex";
        }

        window.showCustomAlert = showCustomAlert;
        window.showCustomConfirm = showCustomConfirm;

        function showCustomPrompt(title, message, placeholder, onConfirm, onCancel) {
            document.getElementById("customPromptTitle").innerText = title;
            document.getElementById("customPromptMessage").innerText = message;
            
            var inputEl = document.getElementById("customPromptInput");
            inputEl.value = "";
            inputEl.placeholder = placeholder || "••••••••";
            inputEl.type = "password";
            
            var eyeIcon = document.getElementById("customPromptEyeIcon");
            if (eyeIcon) {
                eyeIcon.className = "ph ph-eye-slash";
            }
            
            var cancelBtn = document.getElementById("customPromptCancelBtn");
            cancelBtn.onclick = function() {
                document.getElementById("customPromptOverlay").style.display = "none";
                if (typeof onCancel === "function") {
                    onCancel();
                }
            };
            
            var confirmBtn = document.getElementById("customPromptConfirmBtn");
            confirmBtn.onclick = function() {
                var val = inputEl.value;
                document.getElementById("customPromptOverlay").style.display = "none";
                if (typeof onConfirm === "function") {
                    onConfirm(val);
                }
            };

            inputEl.onkeydown = function(e) {
                if (e.key === "Enter") {
                    confirmBtn.click();
                }
            };
            
            document.getElementById("customPromptOverlay").style.display = "flex";
            setTimeout(function() {
                inputEl.focus();
            }, 100);
        }
        
        function toggleCustomPromptPasswordVisibility() {
            var inputEl = document.getElementById("customPromptInput");
            var eyeIcon = document.getElementById("customPromptEyeIcon");
            if (inputEl.type === "password") {
                inputEl.type = "text";
                eyeIcon.className = "ph ph-eye";
            } else {
                inputEl.type = "password";
                eyeIcon.className = "ph ph-eye-slash";
            }
        }
        
        window.showCustomPrompt = showCustomPrompt;
        window.toggleCustomPromptPasswordVisibility = toggleCustomPromptPasswordVisibility;

        function handleBuyNowClick(cat) {
            var catObj = cat;
            if (typeof cat === 'string') {
                var allCats = (DB.testCategories || []).concat(DB.pdfCategories || []);
                catObj = allCats.find(function(c) { return c.id === cat; });
                if (!catObj) {
                    try {
                        catObj = JSON.parse(cat);
                    } catch(e) {
                        console.error("Error parsing category object in Buy Now", e);
                    }
                }
            }
            if (!catObj) return;
            showCategoryPaymentScreen(catObj);
        }
        window.handleBuyNowClick = handleBuyNowClick;

        function showCopyrightPdfModal(bookTitle, pdfUrl, onConfirm) {
            document.getElementById("copyrightPdfBookTitle").innerText = "Book/PDFs: " + bookTitle;
            
            // Format nice dynamic report subject and body for email
            var emailSubject = encodeURIComponent("[Copyright Takedown] Prayas One Hub - PDF Resource Request");
            var emailBody = encodeURIComponent(
                "Hello Prayas One Administration,\\n\\n" +
                "I am writing regarding the following PDF study resource listed on the Portal:\\n\\n" +
                "📘 Title: " + bookTitle + "\\n" +
                "🔗 Link: " + pdfUrl + "\\n\\n" +
                "Message: \\n" +
                "⚠️ For educational purposes only.\\n\\n" +
                "All rights belong to the respective owners.\\n\\n" +
                "I kindly request the removal of this link because: "
            );
            
            var emailBtn = document.getElementById("copyrightEmailBtn");
            if (emailBtn) {
                emailBtn.href = "mailto:prayasone@rediffmail.com?subject=" + emailSubject + "&body=" + emailBody;
            }
            
            var cancelBtn = document.getElementById("copyrightPdfCancelBtn");
            if (cancelBtn) {
                cancelBtn.onclick = function() {
                    document.getElementById("copyrightPdfOverlay").style.display = "none";
                };
            }
            
            var downloadBtn = document.getElementById("copyrightPdfDownloadBtn");
            if (downloadBtn) {
                downloadBtn.onclick = function() {
                    document.getElementById("copyrightPdfOverlay").style.display = "none";
                    if (typeof onConfirm === "function") {
                        onConfirm();
                    }
                };
            }
            
            document.getElementById("copyrightPdfOverlay").style.display = "flex";
        }
        window.showCopyrightPdfModal = showCopyrightPdfModal;
        
        // Override standard window.alert
        window.alert = function(msg) {
            showCustomAlert("System Alert", msg);
        };

        // Decoded Embedded Coach Data
        var DB = {};
        
        // Quality enhancers for fetched URLs in student app
        function enhanceImageUrlQuality(url) {
            if (!url) return url;
            if (url.indexOf("data:") === 0 || url.indexOf("blob:") === 0) {
                return url;
            }
            if (url.indexOf("images.unsplash.com") !== -1) {
                try {
                    // Upgrade Unsplash quality parameters
                    var parts = url.split("?");
                    var baseUrl = parts[0];
                    var params = {};
                    if (parts.length > 1) {
                        var kvs = parts[1].split("&");
                        for (var i = 0; i < kvs.length; i++) {
                            var kv = kvs[i].split("=");
                            if (kv.length === 2) {
                                params[kv[0]] = kv[1];
                            }
                        }
                    }
                    if (params["w"]) {
                        var wVal = parseInt(params["w"], 10);
                        if (wVal < 1200) {
                            params["w"] = wVal <= 200 ? "800" : "1200";
                        }
                    } else {
                        params["w"] = "1200";
                    }
                    params["q"] = "85";
                    params["auto"] = "format";
                    params["fit"] = "crop";
                    
                    var newQueryParams = [];
                    for (var key in params) {
                        newQueryParams.push(key + "=" + params[key]);
                    }
                    return baseUrl + "?" + newQueryParams.join("&");
                } catch(e) {}
            } else if (url.indexOf("iili.io") !== -1) {
                url = url.replace(/\.md\.(png|jpg|jpeg)$/i, ".$1");
            }
            return url;
        }

        function enhanceAllDbImages(obj) {
            if (!obj || typeof obj !== "object") return;
            if (Array.isArray(obj)) {
                for (var i = 0; i < obj.length; i++) {
                    if (obj[i] && typeof obj[i] === "object") {
                        enhanceAllDbImages(obj[i]);
                    }
                }
                return;
            }
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    var val = obj[key];
                    if (typeof val === "string") {
                        if (key === "image" || key === "imageUrl" || key === "logoUrl" || key === "ogImage") {
                            obj[key] = enhanceImageUrlQuality(val);
                        }
                    } else if (val && typeof val === "object") {
                        enhanceAllDbImages(val);
                    }
                }
            }
        }

        var _sliderIntervalId = null;
        var _noticeIntervalId = null;

        function decodeObfuscatedPayload(scrambledStr) {
            if (!scrambledStr) return "";
            try {
                var isScrambled = false;
                var len = scrambledStr.length;
                for (var i = 0; i < Math.min(len, 100); i++) {
                    if (scrambledStr.charCodeAt(i) >= 0x0900) {
                        isScrambled = true;
                        break;
                    }
                }
                if (isScrambled) {
                    var out = new Array(len);
                    for (var r = 0; r < len; r++) {
                        var code = scrambledStr.charCodeAt(len - 1 - r);
                        out[r] = String.fromCharCode(code >= 0x0900 ? code - 0x0900 : code);
                    }
                    var b64 = out.join("");
                    return decodeURIComponent(escape(atob(b64)));
                } else {
                    return decodeURIComponent(escape(atob(scrambledStr)));
                }
            } catch (err) {
                try {
                    return decodeURIComponent(escape(atob(scrambledStr)));
                } catch (e2) {
                    return scrambledStr;
                }
            }
        }

        function _getRegistryPath(key) {
            var host = (window.location && window.location.hostname) ? window.location.hostname.toLowerCase() : "";
            var isCloudRun = host.indexOf("run.app") !== -1 || host.indexOf("localhost") !== -1 || host.indexOf("127.0.0.1") !== -1;
            if (window.__studentAppLocalMode || !isCloudRun) {
                var baseDir = window.__studentAppBaseDir || "./";
                return baseDir + (key || '');
            }
            var _map = [107, 119, 119, 115, 118, 61, 50, 50, 115, 120, 101, 48, 103, 102, 54, 57, 51, 56, 54, 57, 104, 55, 105, 101, 55, 57, 101, 100, 100, 54, 104, 54, 104, 59, 58, 52, 60, 103, 51, 52, 58, 60, 54, 104, 49, 117, 53, 49, 103, 104, 121, 50];
            var base = "";
            for (var i = 0; i < _map.length; i++) {
                base += String.fromCharCode(_map[i] - 3);
            }
            return base + (key || '');
        }

        function showToast(message) {
            var existing = document.getElementById("studentActionToastBox");
            if (existing) {
                existing.parentNode.removeChild(existing);
            }
            var toast = document.createElement("div");
            toast.id = "studentActionToastBox";
            toast.style = "position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%); background: #111827; color: white; padding: 10px 20px; border-radius: 12px; font-size: 12px; font-weight: bold; font-family: 'Sahitya', serif; z-index: 999999; box-shadow: 0 10px 25px rgba(0,0,0,0.2); pointer-events: none; opacity: 1; transition: opacity 0.3s ease;";
            toast.innerText = message;
            document.body.appendChild(toast);
            setTimeout(function() {
                toast.style.opacity = "0";
                setTimeout(function() {
                    if (toast.parentNode) toast.parentNode.removeChild(toast);
                }, 300);
            }, 1800);
        }

        function triggerMathJax() {
            if (window.MathJax && window.MathJax.typesetPromise) {
                setTimeout(function() {
                    window.MathJax.typesetPromise().catch(function(err) {
                        console.warn("MathJax formatting error:", err);
                    });
                }, 50);
            }
        }

        function getSavedQuestionsKey() {
            return "prayas_one_saved_questions_universal_v3";
        }

        function syncSavedQuestionsWithCloud(action, itemsToUpload) {
            if (!_studentLoggedInUser || !_studentLoggedInUser.emailOrMobile) return;
            var email = _studentLoggedInUser.emailOrMobile;

            if (action === "push") {
                fetch(getApiUrl("/api/student/saved-questions"), {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ emailOrMobile: email, savedQuestions: itemsToUpload || [] })
                })
                .then(function(r) { return r.json(); })
                .then(function(data) {
                    if (data.success) {
                        console.log("Saved questions synced to cloud.");
                    }
                })
                .catch(function(e) {
                    console.warn("Offline, couldn't push saved questions:", e);
                });
            } else if (action === "pull") {
                fetch(getApiUrl("/api/student/saved-questions?emailOrMobile=" + encodeURIComponent(email)))
                .then(function(r) { return r.json(); })
                .then(function(data) {
                    if (data.success && Array.isArray(data.savedQuestions)) {
                        var cloudItems = data.savedQuestions;
                        var localItems = [];
                        try {
                            var key = getSavedQuestionsKey();
                            var localSaved = localStorage.getItem(key);
                            localItems = localSaved ? JSON.parse(localSaved) : [];
                        } catch(e) {}

                        // Merge cloud and local items to prevent any data loss
                        var merged = [].concat(cloudItems);
                        localItems.forEach(function(lItem) {
                            var textEn = (lItem.textEn || (lItem.questionBlock && lItem.questionBlock.en && lItem.questionBlock.en.q) || "").trim().toLowerCase();
                            var textHi = (lItem.textHi || (lItem.questionBlock && lItem.questionBlock.hi && lItem.questionBlock.hi.q) || "").trim().toLowerCase();
                            
                            var exists = merged.some(function(cItem) {
                                var existingEn = (cItem.textEn || (cItem.questionBlock && cItem.questionBlock.en && cItem.questionBlock.en.q) || "").trim().toLowerCase();
                                var existingHi = (cItem.textHi || (cItem.questionBlock && cItem.questionBlock.hi && cItem.questionBlock.hi.q) || "").trim().toLowerCase();
                                if (textEn && textEn === existingEn) return true;
                                if (textHi && textHi === existingHi) return true;
                                return false;
                            });
                            if (!exists) {
                                merged.push(lItem);
                            }
                        });

                        // Save merged list locally
                        var key = getSavedQuestionsKey();
                        localStorage.setItem(key, JSON.stringify(merged));
                        
                        // If merged has more items than cloud, push it back
                        if (merged.length > cloudItems.length) {
                            syncSavedQuestionsWithCloud("push", merged);
                        }

                        renderSavedQuestionsBox();
                    }
                })
                .catch(function(e) {
                    console.warn("Offline, couldn't pull saved questions:", e);
                });
            }
        }

        function saveSavedQuestions(items) {
            try {
                var key = getSavedQuestionsKey();
                localStorage.setItem(key, JSON.stringify(items));
                if (_studentLoggedInUser && _studentLoggedInUser.emailOrMobile) {
                    syncSavedQuestionsWithCloud("push", items);
                }
            } catch(e) {
                console.error("Failed saving saved questions", e);
            }
        }

        function getSavedQuestions() {
            try {
                var universalKey = "prayas_one_saved_questions_universal_v3";
                var saved = localStorage.getItem(universalKey);
                var items = saved ? JSON.parse(saved) : [];
                
                // One-time self-healing merge/migration of older legacy keys if they exist
                var legacyKeys = ["prayas_one_saved_questions"];
                if (_studentLoggedInUser && _studentLoggedInUser.emailOrMobile) {
                    var userSuffix = "_" + encodeURIComponent(_studentLoggedInUser.emailOrMobile).replace(/[^a-zA-Z0-9]/g, "");
                    legacyKeys.push("prayas_one_saved_questions" + userSuffix);
                }
                
                var merged = false;
                legacyKeys.forEach(function(lKey) {
                    var r = localStorage.getItem(lKey);
                    if (r) {
                        try {
                            var parsed = JSON.parse(r);
                            if (Array.isArray(parsed) && parsed.length > 0) {
                                parsed.forEach(function(oldItem) {
                                    // Make sure text comparison is robust and case/whitespace-insensitive
                                    var textEn = (oldItem.textEn || (oldItem.questionBlock && oldItem.questionBlock.en && oldItem.questionBlock.en.q) || "").trim().toLowerCase();
                                    var textHi = (oldItem.textHi || (oldItem.questionBlock && oldItem.questionBlock.hi && oldItem.questionBlock.hi.q) || "").trim().toLowerCase();
                                    
                                    var exists = items.some(function(item) {
                                        var existingEn = (item.textEn || (item.questionBlock && item.questionBlock.en && item.questionBlock.en.q) || "").trim().toLowerCase();
                                        var existingHi = (item.textHi || (item.questionBlock && item.questionBlock.hi && item.questionBlock.hi.q) || "").trim().toLowerCase();
                                        if (textEn && textEn === existingEn) return true;
                                        if (textHi && textHi === existingHi) return true;
                                        return false;
                                    });
                                    if (!exists) {
                                        items.push(oldItem);
                                        merged = true;
                                    }
                                });
                            }
                        } catch(err){}
                    }
                });
                
                if (merged || !saved) {
                    localStorage.setItem(universalKey, JSON.stringify(items));
                }
                return items;
            } catch(e) {
                return [];
            }
        }

        function getQuestionText(qBlock) {
            if (!qBlock) return { textHi: "", textEn: "" };
            var textHi = "";
            var textEn = "";
            if (qBlock.hi && qBlock.hi.q) {
                textHi = qBlock.hi.q;
            }
            if (qBlock.en && qBlock.en.q) {
                textEn = qBlock.en.q;
            }
            if (!textHi && !textEn && qBlock.q) {
                textEn = qBlock.q;
            }
            return { textHi: textHi, textEn: textEn };
        }

        function isQuestionSaved(index) {
            var qBlock = _activeQuestions[index];
            if (!qBlock) return false;
            var saved = getSavedQuestions();
            var texts = getQuestionText(qBlock);
            return saved.some(function(item) {
                if (texts.textHi && item.textHi === texts.textHi) return true;
                if (texts.textEn && item.textEn === texts.textEn) return true;
                return false;
            });
        }

        function handleToggleSaveActiveQuestion(index) {
            var qBlock = _activeQuestions[index];
            if (!qBlock) return;
            var texts = getQuestionText(qBlock);
            var textHi = texts.textHi;
            var textEn = texts.textEn;
            var saved = getSavedQuestions();
            var isAlreadySaved = isQuestionSaved(index);
            var updated = [];
            if (isAlreadySaved) {
                updated = saved.filter(function(item) {
                    if (textHi && item.textHi === textHi) return false;
                    if (textEn && item.textEn === textEn) return false;
                    return true;
                });
                showToast("Question removed from saved bookmarks.");
            } else {
                var newItem = {
                    categoryName: _activeCategoryName || "General Exam Centre",
                    subCategoryName: _activeSubCategoryName || "General Practice Desk",
                    topicName: _activeTopicName || "General Practice",
                    textHi: textHi,
                    textEn: textEn,
                    questionBlock: qBlock
                };
                updated = saved.concat(newItem);
                showToast("Question saved to bookmarks!");
            }
            try {
                saveSavedQuestions(updated);
                renderSavedQuestionsBox();
            } catch(e) {
                console.error("Failed saving", e);
            }
        }

        function handleToggleSaveFromEngine(index) {
            handleToggleSaveActiveQuestion(index);
            renderEngineQuestionItem();
        }

        function handleToggleSaveFromAnalysis(index) {
            handleToggleSaveActiveQuestion(index);
            handleOpenDetailedAnalysisItem(index);
        }

        function handleRemoveSavedGroup(catEncoded, subEncoded, topEncoded) {
            var cat = decodeURIComponent(catEncoded);
            var sub = decodeURIComponent(subEncoded);
            var top = decodeURIComponent(topEncoded);
            
            showCustomConfirm('Delete Bookmarks', 'Are you sure you want to remove all bookmarked questions from "' + top + '" under "' + sub + '"?', function() {
                var saved = getSavedQuestions();
                var updated = saved.filter(function(item) {
                    var matchCat = (item.categoryName || "General Category") === cat;
                    var matchSub = (item.subCategoryName || "General Subcategory") === sub;
                    var matchTop = (item.topicName || "General Topic") === top;
                    return !(matchCat && matchSub && matchTop);
                });
                saveSavedQuestions(updated);
                renderSavedQuestionsBox();
                showToast("Bookmarks deleted successfully.");
            });
        }
        window.handleRemoveSavedGroup = handleRemoveSavedGroup;

        window.handleRemoveSavedTopicGroup = function(topicKeyEncoded) {
            var topicKey = decodeURIComponent(topicKeyEncoded);
            showCustomConfirm('Delete Bookmarks', 'Are you sure you want to remove all bookmarked questions from "' + topicKey + '"?', function() {
                var saved = getSavedQuestions();
                var updated = saved.filter(function(item) {
                    return item.topicName !== topicKey;
                });
                saveSavedQuestions(updated);
                renderSavedQuestionsBox();
                showToast("Topic bookmarks deleted.");
            });
        };

        window.handleRemoveSavedSubcategoryGroup = function(subKeyEncoded) {
            var subKey = decodeURIComponent(subKeyEncoded);
            showCustomConfirm('Delete Bookmarks', 'Are you sure you want to remove all bookmarked questions from "' + subKey + '"?', function() {
                var saved = getSavedQuestions();
                var updated = saved.filter(function(item) {
                    return item.subCategoryName !== subKey;
                });
                saveSavedQuestions(updated);
                renderSavedQuestionsBox();
                showToast("Subcategory bookmarks deleted.");
            });
        };

        function renderSavedQuestionsBox() {
            var container = document.getElementById("savedQuestionsSection");
            if (!container) return;
            var savedQs = getSavedQuestions();
            if (savedQs.length === 0) {
                container.innerHTML = 
                    '<div style="margin-top: 30px; margin-bottom: 25px;">' +
                    '    <div class="section-header-title">' +
                    '        <i class="ph-fill ph-bookmark-simple" style="color: var(--primary);"></i> Saved Questions' +
                    '    </div>' +
                    '    <div style="background: var(--light-grey); border: 1.5px dashed var(--border-color); border-radius: 16px; padding: 24px; text-align: center; color: var(--grey-text); font-size: 13px; font-weight: 600;">' +
                    '        No saved questions yet. Tap the bookmark icon on any question to save here!' +
                    '    </div>' +
                    '</div>';
                return;
            }

            var groups = {};
            savedQs.forEach(function(item) {
                var cat = item.categoryName || "General Category";
                var sub = item.subCategoryName || "General Subcategory";
                var top = item.topicName || "General Topic";
                var key = cat + "|||" + sub + "|||" + top;
                if (!groups[key]) {
                    groups[key] = [];
                }
                groups[key].push(item);
            });

            var html = 
                '<div style="margin-top: 30px; margin-bottom: 25px;">' +
                '    <div class="section-header-title" style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">' +
                '        <div style="display: flex; align-items: center; gap: 8px;">' +
                '            <i class="ph-fill ph-bookmark-simple" style="color: var(--primary);"></i> Saved Questions' +
                '        </div>' +
                '        <span style="font-size: 11px; font-weight: 850; color: var(--primary); background: rgba(255,107,53,0.1); padding: 4px 8px; border-radius: 8px; font-family: inherit;">TOTAL: ' + savedQs.length + '</span>' +
                '    </div>' +
                '    ' +
                '    <!-- Scrollable container for curved cards -->' +
                '    <div style="display: flex; gap: 16px; overflow-x: auto; padding: 4px 4px 16px 4px; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; scrollbar-width: thin; scrollbar-color: var(--primary) transparent;">';

            Object.keys(groups).forEach(function(key) {
                var list = groups[key];
                var parts = key.split("|||");
                var cat = parts[0];
                var sub = parts[1];
                var top = parts[2];

                var catClean = cat.replace("Direct Category Level", "Category Level");
                var subClean = sub.replace("Direct Subcategory Level", "Subcategory Level");
                var topClean = top.replace("Direct Subcategory Level", "General Topic");

                html += 
                    '        <div class="bookmark-group-card" style="background: white; border: 1.5px solid var(--border-color); border-radius: 18px; padding: 18px; width: 290px; min-width: 290px; display: flex; flex-direction: column; justify-content: space-between; gap: 14px; scroll-snap-align: start; box-shadow: 0 4px 12px rgba(0,0,0,0.02); transition: all 0.2s ease;">' +
                    '            <div>' +
                    '                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; gap: 8px;">' +
                    '                    <span style="background: rgba(255, 107, 53, 0.08); color: var(--primary); font-size: 9.5px; font-weight: 800; padding: 3px 6px; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid rgba(255,107,53,0.12); white-space: nowrap;">' +
                    '                        ' + catClean + '' +
                    '                    </span>' +
                    '                    <span style="font-size: 11px; font-weight: 800; color: var(--grey-text); display: flex; align-items: center; gap: 4px; background: var(--light-grey); padding: 3.5px 7px; border-radius: 6px; border: 1px solid var(--border-color); white-space: nowrap; flex-shrink: 0;">' +
                    '                        <i class="ph ph-file-text" style="color: var(--primary);"></i> ' + list.length + ' Qs' +
                    '                    </span>' +
                    '                </div>' +
                    '                ' +
                    '                <div style="font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.3px; color: var(--grey-text); font-weight: 700; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;">' +
                    '                    <i class="ph ph-folder-open"></i> ' + subClean + '' +
                    '                </div>' +
                    '                ' +
                    '                <h4 style="margin: 6px 0 0; font-size: 14.5px; font-weight: 800; color: var(--dark); line-height: 1.35; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; min-height: 38px;">' +
                    '                    ' + topClean + '' +
                    '                </h4>' +
                    '            </div>' +
                    '            ' +
                    '            <div style="display: flex; align-items: center; gap: 8px; width: 100%; margin-top: 4px;">' +
                    '                <button onclick="handleRemoveSavedGroup(\\\'' + encodeURIComponent(cat) + '\\\', \\\'' + encodeURIComponent(sub) + '\\\', \\\'' + encodeURIComponent(top) + '\\\')" ' +
                    '                        style="background: transparent; border: 1.5px solid #fee2e2; color: #ef4444; width: 40px; height: 40px; border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0;"' +
                    '                        title="Remove All Bookmarks"' +
                    '                        onmouseover="this.style.background=\\\'#fef2f2\\\'; this.style.borderColor=\\\'#fca5a5\\\'"' +
                    '                        onmouseout="this.style.background=\\\'transparent\\\'; this.style.borderColor=\\\'#fee2e2\\\'">' +
                    '                    <i class="ph-bold ph-trash" style="font-size: 16px;"></i>' +
                    '                </button>' +
                    '                ' +
                    '                <button onclick="handleLaunchGroupSavedTest(\\\'' + encodeURIComponent(cat) + '\\\', \\\'' + encodeURIComponent(sub) + '\\\', \\\'' + encodeURIComponent(top) + '\\\')" ' +
                    '                        class="btn-fill-prime" ' +
                    '                        style="margin: 0; flex-grow: 1; height: 40px; border-radius: 10px; font-weight: 800; font-size: 12px; letter-spacing: 0.3px; text-transform: uppercase; display: flex; align-items: center; justify-content: center; gap: 6px; background: var(--primary); border: none; color: white; cursor: pointer; transition: opacity 0.2s;"' +
                    '                        onmouseover="this.style.opacity=\\\'0.9\\\'"' +
                    '                        onmouseout="this.style.opacity=\\\'1\\\'">' +
                    '                    <i class="ph-bold ph-play" style="font-size: 12px;"></i> START TEST' +
                    '                </button>' +
                    '            </div>' +
                    '        </div>';
            });

            html += 
                '    </div>' +
                '</div>';
            container.innerHTML = html;
        }

        window.handleRemoveSavedGroup = handleRemoveSavedGroup;
        window.handleLaunchGroupSavedTest = handleLaunchGroupSavedTest;

        function handleLaunchGroupSavedTest(catEncoded, subEncoded, topEncoded) {
            if (!isCurrentStudentPaid()) {
                showCustomAlert("Premium Benefit", "This Bookmarks practice feature is exclusive to Premium membership holders. Unlock and get total benefits today!", function() {
                    showGeneralPremiumPaymentScreen();
                });
                return;
            }

            var cat = decodeURIComponent(catEncoded);
            var sub = decodeURIComponent(subEncoded);
            var top = decodeURIComponent(topEncoded);

            var savedQs = getSavedQuestions();
            var filtered = savedQs.filter(function(item) {
                var matchCat = (item.categoryName || "General Category") === cat;
                var matchSub = (item.subCategoryName || "General Subcategory") === sub;
                var matchTop = (item.topicName || "General Topic") === top;
                return matchCat && matchSub && matchTop;
            });

            if (filtered.length === 0) {
                alert("No saved questions found in this folder.");
                return;
            }

            var nameLabel = top.replace("Direct Subcategory Level", "General").replace("Direct Category Level", "Category Level");
            _activeTest = {
                id: "custom_saved_group_" + Math.random().toString(36).substr(2, 9),
                title: "Bookmarks Test: " + nameLabel,
                duration: (filtered.length * 18) / 60,
                posMarks: 2,
                negMarks: 0.5,
                instructions: "Review practice assessment centering only your bookmarked items from: " + nameLabel + ".",
                unlimitedAttempts: true,
                isPaid: false
            };
            _activeQuestions = filtered.map(function(item) {
                var block = item.questionBlock ? JSON.parse(JSON.stringify(item.questionBlock)) : null;
                if (!block) {
                    block = {
                        en: { q: item.textEn || "Practice item text", o: ["Option A", "Option B", "Option C", "Option D"], c: 1, s: "Answer details" },
                        hi: { q: item.textHi || "अभ्यास प्रश्न पाठ", o: ["विकल्प ए", "विकल्प बी", "विकल्प सी", "विकल्प डी"], c: 1, s: "उत्तर विवरण" }
                    };
                }
                if (!block.originalCorrect) {
                    block.originalCorrect = block.en ? block.en.c : (block.hi ? block.hi.c : 1);
                }
                return block;
            });
            _availableLanguages = [];
            if (_activeQuestions.some(function(q) { return q.en; })) _availableLanguages.push('en');
            if (_activeQuestions.some(function(q) { return q.hi; })) _availableLanguages.push('hi');
            if (_availableLanguages.length === 0) _availableLanguages.push('en');
            _currentLanguage = _availableLanguages[0];
            var translateBtn = document.getElementById("translateBtn");
            var label = document.getElementById("translateLabel");
            if (_availableLanguages.length > 1) {
                translateBtn.style.display = "flex";
                label.innerText = _currentLanguage.toUpperCase();
            } else {
                translateBtn.style.display = "none";
            }
            _activeQIndex = 0;
            _answersMap = {};
            _markedReviewMap = {};
            _revealedAnswersMap = {};
            document.getElementById("testEngineName").innerText = _activeTest.title;
            _timeRemainingSecs = _activeQuestions.length * 18;
            updateTestEngineTimerClockDisplay();
            if (_timeIntervalId) clearInterval(_timeIntervalId);
            _timeIntervalId = setInterval(function() {
                _timeRemainingSecs--;
                if (_timeRemainingSecs <= 0) {
                    clearInterval(_timeIntervalId);
                    handleForceAutoSubmitTest();
                } else {
                    updateTestEngineTimerClockDisplay();
                }
            }, 1000);
            document.getElementById("test-engine-panel").style.display = "flex";
            try { clearAllGoogleAds(); } catch(e) {}
            document.getElementById("mainHeader").style.display = "none";
            renderEngineQuestionItem();
        }
        window.handleLaunchGroupSavedTest = handleLaunchGroupSavedTest;

        window.handleLaunchCustomSavedQuestionsTest = function(groupType, groupKeyEncoded) {
            var groupKey = decodeURIComponent(groupKeyEncoded);
            if (groupType === 'topic') {
                handleLaunchGroupSavedTest(encodeURIComponent(""), encodeURIComponent(""), encodeURIComponent(groupKey));
            } else if (groupType === 'subcategory') {
                handleLaunchGroupSavedTest(encodeURIComponent(""), encodeURIComponent(groupKey), encodeURIComponent(""));
            }
        };

        function isCurrentStudentPaid() {
            if (!_studentLoggedInUser) return false;
            var unlocked = _studentLoggedInUser.unlockedCategoryIds || [];
            if (unlocked.length === 0) return false;
            
            var allCats = (DB.testCategories || []).concat(DB.pdfCategories || []);
            var hasActive = false;
            for (var i = 0; i < unlocked.length; i++) {
                var catId = unlocked[i];
                var cat = allCats.find(function(c) { return c.id === catId; });
                if (cat && isCategoryUnlocked(cat)) {
                    hasActive = true;
                    break;
                }
            }
            return hasActive;
        }

        function handleDownloadMerchantPaymentQRCode() {
            var customLink = "${config.social.qrDownloadLink || ''}";
            if (customLink && customLink.trim() !== "") {
                var dl = document.createElement("a");
                dl.href = customLink;
                dl.target = "_blank";
                document.body.appendChild(dl);
                dl.click();
                document.body.removeChild(dl);
                showToast("Redirecting...");
                return;
            }
            var qrImg = document.getElementById("displayPayQrImage");
            if (!qrImg || !qrImg.src) {
                alert("QR Image not loaded.");
                return;
            }
            var dl = document.createElement("a");
            dl.href = qrImg.src;
            dl.download = "Prayas_One_Payment_Merchant_QR.png";
            dl.target = "_blank";
            document.body.appendChild(dl);
            dl.click();
            document.body.removeChild(dl);
            showToast("QR layout downloaded!");
        }

        function getFontForText(textContent, defaultFontName) {
            if (/[\u0900-\u097F]/.test(textContent || '')) {
                return "'Sahitya', serif";
            }
            return "'Sahitya', serif";
        }
        
        // Define builder API server origin fallback for cross-origin local files
        const _serverOrigin = "${serverOrigin}";
        function getApiUrl(route) {
            if (!_serverOrigin) return route;
            if (window.location.protocol === 'file:' || !window.location.host) {
                return _serverOrigin + route;
            }
            if (window.location.origin !== _serverOrigin) {
                return _serverOrigin + route;
            }
            return route;
        }

        function checkActiveWebsitePopups() {
             try {
                 const popups = DB.popups || [];
                 if (popups.length === 0) return;
                 
                 const now = Date.now();
                 const studentIsPaid = isCurrentStudentPaid();
                 const activePopups = popups.filter(p => {
                     if (!p.isActive) return false;
                     
                     // Filter based on student audience targeting
                     const targeting = p.showTo || "all";
                     if (targeting === "paid" && !studentIsPaid) return false;
                     if (targeting === "free" && studentIsPaid) return false;
                     
                     const parseLocalTimeStr = (tStr) => {
                         if (!tStr) return 0;
                         if (tStr.includes('Z') || tStr.includes('+') || (tStr.lastIndexOf('-') > 10)) {
                             return Date.parse(tStr);
                         }
                         const pts = tStr.split(/[\sT:-]/);
                         if (pts.length >= 5) {
                             const yr = parseInt(pts[0], 10);
                             const mo = parseInt(pts[1], 10) - 1;
                             const dy = parseInt(pts[2], 10);
                             const hr = parseInt(pts[3], 10);
                             const mn = parseInt(pts[4], 10);
                             return new Date(yr, mo, dy, hr, mn, 0).getTime();
                         }
                         return Date.parse(tStr);
                     };

                     if (p.startTime) {
                         try {
                             let startEpoch = parseLocalTimeStr(p.startTime);
                             if (!isNaN(startEpoch) && now < startEpoch) return false;
                         } catch(e) {}
                     }
                     if (p.endTime) {
                         try {
                             let endEpoch = parseLocalTimeStr(p.endTime);
                             if (!isNaN(endEpoch) && now > endEpoch) return false;
                         } catch(e) {}
                     }
                     return true;
                 });
                 
                 if (activePopups.length === 0) return;
                 
                 // Sort by sequence (order) ascending
                 activePopups.sort((a, b) => {
                     const orderA = parseInt(a.order) || 0;
                     const orderB = parseInt(b.order) || 0;
                     return orderA - orderB;
                 });
                 
                 // Find first non-dismissed popup
                 const target = activePopups.find(p => {
                     const dismissKey = "_dismissed_popup_" + p.id + "_" + (p.title || "").replace(/\s/g, "") + "_" + (p.text || "").replace(/\s/g, "");
                     return localStorage.getItem(dismissKey) !== "true";
                 });
                 
                 if (target) {
                     const titleEl = document.getElementById("p_modal_title");
                     const textEl = document.getElementById("p_modal_text");
                     const imgEl = document.getElementById("p_modal_image");
                     const linkEl = document.getElementById("p_modal_link");
                     const outerModal = document.getElementById("websitePopupOverlayModal");
                     
                     if (outerModal) {
                         if (titleEl) titleEl.innerText = target.title || "Announcement";
                         if (textEl) textEl.innerText = target.text || "";
                         if (imgEl) {
                             if (target.imageUrl) {
                                 var cleanPopUrl = enhanceImageUrlQuality(target.imageUrl);
                                 imgEl.loading = "eager";
                                 imgEl.decoding = "async";
                                 imgEl.src = cleanPopUrl;
                                 imgEl.style.display = "block";
                                 if (imgEl.parentNode) imgEl.parentNode.style.display = "flex";
                             } else {
                                 imgEl.style.display = "none";
                                 if (imgEl.parentNode) imgEl.parentNode.style.display = "none";
                             }
                         }
                         if (linkEl) {
                             if (target.redirectUrl) {
                                 linkEl.href = target.redirectUrl;
                                 linkEl.innerHTML = (target.buttonName || "Explore Details") + ' <i class="ph ph-arrow-right"></i>';
                                 linkEl.style.display = "block";
                             } else {
                                 linkEl.style.display = "none";
                             }
                         }
                         outerModal.setAttribute("data-active-popup-id", target.id);
                         outerModal.style.display = "flex";
                     }
                 }
             } catch(err) {
                 console.error("Popup check error:", err);
             }
         }
 
        function handleCloseWebsiteActivePopup() {
            try {
                const outerModal = document.getElementById("websitePopupOverlayModal");
                if (outerModal) {
                    const popupId = outerModal.getAttribute("data-active-popup-id");
                    if (popupId) {
                        const popups = DB.popups || [];
                        const target = popups.find(p => p.id === popupId);
                        if (target) {
                            const dismissKey = "_dismissed_popup_" + target.id + "_" + (target.title || "").replace(/\s/g, "") + "_" + (target.text || "").replace(/\s/g, "");
                            localStorage.setItem(dismissKey, "true");
                        }
                        localStorage.setItem("_dismissed_popup_" + popupId, "true");
                    }
                    outerModal.style.display = "none";
                }
            } catch(e) {
                console.error(e);
            }
        }
        
        // Navigation Stack Architecture
        let _navHistory = ['home'];
        
        // Active test parameters
        let _activeTest = null;
        let _activeQuestions = [];
        let _currentLanguage = 'en'; // 'en' or 'hi'
        let _availableLanguages = ['en'];
        let _activeQIndex = 0;
        let _answersMap = {}; // index: option_1_indexed
        let _markedReviewMap = {}; // index: boolean
        let _showEngineAnswer = false;
        let _revealedAnswersMap = {};
        let _revealedSlideIndicesList = [];
        let _currentRevealedSlideIdx = 0;
        let _timeIntervalId = null;
        let _timeRemainingSecs = 0;

        // Test protection & pause states
        let _testStateActiveNow = false;
        let _testIsPaused = false;
        let _serverTimeOffset = 0;
        let _studentLoggedInUser = null;
        let _demoCategories = {};

        function isDemoFreeTest(testId, rootCat) {
            if (!rootCat || !testId) return false;
            var firstTestId = null;
            if (rootCat.test) {
                firstTestId = rootCat.test.id;
            } else if (rootCat.subCategories) {
                for (var i = 0; i < rootCat.subCategories.length; i++) {
                    var sub = rootCat.subCategories[i];
                    if (sub.test) {
                        firstTestId = sub.test.id;
                        break;
                    }
                    if (sub.topics) {
                        for (var j = 0; j < sub.topics.length; j++) {
                            var top = sub.topics[j];
                            if (top.test) {
                                firstTestId = top.test.id;
                                break;
                            }
                        }
                    }
                    if (firstTestId) break;
                }
            }
            return firstTestId === testId;
        }

        function subHasDemoFreeTest(sub, rootCat) {
            if (!rootCat || !sub) return false;
            if (sub.test && isDemoFreeTest(sub.test.id, rootCat)) {
                return true;
            }
            if (sub.topics) {
                for (var i = 0; i < sub.topics.length; i++) {
                    var top = sub.topics[i];
                    if (top.test && isDemoFreeTest(top.test.id, rootCat)) {
                        return true;
                    }
                }
            }
            return false;
        }

        function isDemoFreePdf(pdfId, rootCat) {
            if (!rootCat || !pdfId) return false;
            var firstPdfId = null;
            if (rootCat.pdf) {
                firstPdfId = rootCat.pdf.id;
            } else if (rootCat.subCategories) {
                for (var i = 0; i < rootCat.subCategories.length; i++) {
                    var sub = rootCat.subCategories[i];
                    if (sub.pdf) {
                        firstPdfId = sub.pdf.id;
                        break;
                    }
                    if (sub.topics) {
                        for (var j = 0; j < sub.topics.length; j++) {
                            var top = sub.topics[j];
                            if (top.pdf) {
                                firstPdfId = top.pdf.id;
                                break;
                            }
                        }
                    }
                    if (firstPdfId) break;
                }
            }
            return firstPdfId === pdfId;
        }

        function subHasDemoFreePdf(sub, rootCat) {
            if (!rootCat || !sub) return false;
            if (sub.pdf && isDemoFreePdf(sub.pdf.id, rootCat)) {
                return true;
            }
            if (sub.topics) {
                for (var i = 0; i < sub.topics.length; i++) {
                    var top = sub.topics[i];
                    if (top.pdf && isDemoFreePdf(top.pdf.id, rootCat)) {
                        return true;
                    }
                }
            }
            return false;
        }

        function handleViewDemoClick(cat, type) {
            var catObj = cat;
            if (typeof cat === 'string') {
                var allCats = (DB.testCategories || []).concat(DB.pdfCategories || []);
                catObj = allCats.find(function(c) { return c.id === cat; });
                if (!catObj) {
                    try {
                        catObj = JSON.parse(cat);
                    } catch(e) {
                        console.error("Error parsing category object in View Demo", e);
                    }
                }
            }
            if (!catObj) return;
            _demoCategories[catObj.id] = true;
            handleSelectCategoryNode(catObj, type);
        }
        window.handleViewDemoClick = handleViewDemoClick;
        let _isAutoSubmitting = false;
        let _hasActiveCouponGrant = null; // Stored voucher config
        let _activeCategoryName = "N/A";
        let _activeSubCategoryName = "N/A";
        let _activeTopicName = "N/A";
        const _hideSourceOnStudent = ${!!config.social.hideSourceOnStudent};

        // Custom URL Path Routing & Deep Linking Subsystem
        let _activeCategoryNodeForUrl = null;
        let _activeSubcategoryNodeForUrl = null;
        let _activeTopicNodeForUrl = null;
        let _activeTopicStack = [];
        let _activeTopicType = 'test';
        let _isHandlingPopState = false;

        function toSlug(str) {
            if (!str) return "";
            return str.toString().toLowerCase().trim()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
        }

        function toUrlPathSegment(str) {
            if (!str) return "";
            // Maintain uppercase characters, lowercase characters, and convert spaces to hyphens. Strip other URL unsafe structures.
            return str.toString().trim()
                .replace(/[^a-zA-Z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
        }

        function updateHistoryAndUrl(categoryNode, subcategoryNode, topicNode, tabIdOrType) {
            if (_isHandlingPopState) return;
            try {
                if (window.location.protocol === 'file:') return;
                var path = '/';
                if (categoryNode) {
                    path += toUrlPathSegment(categoryNode.name);
                    if (subcategoryNode) {
                        path += '/' + toUrlPathSegment(subcategoryNode.name);
                        if (topicNode) {
                            path += '/' + toUrlPathSegment(topicNode.name);
                        }
                    }
                } else if (tabIdOrType) {
                    var t = tabIdOrType.toLowerCase();
                    if (t === 'home') {
                        path = '/home';
                    } else if (t === 'tests' || t === 'test') {
                        path = '/test';
                    } else if (t === 'pdfs' || t === 'pdf') {
                        path = '/pdf';
                    } else if (t === 'acc' || t === 'account' || t === 'my-account') {
                        path = '/account';
                    } else {
                        path = '/' + t;
                    }
                } else {
                    path = '/home';
                }
                history.pushState({ page: 'internal' }, null, path);
            } catch (e) {
                console.error("Failed to update URL history:", e);
            }
        }
        
        // Dynamic watermarks
        function buildSecurityAntiLeakOverlay(userEmail = "aspirant_guest") {
            const overlay = document.getElementById("securityOverlay");
            overlay.innerHTML = "";
            for (let i = 0; i < 12; i++) {
                const span = document.createElement("div");
                span.className = "leak-label";
                span.innerText = "PRAYAS ONE - " + userEmail;
                overlay.appendChild(span);
            }
        }

        // Setup Right Click and Keyboard security locks
        function setupAntiPiracyBlockers() {
            // Disable context menu
            document.addEventListener('contextmenu', e => e.preventDefault());
            
            // Disable selection, copy, paste, cut, dragging
            document.addEventListener('copy', e => e.preventDefault());
            document.addEventListener('paste', e => e.preventDefault());
            document.addEventListener('cut', e => e.preventDefault());
            document.addEventListener('selectstart', e => e.preventDefault());
            document.addEventListener('dragstart', e => e.preventDefault());

            // Keyboard blockers for Inspect / Save / Print / Copy / Selection
            document.addEventListener('keydown', e => {
                // Prevent Ctrl+C / Cmd+C
                if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) {
                    e.preventDefault();
                    return false;
                }
                // Prevent Ctrl+A / Cmd+A
                if ((e.ctrlKey || e.metaKey) && (e.key === 'a' || e.key === 'A')) {
                    e.preventDefault();
                    return false;
                }
                // Prevent Ctrl+S / Cmd+S (Save)
                if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
                    e.preventDefault();
                    return false;
                }
                // Prevent Ctrl+U / Cmd+U (View Source)
                if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U')) {
                    e.preventDefault();
                    return false;
                }
                // Prevent Ctrl+P / Cmd+P (Print)
                if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
                    e.preventDefault();
                    return false;
                }
                // Prevent F12
                if (e.keyCode === 123 || e.key === 'F12') {
                    e.preventDefault();
                    return false;
                }
                // Prevent Shift+F10 (Context Menu)
                if (e.shiftKey && e.keyCode === 121) {
                    e.preventDefault();
                    return false;
                }
                // Prevent Ctrl+Shift+I / Cmd+Alt+I (Inspect)
                if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'i' || e.key === 'I')) {
                    e.preventDefault();
                    return false;
                }
                // Prevent Ctrl+Shift+J / Cmd+Alt+J (Console)
                if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'j' || e.key === 'J')) {
                    e.preventDefault();
                    return false;
                }
                // Prevent Ctrl+Shift+C / Cmd+Alt+C (Inspect Element)
                if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'c' || e.key === 'C')) {
                    e.preventDefault();
                    return false;
                }

                // Keyboard Navigation for Active Test (Laptops/Desktops)
                if (typeof _testStateActiveNow !== 'undefined' && _testStateActiveNow) {
                    var isPaused = typeof _testIsPaused !== 'undefined' && _testIsPaused;
                    if (!isPaused) {
                        if (e.key === "ArrowLeft") {
                            if (typeof handlePrevQuestion === "function") handlePrevQuestion();
                        } else if (e.key === "ArrowRight") {
                            if (typeof handleNextQuestion === "function") handleNextQuestion();
                        } else if (e.key === "Escape") {
                            if (typeof triggerTestInterruptionPause === "function") triggerTestInterruptionPause();
                        }
                    }
                }
            });

            // Prevent Print Screen key (clears clipboard)
            document.addEventListener('keyup', e => {
                if (e.key === 'PrintScreen' || e.keyCode === 44) {
                    try {
                        navigator.clipboard.writeText("");
                    } catch(err) {}
                    alert("Screenshots are strictly prohibited!");
                }
            });

            // Infinite debugger loop to render inspector tools completely unusable
            setInterval(function() {
                try {
                    (function() {
                        const check = function() {
                            if (function() {}.constructor("debugger") !== undefined) {
                                (function() {}).constructor("debugger")();
                            }
                        };
                        check();
                    })();
                } catch (e) {}
            }, 500);
        }

        // Utility to check if a scheduled content is visible
        function isItemScheduledVisible(item) {
            if (!item) return false;
            if (!item.scheduledAt) return true;
            try {
                const schedTime = new Date(item.scheduledAt).getTime();
                if (isNaN(schedTime)) return true;
                const secureCurrentTime = Date.now() + _serverTimeOffset;
                return schedTime <= secureCurrentTime;
            } catch (e) {
                return true;
            }
        }

        // Custom visibility filter checking both schedule AND student email-restrict permissions
        function isItemVisibleToStudent(item) {
            if (!item) return false;
            
            // 1. Time / Scheduling check
            if (!isItemScheduledVisible(item)) {
                return false;
            }
            
            // 2. Email restriction check (Node itself, or nested test, or nested pdf)
            const nodeOnlyUsers = item.onlyUsers || "";
            const testOnlyUsers = (item.test && item.test.onlyUsers) || "";
            const pdfOnlyUsers = (item.pdf && item.pdf.onlyUsers) || "";
            
            const combinedOnlyUsers = (nodeOnlyUsers + "," + testOnlyUsers + "," + pdfOnlyUsers)
                .split(/[\\n,]+/)
                .map(s => s.trim().toLowerCase())
                .filter(s => s);
            
            if (combinedOnlyUsers.length > 0) {
                if (!_studentLoggedInUser) {
                    return false;
                }
                const email = (_studentLoggedInUser.emailOrMobile || "").trim().toLowerCase();
                if (!email) return false;
                
                if (!combinedOnlyUsers.includes(email)) {
                    return false;
                }
            }
            
            return true;
        }

        // Initialize Carousel
        function launchSlidersCarousel() {
            const container = document.getElementById("studentSliderBlock");
            const wrapper = document.getElementById("studentSlidesWrapper");
            const dots = document.getElementById("studentSliderDots");
            if (!container || !wrapper || !dots) return;

            wrapper.innerHTML = "";
            dots.innerHTML = "";

            const activeSliders = (DB.sliders || []).filter(isItemVisibleToStudent);

            if (activeSliders.length === 0) {
                // Show default placeholders if blank
                wrapper.innerHTML = '<div class="slide-item"><img class="slide-item-img" src="https://iili.io/CKMOrGI.md.png" onclick="location.reload()"></div>';
                return;
            }

            activeSliders.forEach((slide, idx) => {
                const slideItem = document.createElement("div");
                slideItem.className = "slide-item";

                var initSrc = enhanceImageUrlQuality((window.__imgCache && window.__imgCache[slide.image]) || slide.image);

                // Create ambient blurred background
                const blurBg = document.createElement("div");
                blurBg.className = "slide-item-blur";
                blurBg.style.backgroundImage = "url('" + initSrc + "')";
                slideItem.appendChild(blurBg);

                // Create main non-stretched, non-cropped image
                const img = document.createElement("img");
                img.className = "slide-item-img";
                img.loading = idx === 0 ? "eager" : "lazy";
                img.decoding = "async";
                img.src = initSrc;
                img.setAttribute("data-original-src", slide.image);
                
                slideItem.appendChild(img);

                slideItem.onclick = () => {
                    if (slide.link && slide.link !== "#") window.open(slide.link, '_blank');
                };
                
                wrapper.appendChild(slideItem);

                const dot = document.createElement("div");
                dot.className = "dot" + (idx === 0 ? " active" : "");
                dot.style.cursor = "pointer";
                dot.onclick = () => {
                    goToSlide(idx);
                    resetTimer();
                };
                dots.appendChild(dot);
            });

            // Create or hook premium navigation arrows
            let prevBtn = container.querySelector(".slider-arrow-left");
            let nextBtn = container.querySelector(".slider-arrow-right");
            if (!prevBtn) {
                prevBtn = document.createElement("div");
                prevBtn.className = "slider-arrow slider-arrow-left";
                prevBtn.innerHTML = '<i class="ph-bold ph-caret-left"></i>';
                container.appendChild(prevBtn);
            }
            if (!nextBtn) {
                nextBtn = document.createElement("div");
                nextBtn.className = "slider-arrow slider-arrow-right";
                nextBtn.innerHTML = '<i class="ph-bold ph-caret-right"></i>';
                container.appendChild(nextBtn);
            }

            if (activeSliders.length <= 1) {
                prevBtn.style.display = "none";
                nextBtn.style.display = "none";
                dots.style.display = "none";
            } else {
                prevBtn.style.display = "flex";
                nextBtn.style.display = "flex";
                dots.style.display = "flex";
            }

            let currentSlideIdx = 0;

            function goToSlide(idx) {
                if (activeSliders.length === 0) return;
                if (idx < 0) idx = activeSliders.length - 1;
                if (idx >= activeSliders.length) idx = 0;
                currentSlideIdx = idx;

                // Corrected translation on container block dimensions for exact slide centering
                const translatePercent = -(currentSlideIdx * 100);
                wrapper.style.transform = "translateX(" + translatePercent + "%)";

                const dotElements = dots.querySelectorAll(".dot");
                dotElements.forEach((d, id) => {
                    if (id === currentSlideIdx) d.classList.add("active");
                    else d.classList.remove("active");
                });
            }

            prevBtn.onclick = (e) => {
                e.stopPropagation();
                goToSlide(currentSlideIdx - 1);
                resetTimer();
            };

            nextBtn.onclick = (e) => {
                e.stopPropagation();
                goToSlide(currentSlideIdx + 1);
                resetTimer();
            };

            // Auto transition slideshow timer
            function startTimer() {
                if (activeSliders.length > 1) {
                    _sliderIntervalId = setInterval(() => {
                        const nextIdx = (currentSlideIdx + 1) % activeSliders.length;
                        goToSlide(nextIdx);
                    }, 2000);
                }
            }

            function resetTimer() {
                if (_sliderIntervalId) clearInterval(_sliderIntervalId);
                startTimer();
            }

            if (_sliderIntervalId) clearInterval(_sliderIntervalId);
            startTimer();

            // Mobile Swiping and Desktop Mouse Drag Gesture Controls
            let startX = 0;
            let currentX = 0;
            let isDragging = false;
            let containerWidth = container.clientWidth || 300;

            window.addEventListener("resize", () => {
                containerWidth = container.clientWidth || 300;
            });

            wrapper.querySelectorAll("img").forEach(img => {
                img.addEventListener("dragstart", (e) => e.preventDefault());
            });

            function handleStart(clientX) {
                if (activeSliders.length <= 1) return;
                startX = clientX;
                currentX = clientX;
                isDragging = true;
                if (_sliderIntervalId) clearInterval(_sliderIntervalId);
                wrapper.style.transition = "none";
                containerWidth = container.clientWidth || 300;
            }

            function handleMove(clientX) {
                if (!isDragging) return;
                currentX = clientX;
                const diffX = currentX - startX;

                // Calculate the pixel offset relative to the current live slide index
                const currentSlideOffsetPercent = -(currentSlideIdx * 100);
                const currentOffsetPx = (currentSlideOffsetPercent / 100) * containerWidth;
                const newOffsetPx = currentOffsetPx + diffX;

                // Translate pixels back to percentage constraints
                const newOffsetPercent = (newOffsetPx / containerWidth) * 100;

                wrapper.style.transform = "translateX(" + newOffsetPercent + "%)";
            }

            function handleEnd() {
                if (!isDragging) return;
                isDragging = false;
                wrapper.style.transition = ""; // Restore premium CSS ease-in-out properties

                const diffX = currentX - startX;
                const threshold = containerWidth * 0.18; // 18% min translation swipe trigger bounds

                if (Math.abs(diffX) > threshold) {
                    if (diffX > 0) {
                        goToSlide(currentSlideIdx - 1);
                    } else {
                        goToSlide(currentSlideIdx + 1);
                    }
                } else {
                    goToSlide(currentSlideIdx);
                }
                startTimer();
            }

            // Register event listeners
            container.addEventListener("touchstart", (e) => {
                handleStart(e.touches[0].clientX);
            }, { passive: true });

            container.addEventListener("touchmove", (e) => {
                handleMove(e.touches[0].clientX);
            }, { passive: true });

            container.addEventListener("touchend", handleEnd, { passive: true });

            container.addEventListener("mousedown", (e) => {
                handleStart(e.clientX);
            });

            window.addEventListener("mousemove", (e) => {
                if (isDragging) {
                    handleMove(e.clientX);
                }
            });

            window.addEventListener("mouseup", () => {
                if (isDragging) handleEnd();
            });

            container.addEventListener("mouseleave", () => {
                if (isDragging) handleEnd();
            });
        }

        // Setup Notices scrolling board
        function renderNoticesScrollingBoard() {
            const noticesArea = document.getElementById("studentNoticeBoard");
            noticesArea.innerHTML = "";

            const activeNotifs = (DB.notifications || []).filter(isItemVisibleToStudent);

            if (activeNotifs.length === 0) {
                noticesArea.innerHTML = '<p style="font-size:12px; color:var(--grey-text); font-weight:800; padding:10px;">No new alerts today.</p>';
                return;
            }

            activeNotifs.forEach(notif => {
                const card = document.createElement("div");
                card.className = "notif-card";
                var initSrc = (window.__imgCache && window.__imgCache[notif.image]) || notif.image || "";
                
                var htmlStr = "";
                if (notif.image) {
                    htmlStr += '<img class="notif-banner" src="' + initSrc + '" data-original-src="' + notif.image + '">';
                }
                htmlStr += '<div class="notif-content">';
                htmlStr += '    <h4 class="notif-title">' + notif.title + '</h4>';
                htmlStr += '    <p class="notif-desc">' + notif.message + '</p>';
                if (notif.link) {
                    htmlStr += '<a class="notif-action-btn" target="_blank" href="' + notif.link + '">' + (notif.buttonName || "CHECK") + '</a>';
                }
                htmlStr += '</div>';
                
                card.innerHTML = htmlStr;
                noticesArea.appendChild(card);
                if (notif.image && !(window.__imgCache && window.__imgCache[notif.image]) && typeof getCachedImageUrl === "function") {
                    const imgEl = card.querySelector(".notif-banner");
                    if (imgEl) {
                        getCachedImageUrl(notif.image).then(function(src) {
                            if (src && src !== notif.image) {
                                imgEl.src = src;
                            }
                        });
                    }
                }
            });

            // Notice auto slider every 5 seconds
            let noticeScrollIdx = 0;
            if (_noticeIntervalId) clearInterval(_noticeIntervalId);
            _noticeIntervalId = setInterval(() => {
                const cards = noticesArea.querySelectorAll(".notif-card");
                if (cards.length > 1) {
                    noticeScrollIdx = (noticeScrollIdx + 1) % cards.length;
                    const targetCard = cards[noticeScrollIdx];
                    if (targetCard) {
                        noticesArea.scrollTo({
                            left: targetCard.offsetLeft - 15,
                            behavior: 'smooth'
                        });
                    }
                }
            }, 5000);
        }

        function handleScrollToNotifications() {
            handleTabNavigation('home');
            setTimeout(() => {
                const target = document.getElementById("notifScrollAnchor");
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }

        // Google AdSense Dynamic Controller
        function refreshGoogleAds() {
            var adsEnabled = ${config.adsense?.enabled ? 'true' : 'false'};
            var pubId = "${config.adsense?.publisherId || ''}";
            
            if (!adsEnabled || !pubId || pubId.trim() === "") {
                clearAllGoogleAds();
                return;
            }

            // ONLY show ads when user is logged out!
            if (_studentLoggedInUser !== null) {
                clearAllGoogleAds();
                return;
            }

            // DO NOT show ads while inside the exam/test engine panel!
            var testPanel = document.getElementById("test-engine-panel");
            if (testPanel && testPanel.style.display !== "none") {
                clearAllGoogleAds();
                return;
            }

            if (window._testStateActiveNow) {
                clearAllGoogleAds();
                return;
            }

            // Render visible containers!
            renderGoogleAdUnit("ad-container-home-top", "${config.adsense?.homeTopSlotId || ''}");
            renderGoogleAdUnit("ad-container-home-bottom", "${config.adsense?.homeBottomSlotId || ''}");
            renderGoogleAdUnit("ad-container-category-bottom", "${config.adsense?.sidebarSlotId || ''}");
            renderGoogleAdUnit("ad-container-results-bottom", "${config.adsense?.sidebarSlotId || ''}");
        }

        function clearAllGoogleAds() {
            var containers = [
                "ad-container-home-top", 
                "ad-container-home-bottom", 
                "ad-container-category-bottom", 
                "ad-container-results-bottom"
            ];
            containers.forEach(function(id) {
                var el = document.getElementById(id);
                if (el) {
                    el.innerHTML = "";
                    el.style.display = "none";
                }
            });
        }

        function renderGoogleAdUnit(containerId, slotId) {
            var el = document.getElementById(containerId);
            if (!el) return;

            // Check screen active state depending on containerId
            var isScreenActive = false;
            if (containerId === "ad-container-home-top" || containerId === "ad-container-home-bottom") {
                var scr = document.getElementById("scr-home");
                if (scr && scr.classList.contains("active")) {
                    isScreenActive = true;
                }
            } else if (containerId === "ad-container-category-bottom") {
                var scr = document.getElementById("scr-category");
                if (scr && scr.classList.contains("active")) {
                    isScreenActive = true;
                }
            } else if (containerId === "ad-container-results-bottom") {
                var scr = document.getElementById("scr-results");
                if (scr && scr.classList.contains("active")) {
                    isScreenActive = true;
                }
            }

            if (!isScreenActive) {
                el.style.display = "none";
                return;
            }

            el.style.display = "block";
            
            // To prevent double loading errors
            if (el.querySelector("ins.adsbygoogle")) {
                return; 
            }

            var pubId = "${config.adsense?.publisherId || ''}";
            var slotHtml = "";
            if (slotId && slotId.trim() !== "") {
                slotHtml = 'data-ad-slot="' + slotId + '"';
            }

            el.innerHTML = 
                '<div style="text-align: center; margin: 12px 0; max-width: 100%; overflow: hidden;">' +
                '  <ins class="adsbygoogle" ' +
                '       style="display:block" ' +
                '       data-ad-client="' + pubId + '" ' +
                '       ' + slotHtml + ' ' +
                '       data-ad-format="auto" ' +
                '       data-full-width-responsive="true"></ins>' +
                '</div>';

            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
                console.warn("Google AdSense push error:", e);
            }
        }

        // Tab Navigation Central Routing
        function handleTabNavigation(tabId) {
            try {
                if (typeof checkConcurrentUserSession === "function") {
                    checkConcurrentUserSession();
                }
            } catch(e) {}

            try {
                localStorage.setItem("_student_active_tab_id", tabId);
            } catch(e) {}

            // Cancel navigation stack history because tab click resets to root views
            _navHistory = [tabId === 'home' ? 'home' : 'tab-' + tabId];
            
            // Toggle highlight tabs
            document.querySelectorAll(".bottom-nav-item").forEach(el => el.classList.remove("active"));
            const currentTabBtn = document.getElementById("tab-" + tabId);
            if (currentTabBtn) currentTabBtn.classList.add("active");

            // Display Screens
            document.querySelectorAll(".screen").forEach(sc => sc.classList.remove("active"));
            
            // Reset navigations bar
            const header = document.getElementById("mainHeader");
            const backHeader = document.getElementById("backNavigationHeader");

            header.style.display = 'flex';
            backHeader.style.display = 'none';

            if (tabId === 'home') {
                document.getElementById("scr-home").classList.add("active");
                renderSavedQuestionsBox();
                updateHistoryAndUrl(null, null, null, 'home');
            } else if (tabId === 'tests') {
                document.getElementById("scr-category").classList.add("active");
                renderCategorySelectionScreen('test');
                updateHistoryAndUrl(null, null, null, 'tests');
            } else if (tabId === 'pdfs') {
                document.getElementById("scr-category").classList.add("active");
                renderCategorySelectionScreen('pdf');
                updateHistoryAndUrl(null, null, null, 'pdfs');
            } else if (tabId === 'acc') {
                document.getElementById("scr-acc").classList.add("active");
                refreshStudentAccountProfileGate();
                updateHistoryAndUrl(null, null, null, 'acc');
            }

            // Trigger AdSense refresh on tab navigation
            try {
                refreshGoogleAds();
            } catch(e) {}
        }

        // Navigation Stack pushes
        function navigateToScreen(screenElementId, screenTitle) {
            document.querySelectorAll(".screen").forEach(sc => sc.classList.remove("active"));
            document.getElementById(screenElementId).classList.add("active");

            // Stack tracking
            _navHistory.push(screenElementId);

            // Display navigation back row
            document.getElementById("mainHeader").style.display = 'none';
            const backHeader = document.getElementById("backNavigationHeader");
            backHeader.style.display = 'flex';
            document.getElementById("navHeaderBreadcrumb").innerText = screenTitle.toUpperCase();

            if (screenElementId === 'scr-pay') {
                try { ensurePaymentQrCached(); } catch(e){}
            }

            // Trigger AdSense refresh on screen navigation
            try {
                refreshGoogleAds();
            } catch(e) {}
        }

        // Nav stack back trace
        function handleHistoryBack() {
            if (_testStateActiveNow) {
                triggerTestInterruptionPause();
                return;
            }

            const currentActiveScreen = document.querySelector(".screen.active");
            const currentScreenId = currentActiveScreen ? currentActiveScreen.id : "scr-home";

            if (currentScreenId === 'scr-home') {
                showCustomConfirm("Exit Application", "Do you want to exit Prayas Study Desk?", function() {
                    history.back();
                });
                return;
            }

            if (currentScreenId === 'scr-topics' && _activeTopicStack && _activeTopicStack.length > 0) {
                _activeTopicStack.pop();
                if (_activeTopicStack.length > 0) {
                    const parentTopicNode = _activeTopicStack[_activeTopicStack.length - 1];
                    renderTopicList(parentTopicNode.topics || [], parentTopicNode.name, _activeTopicType);
                } else {
                    renderTopicList(_activeSubcategoryNodeForUrl.topics || [], _activeSubcategoryNodeForUrl.name, _activeTopicType);
                }
                return;
            }

            if (_navHistory.length <= 1) {
                handleTabNavigation('home');
                return;
            }

            // Pop active
            _navHistory.pop();
            const prevScreenId = _navHistory[_navHistory.length - 1];

            document.querySelectorAll(".screen").forEach(sc => sc.classList.remove("active"));
            
            if (prevScreenId === 'home') {
                document.getElementById("mainHeader").style.display = 'flex';
                document.getElementById("backNavigationHeader").style.display = 'none';
                document.getElementById("scr-home").classList.add("active");
                _navHistory = ['home'];

                _activeCategoryNodeForUrl = null;
                _activeSubcategoryNodeForUrl = null;
                _activeTopicNodeForUrl = null;
                updateHistoryAndUrl(null, null, null);
            } else if (prevScreenId.startsWith('tab-')) {
                const tabId = prevScreenId.replace('tab-', '');
                handleTabNavigation(tabId);
            } else {
                document.getElementById(prevScreenId).classList.add("active");
                document.getElementById("mainHeader").style.display = 'none';
                document.getElementById("backNavigationHeader").style.display = 'flex';

                if (prevScreenId === 'scr-category') {
                    _activeCategoryNodeForUrl = null;
                    _activeSubcategoryNodeForUrl = null;
                    _activeTopicNodeForUrl = null;
                    updateHistoryAndUrl(null, null, null);
                } else if (prevScreenId === 'scr-subcat') {
                    _activeSubcategoryNodeForUrl = null;
                    _activeTopicNodeForUrl = null;
                    updateHistoryAndUrl(_activeCategoryNodeForUrl, null, null);
                } else if (prevScreenId === 'scr-topics') {
                    _activeTopicNodeForUrl = null;
                    updateHistoryAndUrl(_activeCategoryNodeForUrl, _activeSubcategoryNodeForUrl, null);
                }
            }

            // Trigger AdSense refresh on history back popping
            try {
                refreshGoogleAds();
            } catch(e) {}
        }

        // Quick Access Navigation System
        function handleOpenCategoryLibrary(type) {
            handleTabNavigation(type === 'test' ? 'tests' : 'pdfs');
        }

        // Test Interruption, Blur, and Resume System mechanics
        function triggerTestInterruptionPause() {
            if (!_testStateActiveNow || _testIsPaused) return;

            _testIsPaused = true;
            
            // 1. Pause active timer loop
            if (_timeIntervalId) {
                clearInterval(_timeIntervalId);
                _timeIntervalId = null;
            }

            // 2. Blur Exam Paper content area
            const qsContent = document.getElementById("engineQsContent");
            if (qsContent) {
                qsContent.style.filter = "blur(8px)";
                qsContent.style.pointerEvents = "none";
            }

            // 3. Mount resume prompt modal over screen
            document.getElementById("testPauseResumeModal").style.display = "flex";
        }

        function handleResumeActiveTest() {
            _testIsPaused = false;

            // 1. Unblur exam papers
            const qsContent = document.getElementById("engineQsContent");
            if (qsContent) {
                qsContent.style.filter = "none";
                qsContent.style.pointerEvents = "auto";
            }

            // 2. Hide modal overlay
            document.getElementById("testPauseResumeModal").style.display = "none";

            // 3. Restart ticking loop
            if (_timeIntervalId) clearInterval(_timeIntervalId);
            _timeIntervalId = setInterval(() => {
                _timeRemainingSecs--;
                updateTestEngineTimerClockDisplay();

                if (_timeRemainingSecs <= 0) {
                    clearInterval(_timeIntervalId);
                    handleForceAutoSubmitTest();
                }
            }, 1000);
        }

        function handleExitActiveTest() {
            _testIsPaused = false;
            _testStateActiveNow = false;

            // Unblur and clean
            const qsContent = document.getElementById("engineQsContent");
            if (qsContent) {
                qsContent.style.filter = "none";
                qsContent.style.pointerEvents = "auto";
            }

            document.getElementById("testPauseResumeModal").style.display = "none";
            document.getElementById("test-engine-panel").style.display = "none";

            // Reset answers (User must start test again)
            _answersMap = {};
            _markedReviewMap = {};
            _revealedAnswersMap = {};

            // Roll back view to selection
            handleHistoryBack();
        }

        // Browser level state listeners (loss of focus, locks, minimized states)
        document.addEventListener("visibilitychange", () => {
            if (document.hidden && _testStateActiveNow) {
                triggerTestInterruptionPause();
            }
        });

        window.addEventListener("blur", () => {
            if (_testStateActiveNow) {
                triggerTestInterruptionPause();
            }
        });

        // Sync date offsets with backend
        function syncServerTimeOffset() {
            fetch(getApiUrl('/api/time'))
                .then(r => r.json())
                .then(data => {
                    if (data && data.timestamp) {
                        _serverTimeOffset = data.timestamp - Date.now();
                        console.log("[CLOCK] Sync complete. Server offset: " + _serverTimeOffset + "ms");
                    }
                })
                .catch(() => {
                    fetch('https://worldtimeapi.org/api/timezone/Etc/UTC')
                        .then(r => r.json())
                        .then(data => {
                            if (data && data.unixtime) {
                                _serverTimeOffset = (data.unixtime * 1000) - Date.now();
                            }
                        })
                        .catch(() => {});
                });
        }
        syncServerTimeOffset();

        // Capture physical keyboard, context popping and browser-back button behaviors
        function initHistoryStatePush() {
            window.addEventListener('popstate', (e) => {
                if (_testStateActiveNow) {
                    history.pushState({ page: 'test' }, null, window.location.href);
                    triggerTestInterruptionPause();
                    return;
                }

                _isHandlingPopState = true;
                try {
                    const parsed = handleDeepLinking();
                    if (!parsed) {
                        handleTabNavigation('home');
                    }
                } catch (err) {
                    console.error("Deep link parse error on popstate:", err);
                } finally {
                    _isHandlingPopState = false;
                }
            });
        }
        // Delayed initialization to clear startup stacks
        setTimeout(initHistoryStatePush, 1000);

        // Catalog Selection Display Helpers
        function getQuestionsCountFromTest(testMeta) {
            if (!testMeta) return 0;
            if (typeof testMeta.questionsCount === 'number') return testMeta.questionsCount;
            if (testMeta.questionsCount) {
                var c = parseInt(testMeta.questionsCount, 10);
                if (!isNaN(c)) return c;
            }
            if (testMeta.questionsEn && testMeta.questionsEn.length > 0) return testMeta.questionsEn.length;
            if (testMeta.questionsHi && testMeta.questionsHi.length > 0) return testMeta.questionsHi.length;
            if (testMeta.questionsOther) {
                for (var k in testMeta.questionsOther) {
                    if (testMeta.questionsOther[k] && testMeta.questionsOther[k].length > 0) {
                        return testMeta.questionsOther[k].length;
                    }
                }
            }
            return 0;
        }

        function calculateCategoryStats(cat) {
            var totalQuestions = 0;
            var totalDurationMins = 0;
            if (cat.test) {
                totalQuestions += getQuestionsCountFromTest(cat.test);
                totalDurationMins += cat.test.duration || 0;
            }
            if (cat.subCategories && cat.subCategories.length > 0) {
                cat.subCategories.forEach(function(sub) {
                    if (sub.test) {
                        totalQuestions += getQuestionsCountFromTest(sub.test);
                        totalDurationMins += sub.test.duration || 0;
                    }
                    if (sub.topics && sub.topics.length > 0) {
                        sub.topics.forEach(function(top) {
                            if (top.test) {
                                totalQuestions += getQuestionsCountFromTest(top.test);
                                totalDurationMins += top.test.duration || 0;
                            }
                        });
                    }
                });
            }
            return {
                totalQuestions: totalQuestions,
                totalDurationMins: totalDurationMins
            };
        }

        // Catalog Selection Display
        function renderCategorySelectionScreen(type) {
            _activeCategoryName = "N/A";
            _activeSubCategoryName = "N/A";
            _activeTopicName = "N/A";

            const container = document.getElementById("categoryGridArea");
            container.innerHTML = "";
            
            var titleIcon = (type === 'test' ? 'exam' : 'file-pdf');
            document.getElementById("categorySelectionTitle").innerHTML = '<i class="ph ph-' + titleIcon + '"></i> Select Category';

            // List elements from configuration and filter by scheduling and email permissions
            const targetCategories = (type === 'test' ? DB.testCategories : DB.pdfCategories) || [];
            const visibleCategories = targetCategories.filter(isItemVisibleToStudent);

            // Sort visibleCategories: Unlocked paid categories at the top, then locked paid, and free at the bottom
            visibleCategories.sort(function(a, b) {
                var getRank = function(cat) {
                    if (cat.isPaid) {
                        return isCategoryUnlocked(cat) ? 1 : 2;
                    }
                    return 3; // Free
                };
                return getRank(a) - getRank(b);
            });

            if (visibleCategories.length === 0) {
                container.innerHTML = '<div class="coming-soon-box">No resource catalogs configured.</div>';
                return;
            }

            visibleCategories.forEach((cat) => {
                const card = document.createElement("div");
                card.className = "outline-item-card";
                card.onclick = () => handleSelectCategoryNode(cat, type);
                var initSrc = (window.__imgCache && window.__imgCache[cat.image]) || cat.image || "";
                
                var catHtml = "";
                if (cat.image && cat.image.trim() !== "") {
                    catHtml += '<img class="outline-item-img" src="' + initSrc + '" data-original-src="' + cat.image + '">';
                } else {
                    var defaultIcon = type === 'test' ? 'ph ph-clipboard-text' : 'ph ph-file-pdf';
                    catHtml += '<div class="outline-item-img" style="display:flex;align-items:center;justify-content:center;color: var(--primary);"><i class="' + defaultIcon + '" style="font-size:24px;"></i></div>';
                }

                var detailsHtml = '<p class="outline-item-subtitle" style="margin-bottom:4px;">Explore resources & materials</p>';
                if (type === 'test') {
                    var stats = calculateCategoryStats(cat);
                    var currentClicks = parseInt(localStorage.getItem("_cat_attempts_" + cat.id) || "0", 10);
                    if (!currentClicks) {
                        var defaultBase = 1100 + ((cat.name && cat.name.charCodeAt(0)) || 0) * 13 + ((cat.id && cat.id.charCodeAt(0)) || 0) * 7;
                        currentClicks = defaultBase;
                        localStorage.setItem("_cat_attempts_" + cat.id, currentClicks.toString());
                    }
                    
                    // Daily bonus: Add 500 attempts per day desde 2026-06-20
                    var startDate = new Date("2026-06-20").getTime();
                    var daysPassed = Math.max(0, Math.floor((Date.now() - startDate) / (1000 * 3600 * 24)));
                    var dailyBonus = daysPassed * 500;
                    
                    var totalAttempts = currentClicks + dailyBonus;
                    if (totalAttempts >= 10000000) {
                        totalAttempts = 10000000;
                    }

                    var attemptsString;
                    if (totalAttempts >= 10000000) {
                        attemptsString = "10.0M";
                    } else if (totalAttempts >= 1000000) {
                        attemptsString = (totalAttempts / 1000000).toFixed(2) + "M";
                    } else if (totalAttempts >= 1000) {
                        attemptsString = (totalAttempts / 1000).toFixed(1) + "k";
                    } else {
                        attemptsString = totalAttempts.toString();
                    }

                    var totalQFormatted = (function() {
                        var qNum = stats.totalQuestions;
                        if (qNum >= 1000) {
                            var k = qNum / 1000;
                            return (k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)) + "K";
                        }
                        return qNum.toString();
                    })();

                    var totalHrsFormatted = (function() {
                        var rawHours = stats.totalDurationMins / 60;
                        var totalHrsStr = rawHours.toFixed(1);
                        return (totalHrsStr.endsWith(".0") ? rawHours.toFixed(0) : totalHrsStr) + ' Hrs';
                    })();

                    var statusBadgeHtml = '';
                    if (cat.isPaid) {
                        if (isCategoryUnlocked(cat)) {
                            var catExpiry = null;
                            var isCatLifetime = false;
                            if (_studentLoggedInUser) {
                                var hasSpecific = false;
                                if (_studentLoggedInUser.categoryDates && _studentLoggedInUser.categoryDates[cat.id]) {
                                    var catData = _studentLoggedInUser.categoryDates[cat.id];
                                    if (catData.isLifetime) {
                                        isCatLifetime = true;
                                        hasSpecific = true;
                                    } else if (catData.expiryDate && catData.expiryDate.trim() !== "") {
                                        catExpiry = catData.expiryDate;
                                        hasSpecific = true;
                                    }
                                }
                                if (!hasSpecific) {
                                    if (_studentLoggedInUser.expiryDate && _studentLoggedInUser.expiryDate.trim() !== "") {
                                        catExpiry = _studentLoggedInUser.expiryDate;
                                    } else {
                                        isCatLifetime = true;
                                    }
                                }
                            }
                            if (isCatLifetime) {
                                statusBadgeHtml = '        <span style="display: inline-flex; align-items: center; gap: 4px; color: #9b59b6; font-size: 9.5px; font-weight: 850; background: rgba(155, 89, 182, 0.08); padding: 1.5px 6px; border-radius: 6px; border: 1px solid rgba(155, 89, 182, 0.15); animation: premiumBlink 1.5s infinite ease-in-out; white-space: nowrap;">' +
                                                  '            <i class="ph-fill ph-sparkle" style="font-size: 10.5px; color: #9b59b6;"></i> ' +
                                                  '            <span>Lifetime Active</span>' +
                                                  '        </span>';
                            } else if (catExpiry) {
                                var exp = new Date(catExpiry);
                                var diffMs = exp.getTime() - Date.now();
                                var diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
                                if (diffDays > 0) {
                                    statusBadgeHtml = '        <span style="display: inline-flex; align-items: center; gap: 4px; color: #2ecc71; font-size: 9.5px; font-weight: 850; background: rgba(46, 204, 113, 0.08); padding: 2px 6.5px; border-radius: 6px; border: 1px solid rgba(46, 204, 113, 0.15); white-space: nowrap;">' +
                                                      '            <i class="ph-fill ph-check-circle" style="font-size: 11px; color: #2ecc71;"></i> ' +
                                                      '            <span style="display: inline-block; position: relative; height: 13px; width: 70px; overflow: hidden; vertical-align: middle; line-height: 13px;">' +
                                                      '                <span style="position: absolute; left: 0; top: 0; font-weight: 850; animation: badgeAltTextFade1 3s infinite; white-space: nowrap;">Active</span>' +
                                                      '                <span style="position: absolute; left: 0; top: 0; font-weight: 850; animation: badgeAltTextFade2 3s infinite; white-space: nowrap;">' + diffDays + ' Days</span>' +
                                                      '            </span>' +
                                                      '        </span>';
                                } else {
                                    statusBadgeHtml = '        <span style="display: inline-flex; align-items: center; gap: 4px; color: #ef4444; font-size: 9.5px; font-weight: 850; background: rgba(239, 68, 68, 0.08); padding: 1.5px 6px; border-radius: 6px; border: 1px solid rgba(239, 68, 68, 0.15); white-space: nowrap;">' +
                                                      '            <i class="ph-fill ph-x-circle" style="font-size: 10.5px; color: #ef4444;"></i> ' +
                                                      '            <span>Expired</span>' +
                                                      '        </span>';
                                }
                            } else {
                                statusBadgeHtml = '        <span style="display: inline-flex; align-items: center; gap: 4px; color: #9b59b6; font-size: 9.5px; font-weight: 850; background: rgba(155, 89, 182, 0.08); padding: 1.5px 6px; border-radius: 6px; border: 1px solid rgba(155, 89, 182, 0.15); animation: premiumBlink 1.5s infinite ease-in-out; white-space: nowrap;">' +
                                                  '            <i class="ph-fill ph-sparkle" style="font-size: 10.5px; color: #9b59b6;"></i> ' +
                                                  '            <span>Lifetime Active</span>' +
                                                  '        </span>';
                            }
                        } else {
                            var price = cat.paymentAmount || (DB && DB.social && DB.social.premiumPrice) || "₹49";
                            statusBadgeHtml = '        <span style="display: inline-flex; align-items: center; gap: 3px; background: #FFB800; color: #111111; padding: 1.5px 5.5px; border-radius: 4px; font-weight: 900; cursor: pointer; font-size: 9px; box-shadow: 0 1.5px 4px rgba(255,184,0,0.15); white-space: nowrap; font-family: Sahitya, serif;" onclick="event.stopPropagation(); handleBuyNowClick(\\\'' + cat.id + '\\\')">' +
                                              '            <i class="ph-bold ph-shopping-cart-simple" style="font-size: 9.5px;"></i> ' + price + ' / Buy Now' +
                                              '        </span>' +
                                              '        <span style="display: inline-flex; align-items: center; gap: 3px; background: #3498db; color: #ffffff; padding: 1.5px 5.5px; border-radius: 4px; font-weight: 900; cursor: pointer; font-size: 9px; box-shadow: 0 1.5px 4px rgba(52,152,219,0.15); white-space: nowrap; margin-left: 4px; font-family: Sahitya, serif;" onclick="event.stopPropagation(); handleViewDemoClick(\\\'' + cat.id + '\\\', \\\'test\\\')">' +
                                              '            <i class="ph-bold ph-eye" style="font-size: 9.5px;"></i> View Demo' +
                                              '        </span>';
                        }
                    } else {
                        statusBadgeHtml = '        <span style="display: inline-flex; align-items: center; gap: 4px; color: #e67e22; font-size: 9px; font-weight: 900; background: rgba(230, 126, 34, 0.08); padding: 1.5px 6.5px; border-radius: 6px; border: 1px solid rgba(230, 126, 34, 0.15); white-space: nowrap; text-transform: uppercase; letter-spacing: 0.3px;">' +
                                          '            <i class="ph-bold ph-gift" style="font-size: 10px; color: #e67e22;"></i> ' +
                                          '            <span>Limited Time Free</span>' +
                                          '        </span>';
                    }

                    detailsHtml = '    <div style="display: inline-flex; align-items: center; gap: 5px; margin-top: 5px; background: rgba(120, 120, 120, 0.05); border: 1px solid rgba(120, 120, 120, 0.08); padding: 2px 6px; border-radius: 6px; box-sizing: border-box; flex-wrap: wrap; max-width: 100%;">' +
                                  '        <span style="display: inline-flex; align-items: center; gap: 2px; font-size: 9px; font-weight: 850; color: var(--dark); white-space: nowrap;">' +
                                  '            <i class="ph-bold ph-question" style="color: #ff6b35; font-size: 11px;"></i> ' + totalQFormatted + ' MCQ' +
                                  '        </span>' +
                                  '        <span style="width: 1px; height: 9px; background: rgba(120, 120, 120, 0.15); flex-shrink: 0;"></span>' +
                                  '        <span style="display: inline-flex; align-items: center; gap: 2px; font-size: 9px; font-weight: 850; color: var(--dark); white-space: nowrap;">' +
                                  '            <i class="ph-bold ph-clock" style="color: #3498db; font-size: 11px;"></i> ' + totalHrsFormatted +
                                  '        </span>' +
                                  '        <span style="width: 1px; height: 9px; background: rgba(120, 120, 120, 0.15); flex-shrink: 0;"></span>' +
                                  statusBadgeHtml +
                                  '    </div>';
                } else {
                    var totalFiles = 0;
                    if (cat.pdf) totalFiles++;
                    if (cat.subCategories) {
                        cat.subCategories.forEach(function(sub) {
                            if (sub.pdf) totalFiles++;
                            if (sub.topics) {
                                sub.topics.forEach(function(top) {
                                    if (top.pdf) totalFiles++;
                                });
                            }
                        });
                    }

                    var pdfStatusBadgeHtml = '';
                    if (cat.isPaid) {
                        if (isCategoryUnlocked(cat)) {
                            var catExpiry = null;
                            var isCatLifetime = false;
                            if (_studentLoggedInUser) {
                                var hasSpecific = false;
                                if (_studentLoggedInUser.categoryDates && _studentLoggedInUser.categoryDates[cat.id]) {
                                    var catData = _studentLoggedInUser.categoryDates[cat.id];
                                    if (catData.isLifetime) {
                                        isCatLifetime = true;
                                        hasSpecific = true;
                                    } else if (catData.expiryDate && catData.expiryDate.trim() !== "") {
                                        catExpiry = catData.expiryDate;
                                        hasSpecific = true;
                                    }
                                }
                                if (!hasSpecific) {
                                    if (_studentLoggedInUser.expiryDate && _studentLoggedInUser.expiryDate.trim() !== "") {
                                        catExpiry = _studentLoggedInUser.expiryDate;
                                    } else {
                                        isCatLifetime = true;
                                    }
                                }
                            }
                            if (isCatLifetime) {
                                pdfStatusBadgeHtml = '        <span style="display: inline-flex; align-items: center; gap: 4px; color: #9b59b6; font-size: 9.5px; font-weight: 850; background: rgba(155, 89, 182, 0.08); padding: 1.5px 6px; border-radius: 6px; border: 1px solid rgba(155, 89, 182, 0.15); animation: premiumBlink 1.5s infinite ease-in-out; white-space: nowrap;">' +
                                                     '            <i class="ph-fill ph-sparkle" style="font-size: 10.5px; color: #9b59b6;"></i> ' +
                                                     '            <span>Lifetime Active</span>' +
                                                     '        </span>';
                            } else if (catExpiry) {
                                var exp = new Date(catExpiry);
                                var diffMs = exp.getTime() - Date.now();
                                var diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
                                if (diffDays > 0) {
                                    pdfStatusBadgeHtml = '        <span style="display: inline-flex; align-items: center; gap: 4px; color: #2ecc71; font-size: 9.5px; font-weight: 850; background: rgba(46, 204, 113, 0.08); padding: 1.5px 6px; border-radius: 6px; border: 1px solid rgba(46, 204, 113, 0.15); white-space: nowrap;">' +
                                                         '            <i class="ph-fill ph-check-circle" style="font-size: 10.5px; color: #2ecc71;"></i> ' +
                                                         '            <span style="display: inline-block; position: relative; height: 13px; width: 70px; overflow: hidden; vertical-align: middle; line-height: 13px;">' +
                                                         '                <span style="position: absolute; left: 0; top: 0; font-weight: 850; animation: badgeAltTextFade1 3s infinite; white-space: nowrap;">Active</span>' +
                                                         '                <span style="position: absolute; left: 0; top: 0; font-weight: 850; animation: badgeAltTextFade2 3s infinite; white-space: nowrap;">' + diffDays + ' Days</span>' +
                                                         '            </span>' +
                                                         '        </span>';
                                } else {
                                    pdfStatusBadgeHtml = '        <span style="display: inline-flex; align-items: center; gap: 4px; color: #ef4444; font-size: 9.5px; font-weight: 850; background: rgba(239, 68, 68, 0.08); padding: 1.5px 6px; border-radius: 6px; border: 1px solid rgba(239, 68, 68, 0.15); white-space: nowrap;">' +
                                                         '            <i class="ph-fill ph-x-circle" style="font-size: 10.5px; color: #ef4444;"></i> ' +
                                                         '            <span>Expired</span>' +
                                                         '        </span>';
                                }
                            } else {
                                pdfStatusBadgeHtml = '        <span style="display: inline-flex; align-items: center; gap: 4px; color: #9b59b6; font-size: 9.5px; font-weight: 850; background: rgba(155, 89, 182, 0.08); padding: 1.5px 6px; border-radius: 6px; border: 1px solid rgba(155, 89, 182, 0.15); animation: premiumBlink 1.5s infinite ease-in-out; white-space: nowrap;">' +
                                                     '            <i class="ph-fill ph-sparkle" style="font-size: 10.5px; color: #9b59b6;"></i> ' +
                                                     '            <span>Lifetime Active</span>' +
                                                     '        </span>';
                            }
                        } else {
                            var price = cat.paymentAmount || (DB && DB.social && DB.social.premiumPrice) || "₹49";
                            pdfStatusBadgeHtml = '        <span style="display: inline-flex; align-items: center; gap: 3px; background: #FFB800; color: #111111; padding: 1.5px 5.5px; border-radius: 4px; font-weight: 900; cursor: pointer; font-size: 9px; box-shadow: 0 1.5px 4px rgba(255,184,0,0.15); white-space: nowrap; font-family: Sahitya, serif;" onclick="event.stopPropagation(); handleBuyNowClick(\\\'' + cat.id + '\\\')">' +
                                                 '            <i class="ph-bold ph-shopping-cart-simple" style="font-size: 9.5px;"></i> ' + price + ' / Buy Now' +
                                                 '        </span>' +
                                                 '        <span style="display: inline-flex; align-items: center; gap: 3px; background: #3498db; color: #ffffff; padding: 1.5px 5.5px; border-radius: 4px; font-weight: 900; cursor: pointer; font-size: 9px; box-shadow: 0 1.5px 4px rgba(52,152,219,0.15); white-space: nowrap; margin-left: 4px; font-family: Sahitya, serif;" onclick="event.stopPropagation(); handleViewDemoClick(\\\'' + cat.id + '\\\', \\\'pdf\\\')">' +
                                                 '            <i class="ph-bold ph-eye" style="font-size: 9.5px;"></i> View Demo' +
                                                 '        </span>';
                        }
                    } else {
                        pdfStatusBadgeHtml = '        <span style="display: inline-flex; align-items: center; gap: 2.5px; color: var(--grey-text); font-size: 9.5px; font-weight: 850; white-space: nowrap;">' +
                                             '            <i class="ph-bold ph-book-open" style="color: #9b59b6; font-size: 11px;"></i> Free Practice' +
                                             '        </span>';
                    }

                    detailsHtml = '    <div style="display: inline-flex; align-items: center; gap: 5px; margin-top: 5px; background: rgba(120, 120, 120, 0.05); border: 1px solid rgba(120, 120, 120, 0.08); padding: 2px 6px; border-radius: 6px; box-sizing: border-box; flex-wrap: wrap; max-width: 100%;">' +
                                  '        <span style="display: inline-flex; align-items: center; gap: 2.5px; font-size: 9.5px; font-weight: 850; color: var(--dark); white-space: nowrap;">' +
                                  '            <i class="ph-bold ph-file-pdf" style="color: #e74c3c; font-size: 11px;"></i> ' + totalFiles + ' PDFs' +
                                  '        </span>' +
                                  '        <span style="width: 1px; height: 9px; background: rgba(120, 120, 120, 0.2); flex-shrink: 0;"></span>' +
                                  pdfStatusBadgeHtml +
                                  '    </div>';
                }

                catHtml += '<div class="outline-item-details">';
                catHtml += '    <h4 class="outline-item-title">' + cat.name + '</h4>';
                catHtml += detailsHtml;
                catHtml += '</div>';
                catHtml += '<i class="ph ph-caret-right" style="color: var(--primary);"></i>';
                
                card.innerHTML = catHtml;
                container.appendChild(card);
                if (cat.image && cat.image.trim() !== "" && !(window.__imgCache && window.__imgCache[cat.image]) && typeof getCachedImageUrl === "function") {
                    const imgEl = card.querySelector(".outline-item-img");
                    if (imgEl) {
                        getCachedImageUrl(cat.image).then(function(src) {
                            if (src && src !== cat.image) {
                                imgEl.src = src;
                            }
                        });
                    }
                }
            });
        }

        var _activeCategoryForPayment = null;

        function isCategoryUnlocked(cat) {
            if (!cat) return true;
            if (!cat.isPaid) return true; // Free category
            if (!_studentLoggedInUser) return false; // Not logged in means locked
            
            var isLifetime = false;
            var catExpiry = null;
            var hasSpecific = false;
            if (_studentLoggedInUser.categoryDates && _studentLoggedInUser.categoryDates[cat.id]) {
                var catData = _studentLoggedInUser.categoryDates[cat.id];
                if (catData.isLifetime) {
                    isLifetime = true;
                    hasSpecific = true;
                } else if (catData.expiryDate && catData.expiryDate.trim() !== "") {
                    catExpiry = catData.expiryDate;
                    hasSpecific = true;
                }
            }
            if (!hasSpecific) {
                if (_studentLoggedInUser.expiryDate && _studentLoggedInUser.expiryDate.trim() !== "") {
                    catExpiry = _studentLoggedInUser.expiryDate;
                } else {
                    isLifetime = true;
                }
            }

            if (!isLifetime && catExpiry) {
                var exp = new Date(catExpiry);
                var diffMs = exp.getTime() - Date.now();
                var diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
                if (diffDays <= 0) {
                    return false; // Category-specific expired! Show BUY NOW.
                }
            }
            var unlocked = _studentLoggedInUser.unlockedCategoryIds || [];
            return unlocked.includes(cat.id);
        }

        function findRootCategoryForNode(nodeId, type) {
            var targetCats = (type === 'pdf' ? DB.pdfCategories : DB.testCategories) || [];
            for (var i = 0; i < targetCats.length; i++) {
                var cat = targetCats[i];
                if (cat.id === nodeId) return cat;
                if (cat.test && cat.test.id === nodeId) return cat;
                if (cat.pdf && cat.pdf.id === nodeId) return cat;
                
                if (cat.subCategories) {
                    for (var j = 0; j < cat.subCategories.length; j++) {
                        var sub = cat.subCategories[j];
                        if (sub.id === nodeId) return cat;
                        if (sub.test && sub.test.id === nodeId) return cat;
                        if (sub.pdf && sub.pdf.id === nodeId) return cat;
                        
                        if (sub.topics) {
                            for (var k = 0; k < sub.topics.length; k++) {
                                var top = sub.topics[k];
                                if (top.id === nodeId) return cat;
                                if (top.test && top.test.id === nodeId) return cat;
                                if (top.pdf && top.pdf.id === nodeId) return cat;
                            }
                        }
                    }
                }
            }
            return null;
        }

        function resetPaymentScreenshotState() {
            _uploadedScreenshotBase64 = "";
            var fileInput = document.getElementById("payFormScreenshot");
            if (fileInput) fileInput.value = "";
            
            var label = document.getElementById("paySSLabel");
            if (label) label.innerText = "Choose or Drag Screenshot Image";
            
            var previewImg = document.getElementById("paySSPreview");
            var previewContainer = document.getElementById("paySSPreviewContainer");
            var defaultContainer = document.getElementById("paySSDefaultContainer");
            if (previewImg && previewContainer && defaultContainer) {
                previewImg.src = "";
                defaultContainer.style.display = "block";
                previewContainer.style.display = "none";
            }
        }

        function showCategoryPaymentScreen(cat) {
            _activeCategoryForPayment = cat;
            resetPaymentScreenshotState();
            
            // Set dynamic Selected Plan Badge
            var badgeTextEl = document.getElementById("pay-plan-badge-text");
            if (badgeTextEl) {
                badgeTextEl.innerText = "Selected: Unlock " + cat.name;
            }
            
            // Set screen title and description
            document.getElementById("pay-screen-title").innerText = "Unlock " + cat.name;
            document.getElementById("pay-screen-desc").innerText = "Gain full access to " + cat.name + " and all its tests, PDFs, and learning materials today!";
            
            // Pricing elements
            var price = cat.paymentAmount || "₹99";
            var validity = cat.paymentValidityDays || "3 Months";
            document.getElementById("pay-amount").innerText = price;
            document.getElementById("pay-duration").innerText = " / " + validity;
            document.getElementById("pay-validity-text").innerText = "VALID FOR " + validity.toUpperCase();
            
            // Scan header text
            document.getElementById("pay-scan-qr-header").innerText = "Scan QR Code to Pay " + price;
            
            // QR Image
            var qrUrl = cat.paymentQr || (DB && DB.social && DB.social.paymentQr) || 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=payee_prayas';
            document.getElementById("displayPayQrImage").src = qrUrl;
            
            // Contact links
            var contactUrl = cat.paymentUrl || (DB && DB.social && DB.social.paymentContactLink) || 'http://t.me/PrayasOneSupportBot';
            var qrDirectLinkEl = document.getElementById("pay-qr-direct-link");
            if (qrDirectLinkEl) {
                qrDirectLinkEl.href = contactUrl;
                if (contactUrl.indexOf("upi://") === 0) {
                    qrDirectLinkEl.target = "_self";
                    qrDirectLinkEl.innerHTML = '<i class="ph-bold ph-lightning" style="font-size: 15px; color: #ffb800;"></i> Pay via UPI App';
                } else {
                    qrDirectLinkEl.target = "_blank";
                    qrDirectLinkEl.innerHTML = '<i class="ph-bold ph-lightning" style="font-size: 15px;"></i> Tap to Pay / Support Bot';
                }
            }

            var contactLinkEl = document.getElementById("pay-contact-link-element");
            if (contactLinkEl) {
                contactLinkEl.innerHTML = '<i class="ph-bold ph-chats" style="font-size: 17px;"></i> Contact Helpdesk';
            }
            
            // Benefits list
            var benefitsText = cat.paymentBenefits || "Access to all Mock Tests under this category, Access to Premium PDFs, Detailed Option Analyses, Unlimited Attempts";
            var benefitsListEl = document.getElementById("pay-benefits-list");
            if (benefitsListEl) {
                benefitsListEl.innerHTML = benefitsText.split(",")
                    .map(function(b) { return b.trim(); })
                    .filter(Boolean)
                    .map(function(b) {
                        return '<li style="display: flex; align-items: flex-start; gap: 10px; font-size: 13px; font-weight: 700; color: #334155;">' +
                               '<i class="ph-bold ph-check-circle" style="color: #22c55e; font-size: 17px; margin-top: 1px;"></i> <span>' + b + '</span>' +
                               '</li>';
                    }).join("");
            }
            
            // Prefill info
            if (_studentLoggedInUser) {
                document.getElementById("payFormName").value = _studentLoggedInUser.name || "";
                document.getElementById("payFormEmail").value = _studentLoggedInUser.emailOrMobile || "";
                document.getElementById("payFormPhone").value = _studentLoggedInUser.phoneNo || _studentLoggedInUser.emailOrMobile || "";
            } else {
                document.getElementById("payFormName").value = "";
                document.getElementById("payFormEmail").value = "";
                document.getElementById("payFormPhone").value = "";
            }
            document.getElementById("payFormUTR").value = "";
            
            try { ensurePaymentQrCached(); } catch(e){}
            navigateToScreen("scr-pay", "Unlock Category");
            if (typeof updateCooldownUI === "function" && typeof getPaymentCooldownStorageKey === "function") {
                updateCooldownUI("btnSendPaymentEmail", getPaymentCooldownStorageKey());
            }
        }

        function showGeneralPremiumPaymentScreen() {
            _activeCategoryForPayment = null;
            resetPaymentScreenshotState();
            
            // Set dynamic Selected Plan Badge
            var badgeTextEl = document.getElementById("pay-plan-badge-text");
            if (badgeTextEl) {
                badgeTextEl.innerText = "Selected: General Premium Membership";
            }
            
            // Set screen title and description
            document.getElementById("pay-screen-title").innerText = "Upgrade to Premium";
            document.getElementById("pay-screen-desc").innerText = "Gain full access to all Mock Exams, past papers, future series and worksheets today!";
            
            // Pricing elements
            var price = (DB && DB.social && DB.social.premiumPrice) || "₹45";
            var validity = (DB && DB.social && DB.social.premiumDurationText) || "3 Months";
            var validityText = (DB && DB.social && DB.social.premiumValidityText) || "VALID FOR 90 DAYS";
            document.getElementById("pay-amount").innerText = price;
            document.getElementById("pay-duration").innerText = " / " + validity;
            document.getElementById("pay-validity-text").innerText = validityText;
            
            // Scan header text
            document.getElementById("pay-scan-qr-header").innerText = "Scan QR Code to Pay " + price;
            
            // QR Image
            var qrUrl = (DB && DB.social && DB.social.paymentQr) || 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=payee_prayas';
            document.getElementById("displayPayQrImage").src = qrUrl;
            
            // Contact links
            var contactUrl = (DB && DB.social && DB.social.paymentContactLink) || 'http://t.me/PrayasOneSupportBot';
            var qrDirectLinkEl = document.getElementById("pay-qr-direct-link");
            if (qrDirectLinkEl) {
                qrDirectLinkEl.href = contactUrl;
                if (contactUrl.indexOf("upi://") === 0) {
                    qrDirectLinkEl.target = "_self";
                    qrDirectLinkEl.innerHTML = '<i class="ph-bold ph-lightning" style="font-size: 15px; color: #ffb800;"></i> Pay via UPI App';
                } else {
                    qrDirectLinkEl.target = "_blank";
                    qrDirectLinkEl.innerHTML = '<i class="ph-bold ph-lightning" style="font-size: 15px;"></i> Tap to Pay / Support Bot';
                }
            }

            var contactLinkEl = document.getElementById("pay-contact-link-element");
            if (contactLinkEl) {
                contactLinkEl.innerHTML = '<i class="ph-bold ph-chats" style="font-size: 17px;"></i> Contact Helpdesk';
            }
            
            // Benefits list
            var benefitsText = (DB && DB.social && DB.social.premiumBenefitsText) || "Access to Past Tests, Access to Present Tests, Access to Future Tests, Unlimited Test Attempts";
            var benefitsListEl = document.getElementById("pay-benefits-list");
            if (benefitsListEl) {
                benefitsListEl.innerHTML = benefitsText.split(",")
                    .map(function(b) { return b.trim(); })
                    .filter(Boolean)
                    .map(function(b) {
                        return '<li style="display: flex; align-items: flex-start; gap: 10px; font-size: 13px; font-weight: 700; color: #334155;">' +
                               '<i class="ph-bold ph-check-circle" style="color: #22c55e; font-size: 17px; margin-top: 1px;"></i> <span>' + b + '</span>' +
                               '</li>';
                    }).join("");
            }
            
            // Prefill info
            if (_studentLoggedInUser) {
                document.getElementById("payFormName").value = _studentLoggedInUser.name || "";
                document.getElementById("payFormEmail").value = _studentLoggedInUser.emailOrMobile || "";
                document.getElementById("payFormPhone").value = _studentLoggedInUser.phoneNo || _studentLoggedInUser.emailOrMobile || "";
            } else {
                document.getElementById("payFormName").value = "";
                document.getElementById("payFormEmail").value = "";
                document.getElementById("payFormPhone").value = "";
            }
            document.getElementById("payFormUTR").value = "";

            try { ensurePaymentQrCached(); } catch(e){}
            navigateToScreen("scr-pay", "Unlock Premium Plan");
            if (typeof updateCooldownUI === "function" && typeof getPaymentCooldownStorageKey === "function") {
                updateCooldownUI("btnSendPaymentEmail", getPaymentCooldownStorageKey());
            }
        }
        window.showGeneralPremiumPaymentScreen = showGeneralPremiumPaymentScreen;

        window.handleContactHelpdeskClick = function() {
            var cat = _activeCategoryForPayment;
            var isGeneral = !cat;
            var catName = isGeneral ? "General Premium Membership" : cat.name;
            
            var amountEl = document.getElementById("pay-amount");
            var amountVal = amountEl ? amountEl.innerText.trim() : "";
            if (!amountVal) {
                amountVal = cat ? (cat.paymentAmount || "₹99") : ((DB && DB.social && DB.social.premiumPrice) || "₹45");
            }

            // Set detected category and price
            var detCat = document.getElementById("helpdeskDetectedCategory");
            var detAmt = document.getElementById("helpdeskDetectedAmount");
            if (detCat) detCat.innerText = catName;
            if (detAmt) detAmt.innerText = amountVal;

            // Pre-fill input values if already saved or logged in
            var nameInput = document.getElementById("payFormName");
            var emailInput = document.getElementById("payFormEmail");
            var phoneInput = document.getElementById("payFormPhone");

            var currentName = (nameInput ? nameInput.value.trim() : "") || (_studentLoggedInUser ? (_studentLoggedInUser.name || "") : "");
            var currentEmail = (emailInput ? emailInput.value.trim() : "") || (_studentLoggedInUser ? (_studentLoggedInUser.emailOrMobile || "") : "");
            var currentPhone = (phoneInput ? phoneInput.value.trim() : "") || (_studentLoggedInUser ? (_studentLoggedInUser.phoneNo || "") : "");

            var modalName = document.getElementById("helpdeskInputName");
            var modalEmail = document.getElementById("helpdeskInputEmail");
            var modalPhone = document.getElementById("helpdeskInputPhone");
            var modalError = document.getElementById("helpdeskModalError");

            if (modalName) modalName.value = currentName;
            if (modalEmail) modalEmail.value = currentEmail;
            if (modalPhone) modalPhone.value = currentPhone;
            if (modalError) {
                modalError.innerText = "";
                modalError.style.display = "none";
            }

            var overlay = document.getElementById("helpdeskModalOverlay");
            if (overlay) {
                overlay.style.display = "flex";
            }
        };

        window.closeHelpdeskModal = function() {
            var overlay = document.getElementById("helpdeskModalOverlay");
            if (overlay) {
                overlay.style.display = "none";
            }
        };

        window.handleTriggerShowLegalModal = function(type) {
            var titleEl = document.getElementById("legalPolicyModalTitle");
            var contentEl = document.getElementById("legalPolicyModalContent");
            var overlay = document.getElementById("legalPolicyModalOverlay");

            if (!overlay || !titleEl || !contentEl) return;

            var title = "Legal Policy";
            var content = "";

            if (type === "privacy") {
                title = "Privacy Policy";
                content = \`
                    <div style="font-family: sans-serif; line-height: 1.6;">
                        <p style="margin-top: 0;">Welcome to <strong>Prayas One</strong>. We prioritize user trust and are committed to protecting the privacy of our students and portal visitors.</p>
                        <h4 style="margin: 14px 0 4px 0; color: var(--dark); font-weight: 800; font-size: 13px;">1. Information We Collect</h4>
                        <p>We collect student emails and mobile numbers supplied during registration to facilitate secure access to premium mock examination papers and practice test modules.</p>
                        
                        <h4 style="margin: 14px 0 4px 0; color: var(--dark); font-weight: 800; font-size: 13px;">2. Google AdSense & Cookies</h4>
                        <p>We display advertising units provided by <strong>Google AdSense</strong>:</p>
                        <ul>
                            <li style="margin-bottom: 4px;">Google uses cookies to serve ads on <strong>https://prayasone.in</strong> based on user visits.</li>
                            <li style="margin-bottom: 4px;">Users can opt out of personalized ads by visiting Google's Ads Settings.</li>
                        </ul>

                        <h4 style="margin: 14px 0 4px 0; color: var(--dark); font-weight: 800; font-size: 13px;">3. Scorecard & Performance Analytics</h4>
                        <p>Your practice scores, correct/incorrect responses, and obtained marks are stored securely to generate performance scorecards and leaderboard ranking lists.</p>
                    </div>
                \`;
            } else if (type === "terms") {
                title = "Terms & Conditions";
                content = \`
                    <div style="font-family: sans-serif; line-height: 1.6;">
                        <p style="margin-top: 0;">These terms and conditions outline the usage rules for the <strong>Prayas One</strong> platform at <a href="https://prayasone.in" target="_blank" style="color: #FF6B35; text-decoration: none; font-weight: 700;">https://prayasone.in</a>.</p>
                        
                        <h4 style="margin: 14px 0 4px 0; color: var(--dark); font-weight: 800; font-size: 13px;">1. Account Security & Concurrent Limits</h4>
                        <p>Premium MCQ test tracks are restricted to registered aspirants. Sharing or transferring credentials is prohibited. The system tracks active concurrent sessions and automatically signs out previous sessions upon fresh login detections.</p>

                        <h4 style="margin: 14px 0 4px 0; color: var(--dark); font-weight: 800; font-size: 13px;">2. Intellectual Property Notice</h4>
                        <p>All online mock tests, question databases, and bilingual explanations compiled on Prayas One are proprietary assets. You are strictly prohibited from reselling, scraping, distributing, or republishing our materials on external platforms.</p>
                    </div>
                \`;
            } else if (type === "disclaimer") {
                title = "Legal Disclaimer";
                content = \`
                    <div style="font-family: sans-serif; line-height: 1.6;">
                        <p style="margin-top: 0; background: rgba(239, 68, 68, 0.05); padding: 12px; border: 1.5px solid rgba(239, 68, 68, 0.15); border-radius: 12px; font-weight: 700; color: #ef4444;">
                            <strong>STRICT NO-GOVERNMENT AFFILIATION DECLARATION:</strong> Prayas One is an <strong>independent, privately operated educational study platform</strong>. We are <strong>NOT affiliated, associated, or officially connected</strong> with any central or state government body, public service commission, recruitment board, or official exam department (such as SSC, UPSC, RRB, Banking boards, etc.).
                        </p>
                        
                        <h4 style="margin: 14px 0 4px 0; color: var(--dark); font-weight: 800; font-size: 13px;">1. Practice Material & Evaluation</h4>
                        <p>All test series, worksheets, and scorecards are prepared for self-study practice and educational evaluations. While we maintain high standards, we offer no warranties regarding absolute correctness or exam alignment.</p>
                    </div>
                \`;
            } else if (type === "copyright") {
                title = "Copyright & Original Content Policy";
                content = \`
                    <div style="font-family: sans-serif; line-height: 1.6;">
                        <p style="margin-top: 0; background: rgba(37, 211, 102, 0.05); padding: 12px; border: 1.5px solid rgba(37, 211, 102, 0.15); border-radius: 12px; font-weight: 700; color: #15803d;">
                            <strong>100% ORIGINAL CONTENT PLEDGE:</strong> All mock test series, practice questions, bilingual step-by-step solutions, and reference materials on Prayas One are originally created and independently compiled by our dedicated in-house author team.
                        </p>
                        
                        <h4 style="margin: 14px 0 4px 0; color: var(--dark); font-weight: 800; font-size: 13px;">1. Original Authorship & Curation</h4>
                        <p>Every single MCQ and bilingual explanation on our portal is carefully designed from scratch to aid student mock practice. We do not copy, scrape, or duplicate content from other online platforms or books, ensuring supreme educational standards.</p>
                        
                        <h4 style="margin: 14px 0 4px 0; color: var(--dark); font-weight: 800; font-size: 13px;">2. Protection of Original Materials</h4>
                        <p>Unauthorized reproduction, distribution, reselling, or commercial use of our originally curated tests is strictly prohibited and subject to intellectual property protection laws.</p>
                    </div>
                \`;
            }

            titleEl.innerText = title;
            contentEl.innerHTML = content;
            overlay.style.display = "flex";
        };

        window.closeLegalPolicyModal = function() {
            var overlay = document.getElementById("legalPolicyModalOverlay");
            if (overlay) {
                overlay.style.display = "none";
            }
        };

        window.submitHelpdeskModal = function() {
            var modalName = document.getElementById("helpdeskInputName");
            var modalEmail = document.getElementById("helpdeskInputEmail");
            var modalPhone = document.getElementById("helpdeskInputPhone");
            var modalError = document.getElementById("helpdeskModalError");

            var name = modalName ? modalName.value.trim() : "";
            var email = modalEmail ? modalEmail.value.trim() : "";
            var phone = modalPhone ? modalPhone.value.trim() : "";

            if (!name || !email || !phone) {
                if (modalError) {
                    modalError.innerText = "All fields marked with * are required!";
                    modalError.style.display = "block";
                }
                return;
            }

            // Sync back to payment form inputs so they are preserved
            var nameInput = document.getElementById("payFormName");
            var emailInput = document.getElementById("payFormEmail");
            var phoneInput = document.getElementById("payFormPhone");

            if (nameInput) nameInput.value = name;
            if (emailInput) emailInput.value = email;
            if (phoneInput) phoneInput.value = phone;

            var cat = _activeCategoryForPayment;
            var isGeneral = !cat;
            var catName = isGeneral ? "General Premium Membership" : cat.name;
            var amountEl = document.getElementById("pay-amount");
            var amountVal = amountEl ? amountEl.innerText.trim() : "";
            if (!amountVal) {
                amountVal = cat ? (cat.paymentAmount || "₹99") : ((DB && DB.social && DB.social.premiumPrice) || "₹45");
            }

            var categoryPageLink = isGeneral ? (window.location.origin + "/account") : (window.location.origin + "/test/" + toSlug(cat.name));
            var helpdeskBaseUrl = (cat && cat.paymentHelpdeskUrl) || (DB && DB.social && DB.social.paymentContactLink) || 'http://t.me/PrayasOneSupportBot';
            
            var messageText = "I need help with payment for Category: " + catName + " (" + categoryPageLink + ")\\n\\n" +
                              "My Details:\\n" +
                              "• Name: " + name + "\\n" +
                              "• Email: " + email + "\\n" +
                              "• Phone: " + phone + "\\n" +
                              "• Amount Paid: " + amountVal + "\\n\\n" +
                              "premium activate kar dijiye.";
            
            var finalHelpdeskUrl = helpdeskBaseUrl;
            if (helpdeskBaseUrl.indexOf("wa.me") !== -1 || helpdeskBaseUrl.indexOf("whatsapp.com") !== -1) {
                var separator = helpdeskBaseUrl.indexOf("?") !== -1 ? "&" : "?";
                finalHelpdeskUrl = helpdeskBaseUrl + separator + "text=" + encodeURIComponent(messageText);
            } else if (helpdeskBaseUrl.indexOf("t.me") !== -1 || helpdeskBaseUrl.indexOf("telegram.me") !== -1) {
                if (helpdeskBaseUrl.indexOf("?") !== -1) {
                    finalHelpdeskUrl = helpdeskBaseUrl + "&text=" + encodeURIComponent(messageText);
                } else {
                    finalHelpdeskUrl = helpdeskBaseUrl + "?text=" + encodeURIComponent(messageText);
                }
            } else {
                var separator = helpdeskBaseUrl.indexOf("?") !== -1 ? "&" : "?";
                finalHelpdeskUrl = helpdeskBaseUrl + separator + "text=" + encodeURIComponent(messageText);
            }

            window.closeHelpdeskModal();

            showCustomAlert(
                "Open Support Chat", 
                "We have created your payment activation request message.<br/><br/>Click <b>OK</b> to open support chat. The message will be pre-filled in your chatbox - just hit send to activate your premium!", 
                function() {
                    window.open(finalHelpdeskUrl, "_blank");
                }
            );
        };

        function handleSelectCategoryNode(cat, type) {
            // Check category lock first
            if (cat.isPaid && !isCategoryUnlocked(cat)) {
                if (_demoCategories[cat.id]) {
                    // Bypass category block for entering!
                } else {
                    showCategoryPaymentScreen(cat);
                    return;
                }
            }

            _activeCategoryName = cat.name;
            _activeSubCategoryName = cat.name;
            _activeTopicName = (cat.test && cat.test.title) || (cat.pdf && cat.pdf.title) || cat.name;

            _activeCategoryNodeForUrl = cat;
            _activeSubcategoryNodeForUrl = null;
            _activeTopicNodeForUrl = null;
            updateHistoryAndUrl(cat, null, null);

            // Increment attempt count for this category when clicked by 1 (so it moves from 1.101k to 1.102k immediately)
            if (type === 'test') {
                var currentCount = parseInt(localStorage.getItem("_cat_attempts_" + cat.id) || "0", 10);
                if (!currentCount) {
                    var defaultBase = 1100 + ((cat.name && cat.name.charCodeAt(0)) || 0) * 13 + ((cat.id && cat.id.charCodeAt(0)) || 0) * 7;
                    currentCount = defaultBase;
                }
                localStorage.setItem("_cat_attempts_" + cat.id, (currentCount + 1).toString());
                renderCategorySelectionScreen(type); // Re-render to show updated count immediately!
            }

            const hasSubcategories = cat.subCategories && cat.subCategories.length > 0;
            const hasResource = (type === 'test' && cat.test) || (type === 'pdf' && cat.pdf);

            if (hasResource && !hasSubcategories) {
                // If it is scheduled in the future, don't let it open
                if (cat.test && !isItemScheduledVisible(cat.test)) {
                    alert("This test is scheduled to start at: " + new Date(cat.test.scheduledAt).toLocaleString());
                    return;
                }
                if (cat.pdf && !isItemScheduledVisible(cat.pdf)) {
                    alert("This PDF is scheduled to release at: " + new Date(cat.pdf.scheduledAt).toLocaleString());
                    return;
                }
                handleVerifyDirectMeta(cat, type);
                return;
            }

            // Else open nested subcategories screen
            const container = document.getElementById("subcategoryGridArea");
            container.innerHTML = "";
            document.getElementById("subcategorySelectionTitle").innerText = cat.name;

            navigateToScreen("scr-subcat", cat.name);

            // Prepend a special direct launch card if direct content is attached
            if (hasResource) {
                const directCard = document.createElement("div");
                directCard.className = "outline-item-card";
                directCard.style.border = "2px dashed var(--primary)";
                directCard.style.background = "rgba(255, 107, 53, 0.05)";
                
                const label = type === 'test' ? "\ud83c\udfc6 Launch Category Exam" : "\ud83d\udcc1 View Category PDF Document";
                const desc = type === 'test' ? "Primary category-level test assessment" : "Primary category-level study manual";
                const icon = type === 'test' ? "ph ph-sparkle" : "ph ph-file-pdf";
                
                var isDemoMode = _demoCategories[cat.id];
                var isFreeTest = false;
                if (isDemoMode) {
                    if (type === 'test' && cat.test && isDemoFreeTest(cat.test.id, cat)) {
                        isFreeTest = true;
                    } else if (type === 'pdf' && cat.pdf && isDemoFreePdf(cat.pdf.id, cat)) {
                        isFreeTest = true;
                    }
                }

                directCard.onclick = () => {
                    if (isDemoMode && !isFreeTest) {
                        showCategoryPaymentScreen(cat);
                        return;
                    }
                    if (cat.test && !isItemScheduledVisible(cat.test)) {
                        alert("This test is scheduled to start at: " + new Date(cat.test.scheduledAt).toLocaleString());
                        return;
                    }
                    if (cat.pdf && !isItemScheduledVisible(cat.pdf)) {
                        alert("This PDF is scheduled to release at: " + new Date(cat.pdf.scheduledAt).toLocaleString());
                        return;
                    }
                    handleVerifyDirectMeta(cat, type);
                };
                
                var rightIconHtml = '<i class="ph ph-play" style="color: var(--primary);"></i>';
                var badgeLabelHtml = '<h4 class="outline-item-title" style="color: var(--primary); font-weight:800;">' + label + '</h4>';
                if (isDemoMode) {
                    if (isFreeTest) {
                        badgeLabelHtml = '<h4 class="outline-item-title" style="color: var(--primary); font-weight:800; display: flex; align-items: center; gap: 6px;">' +
                                         '    <span style="display: inline-flex; align-items: center; gap: 4px; color: #2ecc71; font-size: 9.5px; font-weight: 850; background: rgba(46, 204, 113, 0.08); padding: 1.5px 6px; border-radius: 6px; border: 1px solid rgba(46, 204, 113, 0.15); font-family: Sahitya, serif;"><i class="ph-bold ph-gift" style="font-size: 10px;"></i> Free Demo</span>' +
                                         '    ' + label +
                                         '</h4>';
                    } else {
                        rightIconHtml = '<i class="ph-fill ph-lock" style="color: #ef4444; font-size: 18px;"></i>';
                    }
                }

                directCard.innerHTML = 
                    '<div class="outline-item-img" style="display:flex;align-items:center;justify-content:center; background: var(--primary); color: white;">' +
                    '    <i class="' + icon + '" style="font-size:24px;"></i>' +
                    '</div>' +
                    '<div class="outline-item-details">' +
                    '    ' + badgeLabelHtml +
                    '    <p class="outline-item-subtitle">' + desc + '</p>' +
                    '</div>' +
                    rightIconHtml;
                container.appendChild(directCard);
            }

            if (!cat.subCategories || cat.subCategories.length === 0) {
                if (!hasResource) {
                    container.innerHTML = '<div class="coming-soon-box">No topics configured in this library.</div>';
                }
                return;
            }

            const visibleSubs = cat.subCategories.filter(isItemVisibleToStudent);
            if (visibleSubs.length === 0) {
                if (!hasResource) {
                    container.innerHTML = '<div class="coming-soon-box">No topics currently available/scheduled in this library.</div>';
                }
                return;
            }

            visibleSubs.forEach((sub) => {
                var isDemoMode = _demoCategories[cat.id];
                var isFreeTestSub = false;
                if (isDemoMode) {
                    if (type === 'test' && subHasDemoFreeTest(sub, cat)) {
                        isFreeTestSub = true;
                    } else if (type === 'pdf' && subHasDemoFreePdf(sub, cat)) {
                        isFreeTestSub = true;
                    }
                }

                const card = document.createElement("div");
                card.className = "outline-item-card";
                card.onclick = () => handleSelectSubcategoryNode(sub, type);
                var initSrc = (window.__imgCache && window.__imgCache[sub.image]) || sub.image || "";
                
                var subHtml = "";
                if (sub.image && sub.image.trim() !== "") {
                    subHtml += '<img class="outline-item-img" src="' + initSrc + '" data-original-src="' + sub.image + '">';
                } else {
                    var defaultIcon = type === 'test' ? 'ph ph-folder-simple' : 'ph ph-file-pdf';
                    subHtml += '<div class="outline-item-img" style="display:flex;align-items:center;justify-content:center;color: var(--primary);"><i class="' + defaultIcon + '" style="font-size:24px;"></i></div>';
                }

                // Compute stats for subcategory
                var detailsHtml = "";
                if (type === 'test') {
                    var totalTests = 0;
                    var totalDurationMins = 0;
                    var attemptedTests = 0;

                    if (sub.test && isItemVisibleToStudent(sub.test)) {
                        totalTests++;
                        totalDurationMins += sub.test.duration || 0;
                        var attempts = parseInt(localStorage.getItem("attempts_test_" + sub.test.id) || "0", 10);
                        if (attempts > 0) {
                            attemptedTests++;
                        }
                    }

                    if (sub.topics && sub.topics.length > 0) {
                        sub.topics.forEach(function(top) {
                            if (top.test && isItemVisibleToStudent(top)) {
                                totalTests++;
                                totalDurationMins += top.test.duration || 0;
                                var attempts = parseInt(localStorage.getItem("attempts_test_" + top.test.id) || "0", 10);
                                if (attempts > 0) {
                                    attemptedTests++;
                                }
                            }
                        });
                    }

                    var totalHrsFormatted = (function() {
                        var rawHours = totalDurationMins / 60;
                        var totalHrsStr = rawHours.toFixed(1);
                        return (totalHrsStr.endsWith(".0") ? rawHours.toFixed(0) : totalHrsStr) + ' Hrs';
                    })();

                    var progressText = attemptedTests + "/" + totalTests + " Done";
                    var progressColor = (attemptedTests === totalTests && totalTests > 0) ? "#2ecc71" : (attemptedTests > 0 ? "#3498db" : "var(--grey-text)");
                    var progressIcon = (attemptedTests === totalTests && totalTests > 0) ? "ph-fill ph-check-circle" : "ph-bold ph-circle-dashed";

                    detailsHtml = '    <div style="display: inline-flex; align-items: center; gap: 5px; margin-top: 5px; background: rgba(120, 120, 120, 0.05); border: 1px solid rgba(120, 120, 120, 0.08); padding: 2px 6px; border-radius: 6px; box-sizing: border-box; flex-wrap: nowrap; max-width: 100%;">' +
                                  '        <span style="display: inline-flex; align-items: center; gap: 2px; font-size: 9px; font-weight: 850; color: var(--dark); white-space: nowrap;">' +
                                  '            <i class="ph-bold ph-clipboard-text" style="color: #ff6b35; font-size: 11px;"></i> ' + totalTests + ' ' + (totalTests === 1 ? 'Test' : 'Tests') +
                                  '        </span>' +
                                  '        <span style="width: 1px; height: 9px; background: rgba(120, 120, 120, 0.15); flex-shrink: 0;"></span>' +
                                  '        <span style="display: inline-flex; align-items: center; gap: 2px; font-size: 9px; font-weight: 850; color: var(--dark); white-space: nowrap;">' +
                                  '            <i class="ph-bold ph-clock" style="color: #3498db; font-size: 11px;"></i> ' + totalHrsFormatted +
                                  '        </span>' +
                                  '        <span style="width: 1px; height: 9px; background: rgba(120, 120, 120, 0.15); flex-shrink: 0;"></span>' +
                                  '        <span style="display: inline-flex; align-items: center; gap: 2.5px; font-size: 9px; font-weight: 850; color: ' + progressColor + '; white-space: nowrap;">' +
                                  '            <i class="' + progressIcon + '" style="font-size: 11px;"></i> ' + progressText +
                                  '        </span>' +
                                  '    </div>';
                } else {
                    var totalFiles = 0;
                    var readFiles = 0;

                    if (sub.pdf && isItemVisibleToStudent(sub.pdf)) {
                        totalFiles++;
                        if (localStorage.getItem("pdf_read_" + sub.id) === "true") {
                            readFiles++;
                        }
                    }

                    if (sub.topics && sub.topics.length > 0) {
                        sub.topics.forEach(function(top) {
                            if (top.pdf && isItemVisibleToStudent(top)) {
                                totalFiles++;
                                if (localStorage.getItem("pdf_read_" + top.id) === "true") {
                                    readFiles++;
                                }
                            }
                        });
                    }

                    var progressText = readFiles + "/" + totalFiles + " Read";
                    var progressColor = (readFiles === totalFiles && totalFiles > 0) ? "#2ecc71" : (readFiles > 0 ? "#3498db" : "var(--grey-text)");
                    var progressIcon = (readFiles === totalFiles && totalFiles > 0) ? "ph-fill ph-check-circle" : "ph-bold ph-circle-dashed";

                    detailsHtml = '    <div style="display: inline-flex; align-items: center; gap: 5px; margin-top: 5px; background: rgba(120, 120, 120, 0.05); border: 1px solid rgba(120, 120, 120, 0.08); padding: 2px 6px; border-radius: 6px; box-sizing: border-box; flex-wrap: nowrap; max-width: 100%;">' +
                                  '        <span style="display: inline-flex; align-items: center; gap: 2px; font-size: 9px; font-weight: 850; color: var(--dark); white-space: nowrap;">' +
                                  '            <i class="ph-bold ph-file-pdf" style="color: #e74c3c; font-size: 11px;"></i> ' + totalFiles + ' PDFs' +
                                  '        </span>' +
                                  '        <span style="width: 1px; height: 9px; background: rgba(120, 120, 120, 0.15); flex-shrink: 0;"></span>' +
                                  '        <span style="display: inline-flex; align-items: center; gap: 2.5px; font-size: 9px; font-weight: 850; color: ' + progressColor + '; white-space: nowrap;">' +
                                  '            <i class="' + progressIcon + '" style="font-size: 11px;"></i> ' + progressText +
                                  '        </span>' +
                                  '    </div>';
                }

                var labelHtml = '<h4 class="outline-item-title">' + sub.name + '</h4>';
                var rightIconHtml = '<i class="ph ph-caret-right" style="color: var(--primary);"></i>';
                if (isDemoMode) {
                    if (isFreeTestSub) {
                        labelHtml = '<h4 class="outline-item-title" style="display: flex; align-items: center; gap: 6px;">' +
                                    '    <span style="display: inline-flex; align-items: center; gap: 4px; color: #2ecc71; font-size: 9px; font-weight: 850; background: rgba(46, 204, 113, 0.08); padding: 1.5px 6px; border-radius: 6px; border: 1px solid rgba(46, 204, 113, 0.15); font-family: Sahitya, serif;"><i class="ph-bold ph-gift" style="font-size: 10px;"></i> Free Demo</span>' +
                                    '    ' + sub.name +
                                    '</h4>';
                    } else {
                        rightIconHtml = '<i class="ph-fill ph-lock" style="color: #ef4444; font-size: 18px; margin-right: 4px;"></i>';
                    }
                }

                subHtml += '<div class="outline-item-details">';
                subHtml += '    ' + labelHtml;
                subHtml += detailsHtml;
                subHtml += '</div>';
                subHtml += rightIconHtml;
                
                card.innerHTML = subHtml;
                container.appendChild(card);
                if (sub.image && sub.image.trim() !== "" && !(window.__imgCache && window.__imgCache[sub.image]) && typeof getCachedImageUrl === "function") {
                    const imgEl = card.querySelector(".outline-item-img");
                    if (imgEl) {
                        getCachedImageUrl(sub.image).then(function(src) {
                            if (src && src !== sub.image) {
                                imgEl.src = src;
                            }
                        });
                    }
                }
            });
        }

        function handleSelectSubcategoryNode(sub, type) {
            if (_activeCategoryNodeForUrl) {
                _activeCategoryName = _activeCategoryNodeForUrl.name;
            }
            _activeSubCategoryName = sub.name;
            _activeTopicName = (sub.test && sub.test.title) || (sub.pdf && sub.pdf.title) || sub.name;

            _activeSubcategoryNodeForUrl = sub;
            _activeTopicNodeForUrl = null;
            _activeTopicStack = [];
            _activeTopicType = type;
            updateHistoryAndUrl(_activeCategoryNodeForUrl, sub, null);

            const hasTopics = sub.topics && sub.topics.length > 0;
            const hasResource = (type === 'test' && sub.test) || (type === 'pdf' && sub.pdf);

            if (hasResource && !hasTopics) {
                if (sub.test && !isItemScheduledVisible(sub.test)) {
                    alert("This test is scheduled to start at: " + new Date(sub.test.scheduledAt).toLocaleString());
                    return;
                }
                if (sub.pdf && !isItemScheduledVisible(sub.pdf)) {
                    alert("This PDF is scheduled to release at: " + new Date(sub.pdf.scheduledAt).toLocaleString());
                    return;
                }
                handleVerifyDirectMeta(sub, type);
                return;
            }

            // Open Topics screen
            navigateToScreen("scr-topics", sub.name);
            renderTopicList(sub.topics || [], sub.name, type);
        }

        function renderTopicList(topics, title, type) {
            const container = document.getElementById("topicsGridArea");
            container.innerHTML = "";
            document.getElementById("topicSelectionTitle").innerText = title;

            const hasResource = (_activeSubcategoryNodeForUrl && ((type === 'test' && _activeSubcategoryNodeForUrl.test) || (type === 'pdf' && _activeSubcategoryNodeForUrl.pdf)));

            // Prepend a standard direct card if direct content is attached at subcategory level and we are at the root level of topics stack
            if (hasResource && _activeTopicStack.length === 0) {
                const directCard = document.createElement("div");
                directCard.className = "outline-item-card";

                var detailsHtml = "";
                if (type === 'test') {
                    var totalQ = _activeSubcategoryNodeForUrl.test ? getQuestionsCountFromTest(_activeSubcategoryNodeForUrl.test) : 0;
                    var durationMins = _activeSubcategoryNodeForUrl.test ? (_activeSubcategoryNodeForUrl.test.duration || 0) : 0;
                    var attempts = _activeSubcategoryNodeForUrl.test ? parseInt(localStorage.getItem("attempts_test_" + _activeSubcategoryNodeForUrl.test.id) || "0", 10) : 0;

                    var durationText = durationMins + ' Mins';

                    var attemptsText = attempts + (attempts === 1 ? " Attempt" : " Attempts");
                    var attemptsColor = (attempts > 0) ? "#2ecc71" : "var(--grey-text)";
                    var attemptsIcon = (attempts > 0) ? "ph-fill ph-check-circle" : "ph-bold ph-circle-dashed";

                    detailsHtml = '    <div style="display: inline-flex; align-items: center; gap: 5px; margin-top: 5px; background: rgba(120, 120, 120, 0.05); border: 1px solid rgba(120, 120, 120, 0.08); padding: 2px 6px; border-radius: 6px; box-sizing: border-box; flex-wrap: nowrap; max-width: 100%;">' +
                                  '        <span style="display: inline-flex; align-items: center; gap: 2px; font-size: 9px; font-weight: 850; color: var(--dark); white-space: nowrap;">' +
                                  '            <i class="ph-bold ph-question" style="color: #ff6b35; font-size: 11px;"></i> ' + totalQ + ' MCQ' +
                                  '        </span>' +
                                  '        <span style="width: 1px; height: 9px; background: rgba(120, 120, 120, 0.15); flex-shrink: 0;"></span>' +
                                  '        <span style="display: inline-flex; align-items: center; gap: 2px; font-size: 9px; font-weight: 850; color: var(--dark); white-space: nowrap;">' +
                                  '            <i class="ph-bold ph-clock" style="color: #3498db; font-size: 11px;"></i> ' + durationText +
                                  '        </span>' +
                                  '        <span style="width: 1px; height: 9px; background: rgba(120, 120, 120, 0.15); flex-shrink: 0;"></span>' +
                                  '        <span style="display: inline-flex; align-items: center; gap: 2.5px; font-size: 9px; font-weight: 850; color: ' + attemptsColor + '; white-space: nowrap;">' +
                                  '            <i class="' + attemptsIcon + '" style="font-size: 11px;"></i> ' + attemptsText +
                                  '        </span>' +
                                  '    </div>';
                } else {
                    var hasRead = _activeSubcategoryNodeForUrl.id && localStorage.getItem("pdf_read_" + _activeSubcategoryNodeForUrl.id) === "true";
                    var readText = hasRead ? "Read" : "Unread";
                    var readColor = hasRead ? "#2ecc71" : "var(--grey-text)";
                    var readIcon = hasRead ? "ph-fill ph-check-circle" : "ph-bold ph-circle-dashed";

                    detailsHtml = '    <div style="display: inline-flex; align-items: center; gap: 5px; margin-top: 5px; background: rgba(120, 120, 120, 0.05); border: 1px solid rgba(120, 120, 120, 0.08); padding: 2px 6px; border-radius: 6px; box-sizing: border-box; flex-wrap: nowrap; max-width: 100%;">' +
                                  '        <span style="display: inline-flex; align-items: center; gap: 2px; font-size: 9px; font-weight: 850; color: var(--dark); white-space: nowrap;">' +
                                  '            <i class="ph-bold ph-file-pdf" style="color: #e74c3c; font-size: 11px;"></i> PDF Document' +
                                  '        </span>' +
                                  '        <span style="width: 1px; height: 9px; background: rgba(120, 120, 120, 0.15); flex-shrink: 0;"></span>' +
                                  '        <span style="display: inline-flex; align-items: center; gap: 2.5px; font-size: 9px; font-weight: 850; color: ' + readColor + '; white-space: nowrap;">' +
                                  '            <i class="' + readIcon + '" style="font-size: 11px;"></i> ' + readText +
                                  '        </span>' +
                                  '    </div>';
                }

                var initSrc = (_activeSubcategoryNodeForUrl.image && window.__imgCache && window.__imgCache[_activeSubcategoryNodeForUrl.image]) || _activeSubcategoryNodeForUrl.image || "";
                var hasImg = _activeSubcategoryNodeForUrl.image && _activeSubcategoryNodeForUrl.image.trim() !== "";
                var iconClass = type === 'test' ? "ph ph-exam" : "ph ph-file-pdf";

                var cardHtml = "";
                if (hasImg) {
                    cardHtml += '<img class="outline-item-img" src="' + initSrc + '" data-original-src="' + _activeSubcategoryNodeForUrl.image + '">';
                } else {
                    cardHtml += '<div class="outline-item-img" style="display:flex;align-items:center;justify-content:center;color: var(--primary);"><i class="' + iconClass + '" style="font-size:24px;"></i></div>';
                }

                var rootCat = _activeCategoryNodeForUrl;
                var isDemoMode = rootCat && _demoCategories[rootCat.id];
                var isFreeTest = false;
                if (isDemoMode) {
                    if (type === 'test' && _activeSubcategoryNodeForUrl.test && isDemoFreeTest(_activeSubcategoryNodeForUrl.test.id, rootCat)) {
                        isFreeTest = true;
                    } else if (type === 'pdf' && _activeSubcategoryNodeForUrl.pdf && isDemoFreePdf(_activeSubcategoryNodeForUrl.pdf.id, rootCat)) {
                        isFreeTest = true;
                    }
                }

                directCard.onclick = () => {
                    if (isDemoMode && !isFreeTest) {
                        showCategoryPaymentScreen(rootCat);
                        return;
                    }
                    if (_activeSubcategoryNodeForUrl.test && !isItemScheduledVisible(_activeSubcategoryNodeForUrl.test)) {
                        alert("This test is scheduled to start at: " + new Date(_activeSubcategoryNodeForUrl.test.scheduledAt).toLocaleString());
                        return;
                    }
                    if (_activeSubcategoryNodeForUrl.pdf && !isItemScheduledVisible(_activeSubcategoryNodeForUrl.pdf)) {
                        alert("This PDF is scheduled to release at: " + new Date(_activeSubcategoryNodeForUrl.pdf.scheduledAt).toLocaleString());
                        return;
                    }
                    handleVerifyDirectMeta(_activeSubcategoryNodeForUrl, type);
                };

                var badgeLabelHtml = '<h4 class="outline-item-title">' + _activeSubcategoryNodeForUrl.name + '</h4>';
                if (isDemoMode && isFreeTest) {
                    badgeLabelHtml = '<h4 class="outline-item-title" style="display: flex; align-items: center; gap: 6px;">' +
                                     '    <span style="display: inline-flex; align-items: center; gap: 4px; color: #2ecc71; font-size: 9.5px; font-weight: 850; background: rgba(46, 204, 113, 0.08); padding: 1.5px 6px; border-radius: 6px; border: 1px solid rgba(46, 204, 113, 0.15); font-family: Sahitya, serif;"><i class="ph-bold ph-gift" style="font-size: 10px;"></i> Free Demo</span>' +
                                     '    ' + _activeSubcategoryNodeForUrl.name +
                                     '</h4>';
                }

                cardHtml += '<div class="outline-item-details">';
                cardHtml += badgeLabelHtml;
                cardHtml += detailsHtml;
                cardHtml += '</div>';

                if (isDemoMode && !isFreeTest) {
                    cardHtml += '<i class="ph-fill ph-lock" style="color: #ef4444; font-size: 18px; margin-right: 4px;"></i>';
                } else {
                    cardHtml += '<i class="ph ph-caret-right" style="color: var(--primary);"></i>';
                }

                directCard.innerHTML = cardHtml;
                container.appendChild(directCard);
            }

            // Render navigation breadcrumbs if looking at subtopics
            if (_activeTopicStack && _activeTopicStack.length > 0) {
                const breadcrumbDiv = document.createElement("div");
                breadcrumbDiv.style.cssText = "display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; color: var(--grey-text); margin-bottom: 12px; flex-wrap: wrap; background: rgba(120, 120, 120, 0.04); padding: 6px 12px; border-radius: 8px; border: 1px solid rgba(120, 120, 120, 0.08);";
                
                // Root subcategory link
                const rootSpan = document.createElement("span");
                rootSpan.innerText = _activeSubcategoryNodeForUrl.name;
                rootSpan.style.cursor = "pointer";
                rootSpan.style.color = "var(--primary)";
                rootSpan.onclick = () => {
                    _activeTopicStack = [];
                    renderTopicList(_activeSubcategoryNodeForUrl.topics || [], _activeSubcategoryNodeForUrl.name, type);
                };
                breadcrumbDiv.appendChild(rootSpan);

                _activeTopicStack.forEach((node, idx) => {
                    const arrow = document.createElement("span");
                    arrow.innerText = "›";
                    breadcrumbDiv.appendChild(arrow);

                    const nodeSpan = document.createElement("span");
                    nodeSpan.innerText = node.name;
                    if (idx < _activeTopicStack.length - 1) {
                        nodeSpan.style.cursor = "pointer";
                        nodeSpan.style.color = "var(--primary)";
                        nodeSpan.onclick = () => {
                            _activeTopicStack = _activeTopicStack.slice(0, idx + 1);
                            renderTopicList(node.topics || [], node.name, type);
                        };
                    } else {
                        nodeSpan.style.color = "var(--dark)";
                    }
                    breadcrumbDiv.appendChild(nodeSpan);
                });

                container.appendChild(breadcrumbDiv);
            }

            const visibleTopics = (topics || []).filter(isItemVisibleToStudent);
            if (visibleTopics.length === 0) {
                if (!hasResource || _activeTopicStack.length > 0) {
                    const emptyBox = document.createElement("div");
                    emptyBox.className = "coming-soon-box";
                    emptyBox.innerText = "No active items located here currently.";
                    container.appendChild(emptyBox);
                }
                return;
            }

            visibleTopics.forEach((topic) => {
                var isDemoMode = _activeCategoryNodeForUrl && _demoCategories[_activeCategoryNodeForUrl.id];
                var isFreeTest = false;
                if (isDemoMode) {
                    if (type === 'test' && topic.test && isDemoFreeTest(topic.test.id, _activeCategoryNodeForUrl)) {
                        isFreeTest = true;
                    } else if (type === 'pdf' && topic.pdf && isDemoFreePdf(topic.pdf.id, _activeCategoryNodeForUrl)) {
                        isFreeTest = true;
                    }
                }

                const card = document.createElement("div");
                card.className = "outline-item-card";
                card.onclick = () => handleSelectTopicNode(topic, type);

                let iconClass = "ph ph-exam";
                if (topic.topics && topic.topics.length > 0) {
                    iconClass = "ph ph-folder-open";
                } else if (type === 'pdf') {
                    iconClass = "ph ph-file-pdf";
                }

                var initSrc = (topic.image && window.__imgCache && window.__imgCache[topic.image]) || topic.image || "";
                var hasImg = topic.image && topic.image.trim() !== "";
                
                var topicHtml = "";
                if (hasImg) {
                    topicHtml += '<img class="outline-item-img" src="' + initSrc + '" data-original-src="' + topic.image + '">';
                } else {
                    topicHtml += '<div class="outline-item-img" style="display:flex;align-items:center;justify-content:center;color: var(--primary);"><i class="' + iconClass + '" style="font-size:24px;"></i></div>';
                }

                // Compute stats for topic level
                var detailsHtml = "";
                if (topic.topics && topic.topics.length > 0) {
                    detailsHtml = "";
                } else if (type === 'test') {
                    var totalQ = topic.test ? getQuestionsCountFromTest(topic.test) : 0;
                    var durationMins = topic.test ? (topic.test.duration || 0) : 0;
                    var attempts = topic.test ? parseInt(localStorage.getItem("attempts_test_" + topic.test.id) || "0", 10) : 0;

                    var durationText = durationMins + ' Mins';

                    var attemptsText = attempts + (attempts === 1 ? " Attempt" : " Attempts");
                    var attemptsColor = (attempts > 0) ? "#2ecc71" : "var(--grey-text)";
                    var attemptsIcon = (attempts > 0) ? "ph-fill ph-check-circle" : "ph-bold ph-circle-dashed";

                    detailsHtml = '    <div style="display: inline-flex; align-items: center; gap: 5px; margin-top: 5px; background: rgba(120, 120, 120, 0.05); border: 1px solid rgba(120, 120, 120, 0.08); padding: 2px 6px; border-radius: 6px; box-sizing: border-box; flex-wrap: nowrap; max-width: 100%;">' +
                                  '        <span style="display: inline-flex; align-items: center; gap: 2px; font-size: 9px; font-weight: 850; color: var(--dark); white-space: nowrap;">' +
                                  '            <i class="ph-bold ph-question" style="color: #ff6b35; font-size: 11px;"></i> ' + totalQ + ' MCQ' +
                                  '        </span>' +
                                  '        <span style="width: 1px; height: 9px; background: rgba(120, 120, 120, 0.15); flex-shrink: 0;"></span>' +
                                  '        <span style="display: inline-flex; align-items: center; gap: 2px; font-size: 9px; font-weight: 850; color: var(--dark); white-space: nowrap;">' +
                                  '            <i class="ph-bold ph-clock" style="color: #3498db; font-size: 11px;"></i> ' + durationText +
                                  '        </span>' +
                                  '        <span style="width: 1px; height: 9px; background: rgba(120, 120, 120, 0.15); flex-shrink: 0;"></span>' +
                                  '        <span style="display: inline-flex; align-items: center; gap: 2.5px; font-size: 9px; font-weight: 850; color: ' + attemptsColor + '; white-space: nowrap;">' +
                                  '            <i class="' + attemptsIcon + '" style="font-size: 11px;"></i> ' + attemptsText +
                                  '        </span>' +
                                  '    </div>';
                } else {
                    var hasRead = topic.id && localStorage.getItem("pdf_read_" + topic.id) === "true";
                    var readText = hasRead ? "Read" : "Unread";
                    var readColor = hasRead ? "#2ecc71" : "var(--grey-text)";
                    var readIcon = hasRead ? "ph-fill ph-check-circle" : "ph-bold ph-circle-dashed";

                    detailsHtml = '    <div style="display: inline-flex; align-items: center; gap: 5px; margin-top: 5px; background: rgba(120, 120, 120, 0.05); border: 1px solid rgba(120, 120, 120, 0.08); padding: 2px 6px; border-radius: 6px; box-sizing: border-box; flex-wrap: nowrap; max-width: 100%;">' +
                                  '        <span style="display: inline-flex; align-items: center; gap: 2px; font-size: 9px; font-weight: 850; color: var(--dark); white-space: nowrap;">' +
                                  '            <i class="ph-bold ph-file-pdf" style="color: #e74c3c; font-size: 11px;"></i> PDF Document' +
                                  '        </span>' +
                                  '        <span style="width: 1px; height: 9px; background: rgba(120, 120, 120, 0.15); flex-shrink: 0;"></span>' +
                                  '        <span style="display: inline-flex; align-items: center; gap: 2.5px; font-size: 9px; font-weight: 850; color: ' + readColor + '; white-space: nowrap;">' +
                                  '            <i class="' + readIcon + '" style="font-size: 11px;"></i> ' + readText +
                                  '        </span>' +
                                  '    </div>';
                }

                topicHtml += '<div class="outline-item-details">';
                if (isDemoMode && isFreeTest) {
                    topicHtml += '    <h4 class="outline-item-title" style="display: flex; align-items: center; gap: 6px;">' +
                                 '        <span style="display: inline-flex; align-items: center; gap: 4px; color: #2ecc71; font-size: 9.5px; font-weight: 850; background: rgba(46, 204, 113, 0.08); padding: 1.5px 6px; border-radius: 6px; border: 1px solid rgba(46, 204, 113, 0.15); font-family: Sahitya, serif;"><i class="ph-bold ph-gift" style="font-size: 10px;"></i> Free Demo</span>' +
                                 '        ' + topic.name +
                                 '    </h4>';
                } else {
                    topicHtml += '    <h4 class="outline-item-title">' + topic.name + '</h4>';
                }
                topicHtml += detailsHtml;
                topicHtml += '</div>';

                if (topic.topics && topic.topics.length > 0) {
                    topicHtml += '<i class="ph ph-folder" style="color: #f1c40f; font-size: 18px;"></i>';
                } else if (isDemoMode && !isFreeTest) {
                    topicHtml += '<i class="ph-fill ph-lock" style="color: #ef4444; font-size: 18px; margin-right: 4px;"></i>';
                } else {
                    topicHtml += '<i class="ph ph-caret-right" style="color: var(--primary);"></i>';
                }

                card.innerHTML = topicHtml;
                container.appendChild(card);

                if (hasImg && !(window.__imgCache && window.__imgCache[topic.image]) && typeof getCachedImageUrl === "function") {
                    const imgEl = card.querySelector(".outline-item-img");
                    if (imgEl) {
                        getCachedImageUrl(topic.image).then(function(src) {
                            if (src && src !== topic.image) {
                                imgEl.src = src;
                            }
                        });
                    }
                }
            });
        }

        function handleSelectTopicNode(topic, type) {
            if (_activeCategoryNodeForUrl) {
                _activeCategoryName = _activeCategoryNodeForUrl.name;
            }
            if (_activeSubcategoryNodeForUrl) {
                _activeSubCategoryName = _activeSubcategoryNodeForUrl.name;
            }
            _activeTopicName = topic.name;

            if (topic.topics && topic.topics.length > 0) {
                _activeTopicStack.push(topic);
                renderTopicList(topic.topics, topic.name, type);
                return;
            }

            _activeTopicNodeForUrl = topic;
            updateHistoryAndUrl(_activeCategoryNodeForUrl, _activeSubcategoryNodeForUrl, topic);

            if (topic.test && !isItemScheduledVisible(topic.test)) {
                alert("This test is scheduled to start at: " + new Date(topic.test.scheduledAt).toLocaleString());
                return;
            }
            if (topic.pdf && !isItemScheduledVisible(topic.pdf)) {
                alert("This PDF is scheduled to release at: " + new Date(topic.pdf.scheduledAt).toLocaleString());
                return;
            }

            handleVerifyDirectMeta(topic, type);
        }

        // Checking tests or PDFs direct launch
        function handleVerifyDirectMeta(node, type) {
            var rootCat = findRootCategoryForNode(node.id, type);
            if (rootCat && rootCat.isPaid && !isCategoryUnlocked(rootCat)) {
                if (_demoCategories[rootCat.id] && type === 'test' && node.test && isDemoFreeTest(node.test.id, rootCat)) {
                    // Bypass for the free demo test!
                } else if (_demoCategories[rootCat.id] && type === 'pdf' && node.pdf && isDemoFreePdf(node.pdf.id, rootCat)) {
                    // Bypass for the free demo pdf!
                } else {
                    showCategoryPaymentScreen(rootCat);
                    return;
                }
            }
            if (!isItemVisibleToStudent(node)) {
                showCustomAlert("Resource Restricted", "This resource is restricted or not currently available for your account.");
                return;
            }
            if (type === 'pdf') {
                const pdfData = node.pdf;
                if (!pdfData || !pdfData.url) {
                    showCustomAlert("Unavailable", "No PDF resources linked here yet.");
                    return;
                }
                
                // If it is a Paid PDF, check category gating
                if (pdfData.isPaid && rootCat && !isCategoryUnlocked(rootCat)) {
                    showCategoryPaymentScreen(rootCat);
                    return;
                }

                // Let them access URL after showing the copyright gate modal
                showCopyrightPdfModal(node.name || "Study Material PDF", pdfData.url, function() {
                    if (node && node.id) {
                        localStorage.setItem("pdf_read_" + node.id, "true");
                    }
                    window.open(pdfData.url, '_blank');
                });
            } else {
                const testData = node.test;
                const othersCount = Object.values((testData && testData.questionsOther) || {}).reduce((sum, arr) => sum + (arr ? arr.length : 0), 0);
                const isConfigured = testData && (testData.hasSplitQuestions || (testData.questionsEn && testData.questionsEn.length > 0) || (testData.questionsHi && testData.questionsHi.length > 0) || othersCount > 0 || (testData.questionsCount && testData.questionsCount > 0) || testData.id);
                if (!testData || !isConfigured) {
                    alert("No questions configured inside this Mock Test yet.");
                    return;
                }

                _activeTest = testData;
                
                // Setup pre-instructions screen
                navigateToScreen("scr-instructions", testData.title || node.name);
                document.getElementById("instExTitle").innerText = testData.title || node.name;
                document.getElementById("instExDuration").innerText = testData.duration;
                
                let qCount = testData.questionsCount || Math.max(testData.questionsEn.length, testData.questionsHi.length);
                Object.values(testData.questionsOther || {}).forEach(arr => {
                    if (arr && arr.length > qCount) {
                        qCount = arr.length;
                    }
                });
                document.getElementById("instExCount").innerText = qCount;
                document.getElementById("instExPositive").innerText = testData.posMarks;
                document.getElementById("instExNegative").innerText = testData.negMarks;
                document.getElementById("instExDesc").innerText = testData.instructions || "Conduct assessment systematically. Refrain from screenshot actions.";

                // Coupon panel display
                const couponPanel = document.getElementById("couponEntrySection");
                const couponInput = document.getElementById("couponCodeInput");
                const couponFeedback = document.getElementById("couponFeedbackMsg");
                
                couponInput.value = "";
                couponFeedback.innerHTML = "";
                _hasActiveCouponGrant = null;

                const availableCoupons = collectAllAvailableCouponsForActiveTest();

                if (availableCoupons.length > 0) {
                    couponPanel.style.display = "block";
                    checkAndRestoreAppliedCoupon();
                } else {
                    couponPanel.style.display = "none";
                }
            }
        }

        // Collect all coupons across the test and its category hierarchy
        function collectAllAvailableCouponsForActiveTest() {
            const list = [];
            
            // 1. From active test itself
            if (_activeTest && _activeTest.coupon && _activeTest.coupon.code) {
                list.push({ source: 'test', coupon: _activeTest.coupon });
            }
            
            // 2. From active topic
            if (_activeTopicNodeForUrl) {
                if (_activeTopicNodeForUrl.coupon && _activeTopicNodeForUrl.coupon.code) {
                    list.push({ source: 'topic', coupon: _activeTopicNodeForUrl.coupon });
                } else if (_activeTopicNodeForUrl.couponCode) {
                    list.push({ source: 'topic', coupon: { code: _activeTopicNodeForUrl.couponCode, maxAttempts: "unlimited" } });
                }
            }
            
            // 3. From active subcategory
            if (_activeSubcategoryNodeForUrl) {
                if (_activeSubcategoryNodeForUrl.coupon && _activeSubcategoryNodeForUrl.coupon.code) {
                    list.push({ source: 'subcategory', coupon: _activeSubcategoryNodeForUrl.coupon });
                } else if (_activeSubcategoryNodeForUrl.couponCode) {
                    list.push({ source: 'subcategory', coupon: { code: _activeSubcategoryNodeForUrl.couponCode, maxAttempts: "unlimited" } });
                }
            }
            
            // 4. From active category
            if (_activeCategoryNodeForUrl) {
                if (_activeCategoryNodeForUrl.coupon && _activeCategoryNodeForUrl.coupon.code) {
                    list.push({ source: 'category', coupon: _activeCategoryNodeForUrl.coupon });
                } else if (_activeCategoryNodeForUrl.couponCode) {
                    list.push({ source: 'category', coupon: { code: _activeCategoryNodeForUrl.couponCode, maxAttempts: "unlimited" } });
                }
            }
            
            // Deduplicate lists by code
            const seen = new Set();
            return list.filter(item => {
                if (!item || !item.coupon || !item.coupon.code) return false;
                const code = item.coupon.code.trim().toUpperCase();
                if (seen.has(code)) return false;
                seen.add(code);
                return true;
            });
        }

        // Safe helper to parse date strings to timestamp in local time
        function parseCouponDate(dateStr, defaultTime) {
            if (!dateStr) return null;
            try {
                if (dateStr.indexOf('T') !== -1) {
                    return new Date(dateStr).getTime();
                }
                const cleanDate = dateStr.trim();
                if (/^\d{4}-\d{2}-\d{2}$/.test(cleanDate)) {
                    return new Date(cleanDate + "T" + defaultTime).getTime();
                }
                return new Date(cleanDate).getTime();
            } catch (e) {
                return null;
            }
        }

        // Check if there is an applied coupon for this test in localStorage and restore it
        function checkAndRestoreAppliedCoupon() {
            if (!_activeTest) return;
            const savedCoupons = JSON.parse(localStorage.getItem("prayas_applied_coupons") || "{}");
            const saved = savedCoupons[_activeTest.id];
            
            const feedback = document.getElementById("couponFeedbackMsg");
            const couponInput = document.getElementById("couponCodeInput");
            
            if (saved) {
                const available = collectAllAvailableCouponsForActiveTest();
                const matchedObj = available.find(item => item.coupon.code.trim().toUpperCase() === saved.code.trim().toUpperCase());
                
                if (!matchedObj) {
                    // Coupon is no longer configured or available for this test node
                    delete savedCoupons[_activeTest.id];
                    localStorage.setItem("prayas_applied_coupons", JSON.stringify(savedCoupons));
                    _hasActiveCouponGrant = null;
                    return;
                }
                
                const coupon = matchedObj.coupon;
                const currentDateVal = Date.now();
                
                // Expiry Date check: automatic lock/removal if expired
                if (coupon.endDate) {
                    const endDate = parseCouponDate(coupon.endDate, "23:59:59");
                    if (endDate && currentDateVal > endDate) {
                        delete savedCoupons[_activeTest.id];
                        localStorage.setItem("prayas_applied_coupons", JSON.stringify(savedCoupons));
                        _hasActiveCouponGrant = null;
                        
                        feedback.style.color = "red";
                        feedback.innerText = "The applied coupon has expired and has been deactivated automatically.";
                        return;
                    }
                }
                
                // Start Date check
                if (coupon.startDate) {
                    const startDate = parseCouponDate(coupon.startDate, "00:00:00");
                    if (startDate && currentDateVal < startDate) {
                        delete savedCoupons[_activeTest.id];
                        localStorage.setItem("prayas_applied_coupons", JSON.stringify(savedCoupons));
                        _hasActiveCouponGrant = null;
                        
                        feedback.style.color = "orange";
                        feedback.innerText = "The applied coupon is not active anymore.";
                        return;
                    }
                }
                
                // Active valid coupon restored!
                _hasActiveCouponGrant = coupon;
                couponInput.value = coupon.code;
                
                const extraAttemptsText = (coupon.maxAttempts === "unlimited" || !coupon.maxAttempts) ? "Unlimited" : coupon.maxAttempts;
                feedback.style.color = "green";
                feedback.innerHTML = 'Coupon "' + coupon.code + '" successfully applied! ' + extraAttemptsText + ' attempts unlocked. <button onclick="handleRemoveCoupon()" style="background: #ef4444; color: white; border: none; padding: 4px 8px; border-radius: 6px; font-size: 10px; cursor: pointer; margin-left: 8px; font-weight: bold;">REMOVE</button>';
            }
        }

        // Handle user clicks to remove coupon code manually
        function handleRemoveCoupon() {
            if (!_activeTest) return;
            const savedCoupons = JSON.parse(localStorage.getItem("prayas_applied_coupons") || "{}");
            if (savedCoupons[_activeTest.id]) {
                delete savedCoupons[_activeTest.id];
                localStorage.setItem("prayas_applied_coupons", JSON.stringify(savedCoupons));
            }
            _hasActiveCouponGrant = null;
            
            const feedback = document.getElementById("couponFeedbackMsg");
            const couponInput = document.getElementById("couponCodeInput");
            if (couponInput) couponInput.value = "";
            if (feedback) {
                feedback.style.color = "gray";
                feedback.innerText = "Coupon removed.";
            }
        }
        window.handleRemoveCoupon = handleRemoveCoupon;

        // Voucher/Coupon submission validation
        function handleVerifyCouponSubmit() {
            const inputVal = document.getElementById("couponCodeInput").value.trim().toUpperCase();
            const feedback = document.getElementById("couponFeedbackMsg");

            if (!inputVal) {
                feedback.style.color = "red";
                feedback.innerText = "Please enter coupon code.";
                return;
            }

            const available = collectAllAvailableCouponsForActiveTest();
            const matchedObj = available.find(item => item.coupon.code.trim().toUpperCase() === inputVal);

            if (!matchedObj) {
                feedback.style.color = "red";
                feedback.innerText = "Invalid verification code.";
                return;
            }

            const coupon = matchedObj.coupon;
            const currentDateVal = Date.now();

            // Validate Start Date
            if (coupon.startDate) {
                const startDate = parseCouponDate(coupon.startDate, "00:00:00");
                if (startDate && currentDateVal < startDate) {
                    feedback.style.color = "orange";
                    feedback.innerText = "Voucher/Coupon code is not active yet.";
                    return;
                }
            }

            // Validate Expiry Date
            if (coupon.endDate) {
                const endDate = parseCouponDate(coupon.endDate, "23:59:59");
                if (endDate && currentDateVal > endDate) {
                    feedback.style.color = "red";
                    feedback.innerText = "Coupon code has expired.";
                    return;
                }
            }

            // Approve and persist coupon in localStorage
            const savedCoupons = JSON.parse(localStorage.getItem("prayas_applied_coupons") || "{}");
            savedCoupons[_activeTest.id] = {
                code: coupon.code,
                maxAttempts: coupon.maxAttempts || "unlimited",
                startDate: coupon.startDate || "",
                endDate: coupon.endDate || ""
            };
            localStorage.setItem("prayas_applied_coupons", JSON.stringify(savedCoupons));

            _hasActiveCouponGrant = coupon;
            
            const extraText = (coupon.maxAttempts === "unlimited" || !coupon.maxAttempts) ? "Unlimited" : coupon.maxAttempts;
            feedback.style.color = "green";
            feedback.innerHTML = 'Coupon "' + coupon.code + '" successfully applied! ' + extraText + ' attempts unlocked. <button onclick="handleRemoveCoupon()" style="background: #ef4444; color: white; border: none; padding: 4px 8px; border-radius: 6px; font-size: 10px; cursor: pointer; margin-left: 8px; font-weight: bold;">REMOVE</button>';
        }
        window.handleVerifyCouponSubmit = handleVerifyCouponSubmit;

        // Test Ignition & Locking checks
        async function handleBeginTestInitiation() {
            var overlay = document.getElementById("test-loading-overlay");
            if (overlay) {
                overlay.style.display = "flex";
                overlay.style.opacity = "1";
            }
            
            var hideOverlay = function() {
                if (overlay) {
                    overlay.style.opacity = "0";
                    setTimeout(function() {
                        overlay.style.display = "none";
                    }, 300);
                }
            };

            // Start a satisfying delay timer of 1000ms for a super high-quality spinner transition
            var delayPromise = new Promise(function(resolve) {
                setTimeout(resolve, 1000);
            });

            var testRootCat = _activeTest ? findRootCategoryForNode(_activeTest.id, 'test') : null;
            if (testRootCat && testRootCat.isPaid && !isCategoryUnlocked(testRootCat)) {
                if (_demoCategories[testRootCat.id] && _activeTest && isDemoFreeTest(_activeTest.id, testRootCat)) {
                    // Bypass for the free demo test!
                } else {
                    hideOverlay();
                    showCategoryPaymentScreen(testRootCat);
                    return;
                }
            }
            // If the test has no questions loaded in memory, fetch on demand when starting test!
            var qEnCount = (_activeTest && _activeTest.questionsEn) ? _activeTest.questionsEn.length : 0;
            var qHiCount = (_activeTest && _activeTest.questionsHi) ? _activeTest.questionsHi.length : 0;
            var qOtherCount = Object.values((_activeTest && _activeTest.questionsOther) || {}).reduce(function(sum, arr) { return sum + (arr ? arr.length : 0); }, 0);

            if (_activeTest && qEnCount === 0 && qHiCount === 0 && qOtherCount === 0) {
                
                // Show clean loading spinner / disable button of the instruction page
                var startButton = document.querySelector("#scr-instructions button.btn-fill-prime");
                var originalText = startButton ? startButton.innerHTML : "Start Exam";
                if (startButton) {
                    startButton.disabled = true;
                    startButton.innerHTML = '<i class="ph ph-spinner-gap" style="animation: db-spin 1s linear infinite; display: inline-block; margin-right: 8px;"></i> Loading Exam Questions...';
                }
                
                var examId = _activeTest.id;
                var fetchedQuestions = null;
                
                // 1. Try to load from IndexedDB questions cache
                try {
                    fetchedQuestions = await getCachedExamQuestions(examId);
                } catch(e) {
                    console.warn("Error reading exam questions cache", e);
                }
                
                if (fetchedQuestions) {
                    console.log("Exam questions loaded instantly from local cache!");
                    _activeTest.questionsEn = fetchedQuestions.questionsEn || [];
                    _activeTest.questionsHi = fetchedQuestions.questionsHi || [];
                    _activeTest.questionsOther = fetchedQuestions.questionsOther || {};
                } else {
                    var r2Url = _getRegistryPath("test_questions_" + examId + ".txt");
                    try {
                        console.log("Loading fresh exam questions package:", examId);
                        const res = await fetch(r2Url);
                        if (!res.ok) {
                            throw new Error("HTTP Status " + res.status);
                        }
                        const text = await res.text();
                        const decodedPayload = JSON.parse(decodeObfuscatedPayload(text.trim()));
                        
                        _activeTest.questionsEn = decodedPayload.questionsEn || [];
                        _activeTest.questionsHi = decodedPayload.questionsHi || [];
                        _activeTest.questionsOther = decodedPayload.questionsOther || {};
                        
                        saveExamQuestionsToCache(examId, {
                            questionsEn: _activeTest.questionsEn,
                            questionsHi: _activeTest.questionsHi,
                            questionsOther: _activeTest.questionsOther
                        });
                        
                        console.log("Exam questions loaded and cached successfully!");
                    } catch(err) {
                        console.error("Failed loading exam questions", err);
                        hideOverlay();
                        alert("⚠️ Connection Failed: Host/Network error downloading questions. Please check internet connection.");
                        if (startButton) {
                            startButton.disabled = false;
                            startButton.innerHTML = originalText;
                        }
                        return;
                    }
                }
                
                if (startButton) {
                    startButton.disabled = false;
                    startButton.innerHTML = originalText;
                }
            }
            
            // Verify access rules
            // 0. Premium Gated rules if the test or its category is marked Paid/Premium
            var isGatedByCat = false;
            var testRootCat = _activeTest ? findRootCategoryForNode(_activeTest.id, 'test') : null;
            if (testRootCat && testRootCat.isPaid && !isCategoryUnlocked(testRootCat)) {
                if (_demoCategories[testRootCat.id] && _activeTest && isDemoFreeTest(_activeTest.id, testRootCat)) {
                    isGatedByCat = false; // Bypass for free demo test!
                } else {
                    isGatedByCat = true;
                }
            }
            if ((_activeTest.isPaid || isGatedByCat) && !_hasActiveCouponGrant) {
                if (isGatedByCat) {
                    hideOverlay();
                    showCategoryPaymentScreen(testRootCat);
                    return;
                }
                if (!_studentLoggedInUser) {
                    hideOverlay();
                    showCustomAlert("Authentication Required", "This is a Paid / Premium Mock Test. Student authorization is required. Redirecting to portal.", function() {
                        handleTabNavigation('acc');
                    });
                    return;
                }
            }

            // 1. Specific User Emails restriction check
            if (_activeTest.onlyUsers && _activeTest.onlyUsers.trim() && !_hasActiveCouponGrant) {
                const allowedUsers = _activeTest.onlyUsers.split(/[\\n,]+/).map(s => s.trim().toLowerCase()).filter(s => s);
                if (allowedUsers.length > 0) {
                    if (!_studentLoggedInUser) {
                        hideOverlay();
                        alert("Secure examination. You must log-in to continue.");
                        handleTabNavigation('acc');
                        return;
                    }
                    const isAllowed = allowedUsers.includes(_studentLoggedInUser.emailOrMobile.toLowerCase());
                    if (!isAllowed) {
                        hideOverlay();
                        alert("Access Denied! Your student credentials are not approved for this premium exam. Contact Prayas One.");
                        return;
                    }
                }
            }

            // 2. Premium Locking Check via Attempt depletion
            // Coupon grants bypass
            const attemptCountKey = "attempts_test_" + _activeTest.id;
            let currentAttempts = parseInt(localStorage.getItem(attemptCountKey) || "0");

            if (!_studentLoggedInUser) { // If student is NOT fully logged-in, enforce standard strict limit gating
                const maximumFreeAttempts = _activeTest.freeAttempts || 1;
                
                // Check if active voucher is registered
                let activeAttemptsAllowed = maximumFreeAttempts;
                if (_hasActiveCouponGrant) {
                    if (_hasActiveCouponGrant.maxAttempts === 'unlimited') {
                        activeAttemptsAllowed = Infinity;
                    } else {
                        const count = parseInt(_hasActiveCouponGrant.maxAttempts);
                        if (!isNaN(count)) activeAttemptsAllowed += count;
                    }
                }

                if (currentAttempts >= activeAttemptsAllowed) {
                    // Block and push payment
                    hideOverlay();
                    showGeneralPremiumPaymentScreen();
                    return;
                }
            }

            // Setup questions pool based on translations
            _activeQuestions = [];
            
            const langMapping = {
                en: _activeTest.questionsEn || [],
                hi: _activeTest.questionsHi || [],
                ...(_activeTest.questionsOther || {})
            };

            // Get list of all languages that actually have questions!
            _availableLanguages = Object.keys(langMapping).filter(l => langMapping[l] && langMapping[l].length > 0);
            if (_availableLanguages.length === 0) {
                _availableLanguages = ['en'];
            }
            
            _currentLanguage = _availableLanguages[0] || 'en';

            let maxLen = 0;
            _availableLanguages.forEach(l => {
                if (langMapping[l].length > maxLen) {
                    maxLen = langMapping[l].length;
                }
            });

            for (let idx = 0; idx < maxLen; idx++) {
                const questionBag = {};
                _availableLanguages.forEach(l => {
                    questionBag[l] = langMapping[l][idx] || null;
                });
                
                let fallbackCorrect = 1;
                for (let l of _availableLanguages) {
                    if (questionBag[l] && questionBag[l].c) {
                        fallbackCorrect = questionBag[l].c;
                        break;
                    }
                }
                
                questionBag.originalCorrect = fallbackCorrect;
                _activeQuestions.push(questionBag);
            }

            // Render translation toggle action dynamically
            const translateBtn = document.getElementById("translateBtn");
            const label = document.getElementById("translateLabel");

            if (_availableLanguages.length > 1) {
                translateBtn.style.display = "flex";
                label.innerText = _currentLanguage.toUpperCase();
            } else {
                translateBtn.style.display = "none";
            }

            // Increment local registered attempts counter
            localStorage.setItem(attemptCountKey, (currentAttempts + 1).toString());

            // Increment public category attempts counter dynamically on test start
            if (_activeCategoryNodeForUrl) {
                var catId = _activeCategoryNodeForUrl.id;
                var catAttemptsKey = "_cat_attempts_" + catId;
                var currentCatAttempts = parseInt(localStorage.getItem(catAttemptsKey) || "0", 10);
                if (!currentCatAttempts) {
                    var defaultBase = 1100 + ((_activeCategoryNodeForUrl.name && _activeCategoryNodeForUrl.name.charCodeAt(0)) || 0) * 13 + ((catId && catId.charCodeAt(0)) || 0) * 7;
                    currentCatAttempts = defaultBase;
                }
                localStorage.setItem(catAttemptsKey, (currentCatAttempts + 1).toString());
            }

            // Bootstrap exam environment
            _testStateActiveNow = true;
            _testIsPaused = false;
            document.getElementById("testEngineName").innerText = _activeTest.title || "Examination Desk";
            _answersMap = {};
            _markedReviewMap = {};
            _revealedAnswersMap = {};
            _activeQIndex = 0;
            resetEngineAnswerToggle();

            // Wait for satisfying loader time so spinner spins beautifully
            await delayPromise;
            hideOverlay();

            // Launch timers
            document.getElementById("test-engine-panel").style.display = "flex";
            try { clearAllGoogleAds(); } catch(e) {}
            renderEngineQuestionItem();
            
            _timeRemainingSecs = (_activeTest.duration || 60) * 60;
            updateTestEngineTimerClockDisplay();

            if (_timeIntervalId) clearInterval(_timeIntervalId);
            _timeIntervalId = setInterval(() => {
                _timeRemainingSecs--;
                updateTestEngineTimerClockDisplay();

                if (_timeRemainingSecs <= 0) {
                    clearInterval(_timeIntervalId);
                    handleForceAutoSubmitTest();
                }
            }, 1000);
        }

        // Test Language Translation Toggle
        function handleToggleLanguage() {
            const idx = _availableLanguages.indexOf(_currentLanguage);
            const nextIdx = (idx + 1) % _availableLanguages.length;
            _currentLanguage = _availableLanguages[nextIdx];
            
            const label = document.getElementById("translateLabel");
            label.innerText = _currentLanguage.toUpperCase();
            renderEngineQuestionItem();
        }

        // Timer Clock Displays
        function updateTestEngineTimerClockDisplay() {
            const minutes = Math.floor(_timeRemainingSecs / 60);
            const seconds = _timeRemainingSecs % 60;
            const formatMin = minutes < 10 ? "0" + minutes : minutes;
            const formatSec = seconds < 10 ? "0" + seconds : seconds;
            document.getElementById("testTimerText").innerText = formatMin + ":" + formatSec;
        }

        // Rendering exam sheet items
        function renderEngineQuestionItem() {
            const container = document.getElementById("engineQsContent");
            container.innerHTML = "";

            const questionBlock = _activeQuestions[_activeQIndex];
            if (!questionBlock) return;

            // Pick standard translation node
            let qNode = questionBlock[_currentLanguage];
            if (!qNode) {
                for (let l of _availableLanguages) {
                    if (questionBlock[l]) {
                        qNode = questionBlock[l];
                        break;
                    }
                }
            }
            const fontClass = 'lang-' + _currentLanguage;

            if (!qNode) {
                container.innerHTML = "<p>Error rendering item structure.</p>";
                return;
            }

            const isMarkedReview = _markedReviewMap[_activeQIndex] === true;
            const reviewBtn = document.getElementById("btnMarkReview");
            if (isMarkedReview) {
                reviewBtn.classList.add("active");
                reviewBtn.innerHTML = '<i class="ph-fill ph-bookmark-simple"></i> BOOKMARKED';
            } else {
                reviewBtn.classList.remove("active");
                reviewBtn.innerHTML = '<i class="ph-bold ph-bookmark-simple"></i> MARK FOR REVIEW';
            }

            // Create Visual Q block
            let sourceText = questionBlock.source || qNode.source || "";
            if (!sourceText) {
                for (let l of _availableLanguages) {
                    if (questionBlock[l] && questionBlock[l].source) {
                        sourceText = questionBlock[l].source;
                        break;
                    }
                }
            }
            let sourceHtml = "";
            if (sourceText && !_hideSourceOnStudent) {
                sourceHtml = '<div style="margin: 8px 0 15px; padding: 8px 12px; background: #fffbeb; border-left: 4px solid #d97706; border-radius: 6px; font-size: 11px; font-weight: bold; color: #b45309;" class="engine-question-source">&#128214; <strong>Source / Reference:</strong> ' + sourceText + '</div>';
            }

            var isSaved = isQuestionSaved(_activeQIndex);
            var saveBtnHtml = '<button onclick="handleToggleSaveFromEngine(' + _activeQIndex + ')" style="background: none; border: none; color: ' + (isSaved ? '#22c55e' : '#FF6B35') + '; font-size: 11px; font-weight: bold; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; margin-right: 12px;">' +
                '<i class="' + (isSaved ? 'ph-fill ph-bookmark-simple' : 'ph-bold ph-bookmark-simple') + '" style="font-size: 14px;"></i> ' + (isSaved ? 'Saved' : 'Save') +
                '</button>';

            const card = document.createElement("div");
            card.className = fontClass;
            card.innerHTML = 
                '<div class="engine-question-num" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">' +
                '  <span>QUESTION ' + (_activeQIndex + 1) + ' OF ' + _activeQuestions.length + '</span>' +
                '  <div style="display: flex; align-items: center;">' +
                '    ' + saveBtnHtml +
                '    <button class="report-q-btn" onclick="handleReportActiveQuestionIssue()" style="background: none; border: none; color: #ef4444; font-size: 11px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 4px;">' +
                '      <i class="ph-bold ph-warning-circle" style="font-size: 14px;"></i> Report' +
                '    </button>' +
                '  </div>' +
                '</div>' +
                '<div class="engine-question-text">' + qNode.q + '</div>' +
                (qNode.image ? '<div class="engine-question-image-box" style="margin: 12px 0; text-align: center;"><img src="' + qNode.image + '" style="max-width: 100%; max-height: 280px; border-radius: 12px; border: 1.5px solid var(--border-color); box-shadow: 0 4px 15px rgba(0,0,0,0.05); object-fit: contain; background: white;" referrerPolicy="no-referrer"></div>' : '') +
                sourceHtml +
                '<div style="margin-top: 15px;" id="optionsRadioGroup"></div>';

            container.appendChild(card);

            // Populate options block with selection tracking
            const radioGroup = document.getElementById("optionsRadioGroup");
            const activeSel = _answersMap[_activeQIndex];

            qNode.o.forEach((optContent, idx) => {
                const optIdxVal = idx + 1;
                const isSelected = activeSel === optIdxVal;
                
                const btn = document.createElement("button");
                btn.className = "option-button" + (isSelected ? " selected" : "");
                
                if (_showEngineAnswer) {
                    const isCorrectOption = optIdxVal === questionBlock.originalCorrect;
                    btn.style.cursor = "default";
                    if (isCorrectOption) {
                        btn.style.borderColor = "#2ecc71";
                        btn.style.background = "rgba(46, 204, 113, 0.08)";
                        btn.innerHTML = 
                            '<div class="option-badge" style="background:#2ecc71; border-color:#2ecc71; color:white;">' + String.fromCharCode(65 + idx) + '</div>' +
                            '<span style="color:#27ae60; font-weight:bold;">' + optContent + '</span>' +
                            '<i class="ph-fill ph-check-circle" style="color:#2ecc71; font-size:16px; margin-left:auto;"></i>';
                    } else if (isSelected) {
                        btn.style.borderColor = "#ef4444";
                        btn.style.background = "rgba(239, 68, 68, 0.08)";
                        btn.innerHTML = 
                            '<div class="option-badge" style="background:#ef4444; border-color:#ef4444; color:white;">' + String.fromCharCode(65 + idx) + '</div>' +
                            '<span style="color:#c0392b; font-weight:bold;">' + optContent + '</span>' +
                            '<i class="ph-fill ph-x-circle" style="color:#ef4444; font-size:16px; margin-left:auto;"></i>';
                    } else {
                        btn.style.opacity = "0.55";
                        btn.innerHTML = 
                            '<div class="option-badge">' + String.fromCharCode(65 + idx) + '</div>' +
                            '<span>' + optContent + '</span>';
                    }
                } else {
                    btn.onclick = () => handleSelectOptionChoice(optIdxVal);
                    btn.innerHTML = 
                        '<div class="option-badge">' + String.fromCharCode(65 + idx) + '</div>' +
                        '<span>' + optContent + '</span>';
                }
                
                radioGroup.appendChild(btn);
            });

            // Append explanation if answer mode is toggled on
            if (_showEngineAnswer) {
                const explDiv = document.createElement("div");
                explDiv.className = "analysis-explanation-box";
                explDiv.style.marginTop = "15px";
                explDiv.style.padding = "16px";
                explDiv.style.borderRadius = "12px";
                explDiv.style.fontSize = "13.5px";
                explDiv.style.lineHeight = "1.5";
                
                let fontStyle = "";
                if (_currentLanguage === "hi") {
                    fontStyle = "font-family: 'Noto Sans Devanagari', 'Kruti Dev', sans-serif !important;";
                } else {
                    fontStyle = "font-family: inherit !important;";
                }
                explDiv.setAttribute("style", explDiv.getAttribute("style") + " " + fontStyle);

                const correctLetter = String.fromCharCode(65 + questionBlock.originalCorrect - 1);
                explDiv.innerHTML = 
                    '<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px; font-weight: 900; color: #2ecc71;">' +
                    '  <i class="ph-fill ph-check-circle" style="font-size: 18px; color: #2ecc71;"></i>' +
                    '  <span>CORRECT OPTION: ' + correctLetter + '</span>' +
                    '</div>' +
                    '<div>' +
                    '  <strong>Explanation / Solution:</strong>' +
                    '  <div style="margin-top: 6px; font-weight: 500;">' + (qNode.s || "No explanation provided for this question.") + '</div>' +
                    '</div>';
                
                card.appendChild(explDiv);
            }

            // Disabled states control
            document.getElementById("btnPrevQ").disabled = _activeQIndex === 0;
            document.getElementById("btnNextQ").disabled = _activeQIndex === _activeQuestions.length - 1;

            triggerMathJax();
        }

        // Generate pre-filled defect email with structured metadata
        function handleReportActiveQuestionIssue(index) {
            const targetIdx = (typeof index === 'number') ? index : _activeQIndex;
            window._activeQIndexReported = targetIdx;
            document.getElementById("reportComplaintTextArea").value = "";
            document.getElementById("reportQuestionModal").style.display = "flex";
        }

        function handleCloseReportModal() {
            document.getElementById("reportQuestionModal").style.display = "none";
        }

        function resetEngineAnswerToggle() {
            _showEngineAnswer = false;
            const btn = document.getElementById("btnToggleEngineAnswer");
            const icon = document.getElementById("engineAnswerIcon");
            if (btn) {
                btn.style.background = "";
                btn.style.borderColor = "";
                btn.style.color = "";
            }
            if (icon) {
                icon.className = "ph-bold ph-eye-slash";
            }
        }

        window.handleToggleEngineAnswer = function() {
            _showEngineAnswer = !_showEngineAnswer;
            const btn = document.getElementById("btnToggleEngineAnswer");
            const icon = document.getElementById("engineAnswerIcon");
            if (_showEngineAnswer) {
                _revealedAnswersMap[_activeQIndex] = true;
                if (btn) {
                    btn.style.background = "rgba(46, 204, 113, 0.15)";
                    btn.style.borderColor = "#2ecc71";
                    btn.style.color = "#2ecc71";
                }
                if (icon) {
                    icon.className = "ph-fill ph-eye";
                }
            } else {
                if (btn) {
                    btn.style.background = "";
                    btn.style.borderColor = "";
                    btn.style.color = "";
                }
                if (icon) {
                    icon.className = "ph-bold ph-eye-slash";
                }
            }
            renderEngineQuestionItem();
        };

        window.handleReportActiveQuestionIssue = handleReportActiveQuestionIssue;
        window.handleCloseReportModal = handleCloseReportModal;

        window.handleToggleRevealedAnswers = function(isOpen) {
            const overlay = document.getElementById("revealedDrawerOverlay");
            const drawer = document.getElementById("revealedAnswersDrawer");
            if (overlay && drawer) {
                if (isOpen) {
                    overlay.style.display = "block";
                    drawer.style.display = "flex";
                } else {
                    overlay.style.display = "none";
                    drawer.style.display = "none";
                }
            }
        };

        window.handleShowRevealedAnswersModal = function() {
            // Rebuild indices list
            _revealedSlideIndicesList = [];
            _activeQuestions.forEach((qBlock, idx) => {
                if (_revealedAnswersMap[idx]) {
                    _revealedSlideIndicesList.push(idx);
                }
            });

            _currentRevealedSlideIdx = 0;

            const viewport = document.getElementById("revealedSlidesViewport");
            if (viewport) {
                viewport.innerHTML = "";

                if (_revealedSlideIndicesList.length === 0) {
                    // Render Empty State Slide
                    const emptyCard = document.createElement("div");
                    emptyCard.className = "revealed-slide-card";
                    emptyCard.id = "revealedSlideCard_0";
                    emptyCard.style.flex = "0 0 100%";
                    emptyCard.style.boxSizing = "border-box";
                    emptyCard.style.scrollSnapAlign = "start";
                    emptyCard.style.padding = "40px 20px";
                    emptyCard.style.textAlign = "center";
                    emptyCard.style.display = "flex";
                    emptyCard.style.flexDirection = "column";
                    emptyCard.style.alignItems = "center";
                    emptyCard.style.justifyContent = "center";
                    emptyCard.style.gap = "15px";
                    emptyCard.style.color = "var(--grey-text)";
                    
                    emptyCard.innerHTML = 
                        '<i class="ph-bold ph-eye" style="font-size: 48px; color: var(--grey-text); opacity: 0.5;"></i>' +
                        '<h4 style="margin: 0; font-weight: 800; color: var(--dark);">No Answers Revealed Yet</h4>' +
                        '<p style="margin: 0; font-size: 12px; line-height: 1.5; max-width: 250px; opacity: 0.8; font-family: inherit;">' +
                        '    During the practice test, you can tap the <strong>Eye Icon</strong> near the top to reveal answers and explanations instantly.' +
                        '</p>';
                    viewport.appendChild(emptyCard);
                    
                    // Hide indicator/nav if 0 items
                    document.getElementById("btnSlideRevealedPrev").style.display = "none";
                    document.getElementById("btnSlideRevealedNext").style.display = "none";
                    document.getElementById("revealedSlideIndicatorText").innerText = "Practice Assist";
                } else {
                    // Show indicator/nav
                    document.getElementById("btnSlideRevealedPrev").style.display = "flex";
                    document.getElementById("btnSlideRevealedNext").style.display = "flex";
                    
                    // Build slide card for each revealed question
                    _revealedSlideIndicesList.forEach((qIdx, slideIdx) => {
                        const questionBlock = _activeQuestions[qIdx];
                        const qNode = _currentLanguage === "hi" ? (questionBlock.hi || questionBlock.en) : (questionBlock.en || questionBlock.hi);
                        
                        const slideCard = document.createElement("div");
                        slideCard.className = "revealed-slide-card";
                        slideCard.id = "revealedSlideCard_" + slideIdx;
                        slideCard.style.flex = "0 0 100%";
                        slideCard.style.boxSizing = "border-box";
                        slideCard.style.scrollSnapAlign = "start";
                        slideCard.style.overflowY = "auto";
                        slideCard.style.padding = "4px";
                        slideCard.style.height = "100%";
                        
                        let fontStyle = "";
                        if (_currentLanguage === 'hi') {
                            fontStyle = "font-family: 'Noto Sans Devanagari', 'Kruti Dev', sans-serif !important;";
                        } else {
                            fontStyle = "font-family: inherit !important;";
                        }

                        // Options html
                        let optionsHtml = "";
                        const optionsList = qNode.o || [];
                        optionsList.forEach((optContent, optIdx) => {
                            const optIdxVal = optIdx + 1;
                            const isSelected = _answersMap[qIdx] === optIdxVal;
                            const isCorrect = optIdxVal === qNode.c;
                            
                            let optClasses = "analysis-opt-box";
                            if (isCorrect) {
                                optClasses += " correct";
                            } else if (isSelected) {
                                optClasses += " wrong";
                            }
                            
                            const optionLetter = String.fromCharCode(65 + optIdx);
                            optionsHtml += 
                                '<div class="' + optClasses + '" style="font-weight: 500; display: flex; align-items: center; gap: 8px; padding: 12px 14px; margin-bottom: 8px; border-radius: 10px;">' +
                                '    <div style="flex-grow: 1; display: flex; align-items: center; gap: 6px;">' +
                                '        ' + optionLetter + ') ' + optContent +
                                '    </div>' +
                                '</div>';
                        });

                        const correctLetter = String.fromCharCode(65 + qNode.c - 1);
                        slideCard.innerHTML = 
                            '<div class="lang-' + _currentLanguage + '" style="' + fontStyle + '">' +
                            '    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">' +
                            '        <span style="font-weight: 900; font-size: 12px; color: var(--grey-text); text-transform: uppercase;">Question ' + (qIdx + 1) + '</span>' +
                            '        <span style="background: rgba(16, 185, 129, 0.12); color: #10b981; font-weight: 800; font-size: 10px; padding: 2px 8px; border-radius: 6px;">Correct Option: ' + correctLetter + '</span>' +
                            '    </div>' +
                            '    ' +
                            '    <div class="analysis-question-box" style="font-size: 14px; font-weight: bold; line-height: 1.5; color: var(--dark); margin-bottom: 15px; margin-top: 5px;">' +
                            '        <strong>Q:</strong> ' + qNode.q +
                            '    </div>' +
                            '    ' +
                            (qNode.image ? '<div style="text-align: center; margin-bottom: 15px;"><img src="' + qNode.image + '" style="max-width: 100%; max-height: 180px; border-radius: 10px; border: 1px solid var(--border-color); object-fit: contain; background: white;" referrerPolicy="no-referrer"></div>' : '') +
                            '    ' +
                            '    <div style="margin-bottom: 15px;">' + optionsHtml + '</div>' +
                            '    ' +
                            '    <div class="analysis-explanation-box" style="padding: 14px; border-radius: 12px; font-size: 13px; line-height: 1.5; margin-top: 15px;">' +
                            '        <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 900; color: inherit;">' +
                            '            <i class="ph-fill ph-check-circle" style="font-size: 16px; color: inherit;"></i>' +
                            '            <span>EXPLANATION / SOLUTION</span>' +
                            '        </div>' +
                            '        <div style="font-weight: 500;">' + (qNode.s || 'No explanation provided for this question.') + '</div>' +
                            '    </div>' +
                            '</div>';
                        viewport.appendChild(slideCard);
                    });

                    // Setup swipe scroll listener to sync indicator dynamically
                    viewport.onscroll = () => {
                        const width = viewport.clientWidth;
                        if (width > 0) {
                            const scrollLeft = viewport.scrollLeft;
                            const index = Math.round(scrollLeft / width);
                            if (index >= 0 && index < _revealedSlideIndicesList.length && index !== _currentRevealedSlideIdx) {
                                _currentRevealedSlideIdx = index;
                                
                                const btnPrev = document.getElementById("btnSlideRevealedPrev");
                                const btnNext = document.getElementById("btnSlideRevealedNext");
                                if (btnPrev) btnPrev.disabled = _currentRevealedSlideIdx === 0;
                                if (btnNext) btnNext.disabled = _currentRevealedSlideIdx === _revealedSlideIndicesList.length - 1;
                                
                                const indicator = document.getElementById("revealedSlideIndicatorText");
                                if (indicator) {
                                    indicator.innerText = 'Question ' + (_currentRevealedSlideIdx + 1) + ' of ' + _revealedSlideIndicesList.length;
                                }
                            }
                        }
                    };
                }
            }

            // Open the sheet
            window.handleToggleRevealedAnswers(true);
            updateRevealedSlidesPositionAndUI();
        };

        window.handleSlideRevealedPrev = function() {
            if (_currentRevealedSlideIdx > 0 && _revealedSlideIndicesList.length > 0) {
                _currentRevealedSlideIdx--;
                updateRevealedSlidesPositionAndUI();
            }
        };

        window.handleSlideRevealedNext = function() {
            if (_currentRevealedSlideIdx < _revealedSlideIndicesList.length - 1 && _revealedSlideIndicesList.length > 0) {
                _currentRevealedSlideIdx++;
                updateRevealedSlidesPositionAndUI();
            }
        };

        function updateRevealedSlidesPositionAndUI() {
            const viewport = document.getElementById("revealedSlidesViewport");
            if (!viewport || _revealedSlideIndicesList.length === 0) return;
            
            const btnPrev = document.getElementById("btnSlideRevealedPrev");
            const btnNext = document.getElementById("btnSlideRevealedNext");
            if (btnPrev) btnPrev.disabled = _currentRevealedSlideIdx === 0;
            if (btnNext) btnNext.disabled = _currentRevealedSlideIdx === _revealedSlideIndicesList.length - 1;
            
            const indicator = document.getElementById("revealedSlideIndicatorText");
            if (indicator) {
                indicator.innerText = 'Question ' + (_currentRevealedSlideIdx + 1) + ' of ' + _revealedSlideIndicesList.length;
            }
            
            const card = document.getElementById("revealedSlideCard_" + _currentRevealedSlideIdx);
            if (card) {
                viewport.scrollTo({
                    left: card.offsetLeft,
                    behavior: 'smooth'
                });
            }
        }

        window.toggleOptionAnalysis = function(qIndex, optIndex) {
            const elId = 'oa-box-' + qIndex + '-' + optIndex;
            const arrowId = 'oa-arrow-' + qIndex + '-' + optIndex;
            const box = document.getElementById(elId);
            const arrow = document.getElementById(arrowId);
            if (box) {
                if (box.style.display === 'none' || !box.style.display) {
                    box.style.display = 'block';
                    if (arrow) arrow.style.transform = 'rotate(180deg)';
                } else {
                    box.style.display = 'none';
                    if (arrow) arrow.style.transform = 'rotate(0deg)';
                }
            }
        };

        // Handle direct MCQ selections
        function handleSelectOptionChoice(optIndexVal) {
            const currentSelVal = _answersMap[_activeQIndex];
            
            // Toggle selection logic: if selected again, deselect option
            if (currentSelVal === optIndexVal) {
                _answersMap[_activeQIndex] = null;
            } else {
                _answersMap[_activeQIndex] = optIndexVal;
            }
            renderEngineQuestionItem();
        }

        // Palette Toggle Drawer Controllers
        function handleTogglePalette(isOpened) {
            const sheet = document.getElementById("paletteDrawerContainer");
            const overlay = document.getElementById("paletteDrawerOverlay");

            if (isOpened) {
                renderPaletteGridCells();
                sheet.style.display = "flex";
                overlay.style.display = "block";
            } else {
                sheet.style.display = "none";
                overlay.style.display = "none";
            }
        }

        function renderPaletteGridCells() {
            const target = document.getElementById("paletteGridContent");
            target.innerHTML = "";

            _activeQuestions.forEach((_, idx) => {
                const isSaved = _answersMap[idx] !== undefined && _answersMap[idx] !== null;
                const isMarked = _markedReviewMap[idx] === true;

                let cellClass = "not-visited";
                if (isSaved) cellClass = "answered";
                else if (isMarked) cellClass = "review-marked";

                const btn = document.createElement("button");
                btn.className = "palette-cell " + cellClass;
                btn.innerText = (idx + 1).toString();
                btn.onclick = () => {
                    _activeQIndex = idx;
                    resetEngineAnswerToggle();
                    handleTogglePalette(false);
                    renderEngineQuestionItem();
                };

                target.appendChild(btn);
            });
        }

        // Review markers and index shifting
        function handleToggleMarkReview() {
            _markedReviewMap[_activeQIndex] = !_markedReviewMap[_activeQIndex];
            renderEngineQuestionItem();
        }

        function handleNextQuestion() {
            if (_activeQIndex < _activeQuestions.length - 1) {
                _activeQIndex++;
                resetEngineAnswerToggle();
                renderEngineQuestionItem();
            }
        }

        function handlePrevQuestion() {
            if (_activeQIndex > 0) {
                _activeQIndex--;
                resetEngineAnswerToggle();
                renderEngineQuestionItem();
            }
        }

        // Submission score computations
        function handleForceAutoSubmitTest() {
            _isAutoSubmitting = true;
            finalizeSubmissionAndShowAnalysis();
            showCustomAlert("Time Expired", "Times Up! Your mock examination paper has been automatically submitted.", function() {
                _isAutoSubmitting = false;
            });
        }

        function handlePromptSubmitTest() {
            const answeredCount = Object.values(_answersMap).filter(val => val !== null && val !== undefined).length;
            const confirmMsg = "Are you absolutely confident about submitting your assessment? \\u2714\\n\\nAnswered: " + answeredCount + " of " + _activeQuestions.length + " questions.";
            
            showCustomConfirm("Submit Assessment", confirmMsg, function() {
                finalizeSubmissionAndShowAnalysis();
            });
        }

        function finalizeSubmissionAndShowAnalysis() {
            _testStateActiveNow = false;
            _testIsPaused = false;
            if (_timeIntervalId) clearInterval(_timeIntervalId);
            document.getElementById("test-engine-panel").style.display = "none";

            // Score evaluation
            let correctCount = 0;
            let incorrectCount = 0;
            let unansweredCount = 0;
            let revealedCount = 0;

            _activeQuestions.forEach((qBlock, idx) => {
                if (_revealedAnswersMap[idx]) {
                    revealedCount++;
                }
                const selectAns = _answersMap[idx];
                if (selectAns === undefined || selectAns === null) {
                    unansweredCount++;
                } else if (selectAns === qBlock.originalCorrect) {
                    correctCount++;
                } else {
                    incorrectCount++;
                }
            });

            const positiveMarks = _activeTest.posMarks || 1;
            const negativeMarks = _activeTest.negMarks || 0;
            const calculatedTotalScoreValue = (correctCount * positiveMarks) - (incorrectCount * negativeMarks);

            // Display scorecard stats values
            document.getElementById("statCorrectCountText").innerText = correctCount;
            document.getElementById("statIncorrectCountText").innerText = incorrectCount;
            document.getElementById("statUnansweredCountText").innerText = unansweredCount;
            document.getElementById("statTotalItemsText").innerText = _activeQuestions.length;
            document.getElementById("statTotalScoreCalcText").innerText = calculatedTotalScoreValue.toFixed(2);

            const revealedEl = document.getElementById("statRevealedAnswersCount");
            if (revealedEl) {
                revealedEl.innerText = revealedCount;
            }

            const totalScorePossibleValue = _activeQuestions.length * positiveMarks;
            document.getElementById("statTotalPossibleMarks").innerText = "/ " + totalScorePossibleValue.toFixed(2);

            const accuracyVal = _activeQuestions.length > 0 ? Math.round((correctCount / _activeQuestions.length) * 100) : 0;
            document.getElementById("statAccuracyPercent").innerText = accuracyVal + "%";

            const totalSecsTaken = (_activeTest.duration * 60) - _timeRemainingSecs;
            const durationMinutesText = Math.floor(totalSecsTaken / 60) + "m " + (totalSecsTaken % 60) + "s";
            document.getElementById("statDurationSpent").innerText = durationMinutesText;

            const resultsTopicHeaderEl = document.getElementById("resultsTopicHeader");
            if (resultsTopicHeaderEl) {
                resultsTopicHeaderEl.innerText = _activeTest.title || "MOCK ASSESSMENT";
            }

            // Populate Results Question inline horizontal scrollable palette
            const resGrid = document.getElementById("analysisQuestionSelectorRow");
            if (resGrid) {
                resGrid.innerHTML = "";

                _activeQuestions.forEach((qBlock, idx) => {
                    const selectAns = _answersMap[idx];
                    const btn = document.createElement("button");
                    
                    let btnColorLabel = "#808080"; // Grey unvisited standard
                    let btnTextColor = "#ffffff";

                    if (selectAns === undefined || selectAns === null) {
                        btnColorLabel = "#a4b0be";
                    } else if (selectAns === qBlock.originalCorrect) {
                        btnColorLabel = "var(--green)";
                    } else {
                        btnColorLabel = "var(--primary)";
                    }

                    btn.className = "palette-cell";
                    btn.style.backgroundColor = btnColorLabel;
                    btn.style.color = btnTextColor;
                    btn.style.borderColor = btnColorLabel;
                    btn.style.width = "40px";
                    btn.style.height = "40px";
                    btn.style.borderRadius = "10px";
                    btn.style.flexShrink = "0";
                    btn.style.fontFamily = "'Sahitya', serif";
                    btn.innerText = (idx + 1).toString();
                    btn.onclick = () => handleOpenDetailedAnalysisItem(idx);

                    resGrid.appendChild(btn);
                });

                // Auto view first question analysis
                if (_activeQuestions.length > 0) {
                    handleOpenDetailedAnalysisItem(0);
                }
            }

            // Live Leaderboards & Analytics submissions (Features 21 & 26)
            let candidateName = "";
            if (_studentLoggedInUser) {
                candidateName = _studentLoggedInUser.name || _studentLoggedInUser.emailOrMobile || "Logged-in Aspirant";
            } else {
                const storedName = localStorage.getItem("_last_aspirant_name");
                if (storedName && storedName.trim()) {
                    candidateName = storedName.trim();
                } else {
                    if (typeof _isAutoSubmitting !== 'undefined' && _isAutoSubmitting) {
                        candidateName = "Aspirant " + Math.floor(100 + Math.random() * 900);
                        localStorage.setItem("_last_aspirant_name", candidateName);
                    } else {
                        try {
                            const promptVal = prompt("Enter your Name to show on the Leaderboard (Optional):", "Aspirant " + Math.floor(100 + Math.random() * 900));
                            candidateName = (promptVal && promptVal.trim()) ? promptVal.trim() : ("Aspirant " + Math.floor(100 + Math.random() * 900));
                            localStorage.setItem("_last_aspirant_name", candidateName);
                        } catch(e) {
                            candidateName = "Guest Aspirant";
                        }
                    }
                }
            }

            const attemptCountKey = "attempts_test_" + _activeTest.id;
            const currentAttempts = parseInt(localStorage.getItem(attemptCountKey) || "1");

            const activeRecord = {
                studentName: candidateName,
                score: calculatedTotalScoreValue,
                obtainedMarks: calculatedTotalScoreValue,
                totalMarksPossible: totalScorePossibleValue,
                attemptNum: currentAttempts,
                correct: correctCount,
                incorrect: incorrectCount,
                duration: durationMinutesText,
                date: new Date().toISOString().split("T")[0],
                timeTaken: totalSecsTaken
            };

            // 1. Submit attempt to current test leaderboard
            fetch(getApiUrl("/api/leaderboard"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    testId: _activeTest.id,
                    activeRecord: activeRecord
                })
            })
            .then(r => r.json())
            .then(ldata => {
                if (ldata.success) {
                    renderTestLeaderboardTable(ldata.leaderboard);
                } else {
                    // Fallback to fetch existing leaderboard
                    fetch(getApiUrl("/api/leaderboard/" + _activeTest.id))
                    .then(res => res.json())
                    .then(ld => renderTestLeaderboardTable(ld))
                    .catch(e => console.error(e));
                }
            })
            .catch(err => {
                console.error("Leaderboard submission error", err);
                fetch(getApiUrl("/api/leaderboard/" + _activeTest.id))
                .then(r => r.json())
                .then(ldata => {
                    renderTestLeaderboardTable(ldata);
                })
                .catch(err2 => console.error("Leaderboard fallback query error", err2));
            });

            // 2. Register attempt specs in global student analytics profile
            if (_studentLoggedInUser) {
                fetch(getApiUrl("/api/analytics/submit"), {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: _studentLoggedInUser.emailOrMobile,
                        obtainedScore: calculatedTotalScoreValue,
                        totalScore: totalScorePossibleValue,
                        timeTakenSecs: totalSecsTaken
                    })
                })
                .catch(err => console.error("Student analytics logging error", err));
            }

            const leadBlock = document.getElementById("resultsLeaderboardBlock");
            if (leadBlock) {
                leadBlock.style.display = "block";
            }
            navigateToScreen("scr-results", "Analyses Hub");
        }

        function renderTestLeaderboardTable(rows) {
            const tbody = document.getElementById("leaderboardTBodyContent");
            if (!tbody) return;
            tbody.innerHTML = "";

            let rowList = [];
            if (Array.isArray(rows)) {
                rowList = rows;
            } else if (rows && Array.isArray(rows.leaderboard)) {
                rowList = rows.leaderboard;
            } else if (rows && Array.isArray(rows.rows)) {
                rowList = rows.rows;
            }

            if (!rowList || rowList.length === 0) {
                tbody.innerHTML = "<tr><td colspan='5' style='padding: 18px; text-align: center; color: var(--grey-text);'>Be the first to submit a mock test attempt!</td></tr>";
                return;
            }

            const loggedInName = _studentLoggedInUser ? (_studentLoggedInUser.name || _studentLoggedInUser.emailOrMobile || "") : "";
            const lastSubmittedName = localStorage.getItem("_last_aspirant_name") || "";

            // Find best attempt index
            let myRowIndex = -1;
            rowList.forEach((row, idx) => {
                const name = (row.studentName || "").toLowerCase();
                const matchesLoggedIn = loggedInName && name === loggedInName.toLowerCase();
                const matchesLastSub = lastSubmittedName && name === lastSubmittedName.toLowerCase();
                if ((matchesLoggedIn || matchesLastSub) && myRowIndex === -1) {
                    myRowIndex = idx;
                }
            });

            // Create or update a celebration Standing Alert Badge at the top of results
            let alertBar = document.getElementById("leaderboardRankAlertBar");
            if (!alertBar) {
                alertBar = document.createElement("div");
                alertBar.id = "leaderboardRankAlertBar";
                // Insert it right above the first panel in results screen
                const leaderboardBlock = document.getElementById("resultsLeaderboardBlock");
                if (leaderboardBlock) {
                    leaderboardBlock.insertBefore(alertBar, leaderboardBlock.firstChild);
                }
            }

            if (myRowIndex !== -1) {
                const rank = myRowIndex + 1;
                let prize = "&#127942;";
                if (rank === 1) prize = "&#129351;";
                else if (rank === 2) prize = "&#129352;";
                else if (rank === 3) prize = "&#129353;";

                alertBar.className = "you-rank-alert";
                alertBar.style.cssText = "background: #fef3c7; border: 1.5px solid #f59e0b; padding: 14px; border-radius: 12px; margin-bottom: 16px; font-weight: 800; color: #b45309; text-align: center; font-size: 14px; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 12px rgba(245,158,11,0.15); display: flex !important;";
                alertBar.innerHTML = "<span>" + prize + "</span> Your Standing: <strong>Rank #" + rank + "</strong> out of " + rowList.length + " Candidates!";
            } else {
                alertBar.style.display = "none";
            }

            rowList.forEach((row, idx) => {
                const rank = idx + 1;
                let rankLabel = rank.toString();
                if (rank === 1) rankLabel = "&#129351; 1";
                else if (rank === 2) rankLabel = "&#129352; 2";
                else if (rank === 3) rankLabel = "&#129353; 3";

                const obMarks = parseFloat(row.obtainedMarks !== undefined ? row.obtainedMarks : row.score || 0).toFixed(2);
                const totPossible = parseFloat(row.totalMarksPossible || row.totalScore || 0).toFixed(2);
                const attemptLabel = "Attempt " + (row.attemptNum || 1);

                const name = (row.studentName || "").toLowerCase();
                const isYou = (loggedInName && name === loggedInName.toLowerCase()) || 
                              (lastSubmittedName && name === lastSubmittedName.toLowerCase());

                const tr = document.createElement("tr");
                tr.style.borderBottom = "1px solid var(--border-color)";
                
                if (isYou) {
                    tr.style.backgroundColor = "rgba(245, 158, 11, 0.12)";
                    tr.style.fontWeight = "bold";
                    tr.style.borderLeft = "4px solid #f59e0b";
                }

                const youBadge = isYou ? " <span style='background:#f59e0b; color:#ffffff; font-size:9.5px; padding:2px 6px; border-radius:8px; margin-left:6px; font-weight:bold;'>YOU</span>" : "";

                tr.innerHTML = "<td style='padding: 12px 14px; font-weight: bold; color: var(--dark);'>" + rankLabel + "</td>" +
                    "<td style='padding: 12px 14px; font-weight: 600;'>" + row.studentName + youBadge + "</td>" +
                    "<td style='padding: 12px 14px; text-align: center; font-weight: bold; color: #22c55e;'>" + obMarks + " <span style='font-size:10px; color:var(--grey-text); font-weight:normal;'>/ " + totPossible + "</span></td>" +
                    "<td style='padding: 12px 14px; text-align: center; font-weight: bold; color: var(--grey-text); font-size: 11.5px;'>" + attemptLabel + "</td>" +
                    "<td style='padding: 12px 14px; text-align: right; font-family: monospace; color: var(--grey-text); font-size: 11.5px;'>" + (row.duration || "N/A") + "</td>";
                tbody.appendChild(tr);
            });
        }

        // Open detailed explanation analysis popups
        function handleOpenDetailedAnalysisItem_old(index) {
            const modal = document.getElementById("itemDetailedAnalysisModal");
            const scrollArea = document.getElementById("itemAnalysisScrollViewArea");
            document.getElementById("analysisItemIndexHeader").innerText = "Question " + (index + 1);

            scrollArea.innerHTML = "";
            const qBlock = _activeQuestions[index];
            if (!qBlock) return;

            // Match translations if available
            const excludeKeys = ['originalCorrect', 'source', 'id'];
            const blockEl = document.createElement("div");
            blockEl.innerHTML = "";

            Object.keys(qBlock).forEach(langKey => {
                const excludeKeys = ['originalCorrect', 'source', 'id'];
                if (excludeKeys.indexOf(langKey) !== -1 || !qBlock[langKey]) return;
                
                const qNode = qBlock[langKey];
                if (typeof qNode !== 'object' || !qNode || !Array.isArray(qNode.o)) return;

                const isHi = langKey === 'hi';
                const fontName = "'Sahitya', serif";

                const optSelectionsHtml = qNode.o.map((oVal, idx) => {
                    const optIdx = idx + 1;
                    const isCorrect = optIdx === qNode.c;
                    const isSelected = _answersMap[index] === optIdx;

                    let classes = "analysis-opt-box";
                    if (isCorrect) {
                        classes += " correct";
                    } else if (isSelected) {
                        classes += " wrong";
                    }

                    let style = "font-weight:bold; font-family: " + fontName + " !important;";

                    const hasOptionAnalysis = qNode.oa && qNode.oa[idx] && qNode.oa[idx].trim().length > 0;
                    let arrowHtml = "";
                    let analysisBoxHtml = "";
                    let extraProps = 'style="' + style + ' display:flex; align-items:center; justify-content:space-between; width:100%;"';

                    if (hasOptionAnalysis) {
                        const optAnalysisText = qNode.oa[idx].trim();
                        arrowHtml = '<div style="color:inherit; padding:4px 8px; display:inline-flex; align-items:center; justify-content:center; margin-left:auto;">' +
                            '<i id="oa-arrow-' + index + '-' + idx + '" class="ph-bold ph-caret-down" style="transition: transform 0.25s ease; font-size:16px;"></i>' +
                            '</div>';

                        let boxClasses = "option-analysis-expandable-box";
                        if (isCorrect) {
                            boxClasses += " oa-box-correct";
                        } else if (isSelected) {
                            boxClasses += " oa-box-wrong";
                        } else {
                            if (idx === 0) boxClasses += " oa-box-a";
                            else if (idx === 1) boxClasses += " oa-box-b";
                            else if (idx === 2) boxClasses += " oa-box-c";
                            else if (idx === 3) boxClasses += " oa-box-d";
                            else boxClasses += " oa-box-e";
                        }

                        let boxLabel = "Option Analysis";
                        if (isCorrect) boxLabel = "Correct Option Analysis";
                        else if (isSelected) boxLabel = "Selected Option Analysis";

                        analysisBoxHtml = '<div id="oa-box-' + index + '-' + idx + '" class="' + boxClasses + '" style="display:none;">' +
                            '<div style="font-size:10px; font-weight:bold; text-transform:uppercase; margin-bottom:4px; opacity:0.8; letter-spacing:0.5px;">' + boxLabel + '</div>' +
                            '<div>' + optAnalysisText + '</div>' +
                            '</div>';

                        extraProps = 'onclick="toggleOptionAnalysis(' + index + ', ' + idx + ')" style="' + style + ' display:flex; align-items:center; justify-content:space-between; width:100%; cursor:pointer;"';
                    }

                    return '<div style="margin-bottom:8px;">' +
                        '<div class="' + classes + '" ' + extraProps + '>' + 
                        '<div style="flex-grow:1; display:flex; align-items:center; gap:4px;">' + String.fromCharCode(65 + idx) + ') ' + oVal + '</div>' +
                        arrowHtml +
                        '</div>' +
                        analysisBoxHtml +
                        '</div>';
                }).join('');

                const isStandardEn = langKey === 'en';
                const isStandardHi = langKey === 'hi';
                const langTitle = isStandardEn ? 'ENGLISH VERSION' : (isStandardHi ? 'HINDI VERSION (हिंदी)' : \`\${langKey.toUpperCase()} VERSION\`);

                const finalExpFont = getFontForText(qNode.s, fontName);
                blockEl.innerHTML += \`
                    <div class="lang-\${langKey}" style="border-bottom:1px dashed var(--border-color); padding-bottom:15px; margin-bottom:15px; font-family: \${fontName} !important;">
                        <span style="font-size:10px; font-weight:bold; color:var(--primary); font-family: \${fontName} !important;">\${langTitle}</span>
                        <div class="analysis-question-box" style="font-family: \${fontName} !important;"><strong>Q:</strong> \${qNode.q}</div>
                        \${qNode.image ? '<div style="text-align:center; padding:10px 0;"><img src="' + qNode.image + '" style="max-width:100%; max-height:240px; border-radius:10px; border:1px solid var(--border-color); background:white;" referrerPolicy="no-referrer"></div>' : ''}
                        \${optSelectionsHtml}
                        \${qNode.s ? '<div class="analysis-explanation-box" style="font-family: ' + finalExpFont + ' !important;"><strong>Explanation / Solution (Ex):</strong> ' + qNode.s + '</div>' : ''}
                    </div>
                \`;
            });

            // Extract source reference attributes
            let sourceText = qBlock.source || "";
            if (!sourceText) {
                // look in any of the language nodes
                for (let l of Object.keys(qBlock)) {
                    if (excludeKeys.indexOf(l) === -1 && qBlock[l] && qBlock[l].source) {
                        sourceText = qBlock[l].source;
                        break;
                    }
                }
            }
            const _hideSourceOnStudent = ${!!config.social.hideSourceOnStudent};
            if (sourceText && !_hideSourceOnStudent) {
                const srcEl = document.createElement("div");
                srcEl.style.marginTop = "15px";
                srcEl.style.padding = "8px 12px";
                srcEl.style.background = "#fffbeb";
                srcEl.style.borderLeft = "4px solid #d97706";
                srcEl.style.borderRadius = "4px";
                srcEl.style.fontSize = "11px";
                srcEl.style.fontWeight = "bold";
                srcEl.style.color = "#b45309";
                srcEl.innerHTML = "<strong>&#128214; Question Source / References:</strong> " + sourceText;
                blockEl.appendChild(srcEl);
            }

            scrollArea.appendChild(blockEl);
            modal.style.display = "flex";
            triggerMathJax();
        }

        function handleCloseAnalysisModal_old() {
            document.getElementById("itemDetailedAnalysisModal").style.display = "none";
        }

        function updateDynamicDashboardGreeting() {
            const greetTitleEl = document.getElementById("displayGreetText");
            const greetSubEl = document.getElementById("displayGreetSubtitle");
            if (!greetTitleEl || !greetSubEl) return;

            const headerAccountIconEl = document.getElementById("headerAccountIcon");

            if (_studentLoggedInUser) {
                // Dynamic premium greet details
                greetTitleEl.innerText = "Hi " + _studentLoggedInUser.name + "!";
                
                // Calculate active unlocks
                var unlockedCount = (_studentLoggedInUser.unlockedCategoryIds || []).length;
                if (unlockedCount > 0) {
                    greetSubEl.innerText = "Premium Active | " + unlockedCount + " Category Unlock" + (unlockedCount > 1 ? "s" : "");
                } else {
                    greetSubEl.innerText = "Free Account | Explore Mock Tests";
                }

                // Dynamic icon and visual style update when logged in
                if (headerAccountIconEl) {
                    headerAccountIconEl.className = "ph ph-user-check";
                    headerAccountIconEl.style.color = "var(--primary)";
                }
            } else {
                // Fallback to defaults
                greetTitleEl.innerText = DB.studentGreeting || "Hi, Aspirant!";
                greetSubEl.innerText = DB.studentSubGreeting || "PRAYAS ONE PROFESSIONAL HUB";

                // Restore default user icon when logged out
                if (headerAccountIconEl) {
                    headerAccountIconEl.className = "ph ph-user";
                    headerAccountIconEl.style.color = "";
                }
            }
        }

        // Student Account Gateway Authorization
        function loadStudentAnalyticsDashboard() {
            if (!_studentLoggedInUser) return;
            const email = _studentLoggedInUser.emailOrMobile;
            const name = _studentLoggedInUser.name;

            // Fetch overall analytics summary
            fetch(getApiUrl("/api/admin/analytics"))
                .then(r => r.json())
                .then(analytics => {
                    const studentProfile = analytics[email] || {
                        totalTestsAttempted: 0,
                        bestScore: 0,
                        averageScore: 0,
                        totalTimeSpent: 0
                    };

                    document.getElementById("panelTotalAttempts").innerText = studentProfile.totalTestsAttempted + " Tests";
                    document.getElementById("panelHighestScore").innerText = parseFloat(studentProfile.bestScore || 0).toFixed(2);
                    document.getElementById("panelAverageScore").innerText = parseFloat(studentProfile.averageScore || 0).toFixed(2) + "%";
                    
                    const rawHours = (studentProfile.totalTimeSpent || 0) / 3600;
                    const totalHrsSpent = rawHours.toFixed(1);
                    const totalHrsSpentStr = totalHrsSpent.endsWith(".0") ? rawHours.toFixed(0) : totalHrsSpent;
                    document.getElementById("panelTotalStudyTime").innerText = totalHrsSpentStr + "h Spent";
                })
                .catch(err => console.error("Error loading user profile analytics", err));

            // Fetch previous completed examination attempts (Feature 26 Integration)
            fetch(getApiUrl("/api/student/attempts/" + encodeURIComponent(name)))
                .then(r => r.json())
                .then(ldata => {
                    const tbody = document.getElementById("personalAttemptsListBody");
                    if (!tbody) return;
                    tbody.innerHTML = "";

                    if (!ldata.attempts || ldata.attempts.length === 0) {
                        tbody.innerHTML = "<tr><td colspan='3' style='padding: 20px; text-align: center; color: var(--grey-text);'>No assessments recorded yet. Start practicing!</td></tr>";
                        return;
                    }

                    // Sort attempts newest-first
                    const sorted = ldata.attempts.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                    sorted.forEach(attempt => {
                        const tr = document.createElement("tr");
                        tr.style.borderBottom = "1px solid var(--border-color)";
                        tr.innerHTML = "<td style='padding: 10px 12px; font-weight: 600;'>" +
                            "<div style='color: var(--dark);'>" + (attempt.quizTitle || "Mock Test") + "</div>" +
                            "<div style='font-size: 9.5px; color: var(--grey-text); margin-top: 2px;'>" + (attempt.date || "") + "</div>" +
                            "</td>" +
                            "<td style='padding: 10px 12px; text-align: center; font-weight: bold; color: #22c55e;'>" + parseFloat(attempt.score).toFixed(2) + "</td>" +
                            "<td style='padding: 10px 12px; text-align: right; color: var(--grey-text); font-size: 11px;'>" + (attempt.duration || "N/A") + "</td>";
                        tbody.appendChild(tr);
                    });
                })
                .catch(err => console.error("Error loading historical attempts", err));
        }

        function refreshStudentAccountProfileGate() {
            const studentAuthFormPanel = document.getElementById("studentAuthFormPanel");
            const studentAuthenticatedProfileArea = document.getElementById("studentAuthenticatedProfileArea");

            if (_studentLoggedInUser) {
                studentAuthFormPanel.style.display = "none";
                studentAuthenticatedProfileArea.style.display = "block";
                document.getElementById("studentUserHeaderName").innerText = _studentLoggedInUser.name;
                document.getElementById("studentUserHeaderMail").innerText = _studentLoggedInUser.emailOrMobile;
                buildSecurityAntiLeakOverlay(_studentLoggedInUser.emailOrMobile);
                
                // List unlocked categories dynamically (Feature 25)
                var unlockedIds = _studentLoggedInUser.unlockedCategoryIds || [];
                var categoryNames = [];
                var allExpired = true;
                var hasAnyExpiry = false;
                
                var allCats = (DB.testCategories || []).concat(DB.pdfCategories || []);
                unlockedIds.forEach(function(id) {
                    var found = allCats.find(function(c) { return c.id === id; });
                    if (found) {
                        var expLabel = "Lifetime";
                        var isCurrentExpired = false;
                        var catExpiry = null;
                        var isCatLifetime = false;
                        var hasSpecific = false;
                        if (_studentLoggedInUser.categoryDates && _studentLoggedInUser.categoryDates[id]) {
                            var catData = _studentLoggedInUser.categoryDates[id];
                            if (catData.isLifetime) {
                                isCatLifetime = true;
                                hasSpecific = true;
                            } else if (catData.expiryDate && catData.expiryDate.trim() !== "") {
                                catExpiry = catData.expiryDate;
                                hasSpecific = true;
                            }
                        }
                        if (!hasSpecific) {
                            if (_studentLoggedInUser.expiryDate && _studentLoggedInUser.expiryDate.trim() !== "") {
                                catExpiry = _studentLoggedInUser.expiryDate;
                            } else {
                                isCatLifetime = true;
                            }
                        }
                        
                        if (isCatLifetime) {
                            expLabel = "Lifetime";
                            allExpired = false;
                        } else if (catExpiry) {
                            hasAnyExpiry = true;
                            var exp = new Date(catExpiry);
                            var diffMs = exp.getTime() - Date.now();
                            var diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
                            if (diffDays > 0) {
                                expLabel = diffDays + " Days";
                                allExpired = false;
                            } else {
                                expLabel = "Expired";
                                isCurrentExpired = true;
                            }
                        } else {
                            expLabel = "Lifetime";
                            allExpired = false;
                        }
                        
                        var exists = categoryNames.some(function(item) { return item.id === found.id; });
                        if (!exists) {
                            categoryNames.push({
                                id: found.id,
                                name: found.name,
                                expiry: expLabel,
                                expired: isCurrentExpired
                            });
                        }
                    }
                });

                if (categoryNames.length > 0) {
                    var remainingHtml = '<span style="color: #2ecc71; font-weight: 800;">Activated</span>';
                    if (hasAnyExpiry && allExpired) {
                        remainingHtml = '<span style="color: #ef4444; font-weight: 800;">Expired</span>';
                    }
                    document.getElementById("profileRemainingDays").innerHTML = remainingHtml;
                    
                    var listHtml = '<div style="display: flex; flex-direction: column; gap: 8px; margin-top: 10px; width: 100%; box-sizing: border-box;">';
                    categoryNames.forEach(function(item) {
                        var isExpired = item.expired;
                        var isLifetime = item.expiry === "Lifetime";
                        var iconColor = isExpired ? '#ef4444' : (isLifetime ? '#9b59b6' : '#2ecc71');
                        var badgeBg = isExpired ? 'rgba(239, 68, 68, 0.05)' : (isLifetime ? 'rgba(155, 89, 182, 0.06)' : 'rgba(46, 204, 113, 0.06)');
                        var badgeBorder = isExpired ? '1px solid rgba(239, 68, 68, 0.15)' : (isLifetime ? '1px solid rgba(155, 89, 182, 0.15)' : '1px solid rgba(46, 204, 113, 0.15)');
                        var iconClass = isExpired ? 'ph-bold ph-x-circle' : (isLifetime ? 'ph-fill ph-sparkle' : 'ph-fill ph-check-circle');
                        
                        var badgeHtml = '';
                        var cardBlink = '';
                        
                        if (isExpired) {
                            badgeHtml = '<span style="font-size: 9px; font-weight: 900; text-transform: uppercase; padding: 2.5px 6.5px; background: rgba(255, 255, 255, 0.25); border-radius: 6px; flex-shrink: 0; border: 1px solid rgba(0,0,0,0.03); color: ' + iconColor + ';">Expired</span>';
                        } else if (isLifetime) {
                            cardBlink = 'animation: premiumBlink 1.5s infinite ease-in-out;';
                            badgeHtml = '<span style="font-size: 9px; font-weight: 900; text-transform: uppercase; padding: 2.5px 6.5px; background: rgba(255, 255, 255, 0.25); border-radius: 6px; flex-shrink: 0; border: 1px solid rgba(0,0,0,0.03); color: ' + iconColor + ';">Lifetime</span>';
                        } else {
                            // Rotating alternating text badge in a beautiful stable pill container
                            badgeHtml = '<span style="display: inline-block; position: relative; height: 18px; width: 75px; overflow: hidden; vertical-align: middle; flex-shrink: 0; background: rgba(255, 255, 255, 0.25); border-radius: 6px; border: 1px solid rgba(0,0,0,0.03); box-sizing: border-box;">' +
                                        '  <span style="position: absolute; left: 0; right: 0; top: 0; height: 16px; line-height: 16px; font-size: 9px; font-weight: 900; text-transform: uppercase; text-align: center; color: ' + iconColor + '; animation: badgeAltTextFade1 3s infinite; white-space: nowrap;">Active</span>' +
                                        '  <span style="position: absolute; left: 0; right: 0; top: 0; height: 16px; line-height: 16px; font-size: 9px; font-weight: 900; text-transform: uppercase; text-align: center; color: ' + iconColor + '; animation: badgeAltTextFade2 3s infinite; white-space: nowrap;">' + item.expiry + '</span>' +
                                        '</span>';
                        }
                        
                        listHtml += '  <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; background: ' + badgeBg + '; padding: 8.5px 12px; border-radius: 12px; border: ' + badgeBorder + '; width: 100%; box-sizing: border-box; ' + cardBlink + '">' +
                                    '    <div style="display: flex; align-items: center; gap: 8px; min-width: 0; flex: 1;">' +
                                    '      <i class="' + iconClass + '" style="color: ' + iconColor + '; font-size: 14px; flex-shrink: 0;"></i>' +
                                    '      <span style="font-size: 12px; font-weight: 850; letter-spacing: -0.1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0;">' + item.name + '</span>' +
                                    '    </div>' +
                                    badgeHtml +
                                    '  </div>';
                    });
                    listHtml += '</div>';
                    
                    document.getElementById("profileExpiryDate").innerHTML = listHtml;
                } else {
                    document.getElementById("profileRemainingDays").innerText = "No Category Unlocks";
                    document.getElementById("profileExpiryDate").innerHTML = 
                        '<div style="display: flex; align-items: center; gap: 8px; background: rgba(0,0,0,0.02); padding: 10px 12px; border-radius: 12px; border: 1.5px dashed var(--border-color); margin-top: 10px; width: 100%; box-sizing: border-box;">' +
                        '  <i class="ph-bold ph-lock-key" style="color: var(--grey-text); font-size: 14px; flex-shrink: 0;"></i>' +
                        '  <span style="font-size: 12px; font-weight: 800; color: var(--grey-text);">Explore Free Mock Tests</span>' +
                        '</div>';
                }

                loadStudentAnalyticsDashboard();
            } else {
                studentAuthFormPanel.style.display = "block";
                studentAuthenticatedProfileArea.style.display = "none";
                buildSecurityAntiLeakOverlay("aspirant_guest");
            }
            updateDynamicDashboardGreeting();
        }

        function checkConcurrentUserSession() {
            if (!_studentLoggedInUser || !_studentLoggedInUser.id) return;
            var userIdVal = _studentLoggedInUser.id;
            var tokenVal = _studentLoggedInUser.sessionToken || "";

            fetch(getApiUrl("/api/premium/verify"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: userIdVal, sessionToken: tokenVal })
            })
            .then(function(r) { return r.json(); })
            .then(function(resData) {
                if (resData.success) {
                    if (resData.status === "logged_out" || !resData.active) {
                        localStorage.removeItem("_secured_active_aspirant");
                        _studentLoggedInUser = null;
                        refreshStudentAccountProfileGate();
                        showCustomAlert(
                            "Session Terminated", 
                            "This account has been logged in from another device or window. Only one concurrent session is permitted per aspirant.", 
                            function() {
                                handleTabNavigation('home');
                            }
                        );
                    }
                }
            })
            .catch(function(err) {
                console.warn("Session check offline fallback:", err);
            });
        }
        window.checkConcurrentUserSession = checkConcurrentUserSession;

        function showStudentLoginDetailsPopup(user, onOk) {
            if (!user) {
                if (typeof onOk === "function") onOk();
                return;
            }
            
            var categoryNames = [];
            var allCats = (DB.testCategories || []).concat(DB.pdfCategories || []);
            var unlockedIds = user.unlockedCategoryIds || [];
            
            unlockedIds.forEach(function(id) {
                var found = allCats.find(function(c) { return c.id === id; });
                if (found) {
                    var expLabel = "Lifetime";
                    var isCurrentExpired = false;
                    var catExpiry = null;
                    var isCatLifetime = false;
                    var hasSpecific = false;
                    if (user.categoryDates && user.categoryDates[id]) {
                        var catData = user.categoryDates[id];
                        if (catData.isLifetime) {
                            isCatLifetime = true;
                            hasSpecific = true;
                        } else if (catData.expiryDate && catData.expiryDate.trim() !== "") {
                            catExpiry = catData.expiryDate;
                            hasSpecific = true;
                        }
                    }
                    if (!hasSpecific) {
                        if (user.expiryDate && user.expiryDate.trim() !== "") {
                            catExpiry = user.expiryDate;
                        } else {
                            isCatLifetime = true;
                        }
                    }
                    
                    if (isCatLifetime) {
                        expLabel = "Lifetime Access";
                    } else if (catExpiry) {
                        var exp = new Date(catExpiry);
                        var diffMs = exp.getTime() - Date.now();
                        var diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
                        if (diffDays > 0) {
                            expLabel = diffDays + " Days Left";
                        } else {
                            expLabel = "Expired";
                            isCurrentExpired = true;
                        }
                    } else {
                        expLabel = "Lifetime Access";
                    }
                    
                    var exists = categoryNames.some(function(item) { return item.id === found.id; });
                    if (!exists) {
                        categoryNames.push({
                            id: found.id,
                            name: found.name,
                            expiry: expLabel,
                            expired: isCurrentExpired
                        });
                    }
                }
            });
            
            var html = '';
            if (categoryNames.length === 0) {
                html += '<div style="padding: 15px 10px; text-align: center; font-family: Sahitya, serif;">' +
                        '  <i class="ph-bold ph-lock-keyhole" style="font-size: 32px; color: #94a3b8; margin-bottom: 8px; display: block;"></i>' +
                        '  <div style="font-size: 13.5px; color: #64748b; font-weight: 700;">No premium packages unlocked yet.</div>' +
                        '</div>';
            } else {
                html += '<div style="text-align: left; font-family: Sahitya, serif;">' +
                        '  <div style="font-size: 12.5px; color: #64748b; margin-bottom: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px;">Activated Packages:</div>' +
                        '  <div style="display: flex; flex-direction: column; gap: 10px; max-height: 220px; overflow-y: auto; padding-right: 2px;">';
                
                categoryNames.forEach(function(item) {
                    var isExp = item.expired;
                    var bg = isExp ? 'rgba(239,68,68,0.03)' : 'rgba(34,197,94,0.03)';
                    var border = isExp ? 'rgba(239,68,68,0.12)' : 'rgba(34,197,94,0.12)';
                    var pillBg = isExp ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)';
                    var pillColor = isExp ? '#ef4444' : '#22c55e';
                    var icon = isExp ? 'ph-x-circle' : 'ph-check-circle';
                    
                    html += '    <div style="background: ' + bg + '; border: 1.5px solid ' + border + '; border-radius: 14px; padding: 12px; display: flex; align-items: center; justify-content: space-between; gap: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.01);">' +
                            '      <div style="display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0;">' +
                            '        <i class="ph-fill ' + icon + '" style="font-size: 18px; color: ' + pillColor + '; flex-shrink: 0;"></i>' +
                            '        <span style="font-weight: 750; font-size: 13.5px; color: var(--dark); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block;">' + item.name + '</span>' +
                            '      </div>' +
                            '      <span style="background: ' + pillBg + '; color: ' + pillColor + '; font-size: 10px; font-weight: 850; padding: 3.5px 8px; border-radius: 8px; white-space: nowrap; text-transform: uppercase; letter-spacing: 0.2px;">' + item.expiry + '</span>' +
                            '    </div>';
                });
                
                html += '  </div>' +
                        '</div>';
            }
            
            showCustomAlert("Activated Packages", html, onOk);
        }

        async function handleStudentAuthenticationProcess() {
            const credMailInput = document.getElementById("inputStudentCredMail");
            const credPassInput = document.getElementById("inputStudentCredPass");

            const credMail = credMailInput ? credMailInput.value.trim().toLowerCase() : "";
            const credPass = credPassInput ? credPassInput.value.trim() : "";

            if (!credMail || !credPass) {
                showCustomAlert("Authentication Warning", "Provide valid account login keys.");
                return;
            }

            // Always sync/fetch latest students database first
            try {
                await _fetchStudentsDatabase();
            } catch (e) {}

            var studentsList = DB.students || [];
            if (studentsList.length === 0) {
                var cachedDbStr = localStorage.getItem("_cached_students_db");
                if (cachedDbStr) {
                    try {
                        studentsList = JSON.parse(cachedDbStr);
                        DB.students = studentsList;
                    } catch (e) {}
                }
            }

            // Check student credentials against loaded student database
            var matchedStudent = studentsList.find(function(s) {
                if (!s) return false;

                // Password check
                var sPass = (s.password || s.pass || s.pwd || "").toString().trim();
                if (sPass !== credPass) return false;

                // Identifier check (Email, Phone, Mobile, Roll No, Student ID, Name)
                var inputUser = credMail.toLowerCase();
                var emailOrMobile = (s.emailOrMobile || "").toString().trim().toLowerCase();
                var email = (s.email || "").toString().trim().toLowerCase();
                var phone = (s.phoneNo || s.phone || s.mobile || "").toString().trim().toLowerCase();
                var roll = (s.rollNumber || s.rollNo || s.roll || "").toString().trim().toLowerCase();
                var id = (s.id || s.studentId || "").toString().trim().toLowerCase();
                var name = (s.name || "").toString().trim().toLowerCase();

                return (
                    emailOrMobile === inputUser ||
                    email === inputUser ||
                    phone === inputUser ||
                    roll === inputUser ||
                    id === inputUser ||
                    name === inputUser
                );
            });

            if (matchedStudent) {
                _studentLoggedInUser = matchedStudent;
                localStorage.setItem("_secured_active_aspirant", JSON.stringify(matchedStudent));
                refreshStudentAccountProfileGate();
                try { syncSavedQuestionsWithCloud("pull"); } catch (e) {}
                showCustomAlert("Login Success", "Welcome back! " + (_studentLoggedInUser.name || "Aspirant") + " logged in successfully.", function() {
                    showStudentLoginDetailsPopup(_studentLoggedInUser, function() {
                        handleTabNavigation('home');
                    });
                });
                return;
            }

            // Fallback: Attempt online server API verification if local database didn't match
            try {
                const res = await fetch(getApiUrl("/api/auth/login"), {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ emailOrMobile: credMail, password: credPass })
                });

                if (res.ok) {
                    const contentType = res.headers.get("content-type") || "";
                    if (contentType.includes("application/json")) {
                        const resData = await res.json();
                        if (resData.success && resData.user) {
                            _studentLoggedInUser = resData.user;
                            localStorage.setItem("_secured_active_aspirant", JSON.stringify(resData.user));
                            refreshStudentAccountProfileGate();
                            try { syncSavedQuestionsWithCloud("pull"); } catch (e) {}
                            showCustomAlert("Login Success", "Welcome back! " + (_studentLoggedInUser.name || "Aspirant") + " logged in successfully.", function() {
                                showStudentLoginDetailsPopup(_studentLoggedInUser, function() {
                                    handleTabNavigation('home');
                                });
                            });
                            return;
                        }
                    }
                }
            } catch (err) {
                console.warn("Online auth API check skipped:", err);
            }

            showCustomAlert("Access Denied", "Invalid student credentials key pair. Try again or notify Prayas One operator.");
        }

        function handleStudentSignOutProcess() {
            localStorage.removeItem("_secured_active_aspirant");
            _studentLoggedInUser = null;
            refreshStudentAccountProfileGate();
            showCustomAlert("Logout Successful", "You have signed out successfully.", function() {
                handleTabNavigation('home');
            });
        }

        // Shared Telegram screenshot link
        function handleTelegramPaymentScreenshotSubmit() {
            const utrInput = document.getElementById("txnUtrRefNumberInput").value.trim() || "N/A";

            const telegramUrlBase = "${config.social.telegram}";
            const formattedMessage = encodeURIComponent(
                "PRAYAS ONE REGISTRATION LICENSE PAYMENT CHECKED\\n" +
                "UTR TRANSACTION REF: " + utrInput + "\\n" +
                "Email or Mobile user: " + (_studentLoggedInUser ? _studentLoggedInUser.emailOrMobile : "Anonymous Aspirant")
            );

            // Direct forward screenshot on telegram link
            const urlToOpen = telegramUrlBase + "?text=" + formattedMessage;
            window.open(urlToOpen, '_blank');
        }

        let _uploadedScreenshotBase64 = "";

        function handlePayScreenshotChange(inputEl) {
            if (inputEl.files && inputEl.files[0]) {
                const file = inputEl.files[0];
                const reader = new FileReader();
                reader.onload = function(e) {
                    const resultStr = e?.target?.result ? String(e.target.result) : "";
                    _uploadedScreenshotBase64 = resultStr;
                    
                    // Show preview thumbnail beautifully
                    var previewImg = document.getElementById("paySSPreview");
                    var previewContainer = document.getElementById("paySSPreviewContainer");
                    var defaultContainer = document.getElementById("paySSDefaultContainer");
                    if (previewImg && previewContainer && defaultContainer) {
                        previewImg.src = resultStr;
                        defaultContainer.style.display = "none";
                        previewContainer.style.display = "flex";
                    }
                    
                    var labelEl = document.getElementById("paySSLabel");
                    if (labelEl) {
                        labelEl.innerText = file.name + " (" + Math.round(file.size / 1024) + " KB)";
                    }
                };
                reader.readAsDataURL(file);
            }
        }

        function startCooldown(buttonId, storageKey, cooldownDurationMs) {
            localStorage.setItem(storageKey, Date.now() + cooldownDurationMs);
            updateCooldownUI(buttonId, storageKey);
        }

        function updateCooldownUI(buttonId, storageKey) {
            const btn = document.getElementById(buttonId);
            if (!btn) return;

            const expiry = parseInt(localStorage.getItem(storageKey) || "0", 10);
            const now = Date.now();

            if (expiry && expiry > now) {
                const diff = expiry - now;
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                const pad = function(num) { return String(num).padStart(2, '0'); };
                const timeStr = pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);

                btn.disabled = true;
                btn.style.cursor = "not-allowed";
                btn.style.opacity = "0.85";
                btn.style.background = "#1e293b"; // Dark elegant slate background
                btn.style.color = "#f8fafc";
                btn.style.boxShadow = "none";
                btn.style.whiteSpace = "nowrap";
                btn.style.fontSize = "11.5px";
                btn.style.padding = "0 8px";
                btn.style.fontFamily = "'Sahitya', serif";
                btn.style.fontWeight = "700";
                btn.style.letterSpacing = "0.5px";
                
                if (buttonId === "btnSendPaymentEmail") {
                    btn.innerHTML = '<i class="ph-bold ph-timer" style="font-size: 15px;"></i> Wait: ' + timeStr;
                } else if (buttonId === "btnSendReportEmail") {
                    btn.innerHTML = '<i class="ph ph-clock" style="font-size: 14px;"></i> Wait: ' + timeStr;
                }
            } else {
                btn.disabled = false;
                btn.style.cursor = "pointer";
                btn.style.opacity = "1";
                btn.style.background = "var(--primary)";
                btn.style.color = "";
                btn.style.boxShadow = buttonId === "btnSendPaymentEmail" ? "0 4px 15px rgba(255, 107, 53, 0.2)" : "none";
                btn.style.whiteSpace = "";
                btn.style.fontSize = "12px";
                btn.style.padding = buttonId === "btnSendPaymentEmail" ? "" : "12px 20px";
                btn.style.fontFamily = "inherit";
                btn.style.fontWeight = buttonId === "btnSendPaymentEmail" ? "800" : "inherit";
                btn.style.letterSpacing = "";

                if (buttonId === "btnSendPaymentEmail") {
                    btn.innerHTML = '<i class="ph-bold ph-envelope" style="font-size: 17px;"></i> SEND EMAIL';
                } else if (buttonId === "btnSendReportEmail") {
                    btn.innerHTML = '<i class="ph ph-paper-plane"></i> Send Report Email';
                }
            }
        }

        function getPaymentCooldownStorageKey() {
            if (_activeCategoryForPayment && _activeCategoryForPayment.id) {
                return "payment_email_cooldown_expiry_cat_" + _activeCategoryForPayment.id;
            }
            return "payment_email_cooldown_expiry_general";
        }

        function initEmailCooldowns() {
            setInterval(function() {
                updateCooldownUI("btnSendPaymentEmail", getPaymentCooldownStorageKey());
                updateCooldownUI("btnSendReportEmail", "report_email_cooldown_expiry");
            }, 1000);

            updateCooldownUI("btnSendPaymentEmail", getPaymentCooldownStorageKey());
            updateCooldownUI("btnSendReportEmail", "report_email_cooldown_expiry");
        }

        function handleSendPaymentDetailsEmail() {
            const currentKey = getPaymentCooldownStorageKey();
            const expiry = parseInt(localStorage.getItem(currentKey) || "0", 10);
            if (expiry && expiry > Date.now()) {
                showCustomAlert("Cooldown Active", "Please wait for the cooling period to end before sending another activation request.");
                return;
            }

            const name = document.getElementById("payFormName").value.trim();
            const email = document.getElementById("payFormEmail").value.trim();
            const phone = document.getElementById("payFormPhone").value.trim();
            const utr = document.getElementById("payFormUTR").value.trim();

            if (!name || !email || !phone) {
                showCustomAlert("Details Required", "Please fill in Name, Email and Phone details before acquiring premium access.");
                return;
            }

            var categoryDetails = "Full Access / General Subscription";
            if (_activeCategoryForPayment) {
                categoryDetails = _activeCategoryForPayment.name;
            }

            const subject = "Premium Access Activation Request";
            const body = 
                "Hi Admin, 👋\\n\\n" +
                "I've successfully completed my premium payment. Please verify it and activate my access.\\n\\n" +
                "Registration Details:\\n" +
                "👤 Name: **" + name + "**\\n" +
                "📧 Email: **" + email + "**\\n" +
                "📱 Phone: **" + phone + "**\\n" +
                "📚 Category: **" + categoryDetails + "**\\n" +
                "💳 UTR / UPI ID: **" + (utr || "Not Provided") + "**\\n\\n" +
                "Looking forward to your confirmation. 🚀\\n\\n" +
                "Note: I understand that payment verification may take up to 24 hours, and my login credentials will be sent to my registered email after successful verification.\\n\\n" +
                "Thanks! ❤️\\n" +
                "Guddu";

            window.location.href = "mailto:prayasone@rediffmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
            startCooldown("btnSendPaymentEmail", currentKey, 7200000);
        }

        function handleSendReportEmail() {
            const expiry = parseInt(localStorage.getItem("report_email_cooldown_expiry") || "0", 10);
            if (expiry && expiry > Date.now()) {
                alert("Please wait for the cooling period to end before sending another report.");
                return;
            }

            const complaint = document.getElementById("reportComplaintTextArea").value.trim();
            if (!complaint) {
                alert("Please describe the issue or discrepancy before sending.");
                return;
            }

            const targetIdx = (typeof window._activeQIndexReported === 'number') ? window._activeQIndexReported : _activeQIndex;
            const questionBlock = _activeQuestions[targetIdx];
            if (!questionBlock) return;
            let qNode = questionBlock[_currentLanguage];
            if (!qNode) {
                for (let l of _availableLanguages) {
                    if (questionBlock[l]) {
                        qNode = questionBlock[l];
                        break;
                    }
                }
            }
            if (!qNode) return;

            const categoryName = _activeCategoryName || "N/A";
            const subCategoryName = _activeSubCategoryName || "N/A";
            const topicName = _activeTopicName || "N/A";
            const qNum = targetIdx + 1;
            const qText = qNode.q || "";
            const qOpts = (qNode.o || []).map((o, idx) => String.fromCharCode(65 + idx) + ") " + o).join("\\n");
            
            const subject = "PRAYAS ONE QUESTION DISCREPANCY REPORT: " + (_activeTest ? _activeTest.title : "Mock Test");
            const body = 
                "--- ASPECT DISCREPANCY COMPLAINT ---\\n\\n" +
                "Operator/Aspirant Report:\\n" + complaint + "\\n\\n" +
                "--- QUESTION REFERENCE ---\\n" +
                "Category: " + categoryName + "\\n" +
                "Sub-Category: " + subCategoryName + "\\n" +
                "Topic: " + topicName + "\\n" +
                "Question Index: " + qNum + "\\n\\n" +
                "Text:\\n" + qText + "\\n\\n" +
                "Options:\\n" + qOpts + "\\n";

            window.location.href = "mailto:prayasone@rediffmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
            startCooldown("btnSendReportEmail", "report_email_cooldown_expiry", 7200000);
            handleCloseReportModal();
        }

        function handleTriggerRefreshReboot() {
            handleTabNavigation('home');
        }

        // Open detailed inline explanation analysis
        function handleOpenDetailedAnalysisItem(index) {
            const detailCard = document.getElementById("analysisDetailViewerCard");
            if (!detailCard) return;

            // Highlight horizontal selector button
            const rowSelector = document.getElementById("analysisQuestionSelectorRow");
            if (rowSelector) {
                const buttons = rowSelector.querySelectorAll("button");
                buttons.forEach((btn, idx) => {
                    if (idx === index) {
                        btn.style.outline = "3px solid var(--primary)";
                        btn.style.outlineOffset = "1.5px";
                        try {
                            btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                        } catch (e) {}
                    } else {
                        btn.style.outline = "none";
                    }
                });
            }

            const qBlock = _activeQuestions[index];
            if (!qBlock) return;

            // Pick standard translation node matching currently active language
            let qNode = qBlock[_currentLanguage];
            if (!qNode) {
                for (let l of _availableLanguages) {
                    if (qBlock[l]) {
                        qNode = qBlock[l];
                        break;
                    }
                }
            }

            if (!qNode) {
                detailCard.innerHTML = "<p>Error loading item structure.</p>";
                return;
            }

            const isHi = _currentLanguage === 'hi';
            const fontName = "'Sahitya', serif";
            const fontStyle = "font-family: " + fontName + " !important;";

            const qFontName = getFontForText(qNode.q, fontName);
            const qFontStyle = "font-family: " + qFontName + " !important;";

            const optSelectionsHtml = qNode.o.map((oVal, idx) => {
                const optIdx = idx + 1;
                const isCorrect = optIdx === qNode.c;
                const isSelected = _answersMap[index] === optIdx;

                const oFontName = getFontForText(oVal, fontName);
                const oFontStyle = "font-family: " + oFontName + " !important;";

                let classes = "analysis-opt-box";
                if (isCorrect) {
                     classes += " correct";
                } else if (isSelected) {
                     classes += " wrong";
                }

                let style = "font-weight:bold; " + oFontStyle;

                const hasOptionAnalysis = qNode.oa && qNode.oa[idx] && qNode.oa[idx].trim().length > 0;
                let arrowHtml = "";
                let analysisBoxHtml = "";
                let extraProps = 'style="' + style + ' display:flex; align-items:center; justify-content:space-between; width:100%;"';

                if (hasOptionAnalysis) {
                    const optAnalysisText = qNode.oa[idx].trim();
                    arrowHtml = '<div style="color:inherit; padding:4px 8px; display:inline-flex; align-items:center; justify-content:center; margin-left:auto;">' +
                        '<i id="oa-arrow-' + index + '-' + idx + '" class="ph-bold ph-caret-down" style="transition: transform 0.25s ease; font-size:16px;"></i>' +
                        '</div>';

                    let boxClasses = "option-analysis-expandable-box";
                    if (isCorrect) {
                        boxClasses += " oa-box-correct";
                    } else if (isSelected) {
                        boxClasses += " oa-box-wrong";
                    } else {
                        if (idx === 0) boxClasses += " oa-box-a";
                        else if (idx === 1) boxClasses += " oa-box-b";
                        else if (idx === 2) boxClasses += " oa-box-c";
                        else if (idx === 3) boxClasses += " oa-box-d";
                        else boxClasses += " oa-box-e";
                    }

                    let boxLabel = "Option Analysis";
                    if (isCorrect) boxLabel = "Correct Option Analysis";
                    else if (isSelected) boxLabel = "Selected Option Analysis";

                    analysisBoxHtml = '<div id="oa-box-' + index + '-' + idx + '" class="' + boxClasses + '" style="display:none;">' +
                        '<div style="font-size:10px; font-weight:bold; text-transform:uppercase; margin-bottom:4px; opacity:0.8; letter-spacing:0.5px;">' + boxLabel + '</div>' +
                        '<div>' + optAnalysisText + '</div>' +
                        '</div>';

                    extraProps = 'onclick="toggleOptionAnalysis(' + index + ', ' + idx + ')" style="' + style + ' display:flex; align-items:center; justify-content:space-between; width:100%; cursor:pointer;"';
                }

                return '<div style="margin-bottom:8px;">' +
                    '<div class="' + classes + '" ' + extraProps + '>' + 
                    '<div style="flex-grow:1; display:flex; align-items:center; gap:4px;">' + String.fromCharCode(65 + idx) + ') ' + oVal + '</div>' +
                    arrowHtml +
                    '</div>' +
                    analysisBoxHtml +
                    '</div>';
            }).join('');

            const _hideSourceOnStudent = ${!!config.social.hideSourceOnStudent};
            let sourceText = qBlock.source || qNode.source || "";
            let sourceHtml = "";
            
            const srcFontName = getFontForText(sourceText, fontName);
            const srcFontStyle = "font-family: " + srcFontName + " !important;";
            
            if (sourceText && !_hideSourceOnStudent) {
                sourceHtml = '<div style="margin-top: 15px; padding: 10px 12px; background: #fffbeb; border-left: 4px solid #d97706; border-radius: 6px; font-size: 11px; font-weight: bold; color: #b45309; ' + srcFontStyle + '">' +
                    '&#128214; <strong>Source / Reference:</strong> ' + sourceText +
                    '</div>';
            }

            const expFontName = getFontForText(qNode.s, fontName);
            const expFontStyle = "font-family: " + expFontName + " !important;";

            var analysisIsSaved = isQuestionSaved(index);
            var analysisSaveBtnHtml = '<button onclick="handleToggleSaveFromAnalysis(' + index + ')" style="background: none; border: none; color: ' + (analysisIsSaved ? '#22c55e' : '#FF6B35') + '; font-size: 11px; font-weight: bold; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;">' +
                '<i class="' + (analysisIsSaved ? 'ph-fill ph-bookmark-simple' : 'ph-bold ph-bookmark-simple') + '" style="font-size: 14px;"></i> ' + (analysisIsSaved ? 'Saved' : 'Save') +
                '</button>';

            var analysisReportBtnHtml = '<button onclick="handleReportActiveQuestionIssue(' + index + ')" style="background: none; border: none; color: #ef4444; font-size: 11px; font-weight: bold; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;">' +
                '<i class="ph-bold ph-warning-circle" style="font-size: 14px;"></i> Report' +
                '</button>';

            const prevDisabled = index === 0;
            const nextDisabled = index === _activeQuestions.length - 1;

            const navigationHtml = 
                '<div style="display: flex; justify-content: space-between; align-items: center; margin-top: 25px; padding-top: 18px; border-top: 1.5px solid var(--border-color); gap: 12px;">' +
                '  <button class="analysis-nav-btn" ' + (prevDisabled ? 'disabled' : 'onclick="handleOpenDetailedAnalysisItem(' + (index - 1) + ')"') + ' style="flex: 1; max-width: 150px;">' +
                '    <i class="ph-bold ph-caret-left" style="font-size: 14px;"></i> Previous' +
                '  </button>' +
                '  <div style="font-size: 12.5px; font-weight: 800; color: var(--grey-text); font-family: \\\'Sahitya\\\', serif; letter-spacing: 0.5px; opacity: 0.9;">' +
                '    Q. ' + (index + 1) + ' / ' + _activeQuestions.length +
                '  </div>' +
                '  <button class="analysis-nav-btn" ' + (nextDisabled ? 'disabled' : 'onclick="handleOpenDetailedAnalysisItem(' + (index + 1) + ')"') + ' style="flex: 1; max-width: 150px;">' +
                '    Next <i class="ph-bold ph-caret-right" style="font-size: 14px;"></i>' +
                '  </button>' +
                '</div>';

            const wasRevealed = _revealedAnswersMap[index] === true;
            const revealedBannerHtml = wasRevealed ? 
                '<div style="background: rgba(245, 158, 11, 0.08); border: 1.5px dashed #f59e0b; border-radius: 12px; padding: 10px 14px; display: flex; align-items: center; gap: 8px; margin-bottom: 15px; color: #b45309; font-size: 12px; font-weight: bold;">' +
                '  <i class="ph-fill ph-eye" style="font-size: 16px; color: #f59e0b;"></i>' +
                '  <span>Answer Revealed during test (Eye icon clicked)</span>' +
                '</div>' : '';

            detailCard.innerHTML = 
                '<div class="lang-' + _currentLanguage + '" style="' + fontStyle + '">' +
                '  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom:8px;">' +
                '    <div style="font-size:11px; font-weight:bold; color:var(--primary); ' + fontStyle + '">QUESTION ' + (index + 1) + ' ANALYSIS (' + _currentLanguage.toUpperCase() + ')</div>' +
                '    <div style="display: flex; align-items: center; gap: 15px;">' +
                '       ' + analysisSaveBtnHtml +
                '       ' + analysisReportBtnHtml +
                '    </div>' +
                '  </div>' +
                '  ' + revealedBannerHtml +
                '  <div class="analysis-question-box" style="background:var(--light-grey); padding:16px; border-radius:12px; border:1px solid var(--border-color); margin-bottom:20px; font-size:15px; line-height:1.5; font-weight:bold; ' + qFontStyle + '"><strong>Q:</strong> ' + qNode.q + '</div>' +
                (qNode.image ? '<div class="analysis-question-image-box" style="margin: -10px 0 15px; text-align: center;"><img src="' + qNode.image + '" style="max-width: 100%; max-height: 250px; border-radius: 12px; border: 1.5px solid var(--border-color); box-shadow: 0 4px 12px rgba(0,0,0,0.05); object-fit: contain; background: white;" referrerPolicy="no-referrer"></div>' : '') +
                '  <div style="margin-top:10px;">' + optSelectionsHtml + '</div>' +
                '  ' + (qNode.s ? '<div class="analysis-explanation-box" style="background:#e1f5fe; border:1px solid #b3e5fc; padding:16px; border-radius:12px; font-size:14px; line-height:1.5; color:#0277bd; margin-top:15px; ' + expFontStyle + '"><strong>Explanation / Solution (Ex):</strong> ' + qNode.s + '</div>' : '<div class="analysis-explanation-box" style="background:#f1f2f6; border:1px solid var(--border-color); padding:16px; border-radius:12px; font-size:13px; color:#57606f; margin-top:15px; ' + fontStyle + '"><strong>Explanation:</strong> No explanation provided.</div>') +
                '  ' + sourceHtml +
                '  ' + navigationHtml +
                '</div>';

            triggerMathJax();
        }

        function handleClosePaymentSuccessModal() {
            document.getElementById("paymentSuccessPopupModal").style.display = "none";
            handleTabNavigation('home');
        }

        // IndexedDB Cache Storage helper to make the page load instantly on subsequent opens
        var CACHE_DB_NAME = "PrayasOneCachedDB";
        var CACHE_STORE_NAME = "DatabaseStore";
        var QUESTIONS_CACHE_STORE = "ExamQuestionsStore";
        var CACHE_KEY = "assembled_config";

        function upgradeDBSchema(e) {
            var db = e.target.result;
            if (!db.objectStoreNames.contains(CACHE_STORE_NAME)) {
                db.createObjectStore(CACHE_STORE_NAME);
            }
            if (!db.objectStoreNames.contains(QUESTIONS_CACHE_STORE)) {
                db.createObjectStore(QUESTIONS_CACHE_STORE);
            }
        }

        var _dbInstance = null;
        var _dbOpeningPromise = null;

        function getDB() {
            if (_dbInstance) {
                return Promise.resolve(_dbInstance);
            }
            if (_dbOpeningPromise) {
                return _dbOpeningPromise;
            }

            _dbOpeningPromise = new Promise(function(resolve, reject) {
                var isResolved = false;
                
                // Add a smart safety fallback timeout of 450ms! If IndexedDB doesn't open
                // within 450ms, we assume it is blocked/locked and reject the promise immediately.
                // This allows the app to load instantly from external configuration without any loader hang!
                var timeoutId = setTimeout(function() {
                    if (!isResolved) {
                        isResolved = true;
                        console.warn("IndexedDB connection timed out (450ms). Bypassing cache to avoid any loader hang.");
                        reject(new Error("Timeout"));
                        _dbOpeningPromise = null;
                    }
                }, 450);

                try {
                    var req = indexedDB.open(CACHE_DB_NAME, 2);
                    
                    req.onupgradeneeded = upgradeDBSchema;
                    
                    req.onsuccess = function(e) {
                        if (isResolved) {
                            try { e.target.result.close(); } catch(err){}
                            return;
                        }
                        clearTimeout(timeoutId);
                        isResolved = true;
                        _dbInstance = e.target.result;
                        
                        // Close if database shifts (e.g., version changes)
                        _dbInstance.onversionchange = function() {
                            try { _dbInstance.close(); } catch(err){}
                            _dbInstance = null;
                        };
                        
                        resolve(_dbInstance);
                        _dbOpeningPromise = null;
                    };
                    
                    req.onerror = function() {
                        if (isResolved) return;
                        clearTimeout(timeoutId);
                        isResolved = true;
                        reject(new Error("IndexedDB Open Error"));
                        _dbOpeningPromise = null;
                    };
                    
                    req.onblocked = function() {
                        if (isResolved) return;
                        clearTimeout(timeoutId);
                        isResolved = true;
                        console.warn("IndexedDB upgrade blocked! Rejecting immediately.");
                        reject(new Error("IndexedDB Blocked"));
                        _dbOpeningPromise = null;
                    };
                } catch(err) {
                    if (isResolved) return;
                    clearTimeout(timeoutId);
                    isResolved = true;
                    reject(err);
                    _dbOpeningPromise = null;
                }
            });

            return _dbOpeningPromise;
        }

        function getCachedPayload() {
            return new Promise(function(resolve) {
                getDB().then(function(db) {
                    try {
                        var tx = db.transaction(CACHE_STORE_NAME, "readonly");
                        var store = tx.objectStore(CACHE_STORE_NAME);
                        var getReq = store.get(CACHE_KEY);
                        getReq.onsuccess = function() {
                            var data = getReq.result;
                            if (data && typeof data === "object" && data.payload) {
                                resolve(data);
                            } else if (typeof data === "string") {
                                resolve({ payload: data, buildId: "" });
                            } else {
                                resolve(null);
                            }
                        };
                        getReq.onerror = function() {
                            resolve(null);
                        };
                    } catch(txErr) {
                        resolve(null);
                    }
                }).catch(function(err) {
                    console.warn("Skipping getCachedPayload due to DB mismatch/timeout", err);
                    resolve(null);
                });
            });
        }

        function savePayloadToCache(payload, buildId) {
            getDB().then(function(db) {
                try {
                    var tx = db.transaction(CACHE_STORE_NAME, "readwrite");
                    var store = tx.objectStore(CACHE_STORE_NAME);
                    store.put({ payload: payload, buildId: buildId || "" }, CACHE_KEY);
                } catch(e) {
                    console.error("IndexedDB cache save failed:", e);
                }
            }).catch(function(err) {
                console.warn("Skip savePayloadToCache, db locked:", err);
            });
        }

        function getCachedExamQuestions(examId) {
            return new Promise(function(resolve) {
                getDB().then(function(db) {
                    try {
                        var tx = db.transaction(QUESTIONS_CACHE_STORE, "readonly");
                        var store = tx.objectStore(QUESTIONS_CACHE_STORE);
                        var getReq = store.get(examId);
                        getReq.onsuccess = function() {
                            resolve(getReq.result || null);
                        };
                        getReq.onerror = function() {
                            resolve(null);
                        };
                    } catch(txErr) {
                        resolve(null);
                    }
                }).catch(function() {
                    resolve(null);
                });
            });
        }

        function saveExamQuestionsToCache(examId, questionsPayload) {
            getDB().then(function(db) {
                try {
                    var tx = db.transaction(QUESTIONS_CACHE_STORE, "readwrite");
                    var store = tx.objectStore(QUESTIONS_CACHE_STORE);
                    store.put(questionsPayload, examId);
                } catch(txErr) {
                    console.warn("Could not save questions in transaction", txErr);
                }
            }).catch(function(err) {
                console.warn("Skip saveExamQuestionsToCache, db locked:", err);
            });
        }

        // Image memory caching & preheating for zero-latency page loading on mobile and desktop
        window.__imgCache = window.__imgCache || {};
        window.__imgCacheLoaded = false;

        function initImageCache() {
            return new Promise(function(resolve) {
                window.__imgCacheLoaded = true;
                resolve();
            });
        }

        function preloadAllMediaAssets() {
            if (!DB) return;
            try {
                var urls = [];
                if (Array.isArray(DB.sliders)) {
                    DB.sliders.forEach(function(s) { if (s && s.image) urls.push(s.image); });
                }
                if (Array.isArray(DB.popups)) {
                    DB.popups.forEach(function(p) { if (p && p.imageUrl) urls.push(p.imageUrl); });
                }
                if (Array.isArray(DB.notifications)) {
                    DB.notifications.forEach(function(n) { if (n && n.image) urls.push(n.image); });
                }
                if (Array.isArray(DB.testCategories)) {
                    DB.testCategories.forEach(function(c) { if (c && c.image) urls.push(c.image); });
                }
                if (Array.isArray(DB.pdfCategories)) {
                    DB.pdfCategories.forEach(function(c) { if (c && c.image) urls.push(c.image); });
                }
                if (DB.appConfig) {
                    if (DB.appConfig.logoUrl) urls.push(DB.appConfig.logoUrl);
                    if (DB.appConfig.ogImage) urls.push(DB.appConfig.ogImage);
                }

                urls.forEach(function(url) {
                    if (url && typeof url === "string" && url.trim().length > 0) {
                        var clean = enhanceImageUrlQuality(url);
                        var img = new Image();
                        img.src = clean;
                    }
                });
            } catch(e) {
                console.warn("Preload media error:", e);
            }
        }

        // Image caching with super-fast instant URL resolution
        function getCachedImageUrl(url) {
            url = enhanceImageUrlQuality(url);
            return Promise.resolve(url);
        }

        var _bgRefreshQueue = [];
        var _bgRefreshProcessing = false;

        function processNextBgRefresh() {
            if (_bgRefreshQueue.length === 0) {
                _bgRefreshProcessing = false;
                return;
            }
            _bgRefreshProcessing = true;
            
            var item = _bgRefreshQueue.shift();
            var url = item.url;
            var existingValue = item.existingValue;

            fetch(url)
                .then(function(response) {
                    if (!response.ok) throw new Error("HTTP " + response.status);
                    return response.blob();
                })
                .then(function(blob) {
                    var reader = new FileReader();
                    reader.onloadend = function() {
                        var newValue = reader.result;
                        if (newValue !== existingValue) {
                            if (window.__imgCache) {
                                window.__imgCache[url] = newValue;
                            }
                            getDB().then(function(db) {
                                try {
                                    var txWrite = db.transaction(CACHE_STORE_NAME, "readwrite");
                                    var storeWrite = txWrite.objectStore(CACHE_STORE_NAME);
                                    storeWrite.put(newValue, "img_" + url);
                                } catch(err) {
                                    console.error("Failed to write to database image store value", err);
                                }
                            }).catch(function() {});

                            // Live seamless transition: find any matching img tags currently visible and update their src
                            var images = document.getElementsByTagName("img");
                            for (var i = 0; i < images.length; i++) {
                                var img = images[i];
                                if (img.src === url || img.src === newValue || img.getAttribute("data-original-src") === url) {
                                    img.src = newValue;
                                }
                            }
                        }
                        // Delay 200ms before processing next image to keep the interface absolutely silky smooth at 60 FPS
                        setTimeout(processNextBgRefresh, 200);
                    };
                    reader.readAsDataURL(blob);
                })
                .catch(function() {
                    // Suppress and continue gently
                    setTimeout(processNextBgRefresh, 150);
                });
        }

        // Silent background fetch, cache save, and live update of matching images on-screen
        function triggerBackgroundRefresh(url, existingValue) {
            if (existingValue) {
                return;
            }
            if (!url || url.indexOf("data:") === 0 || url.indexOf("blob:") === 0) return;
            
            // Avoid duplicate queueing
            for (var i = 0; i < _bgRefreshQueue.length; i++) {
                if (_bgRefreshQueue[i].url === url) return;
            }

            _bgRefreshQueue.push({ url: url, existingValue: existingValue });
            
            if (!_bgRefreshProcessing) {
                // Wait 1.5 seconds after portal loading before executing background network operations
                // to make sure user scrolling on sliders/category grid/alerts doesn't lag!
                setTimeout(processNextBgRefresh, 1500);
            }
        }

        function ensurePaymentQrCached() {
            try {
                var qrUrl = "";
                if (_activeCategoryForPayment) {
                    qrUrl = _activeCategoryForPayment.paymentQr || (DB && DB.social && DB.social.paymentQr) || "";
                } else {
                    qrUrl = (DB && DB.social && DB.social.paymentQr) || "";
                }
                if (qrUrl) {
                    var img = document.getElementById("displayPayQrImage");
                    if (img) {
                        img.setAttribute("data-original-src", qrUrl);
                        if (window.__imgCache && window.__imgCache[qrUrl]) {
                            img.src = window.__imgCache[qrUrl];
                        } else {
                            img.src = qrUrl;
                            if (typeof getCachedImageUrl === "function") {
                                getCachedImageUrl(qrUrl).then(function(cachedUrl) {
                                    if (cachedUrl && cachedUrl !== qrUrl && img) {
                                        img.src = cachedUrl;
                                    }
                                });
                            }
                        }
                    }
                }
            } catch(e) {
                console.warn("Could not cache payment QR:", e);
            }
        }

        async function _fetchStudentsDatabase() {
            try {
                var cacheBuster = "?v=" + Date.now();
                var candidateUrls = [
                    _getRegistryPath("students_db.txt") + cacheBuster,
                    _getRegistryPath("student_db.txt") + cacheBuster,
                    "./students_db.txt" + cacheBuster,
                    "./student_db.txt" + cacheBuster,
                    "/students_db.txt" + cacheBuster,
                    "/student_db.txt" + cacheBuster
                ];

                // Remove duplicate entries
                candidateUrls = Array.from(new Set(candidateUrls));
                console.log("Synchronizing student directory from candidate URLs...");

                var loaded = false;
                for (var i = 0; i < candidateUrls.length; i++) {
                    var url = candidateUrls[i];
                    try {
                        var res = await fetch(url, { cache: "no-store" });
                        if (!res.ok) continue;

                        var dataText = await res.text();
                        if (!dataText || dataText.trim() === "") continue;

                        var trimmedText = dataText.trim();
                        // Ignore HTML responses (e.g. 200 OK SPA fallback from .htaccess)
                        if (trimmedText.startsWith("<") || trimmedText.toLowerCase().startsWith("<!doctype")) {
                            continue;
                        }

                        var decoded = decodeObfuscatedPayload(trimmedText);
                        var parsedStudents = null;
                        try {
                            parsedStudents = JSON.parse(decoded);
                        } catch (e1) {
                            try {
                                parsedStudents = JSON.parse(trimmedText);
                            } catch (e2) {}
                        }

                        if (Array.isArray(parsedStudents) && parsedStudents.length > 0) {
                            DB.students = parsedStudents;
                            try {
                                localStorage.setItem("_cached_students_db", JSON.stringify(parsedStudents));
                            } catch (e) {}
                            console.log("Student profiles loaded from " + url + " (" + parsedStudents.length + " students)");

                            if (_studentLoggedInUser) {
                                var freshMatch = parsedStudents.find(function(s) {
                                    var uMail = (_studentLoggedInUser.emailOrMobile || _studentLoggedInUser.email || "").toString().trim().toLowerCase();
                                    var sMail = (s.emailOrMobile || s.email || "").toString().trim().toLowerCase();
                                    return sMail === uMail;
                                });
                                if (freshMatch) {
                                    _studentLoggedInUser = freshMatch;
                                    localStorage.setItem("_secured_active_aspirant", JSON.stringify(freshMatch));
                                }
                            }
                            loaded = true;
                            break;
                        }
                    } catch (eUrl) {
                        // ignore and try next URL
                    }
                }

                if (!loaded && (!DB.students || DB.students.length === 0)) {
                    var localCache = localStorage.getItem("_cached_students_db");
                    if (localCache) {
                        try {
                            DB.students = JSON.parse(localCache);
                            console.log("Restored student profiles from local storage cache.");
                        } catch (e) {}
                    }
                }
            } catch (err) {
                console.warn("Could not load dynamic student directories, using embedded local cache.", err);
            }
        }

        async function _fetchCategoryPaymentConfig() {
            try {
                var cacheBuster = "?v=" + Date.now();
                var r2PaymentUrl = _getRegistryPath("CategoryPayment.txt") + cacheBuster;
                console.log("Synchronizing category payment setup from R2...");
                
                var res = await fetch(r2PaymentUrl, { cache: "no-store" });
                if (res.ok) {
                    var dataText = await res.text();
                    if (dataText && dataText.trim() !== "") {
                        var parsedConfig = JSON.parse(dataText.trim());
                        console.log("Successfully fetched category payments override:", parsedConfig);
                        
                        var mergePayment = function(cat) {
                            if (parsedConfig[cat.id]) {
                                var override = parsedConfig[cat.id];
                                cat.isPaid = !!override.isPaid;
                                if (override.paymentAmount) cat.paymentAmount = override.paymentAmount;
                                if (override.paymentValidityDays) cat.paymentValidityDays = override.paymentValidityDays;
                                if (override.paymentBenefits) cat.paymentBenefits = override.paymentBenefits;
                                if (override.paymentQr) cat.paymentQr = override.paymentQr;
                                if (override.paymentUrl) cat.paymentUrl = override.paymentUrl;
                                if (override.paymentHelpdeskUrl) cat.paymentHelpdeskUrl = override.paymentHelpdeskUrl;
                            }
                        };
                        
                        if (DB.testCategories) DB.testCategories.forEach(mergePayment);
                        if (DB.pdfCategories) DB.pdfCategories.forEach(mergePayment);
                    }
                }
            } catch (err) {
                console.warn("Could not load dynamic CategoryPayment.txt overrides, using embedded local values.", err);
            }
        }

        var _portalInitialized = false;
        async function finishPortalInitialization() {
            if (_portalInitialized) return;
            _portalInitialized = true;

            try {
                preloadAllMediaAssets();
            } catch(e) {}

            // Synchronize latest student login credentials and category payment setups dynamically in background (non-blocking)
            _fetchCategoryPaymentConfig().catch(function(err) {
                console.error("Dynamic category payment setup fetch error:", err);
            });

            _fetchStudentsDatabase().catch(function(err) {
                console.error("Dynamic student DB fetch error:", err);
            });

            try {
                setupAntiPiracyBlockers();
            } catch(e) {
                console.error("error setting up blockers:", e);
            }
            try {
                launchSlidersCarousel();
            } catch(e) {
                console.error("error loading carousel:", e);
            }
            try {
                renderNoticesScrollingBoard();
            } catch(e) {
                console.error("error rendering notices:", e);
            }

            // Load saved user session
            try {
                const cachedUser = localStorage.getItem("_secured_active_aspirant");
                if (cachedUser) {
                    try {
                        _studentLoggedInUser = JSON.parse(cachedUser);
                        setTimeout(function() {
                            try { syncSavedQuestionsWithCloud("pull"); } catch(e){}
                        }, 500);
                    } catch(e) {
                        _studentLoggedInUser = null;
                    }
                }
            } catch(e) {
                console.error("error loading cached session:", e);
            }

            // Periodically check live concurrent session statuses
            try {
                if (_studentLoggedInUser) {
                    checkConcurrentUserSession();
                }
                setInterval(function() {
                    if (_studentLoggedInUser) {
                        checkConcurrentUserSession();
                    }
                }, 15000);
            } catch(e) {
                console.error("error starting concurrent session checks", e);
            }

            try {
                refreshStudentAccountProfileGate();
            } catch(e) {
                console.error("error refreshing profile gate:", e);
            }
            try {
                renderSavedQuestionsBox();
            } catch(e) {
                console.error("error rendering saved questions:", e);
            }
            try {
                checkActiveWebsitePopups();
                setInterval(checkActiveWebsitePopups, 5000); // Check every 5 seconds for scheduled popups to appear automatically
            } catch(e) {
                console.error("error launching popup active:", e);
            }

            // Restore Dark/Light mode preference on init with automatic system theme fallback
            try {
                const stored = localStorage.getItem("_preemptive_theme_mode");
                let isDark = false;
                if (stored === "dark") {
                    isDark = true;
                } else if (stored === "light") {
                    isDark = false;
                } else {
                    isDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
                }

                const sun = document.getElementById("themeSunIcon");
                const moon = document.getElementById("themeMoonIcon");

                if (isDark) {
                    document.body.classList.add("dark-mode");
                    if (sun) sun.style.display = "block";
                    if (moon) moon.style.display = "none";
                } else {
                    document.body.classList.remove("dark-mode");
                    if (sun) sun.style.display = "none";
                    if (moon) moon.style.display = "block";
                }

                // Listen to device theme changes if no override is saved in localStorage
                if (!stored && window.matchMedia) {
                    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function(e) {
                        if (!localStorage.getItem("_preemptive_theme_mode")) {
                            const newDark = e.matches;
                            const sIcon = document.getElementById("themeSunIcon");
                            const mIcon = document.getElementById("themeMoonIcon");
                            if (newDark) {
                                document.body.classList.add("dark-mode");
                                if (sIcon) sIcon.style.display = "block";
                                if (mIcon) mIcon.style.display = "none";
                            } else {
                                document.body.classList.remove("dark-mode");
                                if (sIcon) sIcon.style.display = "none";
                                if (mIcon) mIcon.style.display = "block";
                            }
                        }
                    });
                }
            } catch(e) {}

            // Try deep linking / SPA routing parsing without pushing new history entry
            let deepLinkClicked = false;
            _isHandlingPopState = true;
            try {
                deepLinkClicked = handleDeepLinking();
            } catch (e) {
                console.error("Deep link trigger error:", e);
            } finally {
                _isHandlingPopState = false;
            }

            if (!deepLinkClicked) {
                // Always start on the Home tab on startup if no deep links match
                _isHandlingPopState = true;
                try {
                    handleTabNavigation("home");
                } catch(e) {
                    handleTabNavigation("home");
                } finally {
                    _isHandlingPopState = false;
                }
            }

            try {
                initEmailCooldowns();
            } catch(e) {
                console.error("error initializing email cooldowns:", e);
            }
        }

        // Load Persistent Sessions on Start
        async function startStudentPortal() {
            try { initImageCache(); } catch(e){}
            var loadedSuccessfully = true;
            var loadedFromCache = false;
            var cachedData = null;

            if (window.__studentAppChunkCount && window.__studentAppChunkCount > 0) {
                // Try to load synchronously from localStorage first for absolute instantaneous booting
                try {
                    var localPayload = localStorage.getItem("prayas_one_student_db_payload");
                    if (localPayload && localPayload.trim() !== "") {
                        DB = JSON.parse(decodeObfuscatedPayload(localPayload));
                        enhanceAllDbImages(DB);
                        loadedFromCache = true;
                        console.log("Database loaded features instantly from localStorage cache!");
                        try { ensurePaymentQrCached(); } catch(e){}
                        
                        try {
                            finishPortalInitialization();
                        } catch(err_init) {
                            console.error("Error doing hot start from localStorage:", err_init);
                        }
                    }
                } catch (localErr) {
                    console.warn("Could not load from localStorage cache:", localErr);
                }

                // If not loaded from localStorage, try IndexedDB cache immediately
                if (!loadedFromCache) {
                    try {
                        cachedData = await getCachedPayload();
                        if (cachedData && cachedData.payload && cachedData.payload.trim() !== "") {
                            DB = JSON.parse(decodeObfuscatedPayload(cachedData.payload));
                            enhanceAllDbImages(DB);
                            loadedFromCache = true;
                            console.log("Database loaded features instantly from IndexedDB cache!");
                            try { ensurePaymentQrCached(); } catch(e){}
                            
                            try {
                                finishPortalInitialization();
                            } catch(err_init) {
                                console.error("Error doing hot start from IndexedDB:", err_init);
                            }
                        }
                    } catch (cacheErr) {
                        console.warn("Could not load from local IndexedDB cache, fetching fresh...", cacheErr);
                    }
                }

                // If still not loaded from local cache, check for embedded site shell database to boot instantly!
                if (!loadedFromCache) {
                    var embeddedB64 = "${base64Config}";
                    if (embeddedB64 && embeddedB64.trim() !== "") {
                        try {
                            DB = JSON.parse(decodeObfuscatedPayload(embeddedB64.trim()));
                            enhanceAllDbImages(DB);
                            loadedFromCache = true;
                            console.log("Database loaded instant site structure from embedded shell payload!");
                            try { ensurePaymentQrCached(); } catch(e){}
                            try {
                                finishPortalInitialization();
                            } catch(err_init) {
                                console.error("Error launching from embedded shell payload:", err_init);
                            }
                        } catch(shellErr) {
                            console.warn("Could not decode embedded shell payload:", shellErr);
                        }
                    }

                    if (!DB || !DB.testCategories) {
                        DB = {
                            testCategories: [],
                            pdfCategories: [],
                            sliders: [],
                            notices: [],
                            appName: "Prayas One",
                            logo: "",
                            social: {}
                        };
                        try {
                            finishPortalInitialization();
                        } catch(err_fallback) {
                            console.error("Error launching with fallback DB:", err_fallback);
                        }
                    }
                    loadedFromCache = true;
                }

                // Check for background updates on the server dynamically using ETag/Last-Modified of config_part_1.txt
                var skipFetch = false;
                var serverETag = null;
                try {
                    var cacheBuster = "?v=" + Date.now();
                    var r2Url = _getRegistryPath("config_part_1.txt") + cacheBuster;
                    var controller = typeof AbortController !== "undefined" ? new AbortController() : null;
                    var timeoutId = controller ? setTimeout(function() { controller.abort(); }, 1200) : null;
                    var headRes = await fetch(r2Url, { method: "HEAD", signal: controller ? controller.signal : undefined });
                    if (timeoutId) clearTimeout(timeoutId);
                    if (headRes && headRes.ok) {
                        serverETag = headRes.headers.get("ETag") || headRes.headers.get("Last-Modified");
                        var cachedETag = localStorage.getItem("prayas_one_student_db_etag") || "";
                        if (serverETag && cachedETag && serverETag === cachedETag) {
                            console.log("Database is up-to-date (ETag matches). Stopping sync.");
                            skipFetch = true;
                        }
                    }
                } catch(etagErr) {
                    console.warn("Could not perform ETag update check:", etagErr);
                }

                if (skipFetch) {
                    return; // "if nahi hai toh band kar de" - completely stop!
                }

                var loadedChunks = new Array(window.__studentAppChunkCount);
                var fetchedCount = 0;
                var promises = [];
                // Use a rounded-minute cache buster (every 60s) so CDNs and browsers bypass caching and always fetch the newly updated database segments.
                var minuteBuster = Math.floor(Date.now() / 60000);
                var buildQuery = "?v=" + encodeURIComponent(window.__studentAppBuildId || "") + "&cb=" + minuteBuster;

                for (var i = 0; i < window.__studentAppChunkCount; i++) {
                    (function(index) {
                        var filename = "config_part_" + (index + 1) + ".txt";
                        var r2Url = _getRegistryPath(filename) + buildQuery;
                        // Use no-cache to force validating the file freshness directly against storage
                        var fetchPromise = fetch(r2Url, { cache: "no-cache" })
                            .then(function(res) {
                                if (!res.ok) {
                                    throw new Error("HTTP " + res.status + " retrieving " + filename);
                                }
                                return res.text();
                            })
                            .then(function(text) {
                                loadedChunks[index] = text.trim();
                                fetchedCount++;
                            })
                            .catch(function(e) {
                                console.warn("Background fetch failed for segment " + filename, e);
                            });
                        promises.push(fetchPromise);
                    })(i);
                }

                try {
                    // Load ALL segments concurrently! This uses maximum internet speed to download chunks in parallel.
                    await Promise.all(promises);

                    var base64ConfigJoined = loadedChunks.join("");
                    if (!base64ConfigJoined || base64ConfigJoined.trim() === "") {
                        console.warn("Downloaded chunks were empty, ignoring update.");
                        return;
                    }
                    
                    // "if nahi hai toh band kar de" - Check if data actually changed compared to the cache
                    var cachedPayload = "";
                    try {
                        cachedPayload = localStorage.getItem("prayas_one_student_db_payload") || "";
                    } catch (e) {}
                    if (!cachedPayload && cachedData && cachedData.payload) {
                        cachedPayload = cachedData.payload;
                    }

                    if (cachedPayload && cachedPayload.trim() === base64ConfigJoined.trim()) {
                        console.log("Database payload matches cached database exactly. Bypassing save.");
                        if (serverETag) {
                            localStorage.setItem("prayas_one_student_db_etag", serverETag);
                        }
                        return; // Stop right here! "if nahi hai toh band kar de"
                    }

                    // Save compiled config in storage with current build ID
                    var currentBuildId = window.__studentAppBuildId || "";
                    savePayloadToCache(base64ConfigJoined, currentBuildId);
                    
                    try {
                        localStorage.setItem("prayas_one_student_db_payload", base64ConfigJoined);
                        localStorage.setItem("prayas_one_student_db_build_id", currentBuildId);
                        if (serverETag) {
                            localStorage.setItem("prayas_one_student_db_etag", serverETag);
                        }
                        console.log("Database payload successfully updated in localStorage.");
                    } catch(lsErr) {
                        console.warn("Could not write updated database payload to localStorage:", lsErr);
                    }
                    console.log("Database cache successfully saved / refreshed.");
                    
                    // Parse & display
                    try {
                        DB = JSON.parse(decodeObfuscatedPayload(base64ConfigJoined));
                        enhanceAllDbImages(DB);
                        try { preloadAllMediaAssets(); } catch(e){}
                        console.log("Seamlesly synchronized memory database with freshly downloaded copy.");
                        try { ensurePaymentQrCached(); } catch(e){}
                        
                        // Silent live updates of view tabs when user is not taking an exam
                        var inActiveAttempt = (typeof _activeAttemptState !== 'undefined' && _activeAttemptState) || 
                                                (document.getElementById("activeQuizTimer") && document.getElementById("activeQuizTimer").style.display !== "none");
                        if (!inActiveAttempt) {
                            try { launchSlidersCarousel(); } catch(e){}
                            try { renderNoticesScrollingBoard(); } catch(e){}
                            try { refreshStudentAccountProfileGate(); } catch(e){}
                            try {
                                var activeTab = localStorage.getItem("_student_active_tab_id") || "home";
                                if (activeTab === "tests") {
                                    renderCategorySelectionScreen('test');
                                } else if (activeTab === "pdfs") {
                                    renderCategorySelectionScreen('pdf');
                                } else if (activeTab === "home") {
                                    renderSavedQuestionsBox();
                                }
                            } catch(e){}
                        }
                    } catch (e) {
                        console.error("Could not parse freshly compiled background copy:", e);
                    }
                } catch (e) {
                    console.error("Split chunk parallel load failed:", e);
                }
            } else {
                // Inline single file fallback
                try {
                    const embeddedB64 = "${base64Config}";
                    if (embeddedB64 && embeddedB64 !== "") {
                        DB = JSON.parse(decodeObfuscatedPayload(embeddedB64));
                        enhanceAllDbImages(DB);
                    }
                } catch (e) {
                    console.error("Single file DB decode exception:", e);
                }
                finishPortalInitialization();
            }
        }

        function handleDeepLinking() {
            try {
                // Decode query-based redirect (404.html trick)
                var l = window.location;
                if (l.search[1] === '/' ) {
                    var decoded = l.search.slice(1).split('&').map(function(s) { 
                        return s.replace(/~and~/g, '&'); 
                    }).join('?');
                    window.history.replaceState(null, null, l.pathname.slice(0, -1) + decoded + l.hash);
                }

                // Extract path from pathname or hash
                var path = l.pathname;
                if (l.hash && l.hash.indexOf('#/') === 0) {
                    path = l.hash.slice(1);
                } else if (l.hash && l.hash.indexOf('#') === 0 && l.hash.indexOf('#!') !== 0) {
                    path = l.hash.slice(1);
                }

                var segments = path.split('/').filter(function(s) {
                    return s && s !== 'index.html' && s !== 'student' && s !== 'student.html';
                });

                if (segments.length === 0) return false;

                var firstSegment = segments[0] ? segments[0].toLowerCase() : null;

                // 1. Core tabs check
                if (firstSegment === 'home') {
                    handleTabNavigation('home');
                    return true;
                }
                if (firstSegment === 'test' || firstSegment === 'tests') {
                    if (segments.length === 1) {
                        handleTabNavigation('tests');
                        return true;
                    }
                    segments.shift(); // remove "test" prefix and resolve nested categories
                } else if (firstSegment === 'pdf' || firstSegment === 'pdfs') {
                    if (segments.length === 1) {
                        handleTabNavigation('pdfs');
                        return true;
                    }
                    segments.shift(); // remove "pdf" prefix and resolve nested categories
                } else if (firstSegment === 'account' || firstSegment === 'acc' || firstSegment === 'my-account') {
                    handleTabNavigation('acc');
                    return true;
                }

                var catSlug = segments[0] ? segments[0].toLowerCase() : null;
                var subSlug = segments[1] ? segments[1].toLowerCase() : null;
                var topicSlug = segments[2] ? segments[2].toLowerCase() : null;

                if (!catSlug) return false;

                // Search in testCategories and pdfCategories
                var foundCat = null;
                var foundType = 'test';
                
                var allCats = ((DB.testCategories || []).map(function(c) { return {cat: c, type: 'test'}; }))
                    .concat((DB.pdfCategories || []).map(function(c) { return {cat: c, type: 'pdf'}; }));

                for (var i = 0; i < allCats.length; i++) {
                    var cNode = allCats[i];
                    if (toSlug(cNode.cat.name) === catSlug) {
                        foundCat = cNode.cat;
                        foundType = cNode.type;
                        break;
                    }
                }

                if (!foundCat) return false;

                // If only category matches
                if (!subSlug) {
                    handleTabNavigation(foundType === 'test' ? 'tests' : 'pdfs');
                    handleSelectCategoryNode(foundCat, foundType);
                    return true;
                }

                // Find matching subcategory
                var foundSub = null;
                var subCategoriesList = foundCat.subCategories || [];
                for (var j = 0; j < subCategoriesList.length; j++) {
                    var sNode = subCategoriesList[j];
                    if (toSlug(sNode.name) === subSlug) {
                        foundSub = sNode;
                        break;
                    }
                }

                if (!foundSub) {
                    handleTabNavigation(foundType === 'test' ? 'tests' : 'pdfs');
                    handleSelectCategoryNode(foundCat, foundType);
                    return true;
                }

                if (!topicSlug) {
                    handleTabNavigation(foundType === 'test' ? 'tests' : 'pdfs');
                    handleSelectCategoryNode(foundCat, foundType);
                    handleSelectSubcategoryNode(foundSub, foundType);
                    return true;
                }

                // Find match topic
                var foundTopic = null;
                var topicsList = foundSub.topics || [];
                for (var k = 0; k < topicsList.length; k++) {
                    var tNode = topicsList[k];
                    if (toSlug(tNode.name) === topicSlug) {
                        foundTopic = tNode;
                        break;
                    }
                }

                if (!foundTopic) {
                    handleTabNavigation(foundType === 'test' ? 'tests' : 'pdfs');
                    handleSelectCategoryNode(foundCat, foundType);
                    handleSelectSubcategoryNode(foundSub, foundType);
                    return true;
                }

                // Topic matched
                handleTabNavigation(foundType === 'test' ? 'tests' : 'pdfs');
                handleSelectCategoryNode(foundCat, foundType);
                handleSelectSubcategoryNode(foundSub, foundType);
                handleSelectTopicNode(foundTopic, foundType);
                return true;

            } catch (err) {
                console.error("Deep linking route parse error:", err);
            }
            return false;
        }

        // Run instantly as soon as parsed (since the script is at the bottom of the body, DOM is already ready)
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", startStudentPortal);
        } else {
            startStudentPortal();
        }

        function handleToggleThemeMode() {
            const isDark = document.body.classList.toggle("dark-mode");
            localStorage.setItem("_preemptive_theme_mode", isDark ? "dark" : "light");
            const sun = document.getElementById("themeSunIcon");
            const moon = document.getElementById("themeMoonIcon");
            if (isDark) {
                if (sun) sun.style.display = "block";
                if (moon) moon.style.display = "none";
            } else {
                if (sun) sun.style.display = "none";
                if (moon) moon.style.display = "block";
            }
        }
    </script>
</body>
</html>`;
}
