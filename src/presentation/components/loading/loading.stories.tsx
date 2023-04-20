import { Meta, StoryObj } from '@storybook/react';
import Loading from './loading';
import Wrapper from '../story-wrapper/chakra-story-wrapper';

export default {
  title: 'Presentation/Components/Loading',
  component: Loading,
  decorators: [
    Story => {
      return <Wrapper>{Story()}</Wrapper>;
    }
  ]
} as Meta;

export const Default: StoryObj = {};
