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

// Playful celebration messages
const SHARE_MESSAGES = [
  (name) => `A hedge fund manager just felt a chill. ${name}'s fault. ❄️`,
  (name) => `${name} just did something radical. ✊`,
  (name) => `${name} made a corporate earnings call 0.0001% sadder. 😢`,
  (name) => `${name} 1. Billionaires 0. 💪`,
  (name) => `${name} made Jeff Bezos cry. Okay, probably not. 🤷‍♀️`,
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
  return {
    members: base.members + jitter,
    businesses: base.businesses + (jitter % 8),
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

// Icons
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

// Playful Share Card
function ShareCard({ business, userName, onClose }) {
  const tierStyle = TIER_STYLES[business.tier];
  const shareMessage = getRandomMessage(SHARE_MESSAGES)(userName);

  const handleShare = () => {
    const text = `${shareMessage} By choosing ${business.name}. It's your money. It matters. #UnitedWeSpend`;
    if (navigator.share) {
      navigator.share({ text }).then(() => onClose(true)).catch(() => onClose(true));
    } else {
      navigator.clipboard.writeText(text).then(() => onClose(true)).catch(() => onClose(true));
    }
  };

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
      `}</style>

      <button onClick={() => onClose(false)} style={{
        position: "absolute", top: "20px", right: "20px", background: "none",
        border: "none", cursor: "pointer", color: "rgba(255,255,255,0.5)", padding: "8px",
      }}><CloseIcon /></button>

      <div style={{
        width: "100%", maxWidth: "400px", aspectRatio: "4/5",
        background: "#1B3A2D",
        position: "relative", overflow: "hidden",
        animation: "cardIn 0.5s ease",
        boxShadow: "0 32px 100px rgba(0,0,0,0.5)",
        display: "flex", flexDirection: "column",
      }}>
        <div style={{ height: "4px", background: "#C4362A", flexShrink: 0 }} />

        <div style={{
          padding: "32px 32px 0", flexShrink: 0,
          textAlign: "center",
        }}>
          <div style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "20px", fontWeight: 900, color: "#FFFFFF",
            textTransform: "uppercase", letterSpacing: "0.08em",
          }}>United We Spend</div>
        </div>

        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          justifyContent: "center", padding: "0 32px",
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(22px, 5vw, 28px)", fontWeight: 900,
              color: "#FFFFFF", lineHeight: 1.2,
              marginBottom: "20px",
            }}>
              {shareMessage}
            </div>

            <div style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: "14px", color: "rgba(255,255,255,0.5)",
              fontStyle: "italic", marginBottom: "8px",
            }}>
              by choosing
            </div>
            
            <div style={{
              fontFamily: "'Libre Franklin', sans-serif",
              fontSize: "20px", fontWeight: 900,
              color: "#FFFFFF", marginBottom: "12px",
            }}>
              {business.name}
            </div>
            
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "rgba(255,255,255,0.1)",
              padding: "8px 16px",
            }}>
              {business.tier === "union-local" && <><ShieldIcon size={12} /><HomeIcon size={12} /></>}
              {business.tier === "union" && <ShieldIcon size={12} />}
              {business.tier === "local" && <HomeIcon size={12} />}
              <span style={{
                fontFamily: "'Libre Franklin', sans-serif",
                fontSize: "11px", fontWeight: 700, color: "#FFFFFF",
                textTransform: "uppercase", letterSpacing: "0.06em",
              }}>{tierStyle.label}</span>
            </div>
          </div>
        </div>

        <div style={{
          padding: "0 32px 28px", flexShrink: 0,
          textAlign: "center",
        }}>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "16px" }}>
            <div style={{
              fontFamily: "'Libre Franklin', sans-serif",
              fontSize: "14px", fontWeight: 700, color: "#FFFFFF",
              letterSpacing: "0.02em",
            }}>
              It's your money. It matters.
            </div>
            <div style={{
              fontFamily: "'Libre Franklin', sans-serif",
              fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.3)",
              textTransform: "uppercase", letterSpacing: "0.1em",
              marginTop: "8px",
            }}>
              unitedwespend.app
            </div>
          </div>
        </div>

        <div style={{ height: "4px", background: "#C4362A", flexShrink: 0 }} />
      </div>

      <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
        <button
          onClick={handleShare}
          style={{
            background: "#C4362A", border: "none",
            padding: "14px 32px", cursor: "pointer",
            display: "flex", alignItems: "center", gap: "8px",
            color: "#FFFFFF", fontFamily: "'Libre Franklin', sans-serif",
            fontSize: "14px", fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}>
          <ShareIcon /> Share
        </button>
        <button
          onClick={() => onClose(false)}
          style={{
            background: "transparent", border: "1px solid rgba(255,255,255,0.25)",
            padding: "14px 24px", cursor: "pointer",
            color: "rgba(255,255,255,0.6)", fontFamily: "'Libre Franklin', sans-serif",
            fontSize: "14px", fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}>
          Done
        </button>
      </div>
    </div>
  );
}

// Drumroll - builds anticipation before share card
function Drumroll({ onComplete }) {
  const [countUp, setCountUp] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const stats = getCommunityStats();
  
  const villainTexts = [
    "Calculating billionaire tears...",
    "Measuring your impact...",
    "Making this shareable...",
  ];

  useEffect(() => {
    // Count up animation
    const target = stats.members;
    const duration = 2000;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCountUp(target);
        clearInterval(timer);
      } else {
        setCountUp(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Reveal lines one by one, then show button
    const timers = [
      setTimeout(() => setVisibleLines(1), 300),
      setTimeout(() => setVisibleLines(2), 1100),
      setTimeout(() => setVisibleLines(3), 1900),
      setTimeout(() => setShowButton(true), 2500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(27,58,45,0.97)", zIndex: 999,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "24px",
      animation: "fadeIn 0.3s ease",
    }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes revealLine { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes countPulse { 0% { transform: scale(1); } 50% { transform: scale(1.02); } 100% { transform: scale(1); } }
      `}</style>

      <div style={{ maxWidth: "500px", width: "100%", textAlign: "center" }}>
        {/* Villain texts - stacked reveal */}
        <div style={{ marginBottom: "32px", minHeight: "120px" }}>
          {villainTexts.map((text, i) => (
            <div 
              key={i}
              style={{
                fontFamily: "'Playfair Display', Georgia, serif", 
                fontSize: "clamp(22px, 5vw, 28px)",
                fontWeight: 900,
                color: i < visibleLines ? "#FFFFFF" : "transparent",
                fontStyle: "italic",
                lineHeight: 1.4,
                marginBottom: "8px",
                animation: i < visibleLines ? "revealLine 0.4s ease forwards" : "none",
              }}
            >
              {text}
            </div>
          ))}
        </div>

        {/* Counter */}
        <div style={{
          fontFamily: "'Libre Franklin', sans-serif",
          fontSize: "clamp(64px, 20vw, 100px)", fontWeight: 900,
          color: "#FFFFFF", lineHeight: 1,
          animation: "countPulse 0.3s ease infinite",
        }}>{countUp.toLocaleString()}</div>
        
        <div style={{
          fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "16px",
          color: "#C8D8C8", lineHeight: 1.5, marginTop: "8px",
        }}>
          shifted their spending to local businesses
        </div>

        {/* Button */}
        {showButton && (
          <button
            onClick={onComplete}
            style={{
              marginTop: "32px",
              background: "#C4362A",
              border: "none",
              padding: "16px 32px",
              cursor: "pointer",
              fontFamily: "'Libre Franklin', sans-serif",
              fontSize: "15px",
              fontWeight: 700,
              color: "#FFFFFF",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              animation: "revealLine 0.4s ease forwards",
            }}
          >
            Let's Finish This →
          </button>
        )}
      </div>
    </div>
  );
}

