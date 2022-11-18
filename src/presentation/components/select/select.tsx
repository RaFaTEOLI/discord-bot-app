/* eslint-disable @typescript-eslint/no-explicit-any */
import { DetailedHTMLProps, InputHTMLAttributes, useEffect, useState } from 'react';
import { FormControl, FormErrorMessage, FormLabel, Select as ChakraSelect, InputGroup } from '@chakra-ui/react';

export type Options = {
  label: string;
  value: string;
};

type Props = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  state: any;
  setState: any;
  name: string;
  placeholder?: string;
  size?: string | undefined;
  options: Options[];
};

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

  return (
    <FormControl mb={2} data-testid={`${name}-wrap`} data-status={error ? 'invalid' : 'valid'} isInvalid={!!error}>
      {props.placeholder && (
        <FormLabel title={error} data-testid={`${name}-label`}>
          {props.placeholder}
        </FormLabel>
      )}
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
