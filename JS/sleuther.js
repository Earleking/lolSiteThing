var idsToSearch = [];
function getDataArray() {
    return this.data;
}
function getRequester() {
    return this.request;
}
function grabGames(accountID, sql, rank, host, patchTime, apiKey, getGList, data, getGData, headerFunction, request, excelFunction, callback) {
    //console.log("Testing"); 
    getGList(accountID, sql, rank, apiKey, headerFunction, data, getGData, request, excelFunction, patchTime, function(data) {
        callback(data);
    });
    
}
function getGamesList(accountID, sql, rank, apiKey, headerFunction, data, getGData, request, toExcel, patchTime, callback) {
    var path = host + "/lol/match/v3/matchlists/by-account/" + accountID + '?queue=420&beginTime=' + patchTime + '&api_key=' + apiKey;
    
    request(path, function(error, response, body) {
        var json = JSON.parse(body);
        //console.log(json);
        //console.log(apik);
        getGData(json, sql, accountID, apiKey, data, headerFunction, request, toExcel, rank, function(data) {
            callback(data);
        });

    });
}

 function getData(jsonList, sql, accId, key, data, header, request, toExcel, rank, callback) {
    var t = data.length;
    var v = 1;
    try {
        jsonList.matches.length;
    } catch (TypeError) {
        console.log(jsonList);
        callback(data);
        return;
    }
    //jsonList.matches.length;

    loopCounter = 0;
    getDataLoop(jsonList, sql, accId, key, data, request, t, v, callback, loopCounter, rank);
}
function getDataLoop(jsonList, sql, accId, key, data, request, t, v, callback, loopCounter, rank) {
    var path = "https://na1.api.riotgames.com/lol/match/v3/matches/" + parseInt(jsonList.matches[loopCounter].gameId) + "?forAccountId=" + accId + "&api_key=" + key;
    var timelinePath = "https://na1.api.riotgames.com/lol/match/v3/timelines/by-match/" + parseInt(jsonList.matches[loopCounter].gameId) + "&api_key=" + key;
    var itemPath = "https://na1.api.riotgames.com/lol/static-data/v3/items?locale=en_US&tags=into&api_key=" + key;
    //console.log(i);
    setTimeout(function () {
        //console.log("hello");
        dataRequest(data, sql, jsonList, path, timelinePath, itemPath, request, t, v, accId, rank, key, callback);
        if(loopCounter < jsonList.matches.length - 1) {
            loopCounter += 1;
            v += 1;
            getDataLoop(jsonList, sql, accId, key, data, request, t, v, callback, loopCounter, rank);
        }
    }, 1700);

}
function dataRequest(data, sqlconnection, jsonList, path, path2, path3, request, t, v, accId, rank, apiKey, callback) {
    request(path, function(error, response, body) {
        request(path2, function(error, response, body2) {
            finalList = [];
            //console.log(data.length);
            t = data.length;
            //data[data.length] = [];
            //console.log(data);
            var participantId = 0;
            const json = JSON.parse(body);
            const timeline = JSON.parse(body2);
            for(var x = 0; x < 10; x ++){
                idsToSearch.push(json.participantIdentities[x].player.accountId);
                try{
                    //console.log(parseInt(json.participantIdentities[x].player.accountId));
                    if(parseInt(json.participantIdentities[x].player.accountId) == accId) {
                        participantId = json.participantIdentities[x].participantId - 1;
                    }
                } 
                catch (TypeError) {
                    //console.log(json);
                    console.log("Type Error");
                    callback(data);
                    return;
                }
                
            }
            //console.log(participantId);
            insertToColumns = [];
            for(var i = 0; i < 10; i ++) {
                const player = json.participants[i];
                /*data[t + i] = [];
                data[t + i][0] = player.timeline.lane;
                data[t + i][1] = player.timeline.role;
                data[t + i][2] = json.gameId;
                data[t + i][3] = player.stats.win;
                data[t + i][4] = player.stats.visionScore;
                data[t + i][5] = i;
                data[t + i][6] = player.stats.item0;
                data[t + i][7] = player.stats.item1;
                data[t + i][8] = player.stats.item2;
                data[t + i][9] = player.stats.item3;
                data[t + i][10] = player.stats.item4;
                data[t + i][11] = player.stats.item5;
                data[t + i][12] = player.stats.item6;
                data[t + i][13] = rank;*/
                insertToColumns[i] = [];
                insertToColumns[i][0] = json.gameId.toString() + i.toString();
                // console.log(insertToColumns[t + i][0]);
                insertToColumns[i][1] = json.gameId;
                insertToColumns[i][2] = player.stats.win ? 1:0;
                insertToColumns[i][3] = player.timeline.lane;
                insertToColumns[i][4] = player.timeline.role;
                insertToColumns[i][5] = player.stats.visionScore;
                insertToColumns[i][6] = i;
                insertToColumns[i][7] = player.stats.item0;
                insertToColumns[i][8] = player.stats.item1;
                insertToColumns[i][9] = player.stats.item2;
                insertToColumns[i][10] = player.stats.item3;
                insertToColumns[i][11] = player.stats.item4;
                insertToColumns[i][12] = player.stats.item5;
                insertToColumns[i][13] = player.stats.item6;
                insertToColumns[i][14] = rank;
                insertToColumns[i][15] = player.stats.kills;
                insertToColumns[i][16] = player.stats.deaths;
                insertToColumns[i][17] = player.stats.assists;
                insertToColumns[i][18] = player.championId;
                insertToColumns[i][19] = player.spell1Id;
                insertToColumns[i][20] = player.spell2Id;
                insertToColumns[i][21] = player.stats.totalMinionsKilled;   
                insertToColumns[i][22] = json.queueId;
                insertToColumns[i][23] = json.gameDuration;         
            }
            //fullListToCompletedItems(request, insertToColumns, apiKey, 0, function(fullList) {
              //  insertToColumns = fullList;
                var finalString = [], rowString = "";
                //console.log(insertToColumns.length);
                for(var rows = 0; rows < insertToColumns.length; rows ++) {
                    rowString = "";
                    //console.log(insertToColumns.length);
                    for(var cols = 0; cols < insertToColumns[rows].length; cols ++) {
                        //console.log(rowString);
                        if(parseInt(insertToColumns[rows][cols]) >= 0) {
                            rowString += insertToColumns[rows][cols] + ", ";
                        }
                        //else if(insertToColumns[rows][cols].toString() == 'true' || insertToColumns[rows][cols] == 'false'.toString()) {
                    //     rowString += insertToColumns[rows][cols] + ", ";
                        //}
                        else {
                            rowString += "'" + insertToColumns[rows][cols] + "', ";
                            
                        }
                    }   
                    finalString[rows] = "(" + rowString.trim().substr(0, rowString.length - 2) + ")";
                    //console.log(finalString)
                }
                //for(var x = 0; x < finalString.length; x ++) {
                    //finalString[x] = finalString[x].trim().substr(0, finalString[x].length - 1);
                //}
                //console.log(finalString);
                
                //console.log(qur);
                addDataToSQL(finalString, sqlconnection, 0, addDataToSQL);
                /*sqlconnection.query(qur, function(error, result) {
                    if(error) throw error;
                    console.log("success");
                });*/
                console.log(v + ":" + jsonList.matches.length);

                if(v == jsonList.matches.length) {
                    //toExcel(data, header);
                    v = 0;
                    //console.log(data.length);
                    callback(data);
                }
                //t += 1;
                //v += 1;      
                //console.log(x + " " + (jsonList.matches.length - 1));
            //});
            
            
            
        });
        
    });
}
function addDataToSQL(data, connection, index, callback) {
    var columns = "(id, GameID, Win, Lane, Role, VisionScore, ParticipantID, Item1, Item2, Item3, Item4, Item5, Item6, Trinket, Tier, )";
    var qur = "INSERT INTO games_1 VALUES " + data[index];
    connection.query(qur, function(error, result) {
        //if(error) throw error;
        if(error) {
            //throw error;
            console.log("Already exists");
            index += 1;
            if(index < data.length) {
                callback(data, connection, index, callback);
            }
        }
        else{
            console.log("success");
            index += 1;
            if(index < data.length) {
                callback(data, connection, index, callback);
            }
        }
        
    });
}

