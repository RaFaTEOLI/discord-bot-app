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
import { FiCheck } from 'react-icons/fi';
import { HiCommandLine, HiEnvelopeOpen, HiInformationCircle } from 'react-icons/hi2';
import { useRecoilState, useRecoilValue } from 'recoil';
import { commandsState } from '@/presentation/pages/commands/components';
import Input from './input';
import SubmitButton from './submit-button';
import Select from './select';
import DeleteButton from './delete-button';
import { ConfirmationModal, currentAccountState } from '@/presentation/components';

const CommandsIcon = chakra(HiCommandLine);
const DescriptionIcon = chakra(HiInformationCircle);
const ResponseIcon = chakra(HiEnvelopeOpen);
const CheckIcon = chakra(FiCheck);

export type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  onDelete: () => Promise<void>;
};

const CommandModal = ({ isOpen, onClose, onSubmit, onDelete }: Props): JSX.Element => {
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
          <form style={{ width: '100%' }} data-testid="form" onSubmit={onSubmit}>
            <ModalHeader>Command</ModalHeader>
            <ModalCloseButton data-testid="close-modal" />
            <ModalBody>
              <Stack spacing={4}>
                <Input type="text" name="command" placeholder="Command" icon={<CommandsIcon />} />
                <Input type="text" name="description" placeholder="Description" icon={<DescriptionIcon />} />
                <Input type="text" name="response" placeholder="Response" icon={<ResponseIcon />} />
                <Select name="type" placeholder="Type" options={state.types} />
                <Select name="dispatcher" placeholder="Dispatcher" options={state.dispatchers} />
              </Stack>
            </ModalBody>

            {getCurrentAccount().user.role === 'admin' && (
              <ModalFooter display="flex" flexDir="column" gap={2}>
                <SubmitButton text="Save" icon={<CheckIcon />} />
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
