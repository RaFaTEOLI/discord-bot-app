import { commandsState } from '@/presentation/pages/commands/components';
import { Button } from '@chakra-ui/react';
import { HiTrash } from 'react-icons/hi2';
import { useRecoilValue } from 'recoil';

type Props = {
  onClick: () => void;
};

const DeleteButton = ({ onClick }: Props): JSX.Element => {
  const state = useRecoilValue(commandsState);
  return (
    <Button
      w="100%"
      type="button"
      isDisabled={state.disabledForm}
      isLoading={state.isLoading}
      leftIcon={<HiTrash />}
      colorScheme="red"
      variant="solid"
      onClick={onClick}
      data-testid="delete-button"
    >
      Delete
    </Button>
  );
};

export default DeleteButton;
