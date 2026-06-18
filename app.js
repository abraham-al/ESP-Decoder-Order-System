document.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch('https://script.google.com/macros/s/AKfycbwcT3EiT7osmt9i8kw_m3ZX5Zl9lOr7wDDWlg1L453xiIQJkzUe3OSxgP_gGHKNJWET8w/exec');
        
        if (!res.ok) throw new Error("Network response was not ok");
        
        const data = await res.json();
        
        // Save to cache
        localStorage.setItem('sales_data', JSON.stringify(data));
        masterData = data;
        
        initUI();
    } catch (err) {
        console.error("Error loading data:", err);
        // If fetch fails, try to use old cache
        let cached = localStorage.getItem('sales_data');
        if (cached) {
            masterData = JSON.parse(cached);
            initUI();
        } else {
            alert("Could not load data. Please check your internet or Google Sheet deployment.");
        }
    }
});
