import MapboxDraw from '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
var syncMaps = require('@mapbox/mapbox-gl-sync-move');
import TurfArea from '@turf/area';
import TurfCentroid from '@turf/centroid';
import TurfLength from '@turf/length';
import mapboxgl from 'mapbox-gl'
import './style.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import config from './config.json';

// access Token
mapboxgl.accessToken = 'pk.eyJ1IjoidHR2aWUiLCJhIjoiY2pzeWtpbnlmMTQ2bDQ0cHBmMG83cDc2cCJ9.PbFiXjCzENBncs0mErVLHQ';

// check if mapboxgl and fullscreen supported
if (mapboxgl.supported()) {
  console.log('MapGL: supported');
} else {
  console.log('MapGL: NOT supported!');
  alert('Your browser does not support Mapbox GL');
}

if (document.fullscreenEnabled) {
  console.log('Fullscreen: supported');
} else {
  console.log('Fullscreen: NOT supported!');
}

// default setting for layer and overlays
var layer_id_1 = config.map_1.layer;
var layer_id_2 = config.map_2.layer;
var layer_id_3 = config.map_3.layer;
var layer_id_4 = config.map_4.layer;

var overlay_id_1 = config.map_1.overlay;
var overlay_id_2 = config.map_2.overlay;
var overlay_id_3 = config.map_3.overlay;
var overlay_id_4 = config.map_4.overlay;

// opacity settings for overlays:
var slider_1 = document.getElementById('slider_1');
var slider_value_1 = document.getElementById('slider_value_1');
var deckkraft_1 = parseInt(slider_1.value, 10) / 100;
var slider_2 = document.getElementById('slider_2');
var slider_value_2 = document.getElementById('slider_value_2');
var deckkraft_2 = parseInt(slider_2.value, 10) / 100;
var slider_3 = document.getElementById('slider_3');
var slider_value_3 = document.getElementById('slider_value_3');
var deckkraft_3 = parseInt(slider_3.value, 10) / 100;
var slider_4 = document.getElementById('slider_4');
var slider_value_4 = document.getElementById('slider_value_4');
var deckkraft_4 = parseInt(slider_4.value, 10) / 100;

// add groups for select drodowns
var groups = [];
config.layer.forEach(function(item) {
  var category = item.category
  if (!groups.includes(category)) {
    groups.push(item.category);
  }
})

var selectsLayer = ["form_1", "form_2", "form_3", "form_4"];

var selectsOverlay = ["form_overlay_1", "form_overlay_2", "form_overlay_3", "form_overlay_4"];

selectsLayer.forEach(function(form) {
  groups.forEach(function(category) {
    var select = document.getElementById(form);
    var optg = document.createElement('optgroup');
    optg.id = form + "_" + category;
    optg.label = category;
    select.appendChild(optg);
  })
});

selectsOverlay.forEach(function(form) {
  groups.forEach(function(category) {
    var select = document.getElementById(form);
    var optg = document.createElement('optgroup');
    optg.id = form + "_" + category;
    optg.label = category;
    select.appendChild(optg);
  })
});

// default style
var default_style = {
  version: 8,
  name: "default_style",
  sources: {},
  //glyphs needed for measurement tools (map_1)
  glyphs: "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
  layers: []
};

// add sources and layer from config
config.layer.forEach(function(item) {
  if (item.onlyOverlay != true) {
    default_style.sources[item.name] = {};
    default_style.sources[item.name].type = "raster";
    default_style.sources[item.name].attribution = "<b>" + item.name + "</b> &copy; " + item.attribution;
    // ToDo: Check for XYZ Tilesources in general
    if (item.url == "https://tile.openstreetmap.org/{z}/{x}/{y}.png") {
      default_style.sources[item.name].tiles = [item.url];
    } else {
      if (!item.style) {
        item.style = "";
      }
      default_style.sources[item.name].tiles = [item.url + "?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&BBOX={bbox-epsg-3857}&WIDTH=256&HEIGHT=256&LAYERS=" + item.layer + "&STYLES=" + item.style + "&FORMAT=image/" + item.format];
    }
    default_style.sources[item.name].tileSize = 256;

    var lyr = {};
    lyr.id = item.name;
    lyr.type = "raster";
    lyr.source = item.name;
    lyr.layout = {
      visibility: "none"
    };
    default_style.layers.push(lyr);

    // populate layer select dropdowns
    selectsLayer.forEach(function(form) {
      var category = form + "_" + item.category
      var group = document.getElementById(category);
      var opt = document.createElement('option');
      opt.value = item.name;
      opt.innerHTML = item.name;
      if (((form == "form_1") && (item.name == [layer_id_1])) || ((form == "form_2") && (item.name == [layer_id_2])) || ((form == "form_3") && (item.name == [layer_id_3])) || ((form == "form_4") && (item.name == [layer_id_4]))) {
        opt.selected = true;
      }
      group.appendChild(opt);
    });
  }
});

