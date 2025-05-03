import { CONFIG } from './config.js';
import { MapManager } from './map.js';
import { MarkerManager } from './markers/markers.js'; 
import { GroupManager } from './groups.js';

// UI Controls for navigation, search and filters
export const UIControls = (() => {
    // Initialize UI elements and event listeners
    function initialize() {
      console.log('[UI] Initializing UI controls');
      
      // Get DOM elements
      const searchToggleBtn = document.getElementById('search-toggle-btn');
      const filterToggleBtn = document.getElementById('filter-toggle-btn');
      const searchSidebar = document.getElementById('search-sidebar');
      const filterSidebar = document.getElementById('filter-sidebar');
      const layerButtonsContainer = document.querySelector('.layer-buttons');
      
      if (!searchToggleBtn || !filterToggleBtn || !searchSidebar || !filterSidebar || !layerButtonsContainer) {
        console.error('[UI] Failed to find UI elements', {
          searchToggleBtn, filterToggleBtn, searchSidebar, filterSidebar, layerButtonsContainer
        });
        return;
      }
      
      // Toggle search sidebar
      searchToggleBtn.addEventListener('click', function() {
        console.log('[UI] Search toggle clicked');
        
        // If filter sidebar is open, close it
        if (filterSidebar.classList.contains('open')) {
          filterSidebar.classList.remove('open');
          filterToggleBtn.classList.remove('active');
        }
        
        // Toggle search sidebar
        searchSidebar.classList.toggle('open');
        searchToggleBtn.classList.toggle('active');
        
        // Focus search input when sidebar is opened
        if (searchSidebar.classList.contains('open')) {
          const searchInput = document.getElementById('custom-search-input');
          if (searchInput) {
            searchInput.focus();
          }
        }
      });
      
      // Toggle filter sidebar
      filterToggleBtn.addEventListener('click', function() {
        console.log('[UI] Filter toggle clicked');
        
        // If search sidebar is open, close it
        if (searchSidebar.classList.contains('open')) {
          searchSidebar.classList.remove('open');
          searchToggleBtn.classList.remove('active');
        }
        
        // Toggle filter sidebar
        filterSidebar.classList.toggle('open');
        filterToggleBtn.classList.toggle('active');
      });
      
      // Initialize layer buttons in the top navbar
      initializeLayerButtons(layerButtonsContainer);
      
      // Initialize filter groups
      initializeFilterGroups();
      
      // Enable escape key to close sidebars
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          closeSidebars(searchSidebar, filterSidebar, searchToggleBtn, filterToggleBtn);
        }
      });
      
      console.log('[UI] UI controls initialization complete');
    }
    
    // Close all sidebars
    function closeSidebars(searchSidebar, filterSidebar, searchToggleBtn, filterToggleBtn) {
      // If not passed as parameters, get from DOM
      searchSidebar = searchSidebar || document.getElementById('search-sidebar');
      filterSidebar = filterSidebar || document.getElementById('filter-sidebar');
      searchToggleBtn = searchToggleBtn || document.getElementById('search-toggle-btn');
      filterToggleBtn = filterToggleBtn || document.getElementById('filter-toggle-btn');
      
      if (searchSidebar) searchSidebar.classList.remove('open');
      if (filterSidebar) filterSidebar.classList.remove('open');
      if (searchToggleBtn) searchToggleBtn.classList.remove('active');
      if (filterToggleBtn) filterToggleBtn.classList.remove('active');
    }
    
    // Initialize layer buttons in top navbar
    function initializeLayerButtons(layerButtonsContainer) {
      if (!layerButtonsContainer) {
        layerButtonsContainer = document.querySelector('.layer-buttons');
        if (!layerButtonsContainer) {
          console.error('[UI] Layer buttons container not found');
          return;
        }
      }
      
      console.log('[UI] Initializing layer buttons');
      
      // Clear existing buttons
      layerButtonsContainer.innerHTML = '';
      
      // Create buttons for each layer
      CONFIG.map.layers.forEach(layerConfig => {
        const btn = document.createElement('button');
        btn.textContent = layerConfig.name;
        btn.className = 'layer-toggle-btn';
        btn.dataset.layerId = layerConfig.id;
        
        if (layerConfig.id === CONFIG.map.defaultLayer) {
          btn.classList.add('active');
        }
        
        btn.addEventListener('click', function() {
          console.log(`[UI] Layer button clicked: ${layerConfig.id}`);
          
          document.querySelectorAll('.layer-toggle-btn').forEach(button => {
            button.classList.remove('active');
          });
          this.classList.add('active');
          
          if (MapManager && MapManager.setActiveLayer) {
            MapManager.setActiveLayer(layerConfig.id);
          } else {
            console.error('[UI] MapManager not available or missing setActiveLayer method');
          }
        });
        
        layerButtonsContainer.appendChild(btn);
      });
      
      console.log('[UI] Layer buttons initialized');
    }
    
    // Helper to create filter checkboxes
    function createFilterCheckboxes(container, items, isGroup = true, isItemType = false) {
        items.forEach(item => {
        const filterItem = document.createElement('div');
        filterItem.className = 'filter-group-item';
        
        // Create checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = isItemType ? `filter-itemtype-${item}` : `filter-${item}`;
        checkbox.checked = true;
        
        // Try to get the icon path (only for groups)
        let iconPath = '';
        if (isGroup) {
            try {
            if (GroupManager.getIcon) {
                const icon = GroupManager.getIcon(item);
                if (icon && icon.options && icon.options.iconUrl) {
                iconPath = icon.options.iconUrl;
                }
            }
            } catch (e) {
            console.warn(`[UI] Could not get icon for group: ${item}`, e);
            }
        }
        
        // Create icon image if available (for groups only)
        if (iconPath) {
            const iconImg = document.createElement('img');
            iconImg.src = iconPath;
            iconImg.alt = item;
            iconImg.onerror = function() {
            console.warn(`[UI] Failed to load icon for ${item}: ${iconPath}`);
            this.style.display = 'none';
            };
            filterItem.appendChild(iconImg);
        }
        
        // Create label with capitalized text
        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = item.charAt(0).toUpperCase() + item.slice(1); // Capitalize first letter
        
        // Add checkbox and label to filter item
        filterItem.appendChild(checkbox);
        filterItem.appendChild(label);
        
        // Add event listener to checkbox
        checkbox.addEventListener('change', function() {
            console.log(`[UI] Filter toggled for ${isItemType ? 'item type' : 'group'} ${item}: ${this.checked}`);
            
            if (isItemType) {
            visibleItemTypes[item] = this.checked;
            } else {
            visibleGroups[item] = this.checked;
            }
            
            updateVisibleMarkers(visibleGroups, visibleItemTypes);
        });
        
        // Add filter item to container
        container.appendChild(filterItem);
        });
    }

    // Store visibility state for groups and item types
    let visibleGroups = {};
    let visibleItemTypes = {};
    
    // Initialize filter groups
    function initializeFilterGroups() {
        const groupsContainer = document.getElementById('group-filters');
        if (!groupsContainer) {
        console.error('[UI] Group filters container not found');
        return;
        }
        
        console.log('[UI] Initializing filter groups');
        
        // Clear existing filters
        groupsContainer.innerHTML = '';
        
        // Add control buttons at the top
        const filterControls = document.createElement('div');
        filterControls.className = 'filter-controls';
        filterControls.style.display = 'flex';
        filterControls.style.justifyContent = 'center';
        filterControls.style.gap = '10px';
        filterControls.style.marginBottom = '15px';
        filterControls.style.borderBottom = '1px solid #444';
        filterControls.style.paddingBottom = '20px';
        
        // Create "All" and "None" buttons (keep existing implementation)
        const allButton = document.createElement('button');
        allButton.textContent = 'All';
        allButton.style.fontStyle = 'italic';
        allButton.style.padding = '6px 12px';
        allButton.style.backgroundColor = 'rgba(26,26,26,255)';
        allButton.style.color = 'white';
        allButton.style.border = '1px solid #444';
        allButton.style.borderRadius = '4px';
        allButton.style.cursor = 'pointer';
        
        const noneButton = document.createElement('button');
        noneButton.textContent = 'None';
        noneButton.style.fontStyle = 'italic';
        noneButton.style.padding = '6px 12px';
        noneButton.style.backgroundColor = 'rgba(26,26,26,255)';
        noneButton.style.color = 'white';
        noneButton.style.border = '1px solid #444';
        noneButton.style.borderRadius = '4px';
        noneButton.style.cursor = 'pointer';
        
        // Add hover effects (keep existing implementation)
        allButton.addEventListener('mouseover', function() {
        this.style.backgroundColor = 'rgba(198, 158, 0, 0.896)';
        });
        allButton.addEventListener('mouseout', function() {
        this.style.backgroundColor = 'rgba(26,26,26,255)';
        });
        noneButton.addEventListener('mouseover', function() {
        this.style.backgroundColor = 'rgba(198, 158, 0, 0.896)';
        });
        noneButton.addEventListener('mouseout', function() {
        this.style.backgroundColor = 'rgba(26,26,26,255)';
        });
        
        // Add buttons to filter controls
        filterControls.appendChild(allButton);
        filterControls.appendChild(noneButton);
        
        // Insert filter controls at the top
        groupsContainer.appendChild(filterControls);
        
        // Check if GroupManager is available
        if (!GroupManager || !GroupManager.getAllGroups) {
        console.error('[UI] GroupManager not available or missing getAllGroups method');
        return;
        }
        
        // Create section header for Groups
        const groupHeader = document.createElement('h4');
        groupHeader.textContent = 'MAP PINS';
        groupHeader.style.marginTop = '30px';
        groupHeader.style.color = 'rgba(198, 158, 0, 0.896)';
        groupHeader.style.borderBottom = '1px solid #444';
        groupHeader.style.paddingBottom = '5px';
        groupsContainer.appendChild(groupHeader);
        
        const allGroups = GroupManager.getAllGroups();
        
        // Filter out the default group
        const filterableGroups = allGroups.filter(group => group !== 'default');
        
        // Initialize all groups as visible
        filterableGroups.forEach(group => {
        visibleGroups[group] = true;
        });
        
        // Create filter checkboxes for groups
        createFilterCheckboxes(groupsContainer, filterableGroups, true);
        
        // Add a section for item types if available
        if (typeof GroupManager.getAllItemTypes === 'function') {
        const itemTypes = GroupManager.getAllItemTypes();
        
        if (itemTypes && itemTypes.length > 0) {
            // Create section header for Item Types
            const itemHeader = document.createElement('h4');
            itemHeader.textContent = 'ITEM TYPES';
            itemHeader.style.marginTop = '30px';
            itemHeader.style.color = 'rgba(198, 158, 0, 0.896)';
            itemHeader.style.borderBottom = '1px solid #444';
            itemHeader.style.paddingBottom = '5px';
            groupsContainer.appendChild(itemHeader);
            
            // Initialize all item types as visible
            itemTypes.forEach(type => {
            visibleItemTypes[type] = true;
            });
            
            // Create filter checkboxes for item types
            createFilterCheckboxes(groupsContainer, itemTypes, false, true);
        }
        }
        
        
        // Add event listeners to the All/None buttons
        allButton.addEventListener('click', function() {
        console.log('[UI] Select All filters clicked');
        document.querySelectorAll('#group-filters input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = true;
        });
        
        // Update all groups and item types to be visible
        Object.keys(visibleGroups).forEach(group => {
            visibleGroups[group] = true;
        });
        
        Object.keys(visibleItemTypes).forEach(type => {
            visibleItemTypes[type] = true;
        });
        
        // Update markers visibility
        updateVisibleMarkers(visibleGroups, visibleItemTypes);
        });
        
        noneButton.addEventListener('click', function() {
        console.log('[UI] Select None filters clicked');
        document.querySelectorAll('#group-filters input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Update all groups and item types to be hidden
        Object.keys(visibleGroups).forEach(group => {
            visibleGroups[group] = false;
        });
        
        Object.keys(visibleItemTypes).forEach(type => {
            visibleItemTypes[type] = false;
        });
        
        // Update markers visibility
        updateVisibleMarkers(visibleGroups, visibleItemTypes);
        });
        
        console.log('[UI] Filter groups initialized');
    }
    
    // Update marker visibility based on filters
    function updateVisibleMarkers(visibleGroups, visibleItemTypes) {
      if (!MarkerManager || !MarkerManager.getMarkersMap) {
          console.error('[UI] MarkerManager not available or missing getMarkersMap method');
          return;
      }
      
      const markersMap = MarkerManager.getMarkersMap();
      const activeLayer = MapManager.getActiveLayerId();
      
      // Loop through all markers and update visibility
      markersMap.forEach((entry, key) => {
          const marker = entry.marker;
          const data = entry.data;
          const group = data.group;
          
          let shouldBeVisible = visibleGroups[group];
          
          // If marker has regular items, check if any item type matches visible types
          if (!shouldBeVisible && data.items && Array.isArray(data.items)) {
              const hasVisibleItemType = data.items.some(item => 
                  item.type && visibleItemTypes[item.type]
              );
              shouldBeVisible = hasVisibleItemType;
          }
          
          // If marker has craftable items, check if any item type matches visible types
          if (!shouldBeVisible && data.craftableItems && Array.isArray(data.craftableItems)) {
              const hasVisibleCraftableType = data.craftableItems.some(item =>
                  item.type && visibleItemTypes[item.type]
              );
              shouldBeVisible = hasVisibleCraftableType;
          }
          
          if (shouldBeVisible) {
              // Get current layer
              const markerLayer = MapManager.getMarkerLayer(data.layer);
              
              // Only add marker if it's not already on the map
              if (!marker._map && data.layer === activeLayer) {
                  marker.addTo(markerLayer);
              }
          } else {
              // Completely remove marker from map
              if (marker._map) {
                  marker.removeFrom(marker._map);
              }
          }
      });
    }
    
    // Public API
    return {
        init: function() {
          // Wait for DOM to be ready
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initialize);
          } else {
            // DOM already loaded, initialize immediately
            initialize();
          }
        },
        
        closeSidebars: function() {
          closeSidebars();
        }
      };
})();
