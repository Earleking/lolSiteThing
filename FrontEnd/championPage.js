function genereateChampionBox(key) {
    var parent = document.getElementById("champBoxParent");

    var box = document.createElement("div");
    box.setAttribute('class', 'champBox');
    box.setAttribute('id', 'box' + key);
    var image = document.createElement("img");
    image.setAttribute('src', 'http://ddragon.leagueoflegends.com/cdn/8.7.1/img/champion/' + key + '.png');
    image.setAttribute('width', '60px');
    box.appendChild(image);
    parent.appendChild(box);
}

function genereateChampionBoxs() {
    loadJSON((resText) => {
        var x = JSON.parse(resText);
        console.log(x.data);
        var champs = x.data;
        for(var key in champs) {
            genereateChampionBox(key);
        }
    })
}

function loadJSON(callback) {   

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', 'StaticData/champs.json', true); 
        xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }

 genereateChampionBoxs();