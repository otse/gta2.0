// Generated by CoffeeScript 2.3.0
(function() {
  gg.Entity = (function() {
    class Entity extends gg.Visual {
      constructor(props) {
        super(props);
        this.type = 'Entity';
        this.cyan = false;
        this.grid = false;
        this.size = 24;
      }

      dtor() {
        if (this.mesh) {
          gg.scene.remove(this.mesh);
        }
        return super.dtor();
      }

      step() {
        return true;
      }

      hah() {
        return true;
      }

      cube() {
        if (this.cyan) {
          return false;
        }
        this.cyan = true;
        this.material = new THREE.MeshLambertMaterial({
          map: gg.loadSty('special/ent.png'),
          transparent: true,
          opacity: .5,
          color: this.constructor.color
        });
        this.geometry = new THREE.BoxGeometry(this.size, this.size, this.size, 1, 1, 1);
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        if (this.grid) {
          this.mesh.position.x = (this.props.x * 64) + 36;
          this.mesh.position.y = (this.props.y * 64) + 36;
          this.mesh.position.z = (this.props.z * 64) + 32;
        } else {
          this.mesh.position.x = this.props.x;
          this.mesh.position.y = this.props.y;
          this.mesh.position.z = this.props.z;
        }
        this.mesh.ggsolid = this; // arb prop
        gg.map.meshes.push(this.mesh);
        gg.scene.add(this.mesh);
        return true;
      }

    };

    Entity.color = 0xffffff;

    return Entity;

  }).call(this);

  gg.Walk = (function() {
    class Walk extends gg.Entity {
      // linewidth: 2 # "threejs doc: always 1 on Windows"
      constructor(props) {
        super(props);
        this.type = 'Walk';
        this.cached = null;
        this.lines = [];
        // props.hide = not gg.ed?
        this.size = 14;
        gg.walks[this.vjson.id] = this;
        this;
      }

      step() {
        var geometry, i, j, k, l, len, len1, line, material, ref, ref1, to;
        if (gg.ed == null) {
          return;
        }
        if (this.cached === this.props.vjson) {
          return;
        }
        this.cached = this.props.vjson;
        ref = this.lines;
        for (j = 0, len = ref.length; j < len; j++) {
          l = ref[j];
          gg.scene.remove(l);
        }
        this.lines = [];
        if (this.vjson.links == null) {
          return;
        }
        ref1 = this.vjson.links;
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          i = ref1[k];
          to = gg.walks[i];
          if (to == null) {
            continue;
          }
          //continue if not to.vjson.links?
          //continue if to.vjson.links.indexOf(@vjson.id) is -1
          material = this.red; // if to.id < @vjson.id then gg.Walk::red else gg.Walk::blue
          geometry = new THREE.Geometry;
          geometry.vertices.push(new THREE.Vector3(this.props.x, this.props.y, this.props.z));
          geometry.vertices.push(new THREE.Vector3(to.props.x, to.props.y, to.props.z));
          line = new THREE.Line(geometry, material);
          this.lines.push(line);
          gg.scene.add(line);
        }
        return true;
      }

      dtor() {
        var j, l, len, ref;
        ref = this.lines;
        for (j = 0, len = ref.length; j < len; j++) {
          l = ref[j];
          gg.scene.remove(l);
        }
        return super.dtor();
      }

      hah() {
        return true;
      }

    };

    Walk.color = 0x60ff82;

    Walk.prototype.red = new THREE.LineBasicMaterial({
      color: 0xcc0000,
      transparent: true,
      opacity: .5
    });

    // linewidth: 2 # "threejs doc: always 1 on Windows"
    Walk.prototype.blue = new THREE.LineBasicMaterial({
      color: 0x0000ff,
      transparent: true,
      opacity: .5
    });

    return Walk;

  }).call(this);

  gg.Drive = (function() {
    class Drive extends gg.Entity {
      // linewidth: 2 # "threejs doc: always 1 on Windows"
      constructor(props) {
        super(props);
        this.type = 'Drive';
        this.cached = null;
        this.lines = [];
        // props.hide = not gg.ed?
        this.size = 18;
        gg.drives[this.vjson.id] = this;
        this;
      }

      step() {
        var geometry, i, j, k, l, len, len1, line, material, ref, ref1, to;
        if (gg.ed == null) {
          return;
        }
        if (this.cached === this.props.vjson) {
          return;
        }
        this.cached = this.props.vjson;
        ref = this.lines;
        for (j = 0, len = ref.length; j < len; j++) {
          l = ref[j];
          gg.scene.remove(l);
        }
        this.lines = [];
        if (this.vjson.links == null) {
          return;
        }
        ref1 = this.vjson.links;
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          i = ref1[k];
          to = gg.drives[i];
          if (to == null) {
            continue;
          }
          //continue if not to.vjson.links?
          //continue if to.vjson.links.indexOf(@vjson.id) is -1
          material = this.blue; // if to.id < @vjson.id then gg.Walk::red else gg.Walk::blue
          geometry = new THREE.Geometry;
          geometry.vertices.push(new THREE.Vector3(this.props.x, this.props.y, this.props.z));
          geometry.vertices.push(new THREE.Vector3(to.props.x, to.props.y, to.props.z));
          line = new THREE.Line(geometry, material);
          this.lines.push(line);
          gg.scene.add(line);
        }
        return true;
      }

      dtor() {
        var j, l, len, ref;
        ref = this.lines;
        for (j = 0, len = ref.length; j < len; j++) {
          l = ref[j];
          gg.scene.remove(l);
        }
        return super.dtor();
      }

      hah() {
        return true;
      }

    };

    Drive.color = 0x231fd2;

    Drive.prototype.blue = new THREE.LineBasicMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: .5
    });

    return Drive;

  }).call(this);

  gg.ParkingSpace = (function() {
    class ParkingSpace extends gg.Entity {
      constructor(props) {
        super(props);
        this.type = 'Parking space';
        // props.hide = not gg.ed?
        this.grid = false;
      }

      step() {
        return 1;
      }

      hah() {
        return 1;
      }

    };

    ParkingSpace.color = 0x9657ff;

    return ParkingSpace;

  }).call(this);

  gg.SafeZone = (function() {
    class SafeZone extends gg.Entity {
      constructor(props) {
        super(props);
        this.type = 'Safe Zone';
        this.size = 30;
      }

      step() {
        return 1;
      }

    };

    SafeZone.color = 0xff606f;

    return SafeZone;

  }).call(this);

  gg.Arrow = class Arrow {
    constructor() {
      this.show = false;
      this.target = {
        x: 0,
        y: 0
      };
      this.material = new THREE.MeshLambertMaterial({
        map: gg.loadSty('nontile/arrow.png'),
        transparent: true,
        opacity: 0,
        side: THREE.FrontSide,
        visible: false
      });
      // @material.depthTest = false
      // @material.depthWrite = false
      this.geometry = new THREE.PlaneBufferGeometry(19 / 2, 27 / 2, 1);
      this.mesh = new THREE.Mesh(this.geometry, this.material);
      gg.scene.add(this.mesh);
    }

    stick() {
      var angle, range, x, y;
      if (!this.material.visible) {
        return;
      }
      x = this.target.x - gg.camera.position.x;
      y = this.target.y - gg.camera.position.y;
      range = Math.hypot(x, y);
      angle = Math.atan2(y, x);
      x = Math.cos(angle) * 48;
      y = Math.sin(angle) * 48;
      if (range < 48) {
        this.material.opacity = 0;
      } else {
        this.material.opacity = 1;
      }
      this.mesh.position.set(gg.camera.position.x + x, gg.camera.position.y + y, 64.05);
      this.mesh.rotation.z = angle - Math.PI / 2;
      return true;
    }

    pointat(xy) {
      this.target.x = xy.x;
      this.target.y = xy.y;
      return true;
    }

  };

}).call(this);
