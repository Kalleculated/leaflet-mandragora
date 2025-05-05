// js/markers/vendor.js
import { ItemData } from '../constants/item-data.js';

const { 
  POISON_CHANCE, ROOT_CHANCE, SMASH_CHANCE, MANA, BURN_CHANCE, LIGHTBRAND_CHANCE, HEALING_EFFECTIVENESS
  , MAGIC_CRIT_CHANCE, WEAKNESS_CHANCE, ARMOR_PENETRATION, ARMOR_PASSIVE
} = ItemData.PASSIVES;
const { EQUIP_LOAD, COMBAT_MASTERY, FIRE_MASTERY, WYLD_MASTERY, SPIRIT, ASTRAL_MASTERY, CHAOS_MASTERY, } = ItemData.REQUIREMENTS;
const { RESONANCE, DISCHARGE, BLADE_DANCE, INNER_STRENGTH, PARRY } = ItemData.ABILITIES;
const { WEAPON, RELIC, OFFHAND, ARMOR, CONSUMABLE } = ItemData.ITEM_TYPES;
const { GREAT_HAMMER, GREAT_SWORD, DAGGERS, ONE_HANDED_MACE, ONE_HANDED_SWORD, TOWER_SHIELD, PLATE
  , LEATHER, CLOTH, FIRE, WYLD, LIGHT_SHIELD, ASTRAL, CHAOS, POTION, 
} = ItemData.ITEM_CLASSES;
const { RESTORE_HEALTH, RESTORE_MANA } = ItemData.EFFECTS;

