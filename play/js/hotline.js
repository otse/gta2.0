// Generated by CoffeeScript 2.3.0
(function() {
  gg.makepan = function() {
    var yaw;
    yaw = {
      value: 0,
      period: 0
    };
    this.pan = () => {
      yaw.period += 0.012 * this.timestep;
      if (yaw.period > Math.PI * 2) {
        yaw.period -= Math.PI * 2;
      }
      yaw.value = 0.0002 * Math.cos(yaw.period);
      this.camera.rotation.z += yaw.value;
      return 0;
    };
    return this.pan;
  };

  gg.music = function() {
    var array, audio, buffer, sound;
    // return if gg.DEV or gg.nosound
    array = gg.sounds.music;
    if (Array.isArray(array)) {
      sound = array[Math.floor(Math.random() * array.length)];
    }
    buffer = gg.audio[sound];
    if (!(buffer instanceof AudioBuffer)) {
      return;
    }
    audio = new THREE.Audio(gg.listener);
    audio.setBuffer(buffer);
    audio.autoplay = true;
    audio.setVolume(0.3);
    return audio.play();
  };

  gg.letterbox = function(quote) {
    var div, down, text, up;
    console.log('gg.letterbox');
    gg.zoom = 220;
    if (quote) {
      div = $('<div>');
      div.attr('id', 'letterbox');
      up = $('<div>');
      up.attr('class', 'up');
      div.append(up);
      down = $('<div>');
      down.attr('class', 'down');
      div.append(down);
      text = $('<div>');
      text.attr('class', 'text');
      text.text(quote);
      down.append(text);
      $('#overlay').append(div);
      setTimeout(function() {
        gg.letterbox(false);
        return 1;
      }, 7000);
    } else {
      $('#letterbox').remove();
      gg.zoom = gg.C.ZOOM.PED;
    }
    return 1;
  };

}).call(this);
