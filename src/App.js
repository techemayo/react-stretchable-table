import React, { Component } from 'react'
import ReactTable from "react-table"; 
import 'react-table/react-table.css';
import 'react-table-filter/lib/styles.css';
import axios from 'axios';
import LoadingSpinner from './spinner/LoadingSpinner';
export default class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      'spinner':true,
      'updatedData': [],
       'dataHeader': []
    };
    
    
    this._filterUpdated = this._filterUpdated.bind(this);
    this.fetchTables = this.fetchTables.bind(this);
    this.fetchTables("https://dannydb.wirelesswavestx.com/gettable")

  }
  fetchTables = (url) => {
    return new Promise((resolve, reject) => {
      let formdata = new FormData();
      formdata.append("id", 4)
      formdata.append("table_name", "ginnie_data")
      axios.post(url, formdata, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      }).then(result => {
        if (result.status === 200) {
          let dataHeader=[];

          Object.keys(result.data.data[0]).forEach(e => {
            // const str2 = e.charAt(0).toUpperCase() + e.slice(1);
            let str2 = e.charAt(0) + e.slice(1);
            dataHeader.push(
              {
                Header: str2.replace(/_/g, ' ').toUpperCase(),
                accessor: str2.replace(/_/g, ' ')
              }
            )

          })
          this.setState({
            'dataHeader': dataHeader,
          });
          console.log(dataHeader);

          this.setState({
            'updatedData': result.data.data,
          });
          console.log(result.data.data)
          console.log(this.state.updatedData)
          this.setState({
            'spinner':false
          })
          resolve(result.data);
        } else {
          this.setState({
            'spinner':false
          })
          reject()
        }
      })
    });
  }
  _filterUpdated(newData, filtersObject) {
    this.setState({
      'updatedData': newData,
    });
  }

  render() {

  if(this.state.spinner){
    return(
      <div>
          <LoadingSpinner/>
      </div>
    )
  }else{
    return(
      <div>
           <ReactTable  
    defaultPageSize={100}
    data={this.state.updatedData} 
    columns={this.state.dataHeader}  
 />
      </div>
    )
  }

  }
}
