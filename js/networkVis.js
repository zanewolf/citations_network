/* * * * * * * * * * * * * *
*          NetworkVis          *
* * * * * * * * * * * * * */



class NetworkVis {

    constructor(parentElement, tooltipElement, nodeData, linkData) {
        let vis=this;
        vis.parentElement = parentElement;
        vis.tooltipElement = tooltipElement
        vis.nodes = nodeData;
        vis.links = linkData;

        this.initVis()
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

        vis.ttWidth =$("#" + vis.tooltipElement).width() - vis.margin.left - vis.margin.right;
        vis.ttHeight =$("#" + vis.tooltipElement).height() - vis.margin.top - vis.margin.bottom;

        // draw svg area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // color scheme
        vis.colorScale = d3.scaleOrdinal()
            .range(["#ff006e","#8338ec","#3a86ff","#ffbe0b"])

        vis.colorScale = d3.scaleOrdinal()
            .range(["#0ef3a0","#d5d5d5","#d5d5d5", "#d5d5d5"])

        // radius
        vis.radiusScale = d3.scaleLinear()
            .range([3,20])

        vis.strokeScale=d3.scaleLinear()
            .range([0.2,1])

        vis.first= true;



        // vis.tooltip = d3plus.TextBox()
        //     .select('#'+vis.tooltipElement)
        //     .draw();
        vis.tooltip = d3.select("#" +vis.tooltipElement)
            .append("div")
            .attr("class", "tooltip")
            // .style("opacity", 0)
            .attr('x', vis.ttWidth)
            .attr('y', vis.ttHeight)

        vis.toolTipCB = d3.select('#citedBy').append('ul').attr('class', ' list-disc')


        vis.wrangleData(false)

    }

    wrangleData(){
        let vis = this;

        // go through list of links.
        // Give value to node based on number of total times it's a target. use this to scale the paper

        vis.count = d3.rollups(vis.links, v=>v.length,d=>d.target)

        // console.log(vis.count)



        vis.radii=[]
        vis.mainPapers=[]
        vis.count.forEach((d,i)=>{
            // console.log(d)
            vis.id=d[0]
            vis.value=d[1]
            // console.log(vis.value)
            vis.radii.push(vis.value)
            vis.nodes.forEach((f,i)=>{
                f.id===vis.id ? f.value = vis.value : null
            })

            vis.links.forEach((f,i)=>{
                f.target === vis.id ? f.value = vis.value: null
            })
        })

        // catch all the nodes there weren't cited by others (e.g. main papers that aren't citations in other papers)
        vis.nodes.forEach(d=>{
            if (d.value===undefined && d.Main==='TRUE'){
                // console.log(d)
                d.value=1
            }
        })

        vis.re= new RegExp(/(\d+)/)

        // console.log(vis.mainPapers)

        vis.minYear=3000
        vis.maxYear=1000

        vis.nodes.forEach((d,i)=>{
            d.Main==='TRUE' ? vis.mainPapers.push(d.id) : null

            vis.minYear = Math.min(vis.minYear,d.year)
            vis.maxYear = Math.max(vis.maxYear,d.year)
        })

        vis.strokeScale.domain([d3.min(vis.radii),d3.max(vis.radii)])

        d3.select('#startYear').property('value', vis.minYear)
        d3.select('#endYear').property('value', vis.maxYear)



        vis.filterYears()

    }

    filterYears(){
        let vis=this

        vis.startYear = document.getElementById('startYear').value
        vis.endYear = document.getElementById('endYear').value

        vis.nodesYear = vis.nodes.filter(d=>d.year >= vis.startYear && d.year <= vis.endYear)


        if (vis.first){
            // vis.linksYear = vis.links.filter(d=> d.source.match(vis.re)[0].substring(0,4) >= vis.startYear && d.source.match(vis.re)[0].substring(0,4) <=  vis.endYear && d.target.match(vis.re)[0].substring(0,4) >= vis.startYear && d.target.match(vis.re)[0].substring(0,4) <=  vis.endYear)
            vis.first= false

            // console.log(vis.links)
            vis.linksYear = vis.links.filter(d=>d.source.match(vis.re)[0].substring(0,4) >= vis.startYear && d.source.match(vis.re)[0].substring(0,4) <=  vis.endYear && d.target.match(vis.re)[0].substring(0,4) >= vis.startYear && d.target.match(vis.re)[0].substring(0,4) <=  vis.endYear)
        } else {
            // console.log(vis.links)
            vis.linksYear = vis.links.filter(d=>d.source.id.match(vis.re)[0].substring(0,4) >= vis.startYear && d.source.id.match(vis.re)[0].substring(0,4) <=  vis.endYear && d.target.id.match(vis.re)[0].substring(0,4) >= vis.startYear && d.target.id.match(vis.re)[0].substring(0,4) <=  vis.endYear)

        }

        // console.log(vis.nodesYear)



        vis.filterShared()
    }

