$(function() {
  var client = ZAFClient.init();
  client.invoke('resize', { width: '100%', height: '350px' });

  // TODO Use this to secure api credentials.
  // var getProjects = {
  //   url: "https://api.harvestapp.com/v2/projects",
  //   headers: {
  //   "Authorization": "Bearer {{setting.token}}",
  //   "Harvest-Account-ID": "{{setting.Harvest-Account-ID}}"},
  //   secure: true,
  //   type: 'GET',
  //   dataType: 'json'
  // };

  // var getTasks = {
  //   url: "https://api.harvestapp.com/v2/tasks",
  //   headers: {
  //   "Authorization": "Bearer {{setting.token}}",
  //   "Harvest-Account-ID": "{{setting.Harvest-Account-ID}}"},
  //   secure: true,
  //   type: 'GET',
  //   dataType: 'json'
  // };
  
  // client.request(getProjects).then(function(data){
    //   var formattedData = formatProjects(data);
    //   printResponse(formattedData, template)
  // });

  showProject();
  showTask();
  $('#projectsContent').on('change', 'project', function ()
  {
    var label = $(this.options[this.selectedIndex]).closest('optgroup').prop('label');
    console.log(label);
  });
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
      var formattedData = formatProjects(data);
      printResponse("projects", formattedData, template)});
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
      printResponse("tasks", data, template)});
}

// Split JSON returned from Harvest to group projects by client.
function formatProjects(data) {
  var clients = new Array();
  var projects = data.projects;
  projects.forEach((project) => {

    var tempClient = project.client;
    // add a (empty) project array to the client.
    tempClient.projectList = [];

    var i = indexOfClient(clients, tempClient);
    if (i >= 0) {
      clients[i].projectList.push({"id": project.id, "name": project.name});
    } else { // Else if the client id is not in the clients array.
      tempClient.projectList.push({"id": project.id, "name": project.name});
      clients.push(tempClient);
    }
  });
  return clients;
}
  
function indexOfClient(clients, tempClient) {
  for (var i = 0; i < clients.length; i++) {
    if (clients[i].id === tempClient.id) {
      return i;
    }
  }
  return -1;
}

function printResponse(divLocation, data, template) {
  var harvestResponse = {}
  harvestResponse = data;
  console.log("harvestResponse");
  console.log(harvestResponse);
  $("#" + divLocation + "Content").html(template(harvestResponse));
}