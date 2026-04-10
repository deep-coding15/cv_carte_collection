import { useState, useRef, useEffect, useCallback } from "react";
import type { FC, ReactNode, MouseEvent } from "react";
import ReactDOM from "react-dom/client";
import { QRCodeSVG } from "qrcode.react";

/* ─── Types ─── */

interface Position {
  x: number;
  y: number;
}

interface StarProps {
  dim?: boolean;
}

type TagVariant = "purple" | "blue" | "pink" | "teal" | "amber" | "coral";

interface TagProps {
  variant?: TagVariant;
  children: ReactNode;
}

interface FrontProps {
  holoPos: Position | null;
  shinePos: Position | null;
}

interface SectionLabelProps {
  children: ReactNode;
}

interface StatCell {
  val: string;
  color: string;
  shadow: string;
  lbl: string;
}

interface Project {
  color: string;
  bg: string;
  name: string;
  desc: String[];
  tag: string;
}

interface TimelineEntry {
  year: string;
  color: string;
  shadow: string;
  title: string;
  sub: string;
}

interface TagEntry {
  variant: TagVariant;
  label: string;
}

interface ColorDef {
  color: string;
  border: string;
}

const numeroGitex = "#CODING-2026_15";

/* ─── Star ─── */

const Star: FC<StarProps> = ({ dim = false }) => (
  <div
    style={{
      width: 8,
      height: 8,
      background: dim ? "rgba(200,160,255,0.2)" : "#c8a0ff",
      clipPath:
        "polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)",
    }}
  />
);

/* ─── Tag ─── */

const COLORS: Record<TagVariant, ColorDef> = {
  purple: { color: "#b080ff", border: "rgba(160,80,255,0.35)" },
  blue:   { color: "#60c8ff", border: "rgba(60,180,255,0.35)" },
  pink:   { color: "#ff80c0", border: "rgba(255,80,160,0.35)" },
  teal:   { color: "#40e0b0", border: "rgba(60,200,160,0.35)" },
  amber:  { color: "#ffc060", border: "rgba(255,180,60,0.35)" },
  coral:  { color: "#ff9070", border: "rgba(255,120,80,0.35)" },
};

const Tag: FC<TagProps> = ({ variant = "purple", children }) => {
  const { color, border } = COLORS[variant];
  return (
    <span
      style={{
        fontFamily: "'Rajdhani', sans-serif",
        fontSize: 9,
        fontWeight: 600,
        letterSpacing: ".04em",
        padding: "2px 6px",
        borderRadius: 12,
        border: `1px solid ${border}`,
        color,
        whiteSpace: "nowrap",
        background: `${color}14`,
        display: "inline-block",
      }}
    >
      {children}
    </span>
  );
};

/* ─── Geo SVG background ─── */

