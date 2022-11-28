import React from "react";
import Layout from "../Layout";
import "./403.scss";

function PermissionDeniedPage() {
  return (
    <Layout>
      <div className="error__container">
        <div className="error__code">403</div>
        <div className="error__message">
          You do not have permission to access to this page.
        </div>
      </div>
    </Layout>
  );
}

export default PermissionDeniedPage;
