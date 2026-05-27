/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React, {
  FunctionComponent,
  HTMLAttributes,
  ProgressHTMLAttributes,
  ReactNode,
  CSSProperties,
  useState,
  useRef,
  useEffect,
  MutableRefObject,
} from 'react';
import classNames from 'classnames';
import { EuiI18n } from '../i18n';
import { CommonProps, ExclusiveUnion } from '../common';
import { isNil } from '../../services/predicate';

import { useEuiTheme, makeHighContrastColor } from '../../services';
import { EuiScreenReaderOnly } from '../accessibility';
import { getLinearGradient } from '../color_picker/utils';
import type { PaletteColorStop } from '../color_picker/color_palette_picker';
import {
  euiProgressStyles,
  euiProgressDataStyles,
  euiProgressLabelStyles,
  euiProgressValueTextStyles,
} from './progress.styles';

export const SIZES = ['xs', 's', 'm', 'l'] as const;
export type EuiProgressSize = (typeof SIZES)[number];

export const COLORS = [
  'primary',
  'success',
  'warning',
  'danger',
  'subdued',
  'accent',
  'accentSecondary',
  'vis0',
  'vis1',
  'vis2',
  'vis3',
  'vis4',
  'vis5',
  'vis6',
  'vis7',
  'vis8',
  'vis9',
] as const;
export type EuiProgressColor = (typeof COLORS)[number];

export const POSITIONS = ['fixed', 'absolute', 'static'] as const;
export type EuiProgressPosition = (typeof POSITIONS)[number];

export type EuiProgressProps = CommonProps & {
  size?: EuiProgressSize;
  /**
   * One of EUI's color palette, vis colors or a valid CSS color value https://developer.mozilla.org/en-US/docs/Web/CSS/color_value
   */
  color?: EuiProgressColor | CSSProperties['color'];
  position?: EuiProgressPosition;
  /**
   * A color palette — either an array of CSS color strings or an array of
   * `PaletteColorStop` objects (same format accepted by `getLinearGradient`) —
   * used to paint a gradient fill on the progress bar. The gradient is anchored
   * to the full width of the track so that advancing the bar reveals more of a
   * fixed gradient rather than stretching it.
   * When set, the `color` prop is ignored.
   */
  palette?: string[] | PaletteColorStop[];
  direction?: 'ltr' | 'rtl';
};

type Indeterminate = EuiProgressProps & HTMLAttributes<HTMLDivElement>;

type Determinate = EuiProgressProps &
  Omit<ProgressHTMLAttributes<HTMLProgressElement>, 'max'> & {
    /**
     * When set, creates determinate progress with a value/max ratio
     */
    max?: number;
    /**
     * Displays custom text or percentage
     * Pass `true` to display the percentage value
     * Pass a ReactNode for custom text
     * @default false
     */
    valueText?: boolean | ReactNode;
    label?: ReactNode;
    /**
     * Object of props passed to the <span/> wrapping the determinate progress's label
     */
    labelProps?: CommonProps & HTMLAttributes<HTMLSpanElement>;
  };

export const EuiProgress: FunctionComponent<
  ExclusiveUnion<Determinate, Indeterminate>
> = ({
  className,
  color = 'success',
  size = 'm',
  position = 'static',
  max,
  valueText = false,
  label,
  value,
  labelProps,
  palette,
  direction = 'ltr',
  ...rest
}) => {
  const valueTextRef: MutableRefObject<HTMLSpanElement | null> = useRef(null);
  const labelRef: MutableRefObject<HTMLSpanElement | null> = useRef(null);
  const [innerValueText, setInnerValueText] = useState<string | undefined>();
  const [labelText, setLabelText] = useState<string | undefined>();

  const determinate = !isNil(max);
  const isNamedColor = !palette && COLORS.includes(color as EuiProgressColor);

  const euiTheme = useEuiTheme();
  const customColorStyles = palette || isNamedColor ? {} : { color };
  const customTextColorStyles =
    palette || isNamedColor
      ? {}
      : { color: makeHighContrastColor(color)(euiTheme.euiTheme) };

  const gradientStyles: CSSProperties = palette
    ? ({
        '--euiProgressGradient': getLinearGradient(palette),
        '--euiProgressDirection': direction === 'rtl' ? 'right' : 'left',
      } as CSSProperties)
    : {};

  const styles = euiProgressStyles(euiTheme, determinate);
  const cssStyles = [
    styles.euiProgress,
    determinate && styles.native,
    !determinate && !palette && styles.indeterminate,
    styles[size],
    styles[position],
    palette
      ? styles.gradient
      : isNamedColor
      ? styles[color as EuiProgressColor]
      : styles.customColor,
  ];

  const dataStyles = euiProgressDataStyles(euiTheme);
  const dataCssStyles = [
    dataStyles.euiProgress__data,
    size === 'l' && dataStyles[size],
  ];
  const labelCssStyles = [
    euiProgressLabelStyles.euiProgress__label,
    labelProps?.css,
  ];
  const valueTextStyles = euiProgressValueTextStyles(euiTheme);
  const valueTextCssStyles = [
    valueTextStyles.euiProgress__valueText,
    isNamedColor
      ? valueTextStyles[color as EuiProgressColor]
      : styles.customColor,
  ];

  const classes = classNames('euiProgress', className);
  const labelClasses = classNames('euiProgress__label', labelProps?.className);

  let valueRender: ReactNode;
  if (valueText === true) {
    // valueText is true
    valueRender = (
      <EuiI18n
        token="euiProgress.valueText"
        default="{value}%"
        values={{
          value,
        }}
      />
    );
  } else if (valueText) {
    // valueText exists
    valueRender = valueText;
  }

  useEffect(() => {
    setInnerValueText(valueTextRef.current?.textContent ?? '');
    setLabelText(labelRef.current?.textContent ?? '');
  }, [label, valueRender, value]);

  // Because of a Firefox animation issue, indeterminate progress needs to not use <progress />.
  // See https://css-tricks.com/html5-progress-element/

  if (determinate) {
    return (
      <>
        {label || valueText ? (
          <div css={dataCssStyles} className="euiProgress__data">
            {label && (
              <div
                ref={(node) => {
                  labelRef.current = node;
                }}
                {...labelProps}
                className={labelClasses}
                css={labelCssStyles}
                aria-hidden="true"
              >
                {label}
              </div>
            )}
            {valueRender && (
              <div
                ref={(node) => {
                  valueTextRef.current = node;
                }}
                style={customTextColorStyles}
                css={valueTextCssStyles}
                className="euiProgress__valueText"
                aria-hidden="true"
              >
                {valueRender}
              </div>
            )}
          </div>
        ) : undefined}
        <EuiScreenReaderOnly>
          <div aria-live="polite" aria-atomic="true">
            <span>
              {label && <>{labelText} </>}
              {valueRender || value}
            </span>
          </div>
        </EuiScreenReaderOnly>
        <progress
          css={cssStyles}
          className={classes}
          style={{ ...customColorStyles, ...gradientStyles }}
          max={max}
          value={value}
          aria-valuetext={innerValueText || undefined}
          aria-label={labelText || undefined}
          dir={direction}
          {...(rest as ProgressHTMLAttributes<HTMLProgressElement>)}
        />
      </>
    );
  } else {
    return (
      <div
        css={cssStyles}
        style={{ ...customColorStyles, ...gradientStyles }}
        className={classes}
        dir={direction}
        {...(rest as HTMLAttributes<HTMLDivElement>)}
      />
    );
  }
};