// Opt-in screen - shown after share card
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
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(27,58,45,0.97)", zIndex: 999,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "24px",
        animation: "fadeIn 0.3s ease",
      }}>
        <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontFamily: "'Libre Franklin', sans-serif", fontSize: "18px",
            fontWeight: 700, color: "#C4362A", marginBottom: "24px",
          }}>✓ You're in. Good things coming.</div>
          <button onClick={onSkip} style={{
            background: "#C4362A", border: "none", padding: "14px 32px",
            cursor: "pointer", color: "#FFFFFF",
            fontFamily: "'Libre Franklin', sans-serif", fontSize: "14px",
            fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
          }}>
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(27,58,45,0.97)", zIndex: 999,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "24px",
      animation: "fadeIn 0.3s ease",
    }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
      
      <div style={{ maxWidth: "420px", width: "100%", textAlign: "center" }}>
        {didShare ? (
          <>
            <div style={{
              fontFamily: "'Playfair Display', Georgia, serif", fontSize: "32px",
              fontWeight: 900, color: "#FFFFFF", marginBottom: "20px",
            }}>
              Legend. 😎
            </div>
            
            <div style={{
              fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "16px",
              color: "#C8D8C8", lineHeight: 1.7, marginBottom: "16px",
            }}>
              When you shared, you showed everyone that there's another way to spend. Some of them will try it. Some of them will share it. That's how local businesses survive.
            </div>
            
            <div style={{
              fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "16px",
              color: "#FFFFFF", lineHeight: 1.7, marginBottom: "32px", fontStyle: "italic",
            }}>
              Keep it up! Spirit Halloween is watching.
            </div>
            
            <div style={{
              fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "16px",
              color: "#C8D8C8", marginBottom: "20px",
            }}>
              Can we stay in touch? One text per week, max. Weekly reminders and giveaways.
            </div>
          </>
        ) : (
          <>
            <div style={{
              fontFamily: "'Playfair Display', Georgia, serif", fontSize: "28px",
              fontWeight: 900, color: "#FFFFFF", marginBottom: "20px", lineHeight: 1.2,
            }}>
              You didn't share but we still love you.
            </div>
            
            <div style={{
              fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "16px",
              color: "#C8D8C8", lineHeight: 1.7, marginBottom: "16px",
            }}>
              You totally nailed the important part. Every dollar you shift is a dollar that pays a local worker, stays in your neighborhood, builds something here instead of disappearing into a corporate balance sheet.
            </div>
            
            <div style={{
              fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "16px",
              color: "#C8D8C8", lineHeight: 1.7, marginBottom: "16px",
            }}>
              Do that once a week? That's hundreds of dollars a year that stay local. Multiply by everyone doing it? That's how economies actually change.
            </div>
            
            <div style={{
              fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "16px",
              color: "#C8D8C8", marginBottom: "20px",
            }}>
              Can we stay in touch? One text per week, max. Weekly reminders and giveaways.
            </div>
          </>
        )}

        <div style={{ display: "flex", maxWidth: "360px", margin: "0 auto", background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="(612) 555-0000"
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
            whiteSpace: "nowrap",
          }}>I'm In</button>
        </div>
        
        <button onClick={onSkip} style={{
          background: "none", border: "none", cursor: "pointer",
          fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "14px",
          color: "rgba(255,255,255,0.5)", marginTop: "20px", padding: "12px 24px",
        }}>
          {didShare ? "Maybe later" : "I'm good"}
        </button>
      </div>
    </div>
  );
}

