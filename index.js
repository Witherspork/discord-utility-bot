require('dotenv').config()
env = process.env


PREFIX = '!dfz'


require('./helpers-general')


Discord = require('discord.js');;
Client = new Discord.Client()


/* Connect to discord and delegate requests to controller.js */
/*-----------------------------------------------------------*/

Client.once('ready', () => logSuccess('Bot connected\n'))


Client.login(env.DISCORD_TOKEN)
  .then( require('./controller.js') )
  .catch( error => logError(error) )