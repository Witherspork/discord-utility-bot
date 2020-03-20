require('./helpers-postLobbyMatch') // any function not in this file is here



postLobbyMatch = async (message) => {

  const TextChannel = await getChannel(env.NA_ANNOUNCEMENTS_ID) // get the channel where we are posting
  
  TextChannel.send(getEmbed(message)) // send the embed message


  // user enters a string example: !dfz lobby <date> <time> <timezone> <lobbytype>
  
  // a post is created in the na-announcements channel
  // it shows 2 lists of teams

  // students fill all lists except coaches
  // coaches only fill the coach list

  // the list will add students as they react
  // we need to keep a running list of all students who reacted

  


  return 'lobby match posted'
}



















// scheduleBot = async (message) => {

//   // get our channel object
//   const Channel = getChannel(env.NA_ANNOUNCEMENTS_ID)  

//   // get all users commands after prefix and first command  
//   const subCommands = getSubCommands(message)

//   let embed = getEmbed()

//   let test = await Channel.send(embed)


//   setTimeout( () => {

//     const receivedEmbed = test.embeds[0];
//     const embed = new Discord.MessageEmbed(receivedEmbed)
//       .setTitle('New title')
//       .setDescription('Description after the edit')
//       .spliceFields(0,1,[{name: 'name changed', value: 'value changed', inline: false}])
    
//       test.edit(embed);
//   }, 3000)

//   return 'lobby match posted'
// }





// Client.on('raw', async (rawData) => {
  
//   // guard
//   if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(rawData.t)) return
  
//   const message_id = rawData.d.message_id
  
//   TextChannel = await getChannel(env.NA_ANNOUNCEMENTS_ID)

//   const latestMessages = await TextChannel.messages.fetch({ limit: 7 })

//   let message = latestMessages.find(message => message.id == message_id)

//   let reactionManager = message.reactions.cache.first()

//   let users = await reactionManager.users.fetch({limit: 25})

//   console.log(users)


// })