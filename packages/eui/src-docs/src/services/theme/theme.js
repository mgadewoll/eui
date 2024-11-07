const themes = {};

export function registerTheme(theme, cssFiles) {
  themes[theme] = cssFiles;
}

export function applyTheme(newTheme, colorMode = 'LIGHT') {
  Object.keys(themes).forEach((theme) =>
    Object.values(themes[theme]).forEach((cssFile) => cssFile.unuse())
  );
  themes[newTheme]?.[colorMode]?.use();
}
