// Global state
let lastGeneratedPasswords = [];
let generatorType = 'password'; // 'password' or 'passphrase'
const PASSWORD_HISTORY_KEY = 'passwordGeneratorHistory';
const SETTINGS_KEY = 'passwordGeneratorSettings';
const THEME_KEY = 'passwordGeneratorTheme';

// Preset templates for quick configuration
const PRESETS = {
  weak: {
    length: 8,
    lowercase: true,
    uppercase: false,
    numbers: false,
    special: false,
    excludeAmbiguous: false
  },
  medium: {
    length: 12,
    lowercase: true,
    uppercase: true,
    numbers: true,
    special: false,
    excludeAmbiguous: false
  },
  strong: {
    length: 16,
    lowercase: true,
    uppercase: true,
    numbers: true,
    special: true,
    excludeAmbiguous: false
  },
  verystrong: {
    length: 24,
    lowercase: true,
    uppercase: true,
    numbers: true,
    special: true,
    excludeAmbiguous: true
  }
};

// Initialize app on load
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  loadTheme();
  loadHistory();
  setupKeyboardShortcuts();
  updatePasswordLengthDisplay();
  document.getElementById('length').addEventListener('input', updatePasswordLengthDisplay);
});

// Load saved settings from localStorage
function loadSettings() {
  const saved = localStorage.getItem(SETTINGS_KEY);
  if (saved) {
    const settings = JSON.parse(saved);
    document.getElementById('length').value = settings.length || 16;
    document.getElementById('count').value = settings.count || 5;
    document.getElementById('lowercase').checked = settings.lowercase !== false;
    document.getElementById('uppercase').checked = settings.uppercase !== false;
    document.getElementById('numbers').checked = settings.numbers !== false;
    document.getElementById('special').checked = settings.special !== false;
    document.getElementById('exclude-ambiguous').checked = settings.excludeAmbiguous || false;
    document.getElementById('speed').value = settings.speed || '10000000000';
  }
}

// Save settings to localStorage on change
function saveSettings() {
  const settings = {
    length: parseInt(document.getElementById('length').value),
    count: parseInt(document.getElementById('count').value),
    lowercase: document.getElementById('lowercase').checked,
    uppercase: document.getElementById('uppercase').checked,
    numbers: document.getElementById('numbers').checked,
    special: document.getElementById('special').checked,
    excludeAmbiguous: document.getElementById('exclude-ambiguous').checked,
    speed: document.getElementById('speed').value
  };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// Load theme preference
function loadTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.body.classList.add('dark');
    document.getElementById('dark-toggle').checked = true;
  }
}

// Toggle dark mode and persist
function toggleDarkMode() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
}

// Setup keyboard shortcuts
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Enter to generate
    if (e.key === 'Enter' && e.target.type !== 'textarea') {
      generatePasswords();
    }
    // Ctrl/Cmd + Shift + C to copy all
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
      e.preventDefault();
      if (lastGeneratedPasswords.length > 1) {
        copyAllPasswords();
      }
    }
  });
}

// Set generator type and show/hide relevant settings
function setGeneratorType(type) {
  generatorType = type;
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.type === type);
  });
  document.getElementById('password-config').style.display = type === 'password' ? 'block' : 'none';
  document.getElementById('passphrase-config').style.display = type === 'passphrase' ? 'block' : 'none';
  document.getElementById('charset-section').style.display = type === 'password' ? 'block' : 'none';
}

// Apply preset template
function applyPreset(presetName) {
  const preset = PRESETS[presetName];
  if (!preset) return;
  
  document.getElementById('length').value = preset.length;
  document.getElementById('lowercase').checked = preset.lowercase;
  document.getElementById('uppercase').checked = preset.uppercase;
  document.getElementById('numbers').checked = preset.numbers;
  document.getElementById('special').checked = preset.special;
  document.getElementById('exclude-ambiguous').checked = preset.excludeAmbiguous;
  
  updatePasswordLengthDisplay();
  showToast(`Applied preset: ${presetName}`);
}

// Toggle custom character set section
function toggleCustomCharset() {
  const section = document.getElementById('custom-charset-section');
  section.style.display = section.style.display === 'none' ? 'block' : 'none';
}

