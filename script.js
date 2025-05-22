// var id = "76561198296334011"
console.log("script.js loaded");
var key = "127ACE4531C8AD3336B244C0A4AE05CD";
console.log("script.js loaded1");
var id = null
stopAll = false
var initialize = true
// http://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v0002/?key=&appid=76561198296334011
async function populateUser() {
    const response = await fetch("https://achievement-hbn5.onrender.com/api/player?userId="+id);
    const data = await response.json()
    console.log(data)
    pfpReal = document.getElementById("pfp");
    pfpReal.src = data.response.players[0].avatarmedium;
}

async function getGameData(gameId) {
    const response = await fetch("https://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v0002/?gameid="+gameId)
    const data = await response.json()  
    return data
}


async function achievements(gameId) {
    const response = await fetch("https://achievement-hbn5.onrender.com/api/achievements?gameId="+gameId+"&userId=" + id)
    const data = await response.json()
    if (response.ok){
        return data
    }
    else {
        return false
    }
}


async function getGames() {
    console.log("getting games")
    const response = await fetch("https://achievement-hbn5.onrender.com/api/games?userId="+id);
    const data = await response.json()

    games = data.response.games
    console.log("games gotten")
    gamesList = []

    document.getElementById("mainBox").innerHTML = `
        <div class="loading" id="loading"> 
            <div class="loadingBar">
            Loading... <---------->
            </div>
        </div>
    `

    for (let i = 0; i < games.length; i++) {
        saturateLoadingBar(i, games.length)
        game = {}
        game["appid"] = games[i].appid
        game["name"] = games[i].name
        game["img_icon_url"] = games[i].img_icon_url
        game["time"] = games[i].playtime_forever/60
        console.log("1")
        let achieveData = await achievements(games[i].appid)
        console.log("3") 
        try {
            if (achieveData == false) {   
                game["achievePercentage"] = 0
                game["achieveNumber"] = 0
                game["totalAchieve"] = 0
                game["hasAchievements"] = false
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
                game["hasAchievements"] = true
                gamesList.push(game)    
            }
        }
        catch (error) {
            console.log("error:" + i)
            let gameData = await getGameData(games[i].appid)
            if (Object.keys(gameData).length == 0) {
                game["achievePercentage"] = 0
                game["achieveNumber"] = 0
                game["totalAchieve"] = 0
                game["hasAchievements"] = false
                gamesList.push(game)                
            }
            else {
                let totalAchieve = gameData.achievementpercentages.achievements.length
                game["totalAchieve"] = totalAchieve
                game["achievePercentage"] = 0
                game["achieveNumber"] = 0
                game["hasAchievements"] = true
                gamesList.push(game)
            }
        }
    }

    return gamesList;
}

arbitrary = 0

function saturateLoadingBar(index, total) {
    proportion = Math.floor((index/total)*10)
    percent = Math.floor((index/total)*100)
    console.log(total > 80)
    arbitrary++
    if (arbitrary > 3)
    {
        arbitrary = 0
    }
    if (total > 80)
    {
        document.getElementById("loading").innerHTML = `
        <div class="loadingBar">
        Loading... [${("#").repeat(proportion)}${("-".repeat(10-proportion))}] ${percent}%
        </br>
        </br>
        this may take a few minutes...
        </div>
    
    `
    }
    else {
        document.getElementById("loading").innerHTML = `
            <div class="loadingBar">
            Loading... <${("█").repeat(proportion)}${("▒".repeat(10-proportion))}>
            </div>
        `
    }

}

async function populateGames(sortingMethod, hideCompleted, hideNoAchievements) {

    let gamesList = localStorage.getItem("games")

    if (gamesList === null) {   
        gamesList = await getGames()
        localStorage.setItem("games", JSON.stringify(gamesList))
    } else {
        gamesList = JSON.parse(gamesList); // Parse the JSON string to an object
        games = gamesList;
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

    document.getElementById("mainBox").innerHTML = `
        <div class="header"> 
        </div>
    `

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
        console.log("appended")
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

function updateProgress() {
    return
}

function main() {
    console.log("Program running");
    id = localStorage.getItem("userId")
    console.log(id)
    populateUser();


    populateGames(sortingMethodGlobal, hideCompletedGlobal, hideNoAchievementsGlobal)
    document.getElementById("pfp").addEventListener("click", function() {
        document.getElementById("pd").classList.toggle("dropdownActive")
        console.log("clickedpfp")
    })
    document.getElementById("ascContainer").addEventListener("click", function() {
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
                    localStorage.setItem("userId", id);
                    populateGames(sortingMethodGlobal, hideCompletedGlobal, hideNoAchievementsGlobal)
                    stopAll = true
                }
            })
            initialize = false
            document.getElementById("pfp").addEventListener("click", function() {
                document.getElementById("pd").classList.toggle("dropdownActive")
            })
            stopAll = true
        }
        console.log(id1)
        console.log(id)
    })
}
main();