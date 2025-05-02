// js/markers/vendor.js - Vendor markers with items for sale
const VendorMarkers = [
  {
    name: 'Village Merchant', 
    coords: [1300, 4500], 
    group: 'vendor',
    layer: 'layer1',
    items: [
      {
        name: 'Iron Sword',
        type: 'weapon',
        image: 'assets/items/iron_sword.jpg',
        price: 150,
        stats: {
          damage: 25,
          weight: 4
        }
      },
      {
        name: 'Leather Armor',
        type: 'armor',
        image: 'assets/items/leather_armor.jpg',
        price: 120,
        stats: {
          armor: 10,
          weight: 8
        }
      }
    ],
    craftableItems: [
      {
        name: 'Steel Greatsword',
        type: 'weapon',
        image: 'assets/items/steel_greatsword.jpg',
        materials: [
          { name: 'Steel Ingot', quantity: 2 },
          { name: 'Leather Strips', quantity: 1 }
        ],
        stats: {
          damage: 40,
          weight: 6
        }
      }
    ]
  },
  // Add more vendor markers as needed
];