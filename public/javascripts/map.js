$(document).ready(function () {
    initializeLocation();
});

// This example displays an address form, using the autocomplete feature
// of the Google Places API to help users fill in the information.

var placeSearch, autocomplete;

function initializeLocation() {
    // Create the autocomplete object, restricting the search
    // to geographical location types.
    autocomplete = new google.maps.places.Autocomplete(
        /** @type {HTMLInputElement} */(document.getElementById('autocomplete')),
        { types: ['geocode'] });
    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        getAddressPlace();
    });
}

function getAddressPlace() {
    $('#map-canvas').fadeIn();
    lat = autocomplete.getPlace().geometry.location.lat();
    lng = autocomplete.getPlace().geometry.location.lng();


    var myLatlng = new google.maps.LatLng(lat, lng);
    var mapOptions = {
        zoom: 16,
        center: myLatlng
    }
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: 'Entered location'
    });

}

