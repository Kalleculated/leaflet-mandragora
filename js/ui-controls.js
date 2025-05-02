// UI Controls for navigation, search and filters
const UIControls = (function() {
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
          
          if (typeof MapManager !== 'undefined' && MapManager.setActiveLayer) {
            MapManager.setActiveLayer(layerConfig.id);
          } else {
            console.error('[UI] MapManager not available or missing setActiveLayer method');
          }
        });
        
        layerButtonsContainer.appendChild(btn);
      });
      
      console.log('[UI] Layer buttons initialized');
    }
    
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
      
      // Check if GroupManager is available
      if (typeof GroupManager === 'undefined' || !GroupManager.getAllGroups) {
        console.error('[UI] GroupManager not available or missing getAllGroups method');
        return;
      }
      
      const allGroups = GroupManager.getAllGroups();
      const visibleGroups = {};
      
      // Filter out the default group
      const filterableGroups = allGroups.filter(group => group !== 'default');
      
      // Initialize all groups as visible
      allGroups.forEach(group => {
        visibleGroups[group] = true;
      });
      
      // Create filter checkboxes for filterable groups only
      filterableGroups.forEach(group => {
        const filterItem = document.createElement('div');
        filterItem.className = 'filter-group-item';
        
        // Create checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `filter-${group}`;
        checkbox.checked = true;
        
        // Try to get the icon path
        let iconPath = '';
        try {
          if (GroupManager.getIcon) {
            const icon = GroupManager.getIcon(group);
            if (icon && icon.options && icon.options.iconUrl) {
              iconPath = icon.options.iconUrl;
            }
          }
        } catch (e) {
          console.warn(`[UI] Could not get icon for group: ${group}`, e);
        }
        
        // Create icon image if available
        if (iconPath) {
          const iconImg = document.createElement('img');
          iconImg.src = iconPath;
          iconImg.alt = group;
          iconImg.onerror = function() {
            console.warn(`[UI] Failed to load icon for ${group}: ${iconPath}`);
            this.style.display = 'none';
          };
          filterItem.appendChild(iconImg);
        }
        
        // Create label
        const label = document.createElement('label');
        label.htmlFor = `filter-${group}`;
        label.textContent = group.charAt(0).toUpperCase() + group.slice(1); // Capitalize first letter
        
        // Add checkbox and label to filter item
        filterItem.appendChild(checkbox);
        filterItem.appendChild(label);
        
        // Add event listener to checkbox
        checkbox.addEventListener('change', function() {
          console.log(`[UI] Filter toggled for ${group}: ${this.checked}`);
          visibleGroups[group] = this.checked;
          updateVisibleMarkers(visibleGroups);
        });
        
        // Add filter item to container
        groupsContainer.appendChild(filterItem);
      });
      
      console.log('[UI] Filter groups initialized');
    }
    
    // Update marker visibility based on filters
    function updateVisibleMarkers(visibleGroups) {
      if (typeof MarkerManager === 'undefined' || !MarkerManager.getMarkersMap) {
        console.error('[UI] MarkerManager not available or missing getMarkersMap method');
        return;
      }
      
      const markersMap = MarkerManager.getMarkersMap();
      
      // Loop through all markers and update visibility
      markersMap.forEach((entry, key) => {
        const marker = entry.marker;
        const group = entry.data.group;
        
        if (visibleGroups[group]) {
          // Make marker visible
          marker.setOpacity(1);
          marker.options.interactive = true;
        } else {
          // Hide marker
          marker.setOpacity(0);
          marker.options.interactive = false;
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