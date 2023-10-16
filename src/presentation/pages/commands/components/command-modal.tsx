import {
  chakra,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure
} from '@chakra-ui/react';
import { FiEdit } from 'react-icons/fi';
import { HiCommandLine, HiEnvelopeOpen, HiInformationCircle } from 'react-icons/hi2';
import { useRecoilState, useRecoilValue } from 'recoil';
import { commandsState } from '@/presentation/pages/commands/components';
import Input from './input';
import Button from './button';
import Select from './select';
import DeleteButton from './delete-button';
import { ConfirmationModal, currentAccountState } from '@/presentation/components';
import { useNavigate } from 'react-router';

const CommandsIcon = chakra(HiCommandLine);
const DescriptionIcon = chakra(HiInformationCircle);
const ResponseIcon = chakra(HiEnvelopeOpen);
const EditIcon = chakra(FiEdit);

export type Props = {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => Promise<void>;
};

const CommandModal = ({ isOpen, onClose, onDelete }: Props): JSX.Element => {
  const navigate = useNavigate();
  const [state] = useRecoilState(commandsState);
  const { getCurrentAccount } = useRecoilValue(currentAccountState);
  const { isOpen: isConfirmationOpen, onOpen: onConfirmationOpen, onClose: onConfirmationClose } = useDisclosure();

  const handleDelete = (): void => {
    onConfirmationClose();
    onDelete();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form style={{ width: '100%' }} data-testid="form">
            <ModalHeader>Command</ModalHeader>
            <ModalCloseButton data-testid="close-modal" />
            <ModalBody>
              <Stack spacing={4}>
                <Input isDisabled type="text" name="command" placeholder="Command" icon={<CommandsIcon />} />
                <Input isDisabled type="text" name="description" placeholder="Description" icon={<DescriptionIcon />} />
                <Input isDisabled type="text" name="response" placeholder="Response" icon={<ResponseIcon />} />
                <Select isDisabled name="type" placeholder="Type" options={state.types} />
                <Select isDisabled name="dispatcher" placeholder="Dispatcher" options={state.dispatchers} />
              </Stack>
            </ModalBody>

            {getCurrentAccount().user.role === 'admin' && (
              <ModalFooter display="flex" flexDir="column" gap={2}>
                <Button onClick={() => navigate(`/commands/${state.selectedCommand.id}`)} text="Edit" icon={<EditIcon />} />
                {state.selectedCommand.id && <DeleteButton onClick={onConfirmationOpen} />}
              </ModalFooter>
            )}
          </form>
        </ModalContent>
      </Modal>
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={onConfirmationClose}
        confirm={handleDelete}
        loading={state.isLoading}
      />
    </>
  );
};

export default CommandModal;
