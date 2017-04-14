import Papa from 'papaparse';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import DataTable from './DataTable';

class Mnb extends Component {

    constructor(props) {
        super(props);

        this.uniqueCats = Array
            .apply(null, {length: 15})
            .map(function(n){
                return [];
            });

        this.probabilities = Array
            .apply(null, {length: 15})
            .map(function(n){
                return {};
            });

        const uclength = this.uniqueCats.length;
        for (let i = 0; i < uclength; i++) {

        }

        Papa.parse("adult_data.csv", {
            download: true,
            step: (row) => {
                row.data[0].forEach((el, i) => {
                    if(this.uniqueCats[i].indexOf(el) === -1){
                        this.uniqueCats[i].push(el);
                    }
                });
            },
            complete: (results) => {
                console.log(this.uniqueCats);
            }
        });
    }

    render() {
        return (
            <div>
                <DataTable
                    mnb={this} />
            </div>
        );
    }
}


ReactDOM.render(<Mnb />, document.getElementById('react_container'));
