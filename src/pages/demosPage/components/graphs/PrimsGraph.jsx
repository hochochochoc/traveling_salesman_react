import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { Play } from "lucide-react";
import { Pause } from "lucide-react";

// Simulated graph data
const graphData = [
  { id: 0, x: 130, y: 110 },
  { id: 1, x: 525, y: 230 },
  { id: 2, x: 190, y: 100 },
  { id: 3, x: 450, y: 340 },
  { id: 4, x: 560, y: 100 },
  { id: 5, x: 350, y: 150 },
  { id: 6, x: 50, y: 200 },
  { id: 7, x: 560, y: 50 },
  { id: 8, x: 70, y: 150 },
];

const paragraphs = [
  {
    id: 0,
    text: "How do we measure how good a solution from an algorithm is? The question of measurement is actually quite tricky within the context of the TSP.",
  },
  {
    id: 1,
    text: "With smaller graphs we can compare the calculated distance to that of the true optimal value.",
  },
  {
    id: 2,
    text: "We can evaluate the performance through the ratio between the algorithms cost to the optimal cost, which can also be converted into a percentage of the optimal value. ",
  },
  { id: 3, text: "But no workey when too many points" },
  {
    id: 4,
    text: "In practice what computer scientists tend to use to baseline the solution to the TSP is instead of trying to compare it to the optimal solution to instead compare it to a lower bound. ",
  },
  { id: 5, text: "lo que sea5" },
  { id: 6, text: "lo que sea6" },
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
      }, 2000);
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

  const getCurrentParagraphs = () => {
    return paragraphs.filter((p) => p.id <= currentStep);
  };

  // Stop the animation
  const stopAnimation = () => {
    setIsPlaying(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const resetVisualization = () => {
    setIsPlaying(true);
    setCurrentStep(0);
    setTreeEdges([]);
    d3.select(svgRef.current).selectAll("line").remove();
  };

  return (
    <div className="flex p-10">
      <div className="w-1/2">
        <h2 className="text-white">Prim's Algorithm Visualization (D3.js)</h2>
        <svg
          ref={svgRef}
          width="600"
          height="400"
          className="my-5 border border-gray-500"
        ></svg>

        <div className="mt-5 flex items-center space-x-3">
          <button
            onClick={resetVisualization}
            className="rounded-lg bg-slate-400 px-3 py-2 text-white active:scale-95"
          >
            Reset
          </button>

          <button
            onClick={() => {
              setIsPlaying(true);
              playAnimation();
            }}
            className="rounded-lg bg-slate-400 px-3 py-2 text-white active:scale-95"
          >
            <Play />
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              clearTimeout(timerRef.current);
            }}
            className="rounded-lg bg-slate-400 px-3 py-2 text-white active:scale-95"
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
          <p key={p.id}>{p.text}</p>
        ))}
      </div>
    </div>
  );
};

export default PrimsGraph;