// add overlays from config on top of layers
config.layer.forEach(function(item) {
  const overlay_id = "ol_" + item.name
  default_style.sources[overlay_id] = {};
  default_style.sources[overlay_id].type = "raster";
  default_style.sources[overlay_id].attribution = "<b>Overlay: </b>" + item.attribution;
  // todo: check for XYZ Tilesources in general
  if (item.url == "https://tile.openstreetmap.org/{z}/{x}/{y}.png") {
    default_style.sources[overlay_id].tiles = [item.url];
  } else {
    if (!item.style) {
      item.style = "";
    }
    default_style.sources[overlay_id].tiles = [item.url + "?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&BBOX={bbox-epsg-3857}&WIDTH=256&HEIGHT=256&LAYERS=" + item.layer + "&STYLES=" + item.style + "&FORMAT=image/" + item.format + "&TRANSPARENT=true"];
  }
  default_style.sources[overlay_id].tileSize = 256;

  var olyr = {};
  olyr.id = "ol_" + item.name;
  olyr.type = "raster";
  olyr.source = "ol_" + item.name;
  olyr.layout = {
    visibility: "none"
  };
  default_style.layers.push(olyr);

  // populate overlay select dropdowns
  selectsOverlay.forEach(function(form) {
    var category = form + "_" + item.category
    var group = document.getElementById(category);
    var opt = document.createElement('option');
    opt.value = "ol_" + item.name;
    opt.innerHTML = item.name;
    if (((form == "form_overlay_1") && (item.name == [overlay_id_1])) || ((form == "form_overlay_2") && (item.name == [overlay_id_2])) || ((form == "form_overlay_3") && (item.name == [overlay_id_3])) || ((form == "form_overlay_4") && (item.name == [overlay_id_4]))) {
      opt.selected = true;
    }
    group.appendChild(opt);
  });

})

var map_1 = new mapboxgl.Map({
  container: "map_1",
  style: default_style,
  zoom: config.zoom,
  center: config.center,
  pitchWithRotate: false,
  attributionControl: false
}).addControl(new mapboxgl.AttributionControl({
  compact: true
}));

var map_2 = new mapboxgl.Map({
  container: "map_2",
  style: default_style,
  zoom: config.zoom,
  center: config.center,
  pitchWithRotate: false,
  attributionControl: false
}).addControl(new mapboxgl.AttributionControl({
  compact: true
}));

var map_3 = new mapboxgl.Map({
  container: "map_3",
  style: default_style,
  zoom: config.zoom,
  center: config.center,
  pitchWithRotate: false,
  attributionControl: false
}).addControl(new mapboxgl.AttributionControl({
  compact: true
}));

var map_4 = new mapboxgl.Map({
  container: "map_4",
  style: default_style,
  zoom: config.zoom,
  center: config.center,
  pitchWithRotate: false,
  attributionControl: false
}).addControl(new mapboxgl.AttributionControl({
  compact: true
}));

var maps = [map_1, map_2, map_3, map_4];

map_1.on("load", function() {
  map_1.setLayoutProperty(layer_id_1, 'visibility', 'visible');
  // layer for measurement tools
  map_1.addLayer({
      "id": "labels",
      "type": "symbol",
      "source": {
        "type": "geojson",
        "data": {
          "type": "FeatureCollection",
          "features": [{
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": []
            },
            "properties": {
              "title": ""
            }
          }]
        }
      },
      "layout": {
        "text-field": "{title}",
        "text-offset": [0, 0.6],
        "text-size": 30,
      },
      "paint": {
        "text-color": "#ffb200",
        "text-halo-color": "#FFFFFF",
        "text-halo-width": 5,
        "text-halo-blur": 3
      }
    }),
    setOverlay1(overlay_id_1)
});
map_2.on("load", function() {
  map_2.setLayoutProperty(layer_id_2, 'visibility', 'visible');
  setOverlay2(overlay_id_2)
});
map_3.on("load", function() {
  map_3.setLayoutProperty(layer_id_3, 'visibility', 'visible');
  setOverlay3(overlay_id_3)
});
map_4.on("load", function() {
  map_4.setLayoutProperty(layer_id_4, 'visibility', 'visible');
  setOverlay4(overlay_id_4)
});

