import React from "react";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";

function Layout(prop) {
  const { itemId, children } = prop;
  return (
    <div className="container">
      <Sidebar itemId={itemId} />
      <div>
        <Topbar />
        <div>{children}</div>
      </div>
    </div>
  );
}

export default Layout;
