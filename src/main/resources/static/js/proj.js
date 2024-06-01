// proj4js 라이브러리를 사용하여 EPSG:2097 좌표계를 정의합니다.
proj4.defs("EPSG:2097", "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=200000 +y_0=500000 +ellps=GRS80 +units=m +no_defs");
proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs");
// 좌표계 정의
proj4.defs("EPSG:3857", "+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs");
ol.proj.proj4.register(proj4);

