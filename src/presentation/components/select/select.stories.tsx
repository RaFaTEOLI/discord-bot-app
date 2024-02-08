import { Meta, StoryObj } from '@storybook/react';
import Select, { Props } from './select';
import Wrapper from '../story-wrapper/chakra-story-wrapper';

export default {
  title: 'Presentation/Components/Select',
  component: Select,
  decorators: [
    Story => {
      return <Wrapper>{Story()}</Wrapper>;
    }
  ]
} as Meta<Props>;

export const Default: StoryObj<Props> = {
  args: {
    name: 'Example',
    placeholder: 'Choose an item',
    state: { register: () => {}, errors: { Example: { message: '' } } },
    options: [
      { label: 'Item 1', value: '1' },
      { label: 'Item 2', value: '2' }
    ]
  }
};

export const Error: StoryObj<Props> = {
  args: {
    name: 'Example',
    placeholder: 'Choose an item',
    state: {
      register: () => {},
      errors: { Example: { message: 'Required field' } }
    },
    options: [
      { label: 'Item 1', value: '1' },
      { label: 'Item 2', value: '2' }
    ]
  }
};

export const Description: StoryObj<Props> = {
  args: {
    name: 'Example',
    placeholder: 'Choose an item',
    state: { register: () => {}, errors: { Example: { message: '' } }, Example: '1' },
    options: [
      { label: 'Item 1', value: '1', description: 'Description 1' },
      { label: 'Item 2', value: '2', description: 'Description 2' }
    ]
  }
};
