/* eslint-disable @typescript-eslint/no-explicit-any */
import { DetailedHTMLProps, InputHTMLAttributes, useEffect, useMemo, useState } from 'react';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Select as ChakraSelect,
  InputGroup,
  Flex,
  chakra,
  Badge
} from '@chakra-ui/react';
import { HiInformationCircle } from 'react-icons/hi2';

export type Options = {
  label: string;
  value: string;
  description?: string;
};

export type Props = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  state: any;
  setState: any;
  name: string;
  placeholder?: string;
  size?: string | undefined;
  options: Options[];
};

const CHiInformationCircle = chakra(HiInformationCircle);

const Select = ({ name, state, options, setState, ...props }: Props): JSX.Element => {
  const register = state.register ? state.register : () => {};
  const [error, setError] = useState('');

  useEffect(() => {
    if (state.errors) {
      if (name in state.errors) {
        setError(state.errors[name].message);
      }
    }
  }, [state.errors]);

  const description = useMemo(() => {
    // eslint-disable-next-line eqeqeq
    const option = options.find(option => option.value == state[name]);
    return option?.description;
  }, [state]);

  return (
    <FormControl mb={2} data-testid={`${name}-wrap`} data-status={error ? 'invalid' : 'valid'} isInvalid={!!error}>
      <Flex alignItems="center">
        {props.placeholder && (
          <FormLabel alignItems="center" title={error} data-testid={`${name}-label`}>
            {props.placeholder}
          </FormLabel>
        )}
        {description && (
          <Badge mb={2} {...props} data-testid={`${name}-description`} p={1} borderRadius={5}>
            <Flex alignItems="center" gap={2}>
              <CHiInformationCircle />
              {description}
            </Flex>
          </Badge>
        )}
      </Flex>
      <InputGroup>
        <ChakraSelect
          variant="outline"
          {...register(name)}
          {...props}
          size={props.size ?? 'md'}
          title={error}
          placeholder={props.placeholder}
          data-testid={name}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </ChakraSelect>
      </InputGroup>

      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};

export default Select;
