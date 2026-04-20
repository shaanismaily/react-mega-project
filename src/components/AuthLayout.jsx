import React, {useState, useEffect} from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Protected({children, authentication = true}) {
    
    const [loader, setLoader] = useState(true);
    const navigate = useNavigate();

    const authStatus = useSelector(state => state.auth.status)

    useEffect(() => {
        if (authentication && authentication !== authStatus) {
            navigate("/login")
        } 
        else if(!authentication && authentication !== authStatus) {
            navigate("/")
        }

        setLoader(false)
    }, [authStatus, navigate, authentication])

    return loader ? <h1>Loading...</h1> : <>{children}</>;
}

export default Protected;