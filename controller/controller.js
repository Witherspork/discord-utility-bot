// require helpers
require('./helpers-controller')


// require our bots
require('../bots/helpBot')
require('../bots/scheduleBot')


// user commmand is the key
// the value is our bot function 
const bots = { help: helpBot, lobby: scheduleBot }


// listen for incomming messages
Client.on('message', message => {
  
  // guard
  if ( !validCommand(message) ) return

  // get user command after prefix
  const userCommand = parseCommandFrom(message)

  // try to call a bot with the users command
  // pass message to the bot function if commmand is valid
  try { bots[userCommand](message) }
    catch (error){
      error.message = 'user entered an invalid command'
      logError(error)
    }
})