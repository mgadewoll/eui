/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { css } from '@emotion/react';

import { UseEuiTheme } from '../../../services';
import {
  euiButtonSizeMap,
  euiDisabledSelector,
  euiFontSize,
  logicalCSS,
  logicalTextAlignCSS,
} from '../../../global_styling';
import { euiAccordionArrowStyles } from './accordion_arrow.styles';

export const euiAccordionButtonStyles = (euiThemeContext: UseEuiTheme) => {
  const { euiTheme } = euiThemeContext;
  const buttonSizes = euiButtonSizeMap(euiThemeContext);
  const arrowStyles = euiAccordionArrowStyles(euiThemeContext);

  return {
    euiAccordion__button: css`
      ${euiFontSize(euiThemeContext, 's')}
      z-index: 1;
      align-items: center;
      display: flex;
      flex-grow: 1;
      line-height: ${euiTheme.size.l};
      ${logicalTextAlignCSS('left')}
      ${logicalCSS('width', '100%')}

      &:hover,
      &:focus {
        cursor: pointer;
        text-decoration: underline;
      }

      &:not(:is(${euiDisabledSelector})):has(
          .euiAccordionButton__fauxArrow:hover
        ) {
        ~ .euiAccordion__arrow {
          ${arrowStyles.isHovered}
        }
      }
    `,
    // Triggering button needs separate `disabled` key because the element that renders may not support `:disabled`;
    // Hover pseudo selector for specificity
    disabled: css`
      &,
      &:hover {
        cursor: not-allowed;
        color: ${euiTheme.colors.disabledText};
        text-decoration: none;
      }
    `,
    // Optional padding sizes
    s: css`
      padding: ${euiTheme.size.s};
    `,
    m: css`
      padding: ${euiTheme.size.base};
    `,
    l: css`
      padding: ${euiTheme.size.l};
    `,
    // Remove padding from the accordion button on the side that the arrow is on
    arrowLeft: css`
      ${logicalCSS('padding-left', 0)}
    `,
    arrowRight: css`
      ${logicalCSS('padding-right', 0)}
    `,
    fauxArrow: {
      fauxArrow: css`
        position: absolute;
        inset-block-start: 0;
        block-size: ${buttonSizes.xs.height};
        inline-size: ${buttonSizes.xs.height};
      `,
      arrowLeft: css`
        inset-inline-start: 0;
      `,
      arrowRight: css`
        inset-inline-end: 0;
      `,
    },
  };
};
