import { NOTE_COLORS } from '@/types';
import type { NoteColor } from '@/types';

interface Props {
  selected: NoteColor;
  onChange: (color: NoteColor) => void;
}

const colorKeys = Object.keys(NOTE_COLORS) as NoteColor[];

export function ColorPicker({ selected, onChange }: Props) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {colorKeys.map((color) => (
        <button
          key={color}
          title={color}
          onClick={() => onChange(color)}
          style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: NOTE_COLORS[color].header,
            border: color === selected ? '3px solid #333' : '2px solid rgba(0,0,0,0.2)',
            cursor: 'pointer',
            padding: 0,
            outline: 'none',
            transition: 'transform 0.15s',
            transform: color === selected ? 'scale(1.15)' : 'scale(1)',
          }}
        />
      ))}
    </div>
  );
}
