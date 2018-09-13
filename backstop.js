const fs = require('fs');
const backstop = require('backstopjs');
const args = require('yargs').argv;
const project = args.p;
const view = args.v;
const constants = require('./constants');
const projectConstants = require(`./projects/${project}/constants`);

const projectData = require(`./projects/${project}/scenarios.js`)({
    baseUrl: constants.DEFAULT_HOST,
    DEFAULT_DELAY: constants.DEFAULT_DELAY,
    viewport: view,
    projectConstants: projectConstants
});

const projectConfig = require("./backstop.config.js")({
    project: project,
    viewport: constants.VIEWPORTS[view],
    scenarios: projectData.scenarios.map((scenario) => {
        return Object.assign({}, constants.SCENARIO_DEFAULTS, scenario);
    })
});

let commandToRun = "";

if (args.reference) {
    commandToRun = "reference";
}

if (args.test) {
    commandToRun = "test";
}

if (args.approve) {
    commandToRun = "approve";
}

if (args.openReport) {
    commandToRun = "openReport";
}

process.argv = []; // This is to avoid passing (y)args to the Backstop Client
const fileName = `backstop.json`
fs.writeFile(fileName, JSON.stringify(projectConfig, null, 4), 'utf8', () => {
    console.log(`Successfully generated ${fileName} file.`);
    if (commandToRun !== '') {
        console.log(`Executing Command: ${commandToRun}`);
        backstop(commandToRun, { docker: true, config: 'backstop.json' });
    }
});

