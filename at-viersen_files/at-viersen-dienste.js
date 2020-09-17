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
	id:"nw_dop_rgb",
	type:"raster",
	source:{
		type:"raster",
		attribution: "<b>NRW Luftbild Farbe</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
		tiles:["https://www.wms.nrw.de/geobasis/wms_nw_dop?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=nw_dop_rgb"],
		tileSize:256},
	paint:{}};
var nw_vdop_rgb = {
	id:"nw_vdop_rgb",
	type:"raster",
	source:{
		type:"raster",
		attribution: "<b>NRW vDOP Farbe</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
		tiles:["https://www.wms.nrw.de/geobasis/wms_nw_vdop?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=nw_vdop_rgb"],
		tileSize:256},
	paint:{}};
var nw_alkis_flurstuecke = {
	id:"nw_alkis_flurstuecke",
	type:"raster",
	source:{
		type:"raster",
		attribution: "<b>NRW ALKIS Flurstücke</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
		tiles:["https://www.wms.nrw.de/geobasis/wms_nw_alkis?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=adv_alkis_flurstuecke"],
		tileSize:256},
	paint:{}};
var nw_abk_stern = {
	id:"nw_abk_stern",
	type:"raster",
	source:{
		type:"raster",
		attribution: "<b>NRW Amtliche Basiskarte (ABK*)</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
		tiles:["https://www.wms.nrw.de/geobasis/wms_nw_abk_stern?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=WMS_NW_ABK_STERN"],
		tileSize:256},
	paint:{}};
var nw_alkis_tn = {
	id:"nw_alkis_tn",
	type:"raster",
	source:{
		type:"raster",
		attribution: "<b>NRW ALKIS TN</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
		tiles:["https://www.wms.nrw.de/geobasis/wms_nw_alkis?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=adv_alkis_tatsaechliche_nutzung"],
		tileSize:256},
	paint:{}};
var nw_schummerung = {
	id:"nw_schummerung",
	type:"raster",
	source:{
		type:"raster",
		attribution: "<b>NRW Schummerung</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
		tiles:["https://www.wms.nrw.de/geobasis/wms_nw_dgm-schummerung?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=nw_dgm-schummerung_pan"],
		tileSize:256},
	paint:{}};
var nw_dtk = {
	id:"nw_dtk",
	type:"raster",
	source:{
		type:"raster",
		attribution: "<b>NRW DTK</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
		tiles:["https://www.wms.nrw.de/geobasis/wms_nw_dtk?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=nw_dtk_col"],
		tileSize:256},
	paint:{}};

// OSM-Dienste:
var osm_mapnik = {
	id: "osm_mapnik",
	type: "raster",
	source: {
		type: "raster",
		attribution: "<b>OpenStreetMap</b> &copy; <a target='_blank' rel='noopener noreferrer' href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>-Mitwirkende",
		tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
		tileSize:256},
	paint: {}};

// RVR-Dienste:
var rvr_dop = {
	id: "rvr_dop",
	type: "raster",
	source: {
		type: "raster",
		attribution: "<b>RVR Luftbild Farbe</b> &copy; <a target='_blank' rel='noopener noreferrer' href='https://www.rvr.ruhr/daten-digitales/geodaten/luftbilder/'>Regionalverband Ruhr</a>-Mitwirkende",
		tiles: ["http://geodaten.metropoleruhr.de:80/dop/dop?language=ger&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX={bbox-epsg-3857}&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=dop&STYLES=&FORMAT=image/png"],
		tileSize:256},
	paint: {}};

// KRZN-Dienste
var krzn_vie_alkis_light = {
	id:"krzn_vie_alkis_light",
	type:"raster",
	source:{
		type:"raster",
		attribution: "<b>Kreis Viersen ALKIS light</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
		tiles:["https://geoservices.krzn.de/security-proxy/services/wms_kvie_alkis_light?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=nutzungsarten,flurstuecke,gebaeude,lagebezeichnungen&STYLES="],
		tileSize:256},
	paint:{}};
