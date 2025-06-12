const algorithmUrl = process.env.SIMILAR_POSTS_URL || "http://localhost:8000";

export const addPostToAlgorithm = async (postId: string) => {
  try {
    const response = await fetch(`${algorithmUrl}/add-post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ post_id: postId }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to add post to algorithm. Response: ${JSON.stringify(response)}`
      );
    }

    const data = await response.json();
    console.log("Post added to algorithm:", data);

    return data;
  } catch (error) {
    console.error("Error adding post to algorithm:", error);
  }
};

export const getSimilarPosts = async (title?: string, content?: string) => {
  try {
    const queryParams = new URLSearchParams({
      title: encodeURIComponent(title || ""),
      content: encodeURIComponent(content || ""),
      top_k: process.env.SIMILAR_POSTS_TOP_K || "5",
    });

    const response = await fetch(
      `${algorithmUrl}/similar-posts?${queryParams.toString()}`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to get similar posts. Response: ${JSON.stringify(response)}`
      );
    }

    const data = await response.json();
    console.log("Similar posts:", data);

    return data;
  } catch (error) {
    console.error("Error getting similar posts:", error);
  }
};
