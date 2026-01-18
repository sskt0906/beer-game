import React from 'react';
import { GameState, GameResult, Rank } from '../types';

interface GameOverlayProps {
  gameState: GameState;
  result: GameResult | null;
  currentLevel: number;
}

export const GameOverlay: React.FC<GameOverlayProps> = ({ gameState, result, currentLevel }) => {
  
  const getRankColor = (rank: Rank) => {
    switch(rank) {
      case 'S': return 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]';
      case 'A': return 'text-green-400';
      case 'B': return 'text-blue-400';
      case 'GAMEOVER': return 'text-red-500';
      default: return 'text-white';
    }
  };

  return (
    <>
      {/* ----------------------------------
        1. 画面左上：判定基準リスト（プレゼン用）
        ----------------------------------
      */}
      <div className="absolute top-4 left-24 z-30 font-mono text-xs text-white/70 bg-black/40 p-3 rounded border border-white/10 pointer-events-none select-none">
        <p className="mb-1 font-bold text-white border-b border-white/20 pb-1">RANKING RULE</p>
        <div className="space-y-1">
          <p className="text-yellow-400"><span className="inline-block w-8">S</span> : 90% 〜 99%</p>
          <p className="text-green-400"><span className="inline-block w-8">A</span> : 70% 〜 89%</p>
          <p className="text-blue-400"><span className="inline-block w-8">B</span> : 〜 69%</p>
          <p className="text-red-500"><span className="inline-block w-8">OVER</span> : 100%</p>
        </div>
      </div>

      {/* ----------------------------------
        2. ヘッダー＆リアルタイム数値
        ----------------------------------
      */}
      <div className="absolute top-8 text-center z-20 w-full px-4 select-none pointer-events-none">
        <h1 className="text-3xl font-bold mb-2 tracking-wider text-yellow-500">
          注ぎの達人
          <span className="block text-sm text-yellow-200 opacity-80 mt-1">THE GOLDEN RATIO</span>
        </h1>

        {/* 注いでいる時だけ出るデカ文字％ */}
        {gameState === 'POURING' && (
           <div className="mt-8">
             <span className="text-6xl font-mono font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
               {Math.round(currentLevel||0)}
             </span>
             <span className="text-2xl ml-1 text-yellow-400 font-bold">%</span>
           </div>
        )}
        
        {/* リザルト表示 */}
        {gameState === 'RESULT' && result && (
          <div className="animate-bounce mt-8 bg-black/60 p-4 rounded-xl backdrop-blur-sm pointer-events-auto">
            <p className={`text-6xl font-black ${getRankColor(result.rank)}`}>{result.rank}</p>
            <p className="text-lg mt-2 font-bold whitespace-pre-wrap">{result.message}</p>
            <p className="text-xs mt-1 opacity-80 font-mono text-yellow-100">{result.ratioDebug}</p>
            <p className="text-xs mt-6 text-gray-400 animate-pulse">TAP SCREEN TO RETRY</p>
          </div>
        )}
      </div>

      {/* ----------------------------------
        3. 判定ライン（グラスに重ねる）
        ----------------------------------
      */}
      <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
         <div className="relative w-40 h-[300px] mt-20">
            
            {/* 🔴 MAX (100%) */}
            <div className="absolute bottom-[100%] w-full border-t-2 border-dashed border-red-500/80">
               <span className="absolute -top-5 right-0 text-[10px] text-red-500 font-bold bg-black/50 px-1 rounded">DEAD LINE</span>
            </div>

            {/* 🟡 S RANK (90%) */}
            <div className="absolute bottom-[90%] w-full border-t-2 border-dotted border-yellow-400/90">
               <span className="absolute -top-3 right-[-40px] text-xs text-yellow-400 font-bold w-10 text-left">
                 S <span className="text-[10px] opacity-70">90%</span>
               </span>
            </div>

            {/* 🟢 A RANK (70%) */}
            <div className="absolute bottom-[70%] w-full border-t border-dotted border-green-400/60">
               <span className="absolute -top-3 right-[-40px] text-xs text-green-400 font-bold w-10 text-left">
                 A <span className="text-[10px] opacity-70">70%</span>
               </span>
            </div>

         </div>
      </div>

      {/* ----------------------------------
        4. 背景・サーバーなど (変更なし)
        ----------------------------------
      */}
      <div className="absolute top-[calc(50%-200px)] left-1/2 -translate-x-1/2 w-8 h-24 bg-gray-700 rounded-b-lg z-0 shadow-lg border-x-2 border-gray-600 flex flex-col items-center justify-end pointer-events-none">
         <div className="w-4 h-6 bg-gray-500 rounded-b-md"></div>
      </div>
      
      {gameState === 'POURING' && (
        <div className="absolute top-[calc(50%-176px)] left-1/2 -translate-x-1/2 w-3 bg-yellow-400 h-96 z-0 opacity-80 animate-pulse pointer-events-none"></div>
      )}

      {/* フッター */}
      <div className="fixed bottom-12 left-0 w-full text-center pointer-events-none select-none z-30 text-white/80">
        {gameState === 'IDLE' && (
          <div className="animate-pulse">
            <div className="text-4xl mb-2">👆</div>
            <p className="font-bold tracking-widest text-sm">PRESS & HOLD</p>
          </div>
        )}
        {gameState === 'POURING' && (
          <div className="text-yellow-500 font-bold tracking-widest animate-pulse">POURING...</div>
        )}
      </div>
    </>
  );
};