//// 
var map = L.map('map').setView([3.351602, -76.536017], 14);           


	var mapabase = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
		{
      minZoom:13,
      maxZoom: 16,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		});
	
	var mapabase2 = L.tileLayer('http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.png', 
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


    


    var comunas = L.tileLayer.wms('http://ws-idesc.cali.gov.co:8081/geoserver/wfs?',
    {
    layers: 'idesc:mc_comunas',
    format: 'image/png',
    transparent: true,
    CQL_FILTER: "nombre='Comuna 22'",
    });
    comunas.addTo(map)

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
    leyenda.addOverlay(comuna22sitios_interes, 'Sitios de interes');
    leyenda.addOverlay(markers, 'Sitios de interés agrupados');
    
    
    
// Botón para cambiar los iconos
var button = L.easyButton('<img src="img/cambiaricono.png"  align="absmiddle" height="16px" >', function () {
  cambiarIconos(comuna22sitios_interes, 'img/casa.png');
}, 'Cambiar Iconos').addTo(map);

    // Crear el botón de reinicio
var resetButton = L.easyButton({
  position:  'bottomleft',
  states: [{
    stateName: 'reset-view',
    icon: 'fa fa-refresh',
    position:'bottomleft',
    title: 'Reiniciar vista',
    onClick: function(control) {
      // Restablecer la vista del mapa a la posición inicial
      map.setView([3.351602, -76.536017], 14);
    }
  }]
},'Ahhhhhhhhhh').addTo(map);
resetButton.addTo(map);


var graticule = L.latlngGraticule({
  showLabel: true,
  color: '#222',
  zoomInterval: [
    {start: 12, end: 13, interval: 0.05},
    {start: 14, end: 15, interval: 0.025},
    {start: 16, end: 17, interval: 0.01}
  ]}).addTo(map);
  // Crear un botón con Leaflet.EasyButton
var graticuleButton = L.easyButton('<img src="img/grilla.png"  align="absmiddle" height="16px" >', function(){
  if (map.hasLayer(graticule)) {
    map.removeLayer(graticule);
  } else {
    graticule.addTo(map);
  }
}, 'Toggle Graticule').addTo(map);


// create control and add to 



// Crear un icono personalizado de localizador
var IconLoca = L.icon({
  iconUrl: 'img/localiza.png',
  iconSize: [32, 32], // Tamaño del icono en píxeles
  iconAnchor: [16, 32] // Punto de anclaje del icono
});
// Crear una instancia de Leaflet-locatecontrol y agregarla al mapa
lc = L.control.locate({
    setView: 'untilPan',
    maxZoom: 16,
    drawCircle: true,
    circleStyle: {
        color: '#34e36e',
        fillColor: '#136AEC',
        fillOpacity: 0.3
    },
    markerStyle: {
        color: '#136AEC'
    },
    locateOptions: {
        maxZoom: 16,
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 10000
    },
    metric: true,
    strings: {
      title: "Mostrar mi ubicación",
      popup: 'Estás a {distance} {unit} de este punto',
    outsideMapBoundsMsg: 'No es posible determinar la ubicación.'
    },
    precision: 50 
  }).addTo(map);

  var geocoder = L.Control.geocoder({
    defaultMarkGeocode: false
  })
    .on('markgeocode', function(e) {
      var bbox = e.geocode.bbox;
      var poly = L.polygon([
        bbox.getSouthEast(),
        bbox.getNorthEast(),
        bbox.getNorthWest(),
        bbox.getSouthWest()
      ]).addTo(map);
      map.fitBounds(poly.getBounds());
    })    .addTo(map);

var minimap = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{attribution:'Universidad del Valle',subdomains: '2023'});

var win =  L.control.window(map,{title:'Bienvenido',content:'Este visor contiene información de sitios de interés en la Comuna 22 de Cali'+'<br>'+'<img src="img/logovalle.png" style="width:100%"; text-align: center;>', position: 'center'}).show();
////Ubicaciones posibles para la ventana emerente de 'center', 'top', 'topRight', 'right', 'bottomRight', 'bottom', 'bottomLeft', 'left', 'topLeft'
