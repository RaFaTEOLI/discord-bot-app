/* eslint-disable @typescript-eslint/no-explicit-any */
import { DetailedHTMLProps, InputHTMLAttributes } from 'react';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input as ChakraInput,
  InputGroup,
  InputLeftElement
} from '@chakra-ui/react';

type Props = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  state: any;
  setState: any;
  name?: string;
  placeholder?: string;
  icon?: JSX.Element | undefined;
  size?: string | undefined;
};

const Input = ({ icon, state, setState, ...props }: Props) => {
  const error = state[`${props.name}Error`];
  return (
    <FormControl mb={2} data-testid={`${props.name}-wrap`} data-status={error ? 'invalid' : 'valid'} isInvalid={error}>
      {props.placeholder && (
        <FormLabel title={error} data-testid={`${props.name}-label`}>
          {props.placeholder}
        </FormLabel>
      )}
      <InputGroup>
        {icon && <InputLeftElement children={icon} />}

        <ChakraInput
          variant="outline"
          {...props}
          size={props.size ?? 'md'}
          title={error}
          placeholder={props.placeholder}
          data-testid={props.name}
          readOnly
          onFocus={e => {
            e.target.readOnly = false;
          }}
          onChange={e => {
            setState({ ...state, [e.target.name]: e.target.value });
          }}
        />
      </InputGroup>

      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};

export default Input;
