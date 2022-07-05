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
        // vis.colorScale = d3.scaleOrdinal()
        //     .range(["#ff006e","#8338ec","#3a86ff","#ffbe0b"])
        vis.mainColorScale = d3.scaleOrdinal()
            .range(["#0c6ae6", "#d5d5d5"])
            .domain(['TRUE','FALSE'])

        console.log(vis.mainColorScale('FALSE'))

        vis.colorScale = d3.scaleOrdinal()
            .range(["#0ef3a0","#d5d5d5","#d5d5d5", "#d5d5d5"])

        vis.colorScaleSeq = d3.scaleSequential()
            // .interpolator(["#f7fcf0","#e0f3db","#ccebc5","#a8ddb5","#7bccc4","#4eb3d3","#2b8cbe","#08589e"])
            .interpolator(d3.interpolateYlGnBu)
            //GnBu, PuBu
            // .range(["#f7fcfd","#f6fbfd","#f6fbfc","#f5fafc","#f4fafc","#f3f9fc","#f3f9fb","#f2f8fb","#f1f8fb","#f0f7fa","#f0f7fa","#eff6fa","#eef6fa","#eef5f9","#edf5f9","#ecf4f9","#ebf4f8","#eaf3f8","#eaf3f8","#e9f2f7","#e8f2f7","#e7f1f7","#e7f0f7","#e6f0f6","#e5eff6","#e4eff6","#e3eef5","#e3eef5","#e2edf5","#e1ecf4","#e0ecf4","#dfebf3","#deeaf3","#ddeaf3","#dce9f2","#dce8f2","#dbe8f2","#dae7f1","#d9e6f1","#d8e6f0","#d7e5f0","#d6e4f0","#d5e4ef","#d4e3ef","#d3e2ee","#d2e1ee","#d1e1ee","#d0e0ed","#cfdfed","#cedeec","#cddeec","#ccddec","#cbdceb","#cadbeb","#c9dbea","#c8daea","#c7d9ea","#c6d8e9","#c5d8e9","#c4d7e8","#c3d6e8","#c2d5e7","#c1d5e7","#c0d4e7","#bfd3e6","#bed2e6","#bdd2e5","#bcd1e5","#bbd0e5","#bacfe4","#b9cfe4","#b8cee3","#b7cde3","#b5cce3","#b4cce2","#b3cbe2","#b2cae1","#b1c9e1","#b0c9e1","#afc8e0","#afc7e0","#aec6df","#adc5df","#acc5de","#abc4de","#aac3de","#a9c2dd","#a8c1dd","#a7c0dc","#a6c0dc","#a5bfdb","#a4bedb","#a3bdda","#a3bcda","#a2bbd9","#a1bad9","#a0b9d8","#9fb8d8","#9fb7d7","#9eb6d7","#9db5d6","#9cb4d6","#9cb3d5","#9bb2d5","#9ab1d4","#9ab0d4","#99afd3","#98aed3","#98add2","#97acd1","#97aad1","#96a9d0","#95a8d0","#95a7cf","#94a6ce","#94a5ce","#93a3cd","#93a2cc","#92a1cc","#92a0cb","#929fcb","#919dca","#919cc9","#909bc9","#909ac8","#9098c7","#8f97c7","#8f96c6","#8f95c6","#8f93c5","#8e92c4","#8e91c4","#8e8fc3","#8e8ec2","#8e8dc2","#8d8cc1","#8d8ac0","#8d89c0","#8d88bf","#8d86be","#8d85be","#8d84bd","#8c82bc","#8c81bc","#8c80bb","#8c7eba","#8c7dba","#8c7cb9","#8c7ab9","#8c79b8","#8c78b7","#8c76b7","#8c75b6","#8c74b5","#8c72b5","#8c71b4","#8c70b3","#8b6eb3","#8b6db2","#8b6cb1","#8b6ab1","#8b69b0","#8b68af","#8b66af","#8b65ae","#8b64ae","#8b62ad","#8b61ac","#8b60ac","#8b5eab","#8a5daa","#8a5caa","#8a5aa9","#8a59a8","#8a58a8","#8a56a7","#8a55a6","#8a54a6","#8a52a5","#8951a4","#894fa3","#894ea3","#894da2","#894ba1","#894aa1","#8949a0","#88479f","#88469e","#88449d","#88439d","#88419c","#88409b","#873f9a","#873d99","#873c98","#873a98","#873997","#863796","#863695","#863494","#863393","#853192","#853091","#852f90","#852d8f","#842c8e","#842a8d","#84298c","#83278b","#83268a","#822589","#822388","#812287","#812186","#801f84","#801e83","#7f1d82","#7e1c81","#7e1a80","#7d197f","#7c187d","#7b177c","#7b167b","#7a1579","#791478","#781377","#771276","#761174","#741073","#730f72","#720f70","#710e6f","#700d6d","#6e0c6c","#6d0c6b","#6c0b69","#6a0a68","#690a66","#680965","#660863","#650862","#630760","#62075f","#60065d","#5f055c","#5d055a","#5c0459","#5a0457","#580356","#570354","#550253","#540251","#520150","#50014e","#4f004d","#4d004b"])


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

        vis.colorScaleSeq.domain([d3.min(vis.radii),d3.max(vis.radii)])

        // console.log(vis.colorScaleSeq(1))

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

        // vis.setColor()

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
            .force('collision', d3.forceCollide().radius(d=>vis.radiusScale(d.value)*1.02).strength(1))
            .on("tick", () => {
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
            .join(
                enter=>enter
                    .append('circle')
                    .raise()
                    .attr('fill',d=>vis.setColor(d))
                    .on('mouseover', function(event, d){
                        d3.select(this)
                            .attr("stroke", d=>d.Main==="TRUE" ? "#0ef3a0" : "#3a3a3a")
                            .attr('stroke-width', 5)
                            .attr('opacity', 1)
                        vis.updateTooltip(event,d)
                    })
                    // .on('click', function(event, d){
                    //     d3.select(this)
                    //         .attr("stroke", d=>d.Main==="TRUE" ? "#0ef3a0" : "#3a3a3a")
                    //         .attr('stroke-width', 5)
                    //         .attr('opacity', 1)
                    //     vis.updateTooltip(event,d)
                    // })
                    .on('mouseout', function(event, d){
                        d3.select(this)
                            .attr('fill', d=>vis.setColor(d)) //"#52ff00": "#02335f") //
                            .attr("stroke", d=>d.Main==="TRUE" ? "#000000": "#3a3a3a")
                            .attr('stroke-width', d=>d.Main==="TRUE" ? 3 :0.5)
                        vis.removeTooltip()
                    })
                    .on('mouseover.fade', vis.fade(0.15))
                    .on('mouseout.fade', vis.fade(1))
                    .call(vis.drag(vis.simulation)),
                update=>update // THE PROBLEM IS HERE. I THINK.
                    .attr('fill',d=>vis.setColor(d)),
                exit=>exit.remove())
            .attr("r",  d=>vis.radiusScale(d.value))
            .attr("stroke", d=>d.Main==="TRUE" ? "#000000": "#3a3a3a")
            .attr('stroke-width', d=>d.Main==="TRUE" ? 3 :0.5)


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

        // if (d.Main==='TRUE'){
        //
        //     vis.toolTipCB
        //         .append('text')
        //         .attr('class', 'font-normal underline')
        //         .text('Total Citations: ' + d.value)
        // }

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

    setColor(node){
        let vis = this
        console.log(document.getElementById('toggleColor').value)

        // vis.svg.selectAll("circle")
        //     .transition()
        //     .duration(2000)
        //     .attr("fill", d=>document.getElementById('toggleColor').value ? vis.colorScaleSeq(d.value): vis.mainColorScale(d.Main))
        // if (document.getElementById('toggleColor').value){
        //
        // } else {
        //
        // }



        return document.getElementById('toggleColor').value==='true' ?  vis.mainColorScale(node.Main): vis.colorScaleSeq(node.value)
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
            // vis.node.style('stroke', function (o) { return vis.isConnected(d, o) ? '#fa0404' : '#2e2e2e' });
            // vis.textElems.style('visibility', function (o) { return vis.isConnected(d, o) ? "visible" : "hidden" });
            vis.link.style('stroke-opacity', o => (o.source === d || o.target === d ? 1 : opacity));
            vis.link.style('stroke-width', o => (o.source === d || o.target === d ? 3 : 0.5));
            if(opacity === 1){
                vis.node.style('opacity', 1)
                // vis.textElems.style('visibility', 'hidden')
                vis.link.style('stroke-opacity', 0.3)
                vis.link.style('stroke-width',d=>d.Main ==='TRUE'?3:0.5)
                // vis.link.style("stroke", d=>d.Main==="TRUE" ? "#000000": "#3a3a3a")


            }
        };
    }

    isConnected(a, b) {
        let vis = this;
        // console.log("here",a)
        return vis.linkedByIndex[`${a.index},${b.index}`] || vis.linkedByIndex[`${b.index},${a.index}`] || a.index === b.index;
    }

    drag(simulation){
        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.01).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0.01).restart();
            event.subject.fx = null;
            event.subject.fy = null;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }

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



