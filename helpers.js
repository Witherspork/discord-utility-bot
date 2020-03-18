// validate user command message
validateCommand = (message, bots) => {
  if (message.author.bot) 
    return
  else // get only the command without prefix or options
    command = getCommand(message) // helpers.js


  if (bots[command] === undefined) // check if command invalid
    throw Error('user did not enter a valid command')
  
  return command
}




// terminal colors to use in log messages
RED='\033[0;31m'
GREEN='\033[0;32m'
WHITE='\033[1;37m'
PURPLE='\033[0;35m'

// log pretty error message
logError = error =>
  console.log(
    `${RED}error path:\n${WHITE}${
      error
        .stack
        .split('\n')[1]
        .trim()
        .replace('(', '')
        .replace(')', '')}\n\n${RED}error message:\n${WHITE}${error.message
      }\n`
  )


// log pretty success message
logSuccess = message => console.log(`${GREEN}Success! ${WHITE}${message}\n`)


// check if users message is a normal chat message not a bot command
notACommand = message => {
    if (message.content.split(" ")[0] != PREFIX) // checks the first part of the message for !dfz
      return true
  }


// remove prefix and options leaving only the bot command
getCommand = message => message
  .content
  .replace("!dfz ","")
  .split(" ")[0]



// access each argument in bot command as array index
stringToArray = message => message.content.split(" ")




getGuildMemberFromUserID = user_id => Client.guilds.get(GUILD_ID).fetchMember(user_id)



getNicknameFromUserID = async user_id => { 
  let guildMember = await Client.guilds.get(GUILD_ID).fetchMember(user_id)

  const nickname = guildMember.nickname

  if (nickname === null)
    return guildMember.user.username

  return nickname 

}


// get user's role
getRole = reactionMessage => reactionMessage
  .message
  .member
  .guild
  .roles
  .find(role => role.name === 'Coach') // if not found null


// get the lobby type to change the lobby message
getLobbyType = (command, lobbyTypes) => command === undefined ? lobbyTypes['normal'] : lobbyTypes[command]




getMessagebyID = async message_id => {
  try{
    const channel = await Client.channels.fetch(ANNOUNCEMENTS_ID)
    const messages = await channel.fetchMessages({around: message_id, limit: 1})
    console.log(messages)
    const message = await messages.resolve(message_id)
    return message === undefined ? `\n${PURPLE}Message too old to update\n` : message
  } catch(error) {
    logError(error)
  }
}



notValidLobbyPost = async message => {
  console.log(message)
  if (message.content.split('\n')[0] == LOBBY_POST_CONTENT && message.author.username.split(" ")[0] == "DotaFromZero"){
    return false
  }

  return true
}




getEmbedFields = message => message.embeds[0].fields // returns array




getEmbedMessage = (embed) => {

  let temp = {
    color: embed.color,
    title: embed.title,
    description: embed.description,
    fields: [
      {name: embed.fields[0].name, value: "1.\n2.\n3.\n4.\n5.\n", inline: embed.fields[0].inline},
      {name: embed.fields[1].name, value: "1.\n2.\n3.\n4.\n5.\n", inline: embed.fields[1].inline},
      {name: embed.fields[2].name, value: embed.fields[2].value, inline: embed.fields[2].inline},
      {name: embed.fields[3].name, value: "1.\n2.\n3.\n4.\n5.\n", inline: embed.fields[3].inline},
      {name: embed.fields[4].name, value: "1.\n2.\n3.\n4.\n5.\n", inline: embed.fields[4].inline}
    ],
    image: {url: embed.image.url},
    footer: {text: embed.footer.text}
  }

  return temp
}




// create an object that holds all the values we need to update the embed message
getUpdateData = async (user, message, userEmbedUpdateData) => {

  userEmbedUpdateData.nickname = await getNicknameFromUserID(user.id)
  
  fields = getEmbedFields(message)
  
  userEmbedUpdateData.radiantPlayers = fields[RADIANT].value.split('\n')
  userEmbedUpdateData.direPlayers = fields[DIRE].value.split('\n')
  userEmbedUpdateData.waitingList = fields[WAITINGLIST].value.split('\n')
  userEmbedUpdateData.coaches = fields[COACHES].value.split('\n')


  return userEmbedUpdateData
}




userFoundInTheEmbed = (userEmbedUpdateData) => {
  // take all the fields and put them in one big array
  const combinedEmbedList = userEmbedUpdateData
    .radiantPlayers
    .concat(userEmbedUpdateData.direPlayers)
    .concat(userEmbedUpdateData.waitingList)
    .concat(userEmbedUpdateData.coaches)
    .map( (entry) => entry.substring(3, entry.length)) // strip away the number and period so only the name remains


  return (combinedEmbedList.includes(userEmbedUpdateData.nickname))
}
