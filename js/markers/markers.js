// Core marker management
import { CONFIG } from '../config.js';
import { GroupManager } from '../groups.js';
import { MapManager } from '../map.js';

export const MarkerManager = (() => {
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
      if (GroupManager && GroupManager.getIcon) {
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
      // Get coordinates string
      const coordStr = data.coords ? `[${data.coords[0]}, ${data.coords[1]}]` : '';
      
      if (group === 'chest') {
        popupRegion.textContent = `placeholder • ${coordStr}`; 
      } else if (group === 'vendor') {
        popupRegion.textContent = `placeholder • ${coordStr}`;
      } else if (group === 'waypoint') {
        popupRegion.textContent = `placeholder • ${coordStr}`;
      } else if (group === 'boss') {
        popupRegion.textContent = `placeholder • ${coordStr}`; 
      } else if (group === 'altar') {
        popupRegion.textContent = `Offers powerful blessings • ${coordStr}`;
      } else {
        popupRegion.textContent = `placeholder • ${coordStr}`;
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
      if (group === 'chest' | group === 'item') {
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
    
    // Add requirements for altars if present
    if (popupItems && group === 'altar' && data && data.requires) {
      // Add header for requirements
      const requirementsHeader = document.createElement('div');
      requirementsHeader.className = 'items-section-header';
      requirementsHeader.textContent = 'Requirements';
      requirementsHeader.style.color = '#aaa';
      requirementsHeader.style.fontSize = '14px';
      requirementsHeader.style.fontWeight = 'bold';
      requirementsHeader.style.marginTop = '20px';
      requirementsHeader.style.marginBottom = '5px';
      popupItems.appendChild(requirementsHeader);
      
      // Create an item entry for the requirement
      const requirementEntry = document.createElement('div');
      requirementEntry.className = 'item-entry requirement-item';
      
      // Create item name span
      const itemName = document.createElement('span');
      itemName.className = 'item-name';
      itemName.textContent = data.requires.item || 'Unknown';
      
      // Create quantity span
      const quantitySpan = document.createElement('span');
      quantitySpan.className = 'item-quantity';
      quantitySpan.textContent = `x${data.requires.quantity || 1}`;
      quantitySpan.style.color = '#c9a100';
      quantitySpan.style.marginLeft = '10px';
      quantitySpan.style.fontWeight = 'bold';
      
      // Assemble requirement entry
      requirementEntry.appendChild(itemName);
      requirementEntry.appendChild(quantitySpan);
      
      // Add to popup
      popupItems.appendChild(requirementEntry);
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
        
        // Handle special case for damage and scaling objects
        if (statName === 'damage' && typeof statValue === 'object') {
          handleDamageStats(statEntry, statValue);
        } else if (statName === 'scaling' && typeof statValue === 'object') {
          handleScalingStats(statEntry, statValue);
        } else {
          // Standard stat display
          const statNameElem = document.createElement('span');
          statNameElem.className = 'stat-name';
          statNameElem.textContent = statName.charAt(0).toUpperCase() + statName.slice(1);
          
          const statValueElem = document.createElement('span');
          statValueElem.className = 'stat-value';
          statValueElem.textContent = statValue;
          
          statEntry.appendChild(statNameElem);
          statEntry.appendChild(statValueElem);
        }
        
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

  function handleDamageStats(container, damageObj) {
    const damageHeader = document.createElement('div');
    damageHeader.className = 'stat-name';
    damageHeader.textContent = 'Damage';
    container.appendChild(damageHeader);
    
    const damageValuesContainer = document.createElement('div');
    damageValuesContainer.className = 'stat-value damage-values';
    damageValuesContainer.style.display = 'flex';
    damageValuesContainer.style.flexDirection = 'row';
    damageValuesContainer.style.gap = '12px';
    damageValuesContainer.style.flexWrap = 'wrap';
    
    Object.entries(damageObj).forEach(([damageType, damageValue]) => {
      const damageEntry = document.createElement('div');
      damageEntry.style.display = 'flex';
      damageEntry.style.alignItems = 'center';
      
      const iconSpan = document.createElement('span');
      iconSpan.className = `damage-icon`;
      iconSpan.innerHTML = getDamageIcon(damageType);
      iconSpan.style.marginRight = '4px';
      
      const valueSpan = document.createElement('span');
      valueSpan.textContent = damageValue;
      valueSpan.style.fontWeight = 'bold';
      
      damageEntry.appendChild(iconSpan);
      damageEntry.appendChild(valueSpan);
      damageValuesContainer.appendChild(damageEntry);
    });
    
    container.appendChild(damageValuesContainer);
  }
  
  function handleScalingStats(container, scalingObj) {
    const scalingHeader = document.createElement('div');
    scalingHeader.className = 'stat-name';
    scalingHeader.textContent = 'Scaling';
    container.appendChild(scalingHeader);
    
    const scalingValuesContainer = document.createElement('div');
    scalingValuesContainer.className = 'stat-value scaling-values';
    scalingValuesContainer.style.display = 'flex';
    scalingValuesContainer.style.flexDirection = 'row';
    scalingValuesContainer.style.gap = '12px';
    scalingValuesContainer.style.flexWrap = 'wrap';
    
    Object.entries(scalingObj).forEach(([attributeType, scalingValue]) => {
      const scalingEntry = document.createElement('div');
      scalingEntry.style.display = 'flex';
      scalingEntry.style.alignItems = 'center';
      
      const iconSpan = document.createElement('span');
      iconSpan.className = `scaling-icon`;
      iconSpan.innerHTML = getScalingIcon(attributeType);
      iconSpan.style.marginRight = '4px';
      
      const valueSpan = document.createElement('span');
      valueSpan.textContent = scalingValue;
      valueSpan.style.fontWeight = 'bold';
      
      scalingEntry.appendChild(iconSpan);
      scalingEntry.appendChild(valueSpan);
      scalingValuesContainer.appendChild(scalingEntry);
    });
    
    container.appendChild(scalingValuesContainer);
  }
  
  function getDamageIcon(damageType) {
    let iconPath;
    switch(damageType.toLowerCase()) {
      case 'physical': iconPath = 'assets/icons/damage_type/physical.png'; break;
      case 'wyld': iconPath = 'assets/icons/damage_type/wyld.png'; break;
      case 'light': iconPath = 'assets/icons/damage_type/light.png'; break;
      case 'void': iconPath = 'assets/icons/damage_type/void.png'; break;
      case 'ice': iconPath = 'assets/icons/damage_type/ice.png'; break;
      case 'fire': iconPath = 'assets/icons/damage_type/fire.png'; break;
      case 'void': iconPath = 'assets/icons/damage_type/void.png'; break;
      default: iconPath = 'assets/icons/damage_type/physical.png';
    }
    return `<img src="${iconPath}" alt="${damageType}" class="stat-icon" width="24" height="24">`;
  }
  
  function getScalingIcon(attributeType) {
    let iconPath;
    switch(attributeType.toLowerCase()) {
      case 'strength': iconPath = 'assets/icons/scaling/strength.webp'; break;
      case 'dexterity': iconPath = 'assets/icons/scaling/dexterity.webp'; break;
      case 'spirit': iconPath = 'assets/icons/scaling/spirit.webp'; break;
      case 'power': iconPath = 'assets/icons/scaling/power.webp'; break;
      default: iconPath = 'assets/icons/scaling/strength.webp';
    }
    return `<img src="${iconPath}" alt="${attributeType}" class="stat-icon" width="24" height="24">`;
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
      if (GroupManager && GroupManager.getIcon) {
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
      if (MapManager && MapManager.getMarkerLayer) {
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
  
  // Keep track of pulsating circle
  let pulsingCircle = null;
  let pulseTimer = null;

  // Add pulsating circle to marker
  function addPulsingCircle(marker) {
    // Clear any existing pulse
    removePulsingCircle();
    
    if (!marker) {
      console.warn('[Marker] Cannot add pulse to null marker');
      return;
    }
    
    // Add small delay to allow map to finish zooming
    setTimeout(() => {
      try {
        const map = MapManager.getMap();
        if (!map) {
          console.error('[Marker] Map not available');
          return;
        }
        
        const position = marker.getLatLng();
        
        // Create pulsing circle as a separate layer
        pulsingCircle = L.circleMarker(position, {
          radius: 15,
          weight: 3,
          color: 'rgba(198, 158, 0, 0.9)',
          fillColor: 'rgba(198, 158, 0, 0.5)',
          fillOpacity: 0.5
        }).addTo(map);
        
        // Apply animation using CSS
        const element = pulsingCircle._path;
        if (element) {
          // Apply animation
          element.style.animation = 'pulse 1.5s ease-out infinite';
          // Make sure SVG elements can be animated
          element.style.transformOrigin = 'center';
          element.style.transformBox = 'fill-box';
        } else {
          console.warn('[Marker] Could not find circle element');
        }
        
        console.log('[Marker] Added pulsing circle at', position);
        
        // Auto-remove after 3 seconds
        pulseTimer = setTimeout(removePulsingCircle, 3000);
      } catch (error) {
        console.error('[Marker] Error adding pulsing circle:', error);
      }
    }, 100); // 0.1 second delay
  }

  // Remove pulsing circle
  function removePulsingCircle() {
    if (pulseTimer) {
      clearTimeout(pulseTimer);
      pulseTimer = null;
    }
    
    if (pulsingCircle) {
      try {
        const map = MapManager.getMap();
        if (map) {
          map.removeLayer(pulsingCircle);
        }
        pulsingCircle = null;
        console.log('[Marker] Removed pulsing circle');
      } catch (error) {
        console.error('[Marker] Error removing pulsing circle:', error);
      }
    }
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

    addPulsingCircle: addPulsingCircle,
    removePulsingCircle: removePulsingCircle,
    
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
    
    showPopupForMarker: function(name) {
      const markerData = this.getMarkerData(name);
      if (!markerData) return;
      
      // Reference to document click handler
      const existingClickHandler = document.onmousedown;
      
      // Temporarily disable document click handler
      document.onmousedown = null;
      
      // Show popup for the marker
      showBottomPopup(markerData.name, markerData.group, markerData);
      activePopupMarker = this.getMarker(name);
      
      // Add pulsing circle to the marker
      addPulsingCircle(activePopupMarker);
      
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