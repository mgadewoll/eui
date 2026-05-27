/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { css, keyframes } from '@emotion/react';
import {
  logicalCSS,
  logicalTextAlignCSS,
  euiCanAnimate,
  euiCantAnimate,
  euiFontSize,
  euiTextTruncate,
} from '../../global_styling';
import {
  highContrastModeStyles,
  preventForcedColors,
} from '../../global_styling/functions/high_contrast';
import { UseEuiTheme, makeHighContrastColor } from '../../services';
import { euiText } from '../text/text.styles';

/**
 * DRY utilities for native/determinate progress components vs non-native indeterminate
 */
const crossBrowserProgressValue = (cssProperties: string) => `
  &::-webkit-progress-value {
    ${cssProperties}
  }

  &::-moz-progress-bar {
    ${cssProperties}
  }
`;
const indeterminateProgressValue = (cssProperties: string) => `
  &::before {
    ${cssProperties}
  }
`;

/**
 * Gradient fill anchored to the full track width.
 * The `<progress>` element itself is a container (`container-type: inline-size`)
 * so that `100cqi` inside its pseudo-elements always resolves to the
 * track's own inline size
 */
const gradientFillStyles = `
  background: var(--euiProgressGradient);
  background-size: 100cqi 100%;
  background-repeat: no-repeat;
  background-position: var(--euiProgressDirection) center;
`;

const crossBrowserProgressGradient = (
  euiThemeContext: UseEuiTheme,
  isNative: boolean
) => {
  const { euiTheme, highContrastMode } = euiThemeContext;

  const outlineStyles = `
  outline: ${euiTheme.border.width.thin} solid ${
    highContrastMode
      ? euiTheme.border.color
      : euiTheme.colors.backgroundBasePlain
  };`;

  if (isNative) {
    return `
      container-type: inline-size;
      ${crossBrowserProgressValue(`
        ${gradientFillStyles}
        border-radius: ${euiTheme.size.s};
        ${outlineStyles}

        ${preventForcedColors(euiThemeContext)}
      `)}

      ${highContrastModeStyles(euiThemeContext, {
        forced: `
          border: ${euiTheme.border.thin};
        `,
      })}
    `;
  }

  // Indeterminate gradient: the gradient is set directly on the <div> background
  // (overriding the track color). A single `::before` pill travels across via
  // `translateX` with a large spread box-shadow in the track color. The shadow
  // covers the gradient on both sides of the pill. The pill interior is transparent
  // so the gradient shows through, giving a rounded reveal window that sweeps left-to-right.
  return `
    background: var(--euiProgressGradient);
    background-size: 100% 100%;

    ${highContrastModeStyles(euiThemeContext, {
      preferred: `
        border: ${euiTheme.border.thin};
      `,
    })}

    &::before {
      position: absolute;
      content: '';
      ${logicalCSS('width', '100%')}
      ${logicalCSS('top', 0)}
      ${logicalCSS('bottom', 0)}
      ${logicalCSS('left', 0)}
      border-radius: ${euiTheme.size.s};
      ${outlineStyles}
      background: transparent;
      box-shadow: 0 0 0 100vw var(--euiProgressBackgroundColor); // 100vw ensures the shadow covers the entire track
      transform: translateX(-100%);

      ${euiCantAnimate} {
        display: none;
      }

      ${highContrastModeStyles(euiThemeContext, {
        forced: `
          background: var(--euiProgressGradient);

          ${preventForcedColors(euiThemeContext)}
        `,
      })}
    }
  `;
};

/**
 * Color utilities
 */

const nativeVsIndeterminateColor = (
  { euiTheme }: UseEuiTheme,
  color: string,
  isNative: boolean,
  highContrastMode: UseEuiTheme['highContrastMode']
) => {
  const selectors = isNative
    ? crossBrowserProgressValue
    : indeterminateProgressValue;
  return `
    ${selectors(`
      background-color: ${color};
      border-radius: ${euiTheme.size.s};
    `)}
    ${
      isNative && highContrastMode === 'preferred' // see highContrastModeStyles.preferred comment below
        ? `border-color: ${color};`
        : ''
    }
  `.trim();
};

