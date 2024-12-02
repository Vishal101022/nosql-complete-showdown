const email = document.getElementById("email");
const forgot = document.getElementById("forgotBtn");

forgot.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    const result = await axios.post(
      "http://localhost:3000/password/forgotpassword",
      {
        email: email.value,
      }
    );

    if (result.status === 200) {
      email.value = "";
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        text: `${result.data}`,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  } catch (error) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "error",
      text: `${error.response.data}`,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  }
});

window.addEventListener("DOMContentLoaded", (e) => {});
