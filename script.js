// script.js — NovaMind Analytics IT Department
// Handles ticket form logic and the toast notification

// ── generate a random ticket ID like "NM-IT-4821" ──
function generateTicketId() {
  // random 4-digit number between 1000 and 9999
  let num = Math.floor(1000 + Math.random() * 9000);
  return 'NM-IT-' + num;
}

// ── show the green toast at the bottom right ──
function showToast(message) {
  let toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');

  // hide the toast after 3.5 seconds
  setTimeout(function () {
    toast.classList.remove('show');
  }, 3500);
}

// ── show the warning-styled orange/red toast fading in 3s ──
function showWarningToast(message) {
  let toast = document.getElementById('toast');
  toast.textContent = message;
  
  // apply warning styles
  toast.style.borderColor = 'var(--warn)';
  toast.style.color = 'var(--warn)';
  toast.style.boxShadow = '0 4px 20px rgba(163, 92, 0, 0.35)';
  toast.style.background = 'var(--aws-ink)';
  
  toast.classList.add('show');

  setTimeout(function () {
    toast.classList.remove('show');
    // reset toast styles after transition completes
    setTimeout(() => {
      toast.style.borderColor = '';
      toast.style.color = '';
      toast.style.boxShadow = '';
      toast.style.background = '';
    }, 300);
  }, 3000);
}

// ── submit ticket button handler ──
function submitTicket() {
  // grab values from the form
  let name = document.getElementById('f-name').value.trim();
  let dept = document.getElementById('f-dept').value;
  let type = document.getElementById('f-type').value;
  let desc = document.getElementById('f-desc').value.trim();

  let ticketLabel = document.getElementById('ticket-id');

  // simple validation — all fields required
  if (!name || !dept || !type || !desc) {
    ticketLabel.style.color = 'var(--danger)';
    ticketLabel.textContent = '⚠ Please fill in all fields.';
    return; // stop here if something is missing
  }

  // everything is filled in — generate a ticket ID
  let id = generateTicketId();

  // show the ticket ID below the buttons
  ticketLabel.style.color = 'var(--muted)';
  ticketLabel.textContent = 'Ticket ID: ' + id;

  // pop the success toast
  showToast('✓ Ticket ' + id + ' submitted successfully');
}

// ── clear / reset the ticket form ──
function clearTicket() {
  // clear text inputs
  document.getElementById('f-name').value = '';
  document.getElementById('f-desc').value = '';

  // reset dropdowns back to the first option
  document.getElementById('f-dept').selectedIndex = 0;
  document.getElementById('f-type').selectedIndex = 0;

  // reset priority to "Medium" (index 1)
  document.getElementById('f-priority').selectedIndex = 1;

  // clear the ticket-id label too
  document.getElementById('ticket-id').textContent = '';
}

// ==========================================================================
// CYBERSECURITY DASHBOARD & SYSTEM PROTECTION LOGIC
// ==========================================================================

let isProcessing = false;
let currentThreats = 142;

// ── format current time ──
function getFormattedTime() {
  const now = new Date();
  return now.toTimeString().split(' ')[0].substring(0, 5);
}

// ── add an entry to the live maintenance log ──
function addLogEntry(time, type, msg) {
  const logList = document.getElementById('maintenance-log');
  if (!logList) return;

  const item = document.createElement('div');
  item.className = 'maintenance-log-item';
  
  let dotClass = 'dot-info';
  if (type === 'ok') dotClass = 'dot-ok';
  else if (type === 'warn') dotClass = 'dot-warn';
  else if (type === 'critical') dotClass = 'dot-critical';

  item.innerHTML = `
    <span class="log-time">${time}</span>
    <span class="log-dot ${dotClass}"></span>
    <span class="log-msg">${msg}</span>
  `;
  
  logList.insertBefore(item, logList.firstChild);
  
  // keep logs clean and constrained to recent 12 entries
  while (logList.children.length > 12) {
    logList.removeChild(logList.lastChild);
  }
}

