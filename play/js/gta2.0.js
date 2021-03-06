// Generated by CoffeeScript 2.3.0
(function() {
  var gg, root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  gg = {
    ply: null,
    x: 0,
    y: 0,
    DEF: {},
    DEV: false,
    C: {
      invisible: new THREE.MeshBasicMaterial({
        visible: false
      }),
      GODMODE: false, // lmao
      PII: Math.PI * 2,
      CHUNKSPAN: 6,
      CHUNITS: 64 * 6,
      CTABLE: [[[-2, 2], [-1, 2], [0, 2], [1, 2], [2, 2]], [[-2, 1], [-1, 1], [0, 1], [1, 1], [2, 1]], [[-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0]], [[-2, -1], [-1, -1], [0, -1], [1, -1], [2, -1]], [[-2, -2], [-1, -2], [0, -2], [1, -2], [2, -2]]],
      ZOOM: {
        Z: 250,
        INTR: 260,
        MELEE: 270,
        GUN: 350,
        X: 800,
        DEAD: 250,
        PED: 300, // 375
        CAR: 500
      },
      AROUNDS: [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]
    },
    zoom: 200,
    zoomoverride: 0,
    entitypool: 0,
    walkpool: 0,
    drivepool: 0,
    parkingspacepool: 0,
    audio: {},
    ed: null,
    materials: {},
    settings: {
      hotlineCam: true,
      prefabChunks: true,
      localMaterials: false,
      simpleShading: false,
      fancyHeadlights: false
    },
    delta: 0,
    base: 0.016,
    timestep: 1,
    frame: 0,
    keys: [],
    fingers: [],
    mouse: {},
    mouse2d: {},
    mouse3d: new THREE.Vector3,
    left: false,
    right: false,
    scaling: 14,
    outside: 0, // sets to ambient
    ambient: 0xffffff,
    intrcolor: 0xe5e5e5,
    manner: {},
    net: null,
    map: null,
    world: null,
    ply: null,
    minimap: null,
    interior: null,
    walks: [],
    drives: [],
    masks: {
      none: 0x0000,
      solid: 0x0001,
      organic: 0x0002,
      items: 0x0004,
      casings: 0x0008,
      intrsolid: 0x00016,
      introrganic: 0x00032,
      intritems: 0x00064
    },
    
    // todo: ugly vars make it pretty
    mmaps: {},
    textures: {},
    water: null,
    waters: [],
    wtime: 0,
    wspeed: 0.15, // 0.07
    wsq: 0,
    EUIDS: 0,
    BIDS: 0,
    chunking: false,
    CURCHUNK: [
      -999,
      -999 // weak mushy shit
    ],
    CHUNKID: 1,
    freezeCam: false
  };

  gg.outside = gg.ambient;

  root.gg = gg;

  $(document).ready(function() {
    gg.DEV = !!$('DEV').length;
    gg.mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    document.addEventListener('touchstart', (function(e) {
      return 1;
    }), {
      passive: false
    }, false);
    document.addEventListener('touchend', (function(e) {
      return 1;
    }), false);
    document.addEventListener('touchmove', (function(e) {
      e.preventDefault();
      return 1;
    }), {
      passive: false
    }, false);
    gg.load();
    // gg.Google.plus()
    setTimeout("gg.connect()", 800);
    return true;
  });

  gg.normalize = function(a) {
    var n;
    //sweet = Math.PI*2
    //n = angle
    //n += sweet while n <= -sweet
    //n -= sweet while n > sweet
    n = a - 2 * Math.PI * Math.floor(a / (2 * Math.PI));
    return n;
  };

  gg.load = function() {
    var gravity;
    gg.loadsounds();
    gg.map = new gg.Map();
    gg.map.getNosj();
    gg.map.chunkify();
    gravity = new box2d.b2Vec2(0, 0);
    gg.world = new box2d.b2World(gravity, false);
    if (gg.ed != null) {
      gg.settings.hotlineCam = false;
    }
    gg.makepan();
    gg.boot.call(gg);
    gg.prepare();
    gg.animate();
    return true;
  };

  gg.onspawn = function() {
    var quotes;
    if (this.spawned) {
      return;
    }
    if (gg.ed != null) {
      return;
    }
    quotes = [
      '"Respect is everything" ...',
      'Is that my phone ringing? ...',
      'Where am I? ...',
      'Should I check the controls? ...',
      '"I\'m just a hunk, a hunk of burning love" ...',
      // 'The city never sleeps. ...'
      'Should I do something? ...'
    ];
    
    // these two funcs give it that hotline intro

    // gg.music()
    gg.letterbox(quotes[Math.floor(Math.random() * quotes.length)]);
    // gg.zoom = gg.C.ZOOM.PED
    this.spawned = true;
    return 1;
  };

  gg.worldstep = function() {
    gg.world.Step(1.0 / 60.0, 10, 8);
    gg.world.ClearForces();
    return true;
  };

  gg.connect = function() {
    gg.net = new gg.Net;
    return true;
  };

  gg.prepare = function() {
    var c, i, l, model, name, ref, ref1;
    gg.box = new THREE.BoxBufferGeometry(64, 64, 64);
    gg.rotateplane(gg.box, 0, 3);
    gg.rotateplane(gg.box, 1, 1);
    gg.rotateplane(gg.box, 2, 2);
    // gg.box.attributes.position.array.slice 60, 12
    gg.extraneous();
// by 1
    for (i = l = 1; l <= 12; i = ++l) {
      this.waters.push(gg.loadSty('special/water/' + i + '.bmp'));
    }
    this.water = new THREE.MeshLambertMaterial({
      map: gg.waters[0],
      color: gg.ambient
    });
    // spawn = spawns[ Math.floor Math.random() * spawns.length ]
    gg.camera.position.x = 0;
    gg.camera.position.y = 0;
    gg.arrow = new gg.Arrow;
    $.getJSON("play/config.json", function(data) {
      return gg.config = data;
    });
    $.getJSON("sons/cars.json", function(data) {
      return gg.cars = data;
    });
    $.getJSON("sons/weps.json", function(data) {
      return gg.weps = data;
    });
    $.getJSON("sons/activators.json", function(data) {
      return gg.activators = data;
    });
    ref = gg.cars;
    for (name in ref) {
      model = ref[name];
      model.name = name;
      gg.Cars.TYPES[name] = new gg.Cars(model);
    }
    if (!!~this.params.indexOf('ed')) {
      new gg.Editor;
    }
    gg.map.chunkCheck();
    
    // gg.minimap = new gg.Minimap # if gg.DEV and gg.DEF.minimap and not gg.nostat
    gg.inventory = new gg.Inventory;
    
    // gg.hud = new gg.Hud
    new gg.Tour;
    new gg.Settings;
    // gg.notice = new gg.Notice

    // setTimeout ->
    // 	gg.bubble 'Hint: Review settings if performance lacks'
    // , 15000
    if (gg.settings.prefabChunks) {
      gg.bubble(`Building ${(Object.keys(gg.map.offChunks).length)} city chunks...`);
      ref1 = gg.map.offChunks;
      for (i in ref1) {
        c = ref1[i];
        c.show(true);
      }
      gg.zoom = gg.C.ZOOM.PED;
    }
    return 1;
  };

  gg.combinations = function(n) {
	var r = [];
		for(var i = 0; i < (1 << n); i++) {
		var c = [];
		for(var j = 0; j < n; j++) {
			c.push(i & (1 << j) ? '1' : '0');  
		}
		r.push(c.join(''));
	}
	return r;  
};

  gg.extraneous = function() { // boxcutter
    var a, attr, box, cut, f, g, i, j, l, len, len1, len2, len3, m, normal, o, p, position, q, ref, ref1, ref2, uv, vars;
    gg.boxes = [];
    vars = gg.combinations(5);
    for (l = 0, len = vars.length; l < len; l++) {
      a = vars[l];
      box = gg.box.clone();
      box.gg = {
        bin: a
      };
      gg.boxes[a] = box;
      attr = box.attributes;
      attr.position.needsUpdate = true;
      attr.uv.needsUpdate = true;
      attr.normal.needsUpdate = true;
      position = Array.from(attr.position.array);
      uv = Array.from(attr.uv.array);
      normal = Array.from(attr.normal.array);
      for (i = m = 5; m >= 0; i = --m) {
        cut = !parseInt(a[i]);
        if (!cut) {
          continue;
        }
        f = gg.C.faceNames[i];
        // console.log "cutting #{f}. a[#{i}] is #{a[i]}"
        position.splice(i * 12, 12);
        uv.splice(i * 8, 8);
        normal.splice(i * 12, 12);
        attr.position.count -= 4;
        attr.uv.count -= 4;
        attr.normal.count -= 4;
        box.groups[i].rm = true;
        ref = box.groups;
        // box.groups[i].gg = f
        // @materials.splice i, 1
        for (j = o = 0, len1 = ref.length; o < len1; j = ++o) {
          g = ref[j];
          if (!(j > i)) {
            continue;
          }
          g.start -= 6;
        }
      }
      ref1 = box.groups;
      for (i = p = 0, len2 = ref1.length; p < len2; i = ++p) {
        g = ref1[i];
        // g.materialIndex -= 1
        g.gg = gg.C.faceNames[i];
      }
      box.groups = box.groups.filter(function(g) {
        return !g.rm;
      });
      ref2 = box.groups;
      for (i = q = 0, len3 = ref2.length; q < len3; i = ++q) {
        g = ref2[i];
        if ('top' === g.gg) {
          box.gg.top = i;
          break;
        }
      }
      attr.position.array = new Float32Array(position);
      attr.uv.array = new Float32Array(uv);
      attr.normal.array = new Float32Array(normal);
    }
    return 1;
  };

  gg.quake = 0;

  gg.shake = function() {
    var a, quake;
    a = Math.random() * 360;
    quake = this.quake / 2;
    if (this.quake > 0) {
      this.quake -= 0.5;
    } else {
      this.quake = 0;
    }
    this.camera.position.x += quake * Math.sin(a);
    return this.camera.position.y += quake * Math.cos(a);
  };

  // activates stuff, then calls render
  gg.animate = function() {
    var i, k, l, len, ref, zoom;
    // todo: thorough spring cleanup this subroutine holy shit
    requestAnimationFrame(this.animate.bind(this)); // `() => gg.animate()` # @animate.bind this
    this.mouseat();
    this.delta = this.clock.getDelta();
    this.timestep = this.delta / this.base;
    if (this.timestep > 10) {
      this.timestep = 1;
    }
    this.wtime += this.delta;
    if (this.wtime >= this.wspeed) {
      this.wsq = this.wsq < 11 ? this.wsq + 1 : 1;
      this.water.map = this.waters[this.wsq];
      this.wtime = 0;
    }
    if (this.ed != null) {
      this.ed.update();
    }
    if (gg.ply != null) {
      gg.x = gg.ply.props.x;
      gg.y = gg.ply.props.y;
    }
    this.map.chunkCheck();
    if (this.keys[114] === 1) {
      if (this.minimap != null) {
        this.minimap.dtor();
        this.minimap = null;
      } else {
        this.minimap = new this.Minimap;
      }
    }
    this.aim = !!this.right;
    if (this.settings.hotlineCam) {
      this.pan();
    }
    this.worldstep();
    this.map.step();
    this.zoompass();
    if ((gg.ply != null) && !this.freezeCam) { 
      zoom = this.ichBinEineBee;
      if (gg.mobile) {
        zoom *= 1.5;
      }
      this.camera.position.z = (zoom != null ? zoom : 250) + gg.ply.props.z - 64;
      this.camera.position.x = this.ply.props.x; // - (@camera.position.x/.99)
      this.camera.position.y = this.ply.props.y;
    }
    this.shake();
    this.arrow.stick();
    this.render();
    ref = this.keys;
    for (i = l = 0, len = ref.length; l < len; i = ++l) {
      k = ref[i];
      if (k) {
        this.keys[i] = 2;
      }
    }
    this.frame++;
    return true;
  };

  gg.ichBinEineBee = gg.zoomoverride || gg.zoom;

  gg.zoompass = function() {
    var diff, zoom;
    this.zoomoverride = this.keys[90] ? this.C.ZOOM.Z : this.keys[88] && (gg.ed == null) ? this.C.ZOOM.X : this.zoom === 0 ? this.zoomoverride : 0; // x
    zoom = this.zoomoverride || this.zoom;
    if (this.ichBinEineBee !== zoom) {
      if (this.ichBinEineBee < zoom) {
        diff = zoom - this.ichBinEineBee;
        diff = diff < 5 ? 5 : diff;
        this.ichBinEineBee += diff / 20;
        if (this.ichBinEineBee > zoom) {
          this.ichBinEineBee = zoom;
        }
      } else {
        diff = this.ichBinEineBee - zoom;
        diff = diff < 5 ? 5 : diff;
        this.ichBinEineBee -= diff / 20;
        if (this.ichBinEineBee < zoom) {
          this.ichBinEineBee = zoom;
        }
      }
    }
    this.ichBinEineBee = this.ichBinEineBee;
    return true;
  };

  gg.Visual = class Visual {
    // @color: 0xffffff
    constructor(props) {
      var ref;
      this.props = props;
      this.type = 'Visual';
      this.vjson = {};
      if ((ref = this.props.vjson) != null ? ref.length : void 0) {
        this.vjson = JSON.parse(this.props.vjson = this.props.vjson.replace(/\\/g, ""));
      }
      if (this.props.r == null) {
        this.props.r = 0;
      }
      if (this.props.interior == null) {
        if ((this.props.states != null) && (this.props.states.intr != null)) {
          this.props.interior = !!this.props.states.intr;
        }
      }
    }

    dtor() {
      if (this.props.net) {
        gg.scene.remove(this.mesh);
      }
      if (this.mesh != null) {
        this.mesh.ggsolid = null;
      }
      // @mesh = null
      // @material = null
      // @geometry = null
      return 0;
    }

    pose() {
      if (this.mesh != null) {
        this.mesh.position.x = this.props.x;
        this.mesh.position.y = this.props.y;
        this.mesh.position.z = this.props.z;
        this.mesh.updateMatrix();
        this.mesh.updateMatrixWorld();
      }
      return 111;
    }

    step() {
      return 0;
    }

    patch() {
      return 0;
    }

    build(solo = false) {
      if (!(solo || this.props.net)) {
        return;
      }
      if (this.props.hide) {
        return;
      }
      gg.scene.add(this.mesh);
      // console.log "visual show of #{@type}"
      return 1;
    }

  };

}).call(this);
