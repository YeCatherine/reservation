import type { Preview } from '@storybook/react';

const preview: Preview = {
  //👇 Enables auto-generated documentation for all stories
  tags: ['autodocs'],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
