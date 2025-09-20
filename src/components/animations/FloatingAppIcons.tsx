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
}

export function FloatingAppIcons() {
  const [icons, setIcons] = useState<FloatingIcon[]>([]);

  useEffect(() => {
    // Generate random floating icons
    const generateIcons = () => {
      const newIcons: FloatingIcon[] = [];
      for (let i = 0; i < 12; i++) {
        newIcons.push({
          id: i,
          icon: appIcons[Math.floor(Math.random() * appIcons.length)],
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: 20 + Math.random() * 20, // 20-40px
          speed: 0.2 + Math.random() * 0.5, // 0.2-0.7 speed
          direction: Math.random() * Math.PI * 2,
          opacity: 0.1 + Math.random() * 0.3 // 0.1-0.4 opacity
        });
      }
      setIcons(newIcons);
    };

    generateIcons();

    // Animate icons
    const animateIcons = () => {
      setIcons(prevIcons =>
        prevIcons.map(icon => ({
          ...icon,
          x: (icon.x + Math.cos(icon.direction) * icon.speed + 100) % 100,
          y: (icon.y + Math.sin(icon.direction) * icon.speed + 100) % 100,
        }))
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
          className="absolute transition-all duration-[50ms] ease-linear"
          style={{
            left: `${floatingIcon.x}%`,
            top: `${floatingIcon.y}%`,
            opacity: floatingIcon.opacity,
            transform: `translate(-50%, -50%)`,
          }}
        >
          <img
            src={floatingIcon.icon.src}
            alt={floatingIcon.icon.alt}
            className="rounded-lg"
            style={{
              width: `${floatingIcon.size}px`,
              height: `${floatingIcon.size}px`,
            }}
          />
        </div>
      ))}
    </div>
  );
}