import { Meta, StoryObj } from '@storybook/react';
import Content, { Props } from './content';
import Wrapper from '../story-wrapper/chakra-story-wrapper';

export default {
  title: 'Presentation/Components/Content',
  component: Content,
  args: {
    title: 'Some title',
    children: <p>Some children</p>
  },
  decorators: [
    Story => {
      return <Wrapper>{Story()}</Wrapper>;
    }
  ]
} as Meta<Props>;

export const Default: StoryObj<Props> = {};
