var Risk = {};
Risk.Model = {};
Risk.View = {};

var pendingLink = null;
var attacker = null;
var potentialDefenders = [];
var defender = null;

Risk.Model.Territory = Backbone.Model.extend({
    idAttribute: '_id',
    defaults: {
      name: '',
      color: [0,0,0],
      shade: 1,
      path: '',
      mode: '',
      hovering: false
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

Risk.View.Territory = Backbone.SnapSvgView.extend({
      initialize: function(){
          var model = this.model;
          this.listenTo(model, "change", this.render);

          // Set the element of the view
          this.setElement(map.canvas.path(model.get("path")));

          this.render();
      },

      events: {
          // Any raphael event
          "click": "selectMode",
          "mouseover": "inColor",
          "mouseout": "outColor"
      },

      selectMode: function(evt){
        if(attacker === null)
        {
          attacker = this.model;
          this.model.set('mode', 'attacker');
          var links = this.model.get('links');
          for(var i in links)
          {
            var linkedTerritories = map.links[links[i]].get('territories');
            var oppositeTerritoryId = (linkedTerritories[0] == this.model.get('_id') ? linkedTerritories[1] : linkedTerritories[0]);
            potentialDefenders.push(map.territories[oppositeTerritoryId]);
            map.territories[oppositeTerritoryId].set('mode', 'potentialDefenders');
          }
        }
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
        this.model.set('hovering', true);
      },

      outColor: function(evt){
        this.model.set('hovering', false);
      },

      render: function(){
        var model = this.model;
        var colorModified = [];
        var color = model.get("color");
        var shade = model.get("shade");
        var hovering = model.get("hovering");
        var mode = model.get("mode");
        for(var i = 0; i < 3; i++)
        {
          colorModified[i] = Math.min(255, Math.floor(color[i] * shade + (hovering ? 10 : 0)));
        }
        var colorString = 'rgb('+colorModified[0]+','+colorModified[1]+','+colorModified[2]+')';

        if(mode == 'attacker')
        {
          // Now lets create pattern
          var p = map.canvas.path("M10-5-10,15M15,0,0,15M0-5-20,15").attr({
                  fill: "none",
                  stroke: "#bada55",
                  strokeWidth: 5
              });
          // To create pattern,
          // just specify dimensions in pattern method:
          p = p.pattern(0, 0, 10, 10);
          // Then use it as a fill on big circle
          this.el.attr({
              fill: p
          });
        }
        else if(mode == 'potentialDefenders')
          this.el.attr("fill", "url('/images/potentialDefenderPattern.png')");
        else
          this.el.attr({fill: colorString});

        this.el.attr({"stroke-alignment": "inner"});
        this.el.attr({stroke: "rgba(0,0,0,0.25)"});
        if(hovering)
        {
          this.el.attr({"stroke-width": 4});
        }
        else {
          this.el.attr({"stroke-width": 1});
        }
      }

  });

Risk.View.Map = Backbone.View.extend({
    el: '#map',
    initialize: function() {// create a wrapper around native canvas element (with id="c")
      this.canvas = Snap(1024, 792);
      var rect = this.canvas.rect(0, 0, 1024, 660);
      rect.attr("fill", "#444");
      rect.attr("stroke", "#444");
      this.territoryViews = [];

      this.model = new Risk.Model.Map({_id: "6e379d3c-3f57-4a92-ac7c-ffc0f6803b21"});
      this.listenTo(this.model, 'change', this.acquireChildren);
      this.model.fetch();
    },
    acquireChildren: function(event) {
      var mapTerritories = this.model.get("territories");
      this.territories = [];
      for(var i in mapTerritories)
      {
        var territory = new Risk.Model.Territory(mapTerritories[i]);
        this.territories[mapTerritories[i]._id] = territory;
        this.territoryViews[mapTerritories[i]._id] = new Risk.View.Territory({model: territory});
      }
      var mapLinks = this.model.get("links");
      this.links = [];
      for(var iteLink in mapLinks)
      {
        var link = new Risk.Model.Link(mapLinks[iteLink]);
        this.links[mapLinks[iteLink]._id] = link;
      }
    }
  });

var map = new Risk.View.Map();