// Location Modal - capture interest in new markets
function LocationModal({ onClose }) {
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (email.trim()) {
      setSubmitted(true);
      // Would send to backend
      setTimeout(() => onClose(), 2000);
    }
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.85)", zIndex: 1000,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "24px",
      animation: "fadeIn 0.3s ease",
    }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
      
      <button onClick={onClose} style={{
        position: "absolute", top: "20px", right: "20px", background: "none",
        border: "none", cursor: "pointer", color: "rgba(255,255,255,0.5)", padding: "8px",
      }}><CloseIcon /></button>

      <div style={{ maxWidth: "400px", width: "100%", textAlign: "center" }}>
        {submitted ? (
          <>
            <div style={{
              fontFamily: "'Playfair Display', Georgia, serif", fontSize: "28px",
              fontWeight: 900, color: "#FFFFFF", marginBottom: "16px",
            }}>
              You're on the list. 🎉
            </div>
            <div style={{
              fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "16px",
              color: "#C8D8C8", lineHeight: 1.6,
            }}>
              We'll let you know when we launch near you.
            </div>
          </>
        ) : (
          <>
            <div style={{
              fontFamily: "'Playfair Display', Georgia, serif", fontSize: "28px",
              fontWeight: 900, color: "#FFFFFF", marginBottom: "12px", lineHeight: 1.2,
            }}>
              We're in the Twin Cities. For now.
            </div>
            
            <div style={{
              fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "16px",
              color: "#C8D8C8", lineHeight: 1.6, marginBottom: "32px",
            }}>
              Not your city? Tell us where you are and we'll let you know when we get there.
            </div>

            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Your city or ZIP"
              style={{
                width: "100%", padding: "14px 16px", marginBottom: "12px",
                border: "none", outline: "none", background: "rgba(255,255,255,0.1)",
                fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "15px",
                color: "#FFFFFF", boxSizing: "border-box",
              }}
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Email address"
              style={{
                width: "100%", padding: "14px 16px", marginBottom: "20px",
                border: "none", outline: "none", background: "rgba(255,255,255,0.1)",
                fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "15px",
                color: "#FFFFFF", boxSizing: "border-box",
              }}
            />

            <button onClick={handleSubmit} style={{
              width: "100%", background: "#C4362A", border: "none", padding: "14px 24px",
              cursor: "pointer", color: "#FFFFFF",
              fontFamily: "'Libre Franklin', sans-serif", fontSize: "14px",
              fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
            }}>Let Me Know →</button>
          </>
        )}
      </div>
    </div>
  );
}

