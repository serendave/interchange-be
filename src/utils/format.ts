import { Point } from 'geojson';
import { Location } from 'src/auth/dto';

export const convertLocationToPoint = (location: Location): Point => {
  const locationObject: Point = {
    type: 'Point',
    coordinates: [location?.longitude, location?.latitude],
  };

  return locationObject;
};
