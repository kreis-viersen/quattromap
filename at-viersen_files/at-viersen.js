/*
	Funktionen des Vollbild-Menüs
*/

// Menü ein- und ausblenden
function toggleNav() {
	if (document.getElementById("myNav").style.height == "100%") {
		document.getElementById("myNav").style.height = "0%";
	} else {
		document.getElementById("myNav").style.height = "100%";
	}
}

// Linien des Menü-Buttons kreuzen
function swapBars(x) {
	x.classList.toggle("change");
}

// Farbe des Fadenkreuzes ändern
function changeCrosshair(img_source) {
	document.getElementById('ch_dd_img').src=img_source;
	document.getElementById('cross_1').src=img_source;
	document.getElementById('cross_2').src=img_source;
	document.getElementById('cross_3').src=img_source;
	document.getElementById('cross_4').src=img_source;
	document.getElementById('ch_dropdown_content').style.display="none";
	setTimeout("document.getElementById('ch_dropdown_content').style.display='';", 100);
}

// Anzahl der Kartenfenster auswählen
function setMapNumber(map_number) {
	switch (map_number) {
		// Ein Kartenfenster
		case 1:
			// Sichtbare Kartenfenster definieren:
			map_2.setLayoutProperty(layer_id_2, 'visibility', 'none');
			map_3.setLayoutProperty(layer_id_3, 'visibility', 'none');
			map_4.setLayoutProperty(layer_id_4, 'visibility', 'none');
			// Position und Größe der Kartenfenster anpassen
			document.getElementById("map_1").style.width  = "100%";
			document.getElementById("map_1").style.height = "100%";
			document.getElementById("map_2").style.width  = "0";
			document.getElementById("map_2").style.height = "0";
			document.getElementById("map_3").style.width  = "0";
			document.getElementById("map_3").style.height = "0";
			document.getElementById("map_4").style.width  = "0";
			document.getElementById("map_4").style.height = "0";
			// Fensterinhalt neu zeichnen um Darstellungsfehler zu vermeiden
			map_1.resize();
			map_2.resize();
			map_3.resize();
			map_4.resize();
			// Fadenkreuzpositionen und -sichtbarkeiten anpassen
			document.getElementById("cross_1").style.top  = "50%";
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
			document.getElementById("map_1").style.width  =  "50%";
			document.getElementById("map_1").style.height = "100%";
			document.getElementById("map_2").style.width  =  "50%";
			document.getElementById("map_2").style.height = "100%";
			document.getElementById("map_2").style.left   =  "50%";
			document.getElementById("map_3").style.width  = "0";
			document.getElementById("map_3").style.height = "0";
			document.getElementById("map_4").style.width  = "0";
			document.getElementById("map_4").style.height = "0";
			// Fensterinhalt neu zeichnen um Darstellungsfehler zu vermeiden
			map_1.resize();
			map_2.resize();
			map_3.resize();
			map_4.resize();
			// Fadenkreuzpositionen und -sichtbarkeiten anpassen
			document.getElementById("cross_1").style.top  = "50%";
			document.getElementById("cross_1").style.left = "25%";
			document.getElementById("cross_2").style.top  = "50%";
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
			document.getElementById("map_1").style.width  = "33.333%";
			document.getElementById("map_1").style.height = "100%";
			document.getElementById("map_2").style.width  = "33.333%";
			document.getElementById("map_2").style.height = "100%";
			document.getElementById("map_2").style.left   = "33.333%";
			document.getElementById("map_3").style.width  = "33.333%";
			document.getElementById("map_3").style.height = "100%";
			document.getElementById("map_3").style.top    = "0";
			document.getElementById("map_3").style.left   = "66.666%";
			document.getElementById("map_4").style.width  = "0";
			document.getElementById("map_4").style.height = "0";
			// Fensterinhalt neu zeichnen um Darstellungsfehler zu vermeiden
			map_1.resize();
			map_2.resize();
			map_3.resize();
			map_4.resize();
			// Fadenkreuzpositionen und -sichtbarkeiten anpassen
			document.getElementById("cross_1").style.top     = "50%";
			document.getElementById("cross_1").style.left    = "16.666%";
			document.getElementById("cross_2").style.top     = "50%";
			document.getElementById("cross_2").style.left    = "50%";
			document.getElementById("cross_3").style.top     = "50%";
			document.getElementById("cross_3").style.left    = "83.333%";
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
			document.getElementById("map_1").style.width  = "50%";
			document.getElementById("map_1").style.height = "50%";
			document.getElementById("map_2").style.width  = "50%";
			document.getElementById("map_2").style.height = "50%";
			document.getElementById("map_2").style.left   = "50%";
			document.getElementById("map_3").style.width  = "50%";
			document.getElementById("map_3").style.height = "50%";
			document.getElementById("map_3").style.top    = "";
			document.getElementById("map_3").style.bottom = "0";
			document.getElementById("map_3").style.left   = "0";
			document.getElementById("map_4").style.width  = "50%";
			document.getElementById("map_4").style.height = "50%";
			// Fensterinhalt neu zeichnen um Darstellungsfehler zu vermeiden
			map_1.resize();
			map_2.resize();
			map_3.resize();
			map_4.resize();
			// Fadenkreuzpositionen und -sichtbarkeiten anpassen
			document.getElementById("cross_1").style.top  = "25%";
			document.getElementById("cross_1").style.left = "25%";
			document.getElementById("cross_2").style.top  = "25%";
			document.getElementById("cross_2").style.left = "75%";
			document.getElementById("cross_3").style.top  = "75%";
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
			alert("ERROR: "+map_number);
	}
}


// Alle Labels zurücksetzen
function resetLabels() {
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