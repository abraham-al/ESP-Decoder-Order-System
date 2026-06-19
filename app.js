// 1. Initialize Supabase
const supabase = supabase.createClient(
    'https://umkfhmjzqvqlebwzrmea.supabase.co', 
    'sb_publishable_gBbVKE0rmVIhYJH3HDLEYQ_twdbDuaQ'
);

const TERRITORIES = ["Adama", "Arada and Sululta", "Arbaminch", "Bahirdar and Gondor", "Bole", "Burayu", "Debre Birhan", "Dessie and Woldiya", "Diredawa", "Dukem", "Hagere Mariam", "Hawassa", "Jimma and Ambo", "Ldeta Kirkos and Sebeta", "Mekele and Shire", "Shahemenie", "Welayta"];

let allEsps = [];

document.addEventListener('DOMContentLoaded', async () => {
    // Populate Territory
    const terrSelect = document.getElementById('territory');
    TERRITORIES.forEach(t => terrSelect.innerHTML += `<option value="${t}">${t}</option>`);

    // Fetch ESPs from Supabase
    const { data: esps, error } = await supabase.from('esps').select('*');
    if (error) console.error("Error:", error);
    allEsps = esps;

    // Fetch Reps (Assuming you have a 'reps' table in Supabase)
    const { data: reps } = await supabase.from('reps').select('*');
    const repSelect = document.getElementById('salesRep');
    reps.forEach(r => repSelect.innerHTML += `<option value="${r.name}">${r.name}</option>`);

    // Filter ESPs by Territory
    terrSelect.addEventListener('change', (e) => {
        const espSelect = document.getElementById('espSelect');
        espSelect.innerHTML = '<option value="">Select Shop</option>';
        allEsps.filter(s => s.territory === e.target.value).forEach(s => {
            espSelect.innerHTML += `<option value="${s.esp_id}" data-phone="${s.phone}">${s.esp_name}</option>`;
        });
    });

    // Form Submission to Supabase
    document.getElementById('orderForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        document.getElementById('submitBtn').innerText = "Submitting...";

        const espSelect = document.getElementById('espSelect');
        const orderData = {
            order_date: new Date().toISOString(),
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
