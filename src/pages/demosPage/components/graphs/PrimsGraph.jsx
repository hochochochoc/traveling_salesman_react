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
    id: 0, // 5-1: 183 m  \\ 5-4: 214 m  // 5-3: 219 m
    text: "How do we measure how good a solution from an algorithm is? ... The MST is defined as a collection of edges of a graph that connect all vertices, introduce no cycles or loops and also has minimum weight(cost/distance). This is a similar problem to the TSP, but finding the MST has several polynomial time algorithms. One efficient algorithm for finding the MST is called Prim's algorithm.",
  },
  {
    id: 1,
    text: "We start with a random vertex and at every step it considers the set of vertices as part of the tree and a set of vertices we've yet to encounter.",
  },
  {
    id: 2,
    text: "To determine the best edge to pick as first part of the tree, we simply take the minimum edge weight between these two sets.",
  },
  {
    id: 3,
    text: "Every time we add an edge we adjust the sets, moving the subsequent vertex accordingly.",
  },
  {
    id: 4,
    text: "By repeatedly applying this step until all vertices have been processed you are guaranteed to find the Minimum Spanning Tree.",
  },
  {
    id: 5,
    text: "Prim's Algorithm is a classic example of a greedy approach that provides the optimal solution, and an interesting result is that the MST is always a lower bound for the TSP.",
  },
  {
    id: 6,
    text: '- then he starts talking about the "1-Tree"',
  },
  { id: 7, text: "lo que sea7" },
  { id: 8, text: "lo que sea8" },
];

// Simulated edges for Prim's algorithm
const edges = [
  [6, 8],
  [8, 0],
  [0, 2],
  [2, 5],
  [5, 1],
  [1, 3],
  [1, 4],
  [4, 7],
];

const PrimsGraph = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const svgRef = useRef(null);
  const [treeEdges, setTreeEdges] = useState([]);
  const timerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

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
  }, [isPlaying, currentStep]);

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
    if (currentStep === 0) {
      // Show only the first paragraph when starting
      return [paragraphs[0]];
    } else if (currentStep === 1) {
      // Show all paragraphs except the first one after step 1
      return paragraphs.slice(1, currentStep + 1);
    }
    // Show paragraphs from step 2 onwards
    return paragraphs.slice(1, currentStep + 1);
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
        <h2 className="text-white">Prim's Algorithm </h2>
        <svg
          ref={svgRef}
          width="600"
          height="400"
          className="my-5 border border-gray-500"
        ></svg>

        <div className="mt-5 flex items-center space-x-3">
          <button
            onClick={resetVisualization}
            className="rounded-lg bg-slate-400 px-3 py-2 text-white active:scale-95 active:bg-slate-500"
          >
            Reset
          </button>

          <button
            onClick={() => {
              setIsPlaying(true);
              playAnimation();
            }}
            className="rounded-lg bg-slate-400 px-3 py-2 text-white active:scale-95 active:bg-slate-500"
          >
            <Play />
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              clearTimeout(timerRef.current);
            }}
            className="rounded-lg bg-slate-400 px-3 py-2 text-white active:scale-95 active:bg-slate-500"
          >
            <Pause />
          </button>
        </div>
        <div className="mt-5">
          {edges.map((_, index) => (
            <button
              key={index}
              onClick={() => handleStepClick(index)}
              className="m-1.5 rounded-lg px-3 py-1 text-white"
              style={{
                backgroundColor: currentStep === index ? "#007bff" : "#ccc",
              }}
            >
              {index === 0 ? "Start" : `Step ${index}`}
            </button>
          ))}
          <button
            onClick={() => handleStepClick(edges.length)}
            className="m-1.5 rounded-lg px-3 py-1 text-white"
            style={{
              backgroundColor:
                currentStep === edges.length ? "#007bff" : "#ccc",
            }}
          >
            Step {edges.length}
          </button>
        </div>
      </div>
      <div className="ml-14 mt-10 w-1/2 text-white">
        {getCurrentParagraphs().map((p) => (
          <p
            key={p.id}
            className={currentStep === p.id ? "text-white" : "text-gray-400"}
          >
            {p.text}
          </p>
        ))}
      </div>
    </div>
  );
};

export default PrimsGraph;
