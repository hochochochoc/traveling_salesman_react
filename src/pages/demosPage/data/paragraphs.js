export const paragraphs = {
  Prims: [
    {
      id: 0,
      text: "Prim’s algorithm is a greedy method to find the minimum spanning tree (MST), useful for TSP estimates.",
    },
    {
      id: 1,
      text: "The algorithm starts by choosing a vertex and picking the smallest edge to an unvisited vertex.",
    },
    {
      id: 2,
      text: "After the first edge, it picks the smallest edge that connects to the MST without forming a cycle.",
    },
    {
      id: 3,
      text: "As it adds more vertices, it keeps choosing the smallest edge, ensuring no cycles are formed.",
    },
    {
      id: 4,
      text: "The MST grows as the algorithm scans and adds the shortest available edge to the tree.",
    },
    {
      id: 5,
      text: "Prim’s algorithm focuses on small edges to keep the overall weight low, helping with TSP bounds.",
    },
    {
      id: 6,
      text: "It continues until all vertices are included, carefully selecting edges to minimize total cost.",
    },
    {
      id: 7,
      text: "The total weight of the MST provides an estimate for the TSP lower bound, but it's not the optimal route.",
    },
    {
      id: 8,
      text: "Prim’s algorithm is useful for MSTs and TSP bounds, but further work is needed for the best tour.",
    },
  ],
  Kruskals: [
    {
      id: 0,
      text: "Kruskal’s algorithm is a greedy way to find the minimum spanning tree (MST), useful for TSP estimates.",
    },
    {
      id: 1,
      text: "It starts by sorting all edges by weight, choosing the smallest edge that doesn’t form a cycle.",
    },
    {
      id: 2,
      text: "The algorithm adds the next smallest edge, ensuring no cycles, and repeats until a tree forms.",
    },
    {
      id: 3,
      text: "If an edge would create a cycle, it’s skipped. The algorithm tracks connected components to prevent loops.",
    },
    {
      id: 4,
      text: "As edges are added, components merge, making sure the tree grows without unnecessary loops.",
    },
    {
      id: 5,
      text: "Kruskal’s method uses the sorted edge list, minimizing the tree’s weight without recalculating.",
    },
    {
      id: 6,
      text: "When all vertices connect, the MST is complete, giving an estimate for the TSP by summing the edge weights.",
    },
    {
      id: 7,
      text: "The MST provides a lower bound for TSP but not an optimal route. Further steps are needed for the full tour.",
    },
    {
      id: 8,
      text: "Kruskal’s algorithm is effective for the MST, offering a lower bound for TSP, but more is needed to solve it.",
    },
  ],
  Greedy: [
    {
      id: 0,
      text: "The greedy algorithm solves TSP by picking the shortest edges one by one, forming a loop.",
    },
    {
      id: 1,
      text: "It starts by selecting the shortest edge, which connects two points to begin the tour.",
    },
    {
      id: 2,
      text: "Next, it picks the shortest edge linking a new point to a visited one, avoiding small loops.",
    },
    {
      id: 3,
      text: "The process repeats, adding the smallest edge without forming invalid loops or sub-tours.",
    },
    {
      id: 4,
      text: "The algorithm ensures no point is revisited until all points are connected into one tour.",
    },
    {
      id: 5,
      text: "It chooses small edges but avoids closing loops too early, which could ruin the full tour.",
    },
    {
      id: 6,
      text: "As fewer points remain, it focuses on linking them without making incomplete sub-tours.",
    },
    {
      id: 7,
      text: "When only two points are left, the algorithm connects them to visited points and completes the tour.",
    },
    {
      id: 8,
      text: "Though fast, the greedy approach misses better routes, as it focuses only on short-term gains.",
    },
    {
      id: 9,
      text: "It’s quick and simple, but its focus on short edges often stops it from finding the best solution.",
    },
  ],
  Nearest: [
    {
      id: 0,
      text: "The nearest neighbor algorithm is a simple heuristic for solving the traveling salesman problem (TSP). ",
    },
    {
      id: 1,
      text: "The algorithm starts by selecting an arbitrary vertex as the starting point. ",
    },

    {
      id: 2,
      text: "It builds a solution by iteratively visiting the closest unvisited vertex.",
    },
    {
      id: 3,
      text: "The process continues, with each step involving selecting the nearest unvisited vertex.",
    },

    {
      id: 4,
      text: "This ensures that short edges are prioritized, keeping the path length minimal at each step.",
    },
    {
      id: 5,
      text: "While the nearest neighbor method is efficient, it often focuses too much on short-term gains.",
    },
    {
      id: 6,
      text: "Running the algorithm from different starting points can yield different results, with varying tour lengths.",
    },
    {
      id: 7,
      text: "When only one vertex remains, the algorithm completes the tour by returning to the starting point.",
    },
    {
      id: 8,
      text: "The nearest neighbor approach offers a quick and intuitive solution for the TSP.",
    },
    {
      id: 9,
      text: " While it’s not always optimal, it's useful in cases where speed is prioritized over accuracy.",
    },
  ],
  TwoOpt: [
    {
      id: 0,
      text: "Two-Opt is a simple algorithm that improves a TSP tour by removing crossings in the path.",
    },
    {
      id: 1,
      text: "It starts with a full tour, often built using a heuristic like nearest neighbor, and improves from there.",
    },
    {
      id: 2,
      text: "Two-Opt swaps two edges in the tour, which removes crossings and can make the tour shorter.",
    },
    {
      id: 3,
      text: "After each swap, the new tour is checked. The process repeats until no better tour is found.",
    },
    {
      id: 4,
      text: "The algorithm stops when a full pass finds no shorter tour. The best tour is kept as the result.",
    },
    {
      id: 5,
      text: "It has a time complexity of O(n²), but works well when starting with a good initial solution.",
    },
    {
      id: 6,
      text: "Two-Opt is simple but effective, quickly improving tours and working well for many TSP cases.",
    },
    {
      id: 7,
      text: "Though it improves tours, Two-Opt only finds local optima. Advanced methods may be needed for global optima.",
    },
    {
      id: 8,
      text: "It's popular in logistics and routing, valued for balancing simplicity with effectiveness.",
    },
    {
      id: 9,
      text: "Two-Opt can be combined with methods like simulated annealing or genetic algorithms for better results.",
    },
  ],
  Christofides: [
    {
      id: 0,
      text: "Christofides' algorithm solves TSP by finding a tour within 1.5 times the optimal length.",
    },
    {
      id: 1,
      text: "It starts by creating a minimum spanning tree (MST), connecting all points with minimal edge weight.",
    },
    {
      id: 2,
      text: "Then, it finds vertices in the MST with odd degrees. These will be paired later to form an Eulerian graph.",
    },
    {
      id: 3,
      text: "Next, it adds edges to match all odd-degree vertices, creating pairs without forming any cycles.",
    },
    {
      id: 4,
      text: "Combining the MST and the matching forms an Eulerian graph, where all vertices have even degrees.",
    },
    {
      id: 5,
      text: "An Eulerian circuit is then traced, visiting every edge once without repeating any paths.",
    },
    {
      id: 6,
      text: "The Eulerian circuit is converted into a Hamiltonian circuit, visiting each point exactly once.",
    },
    {
      id: 7,
      text: "Shortcutting removes repeated visits while keeping the order. This gives the final TSP solution.",
    },
    {
      id: 8,
      text: "The result is a tour within 1.5 times the optimal length, balancing speed and accuracy.",
    },
    {
      id: 9,
      text: "Christofides' algorithm is practical for large problems, offering a good approximation for TSP.",
    },
  ],
};
