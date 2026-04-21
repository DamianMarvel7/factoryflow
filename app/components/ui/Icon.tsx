import React from "react";

interface IconProps {
  name: string;
  size?: number;
  stroke?: number;
  style?: React.CSSProperties;
  className?: string;
}

export default function Icon({ name, size = 16, stroke = 1.6, style = {}, className }: IconProps) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    style,
    className,
  };
  switch (name) {
    case "gear":
      return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/></svg>;
    case "dashboard":
      return <svg {...props}><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>;
    case "tickets":
      return <svg {...props}><rect x="3" y="5" width="4.5" height="14" rx="1.2"/><rect x="9.75" y="5" width="4.5" height="14" rx="1.2"/><rect x="16.5" y="5" width="4.5" height="14" rx="1.2"/></svg>;
    case "billing":
      return <svg {...props}><path d="M4 4h12l2 3v13H4z"/><path d="M8 10h8M8 14h8M8 18h5"/></svg>;
    case "inventory":
      return <svg {...props}><path d="M3 7 12 3l9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/></svg>;
    case "search":
      return <svg {...props}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>;
    case "plus":
      return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>;
    case "x":
      return <svg {...props}><path d="M18 6 6 18M6 6l12 12"/></svg>;
    case "chevron-down":
      return <svg {...props}><path d="m6 9 6 6 6-6"/></svg>;
    case "chevron-right":
      return <svg {...props}><path d="m9 6 6 6-6 6"/></svg>;
    case "bell":
      return <svg {...props}><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>;
    case "filter":
      return <svg {...props}><path d="M3 5h18l-7 9v6l-4-2v-4z"/></svg>;
    case "edit":
      return <svg {...props}><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4z"/></svg>;
    case "trash":
      return <svg {...props}><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>;
    case "calendar":
      return <svg {...props}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></svg>;
    case "drive":
      return <svg {...props}><path d="M8 3h8l6 10-4 7H6l-4-7z"/><path d="m8 3 6 10h8M2 13l6 7M14 13l-4 7"/></svg>;
    case "attach":
      return <svg {...props}><path d="m21 11-8.5 8.5a5 5 0 0 1-7-7L14 4a3.5 3.5 0 0 1 5 5l-8.5 8.5a2 2 0 0 1-3-3L15 7"/></svg>;
    case "alert":
      return <svg {...props}><path d="M12 3 2 21h20z"/><path d="M12 10v5M12 18h.01"/></svg>;
    case "check":
      return <svg {...props}><path d="M4 12l5 5 11-12"/></svg>;
    case "package":
      return <svg {...props}><path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16"/><path d="M3.3 7 12 12l8.7-5M12 22V12"/></svg>;
    case "coin":
      return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M9 10h5a1.5 1.5 0 0 1 0 3H9m0 0h5a1.5 1.5 0 0 1 0 3H9m3-9v11"/></svg>;
    case "clock":
      return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case "trend-up":
      return <svg {...props}><path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/></svg>;
    case "more":
      return <svg {...props}><circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/></svg>;
    case "grip":
      return <svg {...props}><circle cx="9" cy="6" r="1.1"/><circle cx="15" cy="6" r="1.1"/><circle cx="9" cy="12" r="1.1"/><circle cx="15" cy="12" r="1.1"/><circle cx="9" cy="18" r="1.1"/><circle cx="15" cy="18" r="1.1"/></svg>;
    case "factory":
      return <svg {...props}><path d="M3 21V10l6 4V10l6 4V6l6 4v11z"/><path d="M7 21v-4M11 21v-4M15 21v-4M19 21v-4"/></svg>;
    default:
      return null;
  }
}
