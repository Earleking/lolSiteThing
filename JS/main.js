const sleuth = require("./sleuther");
const riotApiKey = "RGAPI-1c987d0a-b063-4585-91fb-a7cfe3143a36";
const request = require('request');
const fs = require('fs');
//sleuth.starter(riotApiKey, 51233797);
//id = 66543905
//Account ID

finalItemsCall();
//sleuth.starter(riotApiKey, /*Inital AccountID Here*/51233797, /*Number of records to retrive*/10000, endItems);
function finalItemsCall() {
    fs.readFile('test.json', 'utf8', function(err, data) {
        if(err) throw err;
        var json = JSON.parse(data)
        //console.log(json.data['3903']);
        
        sleuth.starter(riotApiKey, /*Inital AccountID Here*/51233797, /*Number of records to retrive*/10000, getFinalItemsNoCall(json));
    });
}

function getFinalItemsNoCall(allItems) {
    //var allItems = JSON.parse(body);
    allItems = allItems.data;
    var endItems = [];
    const ornnItems = [3371, 3373, 3374, 3379, 3380, 3382, 3383, 3384, 3385];
    for(item in allItems) {
        //console.log(item);
        item = allItems[item];
        for(oItem in ornnItems) {
            try {
                if(item.into[0] == oItem) {
                    endItems[endItems.length] = item.id;
                }
            } catch (TypeError) {
                
            }
            
            if(item.id == oItem) {
                continue;
            }
        }
        if(item.into == undefined) {
            if(item.gold == undefined) {
                //console.log(item);
                continue;
            }
            if(item.gold.total > 2000) {
                endItems[endItems.length] = item.id;
            }
        }
        

    }
    return endItems;
}
function getFinalItems()  {
    //path = 'https://na1.api.riotgames.com/lol/static-data/v3/items?locale=en_US&tags=gold&tags=into&api_key=' + riotApiKey;
    path = 'https://na1.api.riotgames.com/lol/static-data/v3/summoner-spells?locale=en_US&dataById=false&api_key=' + riotApiKey;
    request(path, function(error, response, body) {
        var allItems = JSON.parse(body);
        console.log(allItems.data.SummonerHaste);
        allItems = allItems.data;
        var endItems = [];
        const ornnItems = [3371, 3373, 3374, 3379, 3380, 3382, 3383, 3384, 3385,];
        for(item in allItems) {
            for(oItem in ornnItems) {
                if(item.into[0] == oItem) {
                    endItems[endItems.length] = item.id;
                }
                if(item.id == oItem) {
                    continue;
                }
            }
            if(item.into == undefined) {
                if(item.gold == undefined) {
                    //console.log(item);
                    continue;
                }
                if(item.gold.total > 800) {
                    endItems[endItems.length] = item.id;
                }
            }

        }
        console.log(endItems);
    });
}