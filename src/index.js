import MapboxDraw from '@mapbox/mapbox-gl-draw';
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
import LZString from 'lz-string';

const blue = '#3bb2d0';
const orange = '#fbb03b';
const white = '#fff';

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

// settings for layer and overlays and position from URL params
var settings = {};
if ('URLSearchParams' in window) {
  var searchParams = new URLSearchParams(window.location.search);
  if (searchParams.get("settings")) {
    settings = JSON.parse(LZString.decompressFromEncodedURIComponent(searchParams.get("settings")));
  } else {
    settings = {
      "mc": config.maps || 4,
      "ch": config.crosshair || "black",
      "l1": config.map_1.layer,
      "o1": config.map_1.overlay || "",
      "op1": config.map_1.overlay_opacity || 0.5,
      "l2": config.map_2.layer,
      "o2": config.map_2.overlay || "",
      "op2": config.map_2.overlay_opacity || 0.5,
      "l3": config.map_3.layer,
      "o3": config.map_3.overlay || "",
      "op3": config.map_3.overlay_opacity || 0.5,
      "l4": config.map_4.layer,
      "o4": config.map_4.overlay || "",
      "op4": config.map_4.overlay_opacity || 0.5
    }
  }
  function parseQueryParam(param) {
    if (param === null || param === undefined) {
      return undefined;
    }

    let normalizedParam = param;
    if (param.includes(',')) {
      normalizedParam = param.replace(',', '.');
    }

    const parsed = parseFloat(normalizedParam);
    if (isNaN(parsed)) {
      return undefined;
    }

    return parsed;
  }

  const lonParam = parseQueryParam(searchParams.get("lon"));
  const latParam = parseQueryParam(searchParams.get("lat"));

  if (lonParam !== undefined && latParam !== undefined) {
    config.center = [lonParam, latParam];
  }
}

// status of compact attributions
var ca_layer_1 = true;
var ca_overlay_1 = true;
var ca_layer_2 = true;
var ca_overlay_2 = true;
var ca_layer_3 = true;
var ca_overlay_3 = true;
var ca_layer_4 = true;
var ca_overlay_4 = true;

var currentURL;

function updateURLSearchParams() {
  var settingString = LZString.compressToEncodedURIComponent(JSON.stringify(settings));
  if ('URLSearchParams' in window) {
    var searchParams = new URLSearchParams(window.location.search);
    searchParams.set("settings", settingString);
    var locationHash = window.location.hash
    searchParams.delete("lon")
    searchParams.delete("lat")
    window.history.pushState('', '', "?" + searchParams.toString() + locationHash);
    currentURL = window.location.href;
  }
}

// initial settings for opacity sliders:
var slider_1 = document.getElementById('slider_1');
var slider_value_1 = document.getElementById('slider_value_1');
slider_1.value = settings.op1 * 100;
slider_value_1.textContent = slider_1.value + '%';
var slider_2 = document.getElementById('slider_2');
var slider_value_2 = document.getElementById('slider_value_2');
slider_2.value = settings.op2 * 100;
slider_value_2.textContent = slider_2.value + '%';
var slider_3 = document.getElementById('slider_3');
var slider_value_3 = document.getElementById('slider_value_3');
slider_3.value = settings.op3 * 100;
slider_value_3.textContent = slider_3.value + '%';
var slider_4 = document.getElementById('slider_4');
var slider_value_4 = document.getElementById('slider_value_4');
slider_4.value = settings.op4 * 100;
slider_value_4.textContent = slider_4.value + '%';

// add groups for select drodowns
var groups = [];
config.layer.forEach(function (item) {
  var category = item.category
  if (!groups.includes(category)) {
    groups.push(item.category);
  }
})

var selectsLayer = ["form_1", "form_2", "form_3", "form_4"];
var selectsOverlay = ["form_overlay_1", "form_overlay_2", "form_overlay_3", "form_overlay_4"];

selectsLayer.forEach(function (form) {
  groups.forEach(function (category) {
    var select = document.getElementById(form);
    var optg = document.createElement('optgroup');
    optg.id = form + "_" + category;
    optg.label = category;
    select.appendChild(optg);
  })
});

