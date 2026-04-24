import { Container, PostCard } from "../index";
import appwriteService from "../../appwrite/config";
import { useEffect, useState } from "react";

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    appwriteService
      .getPosts()
      .then((res) => res && setPosts(res.rows))
      .catch((err) => {
        console.error("Failed to fetch posts:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <Container>
      {posts.map((post) => (
        <div key={post.$id}>
          <PostCard
            $id={post.$id}
            title={post.title}
            featuredImage={post.featuredImage}
          />
        </div>
      ))}
    </Container>
  );
}

export default AllPosts;
