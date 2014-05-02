(function() {
    var dataviz = kendo.dataviz,
        map = dataviz.map,

        BingLayer = map.layers.BingLayer,
        Location = map.Location,

        deepExtend = kendo.deepExtend,
        Point = dataviz.geometry.Point;

    (function() {
        var map,
            layer;

        function createBingLayer(options) {
            map = new MapMock();
            layer = new BingLayer(map, options);
        }

        function setResource(res) {
            layer._success({
                resourceSets: [{
                    resources: [deepExtend({
                        imageUrl: "javascript: void(0)"
                    }, res)]
                }]
            });
        }

        // ------------------------------------------------------------
        module("Bing Layer", {
            setup: function() {
                createBingLayer();
            }
        });

        test("appends to scrollElement", function() {
            ok(layer.element.parent().is("#scroll-element"));
        });

        test("sets custom z-index", function() {
            layer = new BingLayer(map, { zIndex: 100 });
            equal(layer.element.css("zIndex"), 100);
        });

        test("renders in initial element", function() {
            var element = layer.element;

            layer.reset = function() {
                BingLayer.fn.reset.call(this);

                ok(layer._view.element.is(element));
            }

            setResource();
        });

        test("sets minZoom from metadata", function() {
            setResource({
                zoomMin: 4
            });

            equal(layer.options.minZoom, 4);
        });

        test("sets maxZoom from metadata", function() {
            setResource({
                zoomMax: 4
            });

            equal(layer.options.maxZoom, 4);
        });

        test("sets subdomains from metadata", function() {
            setResource({
                imageUrlSubdomains: ["a", "b", "c"]
            });

            deepEqual(layer._view.options.subdomains, ["a", "b", "c"]);
        });

        test("converts imageUrl to urlTemplate", function() {
            setResource({
                imageUrl: "javascript:void('{subdomain}/{quadkey}/{culture}')"
            });

            equal(layer._view.options.urlTemplate, "javascript:void('#= subdomain #/#= quadkey #/#= culture #')");
        });

    })();

    baseLayerTests("Bing Layer", BingLayer);
})();
