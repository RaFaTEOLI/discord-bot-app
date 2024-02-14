import { Content, DiscordStatusBadge, Loading } from '@/presentation/components';
import { Checkbox, Flex, HStack, Heading, Stack, chakra, useColorModeValue, useToast, Divider } from '@chakra-ui/react';
import { Choices, Input, Select, commandState, SubmitButton } from './components';
import { HiCommandLine, HiEnvelopeOpen, HiInformationCircle } from 'react-icons/hi2';
import { useRecoilState } from 'recoil';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import IconButton from '@/presentation/components/layout/components/icon-button';
import { FiArrowDown, FiArrowUp, FiCheck, FiPlus, FiTrash } from 'react-icons/fi';
import { useEffect } from 'react';
import { LoadCommandById, SaveCommand } from '@/domain/usecases';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { CommandModel, CommandOptionType } from '@/domain/models';
import { useErrorHandler } from '@/presentation/hooks';
import { AccessTokenExpiredError, AccessDeniedError, CommandAlreadyCreatedError } from '@/domain/errors';
import { useNavigate } from 'react-router';
import { Socket } from 'socket.io-client';

const CommandsIcon = chakra(HiCommandLine);
const DescriptionIcon = chakra(HiInformationCircle);
const ResponseIcon = chakra(HiEnvelopeOpen);
const CheckIcon = chakra(FiCheck);

type Props = {
  commandId: string;
  loadCommandById: LoadCommandById;
  saveCommand: SaveCommand;
  socketClient: Socket;
};

const schema = yupResolver(
  yup
    .object()
    .shape({
      command: yup.string().min(2).max(25).required('Required field'),
      description: yup.string().min(2).max(50).required('Required field'),
      dispatcher: yup.string().required('Required field'),
      type: yup.string().required('Required field'),
      response: yup.string().max(255).nullable(),
      discordType: yup.number().required('Required field'),
      options: yup.array().of(
        yup.object({
          name: yup.string().min(2).max(25).required('Required field'),
          description: yup.string().min(2).max(50).required('Required field'),
          type: yup.number().required('Required field'),
          required: yup.boolean(),
          choices: yup.array().of(
            yup.object({
              name: yup.string().required('Required field'),
              value: yup.string().required('Required field')
            })
          )
        })
      )
    })
    .required()
);

