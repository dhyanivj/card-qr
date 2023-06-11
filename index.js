const express = require('express');
const path = require('path');
const QRCode = require('qrcode');

const app = express();
const port = 3000;

// Dummy JSON data representing employee information
const employees = [
  {
    empID: '101',
    name: 'John Doe',
    dob: '01-01-1990',
    department: 'Engineering',
  },
  {
    empID: '102',
    name: 'Jane Smith',
    dob: '05-15-1985',
    department: 'Sales',
  },
  // Add more employee objects as needed
];

app.use(express.static(path.join(__dirname, 'public')));

app.get('/:empID', (req, res) => {
  try {
    const empID = req.params.empID;
    const employeeData = fetchEmployeeData(empID);

    // Generate HTML markup
    const html = `
      <div>
        <table>
          <tr>
            <th>Employee ID</th>
            <td>${employeeData.empID}</td>
          </tr>
          <tr>
            <th>Name</th>
            <td>${employeeData.name}</td>
          </tr>
          <tr>
            <th>Date of Birth</th>
            <td>${employeeData.dob}</td>
          </tr>
          <tr>
            <th>Department</th>
            <td>${employeeData.department}</td>
          </tr>
        </table>
      </div>
      <div id="qrcode"></div>
      <script src="https://cdn.jsdelivr.net/gh/davidshimjs/qrcodejs/qrcode.min.js"></script>
      <script>
        const qrCodeContainer = document.getElementById('qrcode');
        const qrCodeUrl = "https://card-qr.vercel.app/${empID}";
        const qrcode = new QRCode(qrCodeContainer, {
          text: qrCodeUrl,
          width: 128,
          height: 128,
        });

        window.history.replaceState({}, document.title, "/");
      </script>
    `;

    res.send(html);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

function fetchEmployeeData(empID) {
  const employee = employees.find(emp => emp.empID === empID);

  if (employee) {
    return employee;
  }

  throw new Error('Employee not found');
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
