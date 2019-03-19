$(function() {
    var client = ZAFClient.init();
    client.invoke('resize', { width: '100%', height: '350px' });
    showInfo();
});

// Insert data obtained from the Harvest api.
function showInfo() {
    var project_data = 
    // ["MultiZen", "Value1", "Value2", "Value3"];
    {
        'value': 'MultiZen',
        'value1': 'value1',
        'value2': 'value2',
        'value3': 'value3'
    };
    console.log(project_data);

    var source = $("#time-template").html();
    var template = Handlebars.compile(source);
    var html = template(project_data);
    $("#content").html(html);
}