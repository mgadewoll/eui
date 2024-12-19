/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { _EuiThemeVisColors } from '@elastic/eui-theme-common';

/**
 * NOTE: These were quick conversions of their Sass counterparts.
 *       They have yet to be used/tested.
 * TODO: Make the graphic version available from `euiPaletteColorBlind()`
 */

// Maps allow for easier JSON usage
// Use map_merge(euiColorVisColors, $yourMap) to change individual colors after importing ths file
// The `behindText` variant is a direct copy of the hex output by the JS euiPaletteColorBlindBehindText() function
const euiPaletteColorBlind = {
  euiColorVis0: {
    graphic: '#54B399',
  },
  euiColorVis1: {
    graphic: '#6092C0',
  },
  euiColorVis2: {
    graphic: '#D36086',
  },
  euiColorVis3: {
    graphic: '#9170B8',
  },
  euiColorVis4: {
    graphic: '#CA8EAE',
  },
  euiColorVis5: {
    graphic: '#D6BF57',
  },
  euiColorVis6: {
    graphic: '#B9A888',
  },
  euiColorVis7: {
    graphic: '#DA8B45',
  },
  euiColorVis8: {
    graphic: '#AA6556',
  },
  euiColorVis9: {
    graphic: '#E7664C',
  },
};

export const colorVis: _EuiThemeVisColors = {
  euiColorVis0: euiPaletteColorBlind.euiColorVis0.graphic,
  euiColorVis1: euiPaletteColorBlind.euiColorVis1.graphic,
  euiColorVis2: euiPaletteColorBlind.euiColorVis2.graphic,
  euiColorVis3: euiPaletteColorBlind.euiColorVis3.graphic,
  euiColorVis4: euiPaletteColorBlind.euiColorVis4.graphic,
  euiColorVis5: euiPaletteColorBlind.euiColorVis5.graphic,
  euiColorVis6: euiPaletteColorBlind.euiColorVis6.graphic,
  euiColorVis7: euiPaletteColorBlind.euiColorVis7.graphic,
  euiColorVis8: euiPaletteColorBlind.euiColorVis8.graphic,
  euiColorVis9: euiPaletteColorBlind.euiColorVis9.graphic,

  euiColorVisBehindText0: '#6dccb1',
  euiColorVisBehindText1: '#79aad9',
  euiColorVisBehindText2: '#ee789d',
  euiColorVisBehindText3: '#a987d1',
  euiColorVisBehindText4: '#e4a6c7',
  euiColorVisBehindText5: '#f1d86f',
  euiColorVisBehindText6: '#d2c0a0',
  euiColorVisBehindText7: '#f5a35c',
  euiColorVisBehindText8: '#c47c6c',
  euiColorVisBehindText9: '#ff7e62',

  euiColorVisAsTextLight0: '#006BB4',
  euiColorVisAsTextLight1: '#017D73',
  euiColorVisAsTextLight2: '#F5A700',
  euiColorVisAsTextLight3: '#BD271E',
  euiColorVisAsTextLight4: '#DD0A73',
  euiColorVisAsTextLight5: '#006BB4', // duplicated to handle color amount difference between themes
  euiColorVisAsTextLight6: '#017D73',

  euiColorVisAsTextDark0: '#1BA9F5',
  euiColorVisAsTextDark1: '#7DE2D1',
  euiColorVisAsTextDark2: '#F990C0',
  euiColorVisAsTextDark3: '#F66',
  euiColorVisAsTextDark4: '#FFCE7A',
  euiColorVisAsTextDark5: '#1BA9F5',
  euiColorVisAsTextDark6: '#7DE2D1',

  euiColorVisSuccess0: '#209280',
  euiColorVisSuccess1: euiPaletteColorBlind.euiColorVis0.graphic,
  euiColorVisWarning0: '#D6BF57',
  euiColorVisDanger0: '#CC5642',
  euiColorVisDanger1: euiPaletteColorBlind.euiColorVis9.graphic,

  euiColorVisNeutral0: '#FFFFFF',

  euiColorSeverity0: '#D3DAE6',
  euiColorSeverity1: '#CC5642',
  euiColorSeverity2: '#D2634E',
  euiColorSeverity3: '#D66E5C',
  euiColorSeverity4: '#DD7B67',
  euiColorSeverity5: '#E18773',
  euiColorSeverity6: '#E2907F',
  euiColorSeverity7: '#E69D8F',
  euiColorSeverity8: '#D6BF57',
  euiColorSeverity9: '#DECC79',
  euiColorSeverity10: '#BECFE3',
  euiColorSeverity11: '#A6C0DA',
  euiColorSeverity12: '#90B0D1',
  euiColorSeverity13: '#78A2C9',
  euiColorSeverity14: '#6092C0',

  euiColorVisGrey0: '#d3dae6',
  euiColorVisGrey1: '#98a2b3',
  euiColorVisGrey2: '#69707d',
  euiColorVisGrey3: '#343741',

  euiColorVisWarm0: '#FBFBDC',
  euiColorVisWarm1: euiPaletteColorBlind.euiColorVis7.graphic,
  euiColorVisWarm2: euiPaletteColorBlind.euiColorVis9.graphic,

  euiColorVisCool0: '#EBEFF5',
  euiColorVisCool1: euiPaletteColorBlind.euiColorVis1.graphic,
  euiColorVisCool2: '#6092C0',

  euiColorVisComplementary0: euiPaletteColorBlind.euiColorVis1.graphic,
  euiColorVisComplementary1: euiPaletteColorBlind.euiColorVis7.graphic,
};
