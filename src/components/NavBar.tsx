import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

interface Props {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window?: () => Window;
}

const navItems = ['Wallet', 'Collection', 'Mint', 'Withdraw'];

export default function DrawerAppBar(props: Props) {

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar component="nav">
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                    >
                        Rabiel Minter
                    </Typography>
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        {navItems.map((item) => (
                            <NavLink key={item} style={{ margin: 5, color: "white", textDecoration: "none" }} to={`/${item}`} end>
                                {item}
                            </NavLink>
                        ))}
                    </Box>
                </Toolbar>
            </AppBar>

            <div style={{ width: "100%"}}>
                <Toolbar />
                <Outlet />
            </div>
        </Box>
    );
}
