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
        this.map.map.on('moveend', event => {
            that._updateCluster();
        });
    }

    createAdmbdClusterLayer(datas, sdDatas, sggDatas, img) {
        this._removeCluster();
        this.layer = new ol.layer.Vector({
            properties: {
                name: this.layerName,
            },
            zIndex: 9999,
        });
        this.map.map.addLayer(this.layer);

        if (datas.length === 0) {
            return false;
        }

        switch (this.showLevelLength.toString()) {
            case '3':
                this.dataVectorSource = this._createDataVectorSource(datas, img);
            case '2':
                this.sggVectorSource = this._createSggVectorSource(sggDatas);
            case '1':
                this.sdVectorSource = this._createSdVectorSource(sdDatas);
                break;
        }

        this._updateCluster();
        this.map.moveToHome();
    }

    _createSdVectorSource(datas) {
        let sdVectorSource = new ol.source.Vector();
        datas.forEach(sd => {
            const count = sd.properties.count;
            if (count == 0) {
                return;
            }
            let size = 0;

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

            if (sd.coord.lon && sd.coord.lat) {
                const coordinate = ol.proj.transform([parseFloat(sd.coord.lon), parseFloat(sd.coord.lat)], 'EPSG:4326', 'EPSG:3857');
                const feature = new ol.Feature({
                    geometry: new ol.geom.Point(coordinate),
                    name: 'sd_marker',
                    lon: sd.coord.lon,
                    lat: sd.coord.lat,
                    bdCode: sd.properties.bdCode,
                    properties: sd.properties ? sd.properties : '',
                });

                const style = OL_STYLE.SD_CLUSTER_COLOR.find(color => color.bjcd === sd.properties.bdCode);
                const fillColor = style ? style.clColor : 'gray';
                feature.setStyle(
                    new ol.style.Style({
                        image: new ol.style.Circle({
                            radius: size,
                            fill: new ol.style.Fill({ color: fillColor }),
                            stroke: new ol.style.Stroke({ color: 'white', width: 0.8 }),
                        }),
                        text: new ol.style.Text({
                            text: style.name.toString() + '\n' + sd.properties.count.toString(),
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
            const count = sgg.properties.count;
            if (count == 0) {
                return;
            }
            let size = 0;
            if (count < 10) {
                size = 20;
            } else if (count < 50) {
                size = 30;
            } else if (count < 100) {
                size = 40;
            } else {
                size = 60;
            }

            if (sgg.coord.lon && sgg.coord.lat) {
                const coordinate = ol.proj.transform([parseFloat(sgg.coord.lon), parseFloat(sgg.coord.lat)], 'EPSG:4326', 'EPSG:3857');
                const feature = new ol.Feature({
                    geometry: new ol.geom.Point(coordinate),
                    name: 'sgg_marker',
                    lon: sgg.coord.lon,
                    lat: sgg.coord.lat,
                    bdCode: sgg.properties.bdCode,
                    properties: sgg.properties ? sgg.properties : '',
                });

                const style = OL_STYLE.SD_CLUSTER_COLOR.find(color => color.bjcd === sgg.properties.bdCode.substring(0, 2));
                const fillColor = style ? style.clColor : 'gray';

                feature.setStyle(
                    new ol.style.Style({
                        image: new ol.style.Circle({
                            radius: size,
                            fill: new ol.style.Fill({ color: fillColor }),
                            stroke: new ol.style.Stroke({ color: 'white', width: 0.8 }),
                        }),
                        text: new ol.style.Text({
                            text: sgg.properties.name.toString() + '\n' + sgg.properties.count.toString(),
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

    _createDataVectorSource(datas, img) {
        let vectorSource = new ol.source.Vector();
        datas.forEach(data => {
            // 좌표를 EPSG:3857으로 변환
            const coordinate = ol.proj.transform([parseFloat(data.coord.lon), parseFloat(data.coord.lat)], 'EPSG:4326', 'EPSG:3857');
            const feature = new ol.Feature({
                geometry: new ol.geom.Point(coordinate),
                name: 'marker',
                lon: data.coord.lon,
                lat: data.coord.lat,
                bdCode: data.properties.admCode,
                properties: data.properties ? data.properties : '',
            });

            if (data.properties.imgType) {
                feature.setStyle(img[data.properties.imgType]);
            } else {
                feature.setStyle(img[0]);
            }

            vectorSource.addFeature(feature);
        });
        return vectorSource;
    }

    _updateCluster() {
        if (!this.layer || this._tempTag == 1) {
            this._tempTag = 0;
            return;
        }

        const zoomLevel = this.map.map.getView().getZoom();
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
            this.map.map.getView().fit(extent, {
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
            this.map.map.getView().fit(extent, {
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
            this.map.map.getView().fit(extent, {
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
        this.map.removeLayer(this.layerName);
        this.dataVectorSource = null;
        this.sdVectorSource = null;
        this.sggVectorSource = null;
    }
}