// sync map windows
syncMaps(map_1, map_3, map_2, map_4);

// add controls
map_1.addControl(new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl,
  types: "country,region,postcode,district,place,locality,neighborhood,address"
}), 'top-right');
map_1.addControl(new mapboxgl.NavigationControl({
  showZoom: false
}), 'top-right');
map_1.addControl(new mapboxgl.FullscreenControl({
  container: document.querySelector('body')
}), 'top-right');
map_1.addControl(new mapboxgl.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: true
  },
  trackUserLocation: true
}), 'top-right');
map_2.addControl(new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl,
  types: "country,region,postcode,district,place,locality,neighborhood,address"
}), 'top-right');
map_2.addControl(new mapboxgl.NavigationControl({
  showZoom: false
}), 'top-right');
map_2.addControl(new mapboxgl.FullscreenControl({
  container: document.querySelector('body')
}), 'top-right');
map_2.addControl(new mapboxgl.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: true
  },
  trackUserLocation: true
}), 'top-right');
map_3.addControl(new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl,
  types: "country,region,postcode,district,place,locality,neighborhood,address"
}), 'top-right');
map_3.addControl(new mapboxgl.NavigationControl({
  showZoom: false
}), 'top-right');
map_3.addControl(new mapboxgl.FullscreenControl({
  container: document.querySelector('body')
}), 'top-right');
map_3.addControl(new mapboxgl.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: true
  },
  trackUserLocation: true
}), 'top-right');

// visibility of map controls
document.getElementsByClassName("mapboxgl-ctrl-top-right")[0].style.display = "none"; // map_1
document.getElementsByClassName("mapboxgl-ctrl-top-right")[1].style.display = ""; // map_2
document.getElementsByClassName("mapboxgl-ctrl-top-right")[2].style.display = "none"; // map_3

// opacity slider
slider_1.addEventListener('input', function(e) {
  deckkraft_1 = parseInt(e.target.value, 10) / 100;
  if (!overlay_id_1 == "") {
    map_1.setPaintProperty(overlay_id_1, 'raster-opacity', deckkraft_1);
  }
  slider_value_1.textContent = e.target.value + '%';
});
slider_2.addEventListener('input', function(e) {
  deckkraft_2 = parseInt(e.target.value, 10) / 100;
  if (!overlay_id_2 == "") {
    map_2.setPaintProperty(overlay_id_2, 'raster-opacity', deckkraft_2);
  }
  slider_value_2.textContent = e.target.value + '%';
});
slider_3.addEventListener('input', function(e) {
  deckkraft_3 = parseInt(e.target.value, 10) / 100;
  if (!overlay_id_3 == "") {
    map_3.setPaintProperty(overlay_id_3, 'raster-opacity', deckkraft_3);
  }
  slider_value_3.textContent = e.target.value + '%';
});
slider_4.addEventListener('input', function(e) {
  deckkraft_4 = parseInt(e.target.value, 10) / 100;
  if (!overlay_id_4 == "") {
    map_4.setPaintProperty(overlay_id_4, 'raster-opacity', deckkraft_4);
  }
  slider_value_4.textContent = e.target.value + '%';
});

// make manu transparent while using opacity sliders
slider_1.addEventListener('pointerdown', function() {
  document.getElementById("myNav").style.background = "rgba(0,0,0, 0.2)";
});
slider_1.addEventListener('pointerup', function() {
  document.getElementById("myNav").style.background = "";
});
slider_2.addEventListener('pointerdown', function() {
  document.getElementById("myNav").style.background = "rgba(0,0,0, 0.2)";
});
slider_2.addEventListener('pointerup', function() {
  document.getElementById("myNav").style.background = "";
});
slider_3.addEventListener('pointerdown', function() {
  document.getElementById("myNav").style.background = "rgba(0,0,0, 0.2)";
});
slider_3.addEventListener('pointerup', function() {
  document.getElementById("myNav").style.background = "";
});
slider_4.addEventListener('pointerdown', function() {
  document.getElementById("myNav").style.background = "rgba(0,0,0, 0.2)";
});
slider_4.addEventListener('pointerup', function() {
  document.getElementById("myNav").style.background = "";
});

