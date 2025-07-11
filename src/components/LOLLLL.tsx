import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FiCopy } from "react-icons/fi";
import { MdDelete } from "react-icons/md";

// Define the interface for a Note object
interface Note {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
}

// Function to get saved notes from localStorage
const getSavedNotes = (): Note[] => {
  const saved = localStorage.getItem("sticky-notes");
  return saved ? (JSON.parse(saved) as Note[]) : [];
};

const Notes: React.FC = () => {
  // Use the Note[] type for the notes state
  const [notes, setNotes] = useState<Note[]>(getSavedNotes);

  // Effect hook to save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("sticky-notes", JSON.stringify(notes));
  }, [notes]);

  // Function to generate a random hex color
  const randomColor = (): string => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Function to add a new note
  const addNote = (): void => {
    const newNote: Note = {
      id: Date.now(),
      text: "",
      x: 100,
      y: 100,
      color: randomColor(),
    };
    setNotes([...notes, newNote]);
  };

  // Function to update an existing note's text
  const updateNote = (id: number, text: string): void => {
    setNotes(notes.map((note) => (note.id === id ? { ...note, text } : note)));
  };

  // Function to delete a note
  const deleteNote = (id: number): void => {
    setNotes(notes.filter((note) => note.id !== id));
    toast.error("Deleted the Note");
  };

  // Function to handle dragging a note
  const handleDrag = (e: React.MouseEvent, id: number): void => {
    // Calculate new x and y coordinates relative to the mouse position
    const x = e.clientX - 75;
    const y = e.clientY - 25;
    setNotes(notes.map((note) => (note.id === id ? { ...note, x, y } : note)));
  };

  // Function to copy note text to clipboard
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
    <div>
      <button
        onClick={addNote}
        className="bg-yellow-400 text-white text-lg px-4 py-2 rounded shadow hover:bg-yellow-500"
      >
        + Add Note
      </button>

      {notes.map((note) => (
        <div
          key={note.id}
          style={{ top: note.y, left: note.x, backgroundColor: note.color }}
          className="absolute w-56 h-60 p-3 border shadow-md rounded-md cursor-move"
  
          onMouseDown={() => {
            const onMouseMove = (moveEvent: MouseEvent) =>
              handleDrag(moveEvent as unknown as React.MouseEvent, note.id);
            const onMouseUp = () => {
              window.removeEventListener("mousemove", onMouseMove);
              window.removeEventListener("mouseup", onMouseUp);
            };
            window.addEventListener("mousemove", onMouseMove);
            window.addEventListener("mouseup", onMouseUp);
          }}
        >
          <textarea
            className="w-full h-40 resize-none p-2 text-base bg-transparent border-none outline-none"
            value={note.text}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              updateNote(note.id, e.target.value)
            }
          />
          <div className="flex justify-between items-center mt-2 text-lg">
            <button
              onClick={() => copyToClipboard(note.text)}
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <FiCopy /> Copy
            </button>
            <button
              onClick={() => deleteNote(note.id)}
              className="text-red-600 hover:text-red-800 flex items-center gap-1"
            >
              <MdDelete /> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notes;
