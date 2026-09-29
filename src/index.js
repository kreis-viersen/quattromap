import MapboxDraw from '@mapbox/mapbox-gl-draw';
import MaplibreGeocoder from '@maplibre/maplibre-gl-geocoder';
import syncMaps from '@mapbox/mapbox-gl-sync-move';

import TurfArea from '@turf/area';
import TurfCentroid from '@turf/centroid';
import TurfLength from '@turf/length';

import * as maplibregl from 'maplibre-gl';

import 'maplibre-gl/dist/maplibre-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import '@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css';
import './style.css';

import config from './config.json';
import LZString from 'lz-string';

const maplibreWorkerUrl = new URL(
  './vendor/maplibre/maplibre-gl-worker.mjs',
  window.location.href
).toString();
maplibregl.setWorkerUrl(maplibreWorkerUrl);

const blue = '#3bb2d0';
const orange = '#fbb03b';
const white = '#fff';

const PHOTON_NRW_BBOX = [5.75, 50.25, 9.65, 52.65];

const CADASTRAL_INDEX_ASSET_URL = './data/katasteraemter-gemarkungen-fluren-nrw.json';
const ALKIS_OAPIF_PARCELS_URL = 'https://ogc-api.nrw.de/lika/v1/collections/flurstueck';
const ALKIS_OAPIF_PARCEL_POINTS_URL = 'https://ogc-api.nrw.de/lika/v1/collections/flurstueck_punkt';
const PARCEL_SEARCH_SOURCE_ID = 'parcel-search-source';
const PARCEL_SEARCH_FILL_LAYER_ID = 'parcel-search-fill';
const PARCEL_SEARCH_LINE_LAYER_ID = 'parcel-search-line';
const PARCEL_SEARCH_TEMPORARY_HIGHLIGHT_MS = 5000;

const parcelSearchState = {
  cadastralIndex: null,
  cadastralIndexPromise: null,
  parcelFeatures: [],
  syncingParcelSelectors: false,
  parcelSearchSerial: 0,
  highlightTimeout: null
};


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

