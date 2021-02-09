const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");
const { join } = require("path");

//to post you must use bodyParser

app.use(express.static("assets"));
// need to implement diff from example from p'mak because we use js not ts
app.use(bodyParser.json("assets"));

app.get("/", (req, res) => {
  res.end(fs.readFileSync("./instruction.html"));
});

//implement your api here
//follow instruction in http://localhost:8000/

// normal get
app.get("/courses", (req, res) => {
  //file is string need to parse to json (data)
  const file = fs.readFileSync("myCourses.json", "utf8");
  const data = JSON.parse(file);
  res.json(data);
});

app.get("/courses/:id", (req, res) => {
  const { id } = req.params;
  console.log(id);
  const file = fs.readFileSync("myCourses.json", "utf8");
  const data = JSON.parse(file);
  //res.json(data.courses[1].courseId);
  //use callback function find (from video week 8)
  const courseid = data.courses.find((date) => date.courseId === Number(id));
  //check if we have this id return in json form if not return status 404 not found
  if (!courseid) {
    res.status(404);
    res.json({ message: `courseId: ${id} not found` });
    return;
  }
  res.json(courseid);
});

app.delete("/courses/:id", (req, res) => {
  const { id } = req.params;
  // console.log(id);
  const file = fs.readFileSync("myCourses.json", "utf8");
  const data = JSON.parse(file);
  // use filter to get every course in data except theone we need to delete
  data.courses = data.courses.filter((date) => date.courseId !== Number(id));

  ///////cal grade////////
  let sum = 0;
  let i = 0;
  data.courses.map((date) => {
    sum += date.gpa * date.credit;
    i += date.credit;
    //console.log(date.gpa)
  });
  // console.log(sum/i)
  data.gpax = sum / i;
  ///////cal grade////////
  // write to mycourse.json because we delete and re cal gpax
  fs.writeFileSync("myCourses.json", JSON.stringify(data));
  res.json(data);
});

app.post("/addCourse", (req, res) => {
  const course = req.body; //course is come from body we provide
  const file = fs.readFileSync("myCourses.json", "utf8");
  const data = JSON.parse(file);
  //if one of course component is missing return status 422
  if (
    course.courseId === null ||
    course.courseName === null ||
    course.credit === null ||
    course.gpa === null
  ) {
    res.status(422);
    res.json({ message: "data not complete" });
    return;
  }
  //if not we push this course to data
  data.courses.push({
    ...course
  });

  let sum = 0;
  let i = 0;
  data.courses.map((date) => {
    sum += date.gpa * date.credit;
    i += date.credit;
    //console.log(date.gpa)
  });
  data.gpax = sum / i;

  fs.writeFileSync("myCourses.json", JSON.stringify(data));
  res.json(course);
});

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`server started on port:${port}`));
