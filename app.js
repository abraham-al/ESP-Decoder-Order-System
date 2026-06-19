// Remove all other 'const supabase' lines, keep only this:
const supabase = supabase.createClient(
    'https://umkfhmjzqvqlebwzrmea.supabase.co', 
    'sb_publishable_gBbVKE0rmVIhYJH3HDLEYQ_twdbDuaQ'
);

const TERRITORIES = ["Adama", "Arada and Sululta", "Arbaminch", "Bahirdar and Gondor", "Bole", "Burayu", "Debre Birhan", "Dessie and Woldiya", "Diredawa", "Dukem", "Hagere Mariam", "Hawassa", "Jimma and Ambo", "Ldeta Kirkos and Sebeta", "Mekele and Shire", "Shahemenie", "Welayta"];

// Wrap logic in an async function to handle database fetching
async function initApp() {
    const terrSelect = document.getElementById('territory');
    
    // Populate Territory
    TERRITORIES.forEach(t => {
        const option = document.createElement('option');
        option.value = t;
        option.textContent = t;
        terrSelect.appendChild(option);
    });
    
    console.log("Territories populated.");
}

document.addEventListener('DOMContentLoaded', initApp);
