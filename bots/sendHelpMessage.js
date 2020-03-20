helpBot = (message) => {
	
  let helpMessage = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle('DotaFromZero bot')
    .setDescription(description)
    .setThumbnail('http://getdrawings.com/free-icon/robot-icon-png-57.png')
    .setFooter('created by TheForce')

	message.reply(helpMessage)

	return 'Help message sent'

}


const description = `
Commands: !dfz lobby <date> <time> <timezone> <lobbytype>

example: !dfz lobby 3/15/20 9:00pm EST meme

lobby types: meme, open or just leave blank
`