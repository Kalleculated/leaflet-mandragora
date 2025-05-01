// Main application initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components in the correct order
    
    // 1. Initialize the map
    MapManager.init();
    
    // 2. Initialize group icons
    GroupManager.init();
    
    // 3. Combine all marker data
    const allMarkers = [
      ...WaypointMarkers,
      ...HerbMarkers,
      ...OreMarkers,
      // Add any additional group markers
    ];
    
    // 4. Initialize markers with combined data
    MarkerManager.init(allMarkers);
    
    // 5. Initialize search functionality
    SearchManager.init();
    
    console.log('Interactive map initialized successfully');
  });
