//agregar mini mapa
var carto_light = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png', {attribution: 'Univalle',subdomains: '2023',maxZoom: 24});

var minimap = L.Control.MiniMap(carto_light,
	{
		toggleDisplay: true,
		minimized: true,
		position: "bottomleft"
	}).addTo(map);
	
	//agrega escala
	