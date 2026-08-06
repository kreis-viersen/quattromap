import MapboxDraw from '@mapbox/mapbox-gl-draw';
import MaplibreGeocoder from '@maplibre/maplibre-gl-geocoder';
import syncMaps from '@mapbox/mapbox-gl-sync-move';

import TurfArea from '@turf/area';
import TurfCentroid from '@turf/centroid';
import TurfLength from '@turf/length';

import maplibregl from 'maplibre-gl';

import 'maplibre-gl/dist/maplibre-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import '@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css';
import './style.css';

import config from './config.json';
import LZString from 'lz-string';

const blue = '#3bb2d0';
const orange = '#fbb03b';
const white = '#fff';

// patch Mapbox Draw to use MapLibre CSS class names instead of Mapbox GL JS
MapboxDraw.constants.classes.CANVAS = 'maplibregl-canvas';
MapboxDraw.constants.classes.CONTROL_BASE = 'maplibregl-ctrl';
MapboxDraw.constants.classes.CONTROL_PREFIX = 'maplibregl-ctrl-';
MapboxDraw.constants.classes.CONTROL_GROUP = 'maplibregl-ctrl-group';
MapboxDraw.constants.classes.ATTRIBUTION = 'maplibregl-ctrl-attrib';

// check if fullscreen is supported
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
  glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
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

// create main map
var map_1 = new maplibregl.Map({
  container: "map_1",
  style: default_style,
  zoom: config.zoom,
  center: config.center,
  pitchWithRotate: false,
  attributionControl: false,
  hash: true
});
const attribution_map_1 = new maplibregl.AttributionControl({
  compact: true
});

// create 2nd map
var map_2 = new maplibregl.Map({
  container: "map_2",
  style: default_style,
  zoom: config.zoom,
  center: config.center,
  pitchWithRotate: false,
  attributionControl: false,
  hash: false
});
const attribution_map_2 = new maplibregl.AttributionControl({
  compact: true
});

// create 3rd map
var map_3 = new maplibregl.Map({
  container: "map_3",
  style: default_style,
  zoom: config.zoom,
  center: config.center,
  pitchWithRotate: false,
  attributionControl: false,
  hash: false
});
const attribution_map_3 = new maplibregl.AttributionControl({
  compact: true
});

//create 4th map
var map_4 = new maplibregl.Map({
  container: "map_4",
  style: default_style,
  zoom: config.zoom,
  center: config.center,
  pitchWithRotate: false,
  attributionControl: false,
  hash: false
});
const attribution_map_4 = new maplibregl.AttributionControl({
  compact: true
});

var maps = [map_1, map_2, map_3, map_4];
var allMapsLoaded = [false, false, false, false];

