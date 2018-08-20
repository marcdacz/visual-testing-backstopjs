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

if( args.reference ) {
    commandToRun = "reference";
}

if( args.test ) {
    commandToRun = "test";
}

if( args.approve ) {
    commandToRun = "approve";
}

if( args.openReport ) {
    commandToRun = "openReport";
}

if( "" !== commandToRun ) {
    backstop(commandToRun, { config: projectConfig });
}