const GeoBg: FC = () => (
  <svg
    width="320"
    height="560"
    viewBox="0 0 320 560"
    xmlns="http://www.w3.org/2000/svg"
    style={{ position: "absolute", inset: 0, zIndex: 0 }}
  >
    <defs>
      <pattern id="hex" x="0" y="0" width="40" height="46" patternUnits="userSpaceOnUse">
        <polygon
          points="20,2 38,12 38,34 20,44 2,34 2,12"
          fill="none"
          stroke="rgba(120,60,220,0.13)"
          strokeWidth="0.5"
        />
      </pattern>
    </defs>
    <rect width="320" height="560" fill="url(#hex)" />
    <polygon points="160,30 270,92 270,216 160,278 50,216 50,92"   fill="none" stroke="rgba(140,80,255,0.2)"  strokeWidth="1" />
    <polygon points="160,58 248,108 248,208 160,258 72,208 72,108"  fill="none" stroke="rgba(140,80,255,0.12)" strokeWidth="0.5" />
    <polygon points="160,5 295,78 295,240 160,313 25,240 25,78"    fill="none" stroke="rgba(140,80,255,0.07)" strokeWidth="0.5" />
    <line x1="160" y1="30"  x2="160" y2="278" stroke="rgba(160,100,255,0.07)" strokeWidth="0.5" />
    <line x1="50"  y1="92"  x2="270" y2="216" stroke="rgba(160,100,255,0.07)" strokeWidth="0.5" />
    <line x1="270" y1="92"  x2="50"  y2="216" stroke="rgba(160,100,255,0.07)" strokeWidth="0.5" />
    <circle cx="160" cy="154" r="5"  fill="rgba(160,100,255,0.35)" />
    <circle cx="160" cy="154" r="14" fill="none" stroke="rgba(160,100,255,0.14)" strokeWidth="0.5" />
    <circle cx="160" cy="154" r="26" fill="none" stroke="rgba(160,100,255,0.07)" strokeWidth="0.5" />
    <line x1="0" y1="300" x2="320" y2="300" stroke="rgba(160,100,255,0.08)" strokeWidth="0.5" strokeDasharray="4 4" />
    <polygon points="160,318 268,378 268,496 160,556 52,496 52,378" fill="none" stroke="rgba(80,160,255,0.06)" strokeWidth="0.5" />
  </svg>
);

/* ─── Data ─── */

const TAGS: TagEntry[] = [
  // Backend & Frameworks
  { variant: "blue",   label: "Spring Boot" },
  { variant: "blue",   label: "Java" },
  { variant: "blue",   label: "React.js" },
  { variant: "purple", label: "Laravel" },
  
  // Architecture & API
  { variant: "blue",   label: "API REST" },
  { variant: "blue",   label: "Systèmes distribués" },
  
  // Bases de données
  { variant: "teal",   label: "MySQL" },
  { variant: "teal",   label: "Oracle" },
  
  // DevOps & Cloud
  { variant: "coral",  label: "Docker" },
  { variant: "coral",  label: "CI/CD" },
  { variant: "coral",  label: "AWS EC2" },
  
  // Tests & Qualité
  { variant: "amber",  label: "TDD" },
  { variant: "amber",  label: "JUnit 5" },
  
  // Méthodologie & Design
  { variant: "purple", label: "Agile SCRUM" },
  { variant: "purple", label: "Clean Architecture" },
  
  // Outils
  { variant: "blue",   label: "Git" },
  { variant: "blue",   label: "Postman" },
];

const STATS: StatCell[] = [
  { val: "1+",   color: "#ffd060", shadow: "rgba(255,200,0,0.5)",  lbl: "Ans XP" },
  { val: "12+", color: "#60d0ff", shadow: "rgba(60,180,255,0.5)", lbl: "Projets (Aca & Pro)" },
  { val: "1",   color: "#ff80c0", shadow: "rgba(255,80,160,0.5)", lbl: "Startup" },
  { val: "3+",   color: "#6fe162", shadow: "rgba(255,80,160,0.5)", lbl: "Clients satisfaits" },
];

const PROJECTS: Project[] = [
  //{ color: "#ff60b0", bg: "rgba(255,80,160,0.15)",  name: "MentorMatch",    desc: "Plateforme mentor/mentee · Next.js + Laravel + MySQL", tag: "Startup · En cours" },
  { color: "#40c0ff", bg: "rgba(60,180,255,0.15)",  name: "Ges'Stock",      desc: ["Plateforme web de gestion de stocks · Spring Boot + React + MySQL", "Architecture conteneurisée avec Docker", "Gestion centralisée des commandes et inventaires", "Déploiement sur environnement cloud"], tag: "Startup · En cours" },
  { color: "#40e0b0", bg: "rgba(60,200,160,0.15)",  name: "ChriOnline", desc: ["Plateforme desktop d'e-commerce · Java + TCP Sockets", "Base de données MySQL et PostgreSQL", "Gestion complète des transactions et utilisateurs"],  tag: "FullStack · MVP" },
];

