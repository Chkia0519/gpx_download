document.addEventListener('DOMContentLoaded', function() {
    const select = document.getElementById('whereSelect');
    const locationFields = document.getElementById('locationFields');

    function toggleFields() {
        const inputs = locationFields.querySelectorAll('input');
        if (select.value === 'me' || select.value === 'net') {
            locationFields.style.display = 'block';  // 顯示
            inputs.forEach(i => i.disabled = false);
        } else {
            locationFields.style.display = 'none';   // 隱藏
            inputs.forEach(i => i.disabled = true);  // 讓表單不送這些欄位
        }
    }
    const map = L.map('map').setView([23.5, 121], 7);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data © OpenStreetMap contributors'
        }).addTo(map);

        // 點擊地圖填入經緯度
        map.on('click', function(e) {
            document.getElementById('lat').value = e.latlng.lat.toFixed(6);
            document.getElementById('lon').value = e.latlng.lng.toFixed(6);
        });

    select.addEventListener('change', toggleFields);
    toggleFields(); // 初始化執行一次
});