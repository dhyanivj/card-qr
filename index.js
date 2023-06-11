const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/:empID', async (req, res) => {
  try {
    const empID = req.params.empID;
    const employeeData = await fetchEmployeeData(empID);

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

async function fetchEmployeeData(empID) {
  try {
    const response = await axios.get('https://script.google.com/macros/s/AKfycbyGURgPlCIsuF3a2mlY_cJJourQbvVIUVUK2KnzWy_JNIp2t5467dtzt62c2m9_pquMcA/exec');
    const employeesData = response.data.data; // Access the nested 'data' array

    const employee = employeesData.find(emp => emp.empID == empID);
    if (employee) {
      return {
        empID: employee.empID,
        name: employee.name,
        dob: employee.dob,
        department: employee.department
      };
    } else {
      throw new Error('Employee not found');
    }
  } catch (error) {
    throw new Error('Error fetching employee data');
  }
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
