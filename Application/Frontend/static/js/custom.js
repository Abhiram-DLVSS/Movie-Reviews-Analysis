async function setRemainingTime(seconds, movie_url, movieName) {
    seconds = seconds - 3
    before_value = $("#result-para").text()
    while (seconds) {
        $("#result").text(`Searching for "Rotten Tomatoes ${movieName}"`);
        $("#result").append("\nMovie URL Found: ");
        var $p = $("<a>").attr("href", movie_url)
            .attr("target", "_blank")
            .text(movie_url)
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
            else {
                $("#submit").show();
                $("#submit-rotate").hide();
                $("#result").text(data[0]['summary_text']);
                $("#result-para").show();
            }
        },
    });


}
$("#submit").on("click", function () {
    $("#submit").hide();
    $("#submit-rotate").show();
    $("#result-para").show();

    var movieName = $("#movie_name").val();
    $("#result").text(`Searching for "Rotten Tomatoes ${movieName}"`);
    $.ajax({
        type: "POST",
        url: "/getMovieURL",
        data: { movieName: movieName },
        success: function (data) {
            movie_url = data["movie_url"]
            var html = $(`<a href='${movie_url}'>${movie_url}</a>`);

            $("#result").append("\nMovie URL Found: ");
            var $p = $("<a>").attr("href", movie_url)
                .attr("target", "_blank")
                .text(movie_url)
            $("#result").append($p);
            $("#result").append("\nFetching Movie Reviews...");
            $.ajax({
                type: "POST",
                url: "/getReviews",
                data: { movie_url: movie_url },
                success: function (data) {
                    if (data['numOfReviews'] == 0) {
                        $("#result").append("\nSorry! Reviews not found.");
                        $("#submit").show();
                        $("#submit-rotate").hide();
                        $("#result-para").show();
                    }
                    else {
                        $("#result").append("\nAnalyzing Movie Reviews...");
                        fetchSummary(data["reviewsAggregate"], movie_url, movieName)
                    }
                },
            });
        },
    });
});