// ── toggle action button disable state during active processes ──
function toggleActionButtons(disable) {
  document.getElementById('btn-run-scan').disabled = disable;
  document.getElementById('btn-run-backup').disabled = disable;
  document.getElementById('btn-simulate-threat').disabled = disable;
}

// ── trigger visual success flash on a card ──
function flashCard(cardId) {
  const card = document.getElementById(cardId);
  if (card) {
    card.classList.add('flash-ok-bg');
    setTimeout(() => {
      card.classList.remove('flash-ok-bg');
    }, 1000);
  }
}

// ── visual feedback in the device inventory table ──
function flashDeviceRow(deviceName) {
  const rows = document.querySelectorAll('#card-devices tbody tr');
  rows.forEach(row => {
    const firstCell = row.querySelector('td');
    if (firstCell && firstCell.textContent.toLowerCase().includes(deviceName.toLowerCase())) {
      row.style.background = 'rgba(0, 115, 187, 0.08)';
      row.style.transition = 'background 0.2s';
      setTimeout(() => {
        row.style.background = '';
      }, 500);
    }
  });
}

// ── background firewall block simulator ──
function startFirewallSimulation() {
  setInterval(() => {
    if (isProcessing) return; // skip if running scan/backup to avoid overlapping process states

    const increment = Math.floor(Math.random() * 2) + 1; // 1 or 2 threats
    currentThreats += increment;
    
    const counter = document.getElementById('blocked-count');
    if (counter) {
      counter.textContent = currentThreats;
      
      // log a portion of simulated threats
      if (Math.random() > 0.6) {
        const threatSources = [
          'Port scan attempt blocked', 
          'Brute force SSH probe dropped', 
          'Malicious DNS query filtered', 
          'SQL Injection payload neutralized'
        ];
        const randomSource = threatSources[Math.floor(Math.random() * threatSources.length)];
        const mockIP = `192.168.1.${Math.floor(Math.random() * 254) + 1}`;
        addLogEntry(getFormattedTime(), 'info', `Firewall: ${randomSource} from IP ${mockIP}`);
      }
    }
  }, 14000 + Math.random() * 8000); // trigger every 14-22 seconds
}

