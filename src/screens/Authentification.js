import React from 'react'
import { Paper, Typography, Box, Skeleton, Grid, Button } from '@mui/material'
import Main from './Main'

class Authentification extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            authentification: true,
            getStarted: false,
            password: "",
            customAddress: true,
            login: "admin",
            loading: true,
            codepin: "",
            status: "unknown"
        }
    }

    async componentDidMount() {
        try {
            let path = sessionStorage.getItem("path")
            console.log(path)
            let result = await fetch(path + "/api", {
                method: this.method,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            let resultJSON = await result.json()
            if(resultJSON.package == "@intendant/core") {
                this.setState({ loading: false, status: "online" })
            } else {
                this.setState({status: "unreachable"})
                this.props.setMessage("Instance " + path + " is unreachable")
            }
        } catch (error) {
            sessionStorage.clear()
            this.setState({ loading: false })
        }
    }

    async login() {
        if (await this.checkServer()) {
            
        }
    }

    disconnect() {
        sessionStorage.removeItem("expiry")
        sessionStorage.removeItem("user")
        sessionStorage.removeItem("access_token")
        sessionStorage.removeItem("refresh_token")
        this.setState({ authentification: true, codepin: "" })
    }

    async checkServer() {
        let ok = true
        let protocol = window.location.protocol + "//"
        if (this.state.address.split("://").length > 1) {
            protocol = ""
        }
        try {
            let result = await fetch(protocol + this.state.address + "/api/configurations", {}, 2000)
            let resultJSON = await result.json()
            if (resultJSON.error) {
                this.props.setMessage('Connection to server failed')
            } else {
                sessionStorage.setItem("server", protocol + this.state.address)
                if (resultJSON.data.getStarted) {
                    this.setState({ getStarted: true })
                    return false
                }
            }
        } catch (error) {
            this.props.setMessage('Connection to server failed')
            ok = false
        }
        return ok
    }

    addPin(item) {
        this.setState({ codepin: this.state.codepin + item })
    }

    async submit() {
        let path = sessionStorage.getItem("path")
        let result = await fetch(path + "/api/authentification", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ login: "admin_pin", password: this.state.codepin })
        })
        let resultJSON = await result.json()
        if (resultJSON.error) {
            this.setState({ codepin: "" })
            this.props.setMessage(resultJSON.message)
        } else {
            sessionStorage.setItem("expiry", resultJSON.data.expiry + "")
            sessionStorage.setItem("user", resultJSON.data.user)
            sessionStorage.setItem("access_token", resultJSON.data.access_token)
            sessionStorage.setItem("refresh_token", resultJSON.data.refresh_token)
            this.setState({ authentification: false })
        }
    }

    render() {
        if (this.state.authentification) {
            return (
                <Paper variant='outlined' style={{ padding: 10, width: '25vw', minWidth: 300, minHeight: 'min-content', textAlign: 'center' }}>
                    <Box style={{ padding: 10 }}>
                        <Box style={{ marginBottom: 10 }}>
                            <img src={process.env.PUBLIC_URL + "/logo.svg"} style={{ height: '10vh', width: '10vh', minWidth: 100, minHeight: 90, borderRadius: 7 }} />
                            <Typography variant='h3' fontWeight='bold'>
                                Intendant
                            </Typography>
                            <Typography variant='h5' >
                                {sessionStorage.getItem("name")}
                            </Typography>
                        </Box>
                        <Box style={{ marginBottom: 10, justifyContent:'center', display:'flex' }}>
                            {this.state.loading ?
                                <Skeleton width={150} height={40} />
                                :
                                this.state.codepin.length == 0 ?
                                    <Typography style={{ color: 'rgb(0, 30, 60)' }} variant='h5' >
                                        {"."}
                                    </Typography> : <Typography style={{ letterSpacing: '2px' }} variant='h5' >
                                        {this.state.codepin}
                                    </Typography>
                            }
                        </Box>
                        <Box style={{ alignItems: 'center', display: 'flex', alignContent: 'center', alignContent: 'center', justifyContent: 'center' }}>
                            <Grid container spacing={0} style={{ width: 220, height: 280 }} >
                                <Grid item xs={4} md={4} lg={4} style={{ display: 'flex', alignContent: 'center', justifyContent: "center" }} >
                                    <Button variant='outlined' color='inherit' onClick={() => { this.addPin("7") }} style={{ width: 60, height: 60, borderColor: 'rgba(30, 73, 118,0.8)' }}>
                                        <Typography variant='h5'>
                                            7
                                        </Typography>
                                    </Button>
                                </Grid>
                                <Grid item xs={4} md={4} lg={4} style={{ display: 'flex', alignContent: 'center', justifyContent: "center" }} >
                                    <Button variant='outlined' color='inherit' onClick={() => { this.addPin("8") }} style={{ width: 60, height: 60, borderColor: 'rgba(30, 73, 118,0.8)' }}>
                                        <Typography variant='h5'>
                                            8
                                        </Typography>
                                    </Button>
                                </Grid>
                                <Grid item xs={4} md={4} lg={4} style={{ display: 'flex', alignContent: 'center', justifyContent: "center" }} >
                                    <Button variant='outlined' color='inherit' onClick={() => { this.addPin("9") }} style={{ width: 60, height: 60, borderColor: 'rgba(30, 73, 118,0.8)' }}>
                                        <Typography variant='h5'>
                                            9
                                        </Typography>
                                    </Button>
                                </Grid>
                                <Grid item xs={4} md={4} lg={4} style={{ display: 'flex', alignContent: 'center', justifyContent: "center" }} >
                                    <Button variant='outlined' color='inherit' onClick={() => { this.addPin("4") }} style={{ width: 60, height: 60, borderColor: 'rgba(30, 73, 118,0.8)' }}>
                                        <Typography variant='h5'>
                                            4
                                        </Typography>
                                    </Button>
                                </Grid>
                                <Grid item xs={4} md={4} lg={4} style={{ display: 'flex', alignContent: 'center', justifyContent: "center" }} >
                                    <Button variant='outlined' color='inherit' onClick={() => { this.addPin("5") }} style={{ width: 60, height: 60, borderColor: 'rgba(30, 73, 118,0.8)' }}>
                                        <Typography variant='h5'>
                                            5
                                        </Typography>
                                    </Button>
                                </Grid>
                                <Grid item xs={4} md={4} lg={4} style={{ display: 'flex', alignContent: 'center', justifyContent: "center" }} >
                                    <Button variant='outlined' color='inherit' onClick={() => { this.addPin("6") }} style={{ width: 60, height: 60, borderColor: 'rgba(30, 73, 118,0.8)' }}>
                                        <Typography variant='h5'>
                                            6
                                        </Typography>
                                    </Button>
                                </Grid>
                                <Grid item xs={4} md={4} lg={4} style={{ display: 'flex', alignContent: 'center', justifyContent: "center" }} >
                                    <Button variant='outlined' color='inherit' onClick={() => { this.addPin("1") }} style={{ width: 60, height: 60, borderColor: 'rgba(30, 73, 118,0.8)' }}>
                                        <Typography variant='h5'>
                                            1
                                        </Typography>
                                    </Button>
                                </Grid>
                                <Grid item xs={4} md={4} lg={4} style={{ display: 'flex', alignContent: 'center', justifyContent: "center" }} >
                                    <Button variant='outlined' color='inherit' onClick={() => { this.addPin("2") }} style={{ width: 60, height: 60, borderColor: 'rgba(30, 73, 118,0.8)' }}>
                                        <Typography variant='h5'>
                                            2
                                        </Typography>
                                    </Button>
                                </Grid>
                                <Grid item xs={4} md={4} lg={4} style={{ display: 'flex', alignContent: 'center', justifyContent: "center" }} >
                                    <Button variant='outlined' color='inherit' onClick={() => { this.addPin("3") }} style={{ width: 60, height: 60, borderColor: 'rgba(30, 73, 118,0.8)' }}>
                                        <Typography variant='h5'>
                                            3
                                        </Typography>
                                    </Button>
                                </Grid>
                                <Grid item xs={4} md={4} lg={4} style={{ display: 'flex', alignContent: 'center', justifyContent: "center" }} >
                                    <Button variant='outlined' color='inherit' onClick={() => { this.setState({ codepin: this.state.codepin.slice(0, this.state.pin.length - 1) }) }} style={{ width: 60, height: 60, borderColor: 'rgba(30, 73, 118,0.8)' }}>
                                        <Typography variant='h5'>
                                            {"<"}
                                        </Typography>
                                    </Button>
                                </Grid>
                                <Grid item xs={4} md={4} lg={4} style={{ display: 'flex', alignContent: 'center', justifyContent: "center" }} >
                                    <Button variant='outlined' color='inherit' onClick={() => { this.addPin("0") }} style={{ width: 60, height: 60, borderColor: 'rgba(30, 73, 118,0.8)' }}>
                                        <Typography variant='h5'>
                                            0
                                        </Typography>
                                    </Button>
                                </Grid>
                                <Grid item xs={4} md={4} lg={4} style={{ display: 'flex', alignContent: 'center', justifyContent: "center" }} >
                                    <Button variant='contained' onClick={() => { this.submit() }} style={{ width: 60, height: 60 }}>
                                        <Typography variant='h6'>
                                            {"OK"}
                                        </Typography>
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                        <Box>
                            <Typography variant='caption'>
                                {"Status : " +this.state.status}
                            </Typography>
                        </Box>
                        <Box onClick={() => { sessionStorage.clear(); this.props.onDisconnect() }}>
                            <Typography variant='caption'>
                                {"Disconnect of " + sessionStorage.getItem('name')}
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            )
        } else {
            return (
                <Main setMessage={this.props.setMessage.bind(this)} isMobile={this.props.isMobile} onDisconnect={() => { this.disconnect() }} />
            )
        }
    }

}

export default Authentification;
