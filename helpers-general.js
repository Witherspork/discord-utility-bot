// Why waste time say lot word when few word do trick
l = (...logThis) => console.log(...logThis)




// terminal colors to use in log messages
RED='\033[0;31m'
GREEN='\033[0;32m'
WHITE='\033[1;37m'
PURPLE='\033[0;35m'




// log pretty error message
logError = error =>
  console.log(
    `\n${RED}error path:\n${WHITE}${
      error
        .stack
        .split('\n')[1]
        .trim()
        .replace('(', '')
        .replace(')', '')}\n\n${RED}error message:\n${WHITE}${error.message
      }`
  )




// log pretty success message
logSuccess = message => console.log(`\n${GREEN}Success! ${WHITE}${message}`)




isCoach = user => {
  const roles = getGuildMember(user)._roles
  return roles.includes(env.COACH_ID)
}




// user input is a valid command prefix and not a bot
validCommand = message => message.content.startsWith(PREFIX) 
  && !message.author.bot 
  && bots.hasOwnProperty(message.content.split(' ')[1]) // command is a key in our bots object in controller.js
  && isCoach(message)




// returns the command after the prefix
getCommand = message => message.content.split(' ')[1]




// gets all sub commands after prefix and main command
getSubCommands = message => message.content.split(' ').slice(2)




getUser = async user_id => await Client.users.fetch(user_id)




// get server by guild ID
getGuild = guild_id => Client
  .guilds
  .cache
  .get(guild_id)




// get specific user info within the discord server (they call it a guild)
getGuildMember = user => getGuild(env.GUILD_ID).member(user)




getNickname = user => getGuildMember(user).displayName




getTier = guildMember => {

  const tiers = {1: env.TIER_ONE_ID, 2: env.TIER_TWO_ID, 3: env.TIER_THREE_ID}
  const roles = guildMember._roles
  let tier = 0

  for (const key in tiers) {
    if (roles.includes(tiers[key])) tier = key
  }
  
  return tier
  
}




getChannel = channel_id => Client.channels.fetch(channel_id)