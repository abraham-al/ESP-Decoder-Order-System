
const supabase = supabase.createClient(
    'https://umkfhmjzqvqlebwzrmea.supabase.co', 
    'sb_publishable_gBbVKE0rmVIhYJH3HDLEYQ_twdbDuaQ'
);

const TERRITORIES = ["Adama", "Arada and Sululta", "Arbaminch", "Bahirdar and Gondor", "Bole", "Burayu", "Debre Birhan", "Dessie and Woldiya", "Diredawa", "Dukem", "Hagere Mariam", "Hawassa", "Jimma and Ambo", "Ldeta Kirkos and Sebeta", "Mekele and Shire", "Shahemenie", "Welayta"];

document.addEventListener('DOMContentLoaded', () => {
    console.log("App script started");
    const terrSelect = document.getElementById('territory');

    if (!terrSelect) {
        console.error("Could not find territory element!");
        return;
    }

    TERRITORIES.forEach(t => {
        const option = document.createElement('option');
        option.value = t;
        option.textContent = t;
        terrSelect.appendChild(option);
    });
    
    console.log("Territories populated");
});