var krzn_kre_alkis_light = {
	id:"krzn_kre_alkis_light",
	type:"raster",
	source:{
		type:"raster",
		attribution: "<b>Stadt Krefeld ALKIS light</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
		tiles:["https://geoservices.krzn.de/security-proxy/services/wms_skre_alkis_light?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=nutzungsarten,flurstuecke,gebaeude,lagebezeichnungen&STYLES="],
		tileSize:256},
	paint:{}};
var krzn_wes_alkis_light = {
	id:"krzn_wes_alkis_light",
	type:"raster",
	source:{
		type:"raster",
		attribution: "<b>Kreis Wesel ALKIS light</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
		tiles:["https://geoservices.krzn.de/security-proxy/services/wms_kwes_alkis_light?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=nutzungsarten,flurstuecke,gebaeude,lagebezeichnungen&STYLES="],
		tileSize:256},
	paint:{}};
var krzn_kle_alkis_light = {
	id:"krzn_kle_alkis_light",
	type:"raster",
	source:{
		type:"raster",
		attribution: "<b>Kreis Kleve ALKIS light</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
		tiles:["https://geoservices.krzn.de/security-proxy/services/wms_kkle_alkis_light?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=nutzungsarten,flurstuecke,gebaeude,lagebezeichnungen&STYLES="],
		tileSize:256},
	paint:{}};
var krzn_vie_geplgeb = {
	id:"krzn_vie_geplgeb",
	type:"raster",
	source:{
		type:"raster",
		attribution: "<b>Kreis Viersen Geplante Gebäude</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
		tiles:["https://geoservices.krzn.de/security-proxy/services/wms_kvie_geplgeb?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=kvie_geplgeb&STYLES="],
		tileSize:256},
	paint:{}};

// Nationaal-Georegister Dienste (NL)
var Actueel_ortho25 = {
	id:"Actueel_ortho25",
	type:"raster",
	source:{
		type:"raster",
		attribution: "<b>NL Luftbild Farbe</b> &copy; <a target='_blank' rel='noopener noreferrer' href='http://geodata.nationaalgeoregister.nl'>Nationaal Georegister</a>-Mitwirkende",
		tiles:["https://geodata.nationaalgeoregister.nl/luchtfoto/rgb/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX={bbox-epsg-3857}&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=Actueel_ortho25&STYLES=&FORMAT=image/jpeg"],
		tileSize:256},
	paint:{}};


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
	id:"ol_nw_dop_rgb",
	type:"raster",
	source:{
		type:"raster",
		attribution: "<br><b>Overlay: NRW Luftbild Farbe</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
		tiles:["https://www.wms.nrw.de/geobasis/wms_nw_dop?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=nw_dop_rgb"],
		tileSize:256},
	layout:{visibility:'none'},
	paint:{}};
var ol_nw_vdop_rgb = {
	id:"ol_nw_vdop_rgb",
	type:"raster",
	source:{
		type:"raster",
		attribution: "<br><b>Overlay: NRW vDOP Farbe</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
		tiles:["https://www.wms.nrw.de/geobasis/wms_nw_vdop?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=nw_vdop_rgb"],
		tileSize:256},
	layout:{visibility:'none'},
	paint:{}};
var ol_nw_alkis_flurstuecke = {
	id:"ol_nw_alkis_flurstuecke",
	type:"raster",
	source:{
		type:"raster",
		attribution: "<br><b>Overlay: NRW ALKIS Flurstücke</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
		tiles:["https://www.wms.nrw.de/geobasis/wms_nw_alkis?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=adv_alkis_flurstuecke&STYLES=&TRANSPARENT=true"],
		tileSize:256},
	layout:{visibility:'none'},
	paint:{}};
var ol_nw_abk_stern = {
	id:"ol_nw_abk_stern",
	type:"raster",
	source:{
		type:"raster",
		attribution: "<br><b>Overlay: NRW Amtliche Basiskarte (ABK*)</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
		tiles:["https://www.wms.nrw.de/geobasis/wms_nw_abk_stern?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=WMS_NW_ABK_STERN&STYLES=&TRANSPARENT=true"],
		tileSize:256},
	layout:{visibility:'none'},
	paint:{}};
