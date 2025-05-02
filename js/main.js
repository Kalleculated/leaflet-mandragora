// Main application initialization
document.addEventListener('DOMContentLoaded', function() {
  console.log('[Main] DOM loaded, initializing application');
  
  try {
    // 1. Initialize the map first
    if (typeof MapManager === 'undefined') {
      throw new Error('MapManager is not defined');
    }
    
    MapManager.init();
    console.log('[Main] Map initialized');
    
    // 2. Initialize group icons
    if (typeof GroupManager === 'undefined') {
      throw new Error('GroupManager is not defined');
    }
    
    GroupManager.init();
    console.log('[Main] Group manager initialized');
    
    // 3. Combine all marker data
    if (typeof WaypointMarkers === 'undefined' || 
        typeof HerbMarkers === 'undefined' || 
        typeof OreMarkers === 'undefined') {
      throw new Error('One or more marker data arrays are not defined');
    }
    
    const allMarkers = [
      ...WaypointMarkers,
      ...HerbMarkers,
      ...OreMarkers,
      // Add any additional group markers
    ];
    console.log(`[Main] Combined ${allMarkers.length} markers`);
    
    // 4. Initialize markers with combined data
    if (typeof MarkerManager === 'undefined') {
      throw new Error('MarkerManager is not defined');
    }
    
    MarkerManager.init(allMarkers);
    console.log('[Main] Markers initialized');
    
    // 5. Initialize search functionality
    if (typeof SearchManager === 'undefined') {
      throw new Error('SearchManager is not defined');
    }
    
    SearchManager.init();
    console.log('[Main] Search manager initialized');
    
    // 6. Initialize UI controls (after all other components)
    if (typeof UIControls === 'undefined') {
      throw new Error('UIControls is not defined');
    }
    
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