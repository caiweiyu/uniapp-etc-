<template>
    <view class="content">
        <canvas type="webgl" id="webgl" style="width: 100%; height: 450px;" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd"></canvas>
<!--        <canvas type="webgl" id="webgl" style="width: 100%; height: 450px;"></canvas>-->
    </view>
</template>

<script>
    import { createScopedThreejs } from 'threejs-miniprogram'
    import { renderCube } from './threejsCases/cube'
    import { renderCubes } from './threejsCases/cubes'
    import { renderSphere } from './threejsCases/sphere'
    import { renderModel } from './threejsCases/model'
    import { renderExample1 } from './threejsCases/example1'

    export default {
        data() {
            return {
            }
        },
        onLoad() {
            wx.createSelectorQuery()
                .select('#webgl')
                .node()
                .exec((res) => {
                    const canvas = res[0].node
                    this.canvas = canvas
                    const THREE = createScopedThreejs(canvas)

                    // renderSphere(canvas, THREE)
                    // renderCube(canvas, THREE)
                    // renderCubes(canvas, THREE)
                    renderModel(canvas, THREE)
                    // renderExample1(canvas, THREE)
                })


        },
        methods: {
            start() {
                uni.onGyroscopeChange((res) => {
                    console.log('gyroData.rotationRate.x = ' + res.x)
                    console.log('gyroData.rotationRate.y = ' + res.y)
                    console.log('gyroData.rotationRate.z = ' + res.z)
                });
                uni.startGyroscope({
                    interval: "normal",
                    success() {
                        console.log('success')
                    },
                    fail() {
                        console.log('fail')
                    }
                })
            },
            stop(){
                uni.stopGyroscope({
                    success() {
                        console.log('stop success!')
                    },
                    fail() {
                        console.log('stop fail!')
                    }
                })
            },
            touchStart(e) {
                this.canvas.dispatchTouchEvent({...e, type:'touchstart'})
            },
            touchMove(e) {
                this.canvas.dispatchTouchEvent({...e, type:'touchmove'})
            },
            touchEnd(e) {
                this.canvas.dispatchTouchEvent({...e, type:'touchend'})
            }
        }
    }
</script>

<style></style>
