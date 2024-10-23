import {
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useState,
} from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';
import {
  EuiProvider,
  EuiThemeAmsterdam,
  EuiThemeColorMode,
} from '@elastic/eui';
import { EuiThemeBorealis } from '@elastic/eui-theme-borealis';

import { EuiThemeOverrides } from './theme_overrides';

const EXPERIMENTAL_THEMES = [
  {
    text: 'Borealis',
    value: EuiThemeBorealis.key,
    provider: EuiThemeBorealis,
  },
];

export const AVAILABLE_THEMES = [
  {
    text: 'Amsterdam',
    value: EuiThemeAmsterdam.key,
    provider: EuiThemeAmsterdam,
  },
  ...EXPERIMENTAL_THEMES,
];

const EUI_COLOR_MODES = ['light', 'dark'] as EuiThemeColorMode[];

const EUI_THEME_NAMES = AVAILABLE_THEMES.map(({ value }) => value);

const defaultState = {
  theme: EUI_THEME_NAMES[0] as string,
  colorMode: EUI_COLOR_MODES[0] as EuiThemeColorMode,
  changeTheme: (themeValue: EuiThemeColorMode) => {},
  changeColorMode: (colorMode: EuiThemeColorMode) => {},
};

export const AppThemeContext = createContext(defaultState);

export const AppThemeProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const isBrowser = useIsBrowser();

  const [theme, setTheme] = useState<string>(() => {
    if (isBrowser) {
      return (
        (localStorage.getItem('theme') as EuiThemeColorMode) ??
        defaultState.theme
      );
    }

    return defaultState.colorMode;
  });

  const [colorMode, setColorMode] = useState<EuiThemeColorMode>(() => {
    if (isBrowser) {
      return (
        (localStorage.getItem('colorMode') as EuiThemeColorMode) ??
        defaultState.colorMode
      );
    }

    return defaultState.colorMode;
  });

  return (
    <AppThemeContext.Provider
      value={{
        theme: theme,
        colorMode,
        changeTheme: setTheme,
        changeColorMode: setColorMode,
      }}
    >
      <EuiProvider
        globalStyles={false}
        modify={EuiThemeOverrides}
        colorMode={colorMode}
        theme={
          AVAILABLE_THEMES.find((theme) => theme.value === theme)?.provider
        }
      >
        {children}
      </EuiProvider>
    </AppThemeContext.Provider>
  );
};
