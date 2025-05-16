// var id = "76561198296334011"
var id = null
stopAll = false
var initialize = true
// http://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v0002/?key=&appid=76561198296334011
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
async function getGames() {
    const response = await fetch(apiUrlGames)
    const data = await response.json()
    games = data.response.games
    gamesList = []
    console.log(games)
    console.log(response)
    console.log(data)
    for (let i = 0; i < games.length; i++) {
        game = {}
        game["appid"] = games[i].appid
        game["name"] = games[i].name
        game["img_icon_url"] = games[i].img_icon_url
        game["time"] = games[i].playtime_forever/60
        let achieveData = await achievements(games[i].appid, key, id)
        try {
            if (achieveData == false) {   
                hasAchievements = false
                game["achievePercentage"] = 0
                game["achieveNumber"] = 0
                game["totalAchieve"] = 0
                gamesList.push(game)                
                continue
            }
            else {
                let gameData = await getGameData(games[i].appid)
                let achievementsArray = achieveData.playerstats.achievements
                let totalAchieve = gameData.achievementpercentages.achievements.length
                game["totalAchieve"] = totalAchieve
                game["achievePercentage"] =  Math.round((achievementsArray.length)/totalAchieve *100)
                game["achieveNumber"] = achievementsArray.length
            }
        }
        catch (error) {
            let gameData = await getGameData(games[i].appid)
            let totalAchieve = gameData.achievementpercentages.achievements.length
            game["totalAchieve"] = totalAchieve
            game["achievePercentage"] = 0
            game["achieveNumber"] = 0
        }
        hasAchievements = true
        game["hasAchievements"] = hasAchievements
        gamesList.push(game)
    }
    return gamesList;
}
async function populateGames(sortingMethod, hideCompleted, hideNoAchievements) {
    document.getElementById("mainBox").innerHTML = `
        <div class="header"> 
        </div>
    `
    let gamesList = localStorage.getItem("games")
    console.log(gamesList)
    if (gamesList === null) {   
        gamesList = await getGames()
        localStorage.setItem("games", JSON.stringify(gamesList))
    } else {
        gamesList = JSON.parse(gamesList); // Parse the JSON string to an object
    }
    if (sortingDirectionGlobal == "dsc") {
        switch (sortingMethod) {
            case "0":
                gamesList.sort((a, b) => b.time - a.time)
                break;
            case "1":
                gamesList.sort((a, b) => b.achievePercentage - a.achievePercentage)
                break;
            case "2":
                gamesList.sort((a, b) => b.achieveNumber - a.achieveNumber)
                break;
        }
    }
    else if (sortingDirectionGlobal == "asc") {
        switch (sortingMethod) {
            case "0":
                gamesList.sort((a, b) => a.time - b.time)
                break;
            case "1":
                gamesList.sort((a, b) => a.achievePercentage - b.achievePercentage)
                break;
            case "2":
                gamesList.sort((a, b) => a.achieveNumber - b.achieveNumber)
                break;
        }
    }
    console.log(sortingMethod)
    console.log(sortingDirectionGlobal)
    console.log(gamesList)

    for (let i = 0; i < gamesList.length; i++) {
        let game = document.createElement("div")
        time = Math.round(gamesList[i].time, 1)
        if (gamesList[i].hasAchievements) {
                let totalAchieve = gamesList[i].totalAchieve
                let achieveNumber = gamesList[i].achieveNumber
                let achievePercentage = gamesList[i].achievePercentage
                if (achievePercentage == 100) {
                    if (hideCompleted == true) {
                        console.log(hideCompleted)
                        console.log(hideCompletedGlobal)
                        continue
                    }
                    game.innerHTML = `
                    <div class="gameWin">
                        <div class="left">
                            <img class="imgWin" src="https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/${gamesList[i].appid}/${gamesList[i].img_icon_url}.jpg" alt="">
                            <div class ="name">
                                ${gamesList[i].name}
                            </div>
                        </div>
                        <div class="middle">
                        </div>
                        <div class="right">
                            <div class="achieveWin">
                                <div class="achieveFraction">
                                ${achieveNumber}/${totalAchieve}
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
                            <img class="img" src="https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/${gamesList[i].appid}/${gamesList[i].img_icon_url}.jpg" alt="">
                            <div class ="name">
                            ${gamesList[i].name}
                            </div>
                        </div>
                        <div class="middle">
                        </div>
                        <div class="right">
                            <div class="achieve">
                                <div class="achieveFraction">
                                ${achieveNumber}/${totalAchieve}
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
        }
        else if (gamesList[i].hasAchievements == false && hideNoAchievements == false) {
            game.innerHTML = `
            <div class="game">
                <div class="left">
                    <img class="img" src="https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/${games[i].appid}/${games[i].img_icon_url}.jpg" alt="">
                    <div class ="name">
                        ${gamesList[i].name}
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
        }
        else if (gamesList[i].hasAchievements == false && hideNoAchievements == true) {
            continue
        }
        document.getElementById("mainBox").append(game)
    }
}
flag = false

hideCompletedGlobal = localStorage.getItem("hideCompleted")
hideNoAchievementsGlobal = localStorage.getItem("hideNoAchievements")
sortingMethodGlobal = localStorage.getItem("sortingMethod")
sortingDirectionGlobal = localStorage.getItem("sortingDirection")
if (hideCompletedGlobal == null) {
    hideCompletedGlobal = false
    localStorage.setItem("hideCompleted", hideCompletedGlobal)
}
if (hideNoAchievementsGlobal == null) {
    hideNoAchievementsGlobal = false
    localStorage.setItem("hideNoAchievements", hideNoAchievementsGlobal)
}
if (sortingMethodGlobal == null) {
    sortingMethodGlobal = "0"
    localStorage.setItem("sortingMethod", sortingMethodGlobal)
}
if (sortingDirectionGlobal == null) {
    sortingDirectionGlobal = "dsc"
    localStorage.setItem("sortingDirection", sortingDirectionGlobal)
}
stupidFlag = 0
function main() {
    apiUrlPlayer = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" + key + "&steamids=" + id + "&format=json"
    apiUrlGames = "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=" + key + "&include_played_free_games=1&include_appinfo=1&steamid=" + id + "&format=json"

    func1()
    populateGames(sortingMethodGlobal, hideCompletedGlobal, hideNoAchievementsGlobal)
    document.getElementById("pfp").addEventListener("click", function() {
        // window.open("https://steamcommunity.com/profiles/76561198296334011")
        document.getElementById("pd").classList.toggle("dropdownActive")
        console.log("clickedpfp")
    })
    document.getElementById("ascContainer").addEventListener("click", function() {
        // window.open("https://steamcommunity.com/profiles/76561198296334011")
        document.getElementById("asc").classList.toggle("dsc")
        stupidFlag++
        // if stupidFlag is odd, then it is ascending
        if (stupidFlag % 2 == 0) {
            sortingDirectionGlobal = "dsc"
        }
        else {
            sortingDirectionGlobal = "asc"
        }
        localStorage.setItem("sortingDirection", sortingDirectionGlobal)
    })
    document.getElementById("filter").addEventListener("click", function() {
        document.getElementById("filterContainer").classList.toggle("filterContainerActive")
        if (flag) {
            document.getElementById("filterSettings").classList.toggle("filterSettingsActive")
        }
        else {
            setTimeout(() => {
                document.getElementById("filterSettings").classList.toggle("filterSettingsActive")
            }, "300");
        }
        flag = !flag
    })
    document.getElementById("filterSave").addEventListener("click", function() {
        hideCompletedGlobal = document.getElementById("completed").checked
        console.log(hideCompletedGlobal)
        hideNoAchievementsGlobal = document.getElementById("noAchievements").checked
        sortingMethodGlobal = document.getElementById("filterSelect").value
        console.log(hideCompletedGlobal)
        console.log(hideNoAchievementsGlobal)
        console.log(sortingMethodGlobal)
        localStorage.setItem("hideCompleted", hideCompletedGlobal)
        localStorage.setItem("hideNoAchievements", hideNoAchievementsGlobal)
        localStorage.setItem("sortingMethod", sortingMethodGlobal)
        populateGames(sortingMethodGlobal, hideCompletedGlobal, hideNoAchievementsGlobal)
    })
    document.getElementById("userIdButton").addEventListener("click", function() {
        id1 = document.getElementById("userId").value;
        console.log(id1)
        console.log(id1.length)
        console.log(isNaN(id1))
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
            initialize = false
            document.getElementById("pfp").addEventListener("click", function() {
                // window.open("https://steamcommunity.com/profiles/76561198296334011")
                document.getElementById("pd").classList.toggle("dropdownActive")
            })
            stopAll = true
        }
    })
}
