import { v4 as uuidv4 } from 'uuid';
import redis from '../infrastructure/redis/client';
import { addVehicleLocation } from '../service/locationService';

let GRID_CELLS: GridCell[] = [];

export interface GridCell {
  id: string;
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

function generateGridCells(maxLat: number, maxLng: number, minLat: number, minLng: number, numRows: number, numCols: number): GridCell[] {
  const gridCells: GridCell[] = [];

  const latIncrement = (maxLat - minLat) / numRows;
  const lngIncrement = (maxLng - minLng) / numCols;

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const cell = {
        id: uuidv4(),
        minLat: minLat + row * latIncrement,
        maxLat: minLat + (row + 1) * latIncrement,
        minLng: minLng + col * lngIncrement,
        maxLng: minLng + (col + 1) * lngIncrement,
      };
      gridCells.push(cell);
    }
  }

  return gridCells;
}

function findGridCell(centerLat: number, centerLng: number, gridCells: Array<any>): GridCell | null {
  const matchingCell = gridCells.find(cell =>
    centerLat >= cell.minLat && centerLat < cell.maxLat &&
    centerLng >= cell.minLng && centerLng < cell.maxLng
  );

  return matchingCell || null;
}

async function setupGridCells(): Promise<void> {
  const gridCells = await redis.mget('grid_cells');
  if (gridCells && gridCells[0]) {
    const parsedGridCells = JSON.parse(gridCells[0]);
    GRID_CELLS = parsedGridCells;

    await addVehicleLocation({ id: `vehicle-${0}`, old: { latitude: 47.60619876995696131, longitude: -122.33210116624832153 }, current: { latitude: 67, longitude: 110 }});
  }

  if (!gridCells.length) {
    const newGridCells = generateGridCells(90, 180, -90, -180, 10, 10);
    await redis.mset('grid_cells', JSON.stringify(newGridCells));
  }
}

export {
  GRID_CELLS,
  findGridCell,
  setupGridCells,
}