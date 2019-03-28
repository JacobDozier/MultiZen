$(function() {
    var client = ZAFClient.init();
    client.invoke('resize', { width: '100%', height: '350px' });
    showProject();
    showTask();
});

// TODO Insert data obtained from the Harvest api.
function showProject() {

    var source = $("#project-template").html();
    var template = Handlebars.compile(source);

    var project_data = callHarvest("v2/projects");
    // {
    //     test: [
    //         {header:"ACBJ", categories: ["Billable", "Support", "Non-Support"]},
    //         {header:"ALM", categories: ["Billable", "Support", "Non-Support"]},
    //         {header: "IBJ", categories: ["Billable", "Support", "Non-Support"]},
    //         {header: "DSI", categories: ["Internal Time"]}
    //     ]
    // }
    
    $("#content").html(template(project_data));
}

function showTask() {

    var source = $("#task-template").html();
    var template = Handlebars.compile(source);

    task_data = callHarvest("/v2/tasks");
    
    $("#content").html(template(task_data));
}

function callHarvest(apiPath) {
    // const https = require("https");

    const options = {
        protocol: "https:",
        hostname: "api.harvestapp.com",
        path: apiPath,
        headers: {
            "User-Agent": "MultiZen Testing",
            "Authorization": "Bearer 1798431.pt.nVpdLY3VMBZ-Z2-K2GBwL5H_ObIJHFpCWo82YSfDWcf7eQJ3q_bKyGkN29uuddg6sRR6Cch3_yCcPOEMv3MtBg",
            "Harvest-Account-ID": "1009919"
        }
    }

    $.ajax({
        url: "https://api.harvestapp.com/" + apiPath,
        headers: {
            "User-Agent": "MultiZen Testing",
            "Authorization": "Bearer 1798431.pt.nVpdLY3VMBZ-Z2-K2GBwL5H_ObIJHFpCWo82YSfDWcf7eQJ3q_bKyGkN29uuddg6sRR6Cch3_yCcPOEMv3MtBg",
            "Harvest-Account-ID": "1009919"
        }
    }).then(function(data) {
       $('.greeting-id').append(data.id);
       $('.greeting-content').append(data.content);
    });

    // https.get(options, (res) => {
    //     const { statusCode } = res;
      
    //     if (statusCode !== 200) {
    //       console.error(`Request failed with status: ${statusCode}`);
    //       return;
    //     }
      
    //     res.setEncoding('utf8');
    //     let rawData = '';
    //     res.on('data', (chunk) => { rawData += chunk; });
    //     res.on('end', () => {
    //       try {
    //         const parsedData = JSON.parse(rawData);
    //         console.log(parsedData);
    //       } catch (e) {
    //         console.error(e.message);
    //       }
    //     });
    //   }).on('error', (e) => {
    //     console.error(`Got error: ${e.message}`);
    // });
}