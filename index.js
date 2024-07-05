#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import fs from 'fs';

const NOTES_FILE = 'notes.json';

const loadNotes = () => {
  try {
    const dataBuffer = fs.readFileSync(NOTES_FILE);
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON);
  } catch (e) {
    return [];
  }
};

const saveNotes = (notes) => {
  const dataJSON = JSON.stringify(notes);
  fs.writeFileSync(NOTES_FILE, dataJSON);
};

const addNote = (title, body) => {
  const notes = loadNotes();
  const duplicateNote = notes.find(note => note.title === title);

  if (!duplicateNote) {
    notes.push({ title, body });
    saveNotes(notes);
    console.log('Note added!');
  } else {
    console.log('Note title taken!');
  }
};

const removeNote = (title) => {
  const notes = loadNotes();
  const notesToKeep = notes.filter(note => note.title !== title);

  if (notes.length > notesToKeep.length) {
    saveNotes(notesToKeep);
    console.log('Note removed!');
  } else {
    console.log('No note found!');
  }
};

const listNotes = () => {
  const notes = loadNotes();
  console.log('Your notes:');
  notes.forEach(note => {
    console.log(`Title: ${note.title}`);
    console.log(`Body: ${note.body}`);
    console.log('---');
  });
};

yargs(hideBin(process.argv))
  .command('add', 'Add a new note', {
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string'
    },
    body: {
      describe: 'Note body',
      demandOption: true,
      type: 'string'
    }
  }, (argv) => {
    addNote(argv.title, argv.body);
  })
  .command('remove', 'Remove a note', {
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string'
    }
  }, (argv) => {
    removeNote(argv.title);
  })
  .command('list', 'List all notes', {}, () => {
    listNotes();
  })
  .help()
  .argv;
