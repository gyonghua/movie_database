var React = require('react')
var Dropdown = require("semantic-ui-react").Dropdown
var Icon = require("semantic-ui-react").Icon
var Header = require("semantic-ui-react").Header

class SortMovies extends React.Component {
    constructor(props) {
        super(props)

        this.updateSort = this.updateSort.bind(this)
        
    }
    

    // semantic's dropdown returns 2 object instead of the usual event object.
    updateSort(e,d) { 
        var value = d.value
        var key = d.name
        this.props.setSortState(key, value, this.props.updateMovieListOrder)
        
    }

    render(){
        var sortOption = [{
            text :"release date",
            value : "release"},
            {text: "sentiment",
             value : "sentiment"
            },
            {text: "metascore",
             value : "metascore"
            }]
            
            // icons have to be done this way for it to show in the dropdown
        var sortOrder = [{
            text:<Icon name="arrow down" />,
            value: "desc"},
            {
            text: <Icon name="arrow up" />,
            value: "asc",
            }]

        return(
            <div className="sort-menu">
                Sort by: &nbsp; 
                <Dropdown name ="sortOption" options={sortOption} value={this.props.sortOption} button simple onChange={this.updateSort}/>
                
                <Dropdown name = "sortOrder" options={sortOrder} button simple value={this.props.sortOrder} onChange={this.updateSort} />
                <span className="results">{this.props.searchResults ? this.props.searchResults.length + " results found" : "Processing"} </span>
            </div>

        )


    }
}



module.exports = SortMovies
