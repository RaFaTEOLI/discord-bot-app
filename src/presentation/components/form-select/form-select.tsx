/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Badge,
  chakra,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  SelectProps,
  Select as TestSelect
} from '@chakra-ui/react';
import { Select as ChakraSelect } from 'chakra-react-select';
import { ComponentProps, forwardRef, useMemo } from 'react';
import { FieldErrors } from 'react-hook-form';
import { HiInformationCircle } from 'react-icons/hi2';

export type Option = {
  label: string;
  value: string | number;
  description?: string;
};

export type Props = {
  name: string;
  placeholder?: string;
  options: Option[];
  errors?: FieldErrors;
} & SelectProps &
  ComponentProps<'select'> & {
    value?: any;
  };

const CHiInformationCircle = chakra(HiInformationCircle);

const FormSelect = forwardRef<HTMLSelectElement, Props>(
  ({ errors, name, placeholder, options, variant, size, ...props }, ref) => {
    const description = useMemo(() => {
      // eslint-disable-next-line eqeqeq
      const option = options.find(option => option.value == props.value?.value);
      return option?.description;
    }, [options, name, props.value]);

    return (
      <FormControl
        mb={2}
        data-testid={`${name}-wrap`}
        data-status={errors?.[name] ? 'invalid' : 'valid'}
        isInvalid={!!errors?.[name]}
      >
        <Flex alignItems="center">
          {placeholder && (
            <FormLabel title={(errors?.[name]?.message as string) || ''} data-testid={`${name}-label`}>
              {placeholder}
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

        {process.env.NODE_ENV === 'test' ? (
          <TestSelect
            variant="outline"
            title={errors?.[name]?.message as string}
            placeholder={placeholder}
            ref={ref}
            data-testid={name}
            {...props}
            onChange={(option: any) => props.onChange?.(option.target.value)}
            value={props.value?.value}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TestSelect>
        ) : (
          <ChakraSelect
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            variant={variant ?? 'outline'}
            placeholder={placeholder}
            size={(size ?? 'md') as 'sm' | 'md' | 'lg'}
            options={options as any}
            ref={ref as any}
            onChange={(val: any) => props.onChange?.(val.value)}
            {...props}
          />
        )}

        <FormErrorMessage>{errors?.[name]?.message as string}</FormErrorMessage>
      </FormControl>
    );
  }
);
FormSelect.displayName = 'FormSelect';
export default FormSelect;
