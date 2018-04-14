/* Set the width of the side navigation to 250px */
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}
function attributeButtons() {
    for(var i = 1; i < 6; i ++) {
        document.getElementById("att" + i).addEventListener('click', function(event) {
            attributeButtonsListenerCall(event.target.id[4]);
            console.log(event.target.id[4]);
        });
    }
}

function attributeButtonsListenerCall(id) {
    document.getElementById("attDetailedData").innerHTML = "This is now gonna display data from attribute " + id;
    //makeRequest();
}
function addGameEntry() {
    var parent = document.getElementById("historyParent");
    
    //Name and Score display


    //Player List Start
    var box = document.createElement("div");
    box.setAttribute('class', 'playerBox');
    if(Math.random() * 2 > 1) {
        box.style.backgroundColor = 'rgba(51, 255, 51, .7)';
    }
    else {
        box.style.backgroundColor = 'rgba(255, 102, 102, .7)';
    }
    var team1List = document.createElement("ul");
    team1List.setAttribute('class', 'playerList');

    for(var x = 0; x < 5; x ++) {
        var toAppend= document.createElement('li');
        toAppend.appendChild(document.createTextNode("Player " + (x + 1)));
        team1List.appendChild(toAppend);
    }

    var team2List = document.createElement("ul");
    team2List.setAttribute('class', 'playerList');

    for(var x = 0; x < 5; x ++) {
        
        var toAppend= document.createElement('li');
        toAppend.appendChild(document.createTextNode("Player " + (x + 6)));
        team2List.appendChild(toAppend);
    }
    box.appendChild(team1List);
    box.appendChild(team2List);

    var stats = document.createElement('div');
    stats.appendChild(document.createTextNode("10 / 2 / 5"));
    stats.setAttribute('class', 'kdaBox');
    box.appendChild(stats);
    parent.appendChild(box);
    var spacing = document.createElement("div");
    spacing.setAttribute('class', 'playerBoxAfter');
    parent.appendChild(spacing);
    //Console.log("heelo");
    
    //Player List End


    //document.body.appendChild(document.createElement("button"));

}
function createRadarChart() {
    var margin = {top: 50, right: 0, bottom: 50, left: 0},
				width = Math.min(700, document.getElementById("radarBox").offsetWidth * .6),
                height = Math.min(width, document.getElementById("radarBox").offsetHeight * .6 );
    var data = [
					  [//Player 1
						{axis:"Kill Pressure",value:0.8},
						{axis:"Warding",value:0.1},
						{axis:"Survivability",value:0.25},
						{axis:"Objective Control",value:0.45},
						{axis:"Teamfighting",value:0.65}			
					  ],[//Player 2
						{axis:"Kill Pressure",value:0.21},
						{axis:"Warding",value:0.77},
						{axis:"Survivability",value:0.70},
						{axis:"Objective Control",value:0.42},
						{axis:"Teamfighting",value:0.50}	
					  ],[//Player 3
						{axis:"Kill Pressure",value:0.5},
						{axis:"Warding",value:0.5},
						{axis:"Survivability",value:0.5},
						{axis:"Objective Control",value:0.5},
						{axis:"Teamfighting",value:0.5}	
					  ]
					];
			////////////////////////////////////////////////////////////// 
			//////////////////// Draw the Chart ////////////////////////// 
			////////////////////////////////////////////////////////////// 

			var color = d3.scale.ordinal()
				.range(["#EDC951","#CC333F","#00A0B0"]);
				
			var radarChartOptions = {
			  w: width,
			  h: height,
			  margin: margin,
			  maxValue: 0.5,
			  levels: 5,
			  roundStrokes: true,
			  color: color
			};
			//Call function to draw the Radar chart
			RadarChart(".radarChart", data, radarChartOptions);
}

function print() {
    console.log("working as intended");
}

function makeRequest() {
    var xmlhttp = new XMLHttpRequest();
    console.log("sending request");

    xmlhttp.open('GET', "http://localhost:8081/request", true);
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState==4 && xmlhttp.status==200){
           console.log(xmlhttp.responseText);
         }
    }

    xmlhttp.send();
}
createRadarChart();
attributeButtons();
addGameEntry();
addGameEntry();
addGameEntry();
addGameEntry();
addGameEntry();
addGameEntry();
addGameEntry();
addGameEntry();

			