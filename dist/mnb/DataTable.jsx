import React, {Component} from 'react';

class DataTable extends Component {

    constructor(props) {
        super(props);
        this.mnb = props.mnb;
    }

    render () {
        return (
            <table id="data_table" className="mdl-data-table" cellSpacing="0" />
        );
    }
}

export default DataTable;