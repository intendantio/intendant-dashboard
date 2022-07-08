import React from 'react'
import { Drawer, IconButton, Button, List, AppBar, Typography, Toolbar, Box, Divider, ListItem, ListItemIcon, ListItemText, Skeleton } from '@mui/material'
import { ShoppingCart, House, Menu, DevicesOther, ExitToApp, AccountTree, Category, DeviceHub, BarChart, Extension, Settings, Person, ArrowBack, ArrowBackIos, Home, Lightbulb, Storage, CloudCircle } from '@mui/icons-material'
import { Link, withRouter } from "react-router-dom"

import Request from '../utils/Request'

class Sidebar extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            open: false,
            information: {
                status: "",
                version: "",
                mobileTitle: "Intendant"
            },
            loading: true
        }
        this.getStatus()
    }

    navigate() {
        this.setState({ open: false })
        document.getElementById('main').scroll({ top: 0, left: 0 })
    }

    async getStatus() {
        let result = await new Request().fetch("/api/configurations")
        this.setState({
            loading: false,
            information: {
                status: "",
                version: result.data.version,
                build: result.data.build
            }
        })
    }

    onClick() {
        if (this.props.actionType == "list") {
            this.setState({ open: true })
        } else {
            this.props.history.goBack()
            document.getElementById('main').scroll({ top: 0, left: 0 })
        }
    }

    render() {
        if (this.props.isMobile) {
            let pathname = location.pathname.split("/")
            return (
                <>
                    <AppBar variant='outlined' position="static" >
                        <Toolbar >
                            <IconButton
                                onClick={() => { this.onClick() }}
                                size="large"
                                color="inherit"
                                edge='start'
                            >
                                {
                                    this.props.actionType == "list" ?
                                        <Menu /> : <ArrowBackIos />

                                }
                            </IconButton>
                            <Box style={{ paddingTop: 10, paddingBottom: 10, display: 'flex', textDecoration: 'none', color: 'white', flexDirection: 'row', alignItems: 'center' }}>
                                <img src={process.env.PUBLIC_URL + "/logo.svg"} style={{ minHeight: 40, minWidth: 40, height: '3vh', width: '3vh', borderRadius: 7, marginRight: 10 }} />
                                {
                                    this.props.title.length == 0 ?
                                        <Skeleton height={30} variant="text" style={{ width: 100 }} />
                                        :
                                        <Typography variant="h5" fontWeight='bold' component="div" sx={{ flexGrow: 1 }}>
                                            {this.props.title}
                                        </Typography>
                                }
                            </Box>
                        </Toolbar>
                    </AppBar>
                    <Drawer elevation={0} onClose={() => this.setState({ open: false })} anchor="left" open={this.state.open} style={{ width: 240 }} >
                        <Box style={{ width: 240, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', overflowX: 'hidden' }}>
                            <List style={{ width: '100%' }}>
                                <Box style={{ display: 'flex', justifyContent: 'flex-start', padding: 5, alignContent: 'center', alignSelf: 'center', alignItems: 'center' }}>
                                    <img src={process.env.PUBLIC_URL + "/logo.svg"} style={{ minHeight: 40, minWidth: 40, height: '7vh', width: '7vh', borderRadius: 7, marginLeft: 15 }} />
                                    <Box>
                                        <Typography variant='h5' fontWeight={'bold'} style={{ paddingTop: 15, paddingLeft: 10 }}>
                                            Intendant
                                        </Typography>
                                        <Typography variant='subtitle2' style={{ paddingTop: 0, paddingBottom: 15, paddingLeft: 10 }}>
                                            Smart home
                                        </Typography>
                                    </Box>
                                </Box>
                                <Divider />
                                <Link to="/" onClick={() => { this.navigate() }} style={{ textDecoration: 'none', color: 'white' }}>
                                    <ListItem button key={"home"}>
                                        <ListItemIcon>
                                            <Home />
                                        </ListItemIcon>
                                        <ListItemText primary={"Home"} />
                                    </ListItem>
                                </Link>
                                <Link to="/room" onClick={() => { this.navigate() }} style={{ textDecoration: 'none', color: 'white' }}>
                                    <ListItem button key={"room"}>
                                        <ListItemIcon>
                                            <Lightbulb />
                                        </ListItemIcon>
                                        <ListItemText primary={"Room"} />
                                    </ListItem>
                                </Link>
                                <Link to="/automation" onClick={() => { this.navigate() }} style={{ textDecoration: 'none', color: 'white' }}>
                                    <ListItem button key={"automation"} >
                                        <ListItemIcon>
                                            <AccountTree />
                                        </ListItemIcon>
                                        <ListItemText primary={"Automation"} />
                                    </ListItem>
                                </Link>
                                <Link to="/rapport" onClick={() => { this.navigate() }} style={{ textDecoration: 'none', color: 'white' }}>
                                    <ListItem button key={"rapport"} >
                                        <ListItemIcon>
                                            <BarChart />
                                        </ListItemIcon>
                                        <ListItemText primary={"Rapport"} />
                                    </ListItem>
                                </Link>
                                <Link to="/user" onClick={() => { this.navigate() }} style={{ textDecoration: 'none', color: 'white' }}>
                                    <ListItem button key={"user"} >
                                        <ListItemIcon>
                                            <Person />
                                        </ListItemIcon>
                                        <ListItemText primary={"User"} />
                                    </ListItem>
                                </Link>
                                <Link to="/system" onClick={() => { this.navigate() }} style={{ textDecoration: 'none', color: 'white' }}>
                                    <ListItem button key={"system"} >
                                        <ListItemIcon>
                                            <CloudCircle />
                                        </ListItemIcon>
                                        <ListItemText primary={"Information"} />
                                    </ListItem>
                                </Link>
                                <Divider />
                                <ListItem button key={"disconnect"} onClick={() => { this.props.onDisconnect() }} >
                                    <ListItemIcon>
                                        <ExitToApp />
                                    </ListItemIcon>
                                    <ListItemText primary={"Disconnect"} />
                                </ListItem>
                            </List>
                            <Box style={{ padding: 16 }}>
                                {
                                    this.state.loading ?
                                        <>
                                            <Typography variant='h6' >
                                                <Skeleton animation="wave" variant="text" />
                                            </Typography>
                                            <Typography variant='body2' >
                                                <Skeleton animation="wave" variant="text" />
                                            </Typography>
                                        </>
                                        :
                                        <>
                                            <Typography variant='body2'>
                                                {"Subscription free"}
                                            </Typography>
                                            <Typography variant='caption'>
                                                {"Version " + this.state.information.version + " - License GPL-3.0+"}
                                            </Typography>
                                        </>
                                }
                            </Box>
                        </Box>
                    </Drawer >
                </>

            )
        }
        return (
            <Drawer variant="persistent" anchor="left" open={true} style={{ width: 240 }} >
                <Box style={{ width: 240, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', overflowX: 'hidden' }}>
                    <List style={{ width: '100%' }}>
                        <Box style={{ display: 'flex', justifyContent: 'flex-start', padding: 5, alignContent: 'center', alignSelf: 'center', alignItems: 'center' }}>
                            <img src={process.env.PUBLIC_URL + "/logo.svg"} style={{ minHeight: 40, minWidth: 40, height: '7vh', width: '7vh', borderRadius: 7, marginLeft: 15 }} />
                            <Box>
                                <Typography variant='h5' fontWeight={'bold'} style={{ paddingTop: 15, paddingLeft: 10 }}>
                                    Intendant
                                </Typography>
                                <Typography variant='subtitle2' style={{ paddingTop: 0, paddingBottom: 15, paddingLeft: 10 }}>
                                    Smart home
                                </Typography>
                            </Box>
                        </Box>
                        <Divider />
                        <Link to="/" onClick={() => { this.navigate() }} style={{ textDecoration: 'none', color: 'white' }}>
                            <ListItem button key={"home"}>
                                <ListItemIcon>
                                    <Home />
                                </ListItemIcon>
                                <ListItemText primary={"Home"} />
                            </ListItem>
                        </Link>
                        <Link to="/room" onClick={() => { this.navigate() }} style={{ textDecoration: 'none', color: 'white' }}>
                            <ListItem button key={"room"}>
                                <ListItemIcon>
                                    <Lightbulb />
                                </ListItemIcon>
                                <ListItemText primary={"Room"} />
                            </ListItem>
                        </Link>
                        <Link to="/automation" onClick={() => { this.navigate() }} style={{ textDecoration: 'none', color: 'white' }}>
                            <ListItem button key={"automation"} >
                                <ListItemIcon>
                                    <AccountTree />
                                </ListItemIcon>
                                <ListItemText primary={"Automation"} />
                            </ListItem>
                        </Link>
                        <Link to="/rapport" onClick={() => { this.navigate() }} style={{ textDecoration: 'none', color: 'white' }}>
                            <ListItem button key={"rapport"} >
                                <ListItemIcon>
                                    <BarChart />
                                </ListItemIcon>
                                <ListItemText primary={"Rapport"} />
                            </ListItem>
                        </Link>
                        <Link to="/user" onClick={() => { this.navigate() }} style={{ textDecoration: 'none', color: 'white' }}>
                            <ListItem button key={"user"} >
                                <ListItemIcon>
                                    <Person />
                                </ListItemIcon>
                                <ListItemText primary={"User"} />
                            </ListItem>
                        </Link>
                        <Link to="/system" onClick={() => { this.navigate() }} style={{ textDecoration: 'none', color: 'white' }}>
                            <ListItem button key={"cloud"} >
                                <ListItemIcon>
                                    <CloudCircle />
                                </ListItemIcon>
                                <ListItemText primary={"Cloud"} />
                            </ListItem>
                        </Link>
                        <Divider />
                        <ListItem button key={"disconnect"} onClick={() => { this.props.onDisconnect() }} >
                            <ListItemIcon>
                                <ExitToApp />
                            </ListItemIcon>
                            <ListItemText primary={"Disconnect"} />
                        </ListItem>
                    </List>
                    <Box style={{ padding: 16 }}>
                        {
                            this.state.loading ?
                                <>
                                    <Typography variant='h6' >
                                        <Skeleton animation="wave" variant="text" />
                                    </Typography>
                                    <Typography variant='body2' >
                                        <Skeleton animation="wave" variant="text" />
                                    </Typography>
                                </>
                                :
                                <>
                                    <Typography variant='body2'>
                                        {"Version " + this.state.information.version + ""}
                                    </Typography>
                                    <Typography paragraph variant='caption'>
                                        {"License GPL-3.0+"}
                                    </Typography>
                                </>
                        }
                    </Box>
                </Box>
            </Drawer>
        )
    }

}


export default withRouter(Sidebar) 