$(function() {
  var client = ZAFClient.init();
  client.invoke('resize', { width: '100%', height: '350px' });
  projects = showProject();
  tasks = showTask();
});

function showProject() {
  var source = $("#project-template").html();
  var template = Handlebars.compile(source);

  // Call Harvest api for the first page of projects.
  // TODO Loop through all populated pages of projects. Max 100/page.
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

  // TODO use the Harvest Project Tasks to link Tasks to Projects.
  $.ajax({
      url: "https://api.harvestapp.com/v2/tasks",
      headers: {
          "Authorization": "Bearer 1798431.pt.nVpdLY3VMBZ-Z2-K2GBwL5H_ObIJHFpCWo82YSfDWcf7eQJ3q_bKyGkN29uuddg6sRR6Cch3_yCcPOEMv3MtBg",
          "Harvest-Account-ID": "1009919"
      }
  }).then(function(data){
      printResponse(data, template)});
}

// TODO Split JSON returned from api to group projects by client.
function formatProjects(data) {
  var clients = new Array();
  var projects = data.projects;
  for (var project in projects) {

    console.log("for project in projects");
    console.log(project);

    console.log("projects[project].client");
    console.log(projects[project].client);
    // Not sure why project isn't a project from the projects array. Returns as an integer/index.
    var client = projects[project].client;
    // add a (empty) project array to the client.
    client.projectList = [];

    console.log("clients");
    console.log(clients);
    console.log("client");
    console.log(client);

    var i = indexOfClient(clients, client);
    if (i >= 0) {
      clients[i].client.projectList.push({"id": project.id, "name": project.name});
    } else { // Else if the client id is not in the clients array.
      // TODO currently unable to push a project element into the client's project array/list.
      // "Query.Deferred exception: Cannot read property 'push' of undefined TypeError: Cannot read property 'push' of undefined
      // at formatProjects (http://localhost:4567/main.js:69:29)"
      client.projectList.push({"id": project.id, "name": project.name});
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
  $("#content").html(template(harvestResponse));
}