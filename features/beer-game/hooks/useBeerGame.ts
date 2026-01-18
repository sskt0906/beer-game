import { useState, useRef, useCallback, useEffect } from 'react';
import { GameState, GameResult, Rank } from '../types';

// ★プレゼン・デモ用調整版
const CONFIG = {
  // 速度は変えず、見やすいまま
  LIQUID_SPEED_PER_SEC: 15, 
  FOAM_SPEED_PER_SEC: 10,
  FOAM_START_THRESHOLD: 10, 

  // オーバーフローは100ジャスト（ここは厳密な方が盛り上がる）
  MAX_CAPACITY: 100, 
  
  PERFECT_RATIO: 0.7, 
  SETTLING_GROWTH: 0, 
};

export const useBeerGame = () => {
  const [gameState, setGameState] = useState<GameState>('IDLE');
  const [liquidLevel, setLiquidLevel] = useState(0);
  const [foamLevel, setFoamLevel] = useState(0);
  const [result, setResult] = useState<GameResult | null>(null);

  const liquidRef = useRef(0);
  const foamRef = useRef(0);
  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const resetGame = useCallback(() => {
    liquidRef.current = 0;
    foamRef.current = 0;
    lastTimeRef.current = 0;
    setLiquidLevel(0);
    setFoamLevel(0);
    setResult(null);
    setGameState('IDLE');
  }, []);

  const calculateResult = useCallback(() => {
    const liquid = liquidRef.current;
    const foam = foamRef.current;
    const total = liquid + foam;
    const ratio = total > 0 ? liquid / total : 0;
    
    const ratioDisplay = `Total:${Math.round(total)}% (Liq:${Math.round(ratio * 100)}:Foam:${Math.round((1 - ratio) * 100)})`;
    
    let rank: Rank = 'B';
    let message = '';

    if (total > CONFIG.MAX_CAPACITY) {
      rank = 'GAMEOVER';
      message = 'あふれちゃった...';
    } else if (total < 50) {
      // 50%未満は流石に少なすぎるので別メッセージでも良いが、今回はB統一でもOK
      rank = 'B';
      message = '全然足りない！（もっと攻めて）';
    } else {
      const diff = Math.abs(ratio - CONFIG.PERFECT_RATIO);
      
      // ▼▼▼ プレゼン用に分岐を明確化 ▼▼▼

      // 【Sランク】90%以上
      if (total >= 90) { 
         rank = 'S';
         message = '完璧だ...これぞ神泡！';
      } 
      // 【Aランク】70%〜89% (7割超えればOK。一番出しやすい範囲)
      else if (total >= 70) {
         rank = 'A';
         message = 'ナイス！美味しい一杯。';
      } 
      // 【Bランク】50%〜69% (守りに入るとこうなる、という例に最適)
      else {
         rank = 'B';
         message = '守りに入ったな...';
      }
    }

    setResult({ rank, message, ratioDebug: ratioDisplay });
  }, []);

  const startSettling = useCallback(() => {
    if (gameState !== 'POURING') return;
    setGameState('RESULT');
    calculateResult();
  }, [gameState, calculateResult]);

  const tick = useCallback(() => {
    if (gameState !== 'POURING') return;

    const now = performance.now();
    if (!lastTimeRef.current) {
      lastTimeRef.current = now;
      requestRef.current = requestAnimationFrame(tick);
      return;
    }

    let deltaTime = (now - lastTimeRef.current) / 1000;
    lastTimeRef.current = now;

    if (deltaTime > 0.1) deltaTime = 0.05;

    liquidRef.current += CONFIG.LIQUID_SPEED_PER_SEC * deltaTime;

    if (liquidRef.current > CONFIG.FOAM_START_THRESHOLD) {
      foamRef.current += CONFIG.FOAM_SPEED_PER_SEC * deltaTime;
    }
    
    const currentTotal = liquidRef.current + foamRef.current;
    
    setLiquidLevel(liquidRef.current);
    setFoamLevel(foamRef.current);

    // 100%超えで即死
    if (currentTotal > CONFIG.MAX_CAPACITY) {
      setGameState('RESULT');
      setResult({ 
        rank: 'GAMEOVER', 
        message: 'オーバーフロー！(欲張りすぎ)', 
        ratioDebug: `Total:${Math.round(currentTotal)}%` 
      });
      return;
    }

    requestRef.current = requestAnimationFrame(tick);
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'POURING') {
      lastTimeRef.current = 0;
      requestRef.current = requestAnimationFrame(tick);
      
      const handleGlobalUp = () => startSettling();
      window.addEventListener('mouseup', handleGlobalUp);
      window.addEventListener('touchend', handleGlobalUp);
      
      return () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        window.removeEventListener('mouseup', handleGlobalUp);
        window.removeEventListener('touchend', handleGlobalUp);
      };
    }
  }, [gameState, tick, startSettling]);

  return {
    gameState,
    liquidLevel,
    foamLevel,
    result,
    startPouring: () => {
      if (gameState === 'IDLE') {
          lastTimeRef.current = 0;
          setGameState('POURING');
      }
      if (gameState === 'RESULT') resetGame();
    },
    stopPouring: () => {
      if (gameState === 'POURING') startSettling();
    }
  };
};