// define custom drawing styles for Mapbox Draw (lines, polygons, measurements)
const drawStyles = [{'id': 'gl-draw-polygon-fill-inactive','type': 'fill','filter': ['all',['==', 'active', 'false'],['==', '$type', 'Polygon'],['!=', 'mode', 'static']],'paint': {'fill-color': '#3bb2d0','fill-outline-color': '#3bb2d0','fill-opacity': 0.1}},{'id': 'gl-draw-polygon-fill-active','type': 'fill','filter': ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],'paint': {'fill-color': '#fbb03b','fill-outline-color': '#fbb03b','fill-opacity': 0.1}},{'id': 'gl-draw-polygon-midpoint','type': 'circle','filter': ['all',['==', '$type', 'Point'],['==', 'meta', 'midpoint']],'paint': {'circle-radius': 3,'circle-color': '#fbb03b'}},{'id': 'gl-draw-polygon-stroke-inactive','type': 'line','filter': ['all',['==', 'active', 'false'],['==', '$type', 'Polygon'],['!=', 'mode', 'static']],'layout': {'line-cap': 'round','line-join': 'round'},'paint': {'line-color': '#3bb2d0','line-width': 2}},{'id': 'gl-draw-polygon-stroke-active','type': 'line','filter': ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],'layout': {'line-cap': 'round','line-join': 'round'},'paint': {'line-color': '#fbb03b','line-dasharray': [0.2, 2],'line-width': 2}},{'id': 'gl-draw-line-inactive','type': 'line','filter': ['all',['==', 'active', 'false'],['==', '$type', 'LineString'],['!=', 'mode', 'static']],'layout': {'line-cap': 'round','line-join': 'round'},'paint': {'line-color': '#3bb2d0','line-width': 2}},{'id': 'gl-draw-line-active','type': 'line','filter': ['all',['==', '$type', 'LineString'],['==', 'active', 'true']],'layout': {'line-cap': 'round','line-join': 'round'},'paint': {'line-color': '#fbb03b','line-dasharray': [0.2, 2],'line-width': 2}},{'id': 'gl-draw-polygon-and-line-vertex-stroke-inactive','type': 'circle','filter': ['all',['==', 'meta', 'vertex'],['==', '$type', 'Point'],['!=', 'mode', 'static']],'paint': {'circle-radius': 5,'circle-color': '#fff'}},{'id': 'gl-draw-polygon-and-line-vertex-inactive','type': 'circle','filter': ['all',['==', 'meta', 'vertex'],['==', '$type', 'Point'],['!=', 'mode', 'static']],'paint': {'circle-radius': 3,'circle-color': '#fbb03b'}},{'id': 'gl-draw-point-point-stroke-inactive','type': 'circle','filter': ['all',['==', 'active', 'false'],['==', '$type', 'Point'],['==', 'meta', 'feature'],['!=', 'mode', 'static']],'paint': {'circle-radius': 5,'circle-opacity': 1,'circle-color': '#fff'}},{'id': 'gl-draw-point-inactive','type': 'circle','filter': ['all',['==', 'active', 'false'],['==', '$type', 'Point'],['==', 'meta', 'feature'],['!=', 'mode', 'static']],'paint': {'circle-radius': 3,'circle-color': '#3bb2d0'}},{'id': 'gl-draw-point-stroke-active','type': 'circle','filter': ['all',['==', '$type', 'Point'],['==', 'active', 'true'],['!=', 'meta', 'midpoint']],'paint': {'circle-radius': 7,'circle-color': '#fff'}},{'id': 'gl-draw-point-active','type': 'circle','filter': ['all',['==', '$type', 'Point'],['!=', 'meta', 'midpoint'],['==', 'active', 'true']],'paint': {'circle-radius': 5,'circle-color': '#fbb03b'}},{'id': 'gl-draw-polygon-fill-static','type': 'fill','filter': ['all', ['==', 'mode', 'static'], ['==', '$type', 'Polygon']],'paint': {'fill-color': '#404040','fill-outline-color': '#404040','fill-opacity': 0.1}},{'id': 'gl-draw-polygon-stroke-static','type': 'line','filter': ['all', ['==', 'mode', 'static'], ['==', '$type', 'Polygon']],'layout': {'line-cap': 'round','line-join': 'round'},'paint': {'line-color': '#404040','line-width': 2}},{'id': 'gl-draw-line-static','type': 'line','filter': ['all', ['==', 'mode', 'static'], ['==', '$type', 'LineString']],'layout': {'line-cap': 'round','line-join': 'round'},'paint': {'line-color': '#404040','line-width': 2}},{'id': 'gl-draw-point-static','type': 'circle','filter': ['all', ['==', 'mode', 'static'], ['==', '$type', 'Point']],'paint': {'circle-radius': 5,'circle-color': '#404040'}}];

// initialize Mapbox Draw
const draw = new MapboxDraw({
  displayControlsDefault: false,
  controls: {
    line_string: true,
    polygon: true,
    trash: true
  },
  styles: drawStyles
});

// function that limits drawn geometries to one at a time
map_1.on('draw.modechange', () => {
  if (!['draw_polygon', 'draw_line_string'].includes(draw.getMode())) {
    return;
  }

  const features = draw.getAll().features;

  if (features.length <= 1) {
    resetLabels();
    return;
  }

  const idsToDelete = features
    .slice(0, -1)
    .filter(f =>
      f.geometry.type === 'Polygon' ||
      f.geometry.type === 'LineString'
    )
    .map(f => f.id);

  draw.delete(idsToDelete);
  resetLabels();
});

// update the measurement label (length, area)
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

// trigger label update
map_1.on('draw.create', updateArea);
map_1.on('draw.delete', updateArea);
map_1.on('draw.update', updateArea);

