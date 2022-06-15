import React from 'react'
import { Paper, Typography, Box, Grid, Card, CardActionArea, FormControlLabel, Switch, Skeleton, Button, Modal} from '@mui/material'
import { FlashOff, FlashOn } from '@mui/icons-material'
import Desktop from '../../components/Desktop'
import DeleteButton from '../../components/views/DeleteButton'
import AddButton from '../../components/views/AddButton'
import Request from '../../utils/Request'
import * as AbstractIcon from '@mui/icons-material'
import Loading from '../../components/Loading'
import Action from '../../components/Action'

class DetailRoom extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            id: props.match.params.id,
            room: {
                icon: "Autorenew",
                name: "",
                description: "",
                smartobjects: []
            },
            loading: true,
            profiles: [],
            processes: [],
            process: {
                settings: []
            }
        }
        props.setTitle("")
        props.setActionType("return")
    }

    async componentDidMount() {
        let resultProfile = await new Request().get().fetch("/api/profiles")
        let resultRoom = await new Request().get().fetch("/api/rooms/" + this.state.id)
        let resultProcess = await new Request().get().fetch("/api/processes")
        if (resultRoom.error) {
            this.props.setMessage(resultRoom.package + " : " + resultRoom.message)
            this.props.history.push('/room')
        } else if (resultProcess.error) {
            this.props.setMessage(resultProcess.package + " : " + resultProcess.message)
            this.props.history.push('/room')
        } else if (resultProfile.error) {
            this.props.setMessage(resultProfile.package + " : " + resultProfile.message)
            this.props.history.push('/room')
        } else {
            this.props.setTitle(resultRoom.data.name)
            this.setState({ loading: false, room: resultRoom.data, profiles: resultProfile.data, processes: resultProcess.data.filter(process => process.room.id == this.state.id) })
        }
    }

    async delete(id) {
        let result = await new Request().delete().fetch("/api/rooms/" + id)
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.props.history.push('/room')
        }
    }

    async insertProfile(profile) {
        let result = await new Request().post({ idProfile: profile.id, }).fetch("/api/rooms/" + this.state.room.id + "/profiles")
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.componentDidMount()
        }
    }

    async deleteProfile(profile) {
        let result = await new Request().delete().fetch("/api/rooms/" + this.state.room.id + "/profiles/" + profile.id)
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.componentDidMount()
        }
    }

    async executeAction() {
        let resetState = {}
        let tmp = {}
        for (let index = 0; index < this.state.process.settings.length; index++) {
            let setting = this.state.process.settings[index]
            let value = this.state[setting.id]
            resetState[setting.id] = null
            if (value) {
                tmp[setting.id] = value
            } else {
                tmp[setting.id] = null
            }
        }
        this.setState({ open: false })

        let result = await new Request().post({
            smartobjects: this.state.process.smartobjects,
            action: this.state.process.action,
            settings: tmp 
        }).fetch("/api/processes/execute")

        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.setState(resetState)
            this.componentDidMount()
        }
    }

    render() {
        let CurrentIcon = AbstractIcon[this.state.room.icon]
        return (
            <>
                <Desktop {... this.props}>
                    <Paper variant="outlined" style={{ padding: 12, justifyContent: 'left' }}>
                        <Box style={{ display: 'flex', flex: 1 }} >
                            {
                                this.state.loading ?
                                    <Box style={{ width: '100%' }}>
                                        <Skeleton height={40} />
                                        <Skeleton height={20} />
                                    </Box> :
                                    <>
                                        <Box style={{ display: 'flex', justifyContent: 'center', alignSelf: 'center', marginRight: 16 }}>
                                            <CurrentIcon fontSize='large' />
                                        </Box>
                                        <Box style={{ flex: 4, alignSelf: 'center', alignItems: 'center' }} >
                                            <Typography variant='h6' fontWeight='bold' >
                                                {String.capitalizeFirstLetter(this.state.room.name)}
                                            </Typography>
                                            <Typography variant='subtitle2' color="text.secondary"   >
                                                {String.capitalizeFirstLetter(this.state.room.description)}
                                            </Typography>
                                        </Box>
                                    </>
                            }
                        </Box>
                    </Paper>
                </Desktop>
                <Loading loading={this.state.loading}>
                    {
                        this.state.processes.length > 0 ?
                        <Card variant='outlined' style={{ padding: 12, marginTop: 8 }}  >
                            <Grid container spacing={2}  >
                                {
                                    this.state.processes.map(process => {
                                        return (
                                            <Grid item xs={12} md={4} lg={3}>
                                                <Button variant='contained' onClick={() => { process.settings.length == 0 ? this.executeAction() : this.setState({process: process, open: true})  }} style={{backgroundColor: process.isDefault ?  'rgb(1, 67, 134)' : 'rgb(0, 127, 255)',  textTransform: 'none', textAlign: 'center', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                                    <Typography variant='body1'  >
                                                        {
                                                            String.capitalizeFirstLetter(process.name)
                                                        }
                                                    </Typography>
                                                </Button>
                                            </Grid>
                                        )
                                    })
                                }
                            </Grid>
                        </Card> : null
                    }
                    <Modal onClose={() => { this.setState({ open: false }) }} open={this.state.open}>
                        <Card variant='outlined' style={{ padding: 10, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 300 }}>
                            <Grid container spacing={1}>
                                {
                                    this.state.process.settings.map((input, index) => {
                                        return (
                                            <Grid item xs={12} md={12} lg={12}>
                                                <Action options={input.options} label={String.capitalizeFirstLetter(input.id)} setState={this.setState.bind(this)} id={input.id} action={input} />
                                            </Grid>
                                        )
                                    })
                                }

                            </Grid>
                            <Button onClick={() => { this.executeAction() }} size='large' style={{ width: '50%', marginTop: 12 }} variant='contained'>
                                <Typography variant='body2' >
                                    {String.capitalizeFirstLetter("Execute")}
                                </Typography>
                            </Button>
                        </Card>
                </Modal>
                    <Grid container spacing={1} style={{ marginTop: 0 }} >
                        {
                            this.state.room.smartobjects.length == 0 ?
                                <Grid item xs={12} md={12} lg={12}>
                                    <Card variant='outlined' style={{ padding: 12 }}  >
                                        <Typography variant='subtitle1' color="text.secondary" >You have not added a smartobject</Typography>
                                    </Card>
                                </Grid>
                                :
                                this.state.room.smartobjects.map((smartobject, index) => {
                                    return (
                                        <Grid key={index} item xs={12} md={6} lg={4} >
                                            <Card variant={'outlined'}   >
                                                <CardActionArea style={{ padding: 12, display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }} onClick={() => { this.props.history.push('/room/' + this.state.id + '/smartobject/' + smartobject.id) }}  >
                                                    <Box style={{ display: 'flex', flex: 1 }} >
                                                        <Box style={{ display: 'flex', justifyContent: 'center', alignSelf: 'center', marginRight: 16 }}>
                                                            {smartobject.status.status == "SUCCESS" ? <FlashOn fontSize='large' /> : <FlashOff color='disabled' fontSize='large' />}
                                                        </Box>
                                                        <Box style={{ flex: 4, alignSelf: 'center', alignItems: 'center' }} >
                                                            <Typography variant='subtitle1' color={smartobject.status.status == "SUCCESS" ? "text.primary" : "text.secondary"} >
                                                                {String.capitalizeFirstLetter(smartobject.reference)}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </CardActionArea>
                                            </Card>
                                        </Grid>
                                    )
                                })
                        }
                        <AddButton xs={12} fill md={6} lg={4} to={"/room/" + this.state.id + "/smartobject/gallery"} />
                        <Grid item xs={12} md={12} lg={12}>
                            <Card variant='outlined' style={{ padding: 12 }}  >
                                <Box style={{ display: 'flex', flexWrap: 'wrap' }}>
                                    {
                                        this.state.profiles.map((profile, index) => {
                                            let state = this.state.room.profiles.filter(pprofile => {
                                                return pprofile.profile == profile.id
                                            }).length > 0
                                            return (
                                                <Box key={index} style={{ padding: 1 }}  >
                                                    <FormControlLabel control={
                                                        <Switch
                                                            checked={state}
                                                            onChange={() => {
                                                                state ? this.deleteProfile(profile) : this.insertProfile(profile)
                                                            }}
                                                            color="primary"
                                                        />
                                                    } label={String.capitalizeFirstLetter(profile.name)} />
                                                </Box>
                                            )
                                        })
                                    }
                                </Box>
                            </Card>
                        </Grid>
                        <DeleteButton onClick={() => { this.delete(this.state.id) }} />
                    </Grid>
                </Loading>
            </>
        )
    }
}


export default DetailRoom