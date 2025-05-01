// Map initialization and management
const MapManager = (function() {
    let map = null;
    let markerLayer = null;
    
    // Initialize the map with configuration
    function initializeMap() {
      // Create map with config options
      map = L.map('map', {
        crs: L.CRS.Simple,
        minZoom: CONFIG.map.minZoom,
        maxZoom: CONFIG.map.maxZoom
      });
      
      // Add the image overlay for the map
      const width = CONFIG.map.bounds[1][1];
      const height = CONFIG.map.bounds[1][0];
      
      const image = L.imageOverlay(CONFIG.map.imagePath, CONFIG.map.bounds, {
        errorOverlayUrl: CONFIG.fallbacks.mapOverlay(width, height),
        alt: 'Map Background Image'
      }).addTo(map);
      
      // Fit map view to the bounds
      map.fitBounds(CONFIG.map.bounds);
      map.setZoom(CONFIG.map.initialZoom);
      
      // Create layer for markers
      markerLayer = L.layerGroup().addTo(map);
      
      // Initialize Leaflet Search Control
      if (L.Control.Search) {
        const searchControl = new L.Control.Search({
          layer: markerLayer,
          propertyName: 'name',
          marker: false,
          zoom: CONFIG.search.resultZoomLevel,
          initial: false,
          collapsed: true,
          textPlaceholder: 'Search...',
          moveToLocation: function(latlng, title, mapRef) { }
        });
        // map.addControl(searchControl); // Uncomment if needed
      } else {
        console.warn("Leaflet Control Search library not loaded correctly.");
      }
    }
    
    // Public API
    return {
      init: function() {
        initializeMap();
      },
      
      getMap: function() {
        return map;
      },
      
      getMarkerLayer: function() {
        return markerLayer;
      },
      
      // Set view to specific coordinates
      setView: function(coords, zoom) {
        map.setView(coords, zoom || CONFIG.search.resultZoomLevel);
      }
    };
  })();