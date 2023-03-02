Wenn Sie eine Verwaltung aus NRW sind, binden wir auch Ihre WMS Dienste ggf. gerne hier ein:<br>
https://kreis-viersen.github.io/quattromap/<br>
Kontaktieren Sie uns dazu gerne per E-Mail unter [open@kreis-viersen.de]( mailto:open@kreis-viersen.de?subject=QuattroMap ).

# Inhaltsverzeichnis

- [QuattroMap](#quattromap)
    - [Messwerkzeuge](#messwerkzeuge)
  - [Aktuell verfügbare Dienste](#aktuell-verfügbare-dienste)
    - [Layer](#layer)
    - [Overlays](#overlays)
  - [Permalink](#permalink)
  - [Konfiguration](#konfiguration)
  - [Testen von Pull Requests](#testen-von-pull-requests)
  - [Develop](#develop)
    - [Search](#search)

# QuattroMap

[![GitHub CI status](https://github.com/kreis-viersen/quattromap/workflows/ci/badge.svg)][github-action-ci]
[![License](https://img.shields.io/badge/license-MIT-blue.svg)][license]

[github-action-ci]: https://github.com/kreis-viersen/quattromap/actions?query=workflow%3Aci
[license]:          https://tldrlegal.com/license/mit-license

<a href="https://kreis-viersen.github.io/quattromap/"><img src="./quattromap_screenshot.png"></a>

QuattroMap ist eine vom Kreis Viersen entwickelte Kartenanwendung, die vor allem die Außendiensttätigkeiten unterstützen kann.

Unter https://kreis-viersen.github.io/quattromap/ ist eine Demo des Tools von jedem internetfähigen Gerät, wie Tablet, Smartphone, Laptop und PC, erreichbar. Die Anwendung ist kompatibel mit modernen Browsern, wie Mozilla Firefox, Google Chrome, Safari. Der Microsoft Internet Explorer wird nicht unterstützt.

Mit Hilfe der Anwendung können bis zu 4 verschiedene Karten mit gleichem Kartenausschnitt gleichzeitig dargestellt werden.
Über die Schaltfläche in der linken unteren Ecke gelangt man zu den Einstellungen der Kartenfenster. Zur Auswahl der Kartenhintergründe stehen z. B.
Luftbilder, Liegenschaftskataster, geplante Gebäude oder OpenStreetMap zur Verfügung.

In den Kartenfenstern können auch Überlagerungen (Overlays) benutzt werden, um bspw. Luftbilder und geplante Gebäude übereinander zu legen.

Am rechten Bildschirmrand gibt es eine Suchfunktion (Mapbox GL Geocoder Control: https://github.com/mapbox/mapbox-gl-geocoder) sowie die Möglichkeit den Kartenausschnitt und den eigenen Standort über die Standortbestimmung des Geräts anzuzeigen (Standortbestimmung muss im Gerät eingeschaltet bzw. erlaubt sein).
Dazu gibt es dort eine Schaltfläche, um die Anwendung im Vollbild anzuzeigen. Ein Klick auf das Kompass-Symbol richtet die Karte(n) wieder nach Norden aus.

### Messwerkzeuge

Sobald nur eine Karte angezeigt wird, stehen Messwerkzeuge zur Verfügung:
- LineString: zum Messen einer Entfernung in Metern
- Polygon: zum Messen einer Fläche in Quadratmetern

Einfach das gewünschte Werkzeug auswählen, den LineString oder das Polygon auf der Karte zeichen und mit einem Klick auf den letzten Stützpunkt abschließen:

<img src="./quattromap_measurement-tools.gif" width="715">

## Aktuell verfügbare Dienste

### Layer

|Name|Art|Dienst-URL|Dienst-Layer|Lizenz|
|:---|:---|:---|:---|:---|
|**Geobasis NRW**||||
|NRW Luftbild Farbe|WMS|[URL](https://www.wms.nrw.de/geobasis/wms_nw_dop?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|nw_dop_rgb|[dl&#x2011;zero&#x2011;de/2.0](https://www.govdata.de/dl-de/zero-2-0)|
|NRW vDOP Farbe|WMS|[URL](https://www.wms.nrw.de/geobasis/wms_nw_vdop?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|nw_vdop_rgb|[dl&#x2011;zero&#x2011;de/2.0](https://www.govdata.de/dl-de/zero-2-0)|
|NRW aktuelles Satellitenbild DYMOS S2|WMS|[URL](https://www.wms.nrw.de/geobasis/wms_nw_dymos_s2?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|nw_dymos_s2_rgb|[Link](https://www.wms.nrw.de/geobasis/wms_nw_dymos_s2?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|
|NRW ALKIS FLURSTÜCKE|WMS|[URL](https://www.wms.nrw.de/geobasis/wms_nw_alkis?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|adv_alkis_flurstuecke|[dl&#x2011;zero&#x2011;de/2.0](https://www.govdata.de/dl-de/zero-2-0)|
|NRW Amtliche Basiskarte (ABK)|WMS|[URL](https://www.wms.nrw.de/geobasis/wms_nw_abk?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|WMS_NW_ABK|[dl&#x2011;zero&#x2011;de/2.0](https://www.govdata.de/dl-de/zero-2-0)|  
|NRW Alkis TN|WMS|[URL](https://www.wms.nrw.de/geobasis/wms_nw_alkis?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|adv_alkis_tatsaechliche_nutzung|[dl&#x2011;zero&#x2011;de/2.0](https://www.govdata.de/dl-de/zero-2-0)|
|NRW Schummerung|WMS|[URL](https://www.wms.nrw.de/geobasis/wms_nw_dgm-schummerung?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|nw_dgm-schummerung_pan|[dl&#x2011;zero&#x2011;de/2.0](https://www.govdata.de/dl-de/zero-2-0)|
|NRW DTK|WMS|[URL](https://www.wms.nrw.de/geobasis/wms_nw_dtk?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|nw_dtk_col|[dl&#x2011;zero&#x2011;de/2.0](https://www.govdata.de/dl-de/zero-2-0)|
|NRW NDOM|WMS|[URL](https://www.wms.nrw.de/geobasis/wms_nw_ndom?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|nw_ndom|[dl&#x2011;zero&#x2011;de/2.0](https://www.govdata.de/dl-de/zero-2-0)|
|NRW TDOM|WMS|[URL](https://www.wms.nrw.de/geobasis/wms_nw_tdom?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|nw_tdom|[dl&#x2011;zero&#x2011;de/2.0](https://www.govdata.de/dl-de/zero-2-0)|
|**OpenStreetMap**||||
|OSM Mapnik|XYZ Tiles|[URL](https://www.openstreetmap.org)||[Link](https://www.openstreetmap.org/copyright)
|**RVR**||||
|RVR Luftbild Farbe|WMS|[URL](https://geodaten.metropoleruhr.de/dop/dop?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|dop|[Link](https://www.rvr.ruhr/daten-digitales/geodaten/luftbilder/)
|**KRZN-Dienste**||||
|Kreis Viersen ALKIS|WMS|[URL](https://gdi-niederrhein-geodienste.de/flurkarte_verb_sammeldienst/service?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|FlurkarteAdV_Viersen|[dl&#x2011;zero&#x2011;de/2.0](https://www.govdata.de/dl-de/zero-2-0)|
|Stadt Krefeld ALKIS|WMS|[URL](https://gdi-niederrhein-geodienste.de/flurkarte_verb_sammeldienst/service?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|FlurkarteAdV_Krefeld|[dl&#x2011;zero&#x2011;de/2.0](https://www.govdata.de/dl-de/zero-2-0)|
|Kreis Wesel ALKIS|WMS|[URL](https://gdi-niederrhein-geodienste.de/flurkarte_verb_sammeldienst/service?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|FlurkarteAdV_Wesel|[dl&#x2011;zero&#x2011;de/2.0](https://www.govdata.de/dl-de/zero-2-0)|
|Kreis Kleve ALKIS|WMS|[URL](https://gdi-niederrhein-geodienste.de/flurkarte_verb_sammeldienst/service?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|FlurkarteAdV_Kleve|[dl&#x2011;zero&#x2011;de/2.0](https://www.govdata.de/dl-de/zero-2-0)|
|Stadt Bottrop ALKIS|WMS|[URL](https://gdi-niederrhein-geodienste.de/flurkarte_verb_sammeldienst/service?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|Flurkarte_Bottrop|[dl&#x2011;zero&#x2011;de/2.0](https://www.govdata.de/dl-de/zero-2-0)|
|Kreis Viersen ALKIS light|WMS|[URL](https://geoservices.krzn.de/security-proxy/services/wms_kvie_alkis_light?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|nutzungsarten, flurstuecke, gebaeude, lagebezeichnungen|[dl&#x2011;zero&#x2011;de/2.0](https://www.govdata.de/dl-de/zero-2-0)|
|Kreis Viersen Geplante Gebäude|WMS|[URL](https://geoservices.krzn.de/security-proxy/services/wms_kvie_geplgeb?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|kvie_geplgeb|[dl&#x2011;zero&#x2011;de/2.0](https://www.govdata.de/dl-de/zero-2-0)|
|**PDOK (NL)**||||
|NL Luftbild Farbe|WMS|[URL](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|Actueel_ortho25|[Link](https://www.pdok.nl/introductie/-/article/luchtfoto-pdok)|
|**Kreis Warendorf**||||
|Kreis Warendorf ALKIS|WMS|[URL](https://www.kreis-warendorf.de/arcgis/service2?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|alkis_lieka|[Link](https://www.kreis-warendorf.de/arcgis/service2?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|
|Kreis Warendorf ABK 1:5000|WMS|[URL](https://www.kreis-warendorf.de/arcgis/service2?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|abk5000|[Link](https://www.kreis-warendorf.de/arcgis/service2?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|
|**Kreis Steinfurt**||||
|Kreis Steinfurt ALKIS|WMS|[URL](https://gis.kreis-steinfurt.de/arcgis13/services/Geobasisdaten/Geobasisdaten_Kreissuebersichtskarte_DTK_farbe/MapServer/WMSServer?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|0|[Link](https://gis-kreis-steinfurt.opendata.arcgis.com/)|
|Kreis Steinfurt ABK|WMS|[URL](https://gis.kreis-steinfurt.de/arcgis13/services/Geobasisdaten/Geobasisdaten_ABK_farbe/MapServer/WMSServer?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|0|[Link](https://gis-kreis-steinfurt.opendata.arcgis.com/)|
|**Historische Luftbilder NRW**||||
|NRW Luftbild 1996|WMS|[URL](https://www.wms.nrw.de/geobasis/wms_nw_hist_dop?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|nw_hist_dop_1996|[dl&#x2011;zero&#x2011;de/2.0](https://www.govdata.de/dl-de/zero-2-0)|
|NRW Luftbild 1997|WMS|[URL](https://www.wms.nrw.de/geobasis/wms_nw_hist_dop?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|nw_hist_dop_1997|[dl&#x2011;zero&#x2011;de/2.0](https://www.govdata.de/dl-de/zero-2-0)|  
|NRW Luftbild 1998|WMS|[URL](https://www.wms.nrw.de/geobasis/wms_nw_hist_dop?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|nw_hist_dop_1998|[dl&#x2011;zero&#x2011;de/2.0](https://www.govdata.de/dl-de/zero-2-0)|  
|NRW Luftbild 1999|WMS|[URL](https://www.wms.nrw.de/geobasis/wms_nw_hist_dop?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|nw_hist_dop_1999|[dl&#x2011;zero&#x2011;de/2.0](https://www.govdata.de/dl-de/zero-2-0)|  
|NRW Luftbild 2000|WMS|[URL](https://www.wms.nrw.de/geobasis/wms_nw_hist_dop?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|nw_hist_dop_2000|[dl&#x2011;zero&#x2011;de/2.0](https://www.govdata.de/dl-de/zero-2-0)|  
|NRW Luftbild 2001|WMS|[URL](https://www.wms.nrw.de/geobasis/wms_nw_hist_dop?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|nw_hist_dop_2001|[dl&#x2011;zero&#x2011;de/2.0](https://www.govdata.de/dl-de/zero-2-0)|  
|NRW Luftbild 2002|WMS|[URL](https://www.wms.nrw.de/geobasis/wms_nw_hist_dop?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|nw_hist_dop_2002|[dl&#x2011;zero&#x2011;de/2.0](https://www.govdata.de/dl-de/zero-2-0)|  
|NRW Luftbild 2003|WMS|[URL](https://www.wms.nrw.de/geobasis/wms_nw_hist_dop?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|nw_hist_dop_2003|[dl&#x2011;zero&#x2011;de/2.0](https://www.govdata.de/dl-de/zero-2-0)|  
|NRW Luftbild 2004|WMS|[URL](https://www.wms.nrw.de/geobasis/wms_nw_hist_dop?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|nw_hist_dop_2004|[dl&#x2011;zero&#x2011;de/2.0](https://www.govdata.de/dl-de/zero-2-0)|  
|NRW Luftbild 2005|WMS|[URL](https://www.wms.nrw.de/geobasis/wms_nw_hist_dop?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|nw_hist_dop_2005|[dl&#x2011;zero&#x2011;de/2.0](https://www.govdata.de/dl-de/zero-2-0)|  
|NRW Luftbild 2006|WMS|[URL](https://www.wms.nrw.de/geobasis/wms_nw_hist_dop?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|nw_hist_dop_2006|[dl&#x2011;zero&#x2011;de/2.0](https://www.govdata.de/dl-de/zero-2-0)|  
|NRW Luftbild 2007|WMS|[URL](https://www.wms.nrw.de/geobasis/wms_nw_hist_dop?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|nw_hist_dop_2007|[dl&#x2011;zero&#x2011;de/2.0](https://www.govdata.de/dl-de/zero-2-0)|  
|NRW Luftbild 2008|WMS|[URL](https://www.wms.nrw.de/geobasis/wms_nw_hist_dop?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|nw_hist_dop_2008|[dl&#x2011;zero&#x2011;de/2.0](https://www.govdata.de/dl-de/zero-2-0)|  
|NRW Luftbild 2009|WMS|[URL](https://www.wms.nrw.de/geobasis/wms_nw_hist_dop?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|nw_hist_dop_2009|[dl&#x2011;zero&#x2011;de/2.0](https://www.govdata.de/dl-de/zero-2-0)|
|NRW Luftbild 2010|WMS|[URL](https://www.wms.nrw.de/geobasis/wms_nw_hist_dop?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|nw_hist_dop_2010|[dl&#x2011;zero&#x2011;de/2.0](https://www.govdata.de/dl-de/zero-2-0)|
|NRW Luftbild 2011|WMS|[URL](https://www.wms.nrw.de/geobasis/wms_nw_hist_dop?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|nw_hist_dop_2011|[dl&#x2011;zero&#x2011;de/2.0](https://www.govdata.de/dl-de/zero-2-0)|
|NRW Luftbild 2012|WMS|[URL](https://www.wms.nrw.de/geobasis/wms_nw_hist_dop?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|nw_hist_dop_2012|[dl&#x2011;zero&#x2011;de/2.0](https://www.govdata.de/dl-de/zero-2-0)|
|NRW Luftbild 2013|WMS|[URL](https://www.wms.nrw.de/geobasis/wms_nw_hist_dop?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|nw_hist_dop_2013|[dl&#x2011;zero&#x2011;de/2.0](https://www.govdata.de/dl-de/zero-2-0)|
|NRW Luftbild 2014|WMS|[URL](https://www.wms.nrw.de/geobasis/wms_nw_hist_dop?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|nw_hist_dop_2014|[dl&#x2011;zero&#x2011;de/2.0](https://www.govdata.de/dl-de/zero-2-0)|
|NRW Luftbild 2015|WMS|[URL](https://www.wms.nrw.de/geobasis/wms_nw_hist_dop?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|nw_hist_dop_2015|[dl&#x2011;zero&#x2011;de/2.0](https://www.govdata.de/dl-de/zero-2-0)|
|NRW Luftbild 2016|WMS|[URL](https://www.wms.nrw.de/geobasis/wms_nw_hist_dop?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|nw_hist_dop_2016|[dl&#x2011;zero&#x2011;de/2.0](https://www.govdata.de/dl-de/zero-2-0)|
|NRW Luftbild 2017|WMS|[URL](https://www.wms.nrw.de/geobasis/wms_nw_hist_dop?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|nw_hist_dop_2017|[dl&#x2011;zero&#x2011;de/2.0](https://www.govdata.de/dl-de/zero-2-0)|  
|NRW Luftbild 2018|WMS|[URL](https://www.wms.nrw.de/geobasis/wms_nw_hist_dop?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|nw_hist_dop_2018|[dl&#x2011;zero&#x2011;de/2.0](https://www.govdata.de/dl-de/zero-2-0)|  
|NRW Luftbild 2019|WMS|[URL](https://www.wms.nrw.de/geobasis/wms_nw_hist_dop?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|nw_hist_dop_2019|[dl&#x2011;zero&#x2011;de/2.0](https://www.govdata.de/dl-de/zero-2-0)|
|NRW Luftbild 2020|WMS|[URL](https://www.wms.nrw.de/geobasis/wms_nw_hist_dop?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|nw_hist_dop_2020|[dl&#x2011;zero&#x2011;de/2.0](https://www.govdata.de/dl-de/zero-2-0)|
|NRW Luftbild aktuell|WMS|[URL](https://www.wms.nrw.de/geobasis/wms_nw_dop?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|nw_dop_rgb|[dl&#x2011;zero&#x2011;de/2.0](https://www.govdata.de/dl-de/zero-2-0)|
|NRW vDOP|WMS|[URL](https://www.wms.nrw.de/geobasis/wms_nw_vdop?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|nw_vdop_rgb|[dl&#x2011;zero&#x2011;de/2.0](https://www.govdata.de/dl-de/zero-2-0)|


### Overlays

Zusätzlich zu den unter [Layer](https://github.com/kreis-viersen/quattromap#layer) gelisteten Diensten sind als Overlay verfügbar:

|Name|Art|Dienst-URL|Dienst-Layer|Lizenz|
|:---|:---|:---|:---|:---|
|**Geobasis NRW**||||
|NRW NDOM Metadaten|WMS|[URL](https://www.wms.nrw.de/geobasis/wms_nw_ndom?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|nw_ndom_info|[dl&#x2011;zero&#x2011;de/2.0](https://www.govdata.de/dl-de/zero-2-0)|
|NRW TDOM Metadaten|WMS|[URL](https://www.wms.nrw.de/geobasis/wms_nw_tdom?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|nw_tdom_info|[dl&#x2011;zero&#x2011;de/2.0](https://www.govdata.de/dl-de/zero-2-0)|
|NRW Luftbild Overlay|WMS|[URL](https://www.wms.nrw.de/geobasis/wms_nw_dop_overlay?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|WMS_NW_DOP_OVERLAY|[dl&#x2011;zero&#x2011;de/2.0](https://www.govdata.de/dl-de/zero-2-0)|
|NRW LINFOS|WMS|[URL](https://www.wms.nrw.de/umwelt/linfos?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|Naturschutzgebiete, Landschaftsschutzgebiet|[dl&#x2011;by&#x2011;de/2.0](https://www.govdata.de/dl-de/by-2-0)|
|**KRZN-Dienste**||||
|Klassifizierte Gewässer Kreis Viersen|WMS|[URL](https://geoservices.krzn.de/security-proxy/services/wms_verb_klassgew?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities)|kvie_klassgew|[dl&#x2011;zero&#x2011;de/2.0](https://www.govdata.de/dl-de/zero-2-0)|

## Permalink

Die URL enthält die derzeitige Einstellung der QuattroMap (Permalink). Dazu gehört die Anzahl und Einstellung der Kartenfenster inkl. Layerdefinitionen, das Kartenzentrum, die Zoomstufe und die Farbe des Gitterkreuzes (Zentrumsmarkierung). Über den Permalink können so vordefinierte Einstellungen für bestimmte Anwendungszwecke als Lesezeichen gespeichert oder weitergegeben werden. Über die Schaltfläche *Permalink in die Zwischenablage kopieren* am linken Bildschirmrand wird die derzeitige URL in die Zwischenablage kopiert und kann dann bspw. per Mail geteilt werden.

## Konfiguration

Über die [config.json](./src/config.json) können einige Standardeinstellungen der QuattroMap vorgenommen werden.

|Parameter|Erklärung|Beispiel|
|:---|:---|:---|
|"center"|Gibt die Zentrumskoordinate des Kartenfensters beim Starten an. Angabe geographisch mit Längen- und Breitenangabe in EPSG 4326.|"center": [6.391263, 51.258812]|
|"zoom"|Definiert die Zoomstufe beim Start. Wertebereich: 0 (fern) - 22 (nah)|"zoom": 16|
|"maps"|Optionale Angabe über die Anzahl der Kartenfenster. Mögliche Werte: 1, 2, 3, 4; Standardwert: 4| "maps": 2|
|"crosshair"| Optionale Definition der Fadenkreuzfarbe. Mögliche Werte: black, red, orange, yellow, green, blue, pink; Standardwert: black|"crosshair": "red"|
|"map_x": {"layer": `layername`} *Optional*: "overlay": `layername`, "overlay_opacity": `opacity-value`, }|Voreinstellung der dargestellten Dienste des Kartenfensters x (1-4) beim Starten der QuattroMap. `layer` enthält einen Namen eines Dienstes, die unter "layer" definiert sind. `overlay` enthält einen Namen eines Dienstes, der als Abdeckungslayer dient und muss nur angegeben werden, wenn ein Abdeckungslayer verwendet werden soll. `overlay_opacity` definiert die Deckkraft des Abdeckungslayers. Mögliche Werte: 0 (transparent) - 1 (opak); Standardwert: 0.5| "map_1": {"layer": "NRW Luftbild Farbe", "overlay": "NRW Schummerung", "overlay_opacity": 0.4}|
|"layer": [ .. ]|Enthält die Definitionen der wählbaren Dienste im Dropdown Menü||
|"name"|Name des Dienstes, der im Dropdown Menü und beim Klick auf den Info-Button erscheint.|"name": "NRW Alkis TN"|
|"attribution"|Attribution zur Beschreibung der verwendeten Dienste, die über den Info-Button dargestellt wird. HTML-Tags können verwendet werden.|"attribution": "Land NRW (2021) Deutschland ? Zero ? Version 2.0 (`<a target='_blank' rel='noopener noreferrer' href='https://www.govdata.de/dl-de/zero-2-0'>www.govdata.de/dl-de/zero-2-0</a>`)"|
|"url"|URL des WMS 1.3.0 Dienstes oder OpenStreetMap XYZ-Tiles|"url": "`https://www.wms.nrw.de/geobasis/wms_nw_alkis`"|
|"layer"|Darzustellende Layer des Dienstes. Mehrere Layer werden mit Komma getrennt.|"layer": "nutzungsarten,flurstuecke"|
|"format"| Abzurufendes Rasterformat (`png` oder `jpeg`) der Kacheln. Da png Transparenz ermöglicht, ist png zu empfehlen. Jedoch können nicht alle Dienste png liefern.|"format": "png"|
|"category"|Begriff zur Kategorisierung der Dienste im Dropdown-Menü.|"category": "GeoBasis NRW"|
|"onlyOverlay"|Mit diesem optionalen Parameter lässt sich der entsprechende Dienst nur als Overlay verwenden.|"onlyOverlay": true|
|"style"|Optionaler Parameter zur Auswahl eines bestimmten Stils. Stile können von Diensten angeboten werden.|"style": "Farbe"|
|"compactAttribution"|Mit diesem optionalen Parameter lässt sich festlegen, ob die Attribution mit dem Layernamen bei Auswahl des Layers ausgeklappt (`false`) oder eingeklappt ist (`true` = Standardwert).|"compactAttribution": "false"|

## Develop

```bash
# clone the repository
git clone https://github.com/kreis-viersen/quattromap/
cd quattromap
```
Install the deps, start the dev server and open the web browser on `http://localhost:8080/`.

```bash
# install dependencies
npm install
# start dev server
npm start
```

The build process will watch for changes to the filesystem, rebuild and autoreload QuattroMap. However note this from the [webpack-dev-server docs](https://webpack.js.org/configuration/dev-server/):

> webpack uses the file system to get notified of file changes. In some cases this does not work. For example, when using Network File System (NFS). Vagrant also has a lot of problems with this. In these cases, use polling. ([snippet source](https://webpack.js.org/configuration/dev-server/#devserverwatchoptions-))

```bash
# build the app
npm run build
```
Once the build is finished, you'll find it at `dist/`.

```bash
# publish files to a gh-pages branch on GitHub
npm run deploy
```

### Search

For the search functionality https://github.com/mapbox/mapbox-gl-geocoder is used.

For your own QuattroMap please use your own access token:
https://docs.mapbox.com/help/how-mapbox-works/access-tokens/.
