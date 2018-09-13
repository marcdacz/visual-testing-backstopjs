module.exports = options => {
  return {
    "scenarios": [
      {
        "label": "Header",
        "url": `${options.baseUrl}/`,        
        "selectors": [
          ".rmaHeader"
        ]
      },
      {
        "label": "Header",
        "url": `${options.baseUrl}/`,
        "hideSelectors": [
          ".rmaHeader"
        ],
        "selectors": [
          "div[class*=heroImage]"
        ]
      },
      {
        "label": "Footer",
        "url": `${options.baseUrl}/`,
        "hideSelectors": [
          ".rmaHeader"
        ],
        "selectors": [         
          ".rmaFooter"
        ]
      }
    ]
  }
}