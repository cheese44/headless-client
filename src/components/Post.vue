<template>
  <div class="max-w-4xl mx-auto my-8 px-4">
    <div v-if="loading" class="text-center">
      <p>Loading post...</p>
    </div>

    <div v-if="error" class="text-center text-red-500">
      <p>Error fetching the post.</p>
    </div>

    <div v-if="post">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ post.title.rendered }}</h1>
      <div v-html="post.content.rendered" class="text-gray-700"></div>

      <div class="max-w-4xl mx-auto py-8 px-4">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">Comments</h2>

        <!-- Existing Comments -->
        <div v-if="comments.length > 0">
          <div v-for="comment in comments" :key="comment.id" class="mb-6 p-4 bg-gray-50 rounded-lg shadow-md">
            <p class="text-sm font-semibold text-gray-800">{{ comment.author_name }}</p>
            <p class="text-gray-700 mt-2" v-html="comment.content.rendered"></p>
            <p class="text-xs text-gray-500 mt-2">{{ new Date(comment.date).toLocaleDateString() }}</p>
          </div>
        </div>

        <!-- No Comments Yet -->
        <div v-else class="text-gray-500">
          <p>No comments yet. Be the first to comment!</p>
        </div>

        <!-- Comment Form -->
        <div class="mt-8">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">Leave a Comment</h3>
          <form @submit.prevent="submitComment" class="space-y-4">
            <div>
              <label for="author" class="block text-sm font-semibold text-gray-700">Name</label>
              <input
                  type="text"
                  id="author"
                  v-model="commentData.author"
                  class="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Your Name"
                  required
              />
            </div>

            <div>
              <label for="content" class="block text-sm font-semibold text-gray-700">Comment</label>
              <textarea
                  id="content"
                  v-model="commentData.content"
                  rows="4"
                  class="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Your comment"
                  required
              ></textarea>
            </div>

            <button
                type="submit"
                class="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Post Comment
            </button>
          </form>
        </div>

        <!-- Error or Success Message -->
        <div v-if="errorMessage" class="mt-6 text-red-500">{{
            errorMessage
          }}</div>
        <div v-if="successMessage" class="mt-6 text-green-500">{{
            successMessage
          }}</div>

        <PostCards headline="Related Posts" :posts="relatedPosts" />

      </div>
    </div>
  </div>
</template>

<script>
import PostCards from "@/components/PostCards.vue";

export default {
  components: {PostCards},
  data() {
    return {
      post: null,
      relatedPosts: [],
      relatedPostsLoading: true,
      relatedPostsError: null,
      comments: [],
      commentData: {
        author: '',
        content: '',
      },
      loading: true,
      error: null,
      errorMessage: '',
      successMessage: '',
    };
  },
  mounted() {
    this.fetchPost();
    this.fetchComments();
  },
  methods: {
    async fetchPost() {
      const postId = this.$route.params.id;
      try {
        const response = await fetch(import.meta.env.VITE_BACKEND_SERVER_DOMAIN + `/wp-json/wp/v2/posts/${postId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        this.post = data;

        if(data.categories.length > 0) {
          try {
            const response = await fetch(import.meta.env.VITE_BACKEND_SERVER_DOMAIN + '/wp-json/wp/v2/posts?categories=' + data.categories.join(','));
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const relatedPostsData = await response.json();
            this.relatedPosts = relatedPostsData;
          } catch (error) {
            this.relatedPostsError = error.message;
          } finally {
            this.relatedPostsLoading = false;
          }
        }

      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchComments() {
      const postId = this.$route.params.id;
      try {
        const response = await fetch(
            import.meta.env.VITE_BACKEND_SERVER_DOMAIN + `/wp-json/wp/v2/comments?post=${postId}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch comments.');
        }
        const data = await response.json();
        this.comments = data;
      } catch (error) {
        this.errorMessage = error.message;
      }
    },

    async submitComment() {
      const postId = this.$route.params.id;
      if (!this.commentData.author || !this.commentData.content) {
        this.errorMessage = 'Please provide both a name and a comment.';
        return;
      }

      const commentPayload = {
        post: postId,
        author_name: this.commentData.author,
        content: this.commentData.content,
      };

      try {
        const response = await fetch(
            import.meta.env.VITE_BACKEND_SERVER_DOMAIN + `/wp-json/wp/v2/comments`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(commentPayload),
            }
        );

        if (!response.ok) {
          throw new Error('Failed to post the comment.');
        }

        const data = await response.json();
        this.comments.unshift(data); // Add the new comment to the top of the list
        this.commentData.author = '';
        this.commentData.content = '';
        this.successMessage = 'Your comment has been posted successfully!';
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
  },
};
</script>
