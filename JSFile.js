import * as d3 from 'd3';

let req = new XMLHttpRequest();
let json = [];
req.open('GET',
'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json', true);
req.send();
req.onload = function () {
  json = JSON.parse(req.responseText);
  console.log(json);
};
