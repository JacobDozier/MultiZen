$(function() {
  var client = ZAFClient.init();
  client.invoke('resize', { width: '100%', height: '300px' });

  // TODO Use this to secure api credentials.
  // This won't work with local hosting because it triggers cross origin request issues.
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

  // TODO Build and display Harvest notes fields.

  // Return project optgroup when a project is selected. Found this using element selector in chrome.
  // TODO Match client label (name) to the client's id.
  // TODO Grab project id for time entry build.
  // TODO Make another function to watch for task change to get task id.
  $('#projectsContent').on('change', '.project', function ()
  {
    var foundClient = $(this.options[this.selectedIndex]).closest('optgroup').prop('label');
    var foundProduct = $(this.options[this.selectedIndex]).prop('value');
    console.log(foundClient);
    console.log(foundProduct);

    if(foundClient != null){
      var projectHeaderSource = $("#project-header-template").html();
      var template = Handlebars.compile(projectHeaderSource);
      $("#projectsHeaderContent").html(template(foundClient));
      $(".initProjectHeader").hide();
      $(".duration").show();
      $(".submit").show();
    }else{
      $(".projectHeader").hide();
      $(".initProjectHeader").show();
      $(".duration").hide();
      $(".submit").hide();
    }

    showTask(foundProduct);
    return foundProduct, foundClient;
  });

  showNotes(client);
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
          "Harvest-Account-ID": "1009919",
      }
  }).then(function(data){
      var formattedData = formatProjects(data);
      printResponse("projects", formattedData, template)});
}

// Calls Harvest api for task list.
// TODO call harvestProjectTasks to match the task id's to project id's.
function showTask(projectId) {
  var source = $("#task-template").html();
  var template = Handlebars.compile(source);
  var strippedTasks = new Array();

  // Use the Harvest Project Task Assignments to link Tasks to Projects.
  $.ajax({
      url: "https://api.harvestapp.com/v2/projects/" + projectId + "/task_assignments",
      headers: {
        "Authorization": "Bearer 1798431.pt.nVpdLY3VMBZ-Z2-K2GBwL5H_ObIJHFpCWo82YSfDWcf7eQJ3q_bKyGkN29uuddg6sRR6Cch3_yCcPOEMv3MtBg",
        "Harvest-Account-Id": "1009919"
      }
  }).then(function(data){
    var taskAssignList = data.task_assignments;
    taskAssignList.forEach((projectTaskCombo) => {
      strippedTasks.push(projectTaskCombo.task);
    });
      printResponse("tasks", strippedTasks, template)});
}

// Get the Zendesk ticket id and subject to use as Harvest notes.s
function showNotes(client) {
  client.get(['ticket.id', 'ticket.subject']).then(function(data) {
    console.log(data);
    var source = $("#notes-template").html();
    var template = Handlebars.compile(source);
    var ticketInfo = "#" + data['ticket.id'] + ": " + data['ticket.subject'];
    console.log("ticketInfo");
    console.log(ticketInfo);
    printResponse("notes", ticketInfo, template);
  });

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
  console.log("harvestResponse " + divLocation);
  console.log(harvestResponse);
  $("#" + divLocation + "Content").html(template(harvestResponse));
}