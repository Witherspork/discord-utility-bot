/* Any function not defined here 
is in helpers-general.js */

const postLobby = async (message) => {
  const TextChannel = await getChannel(env.NA_ANNOUNCEMENTS_ID)
  return TextChannel.send('NA Lobby Match', getEmbed(message))
}




const addReactions = async (lobbyPost) => {
  await lobbyPost.react('1️⃣')
	await lobbyPost.react('2️⃣')
	await lobbyPost.react('3️⃣')
	await lobbyPost.react('4️⃣')
	await lobbyPost.react('5️⃣')
}




// returns coaches command and get user details
const getEmbedData = (message) => {

  let userData = {}

  subCommands         = getSubCommands(message)

  userData.date       = subCommands[0]
  userData.time       = subCommands[1]
  userData.timezone   = subCommands[2]
  userData.lobbyType  = subCommands[3]


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
    .setDescription(`\t `)
    .addFields(
      { name: `Posted By: ${userData.nickname}`, value: "\u200B", inline: false },
      { name: '**__Radiant__**', value: '1.\n2.\n3.\n4.\n5.\n', inline: true },
      { name: '**__Dire__**', value: '1.\n2.\n3.\n4.\n5.\n', inline: true },
      { name: "\u200B", value: "\u200B", inline: false}
    )
    .addField('Coaches: ', 'TheForce, Mr. Garlic, Mastic, Journey', true)
    .setImage('https://image.flaticon.com/icons/png/128/588/588267.png')
    .setFooter('Pick any positions you are comfortable playing using the reactions below')

}




const getReactions = async (rawData) => {

  TextChannel = await getChannel(env.NA_ANNOUNCEMENTS_ID)

  const latestMessages = await TextChannel.messages.fetch({ limit: 5 })

  const message = latestMessages.find(message => message.id == rawData.d.message_id)

  let emojis = await message.reactions.cache // gets all emojis with user data (returns a reactionManager)

  emojis.forEach( (emoji) => l('test'))

  // let users = await reactionManager.users.fetch({limit: 20}) //do this for each reaction

}




const updateEmbed = (reactions) => {

}

module.exports = {postLobby, addReactions, getEmbed, getReactions, updateEmbed}