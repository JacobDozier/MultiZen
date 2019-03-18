$(function() {
    var client = ZAFClient.init();
    client.invoke('resize', { width: '100%', height: '410px' });
    showInfo();
});

function showInfo() {
    var project_data = {
        'value': 'MultiZen',
        'value1': 'value1',
        'value2': 'value2',
        'value3': 'value3'
    };

    var source = $("#time-template").html();
    var template = Handlebars.compile(source);
    var html = template(project_data);
    $("#content").html(html);
}