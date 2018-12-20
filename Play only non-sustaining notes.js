var susNotes  = []
var sustaining = false

function HandleMIDI(event) {
  HandleSustain(event)
  if (sustaining && event instanceof NoteOn) {
    PlayNoteIfNew(event)
  } else {
    event.send()
  }
}

function PlayNoteIfNew(note) {
  if (!susNotes.includes(note.number)) {
    susNotes.push(note.number)
    note.send()
  }
}

function HandleSustain(event) {
  if (isPedOff(event)) {
    sustaining = false
    susNotes = []
  } else if (isPedOn(event)) {
    // retain currently playing notes
    sustaining = true
  }
}

function isPedOff(e) { e instanceof ControlChange && e.value < 64 && e.number == 64 }
function isPedOn(e) { e instanceof ControlChange && e.value > 63 && e.number == 64 }