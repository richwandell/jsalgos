new class Huffman {
    constructor() {
        this.deepest = 0;
        $("#the_text").on("keyup", () => this.doHuffman());

        this.doHuffman();

        $(".d3_container").on("mousewheel", (e) => {
            let old = $(e.currentTarget).css("zoom");
            let delta = e.originalEvent.wheelDelta;
            delta = Number(1 / delta) * 3;
            let n = Number(old) + delta;
            $(".d3_container").css("zoom", n);
            e.preventDefault();
        });
    }

    doHuffman() {
        let text = $("#the_text").val();
        let chars = [];
        let charData = {};

        let numIndex = 0;
        let numBits = 0;
        for(let i = 0; i < text.length; i++) {
            let char = text.charAt(i);
            if(typeof(charData[char]) === "undefined") {
                charData[char] = {
                    code: Number(numIndex).toString(2),
                    fre: 0,
                    char: char
                };
                numBits = charData[char].code.length;
                numIndex++;
            }
            charData[char].fre++;

            chars.push(char);
        }

        charData = Object.keys(charData)
            .map((i) => {
                let item = charData[i];
                let fillNum = numBits - item.code.length;
                item.code = Array(fillNum).fill(0).join("") + item.code;
                return item;
            })
            .sort((a, b) => {
                if(Number(a.code) > Number(b.code)){
                    return 1;
                } else {
                    return -1;
                }
            });

        this.buildBeforeTable(charData);

        let length = charData.length;
        let root = this.buildTreeFromCharData(charData);
        this.drawTree1(root, length);



        let root1 = this.buildHuffmanTree(charData);
        this.drawTree2(root1, length);

        let afterData = this.generateAfterData(root1, charData);
        this.buildAfterTable(afterData);
    }

    generateAfterData(root, charData) {
        let data = [];

        for(let o of charData) {
            let code = this.findCode(root, o.char, "", 0);
            data.push({
                char: o.char,
                code: code,
                fre: o.fre
            });
        }
        return data;
    }

    findCode(root, char, code, depth) {
        if(typeof(root.children) !== "undefined"){
            let left = root.children[0];
            if(left.char === char) {
                return code + left.index;
            }

            let right = root.children[1];
            if(right.char === char) {
                return code + right.index;
            }

            let leftCode = this.findCode(left, char, code + left.index, depth+1);
            let rightCode = this.findCode(right, char, code + right.index, depth+1);

            if(leftCode !== null) {
                return leftCode;
            }

            if(rightCode !== null) {
                return rightCode;
            }
        }

        if(this.deepest < depth) {
            this.deepest = depth + 1;
        }
        return null;
    }

    buildHuffmanTree(charData) {
        let cmp = (a, b) => {
            if(a.fre < b.fre) {
                return -1;
            }
            return 1;
        };
        let data = charData
            .map((i) => {
                return {
                    fre: i.fre,
                    char: i.char,
                    name: i.fre + "",
                    children: []
                }
            })
            .sort(cmp);

        while(data.length > 1) {
            let l = data.shift();
            let r = data.shift();
            l.index = "0";
            r.index = "1";

            let node = {
                fre: l.fre + r.fre,
                char: null,
                name: (l.fre + r.fre) + "",
                children: [l,r]
            };

            data.push(node);
            data = data.sort(cmp);
        }
        return data[0];
    }

    buildTreeFromCharData(charData){
        let root = {
            children: [],
            name: " ",
            char: null,
            color: "steelblue"
        };

        for(let o of charData) {
            let moves = o.code.split("").map(i => Number(i))
            let last = root;

            for(let m = 0; m < moves.length; m++){
                let move = moves[m];
                let child = {
                    children: [],
                    name: move + "",
                    char: null,
                    color: "steelblue"
                };
                if(m === moves.length - 1) {
                    child.char = o.char;
                }

                if(typeof(last.children[move]) === "undefined") {
                    last.children[move] = child;
                    last = child;
                } else {
                    last = last.children[move];
                }
            }
        }

        return root;
    }

    buildBeforeTable(charData) {
        $("#frequency_before tbody, #frequency_before tfoot").html("");
        let totalTotalBits = 0;
        for(let o of charData) {
            let totalBits = o.code.length * o.fre;
            totalTotalBits += totalBits;
            let row = `<tr>
                <td>${o.char}</td>
                <td>${o.code}</td>
                <td>${o.fre}</td>
                <td>${totalBits}</td>
                </tr>`;
            $("#frequency_before tbody").append(row);
        }
        $("#frequency_before tfoot").append(`
            <tr>
                <td colspan="3">Total Size</td>               
                <td>${totalTotalBits}</td>
            </tr>
        `);
    }

    buildAfterTable(charData) {
        $("#frequency_after tbody, #frequency_after tfoot").html("");
        let totalTotalBits = 0;
        for(let o of charData) {
            let totalBits = o.code.length * o.fre;
            totalTotalBits += totalBits;
            let row = `<tr>
                <td>${o.char}</td>
                <td>${o.code}</td>
                <td>${o.fre}</td>
                <td>${totalBits}</td>
                </tr>`;
            $("#frequency_after tbody").append(row);
        }
        $("#frequency_after tfoot").append(`
            <tr>
                <td colspan="3">Total Size</td>               
                <td>${totalTotalBits}</td>
            </tr>
        `);
    }

    drawD3Tree(treeData, canvas) {
        let tree = d3.layout.tree().nodeSize([20, 50]);

        let nodes = tree.nodes(treeData);
        let links = tree.links(nodes);

        let diagonal = d3.svg.diagonal()
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

        let node = canvas.selectAll(".node")
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
                //if(d.name === "0" || d.name === "1") {
                    return "steelblue";
                //}
            })
            .attr("fill", function(d){
                //if(d.name === "0" || d.name === "1") {
                    return "steelblue";
                //}
                //return "white";
            });

        node.append("text")
            .text(function(d){
                if(d.char !== null) {
                    return d.char;
                }
                return d.name;
            })
            .attr("transform", function(d) {
                if(d.char !== null) {
                    return "translate(15, 2)";
                }
                return "translate(-4, 3)";
            })
            .attr("stroke", function(d){
                if(d.char === null) {
                    return "white";
                }
                return "black";
            })
            .attr("fill", function(d){
                if(d.char === null) {
                    return "white";
                }
                return "black";
            });

        node.append("text")
            .text(function(d){
                if(d.char !== null) {
                    return d.name;
                }
                return "";
            })
            .attr("transform", function(d) {
                return "translate(-4, 3)";
            })
            .attr("stroke", function(d){
                return "white";
            })
            .attr("fill", function(d){
                return "white";
            });
    }

    drawTree1(treeData, num){
        d3.select("#d3_container_1 svg").remove();
        let height = Math.max(32 * num + 8 * num, 500);
        let translateY = 21 * num;

        let canvas = d3.select("#d3_container_1").append("svg")
            .attr("width", Math.max(500, $("#d3_container_1").width()))
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(50, " + translateY + ")");

        this.drawD3Tree(treeData, canvas);
    }

    getDepth(root) {
        let depth = 0;
        if(root.children.length > 0) {
            for(let c of root.children) {
                let d = this.getDepth(c);

                if(d > depth) {
                    depth = d;
                }
            }
        }
        return 1 + depth;
    }

    drawTree2(treeData, num){
        d3.select("#d3_container_2 svg").remove();
        let height = Math.max(32 * num + 8 * num, 500);
        let depth = this.getDepth(treeData);
        console.log(depth);
        let width = depth * 50;

        let translateY = 21 * num;

        let canvas = d3.select("#d3_container_2").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(10, "+translateY+")");

        this.drawD3Tree(treeData, canvas);
    }
};