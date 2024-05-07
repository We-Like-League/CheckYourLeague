import axios from 'axios';
import './teamGraph.css';
import {useEffect} from 'react';
const {idToChampion} = require('./idToChampion.js');

function TeamGraph({matchId, matchData}) {
  console.log(matchData);
  const teamOneData = matchData.info.teams[0];
  const teamTwoData = matchData.info.teams[1];
  const teamOne = {
    kda: {kills: 0, deaths: 0, assists: 0},
    gold: 0,
    towers: teamOneData.objectives.tower.kills,
    voidGrubs: teamOneData.objectives.horde.kills,
    heralds: teamOneData.objectives.riftHerald.kills,
    dragons: [],
    elders: 0,
    barons: teamOneData.objectives.baron.kills,
    bans: [],
    damage: [],
  };
  const teamTwo = {
    kda: {kills: 0, deaths: 0, assists: 0},
    gold: 0,
    towers: teamTwoData.objectives.tower.kills,
    voidGrubs: teamTwoData.objectives.horde.kills,
    heralds: teamTwoData.objectives.riftHerald.kills,
    dragons: [],
    elders: 0,
    barons: teamTwoData.objectives.baron.kills,
    bans: [],
    damage: [],
  };

  const getBans = () => {
    for (let i = 0; i < teamOneData.bans.length; i++) {
      if (!idToChampion[teamOneData.bans[i].championId]) {
        teamOne.bans.push("None");
      } else {
        teamOne.bans.push(idToChampion[teamOneData.bans[i].championId]);
      };
      if (!idToChampion[teamTwoData.bans[i].championId]) {
        teamTwo.bans.push("None");
      } else {
        teamTwo.bans.push(idToChampion[teamTwoData.bans[i].championId]);
      };
    };
  };

  const getCombatStats = () => {
    for (let i = 0; i < matchData.info.participants.length; i++) {
      const player = matchData.info.participants[i];
      if (i < 5) {
        teamOne.kda.kills += player.kills;
        teamOne.kda.deaths += player.deaths;
        teamOne.kda.assists += player.assists;
        teamOne.gold += player.goldEarned;
        teamOne.damage.push({championName: player.championName, playerName: player.riotIdGameName, damage: player.totalDamageDealtToChampions});
      } else {
        teamTwo.kda.kills += player.kills;
        teamTwo.kda.deaths += player.deaths;
        teamTwo.kda.assists += player.assists;
        teamTwo.gold += player.goldEarned;
        teamTwo.damage.push({championName: player.championName, playerName: player.riotIdGameName, damage: player.totalDamageDealtToChampions});
      };
    };
  };

  const getTimeline = () => {
    axios.get('http://localhost:3001/timeline', {params: {matchId: matchId}})
    .then((timeline) => {
      const timelineData = timeline.data.info.frames;
      // console.log(timelineData);
      // console.log(timelineData);
      //dragon kill is monsterType: "DRAGON" and type: "ELITE_MONSTER_KILL"
      // but maybe not going to keep track of elders, so only need to do gold from this
      for (let i = 0; i < timelineData.length; i++) {
        for (let j = 0; j < timelineData[i].events.length; j++) {
          if (timelineData[i].events[j].type === "ELITE_MONSTER_KILL" && timelineData[i].events[j].monsterType === "DRAGON") {
            if (timelineData[i].events[j].killerTeamId === 100) {
              if (timelineData[i].events[j].monsterSubType === "ELDER_DRAGON") {
                teamOne.elders++;
              } else {
                teamOne.dragons.push(timelineData[i].events[j].monsterSubType);
              };
            };
            if (timelineData[i].events[j].killerTeamId === 200) {
              if (timelineData[i].events[j].monsterSubType === "ELDER_DRAGON") {
                teamTwo.elders++;
              } else {
                teamTwo.dragons.push(timelineData[i].events[j].monsterSubType);
              };
            };
          };
        };
      };
      console.log(teamOne, teamTwo);
    })
  };

  getBans();
  getCombatStats();

  useEffect(() => {
    getTimeline();
  }, [])

  return (
    <div>
      TeamGraph
    </div>
  )
}

export default TeamGraph;