// js/markers/chest.js - Chest markers with item contents
export const ChestMarkers = [
    {
      name: 'Common Chest', //There are wood, bronze, silver and gold chests
      coords: [1360, 3940], 
      group: 'chest',
      layer: 'layer1',
      items: [
        {
          name: 'Copper Sword',
          type: 'diagram',
        },
      ]
    },
    {
      name: 'Silver Chest', //There are wood, bronze, silver and gold chests
      coords: [2096, 9201], 
      group: 'chest',
      layer: 'layer1',
      items: [
        {
          name: "Furion's Protection",
          type: 'diagram',
        },
        {
          name: "Venomous Oil",
          type: 'diagram'
        }
      ]
  }
    // Add more chest markers as needed
  ];