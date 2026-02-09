'use client';

import FlowerAnimation from '@/components/FlowerAnimation';

export default function FlowerAnimationPage() {
  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 9999,
        backgroundColor: '#000',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
      }}
    >
      <FlowerAnimation />
    </div>
  );
}
