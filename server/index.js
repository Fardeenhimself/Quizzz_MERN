const express = require("express");
const app = express();
const session = require("express-session");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const bcrypt = require("bcrypt");
require("dotenv").config({ path: "./config/config.env" });

const port = process.env.PORT || 3000;
const saltRounds = 10;


const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});


app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    key: "loginState",
    secret: "batman",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000, 
    },
  })
);


let db;
client.connect()
  .then(() => {
    db = client.db("quiz"); 
    console.log("Successfully connected to MongoDB Atlas");
  })
  .catch(err => console.error("MongoDB connection error:", err));


app.get("/", (req, res) => {
  res.send("Server is running...");
});


app.post("/register", async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    const usersCollection = db.collection("users");

 
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

 
    const hashedPassword = await bcrypt.hash(password, saltRounds);


    const newUser = {
      name,
      email,
      password: hashedPassword,
      role: "user", 
    };

    await usersCollection.insertOne(newUser);
    res.status(200).json({ msg: "Register successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});


app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    const usersCollection = db.collection("users");
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

  
    req.session.email = email;
    res.status(200).json({ msg: "Login successful", email: email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});


app.get("/session", (req, res) => {
  if (req.session.email) {
    res.send({ loggedIn: true, email: req.session.email });
  } else {
    res.send({ loggedIn: false });
  }
});


app.get("/emailBysession", async (req, res) => {
  if (req.session.email) {
    try {
      const usersCollection = db.collection("users");

      const user = await usersCollection.findOne({ email: req.session.email });

      if (user) {
        res.json({ userId: user._id });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error("Error fetching user by email:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.json({ loggedIn: false });
  }
});

app.get("/catIcons", async (req, res) => {
  try {
    
    const logosCollection = db.collection("logos");

    const logos = await logosCollection.find({}).toArray();

   
    res.json(logos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

app.get("/users", async (req, res) => {
  try {
    
    const usersCollection = db.collection("users");

    const users = await usersCollection.find({}).toArray();

   
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});



app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Unable to log out");
    }
    res.clearCookie("loginState");
    res.send("Logged out");
  });
});


app.get("/admin-check", async (req, res) => {
  const userEmail = req.session.email;

  if (!userEmail) {
    return res.json({ admin: false });
  }

  try {
    const usersCollection = db.collection("users");
    const user = await usersCollection.findOne({ email: userEmail });

    if (user) {
      res.json({ admin: user.role === "admin" ? 1 : 0 });
    } else {
      res.json({ admin: 0 });
    }
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});


app.post("/addCategory", async (req, res) => {
  const { name,  description, level } = req.body;

  if (!name || !description) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    const categoriesCollection = db.collection("category");

   
    const existingCategory = await categoriesCollection.findOne({ name });

    if (existingCategory) {
      
      const newLevel = level;

      
      if (!existingCategory.level.includes(newLevel)) {
        await categoriesCollection.updateOne(
          { name },
          { $push: { level: newLevel } }
        );
        res.json({ ...existingCategory, level: [...existingCategory.level, newLevel] });
      } else {
        res.json(existingCategory);
      }
    } else {
    
      const newCategory = {
        name,
        description,
        level: [level],
        createdAt: new Date(),
      };

      await categoriesCollection.insertOne(newCategory);
      res.json(newCategory);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});



app.get("/categoryList", async (req, res) => {
  try {
    const categoriesCollection = db.collection("category");
    const categories = await categoriesCollection.find({}).toArray();
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

app.get("/delFetch/:id", async (req,res) => {
  const { id } = req.params;

  try {
    const categoryCollection = db.collection("category");
    const questionsCollection = db.collection("questions");
    const resultsCollection = db.collection("results");

    const category = await categoryCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!category){
      return res.status(404).json({ msg: "Category not found" });
    }

    await categoryCollection.deleteOne({_id: new ObjectId(id)});

    const questions = await questionsCollection
     .find({categoryId: new ObjectId(id)})
     .toArray();
    if (questions.length>0) {
      await questionsCollection.deleteMany({categoryId: new ObjectId(id)});
    }

    const results = await resultsCollection.find({categoryId: id}).toArray();
    if (results.length>0) {
      await resultsCollection.deleteMany({categoryId: id});
      
    }
    res.json({ msg: "Category deleted" });

  } catch(error){
    console.error(error);
    res.status(500).json({msg: "Server Error"});
  }
});

app.post('/quiz/:id/questions', async (req, res) => {
  const category = req.params.id;
  const {level, question, options, answer } = req.body;

  if (!question || !options || !answer) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    const questionsCollection = db.collection('questions');

    const newQuestion = {
      categoryId: new ObjectId(category),
      question,
      level,
      options,
      answer,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await questionsCollection.insertOne(newQuestion);
    res.json(result.insertedId);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.put('/editQuestion/:id', async (req, res) => {
  const { id } = req.params;
  const {level, question, options, answer } = req.body;

  if (!question || !options || !answer) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    const questionsCollection = db.collection('questions');

    const updatedQuestion = {
      question,
      level,
      options,
      answer,
      updatedAt: new Date(),
    };

    const result = await questionsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedQuestion }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ msg: 'Question not found' });
    }

    res.json(updatedQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.delete('/deleteQuestion/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const questionsCollection = db.collection('questions');

    const result = await questionsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ msg: 'Question not found' });
    }

    res.json({ msg: 'Question deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});


app.get('/quiz', async (req, res) => {
  const { level, questionNumber, categoryID } = req.query;

  try {
    const questionsCollection = db.collection('questions');

    const query = {
      categoryId: new ObjectId(categoryID),
      level: level
    };

    const limit = parseInt(questionNumber, 10) || 20; 

    const questions = await questionsCollection.find(query).limit(limit).toArray();

    res.json(questions);

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});




app.get('/quizs/:id', async (req, res)=>{
  const { id } = req.params;
  try {

    const questionsCollection = db.collection('questions');

    const questions = await questionsCollection.find( { categoryId: new ObjectId(id) }).toArray();

    res.json(questions);

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
})

app.get('/quizs', async (req, res)=>{
  try {

    const questionsCollection = db.collection('questions');

    const questions = await questionsCollection.find({}).toArray();

    res.json(questions);

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
})

app.get("/clear/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const collection = db.collection(id);

    await collection.deleteMany({});

    res.send(`documents were deleted from the collection.`);
  } catch (error) {
    console.error("Error clearing collection:", error);
  }
});


app.get("/dashboard/stats", async (req, res) => {
  try {
    const categoriesCollection = db.collection("category");
    const usersCollection = db.collection("users");
    const questionsCollection = db.collection("questions");

    const numberOfCategories = await categoriesCollection.countDocuments();
    const numberOfUsers = await usersCollection.countDocuments();
    const numberOfQuestions = await questionsCollection.countDocuments();

    res.json({
      categories: numberOfCategories,
      users: numberOfUsers,
      questions: numberOfQuestions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

app.post("/results", async (req, res) => {

  const { userId, score, questionsTotal, correctAnswers, incorrectAnswers, skippedAnswers,  categoryId } = req.body;

  if (!userId || score === undefined || !questionsTotal || !categoryId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const resultsCollection = db.collection("results");

    const result = await resultsCollection.insertOne({
      userId,
      categoryId,
      questionsTotal,
      correctAnswers,
      incorrectAnswers,
      skippedAnswers,
      score,
      date: new Date(), 
    });

    res.status(201).json({ result: result });
  } catch (error) {
    console.error("Error saving result:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get('/scores/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const scoresCollection = db.collection('results');
    const categoriesCollection = db.collection('category');

    let scores = await scoresCollection.find({ userId }).toArray();

    if (scores.length === 0) {
      return res.json([]);
    }

    scores = await Promise.all(scores.map(async (score) => {
      const category = await categoriesCollection.findOne(
        { _id: new ObjectId(score['categoryId']) },
        { projection: { name: 1 } }
      );
      

      const formattedDate = new Date(score.date).toLocaleString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true, 
      });
      score.categoryName = category?.name || 'Unknown'; 
      score.formattedDate = formattedDate;

      return score;
    }));

    res.json(scores);

  } catch (error) {
    console.error('Error fetching scores:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/score/:categoryId', async (req, res) => {
  const { categoryId } = req.params;

  try {
    const scoresCollection = db.collection('results');
    const usersCollection = db.collection('users');

  
    const aggregatedScores = await scoresCollection.aggregate([
      { $match: { categoryId } }, 
      {
        $group: {
          _id: "$userId", 
          totalCorrectAnswers: { $sum: "$correctAnswers" },
          totalQuestions: { $sum: "$questionsTotal" }
        }
      }
    ]).toArray();

    if (aggregatedScores.length === 0) {
      return res.json([]);
    }

    const scores = await Promise.all(aggregatedScores.map(async (score) => {
      const user = await usersCollection.findOne(
        { _id: new ObjectId(score._id) },
        { projection: { name: 1 } }
      );

      return {
        name: user.name,
        totalCorrectAnswers: score.totalCorrectAnswers,
        totalQuestions: score.totalQuestions
      };
    }));

    res.json({ scores });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});




app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
