import { Meta, StoryObj } from '@storybook/react';
import Logo from './logo';
import Wrapper from '../story-wrapper/chakra-story-wrapper';

export default {
  title: 'Presentation/Components/Logo',
  component: Logo,
  decorators: [
    Story => {
      return <Wrapper>{Story()}</Wrapper>;
    }
  ]
} as Meta;

export const Default: StoryObj = {};
