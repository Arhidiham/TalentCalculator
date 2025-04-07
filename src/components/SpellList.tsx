import { useState, useEffect, useMemo } from 'react';
import { SpellList as SpellListType, SpellState, Spell } from '../types/spells';
import SpellNode from './SpellNode';
import '../styles/SpellList.css';

interface SpellListProps {
  spellList: SpellListType;
  talentPointsSpent: number;
}

interface GroupedSpells {
  pointsRequired: number;
  spells: Spell[];
}

const SpellList: React.FC<SpellListProps> = ({ spellList, talentPointsSpent }) => {
  const [spellState, setSpellState] = useState<SpellState>({
    classId: spellList.id,
    allocatedPoints: {},
    totalPointsSpent: 0
  });

  // Group spells by their initial unlock level
  const groupedSpells = useMemo(() => {
    // Create a map to group spells by their initial unlock level
    const groups: { [key: number]: Spell[] } = {};
    
    spellList.spells.forEach(spell => {
      const initialUnlockLevel = spell.ranks[0].talentPointsRequired;
      
      if (!groups[initialUnlockLevel]) {
        groups[initialUnlockLevel] = [];
      }
      
      groups[initialUnlockLevel].push(spell);
    });
    
    // Convert the map to a sorted array
    return Object.entries(groups)
      .map(([pointsRequired, spells]) => ({
        pointsRequired: parseInt(pointsRequired, 10),
        spells
      }))
      .sort((a, b) => a.pointsRequired - b.pointsRequired);
  }, [spellList.spells]);
  
  // Check if a spell rank is available
  const isSpellRankAvailable = (spellId: string, nextRank: number) => {
    // Find the spell
    const spell = spellList.spells.find(s => s.id === spellId);
    if (!spell || nextRank > spell.ranks.length) return false;

    // Check if we have enough talent points spent to unlock this rank
    const requiredPoints = spell.ranks[nextRank - 1].talentPointsRequired;
    
    return talentPointsSpent >= requiredPoints &&
           spellState.totalPointsSpent < spellList.maxPoints;
  };

  // Add a rank to a spell
  const addSpellRank = (spellId: string) => {
    const spell = spellList.spells.find(s => s.id === spellId);
    if (!spell) return;

    const currentRank = spellState.allocatedPoints[spellId] || 0;
    const nextRank = currentRank + 1;

    // Check if next rank is available
    if (nextRank <= spell.ranks.length && isSpellRankAvailable(spellId, nextRank)) {
      setSpellState(prev => ({
        ...prev,
        allocatedPoints: {
          ...prev.allocatedPoints,
          [spellId]: nextRank
        },
        totalPointsSpent: prev.totalPointsSpent + 1
      }));
    }
  };

  // Reset a spell to rank 0
  const resetSpell = (spellId: string) => {
    const currentRank = spellState.allocatedPoints[spellId] || 0;
    if (currentRank === 0) return;

    setSpellState(prev => {
      const newAllocated = { ...prev.allocatedPoints };
      
      // Remove the allocated points
      const pointsToRemove = newAllocated[spellId] || 0;
      delete newAllocated[spellId];
      
      return {
        ...prev,
        allocatedPoints: newAllocated,
        totalPointsSpent: prev.totalPointsSpent - pointsToRemove
      };
    });
  };

  // Reset all spells
  const resetAllSpells = () => {
    setSpellState({
      classId: spellList.id,
      allocatedPoints: {},
      totalPointsSpent: 0
    });
  };

  return (
    <div className="spell-list">
      <div className="spell-list-header">
        <h2>{spellList.name}</h2>
        <p>{spellList.description}</p>
        <div className="spell-points-info">
          <span>Spell Points: {spellState.totalPointsSpent}/{spellList.maxPoints}</span>
          <button 
            className="reset-button"
            onClick={resetAllSpells}
            disabled={spellState.totalPointsSpent === 0}
          >
            Reset Spells
          </button>
        </div>
      </div>
      
      <div className="spell-grid">
        {groupedSpells.map(group => (
          <div key={`level-${group.pointsRequired}`} className="spell-group">
            <div className="spell-group-header">
              {group.pointsRequired === 0 
                ? "Base Spells" 
                : `Unlocked at ${group.pointsRequired} talent points`}
            </div>
            <div className="spell-group-content">
              {group.spells.map(spell => (
                <SpellNode
                  key={spell.id}
                  spell={spell}
                  currentRank={spellState.allocatedPoints[spell.id] || 0}
                  talentPointsSpent={talentPointsSpent}
                  isAvailable={isSpellRankAvailable(spell.id, (spellState.allocatedPoints[spell.id] || 0) + 1)}
                  onAddRank={() => addSpellRank(spell.id)}
                  onResetSpell={() => resetSpell(spell.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpellList;