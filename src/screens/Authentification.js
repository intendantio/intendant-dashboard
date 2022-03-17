import React from 'react'
import Package from '../../package.json'
import { Paper, TextField, Button, Typography, Box, Skeleton } from '@mui/material'
import Alert from '../components/Alert'
import Main from './Main'
import GetStarted from './GetStarted'
import Request from '../utils/Request'

class Authentification extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            authentification: true,
            getStarted: false,
            password: "",
            customAddress: true,
            address: window.location.origin,
            login: "admin",
            loading: true
        }
    }



    async componentDidMount() {
        try {
            let server = localStorage.getItem("server")
            if (server) {
                let result = await new Request().get().fetch("/api/smartobjects")
                if (result.error == false) {
                    this.setState({ enabled: false, authentification: false })
                }
            } else if (server) {
                this.setState({ address: server.replace("http://", "") })
            }
            this.setState({ loading: false })
        } catch (error) {
            localStorage.clear()
            this.setState({ loading: false })
        }
    }

    async login() {
        if (await this.checkServer()) {
            let result = await fetch(localStorage.getItem("server") + "/api/authentification", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ login: this.state.login, password: this.state.password })
            })
            let resultJSON = await result.json()
            if (resultJSON.error) {
                this.props.setMessage(resultJSON.package + " : " + resultJSON.message)
            } else {
                localStorage.setItem("expiry", resultJSON.data.expiry + "")
                localStorage.setItem("user", resultJSON.data.user)
                localStorage.setItem("access_token", resultJSON.data.access_token)
                localStorage.setItem("refresh_token", resultJSON.data.refresh_token)
                this.setState({ enabled: false, message: "", authentification: false })
            }
        }
    }

    disconnect() {
        localStorage.clear()
        this.setState({ authentification: true, password: "" })
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
                localStorage.setItem("server", protocol + this.state.address)
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

    render() {
        if (this.state.loading) {
            return (
                <Paper variant='outlined' style={{ padding: 10, width: '25vw', minWidth: 330, textAlign: 'center' }}>
                    <Box style={{ padding: 10 }}>
                        <Box style={{ marginBottom: 20 }}>
                            <img src={process.env.PUBLIC_URL + "/logo.svg"} style={{ height: '15vh', width: '15vh', minWidth: 125, minHeight: 125, borderRadius: 7 }} />
                            <Typography variant='h3' fontWeight='bold'>
                                Intendant
                            </Typography>
                            <Typography variant='h5' fontWeight='bold'>
                                Smart home
                            </Typography>
                        </Box>
                        <Skeleton height={45} />
                        <Skeleton height={45} />
                        <Skeleton height={45} />
                    </Box>
                </Paper>
            )
        }
        if (this.state.getStarted) {
            return (
                <GetStarted setMessage={this.props.setMessage} isMobile={this.props.isMobile} onFinish={() => { this.setState({ getStarted: false }) }} />
            )
        } else {
            if (this.state.authentification) {
                return (
                    <Paper variant='outlined' style={{ padding: 10, width: '25vw', minWidth: 330, textAlign: 'center' }}>
                        <Box style={{ padding: 10 }}>
                            <Box style={{ marginBottom: 20 }}>
                                <img src={process.env.PUBLIC_URL + "/logo.svg"} style={{ height: '15vh', width: '15vh', minWidth: 125, minHeight: 125, borderRadius: 7 }} />
                                <Typography variant='h3' fontWeight='bold'>
                                    Intendant
                                </Typography>
                                <Typography variant='h6' fontWeight='bold'>
                                    Administration
                                </Typography>
                            </Box>
                            <form noValidate onSubmit={(e) => { e.preventDefault(); this.login() }} autoComplete="off" >
                                {
                                    this.state.customAddress ?
                                        <TextField style={{ marginTop: 5, marginBottom: 5 }} value={this.state.address} fullWidth label="Server address" autoFocus inputProps={{ autoCapitalize: 'none', autoCorrect: 'off' }} onChange={(event) => { this.setState({ address: event.nativeEvent.target.value }) }} />
                                        :
                                        null
                                }
                                <TextField style={{ marginTop: 5, marginBottom: 5 }} value={this.state.login} fullWidth label="Login" autoComplete="current-login" inputProps={{ maxLength: 12,autoCapitalize: 'none', autoCorrect: 'off' }} onChange={(event) => { this.setState({ login: event.nativeEvent.target.value }) }} />
                                <TextField style={{ marginTop: 5, marginBottom: 5 }} value={this.state.password} fullWidth label="Password" type='password' autoComplete="current-login" inputProps={{ maxLength: 12,autoCapitalize: 'none', autoCorrect: 'off' }} onChange={(event) => { this.setState({ password: event.nativeEvent.target.value }) }} />
                                <Box style={{ display: 'flex', justifyContent: 'end', marginTop: 10 }}>
                                    <Button color='inherit' type='submit' variant='plain' on onSubmit={() => { this.login() }} onClick={() => { this.login() }}  >
                                        Connection
                                    </Button>
                                </Box>
                            </form>
                        </Box>
                    </Paper>
                )
            } else {
                return (
                    <Main isMobile={this.props.isMobile} onDisconnect={() => { this.disconnect() }} />
                )
            }
        }
    }

}

export default Authentification;
