require("dotenv").config();
const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");

const app = express();

app.use(express.json());

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: console.log,
  },
);

// User model
const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "users",
    timestamps: true,
  },
);

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "Express + Sequelize + PostgreSQL (v1.7)",
  });
});

// Get users
app.get("/users", async (req, res) => {
  try {
    const users = await User.findAll();

    res.json(users);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
});

// Create user
app.post("/users", async (req, res) => {
  try {
    const { name } = req.body;

    const user = await User.create({
      name,
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create user",
    });
  }
});

app.get('/exit', () => {
  process.exit(1);
});

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: "API is healthy", time: new Date().toLocaleString() })
});

app.get('/stress', (req, res) => {
  console.log("Generating stress..");

  let counter = 0;
  for (let i = 0; i <= 500000000; i++) {
    counter += i;
  }

  res.send(counter.toString());
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
    method: req.method,
    path: req.originalUrl,
    body: req.body,
  });
});

async function startServer() {
  try {
    await sequelize.authenticate();

    console.log("Connected to PostgreSQL");

    // Creates the table if it doesn't exist.
    await sequelize.sync();

    console.log("Database synchronized");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to database:", error);

    process.exit(1);
  }
}

startServer();
