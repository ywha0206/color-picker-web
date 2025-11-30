import React from "react";
import MenuIcon from '@mui/icons-material/Menu';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const Header = ({isMenuOpen, toggleMenu}) => {
    

    return (
    <div className='header'>
        <div className="logo">ColorPicker</div>
        <div className="menu-icon" onClick={toggleMenu}>
            <MenuIcon/>
        </div>
    </div>
 );
};

export default Header;