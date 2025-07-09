document.getElementById('fetchDataBtn').addEventListener('click', async () => {
  const apiKey = document.getElementById('apiKeyInput').value.trim();
  if (!apiKey) {
    alert("Please enter your Torn API key.");
    return;
  }
  
  clearUI();
  try {
    const url = `https://api.torn.com/user/?selections=profile,stats&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if(data.error) {
      showError(`Error: ${data.error.error}`);
      return;
    }

    displayProfile(data.profile);
    displayBattlestats(data.stats.battlestats);
  } catch (err) {
    showError(`Fetch error: ${err}`);
  }
});

function clearUI() {
  document.getElementById('errorOutput').textContent = '';
  document.getElementById('profileSection').style.display = 'none';
  document.getElementById('battlestatsSection').style.display = 'none';
  document.getElementById('playerName').textContent = '';
  document.getElementById('playerLevel').textContent = '';
  document.getElementById('playerStatus').textContent = '';
  if(window.battlestatsChartInstance) {
    window.battlestatsChartInstance.destroy();
    window.battlestatsChartInstance = null;
  }
}

function showError(msg) {
  document.getElementById('errorOutput').textContent = msg;
}

function displayProfile(profile) {
  document.getElementById('playerName').textContent = profile.name;
  document.getElementById('playerLevel').textContent = profile.level;
  document.getElementById('playerStatus').textContent = profile.status;
  document.getElementById('profileSection').style.display = 'block';
}

function displayBattlestats(battlestats) {
  document.getElementById('battlestatsSection').style.display = 'block';

  const ctx = document.getElementById('battlestatsChart').getContext('2d');

  const labels = Object.keys(battlestats);
  const values = Object.values(battlestats);

  window.battlestatsChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Battlestats',
        data: values,
        backgroundColor: 'rgba(54, 162, 235, 0.6)'
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 100
          }
        }
      }
    }
  });
}
