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
  let parser = d3.timeParse('%Y-%m-%d');
  let yearData = data.reduce((acc, item) => acc.concat([[parser(item[0]), item[1]]]), []);

  const xScale = d3.scaleTime();
  const yScale = d3.scaleLinear();

  xScale
    .domain([yearData[0][0], yearData[data.length - 1][0]])
    .range([0, w - padding]);

  yScale
    .domain([0, d3.max(data, (d) => d[1])])
    .range([h - padding, 0]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  const svg = d3.select('body')
                    .append('svg')
                    .attr('width', w)
                    .attr('height', h)
                    .attr('transform', 'translate(${padding}), ${0}');

  svg.selectAll('rect')
         .data(yearData)
         .enter()
         .append('rect')
         .attr('x', (d) => xScale(d[0]) + padding)
         .attr('y', (d, i) => yScale(d[1] + padding))
         .attr('width', 3)
         .attr('height', (d, i) => h - yScale(d[1]) - padding)
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
    // .attr('transform', 'translate(' + 0 + ', ' + h - 50 + ')')
    .call(xAxis);

  svg.append('g')
    .attr('transform', 'translate(' + padding + ', 0)')
    .call(yAxis);
};
