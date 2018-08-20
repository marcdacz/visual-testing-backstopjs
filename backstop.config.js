module.exports = options => {
	return {
		"id": options.project,
		"viewports": [
			options.viewport
		],
		"onBeforeScript": "puppet/onBefore.js",
		"onReadyScript": "puppet/onReady.js",
		"scenarios": options.scenarios,
		"paths": {
			"bitmaps_reference": `projects/${options.project}/${options.viewport.label}/bitmaps_reference`,
			"bitmaps_test": `projects/${options.project}/${options.viewport.label}/bitmaps_test`,
			"engine_scripts": `engine_scripts`,
			"html_report": `projects/${options.project}/${options.viewport.label}/html_report`,
			"ci_report": `projects/${options.project}/${options.viewport.label}/ci_report`
		},
		"report": ["browser"],
		"engine": "puppeteer",
		"engineOptions": {
			"args": ["--no-sandbox"]
		},
		"asyncCaptureLimit": 5,
		"asyncCompareLimit": 10,
		"debug": false,
		"debugWindow": false
	}
}