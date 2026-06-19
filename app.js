const TERRITORIES = ["Adama", "Arada and Sululta", "Arbaminch", "Bahirdar and Gondor", "Bole", "Burayu", "Debre Birhan", "Dessie and Woldiya", "Diredawa", "Dukem", "Hagere Mariam", "Hawassa", "Jimma and Ambo", "Ldeta Kirkos and Sebeta", "Mekele and Shire", "Shahemenie", "Welayta"];

let masterData = { esps: [], reps: [] };

document.addEventListener('DOMContentLoaded', async () => {
    // Populate Territory Dropdown
    const terrSelect = document.getElementById('territory');
    TERRITORIES.forEach(t => terrSelect.innerHTML += `<option value="${t}">${t}</option>`);

    // Fetch Data
    try {
        const res = await fetch('https://script.google.com/macros/s/AKfycbww9kwoR-Js3uRh-RwhWKeFAH-_FfSnPxLQ6hTUWrI1enmC16l5ODvyvdg3-qX4ke06EA/exec');
        masterData = await res.json();
        localStorage.setItem('sales_data', JSON.stringify(masterData));
        initUI();
    } catch(e) { 
        let cached = localStorage.getItem('sales_data');
        if(cached) { masterData = JSON.parse(cached); initUI(); }
    }
});

function initUI() {
    const terrSelect = document.getElementById('territory');
    const espSelect = document.getElementById('espSelect');
    const repSelect = document.getElementById('salesRep');

    masterData.reps.forEach(r => repSelect.innerHTML += `<option value="${r[1]}">${r[1]}</option>`);

    terrSelect.addEventListener('change', (e) => {
        espSelect.innerHTML = '<option value="">Select Shop</option>';
        // S[0] is Territory, S[1] is ID, S[2] is Name, S[3] is Phone
        masterData.esps.filter(s => s[0].trim() === e.target.value.trim()).forEach(s => {
            espSelect.innerHTML += `<option value="${s[1]}" data-phone="${s[3]}">${s[2]}</option>`;
        });
    });

    espSelect.addEventListener('change', (e) => {
        document.getElementById('espId').value = e.target.value;
        document.getElementById('espPhone').value = e.target.options[e.target.selectedIndex].dataset.phone;
    });
}
