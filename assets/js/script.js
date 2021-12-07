var movieTitleEl = $(".recorded-item-index");
var movieDescEl = $(".movie-description");
var movieDetailEl = $(".movie-details");
var moviePosterEl = $(".poster");
var starringEl = $(".starring");
var ratingEl = $(".rating");
var yearEl = $(".year");
var directorEl = $(".director");
var genreEl = $(".genre");
var runtimeEl = $(".run-time");
var websiteEl = $(".recorded-item-image a");


function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
};

var getImdbMovieDetails = function (movieID) {
  var apiUrl = "https://imdb-api.com/en/API/Title/k_hvvonvlq/" + movieID + "/FullActor,FullCast,Posters,Images,Trailer,Ratings,Wikipedia,";
  fetch(apiUrl)
    .then(function(response) {
      if (response.ok) {
        response.json().then(function(data) {
          
          console.log("I am making it to movie details");
          if(data.errorMessage === null || data.errorMessage === ""){
            console.log("IMDB details", data);
            movieTitleEl.text(data.title);
            movieDescEl.text(data.plot);
            moviePosterEl.attr("src", data.image);
            starringEl.text("Starring: " + data.stars);
            ratingEl.text("IMDb Rating: " + data.imDbRating + "/10");
            yearEl.text(data.year);
            directorEl.text("Director: " + data.directors);
            genreEl.text(data.genres);
            runtimeEl.text(data.runtimeStr);
            websiteEl.attr("href", "https://www.imdb.com/title/" + data.id);

          } else {
            getLatestMovieTMDB();
          }


        });
      } else {
        console.log("Error: movie not found for given ID, IMDB");
        getLatestMovieTMDB();
      }
    })
    .catch(function(error) {
      console.log("unable to connect to IMDB");
    });
}

var getImdbMovieID = function(movieTitle) {
  var apiUrl = "https://imdb-api.com/en/API/SearchMovie/k_hvvonvlq/" + movieTitle;
  fetch(apiUrl)
    .then(function(response) {
      if (response.ok) {
        response.json().then(function(data) {
          
          console.log("IMDB ID", data);
          console.log("IMDB results length", data.results.length)
          if(data.results.length === 0){
            getLatestMovieTMDB();
          } else {
            getImdbMovieDetails(data.results[0].id);
          }

        });
      } else {
        console.log("Error: ID not found for given movie title, IMDB");
        getLatestMovieTMDB();
      }
    })
    .catch(function(error) {
      console.log("unable to connect to IMDB");
    });
};

var getRandomMovieTMDB = function(randomNumber) {
  // var apiUrl = "https://api.themoviedb.org/3/find/" + randomNumber + "?api_key=e44abc7c20ea2353c36cc39f15147646&language=en-US&external_source=imdb_id";
  var apiUrl = "https://api.themoviedb.org/3/movie/" + randomNumber + "?api_key=e44abc7c20ea2353c36cc39f15147646&language=en-US";
  fetch(apiUrl)
    .then(function(response) {
      if (response.ok) {
        response.json().then(function(data) {
          
          console.log("TMDB", data);
          getImdbMovieID(data.title);


        });
      } else {
        console.log("Error: movie not found for given int on TMDB");
        getLatestMovieTMDB();
      }
    })
    .catch(function(error) {
      console.log("unable to connect to TMDB");
    });
}

var getLatestMovieTMDB = function() {
  var apiUrl = "https://api.themoviedb.org/3/movie/latest?api_key=e44abc7c20ea2353c36cc39f15147646&language=en-US"
  fetch(apiUrl)
    .then(function(response) {
      if (response.ok) {
        response.json().then(function(data) {
          
          // console.log("TMDB", data.id);
          // return data.id;
          console.log(data.id);
          var randomNumber = getRandomIntInclusive(0, data.id);
          movieTitleEl.text("Searching.....why are you in a rush? You're not gonna watch this anyways...");
          getRandomMovieTMDB(randomNumber);

        });
      } else {
        console.log("Error: Couldn't get latest movie ID from TMDB");
      }
    })
    .catch(function(error) {
      console.log("unable to connect to TMDB");
    });
}

// getLatestMovieTMDB();

$(".searchBtn").on("click", function(event) {

  event.preventDefault();

  getLatestMovieTMDB();
  
});