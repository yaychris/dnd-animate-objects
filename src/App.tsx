import { useState } from 'react'
import { Advantage, animateObjectsAttack, type AnimateObjectsAttackResult, type DiceRoll } from './animate-objects';
import { Box, Button, Container, DataList, Flex, Heading, RadioGroup, Text, TextField } from '@radix-ui/themes';

export function App() {
  const [numObjects, setNumObjects] = useState(10);
  const [targetAC, setTargetAC] = useState(18);
  const [attackBonus, setAttackBonus] = useState(8);
  const [damageRoll, setDamageRoll] = useState('1d4');
  const [damageBonus, setDamageBonus] = useState(4);
  const [advantage, setAdvantage] = useState<Advantage>(Advantage.NoAdvantage);
  const [attackResult, setAttackResult] = useState<AnimateObjectsAttackResult | null>(null);

  function numberSetter(setter: (newVal: number) => void): React.ChangeEventHandler<HTMLInputElement> {
    return function (e) {
      console.log({ setter, e });
      setter(parseInt(e.target.value, 10));
    }
  }

  function stringSetter(setter: (newVal: string) => void): React.ChangeEventHandler<HTMLInputElement> {
    return function (e) {
      setter(e.target.value);
    }
  }

  function handleAttack() {
    console.log({ advantage });

    const result = animateObjectsAttack(
      numObjects,
      targetAC,
      attackBonus,
      damageRoll as DiceRoll,
      damageBonus,
      advantage,
    );

    setAttackResult(result);
  }

  function handleClear() {
    setAttackResult(null);
  }

  return (
    <Container size="2" p="8">
      <Heading mb="8">Animate Objects Attack Roller</Heading>

      <Flex direction="row" gap="8">
        <Flex flexGrow="1" direction="column" gap="4" mb="8">
          <label>
            Number of Objects:{' '}
            <TextField.Root type="number" value={numObjects} onChange={numberSetter(setNumObjects)} />
          </label>

          <label>
            Target AC:{' '}
            <TextField.Root type="number" value={targetAC} onChange={numberSetter(setTargetAC)} />
          </label>

          <label>
            Attack Bonus:{' '}
            <TextField.Root type="number" value={attackBonus} onChange={numberSetter(setAttackBonus)} />
          </label>

          <label>
            Damage Roll:{' '}
            <TextField.Root type="text" value={damageRoll} onChange={stringSetter(setDamageRoll)} />
          </label>

          <label>
            Damage Bonus:{' '}
            <TextField.Root type="text" value={damageBonus} onChange={numberSetter(setDamageBonus)} />
          </label>

          <RadioGroup.Root value={advantage.toString()} onValueChange={(newVal) => setAdvantage(parseInt(newVal, 10))}>
            <RadioGroup.Item value={Advantage.NoAdvantage.toString()}>No Advantage</RadioGroup.Item>
            <RadioGroup.Item value={Advantage.WithAdvantage.toString()}>Advantage</RadioGroup.Item>
            <RadioGroup.Item value={Advantage.WithDisadvantage.toString()}>Disadvantage</RadioGroup.Item>
          </RadioGroup.Root>

          <Flex gap="4" mt="4">
            <Button size="4" color="red" onClick={handleAttack}>
              Attack!
            </Button>

            <Button size="4" color="gray" onClick={handleClear}>
              Clear
            </Button>
          </Flex>
        </Flex>

        <Box flexGrow="1">
          {attackResult && (
            <DataList.Root size="3">
              <DataList.Item>
                <DataList.Label>
                  <Text size="6" weight="bold">Damage</Text>
                </DataList.Label>
                <DataList.Value>
                  <Text size="6" weight="bold" color="red">{attackResult.damage}</Text>
                </DataList.Value>
              </DataList.Item>

              <DataList.Item>
                <DataList.Label>Number of Hits</DataList.Label>
                <DataList.Value>
                  {attackResult.numHits}
                </DataList.Value>
              </DataList.Item>

              <DataList.Item>
                <DataList.Label>Number of Critical Hits</DataList.Label>
                <DataList.Value>
                  {attackResult.numCriticalHits}
                </DataList.Value>
              </DataList.Item>

              <DataList.Item>
                <DataList.Label>Number of Critical Misses</DataList.Label>
                <DataList.Value>
                  {attackResult.numCriticalMisses}
                </DataList.Value>
              </DataList.Item>
            </DataList.Root>
          )}
        </Box>
      </Flex>
    </Container>
  )
}
