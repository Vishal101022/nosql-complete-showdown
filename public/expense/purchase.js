const premiumBTN = document.querySelector(".premiumBtn");
premiumBTN.addEventListener("click", premium);

async function premium() {
  const token = localStorage.getItem("token");

  if (!token) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "error",
      text: "Please login first",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
    return;
  }

  try {
    const response = await axios.post(
      "http://localhost:3000/create-order",
      { amount: 100, currency: "INR" },
      { headers: { Authorization: `${token}` } }
    );

    const order = response.data;
    const options = {
      key: "rzp_test_hdTZLutC1icOMZ",
      amount: order.amount,
      currency: order.currency,
      name: "Expense Tracker",
      description: "Test Transaction",
      order_id: order.id,
      prefill: {
        name: "Your Name",
        email: "your.email@example.com",
        contact: "9999999999",
      },
      theme: { color: "#F37254" },

      handler: async function (response) {
        console.log("response", response);
        try {
          const verifyResponse = await axios.post(
            "http://localhost:3000/verify-payment",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
            { headers: { Authorization: `${token}` } }
          );

          if (verifyResponse.data.status === "ok") {
            window.location.href = "../expense/expense.html";
          } else {
            Swal.fire({
              toast: true,
              position: "top-end",
              icon: "error",
              text: "Payment verification failed",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
          }
        } catch (error) {
          console.error("Verification Error:", error);
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "error",
            text: "Payment verification failed",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        }
      },
    };

    const rzp = new Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error("Error:", error);
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "error",
      text: "Something went wrong",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  }
}
