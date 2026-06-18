document.addEventListener('DOMContentLoaded', async () => {
    // 1. Fetch data from Google Sheet
    // Use the same URL you got from your Web App Deployment
    const response = await fetch('https://script.google.com/macros/s/AKfycbwmwoEZD5TwGbJyoAJogpA-cp_q_ws1iazn1xwsv_iiCa3y9aBGIz_2tnVWGVmj5IfkWg/exec');
    const data = await response.json();
    
    // 2. Populate ESP Searchable List
    const espList = document.getElementById('espList');
    const allEsps = data.esps.slice(1); // Skip the header row
    
    allEsps.forEach(row => {
        let opt = document.createElement('option');
        opt.value = row[2]; // ESP_Name is column C (index 2)
        opt.dataset.id = row[1]; // ESP_ID is column B
        opt.dataset.phone = row[3]; // Phone is column D
        espList.appendChild(opt);
    });

    // 3. Populate Sales Rep Dropdown
    const repSelect = document.getElementById('salesRep');
    const allReps = data.reps.slice(1);
    
    allReps.forEach(row => {
        let opt = document.createElement('option');
        opt.value = row[1]; // Sales_Rep_Name is column B
        opt.text = row[1];
        repSelect.appendChild(opt);
    });

    // 4. Handle ESP Selection to auto-fill ID and Phone
    document.getElementById('espInput').addEventListener('input', (e) => {
        const val = e.target.value;
        const option = Array.from(espList.options).find(o => o.value === val);
        if (option) {
            document.getElementById('espId').value = option.dataset.id;
            document.getElementById('espPhone').value = option.dataset.phone;
        }
    });

    // ... (Keep the submission form listener as it was before) ...
});