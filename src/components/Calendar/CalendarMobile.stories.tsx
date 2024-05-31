import React from 'react';
import { Story, Meta } from '@storybook/react';

import CalendarMobile, { TCalendarMobileProps } from './CalendarMobile.tsx';
import { DayProvider } from '../Calendar/context/DayContext';
import { ProviderContextProvider } from '../Client/context/ProviderContext.tsx';
import { AuthProvider } from '../Auth/context/AuthContext.tsx';

export default {
  title: 'Calendar/CalendarMobile',
  component: CalendarMobile,
  decorators: [
    (Story) => (
      <AuthProvider>
        <DayProvider>
          <ProviderContextProvider>
            <Story />
          </ProviderContextProvider>
        </DayProvider>
      </AuthProvider>
    ),
  ],
} as Meta;

const Template: Story<TCalendarMobileProps> = (args) => (
  <CalendarMobile {...args} />
);

export const Default = Template.bind({});

Default.args = {
  // Add default props here
};
