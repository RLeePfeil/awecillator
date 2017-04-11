/*
  * Author: Lee Pfeil
  * Copyright: MIT (2016)
  *
  * awecillator.js uses the web audio api to make and change sounds.
  * Its purpose has yet to be discovered.
  *
  * Possibilities:
  *  - Tab reader
  *  - Music maker
  *  - Interactive random music generator / inspiration
  *
  *  - All of the above.
*/

var awe = {
  // Options for the sound / app
  opts: {
    osctype: "sine",
    tempo: 210, // in BPM
    timesig: 4, // as in 4/4
    npm: 8, // Notes per measure
    piano: true // if piano visualization is on
  },

  // Web Audio api objects to be created
  audioCtx: null,
  oscillator: null,
  gain: null,

  // Internal use tools
  timer: null,
  beats: 0, // counts the number of beats since the beginning

  // Specifics about the sound created
  vol: 1, // Between 0 and 1
  note: 0, // Start with 440hz
  key: -12, // 0 for A

  arpeggios: [
    [0,4,7], //major
    [0,3,7], //minor
    [0,4,7,10], //7
    [0,3,7,10], //m7
    [0,4,7,11], //maj7
    [0,3,7,11], //m/maj7
    [0,4,7,9], //6th
    [0,3,7,9], //m6th
    [0,4,8], //aug7
    [0,4,6], //flat5
    [0,5,7], //sus4
    [0,5,7,10], //7sus4
    [0,4,7,10,14], //9th
    [0,3,7,10,14], //m9th
    [0,3,7,14], //add9
    [0,4,7,14], //9th
    [0,4,7,11,14], //maj9
    [0,3,7,11,14], //m/maj9
    [0,4,8,10], //7#5
    [0,3,8,10], //m7#5
    [0,4,8,11], //maj7#5
    [0,4,6,10], //7b5
    [0,3,6,10], //m7b5
    [0,4,6,11], //maj7b5
    [0,2,7], //sus2
    [0,2,7,10], //7sus2
    [0,4,7,9,14], //6/9
    [0,3,6,9], //dim7
    [0,3,6], //dim
    [0,3,6,10], //07
    [0,7], //5
    [0,4,7,10,14,17], //11th
    [0,3,7,10,14,17], //m11th
    [0,4,7,10,14,21], //13th
    [0,3,7,10,14,21], //m13th
    [0,4,7,11,14,21], //maj13th
    [0,3,7,11,14,21], //m/maj13th
    [0,4,10,15], //7#9
    [0,4,7,10,15], //7#9w5
    [0,4,7,10,13], //7b9
    [0,4,6,10,13], //7b5b9
    [0,4,7,10,18], //7#11
    [0,4,7,10,13,20], //7b9b13
    [0,4,7,10,15,18], //7#9#11
  ],

  whicharpeggio: 0,

  // Set up audio objects and start sound
  init: function(opts) {
    // TODO Overwrite options

    awe.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    awe.gain = awe.audioCtx.createGain();
    awe.oscillator = awe.audioCtx.createOscillator();

    awe.oscillator.type = awe.opts.osctype;
    awe.setPitch(awe.note);

    awe.oscillator.connect(awe.gain);
    awe.gain.connect(awe.audioCtx.destination);
    awe.oscillator.start();

    // Hook up keyboard events
    keyboardJS.bind('space', function(e) {
      console.log('space is pressed');
      awe.isSpaceDown = true;
    }, function(e) {
      console.log('space is released')
      awe.isSpaceDown = false;
    });


    // Start our metronome
    // 60 seconds divided by beats per minute divided by notes per measure (assuming 4 beat per measure by default)
    awe.timer = setInterval(awe.tick, 60000 / awe.opts.tempo / (awe.opts.npm / awe.opts.timesig));
  },

  // Set pitch by number of half-steps above or below A
  setPitch: function(note) {
    awe.note = note;

    var freq = 440 * Math.exp(awe.note * Math.log(2)/12);

    awe.oscillator.frequency.value = freq;

    // Show the key that's being played
    if (awe.opts.piano) {
      $('#piano-container span').removeClass('playing');
      $('#piano-container').find('span[data-pitch='+awe.note+']').addClass('playing');
    }
  },

  // Moves the note up or down by integer val
  setPitchRelative: function(val) {
    awe.setPitch(awe.note + Math.round(val));
  },

  // Set the volume of the note between 0 and 1
  setVol: function(vol) {
    vol = vol < 0 ? 0 : vol > 1 ? 1 : vol; // Cap it between 0 and 1
    awe.vol = vol; // Remember our volume
    awe.gain.gain.value = vol;
  },

  // Turn sound off / on (by setting the gain to 0 or the previous value, respectively)
  mute: function() {
    // Bypass setVol() as we don't need to record the volume we're changing to
    if (awe.gain.gain.value != 0) {
      awe.gain.gain.value = 0;
    } else {
      awe.gain.gain.value = awe.vol;
    }
  },

  // Advance the audio
  tick: function() {
    awe.beats ++;

    awe.setPitch(awe.key + awe.arpeggios[awe.whicharpeggio][ awe.beats %awe.arpeggios[awe.whicharpeggio].length ]);
  }
}