const TIMELINE: TimelineEntry[] = [
  { year: "2026", color: "#ff60b0", shadow: "rgba(255,80,160,0.6)",  title: "Lancement de Ges'Stock ─ Application de gestion des stocks",      sub: "BMC · MVP scoping · Go-to-market" },
  { year: "2025", color: "#40c0ff", shadow: "rgba(60,180,255,0.6)",  title: "EIS CLUB",    sub: "Trésorière à l'EIS CLUB" },
  { year: "2022", color: "#a060ff", shadow: "rgba(160,80,255,0.6)",  title: "ENSA Tétouan — Génie Info",  sub: "Cycle ingénieur · Backend + devops" },
  //{ year: "2026", color: "#ff60b0", shadow: "rgba(255,80,160,0.6)",  title: "Lancement MentorMatch",      sub: "BMC · MVP scoping · Go-to-market" },
  //{ year: "2027", color: "#40e0b0", shadow: "rgba(60,200,160,0.6)",  title: "Diplôme · Relocation France", sub: "Master · Open to opportunities" },
];

//{ label: "GitHub",    text: "https://github.com/deep-coding15" },
const QR_ITEMS = [
  { label: "Portfolio", text: "https://merveilletsafacktech.netlify.app/" },
  { label: "LinkedIn",  text: "https://linkedin.com/in/lydivine-merveille-magne-tsafack" },
  { label: "Ges'Stock",  text: "https://launch-gesstock.netlify.app/" },
] as const;

/* ─── SectionLabel ─── */

const SectionLabel: FC<SectionLabelProps> = ({ children }) => (
  <div
    style={{
      fontFamily: "'Rajdhani',sans-serif",
      fontSize: 8,
      fontWeight: 700,
      letterSpacing: ".25em",
      color: "rgba(160,100,255,0.4)",
      textTransform: "uppercase",
      marginBottom: 7,
      display: "flex",
      alignItems: "center",
      gap: 6,
    }}
  >
    {children}
    <div style={{ flex: 1, height: 1, background: "rgba(160,100,255,0.12)" }} />
  </div>
);

/* ─── Front Card ─── */