// Request Business Modal - capture missing business requests
function RequestModal({ onClose }) {
  const [business, setBusiness] = useState("");
  const [category, setCategory] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (email.trim()) {
      setSubmitted(true);
      // Would send to backend
      setTimeout(() => onClose(), 2000);
    }
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.85)", zIndex: 1000,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "24px",
      animation: "fadeIn 0.3s ease",
    }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
      
      <button onClick={onClose} style={{
        position: "absolute", top: "20px", right: "20px", background: "none",
        border: "none", cursor: "pointer", color: "rgba(255,255,255,0.5)", padding: "8px",
      }}><CloseIcon /></button>

      <div style={{ maxWidth: "400px", width: "100%", textAlign: "center" }}>
        {submitted ? (
          <>
            <div style={{
              fontFamily: "'Playfair Display', Georgia, serif", fontSize: "28px",
              fontWeight: 900, color: "#FFFFFF", marginBottom: "16px",
            }}>
              Got it. 👍
            </div>
            <div style={{
              fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "16px",
              color: "#C8D8C8", lineHeight: 1.6,
            }}>
              We'll let you know when we add it.
            </div>
          </>
        ) : (
          <>
            <div style={{
              fontFamily: "'Playfair Display', Georgia, serif", fontSize: "28px",
              fontWeight: 900, color: "#FFFFFF", marginBottom: "12px", lineHeight: 1.2,
            }}>
              Help us build this.
            </div>
            
            <div style={{
              fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "16px",
              color: "#C8D8C8", lineHeight: 1.6, marginBottom: "32px",
            }}>
              Tell us what's missing and we'll add it.
            </div>

            <input
              type="text"
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
              placeholder="Business name (optional)"
              style={{
                width: "100%", padding: "14px 16px", marginBottom: "12px",
                border: "none", outline: "none", background: "rgba(255,255,255,0.1)",
                fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "15px",
                color: "#FFFFFF", boxSizing: "border-box",
              }}
            />

            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category (e.g., auto repair, bakery)"
              style={{
                width: "100%", padding: "14px 16px", marginBottom: "12px",
                border: "none", outline: "none", background: "rgba(255,255,255,0.1)",
                fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "15px",
                color: "#FFFFFF", boxSizing: "border-box",
              }}
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Email address"
              style={{
                width: "100%", padding: "14px 16px", marginBottom: "20px",
                border: "none", outline: "none", background: "rgba(255,255,255,0.1)",
                fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "15px",
                color: "#FFFFFF", boxSizing: "border-box",
              }}
            />

            <button onClick={handleSubmit} style={{
              width: "100%", background: "#C4362A", border: "none", padding: "14px 24px",
              cursor: "pointer", color: "#FFFFFF",
              fontFamily: "'Libre Franklin', sans-serif", fontSize: "14px",
              fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
            }}>Send Request →</button>
          </>
        )}
      </div>
    </div>
  );
}

