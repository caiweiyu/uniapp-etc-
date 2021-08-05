<template>
  <view>
      中石化列表
  </view>
</template>

<script>
import * as API from "@/interfaces/sinoepc";
export default {
    data(){
        return {
            list:[]
        }
    },
    methods: {
        async get_axios_station(){
            let res = await API.axios_station({
                source_channel:2
            });
            let {code,msg,data} = res;
            if(code == 0){
                this.list = data;
                console.log(this.list)
            }
        }
    },
    mounted() {
        this.get_axios_station()    
    },
}
</script>

<style>

</style>