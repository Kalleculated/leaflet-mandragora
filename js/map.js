// Map initialization and management
const MapManager = (function() {
    let map = null;
    let markerLayers = {};
    let imageLayers = {};
    let activeLayerId = null;
    
    // Initialize the map with configuration
    function initializeMap() {
      map = L.map('map', {
        crs: L.CRS.Simple,
        minZoom: CONFIG.map.minZoom,
        maxZoom: CONFIG.map.maxZoom
      });
      
      CONFIG.map.layers.forEach(layerConfig => {
        imageLayers[layerConfig.id] = L.imageOverlay(layerConfig.imagePath, CONFIG.map.bounds, {
          errorOverlayUrl: CONFIG.fallbacks.mapOverlay(CONFIG.map.bounds[1][1], CONFIG.map.bounds[1][0]),
          alt: `Map Layer: ${layerConfig.name}`
        });
        markerLayers[layerConfig.id] = L.layerGroup();
      });
      
      setActiveLayer(CONFIG.map.defaultLayer);
      map.fitBounds(CONFIG.map.bounds);
      map.setZoom(CONFIG.map.initialZoom);
      createLayerControl();
      
      // Add click event to capture coordinates
      map.on('click', function(e) {
        const coords = e.latlng;
        
        // Create temporary marker at click location
        const tempMarker = L.marker(coords).addTo(map);
        
        // Popup with coordinates
        const coordStr = `[${Math.round(coords.lat)}, ${Math.round(coords.lng)}]`;
        tempMarker.bindPopup(`<b>Coordinates:</b><br>${coordStr}`).openPopup();
        
        // Log to console for copying
        console.log(`Coordinates: ${coordStr}`);
        
        // Auto-remove marker after 5 seconds
        setTimeout(() => {
          map.removeLayer(tempMarker);
        }, 5000);
      });
    }
    
    function setActiveLayer(layerId) {
      if (activeLayerId) {
        imageLayers[activeLayerId].removeFrom(map);
        markerLayers[activeLayerId].removeFrom(map);
      }
      
      imageLayers[layerId].addTo(map);
      markerLayers[layerId].addTo(map);
      activeLayerId = layerId;
      
      // Update layer control buttons to match current state
      const buttons = document.querySelectorAll('.layer-toggle-btn');
      buttons.forEach(btn => {
        if (btn.dataset.layerId === layerId) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }
    
    // Update createLayerControl function in MapManager
    function createLayerControl() {
        const LayerControl = L.Control.extend({
        options: { position: 'topright' },
        
        onAdd: function() {
            const container = L.DomUtil.create('div', 'leaflet-control leaflet-control-layers custom-layer-control');
            
            CONFIG.map.layers.forEach(layerConfig => {
            const btn = L.DomUtil.create('button', 'layer-toggle-btn', container);
            btn.textContent = layerConfig.name;
            btn.dataset.layerId = layerConfig.id;
            
            if (layerConfig.id === CONFIG.map.defaultLayer) {
                btn.classList.add('active');
            }
            
            L.DomEvent.on(btn, 'click', function(e) {
                // Stop propagation to prevent map click event
                L.DomEvent.stopPropagation(e);
                
                container.querySelectorAll('.layer-toggle-btn').forEach(button => {
                button.classList.remove('active');
                });
                btn.classList.add('active');
                setActiveLayer(layerConfig.id);
            });
            });
            
            // Prevent clicks on the control from triggering map events
            L.DomEvent.disableClickPropagation(container);
            
            return container;
        }
        });
        
        map.addControl(new LayerControl());
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
        map.setView(coords, zoom || CONFIG.search.resultZoomLevel);
      },
      
      getClickCoordinates: function(callback) {
        const clickHandler = function(e) {
          const coords = [Math.round(e.latlng.lat), Math.round(e.latlng.lng)];
          callback(coords);
          map.off('click', clickHandler); // Remove listener after one use
        };
        
        map.once('click', clickHandler);
      }
    };
  })();