import { Flex, Button, InputGroup, InputLeftElement, Input, chakra } from '@chakra-ui/react';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import { useRecoilState } from 'recoil';
import { searchState } from './atom';

const CSearchIcon = chakra(HiMagnifyingGlass);

const SearchContainer = ({ onClick }: { onClick: () => Promise<void> }): JSX.Element => {
  const [state, setState] = useRecoilState(searchState);

  return (
    <Flex>
      <InputGroup>
        <InputLeftElement>
          <CSearchIcon size={15} mb={2} />
        </InputLeftElement>

        <Input
          borderRadius={5}
          borderRightRadius={0}
          variant="outline"
          size="sm"
          title="Search"
          placeholder="Search..."
          data-testid="search-song-input"
          value={state.value}
          onChange={event => setState(prev => ({ ...prev, value: event.target.value }))}
        />
      </InputGroup>
      <Button
        data-testid="search-song-button"
        onClick={onClick}
        colorScheme="blue"
        borderLeftRadius={0}
        size="sm"
        leftIcon={<CSearchIcon />}
      >
        Search
      </Button>
    </Flex>
  );
};

export default SearchContainer;
