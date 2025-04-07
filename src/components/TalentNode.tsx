import { useState } from 'react';
import { TalentNode as TalentNodeType } from '../types/talents';
import '../styles/TalentNode.css';

interface TalentNodeProps {
  node: TalentNodeType;
  currentPoints: number;
  isAvailable: boolean;
  onAddPoint: () => void;
  onRemovePoint: () => void;
  onResetTalent: () => void;
}

const TalentNode: React.FC<TalentNodeProps> = ({
  node,
  currentPoints,
  isAvailable,
  onAddPoint,
  onRemovePoint,
  onResetTalent,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    // If at max points, reset the talent and its dependencies
    if (currentPoints === node.maxPoints) {
      onResetTalent();
    }
    // Otherwise add point if available or remove point if already allocated
    else if (isAvailable && currentPoints < node.maxPoints) {
      onAddPoint();
    } else if (currentPoints > 0) {
      onRemovePoint();
    }
  };

  const getNodeStyle = () => {
    const baseStyle: React.CSSProperties = {
      backgroundColor: node.color || '#666',
    };

    if (node.iconPath) {
      baseStyle.backgroundImage = `url(${node.iconPath})`;
      baseStyle.backgroundSize = 'cover';
      baseStyle.backgroundPosition = 'center';
    }

    if (!isAvailable) {
      return { ...baseStyle, opacity: 0.5 };
    }
    
    return baseStyle;
  };

  return (
    <div 
      className="talent-node-container"
      style={{ gridRow: node.tier, gridColumn: node.column }}
    >
      <div 
        id={`talent-node-${node.id}`}
        className={`talent-node ${currentPoints > 0 ? 'active' : ''} ${isAvailable ? 'available' : 'locked'}`}
        style={getNodeStyle()}
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {currentPoints > 0 && <span className="talent-points">{currentPoints}/{node.maxPoints}</span>}
      </div>
      
      {showTooltip && (
        <div className="talent-tooltip">
          <h4>{node.name}</h4>
          <p>{node.description}</p>
          <div className="tooltip-rank">
            Rank: {currentPoints}/{node.maxPoints}
          </div>
        </div>
      )}
    </div>
  );
};

export default TalentNode;