import { CommandModel } from '@/domain/models';
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
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
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

const schema = yupResolver(
  yup
    .object()
    .shape({
      command: yup.string().required('Required field'),
      description: yup.string().required('Required field'),
      dispatcher: yup.string().required('Required field'),
      type: yup.string().required('Required field'),
      response: yup.string()
    })
    .required()
);

export type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
};

const CommandModal = ({ isOpen, onClose, onSubmit }: Props): JSX.Element => {
  const [state, setState] = useRecoilState(commandsState);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm<CommandModel>({
    defaultValues: state.selectedCommand,
    resolver: schema
  });

  useEffect(() => {
    const { command, description, response, type, dispatcher } = state.selectedCommand;
    setValue('command', command);
    setValue('description', description);
    setValue('response', response);
    setValue('type', type);
    setValue('dispatcher', dispatcher);

    if (type === 'action') {
      setState(prev => ({ ...prev, disabledForm: true }));
    } else {
      setState(prev => ({ ...prev, disabledForm: false }));
    }
  }, [state.selectedCommand]);

  const handleClose = (): void => {
    setState(prev => ({
      ...prev,
      selectedCommand: { id: '', command: '', description: '', type: '', dispatcher: '', response: '' }
    }));
    onClose();
    reset();
  };

  useEffect(() => {
    setState(prev => ({
      ...prev,
      register,
      errors
    }));
  }, [register, errors, state.selectedCommand]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <form style={{ width: '100%' }} data-testid="form" onSubmit={handleSubmit(onSubmit)}>
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