selectsOverlay.forEach(function (form) {
  groups.forEach(function (category) {
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
config.layer.forEach(function (item) {
  if (item.onlyOverlay != true) {
    default_style.sources[item.name] = {};
    default_style.sources[item.name].type = "raster";
    if (item.attribution == "") {
      default_style.sources[item.name].attribution = "<b>" + item.name + "</b>";
    } else {
      default_style.sources[item.name].attribution = "<b>" + item.name + "</b> &copy; " + item.attribution;
    }
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
    if (item.compactAttribution == false) {
      lyr.compact_attribution = false
    }
    default_style.layers.push(lyr);

    // populate layer select dropdowns
    selectsLayer.forEach(function (form) {
      var category = form + "_" + item.category
      var group = document.getElementById(category);
      var opt = document.createElement('option');
      opt.value = item.name;
      opt.innerHTML = item.name;
      if (((form == "form_1") && (item.name == [settings.l1])) || ((form == "form_2") && (item.name == [settings.l2])) || ((form == "form_3") && (item.name == [settings.l3])) || ((form == "form_4") && (item.name == [settings.l4]))) {
        opt.selected = true;
      }
      group.appendChild(opt);
    });
  }
});

// add overlays from config on top of layers
config.layer.forEach(function (item) {
  const overlay_id = "ol_" + item.name
  default_style.sources[overlay_id] = {};
  default_style.sources[overlay_id].type = "raster";
  if (item.attribution == "") {
    default_style.sources[overlay_id].attribution = "<b>Overlay: " + item.name + "</b>";
  } else {
    default_style.sources[overlay_id].attribution = "<b>Overlay: " + item.name + "</b> &copy; " + item.attribution;
  }
  // todo: check for XYZ Tilesources in general
  if (item.url == "https://tile.openstreetmap.org/{z}/{x}/{y}.png") {
    default_style.sources[overlay_id].tiles = [item.url];
  } else {
    if (!item.style) {
      item.style = "";
    }
    default_style.sources[overlay_id].tiles = [item.url + "?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&BBOX={bbox-epsg-3857}&WIDTH=256&HEIGHT=256&LAYERS=" + item.layer + "&STYLES=" + item.style + "&FORMAT=image/" + item.format + "&TRANSPARENT=true&TILED=TRUE"];
  }
  default_style.sources[overlay_id].tileSize = 256;

  var olyr = {};
  olyr.id = "ol_" + item.name;
  olyr.type = "raster";
  olyr.source = "ol_" + item.name;
  olyr.layout = {
    visibility: "none"
  };
  if (item.compactAttribution == false) {
    olyr.compact_attribution = false
  }
  default_style.layers.push(olyr);

  // populate overlay select dropdowns
  selectsOverlay.forEach(function (form) {
    var category = form + "_" + item.category
    var group = document.getElementById(category);
    var opt = document.createElement('option');
    opt.value = "ol_" + item.name;
    opt.innerHTML = item.name;
    if (((form == "form_overlay_1") && ((item.name == settings.o1) || (opt.value == settings.o1))) || ((form == "form_overlay_2") && ((item.name == settings.o2) || (opt.value == settings.o2))) || ((form == "form_overlay_3") && ((item.name == settings.o3) || (opt.value == settings.o3))) || ((form == "form_overlay_4") && ((item.name == settings.o4) || (opt.value == settings.o4)))) {
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
  attributionControl: false,
  hash: true
});
const attribution_map_1 = new mapboxgl.AttributionControl({
  compact: true
});

var map_2 = new mapboxgl.Map({
  container: "map_2",
  style: default_style,
  zoom: config.zoom,
  center: config.center,
  pitchWithRotate: false,
  attributionControl: false,
  hash: true
});
const attribution_map_2 = new mapboxgl.AttributionControl({
  compact: true
});



var map_3 = new mapboxgl.Map({
  container: "map_3",
  style: default_style,
  zoom: config.zoom,
  center: config.center,
  pitchWithRotate: false,
  attributionControl: false,
  hash: true
});
const attribution_map_3 = new mapboxgl.AttributionControl({
  compact: true
});

var map_4 = new mapboxgl.Map({
  container: "map_4",
  style: default_style,
  zoom: config.zoom,
  center: config.center,
  pitchWithRotate: false,
  attributionControl: false,
  hash: true
});
const attribution_map_4 = new mapboxgl.AttributionControl({
  compact: true
});

var maps = [map_1, map_2, map_3, map_4];
var allMapsLoaded = [false, false, false, false];

map_1.on("load", function () {
  allMapsLoaded[0] = true;
  map_1.setLayoutProperty(settings.l1, 'visibility', 'visible');
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
  })

  const layer = default_style.layers.find(el => el.id === settings.l1);
  map_1.addControl(attribution_map_1)
  if (layer.compact_attribution == false) {
    ca_layer_1 = false
    document.getElementById('map_1').getElementsByClassName('mapboxgl-ctrl-attrib-button')[0].click();
  }

  setOverlay1();
});
map_2.on("load", function () {
  allMapsLoaded[1] = true;
  map_2.setLayoutProperty(settings.l2, 'visibility', 'visible');

  const layer = default_style.layers.find(el => el.id === settings.l2);
  map_2.addControl(attribution_map_2)
  if (layer.compact_attribution == false) {
    ca_layer_2 = false
    document.getElementById('map_2').getElementsByClassName('mapboxgl-ctrl-attrib-button')[0].click();
  }

  setOverlay2();
});
map_3.on("load", function () {
  allMapsLoaded[2] = true;
  map_3.setLayoutProperty(settings.l3, 'visibility', 'visible');

  const layer = default_style.layers.find(el => el.id === settings.l3);
  map_3.addControl(attribution_map_3)
  if (layer.compact_attribution == false) {
    ca_layer_3 = false
    document.getElementById('map_3').getElementsByClassName('mapboxgl-ctrl-attrib-button')[0].click();
  }

  setOverlay3();
});
map_4.on("load", function () {
  allMapsLoaded[3] = true;
  map_4.setLayoutProperty(settings.l4, 'visibility', 'visible');

  const layer = default_style.layers.find(el => el.id === settings.l4);
  map_4.addControl(attribution_map_4)
  if (layer.compact_attribution == false) {
    ca_layer_4 = false
    document.getElementById('map_4').getElementsByClassName('mapboxgl-ctrl-attrib-button')[0].click();
  }

  setOverlay4();
});

// sync map windows
syncMaps(map_1, map_3, map_2, map_4);

// add controls
map_1.addControl(new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl,
  types: "country,region,postcode,district,place,locality,neighborhood,address"
}), 'top-left');
map_1.addControl(new mapboxgl.NavigationControl({
  showZoom: true
}), 'top-left');
map_1.addControl(new mapboxgl.FullscreenControl({
  container: document.querySelector('body')
}), 'top-left');
map_1.addControl(new mapboxgl.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: true
  },
  trackUserLocation: true,
  showUserHeading: true
}), 'top-left');
map_2.addControl(new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl,
  types: "country,region,postcode,district,place,locality,neighborhood,address"
}), 'top-left');
map_2.addControl(new mapboxgl.NavigationControl({
  showZoom: false
}), 'top-left');
map_2.addControl(new mapboxgl.FullscreenControl({
  container: document.querySelector('body')
}), 'top-left');
map_2.addControl(new mapboxgl.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: true
  },
  trackUserLocation: true,
  showUserHeading: true
}), 'top-left');
map_3.addControl(new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl,
  types: "country,region,postcode,district,place,locality,neighborhood,address"
}), 'top-left');
map_3.addControl(new mapboxgl.NavigationControl({
  showZoom: false
}), 'top-left');
map_3.addControl(new mapboxgl.FullscreenControl({
  container: document.querySelector('body')
}), 'top-left');
map_3.addControl(new mapboxgl.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: true
  },
  trackUserLocation: true,
  showUserHeading: true
}), 'top-left');

