type TrafficData = {
  data: {
    routes: {
      legs: [
        {
          duration_in_traffic: number;
        },
      ];
    }[];
  };
};
export const mockTrafficData = (): TrafficData => {
  return {
    data: {
      routes: [
        {
          legs: [
            {
              duration_in_traffic: 40,
            },
          ],
        },
      ],
    },
  };
};
