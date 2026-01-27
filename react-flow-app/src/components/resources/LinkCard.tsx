import type { ResourceType } from "../../types/presentation";

interface LinkCardProps {
  title: string;
  url: string;
  type: ResourceType;
  image?: string;
}

const typeLabels: Record<ResourceType, string> = {
  article: "Article",
  tool: "Tool",
  video: "Video",
  docs: "Documentation",
  github: "GitHub",
  prompt: "Prompt",
};

function LinkCard({ title, url, type, image }: LinkCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="link-card"
    >
      {image && <img src={image} alt="" className="link-card-icon" />}
      <div className="link-card-content">
        <span className="link-card-title">{title}</span>
        <span className="link-card-type">{typeLabels[type]}</span>
      </div>
      <span className="link-card-arrow">&#8599;</span>
    </a>
  );
}

export default LinkCard;
