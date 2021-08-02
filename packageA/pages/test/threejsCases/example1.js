export function renderExample1(canvas, THREE) {
//threejs中有三个最基本的概念，就是下述camera、 scene、renderer，分别表示相机、场景与渲染器，怎么理解呢？其实就是模仿现实物理世界，就像我们通过相机去拍摄照片一样，需要一个相机，也需要要拍摄的场景，还需要的其实是一种介质或者叫关联，以便计算机能够知道相机看的是哪个场景或者能够看到哪个场景
    var camera, scene, renderer;
    var cube;
    init();
    animate();
    function init() {
        //获取相机对象，PerspectiveCamera表示一种透视照相机；第一个参数表示这个相机的广角，就是能看到的角度；第二个参数表示相机获取到的视野要呈现的长宽比，一般用画布的长宽比就可以呈现原场景比例；第三个参数与第四个参数分别表示远近切面，意思是这个（1~1000）距离之外的场景就不再显示了
        camera = new THREE.PerspectiveCamera(100, canvas.width / canvas.height, 1, 1000);
        //获取场景对象
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f0f0);
        //获取渲染器对象
        renderer = new THREE.WebGLRenderer();
        //设置渲染器的分辨率
        renderer.setPixelRatio(wx.getSystemInfoSync().pixelRatio);
        //设置渲染区域的宽高
        renderer.setSize(canvas.width, canvas.height);
        //接下来我们要创建一个立方体，并把它添加到场景中
        //BoxGeometry是一个几何长方体，通过它可以获取一个立方体对象
        var geometry = new THREE.BoxGeometry(10, 10, 10);
        //MeshBasicMaterial是网状基础材质
        var material = new THREE.MeshBasicMaterial({ color: 0xed3ed3 });
        //组合成一个粉色的立方体
        cube = new THREE.Mesh(geometry, material);
        //添加进场景
        scene.add(cube);
    }
    function animate() {
        //通过变化下列两个值，来更改立方体状态
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        //这是通过调用canvas的requestAnimationFrame方法进行周期性渲染，渲染频率在60次每秒，
        canvas.requestAnimationFrame(animate);
        //如果只是要绘制一个静止的立方体，调用renderer渲染就ok了
        renderer.render(scene, camera);
    }
}
