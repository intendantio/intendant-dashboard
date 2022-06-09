import React from 'react'
import { Paper, TextField, Button, Typography, Box, Skeleton } from '@mui/material'
import Authentification from './Authentification'
import { Link, withRouter } from "react-router-dom"

const code = "https://cloud.intendant.io/ws/token"

class Configuration extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            authentification: true,
            password: "",
            username: "",
            server: "",
            loading: true
        }
    }



    componentDidMount() {
        try {
            let path = localStorage.getItem("path")
            if (path) {
                this.setState({ loading: false, authentification: false })
            } else {
                this.setState({ loading: false })
            }
        } catch (error) {
            localStorage.clear()
            this.setState({ loading: false })
        }
    }

    onDisconnect() {
        this.setState({
            loading: true,
            authentification: true,
            password: "",
            username: ""
        }, () => {
            this.componentDidMount()
        })
    }

    async authentification() {
        this.setState({ loading: true })
        let result = await fetch(code, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                grant_type: "password",
                username: this.state.username,
                password: this.state.password,
                client_id: "Xn9YunVTDZ5GhQ6Y",
                client_secret: "6xj6hrLmvaYThUjR"
            })
        })
        let resultJSON = await result.json()

        if (resultJSON.error) {
            this.setState({ loading: false, password: "" })
            this.props.setMessage(resultJSON.message)
        } else {
            let resultHome = await fetch("https://cloud.intendant.io/ws/home", {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + resultJSON.access_token
                }
            })
            let resultHomeJSON = await resultHome.json()
            if (resultHomeJSON.error) {
                this.setState({ loading: false })
                this.props.setMessage(resultHomeJSON.message)
            } else {
                localStorage.setItem("cloud_expiry", resultJSON.expires_in + "")
                localStorage.setItem("cloud_token", resultJSON.access_token)
                localStorage.setItem("cloud_manager", resultJSON.refresh_token)
                localStorage.setItem("path", resultHomeJSON.data.path)
                localStorage.setItem("token", resultHomeJSON.data.token)
                localStorage.setItem("uuid", resultHomeJSON.data.uuid)
                localStorage.setItem("type", resultHomeJSON.data.type)
                localStorage.setItem("name", resultHomeJSON.data.name)
                this.setState({ authentification: false, loading: false }, () => {
                    document.getElementById('main').scroll({ top: 0, left: 0 })
                })
            }


        }
    }


    render() {
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
                                Connection
                            </Typography>
                        </Box>
                        <form noValidate onSubmit={(e) => { e.preventDefault(); this.authentification() }} autoComplete="off" >
                            <TextField style={{ marginTop: 5, marginBottom: 5 }} value={this.state.username} fullWidth label="Email" autoComplete="email" inputProps={{ autoCapitalize: 'none', autoCorrect: 'off' }} onChange={(event) => { this.setState({ username: event.nativeEvent.target.value }) }} />
                            <TextField style={{ marginTop: 10, marginBottom: 5 }} value={this.state.password} fullWidth label="Password" type='password' inputProps={{ autoCapitalize: 'none', autoCorrect: 'off' }} onChange={(event) => { this.setState({ password: event.nativeEvent.target.value }) }} />
                            <Box style={{ display: 'flex', justifyContent: 'end', marginTop: 10 }}>
                                {
                                    this.state.loading ?
                                        <Skeleton width={125} height={37} /> :
                                        <Button color='inherit' type='submit' variant='plain' onSubmit={() => { this.authentification() }} onClick={() => { this.authentification() }}  >
                                            Connection
                                        </Button>
                                }
                            </Box>
                        </form>
                        <a href="https://intendant.io" style={{ textDecoration: 'none', color: 'white' }}>
                            <Typography variant='caption' >
                                New account ?
                            </Typography>
                        </a>
                    </Box>
                </Paper>
            )
        } else {
            return (
                <Authentification onDisconnect={this.onDisconnect.bind(this)} setMessage={this.props.setMessage.bind(this)} isMobile={this.props.isMobile} />
            )
        }
    }

}

export default Configuration
