import { useState, useEffect } from 'react';
import './App.css';
import TalentTree from './components/TalentTree';
import SpellList from './components/SpellList';
import ClassSelector from './components/ClassSelector';
import { TalentTree as TalentTreeType } from './types/talents';
import { SpellList as SpellListType } from './types/spells';
import { ClassInfo } from './types/classes';
import ClassLoader from './utils/ClassLoader';

function App() {
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [talentTreeData, setTalentTreeData] = useState<TalentTreeType | null>(null);
  const [spellListData, setSpellListData] = useState<SpellListType | null>(null);
  const [talentPointsSpent, setTalentPointsSpent] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load available classes on component mount
  useEffect(() => {
    const loadClasses = async () => {
      setLoading(true);
      const classData = await ClassLoader.loadClassList();
      setClasses(classData);
      setLoading(false);
    };
    
    loadClasses();
  }, []);

  // Load class data when a class is selected
  useEffect(() => {
    if (!selectedClass) return;
    
    const loadClassData = async () => {
      setLoading(true);
      
      try {
        // Load talent tree and spell data for selected class
        const talents = await ClassLoader.loadTalents(selectedClass);
        const spells = await ClassLoader.loadSpells(selectedClass);
        
        setTalentTreeData(talents);
        setSpellListData(spells);
      } catch (error) {
        console.error('Error loading class data:', error);
      }
      
      setLoading(false);
    };
    
    loadClassData();
  }, [selectedClass]);

  // Reset talents when changing classes
  useEffect(() => {
    setTalentPointsSpent(0);
  }, [selectedClass]);

  // Handle class selection
  const handleClassSelect = (classId: string) => {
    setSelectedClass(classId);
  };

  // Handle returning to class selection
  const handleBackToSelection = () => {
    setSelectedClass(null);
    setTalentTreeData(null);
    setSpellListData(null);
    setTalentPointsSpent(0);
  };

  // Callback for tracking talent points spent
  const handleTalentPointsChange = (pointsSpent: number) => {
    setTalentPointsSpent(pointsSpent);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Talent Calculator</h1>
        <p>Plan your character's talents and spells</p>
        {selectedClass && (
          <button 
            className="back-button" 
            onClick={handleBackToSelection}
          >
            &lt; Back to Class Selection
          </button>
        )}
      </header>
      
      <main className="app-main">
        {loading && <div className="loading-spinner">Loading data...</div>}
        
        {!loading && !selectedClass && (
          <ClassSelector 
            classes={classes} 
            onClassSelect={handleClassSelect} 
          />
        )}
        
        {!loading && selectedClass && talentTreeData && spellListData && (
          <div className="calculator-container">
            <TalentTree 
              talentTree={talentTreeData} 
              onPointsChanged={handleTalentPointsChange}
            />
            
            <SpellList 
              spellList={spellListData} 
              talentPointsSpent={talentPointsSpent}
            />
          </div>
        )}
      </main>
      
      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Talent Calculator</p>
      </footer>
    </div>
  );
}

export default App;
