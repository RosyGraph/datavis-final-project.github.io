const height = 400,
  width = 600;
const margin = { top: 20, bottom: 20, left: 30, right: 20 };
const innerHeight = height - margin.top - margin.bottom,
  innerWidth = width - margin.left - margin.right;

function displayYear(data) {
  let year = parseInt(d3.select("#year_selection").property("value"));
  
  const filtered = data.filter((d) => {
    return +d.Year === year;
  });
  const sort_by = d3.select("#sort_by_selection").property("value");

  let grouped;

  switch (sort_by) {
    case "platform":
      grouped = groupByPlatform(filtered);
      break;

    case "genre":
      grouped = groupByGenre(filtered);
      break;

    case "name":
      grouped = groupByName(filtered);
      break;

    case "publisher":
      grouped = groupByPublisher(filtered);
      break;
  }

  const x = d3
    .scaleBand()
    .domain(grouped.map((g) => g[sort_by]))
    .range([0, innerWidth])
    .padding(0.2);
  const y = d3
    .scaleLinear()
    .range([innerHeight, 0])
    .domain([0, Math.ceil(d3.max(grouped.map((g) => g.sales)))]);
  const color = d3
    .scaleOrdinal(d3.schemeCategory10)
    .domain(grouped.map((g) => g[sort_by]));
  const svg = d3.select("#barchart-svg");
  svg
    .select("#barchart-year")
    .selectAll("text")
    .data([year])
    .join("text")
    .attr("x", width - margin.left)
    .attr("y", margin.top)
    .text((d) => d);
  svg
    .select("#barchart-x-axis")
    .attr("transform", `translate(${margin.left}, ${innerHeight + margin.top})`)
    .call(d3.axisBottom(x));
  svg
    .select("#barchart-y-axis")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .call(d3.axisLeft(y));
  svg
    .select("#barchart-content")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .selectAll("rect")
    .data(grouped)
    .join(
      (enter) =>
        enter
          .append("rect")
          .attr("x", (d) => x(d[sort_by]))
          .attr("y", (d) => y(d.sales))
          .attr("width", x.bandwidth())
          .attr("height", (d) => y(0) - y(d.sales))
          .attr("fill", (d) => color(d[sort_by])),

      (update) =>
        update
          //.transition()
          //.duration(ANIMATION_DURATION)
          .attr("x", (d) => x(d[sort_by]))
          .attr("y", (d) => y(d.sales))
          .attr("width", x.bandwidth())
          .attr("height", (d) => y(0) - y(d.sales))
          .attr("fill", (d) => color(d[sort_by])),

      (exit) =>
        exit
          //.transition()
          //.duration(ANIMATION_DURATION)
          .attr("width", 0)
          .attr("height", 0)
          .remove()
    );
  console.log(grouped);
}

function updateBarChart() {}

function groupByPlatform(data) {
  const platforms = Array.from(new Set(data.map((d) => d.Platform)));
  return platforms.map((platform) => {
    return {
      platform: platform,
      sales: data
        .filter((d) => d.Platform === platform)
        .map((d) => {
          return !d.Global_Sales ? 0 : +d.Global_Sales;
        })
        .reduce((p, c) => p + c, 0),
    };
  });
}

function groupByGenre(data) {
  const genres = Array.from(new Set(data.map((d) => d.Genre)));
  return genres.map((genre) => {
    return {
      genre: genre,
      sales: data
        .filter((d) => d.Genre === genre)
        .map((d) => {
          return !d.Global_Sales ? 0 : +d.Global_Sales;
        })
        .reduce((p, c) => p + c, 0),
    };
  });
}

function groupByName(data) {
  const names = Array.from(new Set(data.map((d) => d.Name)));
  return names.map((name) => {
    return {
      name: name,
      sales: data
        .filter((d) => d.Name === name)
        .map((d) => {
          return !d.Global_Sales ? 0 : +d.Global_Sales;
        })
        .reduce((p, c) => p + c, 0),
    };
  });
}

function groupByPublisher(data) {
  const publishers = Array.from(new Set(data.map((d) => d.Publisher)));
  return publishers.map((publisher) => {
    return {
      publisher: publisher,
      sales: data
        .filter((d) => d.Publisher === publisher)
        .map((d) => {
          return !d.Global_Sales ? 0 : +d.Global_Sales;
        })
        .reduce((p, c) => p + c, 0),
    };
  });
}
