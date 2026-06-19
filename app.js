const TERRITORIES = ["Adama", "Arada and Sululta", "Arbaminch", "Bahirdar and Gondor", "Bole", "Burayu", "Debre Birhan", "Dessie and Woldiya", "Diredawa", "Dukem", "Hagere Mariam", "Hawassa", "Jimma and Ambo", "Ldeta Kirkos and Sebeta", "Mekele and Shire", "Shahemenie", "Welayta"];

document.addEventListener('DOMContentLoaded', async () => {
    const terrSelect = document.getElementById('territory');
    TERRITORIES.forEach(t => terrSelect.innerHTML += `<option value="${t}">${t}</option>`);
    
    const res = await fetch('https://script.google.com/macros/s/AKfycbzUe_LpunHXO5MaCM84_MWFi7_rOZWimlRvRf7qPbC_lW1QN6hiG4aS3Rc4u6Q60nfUMA/exec');
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
        document.getElementById('espId').value = e.target.value;
        document.getElementById('espPhone').value = e.target.options[e.target.selectedIndex].dataset.phone;
    });

    document.getElementById('orderForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('submitBtn');
        btn.innerText = "Sending...";
        
        const formData = new FormData(e.target);
        const params = new URLSearchParams(formData);
        
        await fetch('https://script.google.com/macros/s/AKfycbzUe_LpunHXO5MaCM84_MWFi7_rOZWimlRvRf7qPbC_lW1QN6hiG4aS3Rc4u6Q60nfUMA/exec', { method: 'POST', body: params });
        
        document.getElementById('statusMsg').innerHTML = '<div class="alert alert-success">Order Submitted Successfully!</div>';
        e.target.reset();
        btn.innerText = "SUBMIT ORDER";
    });
});