var ol_nw_alkis_tn = {
	id:"ol_nw_alkis_tn",
	type:"raster",
	source:{
		type:"raster",
		attribution: "<br><b>Overlay: NRW ALKIS TN</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
		tiles:["https://www.wms.nrw.de/geobasis/wms_nw_alkis?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=adv_alkis_tatsaechliche_nutzung&STYLES=&TRANSPARENT=true"],
		tileSize:256},
	layout:{visibility:'none'},
	paint:{}};
var ol_nw_schummerung = {
	id:"ol_nw_schummerung",
	type:"raster",
	source:{
		type:"raster",
		attribution: "<br><b>Overlay: NRW Schummerung</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
		tiles:["https://www.wms.nrw.de/geobasis/wms_nw_dgm-schummerung?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=nw_dgm-schummerung_pan"],
		tileSize:256},
	layout:{visibility:'none'},
	paint:{}};
var ol_nw_dtk = {
	id:"ol_nw_dtk",
	type:"raster",
	source:{
		type:"raster",
		attribution: "<br><b>Overlay: NRW DTK</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
		tiles:["https://www.wms.nrw.de/geobasis/wms_nw_dtk?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=nw_dtk_col&STYLES=&TRANSPARENT=true"],
		tileSize:256},
	layout:{visibility:'none'},
	paint:{}};
var ol_nw_dop_overlay = {
	id:"ol_nw_dop_overlay",
	type:"raster",
	source:{
		type:"raster",
		attribution: "<br><b>Overlay: NRW Luftbild Overlay</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
		tiles:["https://www.wms.nrw.de/geobasis/wms_nw_dop_overlay?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=WMS_NW_DOP_OVERLAY&STYLES=&TRANSPARENT=true"],
		tileSize:256},
	layout:{visibility:'none'},
	paint:{}};
var ol_nw_linfos = {
	id:"ol_nw_linfos",
	type:"raster",
	source:{
		type:"raster",
		attribution: "<br><b>Overlay: NRW LINFOS</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
		tiles:["https://www.wms.nrw.de/umwelt/linfos?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=Naturschutzgebiete,Landschaftsschutzgebiet&STYLES=&TRANSPARENT=true"],
		tileSize:256},
	layout:{visibility:'none'},
	paint:{}};

// OSM-Dienste:
var ol_osm_mapnik = {
	id: "ol_osm_mapnik",
	type: "raster",
	source: {
		attribution: "<br><b>Overlay: OpenStreetMap</b> &copy; <a target='_blank' rel='noopener noreferrer' href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>-Mitwirkende",
		type: "raster",
		tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
		tileSize:256},
	layout:{visibility:'none'},
	paint: {}};

// RVR-Dienste:
var ol_rvr_dop = {
	id: "ol_rvr_dop",
	type: "raster",
	source: {
		type: "raster",
		attribution: "<b>Overlay: RVR Luftbild Farbe</b> &copy; <a target='_blank' rel='noopener noreferrer' href='https://www.rvr.ruhr/daten-digitales/geodaten/luftbilder/'>Regionalverband Ruhr</a>-Mitwirkende",
		tiles: ["http://geodaten.metropoleruhr.de:80/dop/dop?language=ger&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX={bbox-epsg-3857}&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=dop&STYLES=&FORMAT=image/png"],
		tileSize:256},
	layout:{visibility:'none'},
	paint: {}};

// KRZN-Dienste
var ol_krzn_vie_alkis_light = {
	id:"ol_krzn_vie_alkis_light",
	type:"raster",
	source:{
		type:"raster",
		attribution: "<b>Overlay: Kreis Viersen ALKIS light</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
		tiles:["https://geoservices.krzn.de/security-proxy/services/wms_kvie_alkis_light?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=nutzungsarten,flurstuecke,gebaeude_oberirdisch,hausnummern,flurstuecksnummer,lagebezeichnungen,zuordnungspfeile&STYLES=&TRANSPARENT=true"],
		tileSize:256},
	layout:{visibility:'none'},
	paint:{}};
