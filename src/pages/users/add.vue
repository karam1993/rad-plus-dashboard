<template>
  <div v-permissions="'user create'" class="d-flex flex-grow-1 flex-column">
    <v-card>
      <v-card-text>
        <v-form ref="form" >
          <v-row>
            <v-col cols="12" md="6" class="pb-0 pt-1">
              <v-text-field
                v-model="dataForm.name"
                :rules="[required]"
                :label="$t('user.name')"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 pt-1">
              <v-text-field
                v-model="dataForm.email"
                :rules=" [emailSyntax]"
                :label="$t('user.email')"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 pt-1">
              <v-text-field
                v-model="dataForm.mobile"
                :rules=" [required , phoneNumber]"
                :label="$t('user.mobile')"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 pt-1">
              <v-autocomplete
                v-model="dataForm.roles"
                :rules="[]"
                :label="$t('user.roles')"
                outlined
                multiple
                :items="roleItems"
                item-text="name"
                item-value="id"
                dense
                chips
                small-chips
              ></v-autocomplete>
            </v-col>
            
            <v-col cols="12" md="6" class="pb-0 pt-1">
              <v-text-field
                v-model="dataForm.password"
                :type="show1 ? 'text' : 'password'"
                :rules="[required]"
                :label="$t('user.password')"
                outlined
                dense
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="show1 = !show1"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 pt-1">
              <v-text-field
                v-model="dataForm.password_confirm"
                :type="show2 ? 'text' : 'password'"
                :rules="[required]"
                :label="$t('user.password_confirm')"
                outlined
                dense
                :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="show2 = !show2"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="pb-0 pt-1">
              <v-switch
                v-model="dataForm.status"
                class="mt-0 pt-1"
                :label="$t('user.status')"
                outlined
                inset
              ></v-switch>
            </v-col>
            <v-col cols="12" >
              <v-btn :loading="loadingSave" color="primary" @click="save">
                {{ $t('common.save') }}
              </v-btn>
            </v-col>
            
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import Rules from '~/apps/validation/index'
export default {
  mixins: [Rules] ,
  data() {
    return {
      dataForm:{
        name : '' ,
        email : '' ,
        mobile : '',
        status : true ,
        password : '',
        password_confirm : '' ,
        roles : [] 
      },
      show1 : false ,
      show2 : false ,
      roleItems : [] ,
      loadingSave : false
      
    }
  },
  created() {
    this.getRols()
  },
  methods: {
    getRols() {
      this.$axios
        .$get('/admin/role?page[size]=100000')
        .then((res) => {
          this.roleItems = res.data
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
    },
    save() {
      if (this.$refs.form.validate()) {
        this.loadingSave = true
        this.$axios
          .$post('/admin/user', this.dataForm)
          .then((res) => {
            this.$store.dispatch('showSuccess', this.$t('common.success'))
            this.$router.push('/users')
          })
          .catch((err) => {
            this.$store.dispatch('showError', err.response.data.message)
          })
          .finally(() => {
            this.loadingSave = false
          })
      } else {
        this.$store.dispatch('showError', this.$t('rules.dataNotValid'))
      }
    }
  }
}
</script>