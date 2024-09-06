/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import {
  _EuiThemeBrandColors,
  _EuiThemeBrandTextColors,
  _EuiThemeShadeColors,
  _EuiThemeSpecialColors,
  _EuiThemeTextColors,
  _EuiThemeColorsMode,
  _EuiThemeBorderColors,
  _EuiThemeTransparentBackgroundColors,
  _EuiThemeBackgroundColors,
  _EuiThemeButtonColors,
} from '../../../../global_styling/variables/colors';
import { semanticColors } from '../../../../global_styling/variables/_color_matrix';

/*
 * LIGHT THEME
 * Only split up in the light theme to access the keys by section in the docs
 */

const semantic_colors = {
  white: '#fff',
  black: '#000',
  mutedBlack: '#0e0f12',
  developerBlue: '#080f21',
  ...semanticColors,
};

const background_colors: _EuiThemeBackgroundColors = {
  backgroundPrimary: semantic_colors.primary130,
  backgroundAccent: semantic_colors.accent130,
  backgroundSuccess: semantic_colors.success130,
  backgroundWarning: semantic_colors.warning130,
  backgroundDanger: semantic_colors.danger130,
  backgroundSubdued: semantic_colors.shade140,
  backgroundPlain: semantic_colors.white,
  backgroundDisabled: semantic_colors.shade135,
};

const transparent_background_colors: _EuiThemeTransparentBackgroundColors = {
  backgroundPrimaryTransparent: semantic_colors.primary130,
  backgroundAccentTransparent: semantic_colors.accent130,
  backgroundSuccessTransparent: semantic_colors.success130,
  backgroundWarningTransparent: semantic_colors.warning130,
  backgroundDangerTransparent: semantic_colors.danger130,
  backgroundSubduedTransparent: semantic_colors.shade130,
  backgroundPlainTransparent: semantic_colors.shade130,
};

const border_colors: _EuiThemeBorderColors = {
  borderPrimary: semantic_colors.primary100,
  borderAccent: semantic_colors.accent100,
  borderSuccess: semantic_colors.success100,
  borderWarning: semantic_colors.warning100,
  borderDanger: semantic_colors.danger100,
  borderSubdued: semantic_colors.shade100,
  borderPlain: semantic_colors.shade100,
  borderDisabled: semantic_colors.shade100,
  borderHollow: semantic_colors.shade100,
};

export const brand_colors: _EuiThemeBrandColors = {
  primary: semantic_colors.primary60,
  accent: semantic_colors.accent50,
  success: semantic_colors.success40,
  warning: semantic_colors.warning40,
  danger: semantic_colors.danger60,
};

export const shade_colors: _EuiThemeShadeColors = {
  emptyShade: semantic_colors.shade140,
  lightestShade: semantic_colors.shade130,
  lightShade: semantic_colors.shade120,
  mediumShade: semantic_colors.shade100,
  darkShade: semantic_colors.shade60,
  darkestShade: semantic_colors.shade30,
  fullShade: semantic_colors.white,
};

export const text_colors: _EuiThemeTextColors = {
  text: semantic_colors.shade20,
  title: semantic_colors.shade20,
  subduedText: semantic_colors.shade70,
  link: semantic_colors.primary60,

  textHeading: semantic_colors.shade20,
  textParagraph: semantic_colors.shade20,
  textSubdued: semantic_colors.shade70,
  textPrimary: semantic_colors.primary60,
  textAccent: semantic_colors.accent50,
  textSuccess: semantic_colors.success40,
  textWarning: semantic_colors.warning40,
  textDanger: semantic_colors.danger60,
  textDisabled: semantic_colors.shade70,
  textInverse: semantic_colors.white,
};

export const brand_text_colors: _EuiThemeBrandTextColors = {
  primaryText: text_colors.textPrimary,
  accentText: text_colors.textAccent,
  successText: text_colors.textSuccess,
  warningText: text_colors.textWarning,
  dangerText: text_colors.textDanger,
};

export const special_colors: _EuiThemeSpecialColors = {
  body: semantic_colors.mutedBlack,
  highlight: background_colors.backgroundWarning,
  disabled: background_colors.backgroundDisabled,
  disabledText: text_colors.textDisabled,
  shadow: semantic_colors.black,
};

const form_colors = {
  formBackground: special_colors.body,
  formBackgroundDisabled: semantic_colors.shade135,
  formBackgroundFocused: special_colors.body,
  formBorderColor: border_colors.borderPlain,
  formAppendBackground: special_colors.body,
  formControlPlaceholderColor: text_colors.textSubdued,
  formControlBorder: border_colors.borderPlain,
  formAutofillBackground: semantic_colors.primary130,
  formAutofillBorderColor: border_colors.borderPlain,
};

