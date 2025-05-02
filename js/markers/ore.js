// js/markers/ore.js - Sample with both single and multi-coordinates
const OreMarkers = [
  // Single coordinate format
  {
    name: 'Tinstone', 
    coords: [1058, 2900], 
    group: 'ore',
    layer: 'layer1'
  },
  // Multiple coordinates format for the same resource
  {
    name: 'Copper', 
    coords: [
      [1250, 4166],
      [981, 3592]
    ], 
    group: 'ore',
    layer: 'layer1'
  }
];