/**
 * DRY utils for non-static positions
 */
const nonStaticPositioning = (isNative: boolean) => `
  ${logicalCSS('top', 0)}
  ${logicalCSS('left', 0)}
  ${logicalCSS('right', 0)}
  background-color: transparent;
  ${
    isNative
      ? `
      &::-webkit-progress-bar {
        background-color: transparent;
      }`
      : ''
  }
`;

/**
 * Animations
 */
const euiIndeterminateAnimation = keyframes`
  0% {
    transform: scaleX(1) translateX(var(--euiProgressAnimationStart));
  }
  100% {
    transform: scaleX(1) translateX(var(--euiProgressAnimationEnd));
  }
`;

/**
 * Emotion styles
 */
export const euiProgressStyles = (
  euiThemeContext: UseEuiTheme,
  isNative: boolean
) => {
  const { euiTheme, highContrastMode } = euiThemeContext;
  const backgroundColor = highContrastMode
    ? euiTheme.colors.emptyShade
    : euiTheme.colors.lightShade;

  return {
    euiProgress: css`
      --euiProgressBackgroundColor: ${backgroundColor};
      --euiProgressAnimationStart: -100%;
      --euiProgressAnimationEnd: 100%;

      background-color: var(--euiProgressBackgroundColor);
      overflow: hidden;

      &[dir='rtl'] {
        --euiProgressAnimationStart: 100%;
        --euiProgressAnimationEnd: -100%;
      }
    `,
    // https://css-tricks.com/html5-progress-element/
    // Good resource if you need to work in here. There's some gotchas with
    // dealing with cross-browser progress bars.
    native: css`
      display: block;
      ${logicalCSS('width', '100%')}

      &::-webkit-progress-bar {
        background-color: var(--euiProgressBackgroundColor);
      }

      ${highContrastModeStyles(euiThemeContext, {
        none: `
          appearance: none;
          border: none;
          border-radius: ${euiTheme.size.s};
        `,
        // For some reason we absolutely cannot set any border CSS in Windows high contrast
        // or the native element stops rendering. However, we do want the extra border for
        // MacOS high contrast, so #ternarylife
        preferred:
          highContrastMode !== 'forced'
            ? `
              border: ${euiTheme.border.thin};
              border-radius: ${euiTheme.size.s};
              ${logicalCSS('min-height', euiTheme.size.s)}
            `
            : // Increase small sizes, otherwise the border is hard to distinguish,
              // However, native element heights seem to render differently,
              // so we need to tweak the min-height accordingly
              logicalCSS('min-height', euiTheme.size.m),
        // Also doesn't render without this ¯\_(ツ)_/¯
        forced: 'background-color: revert;',
      })}

      ${euiCanAnimate} {
        /* Note: FF/Mozilla doesn't actually support animating the native progress bar
          @see https://bugzilla.mozilla.org/show_bug.cgi?id=662351 */
        ${crossBrowserProgressValue(
          `transition: width ${euiTheme.animation.normal} linear`
        )}
      }
    `,
    // An indeterminate bar has an unreliable end time. Because of a Firefox animation issue,
    // we apply this style to a <div> instead of a <progress> element.
    // See https://css-tricks.com/html5-progress-element/ for more info.
    indeterminate: css`
      &::before {
        position: absolute;
        content: '';
        ${logicalCSS('width', '100%')}
        ${logicalCSS('top', 0)}
        ${logicalCSS('bottom', 0)}
        ${logicalCSS('left', 0)}
        transform: scaleX(0) translateX(0%);
        animation: ${euiIndeterminateAnimation} 1s
          ${euiTheme.animation.resistance} infinite;

        ${euiCantAnimate} {
          animation: none;
          transform: scaleX(1) translateX(0%);
          background: repeating-linear-gradient(
            -45deg,
            transparent,
            transparent ${euiTheme.size.m},
            rgb(0, 0, 0, 0.25) ${euiTheme.size.m},
            rgb(0, 0, 0, 0.25) ${euiTheme.size.l}
          );
        }

        ${highContrastModeStyles(euiThemeContext, {
          // Windows high contrast themes ignore backgrounds, so use a border instead
          forced: `
            ${logicalCSS('border-top-style', 'solid')}
            ${logicalCSS('border-top-color', 'transparent')}
          `,
        })}
      }
    `,
    // Sizes
    _sharedSizeCSS: (size: string) => `
      ${logicalCSS('height', size)}
      border-radius: ${euiTheme.size.s};
      ${highContrastModeStyles(euiThemeContext, {
        forced: `
          &::before {
            ${logicalCSS('border-top-width', size)}
          }`,
      })}
    `,
    get xs() {
      return css(
        // Increased visibility/size for high contrast modes
        this._sharedSizeCSS(
          highContrastMode ? euiTheme.size.xs : euiTheme.size.xxs
        )
      );
    },
    get s() {
      return css(this._sharedSizeCSS(euiTheme.size.xs));
    },
    get m() {
      return css(this._sharedSizeCSS(euiTheme.size.s));
    },
    get l() {
      return css(this._sharedSizeCSS(euiTheme.size.m));
    },
    // Positioning
    fixed: css`
      position: fixed;
      z-index: ${Number(euiTheme.levels.header) + 1};
      ${nonStaticPositioning(isNative)}
    `,
    absolute: css`
      position: absolute;
      ${nonStaticPositioning(isNative)}
      ${logicalCSS('border-top-left-radius', 'inherit')}
      ${logicalCSS('border-top-right-radius', 'inherit')}
    `,
    static: css`
      position: relative;
    `,
    // Colors
    primary: css`
      ${nativeVsIndeterminateColor(
        euiThemeContext,
        euiTheme.colors.primary,
        isNative,
        highContrastMode
      )}
    `,
    success: css`
      ${nativeVsIndeterminateColor(
        euiThemeContext,
        euiTheme.colors.success,
        isNative,
        highContrastMode
      )}
    `,
    warning: css`
      ${nativeVsIndeterminateColor(
        euiThemeContext,
        euiTheme.colors.warning,
        isNative,
        highContrastMode
      )}
    `,
    danger: css`
      ${nativeVsIndeterminateColor(
        euiThemeContext,
        euiTheme.colors.danger,
        isNative,
        highContrastMode
      )}
    `,
    subdued: css`
      ${nativeVsIndeterminateColor(
        euiThemeContext,
        euiTheme.colors.textSubdued,
        isNative,
        highContrastMode
      )}
    `,
    accent: css`
      ${nativeVsIndeterminateColor(
        euiThemeContext,
        euiTheme.colors.accent,
        isNative,
        highContrastMode
      )}
    `,
    accentSecondary: css`
      ${nativeVsIndeterminateColor(
        euiThemeContext,
        euiTheme.colors.accentSecondary,
        isNative,
        highContrastMode
      )}
    `,
    vis0: css`
      ${nativeVsIndeterminateColor(
        euiThemeContext,
        euiTheme.colors.vis.euiColorVis0,
        isNative,
        highContrastMode
      )}
    `,
    vis1: css`
      ${nativeVsIndeterminateColor(
        euiThemeContext,
        euiTheme.colors.vis.euiColorVis1,
        isNative,
        highContrastMode
      )}
    `,
    vis2: css`
      ${nativeVsIndeterminateColor(
        euiThemeContext,
        euiTheme.colors.vis.euiColorVis2,
        isNative,
        highContrastMode
      )}
    `,
    vis3: css`
      ${nativeVsIndeterminateColor(
        euiThemeContext,
        euiTheme.colors.vis.euiColorVis3,
        isNative,
        highContrastMode
      )}
    `,
    vis4: css`
      ${nativeVsIndeterminateColor(
        euiThemeContext,
        euiTheme.colors.vis.euiColorVis4,
        isNative,
        highContrastMode
      )}
    `,
    vis5: css`
      ${nativeVsIndeterminateColor(
        euiThemeContext,
        euiTheme.colors.vis.euiColorVis5,
        isNative,
        highContrastMode
      )}
    `,
    vis6: css`
      ${nativeVsIndeterminateColor(
        euiThemeContext,
        euiTheme.colors.vis.euiColorVis6,
        isNative,
        highContrastMode
      )}
    `,
    vis7: css`
      ${nativeVsIndeterminateColor(
        euiThemeContext,
        euiTheme.colors.vis.euiColorVis7,
        isNative,
        highContrastMode
      )}
    `,
    vis8: css`
      ${nativeVsIndeterminateColor(
        euiThemeContext,
        euiTheme.colors.vis.euiColorVis8,
        isNative,
        highContrastMode
      )}
    `,
    vis9: css`
      ${nativeVsIndeterminateColor(
        euiThemeContext,
        euiTheme.colors.vis.euiColorVis9,
        isNative,
        highContrastMode
      )}
    `,
    customColor: css`
      ${nativeVsIndeterminateColor(
        euiThemeContext,
        'currentColor',
        isNative,
        highContrastMode
      )}
    `,
    gradient: css`
      ${crossBrowserProgressGradient(euiThemeContext, isNative)}

      ${!isNative &&
      css`
        &::before {
          animation: ${euiIndeterminateAnimation} 1s
            ${euiTheme.animation.resistance} infinite;
        }
      `}
    `,
  };
};

