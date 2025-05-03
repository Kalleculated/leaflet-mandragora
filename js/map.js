import { CONFIG } from './config.js';

// Map initialization and management
export const MapManager = (() => {
  let map = null;
  let markerLayers = {};
  let imageLayers = {};
  let activeLayerId = null;
  
  // Initialize the map with configuration
  function initializeMap() {
    console.log('[Map] Initializing map');
    
    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
      console.error('[Map] Map container not found');
      return;
    }
    
    try {
      map = L.map('map', {
        crs: L.CRS.Simple,
        minZoom: CONFIG.map.minZoom,
        maxZoom: CONFIG.map.maxZoom
      });
      
      CONFIG.map.layers.forEach(layerConfig => {
        console.log(`[Map] Adding layer: ${layerConfig.id}`);
        
        imageLayers[layerConfig.id] = L.imageOverlay(layerConfig.imagePath, CONFIG.map.bounds, {
          errorOverlayUrl: CONFIG.fallbacks.mapOverlay(CONFIG.map.bounds[1][1], CONFIG.map.bounds[1][0]),
          alt: `Map Layer: ${layerConfig.name}`
        });
        
        markerLayers[layerConfig.id] = L.layerGroup();
      });
      
      setActiveLayer(CONFIG.map.defaultLayer);
      map.fitBounds(CONFIG.map.bounds);
      map.setZoom(CONFIG.map.initialZoom);
      
      // Add click event to capture coordinates
      map.on('click', function(e) {
        const coords = e.latlng;
        
        // Create temporary marker at click location
        const tempMarker = L.marker(coords).addTo(map);
        
        // Popup with coordinates
        const coordStr = `[${Math.round(coords.lat)}, ${Math.round(coords.lng)}]`;
        tempMarker.bindPopup(`<b>Coordinates:</b><br>${coordStr}`).openPopup();
        
        // Log to console for copying
        console.log(`[Map] Coordinates clicked: ${coordStr}`);
        
        // Auto-remove marker after 5 seconds
        setTimeout(() => {
          map.removeLayer(tempMarker);
        }, 5000);
      });
      
      console.log('[Map] Map initialized successfully');
    } catch (error) {
      console.error('[Map] Error initializing map:', error);
    }
  }
  
  function setActiveLayer(layerId) {
    console.log(`[Map] Setting active layer: ${layerId}`);
    
    if (!imageLayers[layerId]) {
      console.error(`[Map] Layer not found: ${layerId}`);
      return;
    }
    
    if (activeLayerId && imageLayers[activeLayerId]) {
      imageLayers[activeLayerId].removeFrom(map);
      markerLayers[activeLayerId].removeFrom(map);
    }
    
    imageLayers[layerId].addTo(map);
    markerLayers[layerId].addTo(map);
    activeLayerId = layerId;
    
    // Always update UI buttons to match current state
    const buttons = document.querySelectorAll('.layer-toggle-btn');
    buttons.forEach(btn => {
      if (btn.dataset.layerId === layerId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    console.log(`[Map] Active layer set to: ${layerId}`);
  }
  
  // Public API
  return {
    init: function() {
      initializeMap();
    },
    
    getMap: function() {
      return map;
    },
    
    getMarkerLayer: function(layerId) {
      return layerId ? markerLayers[layerId] : markerLayers[activeLayerId];
    },
    
    getActiveLayerId: function() {
      return activeLayerId;
    },
    
    setActiveLayer: setActiveLayer,
    
    setView: function(coords, zoom) {
      if (!map) {
        console.error('[Map] Map not initialized');
        return;
      }
      
      map.setView(coords, zoom || CONFIG.search.resultZoomLevel);
      console.log(`[Map] View set to ${coords} at zoom level ${zoom || CONFIG.search.resultZoomLevel}`);
    },
    
    getClickCoordinates: function(callback) {
      if (!map) {
        console.error('[Map] Map not initialized');
        return;
      }
      
      const clickHandler = function(e) {
        const coords = [Math.round(e.latlng.lat), Math.round(e.latlng.lng)];
        callback(coords);
        map.off('click', clickHandler); // Remove listener after one use
      };
      
      map.once('click', clickHandler);
      console.log('[Map] Click coordinates handler activated');
    }
  };
})();