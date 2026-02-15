import { useCallback, useEffect, useRef, useState } from 'react';
import { DEFAULT_NOTE_WIDTH, DEFAULT_NOTE_HEIGHT } from '@/types';
import type { Note, NoteColor } from '@/types';
import { api } from '@/api';

let nextZIndex = 1;

function generateId(): string {
  return crypto.randomUUID();
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loaded, setLoaded] = useState(false);
  const saveTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    api.fetchNotes().then((saved) => {
      if (saved.length > 0) {
        const maxZ = Math.max(...saved.map((n) => n.zIndex));
        nextZIndex = maxZ + 1;
      }
      setNotes(saved);
      setLoaded(true);
    });
  }, []);

  const persist = useCallback((updated: Note[]) => {
    clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      api.saveNotes(updated);
    }, 300);
  }, []);

  const createNote = useCallback(
    (x: number, y: number, color: NoteColor) => {
      const note: Note = {
        id: generateId(),
        x: x - DEFAULT_NOTE_WIDTH / 2,
        y: y - DEFAULT_NOTE_HEIGHT / 2,
        width: DEFAULT_NOTE_WIDTH,
        height: DEFAULT_NOTE_HEIGHT,
        text: '',
        color,
        zIndex: nextZIndex++,
      };
      setNotes((prev) => {
        const next = [...prev, note];
        persist(next);
        return next;
      });
      api.createNote(note);
      return note;
    },
    [persist],
  );

  const updateNote = useCallback(
    (id: string, changes: Partial<Note>) => {
      setNotes((prev) => {
        const next = prev.map((n) => (n.id === id ? { ...n, ...changes } : n));
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const deleteNote = useCallback(
    (id: string) => {
      setNotes((prev) => {
        const next = prev.filter((n) => n.id !== id);
        persist(next);
        return next;
      });
      api.deleteNote(id);
    },
    [persist],
  );

  const bringToFront = useCallback(
    (id: string) => {
      const z = nextZIndex++;
      updateNote(id, { zIndex: z });
    },
    [updateNote],
  );

  return { notes, loaded, createNote, updateNote, deleteNote, bringToFront };
}
