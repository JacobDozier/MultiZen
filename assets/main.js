$(function() {
    var client = ZAFClient.init();
    client.invoke('resize', { width: '100%', height: '350px' });
    showProject();
    // showTask();
});

// TODO Split JSON returned from api to group projects by client.
function showProject() {

    var source = $("#project-template").html();
    var template = Handlebars.compile(source);

    $.ajax({
        url: "https://api.harvestapp.com/v2/projects",
        headers: {
            "Authorization": "Bearer 1798431.pt.nVpdLY3VMBZ-Z2-K2GBwL5H_ObIJHFpCWo82YSfDWcf7eQJ3q_bKyGkN29uuddg6sRR6Cch3_yCcPOEMv3MtBg",
            "Harvest-Account-ID": "1009919"
        }
    }).then(function(data){
        printResponse(data, template)});
}

function printResponse(data, template) {
    var harvestResponse = data;
    console.log(harvestResponse);
    $("#content").html(template(harvestResponse));
}

// function showTask() {

//     var source = $("#task-template").html();
//     var template = Handlebars.compile(source);

//     task_data = callHarvest("/v2/tasks");

//     console.log(task_data);
    
//     $("#content").html(template(task_data));

//     console.log(harvestResponse);
// }