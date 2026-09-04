self.__BUILD_MANIFEST = {
  "__rewrites": {
    "afterFiles": [
      {
        "source": "/embed/v1/widget.js",
        "destination": "/widget/v1/widget.js"
      },
      {
        "source": "/embed/v1/badge.js",
        "destination": "/badge/v1/badge.js"
      }
    ],
    "beforeFiles": [],
    "fallback": []
  },
  "sortedPages": [
    "/_app",
    "/_error"
  ]
};self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()