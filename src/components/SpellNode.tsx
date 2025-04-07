import { useState } from 'react';
import { Spell } from '../types/spells';
import '../styles/SpellNode.css';

interface SpellNodeProps {
  spell: Spell;
  currentRank: number;
  talentPointsSpent: number;
  isAvailable: boolean;
  onAddRank: () => void;
  onResetSpell: () => void;
}

const SpellNode: React.FC<SpellNodeProps> = ({
  spell,
  currentRank,
  talentPointsSpent,
  isAvailable,
  onAddRank,
  onResetSpell,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const maxRank = spell.ranks.length;

  const handleClick = () => {
    if (currentRank === maxRank) {
      // If at max rank, reset the spell
      onResetSpell();
    } 
    else if (isAvailable) {
      // Otherwise add rank if available
      onAddRank();
    }
  };

  // Get the current rank details
  const currentRankDetails = currentRank > 0 
    ? spell.ranks[currentRank - 1] 
    : null;

  // Get the next rank details if available
  const nextRankDetails = currentRank < maxRank 
    ? spell.ranks[currentRank] 
    : null;

  // Determine if the next rank is available based on talent points spent
  const isNextRankAvailable = nextRankDetails && 
    talentPointsSpent >= nextRankDetails.talentPointsRequired;

  const getNodeStyle = () => {
    const baseStyle: React.CSSProperties = {
      backgroundColor: spell.color || '#666',
    };

    if (spell.iconPath) {
      baseStyle.backgroundImage = `url(${spell.iconPath})`;
      baseStyle.backgroundSize = 'cover';
      baseStyle.backgroundPosition = 'center';
    }

    if (currentRank === 0 && !isNextRankAvailable) {
      return { ...baseStyle, opacity: 0.5 };
    }
    
    return baseStyle;
  };

  return (
    <div className="spell-node-container">
      <div 
        className={`spell-node ${currentRank > 0 ? 'active' : ''} ${isNextRankAvailable ? 'available' : 'locked'}`}
        style={getNodeStyle()}
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {currentRank > 0 && <span className="spell-rank">{currentRank}/{maxRank}</span>}
      </div>
      
      {showTooltip && (
        <div className="spell-tooltip">
          <h4>{spell.name}</h4>
          
          {currentRankDetails && (
            <div className="current-rank">
              <div className="tooltip-rank">Rank {currentRank}</div>
              <p>{currentRankDetails.description}</p>
            </div>
          )}
          
          {nextRankDetails && (
            <div className="next-rank">
              <div className="tooltip-rank">
                Rank {nextRankDetails.rank} 
                {!isNextRankAvailable && ` (Requires ${nextRankDetails.talentPointsRequired} talent points)`}
              </div>
              <p className={!isNextRankAvailable ? 'unavailable' : ''}>
                {nextRankDetails.description}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SpellNode;