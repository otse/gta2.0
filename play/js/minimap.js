// Generated by CoffeeScript 2.3.0
(function() {
  gg.Minimap = class Minimap {
    constructor() {
      this.minimap = $('<div id="minimap">');
      $('#overlay').append(this.minimap);
      this.build();
      this.chase();
    }

    dtor() {
      return this.minimap.remove();
    }

    build() {
      var i, j, td, tr, vis, x, y;
      this.table = $('<table>');
      for (y = i = 0; i <= 4; y = ++i) {
        tr = $('<tr>');
        for (x = j = 0; j <= 4; x = ++j) {
          td = $('<td>');
          vis = 0;
          if (gg.map.chunks[y][x]) {
            vis = gg.map.chunks[y][x].visuals.length;
          }
          if (x > 0 && x < 4 && y > 0 && y < 4) {
            if (gg.map.chunks[y][x]) {
              td.addClass('inner');
            }
          } else if (vis) {
            td.addClass('outer');
          }
          if (vis) {
            td.append(gg.map.chunks[y][x].hash);
            td.css('opacity', vis / 50);
          }
          if (y === 2 && x === 2) {
            //else if not @offChunks["#{x},#{y}"]
            //td.addClass 'nochunk'
            td.addClass('center');
          }
          tr.append(td);
        }
        this.table.append(tr);
      }
      this.minimap.html(this.table);
      return true;
    }

    chase() {
      var x, y;
      if (gg.ply == null) {
        return;
      }
      x = (gg.ply.props.x / gg.C.CHUNITS) - gg.map.n.x;
      y = (gg.ply.props.y / gg.C.CHUNITS) - gg.map.n.y;
      y -= 1;
      x *= 40;
      y *= 40;
      x = Math.floor(x);
      y = Math.floor(y);
      this.table.css('left', `${-x}px`);
      this.table.css('top', `${y}px`);
      // this is the topleft position of chunk 0,0 on dynmap.png
      x = 464;
      y = 400;
      x -= 80;
      // y -= 40
      x += gg.ply.props.x / 4;
      y += gg.ply.props.y / 4;
      // x /= 4
      // y /= 4
      this.minimap.css('background-position-x', `${-x}px`);
      this.minimap.css('background-position-y', `${y}px`);
      return true;
    }

  };

}).call(this);