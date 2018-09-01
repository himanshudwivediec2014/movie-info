$(document).ready(() => {

	$('#warningAlert').hide();

	$('#warning').hide();

	$('form').on('submit', (e) => {
		e.preventDefault();
	})

	/*$('#searchText').focus();*/

	$("input").focus(function(){
	    $(this).addClass("searchClass");
	    $(this).addClass("pl-3");
	});


	$("input").blur(function(){
	    $(this).removeClass("searchClass");
	    $(this).removeClass("pl-3");
	});



	/*On submitting the search button, different URLs are generated based upon the 
	  User Requests made through search criteria, and these urls are then used to invoke their respective
	  get movie methods*/

	$('#searchButton').click(() => {
		let arr = [];
		let URL;

		$('#warningAlert').fadeOut(500);
		$('#warning').fadeOut(500);

		arr.push($('#searchText').val())
		arr.push($('#searchId').val())
		arr.push($('#searchYear').val())
		

		if((arr[0] != '' || arr[0] != null) && (arr[1] == '' || arr[1] == null) && (arr[2] == '' || arr[2] == null)) {
			
			URL = `http://www.omdbapi.com/?apikey=d756e06d&s=${arr[0]}`;
			console.log(URL);
			getMoviesByTitle(URL);

		} else if((arr[0] == '' || arr[0] == null) && (arr[1] != '' || arr[1] != null) && (arr[2] == '' || arr[2] == null)) {
			
			URL = `http://www.omdbapi.com/?apikey=d756e06d&i=${arr[1]}`;
			console.log(URL);
			getMoviesById(URL);

		} else if((arr[0] == '' || arr[0] == null) && (arr[1] == '' || arr[1] == null) && (arr[2] != '' || arr[2] != null)) {
			
			console.log("Please enter movie title or movie id along with year");
			$('#warningAlert').fadeIn(500);

		} else if((arr[0] == '' || arr[0] == null) && (arr[1] != '' || arr[1] != null) && (arr[2] != '' || arr[2] != null)) {
			
			URL = `http://www.omdbapi.com/?apikey=d756e06d&i=${arr[1]}&y=${arr[2]}`;
			console.log(URL);
			getMoviesById(URL);

		} else if((arr[0] != '' || arr[0] != null) && (arr[1] == '' || arr[1] == null) && (arr[2] != '' || arr[2] != null)) {
			
			URL = `http://www.omdbapi.com/?apikey=d756e06d&s=${arr[0]}&y=${arr[2]}`;
			console.log(URL);
			getMoviesByTitle(URL);

		} else if((arr[0] != '' || arr[0] != null) && (arr[1] != '' || arr[1] != null) && (arr[2] == '' || arr[2] == null)) {
			
			URL = `http://www.omdbapi.com/?apikey=d756e06d&s=${arr[0]}&i=${arr[1]}`;
			console.log(URL);
			getMoviesByTitle(URL);

		} else if((arr[0] != '' || arr[0] != null) && (arr[1] != '' || arr[1] != null) && (arr[2] != '' || arr[2] != null)) {
			
			URL = `http://www.omdbapi.com/?apikey=d756e06d&s=${arr[0]}&i=${arr[1]}&y=${arr[2]}`;
			console.log(URL);
			getMoviesByTitle(URL);

		} else if((arr[0] == '' || arr[0] == null) && (arr[1] == '' || arr[1] == null) && (arr[2] == '' || arr[2] == null)) {
			
			console.log("Please enter a valid input");
			$('#warningAlert').fadeIn(500);
			
		}

		
	})
});



/*method to search for movies based on IMDB ID*/
	let getMoviesById = (URL) => {
		$.ajax({
			type: 'GET',
			datatype: 'json',
			url: URL,
			async: true,
			success: (response) => {

				if(response.Response == "True"){
					let movie = response;
						console.log(response);
						let output = `<div class="col-lg-4 col-md-4 col-sm-6 mb-5 text-center">								
											<div>
												<img class="card-img-top mt-3 mb-3" id="moviePoster" src="${movie.Poster}" alt="Card image cap" onerror=this.src='fallback.png'>
											</div>									

											<div class="card-body my-0 pt-1 pb-0">
												<h5 class="card-title" style="color: white;">${movie.Title}</h5>
												<button onclick="getSelectedMovie('${movie.imdbID}')" id="modalTrigger" type="button" class="btn btn-primary" data-toggle="modal" data-target="#modalView">More Details</button>
											</div>								
										</div>								
									`
						$('#moviesCard').html(output);
					} else{
						$('#warning').fadeIn(500);
					}
			},
			error: (error) => {
	            alert("Some error occured !! Please refresh the page.")
	        },
			timeout: 3000
		});
	}