// Update password length display
function updatePasswordLengthDisplay() {
  document.getElementById('length-display').textContent = document.getElementById('length').value;
}

// Main password generation function
function generatePasswords() {
  saveSettings();
  
  if (generatorType === 'passphrase') {
    generatePassphrases();
    return;
  }
  
  const length = parseInt(document.getElementById('length').value);
  const count = parseInt(document.getElementById('count').value);
  const includeLower = document.getElementById('lowercase').checked;
  const includeUpper = document.getElementById('uppercase').checked;
  const includeNumbers = document.getElementById('numbers').checked;
  const includeSpecial = document.getElementById('special').checked;
  const excludeAmbiguous = document.getElementById('exclude-ambiguous').checked;
  const customCharset = document.getElementById('custom-charset').value;

  // validate password length
  if (length < 8 || length > 128) {
    showToast('Password length must be 8-128 characters', 'error');
    return;
  }

  // validate number of passwords
  if (count < 1 || count > 10) {
    showToast('Generate 1-10 passwords', 'error');
    return;
  }

  let charset = '';
  if (customCharset) {
    // use custom character set if provided
    charset = customCharset;
  } else {
    if (includeLower) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeUpper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) charset += '0123456789';
    if (includeSpecial) charset += '!@#$%^&*()_+[]{}|;:,.<>?';

    // exclude ambiguous characters if requested (matches C# version)
    if (excludeAmbiguous) {
      charset = charset.replace(/[O0lI1]/g, '');
    }
  }

  const container = document.getElementById('passwords-list');
  if (charset === '') {
    showToast('Please select at least one character type', 'error');
    return;
  }

  container.innerHTML = '';
  lastGeneratedPasswords = [];

  for (let i = 0; i < count; i++) {
    // use secure random generation
    const password = generateSecurePassword(charset, length);
    lastGeneratedPasswords.push(password);
    renderPasswordCard(password, charset);
  }

  addToHistory(lastGeneratedPasswords);
  evaluateStrength(length, charset);
  
  // show export and copy buttons
  document.getElementById('copy-all-btn').style.display = count > 1 ? 'inline-block' : 'none';
  document.getElementById('export-btn').style.display = 'inline-block';
  document.getElementById('strength-container').style.display = 'block';
  
  showToast(`Generated ${count} password${count > 1 ? 's' : ''}`);
}

// Generate passphrases instead of random passwords
function generatePassphrases() {
  const wordCount = parseInt(document.getElementById('passphrase-words').value);
  const separator = document.getElementById('passphrase-separator').value;
  const capitalize = document.getElementById('passphrase-capitalize').checked;
  const addNumber = document.getElementById('passphrase-number').checked;
  const count = parseInt(document.getElementById('count').value);

  const container = document.getElementById('passwords-list');
  container.innerHTML = '';
  lastGeneratedPasswords = [];

  for (let i = 0; i < count; i++) {
    let passphrase = '';
    for (let j = 0; j < wordCount; j++) {
      let word = getRandomWord();
      if (capitalize && j === 0) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      }
      passphrase += word + (j < wordCount - 1 ? separator : '');
    }

    if (addNumber) {
      passphrase += Math.floor(Math.random() * 100);
    }

    lastGeneratedPasswords.push(passphrase);
    renderPasswordCard(passphrase, '');
  }

  addToHistory(lastGeneratedPasswords);
  document.getElementById('copy-all-btn').style.display = count > 1 ? 'inline-block' : 'none';
  document.getElementById('export-btn').style.display = 'inline-block';
  document.getElementById('strength-container').style.display = 'none'; // no strength for passphrases
  
  showToast(`Generated ${count} passphrase${count > 1 ? 's' : ''}`);
}

