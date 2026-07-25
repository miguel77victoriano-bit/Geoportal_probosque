//crear contenedor de mapas

var map = L.map("map").setView([23.322,-102.334], 5);

//Enlazar mapas base
var osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

var satelite = L.tileLayer(
'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
{
attribution:'Tiles © Esri'
}
).addTo(map);

var topo = L.tileLayer(
'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
{
attribution:'© OpenTopoMap'
}
).addTo(map);

//Enlazar wms

//var Preventivos_Brechas_Lineas = L.tileLayer.wms("http://192.168.1.66:8080/geoserver/Basededatos_regionII/wms?", {
  //  Layers: "Preventivos (Brechas_Lineas)",
    //format : "image/png",
    //transparent : true } ).addTo(map); 

//var Preventivos_Quemas = L.tileLayer.wms("http://192.168.1.66:8080/geoserver/Basededatos_regionII/wms?", {
  //  Layers: "Preventivos (Quemas)",
    //format : "image/png",
    //transparent : true } ).addTo(map); 

    Prueba URL temporal
var Preventivos_Brechas_Lineas = L.tileLayer.wms("https://gathered-thousand-dated-constraint.trycloudflare.com/geoserver/Basededatos_regionII/wms?", {
  Layers: "Preventivos (Brechas_Lineas)",
    format : "image/png",
    transparent : true } ).addTo(map); 

var Preventivos_Quemas = L.tileLayer.wms("https://gathered-thousand-dated-constraint.trycloudflare.com/geoserver/Basededatos_regionII/wms?", {
    Layers: "Preventivos (Quemas)",
    format : "image/png",
    transparent : true } ).addTo(map);



    //Controlador de capas
var baseMaps = {
 "Satélite": satelite,
 "Calles": osm,
 "Topográfico": topo
};

L.control.layers(baseMaps).addTo(map);
//var wms1 = {"Preventivos_Brechas_Lineas": Preventivos_Brechas_Lineas};

//var wms2 = {"Preventivos_Quemas": Preventivos_Quemas};

var overlayMaps = {
    "Preventivos_Brechas_Lineas": Preventivos_Brechas_Lineas,
    "Preventivos_Quemas": Preventivos_Quemas
};

    L.control.layers(baseMaps, overlayMaps).addTo(map);


    //Dibujar y descargar

var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

var drawControl = new L.Control.Draw({

    edit: {
        featureGroup: drawnItems
    },

    draw: {

        polygon: true,

        polyline: true,

        rectangle: true,

        circle: false,

        marker: true,

        circlemarker: false

    }

});

map.addControl(drawControl);


map.on(L.Draw.Event.CREATED, function(e){

    var layer = e.layer;

    drawnItems.addLayer(layer);

    console.log(layer.toGeoJSON());

});

function descargarDibujos(){

    var datos = drawnItems.toGeoJSON();

    var archivo = new Blob(
        [JSON.stringify(datos)],
        {type: "application/json"}
    );

    var url = URL.createObjectURL(archivo);

    var enlace = document.createElement("a");

    enlace.href = url;
    enlace.download = "dibujos.geojson";

    document.body.appendChild(enlace);

    enlace.click();

    document.body.removeChild(enlace);

}



//Coordenadas

map.on('click', function(e){

    var lat = e.latlng.lat.toFixed(6);
    var lng = e.latlng.lng.toFixed(6);

    L.popup()
      .setLatLng(e.latlng)
      .setContent(
        "<b>Coordenadas</b><br>" +
        lat + ", " + lng +
        "<br><br>" +
        "<button onclick=\"navigator.clipboard.writeText('" + lat + "," + lng + "')\">Copiar</button>"
      )
      .openOn(map);

});


var info = L.control({position:'bottomleft'});

info.onAdd = function () {
    this._div = L.DomUtil.create('div','info');
    this._div.style.background = 'white';
    this._div.style.padding = '5px';
    this._div.innerHTML = 'Lat: --<br>Lon: --';
    return this._div;
};

info.addTo(map);

map.on('mousemove', function(e){
    info._div.innerHTML =
        "Lat: " + e.latlng.lat.toFixed(6) +
        "<br>Lon: " + e.latlng.lng.toFixed(6);
});









