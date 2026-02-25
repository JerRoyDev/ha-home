// PhoneFrame.tsx - Wrapper för mobilskärmsutseende
import React from 'react';

interface PhoneFrameProps {
  children: React.ReactNode;
  size?: 'compact' | 'expanded';
  onClick?: () => void;
  className?: string;
}

const PhoneFrame: React.FC<PhoneFrameProps> = ({ children, size = 'compact', onClick, className = '' }) => {
  const isCompact = size === 'compact';

  return (
    <div
      onClick={onClick}
      className={`
        relative flex flex-col
        border-4 border-white/40 border-double
        shadow-3xl overflow-hidden
        rounded-xl
        ${
          isCompact
            ? 'w-[120px] h-[170px] rounded-phone cursor-pointer hover:animate-phone-pulse transition-shadow'
            : 'w-[340px] h-[680px] rounded-phone-lg'
        }
        ${className}
      `}
    >
      {/* Screen med nedtonad gradientbakgrund */}
      <div className='flex-1 overflow-hidden flex flex-col z-10 relative'>
        <div className='absolute inset-0 -z-10 bg-gradient-to-br from-white/40 via-blue-200/20 to-blue-500/10 rounded-[inherit] blur-[0.5px]' />
        {children}
      </div>

      {/* Bottom bezel absolut med mörkare genomskinlig bakgrund */}
      <div
        className={`absolute left-0 right-0 bottom-0 flex items-center justify-center ${isCompact ? 'pb-2 pt-1' : 'pb-4 pt-2'}`}
        style={{
          background: 'rgba(20,20,30,0.28)',
          borderBottomLeftRadius: isCompact ? 16 : 32,
          borderBottomRightRadius: isCompact ? 16 : 32,
        }}
      >
        <div className={`bg-muted-foreground/40 rounded-full ${isCompact ? 'w-10 h-1' : 'w-16 h-1.5'}`} />
      </div>
    </div>
  );
};

export default PhoneFrame;
