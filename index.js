const amountInput = document.getElementById('amountInput');
const currencySelect = document.getElementById('currencySelect');
const resultOutput = document.getElementById('resultOutput');

async function getExchangeRate(currency) {
	const url = `https://api.nbp.pl/api/exchangerates/rates/a/${currency}/?format=json`;
	try {
		const loader = createLoader();
		document.body.appendChild(loader);

		const response = await fetch(url);
		const data = await response.json();

		return data.rates[0].mid;
	} catch (error) {
		console.error(`Nie udało się pobrać kursu waluty. Błąd: ${error}`);
	} finally {
		if (loader) {
			document.body.removeChild(loader);
		}
	}
}

async function convertToPLN(amount, currency) {
	try {
		if (amount <= 0) {
			throw new Error('Amount must be a positive number.');
		}

		const exchangeRate = await getExchangeRate(currency);
		if (exchangeRate) {
			const result = amount * exchangeRate;
			return result.toFixed(2);
		} else {
			throw new Error('Error during currency conversion.');
		}
	} catch (error) {
		console.error(error);
	}
}

function createLoader() {
	const loader = document.createElement('div');
	loader.classList.add('loader');
	return loader;
}

const convertButton = document.getElementById('convertButton');
convertButton.addEventListener('click', async () => {
	const amount = amountInput.value;
	const currency = currencySelect.value;

	if (amount === '' || parseFloat(amount) === 0) {
		resultOutput.textContent = 'Invalid amount.';
		return;
	}

	try {
		const result = await convertToPLN(parseFloat(amount), currency);
		resultOutput.textContent = `Result: ${result} PLN`;
	} catch (error) {
		console.error(error);
	}
});
