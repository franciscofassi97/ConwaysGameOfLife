import { GameRule } from "./game-rule.model";

export class ClassicConwayRule implements GameRule{
  apply(currentState: boolean, aliveNeighbors: number): boolean {
    // If the cell is alive
    if (currentState) {
      // Dies due to loneliness or overpopulation
      if(aliveNeighbors < 2 || aliveNeighbors > 3){
        return false;
      }
      // Stays alive
      return true;
    }else {
      // Born if it has exactly 3 alive neighbors
      if(aliveNeighbors === 3){
        return true;
      }
      // Remains dead
      return false;
    }
  }
}
