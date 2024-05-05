const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

var districtsByZone = {
  0: ["Please select a zone first!"],
  1: ["Barguna", "Barisal", "Bhola", "Jhalokati", "Patuakhali", "Pirojpur"],
  2: ["Pabna", "Sirajganj", "Bogra", "Joypurhat"],
  3: ["Cox's Bazar", "Chittagong", "Feni", "Noakhali", "Lakshmipur"],
  4: ["Cumilla", "Chandpur", "Brahmanbaria"],
  5: ["Dhaka","Narayanganj","Gazipur","Narsingdi","Munshiganj","Manikganj","Tangail"],
  6: ["Dinajpur", "Thakurgaon", "Panchagarh"],
  7: ["Faridpur", "Madaripur", "Gopalganj", "Shariatpur", "Rajbari"],
  8: ["Chuadanga", "Meherpur", "Jashore", "Jhenaidah", "Magura", "Kushtia"],
  9: ["Mymensingh", "Netrokona", "Jamalpur", "Sherpur", "Kishoreganj"],
  10: ["Rajshahi", "Chapai Nawabganj", "Natore", "Naogaon"],
  11: ["Rangamati", "Khagrachhari", "Bandarban"],
  12: ["Sylhet", "Moulvibazar", "Habiganj", "Sunamganj"],
  13: ["Rangpur", "Kurigram", "Gaibandha", "Lalmonirhat", "Nilphamari"],
  14: ["Khulna", "Narail", "Satkhira", "Bagerhat"],
};

function updateDistricts() {
  var zoneSelect = document.getElementById("zoneSelect");
  var districtSelect = document.getElementById("districtSelect");
  var selectedZone = zoneSelect.value;

  districtSelect.innerHTML = "";

  if (selectedZone != "") {
    var districts = districtsByZone[selectedZone];
    for (var i = 0; i < districts.length; i++) {
      var option = new Option(districts[i], districts[i]);
      districtSelect.options.add(option);
    }
  }
}

if (sign_in_btn && sign_up_btn) {
  sign_up_btn.addEventListener("click", () => {
    container.classList.add("sign-up-mode");
  });

  sign_in_btn.addEventListener("click", () => {
    container.classList.remove("sign-up-mode");
  });
}

function show(list) {
  var modal = document.getElementById("myModal");
  var span = document.getElementsByClassName("close")[0];
  var modalText = document.getElementById("modal-text");
  var modalContent = document.getElementsByClassName("modal-content")[0];

  var text = "";
  for (let i = 0; i < list.length; i++) {
    if (list.length - 1 != i) {
      text += list[i] + ", ";
    } else {
      text += list[i];
    }
  }

  modalText.innerHTML = text + " will be the best!";

  modal.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
  modal.style.zIndex = "99";
  modalContent.style.transform = "scale(1)";

  span.onclick = function () {
    modal.style.backgroundColor = "rgba(0, 0, 0, 0)";
    modal.style.zIndex = "-99";
    modalContent.style.transform = "scale(0)";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.backgroundColor = "rgba(0, 0, 0, 0)";
      modal.style.zIndex = "-99";
      modalContent.style.transform = "scale(0)";
    }
  };
}

function showModal(text) {
  var modal = document.getElementById("myModal");
  var span = document.getElementsByClassName("close")[0];
  var modalText = document.getElementById("modal-text");
  var modalContent = document.getElementsByClassName("modal-content")[0];

  modalText.innerHTML = text;

  modal.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
  modal.style.zIndex = "99";
  modalContent.style.transform = "scale(1)";

  span.onclick = function () {
    modal.style.backgroundColor = "rgba(0, 0, 0, 0)";
    modal.style.zIndex = "-99";
    modalContent.style.transform = "scale(0)";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.backgroundColor = "rgba(0, 0, 0, 0)";
      modal.style.zIndex = "-99";
      modalContent.style.transform = "scale(0)";
    }
  };
}

function handleFormSubmit(event) {
  event.preventDefault();

  var zoneSelect = document.getElementById("zoneSelect");
  var districtSelect = document.getElementById("districtSelect");

  if (zoneSelect.value === "0") {
    showModal(["Please enter zone"]);
    return;
  }

  var selectedZone = zoneSelect.selectedIndex;
  var selectedDistrict =
    districtSelect.options[districtSelect.selectedIndex].text;

  if (selectedDistrict == "Borguna") {
    selectedDistrict = "Patuakhali";
  } else if (selectedDistrict == "Noakhali") {
    selectedDistrict = "Lakshmipur";
  } else if (selectedDistrict == "Rangamati") {
    selectedDistrict = "Khagrachhari";
  } else if (selectedDistrict == "Sunamganj") {
    selectedDistrict = "Sylhet";
  } else if (selectedDistrict == "Nator") {
    selectedDistrict = "Rajshahi";
  } else if (selectedDistrict == "Chuadanga") {
    selectedDistrict = "Jhenaidah";
  } else if (selectedDistrict == "Meherpur") {
    selectedDistrict = "Kushtia";
  } else if (selectedDistrict == "Magura") {
    selectedDistrict = "Jhenaidah";
  } else if (selectedDistrict == "Bagerhat") {
    selectedDistrict = "Khulna";
  }

  var dataToSend = {
    zone: selectedZone,
    district: selectedDistrict,
  };

  var i = 0;
  var intervalID = setInterval(() => {
    document.getElementById("btn1").value = "Loading - " + ++i + "s";
  }, 1000);

  fetch("https://agriqo-server.onrender.com/cropRecomAI", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataToSend),
  })
    .then(response => response.text())
    .then(receivedString => {
      if (receivedString[0] == "[") {
        show(JSON.parse(receivedString));
      } else {
        if (receivedString == "]") {
          showModal("Oops! We're having trouble finding a suitable crop match for your location right now. Try again later.");
        }
        else{
          showModal(receivedString);
        }
      }
      clearInterval(intervalID);
      document.getElementById("btn1").value = "Get Crop (AI)";
    })
    .catch(error => {
      showModal(error);
      clearInterval(intervalID);
      document.getElementById("btn1").value = "Get Crop (AI)";
    });
}

