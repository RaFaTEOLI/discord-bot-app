/* eslint-disable @typescript-eslint/no-explicit-any */
import { DetailedHTMLProps, InputHTMLAttributes, useEffect, useState } from 'react';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input as ChakraInput,
  InputGroup,
  InputLeftElement
} from '@chakra-ui/react';

export type Props = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  state: any;
  name: string;
  placeholder?: string;
  icon?: JSX.Element | undefined;
  size?: string | undefined;
  isDisabled?: boolean | undefined;
};

const Input = ({ icon, name, state, ...props }: Props): JSX.Element => {
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
        {icon && <InputLeftElement>{icon}</InputLeftElement>}

        <ChakraInput
          variant="outline"
          {...register(name)}
          {...props}
          size={props.size ?? 'md'}
          title={error}
          placeholder={props.placeholder}
          data-testid={name}
          readOnly
          onFocus={e => {
            e.target.readOnly = false;
          }}
        />
      </InputGroup>

      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};

export default Input;
