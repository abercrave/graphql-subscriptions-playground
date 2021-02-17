const posts = require('./postData')
const pubSub = require('./pubSub')

const TOPIC_ID = 'post'

function getPosts() {
  return posts
}

function getPost(parent, args) {
  const id = parseInt(args.id, 10)

  return posts.find(post => post.id === id)
}

function createPost(parent, { input }) {
  const id = parseInt(input.id, 10)
  const postIndex = posts.findIndex(post => post.id === id)
 
  if (postIndex === -1) {
    posts.push({
      ...input,
      id,
    })
    
    pubSub.publish(TOPIC_ID, {
      post: {
        mutation: 'CREATED',
        data: { ...input },
      },
    })
    
   return { ...input }
  }

  throw new Error('Post with same id already exists!')
}

function deletePost(parent, args) {
  const id = parseInt(args.id, 10)
  const postIndex = posts.findIndex(post => post.id === id)
  
  if (postIndex === -1) {
    throw new Error('Post does not exist!')
  }

  const [post] = posts.splice(postIndex, 1)
  
  pubSub.publish(TOPIC_ID, {
    post: {
      mutation: 'DELETED',
      data: post,
    },
  })

  return post
}

function updatePost(parent, { input }) {
  const id = parseInt(input.id, 10)
  const postIndex = posts.findIndex((post) => post.id === id)

  if (postIndex !== -1) {
    const post = posts[postIndex]
    const updatedPost = {
      ...post,
      ...input,
      id,
    }
    
    posts.splice(postIndex, 1, updatedPost)
    
    pubSub.publish(TOPIC_ID, {
      post: {
        mutation: 'UPDATED',
        data: updatedPost,
      },
    })

    return updatedPost
  }

  throw new Error('Post does not exist!')
}

function subscribe() {
  return pubSub.asyncIterator(TOPIC_ID)
}

const resolvers = {
  Query: {
    post: getPost,
    posts: getPosts,
  },
  
  Mutation: {
    createPost,
    deletePost,
    updatePost,
  },
  
  Subscription: {
    post: {
      subscribe,
    },
  },
}

module.exports = resolvers