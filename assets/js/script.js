

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
          } else {
            getLatestMovieTMDB();
          }


        });
      } else {
        alert("Error: movie not found for given ID, IMDB");
        getLatestMovieTMDB();
      }
    })
    .catch(function(error) {
      alert("unable to connect to IMDB");
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
        alert("Error: ID not found for given movie title, IMDB");
        getLatestMovieTMDB();
      }
    })
    .catch(function(error) {
      alert("unable to connect to IMDB");
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
        alert("Error: movie not found for given int on TMDB");
        getLatestMovieTMDB();
      }
    })
    .catch(function(error) {
      alert("unable to connect to TMDB");
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
          getRandomMovieTMDB(randomNumber);

        });
      } else {
        alert("Error: movie not found for given int");
      }
    })
    .catch(function(error) {
      alert("unable to connect to TMDB");
    });
}

getLatestMovieTMDB();


// getRandomMovieIMDB();