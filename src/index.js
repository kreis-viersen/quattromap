import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import './style.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import 'mapbox-gl/dist/mapbox-gl.css';

var syncMaps = require('@mapbox/mapbox-gl-sync-move');


// Access Token:
mapboxgl.accessToken = 'pk.eyJ1IjoidHR2aWUiLCJhIjoiY2pzeWtpbnlmMTQ2bDQ0cHBmMG83cDc2cCJ9.PbFiXjCzENBncs0mErVLHQ';

// Vorprüfungen:
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

// Voreinstellung der dargestellten Layer:
var layer_id_1 = "nw_dop_rgb";
var layer_id_2 = "osm_mapnik";
var layer_id_3 = "krzn_vie_alkis_light";
var layer_id_4 = "nw_dtk";

var overlay_id_1 = "";
var overlay_id_2 = "";
var overlay_id_3 = "ol_krzn_vie_geplgeb";
var overlay_id_4 = "";

// Ansteuerung der Deckkraft-Einstellung für die Overlays:
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

// Initialisierung der Kartenfenster:
var default_style = {
  version: 8,
  name: "default_style",
  metadata: {},
  sources: {},
  glyphs: "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
  layers: []
};
var default_center = [6.39333, 51.25321];
var default_zoom = 13;
var map_1 = new mapboxgl.Map({
  container: "map_1",
  style: default_style,
  zoom: default_zoom,
  center: default_center,
  pitchWithRotate: false,
  attributionControl: false
}).addControl(new mapboxgl.AttributionControl({
  compact: true
}));
var map_2 = new mapboxgl.Map({
  container: "map_2",
  style: default_style,
  zoom: default_zoom,
  center: default_center,
  pitchWithRotate: false,
  attributionControl: false
}).addControl(new mapboxgl.AttributionControl({
  compact: true
}));
var map_3 = new mapboxgl.Map({
  container: "map_3",
  style: default_style,
  zoom: default_zoom,
  center: default_center,
  pitchWithRotate: false,
  attributionControl: false
}).addControl(new mapboxgl.AttributionControl({
  compact: true
}));
var map_4 = new mapboxgl.Map({
  container: "map_4",
  style: default_style,
  zoom: default_zoom,
  center: default_center,
  pitchWithRotate: false,
  attributionControl: false
}).addControl(new mapboxgl.AttributionControl({
  compact: true
}));