export default function Command({ commandId, loadCommandById, saveCommand, socketClient }: Props): JSX.Element {
  const navigate = useNavigate();
  const optionColor = useColorModeValue('gray.100', 'gray.900');
  const optionInputColor = useColorModeValue('white', 'gray.800');
  const [state, setState] = useRecoilState(commandState);
  const {
    control,
    register,
    reset,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<CommandModel>({ resolver: schema, defaultValues: state.command });
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'options'
  });

  const watchDiscordType = watch('discordType');

  // eslint-disable-next-line n/handle-callback-err
  const handleError = useErrorHandler((error: Error) => {});

  const toast = useToast();

  useEffect(() => {
    setState(prev => ({
      ...prev,
      register,
      errors
    }));
  }, [register, errors, state.command]);

  const setCommand = (command: LoadCommandById.Model): void => {
    setState(prev => ({ ...prev, command }));
    reset(command);
  };

  useEffect(() => {
    (async () => {
      try {
        if (commandId !== 'new') {
          const command = await loadCommandById.loadById(commandId);
          setCommand(command);
        } else {
          reset({
            id: null,
            command: null,
            description: null,
            type: null,
            dispatcher: null,
            response: null,
            discordType: null
          } as any);
        }
      } catch (error: any) {
        if (error instanceof AccessTokenExpiredError || error instanceof AccessDeniedError) {
          toast({
            title: 'Access Denied',
            description: 'Your login has expired, please log in again!',
            status: 'error',
            duration: 9000,
            isClosable: true
          });
        } else {
          toast({
            title: 'Server Error',
            description: 'There was an error while trying to load your command',
            status: 'error',
            duration: 9000,
            isClosable: true,
            position: 'top'
          });
        }
        handleError(error);
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    })();
  }, [commandId, state.reload]);

  const onSubmit = handleSubmit(async data => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const { id, ...dataValues } = data;
      const params = state.command.id ? Object.assign({}, dataValues, { id: state.command.id }) : dataValues;
      await saveCommand.save(params);
      toast({
        title: 'Saved Command',
        description: 'Your command was successfully saved',
        status: 'success',
        duration: 9000,
        isClosable: true,
        position: 'top'
      });
      if (!state.command.id) {
        reset();
        navigate('/commands');
      }
      setState(prev => ({ ...prev, reload: new Date() }));
    } catch (error: any) {
      if (error instanceof AccessTokenExpiredError || error instanceof AccessDeniedError) {
        toast({
          title: 'Access Denied',
          description: 'Your login has expired, please log in again!',
          status: 'error',
          duration: 9000,
          isClosable: true
        });
      } else if (error instanceof CommandAlreadyCreatedError) {
        toast({
          title: 'Ops!',
          description: 'There is already a command created with this name!',
          status: 'warning',
          duration: 9000,
          isClosable: true
        });
      } else {
        toast({
          title: 'Server Error',
          description: 'There was an error while trying to save your command',
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: 'top'
        });
      }
      handleError(error);
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  });

  useEffect(() => {
    function onCommandChange(value: any): void {
      if (value.id === commandId) {
        setState(prev => ({ ...prev, reload: new Date() }));
      }
    }

    socketClient.on('command', onCommandChange);

    return () => {
      socketClient.off('command', onCommandChange);
    };
  }, [commandId]);

  useEffect(() => {
    setState(prev => ({ ...prev, discordType: watchDiscordType }));
  }, [watchDiscordType]);

  return (
    <Content title="Command">
      {state.isLoading ? (
        <Flex alignItems="center" justifyContent="center">
          <Loading />
        </Flex>
      ) : (
        <form data-testid="form" onSubmit={onSubmit}>
          <Stack spacing={4} paddingRight={5} data-testid="command-content">
            <Flex gap={2}>
              <Input
                isDisabled={state.command.type === 'action'}
                type="text"
                name="command"
                placeholder="Command"
                icon={<CommandsIcon />}
              />
              <Input
                isDisabled={state.command.type === 'action'}
                type="text"
                name="description"
                placeholder="Description"
                icon={<DescriptionIcon />}
              />
            </Flex>
            <Input
              isDisabled={state.command.type === 'action'}
              type="text"
              name="response"
              placeholder="Response"
              icon={<ResponseIcon />}
            />
            <Flex gap={2}>
              <Select isDisabled={state.command.type === 'action'} name="type" placeholder="Type" options={state.types} />
              <Select
                isDisabled={state.command.type === 'action'}
                name="dispatcher"
                placeholder="Dispatcher"
                options={state.dispatchers}
              />
            </Flex>
            <Flex justifyContent="space-between">
              <Heading size="md">Discord Properties</Heading>
              <DiscordStatusBadge value={state.command.discordStatus} />
            </Flex>
            <Select name="discordType" placeholder="Type" options={state.applicationCommandTypes} />
            <Flex justifyContent="space-between">
              <Heading size="sm">Options</Heading>
              <IconButton
                data-testid="add-option"
                variant="solid"
                colorScheme="blue"
                aria-label="Add Option"
                onClick={() => append({ name: '', type: CommandOptionType.SUB_COMMAND, description: '', required: false })}
              >
                <FiPlus />
              </IconButton>
            </Flex>

            <Stack gap={2} data-testid="options-list">
              {fields.map((field, index) => (
                <Stack key={field.id} bgColor={optionColor} p={5} borderRadius={5} position="relative">
                  <Flex gap={5}>
                    <Input
                      bgColor={optionInputColor}
                      type="text"
                      name={`options.${index}.name`}
                      placeholder="Name"
                      icon={<CommandsIcon />}
                    />
                    <Select
                      bgColor={optionInputColor}
                      name={`options.${index}.type`}
                      placeholder="Type"
                      options={state.commandOptionTypes}
                    />
                    <HStack position="absolute" right={4} top={3}>
                      {index > 0 && (
                        <IconButton
                          data-testid={`${index}-option-move-up`}
                          variant="solid"
                          colorScheme="yellow"
                          aria-label="Move Up"
                          onClick={() => move(index, index - 1)}
                        >
                          <FiArrowUp />
                        </IconButton>
                      )}

                      {index + 1 < fields.length && (
                        <IconButton
                          data-testid={`${index}-option-move-down`}
                          variant="solid"
                          colorScheme="yellow"
                          aria-label="Move Down"
                          onClick={() => move(index, index + 1)}
                        >
                          <FiArrowDown />
                        </IconButton>
                      )}

                      <IconButton
                        data-testid={`${index}-option-remove`}
                        variant="solid"
                        colorScheme="red"
                        aria-label="Remove Option"
                        onClick={() => remove(index)}
                      >
                        <FiTrash />
                      </IconButton>
                    </HStack>
                  </Flex>
                  <Flex gap={5} justifyContent="space-between">
                    <Input
                      bgColor={optionInputColor}
                      type="text"
                      name={`options.${index}.description`}
                      placeholder="Description"
                      icon={<DescriptionIcon />}
                    />
                    <Controller
                      name={`options.${index}.required`}
                      control={control}
                      render={({ field }) => (
                        <Checkbox isChecked={field.value} onChange={field.onChange}>
                          Required
                        </Checkbox>
                      )}
                    />
                  </Flex>
                  <Choices optionInputColor={optionInputColor} control={control} nestIndex={index} />
                </Stack>
              ))}
            </Stack>

            <Divider />
            <Flex>
              <SubmitButton text="Save" icon={<CheckIcon />} />
            </Flex>
          </Stack>
        </form>
      )}
    </Content>
  );
}
