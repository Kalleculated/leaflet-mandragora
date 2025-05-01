// Search functionality
const SearchManager = (function() {
  let resultsContainer = null;
  const searchContainer = document.querySelector('.search-container');
  const customSearchInput = document.getElementById('custom-search-input');
  
  // Get or create results container
  function getResultsContainer() {
    if (!resultsContainer) {
      resultsContainer = document.createElement('div');
      resultsContainer.id = 'search-results';
      searchContainer.appendChild(resultsContainer);
    }
    return resultsContainer;
  }
  
  // Remove results container
  function removeResultsContainer() {
    if (resultsContainer) {
      resultsContainer.remove();
      resultsContainer = null;
    }
  }
  
  // Handle search input
  function handleSearchInput(e) {
    const searchText = e.target.value.trim().toLowerCase();
    const currentResultsContainer = getResultsContainer();
    currentResultsContainer.innerHTML = '';
    
    if (searchText.length >= CONFIG.search.minLength) {
      // Get all markers from MarkerManager
      const allMarkers = MarkerManager.getAllMarkers();
      
      // Filter matching markers
      const matchingMarkers = allMarkers.filter(item =>
        item.name.toLowerCase().includes(searchText)
      );
      
      if (matchingMarkers.length > 0) {
        matchingMarkers.forEach(item => {
          const resultItem = document.createElement('div');
          resultItem.className = 'search-result-item';
          
          // Add layer information to the search result
          resultItem.innerHTML = `
            <span>${item.name}</span>
            <span class="layer-label">(${CONFIG.map.layers.find(l => l.id === item.layer)?.name || 'Unknown Layer'})</span>
          `;
          
          resultItem.addEventListener('click', function() {
            const markerData = MarkerManager.getMarkerData(item.name);
            if (markerData) {
              // Activate the layer for this marker
              MapManager.setActiveLayer(markerData.layer);
              
              // Find the marker and open its popup
              const marker = MarkerManager.getMarker(item.name);
              if (marker) {
                MapManager.setView(marker.getLatLng(), CONFIG.search.resultZoomLevel);
                marker.openPopup();
                customSearchInput.value = item.name;
                removeResultsContainer();
              } else {
                console.error("Marker data found but marker instance not in map for:", item.name);
                MapManager.setView(markerData.coords, CONFIG.search.resultZoomLevel);
                removeResultsContainer();
              }
            }
          });
          
          currentResultsContainer.appendChild(resultItem);
        });
      } else {
        const noResults = document.createElement('div');
        noResults.textContent = 'No locations found';
        noResults.className = 'no-results';
        currentResultsContainer.appendChild(noResults);
      }
    } else {
      removeResultsContainer();
    }
  }
  
  // Initialize search event listeners
  function initializeEventListeners() {
    // Input handler
    customSearchInput.addEventListener('input', handleSearchInput);
    
    // Escape key handler
    customSearchInput.addEventListener('keydown', function(e) {
      if (e.key === "Escape") {
        removeResultsContainer();
      }
    });
    
    // Click outside handler
    document.addEventListener('click', function(e) {
      const isClickInSearch = searchContainer.contains(e.target);
      const isClickInPopup = e.target.closest('.leaflet-popup');
      const mapContainer = MapManager.getMap().getContainer();
      const isClickOnMapOrChildren = mapContainer.contains(e.target) && 
                                    !isClickInPopup && 
                                    !isClickInSearch;
      
      if (!isClickInSearch && !isClickInPopup && !isClickOnMapOrChildren) {
        removeResultsContainer();
      }
    });
    
    // Enter key handler
    customSearchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        const firstResult = resultsContainer?.querySelector('.search-result-item');
        if (firstResult) {
          firstResult.click();
        }
      }
    });
  }
  
  // Public API
  return {
    init: function() {
      initializeEventListeners();
    },
    
    // Search in specific layer only
    searchInLayer: function(text, layerId) {
      const layerMarkers = MarkerManager.getLayerMarkers(layerId);
      return layerMarkers.filter(item => 
        item.name.toLowerCase().includes(text.toLowerCase())
      );
    }
  };
})();