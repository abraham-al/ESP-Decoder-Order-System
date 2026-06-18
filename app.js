let masterData = { esps: [], reps: [], territories: [] };

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbxvIeXs8mvKgoOvqXuJedkosktv1xLKz24WE9CfgqHtL0u9k3Y8k_N8T0XRb-sUQDFPEg/exec');
        if (!response.ok) throw new Error("Server error");
        masterData = await response.json();
        localStorage.setItem('sales_data', JSON.stringify(masterData));
        initUI();
    } catch (err) {
        console.error(err);
        // Load cached if fetch fails
        let cached = localStorage.getItem('sales_data');
        if (cached) {
            masterData = JSON.parse(cached);
            initUI();
        } else {
            document.getElementById('statusMsg').innerHTML = 
                `<div class="alert alert-danger">Connection Failed. Please check your internet or Google Script deployment.</div>`;
        }
    }
});

function initUI() {
    const terrSelect = document.getElementById('territory');
    const repSelect = document.getElementById('salesRep');
    const espSelect = document.getElementById('espSelect');

    // Populate Territories
    terrSelect.innerHTML = '<option value="">Select Territory</option>';
    masterData.territories.forEach(t => terrSelect.innerHTML += `<option value="${t}">${t}</option>`);

    // Populate Reps
    repSelect.innerHTML = '<option value="">Select Rep</option>';
    masterData.reps.forEach(r => repSelect.innerHTML += `<option value="${r[1]}">${r[1]}</option>`);

    // Filter ESPs when Territory changes
    terrSelect.addEventListener('change', (e) => {
        espSelect.innerHTML = '<option>Select Shop</option>';
        masterData.esps
            .filter(s => s[0] === e.target.value) // s[0] is Territory
            .forEach(s => {
                espSelect.innerHTML += `<option value="${s[1]}" data-phone="${s[3]}">${s[2]}</option>`;
            });
    });
}