// FAQ Accordion
function FAQAccordion({ onRequestBusiness }) {
  const [openIndex, setOpenIndex] = useState(null);
  
  const faqs = [
    { q: "How does this work?", a: "Search for what you need. See options ranked by how much your dollar does for your community. Tap \"I'm Shopping Here\" to commit and share." },
    { q: "Does this actually do anything?", a: "Yes. Every dollar you shift stays local instead of leaving. Do it enough, the numbers change." },
    { q: "Is this woke? It seems woke.", a: "No. It's economics. It's about shifting our spending and creating a healthy balance so some of the money we earn and spend stays in our community." },
    { q: "What's the catch?", a: "No catch. 73 cents of every dollar is a problem worth solving. We can't change that but you can. And you and your community will benefit from it." },
    { q: "What if I can't find what I need?", a: "request" },
  ];

  return (
    <div style={{ marginBottom: "32px" }}>
      <h2 style={{ fontFamily: "'Libre Franklin', sans-serif", fontSize: "14px", fontWeight: 700, color: "#1B3A2D", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 16px 0", borderBottom: "2px solid #1B3A2D", paddingBottom: "12px" }}>
        FAQ
      </h2>
      {faqs.map((item, i) => (
        <div key={i} style={{ borderBottom: "1px solid #E8E2D6" }}>
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            style={{
              width: "100%", padding: "14px 0", background: "none", border: "none",
              cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center",
              textAlign: "left",
            }}
          >
            <span style={{ fontFamily: "'Libre Franklin', sans-serif", fontSize: "15px", fontWeight: 700, color: "#1B3A2D" }}>
              {item.q}
            </span>
            <span style={{ 
              fontFamily: "'Libre Franklin', sans-serif", fontSize: "18px", fontWeight: 400, color: "#1B3A2D",
              transform: openIndex === i ? "rotate(45deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}>
              +
            </span>
          </button>
          {openIndex === i && (
            <div style={{ 
              padding: "0 0 14px 0",
              fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "14px", color: "#5C5445", lineHeight: 1.5,
              animation: "fadeIn 0.2s ease",
            }}>
              {item.a === "request" ? (
                <>
                  We're building. Tell us what's missing.{" "}
                  <button 
                    onClick={onRequestBusiness}
                    style={{ 
                      background: "none", border: "none", padding: 0, cursor: "pointer",
                      fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "14px", 
                      color: "#C4362A", fontWeight: 600, textDecoration: "underline",
                    }}
                  >
                    Request a business →
                  </button>
                </>
              ) : item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Impact Dashboard
function ImpactDashboard({ userName, onClose }) {
  const mockData = {
    totalPowered: 12,
    businessesSupported: 6,
    streak: 4,
    topCategory: "Groceries",
    recentBusinesses: [
      { name: "Kowalski's Markets", count: 5, tier: "union-local" },
      { name: "Dogwood Coffee", count: 4, tier: "local" },
      { name: "Lloyd's Pharmacy", count: 2, tier: "local" },
      { name: "Green Goods", count: 1, tier: "union-local" },
    ],
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "#FAF8F3", zIndex: 1000,
      overflowY: "auto",
    }}>
      <header style={{ background: "#1B3A2D", borderBottom: "3px solid #C4362A" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={onClose} style={{
            background: "none", border: "none", color: "#A8BFA8",
            fontFamily: "'Libre Franklin', sans-serif", fontSize: "14px", cursor: "pointer",
          }}>← Back</button>
          <span style={{
            fontFamily: "'Libre Franklin', sans-serif", fontSize: "14px", fontWeight: 700,
            color: "#FFFFFF", textTransform: "uppercase", letterSpacing: "0.06em",
          }}>Your Impact</span>
          <div style={{ width: "50px" }} />
        </div>
      </header>

      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Hero stat */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: "16px", color: "#5C5445", marginBottom: "8px",
          }}>
            Look at you, {userName}.
          </div>
          <div style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "56px", fontWeight: 900, color: "#1B3A2D",
            lineHeight: 1,
          }}>
            {mockData.totalPowered}
          </div>
          <div style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: "18px", color: "#5C5445", marginTop: "8px",
          }}>
            local businesses powered
          </div>
          <div style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: "14px", color: "#8B7D6B", marginTop: "4px", fontStyle: "italic",
          }}>
            Not all heroes wear capes. Some just shop local.
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
          <div style={{ background: "#FFFFFF", border: "1px solid #D4C5A9", padding: "24px", textAlign: "center" }}>
            <div style={{ fontFamily: "'Libre Franklin', sans-serif", fontSize: "36px", fontWeight: 900, color: "#1B3A2D" }}>
              {mockData.businessesSupported}
            </div>
            <div style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "14px", color: "#8B7D6B" }}>
              unique businesses
            </div>
          </div>
          <div style={{ background: "#FFFFFF", border: "1px solid #D4C5A9", padding: "24px", textAlign: "center" }}>
            <div style={{ fontFamily: "'Libre Franklin', sans-serif", fontSize: "36px", fontWeight: 900, color: "#C4362A" }}>
              {mockData.streak}
            </div>
            <div style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "14px", color: "#8B7D6B" }}>
              week streak 🔥
            </div>
          </div>
        </div>

        {/* Community comparison */}
        <div style={{
          background: "#1B3A2D", padding: "24px", textAlign: "center",
          marginBottom: "32px",
        }}>
          <div style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: "14px", color: "#C8D8C8", marginBottom: "8px",
          }}>
            You're in the top
          </div>
          <div style={{
            fontFamily: "'Libre Franklin', sans-serif",
            fontSize: "48px", fontWeight: 900, color: "#FFFFFF",
          }}>
            15%
          </div>
          <div style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: "14px", color: "#C8D8C8",
          }}>
            of people powering the local economy
          </div>
          <div style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "8px", fontStyle: "italic",
          }}>
            At this rate, Bezos might have to sell a boat.
          </div>
        </div>

        {/* Businesses supported */}
        <h2 style={{
          fontFamily: "'Libre Franklin', sans-serif", fontSize: "14px", fontWeight: 700,
          color: "#1B3A2D", textTransform: "uppercase", letterSpacing: "0.08em",
          margin: "0 0 16px 0", borderBottom: "2px solid #1B3A2D", paddingBottom: "12px",
        }}>Businesses You've Powered</h2>

        {mockData.recentBusinesses.map((biz, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "16px 0", borderBottom: "1px solid #E8E2D6",
          }}>
            <div>
              <div style={{ fontFamily: "'Libre Franklin', sans-serif", fontSize: "16px", fontWeight: 600, color: "#1B3A2D" }}>
                {biz.name}
              </div>
              <span style={{
                fontSize: "10px", fontFamily: "'Libre Franklin', sans-serif", fontWeight: 700,
                color: biz.tier === "union-local" ? "#FFFFFF" : "#1B3A2D",
                background: biz.tier === "union-local" ? "#1B3A2D" : "#E8F0E8",
                padding: "2px 8px", textTransform: "uppercase",
              }}>
                {biz.tier === "union-local" ? "Union & Local" : "Local"}
              </span>
            </div>
            <div style={{ fontFamily: "'Libre Franklin', sans-serif", fontSize: "14px", fontWeight: 600, color: "#8B7D6B" }}>
              {biz.count}x
            </div>
          </div>
        ))}

        {/* Share button */}
        <button style={{
          width: "100%",
          background: "#C4362A",
          border: "none",
          padding: "16px",
          marginTop: "32px",
          fontFamily: "'Libre Franklin', sans-serif",
          fontSize: "14px", fontWeight: 700,
          color: "#FFFFFF",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}>
          <ShareIcon />
          Share Your Impact
        </button>
      </div>
    </div>
  );
}

