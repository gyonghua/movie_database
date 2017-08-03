var React = require('react')
var Dropdown = require("semantic-ui-react").Dropdown
var Button = require("semantic-ui-react").Button
var Grid = require("semantic-ui-react").Grid

var genrelist = [
    {key: "action", text: "Action", value: "Action"},
    {key: "adventure", text: "Adventure", value: "Adventure"},
    {key: "animation", text: "Animation", value: "Animation"},
    {key: "comedy", text: "Comedy", value: "Comedy"},
    {key: "crime", text: "Crime", value: "Crime"},
    {key: "documentary", text: "Documentary", value: "Documentary"},
    {key: "drama", text: "Drama", value: "Drama"},
    {key: "family", text: "Family", value: "Family"},
    {key: "fantasy", text: "Fantasy", value: "Fantasy"},
    {key: "history", text: "History", value: "History"},
    {key: "horror", text: "Horror", value: "Horror"},
    {key: "music", text: "Music", value: "Music"},
    {key: "mystery", text: "Mystery", value: "Mystery"},
    {key: "romance", text: "Romance", value: "Romance"},
    {key: "science fiction", text: "Science Fiction", value: "Science Fiction"},
    {key: "tv movie", text: "TV Movie", value: "TV Movie"},
    {key: "thriller", text: "Thriller", value: "Thriller"},
    {key: "war", text: "War", value: "War"},
    {key: "western", text: "Western", value: "Western"}
]

var sentimentlist = [
    {key: "very positive", text: "very positive", value:"very positive"},
    {key: "positive", text: "positive", value:"positive"},
    {key: "neutral", text: "neutral", value:"neutral"},
    {key: "negative", text: "negative", value:"negative"},
    {key: "very negative", text: "very negative", value:"very negative"}
]





class Filter extends React.Component {
    constructor(props) {
        super(props)
        
        this.handleChange = this.handleChange.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }

    handleChange(e, data) {
        this.props.handleFilterChange(e, data)
    }

    handleClick(e){
        e.preventDefault()
        this.props.handleResetClick()
    }


    
    render() {
            var yearStartState = this.props.releaseYearStart
            var yearEndState = this.props.releaseYearEnd
            var releaseYearStart = [
               {text: "2000", value: 2000, disabled: yearEndState < 2000},
               {text: "2013", value: 2013, disabled: yearEndState < 2013},
               {text: "2014", value: 2014, disabled: yearEndState < 2014},
               {text: "2015", value: 2015, disabled: yearEndState < 2015},
               {text: "2016", value: 2016, disabled: yearEndState < 2016},
               {text: "2017", value: 2017, disabled: yearEndState < 2017},
                ]

            var releaseYearEnd = [
                {text: "2000", value: 2000, disabled: yearStartState > 2000},
                {text: "2013", value: 2013, disabled: yearStartState > 2013},
                {text: "2014", value: 2014, disabled: yearStartState > 2014},
                {text: "2015", value: 2015, disabled: yearStartState > 2015},
                {text: "2016", value: 2016, disabled: yearStartState > 2016},
                {text: "2017", value: 2017, disabled: yearStartState > 2017}
]

        return(
            <div className="filters">
                <Grid>
                <Grid.Row columns={1}>
                <Grid.Column>
                    released from:&nbsp;
            
                    <Dropdown name="releaseYearStart" 
                              value={this.props.releaseYearStart} 
                              button 
                              options={releaseYearStart} 
                              onChange={this.handleChange} /> 

                    to &nbsp;

                    <Dropdown name="releaseYearEnd"
                              value={this.props.releaseYearEnd} 
                              button 
                              options={releaseYearEnd} 
                              onChange={this.handleChange}/>   
                </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                <Grid.Column width={4}>
                <Dropdown fluid name="sentiments" placeholder="sentiments" multiple selection options={sentimentlist} value = {this.props.sentiments} onChange={this.handleChange}/>
                </Grid.Column>
                <Grid.Column width={4}>
                <Dropdown fluid name="genres" placeholder="genres" multiple selection options={genrelist} value={this.props.genres} onChange={this.handleChange} />
                </Grid.Column>
                </Grid.Row>

                <Grid.Row columns={3}>
                <Grid.Column width={4}>
                <Button fluid content="Reset" icon="refresh" labelPosition="left" onClick={this.handleClick}/>
                </Grid.Column>
                <Grid.Column width={8} >
                <Button fluid content="Search" color= "blue" />
                </Grid.Column>
                </Grid.Row>
                </Grid>

            </div>
        )
    }

}

module.exports = Filter