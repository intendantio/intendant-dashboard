import React from 'react'
import { Paper, Typography, Radio, Box, Grid, Card, FormControl, RadioGroup, FormControlLabel, TextField, Button } from '@mui/material'
import Desktop from '../../components/Desktop'
import Loading from '../../components/Loading'
import DeleteButton from '../../components/views/DeleteButton'
import Request from '../../utils/Request'
import Moment from 'moment'

class DetailUser extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            id: props.match.params.id,
            profiles: [],
            loading: true,
            update: false,
            newPassword: "",
            user: {
                login: "",
                imei: "",
                histories: [],
                profile: ""
            }
        }
        props.setTitle("")
        props.setActionType("return")
    }

    async componentDidMount() {
        let resultProfile = await new Request().get().fetch("/api/profiles")
        let resultUser = await new Request().get().fetch("/api/users/" + this.state.id)
        if (resultUser.error) {
            this.props.setMessage(resultUser.package + " : " + resultUser.message)
            this.props.history.push('/user')
        } else if (resultProfile.error) {
            this.props.setMessage(resultProfile.package + " : " + resultProfile.message)
            this.props.history.push('/user')
        } else {
            this.props.setTitle(resultUser.data.login)
            this.setState({ loading: false, user: resultUser.data, profiles: resultProfile.data })
        }
    }

    async delete() {
        let result = await new Request().delete().fetch("/api/users/" + this.state.id)
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.props.history.push('/user')
        }
    }

    async updateProfile(profile) {
        let result = await new Request().post({ profile: profile }).fetch("/api/users/" + this.state.id + "/profile")
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.componentDidMount()
        }
    }


    async updatePassword() {
        console.log(this.state)
        if(this.state.newPassword.isNumber()) {
            if(this.state.newPassword.length == 6) {
                let result = await new Request().post({ password: this.state.newPassword }).fetch("/api/users/" + this.state.id + "/password")
                if (result.error) {
                    this.props.setMessage(result.package + " : " + result.message)
                } else {
                    this.setState({update: false, loading: true, newPassword: ""})
                    this.componentDidMount()
                }
            } else {
                this.props.setMessage("Password must have length of 6")
            }
        } else {
            this.props.setMessage("Password must have only a number")
        }
    }

    render() {
        return (
            <>
                <Desktop {... this.props}>
                    <Paper variant="outlined" style={{ padding: 12, justifyContent: 'left' }}>
                        <Box style={{ display: 'flex', flex: 1 }} >
                            <Box style={{ flex: 4, alignSelf: 'center', alignItems: 'center' }} >
                                <Typography variant='h6' fontWeight='bold'  >
                                    {String.capitalizeFirstLetter(this.state.user.login)}
                                </Typography>
                                <Typography variant='subtitle2' color="text.secondary"  >
                                    {"Everything you need to know about a user"}
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Desktop>
                <Loading loading={this.state.loading}>
                    <Grid container spacing={1} style={{ marginTop: 0 }}>
                        <Grid item xs={12} md={4} lg={4}>
                            <Card variant={'outlined'} style={{ padding: 10 }} >
                                <Typography variant='h6' style={{ marginBottom: 10 }}  >
                                    {"Profile"}
                                </Typography>
                                <FormControl>
                                    <RadioGroup value={this.state.user.profile} onChange={(event) => { this.updateProfile(event.target.value) }} >
                                        {
                                            this.state.profiles.map((profile, index) => {
                                                return (
                                                    <FormControlLabel key={index} value={profile.id} control={<Radio />} label={String.capitalizeFirstLetter(profile.name)} />
                                                )
                                            })
                                        }
                                    </RadioGroup>
                                </FormControl>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={8} lg={8}>
                            <Card variant={'outlined'} style={{ padding: 10 }} >
                                <Typography variant='h6' style={{ marginBottom: 10 }}  >
                                    {"Histories"}
                                </Typography>
                                {
                                    this.state.user.histories.map((history, index) => {
                                        let moment = Moment(history.date)
                                        return (
                                            <Typography key={index} variant='body1'  >
                                                {moment.format("HH:mm:ss") + " - " + history.action}
                                            </Typography>
                                        )
                                    })
                                }
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4} lg={4}>
                            <Card variant={'outlined'} style={{ padding: 10 }} >
                                <Typography variant='h6' style={{ marginBottom: 10 }}  >
                                    {"Settings"}
                                </Typography>
                                <FormControl>
                                    {
                                        this.state.update ?
                                            <>
                                                <TextField value={this.state.newPassword} onChange={(event) => { this.setState({newPassword: event.currentTarget.value}) }} placeholder='000000' variant="outlined" size='small' />
                                                <Button onClick={() => this.updatePassword()} color='primary' variant='contained' style={{ marginTop: 12 }} size='small' >
                                                    Save
                                                </Button>
                                            </>
                                            :
                                            <Button onClick={() => this.setState({ update: true, newPassword: "" })} color='primary' variant='contained' size='small' >
                                                Update password
                                            </Button>
                                    }
                                </FormControl>
                            </Card>
                        </Grid>
                        <DeleteButton onClick={() => { this.delete() }} />
                    </Grid>
                </Loading>
            </>
        )
    }
}

String.prototype.isNumber = function(){return /^\d+$/.test(this);}


export default DetailUser