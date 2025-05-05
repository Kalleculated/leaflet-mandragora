import { MapManager } from './map.js';
import { GroupManager } from './groups.js';
import { MarkerManager } from './markers/markers.js';
import { SearchManager } from './search.js';
import { UIControls } from './ui-controls.js';

// Marker data imports
import { WitchstoneMarkers } from './markers/witchstone.js';
import { HerbMarkers } from './markers/herb.js';
import { MapMarkers } from './markers/map.js';
import { OreMarkers } from './markers/ore.js';
import { ChestMarkers } from './markers/chest.js';
import { VendorMarkers } from './markers/vendor.js';
import { BossMarkers } from './markers/boss.js';
import { WoodMarkers } from './markers/wood.js';
import { NestMarkers } from './markers/nest.js';
import { AltarMarkers } from './markers/altar.js';
import { CatMarkers } from './markers/cat.js';
import { ItemMarkers } from './markers/item.js';
import { GoblinMarkers } from './markers/goblin.js';

// Main application initialization
document.addEventListener('DOMContentLoaded', function() {
  console.log('[Main] DOM loaded, initializing application');
  
  try {
    // 1. Initialize the map first
    MapManager.init();
    console.log('[Main] Map initialized');
    
    // 2. Combine all marker data
    const allMarkers = [
      ...WitchstoneMarkers,
      ...HerbMarkers,
      ...OreMarkers,
      ...MapMarkers,
      ...ChestMarkers,
      ...VendorMarkers,
      ...BossMarkers,
      ...WoodMarkers,
      ...NestMarkers,
      ...CatMarkers,
      ...AltarMarkers,
      ...ItemMarkers,
      ...GoblinMarkers
      // Add any additional group markers
    ];
    console.log(`[Main] Combined ${allMarkers.length} markers`);
    
    // 3. Initialize group icons with all markers
    GroupManager.init(allMarkers);
    console.log('[Main] Group manager initialized with all markers');
    
    // 4. Initialize markers with combined data
    MarkerManager.init(allMarkers);
    console.log('[Main] Markers initialized');
    
    // 5. Initialize search functionality
    SearchManager.init();
    console.log('[Main] Search manager initialized');
    
    // 6. Initialize UI controls (after all other components)
    // Wait a short moment to ensure all modules are fully initialized
    setTimeout(() => {
      UIControls.init();
      console.log('[Main] UI controls initialized');
      console.log('[Main] Interactive map initialized successfully');
    }, 100);
    
  } catch (error) {
    console.error('[Main] Initialization error:', error);
  }
});
