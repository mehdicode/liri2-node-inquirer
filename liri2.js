var inquirer = require("inquirer");

var fs = require("fs");

var request = require("request");

var Twitter = require('twitter');

var inquirer = require("inquirer");

var casts = "";

var spotify = require('spotify');

var tk = require("./key.js");

var movieId;

ask();

function exit() {
    inquirer.prompt([

        {
            type: "confirm",
            name: "Leave",
            message: "Is there anything else I can help You with?"
        }

    ]).then(function(user) {
        if (user.Leave === false) {
            console.log("your welcome!!!")

        } else {

            ask();

        }
    });
};

function ask() {
    inquirer.prompt([



        {
            type: "list",
            name: "doingWhat",
            message: "How can I help You???",
            choices: ["Music Info", "Movie Info", "See Your Tweets"]
        }

    ]).then(function(user) {

        // If the user guesses the password...
        if (user.doingWhat === "Music Info") {

            inquirer.prompt([



                {
                    type: "input",
                    name: "name",
                    message: "What is the name of Song/Artist???"
                }

            ]).then(function(user) {
                if (!user.name) {

                    spotify.search({
                        type: 'track',
                        query: "The Sign ace of base"
                    }, function(error, data) {
                        var artist = data.tracks.items[0].artists[0].name;
                        var song = data.tracks.items[0].name;
                        var url = data.tracks.items[0].external_urls.spotify;
                        var album = data.tracks.items[0].album.name;
                        if (error) {

                            return console.log(error);
                        }


                        console.log(artist);
                        console.log(song);
                        console.log(url);
                        console.log(album);
                        fs.appendFileSync('log.txt', "\r\n" + user.doingWhat + " => " + artist + ", " + song + ", " + url + ", " + album);

                    });


                } else {

                    spotify.search({
                        type: 'track',
                        query: user.name
                    }, function(error, data) {

                        var artist = data.tracks.items[0].artists[0].name;
                        var song = data.tracks.items[0].name;
                        var url = data.tracks.items[0].external_urls.spotify;
                        var album = data.tracks.items[0].album.name;

                        if (error) {

                            return console.log(error);
                        }

                        console.log(artist);
                        console.log(song);
                        console.log(url);
                        console.log(album);
                        fs.appendFileSync('log.txt', "\r\n" + user.doingWhat + " " + user.name + " => " + artist + ", " + song + ", " + url + ", " + album);
                    });
                };

                setTimeout(exit, 3000);


            });

        } else if (user.doingWhat === "Movie Info") {

            inquirer.prompt([


                {
                    type: "input",
                    name: "name",
                    message: "What is the name of Movie???"
                }

            ]).then(function(user) {
                if (!user.name) {



                    request('http://api.themoviedb.org/3/search/movie?api_key=5937f1b53d76a465b205fbdad5b48396&language=en-US&page=1&append_to_response=credits&query=Mr. Nobody.', function(error, response, body) {

                        if (!error) {

                            // console.log(JSON.stringify(response, null, 2)); 
                            movieId = JSON.parse(body).results[0].id;
                            var title = JSON.parse(body).results[0].original_title;
                            var date = JSON.parse(body).results[0].release_date;
                            var rate = JSON.parse(body).results[0].vote_average;
                            var lan = JSON.parse(body).results[0].original_language;
                            console.log(title);
                            console.log(date);
                            console.log(rate);
                            console.log(lan);
                            fs.appendFileSync('log.txt', "\r\n" + user.doingWhat + " " + "Mr. Nobody." + " => " + title + ", " + date + ", " + rate + ", " + lan);


                            request('https://api.themoviedb.org/3/movie/' + movieId + '?api_key=5937f1b53d76a465b205fbdad5b48396&append_to_response=credits', function(error, response, body) {

                                var country = JSON.parse(body).production_countries[0].name;
                                var url = JSON.parse(body).homepage;
                                console.log(country);
                                console.log(url);
                                for (var i = 0; i < 10; i++) {
                                    casts += ", " + JSON.parse(body).credits.cast[i].name;
                                }
                                console.log(casts);
                                fs.appendFileSync('log.txt', country + ", " + url + ", " + casts);
                            });
                        }

                    });


                } else {

                    request('http://api.themoviedb.org/3/search/movie?api_key=5937f1b53d76a465b205fbdad5b48396&language=en-US&page=1&append_to_response=credits&query=' + user.name, function(error, response, body) {

                        if (!error) {

                            movieId = JSON.parse(body).results[0].id;
                            var title = JSON.parse(body).results[0].original_title;
                            var date = JSON.parse(body).results[0].release_date;
                            var rate = JSON.parse(body).results[0].vote_average;
                            var lan = JSON.parse(body).results[0].original_language;

                            console.log(title);
                            console.log(date);
                            console.log(rate);
                            console.log(lan);
                            fs.appendFileSync('log.txt', "\r\n" + user.doingWhat + " " + user.name + " => " + title + ", " + date + ", " + rate + ", " + lan);

                            request('https://api.themoviedb.org/3/movie/' + movieId + '?api_key=5937f1b53d76a465b205fbdad5b48396&append_to_response=credits', function(error, response, body) {

                                var country = JSON.parse(body).production_countries[0].name;
                                var url = JSON.parse(body).homepage;
                                console.log(country);
                                console.log(url);
                                for (var i = 0; i < 10; i++) {
                                    casts += ", " + JSON.parse(body).credits.cast[i].name;
                                }
                                console.log(casts);
                                fs.appendFileSync('log.txt', country + ", " + url + ", " + casts);

                            });

                        }

                    });
                };

                setTimeout(exit, 3000);


            });




        } else {

            var client = new Twitter(tk.twitterKeys);

            client.get('statuses/user_timeline', function(error, tweets, response) {
                if (error) {
                    return console.log(error);
                }

                for (var i = 0; i < tweets.length; i++) {
                    var tText = tweets[i].text;
                    console.log(tText);
                    fs.appendFileSync('log.txt', "\r\n" + user.doingWhat + " => " + tText);
                }
            });

            setTimeout(exit, 3000);

        };




    });
};

// // If the user doesn't guess the password...