TIER_ONE_ID = process.env.TIER_ONE_ID
TIER_TWO_ID = process.env.TIER_TWO_ID
TIER_THREE_ID = process.env.TIER_THREE_ID



const lobbyTypes = {
    open: `OPEN LOBBY MATCH\n<@&${TIER_ONE_ID}><@&${TIER_TWO_ID}><@&${TIER_THREE_ID}>`,
    meme: `MEME TEAM SATURDAY\n<@&${TIER_ONE_ID}><@&${TIER_TWO_ID}><@&${TIER_THREE_ID}>`,
    normal: `LOBBY MATCH\n<@&${TIER_ONE_ID}><@&${TIER_TWO_ID}>`
  }

let lobbyType, 
  embedMessage, 
  eventName





scheduleBot = async (message) => {
  lobbyType = getLobbyType(CommandArgs[5], lobbyTypes)
  announcementMessage = await postAnnouncement(message, ANNOUNCEMENTS_ID)
  await createReactions(announcementMessage)
  return 'Lobby posted'
}




postAnnouncement = async (message, channelID) => {
  const lobbyMessage = createLobbyMessage(message)
  embedMessage = await createEmbedMessage(message)
  
	return await Client
    .channels
    .get(channelID)
    .send(lobbyMessage,{ embed: embedMessage })

  return 'lobby match posted to na-announcements\n'
}




createLobbyMessage = (message) => {
  const date = CommandArgs[2]
  return `Hey guys, we're hosting an NA Lobby Match\nPlease react if you would like to participate\n-------------------------------\n${lobbyType}\n`
}




createEmbedMessage = async (message) => {
  const userNickname  = await getNicknameFromUserID(message.author.id)
  const date = CommandArgs[2]
  const time = CommandArgs[3]
  const timezone = CommandArgs[4]
  const userIcon = message.author.avatarURL
  return embedObject(date, time, timezone, userNickname, userIcon)
}




// create our lobby match embed object
embedObject = (date, time, timezone, userNickname, userIcon) => {
  return { 
      color: "10669055",
      title: `🎟️  NA Lobby Match ${date}  🎟️`,
      description: `@ ${time} ${timezone}\n\nPosted By: ${userNickname}\n\n\n`, // 9:00pm America/New_York
      fields: [
        {
          name: "**__Radiant__**",
          value: "1.\n2.\n3.\n4.\n5.\n",
          inline: true
        },
        {
          name: "**__Dire__**",
          value: "1.\n2.\n3.\n4.\n5.\n",
          inline: true
        },
        {
          name: "\u200B", // this is here so the embed has a 2 column layout
          value: "\u200B"
        },
        {
          name: "**__Waiting List__**",
          value: "1.\n2.\n3.\n4.\n5.\n",
          inline: true
        },
        {
          name: "**__Coaches__** ",
          value: "1.\n2.\n3.\n4.\n5.\n",
          inline: true
        }
      ],
      image: {
        url: "https://seeklogo.com/images/D/dota-2-logo-556BDCC022-seeklogo.com.png"
      },
      footer: {
        text: "Smash the  ✅  if you would like to participate.\nPick any positions you are comfortable playing\nusing the reactions below"
    }
  }
}




createReactions = async (message) => {
  await message.react('✅')
  await message.react('1️⃣')
	await message.react('2️⃣')
	await message.react('3️⃣')
	await message.react('4️⃣')
	await message.react('5️⃣')
}




// this is a patch due to a bug in discord on the messageReactionRemove event not working
// https://github.com/discordjs/discord.js/issues/3941#event-3129973046
Client.on('raw', (rawData) => {
  // guard
  if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(rawData.t)) return
  updateAnnouncement(rawData)
})




updateAnnouncement = async (rawData) => {

  const message = await getMessagebyID(rawData.d.message_id)

  // guard
  if(await notValidLobbyPost(message)) return


  const userAction = rawData.t
  const user = await Client.fetchUser(rawData.d.user_id)

  // guard if user is a bot
  if(user.bot) return



  // create user data object with everything we need
  // to add or remove users from the embed
  let userEmbedUpdateData = {}
  userEmbedUpdateData = await getUpdateData(user, message, userEmbedUpdateData)


  // check if user is a coach
  const  userRoles = await getGuildMemberFromUserID(rawData.d.user_id)
  const userIsCoach = userRoles._roles.includes(COACH_ID)


  if (userAction == 'MESSAGE_REACTION_ADD')
    if (userIsCoach) // put the coach in the coaches list
      await addCoachToLobbyPost(userEmbedUpdateData, message, rawData)

    // otherwise user is a student so put them on a team or waiting list  
    await addUserToLobbyPost(userEmbedUpdateData, message, rawData)

  if (userAction == 'MESSAGE_REACTION_REMOVE')
    await removeUserFromLobbyPost(userEmbedUpdateData, message, rawData)

  //update the message with the same content plus the new embed message
  message.edit(message.content, {embed: embedMessage})

}