map_1.on("load", function() {
  // Basiskarte:
  map_1.addLayer(getPredefinedLayer(layer_id_1)),
    // Overlays:
    map_1.addLayer(getPredefinedLayer("ol_nw_dop_rgb")),
    map_1.addLayer(getPredefinedLayer("ol_nw_dop_overlay")),
    map_1.addLayer(getPredefinedLayer("ol_nw_vdop_rgb")),
    map_1.addLayer(getPredefinedLayer("ol_nw_alkis_flurstuecke")),
    map_1.addLayer(getPredefinedLayer("ol_nw_abk_stern")),
    map_1.addLayer(getPredefinedLayer("ol_nw_alkis_tn")),
    map_1.addLayer(getPredefinedLayer("ol_nw_schummerung")),
    map_1.addLayer(getPredefinedLayer("ol_nw_dtk")),
    map_1.addLayer(getPredefinedLayer("ol_nw_linfos")),
    map_1.addLayer(getPredefinedLayer("ol_osm_mapnik")),
    map_1.addLayer(getPredefinedLayer("ol_rvr_dop")),
    map_1.addLayer(getPredefinedLayer("ol_krzn_vie_alkis_light")),
    map_1.addLayer(getPredefinedLayer("ol_krzn_kre_alkis_light")),
    map_1.addLayer(getPredefinedLayer("ol_krzn_wes_alkis_light")),
    map_1.addLayer(getPredefinedLayer("ol_krzn_kle_alkis_light")),
    map_1.addLayer(getPredefinedLayer("ol_krzn_vie_geplgeb")),
    map_1.addLayer(getPredefinedLayer("ol_Actueel_ortho25")),
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
        "icon-image": "",
        "text-field": "{title}",
        "text-offset": [0, 0.6],
        "text-size": 30,
        "text-justify": "center",
        "text-anchor": "center"
      },
      "paint": {
        "text-color": "#ffb200",
        "text-halo-color": "#FFFFFF",
        "text-halo-width": 5,
        "text-halo-blur": 3
      }
    })
});
map_2.on("load", function() {
  // Basiskarte:
  map_2.addLayer(getPredefinedLayer(layer_id_2)),
    // Overlays:
    map_2.addLayer(getPredefinedLayer("ol_nw_dop_rgb")),
    map_2.addLayer(getPredefinedLayer("ol_nw_dop_overlay")),
    map_2.addLayer(getPredefinedLayer("ol_nw_vdop_rgb")),
    map_2.addLayer(getPredefinedLayer("ol_nw_alkis_flurstuecke")),
    map_2.addLayer(getPredefinedLayer("ol_nw_abk_stern")),
    map_2.addLayer(getPredefinedLayer("ol_nw_alkis_tn")),
    map_2.addLayer(getPredefinedLayer("ol_nw_schummerung")),
    map_2.addLayer(getPredefinedLayer("ol_nw_dtk")),
    map_2.addLayer(getPredefinedLayer("ol_nw_linfos")),
    map_2.addLayer(getPredefinedLayer("ol_osm_mapnik")),
    map_2.addLayer(getPredefinedLayer("ol_rvr_dop")),
    map_2.addLayer(getPredefinedLayer("ol_krzn_vie_alkis_light")),
    map_2.addLayer(getPredefinedLayer("ol_krzn_kre_alkis_light")),
    map_2.addLayer(getPredefinedLayer("ol_krzn_wes_alkis_light")),
    map_2.addLayer(getPredefinedLayer("ol_krzn_kle_alkis_light")),
    map_2.addLayer(getPredefinedLayer("ol_krzn_vie_geplgeb")),
    map_2.addLayer(getPredefinedLayer("ol_Actueel_ortho25"))
});
map_3.on("load", function() {
  // Basiskarte:
  map_3.addLayer(getPredefinedLayer(layer_id_3)),
    // Overlays:
    map_3.addLayer(getPredefinedLayer("ol_nw_dop_rgb")),
    map_3.addLayer(getPredefinedLayer("ol_nw_dop_overlay")),
    map_3.addLayer(getPredefinedLayer("ol_nw_vdop_rgb")),
    map_3.addLayer(getPredefinedLayer("ol_nw_alkis_flurstuecke")),
    map_3.addLayer(getPredefinedLayer("ol_nw_abk_stern")),
    map_3.addLayer(getPredefinedLayer("ol_nw_alkis_tn")),
    map_3.addLayer(getPredefinedLayer("ol_nw_schummerung")),
    map_3.addLayer(getPredefinedLayer("ol_nw_dtk")),
    map_3.addLayer(getPredefinedLayer("ol_nw_linfos")),
    map_3.addLayer(getPredefinedLayer("ol_osm_mapnik")),
    map_3.addLayer(getPredefinedLayer("ol_rvr_dop")),
    map_3.addLayer(getPredefinedLayer("ol_krzn_vie_alkis_light")),
    map_3.addLayer(getPredefinedLayer("ol_krzn_kre_alkis_light")),
    map_3.addLayer(getPredefinedLayer("ol_krzn_wes_alkis_light")),
    map_3.addLayer(getPredefinedLayer("ol_krzn_kle_alkis_light")),
    map_3.addLayer(getPredefinedLayer("ol_krzn_vie_geplgeb")),
    map_3.addLayer(getPredefinedLayer("ol_Actueel_ortho25")),
    setOverlay3(ol_krzn_vie_geplgeb)
});
map_4.on("load", function() {
  // Basiskarte:
  map_4.addLayer(getPredefinedLayer(layer_id_4)),
    // Overlays:
    map_4.addLayer(getPredefinedLayer("ol_nw_dop_rgb")),
    map_4.addLayer(getPredefinedLayer("ol_nw_dop_overlay")),
    map_4.addLayer(getPredefinedLayer("ol_nw_vdop_rgb")),
    map_4.addLayer(getPredefinedLayer("ol_nw_alkis_flurstuecke")),
    map_4.addLayer(getPredefinedLayer("ol_nw_abk_stern")),
    map_4.addLayer(getPredefinedLayer("ol_nw_alkis_tn")),
    map_4.addLayer(getPredefinedLayer("ol_nw_schummerung")),
    map_4.addLayer(getPredefinedLayer("ol_nw_dtk")),
    map_4.addLayer(getPredefinedLayer("ol_nw_linfos")),
    map_4.addLayer(getPredefinedLayer("ol_osm_mapnik")),
    map_4.addLayer(getPredefinedLayer("ol_rvr_dop")),
    map_4.addLayer(getPredefinedLayer("ol_krzn_vie_alkis_light")),
    map_4.addLayer(getPredefinedLayer("ol_krzn_kre_alkis_light")),
    map_4.addLayer(getPredefinedLayer("ol_krzn_wes_alkis_light")),
    map_4.addLayer(getPredefinedLayer("ol_krzn_kle_alkis_light")),
    map_4.addLayer(getPredefinedLayer("ol_krzn_vie_geplgeb")),
    map_4.addLayer(getPredefinedLayer("ol_Actueel_ortho25"))
});

