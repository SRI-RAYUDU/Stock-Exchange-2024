const searchForm = document.getElementById('searchForm');
const cardContainer = document.getElementById('cardContainer');
const coinTransition = document.getElementById('coinTransition');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const navbarLinks = document.querySelectorAll('.navbar .list li a');
const sections = document.querySelectorAll('section');
const homeLink = document.querySelector('.navbar .list li a[href="#home"]'); 


let currentPage = 1;
const cardsPerPage = 4;

let stockData = [];
let totalPages = 0;

prevBtn.style.display = 'none';
nextBtn.style.display = 'none';

searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const stock = e.target.querySelector('input[type="search"]').value;

  stockData = [];
  cardContainer.innerHTML = '';
  prevBtn.style.display = 'none';
  nextBtn.style.display = 'none';

  const url = `https://real-time-finance-data.p.rapidapi.com/search?query=${stock}&language=en`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '41fac22fb2msh8cdb62af4cf27fap1cf2e6jsna505088b2a24',
        'X-RapidAPI-Host': 'real-time-finance-data.p.rapidapi.com',
      },
    });

    if (!response.ok) {
      throw new Error('Error fetching data');
    }

    const data = await response.json();
    if (data.data && data.data.stock && data.data.stock.length > 0) {
      stockData = data.data.stock;
      totalPages = Math.ceil(stockData.length / cardsPerPage);
      currentPage = 1;
      displayStockData();
      hideOtherElements();
    } else {
      cardContainer.innerHTML = '<p>No stock data available.</p>';
      showOtherElements();
    }
  } catch (error) {
    console.error(error);
  }
});

function displayStockData() {
  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const currentStocks = stockData.slice(startIndex, endIndex);

  cardContainer.innerHTML = '';
  currentStocks.forEach((stock) => {
    const card = createCard(stock);
    cardContainer.appendChild(card);
  });

  prevBtn.style.display = currentPage === 1 ? 'none' : 'inline-block';
  nextBtn.style.display = currentPage === totalPages ? 'none' : 'inline-block';
}

prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    displayStockData();
  }
});

nextBtn.addEventListener('click', () => {
  if (currentPage < totalPages) {
    currentPage++;
    displayStockData();
  }
});

function createCard(stock) {
  const card = document.createElement('div');
  card.classList.add('card');

  card.innerHTML = `
    <h5><u>${stock.symbol}</u></h5>
    <p><b>Name:</b> ${stock.name}</p>
    <p><b>Price:</b> <span class="price">${stock.price}</span></p>
    <p><b>Change:</b> <span class="change">${stock.change}</span></p>
    <p><b>Change %:</b> <span class="change-percent">${stock.change_percent}</span></p>
    <p><b>Country Code:</b> <span class="country-code">${stock.country_code}</span></p>
    <p><b>Exchange:</b> <span class="exchange">${stock.exchange}</span></p>
    <p><b>Exchange Open:</b> <span class="exchange-open">${stock.exchange_open}</span></p>
    <p><b>Exchange Close:</b> <span class="exchange-close">${stock.exchange_close}</span></p>
  `;

  return card;
}


homeLink.addEventListener('click', (e) => {
  e.preventDefault(); 
  window.scrollTo({ top: 0, behavior: 'smooth' });

  document.querySelector('input[type="search"]').value = ''; 
  cardContainer.innerHTML = ''; 
  
  showOtherElements(); 
});


function hideOtherElements() {
  sections.forEach((section) => (section.style.display = 'none'));
  coinTransition.style.display = 'none';
}

function showOtherElements() {
  sections.forEach((section) => (section.style.display = 'block'));
  coinTransition.style.display = 'block';
}

