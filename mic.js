var mic = {
  analyzer: null,
  audioCtx: null,
  input: null,
  filter: null,
  usesMediaDevices: null,

  init: function() {
    mic.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    if (navigator.mediaDevices&&navigator.mediaDevices.getUserMedia) {
      mic.usesMediaDevices = true;
    } else {
      mic.usesMediaDevices = false;

      // Legacy way to get mic input
      navigator.getUserMedia = (
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia
      );
    }
  },

  getMicrophoneInput: function() {
    if (mic.usesMediaDevices) {
      var p = navigator.mediaDevices.getUserMedia({audio: true});
      p.then(mediaStream){mic.onStream(mediaStream);}
      p.catch(e){mic.onStreamError(e);}
    } else {
      // Legacy way to get mic input
      navigator.getUserMedia({audio: true}, mic.onStream, mic.onStreamError);
    }
  },

  onStream: function(stream) {
    mic.input = mic.audioCtx.createMediaStreamSource(stream);
    mic.filter = mic.audioCtx.createBiquadFilter();
    mic.filter.frequency.value = 60.0;
    mic.filter.type = mic.filter.NOTCH;
    mic.filter.Q = 10.0;

    mic.analyser = mic.audioCtx.createAnalyser();

    // Connect graph.
    mic.input.connect(mic.filter);
    mic.filter.connect(mic.analyser);
  },

  onStreamError: function(e) {
    console.error('Error getting microphone', e);
  }
}
