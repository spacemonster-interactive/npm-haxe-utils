require('./lib/lime-build-lib_xml');
var haxelibInstall = require('./lib/haxelib-install');
var limeCheckInstall = require('./lib/lime-check-install');
var limeSetup = require('./lib/lime-setup');

haxelibInstall().then(() => {
  limeCheckInstall().then(() => {
    console.log('already installed');
  }).catch(() => {
    console.log('not installed');
    limeSetup().then(() => {
      console.log("lime setup complete");
    });
  });
});