import { useState, useEffect, useRef } from "react";

// ─── PALETTE ────────────────────────────────────────────────
const C = {
  // Dark sections (header, hero, footer, overlays)
  dark: "#0F172A",
  darkGrad: "linear-gradient(180deg, #0F172A 0%, #164E63 100%)",
  darkCard: "rgba(255,255,255,0.06)",
  darkBorder: "rgba(255,255,255,0.1)",
  darkText: "#FFFFFF",
  darkSecondary: "rgba(255,255,255,0.65)",
  darkMuted: "rgba(255,255,255,0.35)",
  // Light sections (body, cards)
  light: "#F4F7FA",
  card: "#FFFFFF",
  cardBorder: "rgba(15,23,42,0.07)",
  lightText: "#0F172A",
  lightSecondary: "#475569",
  lightMuted: "#94A3B8",
  // Brand
  cyan: "#22D3EE",
  teal: "#0891B2",
  tealDeep: "#0E7490",
  tealSubtle: "rgba(8,145,178,0.08)",
  tealGhost: "rgba(8,145,178,0.04)",
  // Tiers
  tierTopBg: "#0891B2",
  tierTopText: "#FFFFFF",
  tierMidBg: "rgba(8,145,178,0.1)",
  tierMidText: "#0891B2",
  tierLowBg: "#E2E8F0",
  tierLowText: "#475569",
  // Functional
  slate100: "#F1F5F9",
  slate200: "#E2E8F0",
};

// ─── FONTS ──────────────────────────────────────────────────
const F = {
  display: "'Clash Display', 'Outfit', sans-serif",
  body: "'Outfit', sans-serif",
};

// ─── DATA ───────────────────────────────────────────────────
const UNION_BUSINESSES = [
  { name: "Kowalski's Markets", address: "1261 Grand Ave, St. Paul", category: "groceries", union: "UFCW Local 1189", distance: "0.8 mi", type: "Grocery", tier: "union-local", tierLabel: "Union & Local" },
  { name: "Kowalski's Markets", address: "30 Fairview Ave S, St. Paul", category: "groceries", union: "UFCW Local 1189", distance: "1.6 mi", type: "Grocery", tier: "union-local", tierLabel: "Union & Local" },
  { name: "Mississippi Market Co-op", address: "1500 W 7th St, St. Paul", category: "groceries", union: null, distance: "1.3 mi", type: "Grocery Co-op", tier: "local", tierLabel: "Local" },
  { name: "Mississippi Market Co-op", address: "622 Selby Ave, St. Paul", category: "groceries", union: null, distance: "0.9 mi", type: "Grocery Co-op", tier: "local", tierLabel: "Local" },
  { name: "Cub Foods", address: "1440 University Ave W, St. Paul", category: "groceries", union: "UFCW Local 1189", distance: "1.1 mi", type: "Grocery", tier: "union", tierLabel: "Union" },
  { name: "Lunds & Byerlys", address: "1650 W 7th St, St. Paul", category: "groceries", union: "UFCW Local 1189", distance: "1.4 mi", type: "Grocery", tier: "union", tierLabel: "Union" },
  { name: "Cub Foods", address: "1201 Larpenteur Ave W, Roseville", category: "groceries", union: "UFCW Local 1189", distance: "3.2 mi", type: "Grocery", tier: "union", tierLabel: "Union" },
  { name: "Lloyd's Pharmacy", address: "341 Snelling Ave S, St. Paul", category: "pharmacy", union: null, distance: "1.0 mi", type: "Pharmacy", tier: "local", tierLabel: "Local" },
  { name: "Setzer Pharmacy", address: "1685 W 7th St, St. Paul", category: "pharmacy", union: null, distance: "1.5 mi", type: "Pharmacy", tier: "local", tierLabel: "Local" },
  { name: "Cub Pharmacy", address: "1440 University Ave W, St. Paul", category: "pharmacy", union: "UFCW Local 1189", distance: "1.1 mi", type: "Pharmacy", tier: "union", tierLabel: "Union" },
  { name: "Green Goods", address: "512 Robert St N, St. Paul", category: "cannabis", union: "UFCW Local 1189", distance: "0.9 mi", type: "Dispensary", tier: "union-local", tierLabel: "Union & Local" },
  { name: "Nothing But Hemp", address: "1045 Payne Ave, St. Paul", category: "cannabis", union: null, distance: "2.4 mi", type: "CBD & Wellness", tier: "local", tierLabel: "Local" },
  { name: "Ace Hardware", address: "976 Payne Ave, St. Paul", category: "hardware", union: null, distance: "2.3 mi", type: "Hardware", tier: "local", tierLabel: "Local" },
  { name: "Como Park True Value", address: "785 Lexington Pkwy N, St. Paul", category: "hardware", union: null, distance: "2.8 mi", type: "Hardware", tier: "local", tierLabel: "Local" },
  { name: "Target", address: "1300 University Ave W, St. Paul", category: "general", union: "UFCW Local 1189", distance: "1.0 mi", type: "General Merchandise", tier: "union", tierLabel: "Union" },
  { name: "Affinity Plus Federal Credit Union", address: "175 W Lafayette Frontage Rd, St. Paul", category: "banking", union: null, distance: "0.7 mi", type: "Credit Union", tier: "local", tierLabel: "Local" },
  { name: "Hiway Federal Credit Union", address: "840 Westminster St, St. Paul", category: "banking", union: null, distance: "1.2 mi", type: "Credit Union", tier: "local", tierLabel: "Local" },
  { name: "Sunrise Banks", address: "2300 Como Ave, St. Paul", category: "banking", union: null, distance: "2.1 mi", type: "Community Bank", tier: "local", tierLabel: "Local" },
  { name: "Dogwood Coffee", address: "825 Carleton St, St. Paul", category: "coffee", union: null, distance: "0.6 mi", type: "Coffee Shop", tier: "local", tierLabel: "Local" },
  { name: "Claddagh Coffee", address: "459 Selby Ave, St. Paul", category: "coffee", union: null, distance: "0.8 mi", type: "Coffee Shop", tier: "local", tierLabel: "Local" },
  { name: "Roots Roasting", address: "1849 Marshall Ave, St. Paul", category: "coffee", union: null, distance: "1.4 mi", type: "Coffee Roaster", tier: "local", tierLabel: "Local" },
];

