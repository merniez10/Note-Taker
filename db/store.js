const util = require('util');
const fs = require('fs');


const uuidv1 = require('uuid/v1');

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

class Store {
    readNote() {
        return readFileAsync("db/db.json", "utf8");
    }

    writeNote(note) {
        return writeFileAsync("db/db.json", JSON.stringify(note));
    }

    getNotes() {
        return this.readNote().then((notes) => {
            let parseNotes;

            try {
                parseNotes = [].concat(JSON.parse(notes))
            } catch (err) {
                parseNotes = [];
            }
            return parseNotes;

        })
    } 

    addNote(note){
        const{title,text}=note;
        if (!title || !text){
            throw new Error("title or text can't be blank");
        }

        const newNote = {
            title,text,id:uuidv1()
        }

        return this.getNotes()
        .then((notes) => [
            ...notes,newNote
        ])
        .then((updatedNotes) => this.writeNote(updatedNotes))
        .then(() => newNote)
    }

    removeNote(id){
        return this.getNotes()
        .then((notes) => notes.filter((note) => note.id !==id))
        .then((filteredNotes) => this.writeNote(filteredNotes))
    }

}

module.exports = new Store();