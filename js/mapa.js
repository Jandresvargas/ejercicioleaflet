let map = L.map('map').setView([3.34991, -76.531092],14)
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Universidad del Valle'    
}).addTo(map)

var carto_light = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{attribution:'Universidad del Valle',subdomains: '2023'});


var win =  L.control.window(map,{title:'Bienvenido a GEOPREDIOS ',content:'Bienvenido a GEOPREDIOS'}).show();
