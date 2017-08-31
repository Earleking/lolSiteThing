//Updates item SQL table
const request = require('request');
const riotAPI = "RGAPI-1c987d0a-b063-4585-91fb-a7cfe3143a36"
const sql = require('mysql');
const fs = require('fs');

path = 'https://na1.api.riotgames.com/lol/static-data/v3/items?locale=en_US&tags=all&api_key=' + riotAPI;

var sqlconnection = sql.createConnection({
    host: 'localhost',
    user: 'AFielding',
    password: 'Arek7000',
    database: 'leaguedb'
});

sqlconnection.connect(function(err) {
    if(err) throw err;
    getItemsOffline(sqlconnection);
});

function getItems(sqlconnection) {
    request(path, function(error, response, body) {
        var allItems = JSON.parse(body);
        allItems = allItems.data;
        var item, items = [];
        for(var x = 0; x < allItems.length; x ++) {
            item = allItems[itemKey]
            items[itemKey] = [];
            items[itemKey][0] = item.id;
            items[itemKey][1] = item.stats;
            items[itemKey][2] = item.gold.total;
            items[itemKey][3] = item.gold.base;
            items[itemKey][4] = item.gold.sell;
            items[itemKey][5] = item.description;
            items[itemKey][6] = item.plaintext;
            if(item.maps['11'] == "true") items[itemKey][7] = 1;
            else items[itemKey][7] = 0;
            items[itemKey][8] = item.into;
            items[itemKey][9] = item.from;
            items[itemKey][10] = item.name;
        }
        var finalString = [];
        for(var rows = 0; rows < items.length; rows ++) {
            rowString = "";
            console.log(items[0]);
            for(var cols = 0; cols < items[rows].length; cols ++) {
                if(parseInt(items[rows][cols]) >= 0) {
                    rowString += items[rows][cols] + ", ";
                }
                else {
                    rowString += "'" + items[rows][cols] + "', ";
                }
            }   
            finalString[rows] = "(" + rowString.trim().substr(0, rowString.length - 2) + ")";
        }
        writeToSQL(finalString, 0, sqlconnection);
    });    
}

function getItemsOffline() {
    fs.readFile('test.json', 'utf8', function(error, body) {
        var allItems = JSON.parse(body);
        allItems = allItems.data;
        var item, items = [];
        var counter = 0;
        
        for(var itemKey in allItems) {
            item = allItems[itemKey]
            //console.log(item);
            items[counter] = [];
            items[counter][0] = item.id;
            items[counter][1] = JSON.stringify(item.stats);
            //console.log(item.stats);
            items[counter][2] = item.gold.total;
            items[counter][3] = item.gold.base;
            items[counter][4] = item.gold.sell;
            try {
                items[counter][5] = item.description.replace(/'/g, "''");
            }
            catch(TypeError) {
                items[counter][5] = "undefined";
            }
            try {
                items[counter][6] = item.plaintext.replace(/'/g, "''");
            }
            catch(TypeError) {
                items[counter][6] = "undefined";
            }
            if(item.maps['11'] == "true") items[counter][7] = 1;
            else items[counter][7] = 0;
            items[counter][8] = JSON.stringify(item.into);
            if(items[counter][8] == undefined) items[counter][8] = JSON.stringify('{}')
            items[counter][9] = JSON.stringify(item.from);
            if(items[counter][9] == undefined) items[counter][9] = JSON.stringify('{}')

            console.log(item.name + ":" + item.id);
            try {
                items[counter][10] = item.name.replace(/'/g, "''");
            }
            catch(TypeError) {
                items[counter][10] = "undefined";
            }
            counter += 1;
        }
        var finalString = [];
        for(var rows = 0; rows < items.length; rows ++) {
            rowString = "";
            //console.log(items[0]);
            for(var cols = 0; cols < items[rows].length; cols ++) {
                if(parseInt(items[rows][cols]) >= 0) {
                    rowString += items[rows][cols] + ", ";
                }
                else {
                    rowString += "'" + items[rows][cols] + "', ";
                }
            }   
            finalString[rows] = "(" + rowString.trim().substr(0, rowString.length - 2) + ")";
        }
        writeToSQL(finalString, 0, sqlconnection);
    });
}

function writeToSQL(querys, index, sqlconnection) {
    var query = "INSERT INTO items VALUES " + querys[index];
    console.log(query);
    sqlconnection.query(query, function(error, result) {
        if(error) {
            //throw error;
            console.log("Already exsists");
        }
        else {
            console.log("Item added");
        }
        index += 1;
        if(index < querys.length) {
            writeToSQL(querys, index, sqlconnection);
        }
    });
    

    
}