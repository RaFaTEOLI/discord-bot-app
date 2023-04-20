import { Meta, StoryObj } from '@storybook/react';
import Input, { Props } from './input';
import Wrapper from '../story-wrapper/chakra-story-wrapper';
import { FiTag } from 'react-icons/fi';

export default {
  title: 'Presentation/Components/Input',
  component: Input,
  decorators: [
    Story => {
      return <Wrapper>{Story()}</Wrapper>;
    }
  ]
} as Meta<Props>;

export const Default: StoryObj<Props> = {
  args: {
    name: 'Example',
    placeholder: 'Example',
    state: { register: () => {}, errors: { Example: { message: '' } } }
  }
};

export const WithIcon: StoryObj<Props> = {
  args: {
    name: 'Example',
    placeholder: 'Example',
    state: { register: () => {}, errors: { Example: { message: '' } } },
    icon: <FiTag />
  }
};

export const Error: StoryObj<Props> = {
  args: {
    name: 'Example',
    placeholder: 'Example',
    state: { register: () => {}, errors: { Example: { message: 'Required field' } } }
  }
};
