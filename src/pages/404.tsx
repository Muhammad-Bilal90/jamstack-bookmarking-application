import React, { FC } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const NotFoundPage: FC = () => {
    return(
        <div className="container">
            <h1>404: Not Found</h1>
            <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
        </div>
    );
}

export default NotFoundPage;