const TERRITORIES = ["Adama", "Arada and Sululta", "Arbaminch", "Bahirdar and Gondor", "Bole", "Burayu", "Debre Birhan", "Dessie and Woldiya", "Diredawa", "Dukem", "Hagere Mariam", "Hawassa", "Jimma and Ambo", "Ldeta Kirkos and Sebeta", "Mekele and Shire", "Shahemenie", "Welayta"];
let masterData = { esps: [], reps: [] };

document.addEventListener('DOMContentLoaded', async () => {
    const terrSelect = document.getElementById('territory');
    TERRITORIES.forEach(t => terrSelect.innerHTML += `<option value="${t}">${t}</option>`);
    
    try {
        const res = await fetch('https://script.google.com/macros/s/AKfycbww9kwoR-Js3uRh-RwhWKeFAH-_FfSnPxLQ6hTUWrI1enmC16l5ODvyvdg3-qX4ke06EA/exec');
        masterData = await res.json();
        localStorage.setItem('sales_data', JSON.stringify(masterData));
        initUI();
    } catch(e) { 
        masterData = JSON.parse(localStorage.getItem('sales_data'));
        initUI(); 
    }
});

function initUI() {
    const espSelect = document.getElementById('espSelect');
    const repSelect = document.getElementById('salesRep');
    masterData.reps.forEach(r => repSelect.innerHTML += `<option value="${r[1]}">${r[1]}</option>`);

    document.getElementById('territory').addEventListener('change', (e) => {
        espSelect.innerHTML = '<option value="">Select Shop</option>';
        masterData.esps.filter(s => s[0] === e.target.value).forEach(s => {
            espSelect.innerHTML += `<option value="${s[1]}" data-phone="${s[3]}">${s[2]}</option>`;
        });
    });

    espSelect.addEventListener('change', (e) => {
        document.getElementById('espId').value = e.target.value;
        document.getElementById('espPhone').value = e.target.options[e.target.selectedIndex].dataset.phone;
    });

    document.getElementById('orderForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('submitBtn');
        btn.disabled = true;
        
        const payload = {
            order_date: new Date().toLocaleDateString(),
            territory: document.getElementById('territory').value,
            esp_id: document.getElementById('espId').value,
            esp_name: document.getElementById('espSelect').options[document.getElementById('espSelect').selectedIndex].text,
            esp_phone: document.getElementById('espPhone').value,
            sales_rep: document.getElementById('salesRep').value,
            delivery_date: document.getElementById('deliveryDate').value,
            decoder_qty: document.getElementById('qty').value,
            remarks: document.getElementById('remarks').value
        };

        await fetch('https://script.google.com/macros/s/AKfycbww9kwoR-Js3uRh-RwhWKeFAH-_FfSnPxLQ6hTUWrI1enmC16l5ODvyvdg3-qX4ke06EA/exec', { method: 'POST', mode: 'no-cors', body: JSON.stringify(payload) });
        document.getElementById('statusMsg').innerHTML = '<div class="alert alert-success">Order Submitted Successfully!</div>';
        document.getElementById('orderForm').reset();
        btn.disabled = false;
    });
}
