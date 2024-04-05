async function setRemainingTime(seconds, movie_url, movieName) {
    seconds = seconds - 3
    while (seconds) {
        $("#result").text(`Searching for "Rotten Tomatoes ${movieName}"`);
        $("#result").append("\nMovie URL Found: ");
        var $p = $("<a>").attr("href", movie_url + '/reviews?type=top_critics')
            .attr("target", "_blank")
            .text(movie_url + '/reviews?type=top_critics')
        $("#result").append($p);
        $("#result").append("\nFetching Movie Reviews...\nAnalyzing Movie Reviews...\n");
        $("#result").append("Please wait. The model is loading. Summary will be generated in approximately " + seconds + " seconds.");
        seconds--;
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    $("#result").append("\nSummary loading...");
}

function fetchSummary(reviewsAggregate, movie_url, movieName) {
    $.ajax({
        type: "POST",
        url: "/getSummary",
        data: { reviewsAggregate: reviewsAggregate },
        success: function (data) {
            if ('estimated_time' in data) {
                setRemainingTime(Math.round(data['estimated_time']), movie_url, movieName);
                setTimeout(function () {
                    fetchSummary(reviewsAggregate, movie_url, movieName)
                }, data['estimated_time'] * 1000);
            }
            else if ('error' in data) {
                $("#submit").show();
                $("#submit-rotate").hide();
                $("#result").text(`Error: ${data['error']}`);
            }
            else {
                $("#submit").show();
                $("#submit-rotate").hide();
                $("#result").text(data[0]['summary_text']);
            }
        },
        error: function () {
            setRemainingTime(Math.round(10), movie_url, movieName);
            setTimeout(function () {
                fetchSummary(reviewsAggregate, movie_url, movieName)
            }, 10000);
        },
        timeout: 4000
    });


}

function sentimentAnalysis(reviewsList, movie_url, movieName) {
    $.ajax({
        type: "POST",
        url: "/getSentimentAnalysis",
        data: { reviewsList: JSON.stringify(reviewsList) },
        success: function (data) {
            if ('estimated_time' in data) {
                setTimeout(function () {
                    sentimentAnalysis(reviewsList, movie_url, movieName)
                }, data['estimated_time'] * 1000);
            }
            else if ('error' in data) {
                $("#reviews-boxes-div").text(`Error: ${data['error']}`);
                $("#reviews-parent-div").show();
            }
            else {
                for (i in data) {
                    if(reviewsList[i].trim().length==0)
                        continue
                    box_class_name_prefix = null
                    if (data[i][0]['label'] == 'POSITIVE')
                        box_class_name_prefix = 'pos'
                    else
                        box_class_name_prefix = 'neg'

                    $(`<div class="${box_class_name_prefix}-review box" data-bs-toggle="tooltip" data-bs-placement="top" title="Confidence: ${data[i][0]['score'] * 100}">${reviewsList[i]}</div>`).appendTo('#reviews-boxes-div');
                }
                $("#reviews-parent-div").show();
            }
        },
        error: function () {
            setTimeout(function () {
                sentimentAnalysis(reviewsList, movie_url, movieName)
            }, 3000);
        },
        timeout: 5000
    });


}


$(document).ready(function () {
    $('[data-bs-toggle="tooltip"]').tooltip();
});

$("#movie_name").keyup(function (event) {
    if (event.keyCode === 13)
        $("#submit").click();
});

$("#submit").on("click", function () {
    $("#submit").hide();
    $("#submit-rotate").show();
    var movieName = $("#movie_name").val();
    $("#result-para").show();
    $("#result").text(`Searching for "Rotten Tomatoes ${movieName}"`);
    $("#reviews-parent-div").hide();
    $("#reviews-boxes-div").html("");
    $.ajax({
        type: "POST",
        url: "/getMovieURL",
        data: { movieName: movieName },
        success: function (data) {
            movie_url = data["movie_url"]
            if(movie_url==''){
                if(data["error"]=='HTTP Error 429: Too Many Requests'){
                    $("#result").html("Google Search Rate Limit Exceeded. Please try again later.");
                }
                else{
                    $("#result").html(`Error: "${data["error"]}". Please try again later.`);
                }
                $("#submit").show();
                $("#submit-rotate").hide();
            }
            else if(movie_url=='https://www.rottentomatoes.com/'){
                $("#result").html('<b>Sorry! Movie not found.</b>');
                $("#submit").show();
                $("#submit-rotate").hide();
            }
            else{
                $("#result").append("\nMovie URL Found: ");
                var $p = $("<a>").attr("href", movie_url + '/reviews?type=top_critics')
                    .attr("target", "_blank")
                    .text(movie_url + '/reviews?type=top_critics')
                $("#result").append($p);
                $("#result").append("\nFetching Movie Reviews...");
                $.ajax({
                    type: "POST",
                    url: "/getReviews",
                    data: { movie_url: movie_url },
                    success: function (data) {
                        if (data['numOfReviews'] == 0) {
                            $("#result").append("\n<b>Sorry! Reviews not found.</b>");
                            if (movie_url.includes('/tv/'))
                                $("#result").append(`\n<i>(Note: If you provided a TV series as input, please specify a particular season and try again. Example: <b>${movieName} s1</b>)</i>`);
                            $("#submit").show();
                            $("#submit-rotate").hide();
                        }
                        else {
                            $("#result").append("\nAnalyzing Movie Reviews...");
                            sentimentAnalysis(data["reviewsList"], movie_url, movieName)
                            fetchSummary(data["reviewsAggregate"], movie_url, movieName)
                        }
                    },
                });
            }
        },
    });
});