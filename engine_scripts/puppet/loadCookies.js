const { DEFAULT_HOST, COOKIES } = require('../../constants');

module.exports = async (page, scenario) => {
  var cookies = [] ;
  
  if (scenario.cookies) {
    cookies = scenario.cookies;
  }

  // ADD DOMAIN AND PATH
  cookies = cookies.map(cookieName => {
    let cookie = COOKIES[cookieName];
    cookie.path = "/";
    cookie.domain = DEFAULT_HOST;
    return cookie;
  });

  // SET COOKIES
  const setCookies = async () => {
    return Promise.all(
      cookies.map(async (cookie) => {
        await page.setCookie(cookie);
      })
    );
  };
  await setCookies();
  console.log('Cookie state restored with:', JSON.stringify(cookies, null, 2));
};
