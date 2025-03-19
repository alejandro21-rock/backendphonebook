const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.yhtn1.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  name: "Arto Vihavainen",
  number: "045-1232456",
});

person.save().then((result) => {
  console.log("Phonebook");
});

Person.find({}).then((result) => {
  result.forEach((p) => {
    console.log(`${p.name} ${p.number}`);
  });
  mongoose.connection.close();
});
