import type { Resource } from "../../types/presentation";
import PromptCard from "./PromptCard";
import LinkCard from "./LinkCard";

interface PromptResource extends Resource {
  prompt?: string;
}

interface ResourceListProps {
  resources: (Resource | PromptResource)[];
  lineColor: string;
}

function ResourceList({ resources, lineColor }: ResourceListProps) {
  return (
    <div className="resource-list">
      <h4 className="resource-list-header" style={{ color: lineColor }}>
        Resources
      </h4>
      <div className="resource-cards">
        {resources.map((resource) => {
          // Check if it's a prompt resource
          if ("prompt" in resource && resource.prompt) {
            return (
              <PromptCard
                key={resource.id}
                title={resource.title}
                prompt={resource.prompt}
                lineColor={lineColor}
              />
            );
          }
          // Otherwise it's a link resource
          return (
            <LinkCard
              key={resource.id}
              title={resource.title}
              url={resource.url}
              type={resource.type}
              image={resource.image}
            />
          );
        })}
      </div>
    </div>
  );
}

export default ResourceList;
