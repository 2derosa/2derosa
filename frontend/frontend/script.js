document.getElementById('signupForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;

  const res = await fetch('https://castly-api.onrender.com/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, phone })
  });

  const data = await res.json();
  document.getElementById('response').innerText = data.message || "Registrazione avvenuta!";
});
