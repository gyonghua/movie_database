var axios = require("axios")

var movieLink = "http://localhost:5000/movielist"

function getMovies() {
    return axios.get(movieLink).then(function(movies){
        
        return movies.data
    })
}

module.exports = getMovies