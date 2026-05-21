let timeSeriesChart;

function fetchTimeSeries(latlng, levels) {
    const geoserver_url = window.APP_CONFIG && window.APP_CONFIG.geoserverUrl;
    if (!geoserver_url) {
        console.error('GeoServer is not configured. Set GEOSERVER_URL in the deployment environment.');
        return;
    }

    const bbox = map.getBounds().toBBoxString();
    const width = map.getSize().x;
    const height = map.getSize().y;
    const x = map.latLngToContainerPoint(latlng).x.toFixed(0);
    const y = map.latLngToContainerPoint(latlng).y.toFixed(0);

    const dates = [
        '20180101', '20180201', '20180301', '20180401', '20180501',
        '20180601', '20180701', '20180801', '20180901', '20181001',
        '20181101', '20181201', '20190101', '20190201', '20190301',
        '20190401', '20190501', '20190601', '20190701', '20190801',
        '20190901', '20191001', '20191101', '20191201'
    ];

    const promises = [];

    dates.forEach(date => {
        levels.forEach(level => {
            const layerName = `${level}:${level}_${date}`;
            const url = `${geoserver_url}/wms?service=WMS&version=1.1.1&request=GetFeatureInfo&layers=${layerName}&query_layers=${layerName}&bbox=${bbox}&width=${width}&height=${height}&srs=EPSG:4326&info_format=application/json&x=${x}&y=${y}`;

            promises.push(
                fetch(url)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        if (data.features && data.features.length > 0) {
                            return {
                                date: date,
                                level: level,
                                value: data.features[0].properties.GRAY_INDEX
                            };
                        }
                        return null;
                    })
                    .catch(error => {
                        console.error(`Error al procesar la solicitud para ${layerName}`, error);
                        return null;
                    })
            );
        });
    });

    Promise.all(promises)
        .then(results => {
            const validResults = results.filter(result => result !== null);
            if (validResults.length > 0) {
                console.log('Datos de la serie temporal:', validResults);
                buildTimeSeriesGraph(validResults);
            } else {
                console.log('No se encontraron datos en la serie temporal');
            }
        })
        .catch(error => {
            console.error('Error al obtener los datos de la serie temporal:', error);
        });
}

function buildTimeSeriesGraph(data) {
    const labels = [...new Set(data.map(item => item.date))];
    const datasets = [
        {
            label: 'GWS',
            data: data.filter(item => item.level === 'gws').map(item => item.value),
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1, fill: false
        },
        {
            label: 'RTZSM',
            data: data.filter(item => item.level === 'rtzsm').map(item => item.value),
            borderColor: 'rgba(192, 75, 75, 1)',
            borderWidth: 1, fill: false
        },
        {
            label: 'SFSM',
            data: data.filter(item => item.level === 'sfsm').map(item => item.value),
            borderColor: 'rgba(75, 75, 192, 1)',
            borderWidth: 1, fill: false
        }
    ];

    const ctx = document.getElementById('timeSeriesChart').getContext('2d');
    if (timeSeriesChart) {
        timeSeriesChart.destroy();
    }
    timeSeriesChart = new Chart(ctx, {
        type: 'line',
        data: {labels: labels, datasets: datasets
        },
        options: {
            scales: {
                x: {title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {beginAtZero: true, title: {
                    display: true, 
                    text: 'DI [%]'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Time Series of Drought Index'
                }
            }
        }
    });
}
