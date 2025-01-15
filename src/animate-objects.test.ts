import { describe, expect, vi, it } from 'vitest';
import { Advantage, CritResult, animateObjectsAttack, attackRoll, rollDie } from './animate-objects';

describe('rollDie()', () => {
  it('fuzz test', () => {
    for (let i = 0; i < 10000; i++ ) {
      const result = rollDie(4);

      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(4);
    }
  });
});

describe('attackRoll()', () => {
  it('with advantage', () => {
    const roller = vi.fn()
      .mockReturnValueOnce(10)
      .mockReturnValueOnce(15);

    const roll = attackRoll(0, Advantage.WithAdvantage, roller);

    expect(roll.result).toEqual(15);
  });

  it('with disadvantage', () => {
    const roller = vi.fn()
      .mockReturnValueOnce(10)
      .mockReturnValueOnce(15);

    const roll = attackRoll(0, Advantage.WithDisadvantage, roller);

    expect(roll.result).toEqual(10);
  });
});

describe('animateObjectsAttack()', () => {
  it('all hits, max damage', () => {
    const attackRoll = () => ({ result: 18, crit: CritResult.NoCrit });
    const damageRoll = () => 4;

    const result = animateObjectsAttack(10, 18, 8, '1d4', 4, Advantage.NoAdvantage, attackRoll, damageRoll);

    expect(result.damage).toEqual(80);
    expect(result.numHits).toEqual(10);
    expect(result.numCriticalHits).toEqual(0);
    expect(result.numCriticalMisses).toEqual(0);
  });

  it('no hits, no damage', () => {
    const attackRoll = () => ({ result: 2, crit: CritResult.NoCrit });

    const result = animateObjectsAttack(10, 18, 8, '1d4', 4, Advantage.NoAdvantage, attackRoll);

    expect(result.damage).toEqual(0);
    expect(result.numHits).toEqual(0);
    expect(result.numCriticalHits).toEqual(0);
    expect(result.numCriticalMisses).toEqual(0);
  });

  it('critical hit', () => {
    const attackRoll = () => ({ result: 28, crit: CritResult.CriticalHit });
    const damageRoll = () => 4;

    const result = animateObjectsAttack(10, 69, 8, '1d4', 4, Advantage.NoAdvantage, attackRoll, damageRoll);

    expect(result.damage).toEqual(120);
    expect(result.numHits).toEqual(10);
    expect(result.numCriticalHits).toEqual(10);
    expect(result.numCriticalMisses).toEqual(0);
  });

  it('critical miss', () => {
    const attackRoll = () => ({ result: 9, crit: CritResult.CriticalMiss });
    const damageRoll = () => 4;

    const result = animateObjectsAttack(10, 5, 8, '1d4', 4, Advantage.NoAdvantage, attackRoll, damageRoll);

    expect(result.damage).toEqual(0);
    expect(result.numHits).toEqual(0);
    expect(result.numCriticalHits).toEqual(0);
    expect(result.numCriticalMisses).toEqual(10);
  });
});
