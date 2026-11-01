
function calculate() {
  const balance = parseFloat(document.getElementById('balance').value) || 0;
  const rate = (parseFloat(document.getElementById('rate').value) || 0) / 100 / 12;
  const payment = parseFloat(document.getElementById('payment').value) || 0;
  const extra = parseFloat(document.getElementById('extra').value) || 0;

  if (balance <= 0 || payment <= 0) return;

  // Standard payoff
  let origMonths = 0;
  let origBal = balance;
  let origTotalInterest = 0;
  while (origBal > 0.01 && origMonths < 360) {
    let interest = origBal * rate;
    let principal = payment - interest;
    if (principal <= 0) {
      document.getElementById('summaryText').innerText = "Payment is too low to cover monthly interest.";
      return;
    }
    if (principal > origBal) principal = origBal;
    origBal -= principal;
    origTotalInterest += interest;
    origMonths++;
  }

  // Extra payment payoff
  let newMonths = 0;
  let newBal = balance;
  let newTotalInterest = 0;
  const totalPayment = payment + extra;
  while (newBal > 0.01 && newMonths < 360) {
    let interest = newBal * rate;
    let principal = totalPayment - interest;
    if (principal > newBal) principal = newBal;
    newBal -= principal;
    newTotalInterest += interest;
    newMonths++;
  }

  const savedInterest = Math.max(0, origTotalInterest - newTotalInterest);
  const savedMonths = Math.max(0, origMonths - newMonths);

  document.getElementById('interestSaved').innerText = '$' + Math.round(savedInterest).toLocaleString();
  document.getElementById('timeSaved').innerText = savedMonths + ' mos';
  document.getElementById('newInterest').innerText = '$' + Math.round(newTotalInterest).toLocaleString();
  document.getElementById('origInterest').innerText = '$' + Math.round(origTotalInterest).toLocaleString();

  const origYears = (origMonths / 12).toFixed(1);
  const newYears = (newMonths / 12).toFixed(1);
  document.getElementById('summaryText').innerHTML = 
    `By paying an extra <strong>$${extra}</strong>/mo, you will be debt-free in <strong>${newMonths} months</strong> (${newYears} yrs) instead of <strong>${origMonths} months</strong> (${origYears} yrs), saving <strong>$${Math.round(savedInterest).toLocaleString()}</strong> in unnecessary bank interest.`;
}

['balance', 'rate', 'payment', 'extra'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    if (document.getElementById(id + 'Range')) {
      document.getElementById(id + 'Range').value = document.getElementById(id).value;
    }
    calculate();
  });
});

['balanceRange', 'rateRange', 'extraRange'].forEach(id => {
  const targetId = id.replace('Range', '');
  document.getElementById(id).addEventListener('input', (e) => {
    document.getElementById(targetId).value = e.target.value;
    calculate();
  });
});

document.getElementById('copyBtn').addEventListener('click', () => {
  const text = document.getElementById('summaryText').innerText;
  navigator.clipboard.writeText("🚗 Car Payoff Calculation:\n" + text);
  alert("Calculation copied to clipboard!");
});

calculate();
