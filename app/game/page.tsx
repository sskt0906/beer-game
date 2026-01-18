'use client';

// featuresから機能を呼び出す
import { useBeerGame } from '@/features/beer-game/hooks/useBeerGame';
import { BeerGlass } from '@/features/beer-game/components/BeerGlass';
import { GameOverlay } from '@/features/beer-game/components/GameOverlay';
import Link from 'next/link';

export default function GamePage() {
  const { 
    gameState, 
    liquidLevel, 
    foamLevel, 
    result, 
    startPouring, 
    stopPouring 
  } = useBeerGame();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white touch-none relative overflow-hidden">
      
      {/* 戻るボタン */}
      <div className="absolute top-4 left-4 z-50">
        <Link href="/" className="text-sm text-gray-400 hover:text-white">
          ← MENU
        </Link>
      </div>

      {/* ゲーム本体 */}
      <div className="relative z-10 mt-20">
        <BeerGlass 
          liquidLevel={liquidLevel} 
          foamLevel={foamLevel} 
          rank={result?.rank || null} 
        />
      </div>

      <GameOverlay gameState={gameState} result={result} currentLevel={liquidLevel + foamLevel} />

      {/* 操作エリア */}
      <div 
        className="fixed inset-0 z-40 cursor-pointer"
        onMouseDown={(e) => { e.preventDefault(); startPouring(); }}
        onMouseUp={(e) => { e.preventDefault(); stopPouring(); }}
        onMouseLeave={(e) => { e.preventDefault(); stopPouring(); }}
        onTouchStart={(e) => { e.preventDefault(); startPouring(); }}
        onTouchEnd={(e) => { e.preventDefault(); stopPouring(); }}
      />
      
      {/* 背景 */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 to-slate-950"></div>
    </div>
  );
}