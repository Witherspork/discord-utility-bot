// require our bots
require('../bots/helpBot')
require('../bots/scheduleBot/scheduleBot')


// user commmand is the key
// the value is our bot function 
const bots = { help: helpBot, lobby: scheduleBot }


// listen for incomming messages
Client.on('message', message => {
  

  // guard
  if ( !validCommand(message) ) return


// send the message to our route function which delegates commands to the correct bot
route(message)
    .then(response => logSuccess(response))
    .catch(error => logError(error))
})




const route = async message => {

  // get user command after prefix
  const userCommand = parseCommandFrom(message)

  // try to call a bot with the users command
  // pass message to the bot function if commmand is valid
  try { 
    return bots[userCommand](message) 
  } 
  catch (error){
      error.message = 'user entered an invalid command'
      logError(error)
    }

}