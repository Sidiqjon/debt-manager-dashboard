import React from "react"
import Logo from "../assets/icons/LOGO.svg"

const PageLoading = () => {
    return (
        <div className="containers">
            <div className="fixed flex items-center justify-center top-0 bottom-0 left-0 right-0 bg-white">
                <img className="page-loading-img w-[80px] h-[80px]" src={Logo} alt="Page Logo" />
            </div>
        </div>
    )
}

export default React.memo(PageLoading)