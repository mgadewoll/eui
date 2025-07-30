/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import type { UseEuiTheme } from '../../services/theme/types';
import { boxShadowToFilterDropShadow } from '../functions';
import { _EuiThemeShadowSize } from '../variables/shadow';
import { BorderDirection, euiBorderStyles } from './borders';

export interface EuiShadowOptions {
  /** @deprecated */
  color?: string;
  /** @default `down` */
  direction?: 'down' | 'up';
  /**
   * Note: not supported by all shadow utilities.
   */
  property?: 'box-shadow' | 'filter';
  borderAllInHighContrastMode?: boolean;
  border?: BorderDirection | 'none';
}

/**
 * euiSlightShadow
 */
export const euiShadowXSmall = (
  euiThemeContext: UseEuiTheme,
  options?: EuiShadowOptions
) => {
  const { euiTheme, highContrastMode } = euiThemeContext;

  if (highContrastMode) {
    return _highContrastBorder(euiTheme, options);
  }
  const direction = options?.direction ?? 'down';

  return shadowStyles(euiThemeContext, euiTheme.shadows.xs[direction], {
    border: options?.border,
  });
};

/**
 * bottomShadowSmall
 */
export const euiShadowSmall = (
  euiThemeContext: UseEuiTheme,
  options?: EuiShadowOptions
) => {
  const { euiTheme, highContrastMode } = euiThemeContext;

  if (highContrastMode) {
    return _highContrastBorder(euiTheme, options);
  }
  const direction = options?.direction ?? 'down';

  return shadowStyles(euiThemeContext, euiTheme.shadows.s[direction], {
    border: options?.border,
  });
};

/**
 * bottomShadowMedium
 */
export const euiShadowMedium = (
  euiThemeContext: UseEuiTheme,
  options?: EuiShadowOptions
) => {
  const { euiTheme, highContrastMode } = euiThemeContext;

  if (highContrastMode) {
    return _highContrastBorder(euiTheme, options);
  }
  const direction = options?.direction ?? 'down';
  const boxShadow = euiTheme.shadows.m[direction];

  if (options?.property === 'filter') {
    return boxShadow
      ? shadowStyles(euiThemeContext, boxShadowToFilterDropShadow(boxShadow), {
          border: options?.border,
          type: 'filter',
        })
      : '';
  }

  return shadowStyles(euiThemeContext, boxShadow, {
    border: options?.border,
  });
};

/**
 * bottomShadow
 */
export const euiShadowLarge = (
  euiThemeContext: UseEuiTheme,
  options?: EuiShadowOptions
) => {
  const { euiTheme, highContrastMode } = euiThemeContext;

  if (highContrastMode) {
    return _highContrastBorder(euiTheme, options);
  }
  const direction = options?.direction ?? 'down';

  return shadowStyles(euiThemeContext, euiTheme.shadows.l[direction], {
    border: options?.border,
  });
};

/**
 * bottomShadowLarge
 */
export interface EuiShadowXLarge extends EuiShadowOptions {
  reverse?: boolean;
}
export const euiShadowXLarge = (
  euiThemeContext: UseEuiTheme,
  options?: EuiShadowXLarge
) => {
  const { euiTheme, highContrastMode } = euiThemeContext;

  if (highContrastMode) {
    return _highContrastBorder(euiTheme, options);
  }
  const direction = options?.direction ?? 'down';

  return shadowStyles(euiThemeContext, euiTheme.shadows.xl[direction], {
    border: options?.border,
  });
};

export const euiShadowXLargeHover = (
  euiThemeContext: UseEuiTheme,
  options?: EuiShadowXLarge
) => {
  const { euiTheme, highContrastMode } = euiThemeContext;

  if (highContrastMode) {
    return _highContrastBorder(euiTheme, options);
  }
  const reverse = options?.reverse ?? false;
  const direction = options?.direction ?? reverse ? 'up' : 'down';

  return shadowStyles(euiThemeContext, euiTheme.shadows.hover.xl[direction], {
    border: options?.border,
  });
};

