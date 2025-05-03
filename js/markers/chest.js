// js/markers/chest.js - Chest markers with item contents
export const ChestMarkers = [
    {
      name: 'Common Chest', //There are common, bronze, silver and gold chests (?)
      coords: [1360, 3940], 
      group: 'chest',
      layer: 'layer1',
      items: [
        {
          name: 'Copper Sword',
          type: 'diagram',
          image: 'assets/items/silver_sword.jpg',
          stats: {
            damage: 45,
            weight: 3.5
          }
        },
      ]
    },
    // Add more chest markers as needed
  ];