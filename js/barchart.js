const height = 400,
  width = 600;
const margin = { top: 20, bottom: 60, left: 30, right: 20 };
const innerHeight = height - margin.top - margin.bottom,
  innerWidth = width - margin.left - margin.right;
const fmtDollars = (d) => d3.format("$.1f")(d) + "M";

function getEnabledVariables() {
  const checkboxes = document.querySelectorAll(
    "input[type=checkbox][name=variable]"
  );
  return Array.from(checkboxes)
    .filter((i) => i.checked)
    .map((i) => i.id);
}

function mouseover(e) {
  d3.select("div#tooltip-div")
    .style("opacity", 0.8)
    .style("visibility", "visible");
  d3.select(e.target).style("stroke", "black").style("opacity", 1);
}

function mousemove(e, d) {
  const tooltipOffset = { left: 50, top: -50 };
  d3.select("div#tooltip-div")
    .style("left", `${e.clientX + tooltipOffset.left}px`)
    .style("top", `${e.clientY + tooltipOffset.top}px`);

  d3.select("div#tooltip-div")
    .selectAll("text")
    .data([d])
    .join("text")
    .text((d) => {
      if (d.value4 == d.value3)
        return (
          d.value4 +
          ": " +
          d.key +
          ",\n" +
          "Sales: " +
          parseFloat(d.value.toFixed(2))
        );
      else
        return (
          d.value4 +
          ": " +
          d.key +
          ",\n" +
          d.value3 +
          ": " +
          d.value5 +
          ",\n" +
          "Sales: " +
          fmtDollars(d.value)
        );
    })
    .attr("transform", `translate(${0}, ${15})`);
}

function mouseleave() {
  d3.select("div#tooltip-div")
    .style("opacity", 0)
    .style("visibility", "hidden");
  d3.select(this).style("stroke", "none");
}

function animateBarchart(data) {
  const years = Array.from(new Set(data.map((d) => +d.Year)))
    .filter((d) => d >= selectedYears[0] && d <= selectedYears[1])
    .sort((a, b) => a - b);
  drawCharts(data, years, true);
}

