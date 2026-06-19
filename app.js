const supabase = supabase.createClient(
    'https://umkfhmjzqvqlebwzrmea.supabase.co', 
    'sb_publishable_gBbVKE0rmVIhYJH3HDLEYQ_twdbDuaQ'
);

const TERRITORIES = ["Adama", "Arada and Sululta", "Arbaminch", "Bahirdar and Gondor", "Bole", "Burayu", "Debre Birhan", "Dessie and Woldiya", "Diredawa", "Dukem", "Hagere Mariam", "Hawassa", "Jimma and Ambo", "Ldeta Kirkos and Sebeta", "Mekele and Shire", "Shahemenie", "Welayta"];

let allEsps = [];

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Populate Territory Dropdown
    const terrSelect = document.getElementById('territory');
    TERRITORIES.forEach(t => {
        let opt = document.createElement('option');
        opt.value = t;
        opt.innerHTML = t;
        terrSelect.appendChild(opt);
    });

    // 2. Fetch Data from Supabase
    // Make sure your table names are exactly 'esps' and 'reps' in your dashboard
    const { data: esps, error: err1 } = await supabase.from('esps').select('*');
    const { data: reps, error: err2 } = await supabase.from('reps').select('*');

    if (err1) console.error("Error loading ESPs:", err1);
    if (err2) console.error("Error loading Reps:", err2);

    allEsps = esps || [];
    
    // 3. Populate Sales Rep Dropdown
    const repSelect = document.getElementById('salesRep');
    if (reps) {
        reps.forEach(r => {
            let opt = document.createElement('option');
            // Assuming your column name is 'name' or 'sales_rep_name'
            opt.value = r.name; 
            opt.innerHTML = r.name;
            repSelect.appendChild(opt);
        });
    }

    // 4. Handle Territory Change to Filter Shops
    terrSelect.addEventListener('change', (e) => {
        const espSelect = document.getElementById('espSelect');
        espSelect.innerHTML = '<option value="">Select Shop</option>';
        
        allEsps.filter(s => s.territory === e.target.value).forEach(s => {
            let opt = document.createElement('option');
            opt.value = s.esp_id;
            opt.setAttribute('data-phone', s.phone);
            opt.innerHTML = s.esp_name;
            espSelect.appendChild(opt);
        });
    });

    // ... (keep your existing submission logic here)
});
