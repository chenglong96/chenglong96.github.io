document.getElementById('fetchDataBtn').addEventListener('click', async () => {
  const apiKey = document.getElementById('apiKeyInput').value.trim();
  if (!apiKey) {
    alert("Please enter your Torn API key.");
    return;
  }
  
  clearUI();
  try {
    const url = `https://api.torn.com/user/?selections=battlestats&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      showError(`Error: ${data.error.error}`);
      return;
    }

    displayBattlestats(data);
  } catch (err) {
    showError(`Fetch error: ${err}`);
  }
});

function clearUI() {
  document.getElementById('errorOutput').textContent = '';
  document.getElementById('battlestatsSection').style.display = 'none';
  document.getElementById('modifiersSection').style.display = 'none';
  document.getElementById('modifiersTable').innerHTML = '';
  if (window.battlestatsChartInstance) {
    window.battlestatsChartInstance.destroy();
    window.battlestatsChartInstance = null;
  }
}

function showError(msg) {
  document.getElementById('errorOutput').textContent = msg;
}

function displayBattlestats(stats) {
  document.getElementById('battlestatsSection').style.display = 'block';

  const ctx = document.getElementById('battlestatsChart').getContext('2d');

  const labels = ["Strength", "Defense", "Speed", "Dexterity"];
  const values = [
    stats.strength,
    stats.defense,
    stats.speed,
    stats.dexterity
  ];

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
          beginAtZero: true
        }
      }
    }
  });

  // Display modifiers
  document.getElementById('modifiersSection').style.display = 'block';

  const table = document.getElementById('modifiersTable');
  const rows = [
    ["Strength Modifier", stats.strength_modifier + "%"],
    ["Defense Modifier", stats.defense_modifier + "%"],
    ["Speed Modifier", stats.speed_modifier + "%"],
    ["Dexterity Modifier", stats.dexterity_modifier + "%"]
  ];

  rows.forEach(row => {
    const tr = document.createElement('tr');
    const td1 = document.createElement('td');
    const td2 = document.createElement('td');
    td1.textContent = row[0];
    td2.textContent = row[1];
    tr.appendChild(td1);
    tr.appendChild(td2);
    table.appendChild(tr);
  });
}

