import { Divider, Flex, HStack, Heading, Stack, chakra } from '@chakra-ui/react';
import { FieldErrors, useFieldArray } from 'react-hook-form';
import { HiBars2, HiOutlineReceiptRefund } from 'react-icons/hi2';
import IconButton from '@/presentation/components/layout/components/icon-button';
import { FiArrowDown, FiArrowUp, FiPlus, FiTrash } from 'react-icons/fi';
import { Input } from '@/presentation/components';

type Props = {
  nestIndex: number;
  control: any;
  optionInputColor: string;
  register: any;
  errors: FieldErrors;
};

const NameIcon = chakra(HiBars2);
const ValueIcon = chakra(HiOutlineReceiptRefund);

const Choices = ({ nestIndex, control, register, errors, optionInputColor }: Props): JSX.Element => {
  const { fields, remove, move, append } = useFieldArray({
    control,
    name: `options[${nestIndex}].choices`
  });

  return (
    <>
      <Flex justifyContent="space-between">
        <Heading size="sm">Choices</Heading>
        <IconButton
          data-testid={`${nestIndex}-choice-add`}
          variant="solid"
          colorScheme="blue"
          aria-label="Add Choice"
          onClick={() => append({ name: '', value: '' })}
        >
          <FiPlus />
        </IconButton>
      </Flex>
      <Divider />

      <Stack gap={2} data-testid={`${nestIndex}-choices-list`}>
        {fields.map((field, index) => (
          <Stack key={field.id} p={2} borderRadius={5} position="relative">
            <Flex gap={5}>
              <Input
                bgColor={optionInputColor}
                type="text"
                placeholder="Name"
                icon={<NameIcon />}
                errors={errors}
                {...register(`options[${nestIndex}].choices.${index}.name`)}
              />
              <Input
                bgColor={optionInputColor}
                type="text"
                placeholder="Value"
                icon={<ValueIcon />}
                errors={errors}
                {...register(`options[${nestIndex}].choices.${index}.value`)}
              />
            </Flex>

            <HStack position="absolute" right={3} top={0}>
              {index > 0 && (
                <IconButton
                  data-testid={`${nestIndex}-choice-${index}-move-up`}
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
                  data-testid={`${nestIndex}-choice-${index}-move-down`}
                  variant="solid"
                  colorScheme="yellow"
                  aria-label="Move Down"
                  onClick={() => move(index, index + 1)}
                >
                  <FiArrowDown />
                </IconButton>
              )}

              <IconButton
                data-testid={`${nestIndex}-choice-${index}-remove`}
                variant="solid"
                colorScheme="red"
                aria-label="Add Option"
                onClick={() => remove(index)}
              >
                <FiTrash />
              </IconButton>
            </HStack>
          </Stack>
        ))}
      </Stack>
    </>
  );
};

export default Choices;
