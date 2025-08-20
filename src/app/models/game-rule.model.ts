export interface GameRule {
  apply(currentState: boolean, aliveNeighbors: number): boolean;
}
