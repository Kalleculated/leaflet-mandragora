// Global configuration constants
const CONFIG = {
    // Map configuration
    map: {
      imagePath: 'assets/maps/Mandragora-full-map.jpg',
      bounds: [[0, 0], [4639, 9639]],
      initialZoom: -2,
      minZoom: -5,
      maxZoom: 5
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