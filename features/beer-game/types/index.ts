export type GameState = 'IDLE' | 'POURING' | 'SETTLING' | 'RESULT';

export type Rank = 'S' | 'A' | 'B' | 'GAMEOVER' | null;

export interface GameResult {
  rank: Rank;
  message: string;
  ratioDebug: string;
}