// ── interactive antivirus scan operation ──
function runQuickScan(event) {
  if (event) event.preventDefault();
  if (isProcessing) return;
  isProcessing = true;
  
  toggleActionButtons(true);
  
  const scanWrapper = document.getElementById('quick-scan-wrapper');
  const scanLabel = document.getElementById('quick-scan-label');
  const scanPercent = document.getElementById('quick-scan-percent');
  const scanFill = document.getElementById('quick-scan-fill');
  
  scanWrapper.style.display = 'block';
  scanFill.classList.remove('complete');
  scanFill.style.background = ''; // reset to CSS default
  scanFill.style.width = '0%';
  scanPercent.textContent = '0%';
  
  scanLabel.textContent = 'Scanning devices...';
  scanLabel.style.color = 'var(--aws-blue)';
  
  // devices from inventory table + network to flash rows while scanning
  const devices = [
    { name: 'MacBook Pro 14"', label: 'MacBook Pro 14"' },
    { name: 'Dell XPS 15', label: 'Dell XPS 15' },
    { name: 'HP EliteBook 840', label: 'HP EliteBook 840' },
    { name: 'Surface Pro 9', label: 'Surface Pro 9' },
    { name: 'iPhone 15 Pro', label: 'iPhone 15' },
    { name: 'Canon MF745C', label: 'Canon MF745C' }
  ];
  
  let currentPct = 0;
  let devIndex = 0;
  
  const scanInterval = setInterval(() => {
    // Random increment between 5% and 15%
    const inc = Math.floor(Math.random() * 11) + 5;
    currentPct += inc;
    
    if (currentPct >= 100) {
      currentPct = 100;
      clearInterval(scanInterval);
      
      scanFill.style.width = '100%';
      scanPercent.textContent = '100%';
      scanFill.classList.add('complete');
      scanFill.style.background = 'var(--ok)'; // progress bar turns green
      
      scanLabel.textContent = '✓ Scan complete — No threats found. 14 devices clean.';
      scanLabel.style.color = 'var(--ok)'; // label turns green
      
      // Update antivirus subcard status and time
      document.getElementById('antivirus-status').textContent = 'Clean';
      document.getElementById('antivirus-status').className = 'security-subcard-val text-ok';
      document.getElementById('antivirus-time').textContent = 'Today ' + getFormattedTime();
      
      // Log + Toast
      addLogEntry(getFormattedTime(), 'ok', 'Antivirus quick scan completed. 14 devices protected.');
      showToast('✓ Antivirus scan completed. Zero threats found.');
      
      flashCard('sec-antivirus');
      
      setTimeout(() => {
        isProcessing = false;
        toggleActionButtons(false);
      }, 1200);
    } else {
      scanFill.style.width = currentPct + '%';
      scanPercent.textContent = currentPct + '%';
      
      // Flash rows dynamically as progress advances
      if (devIndex < devices.length && currentPct > (devIndex * 15)) {
        flashDeviceRow(devices[devIndex].label);
        devIndex++;
      }
      
      // Update labels dynamically
      if (currentPct < 30) {
        scanLabel.textContent = 'Scanning system memory...';
      } else if (currentPct < 60) {
        scanLabel.textContent = 'Checking active processes...';
      } else if (currentPct < 85) {
        scanLabel.textContent = 'Analyzing device registry...';
      } else {
        scanLabel.textContent = 'Comparing threat signatures...';
      }
    }
  }, 200 + Math.random() * 150);
}

// ── interactive backup system operation ──
function runBackup(event) {
  if (event) event.preventDefault();
  if (isProcessing) return;
  isProcessing = true;
  
  toggleActionButtons(true);
  
  const progressWrapper = document.getElementById('sec-progress-wrapper');
  const progressStatus = document.getElementById('sec-progress-status');
  const progressPercent = document.getElementById('sec-progress-percent');
  const progressFill = document.getElementById('sec-progress-fill');
  
  progressWrapper.style.display = 'block';
  progressStatus.textContent = 'Initializing backup snapshot...';
  progressPercent.textContent = '0%';
  progressFill.style.width = '0%';
  
  const backupSteps = [
    { pct: 15, msg: 'Preparing database snapshot...' },
    { pct: 45, msg: 'Compressing files & application schemas...' },
    { pct: 75, msg: 'Uploading encrypted archive to Google Cloud Storage bucket...' },
    { pct: 90, msg: 'Verifying MD5 integrity checksums...' },
    { pct: 100, msg: 'Backup synchronization completed successfully!' }
  ];
  
  let step = 0;
  const backupInterval = setInterval(() => {
    if (step < backupSteps.length) {
      const currentStep = backupSteps[step];
      progressPercent.textContent = currentStep.pct + '%';
      progressFill.style.width = currentStep.pct + '%';
      progressStatus.textContent = currentStep.msg;
      step++;
    } else {
      clearInterval(backupInterval);
      
      setTimeout(() => {
        progressWrapper.style.display = 'none';
        isProcessing = false;
        toggleActionButtons(false);
        
        // update metrics
        document.getElementById('backup-time').textContent = 'Just now';
        
        const nextBackupEl = document.getElementById('next-backup');
        nextBackupEl.textContent = '24h';
        nextBackupEl.className = 'text-ok';
        
        // log + toast
        addLogEntry(getFormattedTime(), 'ok', 'Google Cloud Storage backup completed successfully (4.86 GB synchronized)');
        showToast('✓ Server backup stored successfully in Cloud bucket.');
        
        // update status pill in system health status bar if it exists
        const backupPill = document.querySelector('.status-pill.pill-warn');
        if (backupPill && backupPill.textContent.includes('Backup')) {
          backupPill.className = 'status-pill pill-ok';
          backupPill.textContent = 'Backup — Healthy';
        }
        
        flashCard('sec-backup');
      }, 800);
    }
  }, 600);
}

