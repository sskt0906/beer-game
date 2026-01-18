import React from 'react';
import { Rank } from '../types';

interface BeerGlassProps {
  liquidLevel: number;
  foamLevel: number;
  rank: Rank;
}

export const BeerGlass: React.FC<BeerGlassProps> = ({ liquidLevel, foamLevel, rank }) => {
  const liquidHeight = `${Math.max(0, liquidLevel)}%`;
  const foamHeight = `${Math.max(0, foamLevel)}%`;

  return (
    <div 
      className="relative w-32 h-[300px] border-l-4 border-r-4 border-b-8 border-gray-200/50 bg-gray-800/30 rounded-b-xl backdrop-blur-sm z-10"
      style={{boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)'}}
    >
      <div className="absolute bottom-0 left-0 w-full h-full overflow-hidden rounded-b-lg">
        {/* 液体 */}
        <div 
          className="absolute bottom-0 w-full bg-yellow-500 transition-all duration-75 ease-linear will-change-[height]"
          style={{ height: liquidHeight }}
        >
          {/* 気泡テクスチャ（CSSグラデーションで代用） */}
          <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle,_rgba(255,255,255,0.8)_1px,_transparent_1px)] bg-[length:10px_10px]"></div>
        </div>

        {/* 泡 */}
        <div 
          className="absolute w-full bg-white transition-all duration-75 ease-linear will-change-[height,bottom]"
          style={{ bottom: liquidHeight, height: foamHeight }}
        >
           <div className="w-full h-full opacity-20 bg-[radial-gradient(circle,_#000_1px,_transparent_1px)] bg-[length:4px_4px]"></div>
        </div>
      </div>

      {/* GAMEOVER時の溢れエフェクト */}
      {rank === 'GAMEOVER' && (
        <div className="absolute -bottom-4 -left-4 -right-4 h-8 bg-yellow-200/50 blur-md rounded-full animate-pulse"></div>
      )}
      
      {/* 持ち手 */}
      <div className="absolute top-1/3 -right-10 w-10 h-32 border-r-8 border-t-8 border-b-8 border-gray-200/50 rounded-r-3xl"></div>
    </div>
  );
};