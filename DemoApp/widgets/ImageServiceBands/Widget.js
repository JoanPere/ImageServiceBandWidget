define(['dojo/_base/declare', 
  'jimu/BaseWidget',
  'esri/layers/ArcGISImageServiceLayer',
  "esri/geometry/webMercatorUtils",
  "esri/tasks/QueryTask",
  "esri/tasks/query",
  "dojo/dom",
  'dojo/on',
  "esri/request"],
function(declare,
    BaseWidget,
    ArcGISImageServiceLayer,
    webMercatorUtils,
    QueryTask,
    Query,
    dom,
    on,
    esriRequest) {
  //To create a widget, you need to derive from BaseWidget.
  return declare([BaseWidget], {
    // DemoWidget code goes here

    //please note that this property is be set by the framework when widget is loaded.
    //templateString: template,

    baseClass: 'jimu-widget-imageServiceBands',
    layer: null,

    postCreate: function() {
      
    },

    startup: function() {
      layer = new ArcGISImageServiceLayer(this.config.urlService);

      var r = dom.byId("red");
      var g = dom.byId("green");
      var b = dom.byId("blue");
      this.map.addLayer(layer);

      var widget = this;
      var map = this.map;

      this.map.on("layer-add", function(){
        var center = layer.fullExtent.getCenter();
        if (webMercatorUtils.canProject(center, map)) {
          result = webMercatorUtils.project(center, map);
          map.centerAndZoom(result, 7);
        } else{
          var task = new QueryTask(widget.config.urlService);
          var query = new Query();
          query.outSpatialReference=map.spatialReference;
          query.where = "1 = 1";
          query.returnGeometry = true;
          task.execute(query,function(result){
            var geom = result.features[0].geometry.getCentroid();
            map.centerAndZoom(geom, 7);
          });
        }

        
        layer.getKeyProperties().then(function(response){
        var bndProperties =   response.BandProperties;
        var id;
        for (var i = 0; i<bndProperties.length; i++) {
            var optr = document.createElement("option");
            var optg = document.createElement("option");
            var optb = document.createElement("option");
            optr.value = i;
            optg.value = i;
            optb.value = i;

            var name = bndProperties[i].BandName;
            optr.text = name;
            optg.text = name;
            optb.text = name;

            r.appendChild(optr);
            g.appendChild(optg);
            b.appendChild(optb);


            
         }
          dom.byId("apply").onclick = function(){
              widget.apply();
          };
        }, function(msg){
          alert(msg);
        });
      });
      
      

      
    },

    apply: function(){
        //obtenemos el elemento html input de la latitud
        var r = dom.byId("red").value;
        //obtenemos el elemento html input de la longitud
        var g = dom.byId("green").value;
        //obtenemos el nivel de zoom del input del html
        var b = dom.byId("blue").value;

        layer.setBandIds([r,g,b]);
        
    },

    onOpen: function(){
      layer.setVisibility(true);
      this.apply();
    },

    onClose: function(){
      if(this.config.hideLayer){
        layer.setVisibility(false);
      }
    }

    
  });
});