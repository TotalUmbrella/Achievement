var key = "***REMOVED***"
var id = "76561198296334011"
var apiUrlPlayer = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" + key + "&steamids=" + id + "&format=json"
var apiUrlGames = "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=" + key + "&include_played_free_games=1&include_appinfo=1&steamid=" + id + "&format=json"
// http://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v0002/?key=***REMOVED***&appid=76561198296334011
async function getData() {
    const response = await fetch("https://ghibli.rest/films")
    const data = await response.json()
    return data;
};
async function func1() {
    const response = await fetch(apiUrlPlayer)
    const data = await response.json()
    document.getElementById("username").innerHTML = data.response.players[0].personaname
}
func1()
async function achievements(gameId, key, userId) {
    const response = await fetch("http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid="+gameId+"&key="+key+"&steamid=" + userId)
    const data = await response.json()
    if (response.ok){
        return data
    }
    else {
        return false
    }
}
async function getGameData(gameId1) {
    const response = await fetch("http://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v0002/?gameid="+gameId1)
    const data = await response.json()  
    return data
}
async function populateGames(){
    const response = await fetch(apiUrlGames)
    const data = await response.json()
    games = data.response.games
    games.sort((a, b) => b.playtime_forever - a.playtime_forever)
    console.log(games)
    for (let i = 0; i < games.length; i++) {
        let game = document.createElement("div")
        time = Math.round(games[i].playtime_forever/60)
        achieveData = await achievements(games[i].appid, key, id)
        if (achieveData != false) {
            try {
                achievementsArray = achieveData.playerstats.achievements
                gameData = await getGameData(games[i].appid)
                console.log(gameData)
                let totalAchieve = gameData.achievementpercentages.achievements.length
                let achievePercentage =  Math.round((achievementsArray.length)/totalAchieve *100)
                if (achievePercentage == 100) {
                    game.innerHTML = `
                    <div class="gameWin">
                        <div class="left">
                            <img class="imgWin" src="https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/${games[i].appid}/${games[i].img_icon_url}.jpg" alt="">
                            <div class ="name">
                                ${games[i].name}
                            </div>
                        </div>
                        <div class="middle">
                        </div>
                        <div class="right">
                            <div class="achieveWin">
                                <div class="achieveFraction">
                                ${achievementsArray.length}/${totalAchieve}
                                </div>
                                <div class="achievePercentage">
                                    ${achievePercentage}%
                                </div>
                            </div>
                            <div class="hours">
                                ${time}h
                            </div>
                        </div>
                    </div>
                    `
                }
                else {
                    game.innerHTML = `
                    <div class="game">
                        <div class="left">
                            <img class="img" src="https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/${games[i].appid}/${games[i].img_icon_url}.jpg" alt="">
                            <div class ="name">
                                ${games[i].name}
                            </div>
                        </div>
                        <div class="middle">
                        </div>
                        <div class="right">
                            <div class="achieve">
                                <div class="achieveFraction">
                                ${achievementsArray.length}/${totalAchieve}
                                </div>
                                <div class="achievePercentage">
                                    ${achievePercentage}%
                                </div>
                            </div>
                            <div class="hours">
                                ${time}h
                            </div>
                        </div>
                    </div>
                    `
                }
                document.getElementById("mainBox").append(game)
                
            }
            catch (error){
                game.innerHTML = `
                <div class="game">
                    <div class="left">
                        <img class="img" src="https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/${games[i].appid}/${games[i].img_icon_url}.jpg" alt="">
                        <div class ="name">
                            ${games[i].name}
                        </div>
                    </div>
                    <div class="middle">
                    </div>
                    <div class="right">
                        <div class="achieve">
                            <div class="achieveFraction">
                                0/0
                            </div>
                            <div class="achievePercentage">
                                n/a
                            </div>
                        </div>
                        <div class="hours">
                            ${time}h
                        </div>
                    </div>
                </div>
                `
                document.getElementById("mainBox").append(game)
            }
        }
        else {
            game.innerHTML = `
            <div class="game">
                <div class="left">
                    <img class="img" src="https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/${games[i].appid}/${games[i].img_icon_url}.jpg" alt="">
                    <div class ="name">
                        ${games[i].name}
                    </div>
                </div>
                <div class="middle">
                </div>
                <div class="right">
                    <div class="achieve">
                        <div class="achieveFraction">
                            0/0
                        </div>
                        <div class="achievePercentage">
                            n/a
                        </div>
                    </div>
                    <div class="hours">
                        ${time}h
                    </div>
                </div>
            </div>
            `
            document.getElementById("mainBox").append(game)
        }
    }
}
populateGames()

