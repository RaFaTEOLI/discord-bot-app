import { Meta, StoryObj } from '@storybook/react';
import FormStatus from './form-status';
import Wrapper from '../story-wrapper/chakra-story-wrapper';

export default {
  title: 'Presentation/Components/FormStatus',
  component: FormStatus,
  args: {
    state: { mainError: 'Something went wrong' }
  },
  decorators: [
    Story => {
      return <Wrapper>{Story()}</Wrapper>;
    }
  ]
} as Meta;

export const Default: StoryObj = {};
