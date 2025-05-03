// Item data definitions
export const ItemData = (() => {
  const ABILITIES = {
    RESONANCE: {
      name: "Resonance",
      description: "Increases damage by 10% for each enemy hit, up to 50%."
    },
    BLADE_DANCE: {
      name: "Blade Dance",
      description: "Increases damage by 10% for each enemy hit, up to 50%."
    }
  };
  
  const PASSIVES = {
    ROOT_CHANCE: (value) => `+${value}% Root Chance`,
    POISON_CHANCE: (value) => `+${value}% Poison Chance` 
  };

  return {
    ABILITIES,
    PASSIVES
  };
})();