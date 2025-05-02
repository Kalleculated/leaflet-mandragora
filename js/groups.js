// Group management module
const GroupManager = (function() {
    // Define paths for different pin images
    const iconPaths = {
      default: 'assets/pins/pin.png',
      herb: 'assets/pins/pin_Herb.png',
      ore: 'assets/pins/pin_ore.png',
      waypoint: 'assets/pins/pin.png',
      // Add more groups and their icon paths here
    };
  
    // Container for Leaflet Icon objects
    const groupIcons = {};
    
    // Initialize all group icons
    function initializeIcons() {
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
      init: function() {
        initializeIcons();
      },
      
      getIcon: function(group) {
        return groupIcons[group] || groupIcons.default;
      },
      
      getAllGroups: function() {
        return Object.keys(iconPaths);
      }
    };
  })();
