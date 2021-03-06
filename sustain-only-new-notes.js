var playingNotes = [];
var susNotes = [];
var sustaining = false;

function HandleMIDI(event) {
  
  if (event instanceof Note) {
    HandleNote(event)
  } else {
    HandleSustain(event)
    event.send()
  }
}

function HandleNote(note) {
  // whether sustaining or not, for notes held as pedal is pressed/released
  KeepTrackOfPlayingNotes(note) 
  if (sustaining) {
    PlayNoteIfNew(note)
  } else {
    note.send()
  }
}

function KeepTrackOfPlayingNotes(note) {
  if (note instanceof NoteOn && !playingNotes.includes(note.number)) {
    playingNotes.push(note.number)
    if (sustaining) { susNotes.push(note.number) }
  }
  else if (note instanceof NoteOff && playingNotes.includes(note.number)) {
    playingNotes.splice(playingNotes.indexOf(note.number), 1)
  }
}

function PlayNoteIfNew(note) {
  if (note instanceof NoteOn && !susNotes.includes(note.number)) {
    susNotes.push(note.number);
    note.send();
  } else if (note instanceof NoteOff) {
     note.send()
  }
}

function HandleSustain(event) {
  if (isPedOff(event)) {
    sustaining = false;
    susNotes = [];
  } else if (isPedOn(event)) {
    sustaining = true;
    playingNotes = susNotes;
  }
}

function isPedOff(e) {
  e instanceof ControlChange && e.value < 64 && e.number == 64;
}
function isPedOn(e) {
  e instanceof ControlChange && e.value > 63 && e.number == 64;
}
