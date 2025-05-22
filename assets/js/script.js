

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

    const breakdown = data['powerConsumptionBreakdown'];
    ['nuclear', 'geothermal', 'coal',  'biomass', 'battery discharge', 'gas', 'hydro discharge', 'solar', 'wind', 'unknown'].forEach(key => {
      const li = document.createElement('li');
      li.textContent = `${key}: ${breakdown[key] ?? 'N/A'}`;
      list.appendChild(li);
    });

    ['zone', 'powerConsumptionTotal', 'powerProductionTotal', 'datetime', 'updatedAt', 'fossilFreePercentage', 'renewablePercentage', 'powerImportTotal', 'powerExportTotal'].forEach(key => {
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
    const list = document.getElementById('dataset-old');
    list.innerHTML = '';
    data['history'].forEach(history => {
      const li = document.createElement('li');
      li.textContent = `${history['datetime']}: ${history['carbonIntensity'] ?? 'N/A'}`;
      list.appendChild(li);
      dataPoints.push({ x: new Date(history['datetime']), y: history['carbonIntensity'] });
    });
    chart.render();
  } catch (error) {
    console.error('Error fetching historical data:', error);
    document.getElementById('dataset-old').textContent = 'Failed to load data.';
  }
}

// === CanvasJS Chart: Carbon Intensity ===
function initCanvasChart() {
  const dataPoints = [];
  const chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    theme: "light2",
    title: { text: "Carbon Intensity" },
    axisY: { title: "Units", titleFontSize: 24, includeZero: true },
    data: [{ type: "line", yValueFormatString: "#,### Units", dataPoints }]
  });
  fetchOldDatasets(dataPoints, chart);
}



// === Page Load ===
window.onload = function () {
  fetchlatestPBDataset();
  initCanvasChart();
  plotBarGraph();
  plotUKMap();
};