// switch layer for map_1
window.setLayer1 = function setLayer1() {
  var layer_id = document.getElementById("form_1").value;
  map_1.setLayoutProperty(layer_id_1, 'visibility', 'none');
  map_1.setLayoutProperty(layer_id, 'visibility', 'visible');
  layer_id_1 = layer_id;
}

// switch layer for map_2
window.setLayer2 = function setLayer2() {
  var layer_id = document.getElementById("form_2").value;
  map_2.setLayoutProperty(layer_id_2, 'visibility', 'none');
  map_2.setLayoutProperty(layer_id, 'visibility', 'visible');
  layer_id_2 = layer_id;
}

// switch layer for map_3
window.setLayer3 = function setLayer3() {
  var layer_id = document.getElementById("form_3").value;
  map_3.setLayoutProperty(layer_id_3, 'visibility', 'none');
  map_3.setLayoutProperty(layer_id, 'visibility', 'visible');
  layer_id_3 = layer_id;
}

// switch layer for map_4
window.setLayer4 = function setLayer4() {
  var layer_id = document.getElementById("form_4").value;
  map_4.setLayoutProperty(layer_id_4, 'visibility', 'none');
  map_4.setLayoutProperty(layer_id, 'visibility', 'visible');
  layer_id_4 = layer_id;
}

// switch overlay for map_1
window.setOverlay1 = function setOverlay1() {
  var layer_id = document.getElementById("form_overlay_1").value;
  if (layer_id == "none") {
    if (!overlay_id_1 == "") {
      map_1.setLayoutProperty(overlay_id_1, 'visibility', 'none');
    }
  } else {
    if (!overlay_id_1 == "") {
      map_1.setLayoutProperty(overlay_id_1, 'visibility', 'none');
    }
    overlay_id_1 = layer_id;
    map_1.setPaintProperty(overlay_id_1, 'raster-opacity', deckkraft_1);
    map_1.setLayoutProperty(overlay_id_1, 'visibility', 'visible');
  }
}

// switch overlay for map_2
window.setOverlay2 = function setOverlay2() {
  var layer_id = document.getElementById("form_overlay_2").value;
  if (layer_id == "none") {
    if (!overlay_id_2 == "") {
      map_2.setLayoutProperty(overlay_id_2, 'visibility', 'none');
    }
  } else {
    if (!overlay_id_2 == "") {
      map_2.setLayoutProperty(overlay_id_2, 'visibility', 'none');
    }
    overlay_id_2 = layer_id;
    map_2.setPaintProperty(overlay_id_2, 'raster-opacity', deckkraft_2);
    map_2.setLayoutProperty(overlay_id_2, 'visibility', 'visible');
  }
}

// switch overlay for map_3
window.setOverlay3 = function setOverlay3() {
  var layer_id = document.getElementById("form_overlay_3").value;
  if (layer_id == "none") {
    if (!overlay_id_3 == "") {
      map_3.setLayoutProperty(overlay_id_3, 'visibility', 'none');
    }
  } else {
    if (!overlay_id_3 == "") {
      map_3.setLayoutProperty(overlay_id_3, 'visibility', 'none');
    }
    overlay_id_3 = layer_id;
    map_3.setPaintProperty(overlay_id_3, 'raster-opacity', deckkraft_3);
    map_3.setLayoutProperty(overlay_id_3, 'visibility', 'visible');
  }
}

// switch overlay for map_4
window.setOverlay4 = function setOverlay4() {
  var layer_id = document.getElementById("form_overlay_4").value;
  if (layer_id == "none") {
    if (!overlay_id_4 == "") {
      map_4.setLayoutProperty(overlay_id_4, 'visibility', 'none');
    }
  } else {
    if (!overlay_id_4 == "") {
      map_4.setLayoutProperty(overlay_id_4, 'visibility', 'none');
    }
    overlay_id_4 = layer_id;
    map_4.setPaintProperty(overlay_id_4, 'raster-opacity', deckkraft_4);
    map_4.setLayoutProperty(overlay_id_4, 'visibility', 'visible');
  }
}