// Render individual password card with options
function renderPasswordCard(password, charset) {
  const card = document.createElement('div');
  card.className = 'password-card';
  // mark if this is restored from history (charset is empty)
  if (charset === '') {
    card.setAttribute('data-restored', 'true');
  }

  const passDiv = document.createElement('div');
  passDiv.className = 'password';
  passDiv.textContent = password;
  passDiv.dataset.original = password;
  passDiv.setAttribute('aria-label', `Password: ${password}`);

  const iconsContainer = document.createElement('div');
  iconsContainer.className = 'password-card-icons';

  const copyIcon = document.createElement('span');
  copyIcon.className = 'copy-icon';
  copyIcon.textContent = '📋';
  copyIcon.title = 'Copy password';
  copyIcon.onclick = () => copyToClipboard(password, copyIcon);

  const toggleIcon = document.createElement('span');
  toggleIcon.className = 'toggle-icon';
  toggleIcon.textContent = '👁️';
  toggleIcon.title = 'Toggle visibility';
  toggleIcon.onclick = () => togglePasswordVisibility(passDiv);

  const regenerateIcon = document.createElement('span');
  regenerateIcon.className = 'regenerate-icon';
  regenerateIcon.textContent = '🔄';
  // disable regenerate for restored history since we don't have charset info
  if (charset === '') {
    regenerateIcon.style.opacity = '0.5';
    regenerateIcon.style.cursor = 'not-allowed';
    regenerateIcon.title = 'Regenerate (restored history - re-generate to create new)';
    regenerateIcon.onclick = () => showToast('Generate new passwords to get editable results', 'error');
  } else {
    regenerateIcon.title = 'Regenerate';
    regenerateIcon.onclick = () => regeneratePassword(card, charset);
  }

  iconsContainer.appendChild(toggleIcon);
  iconsContainer.appendChild(copyIcon);
  iconsContainer.appendChild(regenerateIcon);

  card.appendChild(passDiv);
  card.appendChild(iconsContainer);
  document.getElementById('passwords-list').appendChild(card);
}

// Regenerate individual password
function regeneratePassword(card, charset) {
  if (generatorType === 'passphrase') {
    const wordCount = parseInt(document.getElementById('passphrase-words').value);
    const separator = document.getElementById('passphrase-separator').value;
    const capitalize = document.getElementById('passphrase-capitalize').checked;
    const addNumber = document.getElementById('passphrase-number').checked;

    let passphrase = '';
    for (let j = 0; j < wordCount; j++) {
      let word = getRandomWord();
      if (capitalize && j === 0) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      }
      passphrase += word + (j < wordCount - 1 ? separator : '');
    }
    if (addNumber) {
      passphrase += Math.floor(Math.random() * 100);
    }

    card.querySelector('.password').textContent = passphrase;
    card.querySelector('.password').dataset.original = passphrase;
  } else {
    const length = parseInt(document.getElementById('length').value);
    const newPassword = generateSecurePassword(charset, length);
    card.querySelector('.password').textContent = newPassword;
    card.querySelector('.password').dataset.original = newPassword;
  }

  showToast('Password regenerated');
}

// Toggle password visibility
function togglePasswordVisibility(passDiv) {
  if (passDiv.textContent === passDiv.dataset.original) {
    passDiv.textContent = '*'.repeat(passDiv.dataset.original.length);
  } else {
    passDiv.textContent = passDiv.dataset.original;
  }
}

// Use crypto API for cryptographically secure random generation
function generateSecurePassword(charset, length) {
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);
  
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = randomValues[i] % charset.length;
    password += charset[randomIndex];
  }
  return password;
}

// Copy single password with visual feedback
function copyToClipboard(password, iconElement) {
  navigator.clipboard.writeText(password).then(() => {
    const originalText = iconElement.textContent;
    iconElement.textContent = '✓';
    setTimeout(() => {
      iconElement.textContent = originalText;
    }, 1500);
    showToast('Copied to clipboard');
  }).catch(() => {
    showToast('Failed to copy password', 'error');
  });
}

// Copy all passwords at once
function copyAllPasswords() {
  const text = lastGeneratedPasswords.join('\n');
  navigator.clipboard.writeText(text).then(() => {
    showToast('All passwords copied to clipboard');
  }).catch(() => {
    showToast('Failed to copy passwords', 'error');
  });
}

