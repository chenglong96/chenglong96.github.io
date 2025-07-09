async function fetchUserProfile() {
  const apiKey = document.getElementById('apiKeyInput').value;

  if (!apiKey) {
    alert("Please enter your API key.");
    return;
  }

  const url = `https://api.torn.com/user/?selections=profile&key=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    document.getElementById('output').textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    document.getElementById('output').textContent = "Error fetching data.";
  }
}
