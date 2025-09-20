import { useEffect, useState } from 'react';
import bforbankIcon from '@/assets/app-icons/bforbank.png';
import boursobankIcon from '@/assets/app-icons/boursobank.png';
import bunqIcon from '@/assets/app-icons/bunq.png';
import hellobankIcon from '@/assets/app-icons/hellobank.jpeg';
import wiseIcon from '@/assets/app-icons/wise.png';
import revolutIcon from '@/assets/app-icons/revolut.png';
import qontoIcon from '@/assets/app-icons/qonto.png';
import mescomptesIcon from '@/assets/app-icons/mescomptes.jpeg';
import n26Icon from '@/assets/app-icons/n26.jpeg';
import fortuneoIcon from '@/assets/app-icons/fortuneo.jpeg';

const appIcons = [
  { src: bforbankIcon, alt: 'BforBank' },
  { src: boursobankIcon, alt: 'Boursobank' },
  { src: bunqIcon, alt: 'Bunq' },
  { src: hellobankIcon, alt: 'Hello Bank' },
  { src: wiseIcon, alt: 'Wise' },
  { src: revolutIcon, alt: 'Revolut' },
  { src: qontoIcon, alt: 'Qonto' },
  { src: mescomptesIcon, alt: 'Mes Comptes' },
  { src: n26Icon, alt: 'N26' },
  { src: fortuneoIcon, alt: 'Fortuneo' }
];

interface FloatingIcon {
  id: number;
  icon: typeof appIcons[0];
  x: number;
  y: number;
  size: number;
  speed: number;
  direction: number;
  opacity: number;
  type: 'floating' | 'shooting';
  trail?: boolean;
}

export function FloatingAppIcons() {
  const [icons, setIcons] = useState<FloatingIcon[]>([]);

  useEffect(() => {
    // Generate random floating and shooting star icons
    const generateIcons = () => {
      const newIcons: FloatingIcon[] = [];
      
      // Regular floating icons (8 icons)
      for (let i = 0; i < 8; i++) {
        newIcons.push({
          id: i,
          icon: appIcons[Math.floor(Math.random() * appIcons.length)],
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: 20 + Math.random() * 15, // 20-35px
          speed: 0.15 + Math.random() * 0.3, // 0.15-0.45 speed
          direction: Math.random() * Math.PI * 2,
          opacity: 0.1 + Math.random() * 0.25, // 0.1-0.35 opacity
          type: 'floating'
        });
      }
      
      // Shooting star icons (4 icons)
      for (let i = 8; i < 12; i++) {
        const startFromLeft = Math.random() > 0.5;
        newIcons.push({
          id: i,
          icon: appIcons[Math.floor(Math.random() * appIcons.length)],
          x: startFromLeft ? -10 : 110,
          y: Math.random() * 80 + 10, // Start from 10-90% height
          size: 16 + Math.random() * 12, // 16-28px
          speed: 1.5 + Math.random() * 2, // 1.5-3.5 speed (much faster)
          direction: startFromLeft ? 0.1 + Math.random() * 0.2 : Math.PI - 0.2 + Math.random() * 0.2, // Slight angle
          opacity: 0.2 + Math.random() * 0.4, // 0.2-0.6 opacity
          type: 'shooting',
          trail: true
        });
      }
      
      setIcons(newIcons);
    };

    generateIcons();

    // Animate icons
    const animateIcons = () => {
      setIcons(prevIcons =>
        prevIcons.map(icon => {
          if (icon.type === 'floating') {
            // Regular floating movement
            return {
              ...icon,
              x: (icon.x + Math.cos(icon.direction) * icon.speed + 100) % 100,
              y: (icon.y + Math.sin(icon.direction) * icon.speed + 100) % 100,
            };
          } else {
            // Shooting star movement
            const newX = icon.x + Math.cos(icon.direction) * icon.speed;
            const newY = icon.y + Math.sin(icon.direction) * icon.speed;
            
            // Reset shooting star when it goes off screen
            if (newX < -15 || newX > 115 || newY < -15 || newY > 115) {
              const startFromLeft = Math.random() > 0.5;
              return {
                ...icon,
                x: startFromLeft ? -10 : 110,
                y: Math.random() * 80 + 10,
                direction: startFromLeft ? 0.1 + Math.random() * 0.2 : Math.PI - 0.2 + Math.random() * 0.2,
                icon: appIcons[Math.floor(Math.random() * appIcons.length)],
                opacity: 0.2 + Math.random() * 0.4
              };
            }
            
            return {
              ...icon,
              x: newX,
              y: newY,
            };
          }
        })
      );
    };

    const interval = setInterval(animateIcons, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map((floatingIcon) => (
        <div
          key={floatingIcon.id}
          className={`absolute transition-all duration-[50ms] ease-linear ${
            floatingIcon.type === 'shooting' ? 'animate-pulse' : ''
          }`}
          style={{
            left: `${floatingIcon.x}%`,
            top: `${floatingIcon.y}%`,
            opacity: floatingIcon.opacity,
            transform: `translate(-50%, -50%) ${
              floatingIcon.type === 'shooting' ? `rotate(${floatingIcon.direction}rad)` : ''
            }`,
          }}
        >
          <img
            src={floatingIcon.icon.src}
            alt={floatingIcon.icon.alt}
            className={`rounded-lg ${
              floatingIcon.type === 'shooting' 
                ? 'shadow-lg shadow-primary/20 blur-[0.5px]' 
                : ''
            }`}
            style={{
              width: `${floatingIcon.size}px`,
              height: `${floatingIcon.size}px`,
            }}
          />
          {floatingIcon.trail && floatingIcon.type === 'shooting' && (
            <div
              className="absolute inset-0 rounded-lg opacity-30"
              style={{
                background: `linear-gradient(${floatingIcon.direction + Math.PI}rad, transparent, rgba(var(--primary-rgb), 0.3))`,
                width: `${floatingIcon.size * 2}px`,
                height: `${floatingIcon.size / 3}px`,
                transform: 'translate(-25%, 35%)',
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}