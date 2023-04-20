import { Meta, StoryObj } from '@storybook/react';
import Error, { Props } from './error';
import Wrapper from '../story-wrapper/chakra-story-wrapper';

export default {
  title: 'Presentation/Components/Error',
  args: {
    error: 'Something went wrong!',
    reload: () => {}
  },
  component: Error,
  decorators: [
    Story => {
      return <Wrapper>{Story()}</Wrapper>;
    }
  ]
} as Meta<Props>;

export const Default: StoryObj<Props> = {};
