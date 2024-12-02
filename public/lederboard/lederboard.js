async function fetchLeaderboard() {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      "http://localhost:3000/premium/lederboard",
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    const leaderboardData = response.data;

    const leaderboardTable = document.querySelector(".leaderboard-table");
    // loop through the leaderboard data and create table rows
    leaderboardData.forEach((user, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
      <td>${user.name}
        <td>${index + 1}
        <td>₹${parseFloat(user.totalExpense).toFixed(2)}
      `;
      leaderboardTable.appendChild(row);
    });
  } catch (error) {
    if (error.response.status === 401) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        text: "Please login first",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      window.location.href = "../login/login.html";
    }
    if (error.response.status === 402) {
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
  }
}

fetchLeaderboard();
