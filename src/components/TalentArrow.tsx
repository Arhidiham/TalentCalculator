import { useEffect, useState } from 'react';
import '../styles/TalentArrow.css';

interface TalentArrowProps {
  fromNodeId: string;
  toNodeId: string;
  isActive: boolean;
}

const TalentArrow: React.FC<TalentArrowProps> = ({ fromNodeId, toNodeId, isActive }) => {
  const [path, setPath] = useState<string | null>(null);
  
  useEffect(() => {
    // Get positions of the source and target nodes
    const calculateArrowPosition = () => {
      const fromNode = document.getElementById(`talent-node-${fromNodeId}`);
      const toNode = document.getElementById(`talent-node-${toNodeId}`);
      
      if (!fromNode || !toNode) return;
      
      const fromRect = fromNode.getBoundingClientRect();
      const toRect = toNode.getBoundingClientRect();
      
      // Get the container's position to calculate relative coordinates
      const containerRect = fromNode.closest('.talent-grid')?.getBoundingClientRect();
      if (!containerRect) return;
      
      // Calculate center points relative to the container
      const fromCenterX = fromRect.left + (fromRect.width / 2) - containerRect.left;
      const fromCenterY = fromRect.top + (fromRect.height / 2) - containerRect.top;
      const toCenterX = toRect.left + (toRect.width / 2) - containerRect.left;
      const toCenterY = toRect.top + (toRect.height / 2) - containerRect.top;
      
      // Calculate the angle between the two nodes
      const angle = Math.atan2(toCenterY - fromCenterY, toCenterX - fromCenterX);
      
      // Calculate radius of the node (assuming square nodes)
      const nodeRadius = fromRect.width / 2;
      
      // Calculate the points at the edge of each node
      const fromX = fromCenterX + Math.cos(angle) * nodeRadius;
      const fromY = fromCenterY + Math.sin(angle) * nodeRadius;
      
      // For the target node, add a larger offset to ensure arrow stays outside
      const targetOffset = 8; // Increased from 4 to 8 pixels
      const toX = toCenterX - Math.cos(angle) * (nodeRadius + targetOffset);
      const toY = toCenterY - Math.sin(angle) * (nodeRadius + targetOffset);
      
      // Create SVG path
      setPath(`M ${fromX} ${fromY} L ${toX} ${toY}`);
    };
    
    // Calculate initial position after rendering
    setTimeout(calculateArrowPosition, 100);
    
    // Recalculate after a longer delay to ensure all elements are fully rendered
    setTimeout(calculateArrowPosition, 500);
    
    // Update position on window resize
    window.addEventListener('resize', calculateArrowPosition);
    
    return () => {
      window.removeEventListener('resize', calculateArrowPosition);
    };
  }, [fromNodeId, toNodeId]);

  if (!path) return null;

  return (
    <svg className="talent-arrow" width="100%" height="100%" style={{ pointerEvents: 'none' }}>
      <defs>
        <marker 
          id={`arrowhead-${isActive ? 'active' : 'inactive'}-${fromNodeId}-${toNodeId}`} 
          markerWidth="6" 
          markerHeight="5" 
          refX="0" 
          refY="2.5" 
          orient="auto"
        >
          <polygon 
            points="0 0, 6 2.5, 0 5" 
            fill={isActive ? "#ffd700" : "#666"} 
          />
        </marker>
      </defs>
      <path 
        d={path} 
        stroke={isActive ? "#ffd700" : "#666"} 
        strokeWidth="2" 
        fill="none" 
        markerEnd={`url(#arrowhead-${isActive ? 'active' : 'inactive'}-${fromNodeId}-${toNodeId})`}
      />
    </svg>
  );
};

export default TalentArrow;