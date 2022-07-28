const path = require('path');
var vars = require('haxe/lib/vars');

var delimiter = path.delimiter;

process.env.PATH = process.env.PATH + delimiter + vars.haxe.dir + delimiter;
process.env.PATH = process.env.PATH + delimiter + vars.neko.dir + delimiter;

process.env.HAXELIB_PATH =  vars.env.HAXELIB_PATH;
process.env.HAXEPATH = vars.haxe.dir;
process.env.HAXE_STD_PATH =  vars.env.HAXE_STD_PATH;