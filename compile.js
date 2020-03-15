require('./lib/apply-env');

const chalk = require('chalk')
var lime = require('./lib/lime');
var loglines = require('./lib/loglines');

var info = require('./lib/info');

info(buildLime);

function buildLime() {
  
  console.log(
    '->',
    chalk.blueBright('Haxe Compiler: '),
    chalk.green('Start')
  )

  var limeProcess = lime("build", "tcp-test.xml", "electron", "-debug", "-D", "bundled");

  limeProcess.stdout.on('data', (data) => {
    loglines(data.toString('utf8'), false);
  });
  limeProcess.stderr.on('data', (data) => {
    loglines(data.toString('utf8'), true);
    
  });
  limeProcess.on('close', function (code) {
    console.log(
      '->',
      chalk.blue('Haxe Compiler: '),
      chalk.green('Built Successfully')
    )
  });
  limeProcess.on('error', function (err) {
    console.error(
      '->',
      chalk.blue('Haxe Compiler: '),
      chalk.red('Build Failed'),
      err
    )
  });
}