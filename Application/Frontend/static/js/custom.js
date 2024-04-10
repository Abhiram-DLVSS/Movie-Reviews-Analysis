

function hideSubmit(){
    $("#submit").hide();
    $("#submit-rotate").show();
    $("#movie_name").prop('disabled', true);
}

function showSubmit(){
    $("#submit").show();
    $("#submit-rotate").hide();
    $("#movie_name").prop('disabled', false);
}

async function setRemainingTime(seconds, movie_url, movieName) {
    seconds = seconds - 3
    while(seconds>=0){
        $("#result").text(`Searching for "Rotten Tomatoes ${movieName}"`);
        $("#result").append("\nMovie URL Found: ");
        var $p = $("<a>").attr("href", movie_url + '/reviews?type=top_critics')
            .attr("target", "_blank")
            .text(movie_url + '/reviews?type=top_critics')
        $("#result").append($p);
        $("#result").append("\nFetching Movie Reviews...\nAnalyzing Movie Reviews...\n");
        if(seconds>=1)
            $("#result").append("Please wait. The model is loading. Summary will be generated in approximately " + seconds + " seconds.");
        else
            $("#result").append("Summary loading...");
        seconds--;
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
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
                showSubmit();
                $("#result").text(`Error: ${data['error']}`);
            }
            else {
                showSubmit();
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

                    $(`<div class="${box_class_name_prefix}-review"  title="Confidence: ${Math.round(data[i][0]['score'] * 100*100)/100}">${reviewsList[i]}</div>`).appendTo('#reviews-boxes-div');
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

$("#movie_name").keyup(function (event) {
    if (event.keyCode === 13)
        $("#submit").click();
});

$("#submit").on("click", function () {
    hideSubmit();
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
                showSubmit();
            }
            else if(movie_url=='https://www.rottentomatoes.com/'){
                $("#result").html('<b>Sorry! Movie not found.</b>');
                showSubmit();
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
                                showSubmit();
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