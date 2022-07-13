import React from 'react'
import { Typography, Paper, Grid, Card, Box } from '@mui/material'
import { Bolt, Highlight } from '@mui/icons-material'
import Request from '../../utils/Request'
import Desktop from '../../components/Desktop'
import Loading from '../../components/Loading'
import AddButton from '../../components/views/AddButton'
import DeleteButton from '../../components/views/DeleteButton'


class Routine extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            automations: [],
            smartobjects: new Map(),
            processes: new Map()
        }
        props.setTitle("Automation")
        props.setActionType("list")
    }

    async componentDidMount() {
        let result = await new Request().get().fetch("/api/automations")
        let resultSmartobject = await new Request().get().fetch("/api/smartobjects")
        let resultProcess = await new Request().get().fetch("/api/processes/withoutData")
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else if (resultSmartobject.error) {
            this.props.setMessage(resultSmartobject.package + " : " + resultSmartobject.message)
        } else if (resultProcess.error) {
            this.props.setMessage(resultProcess.package + " : " + resultProcess.message)
        } else {
            let smartobjects = new Map()
            resultSmartobject.data.forEach(smartobject => {
                smartobjects.set(smartobject.id, smartobject)
            })
            
            let processes = new Map()
            resultProcess.data.forEach(process => {
                processes.set(process.hash, process)
            })
            this.setState({ loading: false, automations: result.data, smartobjects: smartobjects, processes: processes })
        }
    }


    async delete(id) {
        let result = await new Request().delete({}).fetch("/api/automations/" + id)
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.setState({ loading: true }, () => {
                this.componentDidMount()
            })
        }
    }

    getTriggerDescription(automation) {
        if (automation.trigger.type == "smartobject") {
            if (this.state.smartobjects.has(automation.trigger.object)) {
                let smartobject = this.state.smartobjects.get(automation.trigger.object)
                let find = false
                smartobject.triggers.forEach(trigger => {
                    if (trigger.id == automation.trigger.trigger) {
                        find = trigger
                    }
                })
                if (find) {
                    return find.name.toUpperCase() + " ON " + smartobject.reference.toUpperCase()
                } else {
                    return "Unknown action"
                }
            } else {
                return "Unknown smartobject"
            }
        } else {
            return "Unknown trigger"
        }
    }

    getActionDescription(automation) {
        if (automation.action.type == "smartobject") {
            if (this.state.smartobjects.has(automation.action.object)) {
                let smartobject = this.state.smartobjects.get(automation.action.object)
                let find = false
                smartobject.actions.forEach(action => {
                    if (action.id == automation.action.action) {
                        find = action
                    }
                })
                if (find) {
                    return find.name.toUpperCase() + " ON " + smartobject.reference.toUpperCase()
                } else {
                    return "Unknown action"
                }
            } else {
                return "Unknown smartobject"
            }
        } else if(automation.action.type == "process") {
            if (this.state.processes.has(automation.action.object)) {
                let process = this.state.processes.get(automation.action.object)
                return process.name.toUpperCase()
            } else {
                return "Unknown smartobject"
            }
        } else {
            return "Unknown trigger"
        }
    }

    render() {
        return (
            <>
                <Desktop {... this.props}>
                    <Paper variant="outlined" style={{ padding: 12, justifyContent: 'left' }}>
                        <Typography variant='h6' fontWeight='bold' >Automation</Typography>
                        <Typography variant='subtitle2' color="text.secondary" >Do what you want when you want</Typography>
                    </Paper>
                </Desktop>
                <Loading loading={this.state.loading}>
                    <Grid container spacing={1} style={{ marginTop: 0 }}>
                        {
                            this.state.automations.length == 0 ?
                                <Grid item xs={12} md={12} lg={12}>
                                    <Card variant='outlined' style={{ padding: 12 }}  >
                                        <Typography variant='subtitle1' color="text.secondary" >You have not added a automation</Typography>
                                    </Card>
                                </Grid>
                                :
                                this.state.automations.map((automation, index) => {
                                    console.log(automation)
                                    return (
                                        <Grid key={index} item xs={12} md={12} lg={12}>
                                            <Card variant='outlined' style={{ padding: 12, display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }} >
                                                <Grid container spacing={1} style={{justifyContent:'space-around'}} >
                                                    <Grid item xs={12} md={2} lg={1}>
                                                        <Card variant='outlined' style={{ padding: 5, borderRadius: 5, marginRight: 10 }}>
                                                            <Typography variant='subtitle1' style={{ textAlign: 'center', fontWeight: 'bold' }} >WHEN</Typography>
                                                        </Card>
                                                    </Grid>
                                                    <Grid item xs={12} md={10} lg={4}>
                                                        <Card variant='outlined' style={{ backgroundColor: 'rgb(0, 127, 255)', justifyContent: 'center', alignItems: 'center', padding: 5, display: 'flex', flexDirection: 'row', borderRadius: 5, marginRight: 10 }}>
                                                            <Box style={{ marginLeft: 12 }}>
                                                                <Typography variant='subtitle1' style={{fontWeight: 'bold'}} >
                                                                    {this.getTriggerDescription(automation)}
                                                                </Typography>
                                                            </Box>
                                                        </Card>
                                                    </Grid>
                                                    <Grid item xs={12} md={2} lg={1}>
                                                        <Card variant='outlined' style={{ padding: 5, borderRadius: 5, marginRight: 10 }}>
                                                            <Typography variant='subtitle1' style={{ textAlign: 'center', fontWeight: 'bold' }} >THEN</Typography>
                                                        </Card>
                                                    </Grid>
                                                    <Grid item xs={12} md={11} lg={4}>
                                                        <Card variant='outlined' style={{ backgroundColor: '#00873D', justifyContent: 'center', alignItems: 'center', padding: 5, display: 'flex', flexDirection: 'row', borderRadius: 5, marginRight: 10 }}>
                                                            <Box style={{ marginLeft: 12 }}>
                                                                <Typography variant='subtitle1' style={{fontWeight: 'bold'}} >
                                                                    {this.getActionDescription(automation)}
                                                                </Typography>
                                                            </Box>
                                                        </Card>
                                                    </Grid>
                                                    <DeleteButton xs={12} md={1} lg={1} onClick={() => { this.delete(automation.id) }} />
                                                </Grid>
                                            </Card>
                                        </Grid>
                                    )
                                })
                        }
                        <AddButton to="/automation/new" />
                    </Grid>
                </Loading>
            </>
        )
    }
}


export default Routine