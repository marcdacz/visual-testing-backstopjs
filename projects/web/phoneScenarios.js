module.exports = options => {
	return {
		"scenarios": [
			{
				"label": "Mobile Menu",
				"url": `${options.baseUrl}/`,
				"clickSelectors": [
					".rmaHeaderPublicMenu__menuIcon"
				],
				"postInteractionWait": options.DEFAULT_DELAY
			},			
			{
				"label": "Login Modal",
				"url": `${options.baseUrl}/`,
				"clickSelectors": [
					".rmaHeaderPublicMenu__menuIcon",
					"[ng-click=\"$ctrl.login()\"]",
				],
				"postInteractionWait": options.DEFAULT_DELAY,
				"selectors": [
					".rmaLoginModal"
				]
			}
		]
	}
}