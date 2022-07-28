
const info = require('./lib/info');
const genHxml = require('./lib/gen-hxml');
const genLime = require('./lib/lime/build-lib-xml');
const setupLime = require('./lib/lime/lime-setup');
const install = require('./install');
const compile = require('./compile');

module.exports = {
    info: info,
    genHxml: genHxml,
    genLime: genLime,
    setupLime: setupLime,
    install: install,
    compile: compile
}

