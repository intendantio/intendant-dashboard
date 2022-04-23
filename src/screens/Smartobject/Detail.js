import React from 'react'
import JSONPretty from 'react-json-pretty'
import { Paper, OutlinedInput, Typography, Card, Grid, Accordion, Box, Modal, AccordionSummary, AccordionDetails, Button, TextField, FormControlLabel, IconButton, Switch, Divider, CardActionArea } from '@mui/material'
import { ExpandMore, Cloud, Edit, Error, Help, Refresh, Downloading, House, Settings, RocketLaunch, Bolt, CheckCircle, Workspaces } from '@mui/icons-material'
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
                }
            },
            links: [],
            expanded: "action",
            rooms: [],
            modalOpen: false,
            content: {},
            loadingAction: "",
            loading: true,
            state: {
                status: "EXCEPTIONS",
                reason: "",
                contents: []
            }
        }
        props.setTitle("")
        props.setActionType("return")
    }

    async componentDidMount() {
        let resultRoom = await new Request().get().fetch("/api/rooms")
        let resultLinks = await new Request().get().fetch("/api/links")
        let resultSmartobject = await new Request().get().fetch("/api/smartobjects/" + this.state.id)
        let resultSmartobjectState = await new Request().get().fetch("/api/smartobjects/" + this.state.id + "/state")
        if (resultRoom.error) {
            this.props.setMessage(resultRoom.package + " : " + resultRoom.message)
            this.props.history.push('/room/' + this.state.idRoom)
        } else if (resultSmartobject.error) {
            this.props.setMessage(resultSmartobject.package + " : " + resultSmartobject.message)
            this.props.history.push('/room/' + this.state.idRoom)
        } else if (resultSmartobjectState.error) {
            this.props.setMessage(resultSmartobjectState.package + " : " + resultSmartobjectState.message)
            this.props.history.push('/room/' + this.state.idRoom)
        } else if(resultLinks.error) {
            this.props.setMessage(resultLinks.package + " : " + resultLinks.message)
            this.props.history.push('/room/' + this.state.idRoom)
        } else {
            this.props.setTitle(resultSmartobject.data.reference)
            this.setState({ reference: resultSmartobject.data.reference,links: resultLinks.data.filter(link => {
                return link.room == resultSmartobject.data.room.id
            }), loadingAction: "", loading: false, smartobject: resultSmartobject.data, rooms: resultRoom.data, state: resultSmartobjectState.data })
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

    async updateRoom(room) {
        let result = await new Request().post({ idRoom: room.id }).fetch("/api/smartobjects/" + this.state.smartobject.id + "/room")
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.componentDidMount()
        }
    }

    async updateLink(link) {
        let result = await new Request().post({ idLink: link }).fetch("/api/smartobjects/" + this.state.smartobject.id + "/link")
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
                                        this.state.state.status == "ERROR" ?
                                            <AbstractIcon.PriorityHigh style={{ fontSize: '28px' }} /> :
                                            this.state.state.status == "SUCCESS" ?
                                                <AbstractIcon.Check style={{ fontSize: '28px' }} /> :
                                                this.state.state.status == "EXCEPTIONS" ?
                                                    <AbstractIcon.QuestionMark style={{ fontSize: '28px' }} /> :
                                                    <Help style={{ fontSize: '28px' }} />
                                    }
                                    <Typography variant='h6' style={{ marginLeft: 10 }} >
                                        {this.state.state.reason}
                                    </Typography>
                                </AccordionSummary>
                                <Divider />
                                <AccordionDetails>
                                    <Grid container >
                                        {
                                            this.state.state.contents && this.state.state.contents.map(content => {
                                                if(content.type == "text") {
                                                    return (
                                                        <Grid style={{ paddingLeft: 12, marginTop: 12 }} item xs={12} md={12} lg={12} >
                                                            <Typography variant='body2' >
                                                                {content.title}
                                                            </Typography>
                                                            {
                                                                content.descriptions.map(description => {
                                                                    return (
                                                                        <>
                                                                            <Typography variant='caption' color="text.secondary"  >
                                                                                {description}
                                                                            </Typography>
                                                                            <br />
                                                                        </>
                                                                    )
    
                                                                })
                                                            }
                                                        </Grid>
                                                    )
                                                } else if(content.type == "color") {
                                                    return (
                                                        <Grid style={{ paddingLeft: 12, marginTop: 12 }} item xs={12} md={12} lg={12} >
                                                            <Box style={{backgroundColor: content.color,paddingTop: 4, paddingBottom: 4, paddingRight: 8, paddingLeft: 8, borderRadius: 4, width: 'fit-content'}}>
                                                                <Typography variant='body2' >
                                                                    {content.value}
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                    )
                                                }
                                                
                                            })
                                        }
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                        {(this.state.state.status == "SUCCESS" || this.state.state.status == "EXCEPTIONS") && <Grid item xs={12} md={12} lg={12} >
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
                                            this.state.smartobject.actions.map((action, index) => {
                                                return (
                                                    <Grid key={index} item xs={12} md={12} lg={12} style={{ marginTop: 7 }} >
                                                        <Grid container spacing={action.settings.length == 0 && this.props.isMobile ? 0 : 2} >
                                                            <Grid item xs={12} md={3} lg={3} >
                                                                <Card elevation={2}  >
                                                                    <Button disabled={action.id == this.state.loadingAction || this.state.smartobject.state.status != "online"} variant='contained' onClick={() => { this.executeAction(action, action.settings) }} style={{ padding: 5, paddingTop: 10, paddingBottom: 10, borderColor: 'white', width: '100%', height: '100%' }}>
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
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                        <Grid item xs={12} md={12} lg={12} >
                            <Accordion variant='outlined' expanded={this.state.expanded === 'link'} onChange={() => this.setState({ expanded: "link" })}>
                                <AccordionSummary expandIcon={<ExpandMore />} >
                                    <Workspaces style={{ fontSize: '28px' }} />
                                    <Typography variant='h6' style={{ marginLeft: 10 }}>
                                        Group
                                    </Typography>
                                </AccordionSummary>
                                <Divider />
                                <AccordionDetails>
                                    <Grid container spacing={1} style={{ marginTop: 2 }}>
                                        {
                                            this.state.links.map((link, index) => {
                                                let currentLink = this.state.smartobject.link  ? this.state.smartobject.link.id : -1
                                                return (
                                                    <Grid key={index} item xs={12} md={3} lg={2}>
                                                        <Button onClick={() => { this.updateLink(currentLink == link.id ? -1 : link.id) }} color={this.state.smartobject.link && link.id == this.state.smartobject.link.id ? 'success' : 'primary'} variant={'contained'} style={{ padding: 5, paddingTop: 10, paddingBottom: 10, borderColor: 'white', width: '100%' }} >
                                                            <Typography variant='body1' style={{color: 'white' }}   >
                                                                {link.name}
                                                            </Typography>
                                                        </Button>
                                                    </Grid>
                                                )
                                            })
                                        }
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