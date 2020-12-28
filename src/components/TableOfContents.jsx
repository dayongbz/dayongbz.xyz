/*
 * Copyright (c) 2015 Gatsbyjs
 * Forked from https://github.com/gatsbyjs/gatsby/
 **/

import React, { useState, useEffect } from "react"
import { Link } from "gatsby"
import { useActiveHash } from "../hooks/useActiveHash"

const getHeadingIds = (
  toc,
  traverseFullDepth = true,
  depth,
  recursionDepth = 1
) => {
  const idList = []
  const hashToId = str => str.slice(1)

  if (toc) {
    for (const item of toc) {
      // Sometimes url does not exist on item. See #19851
      if (item.url) {
        idList.push(hashToId(item.url))
      }

      // Only traverse sub-items if specified (they are not displayed in ToC)
      // recursion depth should only go up to 6 headings deep and may come in as
      // undefined if not set in the tableOfContentsDepth frontmatter field
      if (item.items && traverseFullDepth && recursionDepth < (depth || 6)) {
        idList.push(
          ...getHeadingIds(item.items, true, depth, recursionDepth + 1)
        )
      }
    }
  }

  return idList
}

const isUnderDepthLimit = (depth, maxDepth) => {
  if (maxDepth === null) {
    // if no maxDepth is passed in, continue to render more items
    return true
  } else {
    return depth < maxDepth
  }
}

// depth and maxDepth are used to figure out how many bullets deep to render in the ToC sidebar, if no
// max depth is set via the tableOfContentsDepth field in the frontmatter, all headings will be rendered
const createItems = (
  items,
  location,
  depth,
  maxDepth,
  activeHash,
  isDesktop
) => {
  return (
    items &&
    items.map((item, index) => {
      const isActive = isDesktop && item.url === `#${activeHash}`
      return (
        <li key={location.pathname + (item.url || depth + `-` + index)}>
          {item.url && (
            <Link
              className={isActive ? "active" : null}
              to={location.pathname + item.url}
            >
              {item.title}
            </Link>
          )}
          {item.items && isUnderDepthLimit(depth, maxDepth) && (
            <ul>
              {createItems(
                item.items,
                location,
                depth + 1,
                maxDepth,
                activeHash,
                isDesktop
              )}
            </ul>
          )}
        </li>
      )
    })
  )
}

const TableOfContents = ({ items, depth, location }) => {
  const [isDesktop, setIsDesktop] = useState(false)
  const activeHash = useActiveHash(getHeadingIds(items, true, depth))

  useEffect(() => {
    const isDesktopQuery = window.matchMedia("(min-width: 1200px)")
    setIsDesktop(isDesktopQuery.matches)

    const updateIsDesktop = e => setIsDesktop(e.matches)
    isDesktopQuery.addEventListener("change", updateIsDesktop)
    return () => isDesktopQuery.removeEventListener("change", updateIsDesktop)
  }, [])

  return items && isDesktop ? (
    <nav className="toc-wrapper">
      <div className="toc">
        <p className="title">Table of Contents</p>
        <ul>{createItems(items, location, 1, depth, activeHash, isDesktop)}</ul>
      </div>
    </nav>
  ) : null
}

export default TableOfContents
