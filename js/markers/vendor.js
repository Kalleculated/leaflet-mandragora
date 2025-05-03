// js/markers/vendor.js - Vendor markers with items for sale
const VendorMarkers = [
  // {
  //   name: 'Village Merchant', 
  //   coords: [1300, 4500], 
  //   group: 'vendor',
  //   layer: 'layer1',
  //   items: [
  //     {
  //       name: 'Iron Sword',
  //       type: 'weapon',
  //       image: 'assets/items/iron_sword.jpg',
  //       price: 150,
  //       stats: {
  //         damage: 25,
  //         weight: 4
  //       }
  //     },
  //     {
  //       name: 'Leather Armor',
  //       type: 'armor',
  //       image: 'assets/items/leather_armor.jpg',
  //       price: 120,
  //       stats: {
  //         armor: 10,
  //         weight: 8
  //       }
  //     }
  //   ],
  //   craftableItems: [
  //     {
  //       name: 'Steel Greatsword',
  //       type: 'weapon',
  //       image: 'assets/items/steel_greatsword.jpg',
  //       materials: [
  //         { name: 'Steel Ingot', quantity: 2 },
  //         { name: 'Leather Strips', quantity: 1 }
  //       ],
  //       stats: {
  //         damage: 40,
  //         weight: 6
  //       }
  //     }
  //   ]
  // },
  {
    name: 'Deeydre and Aille', 
    coords: [1786, 1940], 
    group: 'vendor',
    layer: 'layer1',
    items: [
      {
        name: 'Earthshaper',
        type: 'weapon',
        image: 'assets/items/iron_sword.jpg',
        price: 11900,
        stats: {
          damage: {
            physical: 215,
            wyld: 110,
            crit: 620
          },
          scaling: {
            strength: "A",
            dexterity: "B",
            spirit: "S"
          },
          ability: "Resonance",
          abilityDescription: "Increases damage by 10% for each enemy hit, up to 50%.",
          weight: 17,
          speed: 0.75,
          stagger: 200,
          stamina: 2.8,
          requires: "Less than 125% equip load",
          passives: [
            "+13% root chance",
          ]
        }
      },
      {
        name: 'Serpent Tongue',
        type: 'weapon',
        image: 'assets/items/leather_armor.jpg',
        price: 10800,
        stats: {
          speed: 1.13,
          weight: 12,
          stagger: 170,
          stamina: 2.6,
          damage: {
            physical: 175,
            wyld: 80,
            light: 50,
            crit: 603
          },
          scaling: {
            strength: "B",
            dexterity: "S",
            light: "S+"
          },
        },
        ability: "Resonance",
        abilityDescription: "Increases damage by 10% for each enemy hit, up to 50%.",
        passives: [
          "+13% poison chance",
        ]
      }
    ],
  }
  // Add more vendor markers as needed
];