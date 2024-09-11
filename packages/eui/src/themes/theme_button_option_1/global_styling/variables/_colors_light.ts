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
  _EuiThemeBackgroundColors,
  _EuiThemeBorderColors,
  _EuiThemeSemanticColors,
  _EuiThemeColorsMode,
  _EuiThemeFormColors,
  _EuiThemeButtonColors,
} from '../../../../global_styling/variables/colors';
import { semanticColors } from '../../../../global_styling/variables/_color_matrix';

/*
 * LIGHT THEME
 * Only split up in the light theme to access the keys by section in the docs
 */

// manual definition to ensure types?
const semantic_colors: _EuiThemeSemanticColors = {
  white: '#fff',
  black: '#000',
  mutedBlack: '#0e0f12',
  developerBlue: '#080f21',
  ...semanticColors,
};

const background_colors: _EuiThemeBackgroundColors = {
  backgroundPrimary: semantic_colors.primary10,
  backgroundAccent: semantic_colors.accent10,
  backgroundSuccess: semantic_colors.success10,
  backgroundWarning: semantic_colors.warning10,
  backgroundDanger: semantic_colors.danger10,
  backgroundSubdued: semantic_colors.shade10,
  backgroundPlain: semantic_colors.white,
  backgroundDisabled: semantic_colors.shade15,
};

const transparent_background_colors = {
  backgroundPrimaryTransparent: semantic_colors.primary10,
  backgroundAccentTransparent: semantic_colors.accent10,
  backgroundSuccessTransparent: semantic_colors.success10,
  backgroundWarningTransparent: semantic_colors.warning10,
  backgroundDangerTransparent: semantic_colors.danger10,
  backgroundSubduedTransparent: semantic_colors.shade10,
  backgroundPlainTransparent: semantic_colors.shade10,
};

const border_colors: _EuiThemeBorderColors = {
  borderPrimary: semantic_colors.primary100,
  borderAccent: semantic_colors.accent100,
  borderSuccess: semantic_colors.success100,
  borderWarning: semantic_colors.warning100,
  borderDanger: semantic_colors.danger100,
  borderSubdued: semantic_colors.shade30,
  borderPlain: semantic_colors.shade30,
  borderDisabled: semantic_colors.shade30,
  borderHollow: semantic_colors.shade30,
};

export const brand_colors: _EuiThemeBrandColors = {
  primary: semantic_colors.primary90,
  accent: semantic_colors.accent50,
  success: semantic_colors.success40,
  warning: semantic_colors.warning40,
  danger: semantic_colors.danger90,
};

export const shade_colors: _EuiThemeShadeColors = {
  emptyShade: semantic_colors.white,
  lightestShade: semantic_colors.shade10,
  lightShade: semantic_colors.shade30,
  mediumShade: semantic_colors.shade50,
  darkShade: semantic_colors.shade90,
  darkestShade: semantic_colors.shade120,
  fullShade: semantic_colors.white,
};

export const text_colors: _EuiThemeTextColors = {
  text: semantic_colors.shade145,
  title: semantic_colors.shade145,
  subduedText: semantic_colors.shade100,
  link: semantic_colors.primary100,
  // new
  textHeading: semantic_colors.shade145,
  textParagraph: semantic_colors.shade145,
  textSubdued: semantic_colors.shade100,
  textPrimary: semantic_colors.primary100,
  textAccent: semantic_colors.accent100,
  textSuccess: semantic_colors.success100,
  textWarning: semantic_colors.warning100,
  textDanger: semantic_colors.danger100,
  textDisabled: semantic_colors.shade80,
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
  body: semantic_colors.shade10,
  highlight: background_colors.backgroundWarning,
  disabled: background_colors.backgroundDisabled,
  disabledText: text_colors.textDisabled,
  shadow: semantic_colors.white,
};

const form_colors: _EuiThemeFormColors = {
  formBackground: semantic_colors.white,
  formBackgroundDisabled: semantic_colors.shade15,
  formBackgroundFocused: semantic_colors.white,
  formBorderColor: border_colors.borderPlain,
  formAppendBackground: semantic_colors.white,
  formControlPlaceholderColor: text_colors.textSubdued,
  formControlBorder: border_colors.borderPlain,
  formAutofillBackground: semantic_colors.primary10,
  formAutofillBorderColor: border_colors.borderPlain,
};

