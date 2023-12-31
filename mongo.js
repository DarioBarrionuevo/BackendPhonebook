/* eslint-disable no-unused-vars */
const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];
const url = `mongodb+srv://dariobafran:${password}@cluster0.z2d0fgk.mongodb.net/AppPhonebook?retryWrites=true&w=majority`;
mongoose.set("strictQuery", false);
mongoose.connect(url);

const PersonSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", PersonSchema);

const person = new Person({
  name: name,
  number: number,
});

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
} else {
  person.save().then((result) => {
    console.log(`Added ${name} ${number} to phonebook`);
    mongoose.connection.close();
  });
}