/**
 * Data styles
 */
export const euiProgressDataStyles = (euiThemeContext: UseEuiTheme) => ({
  euiProgress__data: css`
    display: flex;
    justify-content: space-between;
    gap: ${euiThemeContext.euiTheme.size.xs};
    ${euiText(euiThemeContext.euiTheme)}
    ${euiFontSize(euiThemeContext, 'xs')}
  `,
  // Sizes
  l: css`
    ${euiFontSize(euiThemeContext, 's')}
  `,
});

export const euiProgressLabelStyles = {
  euiProgress__label: css`
    flex-grow: 1;
    ${euiTextTruncate()}
  `,
};

export const euiProgressValueTextStyles = ({ euiTheme }: UseEuiTheme) => ({
  euiProgress__valueText: css`
    flex-grow: 1;
    flex-shrink: 0;
    font-feature-settings: 'tnum' 1; /* Tabular numbers ensure the line up nicely when right-aligned */
    ${logicalTextAlignCSS('right')}
    ${euiTextTruncate()}
  `,
  // Colors
  primary: css`
    color: ${euiTheme.colors.textPrimary};
  `,
  success: css`
    color: ${euiTheme.colors.textSuccess};
  `,
  warning: css`
    color: ${euiTheme.colors.textWarning};
  `,
  danger: css`
    color: ${euiTheme.colors.textDanger};
  `,
  subdued: css`
    color: ${euiTheme.colors.textSubdued};
  `,
  accent: css`
    color: ${euiTheme.colors.textAccent};
  `,
  accentSecondary: css`
    color: ${euiTheme.colors.textAccentSecondary};
  `,
  vis0: css`
    color: ${makeHighContrastColor(euiTheme.colors.vis.euiColorVis0)(euiTheme)};
  `,
  vis1: css`
    color: ${makeHighContrastColor(euiTheme.colors.vis.euiColorVis1)(euiTheme)};
  `,
  vis2: css`
    color: ${makeHighContrastColor(euiTheme.colors.vis.euiColorVis2)(euiTheme)};
  `,
  vis3: css`
    color: ${makeHighContrastColor(euiTheme.colors.vis.euiColorVis3)(euiTheme)};
  `,
  vis4: css`
    color: ${makeHighContrastColor(euiTheme.colors.vis.euiColorVis4)(euiTheme)};
  `,
  vis5: css`
    color: ${makeHighContrastColor(euiTheme.colors.vis.euiColorVis5)(euiTheme)};
  `,
  vis6: css`
    color: ${makeHighContrastColor(euiTheme.colors.vis.euiColorVis6)(euiTheme)};
  `,
  vis7: css`
    color: ${makeHighContrastColor(euiTheme.colors.vis.euiColorVis7)(euiTheme)};
  `,
  vis8: css`
    color: ${makeHighContrastColor(euiTheme.colors.vis.euiColorVis8)(euiTheme)};
  `,
  vis9: css`
    color: ${makeHighContrastColor(euiTheme.colors.vis.euiColorVis9)(euiTheme)};
  `,
  customColor: css`
    color: currentColor;
  `,
});
