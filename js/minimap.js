//agregar mini mapa
var urlminimap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {attribution: 'Univalle',subdomains: '2023',maxZoom: 24});

var minimap = new L.Control.MiniMap(urlminimap,
	{
		toggleDisplay: true,
		minimized: true,
		position: "bottomright",
		zoom: 10
	}).addTo(map);
	
	//agrega escala
	