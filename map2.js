//// 
var map = L.map('map',
	{
		zoom: 10
	}).setView([3.351602, -76.536017], 14);           
	
	
	var mapabase = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
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
    //// Agregar capas wfs y wms 

    var bienestar_social = L.tileLayer.wms('http://ws-idesc.cali.gov.co:8081/geoserver/wms?service=WMS&version=1.1.0',
    {
    layers: 'pot_2014:eqp_uco_bienestar_social',
    format: 'image/png',
    transparent: true,
    });

    var comunas = L.tileLayer.wms('http://ws-idesc.cali.gov.co:8081/geoserver/wfs?',
    {
    layers: 'idesc:mc_comunas',
    format: 'image/png',
    transparent: true,
    });



    // Ícono personalizado para carnivoros
    const icono = L.divIcon({
        iconUrl: 'img/zoom.png',
        className: 'estiloIconos'
    });


    //// Agregar geojson con informacion extra
    //// Comuna 22
    var comuna22geojson = L.geoJSON();

    $.getJSON('geojson/comuna22.geojson', function(data) {
        comuna22geojson.addData(data);
        comuna22geojson.eachLayer(function(layer) {
            layer.bindPopup(layer.feature.properties.nombre);
          });
    });
    //// Sitios de interes
    var comuna22sitios_interes = L.geoJSON();

    $.getJSON('geojson/sitios_interes.geojson', function(data) {
        comuna22sitios_interes.addData(data);
        comuna22sitios_interes.eachLayer(function(layer) {
            layer.bindPopup(layer.feature.properties.NOMBRE);
          });
    });

    $.getJSON('geojson/sitios_interes.geojson', function(geodata) {
    // Capa de registros individuales
        var capa_carnivora = L.geoJSON(geodata, {
            style: function(feature ) {
                return {'color': "#013220", 'weight': 3}
            },
            onEachFeature: function(feature, layer) {
                var popupText = "<strong>Especie</strong>: " + feature.properties.NOMBRE + "<br>" + 
                                "<strong>Localidad</strong>: " + feature.properties.UBICACION + "<br>" + 
                                "<strong>Fecha</strong>: " + feature.properties.TIPO + "<br>" + 
                                "<strong>Institución</strong>: " + feature.properties.BARRIO + "<br>" + 
                                "<br>";
                layer.bindPopup(popupText);
            },
            pointToLayer: function(getJSONPoint, latlng) {
                return L.marker(latlng, {icon: icono});
            }
            });
    });
    
    var capa_carnivora_agrupados = L.markerClusterGroup({spiderfyOnMaxZoom: true});
    capa_carnivora_agrupados.addLayer(comuna22sitios_interes);
    //// Mapa de calor
    ///var heat = L.heatLayer(comuna22geojson,
    ///    {radius: 50}),
    ///    draw = true;


    //// Agregar o superponer capas de comunas (WFS), Comuna 22 al mapa y sitios de interes 

    leyenda.addOverlay(comunas, 'Comunas');
    leyenda.addOverlay(comuna22geojson, 'Comuna 22');
    leyenda.addOverlay(bienestar_social, 'Bienestar social');
    leyenda.addOverlay(comuna22sitios_interes, 'Sitios de interes');
    leyenda.addOverlay(capa_carnivora_agrupados, 'Cos');

var minimap = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{attribution:'Universidad del Valle',subdomains: '2023'});

var win =  L.control.window(map,{title:'Bienvenido',content:'Este visor contiene información de sitios de interés en la Comuna 22 de Cali'+'<br>'+'<img src="img/logovalle.png" style="width:100%"; text-align: center;>', position: 'center'}).show();
////Ubicaciones posibles para la ventana emerente de 'center', 'top', 'topRight', 'right', 'bottomRight', 'bottom', 'bottomLeft', 'left', 'topLeft'
