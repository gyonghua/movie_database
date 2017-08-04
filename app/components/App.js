var React = require('react')
var getMovies = require("../utils/api")
var Movies = require("./Movie")
var SearchBar = require("./SearchBar")
var Intro = require("./Intro")
var SortMovies = require("./SortMovies")
var Loader = require("semantic-ui-react").Loader
var Icon = require("semantic-ui-react").Icon
var Button = require("semantic-ui-react").Button


function smoothscroll() {
    var currentScroll = document.body.scrollTop
        
        if (currentScroll > 0) {
            window.requestAnimationFrame(smoothscroll)
            window.scrollTo(0, currentScroll - (currentScroll/4))
        }
}

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            
            processedMovieList : [],
            searchResults : null,
            dim : false
        }

        this.updateMovieList = this.updateMovieList.bind(this)
        this.updateSearchResult = this.updateSearchResult.bind(this)
        this.searchMovieList = this.searchMovieList.bind(this)
        this.matchSentiment = this.matchSentiment.bind(this)
        this.matchGenre = this.matchGenre.bind(this)
        this.dimPage = this.dimPage.bind(this)
        
    }

    // filter functions for search, genres, sentiments and release years. Returns true if match, to
    matchSearch(movie, searchTerm) {
        // searching title and directors, case insensitive. return true if match
            if (searchTerm == null) {
                return true
            }
            else if (movie["movie_title"].toString().toLowerCase().includes(searchTerm.toLowerCase())) {
                return true
            }
            else if (movie.directors.length > 1){
                for (var i=0; i< movie.directors.length-1; i++) {
                    if (movie["directors"][i].toString().toLowerCase().includes(searchTerm.toLowerCase())) {
                        return true
                    }                    
                }    
            }
            else {
                if (movie["directors"][0].toString().toLowerCase().includes(searchTerm.toLowerCase())) {
                        return true
                }                    
            }
    }
    
    matchRelease(movie, releaseStart, releaseEnd) {
        var release_date = new Date(movie.release_date)
        var release_year = release_date.getFullYear()

        return (release_year >= releaseStart && release_year <= releaseEnd)
        
    }

    //helper function for matchSentiment(). also exist in movie.js. *to refactor*
    convertSentiment(sentiment) {
    var floatSentiment = parseFloat(sentiment) 
    if (floatSentiment >= 0.75){
               return "very positive"
           }
    else if ( floatSentiment <= 0.25) {
        return "very negative"
    }
    else if (floatSentiment >= 0.55 && floatSentiment < 0.75) {
        return "positive"
    }
    else if (floatSentiment > 0.25 && floatSentiment <= 0.45) {
        return "negative"
    }
    else {return "neutral"}
    }
    
    matchSentiment(movie, sentiments) {
        if (sentiments.length === 0) {
            
            return true
        }
        
        else if (sentiments) {
            
            if (sentiments.indexOf(this.convertSentiment(movie.indico_sentiment)) > -1) {
            return true
            }
        }    
    }

    matchGenre(movie, genres) {
        
        
        if (genres.length === 0) {
            
            return true
        }
        
        // checks if movie has any of the genres selected
        else if (genres) {
            for (var i=0;i<genres.length;i++){
                if (movie.genres.indexOf(genres[i]) > -1){
                    return true
                }
            }
            
            
    }}
    // TODO matchGenres, match metascore, feedback results return


    searchMovieList(movieList, searchTerms) {
      
           
      return movieList.filter(function(movie){
          if (searchTerms.searchContent) {
            var searchTerm = searchTerms.searchContent.replace(/\s+/g, ' ').trim()
          }
          
          return this.matchSearch(movie, searchTerm) && this.matchRelease(movie, searchTerms.releaseYearStart, searchTerms.releaseYearEnd) && this.matchSentiment(movie, searchTerms.sentiments) && this.matchGenre(movie, searchTerms.genres)

            
        }, this)
    }

    updateSearchResult(movielist, callback) {
        this.setState(function(){
            return {
                searchResults : movielist,
            }
        }, callback)

    }
    updateMovieList(movielist) {
        this.setState(function(){
            return {
                processedMovieList : movielist
            }
        })

    }

    dimPage(value) {
        this.setState(function(){
            return{
                dim : value
            }
        })
    }

    
    sortMoviesbyRelease(movies, order){
        if (order === "desc") {
           movies.sort(function(a,b){
                var date1 = new Date(a.release_date)
                var date2 = new Date(b.release_date)
                return (date2 - date1)
            })
            
        }
        else if (order === "asc") {
            movies.sort(function(a,b){
                var date1 = new Date(a.release_date)
                var date2 = new Date(b.release_date)
                return (date1 - date2)
            })
        }
        this.updateSearchResult(movies)
    }

    sortMoviesbySentiment(movies, order){
        if (order === "desc") {
            movies.sort(function(a,b){
                
                return (b.indico_sentiment - a.indico_sentiment)
            })
        }
        else if (order === "asc") {
            movies.sort(function(a,b){

                return (a.indico_sentiment - b.indico_sentiment)
            }) 
        }
        this.updateSearchResult(movies)
    }

    sortMoviesbyScore(movies, order){
        // there are movies with no metascore, hence filtering required
        // var filteredMovies = movies.filter(function(movie){
        //     return movie.metascore !== 0
        // })
        if (order === "desc") {
            
            movies.sort(function(a,b){  
                return (b.metascore - a.metascore)
            })
            
        }
        else if (order === "asc") {
            movies.sort(function(a,b){
                
                return (a.metascore - b.metascore)
            })
        }
        this.updateSearchResult(movies)
    }

    
    
    componentDidMount() {
        getMovies().then(function(movies){
            var sortMovie = function(movielist) {
                return movies.sort(function(a,b){
                    var date1 = new Date(a.release_date)
                    var date2 = new Date(b.release_date)
                    return (date2 - date1)
            })
            }
            this.setState(function(){
                return{
                    // originalMovieList : movies,
                    processedMovieList:sortMovie(movies),
                    searchResults: sortMovie(movies)
                }
            })
        }.bind(this))
    }



 
    // match functions used by filter, sort functions used by sortMovies
    render() {
        return(
            <div>
                <Intro />
                <SearchBar movies = {this.state.processedMovieList}
                           updateSearchResult = {this.updateSearchResult}
                           searchMovieList = {this.searchMovieList}
                           matchRelease={this.matchRelease}
                           matchSearch={this.matchSearch}
                           matchSentiment={this.matchSentiment}
                           matchGenre={this.matchGenre}
                           sortByScore = {this.sortMoviesbyScore}
                           sortBySentiment = {this.sortMoviesbySentiment}
                           sortByRelease = {this.sortMoviesbyRelease} 
                           searchResults = {this.state.searchResults} 
                           dimPage = {this.dimPage}         
                           />
                
                {!this.state.searchResults ? <Loader active content="Loading" /> : <Movies movies = {this.state.processedMovieList}
                        searchResults = {this.state.searchResults}
                        showMovie = {this.state.showMovie}
                        dim = {this.state.dim} />}
                
                
                <Button onClick={smoothscroll} circular inverted color="blue" className="scroll-top" icon="arrow up" size="massive" />
                
            </div>
        )
    }
    
}

module.exports = App