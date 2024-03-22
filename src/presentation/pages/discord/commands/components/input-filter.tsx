import { InputGroup, InputLeftElement, Input, chakra } from '@chakra-ui/react';
import { useRecoilState } from 'recoil';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import { useEffect, useState } from 'react';
import { discordCommandsState } from './atoms';

const CSearchIcon = chakra(HiMagnifyingGlass);

const InputFilter = ({ borderRightRadius }: { borderRightRadius: number }): JSX.Element => {
  const [filterValue, setFilterValue] = useState<string>('');
  const [state, setState] = useRecoilState(discordCommandsState);

  useEffect(() => {
    const filteredCommands = state.commands.filter(
      command => command.name.includes(filterValue) || command.description.includes(filterValue)
    );
    setState(prev => ({ ...prev, filteredCommands }));
  }, [filterValue]);

  return (
    <InputGroup>
      <InputLeftElement>
        <CSearchIcon size={15} mb={2} />
      </InputLeftElement>

      <Input
        borderRadius={5}
        borderRightRadius={borderRightRadius}
        variant="outline"
        size="sm"
        title="Search"
        placeholder="Search command..."
        data-testid="filter-command-input"
        onChange={event => setFilterValue(event.target.value)}
      />
    </InputGroup>
  );
};

export default InputFilter;
