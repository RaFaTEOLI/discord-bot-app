import { Meta, StoryObj } from '@storybook/react';
import FormInput, { Props } from './form-input';
import Wrapper from '../story-wrapper/chakra-story-wrapper';
import { FiTag } from 'react-icons/fi';

export default {
  title: 'Presentation/Components/FormInput',
  component: FormInput,
  decorators: [
    Story => {
      return <Wrapper>{Story()}</Wrapper>;
    }
  ]
} as Meta<Props>;

export const Default: StoryObj<Props> = {
  args: {
    name: 'Example',
    placeholder: 'Example'
  }
};

export const WithIcon: StoryObj<Props> = {
  args: {
    name: 'Example',
    placeholder: 'Example',
    icon: <FiTag />
  }
};

export const Error: StoryObj<Props> = {
  args: {
    name: 'Example',
    placeholder: 'Example',
    errors: {
      Example: {
        message: 'Example is required'
      } as any
    }
  }
};