// visibility of map controls
document.getElementsByClassName("mapboxgl-ctrl-top-left")[0].style.display = ""; // map_1
document.getElementsByClassName("mapboxgl-ctrl-top-left")[1].style.display = "none"; // map_2
document.getElementsByClassName("mapboxgl-ctrl-top-left")[2].style.display = "none"; // map_3

// opacity slider
slider_1.addEventListener('input', function (e) {
  settings.op1 = parseInt(e.target.value, 10) / 100;
  if (!settings.o1 == "") {
    map_1.setPaintProperty(settings.o1, 'raster-opacity', settings.op1);
  }
  slider_value_1.textContent = e.target.value + '%';
  updateURLSearchParams();
});
slider_2.addEventListener('input', function (e) {
  settings.op2 = parseInt(e.target.value, 10) / 100;
  if (!settings.o2 == "") {
    map_2.setPaintProperty(settings.o2, 'raster-opacity', settings.op2);
  }
  slider_value_2.textContent = e.target.value + '%';
  updateURLSearchParams();
});
slider_3.addEventListener('input', function (e) {
  settings.op3 = parseInt(e.target.value, 10) / 100;
  if (!settings.o3 == "") {
    map_3.setPaintProperty(settings.o3, 'raster-opacity', settings.op3);
  }
  slider_value_3.textContent = e.target.value + '%';
  updateURLSearchParams();
});
slider_4.addEventListener('input', function (e) {
  settings.op4 = parseInt(e.target.value, 10) / 100;
  if (!settings.o4 == "") {
    map_4.setPaintProperty(settings.o4, 'raster-opacity', settings.op4);
  }
  slider_value_4.textContent = e.target.value + '%';
  updateURLSearchParams();
});

