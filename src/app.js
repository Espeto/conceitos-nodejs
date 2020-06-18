const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function checkRepoID(request, response, next) {
  const  { id } = request.params;

  if(!isUuid(id)) {
    return response.status(400).json({ error: "Invalid project ID" });
  }

  return next();
}

function checkRepoIndex(request, response, next) {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if(repoIndex < 0) {
    return response.status(400).json({ error: "Repositorie not found"});
  }

  request.repoIndex = repoIndex;

  return next();
}

app.use('/repositories/:id', checkRepoID, checkRepoIndex);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repositorie = {id: uuid(), title: title, url: url, techs: techs, likes: 0};
  
  repositories.push(repositorie);

  return response.json(repositorie);
});

app.put("/repositories/:id", (request, response) => {
  const { repoIndex } = request;
  const { title, url, techs } = request.body; 

  const updatedRepo = { id: id, title: title, url: url, techs: techs};

  repositories[repoIndex] = updatedRepo;

  return response.json(updatedRepo);

});

app.delete("/repositories/:id", (request, response) => {
  // TODO
});

app.post("/repositories/:id/like", (request, response) => {
  // TODO
});

app.listen(3333);

module.exports = app;
