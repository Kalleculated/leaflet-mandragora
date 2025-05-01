// js/map.js - Replace with layer-aware implementation
const MapManager = (function() {
    let map = null;
    let markerLayers = {};
    let imageLayers = {};
    let activeLayerId = null;
    
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
            
            L.DomEvent.on(btn, 'click', function() {
              container.querySelectorAll('.layer-toggle-btn').forEach(button => {
                button.classList.remove('active');
              });
              btn.classList.add('active');
              setActiveLayer(layerConfig.id);
            });
          });
          
          return container;
        }
      });
      
      map.addControl(new LayerControl());
    }
    
    return {
      init: initializeMap,
      getMap: () => map,
      getMarkerLayer: (layerId) => layerId ? markerLayers[layerId] : markerLayers[activeLayerId],
      getActiveLayerId: () => activeLayerId,
      setActiveLayer: setActiveLayer,
      setView: (coords, zoom) => map.setView(coords, zoom || CONFIG.search.resultZoomLevel)
    };
  })();