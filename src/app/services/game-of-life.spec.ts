import { TestBed } from '@angular/core/testing';

import { GameOfLifeService } from './game-of-life.service';
import { GameRule } from '../models/game-rule.model';

describe('GameOfLifeService', () => {
  let service: GameOfLifeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameOfLifeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize grid with correct size and all cells dead', () => {
    service.initializeGrid(3, 3);
    const grid = service.getGrid();
    expect(grid.length).toBe(3);
    expect(grid[0].length).toBe(3);
    grid.forEach((row) => {
      row.forEach((cell) => {
        expect(cell.isAlive).toBeFalse(); // All cells dead
      });
    });
  });

  it('should update cell state when setCellState is called', () =>{
    service.initializeGrid(3, 3);
    service.setCellState(1,1, true);
    const grid = service.getGrid();
    expect(grid[1][1].isAlive).toBeTrue(); // Cell should be alive
  });

  it('should apply rules and update grid on nextGeneratoin', () => {
    service.initializeGrid(3,3);
    //Set up a block pattern (should remain stable)
    service.setCellState(1,1,true);
    service.setCellState(1,2,true);
    service.setCellState(2,1,true);
    service.setCellState(2,2,true);

    service.nextGeneration();
    const grid = service.getGrid();

    //All four cell should remain alive
    expect(grid[1][1].isAlive).toBeTrue();
    expect(grid[1][2].isAlive).toBeTrue();
    expect(grid[2][1].isAlive).toBeTrue();
    expect(grid[2][2].isAlive).toBeTrue();
  });

  it('should count alive neighbors correctly for center, edge, and corner cells', () => {
    service.initializeGrid(3, 3);
    // Activate some cells around (1,1)
    service.setCellState(0, 0, true);
    service.setCellState(0, 1, true);
    service.setCellState(1, 0, true);

    // Acces the private method using bracket notation (for testing purposes only)
    const countCenter = (service as any).countAliveNeighbors(1, 1);
    expect(countCenter).toBe(3); // (0,0), (0,1), (1,0) are alive


    // Top-left corner (0,0) can only have neighbors at (0,1), (1,0), (1,1)
    const countCorner = (service as any).countAliveNeighbors(0, 0);
    expect(countCorner).toBe(2);

    // Top edge center (0,1) neighbors: (0,0), (0,2), (1,0), (1,1), (1,2)
    const countEdge = (service as any).countAliveNeighbors(0, 1);
    expect(countEdge).toBe(2);
  });

  it('should set all cells to dead when clearGrid is called', () =>{
    service.initializeGrid(3, 3);
    // Activate some cells
    service.setCellState(0, 0, true);
    service.setCellState(1, 1, true);
    service.setCellState(2, 2, true);

    service.clearGrid();

    const grid = service.getGrid();
    grid.forEach((row) => {
      row.forEach((cell) => {
        expect(cell.isAlive).toBeFalse(); // All cells should be dead
      });
    });
  });

  it('should apply new rule after setRule is called', () => {
    service.initializeGrid(3, 3);

    //Activate some cells
    service.setCellState(1, 1, true);

    //Create a new rule
    const alwaysAliveRule : GameRule = {
      apply: () => true
    };

    service.setRule(alwaysAliveRule);

    service.nextGeneration();
    const grid = service.getGrid();
    expect(grid[1][1].isAlive).toBeTrue();
  });

});
