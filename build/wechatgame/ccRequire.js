"use strict";

var moduleMap = {
  'src/assets/script/library/mgobe/MGOBE.js': function srcAssetsScriptLibraryMgobeMGOBEJs() {
    require('src/assets/script/library/mgobe/MGOBE.js');
  },
  'src/assets/script/library/puremvc/puremvc.js': function srcAssetsScriptLibraryPuremvcPuremvcJs() {
    require('src/assets/script/library/puremvc/puremvc.js');
  },
  'src/project.js': function srcProjectJs() {
    require('src/project.js');
  }
};

window.__cocos_require__ = function (moduleName) {
  var func = moduleMap[moduleName];
  func && func();
};