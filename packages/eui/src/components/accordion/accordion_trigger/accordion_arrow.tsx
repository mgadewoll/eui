/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React, { FunctionComponent } from 'react';
import classNames from 'classnames';

import { useEuiTheme } from '../../../services';
import { EuiButtonIcon, EuiButtonIconPropsForButton } from '../../button';

import { EuiAccordionProps } from '../accordion';
import { euiAccordionArrowStyles } from './accordion_arrow.styles';
import { EuiIcon } from '../../icon';

type _EuiAccordionArrowProps = Partial<EuiButtonIconPropsForButton> &
  Pick<EuiAccordionProps, 'arrowDisplay' | 'arrowProps'> & {
    isOpen: boolean;
  };

export const EuiAccordionArrow: FunctionComponent<_EuiAccordionArrowProps> = ({
  arrowDisplay = 'left',
  arrowProps,
  isOpen,
  isDisabled,
  tabIndex,
  ...rest
}) => {
  const euiTheme = useEuiTheme();

  if (arrowDisplay === 'none') return null;

  const isInteractive = tabIndex !== -1;

  const styles = euiAccordionArrowStyles(euiTheme);
  const cssStyles = [
    styles.euiAccordion__arrow,
    styles[arrowDisplay],
    isOpen ? styles.isOpen : styles.isClosed,
    !isInteractive && isDisabled && styles.isDisabled,
    arrowProps?.css,
  ];

  const classes = classNames('euiAccordion__arrow', arrowProps?.className);

  if (!isInteractive) {
    return (
      <span css={cssStyles} className={classes}>
        <EuiIcon type="arrowRight" />
      </span>
    );
  }

  return (
    <EuiButtonIcon
      color="text"
      {...arrowProps}
      {...rest}
      className={classes}
      css={cssStyles}
      iconType="arrowRight"
      isDisabled={isDisabled}
      tabIndex={tabIndex}
    />
  );
};
