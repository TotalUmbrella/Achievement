var key = "***REMOVED***"
// var id = "76561198296334011"
var id = null
stopAll = false
var initialize = true
// http://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v0002/?key=***REMOVED***&appid=76561198296334011
async function populateUser() {
    const response = await fetch(apiUrlPlayer)
    const data = await response.json()
    return data.response.players[0]
}
async function achievements(gameId, key, userId) {
    const response = await fetch("https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid="+gameId+"&key="+key+"&steamid=" + userId)
    const data = await response.json()
    if (response.ok){
        return data
    }
    else {
        return false
    }
}
async function getGameData(gameId1) {
    const response = await fetch("https://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v0002/?gameid="+gameId1)
    const data = await response.json()  
    return data
}
async function populateGames(){
    const response = await fetch(apiUrlGames)
    const data = await response.json()
    games = data.response.games
    games.sort((a, b) => b.playtime_forever - a.playtime_forever)
    stopAll = false
    for (let i = 0; i < games.length; i++) {
        if (stopAll == true) {
            break
        }
        if (i == 0) {
            document.getElementById("mainBox").innerHTML = `
            <div class="header"> 
            </div>
        `
        }
        let game = document.createElement("div")
        time = Math.round(games[i].playtime_forever/60)
        achieveData = await achievements(games[i].appid, key, id)
        if (achieveData != false) {
            try {
                achievementsArray = achieveData.playerstats.achievements
                gameData = await getGameData(games[i].appid)
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

async function main() {
    apiUrlPlayer = "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" + key + "&steamids=" + id + "&format=json"
    apiUrlGames = "https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=" + key + "&include_played_free_games=1&include_appinfo=1&steamid=" + id + "&format=json"
    userData = await populateUser() 
    console.log(userData)
    document.getElementById("player").innerHTML = `
    <div class="name1" id="username">
        ${userData.personaname}
    </div>
    <img src="${userData.avatarfull}" alt="pfp" class="pfp" id="pfp">
    `
    document.getElementById("pfp").addEventListener("click", function() {
        // window.open("https://steamcommunity.com/profiles/76561198296334011")
        document.getElementById("pd").classList.toggle("dropdownActive")
        console.log("clickedpfp")
    })
    if (initialize == true) {
        initialize = false
        console.log("eventListenersAdded")
        console.log(initialize)
        document.getElementById("userIdButton").addEventListener("click", function() {
            id1 = document.getElementById("userId").value;
            if (isNaN(id1) == false && id1.length == 17) {
                id = id1
                main()
                stopAll = true
            }
        })
    }
    localStorage.setItem("Id", id)
    document.getElementById("username").innerHTML = userData.personaname
    document.getElementById("pfp").src = userData.avatarfull
    document.getElementById("steamLink").href = userData.profileurl
    populateGames()
}
if (localStorage.getItem("Id") != null) {
    id = localStorage.getItem("Id")
    console.log("rauns")
    main()
    
}
else {
    document.getElementById("mainBox").innerHTML = `
        <div class="pleaseLogIn">
            <div class="pleaseLogInText">
            Please Log In
            </div>
        </div>
        `
    document.getElementById("player").innerHTML = `
    <div class="userIdChange">
        <input type="text" id="userId1" class="userIdInput1" placeholder="Enter your steam id" maxlength=17>
        <button class="userIdButton1" id="userIdButton1">
            >
        </button>
    </div>
    `
    document.getElementById("userIdButton1").addEventListener("click", function() {
        id1 = document.getElementById("userId1").value;
        console.log("ran")
        if (isNaN(id1) == false && id1.length == 17) {
            id = id1
            main()
            document.getElementById("userIdButton").addEventListener("click", function() {
                id1 = document.getElementById("userId").value;
                console.log("ran")
                if (isNaN(id1) == false && id1.length == 17) {
                    id = id1
                    main()
                    stopAll = true
                }
            })
            document.getElementById("pfp").addEventListener("click", function() {
                // window.open("https://steamcommunity.com/profiles/76561198296334011")
                document.getElementById("pd").classList.toggle("dropdownActive")
            })
            stopAll = true
        }
    })
}