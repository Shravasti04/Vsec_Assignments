
let students = [];

document.getElementById("studentForm").addEventListener("submit", function (event) {
  event.preventDefault();

  let name = document.getElementById("name").value.trim();
  let roll = document.getElementById("roll").value.trim();

  let mark1 = Number(document.getElementById("mark1").value);
  let mark2 = Number(document.getElementById("mark2").value);
  let mark3 = Number(document.getElementById("mark3").value);

  if (name === "" || roll === "") {
    alert("Please enter student details.");
    return;
  }

  if (students.some(student => student.roll === roll)) {
    alert("Roll number already exists!");
    return;
  }

  let total = mark1 + mark2 + mark3;
  let percentage = (total / 300) * 100;

  let student = {
    name: name,
    roll: roll,
    total: total,
    percentage: percentage
  };

  students.push(student);

  let table = document.getElementById("studentTable");
  let row = table.insertRow();

  row.insertCell(0).textContent = student.name;
  row.insertCell(1).textContent = student.roll;
  row.insertCell(2).textContent = student.total;
  row.insertCell(3).textContent = student.percentage.toFixed(2) + "%";

  let topper = students.reduce((best, current) =>
    current.total > best.total ? current : best
  );

  document.getElementById("topper").textContent =
    "Topper: " + topper.name + " (Total: " + topper.total + ")";

  document.getElementById("studentForm").reset();
});
