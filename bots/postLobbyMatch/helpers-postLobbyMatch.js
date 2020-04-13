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
      { name: '**__Radiant__**', value: '•\n•\n•\n•\n•\n', inline: true },
      { name: '**__Dire__**', value: '•\n•\n•\n•\n•\n', inline: true },
      { name: "\u200B", value: "\u200B", inline: false},
      { name: 'Coaches: ', value: "\u200B", inline: true},
      { name: "\u200B", value: "\u200B", inline: false},
      { name: 'Waitlist', value: '\u200B', inline: true }
    )
    //.setImage('https://image.flaticon.com/icons/png/128/588/588267.png')
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

const getCurrentTeams = (lobbyPost) => {
  const fields = lobbyPost.embeds[0].fields

  const parseIdsFromEmbedValue = (embedValue) => {
    const matches = embedValue.match(/<@\d+>/g)

    if (matches && matches.length > 0) {
      return matches.map((userIdWithTag) => {
        if (userIdWithTag) {
          return userIdWithTag.substring(2, userIdWithTag.length - 1)
        }
      }); 
    }
  }

  const radiantIds = parseIdsFromEmbedValue(fields[1].value)
  const direIds = parseIdsFromEmbedValue(fields[2].value)
  const waitlistIds = parseIdsFromEmbedValue(fields[6].value)

  return { radiantIds, direIds, waitlistIds }
}

const getTeamLists = async (reactions, lobbyPost) => {

  let players     = {}

  let rolesSelected       = []

  let positions   = { '1️⃣': 1, '2️⃣': 2, '3️⃣': 3, '4️⃣': 4, '5️⃣': 5 }

  const currentTeams = getCurrentTeams(lobbyPost)
  const currentPlayersCount = (currentTeams.radiantIds ? currentTeams.radiantIds.length : 0) + (currentTeams.direIds ? currentTeams.direIds.length : 0)

  const waitlistedPlayersIds = []

  for (const emoji in reactions) {
    const usersArray = reactions[emoji]

    for (const index in usersArray) {

      const user_id     = await usersArray[index]
      const user        = await getUser(user_id)
      
      let isWaitlisted = false

      if (currentPlayersCount >= 10) {
        if (
          (
            currentTeams.radiantIds && 
            currentTeams.radiantIds.includes(user_id)
          ) ||
          (
            currentTeams.direIds && 
            currentTeams.direIds.includes(user_id)
          ) ||
          user.bot
        ) {
          isWaitlisted = false
        } else {
          isWaitlisted = true
        }
      }
      
      if (
        currentTeams.waitlistIds && 
        currentTeams.waitlistIds.includes(user_id)
      ) {
        isWaitlisted = true
      }

      if (isWaitlisted && !waitlistedPlayersIds.includes(user_id)) {
        waitlistedPlayersIds.push(user_id)
        continue
      }

      if ( user.bot || isCoach(user) ) continue

      const nickname  =  await getNickname(user)
      const guildMember = await getGuildMember(user) 
      const tier        = await getTier(guildMember)
      const position    = positions[emoji]

      if ( players.hasOwnProperty(nickname) ) {
        players[nickname]['rolesSelected'].push(position)
        continue
      }

      players[nickname] = {
        tier: tier,
        rolesSelected: [position], 
        userId: user_id
      }

    } 

  }

  return [...autobalance(players), waitlistedPlayersIds]
}




const getCoachList = async (reactions, lobbyPost) => {
  
  let coaches = []

  for (const emoji in reactions) {
    
    const usersArray = reactions[emoji]

    for (const index in usersArray) {

      const user_id = await usersArray[index]
      const user = await getUser(user_id)

      if (user.bot) continue

      const userMention  =  await userMentionString({userId: user_id})

      if ( isCoach(user) && !coaches.includes(userMention) ) {
        coaches.push(userMention)
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
  const waitlist = teams[2].map((userId) => {
    if (userId) {
      return `•${userMentionString({userId})}`
    }
  }).join('\n')

  const newEmbed = new Discord.MessageEmbed(lobbyPost.embeds[0])
    .spliceFields(1, 1, { name: '**__Radiant__**', value: `• ${userMentionString(radiant['1'])}\n• ${userMentionString(radiant['2'])}\n• ${userMentionString(radiant['3'])}\n• ${userMentionString(radiant['4'])}\n• ${userMentionString(radiant['5'])}\n`, inline: true })
    .spliceFields(2, 1, { name: '**__Dire__**', value: `• ${userMentionString(dire['1'])}\n• ${userMentionString(dire['2'])}\n• ${userMentionString(dire['3'])}\n• ${userMentionString(dire['4'])}\n• ${userMentionString(dire['5'])}\n`, inline: true })
    .spliceFields(4, 1, { name: 'Coaches: ', value: coachList, inline: true})
    .spliceFields(6, 1, { name: 'Waitlist', value: waitlist || '\u200B', inline: true})
  
  lobbyPost.edit("Hey guys, we're hosting an NA Lobby Match\nPlease react if you would like to participate", newEmbed)

}

const userMentionString = (user) => {
  if (user && user.userId) {
    return `<@${user.userId}>`
  }

  return '';
}


module.exports = {
  postLobby, 
  addReactions, 
  getEmbed, 
  getReactions, 
  updateEmbed,
  getTeamLists,
  getCoachList }