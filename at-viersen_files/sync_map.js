/*    
The following code is from https://github.com/mapbox/mapbox-gl-sync-move
    
Copyright (c) 2016, Mapbox

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/

function moveToMapPosition(o, n) {
    var t = o.getCenter()
      , i = o.getZoom()
      , e = o.getBearing()
      , f = o.getPitch();
    n.forEach(function(o) {
        o.jumpTo({
            center: t,
            zoom: i,
            bearing: e,
            pitch: f
        })
    })
}
function syncMaps() {
    var i, o = arguments.length;
    if (1 === o)
        i = arguments[0];
    else {
        i = [];
        for (var n = 0; n < o; n++)
            i.push(arguments[n])
    }
    var e = [];
    function f() {
        i.forEach(function(o, n) {
            o.on("move", e[n])
        })
    }
    i.forEach(function(o, t) {
        e[t] = function(o, n) {
            i.forEach(function(o, n) {
                o.off("move", e[n])
            }),
            moveToMapPosition(o, n),
            f()
        }
        .bind(null, o, i.filter(function(o, n) {
            return n !== t
        }))
    }),
    f()
}