/**
 * @deprecated slightShadowHover
 */
export const euiSlightShadowHover = (
  euiThemeContext: UseEuiTheme,
  options?: EuiShadowOptions
) => {
  const { euiTheme, highContrastMode } = euiThemeContext;

  if (highContrastMode) {
    return _highContrastBorder(euiTheme, options);
  }
  const direction = options?.direction ?? 'down';

  return shadowStyles(euiThemeContext, euiTheme.shadows.s[direction], {
    border: options?.border,
  });
};

/**
 * Special size to be used exclusively in hover states
 * of bordered panels.
 */
export const euiShadowHover = (
  euiThemeContext: UseEuiTheme,
  options?: EuiShadowOptions
) => {
  const { euiTheme, highContrastMode } = euiThemeContext;

  if (highContrastMode) {
    return _highContrastBorder(euiTheme, options);
  }
  const direction = options?.direction ?? 'down';

  return shadowStyles(euiThemeContext, euiTheme.shadows.hover.base[direction], {
    border: options?.border,
  });
};

/**
 * bottomShadowFlat
 *
 * Similar to shadow medium but without the bottom depth.
 * Useful for popovers that drop UP rather than DOWN.
 */
export const euiShadowFlat = (
  euiThemeContext: UseEuiTheme,
  options?: EuiShadowOptions
) => {
  const { euiTheme, highContrastMode } = euiThemeContext;

  if (highContrastMode) {
    return _highContrastBorder(euiTheme, options);
  }
  const direction = options?.direction ?? 'down';
  const value =
    euiTheme.shadows.flat?.[direction] ?? euiTheme.shadows.xs[direction];

  return shadowStyles(euiThemeContext, value, {
    border: options?.border,
  });
};

export const euiShadow = (
  euiThemeContext: UseEuiTheme,
  size: _EuiThemeShadowSize | 'hover' = 'l',
  options?: EuiShadowOptions
) => {
  if (euiThemeContext.highContrastMode) {
    return _highContrastBorder(euiThemeContext.euiTheme, options);
  }

  switch (size) {
    case 'xs':
      return euiShadowXSmall(euiThemeContext, options);
    case 's':
      return euiShadowSmall(euiThemeContext, options);
    case 'm':
      return euiShadowMedium(euiThemeContext, options);
    case 'l':
      return euiShadowLarge(euiThemeContext, options);
    case 'xl':
      return euiShadowXLarge(euiThemeContext, options);
    case 'xlHover':
      return euiShadowXLargeHover(euiThemeContext, options);
    case 'hover':
      return euiShadowHover(euiThemeContext, options);

    default:
      console.warn('Please provide a valid size option to useEuiShadow');
      return '';
  }
};

/**
 * Internal utilities for replacing shadows with high contrast borders instead.
 * NOTE: Windows' high contrast themes ignore *all* `box-shadow` CSS,
 * so we use `border` CSS explicitly instead of shadows
 */

const _highContrastBorder = (
  { border }: UseEuiTheme['euiTheme'],
  { borderAllInHighContrastMode }: EuiShadowOptions = {}
) => {
  return borderAllInHighContrastMode
    ? `border: ${border.thin};`
    : `border-block-end: ${border.thin};`;
};

const shadowStyles = (
  euiThemeContext: UseEuiTheme,
  shadow: string | undefined,
  options: {
    border?: EuiShadowOptions['border'];
    type?: 'box-shadow' | 'filter';
  }
) => {
  const { border = 'all', type = 'box-shadow' } = options;
  const borderStyle =
    euiThemeContext.colorMode === 'DARK' && border !== 'none'
      ? `${euiBorderStyles(euiThemeContext, {
          direction: border ?? 'all',
        })}`
      : '';
  const shadowStyle = type === 'filter' ? shadow : `box-shadow: ${shadow};`;

  console.log('shadowStyles', shadowStyle, borderStyle);

  return `
    ${shadowStyle};
    ${borderStyle};
  `;
};