const TIER_ORDER = ["union-local", "union", "local"];

const TIER_STYLES = {
  "union-local": {
    border: C.teal, badge: C.tierTopBg, badgeText: C.tierTopText,
    label: "Union & Local",
    description: "Union workers. Locally owned. Profits stay here.",
  },
  union: {
    border: C.teal, badge: C.tierMidBg, badgeText: C.tierMidText,
    label: "Union",
    description: "Union workers with wages, benefits, and a voice on the job.",
  },
  local: {
    border: C.lightSecondary, badge: C.tierLowBg, badgeText: C.tierLowText,
    label: "Local",
    description: "Locally owned. Profits stay in your community.",
  },
};

const CATEGORY_MAP = {
  groceries: ["grocery", "groceries", "food", "produce", "meat", "milk", "bread", "eggs", "fruit", "vegetables", "snacks", "cereal", "cheese", "butter", "yogurt", "chicken", "beef", "fish"],
  pharmacy: ["pharmacy", "prescription", "medicine", "medication", "drug", "health", "vitamins", "supplements", "first aid", "cold medicine", "tylenol", "advil", "bandages"],
  cannabis: ["cannabis", "cbd", "dispensary", "marijuana", "weed", "thc", "edibles", "gummies", "vape", "tincture", "wellness", "cbd/cannabis"],
  hardware: ["hardware", "tools", "nails", "screws", "paint", "lumber", "drill", "hammer", "wrench", "plumbing", "electrical", "lightbulb", "batteries"],
  coffee: ["coffee", "cafe", "espresso", "latte", "cappuccino", "tea", "coffee shop"],
  banking: ["banking", "bank", "credit union", "checking", "savings", "loan", "mortgage", "financial"],
  general: ["general", "clothes", "electronics", "headphones", "office", "supplies", "household", "cleaning", "laundry", "detergent", "soap", "shampoo", "toothpaste", "paper towels", "trash bags"],
  fitness: ["fitness", "gym", "workout", "exercise", "yoga", "pilates", "crossfit", "training"],
};

const SHARE_MESSAGES = [
  (name) => `${name} just kept their money in St. Paul. That's how it starts. 🔄`,
  (name) => `${name} chose local. Somebody's small business just felt that. ✊`,
  (name) => `One purchase. One neighborhood. ${name} gets it. 🏠`,
  (name) => `${name} just voted with their wallet. No ballot required. 🗳️`,
  (name) => `${name} skipped the mega-corp. Their city thanks them. 🤝`,
];

function getRandomMessage(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getCurrentWeekNumber() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  return Math.floor((now - start) / (7 * 24 * 60 * 60 * 1000));
}

function getCommunityStats() {
  const base = { members: 162, businesses: 24 };
  const jitter = (getCurrentWeekNumber() * 7) % 50;
  return { members: base.members + jitter, businesses: base.businesses + (jitter % 8) };
}

function matchBusinesses(query) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  let matchedCategories = new Set();
  for (const [category, keywords] of Object.entries(CATEGORY_MAP)) {
    for (const keyword of keywords) {
      if (q.includes(keyword) || keyword.includes(q)) matchedCategories.add(category);
    }
  }
  let matched = matchedCategories.size === 0
    ? UNION_BUSINESSES.filter((b) => b.name.toLowerCase().includes(q) || b.type.toLowerCase().includes(q))
    : UNION_BUSINESSES.filter((b) => matchedCategories.has(b.category));
  return matched.sort((a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier));
}

// ─── ICONS ──────────────────────────────────────────────────
function MapPinIcon({ size = 14 }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>);
}
function SearchIcon() {
  return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>);
}
function ShieldIcon({ size = 13 }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>);
}
function HomeIcon({ size = 13 }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>);
}
function CheckIcon() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>);
}
function ShareIcon() {
  return (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>);
}
function CloseIcon() {
  return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);
}
function FlagIcon() {
  return (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>);
}

// ─── GLOBAL STYLES ──────────────────────────────────────────
const GLOBAL_CSS = `
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes cardIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
  @keyframes revealLine { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes countPulse { 0% { transform: scale(1); } 50% { transform: scale(1.02); } 100% { transform: scale(1); } }
  @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
  * { box-sizing: border-box; }
  input::placeholder { color: ${C.lightMuted}; }
`;

// ─── OVERLAY BASE ───────────────────────────────────────────
const overlayBase = {
  position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
  zIndex: 1000, display: "flex", flexDirection: "column",
  alignItems: "center", justifyContent: "center", padding: "24px",
  animation: "fadeIn 0.3s ease",
};

