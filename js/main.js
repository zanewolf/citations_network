// define vizs
let myNetwork

let promises = [
    d3.csv("data/network_nodes_FinalWithRegex.csv"),
    d3.csv("data/network_links_final.csv")
];

Promise.all(promises)
    .then( function(data){ initMainPage(data) })
    .catch( function (err){console.log(err)} );

// initMainPage
function initMainPage(dataArray) {


    // console.log(dataArray)
    myNetwork = new NetworkVis('network-graph', 'paperName',dataArray[0], dataArray[1]);


}

// function filterShared() {
//     // networkVis.wrangleData(document.getElementById("filterButton").value)
//     if (document.getElementById("filterButton").value == "false") {
//         document.getElementById("filterButton").value = "true";
//         // document.getElementById("labelToggle").class = "rgb(255,145,0)";
//         myNetwork.filterShared(true);
//
//     } else if (document.getElementById("filterButton").value == "true") {
//         document.getElementById("filterButton").value = "false";
//         // document.getElementById("labelToggle").style.background = "rgb(26,255,0)";
//         myNetwork.filterShared(false);
//     }
// }
//
// function filterMain(){
//     // networkVis.wrangleData(document.getElementById("filterButton").value)
//     if (document.getElementById("filterMain").value == "false") {
//         document.getElementById("filterMain").value = "true";
//         // document.getElementById("labelToggle").class = "rgb(255,145,0)";
//         myNetwork.filterMain(true);
//
//     } else if (document.getElementById("filterMain").value == "true") {
//         document.getElementById("filterMain").value = "false";
//         // document.getElementById("labelToggle").style.background = "rgb(26,255,0)";
//         myNetwork.filterMain(false);
//     }
// }
function resetViz(){
    document.getElementById('filterButton').value=='true' ? document.getElementById('filterButton').click() : null
    document.getElementById('filterButton').value = 'false'
    document.getElementById('filterMain').value=='true' ? document.getElementById('filterMain').click() : null
    document.getElementById('filterMain').value = 'false'


    myNetwork.wrangleData()
}

function triggerFilter(buttonToggle){
    let b= document.getElementById(buttonToggle)
    buttonToggle ? b.value = (b.value == 'true') ? 'false' : 'true' : null

    myNetwork.filterYears()
}