    filterShared(){
        let vis = this;

        vis.shared = document.getElementById("filterButton").value;

        if (vis.shared == 'true'){
            // console.log(vis.shared)
            vis.nodesShared = vis.nodesYear.filter(d=> d.value!=1 || d.Main==='TRUE')
            vis.linksShared = vis.linksYear.filter(d=>d.value!=1)
        } else {
            vis.nodesShared = vis.nodesYear
            vis.linksShared = vis.linksYear
        }
        //
        // console.log(vis.nodesShared)
        // console.log(vis.linksShared)

        vis.filterMain()

    }

    filterMain() {
        let vis = this;

        vis.main = document.getElementById("filterMain").value
        // console.log(vis.nodesShared.length, vis.linksShared.length)

        if (vis.main=='true') {
            vis.nodesReady = vis.nodesShared.filter(d => d.Main === 'TRUE')
            vis.linksReady = vis.linksShared.filter((d,i) => {
                // console.log(d)
                if (vis.mainPapers.includes(d.target.id)) {
                    // console.log('hi')
                    return (d)
                }
            })
        } else {
            vis.nodesReady = vis.nodesShared
            vis.linksReady = vis.linksShared
        }

        // console.log(vis.nodesReady, vis.linksReady)
        vis.updateVis()


    }

    updateVis(){
        let vis = this;

        vis.radius = 7;

        // vis.colorScale
        //     .domain(['Fish', 'Robot', 'Misc', 'Main'])
        // vis.colorScale
            // .domain(['Main', 'Fish', 'Robot', 'Misc'])
        //
        // console.log(vis.nodesReady)
        vis.nodesReadySorted = vis.nodesReady.sort((a,b)=>a.value-b.value)
        // console.log(vis.nodesReadySorted.filter(d=>d.Main==='TRUE'))

        vis.radiusScale
            .domain(d3.extent(vis.radii))

        vis.heightScale=d3.scaleLinear()
            .range([vis.height-200,200])
            .domain(d3.extent(vis.radii))



        vis.simulation = d3.forceSimulation(vis.nodesReady)
            .force("center", d3.forceCenter( vis.width/2,  vis.height/2).strength(1))
            .force("link", d3.forceLink(vis.linksReady).id(d=>{return d.id}))
            .force("charge", d3.forceManyBody().strength(d=>d.Main==='TRUE'? -70: -1).distanceMax(600))
            // .force('r', d3.forceRadial(d=>d.Main==='TRUE'? 500: 100))
            // .force('x', d3.forceX().x(vis.width/2).strength(.01))
            // .force('y', d3.forceY().y(d=>vis.heightScale(d.value)))
            .force('collision', d3.forceCollide().radius(d=>vis.radiusScale(d.value)).strength(1))
            // .on('tick', vis.ticked)

        vis.simulation.on("tick", () => {
            vis.link
                .attr("x1", d=> d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);
            vis.node
                // .attr("cx",  d=>d.x)
                .attr('cx', function(d) { return d.x = Math.max((vis.radius+1), Math.min(vis.width - (vis.radius+1), d.x))})
                .attr("cy", function(d) { return d.y = Math.max((vis.radius+1), Math.min(vis.height - (vis.radius+1), d.y))})
            //
            // vis.textElems
            //     .attr("x", d => d.x + 10)
            //     .attr("y", d => d.y)
            //     .attr("visibility", "hidden");
        });


        vis.link =  vis.svg
            .selectAll("line")
            .data( vis.linksReady)
            .join(enter=> enter
                    .append("line")
                    .lower(),
                update => update,
                exit => exit.remove()
            )
            .style("stroke-width",1)
            // .style("stroke-width",d=>d.value)
            .attr("stroke", "#000000")
            .attr("stroke-opacity", 0.2)



        vis.node =  vis.svg
            .selectAll("circle")
            .data( vis.nodesReady)
            .join(enter=>enter
                .append('circle')
                .raise()
                .on('mouseover', function(event, d){
                    // console.log(event)
                    d3.select(this)
                        // .attr('fill', 'red')
                        .attr('stroke-width', 5)
                        .attr('opacity', 1)
                    vis.updateTooltip(event,d)
                })
                .on('mouseout', function(event, d){
                    // console.log(d)
                    d3.select(this)
                        .attr('fill', d=>d.Main==="TRUE" ? "#0c6ae6": "#d5d5d5") //"#52ff00": "#02335f") //
                        .attr('stroke-width', 1)
                        .attr('opacity', d=>d.Main==="TRUE" ? 1 : 0.7)
                    vis.removeTooltip()

                })
                // .attr("fill", color)
                // .call(vis.drag(vis.simulation))
                .on('mouseover.fade', vis.fade(0.1))
                .on('mouseout.fade', vis.fade(1)),// apply a transition,
                update=>update,
                exit=>exit.remove())
            .attr("r",  d=>vis.radiusScale(d.value))
            .attr('fill', d=>d.Main==="TRUE" ? "#0c6ae6": "#f6f6f6")
            .attr("stroke", "#000000")
            .attr('stroke-opacity', d=>d.Main==="TRUE" ? 1 : 0.5)
            .attr('stroke-width', 2)
            .attr('opacity', d=>d.Main==="TRUE" ? 1 : 0.7)
            // .attr("z-index",d=>d.Main==="TRUE" ? 100 : -100)// control the speed of the transition


        // vis.textElems = vis.svg.append('g')
        //     .selectAll('text')
        //     .data(vis.nodesReady)
        //     .join('text')
        //     .text(d => d.id)
        //     .attr('font-size',2)
        //     // .attr('x', d=>d.x)
        //     // .attr('y', d=>d.y)
        //     .call(vis.drag(vis.simulation))
        //     .on('mouseover.fade', vis.fade(0.1))
        //     .on('mouseout.fade', vis.fade(1));



        vis.linkedByIndex = {};
        vis.linksReady.forEach(d => {
            vis.linkedByIndex[`${d.source.index},${d.target.index}`] = 1;
        });

        // console.log(vis.linksReady)

    }

