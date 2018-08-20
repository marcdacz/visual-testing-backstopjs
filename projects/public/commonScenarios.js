module.exports = options => {
  return {
    "scenarios": [
      {
        "label": "Header",
        "url": `${options.baseUrl}/`,        
        "selectors": [
          ".rmaHeader"
        ]
      }
    ]
  }
}