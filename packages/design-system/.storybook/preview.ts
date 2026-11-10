import type { Preview } from '@storybook/react-vite';
import '../src/styles/index.scss';

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    layout: 'padded',
  },
};

export default preview;
