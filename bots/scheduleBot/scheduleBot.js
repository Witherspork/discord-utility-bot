require('./helpers-scheduleBot')


// get our channel object
const Channel = getChannel(env.NA_ANNOUNCEMENTS_ID)


scheduleBot = async (message) => {

  // get our channel object
  const Channel = getChannel(env.NA_ANNOUNCEMENTS_ID)  

  // get all users commands after prefix and first command  
  const subCommands = getSubCommands(message)


  let test = await postAnnouncement(Channel)

  setTimeout( () => {

    const receivedEmbed = test.embeds[0];
    const embed = new Discord.MessageEmbed(receivedEmbed)
      .setTitle('New title')
      .setDescription('Description after the edit')
    
      test.edit(embed);
  }, 3000)

  return 'lobby match posted'
}