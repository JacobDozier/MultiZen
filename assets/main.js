$(function() {
  var client = ZAFClient.init();
  client.invoke('resize', { width: '100%', height: '350px' });
  projects = showProject();
  tasks = showTask();
});

// TODO Split JSON returned from api to group projects by client.
// TODO Not recieving the full list of projects because there are two pages in Harvest.
// Max of 100 per page.
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
      console.log(data);
      var formattedData = formatProjects(data);
      printResponse(formattedData, template)});
}

function showTask() {
  var source = $("#task-template").html();
  var template = Handlebars.compile(source);

  $.ajax({
      url: "https://api.harvestapp.com/v2/tasks",
      headers: {
          "Authorization": "Bearer 1798431.pt.nVpdLY3VMBZ-Z2-K2GBwL5H_ObIJHFpCWo82YSfDWcf7eQJ3q_bKyGkN29uuddg6sRR6Cch3_yCcPOEMv3MtBg",
          "Harvest-Account-ID": "1009919"
      }
  }).then(function(data){
      printResponse(data, template)});
}

function formatProjects(data) {
  var clients = new Array();
  var projects = data.projects;
  for (var project in projects) {

    console.log("for project in projects");
    console.log(project);

    console.log("projects[project].client");
    console.log(projects[project].client);
    
    var client = project.client;
    var clientProjects = new Array();
    // add a (empty) project array to the client.
    client += clientProjects;

    console.log("clients");
    console.log(clients);
    console.log("client");
    console.log(client);

    var i = indexOfClient(clients, client);
    if (i >= 0) {
      clients[i].client.clientProjects.push({"id": project.id, "name": project.name});
    } else { // Else if the client id is not in the clients array.
      // TODO it is failing at clients.projects because the clients are not being assigned project objects.
      client.clientProjects.push({"id": project.id, "name": project.name});
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