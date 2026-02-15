import type { NoteColor } from '@/types';
import { ColorPicker } from './ColorPicker';

interface Props {
  selectedColor: NoteColor;
  onColorChange: (color: NoteColor) => void;
}

export function Toolbar({ selectedColor, onColorChange }: Props) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 48,
        background: '#fafafa',
        borderBottom: '1px solid #ddd',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: 16,
        zIndex: 1000000,
        fontFamily: 'sans-serif',
      }}
    >
      <span style={{ fontWeight: 600, fontSize: 16, color: '#333' }}>Sticky Notes</span>
      <div style={{ width: 1, height: 24, background: '#ddd' }} />
      <span style={{ color: '#666', fontSize: 13 }}>Click anywhere to add a note</span>
      <div style={{ width: 1, height: 24, background: '#ddd' }} />
      <ColorPicker selected={selectedColor} onChange={onColorChange} />
    </div>
  );
}
