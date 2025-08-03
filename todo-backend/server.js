const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client("327841424635-vj0h1916a6ld478ajb50r2thlddcajd2.apps.googleusercontent.com");


const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");

const app = express();
const PORT = 3001;
const SECRET = "your_jwt_secret";

app.use(cors());
app.use(express.json());

// Load users from a JSON file (no database yet)
const getUsers = () => {
  const data = fs.readFileSync("./users.json", "utf8");
  return JSON.parse(data);
};
const saveUsers = (users) => {
  fs.writeFileSync("./users.json", JSON.stringify(users, null, 2));
};


// 👉 Register endpoint
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const users = getUsers();

  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ email, password: hashedPassword });
  saveUsers(users);

  res.json({ message: "User registered successfully" });
});


// 👉 Login endpoint
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const users = getUsers();

  const user = users.find((u) => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ email }, SECRET, { expiresIn: "1h" });
  res.json({ token });
});

app.post("/google-login", async (req, res) => {
  const { credential } = req.body;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: "327841424635-vj0h1916a6ld478ajb50r2thlddcajd2.apps.googleusercontent.com", // same as in your frontend
    });

    const payload = ticket.getPayload();
    const email = payload.email;

    const users = getUsers();
    let user = users.find((u) => u.email === email);

    if (!user) {
      users.push({ email, password: null }); // Google users don't need passwords
      saveUsers(users);
    }

    const jwtToken = jwt.sign({ email }, SECRET, { expiresIn: "1h" });
    res.json({ token: jwtToken });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(401).json({ message: "Invalid Google token" });
  }
});



// 👉 Protected todo list
app.get("/todoList", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token missing" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    // Return sample todos
    res.json([
      { id: 1, todoText: "Buy groceries", isDone: false },
      { id: 2, todoText: "Study backend", isDone: true },
    ]);
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
