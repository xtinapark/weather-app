(function($) {

	$('.site-nav').hide();

	$(document).on('submit', '#j-search-form', function(e) {


		const api = {
			$geoCodingApi: 'https://api.openweathermap.org/geo/1.0/direct',
			$apiKey: 'e727b72a36203da805bf1ce55c36d074',
		}

		const search = {
			$heading: $('.j-page-heading'),
			$form: $("#j-search-form"),
			$input: $(".j-search-input"),
			$inputValue: $(".j-search-input").val(),
			$error: $(".j-error"),
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
			},
			showWeekly: function() {
				search.$currentResult.addClass('is-hidden');
				search.$weeklyResult.removeClass('is-hidden');
				search.$currentResult.empty();
			},
			showCurrent: function() {
				search.$currentResult.removeClass('is-hidden');
				search.$weeklyResult.addClass('is-hidden');
				search.$weeklyResult.empty();

			},
			// toggleContent: function() {
			// 	search.$showWeekly.off('click', search.showWeekly);
			// 	search.$showCurrent.off('click', search.showCurrent);
			// }
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
			$('.site-nav').show();

			//  Add icon variable to control icon type (refer to _iconography.scss)
			let icon = response.weather[0].main.toLowerCase();

			search.hideSearch();

			// Add city to the city list array
			search.$currentResult.append (
				'<div class="city-wrap" data-name="' + response.name + '"><div class="city__content"><h2 class="s-heading-2">' + response.name + '</h2><figure class="city-weather"><span class="city-weather__icon u-mr-32 icon-' + icon + '"></span><figcaption class="city-weather__text">' + response.weather[0].description + '</figcaption></figure><div class="city__temperature"><div class="city__temperature__current">' + Math.ceil(response.main.temp) + '<sup class="city__unit">&#8451;</sup></div><div><div class="city__temperature__max">' + Math.ceil(response.main.temp_max) + '<sup class="city__unit">&#8451;</sup></div><hr class="s-divider"><div class="city__temperature__min">' + Math.ceil(response.main.temp_min) + '<sup class="city__unit">&#8451;</sup></div></div></div><button type="button" class="s-text-link s-text-link--white j-show-weekly u-mt-20">View this week</button></div>'
			);

			$('body').addClass(icon);

			search.reset;

		})
		.fail(function(jqXHR) {
			let errors = jqXHR.responseJSON.message;

			search.$error.text(errors);

			// ** Add code to disable input field before form resets.

			search.reset;
		});

		$(document).on('click', '.j-show-weekly', showWeeklyWeather);


		// Event handler to show weekly weather
		function showWeeklyWeather() {

			search.$showWeekly;

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
				console.log(response);


					search.$currentResult.addClass('is-hidden');
					search.$weeklyResult.removeClass('is-hidden');

					let weeklyArray = response.daily.slice(0, 7);
					let weeklyItem = '';
					let icon = '';
					let date = '';


					for (i = 0; i < weeklyArray.length; i++) {
						icon = weeklyArray[i].weather[0].main.toLowerCase();
						date = new Date(weeklyArray[i].dt * 1000 - (response.timezone_offset * 1000)).toISOString().split("T")[0]; // minus

						weeklyItem += '<div class="city-wrap"><div class="city__content"><div>' + date + '</div><figure class="city-weather"><span class="city-weather__icon icon-' + icon + '"></span><figcaption class="city-weather__text">' + weeklyArray[i].weather[0].description + '</figcaption></figure><div class="city-wrap__weekly"><div class="city__temperature">' + Math.ceil(weeklyArray[i].temp.day) + '<sup>&#8451;</sup></div></div></div></div>';
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

		$(document).on('click', '.j-show-current', search.showCurrent);


	});



}(jQuery));