'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './FlowerAnimation.css';

interface FlowerGroupProps {
    mirrored?: boolean;
}

const FlowerGroup = ({ mirrored = false }: FlowerGroupProps) => {
    return (
        <div className={`flowers ${mirrored ? 'flowers--right' : ''}`}>
            {/* Flower 1 */}
            <div className="flower flower--1">
                <div className="flower__leafs flower__leafs--1">
                    <div className="flower__leaf flower__leaf--1"></div>
                    <div className="flower__leaf flower__leaf--2"></div>
                    <div className="flower__leaf flower__leaf--3"></div>
                    <div className="flower__leaf flower__leaf--4"></div>
                    <div className="flower__white-circle"></div>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className={`flower__light flower__light--${i}`}></div>
                    ))}
                </div>
                <div className="flower__line">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className={`flower__line__leaf flower__line__leaf--${i}`}></div>
                    ))}
                </div>
            </div>

            {/* Flower 2 */}
            <div className="flower flower--2">
                <div className="flower__leafs flower__leafs--2">
                    <div className="flower__leaf flower__leaf--1"></div>
                    <div className="flower__leaf flower__leaf--2"></div>
                    <div className="flower__leaf flower__leaf--3"></div>
                    <div className="flower__leaf flower__leaf--4"></div>
                    <div className="flower__white-circle"></div>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className={`flower__light flower__light--${i}`}></div>
                    ))}
                </div>
                <div className="flower__line">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`flower__line__leaf flower__line__leaf--${i}`}></div>
                    ))}
                </div>
            </div>

            {/* Flower 3 */}
            <div className="flower flower--3">
                <div className="flower__leafs flower__leafs--3">
                    <div className="flower__leaf flower__leaf--1"></div>
                    <div className="flower__leaf flower__leaf--2"></div>
                    <div className="flower__leaf flower__leaf--3"></div>
                    <div className="flower__leaf flower__leaf--4"></div>
                    <div className="flower__white-circle"></div>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className={`flower__light flower__light--${i}`}></div>
                    ))}
                </div>
                <div className="flower__line">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`flower__line__leaf flower__line__leaf--${i}`}></div>
                    ))}
                </div>
            </div>

            {/* G-Long */}
            <div className="grow-ans" style={{ '--d': '1.2s' } as React.CSSProperties}>
                <div className="flower__g-long">
                    <div className="flower__g-long__top"></div>
                    <div className="flower__g-long__bottom"></div>
                </div>
            </div>

            {/* Grass 1 */}
            <div className="growing-grass">
                <div className="flower__grass flower__grass--1">
                    <div className="flower__grass--top"></div>
                    <div className="flower__grass--bottom"></div>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className={`flower__grass__leaf flower__grass__leaf--${i}`}></div>
                    ))}
                    <div className="flower__grass__overlay"></div>
                </div>
            </div>

            {/* Grass 2 */}
            <div className="growing-grass">
                <div className="flower__grass flower__grass--2">
                    <div className="flower__grass--top"></div>
                    <div className="flower__grass--bottom"></div>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className={`flower__grass__leaf flower__grass__leaf--${i}`}></div>
                    ))}
                    <div className="flower__grass__overlay"></div>
                </div>
            </div>

            {/* G-Right 1 & 2 */}
            <div className="grow-ans" style={{ '--d': '2.4s' } as React.CSSProperties}>
                <div className="flower__g-right flower__g-right--1">
                    <div className="leaf"></div>
                </div>
            </div>
            <div className="grow-ans" style={{ '--d': '2.8s' } as React.CSSProperties}>
                <div className="flower__g-right flower__g-right--2">
                    <div className="leaf"></div>
                </div>
            </div>

            {/* G-Front */}
            <div className="grow-ans" style={{ '--d': '2.8s' } as React.CSSProperties}>
                <div className="flower__g-front">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className={`flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--${i}`}>
                            <div className="flower__g-front__leaf"></div>
                        </div>
                    ))}
                    <div className="flower__g-front__line"></div>
                </div>
            </div>

            {/* G-FR */}
            <div className="grow-ans" style={{ '--d': '3.2s' } as React.CSSProperties}>
                <div className="flower__g-fr">
                    <div className="leaf"></div>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className={`flower__g-fr__leaf flower__g-fr__leaf--${i}`}></div>
                    ))}
                </div>
            </div>

            {/* Long-G groups */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map((g) => (
                <div key={g} className={`long-g long-g--${g}`}>
                    {[0, 1, 2, 3].map((l) => (
                        <div key={l} className="grow-ans" style={{ '--d': `${3 + l * 0.2}s` } as React.CSSProperties}>
                            <div className={`leaf leaf--${l}`}></div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default function FlowerAnimation() {
    const router = useRouter();
    
    useEffect(() => {
        const timer = setTimeout(() => {
            document.body.classList.remove('not-loaded');
        }, 1000);

        // Add class on mount
        document.body.classList.add('not-loaded');

        return () => {
            clearTimeout(timer);
            document.body.classList.remove('not-loaded');
        };
    }, []);

    return (
        <div 
          className="flower-animation-container"
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000',
            overflow: 'hidden',
            perspective: '1000px',
            padding: '0 5vw',
            position: 'relative',
            margin: 0,
          }}
        >
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              style={{
                position: 'absolute',
                top: '2rem',
                left: '2rem',
                zIndex: 30,
                background: 'rgba(216, 180, 254, 0.2)',
                border: '2px solid #d8b4fe',
                color: '#d8b4fe',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontFamily: 'serif',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(216, 180, 254, 0.4)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(216, 180, 254, 0.2)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
              title="Kembali"
            >
              ← Kembali
            </button>
            
            <div className="night"></div>
            <div style={{
              position: 'absolute',
              bottom: '10vmin',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-around',
              width: '100%',
              height: '80%',
              zIndex: 5,
            }}>
              <FlowerGroup />
              <FlowerGroup mirrored />
            </div>
            
            {/* Center Text */}
            <div style={{
              position: 'absolute',
              top: '30%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              zIndex: 20,
              pointerEvents: 'none',
            }}>
            <h1
            style={{
                fontSize: '4vw',
                fontWeight: 'bold',
                color: '#d8b4fe',
                textShadow: '0 0 20px rgba(216, 180, 254, 0.6)',
                fontFamily: 'serif',
                letterSpacing: '2px',
                margin: 0,
                textAlign: 'center',
            }}
            >
            <span style={{ display: 'block' }}>
                Ennou Happy Finiarie
            </span>
            <span
                style={{
                display: 'block',
                fontSize: '2.5vw',
                opacity: 0.8,
                marginTop: '0.5rem',
                }}
            >
                My Kekasih
            </span>
            </h1>

            </div>
        </div>
    );
}
