import React, { useState, useEffect, useRef, useContext } from "react";
import * as d3 from "d3";
import { Play, Pause } from "lucide-react";
import { DemosContext } from "../../context/DemosContext";
import { ChevronRight, ChevronLeft } from "lucide-react";

// Simulated graph data

// Function to calculate distance between two points
const distance = (a, b) => {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
};

const Graph = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 450);
  const {
    initialGraphData,
    primsMST,
    kruskalsMST,
    nearestNeighborTSP,
    validationSelection,
    algorithmSelection,
    activeSection,
  } = useContext(DemosContext);
  const { getParagraphs } = useContext(DemosContext);
  const paragraphs = getParagraphs();
  const [graphData, setGraphData] = useState([...initialGraphData]);
  const [currentStep, setCurrentStep] = useState(0);
  const svgRef = useRef(null);
  const [treeEdges, setTreeEdges] = useState([]);
  const timerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [edges, setEdges] = useState([]);
  const [stepsIsOpen, setStepsIsOpen] = useState(false);
  const popoverRef = useRef(null);
  const [direction, setDirection] = useState("left");
  const [totalLength, setTotalLength] = useState(0);

  // calculate total length
  useEffect(() => {
    // Calculate total length based on current step
    const newTotalLength = treeEdges.reduce((sum, edge) => {
      const fromNode = graphData[edge[0]];
      const toNode = graphData[edge[1]];
      return sum + distance(fromNode, toNode);
    }, 0);

    setTotalLength(newTotalLength);
  }, [currentStep, treeEdges, graphData]);

  // Update isMobile state based on window size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 450);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    resetVisualization();
  }, [validationSelection, algorithmSelection]);

  let vertexRadius = isMobile ? 8 : 5;
  let graphFontSize = isMobile ? "20px" : "12px";
  let edgeSize = isMobile ? 5 : 3;
  let offset = isMobile ? 25 : 15;

  // Calculate MST edges
  useEffect(() => {
    if (activeSection === "algorithms") {
      console.log("active section algorithm correctly detected");
      if (algorithmSelection === "Nearest") {
        console.log("NN correctly sent to graph");
        const mstEdges = nearestNeighborTSP(graphData);
        setEdges(mstEdges);
      }
    }

    if (activeSection === "validation") {
      if (validationSelection === "Prims") {
        const mstEdges = primsMST(graphData);
        setEdges(mstEdges);
      }
      if (validationSelection === "Kruskals") {
        const mstEdges = kruskalsMST(graphData);
        setEdges(mstEdges);
      }
    }
  }, [
    graphData,
    validationSelection,
    algorithmSelection,
    primsMST,
    kruskalsMST,
    nearestNeighborTSP,
  ]);

  // Initialize the graph with drag behavior
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("viewBox", "0 0 600 400");

    const drag = d3
      .drag()
      .on("start", (event, d) => {
        if (currentStep === 0 && !isPlaying) {
          d3.select(event.sourceEvent.target).raise().attr("stroke", "black");
        }
      })
      .on("drag", (event, d) => {
        if (currentStep === 0 && !isPlaying) {
          d3.select(event.sourceEvent.target)
            .attr("cx", (d.x = event.x))
            .attr("cy", (d.y = event.y));
        }
      })
      .on("end", (event, d) => {
        if (currentStep === 0 && !isPlaying) {
          const updatedGraph = graphData.map((node) =>
            node.id === d.id ? { ...node, x: d.x, y: d.y } : node,
          );
          setGraphData(updatedGraph);
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
      .attr("r", vertexRadius)
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
      .attr("font-size", graphFontSize)
      .attr("fill", "white");

    // Update edges
    updateEdges();
  }, [graphData, currentStep, isPlaying]);

  // Function to update edges
  const updateEdges = () => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("line").remove();

    treeEdges.forEach((edge) => {
      const fromNode = graphData[edge[0]];
      const toNode = graphData[edge[1]];
      const weight = distance(fromNode, toNode).toFixed(0);

      svg
        .append("line")
        .attr("x1", fromNode.x)
        .attr("y1", fromNode.y)
        .attr("x2", toNode.x)
        .attr("y2", toNode.y)
        .attr("stroke", "#FFFF99")
        .attr("stroke-width", edgeSize);

      const midX = (fromNode.x + toNode.x) / 2;
      const midY = (fromNode.y + toNode.y) / 2;
      const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x);

      const textX = midX + offset * Math.cos(angle + Math.PI / 2);
      const textY = midY + offset * Math.sin(angle + Math.PI / 2);

      svg
        .append("text")
        .attr("x", textX)
        .attr("y", textY)
        .attr("fill", "#FFFF99")
        .attr("font-size", graphFontSize)
        .attr("text-anchor", "middle")
        .text(weight);
    });
  };

  // Update edges when treeEdges change
  useEffect(() => {
    updateEdges();
  }, [treeEdges]);

  // Animation logic
  useEffect(() => {
    if (isPlaying && currentStep < edges.length) {
      timerRef.current = setTimeout(() => {
        setTreeEdges((prevEdges) => [...prevEdges, edges[currentStep]]);
        setCurrentStep((prevStep) => prevStep + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, currentStep, edges]);

  const playAnimation = () => {
    setIsPlaying(true);
  };

  const stopAnimation = () => {
    setIsPlaying(false);
  };

  const resetVisualization = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setTreeEdges([]);
    setGraphData([...initialGraphData]);
  };

  const handleStepClick = (step) => {
    setIsPlaying(false);
    setDirection(step > currentStep ? "left" : "right");
    const newTreeEdges = edges.slice(0, step);
    setTreeEdges(newTreeEdges);
    setCurrentStep(step);
  };

  return (
    <div className="flex flex-col py-4 lg:flex-row lg:p-10 lg:px-4">
      <div className="relative w-full lg:w-1/2">
        <svg
          ref={svgRef}
          width="100%"
          className="my-5 border border-gray-500 bg-gray-800 shadow-lg shadow-inherit"
          style={{ maxHeight: "400px", height: "100%" }}
        ></svg>
        <p
          style={{
            position: "absolute",
            top: "228px",
            left: "10px",
            color: "white",
            fontSize: "14px",
          }}
        >
          Total Edge Weight: {totalLength.toFixed(0)}
        </p>

        <div className="items-center justify-center lg:flex lg:space-x-10">
          <div className="mb-2 flex items-center justify-center space-x-3 lg:mb-0">
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
              }}
              className="rounded-lg bg-slate-400 px-3 py-2 text-egg active:scale-95 active:bg-slate-500"
            >
              <Pause />
            </button>
          </div>

          <div className="flex items-center justify-center space-x-2">
            <button
              disabled={currentStep === 0}
              onClick={() => handleStepClick(currentStep - 1)}
              className="rounded-full bg-gray-200 p-2 text-gray-600 disabled:opacity-50"
            >
              <ChevronLeft />
            </button>

            <div className="relative">
              <button
                onClick={() => setStepsIsOpen(!stepsIsOpen)}
                className="rounded-md bg-slate-500 px-3 py-2 text-white"
              >
                Step {currentStep}
              </button>

              {stepsIsOpen && (
                <div
                  ref={popoverRef}
                  className="absolute left-1/2 z-50 mt-2 -translate-x-1/2 transform rounded-full bg-egg p-1.5 shadow-lg lg:p-2"
                >
                  <div className="flex items-center space-x-1.5 lg:space-x-2">
                    {Array.from({ length: edges.length + 1 }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          handleStepClick(i);
                          setStepsIsOpen(false);
                        }}
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                          i === currentStep
                            ? "bg-slate-500 text-egg"
                            : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                        }`}
                      >
                        {i}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              disabled={currentStep === edges.length}
              onClick={() => handleStepClick(currentStep + 1)}
              className="rounded-full bg-gray-200 p-2 text-gray-600 disabled:opacity-50"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 w-full text-egg lg:ml-14 lg:mt-0 lg:w-1/2">
        <div className="flex flex-col items-center justify-center lg:space-y-8">
          <div className="relative h-20 w-full lg:overflow-hidden">
            {paragraphs.map((paragraph, i) => (
              <p
                key={i}
                className={`text-md absolute inset-0 flex items-start justify-center text-center font-medium text-egg transition-all duration-500 ease-in-out lg:text-lg ${
                  i === currentStep
                    ? `translate-x-0 opacity-100`
                    : i < currentStep
                      ? `${direction === "left" ? "-translate-x-full" : "translate-x-full"} opacity-0`
                      : `${direction === "left" ? "translate-x-full" : "-translate-x-full"} opacity-0`
                }`}
              >
                {paragraph.text}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Graph;