addCoachToLobbyPost = (userEmbedUpdateData, message, rawData) => {

  // guard if already in the embed
  if (userFoundInTheEmbed(userEmbedUpdateData)) return

  // combine radiant and dire
  // push user into first available spot
  // split the arrays back into the proper embed fields
  // joining them back into string with line breaks

  let coaches = userEmbedUpdateData
    .coaches
  
  let availableSlot = coaches.findIndex( (listItem) => listItem.length == 2)

  //guard if no slots available
  if (availableSlot == -1) return

  coaches[availableSlot] = `${coaches[availableSlot]} ${userEmbedUpdateData.nickname}`



  // recreate embed so we can then replace parts otherwise embed is undefined
  embedMessage = getEmbedMessage(message.embeds[0])
  
  // update embed which is outside of the function scope
  embedMessage.fields[COACHES].value = coaches.slice(0, coaches.length).join("\n")


  logSuccess('User added to lobby post!')
}









addUserToLobbyPost = (userEmbedUpdateData, message, rawData) => {

  // guard if already in the embed
  if (userFoundInTheEmbed(userEmbedUpdateData)) return

  // combine radiant and dire
  // push user into first available spot
  // split the arrays back into the proper embed fields
  // joining them back into string with line breaks

  let bothTeams = userEmbedUpdateData
    .radiantPlayers
    .concat(userEmbedUpdateData.direPlayers)
    .concat(userEmbedUpdateData.waitingList)
  
  let availableSlot = bothTeams.findIndex( (listItem) => listItem.length == 2)

  //guard if no slots available
  if (availableSlot == -1) return

  bothTeams[availableSlot] = `${bothTeams[availableSlot]} ${userEmbedUpdateData.nickname}`



  // recreate embed so we can then replace parts otherwise embed is undefined
  embedMessage = getEmbedMessage(message.embeds[0])
  
  // update embed which is outside of the function scope
  embedMessage.fields[RADIANT].value = bothTeams.slice(0,5).join("\n")
  embedMessage.fields[DIRE].value = bothTeams.slice(5, 10).join("\n")
  embedMessage.fields[WAITINGLIST].value = bothTeams.slice(10, bothTeams.length).join("\n")

  logSuccess('User added to lobby post!')
}





removeUserFromLobbyPost = (userEmbedUpdateData, message, rawData) => {

  // guard if already not in the embed
  if (!userFoundInTheEmbed(userEmbedUpdateData)) return

  // combine radiant and dire
  // push user into first available spot
  // split the arrays back into the proper embed fields
  // joining them back into string with line breaks

  let embedLists = userEmbedUpdateData
    .radiantPlayers
    .concat(userEmbedUpdateData.direPlayers)
    .concat(userEmbedUpdateData.waitingList)
    .concat(userEmbedUpdateData.coaches)

  
  let userSlot = embedLists.findIndex( (listItem) => listItem.slice(3, listItem.length) == userEmbedUpdateData.nickname)

  //guard if user not found
  if (userSlot == -1) return

  embedLists[userSlot] = embedLists[userSlot].slice(0, 2)


  // recreate embed so we can then replace parts otherwise embed is undefined
  embedMessage = getEmbedMessage(message.embeds[0])


  // update embed which is outside of the function scope
  embedMessage.fields[RADIANT].value = embedLists.slice(0,5).join("\n")
  embedMessage.fields[DIRE].value = embedLists.slice(5, 10).join("\n")
  embedMessage.fields[WAITINGLIST].value = embedLists.slice(10, 15).join("\n")
  embedMessage.fields[COACHES].value = embedLists.slice(15, embedLists.length).join("\n")

  logSuccess('User removed from lobby post!')
}




Client.on('messageReactionAdd', async (reactionMessage, user) => {
    if(reactionMessage.emoji.name != "✅") {
          balanceLobby(await reactionMessage.fetchUsers())
    }
});




balanceLobby = async userMap => {
  const users = await Array.from(userMap.keys())
  
  // remove id if user is a bot or a coach
  for (let i = 0; i < users.length; i++){
    const guildMember = await getGuildMemberFromUserID(users[i])

    // remove the bot
    if (guildMember.user.bot){
      users.splice(users.indexOf(users[i]), 1)
      continue
    }


    // remove any user that has the coach role
    const roles = await guildMember._roles
    
    if (roles.includes(COACH_ID)){
      users.splice(users.indexOf(users[i]), 1)
      continue
    }

  }

  console.log(users)
}