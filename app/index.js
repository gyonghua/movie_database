var React = require('react')
var ReactDom = require("react-dom")
require ("./css/index.css")
require ("semantic-ui-css/semantic.min.css")
var App = require("./components/App")



ReactDom.render(
    <App />, document.getElementById("app")
)