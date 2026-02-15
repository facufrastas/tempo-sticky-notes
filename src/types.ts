export interface Note {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  color: NoteColor;
  zIndex: number;
}

export type NoteColor = 'yellow' | 'pink' | 'blue' | 'green' | 'orange' | 'purple';

export const NOTE_COLORS: Record<NoteColor, { bg: string; header: string; border: string }> = {
  yellow: { bg: '#fff9c4', header: '#ffee58', border: '#f9a825' },
  pink: { bg: '#f8bbd0', header: '#f06292', border: '#c2185b' },
  blue: { bg: '#bbdefb', header: '#42a5f5', border: '#1565c0' },
  green: { bg: '#c8e6c9', header: '#66bb6a', border: '#2e7d32' },
  orange: { bg: '#ffe0b2', header: '#ffa726', border: '#e65100' },
  purple: { bg: '#e1bee7', header: '#ab47bc', border: '#6a1b9a' },
};

export const DEFAULT_NOTE_WIDTH = 200;
export const DEFAULT_NOTE_HEIGHT = 200;
export const MIN_NOTE_WIDTH = 120;
export const MIN_NOTE_HEIGHT = 80;
export const TRASH_ZONE_HEIGHT = 80;
