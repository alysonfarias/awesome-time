import type { Meta, StoryObj } from '@storybook/react';
import { RelativeTime } from '../react';

const meta: Meta<typeof RelativeTime> = {
  title: 'Components/RelativeTime',
  component: RelativeTime,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    date: { control: 'date' },
    locale: {
      control: 'select',
      options: ['en', 'es', 'pt', 'de', 'fr', 'unknown'],
    },
    tooltipPosition: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    live: { control: 'boolean' },
    liveInterval: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<typeof RelativeTime>;

// Basic usage
export const Default: Story = {
  args: {
    date: new Date(),
  },
};

// Different time ranges
export const JustNow: Story = {
  args: {
    date: new Date(),
  },
};

export const SecondsAgo: Story = {
  args: {
    date: new Date(Date.now() - 5000),
  },
};

export const MinutesAgo: Story = {
  args: {
    date: new Date(Date.now() - 60000),
  },
};

export const HoursAgo: Story = {
  args: {
    date: new Date(Date.now() - 3600000),
  },
};

export const FutureTime: Story = {
  args: {
    date: new Date(Date.now() + 5000),
  },
};

// Internationalization
export const Spanish: Story = {
  args: {
    date: new Date(Date.now() - 5000),
    locale: 'es',
  },
};

export const Portuguese: Story = {
  args: {
    date: new Date(Date.now() - 5000),
    locale: 'pt',
  },
};

export const German: Story = {
  args: {
    date: new Date(Date.now() - 5000),
    locale: 'de',
  },
};

export const French: Story = {
  args: {
    date: new Date(Date.now() - 5000),
    locale: 'fr',
  },
};

// Customization
export const CustomClassName: Story = {
  args: {
    date: new Date(),
    className: 'text-blue-500 font-bold',
  },
};

export const CustomTooltip: Story = {
  args: {
    date: new Date(),
    customTooltip: 'Custom tooltip text',
  },
};

export const DisabledTooltip: Story = {
  args: {
    date: new Date(),
    disableTooltip: true,
  },
};

export const CustomPosition: Story = {
  args: {
    date: new Date(),
    tooltipPosition: 'bottom',
  },
};

// Live updates
export const LiveUpdates: Story = {
  args: {
    date: new Date(),
    live: true,
    liveInterval: 1000,
  },
};

// Custom rendering
export const CustomRender: Story = {
  args: {
    date: new Date(),
    children: ({ relativeTime, tooltipText, date }) => (
      <div className="p-4 bg-gray-100 rounded">
        <div className="text-lg font-bold">{relativeTime}</div>
        <div className="text-sm text-gray-600">{tooltipText}</div>
        <div className="text-xs text-gray-400">
          {date.toLocaleString()}
        </div>
      </div>
    ),
  },
};

// Edge cases
export const InvalidDate: Story = {
  args: {
    date: 'invalid',
  },
};

export const EmptyDate: Story = {
  args: {
    date: '',
  },
};

export const CustomInvalidLabel: Story = {
  args: {
    date: 'invalid',
    labels: {
      invalid: 'Custom invalid message',
    },
  },
};

// Timezone handling
export const WithTimezone: Story = {
  args: {
    date: new Date(),
    timezone: 'America/New_York',
  },
};

export const InvalidTimezone: Story = {
  args: {
    date: new Date(),
    timezone: 'Invalid/Timezone',
  },
}; 