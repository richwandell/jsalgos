import Papa from 'papaparse';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import DataTable from './DataTable';

class Mnb {

    constructor() {

        this.data = [];

        this.categories = [
            'age',
            'workclass',
            'fnlwgt',
            'education',
            'education-num',
            'marital-status',
            'occupation',
            'relationship',
            'race',
            'sex',
            'capital-gain',
            'capital-loss',
            'hours-per-week',
            'native-country'
        ];

        this.classes = [
            '<=50K',
            '>50K'
        ];

        this.uniqueCats = Array
            .apply(null, {length: 15})
            .map(function(n){
                return [];
            });

        this.counts = Array
            .apply(null, {length: 15})
            .map(function(n){
                return {};
            });

        this.countGT50k = Array
            .apply(null, {length: 15})
            .map(function(n){
                return {};
            });
        this.countLTE50k = Array
            .apply(null, {length: 15})
            .map(function(n){
                return {};
            });

        Papa.parse("adult_data.csv", {
            download: true,
            step: (row) => {
                row.data = row.data.map((x) => x.trim());
                this.data.push(row.data);
                row.data.forEach((el, i) => {
                    if(this.uniqueCats[i].indexOf(el) === -1){
                        this.uniqueCats[i].push(el);
                    }
                    if(typeof(this.counts[i][el]) === "undefined") {
                        this.counts[i][el] = 1;
                    }
                    if(typeof(this.countGT50k[i][el]) === "undefined"){
                        this.countGT50k[i][el] = 1;
                    }
                    if(typeof(this.countLTE50k[i][el]) === "undefined"){
                        this.countLTE50k[i][el] = 1;
                    }
                    this.counts[i][el] += 1;

                    if(row.data[14] === this.classes[0]) {
                        this.countLTE50k[i][el] += 1;
                    } else {
                        this.countGT50k[i][el] += 1;
                    }
                });
            },
            complete: (results) => {
                this.displaySelectBoxes();
                this.bindEvents();
                this.displayProbabilities();
            }
        });
    }

    displaySelectBoxes() {
        $("#select_box_holder tbody").html("");
        for(let i = 0; i < this.categories.length; i++) {
            let cat = this.categories[i];
            let options = [];
            for(let unique of this.uniqueCats[i].sort()) {
                options.push(`<option value='${unique}'>${unique}</option>`);
            }
            $("#select_box_holder tbody")
                .append(`
                    <tr data-category="${i}">
                        <td>${cat}</td>
                        <td><select data-category="${i}">
                            <option value="" ></option>
                            ${options.join("")}
                            </select></td>
                        <td></td>
                        <td data-class="<=50K"></td>
                        <td data-class=">50K"></td>
                    </tr>
                `);
            let randomChoice = this.uniqueCats[i][Math.round(Math.random() * this.uniqueCats[i].length)];
            $(`#select_box_holder select[data-category='${i}']`).val(randomChoice);
        }
        for(let c of this.classes) {
            $("#select_box_holder tbody")
                .append(`
                    <tr data-class="${c}">
                        <td>${c}</td>
                        <td></td>
                        <td></td>
                    </tr>
                `);
        }
        $(`#select_box_holder select[data-category='2']`).val(" ");
    }

    displayProbabilities() {
        let selectBoxes = $("#select_box_holder select");
        let pLTE50KallTop = 1.0;
        let pGT50KallTop = 1.0;

        let c1 = this.counts[14]['<=50K'];
        let c2 = this.counts[14]['>50K'];

        $(`#select_box_holder tbody tr td:nth-child(3)`).html('');
        $(`#select_box_holder tbody tr td:nth-child(4)`).html('');
        $(`#select_box_holder tbody tr td:nth-child(5)`).html('');

        for(let box of selectBoxes) {
            let category = Number($(box).data("category"));
            let value = $(box).val();
            if (value === "" || value === null) continue;

            let p = this.counts[category][value];

            p = `${p}/${this.data.length}`;
            $(`#select_box_holder tr[data-category="${category}"] td:nth-child(3)`).html(p);

            let v1 = this.countLTE50k[category][value];
            pLTE50KallTop *= (v1 / c1);

            p = `${v1}/${c1}`;
            $(`#select_box_holder tr[data-category="${category}"] td:nth-child(4)`).html(p);

            let v2 = this.countGT50k[category][value];
            pGT50KallTop *= (v2  / c2);

            p = `${v2}/${c2}`;
            $(`#select_box_holder tr[data-category="${category}"] td:nth-child(5)`).html(p);

        }

        pLTE50KallTop *= (c1 / this.data.length);
        pGT50KallTop *= (c2 / this.data.length);

        $(".selected").removeClass("selected");
        let denominator = pLTE50KallTop + pGT50KallTop;
        let pLTE50K = (pLTE50KallTop / (denominator));
        let pGT50K = (pGT50KallTop / (denominator));

        let sumProbls = pLTE50K + pGT50K;

        $("#results_table tbody tr:nth-child(3)").html(`
            <td>${pLTE50K}</td>            
            <td>${pGT50K}</td>            
        `);


        if(pLTE50K > pGT50K) {
            $("div#lteall").addClass("selected");
        } else if(pLTE50K < pGT50K) {
            $("div#eqall").addClass("selected");
        }
        for(let c of this.classes) {
            let p = this.counts[14][c];
            p = `${p}/${this.data.length}`;
            $(`#select_box_holder tr[data-class="${c}"] td:nth-child(3)`).html(p);
        }
    }

    bindEvents() {
        $("#select_box_holder select").change((e) => this.selectBoxChanged(e));
    }

    selectBoxChanged(e) {
        this.displayProbabilities();
    }
}

new Mnb();