// collapses the attribution of map frames (for initial start setup)
function collapseAttribution(mapId) {
  requestAnimationFrame(() => {
    const attribution = document
      .getElementById(mapId)
      .querySelector('.maplibregl-ctrl-attrib');

    if (attribution?.open) {
      attribution.querySelector('.maplibregl-ctrl-attrib-button')?.click();
    }
  });
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
const drawStyles = [{ 'id': 'gl-draw-polygon-fill-inactive', 'type': 'fill', 'filter': ['all', ['==', 'active', 'false'], ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']], 'paint': { 'fill-color': '#3bb2d0', 'fill-outline-color': '#3bb2d0', 'fill-opacity': 0.1 } }, { 'id': 'gl-draw-polygon-fill-active', 'type': 'fill', 'filter': ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']], 'paint': { 'fill-color': '#fbb03b', 'fill-outline-color': '#fbb03b', 'fill-opacity': 0.1 } }, { 'id': 'gl-draw-polygon-midpoint', 'type': 'circle', 'filter': ['all', ['==', '$type', 'Point'], ['==', 'meta', 'midpoint']], 'paint': { 'circle-radius': 3, 'circle-color': '#fbb03b' } }, { 'id': 'gl-draw-polygon-stroke-inactive', 'type': 'line', 'filter': ['all', ['==', 'active', 'false'], ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']], 'layout': { 'line-cap': 'round', 'line-join': 'round' }, 'paint': { 'line-color': '#3bb2d0', 'line-width': 2 } }, { 'id': 'gl-draw-polygon-stroke-active', 'type': 'line', 'filter': ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']], 'layout': { 'line-cap': 'round', 'line-join': 'round' }, 'paint': { 'line-color': '#fbb03b', 'line-dasharray': [0.2, 2], 'line-width': 2 } }, { 'id': 'gl-draw-line-inactive', 'type': 'line', 'filter': ['all', ['==', 'active', 'false'], ['==', '$type', 'LineString'], ['!=', 'mode', 'static']], 'layout': { 'line-cap': 'round', 'line-join': 'round' }, 'paint': { 'line-color': '#3bb2d0', 'line-width': 2 } }, { 'id': 'gl-draw-line-active', 'type': 'line', 'filter': ['all', ['==', '$type', 'LineString'], ['==', 'active', 'true']], 'layout': { 'line-cap': 'round', 'line-join': 'round' }, 'paint': { 'line-color': '#fbb03b', 'line-dasharray': [0.2, 2], 'line-width': 2 } }, { 'id': 'gl-draw-polygon-and-line-vertex-stroke-inactive', 'type': 'circle', 'filter': ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point'], ['!=', 'mode', 'static']], 'paint': { 'circle-radius': 5, 'circle-color': '#fff' } }, { 'id': 'gl-draw-polygon-and-line-vertex-inactive', 'type': 'circle', 'filter': ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point'], ['!=', 'mode', 'static']], 'paint': { 'circle-radius': 3, 'circle-color': '#fbb03b' } }, { 'id': 'gl-draw-point-point-stroke-inactive', 'type': 'circle', 'filter': ['all', ['==', 'active', 'false'], ['==', '$type', 'Point'], ['==', 'meta', 'feature'], ['!=', 'mode', 'static']], 'paint': { 'circle-radius': 5, 'circle-opacity': 1, 'circle-color': '#fff' } }, { 'id': 'gl-draw-point-inactive', 'type': 'circle', 'filter': ['all', ['==', 'active', 'false'], ['==', '$type', 'Point'], ['==', 'meta', 'feature'], ['!=', 'mode', 'static']], 'paint': { 'circle-radius': 3, 'circle-color': '#3bb2d0' } }, { 'id': 'gl-draw-point-stroke-active', 'type': 'circle', 'filter': ['all', ['==', '$type', 'Point'], ['==', 'active', 'true'], ['!=', 'meta', 'midpoint']], 'paint': { 'circle-radius': 7, 'circle-color': '#fff' } }, { 'id': 'gl-draw-point-active', 'type': 'circle', 'filter': ['all', ['==', '$type', 'Point'], ['!=', 'meta', 'midpoint'], ['==', 'active', 'true']], 'paint': { 'circle-radius': 5, 'circle-color': '#fbb03b' } }, { 'id': 'gl-draw-polygon-fill-static', 'type': 'fill', 'filter': ['all', ['==', 'mode', 'static'], ['==', '$type', 'Polygon']], 'paint': { 'fill-color': '#404040', 'fill-outline-color': '#404040', 'fill-opacity': 0.1 } }, { 'id': 'gl-draw-polygon-stroke-static', 'type': 'line', 'filter': ['all', ['==', 'mode', 'static'], ['==', '$type', 'Polygon']], 'layout': { 'line-cap': 'round', 'line-join': 'round' }, 'paint': { 'line-color': '#404040', 'line-width': 2 } }, { 'id': 'gl-draw-line-static', 'type': 'line', 'filter': ['all', ['==', 'mode', 'static'], ['==', '$type', 'LineString']], 'layout': { 'line-cap': 'round', 'line-join': 'round' }, 'paint': { 'line-color': '#404040', 'line-width': 2 } }, { 'id': 'gl-draw-point-static', 'type': 'circle', 'filter': ['all', ['==', 'mode', 'static'], ['==', '$type', 'Point']], 'paint': { 'circle-radius': 5, 'circle-color': '#404040' } }];

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

// function that limits drawn geometries to one at a time
map_1.on('draw.modechange', (e) => {
  if (!['draw_polygon', 'draw_line_string'].includes(e.mode)) {
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

  // attribution settings
  map_1.addControl(attribution_map_1);
  collapseAttribution('map_1'); // collapse by default

  // expand attribution when compact mode is disabled
  if (layer.compact_attribution == false) {
    ca_layer_1 = false
  }

  setOverlay1();
});

// initialize the 2nd map after loading
map_2.on("load", function () {
  allMapsLoaded[1] = true;
  map_2.setLayoutProperty(settings.l2, 'visibility', 'visible');

  const layer = default_style.layers.find(el => el.id === settings.l2);

  // attribution settings
  map_2.addControl(attribution_map_2);
  collapseAttribution('map_2'); // collapse by default

  // expand attribution when compact mode is disabled
  if (layer.compact_attribution == false) {
    ca_layer_2 = false
  }

  setOverlay2();
});

// initialize the 3rd map after loading
map_3.on("load", function () {
  allMapsLoaded[2] = true;
  map_3.setLayoutProperty(settings.l3, 'visibility', 'visible');

  const layer = default_style.layers.find(el => el.id === settings.l3);

  // attribution settings
  map_3.addControl(attribution_map_3);
  collapseAttribution('map_3'); // collapse by default

  // expand attribution when compact mode is disabled
  if (layer.compact_attribution == false) {
    ca_layer_3 = false
  }

  setOverlay3();
});

// initialize the 4th map after loading
map_4.on("load", function () {
  allMapsLoaded[3] = true;
  map_4.setLayoutProperty(settings.l4, 'visibility', 'visible');

  const layer = default_style.layers.find(el => el.id === settings.l4);

  // attribution settings
  map_4.addControl(attribution_map_4);
  collapseAttribution('map_4'); // collapse by default

  // expand attribution when compact mode is disabled
  if (layer.compact_attribution == false) {
    ca_layer_4 = false
  }

  setOverlay4();
});

// sync map windows
syncMaps(map_1, map_3, map_2, map_4);

// geocoding API for MapLibre Geocoder using Photon (komoot)
let photonAbortController = null;

const geocodingApi = {
  forwardGeocode: async (config) => {
    const query = config.query?.trim();
    if (!query || query.length < 3) {
      return { features: [] };
    }

    photonAbortController?.abort();
    const controller = new AbortController();
    photonAbortController = controller;

    try {
      const params = new URLSearchParams({
        q: query,
        limit: '5',
        lang: 'de',
        bbox: PHOTON_NRW_BBOX.join(',')
      });

      const response = await fetch(
        `https://photon.komoot.io/api/?${params.toString()}`,
        { signal: controller.signal }
      );

      if (!response.ok) {
        throw new Error(`Photon HTTP ${response.status}`);
      }

      const data = await response.json();

      const features = (data.features || []).map(feature => {
        const extent = feature.properties?.extent;
        const bbox = Array.isArray(extent) && extent.length === 4
          ? [extent[0], extent[3], extent[2], extent[1]]
          : undefined;

        return {
          type: 'Feature',
          geometry: feature.geometry,
          properties: feature.properties,
          center: feature.geometry.coordinates,
          ...(bbox ? { bbox } : {}),
          place_name: [
            feature.properties.name,
            feature.properties.street,
            feature.properties.housenumber,
            feature.properties.postcode,
            feature.properties.city
          ].filter(Boolean).join(', '),
          text: feature.properties.name || query
        };
      });

      return { features };
    } catch (error) {
      if (error.name === 'AbortError') {
        return { features: [] };
      }
      console.error('Photon-Adresssuche fehlgeschlagen:', error);
      return { features: [] };
    } finally {
      if (photonAbortController === controller) {
        photonAbortController = null;
      }
    }
  }
};

// initialize geocoding API (for search)
function createGeocoder() {
  return new MaplibreGeocoder(geocodingApi, {
    maplibregl,
    marker: false,

    collapsed: false,
    clearOnBlur: false,
    clearAndBlurOnEsc: true,

    showResultsWhileTyping: true,
    debounceSearch: 350,
    minLength: 3,

    flyTo: { zoom: 14, duration: 800 },
    bbox: PHOTON_NRW_BBOX, 

    placeholder: 'Adresse in NRW suchen',

    enableEventLogging: false,
    trackProximity: false,
    showResultMarkers: false,
    popup: false
  });
}

// add address and parcel search as one control row
const geocoder = createGeocoder();

class SearchControlRow {
  constructor(geocoderControl) {
    this.geocoderControl = geocoderControl;
  }

  onAdd(map) {
    this.map = map;
    this.container = document.createElement('div');
    this.container.className = 'maplibregl-ctrl quattromap-search-controls';

    const geocoderContainer = this.geocoderControl.onAdd(map);
    geocoderContainer.classList.add('quattromap-geocoder-control');
    this.container.appendChild(geocoderContainer);

    const parcelGroup = document.createElement('div');
    parcelGroup.className = 'maplibregl-ctrl-group parcel-search-map-control';

    const parcelButton = document.createElement('button');
    parcelButton.type = 'button';
    parcelButton.id = 'parcel-search-button';
    parcelButton.className = 'parcel-search-map-button';
    parcelButton.title = 'Flurstück suchen';
    parcelButton.setAttribute('aria-label', 'Flurstück suchen');

    const parcelIcon = document.createElement('img');
    parcelIcon.src = './img/parcel-search.svg';
    parcelIcon.alt = '';
    parcelButton.appendChild(parcelIcon);

    parcelGroup.appendChild(parcelButton);
    this.container.appendChild(parcelGroup);

    return this.container;
  }

  onRemove() {
    this.geocoderControl.onRemove();
    this.container?.remove();
    this.map = undefined;
  }
}

map_1.addControl(new SearchControlRow(geocoder), 'top-left');

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


map_1.addControl(draw, 'top-left');

// NRW-wide cadastral parcel search
const parcelSearchElements = {
  button: document.getElementById('parcel-search-button'),
  dialog: document.getElementById('parcel-search-dialog'),
  officeSelect: document.getElementById('parcel-office-select'),
  districtSelect: document.getElementById('parcel-district-select'),
  flurSelect: document.getElementById('parcel-flur-select'),
  numberSelect: document.getElementById('parcel-number-select'),
  listStatus: document.getElementById('parcel-list-status'),
  selectSearchButton: document.getElementById('parcel-select-search-button'),
  directInput: document.getElementById('parcel-direct-input'),
  directSearchButton: document.getElementById('parcel-direct-search-button'),
  persistentHighlight: document.getElementById('parcel-persistent-highlight'),
  searchStatus: document.getElementById('parcel-search-status')
};

function populateParcelSelect(select, items, { placeholder = 'Bitte auswählen' } = {}) {
  select.replaceChildren();

  const empty = document.createElement('option');
  empty.value = '';
  empty.textContent = placeholder;
  select.append(empty);

  for (const item of items) {
    const option = document.createElement('option');
    option.value = String(item.value);
    option.textContent = item.label;
    select.append(option);
  }
}

async function loadCadastralIndex() {
  if (parcelSearchState.cadastralIndex) {
    return parcelSearchState.cadastralIndex;
  }

  if (!parcelSearchState.cadastralIndexPromise) {
    parcelSearchState.cadastralIndexPromise = (async () => {
      const response = await fetch(CADASTRAL_INDEX_ASSET_URL, {
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (!data || typeof data !== 'object' || Array.isArray(data)) {
        throw new Error('Ungültiges JSON-Format');
      }

      parcelSearchState.cadastralIndex = data;
      return data;
    })().finally(() => {
      if (!parcelSearchState.cadastralIndex) {
        parcelSearchState.cadastralIndexPromise = null;
      }
    });
  }

  return parcelSearchState.cadastralIndexPromise;
}

function toOgcGemarkungKey(shortKey) {
  const digits = String(shortKey ?? '')
    .replace(/\D/g, '')
    .padStart(4, '0')
    .slice(-4);

  return `05${digits}`;
}

function toOgcFlurKey(shortKey, flur) {
  const gemaschl = toOgcGemarkungKey(shortKey);
  const flurDigits = String(flur ?? '')
    .replace(/\D/g, '')
    .padStart(3, '0')
    .slice(-3);

  return `${gemaschl}${flurDigits}`;
}

function toOgcParcelKey(shortKey, flur, zaehler, nenner) {
  const flurschl = toOgcFlurKey(shortKey, flur);
  const zaehlerDigits = String(zaehler ?? '')
    .replace(/\D/g, '')
    .padStart(5, '0')
    .slice(-5);

  const nennerRaw = String(nenner ?? '').replace(/\D/g, '');
  const nennerPart = nennerRaw
    ? nennerRaw.padStart(4, '0').slice(-4)
    : '____';

  return `${flurschl}${zaehlerDigits}${nennerPart}__`;
}

function getParcelNumberLabel(properties = {}) {
  const zaehler =
    properties.flstnrzae ??
    properties.flurstuecksnummer_zaehler ??
    properties.zaehler;

  const nenner =
    properties.flstnrnen ??
    properties.flurstuecksnummer_nenner ??
    properties.nenner;

  if (zaehler == null) {
    return String(
      properties.flstkennz ??
      properties.flurstueckskennzeichen ??
      properties.id ??
      'Flurstück'
    );
  }

  const z = String(zaehler).replace(/^0+/, '') || '0';
  const n = nenner == null
    ? ''
    : (String(nenner).replace(/^0+/, '') || '0');

  return n && n !== '0' ? `${z}/${n}` : z;
}

function createAlkisItemsUrl(collectionUrl, params = {}, properties = []) {
  const url = new URL(`${collectionUrl}/items`);
  url.searchParams.set('f', 'json');
  url.searchParams.set('profile', 'rfc7946');

  if (properties.length) {
    url.searchParams.set('properties', properties.join(','));
  }

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  }

  return url;
}

async function fetchAlkisFeatures(
  collectionUrl,
  params,
  { limit = 10000, properties = [] } = {}
) {
  const url = createAlkisItemsUrl(
    collectionUrl,
    { ...params, limit },
    properties
  );

  const response = await fetch(url, {
    headers: { Accept: 'application/geo+json, application/json' }
  });

  if (!response.ok) {
    throw new Error(`ALKIS-Abfrage fehlgeschlagen (HTTP ${response.status}).`);
  }

  const data = await response.json();
  return Array.isArray(data?.features) ? data.features : [];
}

function fetchParcelFeatures(params, options = {}) {
  return fetchAlkisFeatures(ALKIS_OAPIF_PARCELS_URL, params, options);
}

function fetchParcelPointFeatures(params, options = {}) {
  return fetchAlkisFeatures(ALKIS_OAPIF_PARCEL_POINTS_URL, params, options);
}

function createBoundsFromParcelFeature(feature) {
  const bounds = new maplibregl.LngLatBounds();
  let hasCoordinates = false;

  function extendCoordinates(coordinates) {
    if (!Array.isArray(coordinates)) {
      return;
    }

    if (
      coordinates.length >= 2 &&
      Number.isFinite(Number(coordinates[0])) &&
      Number.isFinite(Number(coordinates[1]))
    ) {
      bounds.extend([Number(coordinates[0]), Number(coordinates[1])]);
      hasCoordinates = true;
      return;
    }

    coordinates.forEach(extendCoordinates);
  }

  extendCoordinates(feature?.geometry?.coordinates);
  return hasCoordinates ? bounds : null;
}

function installParcelHighlightOnMap(targetMap, feature) {
  if (!feature?.geometry || !targetMap.isStyleLoaded()) {
    return;
  }

  const data = {
    type: 'FeatureCollection',
    features: [feature]
  };

  const source = targetMap.getSource(PARCEL_SEARCH_SOURCE_ID);

  if (source) {
    source.setData(data);
  } else {
    targetMap.addSource(PARCEL_SEARCH_SOURCE_ID, {
      type: 'geojson',
      data
    });
  }

  if (!targetMap.getLayer(PARCEL_SEARCH_FILL_LAYER_ID)) {
    targetMap.addLayer({
      id: PARCEL_SEARCH_FILL_LAYER_ID,
      type: 'fill',
      source: PARCEL_SEARCH_SOURCE_ID,
      paint: {
        'fill-color': '#478bca',
        'fill-opacity': 0.18
      }
    });
  }

  if (!targetMap.getLayer(PARCEL_SEARCH_LINE_LAYER_ID)) {
    targetMap.addLayer({
      id: PARCEL_SEARCH_LINE_LAYER_ID,
      type: 'line',
      source: PARCEL_SEARCH_SOURCE_ID,
      paint: {
        'line-color': '#d61f2c',
        'line-width': 3
      }
    });
  }
}

function installParcelHighlight(feature) {
  maps.forEach(targetMap => installParcelHighlightOnMap(targetMap, feature));
}

function clearParcelHighlight() {
  const emptyData = {
    type: 'FeatureCollection',
    features: []
  };

  maps.forEach(targetMap => {
    const source = targetMap.getSource(PARCEL_SEARCH_SOURCE_ID);
    if (source) {
      source.setData(emptyData);
    }
  });
}

function cancelParcelHighlightTimeout() {
  if (parcelSearchState.highlightTimeout !== null) {
    window.clearTimeout(parcelSearchState.highlightTimeout);
    parcelSearchState.highlightTimeout = null;
  }
}

function scheduleParcelHighlightRemoval() {
  cancelParcelHighlightTimeout();

  if (parcelSearchElements.persistentHighlight.checked) {
    return;
  }

  parcelSearchState.highlightTimeout = window.setTimeout(() => {
    clearParcelHighlight();
    parcelSearchState.highlightTimeout = null;
  }, PARCEL_SEARCH_TEMPORARY_HIGHLIGHT_MS);
}

function showParcelSearchMessage(message) {
  document.querySelectorAll('.parcel-search-toast').forEach(element => element.remove());

  const element = document.createElement('div');
  element.className = 'parcel-search-toast';
  element.textContent = message;
  document.body.appendChild(element);

  window.setTimeout(() => {
    element.remove();
  }, 2500);
}

function zoomToParcelFeature(feature) {
  cancelParcelHighlightTimeout();
  installParcelHighlight(feature);
  scheduleParcelHighlightRemoval();

  const bounds = createBoundsFromParcelFeature(feature);

  if (bounds && !bounds.isEmpty()) {
    map_1.fitBounds(bounds, {
      padding: 90,
      maxZoom: 19,
      duration: 900
    });
  }

  parcelSearchElements.dialog.close();
  showParcelSearchMessage('Flurstück gefunden und in allen Karten hervorgehoben.');
}

async function openParcelSearch() {
  if (!parcelSearchElements.dialog.open) {
    parcelSearchElements.dialog.showModal();
  }

  if (!parcelSearchState.cadastralIndex) {
    await initializeParcelSearch();
  }
}

async function initializeParcelSearch() {
  parcelSearchElements.searchStatus.textContent = 'Katasterdaten werden geladen …';

  try {
    const index = await loadCadastralIndex();

    const offices = Object.keys(index)
      .sort((a, b) => a.localeCompare(b, 'de'))
      .map(name => ({ value: name, label: name }));

    populateParcelSelect(parcelSearchElements.officeSelect, offices);
    parcelSearchElements.searchStatus.textContent = '';
  } catch (error) {
    console.error(error);
    parcelSearchElements.searchStatus.textContent =
      'Katasterämter, Gemarkungen und Fluren konnten nicht geladen werden.';
  }
}

function resetParcelDistricts() {
  populateParcelSelect(parcelSearchElements.districtSelect, []);
  populateParcelSelect(parcelSearchElements.flurSelect, []);
  populateParcelSelect(parcelSearchElements.numberSelect, []);

  parcelSearchElements.districtSelect.disabled = true;
  parcelSearchElements.flurSelect.disabled = true;
  parcelSearchElements.numberSelect.disabled = true;
  parcelSearchElements.selectSearchButton.disabled = true;
  parcelSearchElements.listStatus.textContent = '';
}

function handleParcelOfficeChange() {
  resetParcelDistricts();

  const office = parcelSearchElements.officeSelect.value;
  const districts = parcelSearchState.cadastralIndex?.[office];

  if (!districts || typeof districts !== 'object') {
    return;
  }

  const items = Object.entries(districts)
    .map(([name]) => ({ value: name, label: name }))
    .sort((a, b) => a.label.localeCompare(b.label, 'de', { numeric: true }));

  populateParcelSelect(parcelSearchElements.districtSelect, items);
  parcelSearchElements.districtSelect.disabled = false;
}

function handleParcelDistrictChange() {
  populateParcelSelect(parcelSearchElements.flurSelect, []);
  populateParcelSelect(parcelSearchElements.numberSelect, []);

  parcelSearchElements.flurSelect.disabled = true;
  parcelSearchElements.numberSelect.disabled = true;
  parcelSearchElements.selectSearchButton.disabled = true;
  parcelSearchElements.listStatus.textContent = '';

  const district =
    parcelSearchState.cadastralIndex?.[parcelSearchElements.officeSelect.value]
      ?.[parcelSearchElements.districtSelect.value];

  if (!district) {
    return;
  }

  const fluren = Array.isArray(district.fluren) ? district.fluren : [];

  populateParcelSelect(
    parcelSearchElements.flurSelect,
    fluren.map(value => ({ value, label: String(value) }))
  );

  parcelSearchElements.flurSelect.disabled = false;
}

async function handleParcelFlurChange() {
  populateParcelSelect(parcelSearchElements.numberSelect, []);
  parcelSearchElements.numberSelect.disabled = true;
  parcelSearchElements.selectSearchButton.disabled = true;
  parcelSearchState.parcelFeatures = [];

  const flur = parcelSearchElements.flurSelect.value;
  const district =
    parcelSearchState.cadastralIndex?.[parcelSearchElements.officeSelect.value]
      ?.[parcelSearchElements.districtSelect.value];

  if (!flur || !district?.schluessel) {
    return;
  }

  const serial = ++parcelSearchState.parcelSearchSerial;
  parcelSearchElements.listStatus.textContent = 'Flurstücke werden geladen …';

  try {
    const gemaschl = toOgcGemarkungKey(district.schluessel);
    const flurschl = toOgcFlurKey(district.schluessel, flur);

    const features = await fetchParcelPointFeatures(
      { gemaschl, flurschl },
      { properties: ['flstnrzae', 'flstnrnen'] }
    );

    if (serial !== parcelSearchState.parcelSearchSerial) {
      return;
    }

    const sorted = features.slice().sort((a, b) =>
      getParcelNumberLabel(a.properties).localeCompare(
        getParcelNumberLabel(b.properties),
        'de',
        { numeric: true }
      )
    );

    parcelSearchState.parcelFeatures = sorted;

    populateParcelSelect(
      parcelSearchElements.numberSelect,
      sorted.map((feature, index) => ({
        value: index,
        label: getParcelNumberLabel(feature.properties)
      }))
    );

    parcelSearchElements.numberSelect.disabled = sorted.length === 0;
    parcelSearchElements.listStatus.textContent = sorted.length
      ? `${sorted.length} Flurstücke verfügbar.`
      : 'Keine Flurstücke gefunden.';
  } catch (error) {
    console.error(error);

    if (serial !== parcelSearchState.parcelSearchSerial) {
      return;
    }

    parcelSearchElements.listStatus.textContent =
      'Flurstücke konnten nicht geladen werden.';
  }
}

function updateParcelSearchButtonState() {
  parcelSearchElements.selectSearchButton.disabled =
    parcelSearchElements.numberSelect.value === '';
}

function clearParcelDirectSearchOnManualSelection() {
  if (parcelSearchState.syncingParcelSelectors) {
    return;
  }

  if (parcelSearchElements.directInput.value) {
    parcelSearchElements.directInput.value = '';
    parcelSearchElements.searchStatus.textContent = '';
  }
}

function handleParcelNumberChange() {
  updateParcelSearchButtonState();
}

async function searchSelectedParcel() {
  const selectedValue = parcelSearchElements.numberSelect.value;

  if (selectedValue === '') {
    return;
  }

  const index = Number(selectedValue);
  const pointFeature = Number.isInteger(index)
    ? parcelSearchState.parcelFeatures[index]
    : null;

  const district =
    parcelSearchState.cadastralIndex?.[parcelSearchElements.officeSelect.value]
      ?.[parcelSearchElements.districtSelect.value];

  const flur = parcelSearchElements.flurSelect.value;

  if (!pointFeature || !district?.schluessel || !flur) {
    return;
  }

  const properties = pointFeature.properties ?? {};
  const zaehler = properties.flstnrzae;
  const nenner = properties.flstnrnen;

  if (zaehler == null) {
    return;
  }

  parcelSearchElements.selectSearchButton.disabled = true;
  parcelSearchElements.listStatus.textContent = 'Flurstück wird geladen …';

  try {
    const flstkennz = toOgcParcelKey(
      district.schluessel,
      flur,
      zaehler,
      nenner
    );

    const features = await fetchParcelFeatures(
      { flstkennz },
      { limit: 5 }
    );

    const feature = features.find(item => item?.geometry) ?? null;

    if (!feature) {
      parcelSearchElements.listStatus.textContent =
        'Flurstücksgeometrie konnte nicht geladen werden.';
      return;
    }

    parcelSearchElements.listStatus.textContent = '';
    zoomToParcelFeature(feature);
  } catch (error) {
    console.error(error);
    parcelSearchElements.listStatus.textContent =
      'Flurstücksgeometrie konnte nicht geladen werden.';
  } finally {
    updateParcelSearchButtonState();
  }
}

async function fetchDirectParcel(query) {
  const value = String(query ?? '').trim();

  if (!value) {
    throw new Error('Bitte ein Suchkennzeichen eingeben.');
  }

  const properties = [
    'gemaschl',
    'flurschl',
    'flur',
    'flstnrzae',
    'flstnrnen',
    'flstkennz'
  ];

  const shortened = value.match(/^(\d{4})-(\d+)-(\d+)(?:\/(\d+))?$/);

  if (shortened) {
    const [, gemarkung, flur, zaehler, nenner] = shortened;
    const flstkennz = toOgcParcelKey(
      gemarkung,
      flur,
      zaehler,
      nenner
    );

    const features = await fetchParcelFeatures(
      { flstkennz },
      { limit: 1, properties }
    );

    return features[0] ?? null;
  }

  if (/^DENW[A-Z0-9]+$/i.test(value)) {
    const features = await fetchParcelFeatures(
      { flurstid: value },
      { limit: 1, properties: [...properties, 'flurstid'] }
    );

    return features[0] ?? null;
  }

  if (value.length === 20) {
    const features = await fetchParcelFeatures(
      { flstkennz: value },
      { limit: 1, properties }
    );

    return features[0] ?? null;
  }

  throw new Error('Format nicht erkannt.');
}

function normalizeParcelNumericValue(value) {
  const digits = String(value ?? '').replace(/\D/g, '');
  return digits ? String(Number(digits)) : '';
}

function findCadastralDistrictByKey(shortKey) {
  const wanted = String(shortKey ?? '')
    .replace(/\D/g, '')
    .padStart(4, '0')
    .slice(-4);

  for (const [officeName, districts] of Object.entries(
    parcelSearchState.cadastralIndex ?? {}
  )) {
    for (const [districtName, district] of Object.entries(districts ?? {})) {
      const key = String(district?.schluessel ?? '')
        .replace(/\D/g, '')
        .padStart(4, '0')
        .slice(-4);

      if (key === wanted) {
        return { officeName, districtName, district };
      }
    }
  }

  return null;
}

async function syncParcelSelectorsFromFeature(feature) {
  parcelSearchState.syncingParcelSelectors = true;

  try {
    const properties = feature?.properties ?? {};
    const gemaschl = String(properties.gemaschl ?? '').replace(/\D/g, '');
    const flurschl = String(properties.flurschl ?? '').replace(/\D/g, '');

    const shortKey = gemaschl.length >= 4
      ? gemaschl.slice(-4)
      : flurschl.slice(2, 6);

    if (!shortKey) {
      return false;
    }

    const match = findCadastralDistrictByKey(shortKey);

    if (!match) {
      return false;
    }

    parcelSearchElements.officeSelect.value = match.officeName;
    handleParcelOfficeChange();

    parcelSearchElements.districtSelect.value = match.districtName;
    handleParcelDistrictChange();

    const featureFlur = normalizeParcelNumericValue(
      properties.flur ??
      (flurschl.length >= 3 ? flurschl.slice(-3) : '')
    );

    const matchingFlurOption = Array.from(
      parcelSearchElements.flurSelect.options
    ).find(
      option =>
        normalizeParcelNumericValue(option.value) === featureFlur
    );

    if (!matchingFlurOption) {
      return false;
    }

    parcelSearchElements.flurSelect.value = matchingFlurOption.value;
    await handleParcelFlurChange();

    const wantedZaehler = normalizeParcelNumericValue(properties.flstnrzae);
    const wantedNenner = normalizeParcelNumericValue(properties.flstnrnen);

    const matchingIndex = parcelSearchState.parcelFeatures.findIndex(item => {
      const itemProperties = item?.properties ?? {};

      return (
        normalizeParcelNumericValue(itemProperties.flstnrzae) ===
          wantedZaehler &&
        normalizeParcelNumericValue(itemProperties.flstnrnen) ===
          wantedNenner
      );
    });

    if (matchingIndex < 0) {
      return false;
    }

    parcelSearchElements.numberSelect.value = String(matchingIndex);
    handleParcelNumberChange();

    return true;
  } finally {
    parcelSearchState.syncingParcelSelectors = false;
  }
}

async function handleParcelDirectSearch() {
  parcelSearchElements.searchStatus.textContent = 'Flurstück wird gesucht …';
  parcelSearchElements.directSearchButton.disabled = true;
  parcelSearchElements.selectSearchButton.disabled = true;

  try {
    if (!parcelSearchState.cadastralIndex) {
      await initializeParcelSearch();
    }

    const feature = await fetchDirectParcel(
      parcelSearchElements.directInput.value
    );

    if (!feature) {
      parcelSearchElements.searchStatus.textContent =
        'Kein Flurstück gefunden.';
      return;
    }

    const synchronized = await syncParcelSelectorsFromFeature(feature);

    if (!synchronized) {
      parcelSearchElements.searchStatus.textContent =
        'Flurstück gefunden, die Auswahllisten konnten aber nicht vollständig gesetzt werden.';
      return;
    }

    parcelSearchElements.searchStatus.textContent = 'Flurstück gefunden.';
    updateParcelSearchButtonState();
  } catch (error) {
    console.error(error);
    parcelSearchElements.searchStatus.textContent =
      error?.message ?? 'Flurstück konnte nicht gesucht werden.';
  } finally {
    parcelSearchElements.directSearchButton.disabled = false;
  }
}

parcelSearchElements.button.addEventListener('click', openParcelSearch);

parcelSearchElements.officeSelect.addEventListener('change', () => {
  clearParcelDirectSearchOnManualSelection();
  handleParcelOfficeChange();
});

parcelSearchElements.districtSelect.addEventListener('change', () => {
  clearParcelDirectSearchOnManualSelection();
  handleParcelDistrictChange();
});

parcelSearchElements.flurSelect.addEventListener('change', () => {
  clearParcelDirectSearchOnManualSelection();
  handleParcelFlurChange();
});

parcelSearchElements.numberSelect.addEventListener('change', () => {
  clearParcelDirectSearchOnManualSelection();
  handleParcelNumberChange();
});

parcelSearchElements.selectSearchButton.addEventListener(
  'click',
  searchSelectedParcel
);

parcelSearchElements.directSearchButton.addEventListener(
  'click',
  handleParcelDirectSearch
);

parcelSearchElements.directInput.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    event.preventDefault();
    handleParcelDirectSearch();
  }
});

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
  document.getElementById("myNav").style.background = "rgba(0,0,0, 0.0)";
});
slider_1.addEventListener('pointerup', function () {
  document.getElementById("myNav").style.background = "";
});
slider_2.addEventListener('pointerdown', function () {
  document.getElementById("myNav").style.background = "rgba(0,0,0, 0.0)";
});
slider_2.addEventListener('pointerup', function () {
  document.getElementById("myNav").style.background = "";
});
slider_3.addEventListener('pointerdown', function () {
  document.getElementById("myNav").style.background = "rgba(0,0,0, 0.0)";
});
slider_3.addEventListener('pointerup', function () {
  document.getElementById("myNav").style.background = "";
});
slider_4.addEventListener('pointerdown', function () {
  document.getElementById("myNav").style.background = "rgba(0,0,0, 0.0)";
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
  const panel = document.getElementById('myNav');
  const isOpen = panel.classList.toggle('open');

  panel.setAttribute('aria-hidden', String(!isOpen));
};

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

// update the crosshair colour
window.changeCrosshair = function changeCrosshair(colour) {
  settings.ch = colour;
  updateURLSearchParams();

  const imageSource = `./img/cross_${colour}.png`;

  document.getElementById('cross_1').src = imageSource;
  document.getElementById('cross_2').src = imageSource;
  document.getElementById('cross_3').src = imageSource;
  document.getElementById('cross_4').src = imageSource;

  document.querySelectorAll('.crosshair-option').forEach((option) => {
    option.classList.toggle(
      'active',
      option.dataset.colour === colour
    );
  });
};

// select the crosshair colour
document.querySelectorAll('.crosshair-option').forEach((button) => {
  button.addEventListener('click', function () {
    changeCrosshair(this.dataset.colour);
  });
});

// set the initial crosshair colour
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

  // only show settings for visible maps
  mapInstances.forEach((_, index) => {
    const settingsCard = document.getElementById(`menu_map_${index + 1}`);

    if (settingsCard) {
      settingsCard.hidden = index >= mapNumber;
    }
  });

  // arrange map containers
  mapElements.forEach((element, index) => {
    const mapLayout = layout.maps[index];

    element.style.width = mapLayout.width;
    element.style.height = mapLayout.height;
    element.style.top = mapLayout.top ?? '0';
    element.style.left = mapLayout.left ?? '0';
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

  // position crosshairs
  crossElements.forEach((element, index) => {
    const crossLayout = layout.crosses[index];

    element.style.display = crossLayout.visible ? '' : 'none';

    if (crossLayout.visible) {
      element.style.top = crossLayout.top;
      element.style.left = crossLayout.left;
    }
  });

  // only show measuring tools when view is limited to the primary map
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

  // resize maps after changing their containers
  requestAnimationFrame(() => {
    mapInstances.forEach((map) => map.resize());
  });

  // update the map count selector
  const mapCountSelect = document.getElementById('map-count-select');

  if (mapCountSelect) {
    mapCountSelect.value = String(mapNumber);
  }

  settings.mc = mapNumber;
  updateURLSearchParams();
};

// change the number of visible maps
const mapCountSelect = document.getElementById('map-count-select');

mapCountSelect.addEventListener('change', function () {
  setMapNumber(Number(this.value));
});

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