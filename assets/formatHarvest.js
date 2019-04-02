function invertStructure(data) {
  var clients = [];
  var projects = data.projects;
  for project in projects {
    var client = project.client;
    var i = indexOfClient(clients, client);
    if (i >= 0) {
      clients[i].projects.append({"id": project.id, "name": project.name});
    } else {
      client.projects = [{"id": project.id, "name": project.name}];
      clients.append(client);
    }
    return clients;
  }
}

function indexOfClient(clients, client) {
  var i = 0;
  for c in clients {
    if (c.id === client.id) {
      return i;
    }
    i++;
  }
  return -1;
}