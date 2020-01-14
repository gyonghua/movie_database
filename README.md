# About
A project to showcase skills acquired after web development self study from May - Aug 2017.  
  
This is a movie database app containing all /r/movies official discussions with sentiment score of comments.  
  
The sentiment score is derived from the top ten comments sorted by Best within the movie's discussion. The sentiment analysis is powered by Indico.  

Backend API is powered using Flask while the front-end uses React.

# Project takeaways
## API access restrictions without authentication
I wanted to find a way to allow api call only from the React app. There is unfortunately no good way to implement that without authentication which I wanted to avoid using. The closest solution to the problem was to use CORS. The downside is that it can restrict direct ajax calls but it is not able to prevent people who knows the endpoint address from accessing its data.

## Component customisation in React
The semantic-ui framework was used to provide the styling for the app. There was one components where some customisation was required. It was solved by changing the source code in the modules itself. It does have the downside of getting reset if the module is updated in the future. A better solution would be to use composition for component customisation.
