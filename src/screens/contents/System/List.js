import React from 'react'
import { Add, CheckCircle, Error, FlashOff, FlashOn, Light } from '@mui/icons-material'
import { Typography, Paper, Grid, Card, Button, TableContainer, TableHead, TableRow, TablePagination, IconButton, Box, Divider, Pagination } from '@mui/material'
import Request from '../../../utils/Request'
import Desktop from '../../../components/Desktop'
import AddButton from '../../../components/views/AddButton'
import TypeProduct from '../../../components/TypeProduct'
import Package from '../../../../package.json'
import Moment from 'moment'
import Loading from '../../../components/Loading'


class System extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            product: "light",
            logs: [],
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
                                        <Card variant='outlined' style={{ padding: 12, display:'flex', flexDirection:'row' }}  >
                                            <Typography variant='subtitle1' fontWeight='bold' >{"Intendant core, an update is available " + this.state.currentVersion + " > " + this.state.version}</Typography>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} md={2} lg={2}>
                                        <Card elevation={3} style={{height: '100%'}} >
                                            <Button variant='contained' color='success' onClick={() => { this.upgrade() }} style={{ width: '100%', height: '100%', padding: 10,  flexDirection: 'row', display: 'flex' }}>
                                                <Typography textAlign='center' style={{color:'white'}} fontWeight='bold' variant='subtitle1'>{String.capitalizeFirstLetter("upgrade")}</Typography>
                                            </Button>
                                        </Card>
                                    </Grid>
                                </> : null

                        }
                        <Grid item xs={12} md={12} lg={4} >
                            <Card variant='outlined' style={{ padding: 12 }}  >
                                <Typography variant='subtitle1' fontWeight='bold' >Cloud service</Typography>
                                <Typography variant='subtitle2' color="text.secondary" >Powered from Intendant.io</Typography>
                                <Divider style={{ marginTop: 12, marginBottom: 12 }} />
                                <Box style={{ display: 'flex', flexDirection: 'row', marginBottom: 12 }}>
                                    <CheckCircle color='success' />
                                    <Typography style={{ alignSelf: 'center', marginLeft: 12 }} variant='body1' >{"Website"}</Typography>
                                </Box>
                                <Box style={{ display: 'flex', flexDirection: 'row', marginBottom: 12 }}>
                                    <Error color='warning' />
                                    <Typography style={{ alignSelf: 'center', marginLeft: 12 }} variant='body1' >{"Cloud system"}</Typography>
                                    <Typography style={{ alignSelf: 'center', marginLeft: 12 }} color="text.secondary" variant='body1' >{"Maintenance is in progress"}</Typography>
                                </Box>
                                <Box style={{ display: 'flex', flexDirection: 'row', marginBottom: 12 }}>
                                    <CheckCircle color='success' />
                                    <Typography style={{ alignSelf: 'center', marginLeft: 12 }} variant='body1' >{"Market"}</Typography>
                                </Box>
                                <Box style={{ display: 'flex', flexDirection: 'row', marginBottom: 12 }}>
                                    <Error color='error' />
                                    <Typography style={{ alignSelf: 'center', marginLeft: 12 }} variant='body1' >{"Manager"}</Typography>
                                    <Typography style={{ alignSelf: 'center', marginLeft: 12 }} color="text.secondary" variant='body1' >{"A shutdown of the service is underway"}</Typography>
                                </Box>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={12} lg={8} >
                            <Card variant='outlined' style={{ padding: 12 }}  >
                                <Typography variant='subtitle1' fontWeight='bold' >Log</Typography>
                                <Typography variant='subtitle2' color="text.secondary" >Local information</Typography>
                                <Divider style={{ marginTop: 12, marginBottom: 12 }} />
                                {
                                    this.state.logs.slice(this.state.page * 20, (this.state.page + 1) * 20).map((log,index) => {
                                        return (
                                            <Box key={index} style={{ display: 'flex', flexDirecton: 'row', marginBottom: 3 }}>
                                                <Box style={{ background: log.type == "VERBOSE" ? '#00873D' : log.type == "WARNING" ? "#FFAA15" : "#FF4040", borderRadius: 3, paddingLeft: 5, paddingRight: 5 }}>
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