import { InputGroup, InputLeftElement, Input, chakra } from '@chakra-ui/react';
import { useRecoilState } from 'recoil';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import { useEffect, useState } from 'react';
import { userPlaylistsState } from './atom';

const CSearchIcon = chakra(HiMagnifyingGlass);

const InputFilter = ({ borderRightRadius }: { borderRightRadius: number }): JSX.Element => {
  const [filterValue, setFilterValue] = useState<string>('');
  const [state, setState] = useRecoilState(userPlaylistsState);

  useEffect(() => {
    const filteredPlaylists = state.playlists.filter(
      playlist => playlist.name.includes(filterValue) || playlist.description.includes(filterValue)
    );
    setState(prev => ({ ...prev, filteredPlaylists }));
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
        placeholder="Search playlist..."
        data-testid="filter-playlist-input"
        onChange={event => setFilterValue(event.target.value)}
      />
    </InputGroup>
  );
};

export default InputFilter;
