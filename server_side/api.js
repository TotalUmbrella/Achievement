require('dotenv').config();
const key = process.env.STEAM_API_KEY; // get steam api key

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors()); // enable cors

const PORT = process.env.PORT || 3000; //default port 3000, allowing change from env file in case i need to change it on render

app.get('/api/achievements', async (req, res)=>{
    const gameId = req.query.gameId;
    const userId = req.query.userId;
    const response = await fetch("https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid="+gameId+"&key="+key+"&steamid="+userId);
    const data = await response.json();
    res.json(data);
})

app.get('/api/player', async (req, res)=>{
    const userId = req.query.userId;
    const response = await fetch("http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" + key + "&steamids=" + userId + "&format=json");
    const data = await response.json();
    res.json(data);
})

app.get('/api/games', async (req, res)=>{
    const userId = req.query.userId;
    const response = await fetch("http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=" + key + "&include_played_free_games=1&include_appinfo=1&steamid=" + userId + "&format=json")
    const data = await response.json();
    res.json(data);
})
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});