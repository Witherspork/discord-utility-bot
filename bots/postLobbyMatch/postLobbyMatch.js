/* parse users commands 
create embed message
bot reacts with 1,2,3,4,5 emojis
put users who reacted on a list
sort the list using the auto balancer */

const { postLobby, addReactions, getEmbed, getReactions, updateEmbed } = require('./helpers-postLobbyMatch')




postLobbyMatch = async (message) => {

  const lobbyPost = await postLobby(message)
  addReactions(lobbyPost)

  return 'lobby match posted'

}




Client.on('raw', async (rawData) => {

  if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(rawData.t)) return

  
  const reactions = await getReactions(rawData)
  updateEmbed(reactions)

  


})