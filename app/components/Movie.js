var React = require('react')
var Image = require("semantic-ui-react").Image
var Item = require("semantic-ui-react").Item
var Button = require("semantic-ui-react").Button
var Icon = require("semantic-ui-react").Icon
var Header = require("semantic-ui-react").Header
var Progress = require("semantic-ui-react").Progress
var Menu = require("semantic-ui-react").Menu
var Dimmer = require("semantic-ui-react").Dimmer




function Links(props) {
    return (
        
            <Menu className="movie-links" compact color="blue">
                <Menu.Item active link={true} target="_blank" href={"http://www.imdb.com/title/" + props.imdb }>IMDB</Menu.Item>
                <Menu.Item active link={true} target="_blank" href={'https://www.reddit.com/r/movies/search?q=flair%3ADiscussion+Official+spoilers+' + props.title + '&restrict_sr=on'}>Reddit discussion</Menu.Item>
            </Menu>
        
    )
}

function Sentiment(props) {
    // highlights the proper sentiment of the movie
    var isVeryPositive = (props.sentiment === "very positive")
    var isPositive = (props.sentiment === "positive")
    var isNeutral = (props.sentiment === "neutral")
    var isNegative = (props.sentiment === "negative")
    var isVeryNegative = (props.sentiment === "very negative")

    return (     
        <div className="sentiment">
            <Header>sentiment</Header>
                <Button active={isVeryPositive} color = {isVeryPositive ? "green" : null} disabled={!isVeryPositive}>Very Positive</Button>
                <Button active={isPositive} color = {isPositive ? "olive" : null} disabled={!isPositive}>Positive</Button>
                <Button active={isNeutral} disabled={!isNeutral}>Neutral</Button>
                <Button active={isNegative} color = {isNegative ? "orange" : null} disabled={!isNegative}>Negative</Button>
                <Button active={isVeryNegative} color = {isVeryNegative ? "red" : null} disabled={!isVeryNegative}>Very Negative</Button>
                
        </div>
    )
}

function Genres(props) {
    return (
    <div className="genre">
        {props.genres.map(function(genre){
            return (
                <Button key= {genre} active compact={true}>{genre}</Button>
            )
        })}
    </div>
    )
}
function progressColor(metascore) {
    if (metascore > 60) {
        return "green"
    }
    else if (metascore < 40) {
        return "red"
    }
    else {return null}
}

function convertSentiment(sentiment) {
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

function loopArrayToString(content) {
    var arrayAsString = ""

    if (content.length > 1) {
        for (var i=0; i<content.length-1; i++) {
        arrayAsString += content[i] + ", "
        }   
        arrayAsString += content[content.length - 1]
    }
    else {
        arrayAsString += content[0]
    }
    
    return arrayAsString
}




function Movies(props) {

    var list = props.searchResults || props.movies
    return(
    <Dimmer.Dimmable as="div">
    <Dimmer active={props.dim}/>
    <Item.Group className="movies">
    
        
       {list.map(function(movie){
           var release_date = new Date(movie.release_date)
           var release_year = release_date.getFullYear()
           var sentiment = convertSentiment(movie.indico_sentiment)
           var directors = loopArrayToString(movie.directors)
           
           return(
               
               <Item className="movie" key={movie.imdb_id}>
                                
                    
                    <Item.Image src={"https://image.tmdb.org/t/p/w154/" + movie.poster_link}
                                alt={"poster for " + movie.movie_title}
                                size="small" />
                    
                    
                    <Item.Content>  
                    <Item.Header>
                        {movie.movie_title}<span> ({release_year})</span>
                    </Item.Header>
                    <Item.Meta>  
                        directed by: {directors}
                    </Item.Meta>
                    <Item.Description >
                        {/* dist/es/Progress.js was modified to change progress display to custom formatting */}
                        {movie.metascore ? <Progress className = "metascore" 
                                  size="large" 
                                  percent= {movie.metascore}  
                                  progress
                                  color = {progressColor(movie.metascore)} /> : <div className = "metascore-unavailable">Metascore not available</div>}
                    </Item.Description>
                    <Item.Extra>
                    <Genres genres = {movie.genres} />
                    </Item.Extra>
                    <Item.Extra>
                    <Links imdb = {movie.imdb_id}
                            title={movie.movie_title} />
                    </Item.Extra>
                    </Item.Content>

                    <Sentiment sentiment={sentiment}/>     
                </Item>
                        
           )
       })}

    </Item.Group>
    </Dimmer.Dimmable>
    )
}

module.exports = Movies