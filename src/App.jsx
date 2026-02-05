import { useState, useEffect, useRef } from "react";

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
  "union-local": { border: "#1B3A2D", badge: "#1B3A2D", badgeText: "#FFFFFF", label: "Union & Local", description: "Union workers. Locally owned. Profits stay here." },
  union: { border: "#2A5440", badge: "#E8F0E8", badgeText: "#1B3A2D", label: "Union", description: "Union workers with wages, benefits, and a voice on the job." },
  local: { border: "#8B7D6B", badge: "#F0EBE0", badgeText: "#5C5445", label: "Local", description: "Locally owned. Profits stay in your community." },
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

function getCurrentWeekNumber() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  return Math.floor((now - start) / (7 * 24 * 60 * 60 * 1000));
}

// Simulated community data (would come from backend in production)
function getCommunityStats(category) {
  const base = { members: 127, redirected: 14200, businesses: 8 };
  const jitter = (getCurrentWeekNumber() * 7) % 50;
  return {
    members: base.members + jitter,
    redirected: base.redirected + (jitter * 85),
    businesses: base.businesses + (jitter % 4),
  };
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

function MapPinIcon() {
  return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>);
}
function SearchIcon() {
  return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>);
}
function ShieldIcon({ size = 14 }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>);
}
function HomeIcon({ size = 14 }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>);
}
function CheckIcon() {
  return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>);
}
function ShareIcon() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>);
}
function CloseIcon() {
  return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);
}
function FlagIcon() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>);
}

