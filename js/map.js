//// 
var map = L.map('map',
	{
		zoom: 10
	}).setView([3.351602, -76.536017], 14);           
	
	
	var mapabase = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
		{
			maxZoom: 15,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		});
	
	var mapabase2 = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', 
		{
			maxZoom: 18,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		})
	mapabase.addTo(map);
    var leyenda = L.control.layers({mapabase,mapabase2}).addTo(map);
    var comunas = L.tileLayer.wms('http://ws-idesc.cali.gov.co:8081/geoserver/wfs?',
    {
    layers: 'idesc:mc_comunas',
    format: 'image/png',
    transparent: true,
    });


    //// Agregar geojson con informacion extra
    var comuna22geojson = L.geoJSON();

    $.getJSON('geojson/comuna22.geojson', function(data) {
        comuna22geojson.addData(data);
        comuna22geojson.eachLayer(function(layer) {
            layer.bindPopup(layer.feature.properties.nombre);
          });
    });

    //// Agregar o superponer capas de comunas (WFS), Comuna 22 al mapa 

    leyenda.addOverlay(comunas, 'Comunas');
    leyenda.addOverlay(comuna22geojson, 'Comuna 22');

var minimap = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{attribution:'Universidad del Valle',subdomains: '2023'});

var win =  L.control.window(map,{title:'Bienvenido',content:'Comuna 22'+'<br>'+'<img src="img/logovalle.png" style="width:100%"; text-align: center;>', position: 'center'}).show();
////Ubicaciones posibles para la ventana emerente de 'center', 'top', 'topRight', 'right', 'bottomRight', 'bottom', 'bottomLeft', 'left', 'topLeft'
