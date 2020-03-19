// ENVIRONMENT variables - not passed between all dev environments
require('dotenv').config()
env = process.env // shorten for convenience


// GLOBAL variables - can be passed between all dev environments
PREFIX = '!dfz'


// require helper functions file
require('./helpers-general')


// require the discord.js module
Discord = require('discord.js');


// create a new Discord client
Client = new Discord.Client()


// get the server as a gGild
Guild = Client.guilds.cache.get(env.GUILD_ID)


// START ENTRY POINT
//-------------------------------------------------------------------------------------


// login method returns a promise so we can use .then and .catch
Client.login(env.DISCORD_TOKEN)
  .then( require('./controller/controller.js') ) // send user message to the controller
  .catch( error => logError(error) )




// when the client is ready, run this code
// this event will only trigger one time after logging in
Client.once('ready', () => logSuccess('Bot connected\n')) // listen for when bot logs in



//-------------------------------------------------------------------------------------
//END ENTRY POINT----------------------------------------------------------------------
//-------------------------------------------------------------------------------------