// Kartenfenster synchronisieren:
syncMaps(map_1, map_3, map_2, map_4);

// Weitere Controls hinzufügen:
map_1.addControl(new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl
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
  mapboxgl: mapboxgl
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
  mapboxgl: mapboxgl
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

// Sichtbarkeit der Map Controls initial festlegen:
document.getElementsByClassName("mapboxgl-ctrl-top-right")[0].style.display = "none"; // Karte 1: Controls
document.getElementsByClassName("mapboxgl-ctrl-top-right")[1].style.display = ""; // Karte 2: Controls
document.getElementsByClassName("mapboxgl-ctrl-top-right")[2].style.display = "none"; // Karte 3: Controls

// Steuerung der Deckkraft-Regler für die Overlays:
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

// Ausblenden des Menüs bei Betätigung der Deckkraft-Regler:
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




/*
	Liste: Verfügbare Basis-Layer

	Format der einzutragenden Layer:
	var LAYER_ID = {
	id:"LAYER_ID",
	type:"raster",
	source:{
		type:"raster",
		attribution:"attribution string"
		tiles:["WMS_BASIS_URL?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=WMS_LAYERS"],
		tileSize:256},
	paint:{}};

*/

// NRW-Dienste
var nw_dop_rgb = {
  id: "nw_dop_rgb",
  type: "raster",
  source: {
    type: "raster",
    attribution: "<b>NRW Luftbild Farbe</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
    tiles: ["https://www.wms.nrw.de/geobasis/wms_nw_dop?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=nw_dop_rgb"],
    tileSize: 256
  },
  paint: {}
};
var nw_vdop_rgb = {
  id: "nw_vdop_rgb",
  type: "raster",
  source: {
    type: "raster",
    attribution: "<b>NRW vDOP Farbe</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
    tiles: ["https://www.wms.nrw.de/geobasis/wms_nw_vdop?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=nw_vdop_rgb"],
    tileSize: 256
  },
  paint: {}
};
var nw_alkis_flurstuecke = {
  id: "nw_alkis_flurstuecke",
  type: "raster",
  source: {
    type: "raster",
    attribution: "<b>NRW ALKIS Flurstücke</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
    tiles: ["https://www.wms.nrw.de/geobasis/wms_nw_alkis?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=adv_alkis_flurstuecke"],
    tileSize: 256
  },
  paint: {}
};
var nw_abk_stern = {
  id: "nw_abk_stern",
  type: "raster",
  source: {
    type: "raster",
    attribution: "<b>NRW Amtliche Basiskarte (ABK*)</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
    tiles: ["https://www.wms.nrw.de/geobasis/wms_nw_abk_stern?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=WMS_NW_ABK_STERN"],
    tileSize: 256
  },
  paint: {}
};
var nw_alkis_tn = {
  id: "nw_alkis_tn",
  type: "raster",
  source: {
    type: "raster",
    attribution: "<b>NRW ALKIS TN</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
    tiles: ["https://www.wms.nrw.de/geobasis/wms_nw_alkis?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=adv_alkis_tatsaechliche_nutzung"],
    tileSize: 256
  },
  paint: {}
};
var nw_schummerung = {
  id: "nw_schummerung",
  type: "raster",
  source: {
    type: "raster",
    attribution: "<b>NRW Schummerung</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
    tiles: ["https://www.wms.nrw.de/geobasis/wms_nw_dgm-schummerung?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=nw_dgm-schummerung_pan"],
    tileSize: 256
  },
  paint: {}
};
var nw_dtk = {
  id: "nw_dtk",
  type: "raster",
  source: {
    type: "raster",
    attribution: "<b>NRW DTK</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
    tiles: ["https://www.wms.nrw.de/geobasis/wms_nw_dtk?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=nw_dtk_col"],
    tileSize: 256
  },
  paint: {}
};

// OSM-Dienste:
var osm_mapnik = {
  id: "osm_mapnik",
  type: "raster",
  source: {
    type: "raster",
    attribution: "<b>OpenStreetMap</b> &copy; <a target='_blank' rel='noopener noreferrer' href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>-Mitwirkende",
    tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
    tileSize: 256
  },
  paint: {}
};

// RVR-Dienste:
var rvr_dop = {
  id: "rvr_dop",
  type: "raster",
  source: {
    type: "raster",
    attribution: "<b>RVR Luftbild Farbe</b> &copy; <a target='_blank' rel='noopener noreferrer' href='https://www.rvr.ruhr/daten-digitales/geodaten/luftbilder/'>Regionalverband Ruhr</a>",
    tiles: ["https://geodaten.metropoleruhr.de/dop/dop?language=ger&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX={bbox-epsg-3857}&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=dop&STYLES=&FORMAT=image/png"],
    tileSize: 256
  },
  paint: {}
};

// KRZN-Dienste
var krzn_vie_alkis_light = {
  id: "krzn_vie_alkis_light",
  type: "raster",
  source: {
    type: "raster",
    attribution: "<b>Kreis Viersen ALKIS light</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
    tiles: ["https://geoservices.krzn.de/security-proxy/services/wms_kvie_alkis_light?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=nutzungsarten,flurstuecke,gebaeude,lagebezeichnungen&STYLES="],
    tileSize: 256
  },
  paint: {}
};
var krzn_kre_alkis_light = {
  id: "krzn_kre_alkis_light",
  type: "raster",
  source: {
    type: "raster",
    attribution: "<b>Stadt Krefeld ALKIS light</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
    tiles: ["https://geoservices.krzn.de/security-proxy/services/wms_skre_alkis_light?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=nutzungsarten,flurstuecke,gebaeude,lagebezeichnungen&STYLES="],
    tileSize: 256
  },
  paint: {}
};
var krzn_wes_alkis_light = {
  id: "krzn_wes_alkis_light",
  type: "raster",
  source: {
    type: "raster",
    attribution: "<b>Kreis Wesel ALKIS light</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
    tiles: ["https://geoservices.krzn.de/security-proxy/services/wms_kwes_alkis_light?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=nutzungsarten,flurstuecke,gebaeude,lagebezeichnungen&STYLES="],
    tileSize: 256
  },
  paint: {}
};
var krzn_kle_alkis_light = {
  id: "krzn_kle_alkis_light",
  type: "raster",
  source: {
    type: "raster",
    attribution: "<b>Kreis Kleve ALKIS light</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
    tiles: ["https://geoservices.krzn.de/security-proxy/services/wms_kkle_alkis_light?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=nutzungsarten,flurstuecke,gebaeude,lagebezeichnungen&STYLES="],
    tileSize: 256
  },
  paint: {}
};
var krzn_vie_geplgeb = {
  id: "krzn_vie_geplgeb",
  type: "raster",
  source: {
    type: "raster",
    attribution: "<b>Kreis Viersen Geplante Gebäude</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
    tiles: ["https://geoservices.krzn.de/security-proxy/services/wms_kvie_geplgeb?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=kvie_geplgeb&STYLES="],
    tileSize: 256
  },
  paint: {}
};

// Nationaal-Georegister Dienste (NL)
var Actueel_ortho25 = {
  id: "Actueel_ortho25",
  type: "raster",
  source: {
    type: "raster",
    attribution: "<b>NL Luftbild Farbe</b> &copy; <a target='_blank' rel='noopener noreferrer' href='http://geodata.nationaalgeoregister.nl'>Nationaal Georegister</a>",
    tiles: ["https://geodata.nationaalgeoregister.nl/luchtfoto/rgb/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX={bbox-epsg-3857}&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=Actueel_ortho25&STYLES=&FORMAT=image/jpeg"],
    tileSize: 256
  },
  paint: {}
};



/*
	Liste: Verfügbare Overlays

	Format der einzutragenden Layer:
	var LAYER_ID = {
	id:"LAYER_ID",
	type:"raster",
	source:{
		type:"raster",
		attribution:"<br><b>Overlay: + attribution string"
		tiles:["WMS_BASIS_URL?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=WMS_LAYERS"],
		tileSize:256},
	layout:{visibility:'none'},
	paint:{}};

	Hinweis: Bei manchen Overlays empfielt es sich, den Parameter "&TRANSPARENT=true" in die URL einzubauen.

*/

// NRW-Dienste
var ol_nw_dop_rgb = {
  id: "ol_nw_dop_rgb",
  type: "raster",
  source: {
    type: "raster",
    attribution: "<br><b>Overlay: NRW Luftbild Farbe</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
    tiles: ["https://www.wms.nrw.de/geobasis/wms_nw_dop?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=nw_dop_rgb"],
    tileSize: 256
  },
  layout: {
    visibility: 'none'
  },
  paint: {}
};
var ol_nw_vdop_rgb = {
  id: "ol_nw_vdop_rgb",
  type: "raster",
  source: {
    type: "raster",
    attribution: "<br><b>Overlay: NRW vDOP Farbe</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
    tiles: ["https://www.wms.nrw.de/geobasis/wms_nw_vdop?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=nw_vdop_rgb"],
    tileSize: 256
  },
  layout: {
    visibility: 'none'
  },
  paint: {}
};
var ol_nw_alkis_flurstuecke = {
  id: "ol_nw_alkis_flurstuecke",
  type: "raster",
  source: {
    type: "raster",
    attribution: "<br><b>Overlay: NRW ALKIS Flurstücke</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
    tiles: ["https://www.wms.nrw.de/geobasis/wms_nw_alkis?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=adv_alkis_flurstuecke&STYLES=&TRANSPARENT=true"],
    tileSize: 256
  },
  layout: {
    visibility: 'none'
  },
  paint: {}
};
var ol_nw_abk_stern = {
  id: "ol_nw_abk_stern",
  type: "raster",
  source: {
    type: "raster",
    attribution: "<br><b>Overlay: NRW Amtliche Basiskarte (ABK*)</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
    tiles: ["https://www.wms.nrw.de/geobasis/wms_nw_abk_stern?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=WMS_NW_ABK_STERN&STYLES=&TRANSPARENT=true"],
    tileSize: 256
  },
  layout: {
    visibility: 'none'
  },
  paint: {}
};
var ol_nw_alkis_tn = {
  id: "ol_nw_alkis_tn",
  type: "raster",
  source: {
    type: "raster",
    attribution: "<br><b>Overlay: NRW ALKIS TN</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
    tiles: ["https://www.wms.nrw.de/geobasis/wms_nw_alkis?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=adv_alkis_tatsaechliche_nutzung&STYLES=&TRANSPARENT=true"],
    tileSize: 256
  },
  layout: {
    visibility: 'none'
  },
  paint: {}
};
var ol_nw_schummerung = {
  id: "ol_nw_schummerung",
  type: "raster",
  source: {
    type: "raster",
    attribution: "<br><b>Overlay: NRW Schummerung</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
    tiles: ["https://www.wms.nrw.de/geobasis/wms_nw_dgm-schummerung?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=nw_dgm-schummerung_pan"],
    tileSize: 256
  },
  layout: {
    visibility: 'none'
  },
  paint: {}
};
var ol_nw_dtk = {
  id: "ol_nw_dtk",
  type: "raster",
  source: {
    type: "raster",
    attribution: "<br><b>Overlay: NRW DTK</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
    tiles: ["https://www.wms.nrw.de/geobasis/wms_nw_dtk?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=nw_dtk_col&STYLES=&TRANSPARENT=true"],
    tileSize: 256
  },
  layout: {
    visibility: 'none'
  },
  paint: {}
};
var ol_nw_dop_overlay = {
  id: "ol_nw_dop_overlay",
  type: "raster",
  source: {
    type: "raster",
    attribution: "<br><b>Overlay: NRW Luftbild Overlay</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
    tiles: ["https://www.wms.nrw.de/geobasis/wms_nw_dop_overlay?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=WMS_NW_DOP_OVERLAY&STYLES=&TRANSPARENT=true"],
    tileSize: 256
  },
  layout: {
    visibility: 'none'
  },
  paint: {}
};
var ol_nw_linfos = {
  id: "ol_nw_linfos",
  type: "raster",
  source: {
    type: "raster",
    attribution: "<br><b>Overlay: NRW LINFOS</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
    tiles: ["https://www.wms.nrw.de/umwelt/linfos?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=Naturschutzgebiete,Landschaftsschutzgebiet&STYLES=&TRANSPARENT=true"],
    tileSize: 256
  },
  layout: {
    visibility: 'none'
  },
  paint: {}
};

// OSM-Dienste:
var ol_osm_mapnik = {
  id: "ol_osm_mapnik",
  type: "raster",
  source: {
    attribution: "<br><b>Overlay: OpenStreetMap</b> &copy; <a target='_blank' rel='noopener noreferrer' href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>-Mitwirkende",
    type: "raster",
    tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
    tileSize: 256
  },
  layout: {
    visibility: 'none'
  },
  paint: {}
};

// RVR-Dienste:
var ol_rvr_dop = {
  id: "ol_rvr_dop",
  type: "raster",
  source: {
    type: "raster",
    attribution: "<br><b>Overlay: RVR Luftbild Farbe</b> &copy; <a target='_blank' rel='noopener noreferrer' href='https://www.rvr.ruhr/daten-digitales/geodaten/luftbilder/'>Regionalverband Ruhr</a>",
    tiles: ["https://geodaten.metropoleruhr.de/dop/dop?language=ger&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX={bbox-epsg-3857}&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=dop&STYLES=&FORMAT=image/png"],
    tileSize: 256
  },
  layout: {
    visibility: 'none'
  },
  paint: {}
};

// KRZN-Dienste
var ol_krzn_vie_alkis_light = {
  id: "ol_krzn_vie_alkis_light",
  type: "raster",
  source: {
    type: "raster",
    attribution: "<br><b>Overlay: Kreis Viersen ALKIS light</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
    tiles: ["https://geoservices.krzn.de/security-proxy/services/wms_kvie_alkis_light?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=nutzungsarten,flurstuecke,gebaeude_oberirdisch,hausnummern,flurstuecksnummer,lagebezeichnungen,zuordnungspfeile&STYLES=&TRANSPARENT=true"],
    tileSize: 256
  },
  layout: {
    visibility: 'none'
  },
  paint: {}
};
var ol_krzn_kre_alkis_light = {
  id: "ol_krzn_kre_alkis_light",
  type: "raster",
  source: {
    type: "raster",
    attribution: "<br><b>Overlay: Stadt Krefeld ALKIS light</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
    tiles: ["https://geoservices.krzn.de/security-proxy/services/wms_skre_alkis_light?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=nutzungsarten,flurstuecke,gebaeude_oberirdisch,hausnummern,flurstuecksnummer,lagebezeichnungen,zuordnungspfeile&STYLES=&TRANSPARENT=true"],
    tileSize: 256
  },
  layout: {
    visibility: 'none'
  },
  paint: {}
};
var ol_krzn_wes_alkis_light = {
  id: "ol_krzn_wes_alkis_light",
  type: "raster",
  source: {
    type: "raster",
    attribution: "<br><b>Overlay: Kreis Wesel ALKIS light</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
    tiles: ["https://geoservices.krzn.de/security-proxy/services/wms_kwes_alkis_light?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=nutzungsarten,flurstuecke,gebaeude_oberirdisch,hausnummern,flurstuecksnummer,lagebezeichnungen,zuordnungspfeile&STYLES=&TRANSPARENT=true"],
    tileSize: 256
  },
  layout: {
    visibility: 'none'
  },
  paint: {}
};
var ol_krzn_kle_alkis_light = {
  id: "ol_krzn_kle_alkis_light",
  type: "raster",
  source: {
    type: "raster",
    attribution: "<br><b>Overlay: Kreis Kleve ALKIS light</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
    tiles: ["https://geoservices.krzn.de/security-proxy/services/wms_kkle_alkis_light?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=nutzungsarten,flurstuecke,gebaeude_oberirdisch,hausnummern,flurstuecksnummer,lagebezeichnungen,zuordnungspfeile&STYLES=&TRANSPARENT=true"],
    tileSize: 256
  },
  layout: {
    visibility: 'none'
  },
  paint: {}
};
var ol_krzn_vie_geplgeb = {
  id: "ol_krzn_vie_geplgeb",
  type: "raster",
  source: {
    type: "raster",
    attribution: "<br><b>Overlay: Kreis Viersen Geplante Gebäude</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
    tiles: ["https://geoservices.krzn.de/security-proxy/services/wms_kvie_geplgeb?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=kvie_geplgeb&STYLES=&TRANSPARENT=true"],
    tileSize: 256
  },
  layout: {
    visibility: 'none'
  },
  paint: {}
};
// Nationaal-Georegister Dienste (NL)
var ol_Actueel_ortho25 = {
  id: "ol_Actueel_ortho25",
  type: "raster",
  source: {
    type: "raster",
    attribution: "<br><b>Overlay: NL Luftbild Farbe</b> &copy; <a target='_blank' rel='noopener noreferrer' href='http://geodata.nationaalgeoregister.nl'>Nationaal Georegister</a>",
    tiles: ["https://geodata.nationaalgeoregister.nl/luchtfoto/rgb/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX={bbox-epsg-3857}&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=Actueel_ortho25&STYLES=&FORMAT=image/jpeg"],
    tileSize: 256
  },
  layout: {
    visibility: 'none'
  },
  paint: {}
};


/*
	Layerliste IDs

	Hier alle Layer-IDs eintragen. Auf Anführungszeichen ist zu achten.

	Format:
	"LAYER_ID": LAYER_ID,

*/

var layers = {
  // Layer
  "nw_dop_rgb": nw_dop_rgb,
  "nw_vdop_rgb": nw_vdop_rgb,
  "nw_dtk": nw_dtk,
  "nw_alkis_flurstuecke": nw_alkis_flurstuecke,
  "nw_abk_stern": nw_abk_stern,
  "nw_alkis_tn": nw_alkis_tn,
  "nw_schummerung": nw_schummerung,
  "osm_mapnik": osm_mapnik,
  "rvr_dop": rvr_dop,
  "krzn_vie_alkis_light": krzn_vie_alkis_light,
  "krzn_kre_alkis_light": krzn_kre_alkis_light,
  "krzn_wes_alkis_light": krzn_wes_alkis_light,
  "krzn_kle_alkis_light": krzn_kle_alkis_light,
  "krzn_vie_geplgeb": krzn_vie_geplgeb,
  "Actueel_ortho25": Actueel_ortho25,
  // Overlays
  "ol_nw_dop_rgb": ol_nw_dop_rgb,
  "ol_nw_vdop_rgb": ol_nw_vdop_rgb,
  "ol_nw_dtk": ol_nw_dtk,
  "ol_nw_dop_overlay": ol_nw_dop_overlay,
  "ol_nw_alkis_flurstuecke": ol_nw_alkis_flurstuecke,
  "ol_nw_abk_stern": ol_nw_abk_stern,
  "ol_nw_alkis_tn": ol_nw_alkis_tn,
  "ol_nw_schummerung": ol_nw_schummerung,
  "ol_nw_linfos": ol_nw_linfos,
  "ol_osm_mapnik": ol_osm_mapnik,
  "ol_rvr_dop": ol_rvr_dop,
  "ol_krzn_vie_alkis_light": ol_krzn_vie_alkis_light,
  "ol_krzn_kre_alkis_light": ol_krzn_kre_alkis_light,
  "ol_krzn_wes_alkis_light": ol_krzn_wes_alkis_light,
  "ol_krzn_kle_alkis_light": ol_krzn_kle_alkis_light,
  "ol_krzn_vie_geplgeb": ol_krzn_vie_geplgeb,
  "ol_Actueel_ortho25": ol_Actueel_ortho25
}

/*
	Funktionen zur Layer- und Overlay-Auswahl
*/

// Layer auswählen
window.getPredefinedLayer = function getPredefinedLayer(layer_id) {
  return layers[layer_id];
}

/*
	Funktionen zur Auswahl der Layer in den einzelnen Kartenfenstern
*/

// Layer im ersten Kartenfenster wechseln
window.setLayer1 = function setLayer1() {
  var layer_id = document.getElementById("form_1").value;
  map_1.removeLayer(layer_id_1);
  map_1.removeSource(layer_id_1);
  map_1.addLayer(getPredefinedLayer(layer_id), "ol_nw_dop_rgb"); // wird unter den Overlays hinzugefügt
  layer_id_1 = layer_id;
}

// Layer im zweiten Kartenfenster wechseln
window.setLayer2 = function setLayer2() {
  var layer_id = document.getElementById("form_2").value;
  map_2.removeLayer(layer_id_2);
  map_2.removeSource(layer_id_2);
  map_2.addLayer(getPredefinedLayer(layer_id), "ol_nw_dop_rgb"); // wird unter den Overlays hinzugefügt
  layer_id_2 = layer_id;
}

// Layer im dritten Kartenfenster wechseln
window.setLayer3 = function setLayer3() {
  var layer_id = document.getElementById("form_3").value;
  map_3.removeLayer(layer_id_3);
  map_3.removeSource(layer_id_3);
  map_3.addLayer(getPredefinedLayer(layer_id), "ol_nw_dop_rgb"); // wird unter den Overlays hinzugefügt
  layer_id_3 = layer_id;
}

// Layer im vierten Kartenfenster wechseln
window.setLayer4 = function setLayer4() {
  var layer_id = document.getElementById("form_4").value;
  map_4.removeLayer(layer_id_4);
  map_4.removeSource(layer_id_4);
  map_4.addLayer(getPredefinedLayer(layer_id), "ol_nw_dop_rgb"); // wird unter den Overlays hinzugefügt
  layer_id_4 = layer_id;
}

// Overlay im ersten Kartenfenster auswählen
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

// Overlay im zweiten Kartenfenster auswählen
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

// Overlay im dritten Kartenfenster auswählen
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

// Overlay im vierten Kartenfenster auswählen
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
	Funktionen des Vollbild-Menüs
*/

// Menü ein- und ausblenden
window.toggleNav = function toggleNav() {
  if (document.getElementById("myNav").style.height == "100%") {
    document.getElementById("myNav").style.height = "0%";
  } else {
    document.getElementById("myNav").style.height = "100%";
  }
}

// Linien des Menü-Buttons kreuzen
window.swapBars = function swapBars(x) {
  x.classList.toggle("change");
}

// Farbe des Fadenkreuzes ändern
window.changeCrosshair = function changeCrosshair(img_source) {
  document.getElementById('ch_dd_img').src = img_source;
  document.getElementById('cross_1').src = img_source;
  document.getElementById('cross_2').src = img_source;
  document.getElementById('cross_3').src = img_source;
  document.getElementById('cross_4').src = img_source;
  document.getElementById('ch_dropdown_content').style.display = "none";
  setTimeout("document.getElementById('ch_dropdown_content').style.display='';", 100);
}

// Anzahl der Kartenfenster auswählen
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