var exec = require('child_process').exec;
var env = require('haxe/lib/env');


/**
	creates a function that pipes arguments and process to an executable function
**/
var cli = function( executable ) {
	return function(){
	    args = process.argv.slice(2);
	    cp = executable.apply(null, args);

	    cp.stdout.pipe(process.stdout);
	    cp.stderr.pipe(process.stderr);
	    cp.on('exit', process.exit);
	    cp.on('error', function(err){
	        console.error(err);
	    });

	    process.on('SIGTERM', function() {
	      cp.kill('SIGTERM');
	      process.exit(1);
	    });
	}
}

/**
    creates a function that calls cli command + argus
    appends functions arguments to command
*/
var executable = function(command, args) {
    var exe = function() {
        var _args = ( args || [] ).slice(0);
        for( a in arguments ) {
            _args.push( arguments[a] );
        }

        var cp = exec( [command, ..._args].join(" "), {
            env: env
        });

        return cp;
    }

    exe.cli = cli( exe );

    return exe;
}

module.exports = executable;