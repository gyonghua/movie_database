var React = require('react')
var Input = require("semantic-ui-react").Input
var Button = require("semantic-ui-react").Button
var Icon = require("semantic-ui-react").Icon
var Segment = require("semantic-ui-react").Segment
var Filter = require("./Filter")
var SortMovies = require("./SortMovies")



class SearchBar extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            searchContent: "",
            genres : [],
            sentiments : [],
            releaseYearStart: 2000,
            releaseYearEnd: 2017,
            sortOption: "release",
            sortOrder: "desc",

        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleFilterChange = this.handleFilterChange.bind(this)
        this.handleResetClick = this.handleResetClick.bind(this)
        this.updateMovieListOrder = this.updateMovieListOrder.bind(this)
        this.setSortState = this.setSortState.bind(this)
    }
   
    handleFilterChange(e, data) {
        this.setState(function(){
            var state = {}
            state[data.name] = data.value
            return state
        })
    } 
    
    handleSubmit(e){
        if (e){e.preventDefault()}
            this.props.dimPage(true)
            var searchedList = this.props.searchMovieList(this.props.movies, this.state)
            this.props.updateSearchResult(searchedList, this.updateMovieListOrder)
    }

    handleResetClick() {
        
        // restore defaults. sort order remains the same
        this.setState(function(){
            return {
                searchContent: "",
                genres: [],
                sentiments: [],
                releaseYearStart : 2000,
                releaseYearEnd: 2017,         
        }
        }, this.handleSubmit)

    }
    
    handleChange(e) {
        var value = e.target.value
        this.setState(function(){
            return {
                searchContent : value
            }
        })
    }

    setSortState(key, value, callback){
        this.setState(function(){
            var state = {}
            state[key] = value
            return state
        }, callback)
    }

    updateMovieListOrder() {
        if (this.state.sortOption === "release") {
            this.props.sortByRelease(this.props.searchResults, this.state.sortOrder)
        }

        else if (this.state.sortOption === "sentiment") {
            this.props.sortBySentiment(this.props.searchResults, this.state.sortOrder)
        }

        else if (this.state.sortOption === "metascore") {
            this.props.sortByScore(this.props.searchResults, this.state.sortOrder)
        }
        setTimeout(this.props.dimPage.bind(null, false), 200)
    }



    render(){
        return(
            <div>
                <Segment  className="search-container">
                <form className="search-form" onSubmit={this.handleSubmit}>
                
                <Input  fluid={true}
                        placeholder="Search movie titles or directors"
                        action={{icon:"search", disabled :!this.state.searchContent}}
                        value={this.state.searchContent}
                        onChange= {this.handleChange}/>
                
                <Filter updateSearchResult = {this.props.updateSearchResult}
                        movies = {this.props.movies}
                        handleFilterChange = {this.handleFilterChange}
                        handleResetClick = {this.handleResetClick} 
                        sentiments = {this.state.sentiments}
                        genres = {this.state.genres}
                        releaseYearStart = {this.state.releaseYearStart}
                        releaseYearEnd= {this.state.releaseYearEnd}
                        />
                </form>
                </Segment>
                <SortMovies updateMovieListOrder = {this.updateMovieListOrder}
                            sortByRelease = {this.props.sortByRelease} 
                            sortBySentiment = {this.props.sortBySentiment} 
                            sortByScore = {this.props.sortByScore}
                            movies = {this.props.movies}
                            searchResults = {this.props.searchResults}
                            setSortState = {this.setSortState}
                            sortOption = {this.state.sortOption}
                            sortOrder = {this.state.sortOrder}
                             />
                
            </div>
        )
    }
}

module.exports = SearchBar