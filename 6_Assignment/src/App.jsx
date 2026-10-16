import { useState, useEffect } from "react";
import "./App.css";

const subjects = [
  "English",
  "Mathematics",
  "Science",
  "Social Studies",
  "Computer"
];

function StudentForm({ onAddStudent }) {
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [marks, setMarks] = useState(["", "", "", "", ""]);

  function handleSubmit(event) {
    event.preventDefault();

    const studentMarks = marks.map(Number);
    const total = studentMarks.reduce((sum, mark) => sum + mark, 0);
    const percentage = total / 5;

    const result = studentMarks.every((mark) => mark >= 35)
      ? "PASS"
      : "FAIL";

    const student = {
      name: name.trim(),
      rollNumber: rollNumber.trim(),
      studentClass,
      marks: studentMarks,
      total,
      percentage,
      result
    };

    if (onAddStudent(student)) {
      setName("");
      setRollNumber("");
      setStudentClass("");
      setMarks(["", "", "", "", ""]);
    }
  }

  return (
    <section className="card">
      <h2>Add Student</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="field">
            <label>Student Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>Roll Number</label>
            <input
              type="text"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              required
            />
          </div>

          <div className="field full-width">
            <label>Class</label>
            <select
              value={studentClass}
              onChange={(e) => setStudentClass(e.target.value)}
              required
            >
              <option value="">Select Class</option>
              <option value="Class 8">Class 8</option>
              <option value="Class 9">Class 9</option>
              <option value="Class 10">Class 10</option>
              <option value="Class 11">Class 11</option>
              <option value="Class 12">Class 12</option>
            </select>
          </div>
        </div>

        <h3>Subject Marks <span>(Out of 100)</span></h3>

        <div className="marks-grid">
          {subjects.map((subject, index) => (
            <div className="field" key={subject}>
              <label>{subject}</label>
              <input
                type="number"
                min="0"
                max="100"
                value={marks[index]}
                onChange={(e) => {
                  const updated = [...marks];
                  updated[index] = e.target.value;
                  setMarks(updated);
                }}
                required
              />
            </div>
          ))}
        </div>

        <button type="submit">Save Student Result</button>
      </form>
    </section>
  );
}

function StudentDetails({ students, onDelete }) {
  return (
    <section className="card">
      <h2>Student Records</h2>
      <p className="record-count">
        Total students: {students.length}
      </p>

      {students.length === 0 ? (
        <p className="empty">No student records saved yet.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll No.</th>
                <th>Class</th>
                {subjects.map((subject) => (
                  <th key={subject}>{subject}</th>
                ))}
                <th>Total</th>
                <th>Percentage</th>
                <th>Result</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student) => (
                <tr key={student.rollNumber}>
                  <td>{student.name}</td>
                  <td>{student.rollNumber}</td>
                  <td>{student.studentClass}</td>

                  {student.marks.map((mark, index) => (
                    <td key={index}>{mark}</td>
                  ))}

                  <td>{student.total}/500</td>
                  <td>{student.percentage.toFixed(2)}%</td>

                  <td>
                    <span
                      className={
                        student.result === "PASS"
                          ? "status pass"
                          : "status fail"
                      }
                    >
                      {student.result}
                    </span>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => onDelete(student.rollNumber)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function App() {
  const [students, setStudents] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("studentRecords") || "[]"
      );
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("studentRecords", JSON.stringify(students));
  }, [students]);

  function addStudent(student) {
    const exists = students.some(
      (item) => item.rollNumber.toLowerCase() ===
        student.rollNumber.toLowerCase()
    );

    if (exists) {
      alert("This roll number already exists!");
      return false;
    }

    setStudents((previous) => [...previous, student]);
    return true;
  }

  function deleteStudent(rollNumber) {
    if (window.confirm("Delete this student record?")) {
      setStudents((previous) =>
        previous.filter((student) => student.rollNumber !== rollNumber)
      );
    }
  }

  return (
    <main className="app">
      <header className="page-header">
        <h1>Student Result Management</h1>
        <p>Enter marks, calculate results and manage student records.</p>
      </header>

      <StudentForm onAddStudent={addStudent} />

      <StudentDetails
        students={students}
        onDelete={deleteStudent}
      />

      <footer>Student Result Management System</footer>
    </main>
  );
}

export default App;