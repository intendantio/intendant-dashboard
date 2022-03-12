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
            smartobjects: []
        }
        props.setTitle("Automation")
        props.setActionType("list")
    }

    async componentDidMount() {
        let result = await new Request().get().fetch("/api/automations")
        let resultSmartobject = await new Request().get().fetch("/api/smartobjects")
        let resultProcess = await new Request().get().fetch("/api/processes")
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else if (resultSmartobject.error) {
            this.props.setMessage(resultSmartobject.package + " : " + resultSmartobject.message)
        } else if (resultProcess.error) {
            this.props.setMessage(resultProcess.package + " : " + resultProcess.message)
        } else {
            let automations = result.data.map(automation => {
                if (automation.trigger.type == "smartobject") {
                    resultSmartobject.data.forEach(smartobject => {
                        if (smartobject.id == automation.trigger.object) {
                            automation.trigger.source = smartobject
                        }
                    })
                } else if (automation.trigger.type == "process") {
                    resultProcess.data.forEach(process => {
                        if (process.id == automation.trigger.object) {
                            automation.trigger.source = process
                        }
                    })
                }
                if (automation.action.type == "smartobject") {
                    resultSmartobject.data.forEach(smartobject => {
                        if (smartobject.id == automation.action.object) {
                            automation.action.source = smartobject
                        }
                    })
                } else if (automation.action.type == "process") {
                    resultProcess.data.forEach(process => {
                        if (process.id == automation.action.object) {
                            automation.action.source = process
                        }
                    })
                }
                return automation
            })
            this.setState({ loading: false, automations: automations })
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
                                    return (
                                        <Grid key={index} item xs={12} md={12} lg={12}>
                                            <Card variant='outlined' style={{ padding: 12, display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }} >
                                                <Grid container spacing={1} >
                                                    <Grid item xs={12} md={10} lg={5}>
                                                        <Card variant='outlined' style={{ justifyContent: 'center', alignItems: 'center', padding: 5, display: 'flex', flexDirection: 'row', borderRadius: 5, marginRight: 10 }}>
                                                            <Bolt fontSize='medium' />
                                                            <Box style={{ marginLeft: 12 }}>
                                                                <Typography variant='subtitle1' >{automation.trigger.trigger.toUpperCase() + " - " + (automation.trigger.type == "smartobject" ? automation.trigger.source.reference.toUpperCase() : automation.trigger.source.description.toUpperCase())}</Typography>
                                                            </Box>
                                                        </Card>
                                                    </Grid>
                                                    <Grid item xs={12} md={2} lg={1}>
                                                        <Card variant='outlined' style={{ padding: 5, borderRadius: 5, marginRight: 10 }}>
                                                            <Typography variant='subtitle1' style={{ textAlign: 'center' }} >THEN</Typography>
                                                        </Card>
                                                    </Grid>
                                                    <Grid item xs={12} md={11} lg={5}>
                                                        <Card variant='outlined' style={{ justifyContent: 'center', alignItems: 'center', padding: 5, display: 'flex', flexDirection: 'row', borderRadius: 5, marginRight: 10 }}>
                                                            <Highlight fontSize='medium' />
                                                            <Box style={{ marginLeft: 12 }}>
                                                                <Typography variant='subtitle1' >{(automation.action.type == "smartobject" ? automation.action.source.reference.toUpperCase() : automation.action.source.description.toUpperCase()) + " - " + automation.action.action.toUpperCase()}</Typography>
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