;(function($){
    Array.prototype.unique = function(){
        var n = [];
        for(var i = 0; i < this.length; i++){
            if(n.indexOf(this[i]) === -1){
                n.push(this[i]);
            }
        }
        return n;
    };

    Array.prototype.largest = function(){
        var largest = 0;
        var bigNum = -Infinity;
        for(var i = 0; i < this.length; i++){
            if(this[i] > bigNum){
                largest = i;
                bigNum = this[i];
            }
        }
        return largest;
    };

    var allFeatures = ['outlook', 'temperature', 'humidity', 'wind', 'mood', 'hunger', 'cost'];

    var days = [
        ['Sunny', 'Hot', 'High', 'Weak', 'Sad', 'Full', 'High'],
        ['Sunny', 'Hot', 'High', 'Strong', 'Happy', 'Hungry', 'Low'],
        ['Overcast', 'Hot', 'High', 'Weak', 'Sad', 'Hungry', 'High'],
        ['Rain', 'Mild', 'High', 'Weak', 'Sad', 'Hungry', 'Low'],
        ['Rain', 'Cool', 'Normal', 'Weak', 'Sad', 'Full', 'High'],
        ['Rain', 'Cool', 'Normal', 'Strong', 'Happy', 'Full', 'Low'],
        ['Overcast', 'Cool', 'Normal', 'Strong', 'Happy', 'Hungry', 'High'],
        ['Sunny', 'Mild', 'High', 'Weak', 'Sad', 'Full', 'Low'],
        ['Sunny', 'Cool', 'Normal', 'Weak', 'Sad', 'Hungry', 'High'],
        ['Rain', 'Mild', 'Normal', 'Weak', 'Sad', 'Hungry', 'Low'],
        ['Sunny', 'Mild', 'Normal', 'Strong', 'Happy', 'Hungry', 'High'],
        ['Overcast', 'Mild', 'High', 'Strong', 'Happy', 'Full', 'Low'],
        ['Overcast', 'Hot', 'Normal', 'Weak', 'Sad', 'Full', 'High'],
        ['Rain', 'Mild', 'High', 'Strong', 'Angry', 'Hungry', 'Low']
    ];

    var shouldWePlay = ['No', 'No', 'Yes', 'Yes', 'Yes', 'No', 'Yes', 'No', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'No'];

    var possibleClasses = shouldWePlay.unique();

    var features = allFeatures;

    function makeClasses(usableFeatures){
        var tempClasses = [];
        for(var y = 0; y < days.length; y++){
            for(var x = 0; x < features.length; x++){
                if(usableFeatures.indexOf(x) == -1) continue;

                if(typeof(tempClasses[x]) === "undefined"){
                    tempClasses[x] = {};
                }

                if(typeof(tempClasses[x][days[y][x]]) === "undefined"){
                    tempClasses[x][days[y][x]] = 1;
                } else {
                    tempClasses[x][days[y][x]]++;
                }
            }
        }
        var classes = [];
        for(var i = 0; i < tempClasses.length; i++){
            if(typeof(tempClasses[i]) !== "undefined") {
                var c = [];
                var keys = Object.keys(tempClasses[i]);
                for (var j = 0; j < keys.length; j++) {
                    c.push({
                        c: keys[j],
                        n: tempClasses[i][keys[j]],
                        p: []
                    });
                }
                classes[i] = c;
            }
        }
        return classes;
    }

    function makeOutputProbabilities(){
        var out = [];
        possibleClasses.forEach(function (cl) {
            var numC = 0;
            shouldWePlay.forEach(function(sh){
                if(sh === cl){
                    numC++;
                }
            });
            var probC = numC / shouldWePlay.length;
            out.push(probC);
        });
        return out;
    }

    function makeClassOutputProbabilities(Sclasses){
        //go through each feature
        for(var featureNumber = 0; featureNumber < Sclasses.length; featureNumber++){
            if(typeof(Sclasses[featureNumber]) !== "undefined"){
                var s = Sclasses[featureNumber];
                //go through each class in each feature
                s.forEach(function(cl){
                    var probCl = 0;
                    //go through each possible class
                    possibleClasses.forEach(function(pClass){
                        var numPclass = 0;
                        //go through each output
                        shouldWePlay.forEach(function(sh, dayNumber){
                            if(days[dayNumber][featureNumber] === cl.c && pClass === sh){
                                numPclass++;
                            }
                        });
                        probCl = numPclass / cl.n;
                        cl.p.push(probCl);
                    });
                });
            }
        }
        return Sclasses;
    }

    function makeSentropy(pOuts){
        var ent = 0;
        pOuts.forEach(function(out){
            ent += (-out) * (Math.log(out) / Math.log(2))
        });
        return ent;
    }

    function calcTree(newFeatures){
        var outputProbabilities = makeOutputProbabilities();
        var sClasses = makeClasses(newFeatures);
        makeClassOutputProbabilities(sClasses);

        var sEntropy = makeSentropy(outputProbabilities);

        var sCentropies = sClasses.map(function(f){
            return f.map(function(cl){
                var ent = makeSentropy(cl.p);
                if(isNaN(ent)){
                    return 0;
                }
                return ent;
            });
        });

        var cGain = sClasses.map(function(f, fi){
            var gain = 0;
            f.forEach(function(cl, cli){
                gain += (Math.abs(cl.n) / Math.abs(days.length)) * sCentropies[fi][cli];
            });
            return sEntropy - gain;
        });

        var largest = cGain.largest();
        var root = features[largest];


        var featureMap = newFeatures.map(function(nf){
            return {
                gain: cGain[nf],
                feature: features[nf]
            };
        }).sort(function(a, b){
            return a.gain < b.gain;
        });



        return [root, sCentropies, featureMap, sClasses];
    }

    function init(){

        function calc(rootFeatures){
            if(rootFeatures.length === 0) return;
            var rootData = calcTree(rootFeatures.map(function (el) {
                return allFeatures.indexOf(el);
            }));

            var newRoot = {
                name: rootData[0],
                children: []
            };

            var classEntropies = rootData[1];
            var classData = rootData[3];
            var newChildFeatures = [];
            var featureIndex = features.indexOf(rootData[0]);
            classEntropies[featureIndex].forEach(function(ent, enti){
                if(ent === 0){
                    var value = classData[featureIndex][enti];
                    newRoot.children.push({
                        name: value.c,
                        prob: value.p
                    });
                }else{
                    var value = classData[featureIndex][enti];
                    newChildFeatures.push({
                        name: value.c,
                        prob: value.p,
                        children: []
                    });
                }
            });

            var featureMap = rootData[2];
            var which = 0;
            var featureGroups = [];
            featureMap.forEach(function(fm){
                if(fm.feature !== rootData[0] && newChildFeatures.length > 0){
                    if(featureGroups.length < newChildFeatures.length) featureGroups.push([]);

                    featureGroups[which].push(fm.feature);

                    which++;
                    if(which % newChildFeatures.length == 0){
                        which = 0;
                    }
                }
            });

            newChildFeatures.forEach(function(ncf, ncfi){
                if(rootFeatures.length > 1 && typeof(featureGroups[ncfi]) !== "undefined") {
                    ncf.children.push(calc(featureGroups[ncfi]));
                }
                newRoot.children.push(ncf);
            });

            return newRoot;
        }

        var fea = calc(allFeatures);
        drawD3tree(fea);
        predict(fea);
    }

    function predict(root){
        var values = $("#guess select")
            .map(function(i, el){
                return {x: i, f: $(el).val()};
            })
            .toArray();
        console.log(values, root);

        var stack = [root];
        var question = root.name;
        var answer = values[0].f;
        while(stack.length > 0){
            var item = stack.pop();
            var isLeaf = typeof(item.prob) !== "undefined";
            var hasChildren = typeof(item.children) != "undefined";

            if(
                (hasChildren && !isLeaf) ||
                (hasChildren && item.name === answer)
            ){
                stack = stack.concat(item.children);
            }else if(answer === item.name){
                var highestProb = item.prob.largest();
                console.log(item.name);
                console.log("Answer: " + possibleClasses[highestProb]);
                $("#prediction").html("Answer: " + possibleClasses[highestProb]);
            }

            if(!isLeaf){
                question = item.name;
                answer = values.filter(function(value){
                    return features[value.x] === question;
                });
                answer = answer[0].f;
            }
        }
    }

    function drawD3tree(treeData){
        d3.select("svg").remove();

        var canvas = d3.select("#d3_container").append("svg")
            .attr("width", $(window).width() / 2)
            .attr("height", 500)
            .append("g")
            .attr("transform", "translate(50, 50)");

        var tree = d3.layout.tree()
            .size([400, 400]);

        var nodes = tree.nodes(treeData);
        var links = tree.links(nodes);

        var node = canvas.selectAll(".node")
            .data(nodes)
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", function(d){
                return "translate(" + d.y + ", " + d.x + ")";
            });

        node.append("circle")
            .attr("r", 10)
            .attr("stroke", function(d){
                return typeof(d.prob) != "undefined" ? "palevioletred" : "steelblue";
            })
            .attr("fill", "white");

        node.append("text")
            .text(function(d){
                return d.name;
            })
            .attr("transform", "translate(-10, -15)");

        var diagonal = d3.svg.diagonal()
            .projection(function(d){
                return [d.y, d.x];
            });

        canvas.selectAll(".link")
            .data(links)
            .enter()
            .append("path")
            .attr("class", "link")
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("d", diagonal);
    }

    $(function () {
        var drawn = false;
        $('#data_table').on('draw.dt', function () {
            $("#data_table tr:first th:not(:last)").each(function(i, el){
                var selectValues = $("#data_table td:nth-child(" + (i + 1) + ")")
                    .map(function(i, el){
                        return $(el).text();
                    })
                    .toArray()
                    .unique();

                if(!drawn){
                    $("#guess ul").append(
                        "<li>" + $(this).text()
                        + "<select data-x='"+ i +"'>"
                        + selectValues
                            .map(function(svalue){
                                return "<option value='" + svalue + "' >"
                                    + svalue + "</option>";
                            }).join("")
                        + "</select>" +
                        "</li>"
                    );
                }

                $("#data_table td:nth-child(" + (i + 1) + ")").each(function(j, el){
                    var value = $(el).text();
                    var select = "<select class='the-select' data-x='" + i + "' data-y='" + j + "'>";
                    var options = selectValues
                        .map(function(svalue){
                            return "<option value='" + svalue + "' " + (value == svalue ? "selected='selected'" : "") + ">"
                                + svalue + "</option>";
                        });
                    select += options.join("");
                    select += "</select>";
                    $(el).html(select);
                });
            });
            drawn = true;
        });


        $("#data_table").DataTable({
            data: days.map(function(day, dayi){
                return day.concat([shouldWePlay[dayi]]);
            }),
            columns: allFeatures.concat(['Play?']).map(function(f){
                return {title: f};
            }),
            columnDefs: [{
                targets: allFeatures.map(function(f, i){
                    return i;
                }),
                className: 'mdl-data-table__cell--non-numeric'
            }],
            paging: false,
            ordering: false,
            info: false,
            searching: false
        });

        $(document).on("change", ".the-select", function(e){
            var x = $(this).data("x");
            var y = $(this).data("y");
            var value = $(this).val();
            days[y][x] = value;
            init();
        });

        $(document).on("change", "#guess ul select", function(e){
            init();
        });

        init();
    });


})(jQuery);