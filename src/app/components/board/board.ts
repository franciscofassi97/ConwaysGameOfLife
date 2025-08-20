import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Cell } from '../../models/cell.model';
import { GameOfLifeService } from '../../services/game-of-life.service';

@Component({
  selector: 'app-board',
  imports: [],
  templateUrl: './board.html',
  styleUrl: './board.css'
})
export class Board implements AfterViewInit {

  @ViewChild('gameCanvas', {static : true}) canvasRef!: ElementRef<HTMLCanvasElement>;

  cellSize = 40;
  intervalId: any;

  constructor(private gameService : GameOfLifeService) {}

  ngAfterViewInit(): void {
    this.gameService.initializeGrid(20, 20);

    // Glider pattern
    this.gameService.setCellState(1, 2, true);
    this.gameService.setCellState(2, 3, true);
    this.gameService.setCellState(3, 1, true);
    this.gameService.setCellState(3, 2, true);
    this.gameService.setCellState(3, 3, true);
    this.drawGrid();
    this.startSimulation(); // Inicia el bucle automáticamente
  }

  drawGrid() {
    const grid = this.gameService.getGrid();
    const ctx = this.canvasRef.nativeElement.getContext('2d');

    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        for (let x = 0; x < grid.length; x++) {
      for (let y = 0; y < grid[x].length; y++) {
        ctx.fillStyle = grid[x][y].isAlive ? '#222' : '#eee';
        ctx.fillRect(
          y * this.cellSize,
          x * this.cellSize,
          this.cellSize,
          this.cellSize
        );
        ctx.strokeStyle = '#ccc';
        ctx.strokeRect(
          y * this.cellSize,
          x * this.cellSize,
          this.cellSize,
          this.cellSize
        );
      }
    }

  }

  startSimulation() {
    this.intervalId = setInterval(() => {
      this.gameService.nextGeneration();
      this.drawGrid();
    }, 200); // 200 ms entre generaciones
  }

  stopSimulation() {
    clearInterval(this.intervalId);
  }

}
