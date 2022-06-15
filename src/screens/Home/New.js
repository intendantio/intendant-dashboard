import React from 'react'
import Request from '../../utils/Request'
import { Grid, Card, Step, StepLabel, Stepper, Box, Typography, Paper, CardActionArea, Divider } from '@mui/material'
import Loading from '../../components/Loading'
import Desktop from '../../components/Desktop'
import * as AbstractIcon from '@mui/icons-material'

class New extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            step: 0,
            type: "",
            name: "",
            room: { id: -1 },
            smartobjects: [],
            smartobject: [],
            rapports: [],
            processes: [],
            rooms: []
        }
        props.setTitle("New item")
        props.setActionType("return")
    }

    async componentDidMount() {
        let result = await new Request().get().fetch("/api/smartobjects")
        let resultProcesses = await new Request().get().fetch("/api/processes/withoutData")
        let resultRapport = await new Request().get().fetch("/api/rapports")
        let resultRooms = await new Request().get().fetch("/api/rooms")
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else if (resultProcesses.error) {
            this.props.setMessage(resultProcesses.package + " : " + resultProcesses.message)
        } else if (resultRapport.error) {
            this.props.setMessage(resultRapport.package + " : " + resultRapport.message)
        } else if (resultRooms.error) {
            this.props.setMessage(resultRooms.package + " : " + resultRooms.message)
        } else {
            this.setState({ smartobjects: result.data, loading: false, rapports: resultRapport.data, processes: resultProcesses.data, rooms: resultRooms.data })
        }
    }

    async save(type, object, action) {
        let idUser = localStorage.getItem("user")
        let result = await new Request().post({
            user: idUser,
            type: type,
            object: object,
            action: action,
            x: 0,
            y: 0
        }).fetch("/api/users/" + idUser + "/dashboards")
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.props.history.push('/')
        }
    }

    getStep() {
        switch (this.state.step) {
            case 0:
                return this.state.rooms.map((room, index) => {
                    let CurrentIcon = AbstractIcon[room.icon]
                    return (
                        <Grid key={index} item xs={6} md={6} lg={4} >
                            <Card variant='outlined'   >
                                <CardActionArea onClick={() => { this.setState({ step: 1, room: room }) }} style={{ padding: 10 }} >
                                    <Box style={{ display: 'flex', flex: 1, alignItems: 'center' }} >
                                        <Box style={{ display: 'flex', justifyContent: 'center', alignSelf: 'center', marginRight: 16 }}>
                                            <CurrentIcon fontSize='large' />
                                        </Box>
                                        <Typography variant='subtitle1' >
                                            {String.capitalizeFirstLetter(room.name)}
                                        </Typography>

                                    </Box>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    )
                })
            case 1:
                return <>
                    {
                        this.state.processes.filter(process => process.room.id == this.state.room.id).map((process, index) => {
                            return (
                                <Grid key={index} item xs={6} md={6} lg={4} >
                                    <Card variant='outlined'   >
                                        <CardActionArea onClick={() => { this.save("process", this.state.room.id, process.hash) }} style={{ padding: 10 }} >
                                            <Typography fontWeight='bold' variant='subtitle1' >
                                                {"Process"}
                                            </Typography>
                                            <Divider style={{ marginTop: 5, marginBottom: 5 }} />
                                            <Typography variant='body2' color="text.secondary"  >
                                                {process.name}
                                            </Typography>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            )
                        })
                    }
                    {
                        this.state.smartobjects.filter(smartobject => smartobject.room.id == this.state.room.id).map((smartobject, index) => {
                            return (
                                <Grid key={index} item xs={6} md={6} lg={4} >
                                    <Card variant='outlined'   >
                                        <CardActionArea onClick={() => { this.setState({ smartobject: smartobject, step: 2 }) }} style={{ padding: 10 }} >
                                            <Typography fontWeight='bold' variant='subtitle1' >
                                                {"Smartobject"}
                                            </Typography>
                                            <Divider style={{ marginTop: 5, marginBottom: 5 }} />
                                            <Typography variant='body2' color="text.secondary" >
                                                {String.capitalizeFirstLetter(smartobject.reference)}
                                            </Typography>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            )
                        })
                    }
                </>
            case 2:
                return (
                    <>
                        {
                            this.state.smartobject.widgets.map((widget, index) => {
                                return (
                                    <Grid key={"widget-" + index} item xs={12} md={6} lg={4} >
                                        <Card variant='outlined'  >
                                            <CardActionArea onClick={() => { this.save("widget", this.state.smartobject.id, widget.id) }} style={{ padding: 10 }} >
                                                <Typography variant='subtitle1' >
                                                    {"Widget"}
                                                </Typography>
                                                <Divider style={{ marginTop: 5, marginBottom: 5 }} />
                                                <Typography variant='body2' color="text.secondary" >
                                                    {widget.title.example}
                                                </Typography>
                                                {
                                                    widget.contents.map(content => {
                                                        return (
                                                            <Typography variant='body2' color="text.secondary"  >
                                                                {content.example}
                                                            </Typography>
                                                        )
                                                    })
                                                }
                                            </CardActionArea>
                                        </Card>
                                    </Grid>
                                )
                            })
                        }
                        {
                            this.state.smartobject.actions.map((action, index) => {
                                return (
                                    <Grid key={"widget-" + index} item xs={12} md={6} lg={4} >
                                        <Card variant='outlined'  >
                                            <CardActionArea onClick={() => { this.save("smartobject", this.state.smartobject.id, action.id) }} style={{ padding: 10 }} >
                                                <Typography variant='subtitle1' >
                                                    {"Action"}
                                                </Typography>
                                                <Divider style={{ marginTop: 5, marginBottom: 5 }} />
                                                <Typography variant='body2' color="text.secondary" >
                                                    {action.name}
                                                </Typography>
                                            </CardActionArea>
                                        </Card>
                                    </Grid>
                                )
                            })
                        }
                        {
                            this.state.rapports.filter(rapport => rapport.type == "smartobject" && rapport.object == this.state.smartobject.id).map((rapport, index) => {
                                return (
                                    <Grid key={"rapport-" + index} item xs={12} md={6} lg={4} >
                                        <Card variant='outlined'  >
                                            <CardActionArea onClick={() => { this.save("rapport", rapport.id, rapport.reference) }} style={{ padding: 10 }} >
                                                <Typography variant='subtitle1' >
                                                    {"Rapport"}
                                                </Typography>
                                                <Divider style={{ marginTop: 5, marginBottom: 5 }} />
                                                <Typography variant='body2' color="text.secondary" >
                                                    {String.capitalizeFirstLetter(rapport.reference)}
                                                </Typography>
                                            </CardActionArea>
                                        </Card>
                                    </Grid>
                                )
                            })
                        }
                    </>
                )
        }
    }

    render() {
        return (
            <>
                <Desktop isMobile={this.props.isMobile}>
                    <Paper variant="outlined" style={{ padding: 12, justifyContent: 'left' }}>
                        <Typography variant='h6' fontWeight='bold' >New item</Typography>
                    </Paper>
                </Desktop>
                <Card variant='outlined' style={{ padding: 10, marginTop: 8 }}>
                    <Stepper activeStep={this.state.step} >
                        <Step key={"room"}>
                            <StepLabel>{"Room"}</StepLabel>
                        </Step>
                        <Step key={"smartobject"}>
                            <StepLabel>{"Smartobject"}</StepLabel>
                        </Step>
                        <Step key={"source"}>
                            <StepLabel>{"Source"}</StepLabel>
                        </Step>
                    </Stepper>
                </Card>
                <Loading loading={this.state.loading}>
                    <Grid container spacing={1} style={{ marginTop: 0 }} >
                        {this.getStep()}
                    </Grid>
                </Loading>
            </>
        )
    }
}

export default New