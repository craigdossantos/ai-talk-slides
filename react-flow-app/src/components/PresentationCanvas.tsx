import { ReactFlow, Background, BackgroundVariant } from "@xyflow/react";

function PresentationCanvas() {
  return (
    <ReactFlow
      nodes={[]}
      edges={[]}
      fitView
      proOptions={{ hideAttribution: true }}
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={20}
        size={1}
        color="rgba(255, 255, 255, 0.1)"
      />
    </ReactFlow>
  );
}

export default PresentationCanvas;
