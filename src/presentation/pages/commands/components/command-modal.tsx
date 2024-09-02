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
import Button from './button';
import DeleteButton from './delete-button';
import { ConfirmationModal, currentAccountState, Input, Select } from '@/presentation/components';
import { useNavigate } from 'react-router';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { CommandModel } from '@/domain/models';

const CommandsIcon = chakra(HiCommandLine);
const DescriptionIcon = chakra(HiInformationCircle);
const ResponseIcon = chakra(HiEnvelopeOpen);
const EditIcon = chakra(FiEdit);

export type Props = {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => Promise<void>;
  errors: FieldErrors;
  control: Control<CommandModel>;
  register: any;
};

const CommandModal = ({ isOpen, onClose, onDelete, errors, control, register }: Props): JSX.Element => {
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
                <Input
                  isDisabled
                  type="text"
                  placeholder="Command"
                  icon={<CommandsIcon />}
                  errors={errors}
                  {...register('command')}
                />

                <Input
                  isDisabled
                  type="text"
                  placeholder="Description"
                  icon={<DescriptionIcon />}
                  errors={errors}
                  {...register('description')}
                />

                <Input
                  isDisabled
                  type="text"
                  placeholder="Response"
                  icon={<ResponseIcon />}
                  errors={errors}
                  {...register('response')}
                />

                <Controller
                  control={control}
                  name="type"
                  render={({ field: { onChange, value, name } }) => (
                    <Select
                      isDisabled
                      name={name}
                      onChange={onChange}
                      value={state.types.find(item => item.value === value)}
                      options={state.types}
                      placeholder="Type"
                      errors={errors}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="dispatcher"
                  render={({ field: { onChange, value, name } }) => (
                    <Select
                      isDisabled
                      name={name}
                      onChange={onChange}
                      value={state.dispatchers.find(item => item.value === value)}
                      options={state.dispatchers}
                      placeholder="Dispatcher"
                      errors={errors}
                    />
                  )}
                />
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
