import { Meta, StoryObj } from '@storybook/react';
import ConfirmationModal, { IProps } from './confirmation-modal';
import Wrapper from '../story-wrapper/chakra-story-wrapper';

export default {
  title: 'Presentation/Components/Confirmation Modal',
  component: ConfirmationModal,
  args: {
    confirm: () => null,
    isOpen: true,
    loading: false,
    onClose: () => null,
    description: "Once it's done it can't be undone!"
  },
  decorators: [
    Story => {
      return <Wrapper>{Story()}</Wrapper>;
    }
  ]
} as Meta<IProps>;

export const Default: StoryObj<IProps> = {};
