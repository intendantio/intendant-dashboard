import React from 'react'
import { Paper, TextField, Button } from '@mui/material'

class GetStarted extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            authentification: true,
            password: "",
            confirmePassword: "",
            login: "admin"
        }
    }


    async register() {
        if (this.state.password == this.state.confirmePassword) {
            let result = await fetch(sessionStorage.getItem("server") + "/api/configurations", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password: this.state.password })
            })
            let resultJSON = await result.json()
            if (resultJSON.error) {
                this.props.setMessage(resultJSON.package + " : " + resultJSON.message)
            } else {
                this.props.onFinish()
            }
        } else {
            this.props.setMessage('Password and password confirmation is not the same')
        }
    }


    render() {
        return (
            <Paper variant='outlined' style={{ padding: 30, width: this.props.isMobile ? '400px' : '30vw', textAlign: 'center' }}>
                <div >
                    <img src={process.env.PUBLIC_URL + "/logo.svg"} style={{ height: '15vh', width: '15vh', borderRadius: 7 }} />
                    <div style={{ fontSize: 70, fontWeight: 'bold', marginTop: 0, lineHeight: 0.5 }}>
                        Intendant
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 'bold', marginTop: 0, lineHeight: 1, marginTop: 30 }}>
                        At the first launch, you must set the admin password
                    </div>
                </div>
                <div noValidate autoComplete="off" style={{ marginBottom: 10, marginTop: 25 }}>
                    <div style={{ marginTop: 10 }}>
                        <TextField value={this.state.password} fullWidth label="Password" type='password' inputProps={{ maxLength: 12 }} onChange={(event) => { this.setState({ password: event.nativeEvent.target.value }) }} />
                    </div>
                    <div style={{ marginTop: 10 }}>
                        <TextField value={this.state.confirmePassword} fullWidth label="Confirmation" type='password' inputProps={{ maxLength: 12 }} onChange={(event) => { this.setState({ confirmePassword: event.nativeEvent.target.value }) }} />
                    </div>
                    <div style={{ marginTop: 15, textAlign: 'end' }}>
                        <Button color='inherit' variant='plain' onClick={() => { this.register() }}  >
                            Let's get started
                        </Button>
                    </div>
                </div>
            </Paper>
        )
    }

}

export default GetStarted;
