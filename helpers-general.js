// these are general helpers for simple abstracted tasks
//--------

// terminal colors to use in log messages
RED='\033[0;31m'
GREEN='\033[0;32m'
WHITE='\033[1;37m'
PURPLE='\033[0;35m'




// Why waste time say lot word when few word do trick
l = (...logThis) => console.log(...logThis)




// log pretty error message
logError = error =>
  console.log(
    `\n${RED}error path:\n${WHITE}${
      error
        .stack
        .split('\n')[1]
        .trim()
        .replace('(', '')
        .replace(')', '')}\n\n${RED}error message:\n${WHITE}${error.message
      }`
  )




// log pretty success message
logSuccess = message => console.log(`\n${GREEN}Success! ${WHITE}${message}`)




// user input is a valid command prefix and not a bot
validCommand = message => message.content.startsWith(PREFIX) && !message.author.bot




// takes a users message
// converts into array
// returns the command after the prefix
parseCommandFrom = message => message.content.split(' ')[1]




// gets all sub commands after prefix and main command
getSubCommands = (message) => message.content.split(' ').slice(2)




// get channel by ID
getChannel = (channel_id) => Client.channels.fetch(channel_id)