const Front: FC<FrontProps> = ({ holoPos, shinePos }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      borderRadius: 16,
      overflow: "hidden",
      background: "#0a0a14",
      border: "1px solid rgba(160,120,255,0.3)",
      boxShadow:
        "0 0 0 1px rgba(100,60,200,0.2), 0 30px 80px rgba(0,0,0,0.8), 0 0 60px rgba(120,60,255,0.2)",
    }}
  >
    {/* Grid bg */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        backgroundImage:
          "repeating-linear-gradient(0deg,rgba(100,60,200,0.04) 0px,transparent 1px,transparent 24px)," +
          "repeating-linear-gradient(90deg,rgba(100,60,200,0.04) 0px,transparent 1px,transparent 24px)",
      }}
    />

    {/* Holo overlay */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 10,
        mixBlendMode: "screen",
        pointerEvents: "none",
        background: holoPos
          ? `radial-gradient(ellipse at ${holoPos.x}% ${holoPos.y}%, rgba(180,100,255,0.22) 0%, rgba(80,180,255,0.15) 40%, rgba(255,100,180,0.12) 70%, transparent 100%)`
          : "",
      }}
    />

    {/* Shine */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 11,
        pointerEvents: "none",
        background: shinePos
          ? `radial-gradient(ellipse at ${shinePos.x}% ${shinePos.y}%, rgba(255,255,255,0.11) 0%, transparent 55%)`
          : "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.07) 0%, transparent 60%)",
      }}
    />

    {/* Content */}
    <div style={{ position: "relative", zIndex: 2 }}>

      {/* Top bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px 16px 10px",
          borderBottom: "1px solid rgba(160,100,255,0.15)",
        }}
      >
        <span
          style={{
            fontFamily: "'Cinzel',serif",
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: ".2em",
            color: "rgba(180,140,255,0.8)",
            textTransform: "uppercase",
          }}
        >
          Futur Ingénieur · Série Limitée
        </span>
        <div style={{ display: "flex", gap: 3 }}>
          <Star /><Star /><Star /><Star /><Star />
        </div>
      </div>

      {/* Avatar */}
      <div style={{ display: "flex", justifyContent: "center", padding: "16px 0 10px" }}>
        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#7b40ff,#40c0ff,#ff40b0)",
            padding: 3,
            boxShadow: "0 0 30px rgba(120,60,255,0.55)",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              overflow: "hidden", // 🔥 essentiel
              background: "#12101e",
            }}
          >
            <img
              src="/me.jpeg"
              alt="Photo de profil de Merveille Tsafack"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover", // 🔥 clé pour avatar propre
                objectPosition: "center 90%", // 🔥 ajuste ici
                display: "block",
              }}
            />
          </div>
        </div>
      </div>

      {/* Name */}
      <div style={{ textAlign: "center", padding: "0 16px 8px" }}>
        <div
          style={{
            fontFamily: "'Cinzel',serif",
            fontSize: 20,
            fontWeight: 900,
            color: "#fff",
            letterSpacing: ".05em",
            textShadow: "0 0 24px rgba(160,100,255,0.7)",
          }}
        >
          Merveille Tsafack L.
        </div>
        <div
          style={{
            fontFamily: "'Rajdhani',sans-serif",
            fontSize: 8,
            fontWeight: 500,
            letterSpacing: ".1em",
            color: "rgba(180,140,255,0.7)",
            textTransform: "uppercase",
            marginTop: 3,
            lineHeight: 1.1,
          }}
        >
          IT Engineer | Architectures & API | DevOps
        </div>
        <div
          style={{
            fontFamily: "'Rajdhani',sans-serif",
            fontSize: 10,
            color: "rgba(255,255,255,0.3)",
            letterSpacing: ".08em",
            marginTop: 2,
          }}
        >
          ENSA Tétouan · Génie Informatique · 4A
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          margin: "4px 16px",
          height: 1,
          background: "linear-gradient(90deg,transparent,rgba(160,100,255,0.45),transparent)",
        }}
      />

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: 1,
          margin: "8px 16px",
          border: "1px solid rgba(160,100,255,0.12)",
          borderRadius: 8,
          overflow: "hidden",
          background: "rgba(160,100,255,0.08)",
        }}
      >
        {STATS.map(({ val, color, shadow, lbl }) => (
          <div key={lbl} style={{ background: "rgba(10,8,22,0.85)", padding: "8px 6px", textAlign: "center" }}>
            <div
              style={{
                fontFamily: "'Cinzel',serif",
                fontSize: 20,
                fontWeight: 900,
                lineHeight: 1,
                color,
                textShadow: `0 0 12px ${shadow}`,
              }}
            >
              {val}
            </div>
            <div
              style={{
                fontFamily: "'Rajdhani',sans-serif",
                fontSize: 8,
                fontWeight: 600,
                letterSpacing: ".12em",
                color: "rgba(180,140,255,0.45)",
                textTransform: "uppercase",
                marginTop: 3,
              }}
            >
              {lbl}
            </div>
          </div>
        ))}
      </div>

      {/* Tags */}
      <div style={{ margin: "8px 16px 0" }}>
        <div
          style={{
            fontFamily: "'Rajdhani',sans-serif",
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: ".2em",
            color: "rgba(160,100,255,0.45)",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          Arsenal technique
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {TAGS.map(({ variant, label }) => (
            <Tag key={label} variant={variant}>{label}</Tag>
          ))}
        </div>
      </div>

      {/* QR codes */}
      <div
        style={{
          display: "flex",
          gap: 10,
          margin: "10px 16px 0",
          padding: 10,
          border: "1px solid rgba(160,100,255,0.15)",
          borderRadius: 10,
          background: "rgba(255,255,255,0.02)",
        }}
      >
        {QR_ITEMS.map(({ label, text }, i) => (
          <>
            {(i === 1 || i === 2) && (
              <div
                key="sep"
                style={{
                  width: 1,
                  //height: 2,
                  background: "rgba(160,100,255,0.15)",
                  alignSelf: "stretch",
                  alignItems: "center",
                  margin: "2px 2px",
                }}
              />
            )}
            <div
              key={label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 5,
                flex: 1,
              }}
            >
              <div
                style={{
                  fontFamily: "'Rajdhani',sans-serif",
                  fontSize: 9,
                  fontWeight: 600,
                  letterSpacing: ".15em",
                  textTransform: "uppercase",
                  color: "rgba(180,140,255,0.55)",
                }}
              >
                {label}
              </div>
              <div
                style={{
                  width: 60,
                  height: 60,
                  padding: 4,
                  background: "#fff",
                  borderRadius: 6,
                  justifyContent: "center",
                  alignItems: "center",
                  border: "1px solid rgba(160,100,255,0.3)",
                  boxShadow: "0 0 14px rgba(160,100,255,0.25)",
                }}
              >
                <QRCodeSVG 
                  value={text} 
                  size={60} 
                  fgColor="#1a0a3a"
                  bgColor="#ffffff" />
              </div>
            </div>
          </>
        ))}
      </div>
    </div>

    {/* Footer */}
    <div
      style={{
        position: "absolute",
        bottom: -9,
        left: 0,
        right: 0,
        zIndex: 2,
        padding: "8px 16px 12px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        borderTop: "1px solid rgba(160,100,255,0.1)",
      }}
    >      
      <div
        style={{
          fontFamily: "'Rajdhani',sans-serif",
          fontSize: 9,
          color: "rgba(255,255,255,0.18)",
          letterSpacing: ".1em",
          lineHeight: 1.7,
        }}
      >
        Morocco · France . Cameroon<br />
        merveilletsafacktech.netlify.app <br/> 
        github.com/deep-coding15
      </div>
      <div
        style={{
          fontFamily: "'Cinzel',serif",
          fontSize: 9,
          color: "rgba(160,100,255,0.35)",
          letterSpacing: ".08em",
        }}
      >
        {numeroGitex}
      </div>
    </div>
  </div>
);

