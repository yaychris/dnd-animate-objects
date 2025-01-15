export type DiceRoll = `${number}d${number}`;

export function rollDie(sides: number): number {
  return Math.floor((Math.random() * sides) + 1);
}

export function roll(dice: DiceRoll): number {
  const [count, sides] = dice.split('d').map((x) => parseInt(x, 10));

  let result = 0;

  for (let i = 0; i < count; i++) {
    result += rollDie(sides);
  }

  return result;
}

export enum CritResult {
  NoCrit,
  CriticalHit,
  CriticalMiss,
}

export enum Advantage {
  NoAdvantage,
  WithAdvantage,
  WithDisadvantage,
}

export type AttackRollResult = {
  result: number,
  crit: CritResult,
};

export function attackRoll(bonus = 0, advantage = Advantage.NoAdvantage, dieRoller = rollDie): AttackRollResult {
  let roll = dieRoller(20);

  switch(advantage) {
    case Advantage.WithAdvantage:
      roll = Math.max(roll, dieRoller(20));
      break;

    case Advantage.WithDisadvantage:
      roll = Math.min(roll, dieRoller(20));
      break;
  }

  let crit = CritResult.NoCrit;

  switch (roll) {
    case 1:
      crit = CritResult.CriticalMiss;
      break;

    case 20:
      crit = CritResult.CriticalHit;
      break;
  }

  return {
    result: roll + bonus,
    crit,
  };
}

export type AnimateObjectsAttackResult = {
 damage: number;
 numHits: number;
 numCriticalHits: number;
 numCriticalMisses: number;
}

export function animateObjectsAttack(
  numObjects: number,
  targetAC: number,
  attackBonus: number,
  damageRoll: DiceRoll,
  damageBonus: number,
  advantage = Advantage.NoAdvantage,
  attackDiceRoller = attackRoll, 
  damageDiceRoller = roll,
): AnimateObjectsAttackResult {
  const result = {
    damage: 0,
    numHits: 0,
    numCriticalHits: 0,
    numCriticalMisses: 0,
  } satisfies AnimateObjectsAttackResult;

  for (let i = 0; i < numObjects; i++) {
    const attackResult = attackDiceRoller(attackBonus, advantage)

    if (attackResult.crit === CritResult.CriticalMiss) {
      result.numCriticalMisses += 1;
      continue;
    }

    if (attackResult.crit === CritResult.CriticalHit) {
      result.numHits += 1;
      result.numCriticalHits += 1;
      result.damage += damageDiceRoller(damageRoll) + damageDiceRoller(damageRoll) + damageBonus;
      continue;
    }

    if (attackResult.result >= targetAC) {
      result.numHits += 1;
      result.damage += damageDiceRoller(damageRoll) + damageBonus;
    }
  }

  return result;
}
