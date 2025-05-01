// Core marker management
const MarkerManager = (function() {
    // Store all markers for quick lookup
    const markersMap = new Map();
    let markerData = [];
    
    // Create popup content
    function createPopupContent(name, imageUrl = null) {
      const container = document.createElement('div');
      container.innerHTML = `<b>${name}</b><br>`;
      
      // Add image if URL is provided
      if (imageUrl) {
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = name;
        img.onerror = function() {
          this.onerror = null;
          this.src = CONFIG.fallbacks.markerImage;
          this.alt = 'Image not available';
          console.warn(`Failed to load image: ${imageUrl}. Using placeholder.`);
        };
        container.appendChild(img);
        container.appendChild(document.createElement('br'));
      }
      
      return container;
    }
    
    // Add a marker to the map
    function addMarker(data) {
      const { name, coords, group = 'default', imageUrl = null } = data;
      
      if (!name || !coords) {
        console.warn("Skipping marker: Missing name or coords.", data);
        return null;
      }
      
      // Prevent adding duplicate names (case-insensitive)
      if (markersMap.has(name.toLowerCase())) {
        console.warn(`Marker with name "${name}" already exists.`);
        return null;
      }
      
      // Get the icon for the group
      const markerIcon = GroupManager.getIcon(group);
      
      // Create and add the marker
      const marker = L.marker(coords, {
        icon: markerIcon,
        title: name
      }).addTo(MapManager.getMarkerLayer());
      
      // Create and bind popup content
      marker.bindPopup(createPopupContent(name, imageUrl));
      
      // Store marker data for search
      marker.feature = { properties: { name: name } };
      markersMap.set(name.toLowerCase(), marker);
      
      console.log(`Marker added: ${name} (Group: ${group}) at ${coords}`);
      return marker;
    }
    
    // Public API
    return {
      init: function(initialMarkers) {
        markerData = initialMarkers || [];
        // Add initial markers from data
        markerData.forEach(item => addMarker(item));
      },
      
      addMarker: addMarker,
      
      getMarker: function(name) {
        return markersMap.get(name.toLowerCase());
      },
      
      getAllMarkers: function() {
        return markerData;
      },
      
      getMarkersMap: function() {
        return markersMap;
      }
    };
  })();