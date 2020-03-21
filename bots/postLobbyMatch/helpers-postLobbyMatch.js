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




// returns data from the coach who posts the lobby announcement
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




const getReactions = async (lobbyPost) => {

  let emojis = await lobbyPost.reactions.cache // map of reactionManagers


  let reactions = {}

  for (const emoji of emojis.entries()){

    const emojiCharacter = emoji[0]

    const userReactions = emoji[1] // map of reactionUserManagers (each key is the user id)

    const users = await userReactions.users.fetch({limit: 20})

    const user_ids = await users.keys()

    reactions[emojiCharacter] = Array.from(user_ids)

  }

  return reactions

}




const updateEmbed = async (reactions, lobbyPost) => {

  let players = {}
  
  let coaches = []

  for (const emoji in reactions) {
    
    const usersArray = reactions[emoji]

    for (const index in usersArray) {

      const user_id   = await usersArray[index]

      const user      = await getUser(user_id)

      if (user.bot) continue

      const nickname  =  await getNickname(user)

      if ( isCoach(user) ) {
        coaches.push(nickname)
        continue
      }
      
      players[nickname] = {roles: [].push(emoji)}

    } 

    l(players)

  }






  // const exampleEmbed = new Discord.MessageEmbed(lobbyPost.embeds[0])
	// .setTitle('Some title')
	// .setDescription('Description after the edit');
  
  // lobbyPost.edit('this is my new message', exampleEmbed)

}




module.exports = {postLobby, addReactions, getEmbed, getReactions, updateEmbed}