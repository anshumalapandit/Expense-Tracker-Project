import React, { useContext } from "react";
import { UserContext } from "../../contexts/userContext"
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";

const DashboardLayout = ({ children, activeMenu }) => {
   
    const { user } = useContext(UserContext);
     console.log("User from context:", user);
      // Add loading state while user context initializes
    // if (user === undefined) {
    //     return <div>Loading...</div>;
    // }
    return (
        <div className="">
            <Navbar activeMenu={activeMenu} />
            {/* remember yaha pe && tha tune || kiya hai */}
            {user && (
                <div className="flex">
                    <div className="max-[1080px]:hidden">
                        
                        <SideMenu activeMenu={activeMenu} />
                    </div>

                    <div className="grow mx-5">{children}</div>
                </div>
            )}
        </div>
    );
};

export default DashboardLayout;