/*
	fullscreen menu
*/

// toggle menu
window.toggleNav = function toggleNav() {
  if (document.getElementById("myNav").style.height == "100%") {
    document.getElementById("myNav").style.height = "0%";
  } else {
    document.getElementById("myNav").style.height = "100%";
  }
}
window.swapBars = function swapBars(x) {
  x.classList.toggle("change");
}

// crosshair color
window.changeCrosshair = function changeCrosshair(img_source) {
  document.getElementById('ch_dd_img').src = img_source;
  document.getElementById('cross_1').src = img_source;
  document.getElementById('cross_2').src = img_source;
  document.getElementById('cross_3').src = img_source;
  document.getElementById('cross_4').src = img_source;
  document.getElementById('ch_dropdown_content').style.display = "none";
  setTimeout("document.getElementById('ch_dropdown_content').style.display='';", 100);
}

// choose number of map windows
window.setMapNumber = function setMapNumber(map_number) {
  switch (map_number) {
    // Ein Kartenfenster
    case 1:
      // Sichtbare Kartenfenster definieren:
      map_2.setLayoutProperty(layer_id_2, 'visibility', 'none');
      map_3.setLayoutProperty(layer_id_3, 'visibility', 'none');
      map_4.setLayoutProperty(layer_id_4, 'visibility', 'none');
      // Position und Größe der Kartenfenster anpassen
      document.getElementById("map_1").style.width = "100%";
      document.getElementById("map_1").style.height = "100%";
      document.getElementById("map_2").style.width = "0";
      document.getElementById("map_2").style.height = "0";
      document.getElementById("map_3").style.width = "0";
      document.getElementById("map_3").style.height = "0";
      document.getElementById("map_4").style.width = "0";
      document.getElementById("map_4").style.height = "0";
      // Fensterinhalt neu zeichnen um Darstellungsfehler zu vermeiden
      map_1.resize();
      map_2.resize();
      map_3.resize();
      map_4.resize();
      // Fadenkreuzpositionen und -sichtbarkeiten anpassen
      document.getElementById("cross_1").style.top = "50%";
      document.getElementById("cross_1").style.left = "50%";
      document.getElementById("cross_2").style.display = "none";
      document.getElementById("cross_3").style.display = "none";
      document.getElementById("cross_4").style.display = "none";
      // Darstellung der Buttons zur Auswahl der Kartenfenster anpassen
      document.getElementById("button_1map").style = "background:#444;border: 1px solid buttonface;border-radius: 5px;";
      document.getElementById("button_2map").style = "";
      document.getElementById("button_3map").style = "";
      document.getElementById("button_4map").style = "";
      // Sichtbarkeit der Controls einstellen
      document.getElementsByClassName("mapboxgl-ctrl-top-right")[0].style.display = ""; // Karte 1: Controls
      document.getElementsByClassName("mapboxgl-ctrl-top-right")[1].style.display = "none"; // Karte 2: Controls
      document.getElementsByClassName("mapboxgl-ctrl-top-right")[2].style.display = "none"; // Karte 3: Controls
      break;
      // Zwei Kartenfenster
    case 2:
      // Sichtbare Kartenfenster definieren:
      map_2.setLayoutProperty(layer_id_2, 'visibility', 'visible');
      map_3.setLayoutProperty(layer_id_3, 'visibility', 'none');
      map_4.setLayoutProperty(layer_id_4, 'visibility', 'none');
      // Position und Größe der Kartenfenster anpassen
      document.getElementById("map_1").style.width = "50%";
      document.getElementById("map_1").style.height = "100%";
      document.getElementById("map_2").style.width = "50%";
      document.getElementById("map_2").style.height = "100%";
      document.getElementById("map_2").style.left = "50%";
      document.getElementById("map_3").style.width = "0";
      document.getElementById("map_3").style.height = "0";
      document.getElementById("map_4").style.width = "0";
      document.getElementById("map_4").style.height = "0";
      // Fensterinhalt neu zeichnen um Darstellungsfehler zu vermeiden
      map_1.resize();
      map_2.resize();
      map_3.resize();
      map_4.resize();
      // Fadenkreuzpositionen und -sichtbarkeiten anpassen
      document.getElementById("cross_1").style.top = "50%";
      document.getElementById("cross_1").style.left = "25%";
      document.getElementById("cross_2").style.top = "50%";
      document.getElementById("cross_2").style.left = "75%";
      document.getElementById("cross_2").style.display = "";
      document.getElementById("cross_3").style.display = "none";
      document.getElementById("cross_4").style.display = "none";
      // Darstellung der Buttons zur Auswahl der Kartenfenster anpassen
      document.getElementById("button_1map").style = "";
      document.getElementById("button_2map").style = "background:#444;border: 1px solid buttonface;border-radius: 5px;";
      document.getElementById("button_3map").style = "";
      document.getElementById("button_4map").style = "";
      // Sichtbarkeit der Controls einstellen
      document.getElementsByClassName("mapboxgl-ctrl-top-right")[0].style.display = "none"; // Karte 1: Controls
      document.getElementsByClassName("mapboxgl-ctrl-top-right")[1].style.display = ""; // Karte 2: Controls
      document.getElementsByClassName("mapboxgl-ctrl-top-right")[2].style.display = "none"; // Karte 3: Controls
      break;
      // Drei Kartenfenster
    case 3:
      // Sichtbare Kartenfenster definieren:
      map_2.setLayoutProperty(layer_id_2, 'visibility', 'visible');
      map_3.setLayoutProperty(layer_id_3, 'visibility', 'visible');
      map_4.setLayoutProperty(layer_id_4, 'visibility', 'none');
      // Position und Größe der Kartenfenster anpassen
      document.getElementById("map_1").style.width = "33.333%";
      document.getElementById("map_1").style.height = "100%";
      document.getElementById("map_2").style.width = "33.333%";
      document.getElementById("map_2").style.height = "100%";
      document.getElementById("map_2").style.left = "33.333%";
      document.getElementById("map_3").style.width = "33.333%";
      document.getElementById("map_3").style.height = "100%";
      document.getElementById("map_3").style.top = "0";
      document.getElementById("map_3").style.left = "66.666%";
      document.getElementById("map_4").style.width = "0";
      document.getElementById("map_4").style.height = "0";
      // Fensterinhalt neu zeichnen um Darstellungsfehler zu vermeiden
      map_1.resize();
      map_2.resize();
      map_3.resize();
      map_4.resize();
      // Fadenkreuzpositionen und -sichtbarkeiten anpassen
      document.getElementById("cross_1").style.top = "50%";
      document.getElementById("cross_1").style.left = "16.666%";
      document.getElementById("cross_2").style.top = "50%";
      document.getElementById("cross_2").style.left = "50%";
      document.getElementById("cross_3").style.top = "50%";
      document.getElementById("cross_3").style.left = "83.333%";
      document.getElementById("cross_2").style.display = "";
      document.getElementById("cross_3").style.display = "";
      document.getElementById("cross_4").style.display = "none";
      // Darstellung der Buttons zur Auswahl der Kartenfenster anpassen
      document.getElementById("button_1map").style = "";
      document.getElementById("button_2map").style = "";
      document.getElementById("button_3map").style = "background:#444;border: 1px solid buttonface;border-radius: 5px;";
      document.getElementById("button_4map").style = "";
      // Sichtbarkeit der Controls einstellen
      document.getElementsByClassName("mapboxgl-ctrl-top-right")[0].style.display = "none"; // Karte 1: Controls
      document.getElementsByClassName("mapboxgl-ctrl-top-right")[1].style.display = "none"; // Karte 2: Controls
      document.getElementsByClassName("mapboxgl-ctrl-top-right")[2].style.display = ""; // Karte 3: Controls
      break;
      // Vier Kartenfenster
    case 4:
      // Sichtbare Kartenfenster definieren:
      map_2.setLayoutProperty(layer_id_2, 'visibility', 'visible');
      map_3.setLayoutProperty(layer_id_3, 'visibility', 'visible');
      map_4.setLayoutProperty(layer_id_4, 'visibility', 'visible');
      // Position und Größe der Kartenfenster anpassen
      document.getElementById("map_1").style.width = "50%";
      document.getElementById("map_1").style.height = "50%";
      document.getElementById("map_2").style.width = "50%";
      document.getElementById("map_2").style.height = "50%";
      document.getElementById("map_2").style.left = "50%";
      document.getElementById("map_3").style.width = "50%";
      document.getElementById("map_3").style.height = "50%";
      document.getElementById("map_3").style.top = "";
      document.getElementById("map_3").style.bottom = "0";
      document.getElementById("map_3").style.left = "0";
      document.getElementById("map_4").style.width = "50%";
      document.getElementById("map_4").style.height = "50%";
      // Fensterinhalt neu zeichnen um Darstellungsfehler zu vermeiden
      map_1.resize();
      map_2.resize();
      map_3.resize();
      map_4.resize();
      // Fadenkreuzpositionen und -sichtbarkeiten anpassen
      document.getElementById("cross_1").style.top = "25%";
      document.getElementById("cross_1").style.left = "25%";
      document.getElementById("cross_2").style.top = "25%";
      document.getElementById("cross_2").style.left = "75%";
      document.getElementById("cross_3").style.top = "75%";
      document.getElementById("cross_3").style.left = "25%";
      document.getElementById("cross_2").style.display = "";
      document.getElementById("cross_3").style.display = "";
      document.getElementById("cross_4").style.display = "";
      // Darstellung der Buttons zur Auswahl der Kartenfenster anpassen
      document.getElementById("button_1map").style = "";
      document.getElementById("button_2map").style = "";
      document.getElementById("button_3map").style = "";
      document.getElementById("button_4map").style = "background:#444;border: 1px solid buttonface;border-radius: 5px;";
      // Sichtbarkeit der Controls einstellen
      document.getElementsByClassName("mapboxgl-ctrl-top-right")[0].style.display = "none"; // Karte 1: Controls
      document.getElementsByClassName("mapboxgl-ctrl-top-right")[1].style.display = ""; // Karte 2: Controls
      document.getElementsByClassName("mapboxgl-ctrl-top-right")[2].style.display = "none"; // Karte 3: Controls
      break;
    default:
      // Fehler melden
      alert("ERROR: " + map_number);
  }
}

