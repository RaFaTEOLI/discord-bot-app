import { Content } from '@/presentation/components';
import { Checkbox, Flex, Heading, Stack, chakra, useColorModeValue } from '@chakra-ui/react';
import Input from '../components/input';
import Select from '../components/select';
import { HiCommandLine, HiEnvelopeOpen, HiInformationCircle } from 'react-icons/hi2';
import { useRecoilState } from 'recoil';
import { commandState } from './atom';
import { useFieldArray, useForm } from 'react-hook-form';
import IconButton from '@/presentation/components/layout/components/icon-button';
import { FiPlus, FiTrash } from 'react-icons/fi';

const CommandsIcon = chakra(HiCommandLine);
const DescriptionIcon = chakra(HiInformationCircle);
const ResponseIcon = chakra(HiEnvelopeOpen);

export default function Command(): JSX.Element {
  const optionColor = useColorModeValue('gray.100', 'gray.900');
  const [state] = useRecoilState(commandState);
  const { control, register, getValues } = useForm();
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'options' // unique name for your Field Array
  });

  console.log(getValues());

  return (
    <Content title="Command">
      <Stack spacing={4} paddingRight={5}>
        <Flex gap={2}>
          <Input type="text" name="command" placeholder="Command" icon={<CommandsIcon />} />
          <Input type="text" name="description" placeholder="Description" icon={<DescriptionIcon />} />
        </Flex>
        <Input type="text" name="response" placeholder="Response" icon={<ResponseIcon />} />
        <Flex gap={2}>
          <Select name="type" placeholder="Type" options={state.types} />
          <Select name="dispatcher" placeholder="Dispatcher" options={state.dispatchers} />
        </Flex>
        <Heading size="md">Discord Properties</Heading>
        <Select name="discordType" placeholder="Type" options={state.discordTypes} />
        <Flex justifyContent="space-between">
          <Heading size="sm">Options</Heading>
          <IconButton
            variant="solid"
            colorScheme="blue"
            aria-label="Add Option"
            onClick={() => append({ name: '', type: '' })}
          >
            <FiPlus />
          </IconButton>
        </Flex>
        {fields.map((field, index) => (
          <Stack key={field.id} bgColor={optionColor} p={5} borderRadius={5} position="relative">
            <Flex gap={5}>
              <Input type="text" name={`options.${index}.name`} placeholder="Name" icon={<CommandsIcon />} />
              <Select name={`options.${index}.type`} placeholder="Type" options={state.discordTypes} />
              <IconButton
                variant="solid"
                colorScheme="red"
                aria-label="Add Option"
                onClick={() => remove(index)}
                position="absolute"
                right={4}
                top={3}
              >
                <FiTrash />
              </IconButton>
            </Flex>
            <Flex gap={5}>
              <Checkbox>Required</Checkbox>
              <Input type="text" name="description" placeholder="Description" icon={<DescriptionIcon />} />
            </Flex>
          </Stack>
        ))}
      </Stack>
    </Content>
  );
}
