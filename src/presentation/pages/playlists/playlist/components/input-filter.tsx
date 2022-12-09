import { InputGroup, InputLeftElement, Input, chakra } from '@chakra-ui/react';
import { useRecoilState } from 'recoil';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import { useEffect, useState } from 'react';
import { userPlaylistState } from './atom';

const CSearchIcon = chakra(HiMagnifyingGlass);

const InputFilter = ({ borderRightRadius }: { borderRightRadius: number }): JSX.Element => {
  const [filterValue, setFilterValue] = useState<string>('');
  const [state, setState] = useRecoilState(userPlaylistState);

  useEffect(() => {
    const filteredTracks =
      state.playlist.tracks.items?.filter(
        track => track.track.name.includes(filterValue) || track.track.artists[0].name.includes(filterValue)
      ) ?? [];
    setState(prev => ({ ...prev, filteredTracks }));
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
        placeholder="Search song..."
        data-testid="filter-song-input"
        onChange={event => setFilterValue(event.target.value)}
      />
    </InputGroup>
  );
};

export default InputFilter;
