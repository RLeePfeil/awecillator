/* Creates a piano!

*/

var piano = {
  keys: 24, //88,
  visibleoctaves: 2, // Eventually will be put to use

  init: function() {
    var pianoDOM = document.createElement('div');
        pianoDOM.setAttribute("class", "piano");
    for (var i=0; i<piano.keys; i++) {
      var newKey = document.createElement('span');
          newKey.setAttribute("class", "key");
          newKey.setAttribute("data-pitch", i - Math.floor(piano.keys/2) - 9); // Formula to get C equal to C
          pianoDOM.appendChild(newKey);
    }

    //document.getElementsByTagName('body')[0].appendChild(pianoDOM);
    document.getElementById("piano-container").appendChild(pianoDOM);

    // Event handlers for key click (make new tone)
    
  }
}
