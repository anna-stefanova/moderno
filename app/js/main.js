$(function () {


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
});