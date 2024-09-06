/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { css, keyframes, type SerializedStyles } from '@emotion/react';
import {
  _EuiThemeBorderColors,
  _EuiThemeButtonColors,
  euiCanAnimate,
} from '../index';
import {
  EuiThemeColorModeStandard,
  UseEuiTheme,
  useEuiMemoizedStyles,
} from '../../services';
import { CSSProperties } from 'react';

export const BUTTON_COLORS = [
  'text',
  'accent',
  'primary',
  'success',
  'warning',
  'danger',
] as const;
export type _EuiButtonColor = (typeof BUTTON_COLORS)[number];

export const BUTTON_DISPLAYS = ['base', 'fill', 'empty'] as const;
export type _EuiButtonDisplay = (typeof BUTTON_DISPLAYS)[number];

export interface _EuiButtonOptions {
  display?: _EuiButtonDisplay;
}

/**
 * Creates the `base` version of button styles with proper text contrast.
 * @param euiThemeContext
 * @param color One of the named button colors or 'disabled'
 * @returns Style object `{ backgroundColor, color }`
 */
export const euiButtonColor = (
  euiThemeContext: UseEuiTheme,
  color: _EuiButtonColor | 'disabled'
) => {
  const { euiTheme } = euiThemeContext;

  const colorName = color.charAt(0).toUpperCase() + color.slice(1);
  const backgroundToken =
    `buttonSecondaryBackground${colorName}` as keyof _EuiThemeButtonColors;
  const colorToken =
    `buttonSecondaryColor${colorName}` as keyof _EuiThemeButtonColors;
  const borderColorToken =
    `buttonSecondaryBorderColor${colorName}` as keyof _EuiThemeButtonColors;

  return {
    color: euiTheme.colors[colorToken],
    backgroundColor: euiTheme.colors[backgroundToken],
    borderColor: euiTheme.colors[borderColorToken],
  };
};

/**
 * Creates the `fill` version of buttons styles with proper text contrast.
 * @param euiThemeContext
 * @param color One of the named button colors or 'disabled'
 * @returns Style object `{ backgroundColor, color }`
 */
export const euiButtonFillColor = (
  euiThemeContext: UseEuiTheme,
  color: _EuiButtonColor | 'disabled'
) => {
  const { euiTheme } = euiThemeContext;

  const backgroundToken = _getTokenName(
    color,
    'buttonBackground'
  ) as keyof _EuiThemeButtonColors;
  const colorToken = _getTokenName(
    color,
    'buttonColor'
  ) as keyof _EuiThemeButtonColors;

  return {
    color: euiTheme.colors[colorToken],
    backgroundColor: euiTheme.colors[backgroundToken],
  };
};

/**
 * Creates the `empty` version of button styles using the text-variant and adding interactive styles.
 * @param euiThemeContext
 * @param color One of the named button colors or 'disabled'
 * @returns Style object `{ backgroundColor, color }` where `background` is typically used for interactive states
 */
export const euiButtonEmptyColor = (
  euiThemeContext: UseEuiTheme,
  color: _EuiButtonColor | 'disabled'
) => {
  const { euiTheme } = euiThemeContext;

  const backgroundToken = _getTokenName(
    color,
    'buttonEmptyBackground'
  ) as keyof _EuiThemeButtonColors;

  const colorToken = _getTokenName(
    color,
    'buttonEmptyColor'
  ) as keyof _EuiThemeButtonColors;

  return {
    color: euiTheme.colors[colorToken],
    backgroundColor: euiTheme.colors[backgroundToken],
  };
};

/**
 * Given the button display type, returns the Emotion based color keys.
 * @param options Button display type
 * @returns An object of `_EuiButtonColor` keys including `disabled`
 */
export const useEuiButtonColorCSS = (options: _EuiButtonOptions = {}) => {
  const { display = 'base' } = options;

  const colorsDisplaysMap = useEuiMemoizedStyles(euiButtonDisplaysColors);
  return colorsDisplaysMap[display];
};

