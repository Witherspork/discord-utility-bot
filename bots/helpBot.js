helpBot = (message) => {
	const helpMessage = {
		color: 0x0099ff,
		title: 'DotaFromZero bot',
		description: description,
		thumbnail: {
			url: 'http://getdrawings.com/free-icon/robot-icon-png-57.png',
		},
		footer: {
			text: 'created by TheForce. Special Thanks to all the testers and devs <3'
		},
	}

	message.reply({ embed: helpMessage })

	return 'Help message sent'

}


const description = `
Commands:!dfz lobby <date> <time> <timezone> <lobbytype>

example: !dfz lobby 3/15/20 9:00pm EST meme

lobby types: meme, open or just leave blank
to ping tiers 1 & 2`