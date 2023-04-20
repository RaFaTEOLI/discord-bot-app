import { Meta, StoryObj } from '@storybook/react';
import Spinner from './spinner';
import Wrapper from '../story-wrapper/chakra-story-wrapper';

export default {
  title: 'Presentation/Components/Spinner',
  component: Spinner,
  decorators: [
    Story => {
      return <Wrapper>{Story()}</Wrapper>;
    }
  ]
} as Meta;

export const Default: StoryObj = {};
