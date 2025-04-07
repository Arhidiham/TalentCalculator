import { useState, useEffect } from 'react';
import { TalentTree as TalentTreeType, TalentState } from '../types/talents';
import TalentNode from './TalentNode';
import TalentArrow from './TalentArrow';
import '../styles/TalentTree.css';

interface TalentTreeProps {
  talentTree: TalentTreeType;
  onPointsChanged: (points: number) => void;
}

const TalentTree: React.FC<TalentTreeProps> = ({ talentTree, onPointsChanged }) => {
  const [talentState, setTalentState] = useState<TalentState>({
    treeId: talentTree.id,
    allocatedPoints: {},
    totalPointsSpent: 0,
    tierUnlocked: 1
  });

  // Notify parent component when points change
  useEffect(() => {
    onPointsChanged(talentState.totalPointsSpent);
  }, [talentState.totalPointsSpent, onPointsChanged]);

  // Generate an array of all prerequisite relationships
  const prerequisiteConnections = talentTree.nodes
    .filter(node => node.prereqIds && node.prereqIds.length > 0)
    .flatMap(node => 
      (node.prereqIds || []).map(prereqId => ({
        from: prereqId,
        to: node.id
      }))
    );

  const resetTalents = () => {
    setTalentState({
      treeId: talentTree.id,
      allocatedPoints: {},
      totalPointsSpent: 0,
      tierUnlocked: 1
    });
  };

  // Find all dependent talents that rely on the given talent
  const findDependentTalents = (talentId: string): string[] => {
    // Find direct dependents (talents that have this talent as a prerequisite)
    const directDependents = talentTree.nodes
      .filter(node => node.prereqIds?.includes(talentId))
      .map(node => node.id);
    
    // Recursively find dependents of the direct dependents
    const allDependents = [...directDependents];
    
    directDependents.forEach(dependentId => {
      const nestedDependents = findDependentTalents(dependentId);
      allDependents.push(...nestedDependents);
    });
    
    return allDependents;
  };

  // Reset a talent and all its dependencies
  const resetTalent = (nodeId: string) => {
    // Find all talents that depend on this one
    const dependentTalents = findDependentTalents(nodeId);
    
    // Include the talent itself in the list of talents to reset
    const talentsToReset = [nodeId, ...dependentTalents];
    
    setTalentState(prev => {
      const newAllocated = { ...prev.allocatedPoints };
      let pointsRemoved = 0;
      
      // Remove all points from the talents to reset
      talentsToReset.forEach(id => {
        if (newAllocated[id]) {
          pointsRemoved += newAllocated[id];
          delete newAllocated[id];
        }
      });
      
      const newTotal = prev.totalPointsSpent - pointsRemoved;
      
      // Calculate new tier unlocked
      const newTierUnlocked = Math.max(
        1,
        Math.min(
          Math.floor(newTotal / talentTree.pointsPerTier) + 1,
          talentTree.totalTiers
        )
      );
      
      return {
        ...prev,
        allocatedPoints: newAllocated,
        totalPointsSpent: newTotal,
        tierUnlocked: newTierUnlocked
      };
    });
  };

  const isNodeAvailable = (nodeId: string, tier: number) => {
    // Check if the node's tier is unlocked
    if (tier > talentState.tierUnlocked) {
      return false;
    }

    // Check if prerequisites are met
    const node = talentTree.nodes.find(n => n.id === nodeId);
    if (node?.prereqIds) {
      return node.prereqIds.every(prereqId => {
        const prereqNode = talentTree.nodes.find(n => n.id === prereqId);
        if (!prereqNode) return false;
        
        // Check if the prerequisite talent has all points invested
        const pointsInPrereq = talentState.allocatedPoints[prereqId] || 0;
        return pointsInPrereq >= prereqNode.maxPoints;
      });
    }

    return true;
  };

  const addPoint = (nodeId: string) => {
    const node = talentTree.nodes.find(n => n.id === nodeId);
    if (!node) return;

    const currentPoints = talentState.allocatedPoints[nodeId] || 0;
    
    if (
      currentPoints < node.maxPoints && 
      isNodeAvailable(nodeId, node.tier) && 
      talentState.totalPointsSpent < talentTree.maxPoints
    ) {
      setTalentState(prev => {
        const newAllocated = { 
          ...prev.allocatedPoints, 
          [nodeId]: currentPoints + 1 
        };
        
        const newTotal = prev.totalPointsSpent + 1;
        
        // Calculate new tier unlocked
        const newTierUnlocked = Math.min(
          Math.floor(newTotal / talentTree.pointsPerTier) + 1,
          talentTree.totalTiers
        );
        
        return {
          ...prev,
          allocatedPoints: newAllocated,
          totalPointsSpent: newTotal,
          tierUnlocked: newTierUnlocked
        };
      });
    }
  };

  const removePoint = (nodeId: string) => {
    const currentPoints = talentState.allocatedPoints[nodeId] || 0;
    
    if (currentPoints > 0) {
      // Check if this node is a prerequisite for any points spent in other nodes
      // For the new requirement, we need to check if removing a point would make
      // the prerequisite no longer fully invested
      const dependentNodes = talentTree.nodes.filter(node => 
        node.prereqIds?.includes(nodeId) && 
        (talentState.allocatedPoints[node.id] || 0) > 0
      );
      
      // If there are dependent nodes and removing a point would make the prereq not fully invested
      if (dependentNodes.length > 0) {
        const thisNode = talentTree.nodes.find(n => n.id === nodeId);
        if (!thisNode) return;
        
        // If removing a point would make this node no longer fully invested
        if (currentPoints <= thisNode.maxPoints && currentPoints - 1 < thisNode.maxPoints) {
          // Can't remove points from prerequisites that need to be fully invested
          return;
        }
      }
      
      setTalentState(prev => {
        const newAllocated = { ...prev.allocatedPoints };
        newAllocated[nodeId] = currentPoints - 1;
        
        if (newAllocated[nodeId] === 0) {
          delete newAllocated[nodeId];
        }
        
        const newTotal = prev.totalPointsSpent - 1;
        
        // Calculate new tier unlocked
        const newTierUnlocked = Math.max(
          1,
          Math.min(
            Math.floor(newTotal / talentTree.pointsPerTier) + 1,
            talentTree.totalTiers
          )
        );
        
        return {
          ...prev,
          allocatedPoints: newAllocated,
          totalPointsSpent: newTotal,
          tierUnlocked: newTierUnlocked
        };
      });
    }
  };

  // Determine if a connection should be highlighted based on both nodes having points
  const isConnectionActive = (fromId: string, toId: string) => {
    return (talentState.allocatedPoints[fromId] || 0) > 0 && 
           (talentState.allocatedPoints[toId] || 0) > 0;
  };

  return (
    <div className="talent-tree">
      <div className="talent-tree-header">
        <h2>{talentTree.name}</h2>
        <p>{talentTree.description}</p>
        <div className="talent-points-info">
          <span>Points spent: {talentState.totalPointsSpent}/{talentTree.maxPoints}</span>
          <span>Tier unlocked: {talentState.tierUnlocked}/{talentTree.totalTiers}</span>
          <button 
            className="reset-button"
            onClick={resetTalents}
            disabled={talentState.totalPointsSpent === 0}
          >
            Reset Points
          </button>
        </div>
      </div>
      
      <div className="talent-grid">
        {prerequisiteConnections.map(conn => (
          <TalentArrow
            key={`${conn.from}-${conn.to}`}
            fromNodeId={conn.from}
            toNodeId={conn.to}
            isActive={isConnectionActive(conn.from, conn.to)}
          />
        ))}
        
        {talentTree.nodes.map(node => (
          <TalentNode
            key={node.id}
            node={node}
            currentPoints={talentState.allocatedPoints[node.id] || 0}
            isAvailable={isNodeAvailable(node.id, node.tier)}
            onAddPoint={() => addPoint(node.id)}
            onRemovePoint={() => removePoint(node.id)}
            onResetTalent={() => resetTalent(node.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default TalentTree;