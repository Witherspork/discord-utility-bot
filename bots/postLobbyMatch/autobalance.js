const autobalance = (players) => {

  const newObj = {}

  const playersCopy = Object.assign(newObj, players);

  let team = {
    radiant: { 1:'', 2:'', 3:'', 4:'', 5:''},
    dire: { 1:'', 2:'', 3:'', 4:'', 5:''}
  }


  let methods = [
    'getPlayersTier', 
    'numberOfRoles',
    'assignPos' 
  ]


  players.getPlayersTier = function(tier) {
    return Object.keys(this).reduce((acc, cur)=>{
      if (this[cur].hasOwnProperty('tier')){
        if (this[cur].tier == tier)
          acc[cur] = this[cur]
      }else{
        acc[cur] = this[cur]
      }
      
      return acc
    }, {})
  }


  players.numberOfRoles = function(numberOfRolesPicked) {
    return Object.keys(this).reduce((acc, cur)=>{

      if (this[cur].hasOwnProperty('rolesSelected')){
        if (this[cur].rolesSelected.length == numberOfRolesPicked)
        acc[cur] = this[cur]
      }else{
        acc[cur] = this[cur]
      }
      
      return acc
    }, {})
  }


  players.assignPos = function(posNum){
    for(key in this){
      if(methods.includes(key) == false){
        if(team.radiant[posNum] == ''){
          team.radiant[posNum] = key
          delete players[key]
        }else if(team.dire[posNum] == ''){
          team.dire[posNum] = key
          delete players[key]
        }
      }
    }
    return this
  }




  players
    .getPlayersTier(1)
    .numberOfRoles(1)
    .assignPos(5)


  players
    .getPlayersTier(1)
    .numberOfRoles(2)
    .assignPos(4)


  players
    .getPlayersTier(2)
    .assignPos(3)


  players
    .getPlayersTier(3)
    .assignPos(2)



  players
    .getPlayersTier(2)
    .assignPos(1)



  // brute force the rest
  for(let i = 1; i <= 3; i++){
    for(let j = 1; j <= 5; j++){
      players
      .getPlayersTier(i)
      .assignPos(j)
    }
  }


  // this is just for pretty output you don't actually need these for-loops
  // commenting out will output only the names of each person
  //-----------------------------------------
  for(key in team.radiant){
    let playerName = team.radiant[key]

    if (playersCopy[playerName] == undefined)
      continue

    let playerObj = playersCopy[playerName]
    playerObj.name = playerName
    delete playersCopy[playerName]['rolesSelected']
    team.radiant[key] = playersCopy[playerName]
  }

  for(key in team.dire){
    let playerName = team.dire[key]

    if (playersCopy[playerName] == undefined)
      continue

    let playerObj = playersCopy[playerName]
    playerObj.name = playerName
    delete playersCopy[playerName]['rolesSelected']
    team.dire[key] = playersCopy[playerName]
  }
  //-------------------------------------------
  //-------------------------------------------




  let radiant = {radiant: team.radiant}
  let dire = {dire: team.dire}


  // console.log('\n')
  // console.log(radiant)

  // console.log('\n')
  // console.log(dire)


  // remove the methods to make the output cleaner
  delete players.getPlayersTier
  delete players.numberOfRoles
  delete players.assignPos

  // console.log('\nRemaining players:')
  // console.log(players)


  return [radiant, dire]
}


module.exports = {autobalance}