import utils from 'https://ventumdashboard.s3.amazonaws.com/lib/utils.js';
import card from 'https://ventumdashboard.s3.amazonaws.com/dashboard/card/card.js';
import form from 'https://ventumdashboard.s3.amazonaws.com/dashboard/forms/form.js';
import buttons from 'https://ventumdashboard.s3.amazonaws.com/dashboard/buttons/buttons.js';
//import views from '../../views';
import views from "https://ventumdashboard.s3.amazonaws.com/views.js";

//Caracteristicas de este componente (chart)
const component = {
    //Dflt Modal State
    dfltState: {
        type: "chart",
        width: "auto",
        title: "NO TITLE",
        text: "",
        width: "50%",
        footerBtns: {},
        childs: {}
    },
    //Commandos específicos para el componente (chart)
    cmds: {
    },
    //Typos de hijos que puede tener el componente (chart)
    childTypes: ["modal"],
    show: (state, parent) => {
        const drawChart = () => {
            try {
                    var data = state.chart.dataset;
                    var type = state.chart.type;
                    var width = state.chart.width;
                    var height = state.chart.heigth;
                    var radius = width / 2;


                    var svg = d3.select(cardBody.id)
                        .append("svg")
                        .attr("width", width)
                        .attr("height", height);                        

                        g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
                    
                    //ORDEN DE LOS COLORES EN ESCALA
                    var color = d3.scaleOrdinal(['#4daf4a','#377eb8','#ff7f00','#984ea3','#e41a1c']);
                    
                    // Generate the pie
                    var pie = d3.pie();
                    
                    // Generate the arcs
                    if(type == "pie"){
                        var arc = d3.arc()
                                .innerRadius(0)
                                .outerRadius(radius);
                    
                    } else if(type == "donut"){
                        var arc = d3.arc()
                                .innerRadius(radius - ((radius/100)*15))
                                .outerRadius(radius);
                    
                    }else{
                        var arc = d3.arc()
                                .innerRadius(0)
                                .outerRadius(radius);    
                    }
                    
                    //Generate groups
                    var arcs = g.selectAll("arc")
                                .data(pie(data))
                                .enter()
                                .append("g")
                                .attr("class", "arc")
                    
                    //Draw arc paths / los arcos de la torta hay que dibujarlos con path.
                    arcs.append("path")
                        .attr("fill", function(d, i) {
                            return color(i);
                        })
                        .attr("d", arc);  
                        
                    return svg;
                
            } catch (error) {
                console.log(error);
                throw "Chart rendering failed!";
            }
        };
        console.log("Chart show: " + JSON.stringify(state));
        const cardParent = card.create({ title: state.title }, parent);
        var cardBody = cardParent.getElementsByClassName("card-body")[0];
        cardBody.id = state.path + "/card-body";
        drawChart();        
    }
};

export default component;