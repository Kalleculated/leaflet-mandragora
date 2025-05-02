// js/markers/chest.js - Chest markers with item contents
const ChestMarkers = [
    {
      name: 'Forest Chest', 
      coords: [1200, 4000], 
      group: 'chest',
      layer: 'layer1',
      items: [
        {
          name: 'Silver Sword',
          type: 'weapon',
          image: 'assets/items/silver_sword.jpg',
          stats: {
            damage: 45,
            weight: 3.5
          }
        },
      ]
    },
    {
      name: 'Mountain Chest', 
      coords: [1500, 5500], 
      group: 'chest',
      layer: 'layer1',
      items: [
        {
          name: 'Steel Helmet',
          type: 'armor',
          image: 'assets/items/steel_helmet.jpg',
          stats: {
            armor: 15,
            weight: 5
          }
        }
      ]
    }
    // Add more chest markers as needed
  ];