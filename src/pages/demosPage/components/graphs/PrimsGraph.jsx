import React, { useState, useEffect, useRef, useContext } from "react";
import * as d3 from "d3";
import { Play, Pause } from "lucide-react";
import { DemosContext } from "../../context/demosContext";

// Simulated graph data

// Function to calculate distance between two points
const distance = (a, b) => {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
};

// Prim's algorithm implementation
const primMST = (graph) => {
  const n = graph.length;
  const mst = [];
  const visited = new Set();
  let edges = [];

  // Function to add edges between a visited node and unvisited nodes
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

  // Start with a random vertex
  const startVertex = Math.floor(Math.random() * n);
  visited.add(startVertex);
  addEdges(startVertex);

  while (visited.size < n) {
    let minEdge = edges.reduce(
      (min, edge) =>
        !visited.has(edge.to) && edge.weight < min.weight ? edge : min,
      { weight: Infinity },
    );

    if (minEdge.weight === Infinity) {
      // If no valid edge found, exit (disconnected graph)
      break;
    }

    visited.add(minEdge.to);
    mst.push([minEdge.from, minEdge.to]);

    addEdges(minEdge.to);
    edges = edges.filter((edge) => !visited.has(edge.to));
  }

  return mst;
};

const PrimsGraph = () => {
  const { initialGraphData } = useContext(DemosContext);
  const { getParagraphs } = useContext(DemosContext);
  const paragraphs = getParagraphs();
  const [graphData, setGraphData] = useState([...initialGraphData]);
  const [currentStep, setCurrentStep] = useState(0);
  const svgRef = useRef(null);
  const [treeEdges, setTreeEdges] = useState([]);
  const timerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [edges, setEdges] = useState([]);

  // Calculate MST edges
  useEffect(() => {
    const mstEdges = primMST(graphData);
    setEdges(mstEdges);
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
      svg
        .append("line")
        .attr("x1", graphData[edge[0]].x)
        .attr("y1", graphData[edge[0]].y)
        .attr("x2", graphData[edge[1]].x)
        .attr("y2", graphData[edge[1]].y)
        .attr("stroke", "#FFFF99")
        .attr("stroke-width", 2);
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

export default PrimsGraph;
