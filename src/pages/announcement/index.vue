<template>
  <div v-permissions="'send notification'" class="d-flex flex-grow-1 flex-column">
    <v-card>
      <v-card-title>
        {{$t('announcement.sendNotify')}}
      </v-card-title>
      <v-card-text class="pb-0">
        <v-form ref="form" >
          <v-textarea
            v-model="message"
            :label="$t('announcement.message')"
            outlined
            :rules="[required]"
            dense
            clearable
          >
          </v-textarea>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn class="mr-1" :loading="loading" color="primary" @click="sendNotify">{{
          $t(`common.send`)
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
import Rules from '~/apps/validation/index'

export default {
  mixins: [Rules] ,
  data() {
    return {
      message : '' ,
      loading : false
    }
  },
  methods: {
    sendNotify() {
      if (this.$refs.form.validate()) {
        this.loading = true
        this.$axios
          .$post('/admin/notification', { 'message' : this.message })
          .then((res) => {
            this.message = '' 
            this.$refs.form.resetValidation()
            this.$store.dispatch('showSuccess', this.$t('common.success'))
          })  
          .catch((err) => {
            this.$store.dispatch('showError', err.response.data.message)
          })
          .finally(() => {
            this.loading = false
          })
      } else {
        this.$store.dispatch('showError', this.$t('rules.dataNotValid'))
      }
    }
  }
}
</script>