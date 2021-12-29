// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.
//https://www.7timer.info/bin/civillight.php?lon=-97&lat=38&ac=0&unit=british&output=json&tzshift=0
//jQuery();
$(function () {
    var weatherData = new Object();
    var images = [{ "status": "clear", "src": "assets/about_civil_clear.png", "forecast": "Clear" },
        { "status": "cloudy", "src": "assets/about_civil_cloudy.png", "forecast": "Cloudy" },
        { "status": "fog", "src": "assets/about_civil_fog.png", "forecast": "Fog" },
        { "status": "ishower", "src": "assets/about_civil_ishower.png", "forecast": "Isolated Showers" },
        { "status": "lightrain", "src": "assets/about_civil_lightrain.png", "forecast": "Light Rain" },
        { "status": "lightsnow", "src": "assets/about_civil_lightsnow.png", "forecast": "Light Snow" },
        { "status": "mcloudy", "src": "assets/about_civil_mcloudy.png", "forecast": "Mostly Cloudy" },
        { "status": "oshower", "src": "assets/about_civil_oshowher.png", "forecast": "Occasional Showers" },
        { "status": "pcloudy", "src": "assets/about_civil_pcloudy.png", "forecast": "Partly Cloudy" },
        { "status": "rain", "src": "assets/about_civil_rain.png", "forecast": "Rain" },
        { "status": "rainsnow", "src": "assets/about_civil_rainsnow.png", "forecast": "Rain/Snow" },
        { "status": "snow", "src": "assets/about_civil_snow.png", "forecast": "Snow" },
        { "status": "tsrain", "src": "assets/about_civil_tsrain.png", "forecast": "Isolated Storms" },
        { "status": "tstorm", "src": "assets/about_civil_tstorm.png", "forecast": "Thunderstorms" },
        { "status": "windy", "src": "assets/about_civil_windy.png", "forecast": "Windy" }];

    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    $(document).on({
        ajaxStart: function(){
            $("#wait").dialog("open"); 
        },
        ajaxStop: function(){ 
            $("#wait").dialog("close"); 
        }    
    });

    $("#details").dialog({ autoOpen: false, title: "Forecast Details", closeOnEscape: true, modal: true });
    $("#wait").dialog({ autoOpen: false, title: "Please Wait", closeOnEscape: true, modal: true });

    $("#hideDetails").click(function () {
        $("#details").dialog("close");
    });

    $("#btnGet").click(function () {    
        units = $("input:radio[name='units']:checked").val();
        tableBody = "";
         

        $.ajax({
            type: "POST",
            url: "https://www.7timer.info/bin/civillight.php?lon=-78&lat=40&ac=0&unit=" + units + "&output=json&tzshift=0",
            dataType: "json",
            success: function (response) {

                src = "";
                $("#weatherList tr").slice(1).remove();
                weatherData = response.dataseries;
                $.each(weatherData, function (i, val) {
                    dt = val.date.toString();
                    formatDt = dt.substr(4, 2) + '/' + dt.substr(6, 2) + '/' + dt.substr(0, 4);
                    $.each(images, function(j, imgnm) {
                        if(imgnm.status == val.weather)
                            src = imgnm.src;
                    });

                    tableBody += "<tr id='row" + i.toString() + "'><td>" + formatDt + "</td>" +
                        "<td>" + val.temp2m.max + "</td>" +
                        "<td><img src='" + src + "' /></td></tr>";
                });

                $('#weatherList > tbody:last-child').append(tableBody);

                $("#weatherTable").css("visibility", "visible");
                $("#weatherList tbody tr").bind({
                    click: function () {
                        idx = this.id.substr(3, 1);
                        dt = this.firstChild.textContent;
                        var d = new Date(dt);
                        var dayName = days[d.getDay()];
                        unitDisp = 'Imperial';
                        if (units == 'metric')
                            unitDisp = 'Metric';
                        $("#detailDt").text(dayName + ", " + dt);
                        $("#tempunits").text(unitDisp);
                        $("#lowtemp").text(weatherData[idx].temp2m.min);
                        $("#hightemp").text(weatherData[idx].temp2m.max);

                        $.each(images, function (j, imgnm) {
                            if (imgnm.status == weatherData[idx].weather) {
                                $("#forecast").text(imgnm.forecast);
                                $("#popupImg").attr('src', imgnm.src);
                            }
                        });

                        $("#details").dialog("open");
                    }
                });
            },
            done: function()
            {
                $("body").removeClass("loading"); 

            }
        });
    });
});
// Write your JavaScript code.

