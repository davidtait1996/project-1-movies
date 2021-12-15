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
var langEl = $(".language");
var surveyAreaEl = $(".survey-area");
var detailsEl = $("section");
var historyEl = $("#history");

var currentMovie = "";
var dateFormat = 'M[/]D[/]YYYY'


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
            detailsEl.attr("style", "display:block");
            surveyAreaEl.attr("style", "display:block");

            currentMovie = data;

            $(".searchBtn").text("Start Chilling");

            movieTitleEl.text(data.title);
            movieDescEl.text(data.plot);
            if(data.image === "https://imdb-api.com/images/original/nopicture.jpg"){
              moviePosterEl.attr("src", "");
              moviePosterEl.attr("style", "display:none");
            } else {
              moviePosterEl.attr("src", data.image);
              moviePosterEl.attr("style", "display:block");
            }
            
            if(data.stars === "" || data.stars === null) {
              starringEl.attr("style", "display:none");
            } else {
              starringEl.text("Starring: " + data.stars);
              starringEl.attr("style", "display:block");
            }
            console.log(typeof data.imDbRating);
            if(data.imDbRating === null || data.imDbRating === ""){
              ratingEl.attr("style", "display: none");
            } else {
              ratingEl.text("IMDb Rating: " + data.imDbRating + "/10⭐");
              ratingEl.attr("style", "display: block");
            }
            
            yearEl.text(data.year);
            directorEl.text("Director: " + data.directors);
            genreEl.text(data.genres);
            runtimeEl.text(data.runtimeStr);
            langEl.text("Language: " + data.languages);
            websiteEl.attr("href", "https://www.imdb.com/title/" + data.id);
            surveyAreaEl.attr("style", "display:block");
            moviePosterEl.attr("style", "display:block");


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
          
          console.log("TMDB", data.id);
          var randomNumber = getRandomIntInclusive(0, data.id);
          detailsEl.attr("style", "display:none");
          // movieTitleEl.text("Searching.....why are you in a rush? You're not gonna watch this anyways...");
          $(".searchBtn").text("Searching...")
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

var searchHistory = function(){
  historyEl.html("");
  if(localStorage.length > 0){
    for (var i = 0; i < localStorage.length; i++){
      
      if(localStorage.getItem(localStorage.key(i))){
        var movieData = JSON.parse(localStorage.getItem(localStorage.key(i)));
        var newMovieEl = $("<div>");
        var movieDetails = $("<ul>").text(movieData.title);
        movieDetails.append(
          $("<li>").text(movieData.date),
          $("<li>").text(movieData.result)
        )
    
        newMovieEl.append(movieDetails);
    
        historyEl.append(newMovieEl);
      }
      

    }
  }

}

$(".searchBtn").on("click", function(event) {

  event.preventDefault();

  getLatestMovieTMDB();
  
});

$("#survey").change(function(event) {

  formText = $(this).val();
  var movieSurveyObj = {
    title: currentMovie.title,
    date: moment().format(dateFormat),
    result: formText
  }

  localStorage.setItem(currentMovie.title, JSON.stringify(movieSurveyObj));

  surveyAreaEl.attr("style", "display:none");

  searchHistory();
})


surveyAreaEl.attr("style", "display:none");
moviePosterEl.attr("style", "display:none");

searchHistory();