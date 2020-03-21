const {autobalance} = require('./autobalance.js')


const postLobby = async (message) => {
  
  const TextChannel = await getChannel(env.NA_ANNOUNCEMENTS_ID)

  return TextChannel.send("Hey guys, we're hosting an NA Lobby Match\nPlease react if you would like to participate", getEmbed(message))

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
  userData.lobbyType  = subCommands[3] || 'normal'


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
    .setDescription(`${userData.lobbyType} lobby match`)
    .addFields(
      { name: `Posted By: ${userData.nickname}`, value: "\u200B", inline: false },
      { name: '**__Radiant__**', value: '1.\n2.\n3.\n4.\n5.\n', inline: true },
      { name: '**__Dire__**', value: '1.\n2.\n3.\n4.\n5.\n', inline: true },
      { name: "\u200B", value: "\u200B", inline: false},
      { name: 'Coaches: ', value: "\u200B", inline: true}
    )
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



const getTeamLists = async (reactions, lobbyPost) => {

  let players     = {}

  let rolesSelected       = []

  let positions   = { '1️⃣': 1, '2️⃣': 2, '3️⃣': 3, '4️⃣': 4, '5️⃣': 5 }

  for (const emoji in reactions) {
    
    const usersArray = reactions[emoji]

    for (const index in usersArray) {

      const user_id     = await usersArray[index]
      const user        = await getUser(user_id)

      if ( user.bot || isCoach(user) ) continue

      const nickname  =  await getNickname(user)
      const guildMember = await getGuildMember(user) 
      const tier        = await getTier(guildMember)
      const position    = positions[emoji]

      if ( players.hasOwnProperty(nickname) ) {
        players[nickname]['rolesSelected'].push(position)
        continue
      }

      players[nickname] = {tier: tier, rolesSelected: [position]}

    } 

  }

  return autobalance(players)
}




const getCoachList = async (reactions, lobbyPost) => {
  
  let coaches = []

  for (const emoji in reactions) {
    
    const usersArray = reactions[emoji]

    for (const index in usersArray) {

      const user_id = await usersArray[index]
      const user = await getUser(user_id)

      if (user.bot) continue

      const nickname  =  await getNickname(user)

      if ( isCoach(user) && !coaches.includes(nickname) ) {
        coaches.push(nickname)
        continue
      }

    } 

  }

  return coaches
}




const updateEmbed = (lobbyPost, coaches, teams) => {

  const coachList = coaches.join(', ') || "\u200B"
  
  const radiant = teams[0]['radiant']
  const dire = teams[1]['dire']

  const newEmbed = new Discord.MessageEmbed(lobbyPost.embeds[0])
    .spliceFields(1, 1, { name: '**__Radiant__**', value: `1. ${radiant['1']}\n2. ${radiant['2']}\n3. ${radiant['3']}\n4. ${radiant['4']}\n5. ${radiant['5']}\n`, inline: true })
    .spliceFields(2, 1, { name: '**__Dire__**', value: `1. ${dire['1']}\n2. ${dire['2']}\n3. ${dire['3']}\n4. ${dire['4']}\n5. ${dire['5']}\n`, inline: true })
    .spliceFields(4, 1, { name: 'Coaches: ', value: coachList, inline: true})
  
  lobbyPost.edit("Hey guys, we're hosting an NA Lobby Match\nPlease react if you would like to participate", newEmbed)

}




module.exports = {
  postLobby, 
  addReactions, 
  getEmbed, 
  getReactions, 
  updateEmbed,
  getTeamLists,
  getCoachList }