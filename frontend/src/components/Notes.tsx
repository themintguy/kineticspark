"use client";
import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { FiCopy } from "react-icons/fi";
import { MdDelete } from "react-icons/md";

interface Note {
  id: number;
  text: string;
  color: string;
}

const getSavedNotes = (): Note[] => {
  const saved = localStorage.getItem("sticky-notes");
  return saved ? (JSON.parse(saved) as Note[]) : [];
};

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(getSavedNotes);
  const noteRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  useEffect(() => {
    localStorage.setItem("sticky-notes", JSON.stringify(notes));
  }, [notes]);

  const randomColor = (): string => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const addNote = (): void => {
    const newNote: Note = {
      id: Date.now(),
      text: "",
      color: randomColor(),
    };
    setNotes([...notes, newNote]);
  };

  const updateNote = (id: number, text: string): void => {
    setNotes(notes.map((note) => (note.id === id ? { ...note, text } : note)));
  };

  const deleteNote = (id: number): void => {
    setNotes(notes.filter((note) => note.id !== id));
    toast.error("Deleted the Note");
  };

  const copyToClipboard = (text: string): void => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Note copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy note.");
      });
  };

  return (
    <div className="p-4 sm:p-8 md:p-12">
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={addNote}
          className="bg-yellow-400 text-white text-lg px-4 py-2 rounded-full shadow-lg hover:bg-yellow-500 transition-colors"
        >
          +
        </button>
      </div>

      <div className="flex flex-col items-center gap-6">
        {notes.map((note) => (
          <div
            key={note.id}
            ref={(el) => {
              noteRefs.current[note.id] = el;
            }}
            style={{ backgroundColor: note.color }}
            className="w-full sm:w-80 md:w-96 min-h-60 p-4 border shadow-md rounded-lg flex flex-col justify-between"
          >
            <textarea
              className="w-full min-h-40 resize-none p-2 text-base bg-transparent border-none outline-none focus:ring-0"
              value={note.text}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                updateNote(note.id, e.target.value)
              }
            />
            <div className="flex justify-between items-center mt-2 text-lg">
              <button
                onClick={() => copyToClipboard(note.text)}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
              >
                <FiCopy /> Copy
              </button>
              <button
                onClick={() => deleteNote(note.id)}
                className="text-red-600 hover:text-red-800 flex items-center gap-1 transition-colors"
              >
                <MdDelete /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notes;
