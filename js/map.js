////  Crea mapa 
var map = L.map('map',
	{
		zoom: 10,
    minZoom:13,
    maxZoom: 16,

	}).setView([3.351602, -76.536017], 14);           
	//// Mapabase 1 
	var mapabase = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
		{
      minZoom:13,
      maxZoom: 16,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		});
	///Mapa base 2
	var mapabase2 = L.tileLayer('https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png', 
  /// https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png
		{
      minZoom:13,
      maxZoom: 16
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

    var ips = L.tileLayer.wms('http://ws-idesc.cali.gov.co:8081/geoserver/wfs?',
    {
    layers: 'salud:ads_ips_servicios',
    format: 'image/png',
    transparent: true,
    });
    ips.on('click', function(e) {
      var feature = e.features[0];
      var popupContent = "<strong>Nombre:</strong> " + feature.properties.nombre_ips;
      L.popup().setLatLng(e.latlng).setContent(popupContent).openOn(map);
    });



    var comunas = L.tileLayer.wms('http://ws-idesc.cali.gov.co:8081/geoserver/wfs?',
    {
    layers: 'idesc:mc_comunas',
    format: 'image/png',
    transparent: true,
    CQL_FILTER: "nombre='Comuna 22'",
    });


    //// Agregar geojson con informacion extra
    //// Comuna 22
    var comuna22geojson = L.geoJSON();
    $.getJSON('geojson/comuna22.geojson', function(data) {
        comuna22geojson.addData(data);
        comuna22geojson.eachLayer(function(layer) {
            layer.bindPopup(layer.feature.properties.nombre);
          });
              // Cambia el estilo del polígono para dejar solo el borde
        comuna22geojson.setStyle({
          fill: false,
          color: '#0000ff',
          weight: 2,
          opacity: 0.5
        });
    });

    comuna22geojson.addTo(map)


    //// Sitios de interes
    var comuna22sitios_interes = L.geoJSON();
      $.getJSON('geojson/sitios_interes.geojson', function(data) {
        comuna22sitios_interes.addData(data);
        comuna22sitios_interes.eachLayer(function(layer) {
            layer.bindPopup(layer.feature.properties.NOMBRE);
          });
    });
    // Estado del icono
    var iconChanged = true;
    //  cambiar los iconos
    function cambiarIconos(comuna22sitios_interes, iconUrl) {
      var iconUrl = iconChanged ? 'img/casa2.png' : 'img/casa.png';
      comuna22sitios_interes.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
          layer.setIcon(L.icon({
            iconUrl: iconUrl,
            iconSize: [30, 30],
            iconAnchor: [16, 32]
          }));
        }
      });
      iconChanged = !iconChanged;
      
    }
    
    /// Marker cluster o agrupacion de puntos 
    var markers = L.markerClusterGroup({spiderfyOnMaxZoom: true});
    // Carga el archivo GeoJSON
    var comuna22sitios = L.geoJSON();
    fetch('geojson/sitios_interes.geojson')
      .then(response => response.json())
      .then(data => {
        L.geoJSON(data, {
          onEachFeature: function(feature, layer) {
            layer.bindPopup("<strong> Nombre: </strong>" + layer.feature.properties.NOMBRE);
            // Crea un marcador para cada feature y lo agrega al cluster
            markers.addLayer(layer);
          }
        });
      });

      //mapa de calor
      fetch('geojson/sitios_interes.geojson')
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        comuna22sitios_interes.addData(data);

        var coordinates = [];
        data.features.forEach(function (feature) {
          coordinates.push(feature.geometry.coordinates.reverse());
        });
      
        var heatLayer = L.heatLayer(coordinates);
        //Botton de control
        var button = L.easyButton('<img src="img/heatmap.png"  align="absmiddle" height="16px" >', function () {
          if (map.hasLayer(heatLayer)) {
            map.removeLayer(heatLayer);
          } else {
            map.addLayer(heatLayer);
          }
        }, 'Mapa de calor').addTo(map);
      });



    //// Agregar o superponer capas de comunas (WFS), Comuna 22 al mapa y sitios de interes 

    leyenda.addOverlay(comunas, 'Comunas');
    leyenda.addOverlay(comuna22geojson, 'Comuna 22');
    leyenda.addOverlay(bienestar_social, 'Bienestar social');
    leyenda.addOverlay(ips, 'Servicios IPS');
    leyenda.addOverlay(comuna22sitios_interes, 'Sitios de interes');
    leyenda.addOverlay(markers, 'Sitios de interés agrupados');
    
    
    
// Botón para cambiar los iconos
var button = L.easyButton('<img src="img/cambiaricono.png"  align="absmiddle" height="16px" >', function () {
  cambiarIconos(comuna22sitios_interes, 'img/casa.png');
}, 'Cambiar Iconos').addTo(map);
// create control and add to map


// Crear un icono personalizado de localizador
var IconLoca = L.icon({
  iconUrl: 'img/localiza.png',
  iconSize: [32, 32], // Tamaño del icono en píxeles
  iconAnchor: [16, 32] // Punto de anclaje del icono
});
// Crear una instancia de Leaflet-locatecontrol y agregarla al mapa
lc = L.control
  .locate({
    strings: {
      title: "Mostrar mi ubicación"
    }
  })
  .addTo(map);
//// Agregar minimapa 
var minimap = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{attribution:'Universidad del Valle',subdomains: '2023'});

var win =  L.control.window(map,{title:'Bienvenido',content:'Este visor contiene información de sitios de interés en la Comuna 22 de Cali'+'<br>'+'<img src="img/logovalle.png" style="width:100%"; text-align: center;>', position: 'center'}).show();
////Ubicaciones posibles para la ventana emerente de 'center', 'top', 'topRight', 'right', 'bottomRight', 'bottom', 'bottomLeft', 'left', 'topLeft'
