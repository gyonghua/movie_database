var React = require('react')
var Header = require("semantic-ui-react").Header
var Segment = require("semantic-ui-react").Segment
var Radio = require("semantic-ui-react").Radio
var Accordion = require("semantic-ui-react").Accordion

function Intro(props) {
    return(
        <div>
            <Header className="title" color="blue" as="h2" textAlign="center">Movies from /r/movies' official discussions</Header> 

            <Accordion defaultActiveIndex={0}>
            <Accordion.Title >
                <Radio toggle defaultChecked label="Show/Hide Introduction"/>
            </Accordion.Title > 
            <Accordion.Content>
                <Segment className="introduction">
                <Header as="h3">Introduction</Header>

                <div className="about">

                <p>Ever find your taste to be similar to Reddit's /r/movies? Then this database is for you.</p>

                <p>Each movie contains a <b>sentiment</b> that is derived from the Best 10  comments of its official discussion. The result should be representative on what the majority of users on /r/movies feel about the movie</p> 

                <p>The Sentiment Analysis on the comments are done using tools provided by <a href="https://indico.io/">Indico</a></p>

                <p><strong>P.S: Do not use this on mobile.</strong></p>
                </div>

                </Segment>
            </Accordion.Content>
            </Accordion>
            
        </div>
    )
}


module.exports = Intro