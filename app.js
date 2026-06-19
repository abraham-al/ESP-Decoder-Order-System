const TERRITORIES = ["Adama", "Arada and Sululta", "Arbaminch", "Bahirdar and Gondor", "Bole", "Burayu", "Debre Birhan", "Dessie and Woldiya", "Diredawa", "Dukem", "Hagere Mariam", "Hawassa", "Jimma and Ambo", "Ldeta Kirkos and Sebeta", "Mekele and Shire", "Shahemenie", "Welayta"];

document.addEventListener('DOMContentLoaded', async () => {
    const terrSelect = document.getElementById('territory');
    TERRITORIES.forEach(t => terrSelect.innerHTML += `<option value="${t}">${t}</option>`);
    
    // Fetch Master Data
    const res = await fetch('https://script.google.com/macros/s/AKfycbxS3voaSu9Hs3r2D40AP1qGwrSEH94LYjYeIew4ifUhTLibs40ulR8Jq3c_Uijwjm-Amw/exec');
    const data = await res.json();
    
    const repSelect = document.getElementById('salesRep');
    data.reps.forEach(r => repSelect.innerHTML += `<option value="${r[1]}">${r[1]}</option>`);

    document.getElementById('territory').addEventListener('change', (e) => {
        const espSelect = document.getElementById('espSelect');
        espSelect.innerHTML = '<option value="">Select Shop</option>';
        data.esps.filter(s => s[0].trim() === e.target.value.trim()).forEach(s => {
            espSelect.innerHTML += `<option value="${s[1]}" data-phone="${s[3]}">${s[2]}</option>`;
        });
    });

    document.getElementById('espSelect').addEventListener('change', (e) => {
        const selected = e.target.options[e.target.selectedIndex];
        document.getElementById('espId').value = e.target.value;
        document.getElementById('espPhone').value = selected.dataset.phone;
    });

    document.getElementById('orderForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        document.getElementById('submitBtn').innerText = "Sending...";
        
        const formData = new URLSearchParams(new FormData(document.getElementById('orderForm')));
        
        await fetch('https://script.google.com/macros/s/AKfycbxS3voaSu9Hs3r2D40AP1qGwrSEH94LYjYeIew4ifUhTLibs40ulR8Jq3c_Uijwjm-Amw/exec', {
            method: 'POST',
            body: formData
        });

        document.getElementById('statusMsg').innerHTML = '<div class="alert alert-success">Order Submitted Successfully!</div>';
        document.getElementById('orderForm').reset();
        document.getElementById('submitBtn').innerText = "SUBMIT ORDER";
    });
});