function handleEnvironmentalFormSubmit(event) {
  event.preventDefault();

  var rainfall = document.getElementById("rainfall").value;
  var temperature = document.getElementById("temperature").value;
  var humidity = document.getElementById("humidity").value;
  var sunshine = document.getElementById("sunshine").value;
  var windDirection = document.getElementById("windDirection").value;
  var windVelocity = document.getElementById("windVelocity").value;

  var zoneSelect = document.getElementById("zoneSelect");
  var districtSelect = document.getElementById("districtSelect");

  if (zoneSelect.value === "0") {
    showModal("Please enter zone");
    document.getElementById("sign-in-btn").click();
    return;
  } else if (
    rainfall == "" ||
    temperature == "" ||
    humidity == "" ||
    windDirection == "" ||
    windVelocity == "" ||
    sunshine == ""
  ) {
    showModal("Please enter all fields");
    return;
  }
  var selectedZone = zoneSelect.selectedIndex;
  var selectedDistrict =
    districtSelect.options[districtSelect.selectedIndex].text;

  if (selectedDistrict == "Borguna") {
    selectedDistrict = "Patuakhali";
  } else if (selectedDistrict == "Noakhali") {
    selectedDistrict = "Lakshmipur";
  } else if (selectedDistrict == "Rangamati") {
    selectedDistrict = "Khagrachhari";
  } else if (selectedDistrict == "Sunamganj") {
    selectedDistrict = "Sylhet";
  } else if (selectedDistrict == "Nator") {
    selectedDistrict = "Rajshahi";
  } else if (selectedDistrict == "Chuadanga") {
    selectedDistrict = "Jhenaidah";
  } else if (selectedDistrict == "Meherpur") {
    selectedDistrict = "Kushtia";
  } else if (selectedDistrict == "Magura") {
    selectedDistrict = "Jhenaidah";
  } else if (selectedDistrict == "Bagerhat") {
    selectedDistrict = "Khulna";
  }

  var dataToSend = {
    zone: selectedZone,
    district: selectedDistrict,
    rainfall: rainfall,
    temperature: temperature,
    humidity: humidity,
    windDirection: windDirection,
    windVelocity: windVelocity,
    sunshine: sunshine,
  };

  var i = 0;
  var intervalID = setInterval(() => {
    document.getElementById("btn2").value = "Loading - " + ++i + "s";
  }, 1000);

  fetch("https://agriqo-server.onrender.com/cropRecomCustom", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataToSend),
  })
    .then(response => response.text())
    .then(receivedString => {
      if (receivedString[0] == "[") {
        show(JSON.parse(receivedString));
      } else {
        showModal(receivedString);
      }
      clearInterval(intervalID);
      document.getElementById("btn2").value = "Get Crop";
    })
    .catch(error => {
      showModal(error);
      clearInterval(intervalID);
      document.getElementById("btn2").value = "Get Crop";
    });
}

function handleFormSubmit2(event) {
  event.preventDefault();

  var zoneSelect = document.getElementById("zoneSelect");
  var cropSelect = document.getElementById("cropSelect");

  if (zoneSelect.value === "0") {
    showModal("Please enter zone");
    return;
  } else if (cropSelect.value === "-1") {
    showModal("Please enter crop name");
    return;
  }

  var selectedZone = zoneSelect.selectedIndex;
  var crop = cropSelect.selectedIndex;

  var dataToSend = {
    zone: selectedZone,
    crop: crop,
  };

  var i = 0;
  var intervalID = setInterval(() => {
    document.getElementById("btn1").value = "Loading - " + ++i + "s";
  }, 1000);

  fetch("https://agriqo-server.onrender.com/timeRecomAI", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataToSend),
  })
    .then(response => response.text())
    .then(receivedString => {
      showModal(receivedString);
      clearInterval(intervalID);
      document.getElementById("btn1").value = "Get Crop";
    })
    .catch(error => {
      showModal(error);
      clearInterval(intervalID);
      document.getElementById("btn1").value = "Get Crop";
    });
}

function handleFormSubmit3(event) {
  event.preventDefault();

  var crop = document.getElementById("crop").value;

  if (crop === "") {
    showModal("Please enter crop name");
    return;
  }

  var dataToSend = {
    crop: crop,
  };

  fetch("https://agriqo-server.onrender.com/#", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataToSend),
  })
    .then(response => response.text())
    .then(receivedString => {
      showModal(receivedString);
    })
    .catch(error => {
      showModal(error);
    });
}

function handleFormSubmit4(event) {
  event.preventDefault();

  var zoneSelect = document.getElementById("zoneSelect");
  var crop = document.getElementById("crop").value;

  if (crop === "") {
    showModal("Please enter crop name");
    return;
  } else if (zoneSelect.value === "0") {
    showModal("Please enter Disease");
    return;
  }

  var selectedZone = zoneSelect.options[zoneSelect.selectedIndex].text;

  var dataToSend = {
    disease: selectedZone,
    crop: crop,
  };

  fetch("https://agriqo-server.onrender.com/#", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataToSend),
  })
    .then(response => response.text())
    .then(receivedString => {
      showModal(receivedString);
    })
    .catch(error => {
      showModal(error);
    });
}
