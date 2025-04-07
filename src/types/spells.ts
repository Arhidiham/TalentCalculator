export interface SpellRank {
  rank: number;
  description: string;
  talentPointsRequired: number;
}

export interface Spell {
  id: string;
  name: string;
  iconPath?: string; // Optional path to spell icon
  color?: string;
  ranks: SpellRank[];
}

export interface SpellList {
  id: string;
  name: string;
  description: string;
  spells: Spell[];
  maxPoints: number;
}

export interface SpellState {
  classId: string;
  allocatedPoints: {
    [spellId: string]: number;
  };
  totalPointsSpent: number;
}