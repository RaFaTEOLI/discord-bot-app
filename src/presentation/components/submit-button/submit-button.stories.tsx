import { Meta, StoryObj } from '@storybook/react';
import SubmitButton, { Props } from './submit-button';
import Wrapper from '../story-wrapper/chakra-story-wrapper';
import { FiTag } from 'react-icons/fi';

export default {
  title: 'Presentation/Components/SubmitButton',
  component: SubmitButton,
  decorators: [
    Story => {
      return <Wrapper>{Story()}</Wrapper>;
    }
  ]
} as Meta<Props>;

export const Default: StoryObj<Props> = {
  args: {
    text: 'Some Text'
  }
};

export const WithIcon: StoryObj<Props> = {
  args: {
    text: 'Some Text',
    icon: <FiTag />
  }
};

export const Disabled: StoryObj<Props> = {
  args: {
    text: 'Some Text',
    isDisabled: true
  }
};

export const Loading: StoryObj<Props> = {
  args: {
    text: 'Some Text',
    isLoading: true
  }
};
