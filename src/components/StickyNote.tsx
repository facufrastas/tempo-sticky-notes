import { useCallback, useEffect, useRef, useState } from 'react';
import { NOTE_COLORS, MIN_NOTE_WIDTH, MIN_NOTE_HEIGHT, TRASH_ZONE_HEIGHT } from '@/types';
import type { Note } from '@/types';

interface Props {
  note: Note;
  onUpdate: (id: string, changes: Partial<Note>) => void;
  onDelete: (id: string) => void;
  onBringToFront: (id: string) => void;
  onDragStateChange: (dragging: boolean, noteId: string) => void;
}

type DragMode = 'move' | 'resize-se' | 'resize-e' | 'resize-s' | null;

export function StickyNote({ note, onUpdate, onDelete, onBringToFront, onDragStateChange }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const dragMode = useRef<DragMode>(null);
  const dragStart = useRef({ x: 0, y: 0, noteX: 0, noteY: 0, noteW: 0, noteH: 0 });

  const colors = NOTE_COLORS[note.color];

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, mode: DragMode) => {
      if (mode === 'move' && (e.target as HTMLElement).tagName === 'TEXTAREA') return;
      e.preventDefault();
      e.stopPropagation();
      onBringToFront(note.id);
      dragMode.current = mode;
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        noteX: note.x,
        noteY: note.y,
        noteW: note.width,
        noteH: note.height,
      };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      if (mode === 'move') {
        onDragStateChange(true, note.id);
      }
    },
    [note, onBringToFront, onDragStateChange],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragMode.current) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      const mode = dragMode.current;

      if (mode === 'move') {
        onUpdate(note.id, {
          x: dragStart.current.noteX + dx,
          y: dragStart.current.noteY + dy,
        });
      } else if (mode === 'resize-se') {
        onUpdate(note.id, {
          width: Math.max(MIN_NOTE_WIDTH, dragStart.current.noteW + dx),
          height: Math.max(MIN_NOTE_HEIGHT, dragStart.current.noteH + dy),
        });
      } else if (mode === 'resize-e') {
        onUpdate(note.id, {
          width: Math.max(MIN_NOTE_WIDTH, dragStart.current.noteW + dx),
        });
      } else if (mode === 'resize-s') {
        onUpdate(note.id, {
          height: Math.max(MIN_NOTE_HEIGHT, dragStart.current.noteH + dy),
        });
      }
    },
    [note.id, onUpdate],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      const wasMove = dragMode.current === 'move';
      dragMode.current = null;

      if (wasMove) {
        onDragStateChange(false, note.id);
        // Check if note is over the trash zone
        const viewportH = window.innerHeight;
        const noteCenterY = note.y + note.height / 2;
        if (noteCenterY > viewportH - TRASH_ZONE_HEIGHT) {
          onDelete(note.id);
          return;
        }
      }

      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    },
    [note, onDelete, onDragStateChange],
  );

  useEffect(() => {
    if (isEditing && textRef.current) {
      textRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div
      style={{
        position: 'absolute',
        left: note.x,
        top: note.y,
        width: note.width,
        height: note.height,
        zIndex: note.zIndex,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '2px 4px 12px rgba(0,0,0,0.18)',
        border: `1px solid ${colors.border}`,
        background: colors.bg,
        userSelect: 'none',
        overflow: 'hidden',
      }}
      onPointerDown={() => {
        onBringToFront(note.id);
      }}
    >
      {/* Header / drag handle */}
      <div
        style={{
          height: 28,
          background: colors.header,
          cursor: 'grab',
          display: 'flex',
          alignItems: 'center',
          padding: '0 8px',
          flexShrink: 0,
          borderBottom: `1px solid ${colors.border}`,
        }}
        onPointerDown={(e) => handlePointerDown(e, 'move')}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <span
          style={{
            fontSize: 12,
            color: 'rgba(0,0,0,0.5)',
            fontFamily: 'sans-serif',
            pointerEvents: 'none',
          }}
        >
          Drag to move
        </span>
      </div>

      {/* Body */}
      <div
        onDoubleClick={() => setIsEditing(true)}
      >
        {isEditing ? (
          <textarea
            ref={textRef}
            value={note.text}
            onChange={(e) => onUpdate(note.id, { text: e.target.value })}
            onBlur={() => setIsEditing(false)}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              background: 'transparent',
              resize: 'none',
              padding: 8,
              fontFamily: 'sans-serif',
              fontSize: 14,
              lineHeight: 1.4,
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              padding: 8,
              fontFamily: 'sans-serif',
              fontSize: 14,
              lineHeight: 1.4,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              overflow: 'auto',
              boxSizing: 'border-box',
              color: note.text ? '#333' : '#999',
              cursor: 'default',
            }}
            onPointerDown={(e) => handlePointerDown(e, 'move')}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            {note.text || 'Double-click to edit'}
          </div>
        )}
      </div>

      {/* Resize handles */}
      {/* Right edge */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 28,
          width: 6,
          bottom: 6,
          cursor: 'e-resize',
        }}
        onPointerDown={(e) => handlePointerDown(e, 'resize-e')}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />
      {/* Bottom edge */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: 6,
          right: 6,
          cursor: 's-resize',
        }}
        onPointerDown={(e) => handlePointerDown(e, 'resize-s')}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />
      {/* Bottom-right corner */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: 14,
          height: 14,
          cursor: 'se-resize',
        }}
        onPointerDown={(e) => handlePointerDown(e, 'resize-se')}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          style={{ position: 'absolute', right: 1, bottom: 1, opacity: 0.3 }}
        >
          <line x1="4" y1="14" x2="14" y2="4" stroke="#000" strokeWidth="1.5" />
          <line x1="8" y1="14" x2="14" y2="8" stroke="#000" strokeWidth="1.5" />
          <line x1="12" y1="14" x2="14" y2="12" stroke="#000" strokeWidth="1.5" />
        </svg>
      </div>
    </div>
  );
}
