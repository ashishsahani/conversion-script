<template>
  <div id="app">
    
  </div>
</template>

<script>


export default {
  name: 'app',
  data: function (){
    return {
      clientIp: '',
      referrer: ''
    }
  },
  components: {
    
  },
  methods: {
    CRVN: function(type){
      let typeOfConversionsAccepted= ['pageview', 'sales', 'lead', 'purchase']
      if (typeOfConversionsAccepted.indexOf(type)!==-1){
        let cookieData = JSON.parse(this.$cookie.get('__cnrvscrpt'));
        if (cookieData){
          cookieData.type = type
          // send this data to linkwizard 
          console.log(cookieData)
        }
      }
    },
    CRVNINIT : async function(){
      try {
        let data = {
          isInitDone : false,
          clients : []
        }
        let getip = await this.getClientIp();
        //getip && console.log(this.clientIp );
        
        let isReferedFromlnkw = await this.checkReferrer();
       
        // checking if a cookie is already stored or not
        let cookieData = JSON.parse(this.$cookie.get('__cnrvscrpt'))
        if (cookieData && cookieData.isInitDone && this.referrer){
          let clients = cookieData.clients
          
          // checking the referrer is same or different 
          let isReferrerAlreadyExists = clients.filter(client => client.referrer === this.referrer);

          if(!isReferrerAlreadyExists.length) {
            data.clients = cookieData.clients ;
            data.clients.push({ip : this.clientIp, referrer : this.referrer});
            this.$cookie.set('__cnrvscrpt', JSON.stringify(data));
          }
        } else {
          // if first time a user visit
          data.isInitDone = true
          data.clients.push({ip:this.clientIp, referrer : this.referrer})
          this.$cookie.set('__cnrvscrpt', JSON.stringify(data));
        }
      } catch (error) {
        console.log(error)
      }
    },

    checkReferrer: function(){
      // checking where the user coming from
      //@Todo check the referrer is from linkwizard  ie for custom domain
      let domain = document.referrer
      return new Promise((resolve, reject)=>{
          if(domain && (domain.search('linkwizard')!==-1 || domain.search('lnkw.co')!==-1)){
            this.referrer = document.referrer
            return resolve(true)
        } else {
          return reject(false)
        }
      })
    },

    getClientIp: function(){
      // getting client ip for use later
      return new Promise((resolve, reject)=>{
        this.$http.get('http://icanhazip.com')
        .then(res=> {
          this.clientIp = res.body.trim()
          resolve(true)
        })
        .catch(err=>{
          reject(false)
          //console.log(err)
        });
      })
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
