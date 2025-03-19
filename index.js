const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("dist"));
morgan.token("body", (req) => JSON.stringify(req.body));
app.use(morgan("tiny"));

let persons = [];

const date = new Date();
app.get("/info", (request, response) => {
  response.send(
    ` <p>Phonebook has info for ${persons.length} people</p> <p>${date}</p>`
  );
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  let personFilter = persons.filter((person) => person.id !== id);
  response.send(personFilter);
  response.status(204).end();
});

app.post(
  "/api/persons",
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :body "
  ),
  (request, response) => {
    const body = request.body;

    if (body.name === undefined) {
      return response.status(400).json({ error: "name missing" });
    }

    const person = new Person({
      name: body.name,
      number: body.number,
    });

    person.save().then((savedPerson) => {
      response.json(savedPerson);
    });
  }
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
