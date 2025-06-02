import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { RelativeTime, ErrorBoundary } from '../src/react';

describe('RelativeTime Component', () => {
  const now = new Date('2025-06-01T14:30:00Z');

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(now);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Basic rendering', () => {
    it('renders with default props', () => {
      render(<RelativeTime date={now} />);
      const element = screen.getByText('Just now');
      expect(element).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<RelativeTime date={now} className="custom-class" />);
      const element = screen.getByText('Just now');
      expect(element).toHaveClass('custom-class');
    });

    it('renders with tooltip by default', () => {
      render(<RelativeTime date={now} />);
      const element = screen.getByText('Just now');
      expect(element).toHaveAttribute('title');
      expect(element).toHaveAttribute('aria-label');
    });

    it('disables tooltip when specified', () => {
      render(<RelativeTime date={now} disableTooltip />);
      const element = screen.getByText('Just now');
      expect(element).not.toHaveAttribute('title');
      expect(element).not.toHaveAttribute('aria-label');
    });
  });

  describe('Tooltip positioning', () => {
    it('sets default tooltip position to top', () => {
      render(<RelativeTime date={now} />);
      const element = screen.getByText('Just now');
      expect(element).toHaveAttribute('data-tooltip-position', 'top');
    });

    it('allows custom tooltip position', () => {
      render(<RelativeTime date={now} tooltipPosition="bottom" />);
      const element = screen.getByText('Just now');
      expect(element).toHaveAttribute('data-tooltip-position', 'bottom');
    });
  });

  describe('Time formatting', () => {
    it('formats seconds ago', () => {
      const fiveSecondsAgo = new Date(now.getTime() - 5000);
      render(<RelativeTime date={fiveSecondsAgo} />);
      expect(screen.getByText('5s ago')).toBeInTheDocument();
    });

    it('formats minutes ago', () => {
      const tenMinutesAgo = new Date(now.getTime() - 600000);
      render(<RelativeTime date={tenMinutesAgo} />);
      expect(screen.getByText('10m ago')).toBeInTheDocument();
    });

    it('formats hours ago', () => {
      const threeHoursAgo = new Date(now.getTime() - 10800000);
      render(<RelativeTime date={threeHoursAgo} />);
      expect(screen.getByText('3h ago')).toBeInTheDocument();
    });

    it('formats future times', () => {
      const fiveSecondsLater = new Date(now.getTime() + 5000);
      render(<RelativeTime date={fiveSecondsLater} />);
      expect(screen.getByText('in 5s')).toBeInTheDocument();
    });
  });

  describe('Internationalization', () => {
    it('renders in Spanish', () => {
      const fiveSecondsAgo = new Date(now.getTime() - 5000);
      render(<RelativeTime date={fiveSecondsAgo} locale="es" />);
      expect(screen.getByText('hace 5s')).toBeInTheDocument();
    });

    it('renders in Portuguese', () => {
      const fiveSecondsAgo = new Date(now.getTime() - 5000);
      render(<RelativeTime date={fiveSecondsAgo} locale="pt" />);
      expect(screen.getByText('há 5s')).toBeInTheDocument();
    });

    it('renders in German', () => {
      const fiveSecondsAgo = new Date(now.getTime() - 5000);
      render(<RelativeTime date={fiveSecondsAgo} locale="de" />);
      expect(screen.getByText('vor 5s')).toBeInTheDocument();
    });

    it('renders in French', () => {
      const fiveSecondsAgo = new Date(now.getTime() - 5000);
      render(<RelativeTime date={fiveSecondsAgo} locale="fr" />);
      expect(screen.getByText('il y a 5s')).toBeInTheDocument();
    });

    it('falls back to English for unknown locale', () => {
      const fiveSecondsAgo = new Date(now.getTime() - 5000);
      render(<RelativeTime date={fiveSecondsAgo} locale="unknown" />);
      expect(screen.getByText('5s ago')).toBeInTheDocument();
    });
  });

  describe('Custom labels', () => {
    it('uses custom labels when provided', () => {
      render(
        <RelativeTime
          date={now}
          labels={{
            justNow: 'A moment ago',
            invalid: 'Invalid timestamp'
          }}
        />
      );
      expect(screen.getByText('A moment ago')).toBeInTheDocument();
    });

    it('handles invalid dates with custom label', () => {
      render(
        <RelativeTime
          date="invalid"
          labels={{
            invalid: 'Custom invalid message'
          }}
        />
      );
      expect(screen.getByText('Custom invalid message')).toBeInTheDocument();
    });
  });

  describe('Timezone handling', () => {
    it('includes timezone in tooltip when specified', () => {
      render(<RelativeTime date={now} timezone="America/New_York" />);
      const element = screen.getByText('Just now');
      expect(element.getAttribute('title')).toContain('America/New_York');
    });

    it('handles invalid timezone gracefully', () => {
      render(<RelativeTime date={now} timezone="Invalid/Timezone" />);
      const element = screen.getByText('Just now');
      expect(element).toHaveAttribute('title');
    });
  });

  describe('Edge cases', () => {
    it('handles null date', () => {
      render(<RelativeTime date={null as any} />);
      expect(screen.getByText('Invalid date')).toBeInTheDocument();
    });

    it('handles undefined date', () => {
      render(<RelativeTime date={undefined as any} />);
      expect(screen.getByText('Invalid date')).toBeInTheDocument();
    });

    it('handles empty string date', () => {
      render(<RelativeTime date="" />);
      expect(screen.getByText('Invalid date')).toBeInTheDocument();
    });

    it('handles invalid date string', () => {
      render(<RelativeTime date="invalid-date" />);
      expect(screen.getByText('Invalid date')).toBeInTheDocument();
    });

    it('handles very old dates', () => {
      const oldDate = new Date('1900-01-01');
      render(<RelativeTime date={oldDate} />);
      expect(screen.getByText('Dec 31, 1899')).toBeInTheDocument();
    });

    it('handles very future dates', () => {
      const futureDate = new Date('2100-01-01');
      render(<RelativeTime date={futureDate} />);
      expect(screen.getByText('Dec 31, 2099')).toBeInTheDocument();
    });
  });

  describe('Custom rendering', () => {
    it('renders using children render prop', () => {
      const renderFn = jest.fn(({ relativeTime }) => <div>{relativeTime}</div>);
      render(<RelativeTime date={now} children={renderFn} />);
      
      expect(renderFn).toHaveBeenCalledWith({
        relativeTime: 'Just now',
        tooltipText: expect.any(String),
        date: expect.any(Date)
      });
    });
  });

  describe('Accessibility', () => {
    let axePromise: Promise<any> | null = null;

    // afterEach(async () => {
    //   if (axePromise) {
    //     await axePromise;
    //     axePromise = null;
    //   }
    // });

    // it('has no accessibility violations', async () => {
    //   const { container } = render(<RelativeTime date={now} />);
    //   axePromise = axe(container, { timeout: 20000 });
    //   const results = await axePromise;
    //   expect(results).toHaveNoViolations();
    // }, 30000);

    // it('has no accessibility violations with tooltip', async () => {
    //   const { container } = render(
    //     <RelativeTime
    //       date={now}
    //       customTooltip="Custom tooltip"
    //       tooltipPosition="bottom"
    //     />
    //   );
    //   axePromise = axe(container, { timeout: 20000 });
    //   const results = await axePromise;
    //   expect(results).toHaveNoViolations();
    // }, 30000);

    // it('has no accessibility violations with custom render', async () => {
    //   const { container } = render(
    //     <RelativeTime
    //       date={now}
    //       children={({ relativeTime }) => (
    //         <div role="status">{relativeTime}</div>
    //       )}
    //     />
    //   );
    //   axePromise = axe(container, { timeout: 20000 });
    //   const results = await axePromise;
    //   expect(results).toHaveNoViolations();
    // }, 30000);
  });

  it('renders relative time correctly', () => {
    const date = new Date();
    render(<RelativeTime date={date} />);
    expect(screen.getByText(/just now/i)).toBeInTheDocument();
  });

  it('renders custom tooltip when provided', () => {
    const date = new Date();
    const customTooltip = 'Custom tooltip text';
    render(<RelativeTime date={date} customTooltip={customTooltip} />);
    expect(screen.getByTitle(customTooltip)).toBeInTheDocument();
  });

  it('renders children when provided', () => {
    const date = new Date();
    const children = ({ relativeTime }: { relativeTime: string }) => <div data-testid="custom-render">{relativeTime}</div>;
    render(<RelativeTime date={date}>{children}</RelativeTime>);
    expect(screen.getByTestId('custom-render')).toBeInTheDocument();
  });
});

describe('ErrorBoundary Component', () => {
  const ThrowError = () => {
    throw new Error('Test error');
  };

  beforeEach(() => {
    // Suppress console.error for expected error
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders error message when child component throws', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    const CustomFallback = () => <div>Custom error message</div>;
    render(
      <ErrorBoundary fallback={<CustomFallback />}>
        <ThrowError />
      </ErrorBoundary>
    );
    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('renders error details in development mode', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/test error/i)).toBeInTheDocument();
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('does not render error details in production mode', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.queryByText(/test error/i)).not.toBeInTheDocument();
    process.env.NODE_ENV = originalNodeEnv;
  });

  // it('has no accessibility violations', async () => {
  //   const { container } = render(
  //     <ErrorBoundary>
  //       <ThrowError />
  //     </ErrorBoundary>
  //   );
  //   const results = await axe(container, { timeout: 10000 });
  //   expect(results).toHaveNoViolations();
  // }, 15000);
}); 