var ol_krzn_kre_alkis_light = {
	id:"ol_krzn_kre_alkis_light",
	type:"raster",
	source:{
		type:"raster",
		attribution: "<b>Overlay: Stadt Krefeld ALKIS light</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
		tiles:["https://geoservices.krzn.de/security-proxy/services/wms_skre_alkis_light?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=nutzungsarten,flurstuecke,gebaeude_oberirdisch,hausnummern,flurstuecksnummer,lagebezeichnungen,zuordnungspfeile&STYLES=&TRANSPARENT=true"],
		tileSize:256},
	layout:{visibility:'none'},
	paint:{}};
var ol_krzn_wes_alkis_light = {
	id:"ol_krzn_wes_alkis_light",
	type:"raster",
	source:{
		type:"raster",
		attribution: "<b>Overlay: Kreis Wesel ALKIS light</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
		tiles:["https://geoservices.krzn.de/security-proxy/services/wms_kwes_alkis_light?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=nutzungsarten,flurstuecke,gebaeude_oberirdisch,hausnummern,flurstuecksnummer,lagebezeichnungen,zuordnungspfeile&STYLES=&TRANSPARENT=true"],
		tileSize:256},
	layout:{visibility:'none'},
	paint:{}};
var ol_krzn_kle_alkis_light = {
	id:"ol_krzn_kle_alkis_light",
	type:"raster",
	source:{
		type:"raster",
		attribution: "<br><b>Overlay: Kreis Kleve ALKIS light</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
		tiles:["https://geoservices.krzn.de/security-proxy/services/wms_kkle_alkis_light?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=nutzungsarten,flurstuecke,gebaeude_oberirdisch,hausnummern,flurstuecksnummer,lagebezeichnungen,zuordnungspfeile&STYLES=&TRANSPARENT=true"],
		tileSize:256},
	layout:{visibility:'none'},
	paint:{}};
var ol_krzn_vie_geplgeb = {
	id:"ol_krzn_vie_geplgeb",
	type:"raster",
	source:{
		type:"raster",
		attribution: "<br><b>Overlay: Kreis Viersen Geplante Gebäude</b> &copy; Land NRW (2020) Deutschland – Zero – Version 2.0 (<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>)",
		tiles:["https://geoservices.krzn.de/security-proxy/services/wms_kvie_geplgeb?BBOX={bbox-epsg-3857}&FORMAT=image/png&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=kvie_geplgeb&STYLES=&TRANSPARENT=true"],
		tileSize:256},
	layout:{visibility:'none'},
	paint:{}};
// Nationaal-Georegister Dienste (NL)
var ol_Actueel_ortho25 = {
	id:"ol_Actueel_ortho25",
	type:"raster",
	source:{
		type:"raster",
		attribution: "<br><b>Overlay: NL Luftbild Farbe</b> &copy; <a target='_blank' rel='noopener noreferrer' href='http://geodata.nationaalgeoregister.nl'>Nationaal Georegister</a>-Mitwirkende",
		tiles:["https://geodata.nationaalgeoregister.nl/luchtfoto/rgb/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX={bbox-epsg-3857}&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=Actueel_ortho25&STYLES=&FORMAT=image/jpeg"],
		tileSize:256},
	layout:{visibility:'none'},
	paint:{}};


/*
	Layerliste IDs

	Hier alle Layer-IDs eintragen. Auf Anführungszeichen ist zu achten.

	Format:
	"LAYER_ID": LAYER_ID,

*/

