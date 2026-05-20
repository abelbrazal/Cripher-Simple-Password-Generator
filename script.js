function generatePasswords() {
  const length = parseInt(document.getElementById('length').value);
  const count = parseInt(document.getElementById('count').value);
  const includeLower = document.getElementById('lowercase').checked;
  const includeUpper = document.getElementById('uppercase').checked;
  const includeNumbers = document.getElementById('numbers').checked;
  const includeSpecial = document.getElementById('special').checked;

  let charset = '';
  if (includeLower) charset += 'abcdefghijklmnopqrstuvwxyz';
  if (includeUpper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (includeNumbers) charset += '0123456789';
  if (includeSpecial) charset += '!@#$%^&*()_+[]{}|;:,.<>?';

  const container = document.getElementById('passwords-list');
  if (charset === '') {
    alert('Please select at least one character type.');
    return;
  }

  container.innerHTML = '';

  for (let i = 0; i < count; i++) {
    let password = '';
    for (let j = 0; j < length; j++) {
      const randomChar = charset.charAt(Math.floor(Math.random() * charset.length));
      password += randomChar;
    }

    const card = document.createElement('div');
    card.className = 'password-card';

    const passDiv = document.createElement('div');
    passDiv.className = 'password';
    passDiv.textContent = password;

    const copyIcon = document.createElement('span');
    copyIcon.className = 'copy-icon';
    copyIcon.textContent = '📋';
    copyIcon.onclick = () => copyToClipboard(password);

    const toggleIcon = document.createElement('span');
    toggleIcon.className = 'toggle-icon';
    toggleIcon.textContent = '👁️';
    toggleIcon.onclick = () => {
      if (passDiv.textContent === password) {
        passDiv.textContent = '*'.repeat(password.length);
      } else {
        passDiv.textContent = password;
      }
    };

    card.appendChild(passDiv);
    card.appendChild(toggleIcon);
    card.appendChild(copyIcon);
    container.appendChild(card);
  }

  evaluateStrength(length, charset);
}

function copyToClipboard(password) {
  navigator.clipboard.writeText(password).then(() => {
    alert('Password copied to clipboard!');
  });
}

function evaluateStrength(length, charset) {
  let strength = 0;
  if (length >= 8) strength++;
  if (/[a-z]/.test(charset)) strength++;
  if (/[A-Z]/.test(charset)) strength++;
  if (/[0-9]/.test(charset)) strength++;
  if (/[^a-zA-Z0-9]/.test(charset)) strength++;

  const bar = document.getElementById('strength-bar');
  const label = document.getElementById('strength-label');
  const percent = Math.min(strength * 20, 100);
  bar.style.width = percent + '%';

  if (percent <= 20) {
    bar.style.backgroundColor = 'red';
    label.innerText = 'Very Weak';
    label.style.color = 'red';
  } else if (percent <= 40) {
    bar.style.backgroundColor = 'orangered';
    label.innerText = 'Weak';
    label.style.color = 'orangered';
  } else if (percent <= 60) {
    bar.style.backgroundColor = 'orange';
    label.innerText = 'Moderate';
    label.style.color = 'orange';
  } else if (percent <= 80) {
    bar.style.backgroundColor = 'yellowgreen';
    label.innerText = 'Strong';
    label.style.color = 'yellowgreen';
  } else {
    bar.style.backgroundColor = 'green';
    label.innerText = 'Very Strong';
    label.style.color = 'green';
  }

  const speed = parseFloat(document.getElementById('speed').value);
  const charsetSize = charset.length;
  const totalCombos = BigInt(Math.pow(charsetSize, length));
  const seconds = totalCombos / BigInt(speed);
  const readableTime = formatTime(seconds);
  updateCrackEstimate(`Estimated crack time: ${readableTime}`);
}

function formatTime(secondsBigInt) {
  const seconds = Number(secondsBigInt);
  if (seconds === Infinity || isNaN(seconds)) return "∞ (uncrackable)";
  if (seconds < 1) return "Less than 1 second";

  const units = [
    { label: "year", value: 31536000 },
    { label: "day", value: 86400 },
    { label: "hour", value: 3600 },
    { label: "minute", value: 60 },
    { label: "second", value: 1 }
  ];

  for (const unit of units) {
    const count = Math.floor(seconds / unit.value);
    if (count >= 1) {
      return `${count.toLocaleString()} ${unit.label}${count > 1 ? 's' : ''}`;
    }
  }

  return `${seconds} seconds`;
}

function updateCrackEstimate(text) {
  const estimate = document.getElementById('crack-time-estimate');
  estimate.textContent = text;
}

function toggleDarkMode() {
  document.body.classList.toggle('dark');
}
