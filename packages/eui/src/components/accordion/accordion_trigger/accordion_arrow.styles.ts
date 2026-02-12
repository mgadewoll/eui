/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { css } from '@emotion/react';

import { UseEuiTheme } from '../../../services';
import { euiButtonSizeMap, logicalCSS } from '../../../global_styling';

export const euiAccordionArrowStyles = (euiThemeContext: UseEuiTheme) => {
  const { euiTheme } = euiThemeContext;
  const buttonSizes = euiButtonSizeMap(euiThemeContext);

  return {
    euiAccordion__arrow: css`
      z-index: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      block-size: ${buttonSizes.xs.height};
      inline-size: ${buttonSizes.xs.height};
      border-radius: ${euiTheme.border.radius.small};
    `,
    left: css`
      ${logicalCSS('margin-right', euiTheme.size.xs)}
    `,
    right: css`
      ${logicalCSS('margin-left', euiTheme.size.xs)}
    `,
    // !important overrides EuiButtonIcon's default transforms
    isClosed: css`
      /* stylelint-disable-next-line declaration-no-important */
      transform: rotate(0deg) !important;
    `,
    isOpen: css`
      /* stylelint-disable-next-line declaration-no-important */
      transform: rotate(90deg) !important;
    `,
    isDisabled: css`
      color: ${euiTheme.colors.textDisabled};
    `,
    isHovered: css`
      background-color: ${euiTheme.components.buttons.backgroundEmptyTextHover};
    `,
  };
};