var layers = {
	// Layer
	"nw_dop_rgb": 					nw_dop_rgb,
	"nw_vdop_rgb": 					nw_vdop_rgb,
	"nw_dtk": 					nw_dtk,
	"nw_alkis_flurstuecke":				nw_alkis_flurstuecke,
	"nw_abk_stern":					nw_abk_stern,
	"nw_alkis_tn":					nw_alkis_tn,
	"nw_schummerung":				nw_schummerung,
	"osm_mapnik": 					osm_mapnik,
	"rvr_dop":				rvr_dop,
	"krzn_vie_alkis_light": 			krzn_vie_alkis_light,
	"krzn_kre_alkis_light": 			krzn_kre_alkis_light,
	"krzn_wes_alkis_light": 			krzn_wes_alkis_light,
	"krzn_kle_alkis_light": 			krzn_kle_alkis_light,
	"krzn_vie_geplgeb":				krzn_vie_geplgeb,
	"Actueel_ortho25":      		        Actueel_ortho25,
	// Overlays
	"ol_nw_dop_rgb": 				ol_nw_dop_rgb,
	"ol_nw_vdop_rgb": 				ol_nw_vdop_rgb,
	"ol_nw_dtk": 					ol_nw_dtk,
	"ol_nw_dop_overlay": 				ol_nw_dop_overlay,
	"ol_nw_alkis_flurstuecke":			ol_nw_alkis_flurstuecke,
	"ol_nw_abk_stern":				ol_nw_abk_stern,
	"ol_nw_alkis_tn":				ol_nw_alkis_tn,
	"ol_nw_schummerung":				ol_nw_schummerung,
	"ol_nw_linfos":					ol_nw_linfos,
	"ol_osm_mapnik": 				ol_osm_mapnik,
	"ol_rvr_dop":				ol_rvr_dop,
	"ol_krzn_vie_alkis_light": 			ol_krzn_vie_alkis_light,
	"ol_krzn_kre_alkis_light": 			ol_krzn_kre_alkis_light,
	"ol_krzn_wes_alkis_light": 			ol_krzn_wes_alkis_light,
	"ol_krzn_kle_alkis_light": 			ol_krzn_kle_alkis_light,
	"ol_krzn_vie_geplgeb":				ol_krzn_vie_geplgeb,
	"ol_Actueel_ortho25":           		ol_Actueel_ortho25
}

/*
	Funktionen zur Layer- und Overlay-Auswahl
*/

// Layer auswählen
function getPredefinedLayer(layer_id) {
	return layers[layer_id];
}

/*
	Funktionen zur Auswahl der Layer in den einzelnen Kartenfenstern
*/

// Layer im ersten Kartenfenster wechseln
function setLayer1() {
	var layer_id = document.getElementById("form_1").value;
	map_1.removeLayer(layer_id_1);
	map_1.removeSource(layer_id_1);
	map_1.addLayer(getPredefinedLayer(layer_id),"ol_nw_dop_rgb"); // wird unter den Overlays hinzugefügt
	layer_id_1 = layer_id;
}

// Layer im zweiten Kartenfenster wechseln
function setLayer2() {
	var layer_id = document.getElementById("form_2").value;
	map_2.removeLayer(layer_id_2);
	map_2.removeSource(layer_id_2);
	map_2.addLayer(getPredefinedLayer(layer_id),"ol_nw_dop_rgb"); // wird unter den Overlays hinzugefügt
	layer_id_2 = layer_id;
}

// Layer im dritten Kartenfenster wechseln
function setLayer3() {
	var layer_id = document.getElementById("form_3").value;
	map_3.removeLayer(layer_id_3);
	map_3.removeSource(layer_id_3);
	map_3.addLayer(getPredefinedLayer(layer_id),"ol_nw_dop_rgb"); // wird unter den Overlays hinzugefügt
	layer_id_3 = layer_id;
}

// Layer im vierten Kartenfenster wechseln
function setLayer4() {
	var layer_id = document.getElementById("form_4").value;
	map_4.removeLayer(layer_id_4);
	map_4.removeSource(layer_id_4);
	map_4.addLayer(getPredefinedLayer(layer_id),"ol_nw_dop_rgb"); // wird unter den Overlays hinzugefügt
	layer_id_4 = layer_id;
}

