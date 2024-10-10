/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { css, keyframes, type SerializedStyles } from '@emotion/react';
import { _EuiThemeButtonColors, euiCanAnimate } from '../index';
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
  const bevelColorToken =
    `buttonSecondaryBevelColor${colorName}` as keyof _EuiThemeButtonColors;

  return {
    color: euiTheme.colors[colorToken],
    backgroundColor: euiTheme.colors[backgroundToken],
    borderColor: euiTheme.colors[borderColorToken],
    bevelColor: euiTheme.colors[bevelColorToken],
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
    'buttonBackground',
    color
  ) as keyof _EuiThemeButtonColors;
  const backgroundHoverToken = _getTokenName(
    'buttonBackground',
    color,
    'hovered'
  ) as keyof _EuiThemeButtonColors;
  const colorToken = _getTokenName(
    'buttonColor',
    color
  ) as keyof _EuiThemeButtonColors;
  const bevelColorToken = _getTokenName(
    'buttonBevelColor',
    color
  ) as keyof _EuiThemeButtonColors;
  const borderColorToken = _getTokenName(
    'buttonBorderColor',
    color
  ) as keyof _EuiThemeButtonColors;

  return {
    color: euiTheme.colors[colorToken],
    backgroundColor: euiTheme.colors[backgroundToken],
    backgroundColorHovered: euiTheme.colors[backgroundHoverToken],
    borderColor: euiTheme.colors[borderColorToken],
    bevelColor: euiTheme.colors[bevelColorToken],
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
    'buttonEmptyBackground',
    color
  ) as keyof _EuiThemeButtonColors;

  const colorToken = _getTokenName(
    'buttonEmptyColor',
    color
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

const buttonBevelStyles = ({
  colorMode,
  borderWidth,
  borderColor,
  borderColorHovered,
  bevelColor,
}: {
  colorMode?: EuiThemeColorModeStandard;
  borderWidth: CSSProperties['borderWidth'];
  borderColor?: CSSProperties['borderColor'];
  borderColorHovered?: CSSProperties['borderColor'];
  bevelColor?: CSSProperties['borderColor'];
}) => {
  const _bevelColor = bevelColor ?? 'transparent';
  const direction = colorMode === 'DARK' ? 1 : -1;

  const getBoxShadow = (isHover = false) => {
    const _borderColor = isHover ? borderColorHovered : borderColor;
    const bottomBevelShadow = `inset 0 calc(${borderWidth} * ${direction}) 0 0 ${_bevelColor}`;
    const bevelShadow = `${bottomBevelShadow}, inset 0 1px 0 0 ${_borderColor},
          inset 1px 0 0 0 ${_borderColor}, inset -1px 0 0 0 ${_borderColor}`;

    return bevelShadow;
  };

  const hoverStyles =
    borderColorHovered &&
    css`
      &:hover,
      &:focus,
      &:active {
        &::after {
          content: '';
          position: absolute;
          inset: -${borderWidth};
          border-radius: inherit;
          pointer-events: none;
          box-shadow: ${getBoxShadow(true)};
        }
      }
    `;

  return css`
    /* adding the "fake" border as ::after to ensure expected design */
    &:not(:focus-visible) {
      &::after {
        content: '';
        position: absolute;
        inset: -${borderWidth};
        border-radius: inherit;
        pointer-events: none;
        /* uses box-shadow as border to ensure smooth connection between bevel and border */
        box-shadow: ${getBoxShadow()};
      }

      ${hoverStyles}
    }
  `;
};

const euiButtonDisplaysColors = (euiThemeContext: UseEuiTheme) => {
  const COLORS = [...BUTTON_COLORS, 'disabled'] as const;
  type Colors = (typeof COLORS)[number];

  const displaysColorsMap = {} as Record<
    _EuiButtonDisplay,
    Record<Colors, SerializedStyles>
  >;

  const buttonGradientStyle = (
    borderWidth: CSSProperties['borderWidth'],
    ratio: number = 0.1
  ) => css`
    &:hover,
    &:focus,
    &:focus-visible,
    &:active {
      &::before {
        content: '';
        position: absolute;
        z-index: 0;
        inset: -${borderWidth};
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
          const hasNewThemeStyles = euiTheme.colors.buttonBorderColor != null;
          const hasHoverBackground =
            euiTheme.colors.buttonSecondaryBackgroundHovered != null;

          const newStyles =
            hasNewThemeStyles &&
            css`
              /* use border as base under box-shadow to ensure round corners */
              border: ${euiTheme.border.width.thin} solid
                ${buttonStyles.borderColor};

              ${buttonBevelStyles({
                colorMode,
                borderWidth: euiTheme.border.width.thin,
                borderColor: buttonStyles.borderColor,
                bevelColor: buttonStyles.bevelColor,
              })}

              ${color !== 'disabled' &&
              (hasHoverBackground
                ? `
                    &:hover,
                    &:focus,
                    &:active {
                      background-color: ${euiTheme.colors.buttonSecondaryBackgroundHovered}
                    }
                  `
                : buttonGradientStyle(euiTheme.border.width.thin, 0.05))}
            `;

          displaysColorsMap[display][color] = css`
            background-color: ${buttonStyles.backgroundColor};
            color: ${buttonStyles.color};

            ${newStyles}
          `;
          break;
        }

        case 'fill': {
          const { euiTheme, colorMode } = euiThemeContext;
          // new theme specific style flag
          const buttonStyles = euiButtonFillColor(euiThemeContext, color);
          const hasNewThemeStyles = euiTheme.colors.buttonBorderColor != null;
          const hasPrimaryBackgroundHover =
            euiTheme.colors.buttonBackgroundPrimaryHovered != null;

          const hoverStyles =
            color !== 'disabled'
              ? hasPrimaryBackgroundHover
                ? css`
                    &:hover,
                    &:focus,
                    &:active {
                      border: ${euiTheme.border.width.thin} solid
                        ${buttonStyles.backgroundColorHovered};
                      background-color: ${buttonStyles.backgroundColorHovered};
                    }
                  `
                : buttonGradientStyle(euiTheme.border.width.thin)
              : undefined;

          const newStyles =
            hasNewThemeStyles &&
            css`
              border: ${euiTheme.border.width.thin} solid
                ${buttonStyles.borderColor};

              ${color !== 'disabled' &&
              buttonBevelStyles({
                colorMode,
                borderWidth: euiTheme.border.width.thin,
                borderColor: buttonStyles.borderColor,
                borderColorHovered: hasPrimaryBackgroundHover
                  ? buttonStyles.backgroundColorHovered
                  : undefined,
                bevelColor: buttonStyles.bevelColor,
              })}

              ${hoverStyles}
            `;

          displaysColorsMap[display][color] = css`
            background-color: ${buttonStyles.backgroundColor};
            color: ${buttonStyles.color};

            ${newStyles}
          `;
          break;
        }

        case 'empty': {
          const { euiTheme } = euiThemeContext;
          // new theme specific style flag
          const buttonStyles = euiButtonEmptyColor(euiThemeContext, color);
          const hasNewThemeStyles = euiTheme.colors.buttonBorderColor != null;

          const newStyles =
            hasNewThemeStyles &&
            color !== 'disabled' &&
            css`
              &:hover,
              &:focus,
              &:active {
                background-color: ${euiTheme.colors
                  .buttonEmptyBackgroundHovered};
              }
            `;

          displaysColorsMap[display][color] = css`
            color: ${buttonStyles.color};
            /* keep same dimension with filled/base versions */
            border: 1px solid transparent;

            &:focus,
            &:active {
              background-color: ${buttonStyles.backgroundColor};
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
      transition: transform ${euiTheme.animation.normal} ease-in-out;

      &:hover:not(:disabled) {
        transform: translateY(-1px);
        /* transition background only on hover makes the mouse enter transition smooth and the mouse leave snappy */
        transition: transform ${euiTheme.animation.normal} ease-in-out,
          background-color ${euiTheme.animation.normal} ease-in-out;
      }

      &:focus {
        animation: ${euiButtonFocusAnimation} ${euiTheme.animation.normal}
          ${euiTheme.animation.bounce};
      }

      &:active:not(:disabled) {
        transform: translateY(-1px);
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

const _getTokenName = (prefix: string, variant: string, suffix?: string) => {
  const colorName = variant.charAt(0).toUpperCase() + variant.slice(1);
  const _suffix = suffix
    ? suffix.charAt(0).toUpperCase() + suffix.slice(1)
    : '';

  return `${prefix}${colorName}${_suffix}`;
};
