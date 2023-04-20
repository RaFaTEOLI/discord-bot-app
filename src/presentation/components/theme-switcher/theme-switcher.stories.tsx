import { Meta, StoryObj } from '@storybook/react';
import ThemeSwitcher from './theme-switcher';
import Wrapper from '../story-wrapper/chakra-story-wrapper';

export default {
  title: 'Presentation/Components/ThemeSwitcher',
  component: ThemeSwitcher,
  decorators: [
    Story => {
      return <Wrapper>{Story()}</Wrapper>;
    }
  ]
} as Meta;

export const Default: StoryObj = {};
