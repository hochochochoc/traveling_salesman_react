# Traveling Salesman Problem Visualizer

The traveling salesman problem (TSP) asks the question, "Given a list of cities and the distances between each pair of cities, what is the shortest possible route that visits each city and returns to the origin city?".

### This project

- Live at [travelingsalessim.com](https://travelingsalessim.com)
- The goal of this site is to be an **educational** resource to help visualize, learn, and develop different algorithms for the traveling salesman problem in a way that's easily accessible

### Heuristic algorithms

Heuristic algorithms attempt to find a good approximation of the optimal path within a more _reasonable_ amount of time.

**Construction** - Build a path

- Nearest Neighbor
- Greedy Heuristic

**Improvement** - Attempt to take an existing constructed path and improve on it

- 2-Opt Algorithm
- Christofides Algorithn

**Validation** - Calculate a definitive lower bound based off of which algorithms can be evaluated

- Prim's Algorithm
- Kruskal's Algorithm

## How to run

After having cloned the repository, run the following commands at the root:

```sh
Npm install
Npm run dev
```

## Dependencies

These are the main tools used to build this site:

- [reactjs](https://reactjs.org)
- [GeoDB Cities API](http://geodb-cities-api.wirefreethought.com/)
- [Firebase](https://console.firebase.google.com/)
- [ShadCN-ui](https://ui.shadcn.com/)
- [d3.js](https://d3js.org/)
- [Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)

## Contributing

Pull requests are always welcome! Also, feel free to raise any ideas, suggestions, or bugs as an issue.
