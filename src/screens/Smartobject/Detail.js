import React from 'react'
import JSONPretty from 'react-json-pretty'
import { Paper, OutlinedInput, Typography, Card, Grid, Accordion, Box, Modal, AccordionSummary, AccordionDetails, Button, TextField, FormControlLabel, IconButton, Switch, Divider, CardActionArea } from '@mui/material'
import { ExpandMore, Cloud, Edit, Delete, Help, Refresh, Downloading, House, Settings, RocketLaunch, Add, CheckCircle, Workspaces } from '@mui/icons-material'
import Action from '../../components/Action'
import Desktop from '../../components/Desktop'
import Request from '../../utils/Request'
import Loading from '../../components/Loading'
import * as AbstractIcon from '@mui/icons-material'
import DeleteButton from '../../components/views/DeleteButton'
import md5 from 'md5'


class DetailSmartObject extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            id: props.match.params.idSmartobject,
            idRoom: props.match.params.id,
            smartobject: {
                reference: "",
                actions: [],
                room: {},
                configuration: {
                    submit: {
                        type: "none"
                    },
                    version: ""
                },
                status: {
                    status: "SUCCESS",
                    reason: ""
                }
            },
            positions: [],
            expanded: "action",
            rooms: [],
            modalOpen: false,
            content: {},
            loadingAction: "",
            loading: true,
            smartobjectState: {
                title: {
                    value: ""
                },
                values: []
            },
            positionName: ""
        }
        props.setTitle("")
        props.setActionType("return")
    }

    async componentDidMount() {
        let resultRoom = await new Request().get().fetch("/api/rooms")
        let resultPositions = await new Request().get().fetch("/api/positions")
        let resultSmartobject = await new Request().get().fetch("/api/smartobjects/" + this.state.id)
        //let resultSmartobjectState = await new Request().get().fetch("/api/smartobjects/" + this.state.id + "/state")
        let resultSmartobjectWidgetState = await new Request().get().fetch("/api/smartobjects/" + this.state.id + "/widgets/state")
        if(resultSmartobjectWidgetState.error == false) {
            this.setState({smartobjectState: resultSmartobjectWidgetState.data})
        }
        if (resultRoom.error) {
            this.props.setMessage(resultRoom.package + " : " + resultRoom.message)
            this.props.history.push('/room/' + this.state.idRoom)
        } else if (resultSmartobject.error) {
            this.props.setMessage(resultSmartobject.package + " : " + resultSmartobject.message)
            this.props.history.push('/room/' + this.state.idRoom)
        } else if (resultPositions.error) {
            this.props.setMessage(resultPositions.package + " : " + resultPositions.message)
            this.props.history.push('/room/' + this.state.idRoom)
        } else {
            this.props.setTitle(resultSmartobject.data.reference)
            this.setState({
                reference: resultSmartobject.data.reference, positions: resultPositions.data, loadingAction: "", loading: false, smartobject: resultSmartobject.data, rooms: resultRoom.data
            })
        }
    }

    async delete() {
        let result = await new Request().delete().fetch("/api/smartobjects/" + this.state.id)
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.props.history.push('/room/' + this.state.idRoom)
        }
    }

    async executeAction(action, settings) {
        this.setState({ loadingAction: action.id })
        let tmp = {}
        for (let index = 0; index < settings.length; index++) {
            let setting = settings[index]
            let value = this.state[action.id + "-" + setting.id]
            if (value) {
                tmp[setting.id] = value
            } else {
                tmp[setting.id] = setting.default
            }
        }
        let result = await new Request().post({ settings: tmp }).fetch("/api/smartobjects/" + this.state.id + "/actions/" + action.id)
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
            this.setState({ loadingAction: "" })
        } else {
            let smartobject = this.state.smartobject
            smartobject.actions = []

            this.setState({
                modalOpen: true,
                content: result.data,
                smartobject: smartobject
            })
            this.componentDidMount()
        }
    }

    async addPosition() {
        if(this.state.positionName.length == "") {
            this.props.setMessage("Missing position name")
        } else {
            let result = await new Request().post({ name: this.state.positionName }).fetch("/api/positions")
            if (result.error) {
                this.props.setMessage(result.package + " : " + result.message)
            } else {
                let resultPositions = await new Request().get().fetch("/api/positions")
                if (resultPositions.error) {
                    this.props.setMessage(resultPositions.package + " : " + resultPositions.message)
                } else {
                    this.setState({ positions: resultPositions.data, positionName: "" })
                }
            }
        }
    }

    async updateRoom(room) {
        let result = await new Request().post({ idRoom: room.id }).fetch("/api/smartobjects/" + this.state.smartobject.id + "/room")
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.componentDidMount()
        }
    }

    async updatePosition(position) {
        let result = await new Request().post({ idPosition: position }).fetch("/api/smartobjects/" + this.state.smartobject.id + "/position")
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.componentDidMount()
        }
    }

    async updateReference() {
        let result = await new Request().post({ reference: this.state.reference }).fetch("/api/smartobjects/" + this.state.smartobject.id + "/reference")
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.componentDidMount()
        }
    }

    async installPackage() {
        this.setState({ loading: true })
        let result = await new Request().patch({ package: this.state.smartobject.module }).fetch("/api/smartobjects")
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
            this.props.history.push('/room/' + this.state.idRoom)
        } else {
            setTimeout(() => {
                this.componentDidMount()
            }, 3000)
        }
    }

    async restart() {
        this.setState({ loading: true })
        let result = await new Request().post().fetch("/api/smartobjects/" + this.state.smartobject.id + "/restart")
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            setTimeout(() => {
                this.componentDidMount()
            }, 3000)
        }
    }

    async reinstall() {
        location.href = this.state.smartobject.configuration.submit.url +
            (this.state.smartobject.configuration.submit.url.includes("?") ? "&" : "?") +
            "smartobject_id=" + this.state.smartobject.id + "&reference=" + this.state.smartobject.reference +
            "&room=" + this.state.smartobject.room.id + "&redirect_uri=" +
            window.location.origin + "/smartobject/oauth/" +
            md5(this.state.smartobject.configuration.name)
    }

    render() {
        let lastGroup = ""
        return (
            <>
                <Desktop {... this.props}>
                    <Paper variant="outlined" style={{ padding: 12, justifyContent: 'left' }}>
                        <Box style={{ display: 'flex', flex: 1 }} >
                            <Box style={{ flex: 4, alignSelf: 'center', alignItems: 'center' }} >
                                <Typography variant='h6' fontWeight='bold'  >
                                    {String.capitalizeFirstLetter(this.state.smartobject.reference)}
                                </Typography>
                                <Typography variant='subtitle2' color="text.secondary"  >
                                    {String.capitalizeFirstLetter(this.state.smartobject.module) + " - " + this.state.smartobject.configuration.version}
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Desktop>
                <Loading loading={this.state.loading}>
                    <Grid container spacing={1} style={{ marginTop: 0 }}>

                        <Grid item xs={12} md={12} lg={12} >
                            <Accordion variant='outlined' expanded={this.state.expanded === 'state'} onChange={() => this.setState({ expanded: "state" })}>
                                <AccordionSummary expandIcon={<ExpandMore />} >
                                    {
                                        this.state.smartobject.status.status == "ERROR" ?
                                            <AbstractIcon.PriorityHigh style={{ fontSize: '28px', marginRight: 10 }} /> :
                                            this.state.smartobject.status.status == "SUCCESS" ?
                                                <AbstractIcon.Check style={Object.assign({ fontSize: '28px', marginRight: 10 },this.state.smartobjectState.title.styles)} /> :
                                                this.state.smartobject.status.status == "EXCEPTIONS" ?
                                                    <AbstractIcon.QuestionMark style={{ fontSize: '28px', marginRight: 10 }} /> :
                                                    <Help style={{ fontSize: '28px' }} />
                                    }
                                    {
                                        this.state.smartobject.status.status == "SUCCESS" ?
                                        <Typography variant='h6' style={this.state.smartobjectState.title.styles} >
                                            {String.capitalizeFirstLetter(this.state.smartobjectState.title.value)}
                                        </Typography> :
                                        <Typography variant='h6' >
                                            {String.capitalizeFirstLetter(this.state.smartobject.status.reason)}
                                        </Typography>
                                    }
                                </AccordionSummary>
                                <Divider />
                                <AccordionDetails>
                                    <Grid container >
                                        {
                                            this.state.smartobject.status.status == "SUCCESS" &&
                                            this.state.smartobjectState.values.map(content => {
                                                    return (
                                                        <Grid style={{marginTop: 5}} item xs={12} md={12} lg={12} >
                                                            <Typography style={content.styles} variant='body2' >
                                                                {String.capitalizeFirstLetter(content.value)}
                                                            </Typography>
                                                        </Grid>
                                                    )
                                            })
                                        }
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                        {(this.state.smartobject.status.status == "SUCCESS" || this.state.smartobject.status.status == "EXCEPTIONS") && <Grid item xs={12} md={12} lg={12} >
                            <Accordion variant='outlined' expanded={this.state.expanded === 'action'} onChange={() => this.setState({ expanded: "action" })}>
                                <AccordionSummary expandIcon={<ExpandMore />} >
                                    <RocketLaunch style={{ fontSize: '28px' }} />
                                    <Typography variant='h6' style={{ marginLeft: 10 }}>
                                        Action
                                    </Typography>
                                </AccordionSummary>
                                <Divider />
                                <AccordionDetails>
                                    <Grid container >
                                        {
                                            this.state.smartobject.actions.filter(action => {
                                                return action.type == "effect"
                                            }).map((action, index) => {
                                                return (
                                                    <Grid key={index} item xs={12} md={12} lg={12} style={{ marginTop: 7 }} >
                                                        <Grid container spacing={action.settings.length == 0 && this.props.isMobile ? 0 : 2} >
                                                            <Grid item xs={12} md={3} lg={3} >
                                                                <Card elevation={2}  >
                                                                    <Button disabled={action.id == this.state.loadingAction || this.state.smartobject.status.status != "SUCCESS"} variant='contained' onClick={() => { this.executeAction(action, action.settings) }} style={{ padding: 5, paddingTop: 10, paddingBottom: 10, borderColor: 'white', width: '100%', height: '100%' }}>
                                                                        <Typography textAlign='center' variant='body1' style={{ color: 'white' }}>
                                                                            {action.name}
                                                                        </Typography>
                                                                    </Button>
                                                                </Card>
                                                            </Grid>
                                                            <Grid item xs={12} md={9} lg={9} style={{ alignSelf: 'center', paddingLeft: 10 }}>
                                                                <Grid container spacing={1}>
                                                                    {
                                                                        action.settings.map((setting, index) => {
                                                                            return (
                                                                                <Action options={setting.options} label={String.capitalizeFirstLetter(setting.id)} setState={this.setState.bind(this)} id={action.id + "-" + setting.id} action={setting} />
                                                                            )
                                                                        })
                                                                    }
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                        <Divider style={{ marginBottom: 7, marginTop: 14 }} />
                                                    </Grid>
                                                )
                                            })
                                        }
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>}
                        <Grid item xs={12} md={12} lg={12} >
                            <Accordion variant='outlined' expanded={this.state.expanded === 'room'} onChange={() => this.setState({ expanded: "room" })}>
                                <AccordionSummary expandIcon={<ExpandMore />} >
                                    <House style={{ fontSize: '28px' }} />
                                    <Typography variant='h6' style={{ marginLeft: 10 }}>
                                        Room
                                    </Typography>
                                </AccordionSummary>
                                <Divider />
                                <AccordionDetails>
                                    <Grid container spacing={1} style={{ marginTop: 2 }}>
                                        {
                                            this.state.rooms.map((room, index) => {
                                                let CurrentIcon = AbstractIcon[room.icon]
                                                return (
                                                    <Grid key={index} item xs={12} md={3} lg={2}>
                                                        <Button onClick={() => { this.updateRoom(room) }} color={room.id == this.state.smartobject.room.id ? 'success' : 'primary'} variant={'contained'} style={{ padding: 5, paddingTop: 10, paddingBottom: 10, borderColor: 'white', width: '100%' }} >
                                                            <CurrentIcon style={{ color: 'white' }} />
                                                            <Typography variant='body1' style={{ marginLeft: 10, color: 'white' }}   >
                                                                {room.name}
                                                            </Typography>
                                                        </Button>
                                                    </Grid>
                                                )
                                            })
                                        }
                                    </Grid>
                                    <Divider style={{marginTop: 15, marginBottom: 15}} />
                                    <Grid container spacing={1}>
                                        {
                                            this.state.positions.map((position, index) => {
                                                let currentPosition = this.state.smartobject.position ? this.state.smartobject.position.id : -1
                                                return (
                                                    <Grid key={index} item xs={12} md={3} lg={2}  style={{display:'flex'}}>
                                                        <Button onClick={() => { this.updatePosition(currentPosition == position.id ? -1 : position.id) }} color={this.state.smartobject.position && position.id == this.state.smartobject.position.id ? 'success' : 'primary'} variant={'contained'} style={{ padding: 5, paddingTop: 10, paddingBottom: 10, borderColor: 'white', width: '100%' }} >
                                                            <Typography variant='body1' style={{ color: 'white' }}   >
                                                                {position.name}
                                                            </Typography>
                                                        </Button>
                                                    </Grid>
                                                )
                                            })
                                        }
                                        <Grid item xs={12} md={6} lg={2} style={{display:'flex'}}>
                                            <OutlinedInput
                                                style={{borderEndEndRadius: 0, borderTopRightRadius: 0, width: '100%'}}
                                                size='small'
                                                value={this.state.positionName}
                                                onChange={(event) => {  this.setState({ positionName: event.nativeEvent.target.value })  }}
                                                variant="filled"
                                                margin='none'
                                            />
                                            <Button onClick={() => { this.addPosition() }} color={'primary'} variant={'contained'} style={{ padding: 5, paddingTop: 10, paddingBottom: 10, borderStartStartRadius: 0, borderBottomLeftRadius: 0, borderColor: 'white' }} >
                                                <Add/>
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                        <Grid item xs={12} md={12} lg={12} >
                            <Accordion variant='outlined' expanded={this.state.expanded === 'edit'} onChange={() => this.setState({ expanded: "edit" })}>
                                <AccordionSummary expandIcon={<ExpandMore />} >
                                    <Edit style={{ fontSize: '28px' }} />
                                    <Typography variant='h6' style={{ marginLeft: 10 }}>
                                        Edit
                                    </Typography>
                                </AccordionSummary>
                                <Divider />
                                <AccordionDetails>
                                    <Grid container spacing={2} >
                                        <Grid item xs={12} md={4} lg={4}>
                                            <OutlinedInput
                                                value={this.state.reference}
                                                color={this.state.smartobject.reference != this.state.reference ? "warning" : "info"}
                                                onChange={(event) => { this.setState({ reference: event.nativeEvent.target.value }) }}
                                                onBlur={(event) => { this.updateReference() }}
                                                variant="filled"
                                                margin='none'
                                            />
                                        </Grid>
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                        </Grid> <Grid item xs={12} md={12} lg={12} >
                            <Accordion variant='outlined' expanded={this.state.expanded === 'more'} onChange={() => this.setState({ expanded: "more" })}>
                                <AccordionSummary expandIcon={<ExpandMore />} >
                                    <Settings style={{ fontSize: '28px' }} />
                                    <Typography variant='h6' style={{ marginLeft: 10 }}>
                                        More
                                    </Typography>
                                </AccordionSummary>
                                <Divider />
                                <AccordionDetails>
                                    <Grid container spacing={2} style={{ marginTop: 2 }}>
                                        <Grid item xs={12} md={3} lg={2}>
                                            <Button onClick={() => { this.restart() }} variant={'contained'} style={{ padding: 5, paddingTop: 10, paddingBottom: 10, borderColor: 'white', width: '100%', height: '100%' }} >
                                                <Refresh style={{ color: 'white' }} />
                                                <Typography variant='body1' style={{ marginLeft: 10, color: 'white' }}   >
                                                    {"Restart"}
                                                </Typography>
                                            </Button>
                                        </Grid>
                                        <Grid item xs={12} md={3} lg={2}>
                                            <Button onClick={() => { this.installPackage() }} variant={'contained'} style={{ padding: 5, paddingTop: 10, paddingBottom: 10, borderColor: 'white', width: '100%', height: '100%' }} >
                                                <Downloading style={{ color: 'white' }} />
                                                <Typography variant='body1' style={{ marginLeft: 10, color: 'white' }}   >
                                                    {"Update"}
                                                </Typography>
                                            </Button>
                                        </Grid>
                                        {
                                            this.state.smartobject.configuration.submit.type == "oauth" ?
                                                <Grid item xs={12} md={3} lg={2}>
                                                    <Button onClick={() => { this.reinstall() }} color='warning' variant={'contained'} style={{ padding: 5, paddingTop: 10, paddingBottom: 10, borderColor: 'white', width: '100%', height: '100%' }} >
                                                        <Cloud style={{ color: 'white' }} />
                                                        <Typography variant='body1' style={{ marginLeft: 10, color: 'white' }}   >
                                                            {"Reset"}
                                                        </Typography>
                                                    </Button>
                                                </Grid> : null
                                        }
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                        <DeleteButton onClick={() => { this.delete() }} />
                    </Grid>
                    <Modal open={this.state.modalOpen} style={{ top: '25%', left: '25%' }} onClose={() => { this.setState({ modalOpen: false }) }} >
                        <Card variant='outlined' style={{ overflow: 'auto', maxHeight: '50vh', maxWidth: '50vw', padding: 20 }}>
                            <JSONPretty style={{ fontSize: 12 }} id="json-pretty" data={this.state.content}></JSONPretty>
                        </Card>
                    </Modal>
                </Loading>
            </>
        )
    }
}

export default DetailSmartObject