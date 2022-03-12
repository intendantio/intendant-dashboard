import React from 'react'
import { CheckCircle, Error} from '@mui/icons-material'
import { Typography, Paper, Grid, Card, Button, Box, Divider, Pagination } from '@mui/material'
import Request from '../../utils/Request'
import Desktop from '../../components/Desktop'
import Moment from 'moment'
import Loading from '../../components/Loading'

class System extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            product: "light",
            logs: [],
            status: { web: { status: "ok", message: "" }, cloud: { status: "ok", message: "" }, market: { status: "ok", message: "" }, manager: { status: "ok", message: "" } },
            page: 0,
            loading: true,
            upgrade: false,
            version: "",
            currentVersion: ""
        }
        props.setTitle("System")
        props.setActionType("list")
    }

    async componentDidMount() {
        let result = await new Request().get().fetch("/api/logs")
        let resultUpgrade = await new Request().get().fetch("/api/upgrade")
        let resultConfigurations = await new Request().get().fetch("/api/configurations")
        let resultStatus = await fetch("https://status.intendant.io/")
        let resultStatusJSON = await resultStatus.json()
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else if (resultUpgrade.error) {
            this.props.setMessage(resultUpgrade.package + " : " + resultUpgrade.message)
        } else if (resultConfigurations.error) {
            this.props.setMessage(resultConfigurations.package + " : " + resultConfigurations.message)
        } else {
            this.setState({
                upgrade: resultUpgrade.data.upgrade,
                version: resultUpgrade.data.version,
                status: resultStatusJSON,
                currentVersion: resultConfigurations.data.version,
                logs: result.data.map(log => {
                    log.dateTime = Moment(parseInt(log.date)).format("HH:mm")
                    return log
                }).reverse(), loading: false
            })
        }
    }

    async upgrade() {
        this.setState({ loading: true })
        let result = await new Request().post().fetch("/api/upgrade")
        location.reload()
    }

    render() {
        return (
            <>
                <Desktop isMobile={this.props.isMobile}>
                    <Paper variant="outlined" style={{ padding: 12, justifyContent: 'left' }}>
                        <Typography variant='h6' fontWeight='bold' >Information</Typography>
                    </Paper>
                </Desktop>
                <Loading loading={this.state.loading}>
                    <Grid container spacing={1} style={{ marginTop: 0 }}>
                        {
                            this.state.upgrade ?
                                <>
                                    <Grid item xs={12} md={10} lg={10} >
                                        <Card variant='outlined' style={{ padding: 12, display: 'flex', flexDirection: 'row' }}  >
                                            <Typography variant='subtitle1' fontWeight='bold' >{"Intendant core, an update is available " + this.state.currentVersion + " > " + this.state.version}</Typography>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} md={2} lg={2}>
                                        <Card elevation={3} style={{ height: '100%' }} >
                                            <Button variant='contained' color='success' onClick={() => { this.upgrade() }} style={{ width: '100%', height: '100%', padding: 10, flexDirection: 'row', display: 'flex' }}>
                                                <Typography textAlign='center' style={{ color: 'white' }} fontWeight='bold' variant='subtitle1'>{String.capitalizeFirstLetter("upgrade")}</Typography>
                                            </Button>
                                        </Card>
                                    </Grid>
                                </> : null

                        }
                        <Grid item xs={12} md={12} lg={5} >
                            <Card variant='outlined' style={{ padding: 12 }}  >
                                <Typography variant='subtitle1' fontWeight='bold' >Cloud service</Typography>
                                <Typography variant='subtitle2' color="text.secondary" >Powered from status.intendant.io</Typography>
                                <Divider style={{ marginTop: 12, marginBottom: 12 }} />
                                <Box style={{ display: 'flex', flexDirection: 'row', marginBottom: 12 }}>
                                    {this.state.status.web.status == "ok" ? <CheckCircle color='success' /> : this.state.status.web.status == "warning" ? <Error color='warning' /> : <Error color='error' />}
                                    <Typography style={{ marginLeft: 12 }} variant='body1' >{"Website"}</Typography>
                                    <Typography style={{ alignSelf: 'center', marginLeft: 12, overflowWrap: 'anywhere' }} color="text.secondary" variant='body1' >{this.state.status.web.message}</Typography>
                                </Box>
                                <Box style={{ display: 'flex', flexDirection: 'row', marginBottom: 12 }}>
                                    {this.state.status.cloud.status == "ok" ? <CheckCircle color='success' /> : this.state.status.cloud.status == "warning" ? <Error color='warning' /> : <Error color='error' />}
                                    <Typography style={{ marginLeft: 12 }} variant='body1' >{"Cloud"}</Typography>
                                    <Typography style={{ alignSelf: 'center', marginLeft: 12, overflowWrap: 'anywhere' }} color="text.secondary" variant='body1' >{this.state.status.cloud.message}</Typography>
                                </Box>
                                <Box style={{ display: 'flex', flexDirection: 'row', marginBottom: 12 }}>
                                    {this.state.status.market.status == "ok" ? <CheckCircle color='success' /> : this.state.status.market.status == "warning" ? <Error color='warning' /> : <Error color='error' />}
                                    <Typography style={{ marginLeft: 12 }} variant='body1' >{"Market"}</Typography>
                                    <Typography style={{ alignSelf: 'center', marginLeft: 12, overflowWrap: 'anywhere' }} color="text.secondary" variant='body1' >{this.state.status.market.message}</Typography>
                                </Box>
                                <Box style={{ display: 'flex', flexDirection: 'row', marginBottom: 12 }}>
                                    {this.state.status.manager.status == "ok" ? <CheckCircle color='success' /> : this.state.status.manager.status == "warning" ? <Error color='warning' /> : <Error color='error' />}
                                    <Typography style={{ marginLeft: 12 }} variant='body1' >{"Manager"}</Typography>
                                    <Typography style={{ alignSelf: 'center', marginLeft: 12, overflowWrap: 'anywhere' }} color="text.secondary" variant='body1' >{this.state.status.manager.message}</Typography>
                                </Box>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={12} lg={7} >
                            <Card variant='outlined' style={{ padding: 12 }}  >
                                <Typography variant='subtitle1' fontWeight='bold' >Log</Typography>
                                <Typography variant='subtitle2' color="text.secondary" >Local information</Typography>
                                <Divider style={{ marginTop: 12, marginBottom: 12 }} />
                                {
                                    this.state.logs.slice(this.state.page * 20, (this.state.page + 1) * 20).map((log, index) => {
                                        return (
                                            <Box key={index} style={{ display: 'flex', flexDirecton: 'row', marginBottom: 5 }}>
                                                <Box style={{ background: log.type == "VERBOSE" ? '#00873D' : log.type == "WARNING" ? "#FFAA15" : "#FF4040", borderRadius: 3, paddingLeft: 5, paddingRight: 5, height: 'min-content' }}>
                                                    <Typography variant='body2' style={{ alignItems: 'center' }} >{log.dateTime}</Typography>
                                                </Box>
                                                <Typography variant='body2' color="text.secondary" style={{ marginLeft: 10 }}  >{log.message}</Typography>
                                            </Box>
                                        )
                                    })
                                }
                                <Box style={{ marginTop: 12, display: 'flex', justifyContent: 'center' }}>
                                    <Pagination count={parseInt(this.state.logs.length / 20)} onChange={(evt, page) => { this.setState({ page: page }) }} />
                                </Box>
                            </Card>
                        </Grid>
                    </Grid>
                </Loading>
            </>
        )
    }
}

export default System