// require our bots
require('./bots/sendHelpMessage')
require('./bots/postLobbyMatch/postLobbyMatch')


// user commmand is the key
// the value is our bot function 
const bots = { help: helpBot, lobby: postLobbyMatch }


// listen for incomming messages
Client.on('message', message => {
  
  // guard
  if ( !validCommand(message) ) return

  // send the message to our route function
  route(message)
    .then(response => logSuccess(response))
    .catch(error => logError(error))

})





// delegates commands to the correct bot
const route = async message => {

  // get user command after prefix
  const userCommand = parseCommandFrom(message)

  // try to call a bot with the users command
  // pass message to the bot function if commmand is valid
  try { 
    return bots[userCommand](message) 
  } 
  catch (error){
      l(error)
    }

}