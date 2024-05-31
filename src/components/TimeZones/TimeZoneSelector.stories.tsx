import React from 'react';
import { Meta, Story } from '@storybook/react';
import TimeZoneSelector from './TimeZoneSelector';
import { DayProvider } from '../Calendar/context/DayContext';

export default {
  title: 'Components/TimeZones/TimeZoneSelector',
  component: TimeZoneSelector,
  decorators: [
    (Story) => (
      <DayProvider>
        <Story />
      </DayProvider>
    ),
  ],
} as Meta;

const Template: Story = (args) => <TimeZoneSelector {...args} />;

export const Default = Template.bind({});
Default.args = {
  value: 'America/New_York',
  onChange: (value: string) => console.log(value),
};
