mapboxgl.accessToken =
    'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    zoom: 11,
    center: [-122.32, 47.6002614]
});

map.addControl(new mapboxgl.NavigationControl());

map.on('load', () => {

    map.addSource('basemap-tiles', {
        'type': 'raster',
        'tiles': [
            '/assets/modified-basemap/{z}/{x}/{y}.png'
        ],
        'tileSize': 256
    });

    map.addSource('data-tiles', {
        'type': 'raster',
        'tiles': [
            '/assets/parking-data/{z}/{x}/{y}.png'
        ],
        'tileSize': 256
    });

    map.addSource('basemap-with-data', {
        'type': 'raster',
        'tiles': [
            '/assets/basemap-with-data/{z}/{x}/{y}.png'
        ],
        'tileSize': 256
    });

    map.addSource('uw-basemap', {
        'type': 'raster',
        'tiles': [
            '/assets/uw-basemap/{z}/{x}/{y}.png'
        ],
        'tileSize': 256
    });

    map.addLayer({
        'id': 'basemap',
        'type': 'raster',
        'layout': {
            'visibility': 'none'
        },
        'source': 'basemap-tiles'
    });

    map.addLayer({
        'id': 'parking-data',
        'type': 'raster',
        'layout': {
            'visibility': 'none'
        },
        'source': 'data-tiles'
    });

    map.addLayer({
        'id': 'data-map',
        'type': 'raster',
        'layout': {
            'visibility': 'none'
        },
        'source': 'basemap-with-data'
    });

    map.addLayer({
        'id': 'uw',
        'type': 'raster',
        'layout': {
            'visibility': 'none'
        },
        'source': 'uw-basemap'
    });
});

map.on('idle', () => {
    if (!map.getLayer('basemap') || !map.getLayer('parking-data') || !map.getLayer('data-map') || !map.getLayer('uw')) {
        return;
    }

    const toggleableLayerIds = ['basemap', 'parking-data', 'data-map', 'uw'];

    for (const id of toggleableLayerIds) {
        if (document.getElementById(id)) {
            continue;
        }

        const link = document.createElement('a');
        link.id = id;
        link.href = '#';
        link.textContent = id;
        link.className = 'inactive';

        link.onclick = function (e) {
            const clickedLayer = this.textContent;
            e.preventDefault();
            e.stopPropagation();

            const visibility = map.getLayoutProperty(
                clickedLayer,
                'visibility'
            );

            if (visibility === 'visible') {
                map.setLayoutProperty(clickedLayer, 'visibility', 'none');
                this.className = '';
            } else {
                this.className = 'active';
                map.setLayoutProperty(
                    clickedLayer,
                    'visibility',
                    'visible'
                );
            }
        };

        const layers = document.getElementById('menu');
        layers.appendChild(link);
    }
});