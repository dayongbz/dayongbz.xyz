import React, { memo, useRef, useCallback, useContext } from "react"
import { indexPageTab } from "../css/components/index-page"

import { GlobalDispatchContext } from "../context/GlobalContextProvider"

const PostTab = memo(() => {
  const tabRef = useRef()
  const dispatch = useContext(GlobalDispatchContext)

  const onClickTab = useCallback(
    index => {
      return e => {
        const target = e.currentTarget
        if (!target.classList.contains("active")) {
          const { offsetWidth: tabWidth } = target
          const { scrollLeft, offsetWidth: wrapperWidth } = tabRef.current
          const tabLeft = target.getBoundingClientRect().left
          const wrapperLeft = tabRef.current.getBoundingClientRect().left
          const refineLeft = tabLeft - wrapperLeft
          const targetScrollX =
            scrollLeft + refineLeft - wrapperWidth / 2 + tabWidth / 2

          // smooth scroll
          tabRef.current.scrollTo({
            top: 0,
            left: targetScrollX,
            behavior: "smooth",
          })

          // delete active className
          Array.from(tabRef.current?.children).forEach(item => {
            item.classList.remove("active")
          })

          // add active className
          target.classList.add("active")
          dispatch({ type: "SET_POST_TAB", postTab: index })
        }
      }
    },
    [dispatch]
  )

  return (
    <div css={indexPageTab} ref={tabRef}>
      <button className="active" onClick={onClickTab(0)}>
        All Posts
      </button>
    </div>
  )
})

export default PostTab