require('./lib/apply-env');

const chalk = require('chalk')
var lime = require('./lib/lime');
var loglines = require('./lib/loglines');

var info = require('./lib/info');
var profileXml = 'project.xml';
var buildType = '-release';

if (process.env.PROJECT_XML !== undefined){
  profileXml = process.env.PROJECT_XML;
}
if (process.env.BUILD_TYPE !== undefined){
  buildType = process.env.BUILD_TYPE;
}
var defines = [];
if (process.env.HAXE_DEFINES !== undefined){
  console.log(process.env.HAXE_DEFINES);
  console.log(Array.isArray(process.env.HAXE_DEFINES));
  defines = process.env.HAXE_DEFINES.split(", ").join(",").split(",");
}

info(() => {
  //clean(() => {
    buildLime();
  //});
});

function clean(callback) {
  var limeProcess = lime("clean", profileXml, "electron");
  limeProcess.on('close', function (code) {
    console.log('->',chalk.green('Clear Successfully'));
    if (callback !== undefined)
      callback();
  });
  limeProcess.on('error', function (err) {
    console.error('->',chalk.red('Clear Failed'),err);
    if (callback !== undefined)
      callback();
  });
}

function buildLime(callback) {
  var args = ["build", profileXml, "electron", buildType];
  for (var i = 0; i < defines.length; i++){
    args.push("-D");
    args.push(defines[i]);
  }
  console.log(
    '->',
    chalk.blueBright('Haxe Compiler: '),
    chalk.green("lime", args.join(" "))
  )
  var limeProcess = lime(...args);

  limeProcess.stdout.on('data', (data) => {
    loglines(data.toString('utf8'), false);
  });
  limeProcess.stderr.on('data', (data) => {
    loglines(data.toString('utf8'), true);
    
  });
  limeProcess.on('close', function (code) {
    console.log('->',chalk.blue('Haxe Compiler: '),chalk.green('Built Successfully'));
    if (callback !== undefined)
      callback();
  });
  limeProcess.on('error', function (err) {
    console.error('->',chalk.blue('Haxe Compiler: '),chalk.red('Build Failed'),err);
    if (callback !== undefined)
      callback();
  });
}