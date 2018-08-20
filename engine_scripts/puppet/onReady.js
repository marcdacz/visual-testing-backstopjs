module.exports = async (page, scenario, vp) => {
  console.log('SCENARIO > ' + scenario.label);
  await require('./clickAndHoverHelper')(page, scenario);

  await page.evaluate(() => {
    let style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML =
      '* {' +
      '-webkit-transition: none !important;' +
      '-moz-transition: none !important' +
      '-o-transition: none !important' +
      '-ms-transition: none !important' +
      'transition: none !important' +
      '}';
    document.getElementsByTagName('head')[0].appendChild(style);
  });
};
