const height = 400,
  width = 600;
const margin = { top: 20, bottom: 20, left: 30, right: 20 };
const innerHeight = height - margin.top - margin.bottom,
  innerWidth = width - margin.left - margin.right;

function animateBarchart(data) {
  const years = Array.from(new Set(data.map((d) => +d.Year))).sort(
    (a, b) => a - b
  );
  const color = d3
    .scaleOrdinal(d3.schemeCategory10)
    .domain(Array.from(new Set(data.map((d) => d.Platform))));
  startDisplayChain(data, years, color);
  return data;
}
function startDisplayChain(data, years, color, i = 0) {
  const year = years[i];

  const filtered = data.filter((d) => {
    return +d.Year === year;
  });
  const grouped = groupByPlatform(filtered);

  const x = d3
    .scaleBand()
    .domain(grouped.map((g) => g.platform))
    .range([0, innerWidth])
    .padding(0.2);
  const y = d3
    .scaleLinear()
    .range([innerHeight, 0])
    .domain([0, d3.max(grouped.map((g) => g.sales))]);
  const svg = d3.select("#barchart-svg");
  svg
    .selectAll("g.x-axis")
    .data([year])
    .join("g")
    .classed("x-axis", true)
    .attr("transform", `translate(${margin.left}, ${innerHeight + margin.top})`)
    .transition("x-axis")
    .duration(1000)
    .call(d3.axisBottom(x));

  svg
    .selectAll("g.y-axis")
    .data([year])
    .join("g")
    .classed("y-axis", true)
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .transition("y-axis")
    .duration(1000)
    .call(d3.axisLeft(y));
  svg
    .selectAll("g.rects")
    .data([year])
    .join("g")
    .classed("rects", true)
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .selectAll("rect")
    .data(grouped)
    .join(
      (enter) =>
        enter
          .append("rect")
          .attr("x", (d) => x(d.platform))
          .attr("fill", (d) => color(d.platform))
          .attr("width", x.bandwidth()),
      (update) =>
        update
          .transition("rects")
          .attr("width", x.bandwidth())
          .attr("height", (d) => y(0) - y(d.sales))
          .attr("y", (d) => y(d.sales))
          .attr("x", (d) => x(d.platform)),
      (exit) => exit.transition("rects").attr("height", 0).style("opacity", 0)
    )
    .attr("fill", (d) => color(d.platform))
    .transition("rects")
    .attr("width", x.bandwidth())
    .attr("height", (d) => y(0) - y(d.sales))
    .attr("y", (d) => y(d.sales))
    .attr("x", (d) => x(d.platform))
    .duration(2000)
    .on("end", () => {
      if (i < years.length - 2) startDisplayChain(data, years, color, i + 1);
    });
  return data;
}
function drawCharts(data, selectedVariables) {
  // clear existing charts
  d3.select("#barchart-div").selectAll("*").remove();

  let year = parseInt(d3.select("#year_selection").property("value"));
  const filtered = data.filter((d) => {
    return +d.Year === year;
  });
  const sort_by = d3.select("#sort_by_selection").property("value");

  addLegend(Array.from(new Set(filtered.map((d) => d[sort_by]))));

  selectedVariables.forEach((element) => {
    let groupedData = groupByVariable(filtered, sort_by, element);

    let xDomain = groupedData.map(d => d[element]).sort();
    
    let xScale = d3
      .scaleBand()
      .domain(xDomain)
      .range([0, innerWidth])
      .padding(.2);

      let keys = Array.from(new Set(filtered.map((d) => d[sort_by])));

    // only rectangles that exist in the (specific tick on the x-axis) is the domain
    //console.log(groupedData.map(key => ({ key, value: d[key] })));
    //data is groupedData .data(d => keys.map(key => ({ key, value: d[key] })))
    
    let x1Scale = d3
      .scaleBand()
      .domain(keys)
      .range([0, xScale.bandwidth()])
      //.padding(0.1)

    let yScale = d3
      .scaleLinear()
      .range([innerHeight, 0])
      .domain([0, d3.max(groupedData, d => d3.max(keys, key => d[key]))]) // in each key, look for the maximum number

    let color = d3
      .scaleOrdinal(d3.schemeCategory10)
      .domain(keys);

    // loops through all selected variables and creates a chart
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
    .attr("transform", d => `translate(${xScale(d[element])},0)`) // place each bar along the x-axis at the place defined by the xScale variable
    .selectAll("rect")
    .data(d => keys.map(key => ({ key, value: d[key] })))
    .join('rect')
    .attr("x", d => {
      if (d.value === undefined)
      {
        d.value = .5;
      }
      return x1Scale(d.key) + 30;
    }) // use the x1 variable to place the grouped bars
    .attr("y", d => yScale(d.value) + 20) // draw the height of the barse using the data from the Male/Female keys as the height value
    .attr("width", x1Scale.bandwidth()) // bar is the width defined by the x1 variable
    .attr("height", d => yScale(0) - yScale(d.value))
    .attr("fill", d => color(d.key)); // color each bar according to its key value as defined by the color variable
  });

  return data;
}

function groupByVariable(data, sort_by, variable) {
  let rolled_data = d3.rollup(
    data,
    (v) => d3.sum(v, (d) => d.Global_Sales),
    (d) => d[variable],
    (d) => d[sort_by]
  );

  let aggregate = Array.from(rolled_data, ([variable_name, count]) => {
    const obj = {};
    for (const [sort_by, num] of count) {
      obj[variable] = variable_name;
      obj[sort_by] = num;
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