/*ID method ends*/



/*method to search for movies based on Title*/
	let getMoviesByTitle = (URL) => {
		$.ajax({
			type: 'GET',
			datatype: 'json',
			url: URL,
			async: true,
			success: (response) => {

				if(response.Response == "True"){
					let movies = response.Search;
					let output = '';
					console.log(response);
					
					for(eachMovie of movies){
						let movieId = eachMovie.imdbID;
						output += `<div class="col-lg-4 col-md-4 col-sm-6 mb-5 text-center eachCard">								
										<div>
											<img class="card-img-top mt-3 mb-3" id="moviePoster" src="${eachMovie.Poster}" alt="Card image cap" onerror=this.src='altImg.png'>
										</div>									

										<div class="card-body my-0 pt-1 pb-0">
											<h5 class="card-title" id="cardHeading" style="color: white;height: 8vh; overflow:hidden;">${eachMovie.Title}</h5>
											<button onclick="getSelectedMovie('${movieId}')" id="modalTrigger" type="button" class="btn btn-primary" data-toggle="modal" data-target="#modalView">More Details</button>
										</div>								
									</div>								
								`
					}
					
					$('#moviesCard').html(output);
				} else{
					$('#warning').fadeIn(500);
				}			
			},
			error: (error) => {

				alert("Some error occured !! Please refresh the page.")
	        },
			timeout: 3000
		});
	}
/*Title method ends*/



/*method to choose a movie and display the details of that movie by using a modal*/
	let getSelectedMovie = (id) => {
		$.ajax({
			type: 'GET',
			datatype: 'json',
			url: 'http://www.omdbapi.com/?apikey=d756e06d&i=' + id,
			async: true,
			success: (response) => {

				let movie = response;
				let displayMovie = `
							        <div class="row d-flex justify-content-around text-center">
							            <div class="col-lg-4 col-md-7 mt-4">
							              <img id="selectedImg" src="${movie.Poster}" onerror=this.src='altImg.png' class="thumbnail mt-2" style="border-radius: 0.5vw;">
							            </div>
							            <div class="col-lg-6 col-md-7">
							              <h2 class="text-center">${movie.Title}</h2>
							              <ul class="list-group text-left">
							                <li class="list-group-item"><strong>Genre:</strong> ${movie.Genre}</li>
							                <li class="list-group-item"><strong>Released:</strong> ${movie.Released}</li>
							                <li class="list-group-item"><strong>Rated:</strong> ${movie.Rated}</li>
							                <li class="list-group-item"><strong>IMDB Rating:</strong> ${movie.imdbRating}</li>
							                <li class="list-group-item"><strong>IMDB ID:</strong> ${movie.imdbID}</li>
							                <li class="list-group-item"><strong>Director:</strong> ${movie.Director}</li>
							                <li class="list-group-item"><strong>Writer:</strong> ${movie.Writer}</li>
							                <li class="list-group-item"><strong>Actors:</strong> ${movie.Actors}</li>
							              </ul>
							            </div>
							          </div>
							          <div class="row mt-3">
							            <div class="col">						              
							              <hr>
							              <div class="d-flex justify-content-around" id="modalFooter">
							              	<a id="footerLink" href="http://imdb.com/title/${movie.imdbID}" target="_blank" class="btn btn-primary">Go To IMDB</a>
							              	<a id="footerLinkTwo" href="index.html" class="btn btn-success">Home</a>
							              </div>						              
							            </div>
							          </div>
							      `
					$('#modalBody').html(displayMovie);
			},
			error: (error) => {
				alert("Some error occured !! Please refresh the page.")
			},
			timeout: 3000
		});
	}

/*method ends*/