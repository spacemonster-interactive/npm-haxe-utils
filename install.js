require('./lib/lime-build-lib_xml');
var haxelibInstall = require('./lib/haxelib-install');
var limeSetup = require('./lib/lime-setup');

haxelibInstall().then(() => {
  limeSetup().then(() => {
    //console.log("lime setup complete");
  });
});