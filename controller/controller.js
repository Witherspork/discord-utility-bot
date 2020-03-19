// require helpers
require('./helpers-controller')



// require our bots
require('../bots/helpBot')
require('../bots/scheduleBot')


// user commmand is the key, the value
// calls the bot function 
// passing the user message as an argument
const bots = { help: helpBot, lobby: scheduleBot }



// listen for incomming messages
Client.on('message', message => {
  
  // guard
  if ( !validCommand(message) ) return

  // get user command after prefix
  const userCommand = parseCommandFrom(message)

  // userCommand is the key for our bots object
  // then pass our message to the bot function
  try { bots[userCommand](message) }
    catch (error){
      error.message = 'user entered an invalid command'
      logError(error)
    }
})