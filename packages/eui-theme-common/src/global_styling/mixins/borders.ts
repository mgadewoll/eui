/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { UseEuiTheme } from '../../services/theme/types';

const logicalSide = {
  left: 'inline-start',
  right: 'inline-end',
  top: 'block-start',
  bottom: 'block-end',
  horizontal: 'inline',
  vertical: 'block',
};

export type BorderDirection =
  | 'left'
  | 'right'
  | 'top'
  | 'bottom'
  | 'horizontal'
  | 'vertical'
  | 'all';

export const euiBorderStyles = (
  euiThemeContext: UseEuiTheme,
  options: {
    direction?: BorderDirection;
    borderColor?: string;
    borderWidth?: string;
    borderStyle?: string;
  }
) => {
  const { euiTheme } = euiThemeContext;
  const {
    direction = 'all',
    borderColor = euiTheme.border.color,
    borderWidth = euiTheme.border.width.thin,
    borderStyle = 'solid',
  } = options;
  const borderProperty =
    direction === 'all' ? 'border' : `border-${logicalSide[direction]}`;

  return `
    &::after {
      content: '';
      position: absolute;
      /* ensure to keep on top of flush content */
      z-index: 0;
      inset: 0;
      ${borderProperty}: ${borderWidth} ${borderStyle} ${borderColor};
      border-radius: inherit;
      pointer-events: none;
    }
  `;
};