// Alle Labels zurücksetzen
window.resetLabels = function resetLabels() {
  var geojson = {
    "type": "FeatureCollection",
    "features": [{
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": []
      },
      "properties": {
        "title": ""
      }
    }]
  };
  map_1.getSource("labels").setData(geojson);
}

// Angabe des Flächeninhalts in der Messfunktion aktualisieren
window.updateArea = function updateArea(e) {
  var data = draw.getAll();
  resetLabels();
  if (data.features.length > 0) {
    var distance = TurfLength(data);
    var area = TurfArea(data);
    // restrict results to 2 decimal points
    var rounded_distance = Math.round(distance * 100000) / 100;
    var rounded_area = Math.round(area * 100) / 100;
    var centroid = TurfCentroid(data);
    if (area == 0) {
      var geojson = {
        "type": "FeatureCollection",
        "features": [{
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": centroid.geometry.coordinates
          },
          "properties": {
            "title": rounded_distance + " m"
          }
        }]
      };
      map_1.getSource("labels").setData(geojson);
    } else {
      var geojson = {
        "type": "FeatureCollection",
        "features": [{
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": centroid.geometry.coordinates
          },
          "properties": {
            "title": rounded_area + " m²"
          }
        }]
      };
      map_1.getSource("labels").setData(geojson);
    }
  } else {
    if (e.type !== 'draw.delete') alert("Use the draw tools to draw a polygon!");
  }
}

// Messfunktionen hinzufügen:
var draw = new MapboxDraw({
  displayControlsDefault: false,
  controls: {
    line_string: true,
    polygon: true,
    trash: true
  }
});
map_1.addControl(draw, "top-right");

map_1.on('draw.create', updateArea);
map_1.on('draw.delete', updateArea);
map_1.on('draw.update', updateArea);

map_1.on('draw.modechange', function() {
  const data = draw.getAll();
  if ((draw.getMode() == 'draw_polygon') || (draw.getMode() == 'draw_line_string')) {
    var pids = []
    const lid = data.features[data.features.length - 1].id
    data.features.forEach((f) => {
      if ((f.geometry.type === 'Polygon' && f.id !== lid) || (f.geometry.type === 'LineString' && f.id !== lid)) {
        pids.push(f.id)
      }
    })
    draw.delete(pids);
    resetLabels();
  }
});