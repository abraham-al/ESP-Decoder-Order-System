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
        // ESPs table can exceed Supabase's default 1000-row response cap,
        // so we page through it in batches until we've pulled everything.
        async function fetchAllEsps() {
            const pageSize = 1000;
            let from = 0;
            let allRows = [];
            while (true) {
                const { data, error } = await db
                    .from('esps')
                    .select('*')
                    .range(from, from + pageSize - 1);

                if (error) {
                    console.error("ESP Fetch Error:", error);
                    break;
                }
                allRows = allRows.concat(data || []);
                if (!data || data.length < pageSize) break; // last page reached
                from += pageSize;
            }
            return allRows;
        }

        const { data: reps, error: repError } = await db.from('reps').select('*');
        if (repError) console.error("Rep Fetch Error:", repError);

        allEsps = await fetchAllEsps();
        
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

    const espSearch = document.getElementById('espSearch');
    const espDropdownList = document.getElementById('espDropdownList');
    const espIdField = document.getElementById('espId');
    const espPhoneField = document.getElementById('espPhone');
    let filteredEsps = [];

    function clearEspSelection() {
        espIdField.value = '';
        espPhoneField.value = '';
    }

    function renderEspDropdown(list) {
        espDropdownList.innerHTML = '';
        if (!list.length) {
            espDropdownList.style.display = 'none';
            return;
        }
        list.forEach(s => {
            const item = document.createElement('button');
            item.type = 'button';
            item.className = 'list-group-item list-group-item-action';
            item.textContent = s.esp_name;
            item.addEventListener('click', () => {
                espSearch.value = s.esp_name;
                espIdField.value = s.esp_id;
                espPhoneField.value = s.phone || '';
                espDropdownList.style.display = 'none';
            });
            espDropdownList.appendChild(item);
        });
        espDropdownList.style.display = 'block';
    }

    // Filter ESPs when Territory changes
    terrSelect.addEventListener('change', (e) => {
        filteredEsps = allEsps
            .filter(s => s.territory === e.target.value)
            .sort((a, b) => a.esp_name.localeCompare(b.esp_name)); // Order by ESP name

        espSearch.value = '';
        clearEspSelection();
        espDropdownList.style.display = 'none';

        if (filteredEsps.length) {
            espSearch.disabled = false;
            espSearch.placeholder = 'Type to search shop...';
        } else {
            espSearch.disabled = true;
            espSearch.placeholder = 'No shops found for this territory';
        }
    });

    // Show full sorted list on focus, filter as the user types
    espSearch.addEventListener('focus', () => {
        renderEspDropdown(filteredEsps);
    });

    espSearch.addEventListener('input', (e) => {
        clearEspSelection(); // force re-selection if they're editing the text
        const term = e.target.value.trim().toLowerCase();
        const matches = term
            ? filteredEsps.filter(s => s.esp_name.toLowerCase().includes(term))
            : filteredEsps;
        renderEspDropdown(matches);
    });

    // Close dropdown when clicking outside it
    document.addEventListener('click', (e) => {
        if (!espSearch.contains(e.target) && !espDropdownList.contains(e.target)) {
            espDropdownList.style.display = 'none';
        }
    });

    // --- E. Handle Form Submission ---
    document.getElementById('orderForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('submitBtn');
        const statusMsg = document.getElementById('statusMsg');

        // Make sure a real ESP was picked from the dropdown, not just typed text
        if (!espIdField.value) {
            statusMsg.innerHTML = '<div class="alert alert-danger">Please select a shop from the dropdown list.</div>';
            return;
        }

        btn.innerText = "Submitting...";

        const orderData = {
            order_date: new Date().toISOString(),
            territory: document.getElementById('territory').value,
            esp_id: espIdField.value,
            esp_name: espSearch.value,
            esp_phone: espPhoneField.value,
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
            espSearch.value = '';
            espSearch.disabled = true;
            espSearch.placeholder = 'Select a territory first...';
            filteredEsps = [];
            espDropdownList.style.display = 'none';
        }
        btn.innerText = "SUBMIT ORDER";
    });
});
