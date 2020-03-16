require('./lib/lime-build-lib_xml');
const chalk = require('chalk')
var haxelibInstall = require('./lib/haxelib-install');
var limeCheckInstall = require('./lib/lime-check-install');
var limeSetup = require('./lib/lime-setup');

haxelibInstall().then(() => {
  limeSetup().then(() => {
    console.log(chalk.greenBright("Lime setup complete"));
  });
});