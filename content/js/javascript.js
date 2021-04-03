(function($) {

	$(document).on('submit', '#j-search-form', function(e) {

		const api = {
			$geoCodingApi: 'https://api.openweathermap.org/geo/1.0/direct',
			$apiKey: 'e727b72a36203da805bf1ce55c36d074',
		}

		const search = {
			$form: $("#j-search-form"),
			$input: $(".j-search-input"),
			$inputValue: $(".j-search-input").val(),
			$error: $(".s-input-error"),
			$currentResult: $(".search-result--current"),
			$weeklyResult: $(".search-result--weekly"),
			reset: function() {
				search.$error.text('');
				search.$form.trigger('reset');
				search.$input.trigger('focus');
			},
			hideSearch: function() {
				search.reset();
				search.$form.addClass('no-height');
			},
			showSearch: function() {
				search.$input.focus();
				search.$form.removeClass('no-height');
			}
		}


		// Remove country from input value
		if (search.$inputValue.includes(",")) {
			if (search.$inputValue.split(",")[1].length > 2) {
				search.$inputValue = search.$inputValue.split(",")[0]
			}
		}

		// Remove any spacing and convert city name to lowercase for later handling
		search.$inputValue = search.$inputValue.trim().toLowerCase();


		// Check if the city already exists in the result table
		e.preventDefault();


		// Ajax call for the current weather
		$.ajax({
			url: 'https://api.openweathermap.org/data/2.5/weather?q=' + search.$inputValue + '&appid=' + api.$apiKey + '&units=metric&lang=en',
			type: 'post',
			dataType: 'json',
		})
		.done(function(response) {

			//  Add icon variable to control icon type (refer to _iconography.scss)
			let icon = response.weather[0].main.toLowerCase();

			search.hideSearch();

			// Add city to the city list array
			search.$currentResult.append (
				'<div class="city-wrap" data-name="' + response.name + '"><p class="city-list__name">'+ response.name +'</p><div class="city-list__temperature">' + Math.ceil(response.main.temp) + '<sup></sup></div><figure><span class="city-list__icon icon-' + icon + '"></span><figcaption class="city-list__text">' + response.weather[0].description + '</figcaption></figure></div><button type="button" class="s-button s-button--text j-show-weekly">View this week</button>'
			);

			$('body').addClass(icon);

			setTimeout(search.reset, 3000);

		})
		.fail(function(jqXHR) {
			let errors = jqXHR.responseJSON.message;

			search.$error.removeClass('is-hidden').text(errors);

			// ** Add code to disable input field before form resets.

			setTimeout(search.reset, 3000);
		});


		// weekly weather function binding
		$(document).on('click', '.j-show-weekly', showWeeklyWeather);


		// Event handler to show weekly weather
		function showWeeklyWeather() {
			search.$currentResult.hide();

			$.ajax({
				url: 'https://api.openweathermap.org/geo/1.0/direct' + '?q=' + search.$inputValue + ',NZ' + '&limit=' + 1 + '&appid=' + api.$apiKey + '&units=metric',
				type: 'get',
				dataType: 'json',
			})
			// Get Coordinates
			.done(function(response) {
				let params = {
					lat: response[0].lat,
					lon: response[0].lon,
					units: 'metric',
				};

				let apiEndPoint = 'https://api.openweathermap.org/data/2.5/onecall';

				$.ajax({
					url: apiEndPoint + '?lat=' + params.lat + '&lon=' + params.lon + '&exclude=minutely,hourly' + '&appid=' + api.$apiKey + '&units=' + params.units + '&lang=en'
				})

				// Get result
				.done(function(response) {
					search.$currentResult.hide();

					let weeklyArray = response.daily.slice(0, 7);
					let weeklyItem = '';
					let icon = '';


					for (i = 0; i < weeklyArray.length; i++) {
						icon = weeklyArray[i].weather[0].main.toLowerCase();

						weeklyItem += '<div class="city-wrap"><div class="city-wrap__weekly>"<div class="city-list__temperature">' + Math.ceil(weeklyArray[i].temp.day) + '<sup></sup></div><figure><span class="city-list__icon icon-' + icon + '"></span><figcaption class="city-list__text">' + weeklyArray[i].weather[0].description + '</figcaption></figure></div></div>';

					}

					search.$weeklyResult.append(weeklyItem);


				})

			})
			.fail(function(jqXHR) {
				let errors = jqXHR.responseJSON.message;

				search.$error.removeClass('is-hidden').text(errors);

				// ** Add code to disable input field before form resets.

				setTimeout(search.reset, 3000);
			});
		}
	});



}(jQuery));