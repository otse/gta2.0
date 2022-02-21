// Generated by CoffeeScript 2.3.0
(function() {
  var times;

  times = [];

  gg.Net = class Net {
    constructor() {
      this.visuals = [];
      this.ws = null;
      this.open = false;
      this.frame = -1;
      this.in = {};
      this.out = {};
      this.last = {
        x: 0,
        y: 0,
        r: 0,
        z: 0
      };
      this.connect();
    }

    connect() {
      var net;
      net = this;
      this.ws = new WebSocket(gg.config.ws);
      this.ws.onopen = function() {
        net.open = true;
        new gg.bubble('Connected to server');
        net.interval = setInterval('gg.net.loop()', 100);
        net.loop();
        return true;
      };
      this.ws.onmessage = function(evt) {
        //console.log "got #{evt.data}"
        net.takein(JSON.parse(evt.data));
        return true;
      };
      this.ws.onclose = function() {
        if (net.open) {
          new gg.bubble('Connection was closed. Reload page to try to reconnect.', true);
        }
        net.open = false;
        clearInterval(this.interval);
        return true;
      };
      this.ws.onerror = function(err) {
        new gg.bubble(' <span class="fail">Can\'t reach server. Maybe it\'s down for maintenance.</span>');
        return gg.zoom = gg.C.ZOOM.PED;
      };
      true;
      return true;
    }

    takein(o) {
      var e, id, l, len, props, statetype, type, v;
      if (Object.prototype.toString.call(o[0]) !== '[object Array]') {
        this.in = o.shift();
      }
      this.fores();
      for (l = 0, len = o.length; l < len; l++) {
        e = o[l];
        // loop :
        type = e[0].charAt(0);
        id = parseInt(e[0].substr(1));
        if (e[1] != null) {
          statetype = e[1].type || null;
        }
        props = null;
        props = (function() {
          switch (type) {
            case 'z':
              return {
                id: id,
                type: 'Zombie',
                states: e[1],
                x: e[2],
                y: e[3],
                r: e[4],
                z: e[5]
              };
            case 'g':
            case 'p':
              return {
                id: id,
                type: 'Man',
                states: e[1],
                x: e[2],
                y: e[3],
                r: e[4],
                z: e[5]
              };
            case 'c':
              return {
                id: id,
                type: 'Car',
                states: e[1],
                x: e[2],
                y: e[3],
                r: e[4],
                z: e[5]
              };
            case 'd':
              return {
                id: id,
                type: 'Decal',
                states: e[1],
                x: e[2],
                y: e[3],
                r: e[4],
                z: e[5]
              };
            case 'u':
              return {
                id: id,
                type: 'Pickup',
                states: e[1],
                x: e[2],
                y: e[3],
                r: e[4],
                z: e[5]
              };
            case 'm':
            case 'n':
              return {
                id: id,
                type: statetype,
                states: e[1],
                x: e[2],
                y: e[3],
                r: e[4],
                z: e[5]
              };
            default:
              return null;
          }
        })();
        if (this.YOURE === id && 'p' === type) {
          props.type = 'Player';
        }
        props.net = true; // todo: so far only used to stop step.sprite :<
        
        // console.log e
        if ((props != null) && !(v = this.visuals[e[0]])) {
          this.visuals[e[0]] = gg.visualFactory(props);
        } else {
          v.patch(props);
        }
      }
      // some more actions
      this.afts();
      return 1;
    }

    collect() {
      var f2, out, repose, v;
      repose = false;
      f2 = function(a) {
        return a.toFixed(2);
      };
      out = [];
      // `CAT: //`
      if (gg.ply != null) {
        v = gg.ply;
        if (f2(this.last.x) !== f2(v.props.x)) {
          out[0] = parseFloat(f2(v.props.x));
        }
        if (f2(this.last.y) !== f2(v.props.y)) {
          out[1] = parseFloat(f2(v.props.y));
        }
        if (f2(this.last.r) !== f2(v.props.r)) {
          out[2] = parseFloat(f2(v.props.r));
        }
        if (f2(this.last.z) !== f2(v.props.z)) {
          out[3] = parseFloat(f2(v.props.z));
        }
        this.last = {
          x: v.props.x,
          y: v.props.y,
          z: v.props.z,
          r: v.props.r
        };
      }
      if (!!Object.keys(gg.net.out).length) {
        out[4] = gg.net.out;
      }
      gg.net.out = {};
      return out;
    }

    loop() {
      var a, json;
      a = this.collect();
      if (a.length) {
        json = JSON.stringify(a);
        this.ws.send(json);
      }
      return true;
    }

    fores(e) {
      var i, l, len, len1, len2, m, p, q, ref, ref1, ref2, ref3, ref4, v;
      if (this.in.removes) {
        ref = this.in.removes;
        for (l = 0, len = ref.length; l < len; l++) {
          e = ref[l];
          if ((v = this.visuals[e]) == null) {
            continue;
          }
          v.dtor();
          delete this.visuals[e];
        }
      }
      if (this.in.bubbles) {
        ref1 = this.in.bubbles;
        for (p = 0, len1 = ref1.length; p < len1; p++) {
          m = ref1[p];
          new gg.bubble(m);
        }
      }
      if (this.in.quest) {
        ref2 = this.in.bubbles;
        for (q = 0, len2 = ref2.length; q < len2; q++) {
          m = ref2[q];
          new gg.bubble(m);
        }
      }
      if (this.in.inventory) {
        gg.inventory.patch(this.in.inventory);
      }
      if (this.in.YOURE) {
        this.YOURE = this.in.YOURE;
      }
      // gg.bubble "debug : YOURE #{@YOURE}"
      if (this.in.INTR != null) {
        console.log(`intr ${this.in.INTR}`);
        gg.ambient = 0x697676;
        gg.zoom = gg.C.ZOOM.INTR;
        gg.interior = new gg.Interior(this.in.INTR, this.in.INTRSTYLE);
        gg.map.dtor(true);
        ref3 = this.visuals;
        for (i in ref3) {
          v = ref3[i];
          v.dtor();
        }
        this.visuals = [];
      }
      if (this.in.OUTR != null) {
        gg.ambient = gg.outside;
        gg.zoom = gg.melee ? gg.C.ZOOM.MELEE : gg.gun ? gg.C.ZOOM.GUN : gg.C.ZOOM.PED;
        gg.map.dtor(true);
        this.recolor();
        gg.interior.dtor();
        gg.interior = null;
        ref4 = this.visuals;
        for (i in ref4) {
          v = ref4[i];
          v.dtor();
        }
        this.visuals = [];
      }
      return 1;
    }

    recolor() {
      var color, k, ref, v;
      ref = gg.materials;
      for (k in ref) {
        v = ref[k];
        if (!!~k.indexOf('Interior')) {
          continue;
        }
        color = gg.ambient;
        if (!!~k.indexOf('Sloped')) {
          color = gg.darker(null);
        }
        v.color = new THREE.Color(color);
      }
      return 1;
    }

    afts() {
      var card, id, l, len, len1, n, p, ref, ref1;
      if ((this.in.TP != null) && (gg.ply != null)) {
        gg.ply.props.x = this.in.TP[0];
        gg.ply.props.y = this.in.TP[1];
        if (this.in.TP[2] != null) {
          gg.ply.props.z = this.in.TP[2];
        }
        gg.ply.embody();
        console.log('in.TP');
      }
      if (this.in.SEL != null) {
        gg.inventory.sel = this.in.SEL;
      }
      if ((gg.ply != null) && (this.in.h != null)) {
        console.log('were hit');
        gg.play(gg.sounds.kungfu[0], gg.ply);
      }
      if ((gg.ply != null) && this.in.DEAD) {
        gg.ply.die();
        gg.inventory.patch({});
      }
      /*if gg.ply? and @in.OUTFIT
      gg.ply.props.states.o = @in.OUTFIT
      gg.ply.dressup()
      gg.zoom = gg.C.ZOOM.PED
      gg.bubble "debug : you wear #{@in.OUTFIT}"*/
      if (this.in.CARDS) {
        ref = this.in.CARDS;
        for (l = 0, len = ref.length; l < len; l++) {
          n = ref[l];
          card = $(`<div class="card" data-id="${n.id}">`);
          card.data('id', n.id);
          card.data('name', n.name);
          card.append(`<img src="play/sty/nontile/pickups/${n.name}.png"></img>`);
          card.click(function() {
            var j;
            j = $(this);
            j.addClass('take');
            gg.net.out.CARD = j.data('id');
            setTimeout(function() {
              return j.remove();
            }, 700);
          });
        }
        $('#pickups').append(card);
      }
      if (this.in.RMCARDS) {
        ref1 = this.in.RMCARDS;
        for (p = 0, len1 = ref1.length; p < len1; p++) {
          id = ref1[p];
          console.log(`removing ${id}`);
          $(`.card[data-id="${id}"]`).remove();
        }
      }
      if (this.in.TARGET != null) {
        gg.arrow.material.visible = true;
        gg.arrow.pointat(this.in.TARGET);
      }
      if (this.in.NOTARGET != null) {
        gg.arrow.material.visible = false;
      }
      if (this.in.YOURE) {
        gg.onspawn();
      }
      if (this.in.LINE && (gg.ply != null)) {
        new gg.Trail({
          x: gg.ply.props.x,
          y: gg.ply.props.y,
          to: this.in.LINE
        });
      }
      /*if @in.OUTLAW?
      bandit = gg.loadSty "nontile/mobs/poncho.png"
      gg.ply.sprite.skin = bandit
      gg.ply.material.map = bandit
      gg.ply.shadowMaterial.map = bandit*/
      return 1;
    }

  };

}).call(this);