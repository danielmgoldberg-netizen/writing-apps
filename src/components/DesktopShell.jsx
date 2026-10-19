import { useState, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// DESKTOP SHELL
// A full-viewport, macOS-style window: unified title bar with traffic-light
// controls, a translucent persistent sidebar, and a scrolling workspace.
// Purely presentational; the host app supplies sidebar sections and actions.
//
// Traffic lights:  red → onClose · yellow → collapse sidebar · green → fullscreen
// ─────────────────────────────────────────────────────────────────────────────

const NARROW_QUERY = "(max-width: 760px)";

// Design tokens shared by the shell and by screens rendered outside it (App.jsx).
// Drop into any CSS rule: `.my-root { ${DS_TOKENS} }`.
export const DS_FONT_STACK = `-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", system-ui, "Helvetica Neue", Helvetica, Arial, sans-serif`;
export const DS_TOKENS = `
  /* macOS type scale (pt → px) */
  --ds-large-title: 26px;
  --ds-title-1: 22px;
  --ds-title-2: 17px;
  --ds-title-3: 15px;
  --ds-headline: 13px;
  --ds-body: 13px;
  --ds-callout: 12px;
  --ds-subheadline: 11px;
  --ds-footnote: 10px;

  --ds-label: #1D1D1F;
  --ds-secondary-label: rgba(0, 0, 0, 0.5);
  --ds-tertiary-label: rgba(0, 0, 0, 0.26);
  --ds-separator: rgba(0, 0, 0, 0.1);
  --ds-accent: #007AFF;
  --ds-window-bg: #FFFFFF;
  --ds-sidebar-bg: rgba(236, 236, 238, 0.78);
  --ds-ease: cubic-bezier(0.25, 0.1, 0.25, 1);
  --ds-sidebar-w: 248px;
`;

export function SidebarIcon({ name }) {
  const paths = {
    back: <path d="M10 3.5 5.5 8l4.5 4.5" />,
    doc: <><path d="M4.5 2.5h5l2.5 2.5v8.5h-7.5z" /><path d="M6.5 8h3.5M6.5 10.5h3.5" /></>,
    book: <><path d="M2.5 3.5c2-.8 3.8-.6 5.5.6v9c-1.7-1.2-3.5-1.4-5.5-.6z" /><path d="M13.5 3.5c-2-.8-3.8-.6-5.5.6v9c1.7-1.2 3.5-1.4 5.5-.6z" /></>,
    person: <><circle cx="8" cy="5.5" r="2.5" /><path d="M3.5 13.5c.6-2.4 2.3-3.5 4.5-3.5s3.9 1.1 4.5 3.5" /></>,
    sidebar: <><rect x="2" y="3" width="12" height="10" rx="2" /><path d="M6 3v10" /></>
  };
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor"
      strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

export default function DesktopShell({ title, subtitle, sections, footer, toolbarActions, onClose, children }) {
  const isNarrow = () => typeof window !== "undefined" && window.matchMedia(NARROW_QUERY).matches;
  const [sidebarOpen, setSidebarOpen] = useState(() => !isNarrow());
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenEnabled) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen();
  };

  // On narrow screens the sidebar overlays the workspace, so picking an item closes it.
  const handleItemClick = (onClick) => {
    onClick();
    if (isNarrow()) setSidebarOpen(false);
  };

  return (
    <div className={"ds-window" + (sidebarOpen ? "" : " ds-collapsed")}>
      <style>{`
        .ds-window {
          ${DS_TOKENS}
          position: fixed;
          inset: 0;
          display: grid;
          grid-template-columns: var(--ds-sidebar-w) minmax(0, 1fr);
          grid-template-rows: 100%;
          background: var(--ds-window-bg);
          color: var(--ds-label);
          font-family: ${DS_FONT_STACK};
          font-size: var(--ds-body);
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          overflow: hidden;
          transition: grid-template-columns 0.35s var(--ds-ease);
        }
        .ds-window.ds-collapsed { grid-template-columns: 0px minmax(0, 1fr); }

        /* ── Traffic lights (fixed so they stay put when the sidebar collapses) ── */
        .ds-traffic {
          position: absolute;
          top: 20px;
          left: 20px;
          z-index: 30;
          display: flex;
          gap: 8px;
        }
        .ds-light {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 0.5px solid rgba(0, 0, 0, 0.12);
          padding: 0;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          font-weight: 700;
          line-height: 1;
          color: transparent;
          font-family: inherit;
        }
        .ds-light-close { background: #FF5F57; }
        .ds-light-min   { background: #FEBC2E; }
        .ds-light-max   { background: #28C840; }
        .ds-traffic:hover .ds-light { color: rgba(0, 0, 0, 0.55); }
        .ds-light:active { filter: brightness(0.85); }
        .ds-light:focus-visible { outline: 2px solid var(--ds-accent); outline-offset: 2px; }

        /* ── Sidebar ── */
        .ds-sidebar {
          grid-column: 1;
          min-width: 0;
          overflow: hidden;
          background: var(--ds-sidebar-bg);
          backdrop-filter: blur(40px) saturate(180%);
          -webkit-backdrop-filter: blur(40px) saturate(180%);
          border-right: 1px solid var(--ds-separator);
          display: flex;
          flex-direction: column;
        }
        .ds-sidebar-inner {
          width: var(--ds-sidebar-w);
          height: 100%;
          display: flex;
          flex-direction: column;
          padding-top: 52px;
        }
        .ds-sidebar-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 8px 10px 12px;
        }
        .ds-section + .ds-section { margin-top: 18px; }
        .ds-section-label {
          font-size: var(--ds-subheadline);
          font-weight: 600;
          color: var(--ds-secondary-label);
          padding: 0 10px 6px;
        }
        .ds-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 8px;
          min-height: 28px;
          padding: 5px 10px;
          border: none;
          border-radius: 6px;
          background: transparent;
          color: var(--ds-label);
          font-family: inherit;
          font-size: var(--ds-body);
          text-align: left;
          cursor: default;
          transition: background 0.15s ease;
        }
        .ds-item svg { flex-shrink: 0; color: var(--ds-accent); }
        .ds-item span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .ds-item:hover { background: rgba(0, 0, 0, 0.05); }
        .ds-item.ds-active { background: var(--ds-accent); color: #FFFFFF; }
        .ds-item.ds-active svg { color: #FFFFFF; }
        .ds-item:focus-visible { outline: 2px solid var(--ds-accent); outline-offset: -2px; }
        .ds-sidebar-footer {
          border-top: 1px solid var(--ds-separator);
          padding: 12px 20px 16px;
          font-size: var(--ds-callout);
          color: var(--ds-secondary-label);
          line-height: 1.45;
        }

        /* ── Main column ── */
        .ds-main {
          grid-column: 2;
          min-width: 0;
          display: flex;
          flex-direction: column;
          background: var(--ds-window-bg);
        }
        .ds-toolbar {
          height: 52px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 16px 0 12px;
          border-bottom: 1px solid var(--ds-separator);
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          transition: padding-left 0.35s var(--ds-ease);
        }
        .ds-collapsed .ds-toolbar { padding-left: 88px; }
        .ds-tool-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          height: 28px;
          min-width: 28px;
          padding: 0 8px;
          border: none;
          border-radius: 6px;
          background: transparent;
          color: var(--ds-secondary-label);
          font-family: inherit;
          font-size: var(--ds-body);
          font-weight: 500;
          cursor: default;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .ds-tool-btn:hover { background: rgba(0, 0, 0, 0.05); color: var(--ds-label); }
        .ds-tool-btn[aria-pressed="true"] { background: rgba(0, 0, 0, 0.07); color: var(--ds-label); }
        .ds-tool-btn:focus-visible { outline: 2px solid var(--ds-accent); outline-offset: 1px; }
        .ds-title-group { min-width: 0; flex: 1; }
        .ds-title {
          font-size: var(--ds-headline);
          font-weight: 600;
          letter-spacing: -0.01em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .ds-subtitle {
          font-size: var(--ds-subheadline);
          color: var(--ds-secondary-label);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .ds-toolbar-actions { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
        .ds-workspace {
          flex: 1;
          overflow-y: auto;
          overscroll-behavior: contain;
        }

        /* ── Narrow screens: sidebar floats over the workspace ── */
        @media ${NARROW_QUERY} {
          .ds-window, .ds-window.ds-collapsed { grid-template-columns: 0px minmax(0, 1fr); }
          .ds-sidebar {
            position: absolute;
            top: 0; bottom: 0; left: 0;
            z-index: 20;
            width: var(--ds-sidebar-w);
            box-shadow: 0 0 40px rgba(0, 0, 0, 0.18);
            transform: translateX(0);
            transition: transform 0.35s var(--ds-ease);
          }
          .ds-collapsed .ds-sidebar { transform: translateX(-100%); box-shadow: none; }
          .ds-toolbar, .ds-collapsed .ds-toolbar { padding-left: 88px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ds-window, .ds-toolbar, .ds-sidebar { transition: none; }
        }
      `}</style>

      <div className="ds-traffic">
        <button className="ds-light ds-light-close" onClick={onClose} aria-label="Close and go back to menu" title="Back to menu">×</button>
        <button className="ds-light ds-light-min" onClick={() => setSidebarOpen(o => !o)} aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"} title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}>−</button>
        <button className="ds-light ds-light-max" onClick={toggleFullscreen} aria-label={isFullscreen ? "Exit full screen" : "Enter full screen"} title={isFullscreen ? "Exit full screen" : "Enter full screen"}>{isFullscreen ? "↙" : "↗"}</button>
      </div>

      <aside className="ds-sidebar" aria-hidden={!sidebarOpen} inert={sidebarOpen ? undefined : ""}>
        <div className="ds-sidebar-inner">
          <nav className="ds-sidebar-scroll">
            {sections.map(section => (
              <div className="ds-section" key={section.label}>
                <div className="ds-section-label">{section.label}</div>
                {section.items.map(item => (
                  <button
                    key={item.id}
                    className={"ds-item" + (item.active ? " ds-active" : "")}
                    onClick={() => handleItemClick(item.onClick)}
                    aria-current={item.active ? "page" : undefined}
                    title={item.label}
                  >
                    {item.icon && <SidebarIcon name={item.icon} />}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            ))}
          </nav>
          {footer && <div className="ds-sidebar-footer">{footer}</div>}
        </div>
      </aside>

      <div className="ds-main">
        <header className="ds-toolbar">
          <button
            className="ds-tool-btn"
            onClick={() => setSidebarOpen(o => !o)}
            aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
            aria-pressed={sidebarOpen}
            title="Toggle sidebar"
          >
            <SidebarIcon name="sidebar" />
          </button>
          <div className="ds-title-group">
            <div className="ds-title">{title}</div>
            {subtitle && <div className="ds-subtitle">{subtitle}</div>}
          </div>
          <div className="ds-toolbar-actions">{toolbarActions}</div>
        </header>
        <main className="ds-workspace">{children}</main>
      </div>
    </div>
  );
}
