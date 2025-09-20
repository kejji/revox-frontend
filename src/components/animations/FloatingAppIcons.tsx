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
    // Generate unique floating and shooting star icons
    const generateIcons = () => {
      const shuffledIcons = [...appIcons].sort(() => Math.random() - 0.5); // Shuffle icons
      const newIcons: FloatingIcon[] = [];
      
      // Regular floating icons (6 icons)
      for (let i = 0; i < 6; i++) {
        newIcons.push({
          id: i,
          icon: shuffledIcons[i],
          x: Math.random() * 100,
          y: Math.random() * 60, // Constrain to top 60% of hero area
          size: 20 + Math.random() * 15, // 20-35px
          speed: 0.1 + Math.random() * 0.15, // 0.1-0.25 speed (medium speed)
          direction: Math.random() * Math.PI * 2,
          opacity: 0.15 + Math.random() * 0.25, // 0.15-0.4 opacity
          type: 'floating'
        });
      }
      
      // Shooting star icons (4 icons)
      for (let i = 6; i < 10; i++) {
        const startFromLeft = Math.random() > 0.5;
        newIcons.push({
          id: i,
          icon: shuffledIcons[i],
          x: startFromLeft ? -10 : 110,
          y: Math.random() * 50 + 5, // Start from 5-55% height in hero area
          size: 16 + Math.random() * 12, // 16-28px
          speed: 0.5 + Math.random() * 0.5, // 0.5-1.0 speed (medium-fast)
          direction: startFromLeft ? 0.1 + Math.random() * 0.2 : Math.PI - 0.2 + Math.random() * 0.2, // Slight angle
          opacity: 0.2 + Math.random() * 0.3, // 0.2-0.5 opacity
          type: 'shooting',
          trail: true
        });
      }
      
      setIcons(newIcons);
    };

    generateIcons();

    // Animate icons with slower interval
    const animateIcons = () => {
      setIcons(prevIcons =>
        prevIcons.map(icon => {
          if (icon.type === 'floating') {
            // Regular floating movement
            return {
              ...icon,
              x: (icon.x + Math.cos(icon.direction) * icon.speed + 100) % 100,
              y: (icon.y + Math.sin(icon.direction) * icon.speed + 60) % 60, // Keep within hero area
            };
          } else {
            // Shooting star movement
            const newX = icon.x + Math.cos(icon.direction) * icon.speed;
            const newY = icon.y + Math.sin(icon.direction) * icon.speed;
            
            // Reset shooting star when it goes off screen
            if (newX < -15 || newX > 115 || newY < -15 || newY > 60) { // Constrain to hero area
              const startFromLeft = Math.random() > 0.5;
              // Use a different icon from the unused ones
              const usedIcons = prevIcons.filter(i => i.type === 'shooting').map(i => i.icon);
              const availableIcons = appIcons.filter(ai => !usedIcons.some(ui => ui.src === ai.src));
              const newIcon = availableIcons.length > 0 ? availableIcons[Math.floor(Math.random() * availableIcons.length)] : appIcons[Math.floor(Math.random() * appIcons.length)];
              
              return {
                ...icon,
                x: startFromLeft ? -10 : 110,
                y: Math.random() * 50 + 5, // Reset within hero area
                direction: startFromLeft ? 0.1 + Math.random() * 0.2 : Math.PI - 0.2 + Math.random() * 0.2,
                icon: newIcon,
                opacity: 0.2 + Math.random() * 0.3
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

    const interval = setInterval(animateIcons, 60); // Medium interval (60ms)
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-x-0 top-0 h-[600px] overflow-hidden pointer-events-none">
      {icons.map((floatingIcon) => (
        <div
          key={floatingIcon.id}
          className="absolute transition-all duration-75 ease-linear"
          style={{
            left: `${floatingIcon.x}%`,
            top: `${floatingIcon.y * 0.6}%`, // Constrain to top 60% of hero area
            opacity: floatingIcon.opacity,
            transform: `translate(-50%, -50%)`, // Remove rotation
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