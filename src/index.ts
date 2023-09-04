
import { setupNearbyController } from './controller/vehicles-search.controller';
import { setupMQTTController } from './controller/vehicles-update.controller';
import { setupGridCells } from './helpers/grid';

setupGridCells()
  .then(() => {
    setupNearbyController();
    setupMQTTController();
  });