// 1. Initialize Supabase - DO NOT DUPLICATE THIS LINE
const supabase = supabase.createClient(
    'https://umkfhmjzqvqlebwzrmea.supabase.co', 
    'sb_publishable_gBbVKE0rmVIhYJH3HDLEYQ_twdbDuaQ'
);

const TERRITORIES = ["Adama", "Arada and Sululta", "Arbaminch", "Bahirdar and Gondor", "Bole", "Burayu", "Debre Birhan", "Dessie and Woldiya", "Diredawa", "Dukem", "Hagere Mariam", "Hawassa", "Jimma and Ambo", "Ldeta Kirkos and Sebeta", "Mekele and Shire", "Shahemenie", "Welayta"];

let allEsps = [];

document.addEventListener('DOMContentLoaded', async () => {
    // Populate Territory
    const terrSelect = document.getElementById('territory');
    TERRITORIES.forEach(t => {
        let opt = document.createElement('option');
        opt.value = t;
        opt.textContent = t;
        terrSelect.appendChild(opt);
    });

    // Fetch ESPs and Reps from Supabase
    // NOTE: Ensure your table names are EXACTLY 'esps' and 'reps'
    const { data: esps, error: err1 } = await supabase.from('esps').select('*');
    const { data: reps, error: err2 } = await supabase.from('reps').select('*');

    if (err1) console.error("Error loading ESPs:", err1);
    if (err2) console.error("Error loading Reps:", err2);

    allEsps = esps || [];
    
    // Populate Sales Reps
    const repSelect = document.getElementById('salesRep');
    (reps || []).forEach(r => {
        let opt = document.createElement('option');
        // Ensure 'name' matches your column name in Supabase
        opt.value = r.name; 
        opt.textContent = r.name;
        repSelect.appendChild(opt);
    });

    // Territory Filter
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

    // Update ESP ID and Phone on change
    document.getElementById('espSelect').addEventListener('change', (e) => {
        const selected = e.target.options[e.target.selectedIndex];
        document.getElementById('espId').value = e.target.value;
        document.getElementById('espPhone').value = selected.dataset.phone || '';
    });

    // Form Submission
    document.getElementById('orderForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        document.getElementById('submitBtn').innerText = "Submitting...";

        const espSelect = document.getElementById('espSelect');
        const orderData = {
            territory: document.getElementById('territory').value,
            esp_id: document.getElementById('espId').value,
            esp_name: espSelect.options[espSelect.selectedIndex].text,
            esp_phone: document.getElementById('espPhone').value,
            sales_rep: document.getElementById('salesRep').value,
            delivery_date: document.getElementById('deliveryDate').value,
            decoder_qty: parseInt(document.getElementById('qty').value),
            remarks: document.getElementById('remarks').value
        };

        const { error } = await supabase.from('orders').insert([orderData]);
        
        if (error) {
            document.getElementById('statusMsg').innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
        } else {
            document.getElementById('statusMsg').innerHTML = '<div class="alert alert-success">Order Submitted Successfully!</div>';
            e.target.reset();
        }
        document.getElementById('submitBtn').innerText = "SUBMIT ORDER";
    });
});
