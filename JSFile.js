// import * as d3 from 'd3';

let req = new XMLHttpRequest();
let jsonData = [];
req.open('GET',
'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json', true);
req.send();
req.onload = function () {
  jsonData = JSON.parse(req.responseText);
  graphDraw(jsonData);
};

const graphDraw = (data) => {
  console.log(data.data);
  let w = 1500;
  let h = 1800;
  const svg = d3.select('body')
                    .append('svg')
                    .attr('width', w)
                    .attr('height', h);

  svg.selectAll('rect')
         .data(data.data)
         .enter()
         .append('rect')
         .attr('x', (d, i) => i * 10)
         .attr('y', (d, i) => h -  d[1])
         .attr('width', 8)
         .attr('height', (d, i) => d[1])
         .attr('fill', 'navy')
         .attr('class', 'bar');
};
