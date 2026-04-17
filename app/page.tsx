"use client";
import { useState, useEffect, useRef } from "react";
import './globals.css'
import './page.css'

const TYPING_LINES = [
  "Initializing AI engine...",
  "Analyzing your prompt...",
  "Structuring layout...",
  "Generating HTML...",
  "Applying styles...",
  "Adding interactivity...",
  "Polishing components...",
  "Finalizing output...",
];

function TypingAnimation() {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    const line = TYPING_LINES[lineIndex % TYPING_LINES.length];
    if (charIndex < line.length) {
      const t = setTimeout(() => {
        setDisplayed((p) => p + line[charIndex]);
        setCharIndex((c) => c + 1);
      }, 28);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setDisplayed("");
        setCharIndex(0);
        setLineIndex((i) => (i + 1) % TYPING_LINES.length);
      }, 600);
      return () => clearTimeout(t);
    }
  }, [charIndex, lineIndex]);

  return (
    <span style={{ color: "#d4d4d4", fontFamily: "'Fira Code', monospace", fontSize: 13 }}>
      {displayed}
      <span className="cursor">█</span>
    </span>
  );
}

function SpinnerRing() {
  return (
    <div style={{
      width: 72, height: 72, borderRadius: "50%",
      border: "3px solid rgba(255,255,255,0.08)",
      borderTop: "3px solid #e2e2e2",
      borderRight: "3px solid #888",
      animation: "spin 1s linear infinite",
      boxShadow: "0 0 24px rgba(255,255,255,0.1)",
      margin: "0 auto 20px"
    }} />
  );
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"preview" | "code">("preview");
  const [recentProjects, setRecentProjects] = useState([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [projectCounter, setProjectCounter] = useState(1);
  const [refreshTime, setRefreshTime] = useState(0);
  const [changeRequest, setChangeRequest] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Recalculate time display every second
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getRelativeTime = (timestamp: number): string => {
    const now = Date.now();
    const seconds = Math.floor((now - timestamp) / 1000);

    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const improveCode = async (changeRequest: string) => {
    if (!code || !changeRequest) return;

    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: changeRequest, old_code: code }),
      });
      const data = await res.json();
      setCode(data.code);
      setChangeRequest("");
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const generateWebsite = async () => {
    if (!prompt) return;
    setLoading(true);
    setCode("");
    try {
      const res = await fetch("http://127.0.0.1:8000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setCode(data.code);
      
      // Add new project to recent projects list
      const newProject = { id: projectCounter, name: `Project ${projectCounter}`, timestamp: Date.now(), code: data.code };
      setRecentProjects([newProject, ...recentProjects]);
      setProjectCounter(projectCounter + 1);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "website.html";
    a.click();
  };

  const startRename = (id: number, currentName: string) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  const saveRename = (id: number) => {
    setRecentProjects(recentProjects.map(p => 
      p.id === id ? { ...p, name: editingName } : p
    ));
    setEditingId(null);
  };

  const loadProject = (projectCode: string) => {
    setCode(projectCode);
  };

  const deleteProject = (id: number) => {
    setRecentProjects(recentProjects.filter(p => p.id !== id));
  };

  return (
    <>
      
      <div className="layout">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />

        {/* ===== LEFT SIDEBAR ===== */}
        <div className="sidebar">
          <div className="sidebar-top">
            <div className="logo-icon">⚡</div>
            <span className="logo-text">Velosite</span>
          </div>

          <div className="sidebar-body">
            {/* Prompt area */}
            <div>
              <div className="section-label">What would you like to build?</div>
              <div className="textarea-wrap">
                <textarea
                  ref={textareaRef}
                  className="prompt-textarea"
                  placeholder="Describe your website..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) generateWebsite();
                  }}
                />
              </div>
            </div>

            <button
              className={`generate-btn${loading ? " loading" : ""}`}
              onClick={generateWebsite}
              disabled={loading || !prompt}
            >
              {loading ? (
                <>
                  <div className="dots">
                    <div className="dot" />
                    <div className="dot" />
                    <div className="dot" />
                  </div>
                  Generating...
                </>
              ) : (
                <>Generate</>
              )}
            </button>

            {/* Recent projects */}
            <div>
              <div className="recent-header">
                <span>📁</span>
                <span>Recent Projects</span>
              </div>
              {recentProjects.map((p, i) => (
                <div
                  className="project-card"
                  key={p.id}
                  style={{ animationDelay: `${i * 80}ms` }}
                  onClick={() => {
                    if (editingId !== p.id) {
                      loadProject(p.code);
                    }
                  }}
                >
                  {editingId === p.id ? (
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={() => saveRename(p.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveRename(p.id);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                      style={{
                        width: "100%",
                        background: "rgba(255,255,255,0.1)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "4px",
                        padding: "4px 8px",
                        color: "#c8c8c8",
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "13px",
                      }}
                    />
                  ) : (
                    <div
                      className="project-name"
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        startRename(p.id, p.name);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      {p.name}
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div className="project-time">🕐 {refreshTime && getRelativeTime(p.timestamp)}</div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProject(p.id);
                      }}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "rgba(255,255,255,0.3)",
                        cursor: "pointer",
                        fontSize: "14px",
                        padding: "0",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#ff5f57")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
                      title="Delete project"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom panel — Figma style */}
          <div className="sidebar-bottom">
            <div className="bottom-actions">
              <span className="icon-btn" title="New" onClick={() => setCode("")}>＋</span>
              <span className="icon-btn" title="History">📄</span>
              <span className="icon-btn" title="Settings">⚙</span>
              <input
                className="ask-changes-input"
                type="text"
                placeholder="Ask Velosite..."
                value={changeRequest}
                onChange={(e) => setChangeRequest(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") improveCode(changeRequest);
                }}
              />
              <button
                onClick={() => improveCode(changeRequest)}
                disabled={!code || !changeRequest}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "7px",
                  padding: "7px 12px",
                  color: "#e2e2e2",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "12px",
                  fontWeight: 500,
                  cursor: !code || !changeRequest ? "not-allowed" : "pointer",
                  opacity: !code || !changeRequest ? 0.5 : 1,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (code && changeRequest) {
                    (e.target as HTMLButtonElement).style.background = "rgba(255,255,255,0.15)";
                    (e.target as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.2)";
                  }
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)";
                  (e.target as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.12)";
                }}
                title="Send improvement request"
              >
                ↗
              </button>
            </div>
            <div className="bottom-meta">
              <span className="bottom-version">v1.0 · Default</span>
              <span className="bottom-status">
                <span className="status-dot" />
                AI Ready
              </span>
            </div>
          </div>
        </div>

        {/* ===== RIGHT MAIN PANEL ===== */}
        <div className="main">
          {/* Top bar */}
          <div className="topbar">
            <div className="topbar-left">
              <div className="window-dots">
                <div className="wdot wdot-red" />
                <div className="wdot wdot-yellow" />
                <div className="wdot wdot-green" />
              </div>
              <div className="url-bar">
                🌐 localhost:3000
              </div>
            </div>
            <div className="topbar-right">
              {code && (
                <>
                  <div className="view-toggle">
                    <button
                      className={`toggle-btn${view === "preview" ? " active" : ""}`}
                      onClick={() => setView("preview")}
                    >
                      Preview
                    </button>
                    <button
                      className={`toggle-btn${view === "code" ? " active" : ""}`}
                      onClick={() => setView("code")}
                    >
                      Code
                    </button>
                  </div>
                  <button className="download-btn" onClick={downloadCode}>
                    ↓ Download
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="content-area">
            {/* Loading */}
            {loading && (
              <div className="loading-panel">
                <SpinnerRing />
                <div className="loading-title">Generating your website...</div>
                <TypingAnimation />
                <div className="loading-sub">This usually takes 10–15 seconds</div>
              </div>
            )}

            {/* Preview */}
            {!loading && code && view === "preview" && (
              <iframe className="preview-frame" srcDoc={code} title="preview" sandbox="allow-scripts" />
            )}

            {/* Code */}
            {!loading && code && view === "code" && (
              <div className="code-panel">
                <div className="code-inner">{code}</div>
              </div>
            )}

            {/* Empty */}
            {!loading && !code && (
              <div className="empty-state">
                <div className="empty-icon">⚡</div>
                <div className="empty-title">Your preview will appear here</div>
                <div className="empty-sub">Describe a website and hit Generate</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}