    updateTooltip(event,d){
        let vis = this;
        console.log(d)

        vis.citedBy=[]
        vis.linksReady.filter(l=>l.target.id === d.id).forEach((d,i)=>{
            // console.log(d)
            vis.citedBy.push(d.source.id)
        })
        console.log( vis.citedBy, vis.citedBy.length)
        vis.tooltip
            .style("opacity", 1)
            .attr('class', ' flex flex-wrap max-w-max break-all font-bold mt-4')
            .text(d.paper)

        vis.toolTipCB.exit().remove()


        if (vis.citedBy.length!=0) {

            vis.toolTipCB
                .append('text')
                .attr('class', 'font-normal underline')
                .text('Cited By')


            vis.toolTipCB.selectAll('li')
                .data(vis.citedBy)
                .enter()
                .append('li')
                .attr('class', 'font-light')
                .html(String)

        } else {
            vis.toolTipCB
                .append('text')
                .attr('class', 'font-normal underline')
                .text('')
        }

        if (d.Main==='TRUE'){

            vis.toolTipCB
                .append('text')
                .attr('class', 'font-normal underline')
            // .text('Total Citations: ' + )
        }


            // .append('li')
            // .append('ul')
            // .html(vis.citedBy.map((d,i)=>{
            //     `
            //     <div>
            //         Cited by ${d}
            //     </div>
            //     `
            // }))

    }

    removeTooltip(){
        let vis = this;
        vis.tooltip
            .style("opacity", 0)
            // .style("left", 0)
            // .style("top", 0)
            .html(``);

        vis.toolTipCB
            .html(``)
    }

    fade(opacity) {
        let vis = this;
        return (event,d)=> {
            vis.node.style('opacity', function (o) { return vis.isConnected(d, o) ? 1 : opacity });
            // vis.textElems.style('visibility', function (o) { return vis.isConnected(d, o) ? "visible" : "hidden" });
            vis.link.style('stroke-opacity', o => (o.source === d || o.target === d ? 1 : opacity));
            vis.link.style('stroke-width', o => (o.source === d || o.target === d ? 3 : 0.5));
            if(opacity === 1){
                vis.node.style('opacity', d=>d.Main==='TRUE'? 1: 0.7)
                // vis.textElems.style('visibility', 'hidden')
                vis.link.style('stroke-opacity', 0.3)
                vis.link.style('stroke-width',1)


            }
        };
    }

    isConnected(a, b) {
        let vis = this;
        // console.log("here",a)
        return vis.linkedByIndex[`${a.index},${b.index}`] || vis.linkedByIndex[`${b.index},${a.index}`] || a.index === b.index;
    }

    // drag(simulation){
    //     function dragstarted(event) {
    //         // if (!event.active) simulation.alphaTarget(0.3).restart();
    //         event.subject.fx = event.subject.x;
    //         event.subject.fy = event.subject.y;
    //     }
    //
    //     function dragged(event) {
    //         event.subject.fx = event.x;
    //         event.subject.fy = event.y;
    //     }
    //
    //     function dragended(event) {
    //         // if (!event.active) simulation.alphaTarget(0.3).restart();
    //         event.subject.fx = null;
    //         event.subject.fy = null;
    //     }
    //
    //     return d3.drag()
    //         .on("start", dragstarted)
    //         .on("drag", dragged)
    //         .on("end", dragended);
    // }

    // ticked(){
    //     let vis = this
    //     vis.u = d3.select('svg')
    //         .selectAll('circle')
    //         .data(vis.nodesReady)
    //         .join('circle')
    //         .attr('r', 5)
    //         .attr('cx', function(d) {
    //             return d.x
    //         })
    //         .attr('cy', function(d) {
    //             return d.y
    //         });
    // }
}



