// ... (Keep your existing initialization logic)

function initUI() {
    const terrSelect = document.getElementById('territory');
    const espSelect = document.getElementById('espSelect');
    
    // Territory Change Filter
    terrSelect.addEventListener('change', (e) => {
        const selectedTerritory = e.target.value;
        // Reset ESP dropdown
        espSelect.innerHTML = '<option value="">Select Shop</option>';
        
        // Filter shops belonging to that territory (Col A / s[0])
        const filtered = masterData.esps.filter(s => s[0] === selectedTerritory);
        
        filtered.forEach(s => {
            espSelect.innerHTML += `<option value="${s[1]}" data-phone="${s[3]}">${s[2]}</option>`;
        });
    });

    // Handle Form Submission
    document.getElementById('orderForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('submitBtn');
        const statusMsg = document.getElementById('statusMsg');
        
        btn.disabled = true;
        btn.innerText = "Submitting...";
        
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

        try {
            const res = await fetch('https://script.google.com/macros/s/AKfycbww9kwoR-Js3uRh-RwhWKeFAH-_FfSnPxLQ6hTUWrI1enmC16l5ODvyvdg3-qX4ke06EA/exec', {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify(payload)
            });
            // Show Success
            statusMsg.innerHTML = '<div class="alert alert-success">Order Submitted Successfully!</div>';
            document.getElementById('orderForm').reset();
            espSelect.innerHTML = '<option value="">Select Territory First</option>';
        } catch (err) {
            statusMsg.innerHTML = '<div class="alert alert-danger">Submission failed. Try again.</div>';
        } finally {
            btn.disabled = false;
            btn.innerText = "SUBMIT ORDER";
        }
    });
}
