require('./helpers-scheduleBot')



scheduleBot = async (message) => {

  // get our channel object
  const Channel = getChannel(env.NA_ANNOUNCEMENTS_ID)  

  // get all users commands after prefix and first command  
  const subCommands = getSubCommands(message)

  let embed = getEmbed()

  let test = await Channel.send(embed)


  setTimeout( () => {

    const receivedEmbed = test.embeds[0];
    const embed = new Discord.MessageEmbed(receivedEmbed)
      .setTitle('New title')
      .setDescription('Description after the edit')
      .spliceFields(0,1,[{name: 'name changed', value: 'value changed', inline: false}])
    
      test.edit(embed);
  }, 3000)

  return 'lobby match posted'
}



Client.on('raw', async (rawData) => {
  
  // guard
  if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(rawData.t)) return
  console.log('test')
  
  const message_id = rawData.d.message_id
  
  TextChannel = await getChannel(env.NA_ANNOUNCEMENTS_ID)

  const latestMessages = await TextChannel.messages.fetch({ limit: 7 })

  let message = latestMessages.find(message => message.id == message_id)

  let reactionManager = message.reactions.cache//.first()

  let users = await reactionManager//.users.fetch()

  console.log(users)


})



