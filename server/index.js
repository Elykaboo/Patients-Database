const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const EmployeeModel = require("./models/Employee");
const PatientModel = require("./models/Patients");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB with 'employee' database name
mongoose
  .connect("mongodb://127.0.0.1:27017/employee", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// LOGIN route
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  EmployeeModel.findOne({ email })
    .then((user) => {
      if (user) {
        if (user.password === password) {
          res.json("Success");
        } else {
          res.json("The Password is incorrect");
        }
      } else {
        res.json("No record existed");
      }
    })
    .catch((err) => res.json(err));
});

// REGISTER route
app.post("/register", (req, res) => {
  EmployeeModel.create(req.body)
    .then((employee) => res.json(employee))
    .catch((err) => res.json(err));
});

// ADD NEW PATIENT
app.post("/patients", (req, res) => {
  PatientModel.create(req.body)
    .then((patient) => res.json(patient))
    .catch((err) => {
      console.error("Error creating patient:", err);
      res.status(500).json({
        error: "Failed to create patient",
        details: err.message,
      });
    });
});

// GET ALL PATIENTS
app.get("/patients", async (req, res) => {
  try {
    const patients = await PatientModel.find();
    res.json(patients);
  } catch (err) {
    console.error("Error fetching patients:", err);
    res.status(500).json({ error: "Failed to fetch patients" });
  }
});

// SEARCH PATIENTS BY NAME
app.get("/patients/search", async (req, res) => {
  const { query } = req.query;
  try {
    const patients = await PatientModel.find({
      name: { $regex: query, $options: "i" },
    });
    res.json(patients);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Search failed" });
  }
});

// DELETE PATIENT BY ID
app.delete("/patients/delete", async (req, res) => {
  const { id } = req.body;
  try {
    const result = await PatientModel.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ error: "Patient not found" });
    }
    res.json({
      message: "Patient deleted successfully!",
      patientName: result.name,
    });
  } catch (err) {
    console.error("Error deleting patient:", err);
    res.status(500).json({ error: "Failed to delete patient" });
  }
});

// UPDATE PATIENT BY ID
app.put("/patients/update/:id", async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedPatient = await PatientModel.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );
    if (!updatedPatient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    res.json({
      message: "Patient updated successfully!",
      updatedPatient,
    });
  } catch (err) {
    console.error("Error updating patient:", err);
    res.status(500).json({ error: "Failed to update patient" });
  }
});

// SORT PATIENTS BY AGE
app.get("/patients/sort/age", async (req, res) => {
  const order = req.query.order === "desc" ? -1 : 1;
  try {
    const sortedPatients = await PatientModel.find().sort({ age: order });
    res.json(sortedPatients);
  } catch (err) {
    console.error("Error sorting patients by age:", err);
    res.status(500).json({ error: "Failed to sort patients by age" });
  }
});
//SORT 
app.get("/patients/sort/namelength", async (req, res) => {
  const order = req.query.order === "desc" ? -1 : 1;
  try {
    const sortedPatients = await PatientModel.aggregate([
      {
        $addFields: {
          nameLength: { $strLenCP: "$name" },
        },
      },
      {
        $sort: {
          nameLength: order,
        },
      },
      {
        $project: {
          nameLength: 0,
        },
      },
    ]);
    res.json(sortedPatients);
  } catch (err) {
    console.error("Error sorting by name length:", err);
    res.status(500).json({ error: "Failed to sort by name length" });
  }
});

// Health check route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start the server
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
