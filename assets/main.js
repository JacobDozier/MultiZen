$(function() {
  let myToken = config.MY_TOKEN;
  let myId = config.MY_ID;
  let client = ZAFClient.init();
  client.invoke('resize', { width: '100%', height: '300px' });
  let timeEntry = new Array();

  // TODO Use this to secure api credentials.
  // This won't work with local hosting because it triggers cross origin request issues.
  // let getProjects = {
  //   url: "https://api.harvestapp.com/v2/projects",
  //   headers: {
  //   "Authorization": "Bearer {{setting.token}}",
  //   "Harvest-Account-ID": "{{setting.Harvest-Account-ID}}"},
  //   secure: true,
  //   type: 'GET',
  //   dataType: 'json'
  // };

  // let getTasks = {
  //   url: "https://api.harvestapp.com/v2/tasks",
  //   headers: {
  //   "Authorization": "Bearer {{setting.token}}",
  //   "Harvest-Account-ID": "{{setting.Harvest-Account-ID}}"},
  //   secure: true,
  //   type: 'GET',
  //   dataType: 'json'
  // };
  
  // client.request(getProjects).then(function(data){
    //   let formattedData = formatProjects(data);
    //   printResponse(formattedData, template)
  // });

  showProject(myToken, myId);

  // Grab project id for time entry build.
  $('#projectsContent').on('change', '.project', function () {
    // Blank out time entry.
    timeEntry = [];
    // Get the client name and product id from the dropdown.
    let foundClient = $(this.options[this.selectedIndex]).closest('optgroup').prop('label');
    let foundProduct = $(this.options[this.selectedIndex]).prop('value');
    console.log(foundClient);
    console.log(foundProduct);
    timeEntry[0] = foundProduct;

    // Change the Project header upon selection. (show/hide)
    if(foundClient != null){
      let projectHeaderSource = $("#project-header-template").html();
      let template = Handlebars.compile(projectHeaderSource);
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
    // When a project is selected, show task dropdown.
    showTask(foundProduct, myToken, myId);
    showNotes(client);
    // Grab the task Id.
  });
  $('#tasksContent').on('change', '.task', function () {
    let foundTask = $(this.options[this.selectedIndex]).prop('value');
    console.log("foundTask");
    console.log(foundTask);
    timeEntry[1] = foundTask;
    console.log("timeEntry");
    console.log(timeEntry);
  });
  // TODO Grab duration. Something is wrong here.
  $('#duration').on('keydown', '#duration', function () {
    let foundDuration = $('#duration');
    console.log("foundDuration");
    console.log(foundDuration);
  });

  // Send time entry to Harvest.
  //   $("#timeSubmission").submit(function(event) {
  //     $.ajax({
  //       url: "https://api.harvestapp.com/v2/projects",
  //       headers: {
  //           "Authorization": "Bearer " + myToken,
  //           "Harvest-Account-ID": myId
  //       }
  //     }).success(function(data){
  //   });
  // });

  // Get notes. Don't actually need the ticket id and subject, just the string. Change method.
  // let returnedNotes = showNotes();
  // returnedNotes = Promise.resolve(returnedNotes);
  // console.log("returnedNotes");
  // console.log(Promise.resolve(returnedNotes));
});

function showProject(myToken, myId) {
  let source = $("#project-template").html();
  let template = Handlebars.compile(source);
  let projectData = new Array();
  let projectPage1 = $.ajax({
    url: "https://api.harvestapp.com/v2/projects?is_active=true",
    headers: {
        "Authorization": "Bearer " + myToken,
        "Harvest-Account-ID": myId,
    }
  });
  let projectPage2 = $.ajax({
    url: "https://api.harvestapp.com/v2/projects?page=2&is_active=true",
    headers: {
        "Authorization": "Bearer " + myToken,
        "Harvest-Account-ID": myId
    }
  });

  // Call Harvest api for the first page of projects.
  // Number of pages in Harvest Projects is known to be 2. Max 100/page.
  // This could grow higher if many new clients are added and would reguire
  // all pages.
  $.when(projectPage1, projectPage2).then(function(data1, data2){
    console.log(".when");
    console.log(data1);
    console.log(data2);
    data1 = formatProjects(data1);
    data2 = formatProjects(data2);
    projectData = data1.concat(data2);
    console.log("projectData");
    console.log(projectData);
    projectData = mergePages(projectData);
    printResponse("projects", projectData, template);
  });
}

// Calls Harvest api for task list.
// TODO call harvestProjectTasks to match the task id's to project id's.
function showTask(projectId, myToken, myId) {
  let source = $("#task-template").html();
  let template = Handlebars.compile(source);
  let strippedTasks = new Array();

  // Use the Harvest Project Task Assignments to link Tasks to Projects.
  $.ajax({
      url: "https://api.harvestapp.com/v2/projects/" + projectId + "/task_assignments?is_active=true",
      headers: {
        "Authorization": "Bearer " + myToken,
        "Harvest-Account-Id": myId
      }
  }).then(function(data){
    let taskAssignList = data.task_assignments;
    taskAssignList.forEach((projectTaskCombo) => {
      strippedTasks.push(projectTaskCombo.task);
    });
      printResponse("tasks", strippedTasks, template)});
}

// Get the Zendesk ticket id and subject to use as Harvest notes.
// TODO just return the string for the notes. Might need a separate call/function to build a url.
function showNotes(client) {
  let notesPromise = client.get(['ticket.id', 'ticket.subject']).then(function(data) {
    let source = $("#notes-template").html();
    let template = Handlebars.compile(source);

    let ticketInfo = "#" + data['ticket.id'] + ": " + data['ticket.subject'];
    printResponse("notes", ticketInfo, template);
    
    let returnNotesPromise = new Array();
    returnNotesPromise.push(data['ticket.id']);
    returnNotesPromise.push(data['ticket.subject']);
    console.log("returnNotesPromise");
    console.log(returnNotesPromise);
    return returnNotesPromise;
  });
  return Promise.resolve(notesPromise);
}

// Split JSON returned from Harvest to group projects by client.
// TODO Handle the two pages that are being retrieved from Harvest.
function formatProjects(data) {
  console.log("Reached formatProjects");
  let myClients = new Array();
  let projects = data[0].projects;
  projects.forEach((project) => {

    let tempClient = project.client;
    // add a (empty) project array to the client.
    tempClient.projectList = [];

    let i = indexOfClient(myClients, tempClient);
    if (i >= 0) {
      myClients[i].projectList.push({"id": project.id, "name": project.name});
    } else { // Else if the client id is not in the clients array.
      tempClient.projectList.push({"id": project.id, "name": project.name});
      myClients.push(tempClient);
    }
  });
  return myClients;
}

// Helper for formatProjects().
function indexOfClient(clients, tempClient) {
  for (let i = 0; i < clients.length; i++) {
    if (clients[i].id === tempClient.id) {
      return i;
    }
  }
  return -1;
}

// Looks through concatenated pages to see if there are projects that
// got cut off and merge them.
// TODO It doesn't like data[i].name (the .name part).
function mergePages(data) {
  console.log("Reached mergePages");
  console.log("data");
  console.log(data);
  for (let i = 0; i < data.length; i++) {
    if (data[i].name === data[i+1].name) {
      for (let j = 0; j < data[i+1].projectList.length; j++) {
        data[i].projectList.push(data[i+1].projectList[j]);
      }
      data.splice(i+1, 1);
    }
  }
  return data;
}

function printResponse(divLocation, data, template) {
  let harvestResponse = {};
  harvestResponse = data;
  console.log("harvestResponse " + divLocation);
  console.log(harvestResponse);
  $("#" + divLocation + "Content").html(template(harvestResponse));
}