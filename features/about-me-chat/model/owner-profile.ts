export type LocalizedText = {
  en: string;
  fa: string;
};

export type ExperienceEntry = {
  title: LocalizedText;
  company: LocalizedText;
  period: LocalizedText;
  summary: LocalizedText;
  highlights: LocalizedText[];
};

export type ProjectEntry = {
  name: LocalizedText;
  description: LocalizedText;
  tags: string[];
  url?: string;
};

export type OwnerProfilePack = {
  name: LocalizedText;
  role: LocalizedText;
  location: LocalizedText;
  languages: LocalizedText;
  contact: {
    email: string;
    phone?: string;
    linkedin?: string;
  };
  about: LocalizedText;
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  skills: string[];
};

export const ownerProfilePack: OwnerProfilePack = {
  name: {
    en: "Ali N. Abadian",
    fa: "علی نقش‌ریز آبادیان",
  },
  role: {
    en: "Frontend Developer",
    fa: "توسعه‌دهنده فرانت‌اند",
  },
  location: {
    en: "Tabriz, Iran",
    fa: "تبریز، ایران",
  },
  languages: {
    en: "English (Advanced) · Persian (Native)",
    fa: "انگلیسی (پیشرفته) · فارسی (زبان مادری)",
  },
  contact: {
    email: "nagshrizali@gmail.com",
    phone: "+98 914 649 2 649",
    linkedin: "https://linkedin.com/in/alinagshriz",
  },
  about: {
    en: "Frontend engineer for complex B2B products — maps, commerce, and data-heavy SaaS with React and Next.js. Feature-Sliced Design, micro-frontends, and performance. Also works in AI-driven development: Generative UI, MCP tools, agentic workflows, and Vercel/OpenAI SDK integrations. Education: Computer Engineering — Technical University of Tabriz, 2022–2027.",
    fa: "مهندس فرانت‌اند روی محصولات B2B پیچیده — نقشه، تجارت الکترونیک و SaaS داده‌محور با React و Next.js. Feature-Sliced Design، میکروفرانت‌اند و تمرکز روی کارایی. تجربه در توسعه مبتنی بر هوش مصنوعی: Generative UI، ابزارهای MCP، جریان‌های عامل‌محور و SDKهای Vercel و OpenAI. تحصیلات: مهندسی کامپیوتر — دانشگاه فنی و حرفه‌ای تبریز، ۱۴۰۱ تا ۱۴۰۶.",
  },
  experience: [
    {
      title: {
        en: "Senior Frontend Developer",
        fa: "توسعه‌دهنده ارشد فرانت‌اند",
      },
      company: { en: "Bulut", fa: "بولوت" },
      period: {
        en: "June 2025 — Present",
        fa: "خرداد ۱۴۰۴ — اکنون",
      },
      summary: {
        en: "Enterprise ERP. Owner of Route Manager — an OptimoRoute-class logistics UI.",
        fa: "ERP سازمانی. مالک Route Manager — رابط لجستیکی در کلاس OptimoRoute.",
      },
      highlights: [
        {
          en: "Cut Route Manager memory usage by 70% while scaling to ~94 routes and ~3,700 invoices — clustering, virtualized timelines, narrow Zustand subscriptions, and parallel OSRM.",
          fa: "مصرف حافظه Route Manager را ۷۰٪ کم کرد، در حالی که مقیاس به حدود ۹۴ مسیر و ۳٬۷۰۰ فاکتور رسید — با خوشه‌بندی، تایم‌لاین مجازی، اشتراک‌های محدود Zustand و اجرای موازی OSRM.",
        },
        {
          en: "Designed the Sale Platform Admin architecture with an Nx monorepo and Rspack Module Federation: independent deploys, shared packages, faster incremental builds.",
          fa: "معماری پنل ادمین Sale Platform را با مونوریپوی Nx و Rspack Module Federation طراحی کرد: استقرار مستقل، پکیج‌های مشترک و بیلدهای افزایشی سریع‌تر.",
        },
        {
          en: "Separated product surfaces with FSD and shared UI contracts so features ship without a props monolith.",
          fa: "سطوح محصول را با FSD و قراردادهای UI مشترک جدا کرد تا فیچرها بدون props monolith عرضه شوند.",
        },
        {
          en: "Built the Customer Panel commerce flow (catalog, cart, orders) on TanStack Query with explicit cache and invalidation.",
          fa: "جریان خرید پنل مشتری (کاتالوگ، سبد، سفارش) را با TanStack Query پیاده کرد — با مدیریت صریح کش و invalidation.",
        },
        {
          en: "Standardized agentic AI development (Cursor/Claude skills and rules, plan-to-implement loops) so generated code stays aligned with FSD boundaries.",
          fa: "توسعه عامل‌محور با AI را استاندارد کرد (اسکیل‌ها و قوانین Cursor/Claude، چرخه plan-to-implement) تا کد تولیدی با مرزهای FSD هم‌راستا بماند.",
        },
        {
          en: "Built a company-wide icon pack with React component support.",
          fa: "پکیج آیکون سراسری شرکت را با پشتیبانی کامپوننت React ساخت.",
        },
      ],
    },
    {
      title: {
        en: "Freelance Frontend Developer",
        fa: "توسعه‌دهنده فریلنس فرانت‌اند",
      },
      company: { en: "Self-Employed", fa: "مستقل" },
      period: {
        en: "Feb 2025 — June 2025",
        fa: "اسفند ۱۴۰۳ — خرداد ۱۴۰۴",
      },
      summary: {
        en: "Frontend and web for client projects — idea to delivery.",
        fa: "فرانت‌اند و وب برای پروژه‌های مشتری — از ایده تا تحویل.",
      },
      highlights: [
        {
          en: "Built a realtime melted-gold trading platform for the Tabriz gold bazaar — live pricing and trades over WebSocket, no page refresh.",
          fa: "پلتفرم بلادرنگ خرید و فروش طلای آب‌شده برای بازار طلای تبریز — قیمت و معامله زنده با WebSocket، بدون رفرش صفحه.",
        },
        {
          en: "Shipped a full Next.js e-commerce site: App Router, SSR/SSG product routes, catalog, cart, and checkout.",
          fa: "فروشگاه اینترنتی کامل با Next.js: App Router، مسیرهای SSR/SSG محصول، کاتالوگ، سبد و تسویه حساب.",
        },
        {
          en: "Developed investisor.com with an admin panel (CKEditor), SSG/SSR rendering, and Server Actions for forms and mutations.",
          fa: "investisor.com با پنل ادمین (CKEditor)، رندر SSG/SSR و Server Actions برای فرم‌ها و تغییرات.",
        },
        {
          en: "Owned delivery end-to-end — from scoping to production-ready UI.",
          fa: "تحویل end-to-end — از تعیین محدوده تا UI آماده تولید.",
        },
      ],
    },
    {
      title: {
        en: "Senior Frontend Developer",
        fa: "توسعه‌دهنده ارشد فرانت‌اند",
      },
      company: {
        en: "PrimePropertyTurkey",
        fa: "PrimePropertyTurkey",
      },
      period: {
        en: "July 2024 — March 2025",
        fa: "تیر ۱۴۰۳ — اسفند ۱۴۰۳",
      },
      summary: {
        en: "Istanbul real-estate agency — buying, selling, and property investment.",
        fa: "آژانس املاک استانبول — خرید، فروش و سرمایه‌گذاری ملکی.",
      },
      highlights: [
        {
          en: "Built the public property platform in Next.js — page structure and data fetching for a large catalog.",
          fa: "پلتفرم عمومی املاک را با Next.js پیاده کرد — ساختار صفحات و واکشی داده برای کاتالوگ بزرگ.",
        },
        {
          en: "SSG/SSR loads thousands of properties in seconds — pre-rendered listing and detail routes.",
          fa: "با SSG/SSR هزاران ملک در چند ثانیه بارگذاری می‌شوند — مسیرهای فهرست و جزئیات از قبل رندر شده.",
        },
        {
          en: "Added i18n so buyers and investors browse one catalog in multiple languages, without separate sites.",
          fa: "چندزبانگی (i18n) اضافه کرد تا خریداران و سرمایه‌گذاران یک کاتالوگ را به چند زبان ببینند، بدون سایت جدا.",
        },
        {
          en: "Owned frontend delivery for listing search and property detail pages.",
          fa: "تحویل فرانت‌اند جست‌وجوی آگهی و صفحات جزئیات ملک را مالکیت داشت.",
        },
      ],
    },
  ],
  projects: [
    {
      name: { en: "Polyfed", fa: "Polyfed" },
      description: {
        en: "Open-source polyrepo Module Federation for React — thin Nx/Vite/Bun platform, on-demand remote checkouts, and a single registry that drives shell routes, nav, and remoteEntry resolution without cloning every team’s source.",
        fa: "پلتفرم متن‌باز پلی‌ریپو Module Federation برای React — شل نازک Nx/Vite/Bun، کلون درخواستی ریموت‌ها، و یک رجیستری واحد که مسیرها، ناوبری و remoteEntry را بدون کلون‌کردن سورس همه تیم‌ها هدایت می‌کند.",
      },
      tags: ["Nx", "Vite", "Module Federation", "Bun"],
      url: "https://github.com/AliNAbadian/polyfed",
    },
    {
      name: { en: "Route Manager", fa: "Route Manager" },
      description: {
        en: "OptimoRoute-class logistics UI: MapLibre map, multi-stop routing, scheduling, and WebGL micro-interactions — 70% memory improvement at 94 routes and 3,700 invoices.",
        fa: "رابط لجستیکی در کلاس OptimoRoute: نقشه MapLibre، مسیریابی چندتوقفی، زمان‌بندی و میکرواینترکشن WebGL — ۷۰٪ بهبود حافظه در مقیاس ۹۴ مسیر و ۳٬۷۰۰ فاکتور.",
      },
      tags: ["MapLibre", "WebGL", "Zustand", "OSRM"],
    },
    {
      name: {
        en: "Gold Trading Platform",
        fa: "پلتفرم معاملات طلا",
      },
      description: {
        en: "Realtime melted-gold marketplace for the Tabriz gold bazaar — live pricing and trades for buyers and sellers, without reloading.",
        fa: "بازار بلادرنگ طلای آب‌شده برای بازار طلای تبریز — قیمت و معامله زنده برای خریدار و فروشنده، بدون بارگذاری مجدد.",
      },
      tags: ["WebSockets", "Realtime UI", "Next.js"],
    },
    {
      name: {
        en: "Sale Platform Admin",
        fa: "پنل ادمین Sale Platform",
      },
      description: {
        en: "ERP micro-frontends on an Nx monorepo with Rspack Module Federation — independent remotes, shared runtime, isolated deploys.",
        fa: "میکروفرانت‌اندهای ERP روی مونوریپوی Nx با Rspack Module Federation — ریموت‌های مستقل، رانتایم مشترک، استقرار جدا.",
      },
      tags: ["Nx", "Module Federation", "FSD"],
    },
    {
      name: { en: "Investisor.com", fa: "Investisor.com" },
      description: {
        en: "Content and investment platform: admin panel, CKEditor editing, SSG/SSR, and Server Actions.",
        fa: "پلتفرم محتوا و سرمایه‌گذاری: پنل ادمین، ویرایش با CKEditor، SSG/SSR و Server Actions.",
      },
      tags: ["Next.js", "SSR/SSG", "Server Actions", "CKEditor"],
    },
  ],
  skills: [
    "React",
    "Next.js",
    "TypeScript",
    "Go",
    "FSD",
    "Micro-frontends",
    "Nx Monorepo",
    "Rspack Module Federation",
    "TanStack Query",
    "Zustand",
    "MapLibre",
    "WebGL",
    "GSAP",
    "Shadcn",
    "Generative UI",
    "MCP Tools",
    "Cursor / Claude",
    "Vercel AI SDK",
    "Technical Leadership",
    "System Thinking",
    "Problem Solving",
    "Cross-functional Collaboration",
    "Ownership",
    "Mentoring",
  ],
};
