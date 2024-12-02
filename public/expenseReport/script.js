const token = localStorage.getItem("token");
const historyBtn = document.getElementById("history-btn");
const downloadBtn = document.getElementById("download-btn");

window.addEventListener("DOMContentLoaded", async () => {
  await fetchIsPremium();
  historyBtn.addEventListener("click", fetchDownloadHistory);
  downloadBtn.addEventListener("click", downloadPDF);
});

// entry point
// fetch isPremium api
async function fetchIsPremium() {
  try {
    const response = await axios.get("http://localhost:3000/isPremium", {
      headers: {
        Authorization: `${token}`,
      },
    });
    const isPremium = response.data.isPremium;
    if (isPremium) {
      fetchExpenses();
      historyBtn.disabled = false;
      downloadBtn.disabled = false;
    } else {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        text: "you are not a premium user",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  } catch (error) {
    console.error("Error fetching isPremium:", error);
    if (error.response && error.response.status === 401) {
      window.location.href = "../login/login.html";
    }
  }
}


async function fetchExpenses() {
  try {
    const response = await axios.get(
      "http://localhost:3000/expenses/?limit=100",
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    const userResponse = await axios.get("http://localhost:3000/totals", {
      headers: {
        Authorization: `${token}`,
      },
    });
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = "";

    response.data.expenses.forEach((expense) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${expense.updatedAt.split("T")[0]}</td>
        <td>${expense.description}</td>
        <td>${expense.category}</td>
        <td>${expense.amount || "-"}</td>

      `;
      tableBody.appendChild(row);
    });

    const { totalIncome, totalExpense } = userResponse.data;
    const savings = totalIncome - totalExpense;

    document.getElementById(
      "total-income"
    ).innerText = `₹ ${totalIncome.toFixed(2)}`;
    document.getElementById(
      "total-expense"
    ).innerText = `₹ ${totalExpense.toFixed(2)}`;
    document.getElementById("savings").innerText = `₹ ${savings.toFixed(2)}`;
  } catch (error) {
    console.error("Error fetching expenses:", error);
  }
}

function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const table = document.getElementById("expense-table");
  let rowData = [];

  for (let row of table.rows) {
    let cellData = [];
    for (let cell of row.cells) {
      cellData.push(cell.innerText);
    }
    rowData.push(cellData);
  }

  // Formatting options for the table in the PDF
  const startX = 10; // Horizontal start position
  const startY = 10; // Vertical start position
  const rowHeight = 10; // Height of each row in the PDF

  // Adding table rows to PDF
  rowData.forEach((row, rowIndex) => {
    row.forEach((cellText, cellIndex) => {
      doc.text(
        cellText,
        startX + cellIndex * 40,
        startY + rowIndex * rowHeight
      );
    });
  });

  doc.save("expenses.pdf");
  postDownloadHistory();
}

// function to fetch download history
async function fetchDownloadHistory() {
  const list = document.querySelector(".list");

  try {
    const response = await axios.get(
      "http://localhost:3000/expenses/download",
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    list.innerHTML = "";
    response.data.forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML = `<a target="_blank" href="${item.url}">${item.url}</a>`;
      list.appendChild(li);
    });
  } catch (error) {
    console.error("Error fetching download history:", error);
  }
}
// function to post download history
async function postDownloadHistory() {
  try {
    await axios.post(
      "http://localhost:3000/expenses/download",
      {},
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
  } catch (error) {
    console.error("Error posting download history:", error);
  }
}

