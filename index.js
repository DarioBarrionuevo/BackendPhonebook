const express = require("express");
const morgan = require("morgan");
const app = express();
require("dotenv").config();
const cors = require("cors");
const Person = require("./models/person");


// app.use(morgan('tiny'))
morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(
    ":method :url :status :response-time ms - :res[content-length] :body - :req[content-length]"
  )
);
app.use(express.static('dist'))
app.use(express.json());
app.use(cors());
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
// GET ROOT
app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});
// GET ALL PERSONS
app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
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

app.get("/api/info", (request, response) => {
  const today = new Date();

  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + " " + time;

  response.send(`Phonebook has info for ${persons.length} people
    Time :${dateTime}
  `);
});

// CREATE NEW PERSON
// const generateId = () => {
//   const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
//   return maxId + 1;
// };
// const generateRandomId = () => {
//   const randomId = Math.floor(Math.random() * 1000000 + 5);

//   return randomId;
// };

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: "name missing",
    });
  }
  if (!body.number) {
    return response.status(400).json({
      error: "number missing",
    });
  }
  // console.log("🚀 ~ file: index.js:79 ~ filtered ~ filtered:", filtered);
  // if (!body.name) {
  //   return response.status(400).json({
  //     error: "name missing",
  //   });
  // }
  // if (!body.number) {
  //   return response.status(400).json({
  //     error: "number missing",
  //   });
  // }
  const person = new Person({
    name: body.name,
    number: body.number,
    // id: generateRandomId(),
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

// DELETE
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
