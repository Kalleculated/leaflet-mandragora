// js/constants/item-data.js
export const ItemData = (function() {
    const ABILITIES = {
      RESONANCE: {
        name: "Resonance",
        description: `Spending Agrenaline charges your equipped Two-Handed Weapon.  When fully charged, you can activate 
          Resonance to empower the weapon, causing all Weapon Attacks to emit damaging shockwaves around their point of impact.
          The damage of the shockwaves is based on your Weapon Damage.`
      },
      BLADE_DANCE: {
        name: "Blade Dance",
        description: `Spending Combo Points charges your equipped Daggers.  When fully charged, you can activate Blade Dance to briefly
          become incorporeal and unleash a series of rapid cuts, distributed randomly between nearby enemies.  Each cut deals damage based
          on your Weapon Damage.`
      },
      INNER_STRENGTH: {
        name: "Inner Strength",
        description: `Spending Adrenaline charges your equipped Tower Shield.  When fully charged, you can activate Inner Strength
          to release a shockwave forward, damaging all enemies in its path.  The damage of the shockwave is based on your Shield Damage`
      },
      PARRY: {
        name: "Parry",
        description: `Most melee attacks and Physical projectiles can be Parried with Light Shields, if timed correctly.  Successfully Parrying
          a melee attack damages and Staggers the attacker.  Parried projectiles are deflected instead.`
      },
      DISCHARGE: {
        name: "Discharge",
        description: `Spending Mana charges your equipped Relic.  When fully charged, you can activate Discharge to release a blast around you,
        Staggering nearby enemies and applying a Status Effect appropriate to your Relic's element.`
      },
    };
    
    const PASSIVES = {
      ROOT_CHANCE: (value) => `+${value}% Root Chance`,
      POISON_CHANCE: (value) => `+${value}% Poison Chance`,
      SMASH_CHANCE: (value) => `+${value}% Smash Chance`,
      MANA: (value) => `+${value} Mana`,
      BURN_CHANCE: (value) => `+${value}% Burn Chance`,
      LIGHTBRAND_CHANCE: (value) => `+${value}% Lightbrand Chance`,
      HEALING_EFFECTIVENESS: (value) => `+${value}% Healing Effectiveness`,
      MAGIC_CRIT_CHANCE: (value) => `+${value}% Magic Critical Chance`,
      WEAKNESS_CHANCE: (value) => `+${value}% Weakness Chance`,
    };

    const REQUIREMENTS = {
      COMBAT_MASTERY: `Combat Mastery`,
      FIRE_MASTERY: `Fire Mastery`,
      WYLD_MASTERY: `Wyld Mastery`,
      CHAOS_MASTERY: `Chaos Mastery`,
      EQUIP_LOAD: (value) => `Less than ${value}% Equip Load`,
      SPIRIT: (value) => `${value} Spirit`,
    };

    const ITEM_TYPES = {
      WEAPON: 'weapon',
      RELIC: 'relic',
      OFFHAND: 'offhand',
      ARMOR: 'armor',
    };

    const ITEM_CLASSES = {
      GREAT_HAMMER: 'Greathammer',
      GREAT_SWORD: 'Greatsword',
      DAGGERS: 'Daggers',
      ONE_HANDED_MACE: 'One-Handed Mace',
      ONE_HANDED_SWORD: 'One-Handed Sword',
      PLATE: 'Plate',
      LEATHER: 'Leather',
      CLOTH: 'Cloth',
      TOWER_SHIELD: 'Tower Shield',
      FIRE: 'Fire',
      WYLD: 'Wyld',
    };
  
    return {
      ABILITIES,
      PASSIVES,
      REQUIREMENTS,
      ITEM_TYPES,
      ITEM_CLASSES,
    };
  })();
