// js/markers/vendor.js
const VendorMarkers = [
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
            wyld: 110
          },
          scaling: {
            strength: "A",
            dexterity: "B",
            spirit: "S"
          },
          ability: ItemData.ABILITIES.RESONANCE.name,
          abilityDescription: ItemData.ABILITIES.RESONANCE.description,
          weight: 17,
          speed: 0.75,
          stagger: 200,
          stamina: 2.8,
          requires: "Less than 125% equip load",
          passives: [
            ItemData.PASSIVES.ROOT_CHANCE(13)
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
            light: 50
          },
          scaling: {
            strength: "B",
            dexterity: "S",
            spirit: "S+"
          },
          ability: ItemData.ABILITIES.RESONANCE.name,
          abilityDescription: ItemData.ABILITIES.RESONANCE.description,
          passives: [
            ItemData.PASSIVES.POISON_CHANCE(13)
          ]
        }
      },
      {
        name: 'Dragonfly',
        type: 'weapon',
        image: 'assets/items/leather_armor.jpg',
        price: 6400,
        stats: {
          speed: 3.41,
          weight: 3.9,
          stagger: 60,
          stamina: 2,
          damage: {
            physical: 65,
            wyld: 75
          },
          scaling: {
            dexterity: "A+",
            spirit: "A+"
          },
          ability: ItemData.ABILITIES.BLADE_DANCE.name,
          abilityDescription: ItemData.ABILITIES.BLADE_DANCE.description,
          passives: [
            ItemData.PASSIVES.ROOT_CHANCE(8),
            ItemData.PASSIVES.POISON_CHANCE(10)
          ]
        }
      }
    ]
  }
];