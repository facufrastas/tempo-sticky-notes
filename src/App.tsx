import { useCallback, useState } from 'react';
import type { NoteColor } from '@/types';
import { useNotes } from '@/useNotes';
import { StickyNote } from '@components/StickyNote';
import { TrashZone } from '@components/TrashZone';
import { Toolbar } from '@components/Toolbar';

const TOOLBAR_HEIGHT = 48;

export default function App() {
  const { notes, loaded, createNote, updateNote, deleteNote, bringToFront } = useNotes();
  const [selectedColor, setSelectedColor] = useState<NoteColor>('yellow');
  const [isDragging, setIsDragging] = useState(false);

  const handleBoardClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target !== e.currentTarget) return;
      createNote(e.clientX, e.clientY, selectedColor);
    },
    [createNote, selectedColor],
  );

  const handleDragStateChange = useCallback((dragging: boolean) => {
    setIsDragging(dragging);
  }, []);

  if (!loaded) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          fontFamily: 'sans-serif',
          color: '#999',
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <>
      <Toolbar selectedColor={selectedColor} onColorChange={setSelectedColor} />
      <div
        style={{
          position: 'fixed',
          top: TOOLBAR_HEIGHT,
          left: 0,
          right: 0,
          bottom: 0,
          background: '#f0f0f0',
          backgroundImage:
            'radial-gradient(circle, #d0d0d0 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          overflow: 'hidden',
        }}
        onClick={handleBoardClick}
      >
        {notes.map((note) => (
          <StickyNote
            key={note.id}
            note={note}
            onUpdate={updateNote}
            onDelete={deleteNote}
            onBringToFront={bringToFront}
            onDragStateChange={handleDragStateChange}
          />
        ))}
      </div>
      <TrashZone active={isDragging} />
    </>
  );
}