// ─── SHARE CARD ─────────────────────────────────────────────
function ShareCard({ business, userName, onClose }) {
  const tierStyle = TIER_STYLES[business.tier];
  const shareMessage = getRandomMessage(SHARE_MESSAGES)(userName);

  return (
    <div style={{ ...overlayBase, background: "rgba(15,23,42,0.92)", backdropFilter: "blur(12px)" }}>
      <button onClick={() => onClose(false)} style={{
        position: "absolute", top: "20px", right: "20px", background: "none",
        border: "none", cursor: "pointer", color: C.darkMuted, padding: "8px",
      }}><CloseIcon /></button>

      <div style={{
        width: "100%", maxWidth: "400px", aspectRatio: "4/5",
        background: C.dark, position: "relative", overflow: "hidden",
        animation: "cardIn 0.5s ease",
        boxShadow: `0 32px 100px rgba(0,0,0,0.5), 0 0 60px ${C.teal}11`,
        display: "flex", flexDirection: "column",
      }}>
        <div style={{ height: "3px", background: C.cyan, flexShrink: 0 }} />
        <div style={{ padding: "32px 32px 0", flexShrink: 0, textAlign: "center" }}>
          <div style={{
            fontFamily: F.display, fontSize: "18px", fontWeight: 700,
            color: C.darkText, textTransform: "uppercase", letterSpacing: "0.06em",
          }}>United We Spend</div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 32px" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontFamily: F.display, fontSize: "clamp(22px, 5vw, 28px)", fontWeight: 700,
              color: C.darkText, lineHeight: 1.2, marginBottom: "20px",
            }}>{shareMessage}</div>
            <div style={{
              fontFamily: F.body, fontSize: "14px", color: C.darkMuted, marginBottom: "8px",
            }}>by choosing</div>
            <div style={{
              fontFamily: F.body, fontSize: "20px", fontWeight: 700,
              color: C.darkText, marginBottom: "12px",
            }}>{business.name}</div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: C.darkCard, padding: "8px 16px",
              border: `1px solid ${C.darkBorder}`,
            }}>
              {business.tier === "union-local" && <><ShieldIcon size={12} /><HomeIcon size={12} /></>}
              {business.tier === "union" && <ShieldIcon size={12} />}
              {business.tier === "local" && <HomeIcon size={12} />}
              <span style={{
                fontFamily: F.body, fontSize: "11px", fontWeight: 700,
                color: C.cyan, textTransform: "uppercase", letterSpacing: "0.06em",
              }}>{tierStyle.label}</span>
            </div>
          </div>
        </div>

        <div style={{ padding: "0 32px 28px", flexShrink: 0, textAlign: "center" }}>
          <div style={{ borderTop: `1px solid ${C.darkBorder}`, paddingTop: "16px" }}>
            <div style={{
              fontFamily: F.body, fontSize: "14px", fontWeight: 700,
              color: C.darkText, letterSpacing: "0.02em",
            }}>Your money has power. Use it.</div>
            <div style={{
              fontFamily: F.body, fontSize: "12px", fontWeight: 600,
              color: C.darkMuted, textTransform: "uppercase",
              letterSpacing: "0.1em", marginTop: "8px",
            }}>unitedwespend.app</div>
          </div>
        </div>
        <div style={{ height: "3px", background: C.cyan, flexShrink: 0 }} />
      </div>

      <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
        <button onClick={() => onClose(true)} style={{
          background: C.teal, border: "none", padding: "14px 32px", cursor: "pointer",
          display: "flex", alignItems: "center", gap: "8px", color: "#FFFFFF",
          fontFamily: F.body, fontSize: "14px", fontWeight: 700,
          textTransform: "uppercase", letterSpacing: "0.06em",
        }}><ShareIcon /> Share</button>
        <button onClick={() => onClose(false)} style={{
          background: "transparent", border: `1px solid ${C.darkBorder}`,
          padding: "14px 24px", cursor: "pointer", color: C.darkMuted,
          fontFamily: F.body, fontSize: "14px", fontWeight: 700,
          textTransform: "uppercase", letterSpacing: "0.06em",
        }}>Done</button>
      </div>
    </div>
  );
}

