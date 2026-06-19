const TERRITORIES = [
  "Adama", "Arada and Sululta", "Arbaminch", "Bahirdar and Gondor", "Bole", 
  "Burayu", "Debre Birhan", "Dessie and Woldiya", "Diredawa", "Dukem", 
  "Hagere Mariam", "Hawassa", "Jimma and Ambo", "Ldeta Kirkos and Sebeta", 
  "Mekele and Shire", "Shahemenie", "Welayta"
];

let masterData = { esps: [], reps: [] };

document.addEventListener('DOMContentLoaded', async () => {
    // Populate Territories immediately
    const terrSelect = document.getElementById('territory');
    TERRITORIES.forEach(t => terrSelect.innerHTML += `<option value="${t}">${t}</option>`);

    // Load Data
    try {
        let cached = localStorage.getItem('sales_data');
        if (cached) {
            masterData = JSON.parse(cached);
        } else {
            const res = await fetch('https://script.google.com/macros/s/AKfycbxeoGCuSrQjd15p9nP3E2pSO4MsObqOMhjXRTMy4yX4rz25hBgm4UPO0DMPFhS2Wya1yg/exec');
            masterData = await res.json();
            localStorage.setItem('sales_data', JSON.stringify(masterData));
        }
    } catch (e) { console.error("Offline or Error"); }

    initUI();
});

function initUI() {
    const espSelect = document.getElementById('espSelect');
    document.getElementById('territory').addEventListener('change', (e) => {
        const val = e.target.value;
        // Filter ESPs based on selected territory (Column 0 in Sheet)
        const filtered = masterData.esps.filter(s => s[0] === val);
        espSelect.innerHTML = '<option value="">Select Shop</option>';
        filtered.forEach(s => {
            espSelect.innerHTML += `<option value="${s[1]}" data-phone="${s[3]}">${s[2]}</option>`;
        });
    });
    
    // Populate Reps
    const repSelect = document.getElementById('salesRep');
    masterData.reps.forEach(r => repSelect.innerHTML += `<option value="${r[1]}">${r[1]}</option>`);
}