// make manu transparent while using opacity sliders
slider_1.addEventListener('pointerdown', function () {
  document.getElementById("myNav").style.background = "rgba(0,0,0, 0.2)";
});
slider_1.addEventListener('pointerup', function () {
  document.getElementById("myNav").style.background = "";
});
slider_2.addEventListener('pointerdown', function () {
  document.getElementById("myNav").style.background = "rgba(0,0,0, 0.2)";
});
slider_2.addEventListener('pointerup', function () {
  document.getElementById("myNav").style.background = "";
});
slider_3.addEventListener('pointerdown', function () {
  document.getElementById("myNav").style.background = "rgba(0,0,0, 0.2)";
});
slider_3.addEventListener('pointerup', function () {
  document.getElementById("myNav").style.background = "";
});
slider_4.addEventListener('pointerdown', function () {
  document.getElementById("myNav").style.background = "rgba(0,0,0, 0.2)";
});
slider_4.addEventListener('pointerup', function () {
  document.getElementById("myNav").style.background = "";
});

// switch layer for map_1
window.setLayer1 = function setLayer1() {
  var layer_id = document.getElementById("form_1").value;
  map_1.setLayoutProperty(settings.l1, 'visibility', 'none');
  map_1.setLayoutProperty(layer_id, 'visibility', 'visible');
  settings.l1 = layer_id;
  updateURLSearchParams();

  map_1.removeControl(attribution_map_1);
  map_1.addControl(attribution_map_1)
  const layer = default_style.layers.find(el => el.id === layer_id);
  if (layer.compact_attribution == false) {
    ca_layer_1 = false
  } else {
    ca_layer_1 = true
  }
  if (ca_layer_1 == false || ca_overlay_1 == false) {
    document.getElementById('map_1').getElementsByClassName('mapboxgl-ctrl-attrib-button')[0].click();
  }
}

// switch layer for map_2
window.setLayer2 = function setLayer2() {
  var layer_id = document.getElementById("form_2").value;
  map_2.setLayoutProperty(settings.l2, 'visibility', 'none');
  map_2.setLayoutProperty(layer_id, 'visibility', 'visible');
  settings.l2 = layer_id;
  updateURLSearchParams();

  map_2.removeControl(attribution_map_2);
  map_2.addControl(attribution_map_2)
  const layer = default_style.layers.find(el => el.id === layer_id);
  if (layer.compact_attribution == false) {
    ca_layer_2 = false
  } else {
    ca_layer_2 = true
  }
  if (ca_layer_2 == false || ca_overlay_2 == false) {
    document.getElementById('map_2').getElementsByClassName('mapboxgl-ctrl-attrib-button')[0].click();
  }
}

