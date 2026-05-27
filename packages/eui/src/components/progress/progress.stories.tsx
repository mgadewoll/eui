/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React, { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import {
  useEuiPaletteColorBlind,
  useEuiPaletteForStatus,
  useEuiTheme,
} from '../../services';
import { EuiProgress, COLORS, EuiProgressProps } from './progress';
import { EuiButton } from '../button';
import { EuiFlexGroup, EuiFlexItem } from '../flex';
import { EuiSpacer } from '../spacer';
import { EuiText } from '../text';
import type { PaletteColorStop } from '../color_picker/color_palette_picker';

const meta: Meta<typeof EuiProgress> = {
  title: 'Display/EuiProgress',
  component: EuiProgress,
  argTypes: {
    color: { control: 'select', options: [...COLORS] },
    // for quicker/easier QA
    label: { control: 'text' },
    value: { control: 'number' },
    valueText: {
      control: 'radio',
      options: ['custom', 'true', 'false'],
      mapping: {
        custom: 'steps',
        true: true,
        false: false,
      },
    },
    direction: {
      control: 'radio',
      options: ['ltr', 'rtl'],
    },
  },
  args: {
    color: 'success',
    size: 'm',
    position: 'static',
    direction: 'ltr',
    valueText: false,
  },
};

export default meta;
type Story = StoryObj<typeof EuiProgress>;

export const Determinate: Story = {
  args: {
    label: '',
    value: 70,
    max: 100,
  },
};

export const Indeterminate: Story = {
  parameters: {
    controls: {
      include: ['color', 'position', 'size', 'direction', 'aria-label'],
    },
  },
};

export const HighContrast: Story = {
  tags: ['vrt-only'],
  globals: { highContrastMode: true },
  args: {
    ...Determinate.args,
    size: 'xs',
    color: 'primary',
  },
  render: (args) => <EuiProgress {...args} />,
};

export const DeterminateLoading: Story = {
  parameters: {
    controls: {
      include: ['label', 'value', 'valueText', 'max'],
    },
    codeSnippet: {
      resolveStoryElementOnly: true,
    },
    loki: {
      skip: true,
    },
  },
  args: {
    label: 'Loading',
    value: 70,
    max: 100,
  },
  render: function Render(args) {
    const { value, valueText, max } = args;
    const maxValue = max ?? 100;
    const hasCustomValueText = valueText === 'steps';

    const [loading, setLoading] = useState<number>(
      typeof value === 'number'
        ? value
        : typeof value === 'string'
        ? parseInt(value)
        : 0
    );
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | undefined>(
      undefined
    );

    const cleanInterval = (id: NodeJS.Timeout | undefined) => {
      if (id !== undefined) {
        clearInterval(id);
        setIntervalId(undefined);
      }
    };

    useEffect(() => {
      if (loading >= maxValue) {
        cleanInterval(intervalId);
      }
    }, [intervalId, loading, maxValue]);

    useEffect(() => {
      return () => {
        cleanInterval(intervalId);
      };
    }, []);

    const increment = () => {
      setLoading((prev: number) => {
        if (prev >= maxValue) return 0;

        return prev + 10;
      });
    };

    const startLoading = () => {
      if (loading === 0 && intervalId === undefined) {
        const _intervalId = setInterval(() => increment(), 1000);

        setIntervalId(_intervalId);
      } else {
        setLoading(0);
        clearInterval(intervalId);
        setIntervalId(undefined);
      }
    };

    return (
      <EuiFlexGroup>
        <EuiFlexItem grow={false}>
          <EuiButton onClick={startLoading}>
            {loading === 0 ? 'Start' : 'Reset'}
          </EuiButton>
        </EuiFlexItem>
        <EuiFlexItem>
          {/* casting due to ExclusiveUnion complexity */}
          <EuiProgress
            {...(args as typeof EuiProgress)}
            max={maxValue}
            value={loading}
            valueText={
              hasCustomValueText ? `${loading} ${valueText}` : valueText
            }
          />
        </EuiFlexItem>
      </EuiFlexGroup>
    );
  },
};

export const Gradient: Story = {
  parameters: {
    controls: {
      include: ['direction', 'size', 'position'],
    },
    loki: { skip: true },
  },
  render: function Render(args: EuiProgressProps) {
    const max = 100;
    const { euiTheme } = useEuiTheme();

    const euiPaletteColorBlind = useEuiPaletteColorBlind();
    const euiPaletteForStatus = useEuiPaletteForStatus(6);

    const severityPalette = [
      euiTheme.colors.severity.unknown,
      euiTheme.colors.severity.neutral,
      euiTheme.colors.severity.success,
      euiTheme.colors.severity.warning,
      euiTheme.colors.severity.risk,
      euiTheme.colors.severity.danger,
    ];

    const GRADIENTS: Array<{
      label: string;
      gradient: string[] | PaletteColorStop[];
      value: number;
    }> = [
      {
        label: 'Status palette',
        gradient: euiPaletteForStatus,
        value: 15,
      },
      {
        label: 'Color-blind palette',
        gradient: euiPaletteColorBlind,
        value: 35,
      },
      {
        label: 'Severity palette',
        gradient: [
          { stop: 0, color: severityPalette[1] },
          { stop: 25, color: severityPalette[2] },
          { stop: 50, color: severityPalette[3] },
          { stop: 75, color: severityPalette[4] },
          { stop: 100, color: severityPalette[5] },
        ] as PaletteColorStop[],
        value: 55,
      },
    ];

    const INDETERMINATE_GRADIENTS: Array<{
      label: string;
      gradient: string[] | PaletteColorStop[];
    }> = [
      { label: 'Status palette', gradient: euiPaletteForStatus },
      { label: 'Color-blind palette', gradient: euiPaletteColorBlind },
      {
        label: 'Severity palette',
        gradient: severityPalette,
      },
    ];

    const [values, setValues] = useState(GRADIENTS.map((e) => e.value));
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | undefined>(
      undefined
    );

    const running = intervalId !== undefined;

    const tick = () => {
      setValues((prev) =>
        prev.map((v) => {
          const next = v + 5;
          return next > max ? 0 : next;
        })
      );
    };

    const toggle = () => {
      if (running) {
        clearInterval(intervalId);
        setIntervalId(undefined);
      } else {
        setIntervalId(setInterval(tick, 400));
      }
    };

    useEffect(() => () => clearInterval(intervalId), [intervalId]);

    return (
      <EuiFlexGroup direction="column" gutterSize="xl">
        <EuiFlexItem grow={false}>
          <EuiButton onClick={toggle} style={{ width: 'fit-content' }}>
            {running ? 'Pause' : 'Animate'}
          </EuiButton>
        </EuiFlexItem>
        {GRADIENTS.map(({ label, gradient }, i) => (
          <EuiFlexItem key={label}>
            <EuiProgress
              {...args}
              value={values[i]}
              max={max}
              palette={gradient}
              label={label}
              aria-label={label}
            />
          </EuiFlexItem>
        ))}
        <EuiFlexItem>
          {INDETERMINATE_GRADIENTS.map(({ label, gradient }) => (
            <div key={label}>
              <EuiText size="s">
                <p>{label}</p>
              </EuiText>
              <EuiSpacer size="xs" />
              <EuiProgress {...args} palette={gradient} aria-label={label} />
              <EuiSpacer size="l" />
            </div>
          ))}
        </EuiFlexItem>
      </EuiFlexGroup>
    );
  },
};
