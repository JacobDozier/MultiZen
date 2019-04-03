$(function() {
    var client = ZAFClient.init();
    client.invoke('resize', { width: '100%', height: '350px' });
    showProject();
    showTask();
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
        var formattedData = formatProjects(data);
        printResponse(formattedData, template)});
}

function showTask() {

    var source = $("#task-template").html();
    var template = Handlebars.compile(source);

    $.ajax({
        url: "https://api.harvestapp.com/v2/projects",
        headers: {
            "Authorization": "Bearer 1798431.pt.nVpdLY3VMBZ-Z2-K2GBwL5H_ObIJHFpCWo82YSfDWcf7eQJ3q_bKyGkN29uuddg6sRR6Cch3_yCcPOEMv3MtBg",
            "Harvest-Account-ID": "1009919"
        }
    }).then(function(data){
        var formattedData = formatProjects(data);
        printResponse(formattedData, template)});
}

function formatProjects(data) {
    var clients = [];
    var projects = data.projects;
    for (project in projects) {
      var client = project.client;
      var i = indexOfClient(clients, client);
      if (i >= 0) {
        clients[i].projects.push({"id": project.id, "name": project.name});
      } else {
        client.projects = [{"id": project.id, "name": project.name}];
        clients.push(client);
      }
      return clients;
    }
  }
  
  function indexOfClient(clients, client) {
    var i = 0;
    for (c in clients) {
      if (c.id === client.id) {
        return i;
      }
      i++;
    }
    return -1;
  }

  function printResponse(data, template) {
    var harvestResponse = data;
    console.log(harvestResponse);
    $("#content").html(template(harvestResponse));
}