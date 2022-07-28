module.exports = (callback) => {
  const chalk = require('chalk')
  var haxelibInstall = require('./lib/haxelib-install');
  haxelibInstall().then(() => {
    console.log(chalk.greenBright("Install complete"));
    if (callback !== undefined){
      callback();
    }
  });
}