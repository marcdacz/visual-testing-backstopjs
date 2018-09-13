module.exports = options => {
	return {
		"scenarios": [
            {
				"label": "Unauthenicated User: Login Modal",
				"url": `${options.baseUrl}/`,
				"clickSelector": "[ng-click=\"login()\"]",
				"postInteractionWait": 3000,
				"selectors": [
					".rmaLoginModal"
				]
			}
		]
	}
}