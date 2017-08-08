var axios = require("axios")

var movieLink = "http://www.pandaspeculator/movielist"

function getMovies() {
    return axios.get(movieLink).then(function(movies){
        
        return movies.data
    })
}

module.exports = getMovies