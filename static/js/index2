let points = [];
  let markers = [];
  let tempMarker = null;
  let polyline = null;
  let pointCount = 0; // 自動編號用

  const tips = document.getElementById('tips');
  const map = L.map('map').setView([23.9739, 120.9820], 7);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap 貢獻者'
  }).addTo(map);

  // 點擊地圖 → 顯示暫時標記 + 加入按鈕
  map.on('click', function(e) {
    const lat = e.latlng.lat.toFixed(6);
    const lon = e.latlng.lng.toFixed(6);
    document.getElementById('coordInput').value = `${lat},${lon}`;

    if (tempMarker) map.removeLayer(tempMarker);

    tempMarker = L.marker([lat, lon]).addTo(map)
      .bindPopup(`<b>暫時標記</b><br>${lat}, ${lon}<br><button onclick="confirmAddPoint(${lat},${lon})">加入座標</button>`)
      .openPopup();

    tips.style.display = 'inline'; // 有暫時座標才顯示提示
  });

  // 確認新增點
  function confirmAddPoint(lat, lon) {
    pointCount++;
    const name = `點位 ${pointCount}`;
    points.push({ name, lat, lon });
    renderTable();
    renderMarkers();

    map.closePopup();
    map.removeLayer(tempMarker);
    tempMarker = null;
    tips.style.display = 'none';

    // 第一個點自動 zoom in
    if (points.length === 1) {
      map.setView([lat, lon], 15);
    }

    if (document.getElementById('showLineCheckbox').checked) drawLine();
  }

  // 新增點位（手動）
  function addPoint() {
    let name = document.getElementById('nameInput').value.trim();
    let coord = document.getElementById('coordInput').value.trim();

    if (!coord) return alert("請輸入經緯度或點擊地圖");

    coord = coord.replace(/[()（）]/g, "").replace(/，/g, ",").replace(/\s+/g, "");
    const [lat, lon] = coord.split(',').map(x => x.trim());
    if (!lat || !lon || isNaN(lat) || isNaN(lon)) return alert("請輸入正確格式，例如：24.018417,120.493877");

    if (!name) {
      pointCount++;
      name = `點位 ${pointCount}`;
    }

    points.push({ name, lat, lon });
    renderTable();
    renderMarkers();

    document.getElementById('nameInput').value = '';
    document.getElementById('coordInput').value = '';

    if (points.length === 1) map.setView([lat, lon], 15);
    if (document.getElementById('showLineCheckbox').checked) drawLine();
  }

  function renderTable() {
    const tbody = document.querySelector('#pointTable tbody');
    tbody.innerHTML = '';

    points.forEach((p, i) => {
      const coordText = `${p.lat},${p.lon}`;
      const row = document.createElement('tr');
      row.innerHTML = `
        <td contenteditable="true" oninput="updatePoint(${i}, 'name', this.innerText)">${p.name}</td>
        <td contenteditable="true" oninput="updateCoord(${i}, this.innerText)">${coordText}</td>
        <td>
          <button onclick="editCoord(${i})">修改座標</button>
          <button onclick="deletePoint(${i})">刪除</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  }

  function updatePoint(index, key, value) {
    points[index][key] = value.trim();
    renderMarkers();
  }

  function updateCoord(index, value) {
    const [lat, lon] = value.split(',').map(x => x.trim());
    if (!lat || !lon || isNaN(lat) || isNaN(lon)) return;
    points[index].lat = lat;
    points[index].lon = lon;
    renderMarkers();
  }

  function editCoord(index) {
    const marker = markers[index];
    if (!marker) return;
    marker.dragging.enable();
    marker.openPopup();
  }

  function deletePoint(index) {
    if (confirm("確定要刪除這個點嗎？")) {
      points.splice(index, 1);
      renderTable();
      renderMarkers();
      if (document.getElementById('showLineCheckbox').checked) drawLine();
    }
  }

  function renderMarkers() {
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    if (points.length === 0) return;

    const bounds = [];
    points.forEach((p, i) => {
      const marker = L.marker([p.lat, p.lon], { draggable: false })
        .bindPopup(`<b>${p.name}</b><br>${p.lat},${p.lon}`)
        .addTo(map);

      marker.on('dragend', function(e) {
        const latlng = e.target.getLatLng();
        points[i].lat = latlng.lat.toFixed(6);
        points[i].lon = latlng.lng.toFixed(6);
        renderTable();
        marker.getPopup().setContent(`<b>${points[i].name}</b><br>${points[i].lat},${points[i].lon}`);
        marker.dragging.disable();
        if (document.getElementById('showLineCheckbox').checked) drawLine();
      });

      markers.push(marker);
      bounds.push([p.lat, p.lon]);
    });
  }

  function toggleLine() {
    if (document.getElementById('showLineCheckbox').checked) {
      drawLine();
    } else {
      if (polyline) {
        map.removeLayer(polyline);
        polyline = null;
      }
    }
  }

  function drawLine() {
    if (polyline) map.removeLayer(polyline);
    if (points.length < 2) return;
    const latlngs = points.map(p => [p.lat, p.lon]);
    polyline = L.polyline(latlngs, { color: 'red', weight: 3 }).addTo(map);
  }

  function downloadGPX() {
    if (points.length === 0) return alert("沒有資料可以下載");
    let filename = document.getElementById('gpxnameInput').value.trim() || "points";
    if (!filename.toLowerCase().endsWith('.gpx')) filename += '.gpx';
    let gpx = `<?xml version="1.0" encoding="utf-8"?>\n<gpx version="1.1" creator="GPX Editor" xmlns="http://www.topografix.com/GPX/1/1">\n`;
    points.forEach(p => {
      gpx += `  <wpt lat="${p.lat}" lon="${p.lon}"><name><![CDATA[${p.name}]]></name></wpt>\n`;
    });
    gpx += `</gpx>`;
    const blob = new Blob([gpx], { type: "application/gpx+xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
  }
