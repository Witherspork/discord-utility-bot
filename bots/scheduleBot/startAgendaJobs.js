function startAgendaJobs() { 
	const Agenda = require('agenda')
	const connectionString = process.env.MONGODB_URI

	global.agenda = new Agenda({
	db: {address: connectionString, options: { useUnifiedTopology: true, autoReconnect: false, reconnectTries: false, reconnectInterval: false }, collection: 'lobby matches'},
	processEvery: '10 seconds'
	});

	global.agenda.define('setup lobby', {priority: 'high', concurrency: 10}, 
		async (job) => {
			// collect data saved in db
			const {messageID, channelID, coachID} = job.attrs.data;

			// get the channel, message then drill down to the reactions collection
			let nachannel = await global.client.channels.get( channelID )
			let myLobbyMessage = await nachannel.fetchMessage( messageID )
			let reactionsCollection = await myLobbyMessage.reactions

			// collect all users who reacted to the choosen emoji
			let reactionsArray = await Array.from( reactionsCollection )

			let players = []
			
			for( i in reactionsArray ) { 
				let reaction = reactionsArray[i][0]
				let users = Array.from(reactionsArray[i][1].users)
				for( j in users ) { 
					let userID = users[j][0]
					let username = users[j][1].username
					if( username == 'nori-bot' ) {
						continue
					}

					// send them a message and tally up their reactions
					let user = await global.client.fetchUser( userID )
					if( reaction == '✅' ){
						user.send( 'Pssst! The lobby match will be starting in a few minutes. You can join the voice channel here: https://discord.gg/rxpyZe' )
					}

					let playerFound = players.find( (element) => element.name == username ) 
					if( playerFound) { 
						if( reaction != '✅' ){ 
							playerFound.positions.push( reaction )
						}
					} else{
						let player = {
							name: username,
							positions: []
						}
						if( reaction != '✅' ){
							player.positions.push( reaction )
						}
						players.push( player )
					}
				}
			}

			coach = await global.client.fetchUser( coachID )

			let playerData = `


players\t\t\t\t\t\t\t\t\t\tpositions
---------------------------------------------------------
`
			for( i in players ){
				playerData += players[i].name+"\t\t\t\t\t\t\t\t\t"
				for( j in players[i].positions ){
					if( players[i].positions.length - 1 == j ){
						playerData += players[i].positions[j] + '\n\n'
					} else {
						playerData += players[i].positions[j] + '  '
					}
				}
			}

			await coach.send( playerData )

			// delete from mongo db when completed
			agenda.cancel( { name: 'setup lobby' }).then((value) => {
			  console.log( 'task deleted' )
			})
		});
	global.agenda.start(); 
}

module.exports = { startAgendaJobs }