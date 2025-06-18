// === Percentage of fossil fuel and renewables  ===
async function fetchpercentageBreakdown() {
  try {
    const response = await fetch('https://api.electricitymap.org/v3/power-breakdown/latest?zone=GB', {
      method: 'GET',
      headers: {'auth-token': 'HWKZzlqZPsZzwmUcu5mz'}
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    const list = document.getElementById('renewable-fossil-breakdown');
    list.innerHTML = '';

    // === appending breakdown data into list ===

    ['fossilFreePercentage', 'renewablePercentage'].forEach(key => {
        const li = document.createElement('li');
        li.textContent = `${key}: ${data[key] ?? 'N/A'}`;
        list.appendChild(li);
      });

  } catch (error) {
    console.error('Error fetching power breakdown:', error);
    document.getElementById('renewable-fossil-breakdown').textContent = 'Failed to load data.';
  }
}

// === Fetch Power Breakdown (Latest) ===
async function fetchlatestPBDataset() {
  try {
    const response = await fetch('https://api.electricitymap.org/v3/power-breakdown/latest?zone=GB', {
      method: 'GET',
      headers: {'auth-token': 'HWKZzlqZPsZzwmUcu5mz'}
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    const list = document.getElementById('power-breakdown');
    list.innerHTML = '';

    // === appending breakdown data into list ===

    const breakdown = data['powerConsumptionBreakdown'];
    ['nuclear', 'geothermal', 'coal',  'biomass', 'battery discharge', 'gas', 'hydro discharge', 'solar', 'wind', 'unknown'].forEach(key => {
      const li = document.createElement('li');
      li.textContent = `${key}: ${breakdown[key] ?? 'N/A'}`;
      list.appendChild(li);
    });

    // === appending total power consumption at present ===
    [ 'powerConsumptionTotal'].forEach(key => {
        const li = document.createElement('li');
        li.textContent = `${key}: ${data[key] ?? 'N/A'}`;
        list.appendChild(li);
      });

  } catch (error) {
    console.error('Error fetching power breakdown:', error);
    document.getElementById('power-breakdown').textContent = 'Failed to load data.';
  }
}

// === Fetch Carbon Intensity (History) ===
async function fetchOldDatasets(dataPoints, chart) {
  try {
    const response = await fetch('https://api.electricitymap.org/v3/carbon-intensity/history?zone=GB', {
      method: 'GET',
      headers: {'auth-token': 'HWKZzlqZPsZzwmUcu5mz'}
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    data['history'].forEach(history => {
      dataPoints.push({ x: new Date(history['datetime']), y: history['carbonIntensity'] });
    });
    chart.render();
  } catch (error) {
    console.error('Error fetching historical data:', error);
  }
}

// === CanvasJS Chart: Carbon Intensity ===
/**
 * This function .... explain here
 */
function initCanvasChart() {
  const dataPoints = [];
  const chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    theme: "light2",
    title: { text: "Carbon Intensity" },
    axisY: { title: "gCO2eq/kWh", titleFontSize: 24, includeZero: true },
    axisX: {
        valueFormatString: "DD MMM YYYY HH:mm",
        labelAngle: -45
    },
    data: [{ 
        type: "line",
        xValueFormatString: "DD MMM YYYY HH:mm",
        yValueFormatString: "#,### gCO2eq/kWh",
        toolTipContent: "{x} <br><strong>{y}</strong>",
        dataPoints }]
  });
  fetchOldDatasets(dataPoints, chart);
}

/**
 * This function fetches for update time in footer
 */
async function fetchupdateTime() {
    try {
      const response = await fetch('https://api.electricitymap.org/v3/power-breakdown/latest?zone=GB', {
        method: 'GET',
        headers: {'auth-token': 'HWKZzlqZPsZzwmUcu5mz'}
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      const list = document.getElementById('last-update-time');
      list.innerHTML = '';
  
      // === appending breakdown data into list ===
  
      ['updatedAt'].forEach(key => {
          const li = document.createElement('li');
          li.textContent = `${data[key] ?? 'N/A'}`;
          list.appendChild(li);
        });
  
    } catch (error) {
      console.error('Error fetching update time:', error);
      document.getElementById('last-update-time').textContent = 'Failed to load data.';
    }
  }

  const flashcards = [
    { question: "What is Carbon Intensity?", answer: "HyperText Markup Language" },
    { question: "What is Net Zero 2050?", answer: "To style HTML content" },
    { question: "Job Creation", answer: "1 in 25 jobs supported across the UK (1.48m)" },
    { question: "Reduced Emissions?", answer: "82% reduction in carbon emissions from the power sector since 1990" },
    { question: "Longevity", answer: "£100bn has been planned for investment in new energy sources over the next decade" },
    { question: "The UK are leaders", answer: "" },
    { question: "What does API stand for?", answer: "Application Programming Interface" },
    { question: "What is a boolean?", answer: "True or false value" },
    { question: "What is NaN?", answer: "'Not-a-Number'" },
    { question: "What is 'null'?", answer: "An intentional absence of any value" },
  ];
  
  const container = document.getElementById("flashcard-container");
  
  flashcards.forEach((cardData) => {
    const card = document.createElement("div");
    card.classList.add("card");
  
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">${cardData.question}</div>
        <div class="card-back">${cardData.answer}</div>
      </div>
    `;
  
    card.addEventListener("click", () => {
      card.classList.toggle("flipped");
    });
  
    container.appendChild(card);
  });
  

// === Page Load ===
window.onload = function () {
  fetchlatestPBDataset();
  initCanvasChart();
  fetchpercentageBreakdown();
  fetchupdateTime();
};