function fullListToCompletedItems(request, fullList, apiKey, index, callback) {
    var items = [];
    var finalList = [];
    for(var i = 0; i < 6; i ++) {
        items[i] = fullList[index][7 + i];
    }
    getSummonerCompletedItems(request, items, finalList,apiKey, function(finalList) {
        for(var x = 0; x < finalList.length; x ++) {
            fullList[index][7 + x] = finalList[x];
        }
        index += 1;
        if(index == fullList.length) {
            callback(fullList);
        }
        else {
            fullListToCompletedItems(request, fullList, apiKey, index, callback);
        }
    });
}

function getSummonerCompletedItems(request, items, finalList, apiKey, callback) {
    var path = "https://na1.api.riotgames.com/lol/static-data/v3/items/3379?locale=en_US&tags=into&tags=specialRecipe&api_key=" + apiKey;
    request(path, function(error, response, body) {
        var added = false;
        var apiItem = JSON.parse(body);
        const ornnItems = [3371, 3373, 3374, 3379, 3380, 3382, 3383, 3384, 3385,];
        const exceptionItems = [1054, 1055, 1056, 1083];
        if(apiItem.into == undefined) {
            for(var i = 0; i < exceptionItems.length; i ++) {
                if(apiItem.id == exceptionItems[i]) {
                    break;
                }
                if(i == exceptionItems.length - 1) {
                    finalList[finalList.length] = items[finalList.length];
                    added = true;
                }
            }         
        }
        else {
            for(var x = 0; x < ornnItems.length; x++) {
                if(apiItem.into[0] == ornnItems[x]) {
                    finalList[finalList.length] = items[finalList.length];
                    added = true;
                }
            }
        }
        if(added == false) {
            finalList[finalList.length] = 0;
            console.log("Cya Item");
        }
        if(finalList.length >= 6) {
            callback(finalList);
        }
        else {
            getSummonerCompletedItems(request, items, finalList, apiKey, callback);
        }
        
    });
}
function header(data) {
    //console.log(data);
    
    data.splice(0, 0, []);
    data[0].splice(0, 0, "Lane");
    data[0].splice(1, 0, "Role");
    data[0].splice(2, 0, "Game ID");
    data[0].splice(3, 0, "Win?");
    data[0].splice(4, 0, "Vision Score");
    data[0].splice(5, 0, "Participant ID");
    data[0].splice(6, 0, "Item 1");
    data[0].splice(7, 0, "Item 2");
    data[0].splice(8, 0, "Item 3");
    data[0].splice(9, 0, "Item 4");
    data[0].splice(10, 0, "Item 5");
    data[0].splice(11, 0, "Item 6");
    data[0].splice(12, 0, "Trinket");
    data[0].splice(13, 0, "Rank");
    return data;
}
function writeToExcel(data, headFunction, accountID) {
    data = headFunction(data);
    var xlsx = require('xlsx');
    //var wb = xlsx.utils.book_new();
    var wb = xlsx.readFile("data.xlsx");
    //var ws = xlsx.utils.aoa_to_sheet(jsonList, {cellDates:true});
    //console.log(data);
    //console.log("hello");
    var ws = xlsx.utils.aoa_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, accountID);
    xlsx.writeFile(wb, "data.xlsx");
    //throw("done");
}
var starter = function(apiKey, accountID, sqlSize) {
    key = apiKey
    https = require('https');
    request = require('request');
    xlsx  = require('xlsx');
    sql = require('mysql');
    host = "https://na1.api.riotgames.com";
    patchTimeStamp = 1501589532000;
    data = [];
    var sqlconnection = sql.createConnection({
        host: 'localhost',
        user: 'AFielding',
        password: 'Arek7000',
        database: 'leaguedb'
    });

    sqlconnection.connect(function(error) {
        if(error) throw error;
        console.log("Connected");
        
        repeater(accountID, sqlconnection, host, patchTimeStamp, apiKey, getGamesList, data, getData, header, request, writeToExcel, repeater, sqlSize);
    });
    
    //getRank(accountID, apiKey, request, function(rank) {
    //});
    //ranksBySummID(accountID, apiKey, request, function(stuff) {
    //    console.log(stuff);
    //});
}

