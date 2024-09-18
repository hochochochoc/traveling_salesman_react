import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { Play, Pause } from "lucide-react";

// Simulated graph data
const graphData = [
  { id: 0, x: 150, y: 110 },
  { id: 1, x: 510, y: 230 },
  { id: 2, x: 200, y: 100 },
  { id: 3, x: 440, y: 340 },
  { id: 4, x: 560, y: 100 },
  { id: 5, x: 350, y: 140 },
  { id: 6, x: 50, y: 250 },
  { id: 7, x: 550, y: 50 },
  { id: 8, x: 70, y: 150 },
];

const paragraphs = [
  {
    id: 0,
    text: "Prim's algorithm finds the Minimum Spanning Tree (MST) of a weighted undirected graph. It starts with an arbitrary node and grows the MST one edge at a time.",
  },
  {
    id: 1,
    text: "At each step, it considers all edges connecting the tree to nodes not yet in the tree, and selects the edge with the lowest weight.",
  },
  {
    id: 2,
    text: "This process continues until all nodes are included in the MST.",
  },
  {
    id: 3,
    text: "Prim's algorithm always selects the safest edge to add to the tree, making it a greedy algorithm.",
  },
  {
    id: 4,
    text: "The algorithm ensures that a cycle is never formed, as it only considers edges that connect to nodes not yet in the tree.",
  },
  {
    id: 5,
    text: "When complete, Prim's algorithm produces a Minimum Spanning Tree that connects all nodes with the minimum total edge weight.",
  },
];

// Function to calculate distance between two points
const distance = (a, b) => {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
};

// Correct Prim's algorithm implementation
const primMST = (graph) => {
  const n = graph.length;
  const mst = [];
  const visited = new Set();
  let edges = [];

  // Function to add edges for a visited node
  const addEdges = (nodeIndex) => {
    for (let i = 0; i < n; i++) {
      if (!visited.has(i)) {
        edges.push({
          from: nodeIndex,
          to: i,
          weight: distance(graph[nodeIndex], graph[i]),
        });
      }
    }
  };

  // Start with the first node
  visited.add(0);
  addEdges(0);

  while (visited.size < n) {
    // Find the edge with minimum weight
    let minEdge = edges.reduce(
      (min, edge) =>
        !visited.has(edge.to) && edge.weight < min.weight ? edge : min,
      { weight: Infinity },
    );

    // Add the new node to visited set
    visited.add(minEdge.to);
    mst.push([minEdge.from, minEdge.to]);

    // Add new edges from the newly visited node
    addEdges(minEdge.to);

    // Remove edges that would create a cycle
    edges = edges.filter((edge) => !visited.has(edge.to));
  }

  return mst;
};

