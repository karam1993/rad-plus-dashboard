/* eslint-disable prefer-destructuring */
import Vue from 'vue'
export default function ({ app }) {

  Vue.directive('permissions', (el, binding, vnode) => {
    const permissions = app.store.getters.permissionsList
    let result = false

    if (permissions) {
      result = permissions.includes(binding.value) ||  binding.value === ''
    }
    if (!result) {
      const comment = document.createComment(' ')

      Object.defineProperty(comment, 'setAttribute', {
        value: () => undefined
      })
      vnode.elm = comment
      vnode.text = ' '
      vnode.isComment = true
      vnode.context = undefined
      vnode.tag = undefined
      vnode.data.directives = undefined

      if (vnode.componentInstance) {
        vnode.componentInstance.$el = comment
      }

      if (el.parentNode) {
        el.parentNode.replaceChild(comment, el)
      }
    }
  })
}