const button_colors: _EuiThemeButtonColors = {
  // primary = filled
  buttonBackgroundPrimary: semantic_colors.primary90,
  buttonBackgroundAccent: semantic_colors.highlight90,
  buttonBackgroundSuccess: semantic_colors.success90,
  buttonBackgroundWarning: semantic_colors.warning40,
  buttonBackgroundDanger: semantic_colors.danger90,
  buttonBackgroundText: semantic_colors.shade90,
  buttonBackgroundDisabled: background_colors.backgroundDisabled,

  buttonColorPrimary: semantic_colors.white,
  buttonColorAccent: semantic_colors.white,
  buttonColorSuccess: semantic_colors.white,
  buttonColorWarning: semantic_colors.warning130,
  buttonColorDanger: semantic_colors.white,
  buttonColorText: semantic_colors.white,
  buttonColorDisabled: text_colors.textDisabled,

  buttonBorderColor: border_colors.borderPlain, // style flag

  buttonBorderColorPrimary: semantic_colors.primary90,
  buttonBorderColorAccent: semantic_colors.highlight90,
  buttonBorderColorSuccess: semantic_colors.success90,
  buttonBorderColorWarning: semantic_colors.warning40,
  buttonBorderColorDanger: semantic_colors.danger90,
  buttonBorderColorText: semantic_colors.shade90,
  buttonBorderColorDisabled: background_colors.backgroundDisabled,

  buttonBevelColorPrimary: semantic_colors.primary120,
  buttonBevelColorAccent: semantic_colors.highlight120,
  buttonBevelColorSuccess: semantic_colors.success120,
  buttonBevelColorWarning: semantic_colors.warning80,
  buttonBevelColorDanger: semantic_colors.danger120,
  buttonBevelColorText: semantic_colors.shade120,
  buttonBevelColorDisabled: semantic_colors.shade30,

  // secondary = base
  buttonSecondaryBackgroundPrimary: semantic_colors.white,
  buttonSecondaryBackgroundAccent: semantic_colors.white,
  buttonSecondaryBackgroundSuccess: semantic_colors.white,
  buttonSecondaryBackgroundWarning: semantic_colors.white,
  buttonSecondaryBackgroundDanger: semantic_colors.white,
  buttonSecondaryBackgroundText: semantic_colors.white,
  buttonSecondaryBackgroundDisabled: background_colors.backgroundDisabled,
  buttonSecondaryBackgroundHovered: semantic_colors.shade10, // style flag

  buttonSecondaryColorPrimary: semantic_colors.primary100,
  buttonSecondaryColorAccent: semantic_colors.highlight100,
  buttonSecondaryColorSuccess: semantic_colors.success100,
  buttonSecondaryColorWarning: semantic_colors.warning100,
  buttonSecondaryColorDanger: semantic_colors.danger100,
  buttonSecondaryColorText: text_colors.textParagraph,
  buttonSecondaryColorDisabled: text_colors.textDisabled,

  buttonSecondaryBorderColorPrimary: semantic_colors.white,
  buttonSecondaryBorderColorAccent: semantic_colors.white,
  buttonSecondaryBorderColorSuccess: semantic_colors.white,
  buttonSecondaryBorderColorWarning: semantic_colors.white,
  buttonSecondaryBorderColorDanger: semantic_colors.white,
  buttonSecondaryBorderColorText: semantic_colors.white,
  buttonSecondaryBorderColorDisabled: background_colors.backgroundDisabled,

  buttonSecondaryBevelColorPrimary: semantic_colors.shade30,
  buttonSecondaryBevelColorAccent: semantic_colors.shade30,
  buttonSecondaryBevelColorSuccess: semantic_colors.shade30,
  buttonSecondaryBevelColorWarning: semantic_colors.shade30,
  buttonSecondaryBevelColorDanger: semantic_colors.shade30,
  buttonSecondaryBevelColorText: semantic_colors.shade30,
  buttonSecondaryBevelColorDisabled: semantic_colors.shade30,

  // teriary/ghost = empty
  buttonEmptyBackgroundPrimary: 'transparent',
  buttonEmptyBackgroundAccent: 'transparent',
  buttonEmptyBackgroundSuccess: 'transparent',
  buttonEmptyBackgroundWarning: 'transparent',
  buttonEmptyBackgroundDanger: 'transparent',
  buttonEmptyBackgroundText: 'transparent',
  buttonEmptyBackgroundDisabled: 'transparent',
  buttonEmptyBackgroundHovered: semantic_colors.shade10,

  buttonEmptyColorPrimary: semantic_colors.primary100,
  buttonEmptyColorAccent: semantic_colors.highlight100,
  buttonEmptyColorSuccess: semantic_colors.success100,
  buttonEmptyColorWarning: semantic_colors.warning100,
  buttonEmptyColorDanger: semantic_colors.danger100,
  buttonEmptyColorText: text_colors.textParagraph,
  buttonEmptyColorDisabled: text_colors.textDisabled,
};

export const light_colors: _EuiThemeColorsMode = {
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
