let nameInput = document.getElementById("name");
let heightInput = document.getElementById("height");
let weightInput = document.getElementById("weight");
let calculateBtn = document.getElementById("calculateBtn");
let resetBtn = document.getElementById("resetBtn");
let resultDiv = document.getElementById("result");
let historyList = document.getElementById("history");


calculateBtn.addEventListener("click", function () {

    let name = nameInput.value.trim();
    let height = heightInput.value.trim();
    let weight = weightInput.value.trim();


    if (name === "" || height === "" || weight === "") {
        alert("Please fill all fields");
        return;
    }

    if (height <= 0 || weight <= 0) {
        alert("Enter valid positive numbers");
        return;
    }

    let heightInMeter = height / 100;
    let bmi = weight / (heightInMeter * heightInMeter);
    bmi = bmi.toFixed(2);

    let category = "";
    let colorClass = "";

    if (bmi < 18.5) {
        category = "Underweight";
        colorClass = "underweight";
    } 
    else if (bmi < 25) {
        category = "Normal Weight";
        colorClass = "normal";
    } 
    else if (bmi < 30) {
        category = "Overweight";
        colorClass = "overweight";
    } 
    else {
        category = "Obese";
        colorClass = "obese";
    }

    resultDiv.innerHTML = `
        ${name}, your BMI is ${bmi} <br>
        Category: ${category}
    `;

    resultDiv.className = colorClass;

    let data = {
        name: name,
        bmi: bmi,
        category: category
    };

    let oldData = JSON.parse(localStorage.getItem("bmiHistory")) || [];

    oldData.push(data);

    localStorage.setItem("bmiHistory", JSON.stringify(oldData));

    showHistory();
});

resetBtn.addEventListener("click", function () {

    nameInput.value = "";
    heightInput.value = "";
    weightInput.value = "";

    resultDiv.innerHTML = "";
    resultDiv.className = "";
});

function showHistory() {

    historyList.innerHTML = "";

    let stored = JSON.parse(localStorage.getItem("bmiHistory")) || [];

    stored.forEach(function(item) {

        let li = document.createElement("li");

        li.textContent = item.name + " - BMI: " + item.bmi + " (" + item.category + ")";

        historyList.appendChild(li);
    });
}

showHistory();
