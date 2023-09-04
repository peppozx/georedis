import { Request, Response} from 'express';
import { RadiusType } from '../enum/radius.type.enum';
import { findNearbyVehicles } from '../service/locationService';
import app from '../infrastructure/server/server';

function setupNearbyController() {
  app.get('/nearby-vehicles', async (req: Request, res: Response) => {
    const { latitude, longitude, radius } = req.query;

    const lat = parseFloat(latitude as string);
    const lon = parseFloat(longitude as string);
    const rad = parseFloat(radius as string);

    const nearbyVehicles = await findNearbyVehicles({ latitude: lat, longitude: lon }, rad, RadiusType.KM);
    return res.json(nearbyVehicles);
  });
}

export {
  setupNearbyController,
}

