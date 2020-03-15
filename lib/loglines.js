const chalk = require('chalk')

module.exports = (message, error) => {
  var lines = message.split('\n');
  for (i = 0; i < lines.length; i++){
    var line = lines[i];
    if (line === "") continue;
    if (line.indexOf('Warning') == -1 && line != ""){
      if (error){
        console.error(chalk.redBright(line));
        process.exit(1);
      } else {
        console.log(chalk.white(line));  
      }
    } else {
      var split = line.split("Warning");
      console.log(chalk.grey(split[0]) + chalk.yellow('Warning') + chalk.grey(split[1]));
    }
  }
}