export interface TalentNode {
  id: string;
  name: string;
  description: string;
  tier: number;
  column: number;
  maxPoints: number;
  color?: string;
  iconPath?: string; // Optional path to talent icon
  prereqIds?: string[];
}

export interface TalentTree {
  id: string;
  name: string;
  description: string;
  nodes: TalentNode[];
  maxPoints: number;
  pointsPerTier: number;
  totalTiers: number;
}

export interface TalentState {
  treeId: string;
  allocatedPoints: {
    [nodeId: string]: number;
  };
  totalPointsSpent: number;
  tierUnlocked: number;
}