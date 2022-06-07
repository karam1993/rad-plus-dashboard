<template>
  <div v-permissions="'attribute create'" class="d-flex flex-grow-1 flex-column">
    <v-card>
      <v-card-text>
        <v-form ref="form" >
          <div v-for="(item , index ) in dataForm" :key="index">
            <v-row>
              <v-col cols="12" md="1" class="pb-0 pt-1 mx-0">
                <v-btn icon color="error" @click="removeRow(index)"> <v-icon>mdi-trash-can-outline</v-icon></v-btn>
              </v-col>
              <v-col cols="12" md="2" class="pb-0 pt-1 px-0">
                <v-autocomplete
                  v-model="item.mode"
                  :rules="[required]"
                  :label="$t('attribute.mode')"
                  :items="['check' , 'reply']"
                  outlined
                  dense
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="3" class="pb-0 pt-1">
                <v-autocomplete
                  v-model="item.attributeid"
                  :rules="[required]"
                  :loading="loadingItems"
                  item-text="name"
                  item-value="attributeid"
                  :items="attributes"
                  :label="$t('attribute.attribute')"
                  outlined
                  dense
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="3" class="pb-0 pt-1">
                <v-text-field
                  v-model="item.operator"
                  :rules="[required]"
                  :label="$t('attribute.operator')"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3" class="pb-0 pt-1">
                <v-text-field
                  v-model="item.value"
                  :rules="[required]"
                  :label="$t('attribute.value')"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
            </v-row>
          </div>
          <v-btn :disabled="dataForm.length == 0" :loading="loadingSave" color="primary" @click="save">
            {{ $t('common.save') }}
          </v-btn>
          <v-btn color="primary" @click="addRow">
            {{ $t('common.addRow') }}
          </v-btn>
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
      dataForm : [{
        mode : '' ,
        operator : '' ,
        value : '' ,
        attributeid : '' 
      }],
      attributes : [] ,
      loadingItems : false ,
      loadingSave : false
    }
  },
  created() {
    this.getAttribute()
  },
  methods: {
    getAttribute() {
      this.loadingItems = true 
      this.$axios
        .$get('/admin/attribute')
        .then((res) => {
          this.attributes = res.data
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
        .finally(() => {
          this.loadingItems = false
        })
    },
    save() {
      if (this.$refs.form.validate()) {
        this.loadingSave = true
        
        this.$axios
          .$post(`/admin/card/${this.$route.params.id}/attribute`, { 'attribute' : this.dataForm })
          .then((res) => {
            this.$store.dispatch('showSuccess', this.$t('common.success'))
            this.$router.push(`/cards/${this.$route.params.id}/attribute`)
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
      
    },
    addRow () {
      this.dataForm.push({
        mode : '' ,
        operator : '' ,
        value : '' ,
        attributeid : '' 
      })
    },
    removeRow(index) {
      this.dataForm.splice(index, 1)
    }
  }
}
</script>