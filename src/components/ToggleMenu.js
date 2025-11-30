import React from "react";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const ToggleMenu = ({isMenuOpen, toggleMenu}) => {
    return (
        <>
            <div className="toggle-bg" onClick={toggleMenu}></div>
            <div className="toggle">
                {isMenuOpen && (<ArrowForwardIosIcon onClick={toggleMenu}/>)}
            </div>1
        </>
    )
}

export default ToggleMenu;