<template>
  <div v-permissions="'attribute viewAny'" class="d-flex flex-grow-1 flex-column">
    <DataTable
      :items="attributeItems"
      :header="attributeHeader"
      :loading="loadingItems"
      :other-action="[editAttribute] "
      :filters="attributeFilter"
      :pagination="attributePagination"
      :add="attributeAddPath"
      :permissions="attributePermissions"
      @editAttirbute="goToEditAttrubute($event)"
    />
  </div>
</template>

<script>
import DataTable from '~/components/elements/DataTable.vue'

export default {
  components:{
    DataTable
  },
  data() {
    return {
      attributeItems : [] ,
      attributeHeader : [
        { text: this.$t('attribute.mode'), value: 'mode' },
        { text: this.$t('attribute.name'), value: 'name' },
        { text: this.$t('attribute.operator'), value: 'operator' },
        { text: this.$t('attribute.value'), value: 'value' }
          
      ],
      attributePagination:{
        pagesCounts : 1 ,
        selectedPage : 1
      },
      attributeFilter : {
        status : false , // filter is required
        items : []
      },
      loadingItems : false ,
      attributeAddPath : `/cards/${this.$route.params.id}/add-attribute`,
      attributePermissions : {
        show : 'attribute view' ,
        showAny : 'attribute viewAny' ,
        add : 'attribute create' ,
        edit : 'attribute update' ,
        delete : 'attribute delete',
        restore : 'attribute restore' ,
        forceDelete : 'attribute forceDelete'
      },
      editAttribute : {
        text : this.$t('attribute.edit') ,
        permissions : 'attribute update' ,
        emit : 'editAttirbute'
      }

    }
  },
  created() {
    this.getAttributsForCards()
  },
  methods: {
    getAttributsForCards() {
      this.loadingItems = true
      this.$axios
        .$get(`/admin/card/${this.$route.params.id}/attribute`)
        .then((res) => {
          this.attributeItems = res.data
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
        .finally(() => {
          this.loadingItems = false
        })
    },
    goToEditAttrubute() {
      this.$router.push(`/cards/${this.$route.params.id}/edit-attribute`)
    }
  }
}
</script>