function drawCharts(data, years, chain = false, i = 0) {
  if (chain && !animationRunning) return;
  const year = chain ? years[i] : selectedYears[0];
  const selectedVariables = getEnabledVariables();
  d3.select("#barchart-div")
    .selectAll("svg")
    .data(selectedVariables)
    .join("svg");

  const filtered = data.filter((d) => {
    return +d.Year === year;
  });
  const sortBy = d3.select("#sort-by-selection").property("value");

  let keys;
  if (sortBy === "Region") {
    keys = ["Europe", "Global", "Japan", "North America", "Other"];
  } else keys = Array.from(new Set(filtered.map((d) => d[sortBy])));

  addLegend(Array.from(keys));

  // each element refers to a seperate bar chart
  selectedVariables.forEach((element) => {
    const groupedData = groupByVariable(filtered, sortBy, element);

    const xDomain = groupedData.map((d) => d[element]).sort();

    const xScale = d3
      .scaleBand()
      .domain(xDomain)
      .range([0, innerWidth])
      .padding(0.2);

    const yScale = d3
      .scaleLinear()
      .range([innerHeight, 0])
      .domain([0, d3.max(groupedData, (d) => d3.max(keys, (key) => d[key]))]);

    const color = d3.scaleOrdinal(d3.schemeCategory10).domain(keys);

    const svg = d3
      .selectAll("#barchart-div svg")
      .filter((d) => d === element)
      .attr("id", element + "-barchart-svg")
      .classed("barchart", true)
      .attr("height", height)
      .attr("width", width);

    svg.append("g").classed("barchart-title", true);
    svg.append("g").classed("barchart-year", true);
    svg.append("g").classed("barchart-x-axis", true);
    svg.append("g").classed("barchart-y-axis", true);
    svg.append("g").classed("barchart-content", true);

    svg
      .select("g.barchart-title")
      .selectAll("text")
      .data([element])
      .join("text")
      .attr("x", width / 2)
      .attr("y", margin.top)
      .text((d) => d);
    svg
      .select("g.barchart-year")
      .selectAll("text")
      .data([year])
      .join("text")
      .attr("x", width - margin.right - 20)
      .attr("y", margin.top)
      .text((d) => d);
    svg
      .selectAll("g.barchart-x-axis")
      .data([year])
      .join("g")
      .classed("x-axis", true)
      .attr(
        "transform",
        `translate(${margin.left}, ${innerHeight + margin.top})`
      )
      .transition("x-axis")
      .duration(1000)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("transform", "rotate(30)")
      .style("text-anchor", "start");
    svg
      .select("g.barchart-y-axis")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .transition("y-axis")
      .duration(1000)
      .call(d3.axisLeft(yScale));

    const selection = svg
      .select("g.barchart-content")
      .selectAll("g")
      .data(groupedData)
      .join("g")
      .attr("transform", (d) => `translate(${xScale(d[element])},0)`)
      .selectAll("rect")
      // value2 contains the keys passed into the domain
      .data((d) =>
        Object.keys(d)
          .filter((_, index) => index != 0)
          .map((key) => ({
            key,
            value: d[key],
            value2: Object.keys(d).filter((_, index) => index != 0),
            value3: element,
            value4: sortBy,
            value5: d[element],
          }))
      )
      .join("rect")
      .attr("x", (d) => {
        const x1Scale = d3
          .scaleBand()
          .domain(d.value2)
          .range([0, xScale.bandwidth()]);
        return x1Scale(d.key) + 30;
      }) // use the x1 variable to place the grouped bars
      .attr("y", (d) => yScale(d.value) + 20)
      .attr("width", (d) =>
        d3
          .scaleBand()
          .domain(d.value2)
          .range([0, xScale.bandwidth()])
          .bandwidth()
      )
      .attr("height", (d) => yScale(0) - yScale(d.value))
      .attr("fill", (d) => color(d.key))
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);
    if (chain) {
      selection
        .transition()
        .delay(2000)
        .on("end", () => {
          if (year < selectedYears[1]) drawCharts(data, years, true, i + 1);
        });
    }
  });
  return data;
}

function aggregateByVariable(rolledData, variable) {
  return Array.from(rolledData, ([variableName, count]) => {
    const obj = {};
    for (const [sortBy, num] of count) {
      obj[variable] = variableName;
      obj[sortBy] = num;
    }
    return obj;
  });
}

