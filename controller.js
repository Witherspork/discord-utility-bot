/* listen for messages 
route the command to a bot function */ 

require('./bots/sendHelpMessage')
require('./bots/postLobbyMatch/postLobbyMatch')


bots = { help: sendHelpMessage, lobby: postLobbyMatch }


Client.on('message', message => {

  if ( !validCommand(message) ) return
  
  route(message)
    .then(response => logSuccess(response))
    .catch(error => logError(error))
    
})


const route = async message => bots[getCommand(message)](message)