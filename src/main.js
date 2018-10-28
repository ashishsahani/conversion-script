import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource';
import VueCookie from 'vue-cookie';

Vue.config.productionTip = false
    // global declare
Vue.use(VueCookie);
Vue.use(VueResource);

let instance = new Vue({
    render: h => h(App)
}).$mount('#app')

/**
 * Open vue instance to window object so that it can be called from any script tag
 */
let initFunct = instance.$children[0].CRVNINIT;
//initFunct()

// opened the inner vue methods to be accessible by window object 
//window.CRVN = CRVN;
window.CRVN = instance.$children[0].CRVN;

CRVN('sales');