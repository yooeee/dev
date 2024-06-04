class H_Cluster {
    constructor(map, options) {
        this.map = map;
        this.layer = null;
        this.layerName = options.layerName ? options.layerName : 'h_cluster';
        this.showLevelLength = options.showLevelLength ? options.showLevelLength : 3;
        this.sdLev = 10;
        this.sggLev = 14;
        this.dataVectorSource = null;
        this.sdVectorSource = null;
        this.sggVectorSource = null;
        this._tempTag = 0;
        this.clusterScale = options.clusterScale ? options.clusterScale : 0;
        this.init();
    }

    init() {
        const that = this;
        this.map.on('moveend', event => {
            that._updateCluster();
        });
    }

    createAdmbdClusterLayer(datas, sdDatas, sggDatas) {
        this._removeCluster();
        this.layer = new ol.layer.Vector({
            properties: {
                name: this.layerName,
            },
            zIndex: 9999,
        });
        this.map.addLayer(this.layer);

        if (datas.length === 0) {
            return false;
        }

        
        this.dataVectorSource = this._createDataVectorSource(datas);
    
        this.sggVectorSource = this._createSggVectorSource(sggDatas);

        this.sdVectorSource = this._createSdVectorSource(sdDatas);
    
       

        this._updateCluster();
       
    }

    _createSdVectorSource(datas) {
        let sdVectorSource = new ol.source.Vector();
        datas.forEach(sd => {
            const count = sd.count;
            if (count == 0) {
                return;
            }
            let size = 100;

            if (this.clusterScale == 0) {
                if (count < 10) {
                    size = 20;
                } else if (count < 50) {
                    size = 30;
                } else if (count < 100) {
                    size = 40;
                } else {
                    size = 50;
                }
            } else {
                if (count < 10) {
                    size = this.clusterScale;
                } else if (count < 50) {
                    size = this.clusterScale * 1.5;
                } else if (count < 100) {
                    size = this.clusterScale * 2;
                } else {
                    size = this.clusterScale * 3;
                }
            }

            if (sd.lon && sd.lat) {
                
                const coordinate = ol.proj.transform([parseFloat(sd.lon), parseFloat(sd.lat)], 'EPSG:4326', 'EPSG:3857');
                const feature = new ol.Feature({
                    geometry: new ol.geom.Point(coordinate),
                    name: 'sd_marker',
                    lon: sd.lon,
                    lat: sd.lat,
                    bdCode: sd.code,
                    properties: '',
                });

                const style = OL_STYLE.SD_CLUSTER_COLOR.find(color => color.bjcd === sd.code);
                const fillColor = style ? style.clColor : 'gray';
                feature.setStyle(
                    new ol.style.Style({
                        image: new ol.style.Circle({
                            radius: size,
                            fill: new ol.style.Fill({ color: fillColor }),
                            stroke: new ol.style.Stroke({ color: 'white', width: 0.8 }),
                        }),
                        text: new ol.style.Text({
                            text: style.name.toString() + '\n' + sd.count.toString(),
                            fill: new ol.style.Fill({ color: '#000' }),
                            stroke: new ol.style.Stroke({ color: '#fff', width: 3 }),
                            font: 'Bold 14px Arial',
                        }),
                    })
                );
                sdVectorSource.addFeature(feature);
            }
        });
        return sdVectorSource;
    }

    _createSggVectorSource(sggDatas) {
        let sggVectorSource = new ol.source.Vector();
        sggDatas.forEach(sgg => {
            const count = sgg.count;
            if (count == 0) {
                return;
            }
            let size = 40;
            if (count < 10) {
                size = 20;
            } else if (count < 50) {
                size = 30;
            } else if (count < 100) {
                size = 40;
            } else {
                size = 60;
            }

            if (sgg.lon && sgg.lat) {
                const coordinate = ol.proj.transform([parseFloat(sgg.lon), parseFloat(sgg.lat)], 'EPSG:4326', 'EPSG:3857');
                const feature = new ol.Feature({
                    geometry: new ol.geom.Point(coordinate),
                    name: 'sgg_marker',
                    lon: sgg.lon,
                    lat: sgg.lat,
                    bdCode: sgg.code,
                    properties: '',
                });

                const style = OL_STYLE.SD_CLUSTER_COLOR.find(color => color.bjcd === sgg.code.substring(0, 2));
                const fillColor = style ? style.clColor : 'gray';

                feature.setStyle(
                    new ol.style.Style({
                        image: new ol.style.Circle({
                            radius: size,
                            fill: new ol.style.Fill({ color: fillColor }),
                            stroke: new ol.style.Stroke({ color: 'white', width: 0.8 }),
                        }),
                        text: new ol.style.Text({
                            text: sgg.name.toString() + '\n' + sgg.count.toString(),
                            fill: new ol.style.Fill({ color: '#000' }),
                            stroke: new ol.style.Stroke({ color: '#fff', width: 3 }),
                            font: 'Bold 14px Arial',
                        }),
                    })
                );
                sggVectorSource.addFeature(feature);
            }
        });
        return sggVectorSource;
    }

    _createDataVectorSource(datas) {
    let vectorSource = new ol.source.Vector();
    datas.forEach(data => {
        // 좌표를 EPSG:3857으로 변환
        const coordinate = ol.proj.fromLonLat([parseFloat(data.lon), parseFloat(data.lat)]);
        const feature = new ol.Feature({
            geometry: new ol.geom.Point(coordinate),
            name: 'marker',
            lon: data.lon,
            lat: data.lat,
            bdCode: data.admCode,
            properties: '',
        });

        // 마커 이미지 설정
        feature.setStyle(new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 1], // 이미지의 앵커 위치
                src: '/img/marker.png', // 마커 이미지 경로
                scale: 0.05 // 이미지 크기 조정 (필요에 따라 조정 가능)
            }),
        }));

        vectorSource.addFeature(feature);
    });
    return vectorSource;
}


    _updateCluster() {

        const zoomLevel = this.map.getView().getZoom();
        if(this.sdVectorSource != null && this.sggVectorSource != null && document.getElementById('type1').value != 'my'){
            if (zoomLevel < this.sdLev) {
                this.layer.setSource(this.sdVectorSource);
                
            } else if (zoomLevel <= this.sggLev) {
                this.layer.setSource(this.sggVectorSource);
                
            } else if (this.dataVectorSource) {
                this.layer.setSource(this.dataVectorSource);
            } else {
                this.layer.setSource(this.sggVectorSource);
            }
        }
        // if(document.getElementById('type1').value == 'my'){
        //     this.layer.setSource(this.dataVectorSource);
        // }
       
    }

    showLayer(name) {
        this.map.getAllLayers().forEach(layer => {
            if (layer.get('name') == name) layer.setVisible(true);
        });
    }

    hideLayer(name) {
        this.map.getAllLayers().forEach(layer => {
            if (layer.get('name') == name) layer.setVisible(false);
        });
    }

    moveCameraByClusterClick(feature, padding) {
        const clusterName = feature.get('name');

        if (clusterName === 'sd_marker') {
            this._moveSggClusterExtent(feature, padding);
        } else if (clusterName === 'sgg_marker' && this.dataVectorSource) {
            this._moveMarkerExtent(feature, padding);
        }
    }

    _moveSggClusterExtent(feature, padding) {
        const sdBdCodePrefix = feature.get('bdCode').substring(0, 2);
        const extent = ol.extent.createEmpty();
        const that = this;
        const sggFeatures = this.sggVectorSource.getFeatures().filter(sggFeature => {
            return sggFeature.get('bdCode').substring(0, 2) === sdBdCodePrefix;
        });
        sggFeatures.forEach(sggFeature => {
            ol.extent.extend(extent, sggFeature.getGeometry().getExtent());
        });

        if (sggFeatures.length == 1 && this.dataVectorSource) {
            this._moveOneTypeSggExtent(sdBdCodePrefix);
        } else {
            this.map.getView().fit(extent, {
                padding: padding || [70, 70, 70, 70],
                maxZoom: that.sggLev,
                duration: 900,
                callback: function () {
                    if (that.map.map.getView().getZoom() < that.sdLev) {
                        that._tempTag = 1;
                        that.layer.setSource(that.sggVectorSource);
                    }
                },
            });
        }
    }

    _moveMarkerExtent(feature) {
        const sggBdCodePrefix = feature.get('bdCode').substring(0, 5);
        const extent = ol.extent.createEmpty();
        const that = this;
        const markerFeatures = this.dataVectorSource.getFeatures().filter(markerFeature => {
            const bdCode = markerFeature.get('bdCode');

            // 현재 데이터에 bdCode가 null인 값이 존재해서 추가함.
            if (bdCode === null || typeof bdCode === 'undefined') {
                return false;
            }
            return bdCode.substring(0, 5) === sggBdCodePrefix;
        });
        if (markerFeatures.length > 0) {
            markerFeatures.forEach(markerFeature => {
                ol.extent.extend(extent, markerFeature.getGeometry().getExtent());
            });
            this.map.getView().fit(extent, {
                padding: [70, 70, 70, 70],
                duration: 900,
                maxZoom: this.sggLev + 3,
                callback: function () {
                    if (that.map.map.getView().getZoom() <= that.sggLev) {
                        that._tempTag = 1;
                        that.layer.setSource(that.dataVectorSource);
                    }
                },
            });
        }
    }

    _moveOneTypeSggExtent(getBdCode) {
        const that = this;
        const markerFeatures = this.dataVectorSource.getFeatures().filter(markerFeature => {
            const bdCode = markerFeature.get('bdCode');

            // 현재 데이터에 bdCode가 null인 값이 존재해서 추가함.
            if (bdCode === null || typeof bdCode === 'undefined') {
                return false;
            }
            return bdCode.substring(0, 2) === getBdCode;
        });
        let extent = ol.extent.createEmpty();
        if (markerFeatures.length > 0) {
            markerFeatures.forEach(markerFeature => {
                ol.extent.extend(extent, markerFeature.getGeometry().getExtent());
            });
            this.map.getView().fit(extent, {
                padding: [70, 70, 70, 70],
                duration: 900,
                maxZoom: this.sggLev + 3,
                callback: function () {
                    if (that.map.map.getView().getZoom() <= that.sggLev) {
                        that._tempTag = 1;
                        that.layer.setSource(that.dataVectorSource);
                    }
                },
            });
        }
    }

    _removeCluster() {
        this.removeLayer(this.layerName);
        this.dataVectorSource = null;
        this.sdVectorSource = null;
        this.sggVectorSource = null;
    }


    removeLayer(name) {
        const that = this;
        this.map.getAllLayers().forEach(layer => {
            if (layer && layer.get('name') == name) {
                that.map.removeLayer(layer);
            }
        });
    }
}