const PrimsGraph = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const svgRef = useRef(null);
  const [treeEdges, setTreeEdges] = useState([]);
  const timerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [edges, setEdges] = useState([]);

  // Calculate MST edges
  useEffect(() => {
    const mstEdges = primMST(graphData);
    setEdges(mstEdges);
  }, []);

  // Initialize the graph
  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // Create nodes (points)
    svg
      .selectAll("circle")
      .data(graphData)
      .enter()
      .append("circle")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", 5)
      .attr("fill", "orange");

    // Add labels to the nodes
    svg
      .selectAll("text")
      .data(graphData)
      .enter()
      .append("text")
      .attr("x", (d) => d.x + 10)
      .attr("y", (d) => d.y - 10)
      .text((d) => d.id)
      .attr("font-size", "12px")
      .attr("fill", "white");

    return () => {
      svg.selectAll("*").remove();
    };
  }, []);

  // Function to animate the steps
  const playAnimation = () => {
    setIsPlaying(true);
    if (currentStep < edges.length) {
      timerRef.current = setTimeout(() => {
        setTreeEdges((prevEdges) => [...prevEdges, edges[currentStep]]);
        setCurrentStep((prevStep) => prevStep + 1);
      }, 1000);
    } else {
      stopAnimation();
    }
  };

  // Effect to run the animation when isPlaying is true
  useEffect(() => {
    if (isPlaying && currentStep < edges.length) {
      timerRef.current = setTimeout(() => {
        setTreeEdges((prevEdges) => [...prevEdges, edges[currentStep]]);
        setCurrentStep((prevStep) => prevStep + 1);
      }, 1500);
    } else if (!isPlaying) {
      clearTimeout(timerRef.current);
    }
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, currentStep, edges]);

  // Update the graph based on the current step
  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // Remove existing lines to redraw
    svg.selectAll("line").remove();

    // Draw edges up to the current step
    treeEdges.forEach((edge) => {
      svg
        .append("line")
        .attr("x1", graphData[edge[0]].x)
        .attr("y1", graphData[edge[0]].y)
        .attr("x2", graphData[edge[1]].x)
        .attr("y2", graphData[edge[1]].y)
        .attr("stroke", "yellow")
        .attr("stroke-width", 2);
    });
  }, [treeEdges]);

  // Handle clicking on a step button
  const handleStepClick = (step) => {
    setIsPlaying(false);
    const newTreeEdges = edges.slice(0, step);
    setTreeEdges(newTreeEdges);
    setCurrentStep(step);
  };

  // Get paragraphs to display
  const getCurrentParagraphs = () => {
    return paragraphs.slice(0, Math.min(currentStep + 1, paragraphs.length));
  };

  // Stop the animation
  const stopAnimation = () => {
    setIsPlaying(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  // Reset the visualization
  const resetVisualization = () => {
    setIsPlaying(true);
    setCurrentStep(0);
    setTreeEdges([]);
    d3.select(svgRef.current).selectAll("line").remove();
  };

  return (
    <div className="flex p-10">
      <div className="w-1/2">
        <h2 className="text-egg">Prim's Algorithm</h2>
        <svg
          ref={svgRef}
          width="600"
          height="400"
          className="my-5 border border-gray-500"
        ></svg>

        <div className="mt-5 flex items-center space-x-3">
          <button
            onClick={resetVisualization}
            className="rounded-lg bg-slate-400 px-3 py-2 text-egg active:scale-95 active:bg-slate-500"
          >
            Reset
          </button>

          <button
            onClick={() => {
              setIsPlaying(true);
              playAnimation();
            }}
            className="rounded-lg bg-slate-400 px-3 py-2 text-egg active:scale-95 active:bg-slate-500"
          >
            <Play />
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              clearTimeout(timerRef.current);
            }}
            className="rounded-lg bg-slate-400 px-3 py-2 text-egg active:scale-95 active:bg-slate-500"
          >
            <Pause />
          </button>
        </div>
        <div className="mt-5">
          {edges.map((_, index) => (
            <button
              key={index}
              onClick={() => handleStepClick(index)}
              className={
                currentStep === index
                  ? "bg-bluelight m-1.5 rounded-lg px-3 py-1 text-egg"
                  : "m-1.5 rounded-lg bg-gray-300 px-3 py-1 text-egg"
              }
            >
              {index === 0 ? "Start" : `Step ${index}`}
            </button>
          ))}
          <button
            onClick={() => handleStepClick(edges.length)}
            className={
              currentStep === edges.length
                ? "bg-bluelight m-1.5 rounded-lg px-3 py-1 text-egg"
                : "m-1.5 rounded-lg bg-gray-300 px-3 py-1 text-egg"
            }
          >
            Step {edges.length}
          </button>
        </div>
      </div>
      <div className="ml-14 mt-10 w-1/2 text-egg">
        {getCurrentParagraphs().map((p) => (
          <p
            key={p.id}
            className={currentStep >= p.id ? "text-egg" : "text-gray-400"}
          >
            {p.text}
          </p>
        ))}
      </div>
    </div>
  );
};

export default PrimsGraph;
