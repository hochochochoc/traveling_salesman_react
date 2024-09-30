import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { Play, Pause } from "lucide-react";

// Simulated graph data
const initialGraphData = [
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
    text: "This is the other algorithm, Kruskal's algorithm.",
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

// Function to calculate distance between two points
const distance = (a, b) => {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
};

// Prim's algorithm implementation
// Maximum Spanning One-Tree algorithm implementation
// Kruskal's algorithm implementation
// Kruskal's algorithm implementation
const minSpanningOneTree = (graph) => {
  const edges = [];
  const n = graph.length;

  // Create all edges with their weights
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      edges.push({
        from: i,
        to: j,
        weight: distance(graph[i], graph[j]),
      });
    }
  }

  // Sort edges based on weight
  edges.sort((a, b) => a.weight - b.weight);

  const mst = [];
  const parent = Array(n).fill(-1); // -1 indicates that a node is its own parent

  // Helper functions for Union-Find
  const find = (parent, i) => {
    if (parent[i] === -1) return i;
    return find(parent, parent[i]);
  };

  const union = (parent, x, y) => {
    parent[x] = y;
  };

  // Iterate over edges and build the MST
  for (let edge of edges) {
    const { from, to } = edge;

    const rootFrom = find(parent, from);
    const rootTo = find(parent, to);

    // If they belong to different sets, include this edge in the MST
    if (rootFrom !== rootTo) {
      mst.push([from, to]);
      union(parent, rootFrom, rootTo); // Union the sets
    }
  }

  return mst;
};

const KruskalsGraph = () => {
  const [graphData, setGraphData] = useState([...initialGraphData]);
  const [currentStep, setCurrentStep] = useState(0);
  const svgRef = useRef(null);
  const [treeEdges, setTreeEdges] = useState([]);
  const timerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [edges, setEdges] = useState([]);

  // Calculate MST edges
  useEffect(() => {
    const oneTreeEdges = minSpanningOneTree(graphData);
    setEdges(oneTreeEdges);
  }, [graphData]);

  // Initialize the graph with drag behavior
  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // Clear existing content
    svg.selectAll("*").remove();

    // Set the viewBox to make the SVG responsive
    svg.attr("viewBox", "0 0 600 400");

    // Drag behavior
    const drag = d3
      .drag()
      .on("start", (event, d) => {
        if (currentStep === 0 && !isPlaying) {
          d3.select(event.sourceEvent.target).raise().attr("stroke", "black");
        }
      })
      .on("drag", (event, d) => {
        if (currentStep === 0 && !isPlaying) {
          // Update both x and y positions as the circle is dragged
          d3.select(event.sourceEvent.target)
            .attr("cx", (d.x = event.x))
            .attr("cy", (d.y = event.y));
        }
      })
      .on("end", (event, d) => {
        if (currentStep === 0 && !isPlaying) {
          // Update graphData with the new positions after dragging ends
          const updatedGraph = graphData.map((node) =>
            node.id === d.id ? { ...node, x: d.x, y: d.y } : node,
          );
          setGraphData(updatedGraph); // Save the updated positions
        }
      });

    // Create nodes (points)
    svg
      .selectAll("circle")
      .data(graphData)
      .enter()
      .append("circle")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", 5)
      .attr("fill", "orange")
      .call(drag);

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
  }, [graphData, currentStep, isPlaying]);

  // Animation logic
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

  useEffect(() => {
    if (isPlaying && currentStep < edges.length) {
      timerRef.current = setTimeout(() => {
        setTreeEdges((prevEdges) => [...prevEdges, edges[currentStep]]);
        setCurrentStep((prevStep) => prevStep + 1);
      }, 1000);
    } else if (!isPlaying) {
      clearTimeout(timerRef.current);
    }
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, currentStep, edges]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("line").remove();

    treeEdges.forEach((edge) => {
      const fromNode = graphData[edge[0]];
      const toNode = graphData[edge[1]];
      const weight = distance(fromNode, toNode).toFixed(0);

      svg
        .append("line")
        .attr("x1", graphData[edge[0]].x)
        .attr("y1", graphData[edge[0]].y)
        .attr("x2", graphData[edge[1]].x)
        .attr("y2", graphData[edge[1]].y)
        .attr("stroke", "#FFFF99")
        .attr("stroke-width", 2);

      const midX = (fromNode.x + toNode.x) / 2;
      const midY = (fromNode.y + toNode.y) / 2;

      const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x);

      // Offset to avoid overlapping (adjust these values as needed)
      const offset = 15;
      const textX = midX + offset * Math.cos(angle + Math.PI / 2);
      const textY = midY + offset * Math.sin(angle + Math.PI / 2);

      svg
        .append("text")
        .attr("x", textX)
        .attr("y", textY)
        .attr("fill", "#FFFF99")
        .attr("font-size", "12px")
        .attr("text-anchor", "middle")
        .text(weight);
    });
  }, [treeEdges]);

  const handleStepClick = (step) => {
    setIsPlaying(false);
    const newTreeEdges = edges.slice(0, step);
    setTreeEdges(newTreeEdges);
    setCurrentStep(step);
  };

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

  const stopAnimation = () => {
    setIsPlaying(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const resetVisualization = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setTreeEdges([]);
    setGraphData([...initialGraphData]);
    d3.select(svgRef.current).selectAll("line").remove();
  };

  return (
    <div className="flex flex-col p-4 lg:flex-row lg:p-10">
      <div className="w-full lg:w-1/2">
        <svg
          ref={svgRef}
          width="100%"
          className="my-5 border border-gray-500"
          style={{ maxHeight: "400px", height: "100%" }}
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

        <div className="mt-5 flex flex-wrap">
          {edges.map((_, index) => (
            <button
              key={index}
              onClick={() => handleStepClick(index)}
              className={
                currentStep === index
                  ? "m-1.5 rounded-lg bg-bluelight px-3 py-1 text-egg"
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
                ? "m-1.5 rounded-lg bg-bluelight px-3 py-1 text-egg"
                : "m-1.5 rounded-lg bg-gray-300 px-3 py-1 text-egg"
            }
          >
            Step {edges.length}
          </button>
        </div>
      </div>
      <div className="mt-10 w-full text-egg lg:ml-14 lg:mt-0 lg:w-1/2">
        {getCurrentParagraphs().map((p) => {
          console.log(`Paragraph ID: ${p.id}, Current Step: ${currentStep}`);
          return (
            <p
              key={p.id}
              className={currentStep <= p.id ? "text-egg" : "text-gray-400"}
            >
              {p.text}
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default KruskalsGraph;

// TODO:
// clean up to use components, context etc.
// algorithm should work correctly, with a random vertex??
// add visible lengths, display total cost/weight/length
// that stupid error where it deletes the graph when pressing start...
// optional: show how vertices move from unconnected set to connected one
