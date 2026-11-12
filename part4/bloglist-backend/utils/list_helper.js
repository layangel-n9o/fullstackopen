const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  return blogs.reduce((favorite, blog) => {
    return blog.likes > favorite.likes ? blog : favorite
  }, blogs[0])
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const counts = {}
  blogs.forEach((blog) => {
    counts[blog.author] = (counts[blog.author] || 0) + 1
  })

  const [author, count] = Object.entries(counts).reduce((max, entry) => {
    return entry[1] > max[1] ? entry : max
  })

  return { author, blogs: count }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const sums = {}
  blogs.forEach((blog) => {
    sums[blog.author] = (sums[blog.author] || 0) + blog.likes
  })

  const [author, likes] = Object.entries(sums).reduce((max, entry) => {
    return entry[1] > max[1] ? entry : max
  })

  return { author, likes }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
