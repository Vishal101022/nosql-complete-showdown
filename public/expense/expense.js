const addIncomeBtn = document.querySelector(".addIncomeBtn");
const premiumBtn = document.querySelector(".premiumBtn");
const token = localStorage.getItem("token");
const itemsContainer = document.querySelector(".items");
const rowsPerPageDropdown = document.getElementById("rows-per-page");

// add user peferance for pagination
let currentPage = localStorage.getItem("currentPage");
let limit = localStorage.getItem("limit") || 10;
if (!currentPage) {
  currentPage = 1;
}

// initialize the loading
window.addEventListener("DOMContentLoaded", async () => {
  await fetchExpenses(currentPage, limit);
  await fetchIsPremium();
  rowsPerPageDropdown.value = limit;
});


// fetch expenses
async function fetchExpenses(page, limit) {
  try {
    const response = await axios.get(
      `http://localhost:3000/expenses?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    for (let i = 0; i < response.data.expenses.length; i++) {
      displayDataOnScreen(response.data.expenses[i]);
    }
    
    setupPagination(response.data.totalPages, response.data.currentPage);
    await getTotalIncome_Expense();
  } catch (error) {
    console.log("Error:", error.message);
  }
}

// fetch isPremium
async function fetchIsPremium() {
  try {
    const response = await axios.get("http://localhost:3000/isPremium", {
      headers: {
        Authorization: `${token}`,
      },
    });
    if (response.data.isPremium) {
      premiumBtn.innerText = "Premium User";
      premiumBtn.disabled = true;
    } else {
      premiumBtn.innerText = "Get Premium";
    }
  } catch (error) {
    console.log("Error:", error.message);
  }
}

// pagination start here
function setupPagination(totalPages, currentPage) {
  const paginationElement = document.getElementById("pagination");

  let limit = parseInt(localStorage.getItem("limit")) || 10;

  paginationElement.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const pageLink = document.createElement("button");
    pageLink.innerText = i;
    pageLink.style.padding = "0.5rem 1rem";
    if(i == currentPage){
      pageLink.style.backgroundColor = "#daf9f9";
    }
    pageLink.addEventListener("click", () => {
      itemsContainer.innerHTML = "";
      localStorage.setItem("currentPage", i);
      fetchExpenses(i, limit);
    });

    paginationElement.appendChild(pageLink);
  }
}


rowsPerPageDropdown.addEventListener("change", (e) => {
  handleLimitChange(e);
});

function handleLimitChange(e) {
  itemsContainer.innerHTML = "";
  limit = parseInt(e.target.value);
  localStorage.setItem("limit", limit);
  localStorage.setItem("currentPage", 1);
  fetchExpenses(1, limit);
}
// pagination end here

// function to display data on screen
function displayDataOnScreen(expenseData) {
  const itemsContainer = document.querySelector(".items");

  // Create a new item div
  const itemDiv = document.createElement("div");
  itemDiv.classList.add("item");

  // Create span for description
  const descriptionSpan = document.createElement("span");
  descriptionSpan.classList.add("item-description");
  descriptionSpan.textContent = expenseData.description;
  itemDiv.appendChild(descriptionSpan);

  // Create span for category
  const categorySpan = document.createElement("span");
  categorySpan.classList.add("item-category");
  categorySpan.textContent = expenseData.category;
  itemDiv.appendChild(categorySpan);

  // Create span for amount
  const amountSpan = document.createElement("span");
  amountSpan.classList.add("item-amount");
  amountSpan.textContent = `₹${parseFloat(expenseData.amount).toFixed(2)}`;
  itemDiv.appendChild(amountSpan);

  // Create and append Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  itemDiv.appendChild(deleteBtn);

  // Create and append Edit button
  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  itemDiv.appendChild(editBtn);

  // Append the itemDiv to the items container
  itemsContainer.appendChild(itemDiv);

  deleteBtn.addEventListener("click", (event) => {
    handleDelete(event, itemsContainer, expenseData);
  });

  editBtn.addEventListener("click", (event) => {
    openModal(expenseData, "Update");
    itemsContainer.removeChild(event.target.parentElement);
  });
}

// function to add/update total income
addIncomeBtn.addEventListener("click", addTotalIncome);
async function addTotalIncome() {
  const totalIncomeInput = document.querySelector("#total-income");
  const inputValue = totalIncomeInput.value;
  try {
    if (inputValue === "" || isNaN(inputValue)) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        text: "Please enter a valid amount",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

    // income with a patch request
    const response = await axios.patch(
      "http://localhost:3000/totalincome",
      { amount: inputValue },
      { headers: { Authorization: `${token}` } }
    );
    if (response.status === 200) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        text: "Total Income Updated",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  } catch (error) {
    console.log("Error:", error.message);
  }
}

// function to get total income and expense also update summary
async function getTotalIncome_Expense() {
  const totalIncomeInput = document.querySelector("#total-income");
  try {
    const response = await axios.get("http://localhost:3000/totals", {
      headers: { Authorization: `${token}` },
    });

    totalIncomeInput.value = response.data.totalIncome || 0;

    // update summary
    const date = document.querySelector(".date");
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const currDate = new Date();
    const savings = document.querySelector(".savings");
    const total = response.data.totalIncome - response.data.totalExpense;
    savings.innerText = `Savings: ₹ ${parseFloat(total).toFixed(2)}`;
    date.innerText = `${currDate.getDate()} ${
      monthNames[currDate.getMonth()]
    } , ${currDate.getFullYear()} - ${currDate.toLocaleString("default", {
      weekday: "long",
    })}`;

    // update total expense
    const totalexpense = document.querySelector(".total-expense");
    totalexpense.innerText = `₹ ${parseFloat(
      response.data.totalExpense
    ).toFixed(2)}`;
  } catch (error) {
    console.log("Error:", error.message);
  }
}

// Function to open and set up the modal for "Add" or "Update"
function openModal(expenseData, mode) {
  const modal = document.querySelector(".modal");
  const submitBtn = document.querySelector(".addExpenseBtn");

  if (mode === "Update") {
    document.getElementById("amount").value = expenseData.amount;
    document.getElementById("description").value = expenseData.description;
    document.getElementById("category").value = expenseData.category;
    submitBtn.innerText = "Update";

    submitBtn.onclick = (event) => {
      event.preventDefault();
      expenseData.amount = document.getElementById("amount").value;
      expenseData.description = document.getElementById("description").value;
      expenseData.category = document.getElementById("category").value;

      handleEdit(expenseData);
      closeModal(expenseData);
      displayDataOnScreen(expenseData);
    };
  } else {
    submitBtn.onclick = handleAddExpense;
  }
  modal.style.display = "block";
}

// Function to close and reset the modal
function closeModal() {
  const modal = document.querySelector(".modal");
  const submitBtn = document.querySelector(".addExpenseBtn");

  modal.style.display = "none";
  document.getElementById("amount").value = "";
  document.getElementById("description").value = "";
  document.getElementById("category").value = "";

  // Remove any existing event listeners on submitBtn
  submitBtn.onclick = null;
  submitBtn.innerText = "Add Expense";
}

// Close modal when clicking outside or on the close button
document.addEventListener("DOMContentLoaded", modal);
function modal() {
  const modal = document.querySelector(".modal");
  const btn = document.querySelector(".openModal");
  const span = document.querySelector(".close");

  btn.onclick = function () {
    // Open modal in Add mode
    openModal({}, "Add");
  };

  span.onclick = function () {
    closeModal();
  };

  window.onclick = function (event) {
    if (event.target === modal) {
      closeModal();
    }
  };
}

// Function to handle adding a new expense
function handleAddExpense(event) {
  event.preventDefault();
  const expenseData = {
    amount: document.getElementById("amount").value,
    description: document.getElementById("description").value,
    category: document.getElementById("category").value,
  };

  handleSaveExpense(expenseData);
  displayDataOnScreen(expenseData);
  closeModal();
}

async function handleDelete(event, unorderList, expenseData) {
  unorderList.removeChild(event.target.parentElement);
  deleteData(expenseData);
}

//axios post api
async function handleSaveExpense(expenseData) {
  try {
    await axios.post("http://localhost:3000/expense", expenseData, {
      headers: {
        Authorization: `${token}`,
      },
    });
  } catch (err) {
    console.log("Error:", err.message);
  }
}

// update api
async function handleEdit(expenseData) {
  console.log("inside edit api");
  try {
    await axios.patch(
      `http://localhost:3000/expense/${expenseData._id}`,
      {
        amount: expenseData.amount,
        description: expenseData.description,
        category: expenseData.category,
      },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
  } catch (error) {
    console.log("Error: ", error.message);
  }
}

// delete api
async function deleteData(expenseData) {
  try {
    await axios.delete(`http://localhost:3000/expense/${expenseData._id}`, {
      headers: {
        Authorization: `${token}`,
      },
    });
  } catch (error) {
    console.log("Error:", error.message);
  }
}
