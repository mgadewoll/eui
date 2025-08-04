/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import {
  formatMultipleBoxShadow,
  type _EuiThemeShadows,
  type _EuiThemeShadowPrimitives,
} from '@elastic/eui-theme-common';
import { SEMANTIC_COLORS } from './colors/_semantic_colors';
import { PRIMITIVE_COLORS } from './colors/_primitive_colors';

/**
 * This structure holds "primitives" (or actual design tokens as they
 * would be stored in a design token repository).
 * Not exposing them in the theme object is intentional.
 */
export const shadowPrimitives: _EuiThemeShadowPrimitives = {
  xs: {
    light: [
      {
        opacity: 0.16,
        x: 0,
        y: 0,
        blur: 2,
        spread: 0,
      },
      {
        opacity: 0.06,
        x: 0,
        y: 1,
        blur: 4,
        spread: 0,
      },
      {
        opacity: 0.04,
        x: 0,
        y: 2,
        blur: 8,
        spread: 0,
      },
    ],
    dark: [
      {
        opacity: 1,
        x: 0,
        y: 0,
        blur: 0,
        spread: 1,
      },
      {
        opacity: 0.4,
        x: 0,
        y: 1,
        blur: 4,
        spread: 0,
      },
      {
        opacity: 0.24,
        x: 0,
        y: 2,
        blur: 8,
        spread: 0,
      },
    ],
  },
  s: {
    light: [
      {
        opacity: 0.16,
        x: 0,
        y: 0,
        blur: 2,
        spread: 0,
      },
      {
        opacity: 0.08,
        x: 0,
        y: 2,
        blur: 7,
        spread: 0,
      },
      {
        opacity: 0.05,
        x: 0,
        y: 4,
        blur: 11,
        spread: 0,
      },
    ],
    dark: [
      {
        opacity: 1,
        x: 0,
        y: 0,
        blur: 0,
        spread: 1,
      },
      {
        opacity: 0.46,
        x: 0,
        y: 2,
        blur: 7,
        spread: 0,
      },
      {
        opacity: 0.26,
        x: 0,
        y: 4,
        blur: 11,
        spread: 0,
      },
    ],
  },
  m: {
    light: [
      {
        opacity: 0.16,
        x: 0,
        y: 0,
        blur: 2,
        spread: 0,
      },
      {
        opacity: 0.1,
        x: 0,
        y: 3,
        blur: 10,
        spread: 0,
      },
      {
        opacity: 0.06,
        x: 0,
        y: 6,
        blur: 14,
        spread: 0,
      },
    ],
    dark: [
      {
        opacity: 1,
        x: 0,
        y: 0,
        blur: 0,
        spread: 1,
      },
      {
        opacity: 0.52,
        x: 0,
        y: 3,
        blur: 10,
        spread: 0,
      },
      {
        opacity: 0.28,
        x: 0,
        y: 6,
        blur: 14,
        spread: 0,
      },
    ],
  },
  l: {
    light: [
      {
        opacity: 0.16,
        x: 0,
        y: 0,
        blur: 2,
        spread: 0,
      },
      {
        opacity: 0.12,
        x: 0,
        y: 4,
        blur: 13,
        spread: 0,
      },
      {
        opacity: 0.07,
        x: 0,
        y: 8,
        blur: 17,
        spread: 0,
      },
    ],
    dark: [
      {
        opacity: 1,
        x: 0,
        y: 0,
        blur: 0,
        spread: 1,
      },
      {
        opacity: 0.58,
        x: 0,
        y: 4,
        blur: 13,
        spread: 0,
      },
      {
        opacity: 0.3,
        x: 0,
        y: 8,
        blur: 17,
        spread: 0,
      },
    ],
  },
  xl: {
    light: [
      {
        opacity: 0.16,
        x: 0,
        y: 0,
        blur: 2,
        spread: 0,
      },
      {
        opacity: 0.14,
        x: 0,
        y: 5,
        blur: 16,
        spread: 0,
      },
      {
        opacity: 0.08,
        x: 0,
        y: 10,
        blur: 20,
        spread: 0,
      },
    ],
    dark: [
      {
        opacity: 1,
        x: 0,
        y: 0,
        blur: 0,
        spread: 1,
      },
      {
        opacity: 0.64,
        x: 0,
        y: 5,
        blur: 16,
        spread: 0,
      },
      {
        opacity: 0.32,
        x: 0,
        y: 10,
        blur: 20,
        spread: 0,
      },
    ],
  },
  xxl: {
    light: [
      {
        opacity: 0.16,
        x: 0,
        y: 0,
        blur: 2,
        spread: 0,
      },
      {
        opacity: 0.16,
        x: 0,
        y: 6,
        blur: 19,
        spread: 0,
      },
      {
        opacity: 0.09,
        x: 0,
        y: 12,
        blur: 23,
        spread: 0,
      },
    ],
    dark: [
      {
        opacity: 1,
        x: 0,
        y: 0,
        blur: 0,
        spread: 1,
      },
      {
        opacity: 0.7,
        x: 0,
        y: 6,
        blur: 19,
        spread: 0,
      },
      {
        opacity: 0.34,
        x: 0,
        y: 12,
        blur: 23,
        spread: 0,
      },
    ],
  },
  flat: {
    light: [],
    dark: [],
  },
};

