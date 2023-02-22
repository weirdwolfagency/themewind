const plugin = require('tailwindcss/plugin');
const {generateShades} = require('./colors');

module.exports = themeConfig => {

  const saturationFactor = 1.77;
  const lightFactor = 7.4;

  const genCssVars = theme => {

    const colors = {};

    themeConfig.themes[theme].shades.forEach(color => {

      const shades = Object.assign(
        {},
        ...generateShades(themeConfig.themes[theme].colors[color], saturationFactor, lightFactor)
        .map((colorValue, index) => {
          return {['--color-' + color + '-' + (index === 0 ? 50 : index * 100)]: colorValue}
        })
      );

      Object.keys(shades).forEach(e => {
        colors[e] = shades[e];
      });
    });

    Object.keys(themeConfig.themes[theme].colors).forEach(color => {
      colors['--color-' + color] = themeConfig.themes[theme].colors[color];
    });

    return colors;
  }

  return plugin(function({addBase}) {

    Object.keys(themeConfig.themes).forEach(theme => {
      const obj = {};
      const defaultTheme = themeConfig.defaultTheme === theme ? ':root' : '[data-theme=' + theme + ']';
      obj[defaultTheme] = genCssVars(theme);
      addBase(obj);
    });

  }, {

    theme: {
      extend: {
        colors: () => {

          const obj = {};
          const themeStructure = themeConfig.themes[Object.keys(themeConfig.themes)[0]];

          themeStructure.shades.forEach(e => {
            for (let i = 0; i < 10; ++i) {
              const varNumber = i === 0 ? 50 : i * 100;
              obj[e + '-' + varNumber] = 'var(--color-' + e + '-' + varNumber + ')';
            }
          })

          Object.keys(themeStructure.colors).forEach(e => {
            obj[e] = 'var(--color-' + e + ')';
          })

          return obj;
        }
      }
    }
  });
}
