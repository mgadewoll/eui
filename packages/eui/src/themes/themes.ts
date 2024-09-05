/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { EuiThemeSystem } from '../services';
import { EuiThemeAmsterdam, AMSTERDAM_NAME_KEY } from './amsterdam/theme';
import { EuiThemeNewButtonOption1 } from './theme_button_option1/theme';

export interface EUI_THEME {
  text: string;
  value: string;
  provider?: EuiThemeSystem;
}

export const EUI_THEMES: EUI_THEME[] = [
  {
    text: 'Light',
    value: 'light',
    provider: EuiThemeAmsterdam,
  },
  {
    text: 'Dark',
    value: 'dark',
    provider: EuiThemeAmsterdam,
  },
  {
    text: 'New Theme (Btn 1): Light',
    value: `new_light_btn1`,
    provider: EuiThemeNewButtonOption1,
  },
  {
    text: 'New Theme (Btn 1): Dark',
    value: `new_dark_btn1`,
    provider: EuiThemeNewButtonOption1,
  },
];

export const isDefaultTheme = (name: string) => {
  return name === AMSTERDAM_NAME_KEY;
};
