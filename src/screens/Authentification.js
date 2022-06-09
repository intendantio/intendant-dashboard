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
            let path = localStorage.getItem("path")
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
            localStorage.clear()
            this.setState({ loading: false })
        }
    }

   

    disconnect() {
        localStorage.removeItem("expiry")
        localStorage.removeItem("user")
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        this.setState({ authentification: true, codepin: "" })
    }

    addPin(item) {
        this.setState({ codepin: this.state.codepin + item })
    }

    async submit() {
        this.setState({loading: true})
        let path = localStorage.getItem("path")
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
            localStorage.setItem("expiry", resultJSON.data.expiry + "")
            localStorage.setItem("user", resultJSON.data.user)
            localStorage.setItem("access_token", resultJSON.data.access_token)
            localStorage.setItem("refresh_token", resultJSON.data.refresh_token)
            this.setState({ authentification: false })
        }
        this.setState({loading: false})
    }

    render() {
        if (this.state.authentification) {
            return (
                <Paper variant='outlined' style={{ padding: 10, width: '25vw', minWidth: 300, minHeight: 'min-content', textAlign: 'center' }}>
                    <Box style={{ padding: 10 }}>
                        <Box style={{ marginBottom: 16, marginTop: 4 }}>
                            <Typography variant='h3' fontWeight='bold'>
                                Intendant
                            </Typography>
                            <Typography style={{marginTop:4}} variant='h5' >
                                Welcome
                            </Typography>
                        </Box>
                        <Box style={{ marginBottom: 10, justifyContent:'center', display:'flex' }}>
                            {this.state.loading ?
                                <Skeleton width={150} height={30} />
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
                                    <Button variant='outlined' color='inherit' onClick={() => { this.setState({ codepin: this.state.codepin.slice(0, this.state.codepin.length - 1) }) }} style={{ width: 60, height: 60, borderColor: 'rgba(30, 73, 118,0.8)' }}>
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
                                    <Button variant='contained' onClick={() => { this.state.loading ? null : this.submit() }} style={{ width: 60, height: 60 }}>
                                        {
                                            this.state.loading ?
                                            <Skeleton width={125} height={30} />
                                            :
                                            <Typography variant='h6'>
                                                {"OK"}
                                            </Typography>

                                        }
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                        <Box>
                            <Typography variant='caption'>
                                {"Status : " +this.state.status}
                            </Typography>
                        </Box>
                        <Box onClick={() => { localStorage.clear(); this.props.onDisconnect() }}>
                            <Typography variant='caption'>
                                {"Disconnect"}
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
