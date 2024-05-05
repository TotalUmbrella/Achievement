var key = "***REMOVED***"
var id = "76561198296334011"
var apiUrlPlayer = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" + key + "&steamids=" + id + "&format=json"
var apiUrlGames = "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=" + key + "&include_appinfo=True&steamid=" + id + "&format=json"
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
        // achieveData = achievements(games[i].appid, key, id)
        game.innerHTML = `
        <div class="game">
        <div class="left">
            <img src="https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/${games[i].appid}/${games[i].img_icon_url}.jpg" alt="">
            <div class ="name">
                ${games[i].name}
            </div>
        </div>
        <div class="middle">

        </div>
        <div class="right">
            <div class="achieve">
                <div class="achieveFraction">
                    10/20
                </div>
                <div class="achievePercentage">
                    80%
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
populateGames()

