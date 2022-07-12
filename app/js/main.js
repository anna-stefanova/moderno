$(function () {

    $(".js-range-slider").ionRangeSlider({
        hide_min_max: true,
        skin: "round",
        type: "double",
        prefix: "$",
    });

    $(".rate-star").rateYo({
        rating: 5,
        starWidth: "12px",
        readOnly: true,
        ratedFill: "#ffa726"
    });

    $('.owl-carousel').owlCarousel({
        loop: true,
        margin: 10,
        /*nav: true,*/
        items: 4
    });
    var mixer = mixitup('.products__inner-box');

    $('.filter-select').styler();






});
