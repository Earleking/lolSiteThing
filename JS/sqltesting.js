//sql Testing 

sql = require('mysql');

var sqlconnection = sql.createConnection({
    host: 'localhost',
    user: 'AFielding',
    password: 'Arek7000',
    database: 'leaguedb'
});
sqlconnection.connect(function(error) {
    if(error) throw error;
    console.log("Connected");
    insert();
});
function insert() {
    var qur = "INSERT INTO test_table (id, gameid) VALUES (?, ?)";
    var inserts = ['2', 'test2'];
    qur = sql.format(qur, inserts);
    
    try {
        console.log("hey");
        sqlconnection.query(qur, function(error, result) {
            if(error) throw error;
            console.log("Gotem");
        });
    } catch (Error) {
        console.log("problem");
    }
}