// initialize the primary map after loading
map_1.on("load", function () {
  allMapsLoaded[0] = true;
  map_1.setLayoutProperty(settings.l1, 'visibility', 'visible');
  
  // add a label layer for measurement results
  map_1.addLayer({
    "id": "labels",
    "type": "symbol",
    "source": {
      "type": "geojson",
      "data": {
        "type": "FeatureCollection",
        "features": []
      }
    },
    "layout": {
      "text-field": ["get", "title"],
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

  // expand attribution when compact mode is disabled
  if (layer.compact_attribution == false) {
    ca_layer_1 = false
    document.getElementById('map_1').getElementsByClassName('maplibregl-ctrl-attrib-button')[0].click();
  }

  setOverlay1();
  map_1.addControl(draw, 'top-left');
});

// initialize the 2nd map after loading
map_2.on("load", function () {
  allMapsLoaded[1] = true;
  map_2.setLayoutProperty(settings.l2, 'visibility', 'visible');

  const layer = default_style.layers.find(el => el.id === settings.l2);
  map_2.addControl(attribution_map_2)

  // expand attribution when compact mode is disabled
  if (layer.compact_attribution == false) {
    ca_layer_2 = false
    document.getElementById('map_2').getElementsByClassName('maplibregl-ctrl-attrib-button')[0].click();
  }

  setOverlay2();
});

// initialize the 3rd map after loading
map_3.on("load", function () {
  allMapsLoaded[2] = true;
  map_3.setLayoutProperty(settings.l3, 'visibility', 'visible');

  const layer = default_style.layers.find(el => el.id === settings.l3);
  map_3.addControl(attribution_map_3)

  // expand attribution when compact mode is disabled
  if (layer.compact_attribution == false) {
    ca_layer_3 = false
    document.getElementById('map_3').getElementsByClassName('maplibregl-ctrl-attrib-button')[0].click();
  }

  setOverlay3();
});

// initialize the 4th map after loading
map_4.on("load", function () {
  allMapsLoaded[3] = true;
  map_4.setLayoutProperty(settings.l4, 'visibility', 'visible');

  const layer = default_style.layers.find(el => el.id === settings.l4);
  map_4.addControl(attribution_map_4)

  // expand attribution when compact mode is disabled
  if (layer.compact_attribution == false) {
    ca_layer_4 = false
    document.getElementById('map_4').getElementsByClassName('maplibregl-ctrl-attrib-button')[0].click();
  }

  setOverlay4();
});

// sync map windows
syncMaps(map_1, map_3, map_2, map_4);

// geocoding API for MapLibre Geocoder using OpenStreetMap Nominatim (instead of Mapbox)
const geocodingApi = {
  forwardGeocode: async (searchConfig) => {
    const query = searchConfig.query?.trim();
    if (!query) {
      return { features: [] };
    }

    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.set('q', query);
    url.searchParams.set('format', 'geojson');
    url.searchParams.set('addressdetails', '1');
    url.searchParams.set('limit', '5');

    try {
      const response = await fetch(url.toString(), {
        headers: {
          'Accept': 'application/geo+json, application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Geocoding failed with HTTP ${response.status}`);
      }

      const data = await response.json();
      const features = (data.features || []).map((feature) => {
        const coordinates = feature.geometry.coordinates;
        const properties = feature.properties || {};

        return {
          type: 'Feature',
          geometry: feature.geometry,
          properties,
          place_name: properties.display_name || query,
          text: properties.name || properties.display_name || query,
          center: coordinates,
          bbox: feature.bbox
        };
      });

      return { features };
    } catch (error) {
      console.error('Geocoding error:', error);
      return { features: [] };
    }
  }
};

// initialize geocoding API (for search)
function createGeocoder() {
  return new MaplibreGeocoder(geocodingApi, {
    maplibregl,
    marker: false,
    showResultsWhileTyping: false,
    placeholder: 'Ort oder Adresse suchen',

    flyTo: {
      zoom: 14
    }
  });
}

// add controls
map_1.addControl(createGeocoder(), 'top-left');

map_1.addControl(
  new maplibregl.NavigationControl({
    showZoom: true,
    showCompass: true
  }),
  'top-left'
);

map_1.addControl(
  new maplibregl.FullscreenControl({
    container: document.querySelector('body')
  }),
  'top-left'
);

map_1.addControl(
  new maplibregl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true,
    showUserHeading: true
  }),
  'top-left'
);

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

// make menu transparent while using opacity sliders
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
    document.getElementById('map_1').getElementsByClassName('maplibregl-ctrl-attrib-button')[0].click();
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
    document.getElementById('map_2').getElementsByClassName('maplibregl-ctrl-attrib-button')[0].click();
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
    document.getElementById('map_3').getElementsByClassName('maplibregl-ctrl-attrib-button')[0].click();
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
    document.getElementById('map_4').getElementsByClassName('maplibregl-ctrl-attrib-button')[0].click();
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
    document.getElementById('map_1').getElementsByClassName('maplibregl-ctrl-attrib-button')[0].click();
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
    document.getElementById('map_2').getElementsByClassName('maplibregl-ctrl-attrib-button')[0].click();
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
    document.getElementById('map_3').getElementsByClassName('maplibregl-ctrl-attrib-button')[0].click();
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
    document.getElementById('map_4').getElementsByClassName('maplibregl-ctrl-attrib-button')[0].click();
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
window.setMapNumber = function setMapNumber(mapNumber) {
  const layouts = {
    1: {
      maps: [
        { width: '100%', height: '100%', top: '0', left: '0' },
        { width: '0', height: '0' },
        { width: '0', height: '0' },
        { width: '0', height: '0' }
      ],
      crosses: [
        { top: '50%', left: '50%', visible: true },
        { visible: false },
        { visible: false },
        { visible: false }
      ]
    },

    2: {
      maps: [
        { width: '50%', height: '100%', top: '0', left: '0' },
        { width: '50%', height: '100%', top: '0', left: '50%' },
        { width: '0', height: '0' },
        { width: '0', height: '0' }
      ],
      crosses: [
        { top: '50%', left: '25%', visible: true },
        { top: '50%', left: '75%', visible: true },
        { visible: false },
        { visible: false }
      ]
    },

    3: {
      maps: [
        { width: '33.333%', height: '100%', top: '0', left: '0' },
        { width: '33.333%', height: '100%', top: '0', left: '33.333%' },
        { width: '33.334%', height: '100%', top: '0', left: '66.666%' },
        { width: '0', height: '0' }
      ],
      crosses: [
        { top: '50%', left: '16.666%', visible: true },
        { top: '50%', left: '50%', visible: true },
        { top: '50%', left: '83.333%', visible: true },
        { visible: false }
      ]
    },

    4: {
      maps: [
        { width: '50%', height: '50%', top: '0', left: '0' },
        { width: '50%', height: '50%', top: '0', left: '50%' },
        { width: '50%', height: '50%', top: '50%', left: '0' },
        { width: '50%', height: '50%', top: '50%', left: '50%' }
      ],
      crosses: [
        { top: '25%', left: '25%', visible: true },
        { top: '25%', left: '75%', visible: true },
        { top: '75%', left: '25%', visible: true },
        { top: '75%', left: '75%', visible: true }
      ]
    }
  };

  const layout = layouts[mapNumber];

  if (!layout) {
    console.error(`Ungültige Kartenanzahl: ${mapNumber}`);
    return;
  }

  const mapInstances = [map_1, map_2, map_3, map_4];
  const mapElements = mapInstances.map(
    (_, index) => document.getElementById(`map_${index + 1}`)
  );
  const crossElements = mapInstances.map(
    (_, index) => document.getElementById(`cross_${index + 1}`)
  );
  const buttonElements = mapInstances.map(
    (_, index) => document.getElementById(`button_${index + 1}map`)
  );

  // order map containers
  mapElements.forEach((element, index) => {
    const mapLayout = layout.maps[index];

    element.style.width = mapLayout.width;
    element.style.height = mapLayout.height;
    element.style.top = mapLayout.top ?? '0';
    element.style.left = mapLayout.left ?? '0';

    // Alte Positionsangaben aus vorherigen Layouts zurücksetzen
    element.style.right = 'auto';
    element.style.bottom = 'auto';
  });

  // set visibility of map layers
  mapInstances.forEach((map, index) => {
    const isVisible = index < mapNumber;

    map.setLayoutProperty(
      settings[`l${index + 1}`],
      'visibility',
      isVisible ? 'visible' : 'none'
    );
  });

  // position of cross
  crossElements.forEach((element, index) => {
    const crossLayout = layout.crosses[index];

    element.style.display = crossLayout.visible ? '' : 'none';

    if (crossLayout.visible) {
      element.style.top = crossLayout.top;
      element.style.left = crossLayout.left;
    }
  });

  // mark active map number button
  buttonElements.forEach((button, index) => {
    button.classList.toggle('active', index + 1 === mapNumber);
  });

  // only show measuring tools when view limited to main map
  const showDrawControls = mapNumber === 1;

  [
    '.mapbox-gl-draw_line',
    '.mapbox-gl-draw_polygon',
    '.mapbox-gl-draw_trash'
  ].forEach((selector) => {
    const control = document.querySelector(selector);

    if (control) {
      control.style.display = showDrawControls ? '' : 'none';
    }
  });

  // resize maps
  requestAnimationFrame(() => {
    mapInstances.forEach((map) => map.resize());
  });

  settings.mc = mapNumber;
  updateURLSearchParams();
};

function initialMapNumber() {
  if (JSON.stringify(allMapsLoaded) !== "[true,true,true,true]") {
    setTimeout(function () {
      initialMapNumber()
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

initialMapNumber();

// reset all labels
window.resetLabels = function resetLabels() {
  const source = map_1.getSource("labels");
  if (!source) return;

  source.setData({
    type: "FeatureCollection",
    features: []
  });
}

