import {Container, PostCard} from "../index";
import appwriteService from "../../appwrite/config"
import { useEffect, useState } from "react";

function AllPosts() {

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        appwriteService.getPosts([]).then((post) => setPosts(post))
    }, [])
    return (
        <Container>
            {posts.map(post => (
                <div key={post.$id}>
                    <PostCard post={post}/>
                </div>
            ))}
        </Container>
    )
}

export default AllPosts;