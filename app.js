// 1. RENAME VARIABLE: Using 'db' completely avoids the "Already Declared" Syntax Error
const db = window.supabase.createClient(
    'https://umkfhmjzqvqlebwzrmea.supabase.co', 
    'sb_publishable_gBbVKE0rmVIhYJH3HDLEYQ_twdbDuaQ'
);

const TERRITORIES = ["Adama", "Arada and Sululta", "Arbaminch", "Bahirdar and Gondor", "Bole", "Burayu", "Debre Birhan", "Dessie and Woldiya", "Diredawa", "Dukem", "Hagere Mariam", "Hawassa", "Jimma and Ambo", "Ldeta Kirkos and Sebeta", "Mekele and Shire", "Shahemenie", "Welayta"];
let allEsps = [];

// 2. Safely wrap everything in an async function
document.addEventListener('DOMContentLoaded', async () => {
    
    // --- A. Populate Territories Immediately ---
    const terrSelect = document.getElementById('territory');
    TERRITORIES.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t; 
        opt.textContent = t;
        terrSelect.appendChild(opt);
    });

    try {
        // --- B. Fetch Data from Supabase ---
        const { data: esps, error: espError } = await db.from('esps').select('*');
        const { data: reps, error: repError } = await db.from('reps').select('*');

        if (espError) console.error("ESP Fetch Error:", espError);
        if (repError) console.error("Rep Fetch Error:", repError);

        allEsps = esps || [];
        
        // --- C. Populate Reps ---
        const repSelect = document.getElementById('salesRep');
        (reps || []).forEach(r => {
            const opt = document.createElement('option');
            opt.value = r.name; // This must match your Supabase column name exactly
            opt.textContent = r.name;
            repSelect.appendChild(opt);
        });

    } catch (err) {
        console.error("Database connection failed:", err);
    }

    // --- D. Handle Form Interactions ---
    
    // Filter ESPs when Territory changes
    terrSelect.addEventListener('change', (e) => {
        const espSelect = document.getElementById('espSelect');
        espSelect.innerHTML = '<option value="">Select Shop</option>'; // Reset dropdown
        
        allEsps.filter(s => s.territory === e.target.value).forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.esp_id;
            opt.setAttribute('data-phone', s.phone);
            opt.textContent = s.esp_name;
            espSelect.appendChild(opt);
        });
    });

    // Update ID and Phone fields when ESP is selected
    document.getElementById('espSelect').addEventListener('change', (e) => {
        const selectedOpt = e.target.options[e.target.selectedIndex];
        document.getElementById('espId').value = e.target.value;
        document.getElementById('espPhone').value = selectedOpt.dataset.phone || '';
    });

    // --- E. Handle Form Submission ---
    document.getElementById('orderForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('submitBtn');
        const statusMsg = document.getElementById('statusMsg');
        
        btn.innerText = "Submitting...";
        
        const espSelect = document.getElementById('espSelect');
        const orderData = {
            order_date: new Date().toISOString(), // Auto-fill with current submission timestamp
            territory: document.getElementById('territory').value,
            esp_id: document.getElementById('espId').value,
            esp_name: espSelect.options[espSelect.selectedIndex].text,
            esp_phone: document.getElementById('espPhone').value,
            sales_rep: document.getElementById('salesRep').value,
            delivery_date: document.getElementById('deliveryDate').value,
            decoder_qty: parseInt(document.getElementById('qty').value),
            remarks: document.getElementById('remarks').value
        };

        // Insert into the 'orders' table
        const { error } = await db.from('orders').insert([orderData]);

        if (error) {
            statusMsg.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
        } else {
            statusMsg.innerHTML = '<div class="alert alert-success">Order Submitted Successfully!</div>';
            e.target.reset(); // Clear the form
        }
        btn.innerText = "SUBMIT ORDER";
    });
});
