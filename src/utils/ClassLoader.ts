import type { ClassInfo } from '../types/classes';

/**
 * Class loader utility to dynamically load class data from our folder structure
 */
class ClassLoader {
  private classes: ClassInfo[] = [];
  private classIds: string[] = ['mage', 'warrior']; // This could be dynamically generated in a real app
  
  /**
   * Load all available class metadata
   */
  async loadClassList(): Promise<ClassInfo[]> {
    try {
      const classPromises = this.classIds.map(this.loadClassMetadata);
      this.classes = await Promise.all(classPromises);
      return this.classes;
    } catch (error) {
      console.error('Error loading class list:', error);
      return [];
    }
  }
  
  /**
   * Load a single class's metadata
   */
  loadClassMetadata = async (classId: string): Promise<ClassInfo> => {
    try {
      // Using dynamic import for JSON files
      const metadataModule = await import(`../data/classes/${classId}/metadata.json`);
      // Handle both ESM and CommonJS module formats
      const metadata = metadataModule.default || metadataModule;
      return metadata as ClassInfo;
    } catch (error) {
      console.error(`Error loading class metadata for ${classId}:`, error);
      // Return a minimal default if we can't load the metadata
      return {
        id: classId,
        name: classId.charAt(0).toUpperCase() + classId.slice(1),
        description: 'Class description unavailable',
        iconColor: '#999999'
      };
    }
  };
  
  /**
   * Load talent data for a specific class
   */
  async loadTalents(classId: string) {
    try {
      const talentsModule = await import(`../data/classes/${classId}/talents.json`);
      // Handle both ESM and CommonJS module formats
      return talentsModule.default || talentsModule;
    } catch (error) {
      console.error(`Error loading talents for ${classId}:`, error);
      return null;
    }
  }
  
  /**
   * Load spell data for a specific class
   */
  async loadSpells(classId: string) {
    try {
      const spellsModule = await import(`../data/classes/${classId}/spells.json`);
      // Handle both ESM and CommonJS module formats
      return spellsModule.default || spellsModule;
    } catch (error) {
      console.error(`Error loading spells for ${classId}:`, error);
      return null;
    }
  }
}

// Export a singleton instance
export default new ClassLoader();