// terminal colors to use in log messages
RED='\033[0;31m'
GREEN='\033[0;32m'
WHITE='\033[1;37m'
PURPLE='\033[0;35m'


// log pretty error message
logError = error =>
  console.log(
    `${RED}error at file:\n${WHITE}${
      error
        .stack
        .split('\n')[1]
        .trim()
        .replace('at route (', '')
        .replace(')', '')}\n\n${RED}error message:\n${WHITE}${error.message
      }\n`
  )


// log pretty success message
logSuccess = message => console.log(`${GREEN}Success! ${WHITE}${message}`)


// check if users message a normal chat message not a bot command
notACommand = message => {
    if (message.content.split(" ")[0] != PREFIX)
      return true
  }


// remove prefix and options leaving only the bot command
getCommand = message => message
  .content
  .replace("!dfz ","")
  .split(" ")[0]