// Export passwords in different formats
function exportPasswords(format) {
  if (lastGeneratedPasswords.length === 0) {
    showToast('No passwords to export', 'error');
    return;
  }

  let content, filename, type;

  if (format === 'txt') {
    content = lastGeneratedPasswords.join('\n');
    filename = 'passwords.txt';
    type = 'text/plain';
  } else if (format === 'csv') {
    content = 'password\n' + lastGeneratedPasswords.map(p => `"${p}"`).join('\n');
    filename = 'passwords.csv';
    type = 'text/csv';
  } else if (format === 'json') {
    content = JSON.stringify({ passwords: lastGeneratedPasswords, generated: new Date().toISOString() }, null, 2);
    filename = 'passwords.json';
    type = 'application/json';
  }

  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);

  showToast(`Exported as ${format.toUpperCase()}`);
  toggleExportMenu();
}

// Toggle export menu
function toggleExportMenu() {
  const menu = document.getElementById('export-menu');
  menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

// Evaluate password strength with entropy calculation
function evaluateStrength(length, charset) {
  let strength = 0;
  if (length >= 12) strength++;
  if (length >= 16) strength++;
  if (/[a-z]/.test(charset)) strength++;
  if (/[A-Z]/.test(charset)) strength++;
  if (/[0-9]/.test(charset)) strength++;
  if (/[^a-zA-Z0-9]/.test(charset)) strength++;

  const bar = document.getElementById('strength-bar');
  const label = document.getElementById('strength-label');
  const percent = Math.min(strength * 16.67, 100);
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

  // Calculate and display entropy in bits
  const entropyBits = Math.log2(Math.pow(charset.length, length));
  document.getElementById('entropy-display').textContent = `Entropy: ${entropyBits.toFixed(1)} bits`;

  const speed = parseFloat(document.getElementById('speed').value);
  const charsetSize = charset.length;
  const totalCombos = BigInt(Math.pow(charsetSize, length));
  const seconds = totalCombos / BigInt(speed);
  const readableTime = formatTime(seconds);
  document.getElementById('crack-time-estimate').textContent = `Crack time: ${readableTime}`;
}

// Format time to readable format
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

// Password history management
function addToHistory(passwords) {
  let history = JSON.parse(localStorage.getItem(PASSWORD_HISTORY_KEY)) || [];
  const timestamp = new Date().toLocaleTimeString();
  history.unshift({ passwords, timestamp });
  history = history.slice(0, 10); // keep last 10
  localStorage.setItem(PASSWORD_HISTORY_KEY, JSON.stringify(history));
  loadHistory();
}

// Load and display password history
function loadHistory() {
  const history = JSON.parse(localStorage.getItem(PASSWORD_HISTORY_KEY)) || [];
  const historySection = document.getElementById('history-section');
  const historyList = document.getElementById('history-list');

  if (history.length === 0) {
    historySection.style.display = 'none';
    return;
  }

  historySection.style.display = 'block';
  historyList.innerHTML = '';

  history.forEach((entry, index) => {
    const item = document.createElement('div');
    item.className = 'history-item';
    item.innerHTML = `
      <span class="history-time">${entry.timestamp}</span>
      <span class="history-passwords">${entry.passwords.join(', ')}</span>
      <button onclick="restoreHistory(${index})" class="small-btn">Restore</button>
    `;
    historyList.appendChild(item);
  });
}

// Restore passwords from history
function restoreHistory(index) {
  const history = JSON.parse(localStorage.getItem(PASSWORD_HISTORY_KEY)) || [];
  if (history[index]) {
    lastGeneratedPasswords = history[index].passwords;
    const container = document.getElementById('passwords-list');
    container.innerHTML = '';
    lastGeneratedPasswords.forEach(pwd => renderPasswordCard(pwd, ''));
    document.getElementById('copy-all-btn').style.display = 'inline-block';
    document.getElementById('export-btn').style.display = 'inline-block';
    showToast('History restored');
  }
}

// Clear entire password history
function clearHistory() {
  if (confirm('Clear all password history?')) {
    localStorage.removeItem(PASSWORD_HISTORY_KEY);
    loadHistory();
    showToast('History cleared');
  }
}

// Toast notification system
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

