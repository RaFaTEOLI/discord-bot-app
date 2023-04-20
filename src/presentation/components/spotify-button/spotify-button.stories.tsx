import { Meta, StoryObj } from '@storybook/react';
import SpotifyButton, { Props } from './spotify-button';
import Wrapper from '../story-wrapper/chakra-story-wrapper';

export default {
  title: 'Presentation/Components/SpotifyButton',
  component: SpotifyButton,
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

export const Loading: StoryObj<Props> = {
  args: {
    text: 'Some Text',
    isLoading: true
  }
};
