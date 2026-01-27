import { useState } from "react";

interface PromptCardProps {
  title: string;
  prompt: string;
  lineColor: string;
}

function PromptCard({ title, prompt, lineColor }: PromptCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="prompt-card">
      <button
        className="prompt-card-header"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <span className="prompt-icon" style={{ color: lineColor }}>
          &gt;_
        </span>
        <span className="prompt-title">{title}</span>
        <span className={`prompt-arrow ${isExpanded ? "expanded" : ""}`}>
          &#9662;
        </span>
      </button>

      {isExpanded && (
        <div className="prompt-card-content">
          <pre className="prompt-text">{prompt}</pre>
          <button
            className="copy-button"
            onClick={handleCopy}
            style={{ borderColor: lineColor }}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}
    </div>
  );
}

export default PromptCard;
