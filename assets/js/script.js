// === Fetch Carbon Intensity (Latest) ===
async function fetchlatestCIDataset() {
  try {
    const response = await fetch('https://api.electricitymap.org/v3/carbon-intensity/latest?zone=GB', {
      method: 'GET',
      headers: {'auth-token': 'HWKZzlqZPsZzwmUcu5mz'}
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();

    const list = document.getElementById('dataset-list');
    list.innerHTML = '';
    ['zone', 'carbonIntensity', 'datetime', 'updatedAt'].forEach(key => {
      const li = document.createElement('li');
      li.textContent = `${key}: ${data[key] ?? 'N/A'}`;
      list.appendChild(li);
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    document.getElementById('dataset-list').textContent = 'Failed to load data.';
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

    const breakdown = data['powerConsumptionBreakdown'];
    ['nuclear', 'geothermal', 'coal'].forEach(key => {
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
    data: [{ type: "column", yValueFormatString: "#,### Units", dataPoints }]
  });
  fetchOldDatasets(dataPoints, chart);
}

// === Plotly: Horizontal Bar Graph ===
function plotBarGraph() {
  const xArray = [55, 49, 44, 24, 15];
  const yArray = ["Italy", "France", "Spain", "USA", "Argentina"];
  Plotly.newPlot("tester", [{
    x: xArray,
    y: yArray,
    type: "bar",
    orientation: "h",
    marker: { color: "rgba(255,0,0,0.6)" }
  }], { title: "World Wide Wine Production" });
}

// === Plotly: Density Map of the UK ===
function plotUKMap() {
  const data = [{
    type: "densitymapbox",
    lon: [-0.1, -2.2, -3.0],
    lat: [51.5, 53.5, 55.0],
    z: [1, 3, 2],
    radius: 20,
    colorbar: { y: 1, yanchor: 'top', len: 0.45 }
  }];

  const layout = {
    mapbox: {
      style: "carto-positron",
      center: { lat: 54.0, lon: -2.5 },
      zoom: 5
    },
    width: 700,
    height: 500
  };

  Plotly.newPlot('myDiv', data, layout);
}

// === Page Load ===
window.onload = function () {
  fetchlatestCIDataset();
  fetchlatestPBDataset();
  initCanvasChart();
  plotBarGraph();
  plotUKMap();
};
