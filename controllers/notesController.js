import { Note } from "../models/Notes.js";
import mongoose from "mongoose";

export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const newNote = await Note.create({
      title,
      content,
      userId: req.userId,
    });
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const noteDetail = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.userId });

    if (!notes) return res.status(404).json({ message: "Notes not found" });

    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid note ID" });
    }

    console.log("Deleting note ID:", id);
    console.log("User ID:", req.userId);

    const note = await Note.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!note) {
      return res
        .status(404)
        .json({ message: "Note not found or unauthorized" });
    }

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
