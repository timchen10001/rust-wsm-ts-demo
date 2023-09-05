/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ (() => {

eval("async function init() {\n  /**\n   * const byteArray = new Int8Array([\n    0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00, 0x01, 0x07, 0x01, 0x60, 0x02, 0x7f, 0x7f, 0x01,\n    0x7f, 0x03, 0x02, 0x01, 0x00, 0x07, 0x07, 0x01, 0x03, 0x73, 0x75, 0x6d, 0x00, 0x00, 0x0a, 0x09,\n    0x01, 0x07, 0x00, 0x20, 0x00, 0x20, 0x01, 0x6a, 0x0b, 0x00, 0x18, 0x04, 0x6e, 0x61, 0x6d, 0x65,\n    0x01, 0x06, 0x01, 0x00, 0x03, 0x73, 0x75, 0x6d, 0x02, 0x09, 0x01, 0x00, 0x02, 0x00, 0x01, 0x61,\n    0x01, 0x01, 0x62\n  ]);\n   */\n  const importedObject = {\n    console: {\n      log: () => {\n        console.log(\"importedObject.log\");\n      },\n      error: () => {\n        console.error(\"importedObject.error\");\n      },\n    },\n  };\n  const sumWasmBuffer = await fetch(\"sum.wasm\").then((res) =>\n    res.arrayBuffer()\n  );\n  const wasm = await WebAssembly.instantiate(sumWasmBuffer, importedObject);\n  debugger;\n  const sum = wasm.instance.exports.sum;\n  const test1 = sum(1, 2);\n  console.log(\"test1\", test1);\n  const test2 = sum(3, 4);\n  console.log(\"test2\", test2);\n}\n\ninit();\n\n\n//# sourceURL=webpack://www/./index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./index.js"]();
/******/ 	
/******/ })()
;