function repeater(accountID, sql, host, patchTimeStamp, apiKey, getGamesList, data, getData, header, request, writeToExcel, repeatFunction, dbSize) {
    console.log("Hello");
    getRank(accountID, apiKey, request, function(rank) {
        console.log(rank);    
        grabGames(accountID, sql, rank, host, patchTimeStamp, apiKey, getGamesList, data, getData, header, request, writeToExcel, function(data){
            sql.query("SELECT count(*) FROM games_1", function(error, result) {
                var count = result[0]['count(*)'];
                if(count < dbSize) {
                    request(path, function(error, response, body) {
                        repeatFunction(idsToSearch[0], sql, host, patchTimeStamp, apiKey, getGamesList, data, getData, header, request, writeToExcel, repeatFunction, dbSize);          
                        idsToSearch.splice(0, 1);
                    });
                } 
                else {
                    throw("done");
                }
                /*else {
                    setTimeout(function() {
                        writeToExcel(data, header);
                        throw("done");
                    }, 1000);
                
                //console.log("Normal");
                }*/
                });
            
        });
    });
}

function getRank(accountID, apiKey, request, callback) {
    path = "https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-account/" + accountID + "?api_key=" + apiKey;
    request(path, function(error, response, body) {
        var json = JSON.parse(body);
        //console.log(json);
        if(json.id == undefined) {
            throw 'Bad Call trying to get Summoner ID'
        }
        path2 = "https://na1.api.riotgames.com/lol/league/v3/leagues/by-summoner/" + json.id + "?api_key=" + apiKey;
        //console.log(path2);
        request(path2, function(error, response, body2) {
            var entries = JSON.parse(body2);
            
            for(var i = 0; i < entries.length; i ++) {
                if(entries[i].queue == "RANKED_SOLO_5x5"){
                    callback(entries[i].tier);
                }
            }
            
        });
    });
}
function ranksBySummID(summonerID, apiKey, request, callback) {
    path = "https://na1.api.riotgames.com/lol/spectator/v3/active-games/by-summoner/" + summonerID + "?api_key=" + apiKey;
    request(path, function(error, response, body) {
        json = JSON.parse(body);
        var participants;
        try {
            participants = json.participants;
            //console.log(participants);
        }
        catch (TypeError) {
            callback("Summoner not in game");
            return;
        }
        if(participants == undefined) {
            //console.log(json);

            callback("Summoner not in game");
            return;
        }
        var index = 0, ranks = [];
        rankRequestRecursion(participants, index, apiKey, ranks, callback);
    });
}
function rankRequestRecursion(summonerIDs, index, apiKey, ranks, callback) {
    
    setTimeout(function() {
        rankRequest(summonerIDs[index].summonerId, summonerIDs[index].summonerName, apiKey, function(league) {
            
            ranks[index] = league;
            index += 1;
            if(index == summonerIDs.length - 1) {
                   
                callback(ranks);
            }
            else {
                rankRequestRecursion(summonerIDs, index, apiKey, ranks, callback);
            }
        });
        
    }, 500);
}
function rankRequest(summonerID, name, apiKey, callback) {
    path = "https://na1.api.riotgames.com/lol/league/v3/leagues/by-summoner/" + summonerID + "?api_key=" + apiKey;
    request(path, function(error, response, body) {
        
        entries = JSON.parse(body);
        //console.log(entries);
        for(var i = 0; i < entries.length; i ++) {
            if(entries[i].queue == "RANKED_SOLO_5x5"){
                for(var t = 0; t < entries[i].entries.length; t ++) {
                    //console.log(entries[i].entries[t].playerOrTeamId);
                    if(parseInt(entries[i].entries[t].playerOrTeamId) == summonerID) {
                        //console.log(entries[i].tier + " " + entries[i].entries[t].rank);
                        callback(name + ": " + entries[i].tier + " " + entries[i].entries[t].rank);
                    }
                }
            }
        }
    });
}
function getSummonerID(accountID, request, apiKey, callback) {
    path = "https://na1.api.riotgames.com/lol/league/v3/leagues/by-account/" + accountID + "?api_key=" + apiKey;
    request(path, function(error, response, body) {
        return JSON.parse(body).id;
    });
}
module.exports = {starter};



