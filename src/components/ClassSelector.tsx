import { useState } from 'react';
import '../styles/ClassSelector.css';
import { ClassInfo } from '../types/classes';

interface ClassSelectorProps {
  classes: ClassInfo[];
  onClassSelect: (classId: string) => void;
}

const ClassSelector: React.FC<ClassSelectorProps> = ({ classes, onClassSelect }) => {
  const [hoveredClass, setHoveredClass] = useState<string | null>(null);

  return (
    <div className="class-selector">
      <div className="class-selector-header">
        <h2>Choose Your Class</h2>
        <p>Select a class to view and plan their talents and abilities</p>
      </div>

      <div className="class-cards-container">
        {classes.map((classData) => (
          <div
            key={classData.id}
            className={`class-card ${hoveredClass === classData.id ? 'hovered' : ''}`}
            onClick={() => onClassSelect(classData.id)}
            onMouseEnter={() => setHoveredClass(classData.id)}
            onMouseLeave={() => setHoveredClass(null)}
          >
            <div 
              className="class-icon" 
              style={{ backgroundColor: classData.iconColor }}
            >
              {classData.name.charAt(0)}
            </div>
            <div className="class-info">
              <h3>{classData.name}</h3>
              <p>{classData.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassSelector;