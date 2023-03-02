const express = require("express");

const { validate, v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function checkIfExistRepository(request, response, next) {
  const { id } = request.params;

  const repository = repositories.find((repository) => repository.id === id);

  if (!repository) {
    return response.status(404).json({ error: "Repository not found" });
  }

  return next();
}

app.get("/repositories", (request, response) => {
  return response.status(200).send(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.status(201).send(repository);
});

app.put("/repositories/:id", checkIfExistRepository, (request, response) => {
  const { id } = request.params;
  const updatedRepository = request.body;

  repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  if (updatedRepository.likes) {
    delete updatedRepository.likes;
  }

  const repository = { ...repositories[repositoryIndex], ...updatedRepository };

  repositories[repositoryIndex] = repository;

  return response.status(200).json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", checkIfExistRepository, (request, response) => {
  const { id } = request.params;

  repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post(
  "/repositories/:id/like",
  checkIfExistRepository,
  (request, response) => {
    const { id } = request.params;

    repositoryIndex = repositories.findIndex(
      (repository) => repository.id === id
    );
    if (repositoryIndex < 0) {
      return response.status(404).json({ error: "Repository not 4 found" });
    }

    const likes = ++repositories[repositoryIndex].likes;
    return response.status(200).json({ likes: likes });
  }
);

module.exports = app;