// Instagram-worthy shareable card
function ShareCard({ business, onClose, commitCount }) {
  const tierStyle = TIER_STYLES[business.tier];

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.85)", zIndex: 1000,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "24px",
      animation: "fadeIn 0.3s ease",
    }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes cardIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes lineGrow { from { width: 0; } to { width: 100%; } }
        @keyframes textReveal { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Close button outside card */}
      <button onClick={onClose} style={{
        position: "absolute", top: "20px", right: "20px", background: "none",
        border: "none", cursor: "pointer", color: "rgba(255,255,255,0.5)", padding: "8px",
        zIndex: 2, transition: "color 0.2s",
      }}
        onMouseEnter={(e) => e.currentTarget.style.color = "#FFFFFF"}
        onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
      ><CloseIcon /></button>

      {/* The card — designed as a 4:5 Instagram ratio */}
      <div style={{
        width: "100%", maxWidth: "400px", aspectRatio: "4/5",
        background: "#1B3A2D",
        position: "relative", overflow: "hidden",
        animation: "cardIn 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        boxShadow: "0 32px 100px rgba(0,0,0,0.5)",
        display: "flex", flexDirection: "column",
      }}>
        {/* Subtle texture overlay */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255,255,255,0.015) 2px,
            rgba(255,255,255,0.015) 4px
          )`,
          pointerEvents: "none", zIndex: 1,
        }} />

        {/* Top red accent bar */}
        <div style={{ height: "4px", background: "#C4362A", flexShrink: 0 }} />

        {/* UWS header — centered and prominent */}
        <div style={{
          padding: "32px 32px 0", flexShrink: 0, position: "relative", zIndex: 2,
          textAlign: "center",
          animation: "textReveal 0.6s ease 0.1s both",
        }}>
          <div style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "24px", fontWeight: 900, color: "#FFFFFF",
            textTransform: "uppercase", letterSpacing: "0.08em",
          }}>United We Spend</div>
        </div>

        {/* Center content — the main statement */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          justifyContent: "center", padding: "0 32px",
          position: "relative", zIndex: 2,
        }}>
          {/* Hero text — Your dollars. Your power. Your economy. */}
          <div style={{
            textAlign: "center",
            animation: "textReveal 0.6s ease 0.2s both",
          }}>
            <div style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(30px, 8vw, 42px)", fontWeight: 900,
              color: "#FFFFFF", lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}>
              Your dollars.<br />
              Your power.<br />
              <span style={{ color: "#C4362A" }}>Your economy.</span>
            </div>
          </div>

          {/* Divider line */}
          <div style={{
            height: "3px", background: "#C4362A", margin: "28px 0",
            animation: "lineGrow 0.8s ease 0.5s both",
          }} />

          {/* Business commitment */}
          <div style={{ textAlign: "center", animation: "textReveal 0.6s ease 0.7s both" }}>
            <div style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: "14px", color: "rgba(255,255,255,0.5)",
              marginBottom: "6px", fontStyle: "italic",
            }}>I'm shifting my spending to</div>
            <div style={{
              fontFamily: "'Libre Franklin', sans-serif",
              fontSize: "22px", fontWeight: 900, color: "#FFFFFF",
              letterSpacing: "-0.01em", marginBottom: "10px",
            }}>{business.name}</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "5px",
                background: "rgba(255,255,255,0.12)", color: "#FFFFFF",
                fontSize: "10px", fontFamily: "'Libre Franklin', sans-serif", fontWeight: 700,
                padding: "4px 10px", textTransform: "uppercase", letterSpacing: "0.06em",
                border: "1px solid rgba(255,255,255,0.15)",
              }}>
                {business.tier === "union-local" && <><ShieldIcon size={11} /><HomeIcon size={11} /></>}
                {business.tier === "union" && <ShieldIcon size={11} />}
                {business.tier === "local" && <HomeIcon size={11} />}
                {tierStyle.label}
              </span>
              <span style={{
                fontFamily: "'Source Serif 4', Georgia, serif",
                fontSize: "12px", color: "rgba(255,255,255,0.4)",
              }}>{business.address.split(',')[1]?.trim()}</span>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div style={{
          padding: "0 32px 28px", flexShrink: 0,
          position: "relative", zIndex: 2,
          textAlign: "center",
          animation: "textReveal 0.6s ease 0.9s both",
        }}>
          <div style={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: "16px",
          }}>
            <div style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: "14px", color: "rgba(255,255,255,0.5)",
              fontStyle: "italic", lineHeight: 1.5,
              marginBottom: "10px",
            }}>
              This economy belongs to all of us.
            </div>
            <div style={{
              fontFamily: "'Libre Franklin', sans-serif",
              fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.3)",
              textTransform: "uppercase", letterSpacing: "0.1em",
            }}>
              unitedwespend.us
            </div>
          </div>
        </div>

        {/* Bottom red accent bar */}
        <div style={{ height: "4px", background: "#C4362A", flexShrink: 0 }} />
      </div>

      {/* Action buttons below card */}
      <div style={{
        display: "flex", gap: "12px", marginTop: "24px",
        animation: "textReveal 0.6s ease 1s both",
      }}>
        <button
          onClick={() => {
            const text = `I'm shifting my spending from the billionaire economy to my economy. Starting with ${business.name}. Your dollars. Your power. Your economy. #UnitedWeSpend`;
            if (navigator.share) {
              navigator.share({ text }).catch(() => {});
            } else {
              navigator.clipboard.writeText(text).catch(() => {});
            }
          }}
          style={{
            background: "#C4362A", border: "none",
            padding: "14px 32px", cursor: "pointer",
            display: "flex", alignItems: "center", gap: "8px",
            color: "#FFFFFF", fontFamily: "'Libre Franklin', sans-serif",
            fontSize: "14px", fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.06em", transition: "background 0.2s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#A82D23"}
          onMouseLeave={(e) => e.currentTarget.style.background = "#C4362A"}
        >
          <ShareIcon /> Share
        </button>
        <button
          onClick={onClose}
          style={{
            background: "transparent", border: "1px solid rgba(255,255,255,0.25)",
            padding: "14px 24px", cursor: "pointer",
            color: "rgba(255,255,255,0.6)", fontFamily: "'Libre Franklin', sans-serif",
            fontSize: "14px", fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.06em", transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"; e.currentTarget.style.color = "#FFFFFF"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
        >
          Done
        </button>
      </div>
    </div>
  );
}

// Post-commitment impact reveal
function ImpactReveal({ business, streak, onOptIn, onSkip, optedIn }) {
  const [phase, setPhase] = useState(0); // 0: counting, 1: reveal, 2: opt-in
  const [countUp, setCountUp] = useState(0);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const tierStyle = TIER_STYLES[business.tier];
  const stats = getCommunityStats(business.category);
 

  useEffect(() => {
    // Animate count up
    const target = stats.members;
    const duration = 1200;
    const steps = 30;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCountUp(target);
        clearInterval(timer);
        setTimeout(() => setPhase(1), 400);
      } else {
        setCountUp(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (phase === 1) {
      const t = setTimeout(() => setPhase(2), 1500);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const handleSubmit = () => {
    if (email.trim()) {
      setSubmitted(true);
      onOptIn(email.trim());
      setTimeout(() => onSkip(), 1500);
    }
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(27,58,45,0.97)", zIndex: 999,
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "24px",
      overflowY: "auto",
      animation: "fadeIn 0.3s ease",
    }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes countPulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
        @keyframes revealUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes streakGlow { 0% { box-shadow: 0 0 0 0 rgba(196,54,42,0.4); } 70% { box-shadow: 0 0 0 12px rgba(196,54,42,0); } 100% { box-shadow: 0 0 0 0 rgba(196,54,42,0); } }
      `}</style>

      <div style={{ maxWidth: "420px", width: "100%", textAlign: "center" }}>
       

        {/* Your commitment */}
        <div style={{ animation: "revealUp 0.5s ease", marginBottom: "12px" }}>
          <div style={{
            fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "14px",
            color: "rgba(255,255,255,0.5)", fontStyle: "italic", marginBottom: "8px",
          }}>You just committed to</div>
          <div style={{
            fontFamily: "'Libre Franklin', sans-serif", fontSize: "22px",
            fontWeight: 900, color: "#FFFFFF", letterSpacing: "-0.01em", marginBottom: "8px",
          }}>{business.name}</div>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "5px",
            background: "rgba(255,255,255,0.12)", color: "#FFFFFF",
            fontSize: "10px", fontFamily: "'Libre Franklin', sans-serif", fontWeight: 700,
            padding: "4px 10px", textTransform: "uppercase", letterSpacing: "0.06em",
            border: "1px solid rgba(255,255,255,0.15)",
          }}>
            {business.tier === "union-local" && <><ShieldIcon size={11} /><HomeIcon size={11} /></>}
            {business.tier === "union" && <ShieldIcon size={11} />}
            {business.tier === "local" && <HomeIcon size={11} />}
            {tierStyle.label}
          </span>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "rgba(255,255,255,0.1)", margin: "28px 0" }} />

        {/* Community counter */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{
            fontFamily: "'Libre Franklin', sans-serif",
            fontSize: "clamp(48px, 12vw, 72px)", fontWeight: 900,
            color: "#FFFFFF", lineHeight: 1,
            animation: phase >= 1 ? "countPulse 0.5s ease" : "none",
          }}>{countUp.toLocaleString()}</div>
          <div style={{
            fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "16px",
            color: "#C8D8C8", lineHeight: 1.5, marginTop: "8px",
          }}>
            people in your community are<br />shifting their spending this week
          </div>
          {phase >= 1 && (
            <div style={{
              fontFamily: "'Libre Franklin', sans-serif", fontSize: "14px",
              fontWeight: 700, color: "#C4362A", marginTop: "12px",
              animation: "revealUp 0.4s ease",
            }}>
              Including you.
            </div>
          )}
        </div>

        {/* Estimated redirect */}
        {phase >= 1 && (
          <div style={{
            background: "rgba(0,0,0,0.2)", padding: "20px",
            marginBottom: "28px", animation: "revealUp 0.4s ease",
          }}>
            <div style={{
              fontFamily: "'Libre Franklin', sans-serif", fontSize: "28px",
              fontWeight: 900, color: "#FFFFFF", marginBottom: "4px",
            }}>${stats.redirected.toLocaleString()}</div>
            <div style={{
              fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "14px",
              color: "rgba(255,255,255,0.5)", fontStyle: "italic",
            }}>estimated redirected to local economy this week</div>
          </div>
        )}

        {/* Opt-in section */}
        {phase >= 2 && !optedIn && !submitted && (
          <div style={{ animation: "revealUp 0.5s ease" }}>
            <div style={{
              fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "17px",
              color: "#FFFFFF", lineHeight: 1.5, marginBottom: "20px",
            }}>
              Want to see this number grow?<br />
              <span style={{ color: "#C8D8C8", fontSize: "15px" }}>
                Get your weekly shift + community impact.
              </span>
            </div>
            <div style={{ display: "flex", maxWidth: "360px", margin: "0 auto", background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Email or phone number"
                style={{
                  flex: 1, padding: "14px 16px", border: "none", outline: "none",
                  fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "15px",
                  color: "#FFFFFF", background: "transparent",
                }}
              />
              <button onClick={handleSubmit} style={{
                background: "#C4362A", border: "none", padding: "14px 24px",
                cursor: "pointer", color: "#FFFFFF",
                fontFamily: "'Libre Franklin', sans-serif", fontSize: "13px",
                fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
                transition: "background 0.2s", whiteSpace: "nowrap",
              }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#A82D23"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#C4362A"}
              >Join</button>
            </div>
            <button onClick={onSkip} style={{
  background: "none", border: "1px solid rgba(255,255,255,0.3)", cursor: "pointer",
  fontFamily: "'Libre Franklin', sans-serif", fontSize: "14px", fontWeight: 600,
  color: "rgba(255,255,255,0.7)", marginTop: "20px", padding: "12px 24px",
  textTransform: "uppercase", letterSpacing: "0.05em",
}}>
  Skip for now
</button>
            <div style={{
              fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "11px",
              color: "rgba(255,255,255,0.2)", marginTop: "8px", lineHeight: 1.5,
            }}>
              Your shopping data is always anonymous. We only use contact info for weekly reminders.
            </div>
          </div>
        )}

        {/* Already opted in or just submitted */}
        {(phase >= 2 && (optedIn || submitted)) && (
          <div style={{ animation: "revealUp 0.4s ease" }}>
            {submitted && !optedIn && (
              <div style={{
                fontFamily: "'Libre Franklin', sans-serif", fontSize: "14px",
                fontWeight: 700, color: "#C4362A", marginBottom: "16px",
              }}>✓ You're in. See you next week.</div>
            )}
            <button onClick={onSkip} style={{
              background: "#C4362A", border: "none", padding: "14px 32px",
              cursor: "pointer", color: "#FFFFFF",
              fontFamily: "'Libre Franklin', sans-serif", fontSize: "14px",
              fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
              display: "inline-flex", alignItems: "center", gap: "8px",
              transition: "background 0.2s",
            }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#A82D23"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#C4362A"}
            >
              <ShareIcon /> Share Your Commitment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function BusinessCard({ business, index, onCommit, committed }) {
  const [visible, setVisible] = useState(false);
  const tierStyle = TIER_STYLES[business.tier];
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  const businessKey = `${business.name}-${business.address}`;

  return (
    <div style={{
      opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)",
      transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      background: "#FFFFFF", border: "1px solid #D4C5A9",
      borderLeft: `4px solid ${committed ? "#C4362A" : tierStyle.border}`,
      padding: "20px 24px", marginBottom: "12px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h3 style={{ fontFamily: "'Libre Franklin', sans-serif", fontSize: "18px", fontWeight: 700, color: "#1B3A2D", margin: "0 0 6px 0", letterSpacing: "-0.01em" }}>
            {business.name}
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#5C5445", fontSize: "14px", fontFamily: "'Source Serif 4', Georgia, serif", marginBottom: "10px" }}>
            <MapPinIcon />{business.address}
          </div>
        </div>
        <span style={{ fontFamily: "'Libre Franklin', sans-serif", fontSize: "13px", fontWeight: 600, color: "#8B7D6B", whiteSpace: "nowrap", marginLeft: "16px" }}>
          {business.distance}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "14px" }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: "5px",
          background: tierStyle.badge, color: tierStyle.badgeText,
          fontSize: "11px", fontFamily: "'Libre Franklin', sans-serif", fontWeight: 700,
          padding: "4px 10px", textTransform: "uppercase", letterSpacing: "0.06em",
        }}>
          {business.tier === "union-local" && <><ShieldIcon /><HomeIcon /></>}
          {business.tier === "union" && <ShieldIcon />}
          {business.tier === "local" && <HomeIcon />}
          {tierStyle.label}
        </span>
        <span style={{
          display: "inline-flex", background: "#F7F5F0", color: "#8B7D6B",
          fontSize: "11px", fontFamily: "'Libre Franklin', sans-serif", fontWeight: 600,
          padding: "4px 10px", textTransform: "uppercase", letterSpacing: "0.05em",
        }}>
          {business.type}
        </span>
        {business.union && (
          <span style={{ fontSize: "12px", fontFamily: "'Source Serif 4', Georgia, serif", color: "#2A5440", fontStyle: "italic" }}>
            {business.union}
          </span>
        )}
      </div>

      <button
        onClick={() => onCommit(businessKey, business)}
        style={{
          width: "100%",
          background: committed ? "#1B3A2D" : "transparent",
          border: committed ? "2px solid #1B3A2D" : "2px solid #C4362A",
          padding: "10px 16px", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          color: committed ? "#FFFFFF" : "#C4362A",
          fontFamily: "'Libre Franklin', sans-serif", fontSize: "13px",
          fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          if (!committed) {
            e.currentTarget.style.background = "#C4362A";
            e.currentTarget.style.color = "#FFFFFF";
          }
        }}
        onMouseLeave={(e) => {
          if (!committed) {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#C4362A";
          }
        }}
      >
        {committed ? <><CheckIcon /> Committed — Tap to Share</> : <><FlagIcon /> I'm Shopping Here</>}
      </button>
    </div>
  );
}

function TierLegend() {
  return (
    <div style={{ display: "flex", gap: "16px", marginBottom: "20px", flexWrap: "wrap" }}>
      {TIER_ORDER.map((tier) => {
        const style = TIER_STYLES[tier];
        return (
          <div key={tier} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "12px", height: "12px", background: style.badge === "#1B3A2D" ? "#1B3A2D" : "transparent", border: `2px solid ${style.border}` }} />
            <span style={{ fontFamily: "'Libre Franklin', sans-serif", fontSize: "12px", fontWeight: 700, color: "#1B3A2D", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              {style.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function UnitedWeSpend() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [commitments, setCommitments] = useState({});
  const [shareCard, setShareCard] = useState(null);
  const [showManifesto, setShowManifesto] = useState(false);
  const [impactReveal, setImpactReveal] = useState(null);
  const [streak, setStreak] = useState(0);
  const [optedIn, setOptedIn] = useState(false);
  const inputRef = useRef(null);
  const currentWeek = getCurrentWeekNumber();

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 100);
    // Load streak from storage
    try {
      const streakData = localStorage.getItem("uws-streak");
      if (streakData) {
        const parsed = JSON.parse(streakData);
        if (parsed.lastWeek >= currentWeek - 1) {
          setStreak(parsed.count);
        }
      }
      const optData = localStorage.getItem("uws-opted-in");
      if (optData) setOptedIn(JSON.parse(optData));
      
    } catch (e) { /* first visit */ }
  }, []);

  const handleSearch = () => {
    if (query.trim()) { setResults(matchBusinesses(query)); setSearched(true); }
  };
  const handleKeyDown = (e) => { if (e.key === "Enter") handleSearch(); };
  const quickSearches = [
    ["Coffee", "Groceries", "Hardware", "Banking"],
    ["Pharmacy", "Wellness", "Fitness", "CBD/Cannabis"],
  ];
  const handleQuickSearch = (term) => { setQuery(term); setResults(matchBusinesses(term)); setSearched(true); };

  const commitCount = Object.keys(commitments).length;

  const handleCommit = (key, business) => {
    if (commitments[key]) {
      // Already committed — go straight to share
      setShareCard(business);
    } else {
      // New commitment — show impact reveal first
      const newCommitments = { ...commitments, [key]: business };
      setCommitments(newCommitments);

      // Update streak
      const newStreak = streak === 0 ? 1 : (currentWeek > 0 ? streak + 0 : streak); // streak increments weekly
      const streakCount = streak === 0 ? 1 : streak;
      setStreak(streakCount);

      // Persist
    

      setImpactReveal(business);
    }
  };

  const handleOptIn = (contact) => {
    setOptedIn(true);
    try {
      localStorage.setItem("uws-opted-in", JSON.stringify(true));
      localStorage.setItem("uws-contact", JSON.stringify({ contact, timestamp: Date.now() }));
    } catch (e) {}
  };

  const handleImpactDone = () => {
    const business = impactReveal;
    setImpactReveal(null);
    setShareCard(business);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FAF8F3", fontFamily: "'Source Serif 4', Georgia, serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@400;600;700;900&family=Source+Serif+4:wght@400;600;700&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet" />

      {shareCard && (
        <ShareCard
          business={shareCard}
          commitCount={commitCount}
          onClose={() => setShareCard(null)}
        />
      )}

      {impactReveal && (
        <ImpactReveal
          business={impactReveal}
          streak={streak}
          optedIn={optedIn}
          onOptIn={handleOptIn}
          onSkip={handleImpactDone}
        />
      )}

      <header style={{ background: "#1B3A2D", borderBottom: "3px solid #C4362A" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "20px", fontWeight: 900, color: "#FFFFFF", letterSpacing: "-0.01em", textTransform: "uppercase" }}>United We Spend</span>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "13px", color: "#A8BFA8", fontStyle: "italic" }}>Twin Cities, MN</span>
          </div>
        </div>
      </header>

      <div style={{
        background: "linear-gradient(180deg, #1B3A2D 0%, #2A5440 100%)", padding: "56px 24px 48px", textAlign: "center",
        opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(-10px)",
        transition: "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }}>
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(26px, 5vw, 40px)",
            fontWeight: 900, color: "#FFFFFF", lineHeight: 1.15, margin: "0 0 20px 0", letterSpacing: "-0.02em",
          }}>
            Your dollars. Your power.<br />Your economy.
          </h1>

          <p style={{
            fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "17px", color: "#C8D8C8",
            lineHeight: 1.6, margin: "0 0 12px 0", maxWidth: "500px", marginLeft: "auto", marginRight: "auto",
          }}>
            Stop feeding the billionaire economy. Start rebuilding yours.
          </p>

          <button
            onClick={() => setShowManifesto(!showManifesto)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "'Libre Franklin', sans-serif", fontSize: "12px",
              fontWeight: 600, color: "#A8BFA8", textTransform: "uppercase",
              letterSpacing: "0.1em", padding: "4px 0", marginBottom: "28px",
              borderBottom: "1px solid rgba(168,191,168,0.3)",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#FFFFFF"}
            onMouseLeave={(e) => e.currentTarget.style.color = "#A8BFA8"}
          >
            {showManifesto ? "Close" : "Why this matters"}
          </button>

          {showManifesto && (
            <div style={{
              maxWidth: "520px", margin: "0 auto 28px", textAlign: "left",
              background: "rgba(0,0,0,0.2)", padding: "28px",
              animation: "textReveal 0.4s ease",
            }}>
              <style>{`@keyframes textReveal { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
              <p style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "16px", color: "#E8E2D6", lineHeight: 1.7, margin: "0 0 16px 0", fontStyle: "italic" }}>
                The system isn't broken. It's working exactly the way it was designed to. Just not for you.
              </p>
              <p style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "15px", color: "#C8D8C8", lineHeight: 1.7, margin: "0 0 16px 0" }}>
                Seventy-three cents of every dollar you spend leaves your community, gone to the same handful of corporations that have been taking from your town for decades.
              </p>
              <p style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "15px", color: "#C8D8C8", lineHeight: 1.7, margin: "0 0 16px 0" }}>
                Both parties told you they'd fix it while taking money from those corporations.
              </p>
              <p style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "15px", color: "#C8D8C8", lineHeight: 1.7, margin: "0 0 16px 0" }}>
                We're done waiting on Washington.
              </p>
              <p style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "15px", color: "#C8D8C8", lineHeight: 1.7, margin: "0 0 20px 0" }}>
                You don't need a law. You don't need a movement. You just need to walk into a different store. When you shift even 10% of your spending to union shops or locally owned businesses, that money stays in your community instead of going to a bonus in a boardroom. That's how the American economy was built. That's how we rebuild it.
              </p>
              <div style={{
                borderTop: "1px solid rgba(168,191,168,0.3)", paddingTop: "16px",
                fontFamily: "'Libre Franklin', sans-serif", fontSize: "14px",
                fontWeight: 700, color: "#FFFFFF", textAlign: "center",
                letterSpacing: "0.02em", lineHeight: 1.6,
              }}>
                Your dollars. Your power. Your economy.
              </div>
            </div>
          )}

          <div style={{ display: "flex", maxWidth: "520px", margin: "0 auto", background: "#FFFFFF", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.2)" }}>
            <input ref={inputRef} type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleKeyDown}
              placeholder="What do you need? (groceries, pharmacy, CBD...)"
              style={{ flex: 1, padding: "16px 20px", border: "none", outline: "none", fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "16px", color: "#1B3A2D", background: "transparent" }}
            />
            <button onClick={handleSearch}
              style={{ background: "#C4362A", border: "none", padding: "16px 24px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", transition: "background 0.2s" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#A82D23"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#C4362A"}
            >
              <SearchIcon />
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", justifyContent: "center", marginTop: "16px", alignItems: "center" }}>
            {quickSearches.map((row, ri) => (
              <div key={ri} style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap", alignItems: "center" }}>
                {ri === 0 && (
                  <span style={{
                    fontFamily: "'Libre Franklin', sans-serif", fontSize: "11px",
                    fontWeight: 700, color: "rgba(255,255,255,0.35)",
                    textTransform: "uppercase", letterSpacing: "0.08em",
                    marginRight: "4px",
                  }}>Quick Search:</span>
                )}
                {row.map((term) => (
                  <button key={term} onClick={() => handleQuickSearch(term)}
                    style={{
                      background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
                      color: "#C8D8C8", padding: "6px 14px", fontFamily: "'Libre Franklin', sans-serif",
                      fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "#FFFFFF"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#C8D8C8"; }}
                  >{term}</button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "32px 24px 64px" }}>
        {searched && results.length > 0 && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "16px", borderBottom: "2px solid #1B3A2D", paddingBottom: "12px" }}>
              <h2 style={{ fontFamily: "'Libre Franklin', sans-serif", fontSize: "14px", fontWeight: 700, color: "#1B3A2D", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>
                {results.length} {results.length === 1 ? "Business" : "Businesses"} Found
              </h2>
              <span style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "13px", color: "#8B7D6B", fontStyle: "italic" }}>St. Paul, MN</span>
            </div>
            <TierLegend />
            {results.map((business, i) => (
              <BusinessCard
                key={`${business.name}-${business.address}`}
                business={business}
                index={i}
                onCommit={handleCommit}
                committed={!!commitments[`${business.name}-${business.address}`]}
              />
            ))}
            <div style={{ background: "#F0EBE0", border: "1px solid #D4C5A9", padding: "20px 24px", marginTop: "24px", textAlign: "center" }}>
              <p style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "15px", color: "#5C5445", margin: "0 0 4px 0", lineHeight: 1.5 }}>
                Every purchase is a shift from the billionaire economy to yours.
              </p>
              <p style={{ fontFamily: "'Libre Franklin', sans-serif", fontSize: "12px", color: "#8B7D6B", margin: 0, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Your dollars. Your power. Your economy.
              </p>
            </div>
          </>
        )}

        {searched && results.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 24px" }}>
            <p style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "18px", color: "#5C5445", marginBottom: "8px" }}>
              We're still building our directory for that category.
            </p>
            <p style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "15px", color: "#8B7D6B" }}>
              Try searching for groceries, pharmacy, hardware, or CBD & wellness.
            </p>
          </div>
        )}

        {!searched && (
          <>
            <div style={{ marginBottom: "32px" }}>
              <h2 style={{ fontFamily: "'Libre Franklin', sans-serif", fontSize: "14px", fontWeight: 700, color: "#1B3A2D", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 16px 0", borderBottom: "2px solid #1B3A2D", paddingBottom: "12px" }}>
                How We Rate Businesses
              </h2>
              {TIER_ORDER.map((tier) => {
                const style = TIER_STYLES[tier];
                return (
                  <div key={tier} style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "12px 0", borderBottom: "1px solid #E8E2D6" }}>
                    <div style={{
                      minWidth: "120px", display: "inline-flex", alignItems: "center", gap: "5px",
                      background: style.badge, color: style.badgeText, fontSize: "11px",
                      fontFamily: "'Libre Franklin', sans-serif", fontWeight: 700, padding: "4px 10px",
                      textTransform: "uppercase", letterSpacing: "0.06em", justifyContent: "center",
                    }}>
                      {tier === "union-local" && <><ShieldIcon /><HomeIcon /></>}
                      {tier === "union" && <ShieldIcon />}
                      {tier === "local" && <HomeIcon />}
                      {style.label}
                    </div>
                    <span style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "14px", color: "#5C5445", lineHeight: 1.4 }}>
                      {style.description}
                    </span>
                  </div>
                );
              })}
            </div>

            <div style={{ marginBottom: "32px" }}>
              <h2 style={{ fontFamily: "'Libre Franklin', sans-serif", fontSize: "14px", fontWeight: 700, color: "#1B3A2D", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 16px 0", borderBottom: "2px solid #1B3A2D", paddingBottom: "12px" }}>
                How It Works
              </h2>
              {[
                { step: "1", title: "Search for what you need", desc: "Groceries, pharmacy, hardware — whatever you'd normally buy." },
                { step: "2", title: "See your best options", desc: "Businesses ranked by how much your dollar does for your community." },
                { step: "3", title: "Tap \"I'm Shopping Here\"", desc: "Commit to the shift and share it. Every commitment builds the movement." },
              ].map((item) => (
                <div key={item.step} style={{ display: "flex", gap: "16px", padding: "14px 0", borderBottom: "1px solid #E8E2D6" }}>
                  <div style={{
                    minWidth: "36px", height: "36px", background: "#C4362A",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Libre Franklin', sans-serif", fontSize: "16px",
                    fontWeight: 900, color: "#FFFFFF",
                  }}>{item.step}</div>
                  <div>
                    <div style={{ fontFamily: "'Libre Franklin', sans-serif", fontSize: "15px", fontWeight: 700, color: "#1B3A2D", marginBottom: "2px" }}>
                      {item.title}
                    </div>
                    <div style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "14px", color: "#5C5445", lineHeight: 1.4 }}>
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
              {[
                { number: "$0.73", label: "Of every dollar\nleaves your community" },
                { number: "6x", label: "Local spending\nrecirculates 6x more" },
                { number: "10%", label: "The shift that\nchanges everything" },
              ].map((stat) => (
                <div key={stat.label} style={{ background: "#FFFFFF", border: "1px solid #D4C5A9", padding: "24px 16px", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Libre Franklin', sans-serif", fontSize: "28px", fontWeight: 900, color: "#1B3A2D", marginBottom: "6px" }}>{stat.number}</div>
                  <div style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "13px", color: "#8B7D6B", whiteSpace: "pre-line", lineHeight: 1.4 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <footer style={{ background: "#1B3A2D", borderTop: "3px solid #C4362A", padding: "32px 24px", textAlign: "center" }}>
        <div style={{
          fontFamily: "'Libre Franklin', sans-serif", fontSize: "13px",
          fontWeight: 700, color: "#FFFFFF", textTransform: "uppercase",
          letterSpacing: "0.06em", marginBottom: "12px", lineHeight: 1.6,
        }}>
          Your dollars. Your power. Your economy.
        </div>
        <div style={{ height: "1px", background: "rgba(168,191,168,0.2)", maxWidth: "200px", margin: "0 auto 12px" }} />
        <p style={{ fontFamily: "'Libre Franklin', sans-serif", fontSize: "11px", color: "#A8BFA8", margin: "0", letterSpacing: "0.05em" }}>
          A project of The Human Variable, LLC &middot; x=human
        </p>
      </footer>
    </div>
  );
}