// ── interactive threat simulation operation ──
function triggerThreatSimulation(event) {
  if (event) event.preventDefault();
  if (isProcessing) return;
  isProcessing = true;
  
  toggleActionButtons(true);
  
  const firewallSubcard = document.getElementById('sec-firewall');
  const firewallStatus = document.getElementById('firewall-status');
  const counter = document.getElementById('blocked-count');
  
  // Threat jump by random number between 3 and 8
  const threatJump = Math.floor(Math.random() * 6) + 3;
  currentThreats += threatJump;
  counter.textContent = currentThreats;
  
  // Flash orange/red briefly on the threat counter
  counter.style.color = 'var(--danger)';
  counter.style.textShadow = '0 0 15px var(--danger)';
  counter.style.transform = 'scale(1.4)';
  counter.style.transition = 'color 0.15s, text-shadow 0.15s, transform 0.15s';
  
  setTimeout(() => {
    counter.style.color = '';
    counter.style.textShadow = '';
    counter.style.transform = '';
  }, 400);
  
  const targetIP = '185.220.101.' + Math.floor(10 + Math.random() * 200);
  addLogEntry(getFormattedTime(), 'critical', `INTRUSION WARNING: ${threatJump} SQL Injection attempts detected from IP ${targetIP}`);
  
  // Firewall status flashes red for 1 second
  firewallStatus.textContent = 'BREACH DETECTED';
  firewallStatus.className = 'security-subcard-val text-danger';
  
  // Make the firewall card flash red
  firewallSubcard.style.background = 'rgba(185, 28, 28, 0.08)';
  firewallSubcard.style.borderColor = 'var(--danger)';
  firewallSubcard.style.boxShadow = '0 4px 15px rgba(185, 28, 28, 0.3)';
  firewallSubcard.style.transition = 'all 0.15s ease-in-out';
  
  setTimeout(() => {
    // Return to green
    firewallStatus.textContent = 'Active';
    firewallStatus.className = 'security-subcard-val text-ok';
    
    firewallSubcard.style.background = '';
    firewallSubcard.style.borderColor = '';
    firewallSubcard.style.boxShadow = '';
    
    addLogEntry(getFormattedTime(), 'ok', `INTRUSION BLOCKED: ${threatJump} threats neutralized and IP ${targetIP} blacklisted`);
    
    // Warning toast saying "⚡ Threat detected & blocked by Bitdefender" fades in/out
    showWarningToast('⚡ Threat detected & blocked by Bitdefender');
    
    isProcessing = false;
    toggleActionButtons(false);
    
    flashCard('sec-firewall');
  }, 1000);
}

// ── populate initial logs and start simulation ──
document.addEventListener('DOMContentLoaded', () => {
  const initialLogs = [
    { time: '12:45', type: 'info', msg: 'Antivirus signature database successfully updated to v4.12.89' },
    { time: '11:15', type: 'ok', msg: 'Bitdefender firewall integrity scan passed with zero anomalies' },
    { time: '10:00', type: 'info', msg: 'Cloudflare edge DNS routing synchronized for novamind.analytics' },
    { time: '09:14', type: 'ok', msg: 'Scheduled quick scan completed: 14/14 devices safe' },
    { time: '07:30', type: 'ok', msg: 'SSL certificate verification successful (valid for 89 more days)' },
    { time: '05:00', type: 'warn', msg: 'Backup storage space usage warning: 84% capacity reached' }
  ];

  initialLogs.forEach(log => {
    addLogEntry(log.time, log.type, log.msg);
  });

  startFirewallSimulation();
});
