let masterData = { esps: [], reps: [] };

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Try to load from cache
    let cached = localStorage.getItem('sales_data');
    if (cached) {
        masterData = JSON.parse(cached);
        initUI();
    } else {
        const res = await fetch('https://script.google.com/macros/s/AKfycbwmwoEZD5TwGbJyoAJogpA-cp_q_ws1iazn1xwsv_iiCa3y9aBGIz_2tnVWGVmj5IfkWg/exec');
        masterData = await res.json();
        localStorage.setItem('sales_data', JSON.stringify(masterData));
        initUI();
    }
});

function initUI() {
    const territorySelect = document.getElementById('territory');
    const espSelect = document.getElementById('espSelect');
    
    // Populate Reps
    const repSelect = document.getElementById('salesRep');
    masterData.reps.forEach(r => repSelect.innerHTML += `<option>${r[1]}</option>`);

    // Dynamic Filter
    territorySelect.addEventListener('change', (e) => {
        espSelect.innerHTML = '<option>Select Shop</option>';
        masterData.esps.filter(s => s[0] === e.target.value).forEach(s => {
            espSelect.innerHTML += `<option value="${s[1]}" data-phone="${s[3]}">${s[2]}</option>`;
        });
    });

    espSelect.addEventListener('change', (e) => {
        document.getElementById('espId').value = e.target.value;
        document.getElementById('espPhone').value = e.target.options[e.target.selectedIndex].dataset.phone;
    });
}
