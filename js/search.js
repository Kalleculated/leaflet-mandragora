import { CONFIG } from './config.js';
import { MarkerManager } from './markers/markers.js';
import { MapManager } from './map.js';
import { GroupManager } from './groups.js';
import { UIControls } from './ui-controls.js';

// Independent search functionality with direct DOM control
export const SearchManager = (() => {
  // Store references to DOM elements
  let searchInput = null;
  let resultsContainer = null;
  
  // Initialize DOM references
  function initDOMReferences() {
    searchInput = document.getElementById('custom-search-input');
    resultsContainer = document.getElementById('search-results');
    
    if (!searchInput || !resultsContainer) {
      console.error("[SM] Critical DOM elements missing");
      return false;
    }
    return true;
  }
  
  // Process search input and display results
  function processSearch(searchText) {
    // Validate input
    if (!searchText || typeof searchText !== 'string') {
      clearResults();
      return;
    }
    
    // Normalize search text
    searchText = searchText.trim().toLowerCase();
    
    // Clear previous results
    clearResults();
    
    // Check minimum length
    if (searchText.length < CONFIG.search.minLength) {
      return;
    }
    
    // Get all markers
    let allMarkers = [];
    try {
      allMarkers = MarkerManager.getAllMarkers();
      console.log(`[SM] Total markers: ${allMarkers.length}`);
    } catch (e) {
      console.error("[SM] Failed to get markers:", e);
      displayError("Cannot access marker data");
      return;
    }
    
    // Filter matching markers
    const matches = allMarkers.filter(item => {
      try {
        const name = (item.name || "").toLowerCase();
        
        // Check marker name
        if (name.includes(searchText)) return true;
        
        // Check items within marker
        if (item.items && Array.isArray(item.items)) {
          if (item.items.some(subItem => {
            if (!subItem.name) {
              console.warn("[SM] Item without subitems:", item);
              return false;
            } else {
              subItem.name.toLowerCase().includes(searchText)
            }
          })) {
            return true;
          }
        }
        
        // Check craftable items within marker
        if (item.craftableItems && Array.isArray(item.craftableItems)) {
          if (item.craftableItems.some(subItem => 
            subItem.name.toLowerCase().includes(searchText) ||
            (subItem.type && subItem.type.toLowerCase().includes(searchText))
          )) {
            return true;
          }
          
          // Check materials within craftable items
          for (const craftable of item.craftableItems) {
            if (craftable.materials && Array.isArray(craftable.materials)) {
              if (craftable.materials.some(material => 
                material.name.toLowerCase().includes(searchText)
              )) {
                return true;
              }
            }
          }
        }
      } catch (e) {
        console.error(`[SM] Error processing marker with name ${item}:`, e);
      }
      
      return false;
    });

    console.log(`[SM] Found ${matches.length} matches for "${searchText}"`);
    matches.forEach(m => console.log(`  - ${m.name}`));
    
    // Display results or no-results message
    if (matches.length > 0) {
      displayResults(matches, searchText);
    } else {
      displayNoResults();
    }
  }
  
  // Clear all search results
  function clearResults() {
    if (resultsContainer) {
      resultsContainer.innerHTML = '';
    }
  }
  
  // Display search results
  function displayResults(items, searchText) {
    // Ensure container exists
    if (!resultsContainer) {
      console.error("[SM] Results container missing");
      return;
    }
    
    // Get current search text if not provided
    if (!searchText && searchInput) {
      searchText = searchInput.value.trim().toLowerCase();
    }
    
    // Clear and prepare container
    clearResults();
    
    // Insert header with result count
    const headerElement = document.createElement('div');
    headerElement.textContent = `Found ${items.length} locations`;
    headerElement.style.padding = '5px';
    headerElement.style.backgroundColor = 'rgba(26,26,26,255)';
    headerElement.style.borderBottom = '1px solid #444';
    headerElement.style.fontSize = '12px';
    headerElement.style.color = '#ccc';
    headerElement.style.marginBottom = '10px';
    resultsContainer.appendChild(headerElement);
    
    // Create results
    items.forEach(item => {
      // Create result item
      const resultItem = document.createElement('div');
      resultItem.className = 'search-result-item';
      
      // Get icon
      let iconHTML = '';
      try {
        if (GroupManager && GroupManager.getIcon) {
          const icon = GroupManager.getIcon(item.group);
          if (icon && icon.options && icon.options.iconUrl) {
            iconHTML = `<img src="${icon.options.iconUrl}" alt="${item.group}" style="width:24px;height:24px;margin-right:10px;">`;
          }
        }
      } catch (e) {
        console.warn(`[SM] Icon error for ${item.group}:`, e);
      }
      
      // Check if match is for contained item (regular items)
      let matchedItemName = '';
      if (searchText && item.items && Array.isArray(item.items)) {
        const matchedItem = item.items.find(subItem => 
          subItem.name.toLowerCase().includes(searchText));
        if (matchedItem) {
          matchedItemName = matchedItem.name;
        }
      }
      
      // Check if match is for craftable item
      let matchedCraftableItemName = '';
      if (searchText && item.craftableItems && Array.isArray(item.craftableItems)) {
        const matchedCraftable = item.craftableItems.find(subItem => 
          subItem.name.toLowerCase().includes(searchText));
        
        if (matchedCraftable) {
          matchedCraftableItemName = matchedCraftable.name;
        } else {
          // Check materials in craftable items
          for (const craftable of item.craftableItems) {
            if (craftable.materials && Array.isArray(craftable.materials)) {
              const matchedMaterial = craftable.materials.find(material => 
                material.name.toLowerCase().includes(searchText));
              
              if (matchedMaterial) {
                matchedCraftableItemName = `${craftable.name} (needs ${matchedMaterial.name})`;
                break;
              }
            }
          }
        }
      }
      
      // Create content
      const layerName = CONFIG.map.layers.find(l => l.id === item.layer)?.name || 'Unknown';
      const coordStr = `[${item.coords[0]}, ${item.coords[1]}]`;
      
      // Build HTML content
      let contentHTML = `
        <div style="font-weight:500;">${item.name}</div>
        <div style="color:#aaa;font-size:0.9em;">
          ${coordStr} (${layerName})
          ${matchedItemName ? `<br>Has: <span style="color:#c9a100">${matchedItemName}</span>` : ''}
          ${matchedCraftableItemName ? `<br>Crafts: <span style="color:#4caf50">${matchedCraftableItemName}</span>` : ''}
        </div>
      `;
      
      resultItem.innerHTML = iconHTML + `<div>${contentHTML}</div>`;
      
      // Add click handler with specific ID
      resultItem.addEventListener('click', function() {
        resultItemClicked(item.markerId || item.name);
      });
      
      // Add to container
      resultsContainer.appendChild(resultItem);
    });
  }  
  
  // Display no results message
  function displayNoResults() {
    if (!resultsContainer) return;
    
    const noResults = document.createElement('div');
    noResults.className = 'no-results';
    noResults.textContent = 'No locations found';
    noResults.style.padding = '15px';
    noResults.style.color = '#bbb';
    noResults.style.textAlign = 'center';
    noResults.style.fontStyle = 'italic';
    
    resultsContainer.appendChild(noResults);
  }
  
  // Display error message
  function displayError(message) {
    if (!resultsContainer) return;
    
    const errorMsg = document.createElement('div');
    errorMsg.className = 'search-error';
    errorMsg.textContent = message || 'Error processing search';
    errorMsg.style.padding = '15px';
    errorMsg.style.color = '#c00';
    errorMsg.style.textAlign = 'center';
    
    resultsContainer.appendChild(errorMsg);
  }
  
  // Handle result item click
  function resultItemClicked(idOrName) {
    console.log(`[SM] Result clicked: ${idOrName}`);
    
    try {
      // Get marker data
      const markerData = MarkerManager.getMarkerData(idOrName);
      if (!markerData) {
        console.error(`[SM] Marker data not found for ${idOrName}`);
        return;
      }
      
      // Set active layer
      MapManager.setActiveLayer(markerData.layer);
      
      // Get marker and set view 
      const marker = MarkerManager.getMarker(idOrName);
      if (marker) {
        MapManager.setView(marker.getLatLng(), CONFIG.search.resultZoomLevel);
        
        // Show popup for marker (no sidebar closing)
        MarkerManager.showPopupForMarker(idOrName);
      } else {
        console.warn(`[SM] Marker not found for ${idOrName}`);
        MapManager.setView(markerData.coords, CONFIG.search.resultZoomLevel);
      }
    } catch (e) {
      console.error("[SM] Error handling result click:", e);
    }
  }
  
  // Close all sidebars
  function closeSidebars() {
    try {
      // Try UIControls method if available
      if (UIControls && UIControls.closeSidebars) {
        UIControls.closeSidebars();
        return;
      }
    } catch (e) {
      console.warn("[SM] UIControls not available:", e);
    }
    
    // Direct sidebar closing
    const elements = {
      searchSidebar: document.getElementById('search-sidebar'),
      filterSidebar: document.getElementById('filter-sidebar'),
      searchToggleBtn: document.getElementById('search-toggle-btn'),
      filterToggleBtn: document.getElementById('filter-toggle-btn')
    };
    
    // Remove classes
    if (elements.searchSidebar) elements.searchSidebar.classList.remove('open');
    if (elements.filterSidebar) elements.filterSidebar.classList.remove('open');
    if (elements.searchToggleBtn) elements.searchToggleBtn.classList.remove('active');
    if (elements.filterToggleBtn) elements.filterToggleBtn.classList.remove('active');
  }
  
  // Setup event listeners
  function setupEventListeners() {
    if (!searchInput) return;
    
    // Input handler with debounce
    let debounceTimer;
    searchInput.addEventListener('input', function(e) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        processSearch(e.target.value);
      }, 200);
    });
    
    // Escape key handler
    searchInput.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeSidebars();
      }
    });
    
    // Enter key handler
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        const firstResult = resultsContainer.querySelector('.search-result-item');
        if (firstResult) {
          firstResult.click();
        }
      }
    });
  }
  
  // Initialize the search manager
  function initialize() {
    console.log("[SM] Initializing search manager");
    
    // Initialize DOM references
    if (!initDOMReferences()) {
      console.error("[SM] Cannot initialize - DOM elements missing");
      return;
    }
    
    // Setup event listeners
    setupEventListeners();
    
    console.log("[SM] Search manager initialized");
    
    // Force a debug test if needed
    // setTimeout(() => testSearch("la"), 2000);
  }
  
  // Public API
  return {
    init: function() {
      // Initialize after DOM is ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
      } else {
        initialize();
      }
    },
    
    // Manual search trigger for testing
    testSearch: function(text) {
      console.log(`[SM] Test search: "${text}"`);
      
      // Ensure DOM references
      initDOMReferences();
      
      // Process search
      processSearch(text);
    },
    
    // Search in specific layer
    searchInLayer: function(text, layerId) {
      if (!text || !layerId) return [];
      
      try {
        const layerMarkers = MarkerManager.getLayerMarkers(layerId);
        return layerMarkers.filter(item => 
          item.name.toLowerCase().includes(text.toLowerCase())
        );
      } catch (e) {
        console.error("[SM] Error in searchInLayer:", e);
        return [];
      }
    }
  };
})();