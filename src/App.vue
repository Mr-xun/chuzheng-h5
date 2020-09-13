<template>
    <div id="app">
        <router-view />
    </div>
</template>
<script>
export default {
    mounted() {
        try {
            document.body.removeChild(document.getElementById('appLoading'))
            setTimeout(function () {
                document.getElementById('app').style.display = "block";
            }, 1000)
        } catch (e) {
            console.log(e)
        }
    }
}
</script>
<style lang="scss">
#app {
    height: 100%;
    width: 100%;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
</style>
