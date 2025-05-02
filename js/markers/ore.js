// js/markers/ore.js - Sample with both single and multi-coordinates
const OreMarkers = [
  // Single coordinate format
  {
    name: 'Tinstone', 
    coords: [
      [1058, 2900], 
      [405, 5205],
      [1058, 5513],
    ],
    group: 'ore',
    layer: 'layer1'
  },
  // Multiple coordinates format for the same resource
  {
    name: 'Copper', 
    coords: [
      [1250, 4166],
      [981, 3592],
      [941, 2211],
      [1363, 4053]
    ], 
    group: 'ore',
    layer: 'layer1'  // Specify layer
  },
  {
    name: 'Silver', 
    coords: [
      [1096, 1209], 
      [1019, 826],
    ],
    group: 'ore',
    layer: 'layer1'  // Specify layer
  },
  {
    name: 'Adamantite', //diamond
    coords: [
      [403, 826], 
      [327, 1209],
      [1748, 2249],
      [366, 5513],
    ],
    group: 'ore',
    layer: 'layer1'  // Specify layer
  },
  {
    name: 'Iron',
    coords: [
      [596, 4630],
      [594, 5015],
    ],
    group: 'ore',
    layer: 'layer1'  // Specify layer
  },
  {
    name: 'Mithril',
    coords: [
      [1750, 7932],
      [1479, 9123],
    ],
    group: 'ore',
    layer: 'layer1'  // Specify layer
  },
  {
    name: 'Gold',
    coords: [
      [1632, 6742],
    ],
    group: 'ore',
    layer: 'layer1'  // Specify layer
  },
  // Add more markers as needed
];
