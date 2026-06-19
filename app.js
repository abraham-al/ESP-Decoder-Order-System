// Initialize Supabase only once
const supabase = supabase.createClient(
    'https://umkfhmjzqvqlebwzrmea.supabase.co', 
    'sb_publishable_gBbVKE0rmVIhYJH3HDLEYQ_twdbDuaQ'
);

const TERRITORIES = ["Adama", "Arada and Sululta", "Arbaminch", "Bahirdar and Gondor", "Bole", "Burayu", "Debre Birhan", "Dessie and Woldiya", "Diredawa", "Dukem", "Hagere Mariam", "Hawassa", "Jimma and Ambo", "Ldeta Kirkos and Sebeta", "Mekele and Shire", "Shahemenie", "Welayta"];

let allEsps = [];

// Wrap all logic in an async function to support 'await'
async function initApp() {
    // 1. Territories
    const terrSelect = document.getElementById('territory');
    TERRITORIES.forEach(t => {
        let opt = document.createElement('option');
        opt.value = t; opt.textContent = t;
        terrSelect.appendChild(opt);
    });

    // 2. Fetch Data
    const { data: esps } = await supabase.from('esps').select('*');
    const { data: reps } = await supabase.from('reps').select('*');
    allEsps = esps || [];

    // 3. Populate Reps
    const repSelect = document.getElementById('salesRep');
    (reps || []).forEach(r => {
        let opt = document.createElement('option');
        opt.value = r.name; opt.textContent = r.name;
        repSelect.appendChild(opt);
    });

    // 4. Filter ESPs
    terrSelect.addEventListener('change', (e) => {
        const espSelect = document.getElementById('espSelect');
        espSelect.innerHTML = '<option value="">Select Shop</option>';
        allEsps.filter(s => s.territory === e.target.value).forEach(s => {
            let opt = document.createElement('option');
            opt.value = s.esp_id;
            opt.setAttribute('data-phone', s.phone);
            opt.textContent = s.esp_name;
            espSelect.appendChild(opt);
        });
    });

    // 5. Update Details
    document.getElementById('espSelect').addEventListener('change', (e) => {
        const selected = e.target.options[e.target.selectedIndex];
        document.getElementById('espId').value = e.target.value;
        document.getElementById('espPhone').value = selected.dataset.phone || '';
    });

    // 6. Submit
    document.getElementById('orderForm').addEventListener('submit', async (e) => {
        e.preventDefault();
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
            e.target.reset();
        }
    });
}

// Run the initialization
document.addEventListener('DOMContentLoaded', initApp);
