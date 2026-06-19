const supabase = supabase.createClient(
    'https://umkfhmjzqvqlebwzrmea.supabase.co', 
    'sb_publishable_gBbVKE0rmVIhYJH3HDLEYQ_twdbDuaQ'
);

const TERRITORIES = ["Adama", "Arada and Sululta", "Arbaminch", "Bahirdar and Gondor", "Bole", "Burayu", "Debre Birhan", "Dessie and Woldiya", "Diredawa", "Dukem", "Hagere Mariam", "Hawassa", "Jimma and Ambo", "Ldeta Kirkos and Sebeta", "Mekele and Shire", "Shahemenie", "Welayta"];

let allEsps = [];

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Setup Territories
    const terrSelect = document.getElementById('territory');
    TERRITORIES.forEach(t => terrSelect.innerHTML += `<option value="${t}">${t}</option>`);

    // 2. Load Data
    const { data: esps } = await supabase.from('esps').select('*');
    allEsps = esps || [];
    
    const { data: reps } = await supabase.from('reps').select('*');
    const repSelect = document.getElementById('salesRep');
    (reps || []).forEach(r => repSelect.innerHTML += `<option value="${r.name}">${r.name}</option>`);

    // 3. Filter Shops
    terrSelect.addEventListener('change', (e) => {
        const espSelect = document.getElementById('espSelect');
        espSelect.innerHTML = '<option value="">Select Shop</option>';
        allEsps.filter(s => s.territory === e.target.value).forEach(s => {
            espSelect.innerHTML += `<option value="${s.esp_id}" data-phone="${s.phone}">${s.esp_name}</option>`;
        });
    });

    document.getElementById('espSelect').addEventListener('change', (e) => {
        const selected = e.target.options[e.target.selectedIndex];
        document.getElementById('espId').value = e.target.value;
        document.getElementById('espPhone').value = selected.dataset.phone;
    });

    // 4. Submit
    document.getElementById('orderForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('submitBtn');
        btn.innerText = "Sending...";
        
        const { error } = await supabase.from('orders').insert([{
            territory: document.getElementById('territory').value,
            esp_id: document.getElementById('espId').value,
            esp_name: document.getElementById('espSelect').options[document.getElementById('espSelect').selectedIndex].text,
            esp_phone: document.getElementById('espPhone').value,
            sales_rep: document.getElementById('salesRep').value,
            delivery_date: document.getElementById('deliveryDate').value,
            decoder_qty: parseInt(document.getElementById('qty').value),
            remarks: document.getElementById('remarks').value
        }]);

        if (error) {
            document.getElementById('statusMsg').innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
        } else {
            document.getElementById('statusMsg').innerHTML = '<div class="alert alert-success">Order Submitted Successfully!</div>';
            document.getElementById('orderForm').reset();
        }
        btn.innerText = "SUBMIT ORDER";
    });
});
