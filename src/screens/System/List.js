import React from 'react'
import { CheckCircle, ConstructionOutlined, Error } from '@mui/icons-material'
import { Typography, Paper, Grid, Card, Button, Box, Divider, Pagination } from '@mui/material'
import Request from '../../utils/Request'
import Desktop from '../../components/Desktop'
import Loading from '../../components/Loading'
import UpdateVersion from '../../components/UpdateVersion'

class System extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            product: "light",
            status: { web: { status: "SUCCESS", message: "" }, cloud: { status: "SUCCESS", message: "" }, market: { status: "SUCCESS", message: "" }, manager: { status: "SUCCESS", message: "" } },
            page: 0,
            packages: [],
            loading: true,
            upgrade: false,
            version: "",
            smartobjects: [],
            providers: new Map(),
            codes: [],
            currentVersion: ""
        }
        props.setTitle("System")
        props.setActionType("list")
    }

    async componentDidMount() {
        let resultUpgrade = await new Request().get().fetch("/api/upgrade")
        let resultConfigurations = await new Request().get().fetch("/api/configurations")
        let resultStatus = await fetch("https://status.intendant.io/")
        let resultStatusJSON = await resultStatus.json()
        let resultProviders = await fetch("https://cloud.intendant.io/ws/providers")
        let resultProvidersJSON = await resultProviders.json()
        let resultCodes = await fetch("https://cloud.intendant.io/ws/homes/" + localStorage.getItem("uuid") + "/codes", {
            headers: {
                'Authorization': "Bearer " + localStorage.getItem("cloud_token")
            }
        })
        let resultCodesJSON = await resultCodes.json()
        
        if (resultCodesJSON.error) {
            this.props.setMessage(resultCodesJSON.package + " : " + resultCodesJSON.message)
        } else if (resultUpgrade.error) {
            this.props.setMessage(resultUpgrade.package + " : " + resultUpgrade.message)
        } else if (resultConfigurations.error) {
            this.props.setMessage(resultConfigurations.package + " : " + resultConfigurations.message)
        } else if (resultProvidersJSON.error) {
            this.props.setMessage(resultProvidersJSON.package + " : " + resultProvidersJSON.message)
        } else {

            let mapProviders = new Map()
            resultProvidersJSON.data.forEach(provider => {
                mapProviders.set(provider.id, provider)
            })
            this.setState({ providers: mapProviders, status: resultStatusJSON,codes: resultCodesJSON.data, loading: false })
   
        }
    }

    async upgrade() {
        this.setState({ loading: true })
        await new Request().post().fetch("/api/upgrade")
        setTimeout(() => {
            location.reload()
        },5000)
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
                                            <Typography variant='subtitle1' fontWeight='bold' >{"An update is available " + this.state.currentVersion + " > " + this.state.version}</Typography>
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
                        <Grid item xs={12} md={12} lg={3} >
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
                        <Grid item xs={12} md={12} lg={3} >
                            <Card variant='outlined' style={{ padding: 12 }}  >
                                <Typography variant='subtitle1' fontWeight='bold' >Third party service</Typography>
                                <Typography variant='subtitle2' color="text.secondary" >Connected with another partner</Typography>
                                <Divider style={{ marginTop: 12, marginBottom: 12 }} />
                                {
                                    this.state.codes.length == 0 ?

                                            <Box style={{ display: 'flex', flexDirection: 'row', marginBottom: 12 }}>
                                                <Typography style={{ alignSelf: 'center', overflowWrap: 'anywhere' }} color="text.secondary" variant='body2' >{"No active third party services"}</Typography>
                                            </Box>
                                     : null
                                }
                                {
                                    this.state.codes.map(code => {
                                        return (
                                            <Box key={code.id} style={{ display: 'flex', flexDirection: 'row', marginBottom: 12 }}>
                                                {this.state.status.web.status == "ok" ? <CheckCircle color='success' /> : this.state.status.web.status == "warning" ? <Error color='warning' /> : <Error color='error' />}
                                                <Typography style={{ marginLeft: 12 }} variant='body1' >{this.state.providers.get(code.providerId).name}</Typography>
                                            </Box>
                                        )
                                    })
                                }
                            </Card>
                        </Grid>
                    </Grid>
                </Loading>
            </>
        )
    }
}



export default System