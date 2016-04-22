var Risk = {};
Risk.Model = {};
Risk.View = {};

var pendingLink = null;

Risk.Model.Territory = Backbone.Model.extend({
    idAttribute: '_id',
    defaults: {
      name: '',
      color: [0,0,0],
      shade: 1,
      path: ''
    },
    url: function() {
      return '/territory/'+ (this.isNew() ? '' : this.id +'/');
    }
  });

Risk.Model.Link = Backbone.Model.extend({
    idAttribute: '_id',
    defaults: {
      name: '',
      map: '',
      territories: []
    },
    url: function() {
      return '/link/' + (this.isNew() ? '' : this.id +'/');
    }
  });

Risk.Model.Map = Backbone.Model.extend({
    idAttribute: '_id',
    defaults: {
      name: '',
      territories: []
    },
    url: function() {
      return '/map/'+ (this.isNew() ? '' : this.id +'/');
    }
  });

Risk.View.Territory = Backbone.RaphaelView.extend({
      initialize: function(){
          var model = this.model;
          this.listenTo(model, "change", this.render);

          // Create raphael element from the model
          var colorModified = [];
          var color = model.get("color");
          var shade = model.get("shade");
          for(var i in color)
            colorModified[i] = Math.min(255, Math.floor(color[i] * shade));
          var colorString = 'rgb('+colorModified[0]+','+colorModified[1]+','+colorModified[2]+')';
          var path = map.canvas.path(model.get("path")).attr({fill: colorString}).attr({stroke: "rgba(0,0,0,0.25)"});

          // Set the element of the view
          this.setElement(path);
      },

      events: {
          // Any raphael event
          "click": "sayType",
          "mouseover": "inColor",
          "mouseout": "outColor"
      },

      sayType: function(evt){

      },
      createLink: function(evt){
        if(pendingLink === null)
        {
          pendingLink = new Risk.Model.Link({
            'name': this.model.get('name'),
            'map': map.model.get('_id'),
            'territories': [this.model.get('_id')]
          });
          console.log("linkA");
        }
        else {
          var name = pendingLink.get('name');
          var territories = pendingLink.get('territories');
          territories.push(this.model.get('_id'));
          pendingLink.set('territories', territories);
          pendingLink.set('name', name + '-' + this.model.get('name'));
          pendingLink.save();
          pendingLink = null;
          console.log("linkB");
        }
      },

      inColor: function(evt){
        var model = this.model;
        var colorModified = [];
        var colorStroke = [];
        var color = model.get("color");
        var shade = model.get("shade");
        for(var i = 0; i < 3; i++)
        {
          colorModified[i] = Math.min(255, Math.floor(color[i] * shade + 10));
          colorStroke[i] = Math.min(255, Math.floor(color[i] * shade - 20));
        }
        var colorString = 'rgb('+colorModified[0]+','+colorModified[1]+','+colorModified[2]+')';
        this.el.attr({fill: colorString});
        this.el.attr({stroke: colorStroke});
        this.el.attr({"stroke-width": 4});
      },

      outColor: function(evt){
        var model = this.model;
        var colorModified = [];
        var color = model.get("color");
        var shade = model.get("shade");
        for(var i = 0; i < 3; i++)
          colorModified[i] = Math.min(255, Math.floor(color[i] * shade));
        var colorString = 'rgb('+colorModified[0]+','+colorModified[1]+','+colorModified[2]+')';
        this.el.attr({fill: colorString});
        this.el.attr({stroke: "rgba(0,0,0,0.25)"});
        this.el.attr({"stroke-width": 1});
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
      var rect = this.canvas.rect(0, 0, 1024, 660);
      rect.attr("fill", "#444");
      rect.attr("stroke", "#444");
      this.territoryViews = [];

      this.model = new Risk.Model.Map({_id: "6e379d3c-3f57-4a92-ac7c-ffc0f6803b21"});
      this.listenTo(this.model, 'change', this.acquireTerritories);
      this.model.fetch();
    },
    acquireTerritories: function(event) {
      var mapTerritories = this.model.get("territories");
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
