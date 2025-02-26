import axios, { AxiosResponse } from 'axios';

type RouteLeg = {
  duration: {
    value: number;
    text: string;
  };
  duration_in_traffic: {
    value: number;
    text: string;
  };
};

type Routes = {
  legs: RouteLeg[];
};

type GoogleMapsApiResponse = {
  status: string;
  routes: Routes[];
};

export async function fetchTrafficDelay(origin: string, destination: string): Promise<number> {
  try {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&departure_time=now&traffic_model=best_guess&key=${process.env.MAP_API_KEY}`;
    const response: AxiosResponse<GoogleMapsApiResponse> = await axios.get(url, {
      params: {
        origins: origin,
        destinations: destination,
        key: process.env.MAP_API_KEY,
        departure_time: 'now',
        traffic_model: 'best_guess',
      },
    });

    const data = response.data;

    if (data.status === 'OK') {
      return calculateTotalDelay(data.routes[0]);
    } else {
      throw new Error(`Error: Invalid Google maps API response`);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Failed to fetch traffic data');
    }
  }
}
export function calculateTotalDelay(data: Routes) {
  const duration = data.legs.reduce((sum, leg) => sum + leg.duration.value, 0); //  Normal duration in seconds
  const durationInTraffic = data.legs.reduce((sum, leg) => sum + leg.duration_in_traffic.value, 0); // Traffic-adjusted duration in seconds

  // Calculate total delay in seconds (traffic-adjusted duration - normal duration)
  const delay = durationInTraffic - duration;

  // Convert delay to minutes
  return Math.floor(delay / 60);
}