const euiButtonDisplaysColors = (euiThemeContext: UseEuiTheme) => {
  const COLORS = [...BUTTON_COLORS, 'disabled'] as const;
  type Colors = (typeof COLORS)[number];

  const displaysColorsMap = {} as Record<
    _EuiButtonDisplay,
    Record<Colors, SerializedStyles>
  >;

  const buttonBorderStyles = ({
    colorMode,
    borderWidth,
    borderColor,
    bevelColor,
  }: {
    colorMode?: EuiThemeColorModeStandard;
    borderWidth: CSSProperties['borderWidth'];
    borderColor?: CSSProperties['borderColor'];
    bevelColor?: CSSProperties['borderColor'];
  }) => {
    const _borderColor = borderColor ?? 'transparent';
    const _bevelColor = bevelColor ?? 'transparent';
    const direction = colorMode === 'DARK' ? 1 : -1;

    return css`
      // adding the faked border style as ::after to prevent hover gradient from overlapping
      &:not(:focus-visible) {
        &::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          box-shadow: inset 0 calc(${borderWidth} * ${direction}) 0 0
              ${_bevelColor},
            inset 0 0 0 ${borderWidth} ${_borderColor};
        }
      }
    `;
  };

  const buttonGradientStyle = (ratio: number = 0.1) => css`
    &:hover,
    &:focus,
    &:focus-visible,
    &:active {
      &::before {
        content: '';
        position: absolute;
        z-index: 0;
        inset: 0;
        border-radius: inherit;
        background: linear-gradient(
          to top,
          rgba(0, 0, 0, ${ratio}),
          rgba(255, 255, 255, ${ratio})
        );
      }
    }
  `;

  BUTTON_DISPLAYS.forEach((display) => {
    displaysColorsMap[display] = {} as Record<Colors, SerializedStyles>;

    COLORS.forEach((color) => {
      switch (display) {
        case 'base': {
          const buttonStyles = euiButtonColor(euiThemeContext, color);
          const { euiTheme, colorMode } = euiThemeContext;
          // new theme specific style flag
          const hasBorderStyles = euiTheme.colors.buttonBorderColor != null;
          const hasHoverBackground =
            euiTheme.colors.buttonSecondaryBackgroundHovered != null;
          const borderToken = _getTokenName(
            color,
            'buttonSecondaryBorderColor'
          ) as keyof _EuiThemeBorderColors;
          const borderBevelToken = _getTokenName(
            color,
            'buttonSecondaryBorderColorBevel'
          ) as keyof _EuiThemeBorderColors;

          const newStyles =
            hasBorderStyles &&
            css`
              ${buttonBorderStyles({
                colorMode,
                borderWidth: euiTheme.border.width.thin,
                bevelColor: euiTheme.colors[borderBevelToken],
                borderColor: euiTheme.colors[borderToken],
              })}

              ${color !== 'disabled' &&
              (hasHoverBackground
                ? `
                  &:hover,
                  &:focus,
                  &:active {
                    background-color: ${euiTheme.colors.buttonSecondaryBackgroundHovered};
                `
                : buttonGradientStyle(0.05))}
            `;

          displaysColorsMap[display][color] = css`
            position: relative;
            overflow: hidden;
            background-color: ${buttonStyles.backgroundColor};
            color: ${buttonStyles.color};

            ${newStyles}
          `;
          break;
        }

        case 'fill': {
          const { euiTheme, colorMode } = euiThemeContext;
          // new theme specific style flag
          const hasBorderStyles = euiTheme.colors.buttonBorderColor != null;
          const borderBevelToken = _getTokenName(
            color,
            'buttonBorderColorBevel'
          ) as keyof _EuiThemeBorderColors;

          const newStyles =
            hasBorderStyles &&
            css`
              ${buttonBorderStyles({
                colorMode,
                borderWidth: euiTheme.border.width.thin,
                bevelColor: euiTheme.colors[borderBevelToken],
              })}

              ${color !== 'disabled' && buttonGradientStyle()}
            `;

          displaysColorsMap[display][color] = css`
            ${euiButtonFillColor(euiThemeContext, color)}

            ${newStyles}
            

            /* Use full shade for outline-color except for dark mode text buttons which need to stay currentColor */
            outline-color: ${colorMode === 'DARK' && color === 'text'
              ? 'currentColor'
              : euiTheme.colors.fullShade};
          `;
          break;
        }

        case 'empty': {
          const { euiTheme } = euiThemeContext;
          // new theme specific style flag
          const hasBorderStyles = euiTheme.colors.buttonBorderColor != null;

          const newStyles =
            hasBorderStyles &&
            css`
              &:hover,
              &:focus,
              &:active {
                background-color: ${euiTheme.colors
                  .buttonEmptyBackgroundHovered};
              }
            `;

          displaysColorsMap[display][color] = css`
            color: ${euiButtonEmptyColor(euiThemeContext, color).color};

            &:focus,
            &:active {
              background-color: ${euiButtonEmptyColor(euiThemeContext, color)
                .backgroundColor};
            }

            ${newStyles}
          `;
          break;
        }
      }

      // Tweak auto-generated Emotion label/className output
      const emotionOutput = displaysColorsMap[display][color];
      emotionOutput.styles = emotionOutput.styles.replace(
        'label:displaysColorsMap-display-color;',
        `label:${display}-${color};`
      );
    });
  });

  return displaysColorsMap;
};

/**
 * Creates the translate animation when button is in focus.
 * @returns string
 */
export const useEuiButtonFocusCSS = () =>
  useEuiMemoizedStyles(euiButtonFocusCSS);

const euiButtonFocusAnimation = keyframes`
  50% {
    transform: translateY(1px);
  }
`;
const euiButtonFocusCSS = ({ euiTheme }: UseEuiTheme) => {
  const focusCSS = css`
    ${euiCanAnimate} {
      transition: transform ${euiTheme.animation.normal} ease-in-out,
        background-color ${euiTheme.animation.normal} ease-in-out;

      &:hover:not(:disabled) {
        transform: translateY(-1px);
      }

      &:focus {
        animation: ${euiButtonFocusAnimation} ${euiTheme.animation.normal}
          ${euiTheme.animation.bounce};
      }

      &:active:not(:disabled) {
        transform: translateY(1px);
      }
    }
  `;
  // Remove the auto-generated label.
  // We could typically avoid a label by using a plain string `` instead of css``,
  // but we need css`` for keyframes`` to work for the focus animation
  focusCSS.styles = focusCSS.styles.replace('label:focusCSS;', '');
  return focusCSS;
};

/**
 * Map of `size` props to various sizings/scales
 * that should remain consistent across all buttons
 */
export const euiButtonSizeMap = ({ euiTheme }: UseEuiTheme) => ({
  xs: {
    height: euiTheme.size.l,
    radius: euiTheme.border.radius.small,
    fontScale: 'xs' as const,
  },
  s: {
    height: euiTheme.size.xl,
    radius: euiTheme.border.radius.small,
    fontScale: 's' as const,
  },
  m: {
    height: euiTheme.size.xxl,
    radius: euiTheme.border.radius.medium,
    fontScale: 's' as const,
  },
});

const _getTokenName = (variant: string, prefix: string) => {
  const colorName = variant.charAt(0).toUpperCase() + variant.slice(1);

  return `${prefix}${colorName}`;
};