const button_colors: _EuiThemeButtonColors = {
  // primary = filled
  buttonBackgroundPrimary: semantic_colors.primary70,
  buttonBackgroundAccent: semantic_colors.highlight70,
  buttonBackgroundSuccess: semantic_colors.success70,
  buttonBackgroundWarning: semantic_colors.warning40,
  buttonBackgroundDanger: semantic_colors.danger70,
  buttonBackgroundText: semantic_colors.shade70,
  buttonBackgroundDisabled: background_colors.backgroundDisabled,

  buttonColorPrimary: semantic_colors.black,
  buttonColorAccent: semantic_colors.black,
  buttonColorSuccess: semantic_colors.black,
  buttonColorWarning: semantic_colors.warning130,
  buttonColorDanger: semantic_colors.black,
  buttonColorText: semantic_colors.black,
  buttonColorDisabled: text_colors.textDisabled,

  buttonBorderColor: border_colors.borderPlain, // style flag

  buttonBorderColorPrimary: undefined,
  buttonBorderColorAccent: undefined,
  buttonBorderColorSuccess: undefined,
  buttonBorderColorWarning: undefined,
  buttonBorderColorDanger: undefined,
  buttonBorderColorText: undefined,
  buttonBorderColorDisabled: undefined,

  buttonBorderColorBevelPrimary: semantic_colors.primary40,
  buttonBorderColorBevelAccent: semantic_colors.highlight40,
  buttonBorderColorBevelSuccess: semantic_colors.success40,
  buttonBorderColorBevelWarning: semantic_colors.warning20,
  buttonBorderColorBevelDanger: semantic_colors.danger40,
  buttonBorderColorBevelText: semantic_colors.shade40,
  buttonBorderColorBevelDisabled: border_colors.borderPlain,

  // secondary = base
  buttonSecondaryBackgroundPrimary: semantic_colors.shade140,
  buttonSecondaryBackgroundAccent: semantic_colors.shade140,
  buttonSecondaryBackgroundSuccess: semantic_colors.shade140,
  buttonSecondaryBackgroundWarning: semantic_colors.shade140,
  buttonSecondaryBackgroundDanger: semantic_colors.shade140,
  buttonSecondaryBackgroundText: semantic_colors.shade140,
  buttonSecondaryBackgroundDisabled: background_colors.backgroundDisabled,
  buttonSecondaryBackgroundHovered: undefined, // style flag

  buttonSecondaryColorPrimary: semantic_colors.primary60,
  buttonSecondaryColorAccent: semantic_colors.highlight60,
  buttonSecondaryColorSuccess: semantic_colors.success60,
  buttonSecondaryColorWarning: semantic_colors.warning60,
  buttonSecondaryColorDanger: semantic_colors.danger60,
  buttonSecondaryColorText: semantic_colors.white,
  buttonSecondaryColorDisabled: text_colors.textDisabled,

  buttonSecondaryBorderColorPrimary: semantic_colors.shade110,
  buttonSecondaryBorderColorAccent: semantic_colors.shade110,
  buttonSecondaryBorderColorSuccess: semantic_colors.shade110,
  buttonSecondaryBorderColorWarning: semantic_colors.shade110,
  buttonSecondaryBorderColorDanger: semantic_colors.shade110,
  buttonSecondaryBorderColorText: semantic_colors.shade110,
  buttonSecondaryBorderColorDisabled: border_colors.borderDisabled,

  buttonSecondaryBorderColorBevelPrimary: semantic_colors.shade80,
  buttonSecondaryBorderColorBevelAccent: semantic_colors.shade80,
  buttonSecondaryBorderColorBevelSuccess: semantic_colors.shade80,
  buttonSecondaryBorderColorBevelWarning: semantic_colors.shade80,
  buttonSecondaryBorderColorBevelDanger: semantic_colors.shade80,
  buttonSecondaryBorderColorBevelText: semantic_colors.shade80,
  buttonSecondaryBorderColorBevelDisabled: semantic_colors.shade80,

  // teriary/ghost = empty
  buttonEmptyBackgroundPrimary: 'transparent',
  buttonEmptyBackgroundAccent: 'transparent',
  buttonEmptyBackgroundSuccess: 'transparent',
  buttonEmptyBackgroundWarning: 'transparent',
  buttonEmptyBackgroundDanger: 'transparent',
  buttonEmptyBackgroundText: 'transparent',
  buttonEmptyBackgroundDisabled: 'transparent',
  buttonEmptyBackgroundHovered: semantic_colors.shade130,

  buttonEmptyColorPrimary: semantic_colors.primary60,
  buttonEmptyColorAccent: semantic_colors.highlight60,
  buttonEmptyColorSuccess: semantic_colors.success60,
  buttonEmptyColorWarning: semantic_colors.warning60,
  buttonEmptyColorDanger: semantic_colors.danger60,
  buttonEmptyColorText: semantic_colors.white,
  buttonEmptyColorDisabled: text_colors.textDisabled,
};

export const dark_colors: _EuiThemeColorsMode = {
  ...semantic_colors,
  ...brand_colors,
  ...shade_colors,
  ...special_colors,
  // Need to come after special colors so they can react to `body`
  ...brand_text_colors,
  // experimental new tokens
  ...text_colors,
  ...background_colors,
  ...transparent_background_colors,
  ...border_colors,
  ...form_colors,
  ...button_colors,
};
