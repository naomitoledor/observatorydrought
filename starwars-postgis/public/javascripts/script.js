  let droughtIndexChart;
  let clickHandler;
  
      const map = L.map('map', { center: [0, 0], zoom: 2, zoomControl: false });
      L.tileLayer(
          'https://abcd.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
             zIndex: -1
          }).addTo(map);
  
      document.getElementById('rasterForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const geoserver_url = 'http://localhost:8080/geoserver';
        const levels = ['gws', 'rtzsm', 'sfsm'];
        const year = document.getElementById('year').value;
        const month = document.getElementById('month').value;
  
        const wmsLayers = levels.map(level => {
          const layerName = `${level}:${level}_${year}${month}01`;
          return L.tileLayer.wms(`${geoserver_url}/wms?`, {
            layers: `${layerName}`,
            format: 'image/png',
            transparent: true,
            version: '1.1.0',
            attribution: "GeoServer WMS"
          }).addTo(map);
        });
  
        // Desregistrar el clic anterior
        if (clickHandler) {
          map.off('click', clickHandler);
        }
  
        // Registrar un nuevo evento de clic
        clickHandler = function(evt) {
          getFeatureInfo(evt, wmsLayers, `${year}-${month}`);
          fetchTimeSeries(evt.latlng, levels);
        };
        map.on('click', clickHandler);
      });
  
      function getFeatureInfo(evt, layers, date) {
        const point = evt.latlng;
        const bbox = map.getBounds().toBBoxString();
        const width = map.getSize().x;
        const height = map.getSize().y;
        const x = map.latLngToContainerPoint(point).x.toFixed(0);
        const y = map.latLngToContainerPoint(point).y.toFixed(0);
  
        const promises = layers.map(layer => {
          const url = `${layer._url}?service=WMS&version=1.1.1&request=GetFeatureInfo&layers=${layer.wmsParams.layers}&query_layers=${layer.wmsParams.layers}&bbox=${bbox}&width=${width}&height=${height}&srs=EPSG:4326&info_format=application/json&x=${x}&y=${y}`;
  
          return fetch(url)
            .then(response => response.json())
            .then(data => {
              if (data.features && data.features.length > 0) {
                return {
                  layer: layer.wmsParams.layers.split(':')[0], // Tomar solo el nivel
                  value: data.features[0].properties.GRAY_INDEX
                };
              }
              return null;
            });
        });
  
        Promise.all(promises)
        .then(results => {
          const validResults = results.filter(result => result !== null);
          if (validResults.length > 0) {
            console.log('Información obtenida de las capas:', validResults);
            
            if (droughtIndexChart) {
              droughtIndexChart.destroy();
            }
            buildDroughtIndexGraph(validResults, date);
          } else {
            alert('No se encontraron datos');
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
      }
  
      function buildDroughtIndexGraph(data, date) {
        const labels = data.map(item => item.layer);
        const values = data.map(item => item.value);
  
        const ctx = document.getElementById('myChart').getContext('2d');
        droughtIndexChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              label: 'Value of Drought Index',
              data: values,
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
              fill: false
            }]
          },
          options: {
            scales: {
              x: {title: {display: true
                }
              },
              y: {
                beginAtZero: true,
                title: {display: true, text: 'DI [%]'
                }
              }
            },
            plugins: {title: {display: true, text: `Drought Index - ${date}`
              }
            }
          }
        });
      }