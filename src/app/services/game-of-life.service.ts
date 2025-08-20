import { Injectable } from '@angular/core';
import { GameRule } from '../models/game-rule.model';
import { ClassicConwayRule } from '../models/classic-conway-rule.model';
import { Cell } from '../models/cell.model';

@Injectable({
  providedIn: 'root'
})
export class GameOfLifeService {
  private rule : GameRule = new ClassicConwayRule();

  //The grid representing the board state
  private grid: Cell[][] = [];

  //Number of rows and columns (configurable) width and height
  private rows: number = 0;
  private cols: number = 0;

  //Initialize the grid with the given number of rows and columns. All cells start as dead (alive: false)
  initializeGrid(rows: number, cols: number ): void {
    this.rows = rows;
    this.cols = cols;
    this.grid = [];

    for (let i = 0; i < rows; i++) {
      const row: Cell[] = [];
      for (let j = 0; j < cols; j++) {
        row.push({ x: i, y: j, isAlive: false });
      }
      this.grid.push(row);
    }
  }

  //Sets the state of a sepecific cell (used for toggling cells from the UI)
  setCellState(x: number, y: number, alive: boolean): void {
    if(this.isValidPosition(x, y)){
      this.grid[x][y].isAlive = alive;
    }
  }

  // Checks if the given position is within the grid bounds.
  private isValidPosition(x: number, y: number): boolean {
    return x >= 0 && x < this.rows && y >= 0 && y < this.cols;
  }

  // Returns the current grid state. Useful for components to display the board.
  getGrid(): Cell[][] {
    return this.grid;
  }


  //Advances the grid to the next generation. Calculates the new state for each cell using the rule and alive
  // Calculates the new state for each cell using the rule and alive neighbors.
  nextGeneration() : void {
    const newGrid: Cell[][] = [];
    for (let x = 0; x < this.rows; x++) {
      const newRow: Cell[] = [];
      for (let y = 0; y < this.cols; y++) {
        const cell = this.grid[x][y];
        const aliveNeighbors = this.countAliveNeighbors(x, y);
        // Use the rule to determine the next state
        const newState = this.rule.apply(cell.isAlive, aliveNeighbors);
        newRow.push({ x, y, isAlive: newState });
      }
      newGrid.push(newRow);
    }
    this.grid = newGrid;
  }

  private countAliveNeighbors(x: number, y: number): number {
    let count = 0;
    // Iterate over the 8 neighbors
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue; // Skip the cell itself
        const nx = x + dx;
        const ny = y + dy;
        if (this.isValidPosition(nx, ny) && this.grid[nx][ny].isAlive) {
          count++;
        }
      }
    }
    return count;
  }

  // Clears the grid by setting all cells to dead.  Useful for restarting the game.
  clearGrid(): void {
    for (let x = 0; x < this.rows; x++) {
      for (let y = 0; y < this.cols; y++) {
        this.grid[x][y].isAlive = false;
      }
    }
  }

  // Allows changing the rule at runtime (Open/Closed Principle).
  setRule(rule: GameRule): void {
    this.rule = rule;
  }
}
