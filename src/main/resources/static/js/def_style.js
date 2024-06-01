

class Ol_style {
    constructor() {
        this.DEFAULT_POINT = new ol.style.Style({
            image: new ol.style.Circle({
                radius: 10,
                fill: new ol.style.Fill({ color: 'pink' }),
            }),
        });

        this.BS_ICON = new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 25],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: '/img/map/map_marker_blue_05.png',
                scale: 1,
            }),
        });

        this.MA_ICON = new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 25],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: '/img/map/map_marker_blue_01.png',
                scale: 1,
            }),
        });

        this.DI_ICON = new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 25],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: '/img/map/map_marker_blue_02.png',
                scale: 1,
            }),
        });

        this.CO_ICON = new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 25],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: '/img/map/map_marker_blue_03.png',
                scale: 1,
            }),
        });

        this.SV_ICON = new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 25],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: '/img/map/map_marker_blue_04.png',
                scale: 1,
            }),
        });

        this.MA_F_ICON = new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 25],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: '/img/map/map_marker_blue_06.png',
                scale: 1,
            }),
        });

        this.BS_ICON_SELECT = new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 25],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: '/img/map/map_marker_darkblue_05.png',
                scale: 1,
            }),
        });
        this.MA_ICON_SELECT = new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 25],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: '/img/map/map_marker_darkblue_01.png',
                scale: 1,
            }),
        });

        this.DI_ICON_SELECT = new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 25],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: '/img/map/map_marker_darkblue_02.png',
                scale: 1,
            }),
        });

        this.CO_ICON_SELECT = new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 25],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: '/img/map/map_marker_darkblue_03.png',
                scale: 1,
            }),
        });

        this.SV_ICON_SELECT = new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 25],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: '/img/map/map_marker_darkblue_04.png',
                scale: 1,
            }),
        });

        this.MA_F_ICON_SELECT = new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 25],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: '/img/map/map_marker_darkblue_06.png',
                scale: 1,
            }),
        });

        this.BS_GRAY_ICON = new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 25],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: '/img/map/map_marker_grey_05.png',
                scale: 1,
            }),
        });

        this.MA_GRAY_ICON = new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 25],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: '/img/map/map_marker_grey_01.png',
                scale: 1,
            }),
        });

        this.DI_GRAY_ICON = new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 25],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: '/img/map/map_marker_grey_02.png',
                scale: 1,
            }),
        });

        this.CO_GRAY_ICON = new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 25],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: '/img/map/map_marker_grey_03.png',
                scale: 1,
            }),
        });

        this.SV_GRAY_ICON = new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 25],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: '/img/map/map_marker_grey_04.png',
                scale: 1,
            }),
        });

        this.MA_F_GRAY_ICON = new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 25],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: '/img/map/map_marker_grey_06.png',
                scale: 1,
            }),
        });

        this.RED_POINT = new ol.style.Style({
            image: new ol.style.Circle({
                radius: 10,
                fill: new ol.style.Fill({ color: 'red' }),
            }),
        });
        this.SD_POINT = new ol.style.Style({
            image: new ol.style.Circle({
                radius: 10,
                fill: new ol.style.Fill({ color: 'red' }),
            }),
        });
        this.SGG_POINT = new ol.style.Style({
            image: new ol.style.Circle({
                radius: 10,
                fill: new ol.style.Fill({ color: 'blue' }),
            }),
        });
        this.PLACE_POINT = new ol.style.Style({
            image: new ol.style.Circle({
                radius: 10,
                fill: new ol.style.Fill({ color: 'green' }),
            }),
        });

        this.SD_CLUSTER_COLOR = [
            {
                bjcd: '11',
                name: '서울',
                color: '#3C8DBC',
                clColor: [60, 141, 188, 0.5],
            },
            {
                bjcd: '26',
                name: '부산',
                color: '#00A65A',
                clColor: [0, 166, 90, 0.5],
            },
            {
                bjcd: '27',
                name: '대구',
                color: '#F56954',
                clColor: [245, 105, 84, 0.5],
            },
            {
                bjcd: '28',
                name: '인천',
                color: '#9954CC ',
                clColor: [153, 84, 204, 0.5],
            },
            {
                bjcd: '29',
                name: '광주',
                color: ' #00C0EF',
                clColor: [0, 192, 239, 0.5],
            },
            {
                bjcd: '30',
                name: '대전',
                color: '#6C7386',
                clColor: [108, 115, 134, 0.5],
            },
            {
                bjcd: '31',
                name: '울산',
                color: '#005ED1',
                clColor: [0, 94, 209, 0.5],
            },
            {
                bjcd: '36',
                name: '세종',
                color: '#FE9D1F',
                clColor: [254, 157, 31, 0.5],
            },
            {
                bjcd: '41',
                name: '경기',
                color: '#FB453A',
                clColor: [251, 69, 58, 0.5],
            },
            {
                bjcd: '51',
                name: '강원',
                color: '#544FAC',
                clColor: [84, 79, 172, 0.5],
            },
            {
                bjcd: '43',
                name: '충북',
                color: '#00FCA8',
                clColor: [0, 252, 168, 0.5],
            },
            {
                bjcd: '44',
                name: '충남',
                color: '#94E9F0',
                clColor: [148, 233, 240, 0.8],
            },
            {
                bjcd: '45',
                name: '전북',
                color: '#FFB28D',
                clColor: [255, 178, 141, 0.5],
            },
            {
                bjcd: '46',
                name: '전남',
                color: '#59FF4A',
                clColor: [137, 252, 66, 0.6],
            },
            {
                bjcd: '47',
                name: '경북',
                color: '#003027',
                clColor: [0, 48, 39, 0.5],
            },
            {
                bjcd: '48',
                name: '경남',
                color: '#27006A',
                clColor: [39, 0, 106, 0.5],
            },
            {
                bjcd: '50',
                name: '제주',
                color: '#008F96',
                clColor: [0, 143, 150, 0.5],
            },
        ];

        this.BD_AREA = [
            // 외곽 두꺼운선
            new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(49, 49, 49, 0.5)',
                }),
                stroke: new ol.style.Stroke({
                    color: '#ffffff',
                    width: 4.5, 
                }),
            }),
            // 외곽 얇은선
            new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: '#16181d',
                    width: 3,
                }),
            }),
        ]

        this.BD_AREA_MAIN = [

            new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 165, 0, 0.2)',
                }),
                stroke: new ol.style.Stroke({
                    color: 'orange',
                    width: 3,
                }),
            }),
        ];

        //메인화면 지도 범례 색깔(임시)
        this.MAIN_COLOR_LEGEND_ONE = 'rgba(236,97,42,1)';
        this.MAIN_COLOR_LEGEND_TWO = 'rgba(240,131,66,1)';
        this.MAIN_COLOR_LEGEND_THREE = 'rgba(245,175,126,1)';
        this.MAIN_COLOR_LEGEND_FOUR = 'rgba(250,205,166,1)';
        this.MAIN_COLOR_LEGEND_FIVE = 'rgba(253,226,207,1)';
        this.MAIN_COLOR_LEGEND_SIX = 'rgba(255,255,255,1)';

        //메인화면 지도 광역시도 외곽선(임시)
        this.MAIN_SD_STROKE = [
            new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'black',
                    width: 1,
                }),
            }),
        ];
        

    }



    getGrayIconStyleByType(type) {
        switch (type) {
            case 'bs':
                return OL_STYLE.BS_GRAY_ICON;
            case 'ma':
                return OL_STYLE.MA_GRAY_ICON;
            case 'ma_f':
                return OL_STYLE.MA_F_GRAY_ICON;
            case 'di':
                return OL_STYLE.DI_GRAY_ICON;
            case 'co':
                return OL_STYLE.CO_GRAY_ICON;
            case 'sv':
                return OL_STYLE.SV_GRAY_ICON;
        }
    }

    getIconStyleByType(type) {
        switch (type) {
            case 'bs':
                return OL_STYLE.BS_ICON;
            case 'ma':
                return OL_STYLE.MA_ICON;
            case 'ma_f':
                return OL_STYLE.MA_F_ICON;
            case 'di':
                return OL_STYLE.DI_ICON;
            case 'co':
                return OL_STYLE.CO_ICON;
            case 'sv':
                return OL_STYLE.SV_ICON;
        }
    }

    getDarkBlueIconStyleByType(type) {
        switch (type) {
            case 'bs':
                return OL_STYLE.BS_ICON_SELECT;
            case 'ma':
                return OL_STYLE.MA_ICON_SELECT;
            case 'ma_f':
                return OL_STYLE.MA_F_ICON_SELECT;
            case 'di':
                return OL_STYLE.DI_ICON_SELECT;
            case 'co':
                return OL_STYLE.CO_ICON_SELECT;
            case 'sv':
                return OL_STYLE.SV_ICON_SELECT;
        }
    }
}

const OL_STYLE = new Ol_style();
