module.exports = (options) => {
    const commonScenarios = require('./commonScenarios')(options).scenarios;
    const viewportScenarios = require(`./${options.viewport}Scenarios`)(options).scenarios;    

    return {
        "scenarios": [
            ...commonScenarios,
            ...viewportScenarios           
        ]
    }
}