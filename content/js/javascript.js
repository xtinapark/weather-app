(function($) {

	function join(t, a, s) {
		function format(m) {
		   let f = new Intl.DateTimeFormat('en', m);
		   return f.format(t);
		}
		return a.map(format).join(s);
	 }

	 const a = [{day: 'numeric'}, {month: 'short'}, {year: 'numeric'}];
	 const date = join(new Date, a, '-');

	// for ( a = currentDay; a < currentDay + 5; a++ ) {

	// 	$('.overview').append (
	// 		'<div class="container container-' + a + '">'
	// 		+ '<div class="date-container">'
	// 		+ '<h2 class="date date-' + a + '">' + moment().add(a,'days').format("ddd") + '</h2>'
	// 		+ '<div class="day day-' + a + '">' + moment().add(a,'days').format("MMMM D") + '</div>'
	// 		+ '</div>'
	// 		+ '</div>');
	// 	$('.date-0').html("Today");

	// 	var maxTempArray = [];
	// 	var minTempArray = [];
	// 	var iconArray = [];
	// 	var descArray = [];
	// 	var humidArray = [];
	// 	var windArray = [];

	// 	for ( i = 0; i < d.list.length; i++ ) {
	// 		var timeCheck = d.list[i].dt_txt.indexOf(moment().add(a,'days').format("YYYY-MM-DD"));
	// 		if (timeCheck > - 1) {
	// 			maxTempArray.push(d.list[i].main.temp_max);
	// 			minTempArray.push(d.list[i].main.temp_min);
	// 			iconArray.push(d.list[i].weather[0].id);
	// 			descArray.push(d.list[i].weather[0].description);
	// 			humidArray.push(d.list[i].main.humidity);
	// 			windArray.push(d.list[i].wind.speed);
	// 		}
	// 	}

    //         // $(".container-" + a).append(
    //         //     '<div class="three">'
    //         //     + '<div class="weather-icon">' + '<i class="wi wi-owm-' + findMostCommon(iconArray) + '"></i></div>'
    //         //     + '<div class="weather-desc">' + findMostCommon(descArray) + '</div>'
    //         //     + '<div class="temp">'
    //         //         + '<div class="temp-max">'
    //         //             + Math.round(Math.max.apply(Math, maxTempArray)) + '&deg;'
    //         //                 + '<div class="temp-desc desc-1">High</div>'
    //         //             + '</div>'
    //         //         + '<div class="temp-and">&mdash;</div>'
    //         //         + '<div class="temp-min">'
    //         //             + Math.round(Math.min.apply(Math, minTempArray)) + '&deg;'
    //         //                 + '<div class="temp-desc desc-2">Low</div>'
    //         //         + '</div>'
    //         //     + '</div>'
    //         //     + '<br />' + 'Humidity: ' + findMostCommon(humidArray) + '%'
    //         //     + '<br />' + 'Wind Speed: ' + Math.round(findMostCommon(windArray)) + 'mph'
    //         //     + '</div>'
    //         //     + '</div>');
    //         // var topTest = setWeatherClass(findMostCommon(iconArray));
    //         // $(".container-" + a).addClass(topTest);
    // }


	$(document).on('submit', '#j-search-form', function(e) {

		const search = {
			$form: $("#j-search-form"),
			$input: $(".j-search-input"),
			$inputValue: $(".j-search-input").val(),
			$error: $(".s-input-error"),
			$result: $(".search-result"),
			// $cityListItem: $(".city-list__item"),
			$apiKey: "e727b72a36203da805bf1ce55c36d074",
			// remove: function(city) {
			// 	search.$cityListItem.attr('data-name', city).remove();
			// },
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

		// let cityListItems = search.$cityList.find(".city-list__item");
		// let cityListArray = Array.from(cityListItems);

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

		$.ajax({
			url: 'https://api.openweathermap.org/data/2.5/weather?q='+ search.$inputValue + '&appid=' + search.$apiKey + '&units=metric',
			type: 'post',
			dataType: 'json',
		})
		.done(function(response) {

			//  Add icon variable to control icon type (refer to _iconography.scss)
			let icon = response.weather[0].main.toLowerCase();

			console.log(response.weather);

			search.hideSearch();

			// Add city to the city list array
			search.$result.append (
				'<div class="city-wrap" data-name="' + response.name + '"><span class="date">'+ date +'</span><p class="city-list__name">'+ response.name +'</p><div class="city-list__temperature">' + Math.ceil(response.main.temp) + '<sup></sup></div><figure><span class="city-list__icon icon-' + icon + '"></span><figcaption class="city-list__text">' + response.weather[0].description + '</figcaption></figure></div>'
			);

			$('body').addClass(icon);

		})
		.fail(function(jqXHR) {

			let errors = jqXHR.responseJSON.message;

			search.$error.removeClass('is-hidden').text(errors);

			// ** Add code to disable input field before form resets.

			setTimeout(search.reset, 3000);


		});

		// Reset form
		search.reset;


	});


}(jQuery));