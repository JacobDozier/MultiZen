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
            {header:"ACBJ", categories: ["Billable", "Support", "Non-Support"]},
            {header:"ALM", categories: ["Billable", "Support", "Non-Support"]},
            {header: "IBJ", categories: ["Billable", "Support", "Non-Support"]},
            {header: "DSI", categories: ["Internal Time"]}
        ]
    }
    
    $("#content").html(template(project_data));
}