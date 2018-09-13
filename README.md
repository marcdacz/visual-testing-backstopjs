# BackstopJS: Visual Regression Test Automation
Automated Visual Regression Test utilising BackstopJS

[![express logo](http://garris.github.io/BackstopJS/assets/memes/im-in-ur-webapps-checking-ur-screens.jpg)](https://www.npmjs.com/package/backstopjs)

## Setup and Execution
Firstly, install docker and if you are using Windows or Mac OS I suggest you set the Virtual Machines RAM to 4GB with 2GB swap.
Then to run them tests open the folder through your terminal and below are commands you can use.

```sh
npm install

npm run reference:web-desktop
npm run test:web-desktop
npm run approve:web-desktop

npm run reference:web-phone
npm run test:web-phone
npm run approve:web-phone

npm run reference:web-tablet
npm run test:web-tablet
npm run approve:web-tablet

```
