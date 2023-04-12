import type { StorybookConfig } from '@storybook/react-vite'; // your framework

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  framework: '@storybook/react-vite',
  async viteFinal(config, options) {
    // Add your configuration here
    return config;
  }
};

export default config;
