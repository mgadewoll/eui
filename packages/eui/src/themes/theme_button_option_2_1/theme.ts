/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { buildTheme } from '../../services/theme/utils';
import { EuiThemeShape } from '../../services/theme/types';

import { colors } from './global_styling/variables/_colors';
import { animation } from './global_styling/variables/_animation';
import { breakpoint } from './global_styling/variables/_breakpoint';
import { base, size } from './global_styling/variables/_size';
import { border } from './global_styling/variables/_borders';
import { levels } from './global_styling/variables/_levels';
import { font } from './global_styling/variables/_typography';
import { focus } from './global_styling/variables/_states';

export const NEW_THEME_BUTTON_OPTION_2_1_KEY =
  'EUI_THEME_NEW_BUTTON_OPTION_2_1';

export const euiThemeNewButtonOption2_1: EuiThemeShape = {
  colors,
  base,
  size,
  border,
  font,
  animation,
  breakpoint,
  levels,
  focus,
};

export const EuiThemeNewButtonOption2_1 = buildTheme(
  euiThemeNewButtonOption2_1,
  NEW_THEME_BUTTON_OPTION_2_1_KEY
);
