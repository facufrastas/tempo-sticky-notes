import type { Note } from './types';

const STORAGE_KEY = 'sticky-notes';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Mock async REST API backed by localStorage */
export const api = {
  async fetchNotes(): Promise<Note[]> {
    await delay(100);
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as Note[];
    } catch {
      return [];
    }
  },

  async saveNotes(notes: Note[]): Promise<void> {
    await delay(50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  },

  async createNote(note: Note): Promise<Note> {
    await delay(80);
    const notes = await this.fetchNotes();
    notes.push(note);
    await this.saveNotes(notes);
    return note;
  },

  async updateNote(updated: Note): Promise<Note> {
    await delay(50);
    const notes = await this.fetchNotes();
    const idx = notes.findIndex((n) => n.id === updated.id);
    if (idx !== -1) notes[idx] = updated;
    await this.saveNotes(notes);
    return updated;
  },

  async deleteNote(id: string): Promise<void> {
    await delay(60);
    const notes = await this.fetchNotes();
    await this.saveNotes(notes.filter((n) => n.id !== id));
  },
};