const shadowColorsLight = {
  colors: {
    base: SEMANTIC_COLORS.shade120,
  },
};

const shadowsLight = {
  ...shadowColorsLight,
  xs: {
    down: formatMultipleBoxShadow(shadowPrimitives.xs.light),
    up: formatMultipleBoxShadow(shadowPrimitives.xs.light, {
      direction: 'up',
      ...shadowColorsLight,
    }),
  },
  s: {
    down: formatMultipleBoxShadow(shadowPrimitives.s.light),
    up: formatMultipleBoxShadow(shadowPrimitives.s.light, {
      direction: 'up',
      ...shadowColorsLight,
    }),
  },
  m: {
    down: formatMultipleBoxShadow(shadowPrimitives.m.light),
    up: formatMultipleBoxShadow(shadowPrimitives.m.light, {
      direction: 'up',
      ...shadowColorsLight,
    }),
  },
  l: {
    down: formatMultipleBoxShadow(shadowPrimitives.l.light),
    up: formatMultipleBoxShadow(shadowPrimitives.l.light, {
      direction: 'up',
      ...shadowColorsLight,
    }),
  },
  xl: {
    down: formatMultipleBoxShadow(shadowPrimitives.xl.light),
    up: formatMultipleBoxShadow(shadowPrimitives.xl.light, {
      direction: 'up',
      ...shadowColorsLight,
    }),
  },
  hover: {
    base: {
      down: formatMultipleBoxShadow(shadowPrimitives.s.light),
      up: formatMultipleBoxShadow(shadowPrimitives.s.light, {
        direction: 'up',
        ...shadowColorsLight,
      }),
    },
    xl: {
      down: formatMultipleBoxShadow(shadowPrimitives.xxl.light),
      up: formatMultipleBoxShadow(shadowPrimitives.xxl.light, {
        direction: 'up',
        ...shadowColorsLight,
      }),
    },
  },
  flat: {
    down: formatMultipleBoxShadow(shadowPrimitives.xs.light),
    up: formatMultipleBoxShadow(shadowPrimitives.xs.light, {
      direction: 'up',
      ...shadowColorsLight,
    }),
  },
};

const shadowColorsDark = {
  colors: {
    base: PRIMITIVE_COLORS.black,
  },
};

const shadowsDark = {
  ...shadowColorsDark,
  xs: {
    down: formatMultipleBoxShadow(shadowPrimitives.xs.dark.slice(1)),
    up: formatMultipleBoxShadow(shadowPrimitives.xs.dark.slice(1), {
      direction: 'up',
      ...shadowColorsDark,
    }),
  },
  s: {
    down: formatMultipleBoxShadow(shadowPrimitives.s.dark.slice(1)),
    up: formatMultipleBoxShadow(shadowPrimitives.s.dark.slice(1), {
      direction: 'up',
      ...shadowColorsDark,
    }),
  },
  m: {
    down: formatMultipleBoxShadow(shadowPrimitives.m.dark.slice(1)),
    up: formatMultipleBoxShadow(shadowPrimitives.m.dark.slice(1), {
      direction: 'up',
      ...shadowColorsDark,
    }),
  },
  l: {
    down: formatMultipleBoxShadow(shadowPrimitives.l.dark.slice(1)),
    up: formatMultipleBoxShadow(shadowPrimitives.l.dark.slice(1), {
      direction: 'up',
      ...shadowColorsDark,
    }),
  },
  xl: {
    down: formatMultipleBoxShadow(shadowPrimitives.xl.dark.slice(1)),
    up: formatMultipleBoxShadow(shadowPrimitives.xl.dark.slice(1), {
      direction: 'up',
      ...shadowColorsDark,
    }),
  },
  hover: {
    base: {
      down: formatMultipleBoxShadow(shadowPrimitives.s.dark),
      up: formatMultipleBoxShadow(shadowPrimitives.s.dark, {
        direction: 'up',
        ...shadowColorsDark,
      }),
    },
    xl: {
      down: formatMultipleBoxShadow(shadowPrimitives.xxl.dark),
      up: formatMultipleBoxShadow(shadowPrimitives.xxl.dark, {
        direction: 'up',
        ...shadowColorsDark,
      }),
    },
  },
  flat: {
    down: formatMultipleBoxShadow(shadowPrimitives.xs.dark.slice(1)),
    up: formatMultipleBoxShadow(shadowPrimitives.xs.dark.slice(1), {
      direction: 'up',
      ...shadowColorsDark,
    }),
  },
};

export const shadows: _EuiThemeShadows = {
  LIGHT: shadowsLight,
  DARK: shadowsDark,
};