// switch layer for map_3
window.setLayer3 = function setLayer3() {
  var layer_id = document.getElementById("form_3").value;
  map_3.setLayoutProperty(settings.l3, 'visibility', 'none');
  map_3.setLayoutProperty(layer_id, 'visibility', 'visible');
  settings.l3 = layer_id;
  updateURLSearchParams();

  map_3.removeControl(attribution_map_3);
  map_3.addControl(attribution_map_3)
  const layer = default_style.layers.find(el => el.id === layer_id);
  if (layer.compact_attribution == false) {
    ca_layer_3 = false
  } else {
    ca_layer_3 = true
  }
  if (ca_layer_3 == false || ca_overlay_3 == false) {
    document.getElementById('map_3').getElementsByClassName('mapboxgl-ctrl-attrib-button')[0].click();
  }
}

// switch layer for map_4
window.setLayer4 = function setLayer4() {
  var layer_id = document.getElementById("form_4").value;
  map_4.setLayoutProperty(settings.l4, 'visibility', 'none');
  map_4.setLayoutProperty(layer_id, 'visibility', 'visible');
  settings.l4 = layer_id;
  updateURLSearchParams();

  map_4.removeControl(attribution_map_4);
  map_4.addControl(attribution_map_4)
  const layer = default_style.layers.find(el => el.id === layer_id);
  if (layer.compact_attribution == false) {
    ca_layer_4 = false
  } else {
    ca_layer_4 = true
  }
  if (ca_layer_4 == false || ca_overlay_4 == false) {
    document.getElementById('map_4').getElementsByClassName('mapboxgl-ctrl-attrib-button')[0].click();
  }
}

// switch overlay for map_1
window.setOverlay1 = function setOverlay1() {
  var layer_id = document.getElementById("form_overlay_1").value;
  if (layer_id == "") {
    ca_overlay_1 = true
    if (!settings.o1 == "") {
      map_1.setLayoutProperty(settings.o1, 'visibility', 'none');
    }
    settings.o1 = layer_id;
    updateURLSearchParams();
  } else {
    if (!settings.o1 == "") {
      map_1.setLayoutProperty(settings.o1, 'visibility', 'none');
    }
    settings.o1 = layer_id;
    updateURLSearchParams();
    map_1.setPaintProperty(settings.o1, 'raster-opacity', settings.op1);
    map_1.setLayoutProperty(settings.o1, 'visibility', 'visible');

    const layer = default_style.layers.find(el => el.id === layer_id);
    if (layer.compact_attribution == false) {
      ca_overlay_1 = false
    } else {
      ca_overlay_1 = true
    }
  }
  map_1.removeControl(attribution_map_1);
  map_1.addControl(attribution_map_1)
  if (ca_layer_1 == false || ca_overlay_1 == false) {
    document.getElementById('map_1').getElementsByClassName('mapboxgl-ctrl-attrib-button')[0].click();
  }
}

// switch overlay for map_2
window.setOverlay2 = function setOverlay2() {
  var layer_id = document.getElementById("form_overlay_2").value;
  if (layer_id == "") {
    ca_overlay_2 = true
    if (!settings.o2 == "") {
      map_2.setLayoutProperty(settings.o2, 'visibility', 'none');
    }
    settings.o2 = layer_id;
    updateURLSearchParams();
  } else {
    if (!settings.o2 == "") {
      map_2.setLayoutProperty(settings.o2, 'visibility', 'none');
    }
    settings.o2 = layer_id;
    updateURLSearchParams();
    map_2.setPaintProperty(settings.o2, 'raster-opacity', settings.op2);
    map_2.setLayoutProperty(settings.o2, 'visibility', 'visible');

    const layer = default_style.layers.find(el => el.id === layer_id);
    if (layer.compact_attribution == false) {
      ca_overlay_2 = false
    } else {
      ca_overlay_2 = true
    }
  }
  map_2.removeControl(attribution_map_2);
  map_2.addControl(attribution_map_2)
  if (ca_layer_2 == false || ca_overlay_2 == false) {
    document.getElementById('map_2').getElementsByClassName('mapboxgl-ctrl-attrib-button')[0].click();
  }
}

