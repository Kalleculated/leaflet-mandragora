// Group management module
const GroupManager = (function() {
    // Define paths for different pin images
    const iconPaths = {
      default: 'assets/pins/pin.png',
      diagram: 'assets/pins/pin_diagram.png',
      herb: 'assets/pins/pin_Herb.png',
      lockpick: 'assets/pins/pin_lockpick.png',
      map: 'assets/pins/pin_map.png',
      ore: 'assets/pins/pin_ore.png',
      waypoint: 'assets/pins/pin.png',
      chest: 'assets/pins/pin.png',
      vendor: 'assets/pins/pin.png',
      boss: 'assets/pins/pin.png'
      // Add more groups and their icon paths here
    };
  
    // Container for Leaflet Icon objects
    const groupIcons = {};
    
    // Add item types tracking
  const itemTypes = new Set();
  
  // Update to collect all item types
  function collectItemTypes(allMarkers) {
    allMarkers.forEach(marker => {
      if (marker.items && Array.isArray(marker.items)) {
        marker.items.forEach(item => {
          if (item.type) {
            itemTypes.add(item.type);
          }
        });
      }
    });
    console.log('[Group] Collected item types:', Array.from(itemTypes));
  }
  
  // Initialize all group icons
  function initializeIcons() {
    // Keep existing implementation
    for (const group in iconPaths) {
      if (iconPaths[group]) {
        groupIcons[group] = L.icon({
          iconUrl: iconPaths[group],
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32]
        });
      } else {
        console.warn(`Icon path not defined for group: ${group}`);
      }
    }
    
    // Ensure a default icon exists
    if (!groupIcons.default) {
      console.error("Default icon path is missing. Markers may not appear correctly.");
      groupIcons.default = new L.Icon.Default();
    }
  }
  
  // Public API
  return {
    init: function(allMarkers) {
      initializeIcons();
      if (allMarkers) {
        collectItemTypes(allMarkers);
      }
    },
    
    getIcon: function(group) {
      return groupIcons[group] || groupIcons.default;
    },
    
    getAllGroups: function() {
      return Object.keys(iconPaths);
    },
    
    getAllItemTypes: function() {
      return Array.from(itemTypes);
    }
  };
})();