/* ─── Back Card ─── */

const Back: FC = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      borderRadius: 16,
      overflow: "hidden",
      background: "#07070e",
      border: "1px solid rgba(140,100,255,0.2)",
      boxShadow:
        "0 0 0 1px rgba(100,60,200,0.12), 0 30px 80px rgba(0,0,0,0.8)",
    }}
  >
    <GeoBg />
    <div
      style={{
        position: "relative",
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "14px 16px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
          paddingBottom: 10,
          borderBottom: "1px solid rgba(160,100,255,0.15)",
        }}
      >
        <span
          style={{
            fontFamily: "'Cinzel',serif",
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: ".2em",
            color: "rgba(180,140,255,0.65)",
            textTransform: "uppercase",
          }}
        >
          Dossier Classifié
        </span>
        <span
          style={{
            fontFamily: "'Cinzel',serif",
            fontSize: 9,
            color: "rgba(160,100,255,0.3)",
            letterSpacing: ".06em",
          }}
        >
          {numeroGitex}
        </span>
      </div>

      {/* Lore */}
      <SectionLabel>Lore</SectionLabel>
      <p
        style={{
          fontFamily: "'Rajdhani',sans-serif",
          fontSize: 11,
          lineHeight: 1.2,
          color: "rgba(210,190,255,0.6)",
          fontStyle: "italic",
          marginBottom: 8,
        }}
      >
        Étudiante en ingénierie informatique, je m’intéresse aux architectures distribuées, à l’intégration de services et à l’industrialisation des systèmes via des pratiques DevOps. J’ai développé plusieurs projets incluant des environnements conteneurisés et des applications full-stack.
      </p>

      {/* Projects */}
      <SectionLabel>Quêtes accomplies</SectionLabel>
      <div style={{ marginBottom: 10 }}>
        {PROJECTS.map(({ color, bg, name, desc, tag }) => (
          <div
            key={name}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 5,
              padding: "6px 0",
              borderBottom: "1px solid rgba(160,100,255,0.07)",
            }}
          >
            <div
              style={{
                width: 5,
                height: 5,
                transform: "rotate(45deg)",
                border: `1.5px solid ${color}`,
                background: bg,
                flexShrink: 0,
                marginTop: 3,
              }}
            />
            <div>
              <div
                style={{
                  fontFamily: "'Rajdhani',sans-serif",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "rgba(245,235,255,0.85)",
                  letterSpacing: ".02em",
                }}
              >
                {name}
              </div>
              <ul
                style={{
                  fontFamily: "'Rajdhani',sans-serif",
                  fontSize: 9,
                  color: "rgba(180,150,255,0.45)",
                  lineHeight: 1.25,
                  margin: "3px 0",
                  paddingLeft: 12,
                }}
              >
                {desc.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
              <div
                style={{
                  fontFamily: "'Rajdhani',sans-serif",
                  fontSize: 7,
                  fontWeight: 500,
                  color: "rgba(160,100,255,0.5)",
                  letterSpacing: ".05em",
                  marginTop: 2,
                }}
              >
                {tag}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <SectionLabel>Chronologie</SectionLabel>
      <div style={{ marginBottom: 10 }}>
        {TIMELINE.map(({ year, color, shadow, title, sub }, i) => (
          <div
            key={year}
            style={{
              display: "flex",
              gap: 10,
              padding: "5px 0",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: 28,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  fontFamily: "'Cinzel',serif",
                  fontSize: 8,
                  color: "rgba(160,100,255,0.45)",
                  lineHeight: 1,
                }}
              >
                {year}
              </div>
              {i < TIMELINE.length - 1 && (
                <div
                  style={{
                    width: 1,
                    flex: 1,
                    minHeight: 14,
                    background: "rgba(160,100,255,0.12)",
                    marginTop: 3,
                  }}
                />
              )}
            </div>
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: color,
                boxShadow: `0 0 6px ${shadow}`,
                flexShrink: 0,
                marginTop: 4,
              }}
            />
            <div>
              <div
                style={{
                  fontFamily: "'Rajdhani',sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "rgba(240,225,255,0.8)",
                  letterSpacing: ".03em",
                  lineHeight: 1.2,
                }}
              >
                {title}
              </div>
              <div
                style={{
                  fontFamily: "'Rajdhani',sans-serif",
                  fontSize: 9,
                  color: "rgba(180,150,255,0.4)",
                  marginTop: 1,
                }}
              >
                {sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quote */}
      <div
        style={{
          marginTop: 1,
          padding: "5px 12px",
          border: "1px solid rgba(160,100,255,0.18)",
          borderRadius: 8,
          background: "rgba(160,100,255,0.04)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "'Cinzel',serif",
            fontSize: 10,
            color: "rgba(200,160,255,0.65)",
            lineHeight: 1.65,
            fontStyle: "italic",
          }}
        >
          "Build things that matter.<br />Ship things that work."
        </div>
        <div
          style={{
            fontFamily: "'Rajdhani',sans-serif",
            fontSize: 9,
            color: "rgba(160,100,255,0.35)",
            letterSpacing: ".15em",
            marginTop: 5,
            textTransform: "uppercase",
          }}
        >
          — Merveille Tsafack.
        </div>
      </div>
    </div>
  </div>
);

/* ─── Main component ─── */

const NalovaCard: FC = () => {
  const [isFront, setIsFront]   = useState<boolean>(true);
  const [flipping, setFlipping] = useState<boolean>(false);
  const [scale, setScale]       = useState<number>(1);
  const [opacity, setOpacity]   = useState<number>(1);
  const [tilt, setTilt]         = useState<Position>({ x: 0, y: 0 });
  const [holoPos, setHoloPos]   = useState<Position | null>(null);
  const [shinePos, setShinePos] = useState<Position | null>(null);

  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;900&family=Rajdhani:wght@300;400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  const flip = useCallback((): void => {
    if (flipping) return;
    setFlipping(true);
    setScale(0);
    setOpacity(0);
    setTimeout(() => {
      setIsFront((f) => !f);
      setScale(1);
      setOpacity(1);
      setTimeout(() => setFlipping(false), 160);
    }, 160);
  }, [flipping]);

  const onMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>): void => {
      if (!isFront || !sceneRef.current) return;
      const rect = sceneRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setTilt({ x: (y - 0.5) * 16, y: (x - 0.5) * -16 });
      setHoloPos({ x: x * 100, y: y * 100 });
      setShinePos({ x: x * 100, y: y * 100 });
    },
    [isFront]
  );

  const onMouseLeave = useCallback((): void => {
    setTilt({ x: 0, y: 0 });
    setHoloPos(null);
    setShinePos(null);
  }, []);

  const cardTransform = [
    "perspective(900px)",
    `rotateX(${tilt.x}deg)`,
    `rotateY(${tilt.y}deg)`,
    `scaleX(${scale})`,
  ].join(" ");

  const flipTransition: string = flipping
    ? scale === 0
      ? "transform 0.15s ease-in, opacity 0.15s ease-in"
      : "transform 0.15s ease-out, opacity 0.15s ease-out"
    : isFront
    ? "transform 0.4s ease"
    : "none";

  return (
    <div
      style={{
        background: "#05050d",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
        padding: "40px 20px",
        backgroundImage:
          "repeating-linear-gradient(0deg,rgba(100,60,200,0.03) 0px,transparent 1px,transparent 40px)," +
          "repeating-linear-gradient(90deg,rgba(100,60,200,0.03) 0px,transparent 1px,transparent 40px)",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          fontFamily: "'Rajdhani',sans-serif",
          fontSize: 12,
          letterSpacing: ".2em",
          color: "rgba(160,100,255,0.4)",
          textTransform: "uppercase",
          textAlign: "center",
        }}
      >
        Cliquer sur la carte ou sur le bouton · Hover = effet 3D
      </div>

      {/* Card scene */}
      <div
        ref={sceneRef}
        onClick={flip}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ width: 320, height: 560, position: "relative", cursor: "pointer" }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: cardTransform,
            opacity,
            transition: flipTransition,
          }}
        >
          {isFront
            ? <Front holoPos={holoPos} shinePos={shinePos} />
            : <Back />
          }
        </div>
      </div>

      {/* Flip button */}
      <button
        onClick={(e: MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation();
          flip();
        }}
        style={{
          fontFamily: "'Rajdhani',sans-serif",
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: ".18em",
          textTransform: "uppercase",
          color: "rgba(160,100,255,0.6)",
          background: "transparent",
          border: "1px solid rgba(160,100,255,0.25)",
          borderRadius: 24,
          padding: "10px 32px",
          cursor: "pointer",
        }}
        onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
          e.currentTarget.style.background = "rgba(160,100,255,0.1)";
          e.currentTarget.style.color = "rgba(210,170,255,0.9)";
          e.currentTarget.style.borderColor = "rgba(160,100,255,0.45)";
        }}
        onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "rgba(160,100,255,0.6)";
          e.currentTarget.style.borderColor = "rgba(160,100,255,0.25)";
        }}
      >
        {isFront ? "Retourner la carte" : "Voir le recto"}
      </button>
    </div>
  );
};

export default NalovaCard;

// Render the component
const root = ReactDOM.createRoot(document.getElementById("app")!);
root.render(<NalovaCard />);