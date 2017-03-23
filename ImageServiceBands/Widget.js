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
    first: true,

    postCreate: function() {
      
    },

    startup: function() {
      if(!this.config.userAddUrl){
        dom.byId("url_div").style.display = "none";
        dom.byId("bands_div").style.display = "block";
        this.addLayer(this.config.urlService);
      }else{
        dom.byId("url_div").style.display = "block";
        dom.byId("bands_div").style.display = "none";
        var btnAddlayer = dom.byId("addLayer");
        var widget = this;
        btnAddlayer.onclick = function(){
          widget.addLayer(dom.byId("urlText").value);
        };
      };  
    },

    addLayer:function(urlService){
      dom.byId("url_div").style.display = "none";
      dom.byId("bands_div").style.display = "block";
      this.setUpLayer(urlService);
    },

    setUpLayer: function(urlService){
      this.layer = new ArcGISImageServiceLayer(urlService);

      var r = dom.byId("red");
      var g = dom.byId("green");
      var b = dom.byId("blue");
      this.map.addLayer(this.layer);

      var widget = this;
      var map = this.map;

      this.map.on("layer-add", function(){
        var center = widget.layer.fullExtent.getCenter();
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

        
        widget.layer.getKeyProperties().then(function(response){
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
            if(name == "undefined"){
              name = i;
            }
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

        this.layer.setBandIds([r,g,b]);
        
    },

    onOpen: function(){
      if(!this.first){
        this.layer.setVisibility(true);
        this.first = false;
      }
      //this.apply();
    },

    onClose: function(){
      if(this.config.hideLayer){
        this.layer.setVisibility(false);
      }
    }

    
  });
});