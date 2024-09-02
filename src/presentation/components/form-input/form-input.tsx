/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentProps, forwardRef } from 'react';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input as ChakraInput,
  InputGroup,
  InputLeftElement,
  Skeleton,
  InputProps
} from '@chakra-ui/react';
import { FieldErrors } from 'react-hook-form';

export type Props = {
  icon?: JSX.Element | undefined;
  size?: string | undefined;
  errors?: FieldErrors;
  name: string;
  loading?: boolean;
} & InputProps &
  ComponentProps<'input'>;

const FormInput = forwardRef<HTMLInputElement, Props>(({ icon, size, errors, name, loading, ...props }, ref) => {
  return (
    <FormControl
      mb={2}
      data-testid={`${name}-wrap`}
      data-status={errors?.[name] ? 'invalid' : 'valid'}
      isInvalid={!!errors?.[name]}
    >
      {props.placeholder && (
        <FormLabel title={(errors?.[name]?.message as string) || ''} data-testid={`${name}-label`}>
          {props.placeholder}
        </FormLabel>
      )}
      <Skeleton width="100%" isLoaded={!loading} pointerEvents="auto">
        <InputGroup>
          {icon && <InputLeftElement>{icon}</InputLeftElement>}

          <ChakraInput
            ref={ref}
            variant="outline"
            name={name}
            size={size ?? 'md'}
            title={errors?.[name]?.message as string}
            placeholder={props.placeholder}
            data-testid={name}
            readOnly
            onFocus={e => {
              e.target.readOnly = false;
            }}
            {...props}
          />
        </InputGroup>
      </Skeleton>

      <FormErrorMessage>{errors?.[name]?.message as string}</FormErrorMessage>
    </FormControl>
  );
});
FormInput.displayName = 'FormInput';
export default FormInput;