// ─── DRUMROLL ───────────────────────────────────────────────
function Drumroll({ onComplete }) {
  const [countUp, setCountUp] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const stats = getCommunityStats();
  const villainTexts = [
    "Redirecting dollars...",
    "Measuring your impact...",
    "Making this shareable...",
  ];

  useEffect(() => {
    const target = stats.members;
    const duration = 2000;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCountUp(target); clearInterval(timer); }
      else setCountUp(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timers = [
      setTimeout(() => setVisibleLines(1), 300),
      setTimeout(() => setVisibleLines(2), 1100),
      setTimeout(() => setVisibleLines(3), 1900),
      setTimeout(() => setShowButton(true), 2500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <div style={{ ...overlayBase, background: "rgba(15,23,42,0.97)", zIndex: 999 }}>
      <div style={{ maxWidth: "500px", width: "100%", textAlign: "center" }}>
        <div style={{ marginBottom: "32px", minHeight: "120px" }}>
          {villainTexts.map((text, i) => (
            <div key={i} style={{
              fontFamily: F.display, fontSize: "clamp(22px, 5vw, 28px)", fontWeight: 700,
              color: i < visibleLines ? C.darkText : "transparent",
              fontStyle: "italic", lineHeight: 1.4, marginBottom: "8px",
              animation: i < visibleLines ? "revealLine 0.4s ease forwards" : "none",
            }}>{text}</div>
          ))}
        </div>
        <div style={{
          fontFamily: F.body, fontSize: "clamp(64px, 20vw, 100px)", fontWeight: 900,
          color: C.cyan, lineHeight: 1, animation: "countPulse 0.3s ease infinite",
        }}>{countUp.toLocaleString()}</div>
        <div style={{
          fontFamily: F.body, fontSize: "16px", color: C.darkSecondary,
          lineHeight: 1.5, marginTop: "8px",
        }}>shifted their spending to local businesses</div>
        {showButton && (
          <button onClick={onComplete} style={{
            marginTop: "32px", background: C.teal, border: "none",
            padding: "16px 32px", cursor: "pointer", fontFamily: F.body,
            fontSize: "15px", fontWeight: 700, color: "#FFFFFF",
            textTransform: "uppercase", letterSpacing: "0.06em",
            animation: "revealLine 0.4s ease forwards",
          }}>Let's Finish This →</button>
        )}
      </div>
    </div>
  );
}

// ─── OPT-IN SCREEN ──────────────────────────────────────────
function OptInScreen({ onSubmit, onSkip, optedIn, didShare }) {
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (phone.trim()) {
      setSubmitted(true);
      onSubmit(phone.trim());
      setTimeout(() => onSkip(), 1500);
    }
  };

  if (optedIn || submitted) {
    return (
      <div style={{ ...overlayBase, background: "rgba(15,23,42,0.97)", zIndex: 999 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontFamily: F.body, fontSize: "18px", fontWeight: 700,
            color: C.cyan, marginBottom: "24px",
          }}>✓ You're in. Good things coming.</div>
          <button onClick={onSkip} style={{
            background: C.teal, border: "none", padding: "14px 32px",
            cursor: "pointer", color: "#FFFFFF", fontFamily: F.body,
            fontSize: "14px", fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}>Continue</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...overlayBase, background: "rgba(15,23,42,0.97)", zIndex: 999 }}>
      <div style={{ maxWidth: "420px", width: "100%", textAlign: "center" }}>
        {didShare ? (
          <>
            <div style={{
              fontFamily: F.display, fontSize: "32px", fontWeight: 700,
              color: C.darkText, marginBottom: "20px",
            }}>Legend. 😎</div>
            <div style={{
              fontFamily: F.body, fontSize: "16px", color: C.darkSecondary,
              lineHeight: 1.7, marginBottom: "16px",
            }}>When you shared, you showed everyone that there's another way to spend. Some of them will try it. Some of them will share it. That's how local businesses survive.</div>
            <div style={{
              fontFamily: F.body, fontSize: "16px", color: C.darkText,
              lineHeight: 1.7, marginBottom: "32px", fontStyle: "italic",
            }}>Keep it up. Your city notices.</div>
            <div style={{
              fontFamily: F.body, fontSize: "16px", color: C.darkSecondary, marginBottom: "20px",
            }}>Can we stay in touch? One text per week, max. Weekly reminders and giveaways.</div>
          </>
        ) : (
          <>
            <div style={{
              fontFamily: F.display, fontSize: "28px", fontWeight: 700,
              color: C.darkText, marginBottom: "20px", lineHeight: 1.2,
            }}>You didn't share but we still love you.</div>
            <div style={{
              fontFamily: F.body, fontSize: "16px", color: C.darkSecondary,
              lineHeight: 1.7, marginBottom: "16px",
            }}>You totally nailed the important part.</div>
            <div style={{
              fontFamily: F.body, fontSize: "16px", color: C.darkSecondary,
              lineHeight: 1.7, marginBottom: "16px",
            }}>Do that once a week? That's hundreds of dollars a year that stay local. Multiply by everyone doing it? That's how economies actually change.</div>
            <div style={{
              fontFamily: F.body, fontSize: "16px", color: C.darkSecondary, marginBottom: "20px",
            }}>Can we stay in touch? One text per week, max. Weekly reminders and giveaways.</div>
          </>
        )}
        <div style={{
          display: "flex", maxWidth: "360px", margin: "0 auto",
          background: C.darkCard, border: `1px solid ${C.darkBorder}`, overflow: "hidden",
        }}>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="(612) 555-0000"
            style={{
              flex: 1, padding: "14px 16px", border: "none", outline: "none",
              fontFamily: F.body, fontSize: "15px", color: C.darkText, background: "transparent",
            }}
          />
          <button onClick={handleSubmit} style={{
            background: C.teal, border: "none", padding: "14px 24px",
            cursor: "pointer", color: "#FFFFFF", fontFamily: F.body,
            fontSize: "13px", fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.06em", whiteSpace: "nowrap",
          }}>I'm In</button>
        </div>
        <button onClick={onSkip} style={{
          background: "none", border: "none", cursor: "pointer",
          fontFamily: F.body, fontSize: "14px", color: C.darkMuted,
          marginTop: "20px", padding: "12px 24px",
        }}>{didShare ? "Maybe later" : "I'm good"}</button>
      </div>
    </div>
  );
}

// ─── LOCATION MODAL ─────────────────────────────────────────
function LocationModal({ onClose }) {
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (email.trim()) { setSubmitted(true); setTimeout(() => onClose(), 2000); }
  };

  const inputStyle = {
    width: "100%", padding: "14px 16px", marginBottom: "12px",
    border: `1px solid ${C.darkBorder}`, outline: "none",
    background: C.darkCard, fontFamily: F.body, fontSize: "15px",
    color: C.darkText, boxSizing: "border-box",
  };

  return (
    <div style={{ ...overlayBase, background: "rgba(15,23,42,0.92)", backdropFilter: "blur(12px)" }}>
      <button onClick={onClose} style={{
        position: "absolute", top: "20px", right: "20px", background: "none",
        border: "none", cursor: "pointer", color: C.darkMuted, padding: "8px",
      }}><CloseIcon /></button>

      <div style={{ maxWidth: "400px", width: "100%", textAlign: "center" }}>
        {submitted ? (
          <>
            <div style={{ fontFamily: F.display, fontSize: "28px", fontWeight: 700, color: C.darkText, marginBottom: "16px" }}>
              You're on the list. 🎉
            </div>
            <div style={{ fontFamily: F.body, fontSize: "16px", color: C.darkSecondary, lineHeight: 1.6 }}>
              We'll let you know when we launch near you.
            </div>
          </>
        ) : (
          <>
            <div style={{ fontFamily: F.display, fontSize: "28px", fontWeight: 700, color: C.darkText, marginBottom: "12px", lineHeight: 1.2 }}>
              We're in the Twin Cities. For now.
            </div>
            <div style={{ fontFamily: F.body, fontSize: "16px", color: C.darkSecondary, lineHeight: 1.6, marginBottom: "32px" }}>
              Not your city? Tell us where you are and we'll let you know when we get there.
            </div>
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Your city or ZIP" style={inputStyle} />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Email address" style={{ ...inputStyle, marginBottom: "20px" }}
            />
            <button onClick={handleSubmit} style={{
              width: "100%", background: C.teal, border: "none", padding: "14px 24px",
              cursor: "pointer", color: "#FFFFFF", fontFamily: F.body,
              fontSize: "14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
            }}>Let Me Know →</button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── REQUEST MODAL ──────────────────────────────────────────
function RequestModal({ onClose }) {
  const [business, setBusiness] = useState("");
  const [category, setCategory] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (email.trim()) { setSubmitted(true); setTimeout(() => onClose(), 2000); }
  };

  const inputStyle = {
    width: "100%", padding: "14px 16px", marginBottom: "12px",
    border: `1px solid ${C.darkBorder}`, outline: "none",
    background: C.darkCard, fontFamily: F.body, fontSize: "15px",
    color: C.darkText, boxSizing: "border-box",
  };

  return (
    <div style={{ ...overlayBase, background: "rgba(15,23,42,0.92)", backdropFilter: "blur(12px)" }}>
      <button onClick={onClose} style={{
        position: "absolute", top: "20px", right: "20px", background: "none",
        border: "none", cursor: "pointer", color: C.darkMuted, padding: "8px",
      }}><CloseIcon /></button>

      <div style={{ maxWidth: "400px", width: "100%", textAlign: "center" }}>
        {submitted ? (
          <>
            <div style={{ fontFamily: F.display, fontSize: "28px", fontWeight: 700, color: C.darkText, marginBottom: "16px" }}>Got it. 👍</div>
            <div style={{ fontFamily: F.body, fontSize: "16px", color: C.darkSecondary, lineHeight: 1.6 }}>We'll let you know when we add it.</div>
          </>
        ) : (
          <>
            <div style={{ fontFamily: F.display, fontSize: "28px", fontWeight: 700, color: C.darkText, marginBottom: "12px", lineHeight: 1.2 }}>Help us build this.</div>
            <div style={{ fontFamily: F.body, fontSize: "16px", color: C.darkSecondary, lineHeight: 1.6, marginBottom: "32px" }}>Tell us what's missing and we'll add it.</div>
            <input type="text" value={business} onChange={(e) => setBusiness(e.target.value)} placeholder="Business name (optional)" style={inputStyle} />
            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category (e.g., auto repair, bakery)" style={inputStyle} />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Email address" style={{ ...inputStyle, marginBottom: "20px" }}
            />
            <button onClick={handleSubmit} style={{
              width: "100%", background: C.teal, border: "none", padding: "14px 24px",
              cursor: "pointer", color: "#FFFFFF", fontFamily: F.body,
              fontSize: "14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
            }}>Send Request →</button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── FAQ ────────────────────────────────────────────────────
function FAQAccordion({ onRequestBusiness }) {
  const [openIndex, setOpenIndex] = useState(null);
  const faqs = [
    { q: "How does this work?", a: "Search for what you need. See options ranked by how much your dollar does for your community. Tap \"I'm Shopping Here\" to commit and share." },
    { q: "Does this actually make a difference?", a: "When you spend $100 at a local business, roughly $68 stays in your community. Spend that same $100 at a national chain, and only $43 stays. Do that once a week, and you've redirected over $1,300 a year back into your neighborhood. Now multiply that by everyone using this app." },
    { q: "Is this political?", a: "No. It's economics. This isn't about who you vote for, it's about where your money goes. And you get to decide that right here and right now." },
    { q: "What's the catch?", a: "No catch. 73 cents of every dollar is a problem worth solving. We can't change that but you can. And you and your community will benefit from it." },
    { q: "What if I can't find what I need?", a: "request" },
  ];

  return (
    <div style={{ marginBottom: "32px" }}>
      <h2 style={{
        fontFamily: F.body, fontSize: "12px", fontWeight: 700,
        color: C.teal, textTransform: "uppercase", letterSpacing: "0.1em",
        margin: "0 0 16px 0", borderBottom: `2px solid ${C.teal}`,
        paddingBottom: "12px",
      }}>FAQ</h2>
      {faqs.map((item, i) => (
        <div key={i} style={{ borderBottom: `1px solid ${C.cardBorder}` }}>
          <button onClick={() => setOpenIndex(openIndex === i ? null : i)}
            style={{
              width: "100%", padding: "14px 0", background: "none", border: "none",
              cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left",
            }}>
            <span style={{ fontFamily: F.body, fontSize: "15px", fontWeight: 600, color: C.lightText }}>{item.q}</span>
            <span style={{
              fontFamily: F.body, fontSize: "18px", fontWeight: 400, color: C.teal,
              transform: openIndex === i ? "rotate(45deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}>+</span>
          </button>
          {openIndex === i && (
            <div style={{
              padding: "0 0 14px 0", fontFamily: F.body, fontSize: "14px",
              color: C.lightSecondary, lineHeight: 1.6, animation: "fadeIn 0.2s ease",
            }}>
              {item.a === "request" ? (
                <>
                  We're building. Tell us what's missing.{" "}
                  <button onClick={onRequestBusiness} style={{
                    background: "none", border: "none", padding: 0, cursor: "pointer",
                    fontFamily: F.body, fontSize: "14px", color: C.teal,
                    fontWeight: 600, textDecoration: "underline",
                  }}>Request a business →</button>
                </>
              ) : item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── IMPACT DASHBOARD ───────────────────────────────────────
function ImpactDashboard({ userName, onClose }) {
  const mockData = {
    totalPowered: 12, businessesSupported: 6, streak: 4, topCategory: "Groceries",
    recentBusinesses: [
      { name: "Kowalski's Markets", count: 5, tier: "union-local" },
      { name: "Dogwood Coffee", count: 4, tier: "local" },
      { name: "Lloyd's Pharmacy", count: 2, tier: "local" },
      { name: "Green Goods", count: 1, tier: "union-local" },
    ],
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: C.light, zIndex: 1000, overflowY: "auto" }}>
      <header style={{ background: C.dark, borderBottom: `2px solid ${C.cyan}` }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={onClose} style={{
            background: "none", border: "none", color: C.darkMuted,
            fontFamily: F.body, fontSize: "14px", cursor: "pointer",
          }}>← Back</button>
          <span style={{
            fontFamily: F.body, fontSize: "13px", fontWeight: 700,
            color: C.darkText, textTransform: "uppercase", letterSpacing: "0.08em",
          }}>Your Impact</span>
          <div style={{ width: "50px" }} />
        </div>
      </header>

      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontFamily: F.body, fontSize: "16px", color: C.lightSecondary, marginBottom: "8px" }}>
            Look at you, {userName}.
          </div>
          <div style={{ fontFamily: F.display, fontSize: "56px", fontWeight: 700, color: C.teal, lineHeight: 1 }}>
            {mockData.totalPowered}
          </div>
          <div style={{ fontFamily: F.body, fontSize: "18px", color: C.lightSecondary, marginTop: "8px" }}>
            local businesses powered
          </div>
          <div style={{ fontFamily: F.body, fontSize: "14px", color: C.lightMuted, marginTop: "4px", fontStyle: "italic" }}>
            Not all heroes wear capes. Some just shop local.
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
          <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, padding: "24px", textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div style={{ fontFamily: F.body, fontSize: "36px", fontWeight: 900, color: C.teal }}>{mockData.businessesSupported}</div>
            <div style={{ fontFamily: F.body, fontSize: "14px", color: C.lightMuted }}>unique businesses</div>
          </div>
          <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, padding: "24px", textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div style={{ fontFamily: F.body, fontSize: "36px", fontWeight: 900, color: C.teal }}>{mockData.streak}</div>
            <div style={{ fontFamily: F.body, fontSize: "14px", color: C.lightMuted }}>week streak 🔥</div>
          </div>
        </div>

        <div style={{ background: C.dark, padding: "24px", textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontFamily: F.body, fontSize: "14px", color: C.darkSecondary, marginBottom: "8px" }}>You're in the top</div>
          <div style={{ fontFamily: F.display, fontSize: "48px", fontWeight: 700, color: C.cyan }}>15%</div>
          <div style={{ fontFamily: F.body, fontSize: "14px", color: C.darkSecondary }}>of people powering the local economy</div>
          <div style={{ fontFamily: F.body, fontSize: "12px", color: C.darkMuted, marginTop: "8px", fontStyle: "italic" }}>At this rate, your neighborhood's getting a raise.</div>
        </div>

        <h2 style={{
          fontFamily: F.body, fontSize: "12px", fontWeight: 700, color: C.teal,
          textTransform: "uppercase", letterSpacing: "0.1em",
          margin: "0 0 16px 0", borderBottom: `2px solid ${C.teal}`, paddingBottom: "12px",
        }}>Businesses You've Powered</h2>

        {mockData.recentBusinesses.map((biz, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "16px 0", borderBottom: `1px solid ${C.cardBorder}`,
          }}>
            <div>
              <div style={{ fontFamily: F.body, fontSize: "16px", fontWeight: 600, color: C.lightText }}>{biz.name}</div>
              <span style={{
                fontSize: "10px", fontFamily: F.body, fontWeight: 700,
                color: biz.tier === "union-local" ? C.tierTopText : C.tierMidText,
                background: biz.tier === "union-local" ? C.tierTopBg : C.tierMidBg,
                padding: "2px 8px", textTransform: "uppercase",
              }}>{biz.tier === "union-local" ? "Union & Local" : "Local"}</span>
            </div>
            <div style={{ fontFamily: F.body, fontSize: "14px", fontWeight: 600, color: C.lightMuted }}>{biz.count}x</div>
          </div>
        ))}

        <button style={{
          width: "100%", background: C.teal, border: "none", padding: "16px", marginTop: "32px",
          fontFamily: F.body, fontSize: "14px", fontWeight: 700, color: "#FFFFFF",
          textTransform: "uppercase", letterSpacing: "0.06em", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
        }}><ShareIcon /> Share Your Impact</button>
      </div>
    </div>
  );
}

// ─── BUSINESS CARD ──────────────────────────────────────────
function BusinessCard({ business, onCommit, committed }) {
  const tierStyle = TIER_STYLES[business.tier];
  const businessKey = `${business.name}-${business.address}`;

  return (
    <div style={{
      background: C.card, border: `1px solid ${C.cardBorder}`,
      borderLeft: `3px solid ${committed ? C.teal : tierStyle.border}`,
      padding: "20px 24px", marginBottom: "12px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      transition: "box-shadow 0.2s ease",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h3 style={{ fontFamily: F.body, fontSize: "17px", fontWeight: 700, color: C.lightText, margin: "0 0 5px 0" }}>
            {business.name}
          </h3>
          <div style={{
            display: "flex", alignItems: "center", gap: "5px",
            color: C.lightSecondary, fontSize: "14px", fontFamily: F.body, marginBottom: "10px",
          }}>
            <MapPinIcon size={12} />{business.address}
          </div>
        </div>
        <span style={{ fontFamily: F.body, fontSize: "13px", fontWeight: 600, color: C.lightMuted }}>
          {business.distance}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "14px" }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: "4px",
          background: tierStyle.badge, color: tierStyle.badgeText,
          fontSize: "10px", fontFamily: F.body, fontWeight: 700,
          padding: "4px 10px", textTransform: "uppercase", letterSpacing: "0.06em",
        }}>
          {business.tier === "union-local" && <><ShieldIcon /><HomeIcon /></>}
          {business.tier === "union" && <ShieldIcon />}
          {business.tier === "local" && <HomeIcon />}
          {tierStyle.label}
        </span>
        <span style={{
          display: "inline-flex", background: C.slate100, color: C.lightMuted,
          fontSize: "10px", fontFamily: F.body, fontWeight: 600,
          padding: "4px 10px", textTransform: "uppercase", letterSpacing: "0.05em",
        }}>{business.type}</span>
        {business.union && (
          <span style={{ fontSize: "12px", fontFamily: F.body, color: C.tealDeep, fontStyle: "italic" }}>
            {business.union}
          </span>
        )}
      </div>

      <button onClick={() => onCommit(businessKey, business)} style={{
        width: "100%",
        background: committed ? C.teal : "transparent",
        border: committed ? `2px solid ${C.teal}` : `2px solid ${C.teal}`,
        padding: "10px 16px", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
        color: committed ? "#FFFFFF" : C.teal,
        fontFamily: F.body, fontSize: "13px", fontWeight: 700,
        textTransform: "uppercase", letterSpacing: "0.06em",
        transition: "all 0.2s ease",
      }}>
        {committed ? <><CheckIcon /> Powered — Tap to Share</> : <><FlagIcon /> I'm Shopping Here</>}
      </button>
    </div>
  );
}

// ─── TIER LEGEND ────────────────────────────────────────────
function TierLegend() {
  return (
    <div style={{ display: "flex", gap: "16px", marginBottom: "20px", flexWrap: "wrap" }}>
      {TIER_ORDER.map((tier) => {
        const style = TIER_STYLES[tier];
        return (
          <div key={tier} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              width: "12px", height: "12px",
              background: tier === "union-local" ? C.teal : "transparent",
              border: `2px solid ${style.border}`,
            }} />
            <span style={{
              fontFamily: F.body, fontSize: "12px", fontWeight: 700,
              color: C.lightText, textTransform: "uppercase", letterSpacing: "0.04em",
            }}>{style.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── MAIN APP ───────────────────────────────────────────────
export default function UnitedWeSpend() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [commitments, setCommitments] = useState({});
  const [shareCard, setShareCard] = useState(null);
  const [showDrumroll, setShowDrumroll] = useState(false);
  const [drumrollBusiness, setDrumrollBusiness] = useState(null);
  const [showOptIn, setShowOptIn] = useState(false);
  const [didShare, setDidShare] = useState(false);
  const [showManifesto, setShowManifesto] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [optedIn, setOptedIn] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { setTimeout(() => setHeroVisible(true), 100); }, []);

  const handleSearch = () => {
    if (query.trim()) { setResults(matchBusinesses(query)); setSearched(true); }
  };
  const handleKeyDown = (e) => { if (e.key === "Enter") handleSearch(); };

  const quickSearches = [
    ["Coffee", "Groceries", "Hardware", "Banking"],
    ["Pharmacy", "Wellness", "Fitness", "CBD/Cannabis"],
  ];

  const handleQuickSearch = (term) => {
    setQuery(term);
    setResults(matchBusinesses(term));
    setSearched(true);
    setTimeout(() => { window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'smooth' }); }, 100);
  };

  const handleCommit = (key, business) => {
    if (commitments[key]) { setShareCard(business); }
    else { setCommitments((prev) => ({ ...prev, [key]: business })); setDrumrollBusiness(business); setShowDrumroll(true); }
  };

  const handleDrumrollComplete = () => { setShowDrumroll(false); setShareCard(drumrollBusiness); };
  const handleShareCardClose = (shared = false) => { setShareCard(null); setDidShare(shared); if (!optedIn) setShowOptIn(true); };
  const handleOptIn = (phone) => { setOptedIn(true); };
  const handleOptInClose = () => { setShowOptIn(false); setDidShare(false); };

  return (
    <div style={{ minHeight: "100vh", background: C.light, fontFamily: F.body }}>
      <link href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <style>{GLOBAL_CSS}</style>

      {/* Overlays */}
      {showDrumroll && <Drumroll onComplete={handleDrumrollComplete} />}
      {shareCard && <ShareCard business={shareCard} userName="Sarah" onClose={handleShareCardClose} />}
      {showOptIn && <OptInScreen optedIn={optedIn} onSubmit={handleOptIn} onSkip={handleOptInClose} didShare={didShare} />}
      {showDashboard && <ImpactDashboard userName="Sarah" onClose={() => setShowDashboard(false)} />}
      {showLocationModal && <LocationModal onClose={() => setShowLocationModal(false)} />}
      {showRequestModal && <RequestModal onClose={() => setShowRequestModal(false)} />}

      {/* ─── HEADER (DARK) ─── */}
      <header style={{ background: C.dark, borderBottom: `2px solid ${C.cyan}` }}>
        <div style={{
          maxWidth: "800px", margin: "0 auto", padding: "14px 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <button
            onClick={() => { setSearched(false); setResults([]); setQuery(""); setCommitments({}); setShowDrumroll(false); setShowOptIn(false); setShareCard(null); setDidShare(false); }}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: F.display, fontSize: "18px", fontWeight: 700,
              color: C.darkText, letterSpacing: "-0.01em", textTransform: "uppercase",
            }}
          >United We Spend</button>
          <button onClick={() => setShowLocationModal(true)} style={{
            display: "flex", alignItems: "center", gap: "6px",
            background: "none", border: `1px solid ${C.darkBorder}`,
            cursor: "pointer", padding: "5px 10px", color: C.darkMuted,
          }}>
            <MapPinIcon size={12} />
            <span style={{ fontFamily: F.body, fontSize: "12px", fontWeight: 500 }}>Twin Cities, MN</span>
            <span style={{ fontSize: "9px", opacity: 0.5 }}>▼</span>
          </button>
        </div>
      </header>

      {/* ─── HERO (DARK GRADIENT) ─── */}
      <div style={{
        background: C.darkGrad, padding: "56px 24px 48px", textAlign: "center",
        opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(-10px)",
        transition: "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }}>
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <h1 style={{
            fontFamily: F.display, fontSize: "clamp(28px, 6vw, 46px)",
            fontWeight: 700, color: C.darkText, lineHeight: 1.1,
            margin: "0 0 20px 0", letterSpacing: "-0.03em",
          }}>
            Your money has power.<br /><span style={{ color: C.cyan }}>Use it.</span>
          </h1>

          <p style={{
            fontFamily: F.body, fontSize: "17px", color: C.darkSecondary,
            lineHeight: 1.6, margin: "0 0 12px 0", maxWidth: "500px",
            marginLeft: "auto", marginRight: "auto",
          }}>
            73 cents of every dollar leaves town. That's dumb. Let's fix it.
          </p>

          <button onClick={() => setShowManifesto(!showManifesto)} style={{
            background: "none", border: "none", cursor: "pointer",
            fontFamily: F.body, fontSize: "12px", fontWeight: 600,
            color: "rgba(255,255,255,0.85)", textTransform: "uppercase",
            letterSpacing: "0.1em", padding: "4px 0", marginBottom: "28px",
            borderBottom: `1px solid rgba(255,255,255,0.4)`,
          }}>
            {showManifesto ? "Close" : "👀 Wait, where does my money go?"}
          </button>

          {showManifesto && (
            <div style={{
              maxWidth: "520px", margin: "0 auto 28px", textAlign: "left",
              background: "rgba(0,0,0,0.25)", padding: "28px",
              border: `1px solid ${C.darkBorder}`,
              animation: "fadeUp 0.4s ease",
            }}>
              <p style={{ fontFamily: F.body, fontSize: "16px", color: C.slate200, lineHeight: 1.7, margin: "0 0 16px 0", fontStyle: "italic" }}>
                When you spend at a chain, 73 cents of every dollar leaves your city. Gone. It doesn't pay for your roads, your schools, or your neighbor's paycheck.
              </p>
              <p style={{ fontFamily: F.body, fontSize: "15px", color: C.darkSecondary, lineHeight: 1.7, margin: "0 0 16px 0" }}>
                When you spend local, that same dollar circulates 3–5x before it leaves. More jobs. More tax base. Better city. Same groceries.
              </p>
              <p style={{ fontFamily: F.body, fontSize: "15px", color: C.darkSecondary, lineHeight: 1.7, margin: "0 0 16px 0" }}>
                This isn't complicated but we get so busy we don't always think about the damaging effects of who we give our money to.
              </p>
              <p style={{ fontFamily: F.body, fontSize: "15px", color: C.darkSecondary, lineHeight: 1.7, margin: "0 0 20px 0" }}>
                Now you know. So what do you do about it?
              </p>
              <div style={{
                borderTop: `1px solid ${C.darkBorder}`, paddingTop: "16px",
                fontFamily: F.body, fontSize: "14px", fontWeight: 700,
                color: C.cyan, textAlign: "center", letterSpacing: "0.02em", lineHeight: 1.6,
              }}>Keep more of your money where you live.</div>
            </div>
          )}

          {/* Search bar */}
          <div style={{
            display: "flex", maxWidth: "520px", margin: "0 auto",
            background: C.card, overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
            border: `1px solid rgba(255,255,255,0.1)`,
          }}>
            <input ref={inputRef} type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What do you need? (groceries, pharmacy, CBD...)"
              style={{
                flex: 1, padding: "16px 20px", border: "none", outline: "none",
                fontFamily: F.body, fontSize: "15px", color: C.lightText, background: "transparent",
              }}
            />
            <button onClick={handleSearch} style={{
              background: C.teal, border: "none", padding: "16px 24px",
              cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", color: "#FFFFFF",
            }}><SearchIcon /></button>
          </div>

          {/* Quick search pills */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", justifyContent: "center", marginTop: "16px", alignItems: "center" }}>
            {quickSearches.map((row, ri) => (
              <div key={ri} style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap", alignItems: "center" }}>
                {ri === 0 && (
                  <span style={{
                    fontFamily: F.body, fontSize: "11px", fontWeight: 700,
                    color: C.darkMuted, textTransform: "uppercase",
                    letterSpacing: "0.08em", marginRight: "4px",
                  }}>Quick Search:</span>
                )}
                {row.map((term) => (
                  <button key={term} onClick={() => handleQuickSearch(term)} style={{
                    background: C.darkCard, border: `1px solid ${C.darkBorder}`,
                    color: C.darkSecondary, padding: "6px 14px", fontFamily: F.body,
                    fontSize: "13px", fontWeight: 600, cursor: "pointer",
                    transition: "border-color 0.2s ease",
                  }}>{term}</button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── BODY (LIGHT) ─── */}
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "32px 24px 64px" }}>
        {searched && results.length > 0 && (
          <>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "baseline",
              marginBottom: "16px", borderBottom: `2px solid ${C.teal}`, paddingBottom: "12px",
            }}>
              <h2 style={{
                fontFamily: F.body, fontSize: "12px", fontWeight: 700, color: C.teal,
                textTransform: "uppercase", letterSpacing: "0.1em", margin: 0,
              }}>
                {results.length} {results.length === 1 ? "Business" : "Businesses"} Found
              </h2>
              <span style={{ fontFamily: F.body, fontSize: "13px", color: C.lightMuted, fontStyle: "italic" }}>St. Paul, MN</span>
            </div>
            <TierLegend />
            {results.map((business) => (
              <BusinessCard
                key={`${business.name}-${business.address}`}
                business={business}
                onCommit={handleCommit}
                committed={!!commitments[`${business.name}-${business.address}`]}
              />
            ))}
            <div style={{
              background: C.tealSubtle, border: `1px solid ${C.cardBorder}`,
              padding: "20px 24px", marginTop: "24px", textAlign: "center",
            }}>
              <p style={{
                fontFamily: F.body, fontSize: "15px", color: C.lightSecondary,
                margin: "0 0 4px 0", lineHeight: 1.5,
              }}>Every purchase is a choice. You just chose your community.</p>
              <p style={{
                fontFamily: F.body, fontSize: "12px", color: C.teal, margin: 0,
                fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
              }}>Your money has power. Use it.</p>
            </div>
          </>
        )}

        {searched && results.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 24px" }}>
            <p style={{ fontFamily: F.body, fontSize: "18px", color: C.lightSecondary, marginBottom: "8px" }}>
              We're still building our directory for that category.
            </p>
            <p style={{ fontFamily: F.body, fontSize: "15px", color: C.lightMuted }}>
              Try searching for groceries, pharmacy, hardware, or CBD & wellness.
            </p>
          </div>
        )}

        {!searched && (
          <>
            <div style={{ marginBottom: "32px" }}>
              <h2 style={{
                fontFamily: F.body, fontSize: "12px", fontWeight: 700, color: C.teal,
                textTransform: "uppercase", letterSpacing: "0.1em",
                margin: "0 0 16px 0", borderBottom: `2px solid ${C.teal}`, paddingBottom: "12px",
              }}>How We Rate Businesses</h2>
              {TIER_ORDER.map((tier) => {
                const style = TIER_STYLES[tier];
                return (
                  <div key={tier} style={{
                    display: "flex", alignItems: "flex-start", gap: "12px",
                    padding: "12px 0", borderBottom: `1px solid ${C.cardBorder}`,
                  }}>
                    <div style={{
                      minWidth: "120px", display: "inline-flex", alignItems: "center", gap: "5px",
                      background: style.badge, color: style.badgeText, fontSize: "10px",
                      fontFamily: F.body, fontWeight: 700, padding: "4px 10px",
                      textTransform: "uppercase", letterSpacing: "0.06em", justifyContent: "center",
                    }}>
                      {tier === "union-local" && <><ShieldIcon /><HomeIcon /></>}
                      {tier === "union" && <ShieldIcon />}
                      {tier === "local" && <HomeIcon />}
                      {style.label}
                    </div>
                    <span style={{ fontFamily: F.body, fontSize: "14px", color: C.lightSecondary, lineHeight: 1.5 }}>
                      {style.description}
                    </span>
                  </div>
                );
              })}
            </div>
            <FAQAccordion onRequestBusiness={() => setShowRequestModal(true)} />
          </>
        )}
      </div>

      {/* ─── FOOTER (DARK) ─── */}
      <footer style={{ background: C.dark, borderTop: `2px solid ${C.cyan}`, padding: "32px 24px", textAlign: "center" }}>
        <div style={{
          fontFamily: F.body, fontSize: "13px", fontWeight: 700,
          color: C.darkText, textTransform: "uppercase",
          letterSpacing: "0.06em", marginBottom: "12px", lineHeight: 1.6,
        }}>Your money has power. Use it.</div>
        <div style={{ height: "1px", background: C.darkBorder, maxWidth: "200px", margin: "0 auto 12px" }} />
        <p style={{
          fontFamily: F.body, fontSize: "13px", color: "rgba(255,255,255,0.5)",
          margin: "0", letterSpacing: "0.05em",
        }}>
          A project of The Human Variable, LLC &middot; [ <span style={{ color: C.cyan }}>x</span> = human ]
        </p>
      </footer>
    </div>
  );
}