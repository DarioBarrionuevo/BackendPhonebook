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
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(express.static("dist"));
app.use(express.json());
app.use(cors());
app.use(express.static("build"));

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
// GET ONE PERSON
app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
  // .catch((error) => {
  //   console.log(error);
  //   response.status(400).send({ error: "malformatted id" });
  // });
});
// GET INFO
app.get("/api/info", (request, response) => {
  const today = new Date();

  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + " " + time;

  Person.find({}).then((result) => {
    response.send(`Phonebook has info for ${result.length} people
    Time :${dateTime}
  `);
  });
});

// POST NEW PERSON
app.post("/api/persons", (request, response, next) => {
  const body = request.body;
  const name = body.name;

  if (name === undefined) {
    return response.status(400).json({ error: "content missing" });
  }

  Person.findOne({ name: name })
    .then((result) => {
      if (result === null) {
        const person = new Person({
          name: body.name,
          number: body.number,
        });

        person
          .save()
          .then((savedPerson) => {
            response.json(savedPerson);
          })
          .catch((error) => next(error));
      } else {
        Person.findByIdAndUpdate(
          result.id,
          { number: body.number },
          { new: true }
        )
          .then((updatedPerson) => {
            response.json(updatedPerson);
          })
          .catch((error) => next(error));
      }
    })
    .catch((error) => next(error));
});

// DELETE ONE NOTE
app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      console.log("Deleted Person with id: ", request.params.id);
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// UPDATE ONE PERSON
app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  Person.findByIdAndUpdate(
    request.params.id,
    { name: body.name, number: body.number },
    { new: true }
  )
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});
// -------------

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.log("🚀 ERROR.NAME IS: ", error.name);
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
