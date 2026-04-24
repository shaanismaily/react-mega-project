import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import appwriteService from "../../appwrite/config";
import { Button, Container } from "../index";
import { useSelector } from "react-redux";
import parse from "html-react-parser";

function Post() {
  const [post, setPost] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const isAuthor = post && userData ? post.userId === userData.$id : false;

  useEffect(() => {
    if (slug) {
      appwriteService.getPost(slug).then((post) => {
        if (post) {
        setPost(post);
      } else {
        navigate("/");
      }
      });
    } else {
      navigate("/");
    }
  }, [slug, navigate]);

  const deletePost = async () => {
  try {
    const status = await appwriteService.deletePost(post.$id);

    if (status) {
      if (post.featuredImage) {
        try {
          await appwriteService.deleteFile(post.featuredImage);
        } catch (fileError) {
          console.error("File delete failed:", fileError);
        }
      }

      navigate("/");
    }
  } catch (error) {
    console.error("Post delete failed:", error);
  }
};

  return post ? (
    <div className="py-8">
      <Container>
        <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
          <img
            src={appwriteService.getFileView(post.featuredImage).toString()}
            alt={post.title}
            className="rounded-xl w-75"
          />

          {isAuthor && (
            <div className="absolute right-6 top-6">
              <Link to={`/edit-post/${post.$id}`}>
                <Button bgColor="bg-green-500" className="mr-3">
                  Edit
                </Button>
              </Link>
              <Button bgColor="bg-red-500" onClick={deletePost}>
                Delete
              </Button>
            </div>
          )}
        </div>
        <div className="w-full mb-6">
          <h1 className="text-2xl font-bold">{post.title}</h1>
        </div>
        <div className="browser-css">{parse(post.content)}</div>
      </Container>
    </div>
  ) : null;
}

export default Post;