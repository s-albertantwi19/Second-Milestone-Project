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
    //const list = document.getElementById('dataset-old');
    //list.innerHTML = '';
    data['history'].forEach(history => {
      dataPoints.push({ x: new Date(history['datetime']), y: history['carbonIntensity'] });
    });
    chart.render();
  } catch (error) {
    console.error('Error fetching historical data:', error);
    //document.getElementById('dataset-old').textContent = 'Failed to load data.';
  }
}

// === CanvasJS Chart: Carbon Intensity ===
function initCanvasChart() {
  const dataPoints = [];
  const chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    theme: "light2",
    title: { text: "Carbon Intensity" },
    axisY: { title: "gCO2eq/kWh", titleFontSize: 24, includeZero: true },
    data: [{ type: "line", yValueFormatString: "#,### Units", dataPoints }]
  });
  fetchOldDatasets(dataPoints, chart);
}

// === fetch for update time in footer ===

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
          li.textContent = `${key}: ${data[key] ?? 'N/A'}`;
          list.appendChild(li);
        });
  
    } catch (error) {
      console.error('Error fetching update time:', error);
      document.getElementById('last-update-time').textContent = 'Failed to load data.';
    }
  }





// === Page Load ===
window.onload = function () {
  fetchlatestPBDataset();
  initCanvasChart();
  fetchpercentageBreakdown();
  fetchupdateTime();
};


