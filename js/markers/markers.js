// Core marker management
const MarkerManager = (function() {
  // Store all markers for quick lookup
  const markersMap = new Map();
  let markerData = [];
  let activePopupMarker = null;
  
  // Handle custom popup display
  function showBottomPopup(name, group, imageUrl = null) {
    console.log(`[Marker] Showing bottom popup for: ${name}`);
    
    // Get DOM elements
    const popup = document.getElementById('bottom-popup');
    const popupTitle = document.getElementById('popup-title');
    const popupIcon = document.getElementById('popup-icon');
    const popupRegion = document.getElementById('popup-region');
    
    if (!popup || !popupTitle || !popupIcon) {
      console.error('[Marker] Bottom popup elements not found in DOM');
      return;
    }
    
    // Set popup content
    popupTitle.textContent = name;
    
    // Set icon
    try {
      if (typeof GroupManager !== 'undefined' && GroupManager.getIcon) {
        const icon = GroupManager.getIcon(group);
        if (icon && icon.options && icon.options.iconUrl) {
          popupIcon.src = icon.options.iconUrl;
          popupIcon.alt = group;
        } else {
          popupIcon.src = CONFIG.fallbacks.markerImage;
          popupIcon.alt = 'Icon';
        }
      } else {
        popupIcon.src = CONFIG.fallbacks.markerImage;
        popupIcon.alt = 'Icon';
      }
    } catch (error) {
      console.error(`[Marker] Error getting icon for group ${group}:`, error);
      popupIcon.src = CONFIG.fallbacks.markerImage;
      popupIcon.alt = 'Icon';
    }
    
    // Show popup
    popup.classList.add('active');
    
    // Setup close button
    const closeBtn = document.getElementById('close-popup');
    if (closeBtn) {
      closeBtn.onclick = hideBottomPopup;
    }
  }
  
  // Hide bottom popup
  function hideBottomPopup() {
    console.log('[Marker] Hiding bottom popup');
    
    const popup = document.getElementById('bottom-popup');
    if (popup) {
      popup.classList.remove('active');
    }
    
    activePopupMarker = null;
  }
  
  // Create popup content (for legacy popup support)
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
        console.warn(`[Marker] Failed to load image: ${imageUrl}. Using placeholder.`);
      };
      container.appendChild(img);
      container.appendChild(document.createElement('br'));
    }
    
    return container;
  }
  
  // Add a marker to the map
  function addMarker(data) {
    const { name, coords, group = 'default', imageUrl = null, layer = CONFIG.map.defaultLayer } = data;
    
    if (!name || !coords) {
      console.warn("[Marker] Skipping marker: Missing name or coords.", data);
      return null;
    }
    
    // Normalize marker name for lookup
    const normalizedName = name.toLowerCase();
    
    // Prevent adding duplicate names
    if (markersMap.has(normalizedName)) {
      console.warn(`[Marker] Marker with name "${name}" already exists.`);
      return null;
    }
    
    // Get the icon for the group
    let markerIcon;
    try {
      if (typeof GroupManager !== 'undefined' && GroupManager.getIcon) {
        markerIcon = GroupManager.getIcon(group);
      } else {
        console.warn(`[Marker] GroupManager not available, using default icon for ${name}`);
        markerIcon = new L.Icon.Default();
      }
    } catch (error) {
      console.error(`[Marker] Error getting icon for group ${group}:`, error);
      markerIcon = new L.Icon.Default();
    }
    
    // Create marker
    let marker;
    try {
      marker = L.marker(coords, {
        icon: markerIcon,
        title: name
      });
    } catch (error) {
      console.error(`[Marker] Error creating marker for ${name}:`, error);
      return null;
    }
    
    // Add to appropriate layer
    try {
      if (typeof MapManager !== 'undefined' && MapManager.getMarkerLayer) {
        marker.addTo(MapManager.getMarkerLayer(layer));
      } else {
        console.error(`[Marker] MapManager not available, cannot add marker ${name} to layer ${layer}`);
        return null;
      }
    } catch (error) {
      console.error(`[Marker] Error adding marker ${name} to layer ${layer}:`, error);
      return null;
    }
    
    // Use custom popup behavior instead of default Leaflet popup
    marker.on('click', function() {
      // Hide previous popup if exists
      if (activePopupMarker && activePopupMarker !== marker) {
        hideBottomPopup();
      }
      
      // Show bottom popup
      showBottomPopup(name, group, imageUrl);
      activePopupMarker = marker;
    });
    
    // Store marker data for search
    marker.feature = { properties: { name, layer, group } };
    
    // Store in map with normalized (lowercase) key for case-insensitive lookup
    markersMap.set(normalizedName, { 
      marker, 
      data: {...data, layer} 
    });
    
    console.log(`[Marker] Added: ${name} (Group: ${group}, Layer: ${layer}) at ${coords}`);
    return marker;
  }
  
  // Initialize event listeners for the popup
  function initPopupListeners() {
    // Setup close button
    const closeBtn = document.getElementById('close-popup');
    if (closeBtn) {
      closeBtn.addEventListener('click', hideBottomPopup);
    }
    
    // Close popup when clicking outside
    document.addEventListener('click', function(event) {
      const popup = document.getElementById('bottom-popup');
      if (!popup) return;
      
      // Check if click is outside the popup and not on a marker or search result
      const isMarkerClick = event.target.closest('.leaflet-marker-icon');
      const isPopupClick = event.target.closest('#bottom-popup');
      const isSearchResultClick = event.target.closest('.search-result-item');
      
      if (!isMarkerClick && !isPopupClick && !isSearchResultClick && popup.classList.contains('active')) {
        hideBottomPopup();
      }
    });
    
    // Close popup when pressing escape
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape') {
        hideBottomPopup();
      }
    });
  }
  
  
  // Public API
  return {
    init: function(initialMarkers) {
      console.log(`[Marker] Initializing with ${initialMarkers ? initialMarkers.length : 0} markers`);
      
      // Clear existing markers
      markersMap.clear();
      markerData = initialMarkers || [];
      
      // Add initial markers from data
      let successCount = 0;
      markerData.forEach(item => {
        if (addMarker(item)) {
          successCount++;
        }
      });
      
      console.log(`[Marker] Successfully added ${successCount} of ${markerData.length} markers`);
      
      // Setup popup event listeners
      initPopupListeners();
      
      // Debug: List all markers
      console.log('[Marker] Available markers:');
      markersMap.forEach((entry, key) => {
        console.log(`  - ${entry.data.name} (${entry.data.group})`);
      });
    },
    
    addMarker: addMarker,
    
    getMarker: function(name) {
      if (!name) {
        console.warn('[Marker] getMarker called with empty name');
        return null;
      }
      
      // Normalize name for lookup
      const normalizedName = name.toLowerCase();
      const entry = markersMap.get(normalizedName);
      
      if (!entry) {
        console.warn(`[Marker] Marker not found: ${name}`);
        console.log('[Marker] Available markers:', Array.from(markersMap.keys()));
      }
      
      return entry ? entry.marker : null;
    },
    
    getMarkerData: function(name) {
      if (!name) {
        console.warn('[Marker] getMarkerData called with empty name');
        return null;
      }
      
      // Normalize name for lookup
      const normalizedName = name.toLowerCase();
      const entry = markersMap.get(normalizedName);
      
      if (!entry) {
        console.warn(`[Marker] Marker data not found: ${name}`);
      }
      
      return entry ? entry.data : null;
    },
    
    getAllMarkers: function() {
      return Array.from(markersMap.values()).map(entry => entry.data);
    },
    
    getMarkersMap: function() {
      return markersMap;
    },

    // Get all markers for a specific layer
    getLayerMarkers: function(layerId) {
      return Array.from(markersMap.values())
        .filter(entry => entry.data.layer === layerId)
        .map(entry => entry.data);
    },
    
    // Show popup programmatically (for search results)
    showPopupForMarker: function(name) {
      const markerData = this.getMarkerData(name);
      if (!markerData) return;
      
      // Reference to document click handler
      const existingClickHandler = document.onmousedown;
      
      // Temporarily disable document click handler
      document.onmousedown = null;
      
      // Show popup
      showBottomPopup(markerData.name, markerData.group, markerData.imageUrl);
      activePopupMarker = this.getMarker(name);
      
      // Restore click handler after a delay
      setTimeout(() => {
        document.onmousedown = existingClickHandler;
      }, 100);
    },
    
    // Hide popup programmatically
    hidePopup: hideBottomPopup,
    
    // Debug function
    debugMarkers: function() {
      console.log('[Marker] DEBUG - All markers:');
      console.log('Total markers:', markersMap.size);
      
      markersMap.forEach((entry, key) => {
        console.log(`Marker "${key}":`, entry.data);
      });
      
      return {
        count: markersMap.size,
        keys: Array.from(markersMap.keys()),
        markers: this.getAllMarkers()
      };
    }
  };
})();