// Overlay im ersten Kartenfenster auswählen
function setOverlay1() {
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
function setOverlay2() {
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
function setOverlay3() {
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
function setOverlay4() {
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
	Funktionen für die GetFeatureRequest-Abfrage

	WICHTIG: Diese Funktionen sind noch nicht ausgereift!

*/

// Abfragbare Layer finden
function getQueryLayers(layer_id) {
	if (layer_id == "nw_dop_rgb") {return "nw_dop_utm_info"} else if (layer_id == "ol_nw_dop_rgb") {return "nw_dop_utm_info"}
	else if (layer_id == "nw_alkis_flurstuecke") {return "adv_alkis_flurstuecke"} else if (layer_id == "ol_nw_alkis_flurstuecke") {return "adv_alkis_flurstuecke"}
	else if (layer_id == "nw_abk_stern") {return "WMS_NW_ABK_STERN"} else if (layer_id == "ol_nw_abk_stern") {return "WMS_NW_ABK_STERN"}
	else if (layer_id == "nw_alkis_tn") {return "adv_alkis_tatsaechliche_nutzung"} else if (layer_id == "ol_nw_alkis_tn") {return "adv_alkis_tatsaechliche_nutzung"}
}

function getLayers(layer_id) {
	if (layer_id == "nw_dop_rgb") {return "nw_dop_utm_info"} else if (layer_id == "ol_nw_dop_rgb") {return "nw_dop_utm_info"}
	else if (layer_id == "nw_alkis_flurstuecke") {return "adv_alkis_flurstuecke"} else if (layer_id == "ol_nw_alkis_flurstuecke") {return "adv_alkis_flurstuecke"}
	else if (layer_id == "nw_abk_stern") {return "WMS_NW_ABK_STERN"} else if (layer_id == "ol_nw_abk_stern") {return "WMS_NW_ABK_STERN"}
	else if (layer_id == "nw_alkis_tn") {return "adv_alkis_tatsaechliche_nutzung"} else if (layer_id == "ol_nw_alkis_tn") {return "adv_alkis_tatsaechliche_nutzung"}
	else if (layer_id == "nw_schummerung") {return nw_schummerung;} else if (layer_id == "ol_nw_schummerung") {return ol_nw_schummerung;}
	else if (layer_id == "nw_dtk") {return nw_dtk;} else if (layer_id == "ol_nw_dtk") {return ol_nw_dtk;}
	else if (layer_id == "ol_nw_dop_overlay") {return ol_nw_dop_overlay;}
	else if (layer_id == "brw_2001") {return brw_2001;} else if (layer_id == "ol_brw_2001") {return ol_brw_2001;}
	// Historische Orthophotos:
	else if (layer_id == "nw_histortho_1988_1994") {return nw_histortho_1988_1994;}
	// Historische Luftbilder:
	else if (layer_id == "nw_hist_dop_1996") {return nw_hist_dop_1996;}
	else if (layer_id == "nw_hist_dop_1997") {return nw_hist_dop_1997;}
	else if (layer_id == "nw_hist_dop_1998") {return nw_hist_dop_1998;}
	else if (layer_id == "nw_hist_dop_1999") {return nw_hist_dop_1999;}
	else if (layer_id == "nw_hist_dop_2000") {return nw_hist_dop_2000;}
	else if (layer_id == "nw_hist_dop_2001") {return nw_hist_dop_2001;}
	else if (layer_id == "nw_hist_dop_2002") {return nw_hist_dop_2002;}
	else if (layer_id == "nw_hist_dop_2003") {return nw_hist_dop_2003;}
	else if (layer_id == "nw_hist_dop_2004") {return nw_hist_dop_2004;}
	else if (layer_id == "nw_hist_dop_2005") {return nw_hist_dop_2005;}
	else if (layer_id == "nw_hist_dop_2006") {return nw_hist_dop_2006;}
	else if (layer_id == "nw_hist_dop_2007") {return nw_hist_dop_2007;}
	else if (layer_id == "nw_hist_dop_2008") {return nw_hist_dop_2008;}
	else if (layer_id == "nw_hist_dop_2009") {return nw_hist_dop_2009;}
	else if (layer_id == "nw_hist_dop_2010") {return nw_hist_dop_2010;}
	else if (layer_id == "nw_hist_dop_2011") {return nw_hist_dop_2011;}
	else if (layer_id == "nw_hist_dop_2012") {return nw_hist_dop_2012;}
	else if (layer_id == "nw_hist_dop_2013") {return nw_hist_dop_2013;}
	else if (layer_id == "nw_hist_dop_2014") {return nw_hist_dop_2014;}
	else if (layer_id == "nw_hist_dop_2015") {return nw_hist_dop_2015;}
	// OSM-Dienste:
	else if (layer_id == "osm_mapnik") {return osm_mapnik;} else if (layer_id == "ol_osm_mapnik") {return ol_osm_mapnik;}
	else if (layer_id == "osm_mapnik_de") {return osm_mapnik_de;} else if (layer_id == "ol_osm_mapnik_de") {return ol_osm_mapnik_de;}
	// KRZN-Dienste:
	else if (layer_id == "krzn_vie_alkis_light") {return krzn_vie_alkis_light;} else if (layer_id == "ol_krzn_vie_alkis_light") {return ol_krzn_vie_alkis_light;}
	else if (layer_id == "krzn_vie_geplgeb") {return krzn_vie_geplgeb;} else if (layer_id == "ol_krzn_vie_geplgeb") {return ol_krzn_vie_geplgeb;}
	// else if (layer_id == "krzn_abk_farbe") {return krzn_abk_farbe;} else if (layer_id == "ol_krzn_abk_farbe") {return ol_krzn_abk_farbe;}
	// Fehlerbehandlung:
	else {alert("Overlay nicht gefunden: "+layer_id);}
}

/*
	GetFeatureRequest zusammenstellen
	&Layers=Bodendenkmal-Oberirdisch-Punkte
	&QUERY_LAYERS=Bodendenkmal-Oberirdisch-Punkte
*/
function createGetFeatureRequest(map_event, map, layer_id) {
	// URL-Stamm:
	var tiles = map.getSource(layer_id).tiles[0];
	var base_url = tiles.split("?")[0] + "?"
	console.log("URL-Stamm: " + base_url);
	// Grundelemente:
	var base_parameters = "SERVICE=WMS&VERSION=1.3.0&REQUEST=GetFeatureInfo&CRS=EPSG:4326&SRS=EPSG:4326&FORMAT=image/png&INFO_FORMAT=text/html&STYLES=";
	// BoundingBox:
	var bounds = map.getBounds();
	var bounds_string = "&BBOX=" + bounds._sw.lat + "," + bounds._sw.lng + "," + bounds._ne.lat + "," + bounds._ne.lng;
	console.log("BoundingBox: " + bounds_string);
	// Höhe und Breite der Karte:
	var map_height = map.getCanvas().height;
	var map_width = map.getCanvas().width;
	var height_width_string = "&HEIGHT=" + map_height + "&WIDTH=" + map_width;
	console.log("Höhe: " + map_height + ", Breite: " + map_width);
	// Klickposition:
	var click_string = "&I=" + map_event.point.x + "&J=" + map_event.point.y;
	console.log("Klick: " + click_string);
	// Layers:
	var layers_string = "&LAYERS=" + getLayers(layer_id);
	console.log("Layers: " + layers_string);
	// Query-Layers:
	var query_layers_string = "&QUERY_LAYERS=" + getQueryLayers(layer_id);
	console.log("QueryLayers: " + query_layers_string);

	// Request zusammenbauen:
	console.log("Parameter: " + base_url + base_parameters + bounds_string + height_width_string + click_string + layers_string + query_layers_string);
	var request = base_url + base_parameters + bounds_string + height_width_string + click_string + layers_string + query_layers_string;
	return request;
}

/*
	Ergebnis des GetFeatureInfo-Request abfragen
*/
function getFeatureInfoResult(map_event, map, layer_id) {
	var get_feature_request = createGetFeatureRequest(map_event, map, layer_id);
	var result =  "<a href=\"" + get_feature_request + "\" target=\"_blank\">Ergebnis ansehen</a>";
	return result;
}
