// Core marker management
const MarkerManager = (function() {
  // Store all markers for quick lookup
  const markersMap = new Map(); // Keeps unique ID -> marker mapping
  const nameToIdMap = new Map(); // Keeps name -> [list of IDs] mapping
  let markerData = [];
  let activePopupMarker = null;
  
  // Handle custom popup display
  function showBottomPopup(name, group, data) {
    console.log(`[Marker] Showing bottom popup for: ${name}`);
    
    // Get DOM elements
    const popup = document.getElementById('bottom-popup');
    const popupTitle = document.getElementById('popup-title');
    const popupIcon = document.getElementById('popup-icon');
    const popupRegion = document.getElementById('popup-region');
    const popupItems = document.getElementById('popup-items');
    
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
    
    // Set type/region based on group
    if (popupRegion) {
      if (group === 'chest') {
        popupRegion.textContent = 'placeholder';  // Changed from 'Chest Contents:'
      } else if (group === 'vendor') {
        popupRegion.textContent = 'placeholder';
      } else if (group === 'waypoint') {
        popupRegion.textContent = 'placeholder';
      } else if (group === 'boss') {
        popupRegion.textContent = 'placeholder';  // Added specific text for boss
      } else {
        popupRegion.textContent = 'placeholder';
      }
    }
    
    // Clear existing items if element exists
    if (popupItems) {
      popupItems.innerHTML = '';
    }
    
    // Add items if present (for chests and vendors) and container exists
    if (popupItems && data && data.items && Array.isArray(data.items) && data.items.length > 0) {
      // Add header for items with text based on group type
      const itemsHeader = document.createElement('div');
      itemsHeader.className = 'items-section-header';
      
      // Set header text based on group type
      if (group === 'chest') {
        itemsHeader.textContent = 'Contains:';
      } else if (group === 'boss') {
        itemsHeader.textContent = 'Drops:';
      } else {
        itemsHeader.textContent = 'Items for Sale';
      }
      
      itemsHeader.style.color = '#aaa';
      itemsHeader.style.fontSize = '14px';
      itemsHeader.style.fontWeight = 'bold';
      itemsHeader.style.marginTop = '10px';
      itemsHeader.style.marginBottom = '5px';
      popupItems.appendChild(itemsHeader);
      
      // Create an item entry for each item
      data.items.forEach(item => {
        const itemEntry = document.createElement('div');
        itemEntry.className = 'item-entry sale-item';
        
        // Create item name span
        const itemName = document.createElement('span');
        itemName.className = 'item-name';
        itemName.textContent = item.name;
        
        // Create item type span if available
        const itemType = document.createElement('span');
        itemType.className = 'item-type';
        itemType.textContent = item.type || '';
        
        // Create view button
        const viewButton = document.createElement('button');
        viewButton.className = 'view-item-btn';
        viewButton.textContent = 'View';
        viewButton.addEventListener('click', function(e) {
          e.stopPropagation(); // Prevent event bubbling
          showItemDetail(item, group === 'vendor');
        });
        
        // Assemble item entry
        itemEntry.appendChild(itemName);
        itemEntry.appendChild(itemType);
        itemEntry.appendChild(viewButton);
        
        // Add to popup
        popupItems.appendChild(itemEntry);
      });
    }
    
    // Add craftable items if present
    if (popupItems && data && data.craftableItems && Array.isArray(data.craftableItems) && data.craftableItems.length > 0) {
      // Add header for craftable items
      const craftableHeader = document.createElement('div');
      craftableHeader.className = 'items-section-header';
      craftableHeader.textContent = 'Craftable Items';
      craftableHeader.style.color = '#aaa';
      craftableHeader.style.fontSize = '14px';
      craftableHeader.style.fontWeight = 'bold';
      craftableHeader.style.marginTop = '20px';
      craftableHeader.style.marginBottom = '5px';
      popupItems.appendChild(craftableHeader);
      
      // Create an item entry for each craftable item
      data.craftableItems.forEach(item => {
        const itemEntry = document.createElement('div');
        itemEntry.className = 'item-entry craftable';
        
        // Create item name span
        const itemName = document.createElement('span');
        itemName.className = 'item-name';
        itemName.textContent = item.name;
        
        // Create item type span if available
        const itemType = document.createElement('span');
        itemType.className = 'item-type';
        itemType.textContent = item.type || '';
        
        // Create view button
        const viewButton = document.createElement('button');
        viewButton.className = 'view-item-btn';
        viewButton.textContent = 'View';
        viewButton.addEventListener('click', function(e) {
          e.stopPropagation(); // Prevent event bubbling
          showCraftableItemDetail(item);
        });
        
        // Assemble item entry
        itemEntry.appendChild(itemName);
        itemEntry.appendChild(itemType);
        itemEntry.appendChild(viewButton);
        
        // Add to popup
        popupItems.appendChild(itemEntry);
      });
    }
    
    // Show popup
    popup.classList.add('active');
    
    // Setup close button
    const closeBtn = document.getElementById('close-popup');
    if (closeBtn) {
      closeBtn.onclick = hideBottomPopup;
    }
  }

  function showCraftableItemDetail(item) {
    // Get modal elements
    const modal = document.getElementById('item-detail-modal');
    const modalName = document.getElementById('modal-item-name');
    const modalImage = document.getElementById('modal-item-image');
    const modalStats = document.getElementById('modal-item-stats');
    
    // Set modal content
    modalName.textContent = item.name;
    
    // Set image with proper fallback
    modalImage.src = item.image || CONFIG.fallbacks.markerImage;
    modalImage.alt = item.name;
    modalImage.onerror = function() {
      this.onerror = null;
      this.src = CONFIG.fallbacks.markerImage;
      console.warn(`[Marker] Failed to load image: ${item.image}. Using placeholder.`);
    };
    
    // Clear previous stats
    modalStats.innerHTML = '';
    
    // Add required materials heading
    const materialsHeading = document.createElement('div');
    materialsHeading.className = 'stat-heading';
    materialsHeading.textContent = 'Required Materials:';
    materialsHeading.style.marginTop = '15px';
    materialsHeading.style.marginBottom = '8px';
    materialsHeading.style.fontWeight = 'bold';
    materialsHeading.style.color = '#aaa';
    modalStats.appendChild(materialsHeading);
    
    // Add materials list
    if (item.materials && Array.isArray(item.materials)) {
      item.materials.forEach(material => {
        const materialEntry = document.createElement('div');
        materialEntry.className = 'stat-entry material-entry';
        
        const materialName = document.createElement('span');
        materialName.className = 'stat-name';
        materialName.textContent = material.name;
        
        const materialValue = document.createElement('span');
        materialValue.className = 'stat-value';
        materialValue.textContent = `x${material.quantity}`;
        
        materialEntry.appendChild(materialName);
        materialEntry.appendChild(materialValue);
        modalStats.appendChild(materialEntry);
      });
    }
    
    // Add stats heading
    const statsHeading = document.createElement('div');
    statsHeading.className = 'stat-heading';
    statsHeading.textContent = 'Item Stats:';
    statsHeading.style.marginTop = '15px';
    statsHeading.style.marginBottom = '8px';
    statsHeading.style.fontWeight = 'bold';
    statsHeading.style.color = '#aaa';
    modalStats.appendChild(statsHeading);
    
    // Add item stats
    if (item.stats) {
      Object.entries(item.stats).forEach(([statName, statValue]) => {
        const statEntry = document.createElement('div');
        statEntry.className = 'stat-entry';
        
        const statNameElem = document.createElement('span');
        statNameElem.className = 'stat-name';
        statNameElem.textContent = statName.charAt(0).toUpperCase() + statName.slice(1);
        
        const statValueElem = document.createElement('span');
        statValueElem.className = 'stat-value';
        statValueElem.textContent = statValue;
        
        statEntry.appendChild(statNameElem);
        statEntry.appendChild(statValueElem);
        modalStats.appendChild(statEntry);
      });
    }
    
    // Show modal
    modal.style.display = 'flex';
  }

  function showItemDetail(item, isVendor = false) {
    console.log(`[Marker] Showing details for item: ${item.name}`);
    
    // Get modal elements
    const modal = document.getElementById('item-detail-modal');
    const modalName = document.getElementById('modal-item-name');
    const modalImage = document.getElementById('modal-item-image');
    const modalStats = document.getElementById('modal-item-stats');
    
    if (!modal || !modalName || !modalImage || !modalStats) {
      console.error('[Marker] Modal elements not found in DOM');
      return;
    }
    
    // Set modal content
    modalName.textContent = item.name;
    
    // Set image
    modalImage.src = item.image || CONFIG.fallbacks.markerImage;
    modalImage.alt = item.name;
    modalImage.onerror = function() {
      this.onerror = null;
      this.src = CONFIG.fallbacks.markerImage;
      console.warn(`[Marker] Failed to load image: ${item.image}. Using placeholder.`);
    };
    
    // Clear previous stats
    modalStats.innerHTML = '';
    
    // Create stats container with consistent styling
    const statsContainer = document.createElement('div');
    statsContainer.className = 'stats-container';
    modalStats.appendChild(statsContainer);
    
    // Add price for vendor items
    if (isVendor && item.price) {
      const priceEntry = document.createElement('div');
      priceEntry.className = 'stat-entry';
      
      const priceName = document.createElement('span');
      priceName.className = 'stat-name';
      priceName.textContent = 'Price';
      
      const priceValue = document.createElement('span');
      priceValue.className = 'stat-value';
      priceValue.style.color = '#4caf50'; // Green for price
      priceValue.textContent = item.price + ' coins';
      
      priceEntry.appendChild(priceName);
      priceEntry.appendChild(priceValue);
      statsContainer.appendChild(priceEntry);
    }
    
    // Add all stats if available
    if (item.stats) {
      Object.entries(item.stats).forEach(([statName, statValue]) => {
        const statEntry = document.createElement('div');
        statEntry.className = 'stat-entry';
        
        const statNameElem = document.createElement('span');
        statNameElem.className = 'stat-name';
        statNameElem.textContent = statName.charAt(0).toUpperCase() + statName.slice(1); // Capitalize
        
        const statValueElem = document.createElement('span');
        statValueElem.className = 'stat-value';
        statValueElem.textContent = statValue;
        
        statEntry.appendChild(statNameElem);
        statEntry.appendChild(statValueElem);
        statsContainer.appendChild(statEntry);
      });
    }
    
    // Show modal
    modal.style.display = 'flex';
    
    // Setup close button
    const closeBtn = modal.querySelector('.close-modal');
    if (closeBtn) {
      closeBtn.onclick = function() {
        modal.style.display = 'none';
      };
    }
    
    // Close on outside click
    window.onclick = function(event) {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    };
  }

  function initItemDetailModal() {
    const modal = document.getElementById('item-detail-modal');
    const closeBtn = document.querySelector('.close-modal');
    
    if (modal && closeBtn) {
      closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
      });
      
      window.addEventListener('click', function(event) {
        if (event.target === modal) {
          modal.style.display = 'none';
        }
      });
      
      // Close with Escape key
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
          modal.style.display = 'none';
        }
      });
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
    
    // Generate a unique ID using coordinates and name
    const markerId = `${name}_${coords[0]}_${coords[1]}`;
    
    // Create marker
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
      
      // Show bottom popup with full data object
      showBottomPopup(name, group, data);
      activePopupMarker = marker;
    });
    
    // Store marker data for search
    marker.feature = { properties: { name, layer, group, markerId } };
    
    // Store in map with generated unique ID
    markersMap.set(markerId, { 
      marker, 
      data: {...data, layer, markerId} 
    });
    
    // Create/update name-based lookup index for search
    // This allows multiple markers with same name to be found
    const nameIndex = nameToIdMap.get(name.toLowerCase()) || [];
    nameIndex.push(markerId);
    nameToIdMap.set(name.toLowerCase(), nameIndex);
    
    console.log(`[Marker] Added: ${name} (ID: ${markerId}, Group: ${group}, Layer: ${layer}) at ${coords}`);
    return marker;
  }
  
  // Process markers including multi-coordinate markers
  function processMarkers(markers) {
    console.log(`[Marker] Processing ${markers.length} marker entries`);
    
    // Clear existing markers
    markersMap.clear();
    nameToIdMap.clear();
    
    let successCount = 0;
    markers.forEach(data => {
      const { name, coords, group = 'default', layer = CONFIG.map.defaultLayer } = data;
      
      // Check if we have a multi-coordinate marker (array of coordinate pairs)
      if (Array.isArray(coords) && Array.isArray(coords[0]) && 
          coords[0].length === 2 && typeof coords[0][0] === 'number' && 
          (coords.length === 1 || Array.isArray(coords[1]))) {
        // Multiple coordinates for the same marker name
        coords.forEach(coordPair => {
          const singleMarker = {
            ...data,
            coords: coordPair
          };
          
          if (addMarker(singleMarker)) {
            successCount++;
          }
        });
      } else {
        // Standard single coordinate marker
        if (addMarker(data)) {
          successCount++;
        }
      }
    });
    
    console.log(`[Marker] Successfully added ${successCount} markers`);
    return successCount;
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
      
      // Save marker data reference
      markerData = initialMarkers || [];
      
      // Process all markers
      processMarkers(markerData);
      
      // Setup popup event listeners
      initPopupListeners();
      initItemDetailModal();
      
      console.log('[Marker] Marker manager initialized');
    },
    
    addMarker: addMarker,
    
    processMarkers: processMarkers,
    
    getMarker: function(nameOrId) {
      if (!nameOrId) {
        console.warn('[Marker] getMarker called with empty identifier');
        return null;
      }
      
      // Direct lookup if ID is provided
      if (markersMap.has(nameOrId)) {
        return markersMap.get(nameOrId).marker;
      }
      
      // Name-based lookup (returns first match)
      const normalizedName = nameOrId.toLowerCase();
      const ids = nameToIdMap.get(normalizedName);
      
      if (!ids || ids.length === 0) {
        console.warn(`[Marker] Marker not found: ${nameOrId}`);
        return null;
      }
      
      // Return the first matching marker
      return markersMap.get(ids[0]).marker;
    },

    getMarkersWithName: function(name) {
      if (!name) return [];
      
      const normalizedName = name.toLowerCase();
      const ids = nameToIdMap.get(normalizedName) || [];
      
      return ids.map(id => markersMap.get(id).marker);
    },
    
    getMarkerData: function(nameOrId) {
      if (!nameOrId) {
        console.warn('[Marker] getMarkerData called with empty identifier');
        return null;
      }
      
      // Direct lookup if ID is provided
      if (markersMap.has(nameOrId)) {
        return markersMap.get(nameOrId).data;
      }
      
      // Name-based lookup (returns first match)
      const normalizedName = nameOrId.toLowerCase();
      const ids = nameToIdMap.get(normalizedName);
      
      if (!ids || ids.length === 0) {
        console.warn(`[Marker] Marker data not found: ${nameOrId}`);
        return null;
      }
      
      // Return the first matching marker data
      return markersMap.get(ids[0]).data;
    },
    
    getAllMarkers: function() {
      return Array.from(markersMap.values()).map(entry => entry.data);
    },

    getAllMarkersWithName: function(name) {
      if (!name) return [];
      
      const normalizedName = name.toLowerCase();
      const ids = nameToIdMap.get(normalizedName) || [];
      
      return ids.map(id => markersMap.get(id).data);
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
      
      showBottomPopup(markerData.name, markerData.group, markerData);
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