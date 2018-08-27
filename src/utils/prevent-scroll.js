import { getEventPath, stopAndPrevent } from './event.js'
import { hasScrollbar, hasScrollbarX } from './scroll.js'
import Platform from '../plugins/platform.js'

let registered = 0

function onWheel (e) {
  if (shouldPreventScroll(e)) {
    stopAndPrevent(e)
  }
}

function shouldPreventScroll (e) {
  if (e.target === document.body || e.target.classList.contains('q-layout-backdrop')) {
    return true
  }

  const
    path = getEventPath(e),
    scrollY = Math.abs(e.deltaX) <= Math.abs(e.deltaY),
    testFn = scrollY ? hasScrollbar : hasScrollbarX

  for (let index = 0; index < path.length; index++) {
    const el = path[index]

    if (testFn(el)) {
      return scrollY
        ? (
          e.deltaY < 0 && el.scrollTop === 0
            ? true
            : e.deltaY > 0 && el.scrollTop + el.clientHeight === el.scrollHeight
        )
        : (
          e.deltaX < 0 && el.scrollLeft === 0
            ? true
            : e.deltaX > 0 && el.scrollLeft + el.clientWidth === el.scrollWidth
        )
    }
  }

  return true
}

export default function (register) {
  registered += register ? 1 : -1
  if (registered > 1) { return }

  const action = register ? 'add' : 'remove'

  if (Platform.is.mobile) {
    document.body.classList[action]('q-body-prevent-scroll')
  }
  else if (Platform.is.desktop) {
    window[`${action}EventListener`]('wheel', onWheel)
  }
}
