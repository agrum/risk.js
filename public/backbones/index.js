var Risk = {};
Risk.Model = {};
Risk.View = {};

Risk.Model.Territory = Backbone.Model.extend({
    idAttribute: '_id',
    defaults: {
      name: '',
      color: '',
      path: ''
    },
    url: function() {
      return '/territory/' + this.id;
    }
  });

Risk.Model.Map = Backbone.Model.extend({
    idAttribute: '_id',
    defaults: {
      name: '',
      territories: []
    },
    url: function() {
      return '/map/' + this.id;
    }
  });

Risk.View.Territory = Backbone.RaphaelView.extend({
      initialize: function(){
          var model = this.model;
          this.listenTo(model, "change", this.render);

          // Create raphael element from the model
          var color = model.get("color");
          color = (color !== '') ? color : "#f00";
          var path = map.canvas.path(model.get("path")).attr({fill: color}).attr({stroke: "rgba(0,0,0,0.25)"});

          // Set the element of the view
          this.setElement(path);
      },

      events: {
          // Any raphael event
          "click": "sayType"
      },

      sayType: function(evt){
          console.log(this.model.get("name"));
      },

      render: function(){
          var path = this.el;
          var model = this.model;
      }

  });

Risk.View.Map = Backbone.View.extend({
    el: '#map',
    initialize: function() {// create a wrapper around native canvas element (with id="c")
      this.canvas = Raphael(0, 0, 1024, 792);
      var rect = this.canvas.rect(0, 0, 1024, 792);
      rect.attr("fill", "#444");
      rect.attr("stroke", "#444");
      this.territoryViews = [];

      this.map = new Risk.Model.Map({_id: "6e379d3c-3f57-4a92-ac7c-ffc0f6803b21"});
      this.listenTo(this.map, 'change', this.acquireTerritories);
      this.map.fetch();
    },
    acquireTerritories: function(event) {
      var mapTerritories = this.map.get("territories");
      this.territories = [];
      for(var i in mapTerritories)
      {
        var territory = new Risk.Model.Territory({_id: mapTerritories[i]});
        this.listenTo(territory, 'change', this.addTerritory);
        this.territories[mapTerritories[i]] = territory;
        territory.fetch();
      }
    },
    addTerritory: function(event) {
      this.territoryViews[event.id] = new Risk.View.Territory({model: this.territories[event.id]});
    }
  });

var map = new Risk.View.Map();
