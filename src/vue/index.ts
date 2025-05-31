import { defineComponent, ref, onMounted, onUnmounted, watch, PropType } from 'vue';
import { formatRelativeTime, FormatRelativeTimeOptions } from '../core';
import { App } from 'vue';

export interface RelativeTimeProps extends Omit<FormatRelativeTimeOptions, 'disableTooltip'> {
  date: string | number | Date;
  className?: string;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
  disableTooltip?: boolean;
  locale?: string;
  customTooltip?: string;
  live?: boolean;
  liveInterval?: number;
}

export const RelativeTime = defineComponent({
  name: 'RelativeTime',
  props: {
    date: {
      type: [String, Number, Date] as PropType<string | number | Date>,
      required: true
    },
    className: String,
    tooltipPosition: {
      type: String as PropType<'top' | 'bottom' | 'left' | 'right'>,
      default: 'top',
      validator: (value: string) => ['top', 'bottom', 'left', 'right'].includes(value)
    },
    disableTooltip: Boolean,
    locale: {
      type: String,
      default: 'en'
    },
    customTooltip: String,
    timezone: String,
    labels: Object as PropType<Record<string, string>>,
    justNowLabel: String,
    live: Boolean,
    liveInterval: {
      type: Number,
      default: 1000
    }
  },
  setup(props: RelativeTimeProps) {
    const relativeTime = ref('');
    const tooltipText = ref<string | undefined>('');
    let updateInterval: number | null = null;

    const updateTime = () => {
      const result = formatRelativeTime({
        date: props.date,
        timezone: props.timezone,
        labels: props.labels,
        justNowLabel: props.justNowLabel,
        disableTooltip: props.disableTooltip,
        locale: props.locale
      });
      relativeTime.value = result.relativeTime;
      tooltipText.value = result.tooltipText || '';
    };

    const startLiveUpdates = () => {
      if (props.live && !updateInterval) {
        updateInterval = window.setInterval(updateTime, props.liveInterval);
      }
    };

    const stopLiveUpdates = () => {
      if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
      }
    };

    watch(() => props.date, updateTime);
    watch(
      () => props.live,
      (newValue) => {
        if (newValue) {
          startLiveUpdates();
        } else {
          stopLiveUpdates();
        }
      }
    );

    onMounted(() => {
      updateTime();
      if (props.live) {
        startLiveUpdates();
      }
    });

    onUnmounted(() => {
      stopLiveUpdates();
    });

    return {
      relativeTime,
      tooltipText
    };
  },
  template: `
    <time
      :class="className"
      :title="customTooltip || tooltipText"
      :data-tooltip-position="tooltipPosition"
      :aria-label="customTooltip || tooltipText"
      :aria-describedby="(customTooltip || tooltipText) ? 'relative-time-tooltip' : undefined"
      :datetime="new Date(date).toISOString()"
    >
      {{ relativeTime }}
      <span
        v-if="customTooltip || tooltipText"
        id="relative-time-tooltip"
        style="display: none"
      >
        {{ customTooltip || tooltipText }}
      </span>
    </time>
  `
});

export default {
  install: (app: App) => {
    app.component('RelativeTime', RelativeTime);
  }
}; 