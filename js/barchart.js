const height = 400,
  width = 600;
const margin = { top: 20, bottom: 20, left: 30, right: 20 };
const innerHeight = height - margin.top - margin.bottom,
  innerWidth = width - margin.left - margin.right;

function getEnabledVariables() {
  const checkboxes = document.querySelectorAll(
    "input[type=checkbox][name=variable]"
  );
  return Array.from(checkboxes)
    .filter((i) => i.checked)
    .map((i) => i.id);
}

function animateBarchart(data) {
  const years = Array.from(new Set(data.map((d) => +d.Year)))
    .filter((d) => d >= selectedYears[0] && d <= selectedYears[1])
    .sort((a, b) => a - b);
  startDisplayChain(data, years);
}

function startDisplayChain(data, years, i = 0) {
  const year = years[i];
  const selectedVariables = getEnabledVariables();

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
    let groupedData = groupByVariable(filtered, sortBy, element);

    let xDomain = groupedData.map((d) => d[element]).sort();

    let xScale = d3
      .scaleBand()
      .domain(xDomain)
      .range([0, innerWidth])
      .padding(0.2);

    let yScale = d3
      .scaleLinear()
      .range([innerHeight, 0])
      .domain([0, d3.max(groupedData, (d) => d3.max(keys, (key) => d[key]))]); // in each key, look for the maximum number

    let color = d3.scaleOrdinal(d3.schemeCategory10).domain(keys);

    let svg = d3
      .select("#barchart-div")
      .append("svg")
      .attr("id", element + "-barchart-svg")
      .classed("barchart", true)
      .attr("height", 400)
      .attr("width", 600);

    svg.append("g").attr("id", "barchart-title");
    svg.append("g").attr("id", "barchart-year");
    svg.append("g").attr("id", "barchart-x-axis");
    svg.append("g").attr("id", "barchart-y-axis");
    svg.append("g").attr("id", "barchart-content");

    svg
      .select("#barchart-title")
      .selectAll("text")
      .data([element])
      .join("text")
      .attr("x", width / 2)
      .attr("y", margin.top)
      .text((d) => d);
    svg
      .select("#barchart-year")
      .selectAll("text")
      .data([year])
      .join("text")
      .attr("x", width - margin.right - 20)
      .attr("y", margin.top)
      .text((d) => d);
    svg
      .selectAll("#barchart-x-axis")
      .data([year])
      .join("g")
      .classed("x-axis", true)
      .attr(
        "transform",
        `translate(${margin.left}, ${innerHeight + margin.top})`
      )
      .transition("x-axis")
      .duration(1000)
      .call(d3.axisBottom(xScale));
    svg
      .select("#barchart-y-axis")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .transition("y-axis")
      .duration(1000)
      .call(d3.axisLeft(yScale));

    svg
      .select("#barchart-content")
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
          }))
      )
      //keys.map((key) => ({ key, value: d[key] })))
      .join("rect")
      .attr("x", (d) => {
        let x1Scale = d3
          .scaleBand()
          .domain(d.value2)
          .range([0, xScale.bandwidth()]);
        return x1Scale(d.key) + 30;
      }) // use the x1 variable to place the grouped bars
      .attr("y", (d) => yScale(d.value) + 20) // draw the height of the barse using the data from the Male/Female keys as the height value
      .attr("width", (d) =>
        d3
          .scaleBand()
          .domain(d.value2)
          .range([0, xScale.bandwidth()])
          .bandwidth()
      )
      .attr("height", (d) => yScale(0) - yScale(d.value))
      .attr("fill", (d) => color(d.key))
      .transition()
      .duration(2000)
      .on("end", () => {
        if (i < years.length - 2) startDisplayChain(data, years, color, i + 1);
      });
  });
  return data;
}

function drawCharts(data) {
  const selectedVariables = getEnabledVariables();
  d3.select("#barchart-div")
    .selectAll("svg")
    .data(selectedVariables)
    .join("svg");

  const year = selectedYears[0];

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
      .attr("height", 400)
      .attr("width", 600);

    svg.append("g").classed("barchart-title", true);
    svg.append("g").classed("barchart-year", true);
    svg.append("g").classed("barchart-x-axis", true);
    svg.append("g").classed("barchart-y-axis", true);
    svg.append("g").classed("barchart-content", true);

    svg
      .selectAll("g.barchart-title text")
      .data([element])
      .join("text")
      .attr("x", width / 2)
      .attr("y", margin.top)
      .text((d) => d);
    svg
      .selectAll("g.barchart-year text")
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
      .call(d3.axisBottom(xScale));
    svg
      .select("g.barchart-y-axis")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .transition("y-axis")
      .duration(1000)
      .call(d3.axisLeft(yScale));

    svg
      .selectAll("g.barchart-content g")
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
          }))
      )
      //keys.map((key) => ({ key, value: d[key] })))
      .join("rect")
      .attr("x", (d) => {
        const x1Scale = d3
          .scaleBand()
          .domain(d.value2)
          .range([0, xScale.bandwidth()]);
        return x1Scale(d.key) + 30;
      }) // use the x1 variable to place the grouped bars
      .attr("y", (d) => yScale(d.value) + 20) // draw the height of the barse using the data from the Male/Female keys as the height value
      .attr("width", (d) =>
        d3
          .scaleBand()
          .domain(d.value2)
          .range([0, xScale.bandwidth()])
          .bandwidth()
      )
      .attr("height", (d) => yScale(0) - yScale(d.value))
      .attr("fill", (d) => color(d.key)); // color each bar according to its key value as defined by the color variable
  });
  return data;
}

function groupByVariable(data, sortBy, variable) {
  let rolledData = [];

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
    rolledData = new Map([...temp0, ...temp1, ...temp2, ...temp3, ...temp4]);
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
    let temp = merge(global, europe);
    let temp2 = merge(temp, japan);
    let temp3 = merge(temp2, northAmerica);
    let temp4 = merge(temp3, other);
    rolledData = temp4;
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
    rolledData = new Map([...temp0, ...temp1, ...temp2, ...temp3, ...temp4]);
  } else {
    rolledData = d3.rollup(
      data,
      (v) => d3.sum(v, (d) => d.Global_Sales),
      (d) => d[variable],
      (d) => d[sortBy]
    );
  }

  let aggregate = Array.from(rolledData, ([variableName, count]) => {
    const obj = {};
    for (const [sortBy, num] of count) {
      obj[variable] = variableName;
      obj[sortBy] = num;
    }
    return obj;
  });
  return aggregate;
}

function addLegend(data) {
  // color scale
  const color = d3.scaleOrdinal(d3.schemeCategory10).domain(data);
  const legend = d3.select("#legend-svg");

  // clears legend
  legend.selectAll("*").remove();

  let size = 20;

  legend
    .selectAll("g")
    .data(data)
    .join("rect")
    .attr("x", 50)
    .attr("y", (_, i) => 10 + i * (size + 5))
    .attr("width", size)
    .attr("height", size)
    .style("fill", (d) => color(d));

  legend
    .selectAll("g")
    .data(data)
    .join("text")
    .attr("x", 50 + size * 1.2)
    .attr("y", function (_, i) {
      return 10 + i * (size + 5) + size / 2;
    })
    .style("fill", function (d) {
      return color(d);
    })
    .text(function (d) {
      return d;
    })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle");
}
