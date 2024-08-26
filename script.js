// Query selectors for form elements
const dropList = document.querySelectorAll("form select"),
      fromCurrency = document.querySelector(".from select"),
      toCurrency = document.querySelector(".to select"),
      getButton = document.querySelector("form button");

// Populate drop-down lists with currency codes and set defaults
for (let i = 0; i < dropList.length; i++) {
    for (let currency_code in country_list) {
        // Set default selection
        let selected = i == 0 ? (currency_code == "USD" ? "selected" : "") : (currency_code == "NPR" ? "selected" : "");
        let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
        dropList[i].insertAdjacentHTML("beforeend", optionTag);
    }
    dropList[i].addEventListener("change", e => loadFlag(e.target)); // Load flag on currency change
}

// Function to update flag images
function loadFlag(element) {
    for (let code in country_list) {
        if (code == element.value) {
            let imgTag = element.parentElement.querySelector("img");
            imgTag.src = `https://flagcdn.com/48x36/${country_list[code].toLowerCase()}.png`;
        }
    }
}

// Load exchange rate on page load
window.addEventListener("load", getExchangeRate);

// Handle button click for fetching exchange rates
getButton.addEventListener("click", e => {
    e.preventDefault(); // Prevent form submission
    getExchangeRate();
});

// Swap currencies
const exchangeIcon = document.querySelector("form .icon");
exchangeIcon.addEventListener("click", () => {
    let tempCode = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = tempCode;
    loadFlag(fromCurrency);
    loadFlag(toCurrency);
    getExchangeRate();
});

// Function to fetch and display exchange rates
function getExchangeRate() {
    const amount = document.querySelector("form input");
    const exchangeRateTxt = document.querySelector("form .exchange-rate");
    let amountVal = amount.value;
    
    // Default amount if empty or zero
    if (amountVal == "" || amountVal == "0") {
        amount.value = "1";
        amountVal = 1;
    }
    
    exchangeRateTxt.innerText = "Getting exchange rate...";
    let url = `https://api.exchangerate-api.com/v4/latest/${fromCurrency.value}`; // Example API URL; replace with actual URL
    
    fetch(url)
        .then(response => response.json())
        .then(result => {
            let exchangeRate = result.rates[toCurrency.value];
            let totalExRate = (amountVal * exchangeRate).toFixed(2);
            exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExRate} ${toCurrency.value}`;
        })
        .catch(error => {
            console.error("Error fetching exchange rate:", error);
            exchangeRateTxt.innerText = "Something went wrong";
        });
}
