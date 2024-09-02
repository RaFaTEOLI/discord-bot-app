import { Meta, StoryObj } from '@storybook/react';
import FormSelect, { Props } from './form-select';
import Wrapper from '../story-wrapper/chakra-story-wrapper';

export default {
  title: 'Presentation/Components/FormSelect',
  component: FormSelect,
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
    options: [
      { label: 'Item 1', value: '1' },
      { label: 'Item 2', value: '2' }
    ]
  }
};
