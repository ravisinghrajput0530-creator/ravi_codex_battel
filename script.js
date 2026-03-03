const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const list = document.getElementById("list");

const modal = document.getElementById("modal");
const openModal = document.getElementById("openModal");
const closeModal = document.getElementById("closeModal");

const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const search = document.getElementById("search");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let currentFilter = "all";

openModal.onclick = () => modal.classList.add("active");
closeModal.onclick = () => modal.classList.remove("active");
window.onclick = e => { if (e.target === modal) modal.classList.remove("active"); };

// Filter buttons with event delegation
document.addEventListener("click", function(e) {
  if (e.target.classList.contains("filter-tab")) {
    document.querySelectorAll(".filter-tab").forEach(b => b.classList.remove("active"));
    e.target.classList.add("active");
    currentFilter = e.target.dataset.filter;
    render();
  }
});

form.addEventListener("submit", function(e){
  e.preventDefault();

  const type = document.querySelector('input[name="type"]:checked').value;

  const category = document.getElementById("category").value;

  const transaction = {
    id: Date.now(),
    text: text.value,
    amount: +amount.value,
    type: type,
    category: category,
    date: new Date().toLocaleDateString()
  };

  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));

  form.reset();
  modal.classList.remove("active");
  init();
});

function removeTransaction(id){
  transactions = transactions.filter(t => t.id !== id);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  init();
}

function updateValues(){
  let income = 0;
  let expense = 0;

  transactions.forEach(t => {
    if(t.type === "income") income += t.amount;
    else expense += t.amount;
  });

  balanceEl.innerText = "$" + (income - expense).toFixed(2);
  incomeEl.innerText = "$" + income.toFixed(2);
  expenseEl.innerText = "$" + expense.toFixed(2);
}

function getCategoryIcon(category) {
  const icons = {
    salary: "💰",
    food: "🍔",
    shopping: "🛍️",
    entertainment: "🎬",
    utilities: "💡",
    other: "📌"
  };
  return icons[category] || "📌";
}

function render(){
  list.innerHTML = "";
  const query = search.value.toLowerCase();

  transactions
    .filter(t => {
      const matchesQuery = t.text.toLowerCase().includes(query);
      const matchesFilter = currentFilter === "all" || t.type === currentFilter;
      return matchesQuery && matchesFilter;
    })
    .forEach(t => {
      const li = document.createElement("li");
      const icon = getCategoryIcon(t.category);
      li.className = "transaction-item";
      li.innerHTML = `
        <div class="transaction-icon">${icon}</div>
        <div class="transaction-info">
          <div class="transaction-title">${t.text}</div>
          <div class="transaction-category">${t.category}</div>
          <div class="transaction-date">${t.date || new Date().toLocaleDateString()}</div>
        </div>
        <div class="transaction-amount ${t.type}">${t.type === "income" ? "+" : "-"}$${t.amount.toFixed(2)}</div>
        <button class="delete-btn" onclick="removeTransaction(${t.id})">🗑️</button>
      `;
      list.appendChild(li);
    });
}

search.addEventListener("input", render);

function init(){
  render();
  updateValues();
}

init();
