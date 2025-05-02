// Global configuration constants
const CONFIG = {
    // Map configuration
    map: {
      layers: [
        { id: 'layer1', name: 'Layer 1', imagePath: 'assets/maps/Layer1.jpg' },
        { id: 'layer2', name: 'Layer 2', imagePath: 'assets/maps/Layer2.jpg' }
      ],
      bounds: [[0, 0], [2384, 9757]],
      initialZoom: -2,
      minZoom: -5,
      maxZoom: 5,
      defaultLayer: 'layer1'
    },
    
    // Search configuration
    search: {
      minLength: 2,
      resultZoomLevel: 0
    },
    
    // Image fallbacks
    fallbacks: {
      markerImage: 'https://placehold.co/150x100/eee/ccc?text=No+Image',
      mapOverlay: (width, height) => `https://placehold.co/${width}x${height}/EEE/CCC?text=Base+Map+Not+Found`
    }
  };