document.querySelectorAll(".button").forEach((item) => {
  item.addEventListener("click", (event) => {
    const buttonId = event.target.id;
    let input = document.getElementById("password");
    switch (buttonId) {
      case "1":
        input.value = addDigit(input.value, "1");
        break;
      case "2":
        input.value = addDigit(input.value, "2");
        break;
      case "3":
        input.value = addDigit(input.value, "3");
        break;
      case "4":
        input.value = addDigit(input.value, "4");
        break;
      case "5":
        input.value = addDigit(input.value, "5");
        break;
      case "6":
        input.value = addDigit(input.value, "6");
        break;
      case "7":
        input.value = addDigit(input.value, "7");
        break;
      case "8":
        input.value = addDigit(input.value, "8");
        break;
      case "9":
        input.value = addDigit(input.value, "9");
        break;
      case "0":
        input.value = addDigit(input.value, "0");
        break;
      case "clear":
        input.value = removeDigit(input.value);
        break;
      case "enter":
        checkCode(input.value);
        input.value = "";
        break;
      case "open":
      case "close":
        const jwt = localStorage.getItem("jwt");
        if (jwt) {
          toggleDoor(jwt);
        } else {
          toggleKeypad();
        }
        break;
      default:
        throw error;
    }
  });
});

const toggleKeypad = () => {
  document.querySelector("#code").classList.toggle("hidden");
  document.querySelector("#control").classList.toggle("hidden");
};

const setStatus = (showOpen) => {
  if (showOpen) {
    document.querySelector("#open").classList.remove("hidden");
    document.querySelector("#close").classList.add("hidden");
  } else {
    document.querySelector("#open").classList.add("hidden");
    document.querySelector("#close").classList.remove("hidden");
  }
};

if (localStorage.getItem("jwt")) {
  toggleKeypad();
}

const addDigit = (currentPassword, digit) => {
  if (currentPassword.length >= 4) {
    return currentPassword;
  } else {
    return currentPassword + digit;
  }
};

const removeDigit = (currentPassword) => {
  if (currentPassword.length === 0) {
    return currentPassword;
  } else {
    return currentPassword.substring(0, currentPassword.length - 1);
  }
};

const checkCode = async (password) => {
  const response = await fetch("/api/code", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ password: password, email: "garage@birdhouse.com" }),
  });
  if (!response.ok) {
    document.querySelector(".error").innerHTML = "Error";
    return;
  }
  const jwt = await response.json();
  localStorage.setItem("jwt", JSON.stringify(jwt));
  toggleKeypad();
  await checkStatus(JSON.stringify(jwt));
};

const toggleDoor = async (jwt) => {
  try {
    const response = await fetch("/api/toggle", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: jwt,
    });
    if (!response.ok) {
      toggleKeypad();
      document.querySelector(".error").innerHTML = "Error";
      return;
    }
    document.querySelector(".error").innerHTML = JSON.stringify(
      await response.json()
    );
  } catch (error) {
    document.querySelector(".error").innerHTML = error.message;
  }
  await checkStatus(jwt);
};

const checkStatus = async (jwt) => {
  const response = await fetch("/api/status", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: jwt,
  });
  if (!response.ok) {
    document.querySelector(".error").innerHTML = "Error";
    return;
  }
  const doorStatus = JSON.stringify(await response.json());
  if (doorStatus.status === "open") {
    setStatus(true);
  } else {
    setStatus(false);
  }
};
