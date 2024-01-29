import { Meta, StoryObj } from '@storybook/react';
import DiscordStatusBadge, { Props } from './discord-status-badge';
import Wrapper from '../story-wrapper/chakra-story-wrapper';
import { CommandDiscordStatus } from '@/domain/models';

export default {
  title: 'Presentation/Components/DiscordStatusBadge',
  component: DiscordStatusBadge,
  decorators: [
    Story => {
      return <Wrapper>{Story()}</Wrapper>;
    }
  ]
} as Meta<Props>;

export const Default: StoryObj<Props> = {
  args: {
    value: undefined
  }
};

export const Sent: StoryObj<Props> = {
  args: {
    value: CommandDiscordStatus.SENT
  }
};

export const Received: StoryObj<Props> = {
  args: {
    value: CommandDiscordStatus.RECEIVED
  }
};

export const Failed: StoryObj<Props> = {
  args: {
    value: CommandDiscordStatus.FAILED
  }
};
