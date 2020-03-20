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