// Business Card
function BusinessCard({ business, onCommit, committed }) {
  const tierStyle = TIER_STYLES[business.tier];
  const businessKey = `${business.name}-${business.address}`;

  return (
    <div style={{
      background: "#FFFFFF", border: "1px solid #D4C5A9",
      borderLeft: `4px solid ${committed ? "#C4362A" : tierStyle.border}`,
      padding: "20px 24px", marginBottom: "12px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h3 style={{ fontFamily: "'Libre Franklin', sans-serif", fontSize: "18px", fontWeight: 700, color: "#1B3A2D", margin: "0 0 6px 0" }}>
            {business.name}
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#5C5445", fontSize: "14px", fontFamily: "'Source Serif 4', Georgia, serif", marginBottom: "10px" }}>
            <MapPinIcon />{business.address}
          </div>
        </div>
        <span style={{ fontFamily: "'Libre Franklin', sans-serif", fontSize: "13px", fontWeight: 600, color: "#8B7D6B" }}>
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
        }}
      >
        {committed ? <><CheckIcon /> Powered — Tap to Share</> : <><FlagIcon /> I'm Shopping Here</>}
      </button>
    </div>
  );
}

// Tier Legend
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

// Main App
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

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 100);
  }, []);

  const handleSearch = () => {
    if (query.trim()) {
      setResults(matchBusinesses(query));
      setSearched(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const quickSearches = [
    ["Coffee", "Groceries", "Hardware", "Banking"],
    ["Pharmacy", "Wellness", "Fitness", "CBD/Cannabis"],
  ];

  const handleQuickSearch = (term) => {
    setQuery(term);
    setResults(matchBusinesses(term));
    setSearched(true);
    setTimeout(() => {
      window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'smooth' });
    }, 100);
  };

  const handleCommit = (key, business) => {
    if (commitments[key]) {
      setShareCard(business);
    } else {
      setCommitments((prev) => ({ ...prev, [key]: business }));
      setDrumrollBusiness(business);
      setShowDrumroll(true);
    }
  };

  const handleDrumrollComplete = () => {
    setShowDrumroll(false);
    setShareCard(drumrollBusiness);
  };

  const handleShareCardClose = (shared = false) => {
    setShareCard(null);
    setDidShare(shared);
    if (!optedIn) {
      setShowOptIn(true);
    }
  };

  const handleOptIn = (phone) => {
    setOptedIn(true);
  };

  const handleOptInClose = () => {
    setShowOptIn(false);
    setDidShare(false);
  };

  // Main App
  return (
    <div style={{ minHeight: "100vh", background: "#FAF8F3", fontFamily: "'Source Serif 4', Georgia, serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@400;600;700;900&family=Source+Serif+4:wght@400;600;700&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet" />

      {showDrumroll && (
        <Drumroll onComplete={handleDrumrollComplete} />
      )}

      {shareCard && (
        <ShareCard
          business={shareCard}
          userName="Sarah"
          onClose={handleShareCardClose}
        />
      )}

      {showOptIn && (
        <OptInScreen
          optedIn={optedIn}
          onSubmit={handleOptIn}
          onSkip={handleOptInClose}
          didShare={didShare}
        />
      )}

      {showDashboard && (
        <ImpactDashboard
          userName="Sarah"
          onClose={() => setShowDashboard(false)}
        />
      )}

      {showLocationModal && (
        <LocationModal onClose={() => setShowLocationModal(false)} />
      )}

      {showRequestModal && (
        <RequestModal onClose={() => setShowRequestModal(false)} />
      )}

      <header style={{ background: "#1B3A2D", borderBottom: "3px solid #C4362A" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button 
            onClick={() => { setSearched(false); setResults([]); setQuery(""); setCommitments({}); setShowDrumroll(false); setShowOptIn(false); setShareCard(null); setDidShare(false); }}
            style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Playfair Display', Georgia, serif", fontSize: "20px", fontWeight: 900, color: "#FFFFFF", letterSpacing: "-0.01em", textTransform: "uppercase" }}
          >United We Spend</button>
          <button 
            onClick={() => setShowLocationModal(true)}
            style={{ 
              display: "flex", alignItems: "center", gap: "6px",
              background: "none", border: "none", cursor: "pointer", padding: "4px 8px",
              color: "#A8BFA8", borderRadius: "4px",
              border: "1px solid rgba(168,191,168,0.3)",
            }}
          >
            <MapPinIcon />
            <span style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "13px", fontStyle: "italic" }}>Twin Cities, MN</span>
            <span style={{ fontSize: "10px", opacity: 0.6 }}>▼</span>
          </button>
        </div>
      </header>

      <div style={{
        background: "linear-gradient(180deg, #1B3A2D 0%, #2A5440 100%)", padding: "56px 24px 48px", textAlign: "center",
        opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(-10px)",
        transition: "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }}>
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px, 6vw, 44px)",
            fontWeight: 900, color: "#FFFFFF", lineHeight: 1.15, margin: "0 0 20px 0", letterSpacing: "-0.02em",
          }}>
            It's your money. <span style={{ color: "#C4362A" }}>It matters.</span>
          </h1>

          <p style={{
            fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "17px", color: "#C8D8C8",
            lineHeight: 1.6, margin: "0 0 12px 0", maxWidth: "500px", marginLeft: "auto", marginRight: "auto",
          }}>
            73 cents of every dollar leaves town. That's dumb. Fix it.
          </p>

          <button
            onClick={() => setShowManifesto(!showManifesto)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "'Libre Franklin', sans-serif", fontSize: "12px",
              fontWeight: 600, color: "#A8BFA8", textTransform: "uppercase",
              letterSpacing: "0.1em", padding: "4px 0", marginBottom: "28px",
              borderBottom: "1px solid rgba(168,191,168,0.3)",
            }}
          >
            {showManifesto ? "Close" : "Why this is important"}
          </button>

          {showManifesto && (
            <div style={{
              maxWidth: "520px", margin: "0 auto 28px", textAlign: "left",
              background: "rgba(0,0,0,0.2)", padding: "28px",
              animation: "fadeUp 0.4s ease",
            }}>
              <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
              <p style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "16px", color: "#E8E2D6", lineHeight: 1.7, margin: "0 0 16px 0", fontStyle: "italic" }}>
                Money that leaves shrinks your tax base.
              </p>
              <p style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "15px", color: "#C8D8C8", lineHeight: 1.7, margin: "0 0 16px 0" }}>
                Your community has to borrow from the state. The state has to borrow from the federal government. Each step of the way increases your taxes.
              </p>
              <p style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "15px", color: "#C8D8C8", lineHeight: 1.7, margin: "0 0 16px 0" }}>
                That's a problem. That's when some politicians start tacking on additional funding for their pet projects and donors.
              </p>
              <p style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "15px", color: "#C8D8C8", lineHeight: 1.7, margin: "0 0 20px 0" }}>
                Keep more money local, and you break that cycle. Schools get funded. Roads get fixed. Property values hold. Without the grift.
              </p>
              <div style={{
                borderTop: "1px solid rgba(168,191,168,0.3)", paddingTop: "16px",
                fontFamily: "'Libre Franklin', sans-serif", fontSize: "14px",
                fontWeight: 700, color: "#FFFFFF", textAlign: "center",
                letterSpacing: "0.02em", lineHeight: 1.6,
              }}>
                It's your money. It matters.
              </div>
            </div>
          )}

          <div style={{ display: "flex", maxWidth: "520px", margin: "0 auto", background: "#FFFFFF", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.2)" }}>
            <input ref={inputRef} type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleKeyDown}
              placeholder="What do you need? (groceries, pharmacy, CBD...)"
              style={{ flex: 1, padding: "16px 20px", border: "none", outline: "none", fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "16px", color: "#1B3A2D", background: "transparent" }}
            />
            <button onClick={handleSearch}
              style={{ background: "#C4362A", border: "none", padding: "16px 24px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF" }}
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
                      fontSize: "13px", fontWeight: 600, cursor: "pointer",
                    }}
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
            {results.map((business) => (
              <BusinessCard
                key={`${business.name}-${business.address}`}
                business={business}
                onCommit={handleCommit}
                committed={!!commitments[`${business.name}-${business.address}`]}
              />
            ))}
            <div style={{ background: "#F0EBE0", border: "1px solid #D4C5A9", padding: "20px 24px", marginTop: "24px", textAlign: "center" }}>
              <p style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "15px", color: "#5C5445", margin: "0 0 4px 0", lineHeight: 1.5 }}>
                Every purchase is a shift from the billionaire economy to yours.
              </p>
              <p style={{ fontFamily: "'Libre Franklin', sans-serif", fontSize: "12px", color: "#8B7D6B", margin: 0, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                It's your money. It matters.
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

            <FAQAccordion onRequestBusiness={() => setShowRequestModal(true)} />
          </>
        )}
      </div>

      <footer style={{ background: "#1B3A2D", borderTop: "3px solid #C4362A", padding: "32px 24px", textAlign: "center" }}>
        <div style={{
          fontFamily: "'Libre Franklin', sans-serif", fontSize: "13px",
          fontWeight: 700, color: "#FFFFFF", textTransform: "uppercase",
          letterSpacing: "0.06em", marginBottom: "12px", lineHeight: 1.6,
        }}>
          It's your money. It matters.
        </div>
        <div style={{ height: "1px", background: "rgba(168,191,168,0.2)", maxWidth: "200px", margin: "0 auto 12px" }} />
        <p style={{ fontFamily: "'Libre Franklin', sans-serif", fontSize: "11px", color: "#A8BFA8", margin: "0", letterSpacing: "0.05em" }}>
          A project of The Human Variable, LLC &middot; [ x=human ]
        </p>
      </footer>
    </div>
  );
}