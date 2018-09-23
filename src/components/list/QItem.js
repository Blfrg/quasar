import { RouterLinkMixin } from '../../mixins/router-link.js'

export default {
  name: 'QItem',

  mixins: [ RouterLinkMixin ],

  props: {
    clickable: Boolean,
    dense: Boolean,
    inset: Boolean,
    dark: Boolean,
    tabindex: {
      type: String,
      default: '0'
    },
    tag: {
      type: String,
      default: 'div'
    },
    disable: Boolean
  },

  computed: {
    isClickable () {
      return !this.disable && (
        this.clickable ||
        this.hasRouterLink ||
        this.tag === 'a' ||
        this.tag === 'label'
      )
    },

    classes () {
      return {
        'q-item--clickable q-link cursor-pointer q-focusable q-hoverable': this.isClickable,
        'q-item--dense': this.dense,
        'q-item--inset': this.inset,
        'q-item--dark': this.dark,
        'disabled': this.disable
      }
    }
  },

  methods: {
    __getContent (h) {
      const child = [].concat(this.$slots.default)

      this.isClickable && child.unshift(h('div', { staticClass: 'q-focus-helper' }))
      return child
    },

    __onClick (e) {
      this.$el.blur()
      this.$emit('click', e)
    },

    __onKeydown (e) {
      e.keyCode === 13 /* ENTER */ && this.__onClick(e)
    }
  },

  render (h) {
    const data = {
      staticClass: 'q-item q-item-type relative-position row',
      'class': this.classes
    }

    if (this.isClickable) {
      data.attrs = {
        tabindex: this.tabindex
      }
      data[this.hasRouterLink ? 'nativeOn' : 'on'] = {
        click: this.__onClick,
        keydown: this.__onKeydown
      }
    }

    if (this.hasRouterLink) {
      data.tag = 'a'
      data.props = this.routerLinkProps

      return h('router-link', data, this.__getContent(h))
    }

    return h(
      this.tag,
      data,
      this.__getContent(h)
    )
  }
}