function groupByVariable(data, sortBy, variable) {
  // TODO: Add meaningful names to these variables
  const aggregate = (rolledData) => aggregateByVariable(rolledData, variable);
  if (variable == "Region" && sortBy != "Region") {
    let temp0 = d3.rollup(
      data,
      (v) => d3.sum(v, (d) => d.Global_Sales),
      () => "Global",
      (d) => d[sortBy]
    );
    let temp1 = d3.rollup(
      data,
      (v) => d3.sum(v, (d) => d.EurpeanUnion_Sales),
      () => "Europe",
      (d) => d[sortBy]
    );
    let temp2 = d3.rollup(
      data,
      (v) => d3.sum(v, (d) => d.Japan_Sales),
      () => "Japan",
      (d) => d[sortBy]
    );
    let temp3 = d3.rollup(
      data,
      (v) => d3.sum(v, (d) => d.NorthAmerica_Sales),
      () => "North America",
      (d) => d[sortBy]
    );
    let temp4 = d3.rollup(
      data,
      (v) => d3.sum(v, (d) => d.Other_Sales),
      () => "Other",
      (d) => d[sortBy]
    );
    const rolledData = new Map([
      ...temp0,
      ...temp1,
      ...temp2,
      ...temp3,
      ...temp4,
    ]);
    return aggregate(rolledData, variable);
  } else if (sortBy == "Region" && variable != "Region") {
    let global = d3.rollup(
      data,
      (v) => d3.sum(v, (d) => d.Global_Sales),
      (d) => d[variable],
      () => "Global"
    );
    let europe = d3.rollup(
      data,
      (v) => d3.sum(v, (d) => d.EurpeanUnion_Sales),
      (d) => d[variable],
      () => "Europe"
    );
    let japan = d3.rollup(
      data,
      (v) => d3.sum(v, (d) => d.Japan_Sales),
      (d) => d[variable],
      () => "Japan"
    );
    let northAmerica = d3.rollup(
      data,
      (v) => d3.sum(v, (d) => d.NorthAmerica_Sales),
      (d) => d[variable],
      () => "North America"
    );
    let other = d3.rollup(
      data,
      (v) => d3.sum(v, (d) => d.Other_Sales),
      (d) => d[variable],
      () => "Other"
    );

    // merges two maps with maps as value
    function merge(a, b) {
      const a2 = new Map([...a]);
      const b2 = new Map([...b]);
      const result = new Map([...a]);
      for (const [key, value] of a2) {
        value.set(
          Array.from(b2.get(key).keys())[0],
          b2.get(key).get(Array.from(b2.get(key).keys())[0])
        );
      }
      return result;
    }
    const temp = merge(global, europe);
    const temp2 = merge(temp, japan);
    const temp3 = merge(temp2, northAmerica);
    const temp4 = merge(temp3, other);
    return aggregate(temp4, variable);
  } else if (sortBy == "Region" && variable == "Region") {
    let temp0 = d3.rollup(
      data,
      (v) => d3.sum(v, (d) => d.Global_Sales),
      () => "Global",
      () => "Global"
    );
    let temp1 = d3.rollup(
      data,
      (v) => d3.sum(v, (d) => d.EurpeanUnion_Sales),
      () => "Europe",
      () => "Europe"
    );
    let temp2 = d3.rollup(
      data,
      (v) => d3.sum(v, (d) => d.Japan_Sales),
      () => "Japan",
      () => "Japan"
    );
    let temp3 = d3.rollup(
      data,
      (v) => d3.sum(v, (d) => d.NorthAmerica_Sales),
      () => "North America",
      () => "North America"
    );
    let temp4 = d3.rollup(
      data,
      (v) => d3.sum(v, (d) => d.Other_Sales),
      () => "Other",
      () => "Other"
    );
    const rolledData = new Map([
      ...temp0,
      ...temp1,
      ...temp2,
      ...temp3,
      ...temp4,
    ]);
    return aggregate(rolledData, variable);
  }
  const rolledData = d3.rollup(
    data,
    (v) => d3.sum(v, (d) => d.Global_Sales),
    (d) => d[variable],
    (d) => d[sortBy]
  );
  return aggregate(rolledData, variable);
}

function addLegend(data) {
  const color = d3.scaleOrdinal(d3.schemeCategory10).domain(data);
  const size = 20;
  const y = d3
    .scaleBand()
    .domain(data)
    .range([0, size * (data.length + 5)])
    .padding(0.7);

  const legendGroups = d3
    .select("#legend-svg")
    .selectAll("g")
    .data(data)
    .join(
      (enter) =>
        enter.append("g").attr("transform", (d) => `translate(50, ${y(d)})`),
      (update) =>
        update
          .transition()
          .duration(1000)
          .attr("transform", (d) => `translate(50, ${y(d)})`)
    );
  legendGroups
    .selectAll("rect")
    .data((d) => [d])
    .join((enter) =>
      enter
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", size)
        .attr("height", size)
        .style("fill", (d) => color(d))
        .style("opacity", 0)
        .transition()
        .duration(500)
        .style("opacity", 1)
    );
  legendGroups
    .selectAll("text")
    .data((d) => [d])
    .join("text")
    .attr("x", 0)
    .attr("y", 0)
    .selectAll("tspan")
    .data((d) => [d])
    .join("tspan")
    .attr("x", size * 1.5 + y.padding())
    .attr("y", size / 2)
    .style("fill", (d) => color(d))
    .attr("text-anchor", "left")
    .style("dominant-baseline", "middle")
    .text((d) => d)
    .style("opacity", 0)
    .transition()
    .style("opacity", 1);
}
