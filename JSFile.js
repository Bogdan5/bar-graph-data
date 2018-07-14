// import * as d3 from 'd3';

let req = new XMLHttpRequest();
let jsonData = [];
req.open('GET',
'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json', true);
req.send();
req.onload = function () {
  jsonData = JSON.parse(req.responseText);
  graphDraw(jsonData.data);
};

const graphDraw = (data) => {
  console.log('graphDraw', data);
  let w = 1140;
  let h = 500;
  const padding = 40;
  let parser = d3.timeParse('%Y-%M-%D');
  let yearData = data.reduce((acc, item) => [parser(item[0]), item[1]], []);

  data.reduce((acc, item, index) => {
    if (item[0].substring(5, 7) === '01') {
      return acc.concat(parseInt(item[0].substring(0, 4)));
    } else {
      return acc;
    }
  }, []);
  console.log('yearData', yearData);
  const xScale = d3.scalePoint();
  const yScale = d3.scaleLinear();

  xScale
    .domain(yearData)
    .range([0, 1100]);

  yScale
    .domain([d3.min(data, (d) => d[1]), d3.max(data, (d) => d[1])])
    .range([h, 0]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  const svg = d3.select('body')
                    .append('svg')
                    .attr('width', w)
                    .attr('height', h);

  svg.selectAll('rect')
         .data(data)
         .enter()
         .append('rect')
         .attr('x', (d, i) => i * 4 + padding)
         .attr('y', (d, i) => yScale(d[1] + padding))
         .attr('width', 3)
         .attr('height', (d, i) => h - yScale(d[1]))
         .attr('fill', 'navy')
         .attr('class', 'bar')
         .on('mouseover', (d) => {
          tooltip.style('visibility', 'visible');
          tooltip.text(d[0] + '- $' + d[1]);
        })
         .on('mouseleave', () => tooltip.style('visibility', 'hidden'));

  let tooltip = d3.select('body')
    .append('div')
    .style('position', 'absolute')
    .style('z-index', '10')
    .style('visibility', 'hidden')
    .text('a simple tooltip');

  svg.append('g')
    .attr('transform', 'translate(' + padding + ', ' + (h - padding) + ')')
    .call(xAxis);

  svg.append('g')
    .attr('transform', 'translate(' + padding + ', 0)')
    .call(yAxis);
};
