// window.addEventListener("resize", function() {
//   console.log("running")
//   var windowWidth = window.innerWidth;
//   document.getElementById("networkGraph").setAttribute("viewBox", (window.innerWidth / 2) + " " + (window.innerWidth / 2) + " " + (window.innerWidth / 2) + " 500");
// });

const findSharedUsers = (nodeArr) => {
  const userSet = new Set();
  const sharedUsers = {};

  // track and filter out users in more than one team
  let filteredNodes = nodeArr.filter(node => {
    if (!userSet.has(node.id)) {
      userSet.add(node.id)
      return node
    } else if (!sharedUsers[node.id]) {
      sharedUsers[node.id] = [node.group]
    } else {
      sharedUsers[node.id].push(node.group)
    }
  })

  // add the extra team numbers to users on more than one team
  filteredNodes.forEach(node => {
    if (sharedUsers[node.id]) {
      node.otherGroups = sharedUsers[node.id]
    }
  })
  return filteredNodes;
}

var data = { "nodes": [{
    "type": "suborg",
    "id": 1,
    "group": 1,
    "pass": 0.8,
    "slide": 1
  }, {
    "type": "team",
    "id": 2,
    "group": 1,
    "pass": 0.8,
    "slide": 2
  }, {
    "type": "user",
    "id": 3,
    "group": 1,
    "pass": 0.8,
    "slide": 3
  }, {
    "type": "user",
    "id": 4,
    "group": 2,
    "pass": 0.8,
    "slide": 4
  }, {
    "type": "account",
    "id": 5,
    "group": 1,
    "pass": 0.8,
    "slide": 5
  },{
    "type": "suborg",
    "id": 6,
    "group": 2,
    "pass": 0.4,
    "slide": 6
  }, {
    "type": "team",
    "id": 7,
    "group": 2,
    "pass": 0.4,
    "slide": 7
  }, {
    "type": "account",
    "id": 8,
    "group": 2,
    "pass": 0.4,
    "slide": 8
  }, {
    "type": "account",
    "id": 9,
    "group": 2,
    "pass": 0.4,
    "slide": 9
  }, {
    "type": "account",
    "id": 10,
    "group": 2,
    "pass": 0.4,
    "slide": 10
  }],
            
            
  "links": [
  
  {
    "source": 1,
    "target": 2,
    "value": 5,
    "pass": 0.4
  }, {
    "source": 1,
    "target": 3,
    "value": 5,
    "pass": 0.4
  }, {
    "source": 1,
    "target": 4,
    "value": 5,
    "pass": 0.4
  }, {
    "source": 1,
    "target": 5,
    "value": 5,
    "pass": 0.4
  }, 
  // {
  //   "source": 1,
  //   "target": 6,
  //   "value": 5,
  //   "pass": 0.4
  // }, 
  {
    "source": 1,
    "target": 7,
    "value": 5,
    "pass": 0.4
  }, 
  {
    "source": 1,
    "target": 8,
    "value": 5,
    "pass": 0.4
  },  {
    "source": 1,
    "target": 9,
    "value": 5,
    "pass": 0.4
  }, 
  // {
  //   "source": 1,
  //   "target": 10,
  //   "value": 5,
  //   "pass": 0.4
  // }, 
  {
    "source": 2,
    "target": 6,
    "value": 5,
    "pass": 0.4
  }, {
    "source": 2,
    "target": 9,
    "value": 5,
    "pass": 0.4
  }, {
    "source": 3,
    "target": 5,
    "value": 5,
    "pass": 0.4
  }, {
    "source": 5,
    "target": 2,
    "value": 5,
    "pass": 0.4
  }, {
    "source": 5,
    "target": 9,
    "value": 5,
    "pass": 0.4
  }, {
    "source": 7,
    "target": 3,
    "value": 5,
    "pass": 0.4
  }, {
    "source": 7,
    "target": 5,
    "value": 5,
    "pass": 0.4
  }, {
    "source": 7,
    "target": 6,
    "value": 5,
    "pass": 0.4
  }, {
    "source": 10,
    "target": 5,
    "value": 5,
    "pass": 0.4
  }]
}

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height")

var color = d3.scaleLinear()
    .domain([0.5, 0.75, 1]) // NOTE: anything less than 50% pass rate is "failing," and therefore red
    .range(["red", "LightGreen", "green"])

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2))

var graph = data
var links = graph.links
var nodes = findSharedUsers(graph.nodes)

var link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links)
    .enter().append("line")
    .attr("stroke-width", 2)
    .attr("clip-path", "url(#myClip)")

var node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(nodes)
    .enter().append("circle")
    .attr("r", function(d) {
      if (d.type==='suborg') return 18
      if (d.type==='team') return 13
      return 10
    })
    .attr("fill", function(d) {
      return (d.otherGroups) ? "fuchsia" : color(d.pass)
    })
    .attr("clip-path", "url(#myClip)")
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended))

node.on("click", function(d) {
  // this.r.baseVal.value *= 2;
  toggleSlide(d.slide, this);
})
node.append("title")
    .text(function(d) { return d.id })

simulation
    .nodes(nodes)
    .on("tick", ticked)

simulation.force("link")
    .links(links)
    .distance(130)

function ticked() {
  link
    .attr("x1", function(d) { return d.source.x })
    .attr("y1", function(d) { return d.source.y })
    .attr("x2", function(d) { return d.target.x })
    .attr("y2", function(d) { return d.target.y })

  node
    .attr("cx", function(d) { return d.x })
    .attr("cy", function(d) { return d.y })
}

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart()
  d.fx = d.x
  d.fy = d.y
}

function dragged(d) {
  d.fx = d3.event.x
  d.fy = d3.event.y
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0)
  d.fx = null
  d.fy = null
}

function toggleSlide(slide, circle) {
  var cx = circle.cx.baseVal.value;
  var cy = circle.cy.baseVal.value;
  document.getElementById("slide" + slide).classList.add("open");
}

function closeSlide(slide) {
  document.getElementById("slide" + slide).classList.remove("open");
}

var HTMLabsoluteTip = d3.select("div.tooltip.absolute");

d3.select("svg")
    .selectAll("circle")
    .on("mouseover", function () {
      var matrix = this.getScreenCTM()
                .translate(+this.getAttribute("cx"),
                         +this.getAttribute("cy"));
      HTMLabsoluteTip
            .style("opacity", "1")
            .style("left", 
                   (window.pageXOffset + matrix.e) + "px")
            .style("top",
                   (window.pageYOffset + matrix.f + 30) + "px");
          })
    .on("mouseout", function () {
        return HTMLabsoluteTip.style("opacity", "0");
    });