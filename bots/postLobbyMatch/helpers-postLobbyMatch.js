// any function called that is not defined here 
// is in helpers-general.js
//------


getEmbed = (message) => {

  // get our message as an array of separate values
  subCommands     = getSubCommands(message)

  const date      = subCommands[0]
  const time      = subCommands[1]
  const timezone  = subCommands[2]
  const lobbyType = subCommands[3]


  // get the user nickname
  const nickname  = getNickname(message.author)

  const userIcon    = message.author.displayAvatarURL()



  return new Discord.MessageEmbed()
    .setColor('#ff8c00')
    .setTitle(`🎟️  NA Lobby Match ${date} ${time} ${timezone}  🎟️`)
    .setThumbnail(userIcon)
    .addFields(
      { name: `Posted By: ${nickname}`, value: "\u200B", inline: false },
      { name: '**__Radiant__**', value: '1.\n2.\n3.\n4.\n5.\n', inline: true },
      { name: '**__Dire__**', value: '1.\n2.\n3.\n4.\n5.\n', inline: true },
      { name: "\u200B", value: "\u200B", inline: false},
      { name: '**__Coaches__**', value: '1.\n2.\n3.\n4.\n5.\n', inline: false },
    )
    .addField('Inline field title', 'Some value here', true)
    .setImage('https://image.flaticon.com/icons/png/128/588/588267.png')
    .setTimestamp()
    .setFooter('Smash the  ✅  if you would like to participate.\nPick any positions you are comfortable playing\nusing the reactions below');
}