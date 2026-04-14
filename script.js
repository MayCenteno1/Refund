// Seleciona os elementos do formulário
const form = document.querySelector("form");
const amount = document.getElementById("amount");
const expense = document.getElementById("expense");
const category = document.getElementById("category");

// Seleciona os elementos da lista.
const expenseList = document.querySelector("ul");
const expenseQuantity = document.querySelector("aside header p span");
const expenseTotal = document.querySelector("aside header h2");


// captura o evento de input para formartar o valor.
amount.oninput = () => {
  let value = amount.value.replace(/\D/g, "");
  value = Number(value) / 100;
  amount.value = formatCurrencyBRL(value);
};

function formatCurrencyBRL(value) {
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  return value;
}

// Captura o evento de submit do formulário
form.onsubmit = (event) => {
  event.preventDefault();

  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    creat_at: new Date(),
  };

  expenseAdd(newExpense);

  //limpa formulário e foca
  clearForm();
};

// Adiciona um novo item na lista.
function expenseAdd(newExpense) {
  try {
    const expenseItem = document.createElement("li");
    expenseItem.classList.add("expense");

    const expenseIcon = document.createElement("img");
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`);
    expenseIcon.setAttribute("alt", newExpense.category_name);

    const expenseInfo = document.createElement("div");
    expenseInfo.classList.add("expense-info");

    const expenseName = document.createElement("strong");
    expenseName.textContent = newExpense.expense;

    const expenseCategory = document.createElement("span");
    expenseCategory.textContent = newExpense.category_name;

    expenseInfo.append(expenseName, expenseCategory);

    const expenseAmount = document.createElement("span");
    expenseAmount.classList.add("expense-amount");
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}`;

    const removeIcon = document.createElement("img");
    removeIcon.classList.add("remove-icon");
    removeIcon.setAttribute("src", "img/remove.svg");
    removeIcon.setAttribute("alt", "remover");

    // evento de remover
    removeIcon.addEventListener("click", () => {
      removeExpense(expenseItem);
    });

    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon);

    expenseList.append(expenseItem);

    updateTotals();
  } catch (error) {
    alert("Ocorreu um erro ao adicionar a despesa: ");
    console.log(error);
  }
}

// função de remover
function removeExpense(item) {
  item.remove();
  updateTotals();
}

// Atualiza os totais.
function updateTotals() {
  try {
    const itens = expenseList.children;

    expenseQuantity.textContent = `${itens.length} ${
      itens.length > 1 ? "despesas" : "despesa"
    }`;

    let total = 0;

    for (let item = 0; item < itens.length; item++) {
      const itemAmount = itens[item].querySelector(".expense-amount");

      if (!itemAmount) continue;

      let value = itemAmount.textContent
        .replace(/[^\d,]/g, "")
        .replace(",", ".");

      value = parseFloat(value);

      if (isNaN(value)) continue;

      total += Number(value);
    }

    expenseTotal.innerHTML = `<small>R$</small>${total
      .toFixed(2)
      .replace(".", ",")}`;
  } catch (error) {
    console.log(error);
    alert("Não foi possível atualizar os totais.");
  }
}

// limpa os imputs do formulário e foca no primeiro campo.
function clearForm() {
  form.reset(); // limpa todos os campos corretamente

  amount.value = ""; // garante limpeza do campo formatado

  // coloca o foco no campo de despesa para facilitar a inserção de uma nova despesa.
  expense.focus();
}