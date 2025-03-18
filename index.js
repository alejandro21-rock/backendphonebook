const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("dist"));
morgan.token("body", (req) => JSON.stringify(req.body));
app.use(morgan("tiny"));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => {
  const randomId =
    persons.length > 0
      ? Math.random(...persons.map((p) => p.id))
          .toString(30)
          .substring(2)
      : 0;
  return randomId;
};

const date = new Date();

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  response.send(
    ` <p>Phonebook has info for ${persons.length} people</p> <p>${date}</p>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
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
    if (!body.name || !body.number) {
      return response.status(400).json({
        error: "Debes completar todos los campos",
      });
    }

    const repeat = persons.find((person) => person.name === body.name);

    if (repeat) {
      return response.status(400).json({
        error: "name must be unique",
      });
    }

    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    };

    persons = persons.concat(person);

    response.json(person);
  }
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
