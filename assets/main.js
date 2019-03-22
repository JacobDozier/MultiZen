$(function() {
    var client = ZAFClient.init();
    client.invoke('resize', { width: '100%', height: '350px' });
    showInfo();
});

// TODO Insert data obtained from the Harvest api.
function showInfo() {

    var source = $("#time-template").html();
    var template = Handlebars.compile(source);

    var project_data = 
    {
        test: [
            "MultiZen",
            "Value 1",
            "Value 2"
        ]
    }
    
    $("#content").html(template(project_data));
}