export const VendorMarkers = [
  {
    name: 'Deeydre and Aille', 
    coords: [1786, 1940], 
    group: 'vendor',
    layer: 'layer1',
    items: [
      {
        name: 'Earthshaper',
        type: WEAPON,
        class: GREAT_HAMMER,
        image: 'assets/items/earthshaper.jpg',
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
          ability: RESONANCE.name,
          abilityDescription: RESONANCE.description,
          weight: 17,
          speed: 0.75,
          stagger: 200,
          stamina: 2.8,
          requires: EQUIP_LOAD(125),
          passives: [
            ROOT_CHANCE(13)
          ]
        }
      },
      {
        name: 'Serpent Tongue',
        type: WEAPON,
        class: GREAT_SWORD,
        image: 'assets/items/serpent_tongue.jpg',
        price: 10800,
        stats: {
          speed: 1.13,
          weight: 12,
          stagger: 170,
          stamina: 2.6,
          damage: {
            physical: 175,
            wyld: 80,
            astral: 50
          },
          scaling: {
            strength: "B",
            dexterity: "S",
            spirit: "S+"
          },
          ability: RESONANCE.name,
          abilityDescription: RESONANCE.description,
          passives: [
            POISON_CHANCE(13)
          ]
        }
      },
      {
        name: 'Dragonfly',
        type: WEAPON,
        class: DAGGERS,
        image: 'assets/items/dragonfly.jpg',
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
          requires: [
            SPIRIT(15)
          ],
          ability: BLADE_DANCE.name,
          abilityDescription: BLADE_DANCE.description,
          passives: [
            ROOT_CHANCE(8),
            POISON_CHANCE(10)
          ]
        }
      },
      {
        name: 'Emerald Dream',
        type: WEAPON,
        class: ONE_HANDED_MACE,
        image: 'assets/items/emerald_dream.jpg',
        price: 8300,
        stats: {
          speed: 1.66,
          weight: 5,
          stagger: 117,
          stamina: 1.95,
          damage: {
            physical: 45,
            wyld: 170
          },
          scaling: {
            dexterity: "B+",
            spirit: "A+"
          },
          requires: [
            SPIRIT(15)
          ],
          passives: [
            ROOT_CHANCE(10),
            SMASH_CHANCE(35)
          ]
        }
      },
      {
        name: 'Witchclaw',
        type: WEAPON,
        class: ONE_HANDED_SWORD,
        image: 'assets/items/witchclaw.jpg',
        price: 7900,
        stats: {
          speed: 2.03,
          weight: 4.2,
          stagger: 80,
          stamina: 1.9,
          damage: {
            physical: 25,
            wyld: 85,
            chaos: 85
          },
          scaling: {
            dexterity: "D+",
            spirit: "B",
            power: "B"
          },
          requires: [
            SPIRIT(10)
          ],
          passives: [
            POISON_CHANCE(10)
          ]
        }
      },
      {
        name: "High Priest Breastplate",
        type: ARMOR,
        class: PLATE,
        image: 'assets/items/high_priest_breastplate.jpg',
        price: 6500,
        stats: {
          armor: 40,
          spirit: 7,
          knowledge: 7,
          constitution: 6,
          weight: 12,
          poise: 27
        }
      },
      {
        name: "Grovetender's Jerkin",
        type: ARMOR,
        class: LEATHER,
        image: 'assets/items/groventenders_jerkin.jpg',
        price: 5370,
        stats: {
          armor: 19,
          spirit: 7,
          knowledge: 7,
          dexterity: 7,
          weight: 8.7,
          poise: 14
        }
      },
      {
        name: "Dhaunae's Coat",
        type: ARMOR,
        class: CLOTH,
        image: 'assets/items/dhaunaes_coat.jpg',
        price: 4885,
        stats: {
          armor: 13,
          spirit: 6,
          power: 7,
          constitution: 6,
          weight: 4.7,
          poise: 9.2
        }
      },
      {
        name: "Oakheart",
        type: OFFHAND,
        class: TOWER_SHIELD,
        image: 'assets/items/oakheart.jpg',
        price: 6390,
        stats: {
          weight: 19.5,
          poise: 28,
          balance: 95,
          armor: 50,
          damage: {
            physical: 100,
            wyld: 105,
          },
          scaling: {
            dexterity: "C+",
            spirit: "S+",
            strength: "C+"
          },
          requires: [
            EQUIP_LOAD(125),
            COMBAT_MASTERY,
          ],
          ability: INNER_STRENGTH.name,
          abilityDescription: INNER_STRENGTH.description,
          passives: [
            POISON_CHANCE(10)
          ],
          defense: {
            physical: 100,
            burn: 85,
            frost: 85,
            wyld: 85,
            chaos: 85,
            // there's an extra +30% wlyd on this shield that I don't understand
          }
        }
      },
      {
        name: "Ashfall",
        type: RELIC,
        class: FIRE,
        image: 'assets/items/ashfall.jpg',
        price: 4920,
        stats: {
          weight: 1.6,
          spell_buff: 70,
          requires: [
            FIRE_MASTERY,
          ],
          passives: [
            MANA(120),
            BURN_CHANCE(15),
          ],
          ability: DISCHARGE.name,
          abilityDescription: DISCHARGE.description,
        }
      },
      {
        name: "Earthsong Talisman",
        type: RELIC,
        class: WYLD,
        image: 'assets/items/earthsong_talisman.jpg',
        price: 4920,
        stats: {
          weight: 1.6,
          spell_buff: 70,
          requires: [
            WYLD_MASTERY,
          ],
          passives: [
            MANA(120),
            ROOT_CHANCE(15),
          ],
          ability: DISCHARGE.name,
          abilityDescription: DISCHARGE.description,
        }
      },
      {
        name: "High Priest Legplates",
        type: ARMOR,
        class: PLATE,
        image: 'assets/items/high_priest_legplates.jpg',
        price: 5000,
        stats: {
          weight: 7,
          poise: 16,
          armor: 17.5,
          strength: 6,
          spirit: 6,
          endurance: 6,
        }
      },
      {
        name: "Grovetender's Pants",
        type: ARMOR,
        class: LEATHER,
        image: 'assets/items/grovetenders_pants.jpg',
        price: 4130,
        stats: {
          weight: 5.1,
          poise: 8.5,
          armor: 19,
          dexterity: 6,
          spirit: 6,
          defense: 6,
        }
      },
      {
        name: "Dhaunae's Leggings",
        type: ARMOR,
        class: CLOTH,
        image: 'assets/items/dhaunaes_leggings.jpg',
        price: 3760,
        stats: {
          weight: 4,
          poise: 6.2,
          armor: 7.7,
          power: 6,
          spirit: 6,
          endurance: 6,
        }
      },
      {
        name: "High Priest Halo",
        type: ARMOR,
        class: PLATE,
        image: 'assets/items/high_priest_halo.jpg',
        price: 3850,
        stats: {
          weight: 4.8,
          poise: 9,
          armor: 9,
          passives: [
            LIGHTBRAND_CHANCE(10),
            HEALING_EFFECTIVENESS(12),
          ],
        }
      },
      {
        name: "Grovetender's Crown",
        type: ARMOR,
        class: LEATHER,
        image: 'assets/items/grovetenders_crown.jpg',
        price: 3200,
        stats: {
          weight: 3.4,
          poise: 5.7,
          armor: 4.5,
          passives: [
            ROOT_CHANCE(10),
            MAGIC_CRIT_CHANCE(13),
          ],
        }
      },
      {
        name: "Dhaunae's Hat",
        type: ARMOR,
        class: CLOTH,
        image: 'assets/items/dhaunaes_hat.jpg',
        price: 2890,
        stats: {
          weight: 2.85,
          poise: 4,
          armor: 1,
          knowledge: 5,
          passives: [
            WEAKNESS_CHANCE(10),
          ],
        }
      },
      {
        name: "High Priest Bracers",
        type: ARMOR,
        class: PLATE,
        image: 'assets/items/high_priest_bracers.jpg',
        price: 2960,
        stats: {
          weight: 2.5,
          poise: 6,
          armor: 4,
          passives: [
            LIGHTBRAND_CHANCE(7),
            HEALING_EFFECTIVENESS(8),
          ],
        }
      },
      {
        name: "Grovetender's Gloves",
        type: ARMOR,
        class: LEATHER,
        image: 'assets/items/grovetenders_gloves.jpg',
        price: 2450,
        stats: {
          weight: 1.4,
          poise: 2.8,
          armor: 2.3,
          passives: [
            MAGIC_CRIT_CHANCE(10),
            ROOT_CHANCE(7),
          ],
        }
      },
      {
        name: "Dhaunae's Gloves",
        type: ARMOR,
        class: CLOTH,
        image: 'assets/items/dhaunaes_gloves.jpg',
        price: 2225,
        stats: {
          weight: 1.1,
          poise: 1.7,
          armor: 0.85,
          knowledge: 5,
          passives: [
            WEAKNESS_CHANCE(7),
          ],
        }
      },
    ]
  },
  {
    name: 'Sam', 
    coords: [1095, 2171], 
    group: 'vendor',
    layer: 'layer1',
    items: [
      {
        name: 'Barbaric Warhammer',
        type: WEAPON,
        class: GREAT_HAMMER,
        image: 'assets/items/barbaric_warhammer.jpg',
        price: 2440,
        stats: {
          damage: {
            physical: 185,
          },
          scaling: {
            strength: "B",
          },
          ability: RESONANCE.name,
          abilityDescription: RESONANCE.description,
          weight: 5,
          speed: 0.71,
          stagger: 130,
          stamina: 1.75,
          passives: [
            SMASH_CHANCE(20),
            ARMOR_PENETRATION(10),
          ]
        }
      },
      {
        name: 'Claymore',
        type: WEAPON,
        class: GREAT_SWORD,
        image: 'assets/items/claymore.jpg',
        price: 2200,
        stats: {
          damage: {
            physical: 165,
          },
          scaling: {
            strength: "B",
            dexterity: "D",
          },
          ability: RESONANCE.name,
          abilityDescription: RESONANCE.description,
          weight: 3,
          speed: 1.11,
          stagger: 120,
          stamina: 1.6,
        }
      },
      {
        name: 'Starburnt Scepter',
        type: WEAPON,
        class: ONE_HANDED_MACE,
        image: 'assets/items/starburnt_scepter.jpg',
        price: 1875,
        stats: {
          damage: {
            physical: 20,
            astral: 50,
            fire: 45,
          },
          scaling: {
            strength: "D",
            power: "B",
            spirit: "B",
          },
          weight: 1.6,
          speed: 1.75,
          stagger: 70,
          stamina: 1.4,
          passives: [
            MAGIC_CRIT_CHANCE(20),
          ]
        }
      },
      {
        name: 'Heretic Shield',
        type: OFFHAND,
        class: LIGHT_SHIELD,
        image: 'assets/items/heretic_shield.jpg',
        price: 1450,
        stats: {
          damage: {
            physical: 20,
            fire: 50,
          },
          scaling: {
            strength: "D",
            power: "B",
            spirit: "C+",
          },
          weight: 5,
          poise: 5.5,
          balance: 40,
          ability: PARRY.name,
          abilityDescription: PARRY.description,
          defense: {
            physical: 100,
            burn: 45,
            frost: 45,
            wyld: 45,
            chaos: 45,
            // there's an extra +25% burn on this shield that I don't understand
          },
          passives: [
            ARMOR_PASSIVE(10),
          ],
        }
      },
      {
        name: "Astral Solution",
        type: RELIC,
        class: ASTRAL,
        image: 'assets/items/astral_solution.jpg',
        price: 1300,
        stats: {
          weight: 1.15,
          spell_buff: 10,
          requires: [
            ASTRAL_MASTERY,
          ],
          passives: [
            MANA(20),
          ],
          ability: DISCHARGE.name,
          abilityDescription: DISCHARGE.description,
        }
      },
      {
        name: "Chaos Splinters",
        type: RELIC,
        class: CHAOS,
        image: 'assets/items/chaos_splinters.jpg',
        price: 1300,
        stats: {
          weight: 1.15,
          spell_buff: 10,
          requires: [
            CHAOS_MASTERY,
          ],
          passives: [
            MANA(20),
          ],
          ability: DISCHARGE.name,
          abilityDescription: DISCHARGE.description,
        }
      },
      {
        name: "Glyph of the Pyromancer",
        type: RELIC,
        class: FIRE,
        image: 'assets/items/glyph_of_the_pyromancer.jpg',
        price: 1300,
        stats: {
          weight: 1.15,
          spell_buff: 10,
          requires: [
            FIRE_MASTERY,
          ],
          passives: [
            MANA(20),
          ],
          ability: DISCHARGE.name,
          abilityDescription: DISCHARGE.description,
        }
      },
      {
        name: "Weak Health Potion",
        type: CONSUMABLE,
        class: POTION,
        image: 'assets/items/weak_health_potion.jpg',
        price: 115,
        effect: RESTORE_HEALTH(90),
      },
      {
        name: "Weak Mana Potion",
        type: CONSUMABLE,
        class: POTION,
        image: 'assets/items/weak_mana_potion.jpg',
        price: 115,
        effect: RESTORE_MANA(60),
      },
    ]
  }
];