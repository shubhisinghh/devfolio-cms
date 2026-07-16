import { useEffect, useState } from "react";

const LINES = [
  { indent: 0, tokens: [{ t: "const", c: "amber" }, { t: " developer ", c: "plain" }, { t: "=", c: "amber" }, { t: " {", c: "plain" }] },
  { indent: 1, tokens: [{ t: "name", c: "violet" }, { t: ": ", c: "plain" }, { t: "'Shubhi Sharma'", c: "cyan" }, { t: ",", c: "plain" }] },
  { indent: 1, tokens: [{ t: "role", c: "violet" }, { t: ": ", c: "plain" }, { t: "'Full-Stack Developer'", c: "cyan" }, { t: ",", c: "plain" }] },
  { indent: 1, tokens: [{ t: "stack", c: "violet" }, { t: ": [", c: "plain" }, { t: "'React'", c: "cyan" }, { t: ", ", c: "plain" }, { t: "'Node'", c: "cyan" }, { t: ", ", c: "plain" }, { t: "'SQL'", c: "cyan" }, { t: "],", c: "plain" }] },
  { indent: 1, tokens: [{ t: "status", c: "violet" }, { t: ": ", c: "plain" }, { t: "'open to work'", c: "cyan" }] },
  { indent: 0, tokens: [{ t: "};", c: "plain" }] },
];

const colorClass = {
  amber: "text-amber",
  violet: "text-violet",
  cyan: "text-cyan",
  plain: "text-slate-400",
};

export default function EditorWindow({ className = "" }) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [charProgress, setCharProgress] = useState(0);

  useEffect(() => {
    if (visibleLines >= LINES.length) return;
    const line = LINES[visibleLines];
    const fullText = line.tokens.map((t) => t.t).join("");

    if (charProgress < fullText.length) {
      const timeout = setTimeout(() => setCharProgress((c) => c + 1), 18);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setVisibleLines((l) => l + 1);
        setCharProgress(0);
      }, 220);
      return () => clearTimeout(timeout);
    }
  }, [charProgress, visibleLines]);

  const renderLine = (line, isCurrentlyTyping, charsToShow) => {
    let remaining = charsToShow;
    return line.tokens.map((tok, i) => {
      if (!isCurrentlyTyping) {
        return (
          <span key={i} className={colorClass[tok.c]}>
            {tok.t}
          </span>
        );
      }
      if (remaining <= 0) return null;
      const slice = tok.t.slice(0, remaining);
      remaining -= tok.t.length;
      return (
        <span key={i} className={colorClass[tok.c]}>
          {slice}
        </span>
      );
    });
  };

  return (
    <div className={`surface overflow-hidden shadow-glow ${className}`}>
      <div className="flex items-center gap-2 px-4 py-3 border-b border-base bg-black/10">
        <span className="editor-dot bg-rose" />
        <span className="editor-dot bg-amber" />
        <span className="editor-dot bg-cyan" />
        <span className="ml-3 font-mono text-xs text-muted">developer.js</span>
      </div>
      <div className="p-5 md:p-6 font-mono text-sm md:text-[15px] leading-7 min-h-[220px]">
        {LINES.map((line, idx) => {
          if (idx > visibleLines) return null;
          const isCurrent = idx === visibleLines;
          return (
            <div key={idx} style={{ paddingLeft: `${line.indent * 1.25}rem` }}>
              {renderLine(line, isCurrent, charProgress)}
              {isCurrent && <span className="inline-block w-[7px] h-[15px] bg-cyan align-middle ml-0.5 animate-blink" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
