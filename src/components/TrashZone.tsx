import { TRASH_ZONE_HEIGHT } from '@/types';

interface Props {
  active: boolean;
}

export function TrashZone({ active }: Props) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: TRASH_ZONE_HEIGHT,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        background: active
          ? 'linear-gradient(to bottom, rgba(244,67,54,0.0), rgba(244,67,54,0.35))'
          : 'linear-gradient(to bottom, rgba(0,0,0,0.0), rgba(0,0,0,0.06))',
        transition: 'background 0.2s, opacity 0.3s',
        opacity: active ? 1 : 0,
        pointerEvents: 'none',
        zIndex: 999999,
        fontFamily: 'sans-serif',
        color: active ? '#c62828' : '#888',
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
      <span>Drop here to delete</span>
    </div>
  );
}
