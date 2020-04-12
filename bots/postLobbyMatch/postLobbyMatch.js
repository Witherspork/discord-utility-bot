/* parse users commands 
create embed message
bot reacts with 1,2,3,4,5 emojis
put users who reacted on a list
sort the list using the auto balancer */

const { 
  postLobby, 
  addReactions, 
  getEmbed, 
  getReactions, 
  updateEmbed,
  getTeamLists,
  getCoachList } = require('./helpers-postLobbyMatch')




postLobbyMatch = async (message) => {

  const lobbyPost = await postLobby(message)
  addReactions(lobbyPost)

  return 'lobby match posted'

}




Client.on('raw', async (rawData) => {

  if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(rawData.t)) return

  // add rawData.t to the getTeamLists function
  // check if adding or removing
  // if adding check to see if the lists are full
  // if the lists are full do nothing (for now)

  const user = await getUser(rawData.d.user_id)

  if (user.bot) return

  TextChannel           = await getChannel(env.NA_ANNOUNCEMENTS_ID)
  
  const announcements   = await TextChannel.messages.fetch({ limit: 10 })

  const lobbyPost       = announcements.find(announcement => announcement.id == rawData.d.message_id)

  const reactions       = await getReactions(lobbyPost)

  const teams           = await getTeamLists(reactions, lobbyPost)

  const coaches         = await getCoachList(reactions, lobbyPost)

  updateEmbed(lobbyPost, coaches, teams)

})