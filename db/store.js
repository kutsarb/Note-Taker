const fs = require("fs");
const util = require("util");
const path = require("path");
const express = require("express");



const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

class Store {
  constructor(){
    this.lastID = 0;
  }
  read() {
    return readFileAsync(path.join(__dirname, "db.json"), "utf8");
  }

  write(note) {
    return writeFileAsync(path.join(__dirname, "db.json"), JSON.stringify(note));
  }

  getNotes() {
    return this.read().then(notes => {
      // here you will write a function that uses the above read function and parses the notes from the file 
      let parsedNotes=JSON.parse(notes);

      return parsedNotes;
    });

  };

  addNotes(note) {
    // set up variables with our notes data here
    const { title, text } = note;
    // Error handle here, if we have no title or text added throw a new error explaining what is wrong
    if (!title || !text) {
      throw new Error("Note 'title' and 'text' cannot be blank");
    }

    // Add a unique id to the note using uuid package
    const newNote = { title, text, id:++this.lastID };

    // Get all notes, add the new note, write all the updated notes, return the newNote
    return this.getNotes()
      .then(notes=>
        [...notes, newNote]
      )
      .then(updatedNotes=> 
        this.write(updatedNotes)
      )
      .then(() => newNote)
  }

  removeNotes(id) {
    // Get all notes, remove the note with the given id, write the filtered notes
    return this.getNotes()
      .then(notes=>
        notes.filter(notes=>
          notes.id !== parseInt(id)
        )
      )
      .then( theNote=> 
        this.write(theNote)
      );
  }
}

const store = new Store();

module.exports = store;
