/* Pure Vanilla JavaScript for APP Logic */

// Global storage for master data
let espMaster = [];

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Set minimal delivery date to 'today' (no earlier)
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('deliveryDate').setAttribute('min', today);

    // 2. Initial Status Update
    setStatusMsg("Loading Master Data...","info");
    
    try {
        // 3. Define the doorway to your Google Sheet (via Web App URL)
        const endpoint = 'https://script.google.com/macros/s/AKfycbwmwoEZD5TwGbJyoAJogpA-cp_q_ws1iazn1xwsv_iiCa3y9aBGIz_2tnVWGVmj5IfkWg/exec';

        // 4. GET Master Data from your Google Sheet
        const response = await fetch(endpoint, {
            method: 'GET',
            mode: 'cors', // Crucial for cross-origin requests
            headers: { 'Content-Type': 'application/json' },
        });
        
        if (!response.ok) { throw new Error('Network response was not ok'); }
        
        const data = await response.json();

        // 5. Populate Master Data into Dropdowns
        // data.esps[0] contains headers, data.esps[1...N] are actual rows
        espMaster = data.esps.slice(1);
        populateEspDropdown();
        populateRepDropdown(data.reps.slice(1));
        
        setStatusMsg("Connected to Sheet. Ready.","success");
    } catch (error) {
        console.error("Master data load failed:", error);
        setStatusMsg("Failed to load Master Data from Sheet. Please check connection.","error");
    }

    // 6. Handle ESP Dropdown Change (to auto-fill ID and Phone)
    document.getElementById('espSelect').addEventListener('change', (e) => {
        const selectedId = e.target.value;
        const selectedEsp = espMaster.find(esp => esp[1].toString() === selectedId); // ESP_ID is Col B (index 1)
        
        if (selectedEsp) {
            document.getElementById('espId').value = selectedEsp[1]; // ESP_ID
            document.getElementById('espPhone').value = selectedEsp[3]; // Phone is Col D (index 3)
        } else {
            // Reset fields if selection is invalid
            document.getElementById('espId').value = '';
            document.getElementById('espPhone').value = '';
        }
    });

    // 7. Handle Order Submission (Prevent Duplicates with Disabled Button)
    document.getElementById('orderForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Disable button immediately, show spinner-like text
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = true;
        submitBtn.innerText = "Transmitting... Please Wait";
        setStatusMsg("Order processing...","info");

        // Collect form data
        const espSelect = document.getElementById('espSelect');
        const espName = espSelect.options[espSelect.selectedIndex].text;

        const payload = {
            // "Order Date" is not collected; it is added automatically in Google Sheet script.
            territory: document.getElementById('territory').value,
            esp_id: document.getElementById('espId').value,
            esp_name: espName,
            esp_phone: document.getElementById('espPhone').value,
            sales_rep: document.getElementById('salesRep').value,
            delivery_date: document.getElementById('deliveryDate').value,
            decoder_qty: document.getElementById('qty').value,
            remarks: document.getElementById('remarks').value
        };

        try {
            // REPLACE THIS URL BELOW
            const postEndpoint = 'https://script.google.com/macros/s/AKfycbwmwoEZD5TwGbJyoAJogpA-cp_q_ws1iazn1xwsv_iiCa3y9aBGIz_2tnVWGVmj5IfkWg/exec';

            const response = await fetch(postEndpoint, {
                method: 'POST',
                mode: 'no-cors', // Common pattern for simple Google Form POSTs
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            // Handle success (Note: simple 'no-cors' POST doesn't return response body)
            setStatusMsg("Order Transmitted Successfully! Sheet will update in moments.","success");
            document.getElementById('orderForm').reset();
            resetDropdowns();
        } catch (err) {
            console.error("Submission error:", err);
            setStatusMsg("Error! Connection failed. Please try again.","error");
        } finally {
            // Reactivate button
            submitBtn.disabled = false;
            submitBtn.innerText = "Submit Order";
        }
    });
});

/** UTILITY FUNCTIONS **/

function populateEspDropdown() {
    const espSelect = document.getElementById('espSelect');
    espSelect.innerHTML = '<option value="" disabled selected>Choose Electronic Shop (ESP)...</option>';
    
    // Sort ESPs alphabetically (Col C / index 2)
    espMaster.sort((a, b) => a[2].localeCompare(b[2]));

    espMaster.forEach(esp => {
        let opt = document.createElement('option');
        opt.value = esp[1]; // ESP_ID is used as the 'value'
        opt.text = `${esp[2]} (ID: ${esp[1]})`; // Display ESP_Name and ID
        espSelect.appendChild(opt);
    });
}

function populateRepDropdown(repsArray) {
    const repSelect = document.getElementById('salesRep');
    repSelect.innerHTML = '<option value="" disabled selected>Choose Sales Rep...</option>';
    
    // Sort Reps alphabetically (Col B / index 1)
    repsArray.sort((a, b) => a[1].localeCompare(b[1]));

    repsArray.forEach(rep => {
        let opt = document.createElement('option');
        opt.value = rep[1]; // Sales_Rep_Name is value
        opt.text = rep[1]; // Sales_Rep_Name is display
        repSelect.appendChild(opt);
    });
}

function resetDropdowns() {
    // Manually reset dropdowns to default selection
    document.getElementById('territory').selectedIndex = 0;
    document.getElementById('espSelect').selectedIndex = 0;
    document.getElementById('salesRep').selectedIndex = 0;
}

function setStatusMsg(msg, type) {
    const msgElement = document.getElementById('statusMsg');
    msgElement.innerText = msg;
    
    if (type === "success") {
        msgElement.className = "alert alert-success futuristic-input border-success text-success";
    } else if (type === "error") {
        msgElement.className = "alert alert-danger futuristic-input border-danger text-danger";
    } else {
        msgElement.className = "alert alert-info futuristic-input border-info text-info";
    }
}
