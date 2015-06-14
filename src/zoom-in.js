var viewer = new Cesium.Viewer('cesiumContainer');

var eventHandler, mousePosition;
var scene = viewer.scene;
var ellipsoid = scene.globe.ellipsoid;

function calculateMidPoint(center, mousePoint){
  var p1 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, center);
  var p2 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, mousePoint);

  return scene.camera.pickEllipsoid( new Cesium.Cartesian2(
  (p1.x + p2.x) /2 ,  (p1.y + p2.y) /2 ), ellipsoid);
}

function calculateDoublePoint(center, mousePoint){
  var p1 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, center);
  var p2 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, mousePoint);

  return scene.camera.pickEllipsoid( new Cesium.Cartesian2(
  (2 * p1.x - p2.x),  (2 * p1.y - p2.y)), ellipsoid);
}

viewer.scene.screenSpaceCameraController.enableZoom = false;
eventHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

eventHandler.setInputAction(function (event) {
    mousePosition = event.endPosition;
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

eventHandler.setInputAction(function (zoomAmount) {
    var center = scene.camera.positionCartographic;
    center = ellipsoid.cartographicToCartesian(center);
    var mousePoint = scene.camera.pickEllipsoid(mousePosition,ellipsoid);
    var zoom = 2;
    var destination;

    if(zoomAmount > 0){
        destination = calculateMidPoint(center, mousePoint);
    }else{
        destination = calculateDoublePoint(center, mousePoint);
        zoom = 1/zoom;
    }
    var height = scene.camera.getMagnitude() / zoom;
    destination = ellipsoid.cartesianToCartographic(destination);

    scene.camera.flyTo({
        destination: Cesium.Cartesian3.fromRadians(destination.longitude, destination.latitude, height),
        duration: 0.5
    });

}, Cesium.ScreenSpaceEventType.WHEEL);