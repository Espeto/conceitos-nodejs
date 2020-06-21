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

  const repository = {id: uuid(), title: title, url: url, techs: techs, likes: 0};
  
  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { repoIndex } = request;
  const { title, url, techs } = request.body; 
  const { id } = request.params;

  const likes = repositories[repoIndex].likes;
  const updatedRepo = { id: id, title: title, url: url, techs: techs, likes: likes};

  repositories[repoIndex] = updatedRepo;

  return response.json(updatedRepo);

});

app.delete("/repositories/:id", (request, response) => {
  const { repoIndex } = request;

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { repoIndex } = request;

  let newLikeVal = repositories[repoIndex].likes + 1;
  repositories[repoIndex].likes = newLikeVal;
  
  return response.json(repositories[repoIndex]);
});

app.listen(3333, () => {
  console.log('Back-end started');
});

module.exports = app;
