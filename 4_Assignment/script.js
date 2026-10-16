
document.getElementById("employeeForm").addEventListener("submit", function (event) {
  event.preventDefault();

  let name = document.getElementById("name").value.trim();
  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value;
  let phone = document.getElementById("phone").value.trim();
  let department = document.getElementById("department").value;

  let message = document.getElementById("message");

  if (name.length < 3) {
    message.textContent = "Name must contain at least 3 characters.";
    message.style.color = "red";
    return;
  }

  if (password.length < 6) {
    message.textContent = "Password must contain at least 6 characters.";
    message.style.color = "red";
    return;
  }

  if (!/^[0-9]{10}$/.test(phone)) {
    message.textContent = "Enter a valid 10-digit phone number.";
    message.style.color = "red";
    return;
  }

  if (department === "") {
    message.textContent = "Please select a department.";
    message.style.color = "red";
    return;
  }

  message.textContent = "Employee registered successfully!";
  message.style.color = "green";

  document.getElementById("employeeForm").reset();
});