// switch overlay for map_3
window.setOverlay3 = function setOverlay3() {
  var layer_id = document.getElementById("form_overlay_3").value;
  if (layer_id == "") {
    ca_overlay_3 = true
    if (!settings.o3 == "") {
      map_3.setLayoutProperty(settings.o3, 'visibility', 'none');
    }
    settings.o3 = layer_id;
    updateURLSearchParams();
  } else {
    if (!settings.o3 == "") {
      map_3.setLayoutProperty(settings.o3, 'visibility', 'none');
    }
    settings.o3 = layer_id;
    updateURLSearchParams();
    map_3.setPaintProperty(settings.o3, 'raster-opacity', settings.op3);
    map_3.setLayoutProperty(settings.o3, 'visibility', 'visible');

    const layer = default_style.layers.find(el => el.id === layer_id);
    if (layer.compact_attribution == false) {
      ca_overlay_3 = false
    } else {
      ca_overlay_3 = true
    }
  }
  map_3.removeControl(attribution_map_3);
  map_3.addControl(attribution_map_3)
  if (ca_layer_3 == false || ca_overlay_3 == false) {
    document.getElementById('map_3').getElementsByClassName('mapboxgl-ctrl-attrib-button')[0].click();
  }
}

// switch overlay for map_4
window.setOverlay4 = function setOverlay4() {
  var layer_id = document.getElementById("form_overlay_4").value;
  if (layer_id == "") {
    ca_overlay_4 = true
    if (!settings.o4 == "") {
      map_4.setLayoutProperty(settings.o4, 'visibility', 'none');
    }
    settings.o4 = layer_id;
    updateURLSearchParams();
  } else {
    if (!settings.o4 == "") {
      map_4.setLayoutProperty(settings.o4, 'visibility', 'none');
    }
    settings.o4 = layer_id;
    updateURLSearchParams();
    map_4.setPaintProperty(settings.o4, 'raster-opacity', settings.op4);
    map_4.setLayoutProperty(settings.o4, 'visibility', 'visible');

    const layer = default_style.layers.find(el => el.id === layer_id);
    if (layer.compact_attribution == false) {
      ca_overlay_4 = false
    } else {
      ca_overlay_4 = true
    }
  }
  map_4.removeControl(attribution_map_4);
  map_4.addControl(attribution_map_4)
  if (ca_layer_4 == false || ca_overlay_4 == false) {
    document.getElementById('map_4').getElementsByClassName('mapboxgl-ctrl-attrib-button')[0].click();
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

window.copyPermalink = function copyPermalink() {
  updateURLSearchParams();
  var message = document.createElement("div");
  message.setAttribute("class", "overlayPermalink");
  message.innerHTML = "Permalink wurde in die Zwischenablage kopiert";
  setTimeout(function () {
    message.parentNode.removeChild(message);
  }, 800);
  document.body.appendChild(message);
  return navigator.clipboard.writeText(currentURL);
}

// crosshair color
window.changeCrosshair = function changeCrosshair(colour) {
  settings.ch = colour
  updateURLSearchParams();
  var image_source = "./img/cross_" + settings.ch + ".png";
  document.getElementById('ch_dd_img').src = image_source;
  document.getElementById('cross_1').src = image_source;
  document.getElementById('cross_2').src = image_source;
  document.getElementById('cross_3').src = image_source;
  document.getElementById('cross_4').src = image_source;
  document.getElementById('ch_dropdown_content').style.display = "none";
  setTimeout("document.getElementById('ch_dropdown_content').style.display='';", 100);
}

// set initial crosshair colour
changeCrosshair(settings.ch);

// choose number of map windows
window.setMapNumber = function setMapNumber(map_number) {
  switch (map_number) {
    // Ein Kartenfenster
    case 1:
      // Sichtbare Kartenfenster definieren:
      map_2.setLayoutProperty(settings.l2, 'visibility', 'none');
      map_3.setLayoutProperty(settings.l3, 'visibility', 'none');
      map_4.setLayoutProperty(settings.l4, 'visibility', 'none');
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
      document.getElementsByClassName("mapboxgl-ctrl-top-left")[0].style.display = ""; // Karte 1: Controls
      document.getElementsByClassName("mapboxgl-ctrl-top-left")[1].style.display = "none"; // Karte 2: Controls
      document.getElementsByClassName("mapboxgl-ctrl-top-left")[2].style.display = "none"; // Karte 3: Controls

      document.getElementsByClassName("mapbox-gl-draw_line")[0].style.display = ""; // Draw control line
      document.getElementsByClassName("mapbox-gl-draw_polygon")[0].style.display = ""; // Draw control polygon
      document.getElementsByClassName("mapbox-gl-draw_trash")[0].style.display = ""; // Draw control trash

      settings.mc = 1
      updateURLSearchParams();

      break;
    // Zwei Kartenfenster
    case 2:
      // Sichtbare Kartenfenster definieren:
      map_2.setLayoutProperty(settings.l2, 'visibility', 'visible');
      map_3.setLayoutProperty(settings.l3, 'visibility', 'none');
      map_4.setLayoutProperty(settings.l4, 'visibility', 'none');
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
      document.getElementsByClassName("mapboxgl-ctrl-top-left")[0].style.display = ""; // Karte 1: Controls
      document.getElementsByClassName("mapboxgl-ctrl-top-left")[1].style.display = "none"; // Karte 2: Controls
      document.getElementsByClassName("mapboxgl-ctrl-top-left")[2].style.display = "none"; // Karte 3: Controls

      document.getElementsByClassName("mapbox-gl-draw_line")[0].style.display = "none"; // Draw control line
      document.getElementsByClassName("mapbox-gl-draw_polygon")[0].style.display = "none"; // Draw control polygon
      document.getElementsByClassName("mapbox-gl-draw_trash")[0].style.display = "none"; // Draw control trash

      settings.mc = 2
      updateURLSearchParams();

      break;
    // Drei Kartenfenster
    case 3:
      // Sichtbare Kartenfenster definieren:
      map_2.setLayoutProperty(settings.l2, 'visibility', 'visible');
      map_3.setLayoutProperty(settings.l3, 'visibility', 'visible');
      map_4.setLayoutProperty(settings.l4, 'visibility', 'none');
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
      document.getElementsByClassName("mapboxgl-ctrl-top-left")[0].style.display = ""; // Karte 1: Controls
      document.getElementsByClassName("mapboxgl-ctrl-top-left")[1].style.display = "none"; // Karte 2: Controls
      document.getElementsByClassName("mapboxgl-ctrl-top-left")[2].style.display = "none"; // Karte 3: Controls

      document.getElementsByClassName("mapbox-gl-draw_line")[0].style.display = "none"; // Draw control line
      document.getElementsByClassName("mapbox-gl-draw_polygon")[0].style.display = "none"; // Draw control polygon
      document.getElementsByClassName("mapbox-gl-draw_trash")[0].style.display = "none"; // Draw control trash

      settings.mc = 3
      updateURLSearchParams();

      break;
    // Vier Kartenfenster
    case 4:
      // Sichtbare Kartenfenster definieren:
      map_2.setLayoutProperty(settings.l2, 'visibility', 'visible');
      map_3.setLayoutProperty(settings.l3, 'visibility', 'visible');
      map_4.setLayoutProperty(settings.l4, 'visibility', 'visible');
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
      document.getElementsByClassName("mapboxgl-ctrl-top-left")[0].style.display = ""; // Karte 1: Controls
      document.getElementsByClassName("mapboxgl-ctrl-top-left")[1].style.display = "none"; // Karte 2: Controls
      document.getElementsByClassName("mapboxgl-ctrl-top-left")[2].style.display = "none"; // Karte 3: Controls

      document.getElementsByClassName("mapbox-gl-draw_line")[0].style.display = "none"; // Draw control line
      document.getElementsByClassName("mapbox-gl-draw_polygon")[0].style.display = "none"; // Draw control polygon
      document.getElementsByClassName("mapbox-gl-draw_trash")[0].style.display = "none"; // Draw control trash

      settings.mc = 4
      updateURLSearchParams();

      break;
    default:
      // Fehler melden
      alert("ERROR: " + map_number);
  }
}

function intitialMapNumber() {
  if (JSON.stringify(allMapsLoaded) !== "[true,true,true,true]") {
    setTimeout(function () {
      intitialMapNumber()
    }, 100);
    return;
  }
  var mc = settings.mc
  if (mc) {
    setTimeout(() => {
      setMapNumber(settings.mc);
    }, 100);
  }
}

intitialMapNumber();

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
const draw = new MapboxDraw({
  displayControlsDefault: false,
  controls: {
    line_string: true,
    polygon: true,
    trash: true
  },
  styles: [
    // Polygons
    {
      'id': 'gl-draw-polygon-fill',
      'type': 'fill',
      'filter': ['all', ['==', '$type', 'Polygon']],
      'paint': {
        'fill-color': [
          'case',
          ['==', ['get', 'active'], 'true'], orange,
          blue,
        ],
        'fill-opacity': 0.1,
      },
    },
    // Lines
    {
      'id': 'gl-draw-lines',
      'type': 'line',
      'filter': [
        'any',
        ['==', '$type', 'LineString'],
        ['==', '$type', 'Polygon'],
      ],
      'layout': {
        'line-cap': 'round',
        'line-join': 'round',
      },
      'paint': {
        'line-color': [
          'case',
          ['==', ['get', 'active'], 'true'], orange,
          blue,
        ],
        'line-dasharray': [
          'literal', [0.2, 2]
            ],
        'line-width': 2,
      },
    },
    // Points - outer circle
    {
      'id': 'gl-draw-point-outer',
      'type': 'circle',
      'filter': [
        'all',
        ['==', '$type', 'Point'],
        ['==', 'meta', 'feature'],
      ],
      'paint': {
        'circle-radius': [
          'case',
          ['==', ['get', 'active'], 'true'], 7,
          5,
        ],
        'circle-color': white,
      },
    },
    // Points - inner circle
    {
      'id': 'gl-draw-point-inner',
      'type': 'circle',
      'filter': [
        'all',
        ['==', '$type', 'Point'],
        ['==', 'meta', 'feature'],
      ],
      'paint': {
        'circle-radius': [
          'case',
          ['==', ['get', 'active'], 'true'], 5,
          3,
        ],
        'circle-color': [
          'case',
          ['==', ['get', 'active'], 'true'], orange,
          blue,
        ],
      },
    },
    // Vertex - outer circle
    {
      'id': 'gl-draw-vertex-outer',
      'type': 'circle',
      'filter': [
        'all',
        ['==', '$type', 'Point'],
        ['==', 'meta', 'vertex'],
        ['!=', 'mode', 'simple_select'],
      ],
      'paint': {
        'circle-radius': [
          'case',
          ['==', ['get', 'active'], 'true'], 7,
          5,
        ],
        'circle-color': white,
      },
    },
    // Vertex - inner circle
    {
      'id': 'gl-draw-vertex-inner',
      'type': 'circle',
      'filter': [
        'all',
        ['==', '$type', 'Point'],
        ['==', 'meta', 'vertex'],
        ['!=', 'mode', 'simple_select'],
      ],
      'paint': {
        'circle-radius': [
          'case',
          ['==', ['get', 'active'], 'true'], 5,
          3,
        ],
        'circle-color': orange,
      },
    },
    // Midpoint
    {
      'id': 'gl-draw-midpoint',
      'type': 'circle',
      'filter': [
        'all',
        ['==', 'meta', 'midpoint'],
      ],
      'paint': {
        'circle-radius': 3,
        'circle-color': orange,
      },
    },
  ],
});

// Map laden
map_1.on('load', () => {
  map_1.addControl(draw, 'top-left');

  setTimeout(() => {
    intitialMapNumber();
  }, 300);
});

map_1.on('draw.create', updateArea);
map_1.on('draw.delete', updateArea);
map_1.on('draw.update', updateArea);

map_1.on('draw.modechange', function () {
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