import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function BigO() {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 50, left: 60 };
    const width = 300 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Use linear scale for x-axis from 0 to 20
    const x = d3.scaleLinear().domain([0, 20]).range([0, width]);

    // Use symlog scale for y-axis to handle both small and large values
    const y = d3.scaleSymlog().domain([0, 1000]).range([height, 0]).constant(2); // Adjust this value to control the transition point

    const line = d3
      .line()
      .x((d) => x(d[0]))
      .y((d) => y(d[1]))
      .curve(d3.curveBasis);

    // Stirling's approximation for factorial
    const stirlingApprox = (n) => {
      if (n < 1) return 0;
      return Math.sqrt(2 * Math.PI * n) * Math.pow(n / Math.E, n);
    };

    const functions = [
      {
        name: "O(1)",
        fn: () => 1,
        color: "#4CAF50",
        labelPosition: { x: 178, y: 100 },
      },
      {
        name: "O(log n)",
        fn: (n) => Math.log2(Math.max(1, n)),
        color: "#2196F3",
        labelPosition: { x: 178, y: 70 },
      },
      {
        name: "O(n)",
        fn: (n) => n,
        color: "#FFC107",
        labelPosition: { x: 178, y: 50 },
      },
      {
        name: "O(n²)",
        fn: (n) => n * n,
        color: "#F44336",
        labelPosition: { x: 178, y: 15 },
      },
      {
        name: "O(n!)",
        fn: (n) => {
          if (n < 1) return 0;
          return stirlingApprox(n); // Cap at 1000 for visualization
        },
        color: "#9C27B0",
        labelPosition: { x: 15, y: 15 },
      },
    ];

    // Create more intuitive tick values for x-axis
    const xAxis = d3.axisBottom(x).tickValues([0, 5, 10, 15, 20]);

    // Create more intuitive tick values for y-axis
    const yAxis = d3
      .axisLeft(y)
      .tickValues([0, 1, 10, 100, 1000])
      .tickFormat(d3.format(",.0f"));

    // Add X axis
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .append("text")
      .attr("fill", "#fff")
      .attr("x", width / 2)
      .attr("y", 35)
      .attr("text-anchor", "middle")
      .text("Input Size (n)");

    // Add Y axis
    g.append("g")
      .call(yAxis)
      .append("text")
      .attr("fill", "#fff")
      .attr("transform", "rotate(-90)")
      .attr("y", -35)
      .attr("x", -height / 2)
      .attr("text-anchor", "middle")
      .text("Time Complexity");

    functions.forEach((func) => {
      // Generate points including 0
      const data = d3.range(0, 20, 0.1).map((n) => [n, func.fn(n)]);

      const path = g
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", func.color)
        .attr("stroke-width", 2)
        .attr("d", line);

      const totalLength = path.node().getTotalLength();

      path
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(5000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);

      // Add labels with custom positioning
      g.append("text")
        .attr("x", func.labelPosition.x)
        .attr("y", func.labelPosition.y)
        .attr("fill", func.color)
        .attr("text-anchor", "start")
        .text(func.name);
    });
  }, []);

  return (
    <div className="mx-auto mt-3 w-full max-w-3xl rounded-lg bg-black p-2 opacity-90">
      <p className="mb-4"></p>
      <svg ref={svgRef} width="300" height="200" className="w-full" />
    </div>
  );
}
