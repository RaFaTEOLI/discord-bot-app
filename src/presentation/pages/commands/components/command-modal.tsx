import {
  chakra,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack
} from '@chakra-ui/react';
import { FiCheck } from 'react-icons/fi';
import { HiCommandLine, HiEnvelopeOpen, HiInformationCircle } from 'react-icons/hi2';
import { useRecoilState } from 'recoil';
import { commandsState } from './atoms';
import Input from './input';
import SubmitButton from './submit-button';
import Select from './select';

const CommandsIcon = chakra(HiCommandLine);
const DescriptionIcon = chakra(HiInformationCircle);
const ResponseIcon = chakra(HiEnvelopeOpen);
const CheckIcon = chakra(FiCheck);

export type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
};

const CommandModal = ({ isOpen, onClose, onSubmit }: Props): JSX.Element => {
  const [state] = useRecoilState(commandsState);

  return (
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

          <ModalFooter>
            <SubmitButton text="Save" icon={<CheckIcon />} />
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default CommandModal;
