// create story for DebugPanel component
import React from 'react';

import { Meta, Story } from '@storybook/react';
import DebugPanel, { DebugPanelProps } from './DebugPanel';

export default {
  title: 'UI/DebugPanel',
  component: DebugPanel,
} as Meta;

const Template: Story<DebugPanelProps> = (args) => <DebugPanel {...args} />;
export const Default = Template.bind({});
Default.args = {
  data: { key: 'value' },
  title: 'Debug Panel',
  expanded: false,
};
