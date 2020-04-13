const {autobalance} = require('./autobalance.js')


const postLobby = async (message) => {
  
  const TextChannel = await getChannel(env.NA_ANNOUNCEMENTS_ID)

  const region = getSubCommands(message)[0]

  return TextChannel.send(`Hey guys, we're hosting a ${region} Lobby Match\nPlease react if you would like to participate`, getEmbed(message))

}




const addReactions = async (lobbyPost) => {

  await lobbyPost.react('➕')
}




// returns data from the coach who posts the lobby announcement
const getEmbedData = (message) => {

  let userData = {}

  subCommands         = getSubCommands(message)

  userData.region     = subCommands[0]
  userData.date       = subCommands[1]
  userData.time       = subCommands[2]
  userData.timezone   = subCommands[3]
  userData.lobbyType  = subCommands[4] || 'normal'



  userData.nickname   = getNickname(message.author)
  userData.userIcon   = message.author.displayAvatarURL()

  return userData

}




const getEmbed = (message) => {

  const userData = getEmbedData(message)

  return new Discord.MessageEmbed()
    .setColor('#ff8c00')
    .setTitle(`🎟️   ${userData.date} @ ${userData.time} ${userData.timezone}   🎟️`)
    .setThumbnail(userData.userIcon)
    .setDescription(`${userData.region} ${userData.lobbyType} lobby match`)
    .addFields(
      { name: `Posted By: ${userData.nickname}`, value: "\u200B", inline: false },
      { name: 'Sign ups', value: '\u200B', inline: true }
    )
    //.setImage('https://image.flaticon.com/icons/png/128/588/588267.png')
    .setFooter('Please join the voice chat on time!')

}




const updateEmbed = (lobbyPost, reactionType, user) => {

  // get current Sign ups
  let signUps = lobbyPost.embeds[0].fields[1].value

  // convert the string value to an array using the \n as a separator
  signUps = signUps.split('\n')

  // convert username to clickable @name
  const username = `<@${user.id}>`

  if (reactionType === 'MESSAGE_REACTION_ADD') {
    // add the user to the array if they are not on the list
    if ( signUps.includes(username) ) return
    signUps.push(username)
  }

  if (reactionType === 'MESSAGE_REACTION_REMOVE') {
    // remove the user from the array if they are on the list
    if ( !signUps.includes(username) ) return
    const indexOfUser = signUps.indexOf(username)
    signUps.splice(indexOfUser, 1)
  }

  // convert back to a string
  signUps = signUps.join('\n')

  const newEmbed = new Discord.MessageEmbed(lobbyPost.embeds[0])
    .spliceFields(1, 1, { name: 'Sign ups', value: signUps, inline: true })
  
  lobbyPost.edit("Hey guys, we're hosting an NA Lobby Match\nPlease react if you would like to participate", newEmbed)

}




module.exports = {
  postLobby, 
  addReactions, 
  getEmbed,  
  updateEmbed 
}