import React from 'react'
import { Typography, Paper, Grid, Card, Button, Modal, Box, Skeleton } from '@mui/material'
import Request from '../../utils/Request'
import * as AbstractIcon from '@mui/icons-material'
import Action from '../../components/Action'
import Desktop from '../../components/Desktop'

class Home extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            rooms: [],
            rapports: [],
            processes: [],
            process: {
                settings: []
            },
        }
        props.setTitle("Home")
        props.setActionType("list")
    }

    async componentDidMount() {
        let resultRoom = await new Request().get().fetch("/api/rooms")
        let resultProcesses = await new Request().get().fetch("/api/processes")
        let resusltRapports = await new Request().get().fetch("/api/rapports")
        let resusltWidgets = await new Request().get().fetch("/api/widgets")
        if (resultRoom.error) {
            this.props.setMessage(resultRoom.package + " : " + resultRoom.message)
        } else if (resultProcesses.error) {
            this.props.setMessage(resultProcesses.package + " : " + resultProcesses.message)
        } else if (resusltRapports.error) {
            this.props.setMessage(resusltRapports.package + " : " + resusltRapports.message)
        } else {
            this.setState({ rapports: resusltRapports.data, rooms: resultRoom.data, processes: resultProcesses.data, loading: false })
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
            smartobjects: this.state.process.smartobjects.map(smartobject => {
                return smartobject.id
            }),
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
        return (
            <>
                <Desktop {... this.props}>
                    <Paper variant="outlined" style={{ padding: 12, justifyContent: 'left', marginBottom: 12 }}>
                        <Box style={{ display: 'flex', flex: 1 }} >
                            {
                                this.state.loading ?
                                    <Box style={{ width: '100%' }}>
                                        <Skeleton height={40} />
                                    </Box> :
                                    <>
                                        <Box style={{ flex: 4, alignSelf: 'center', alignItems: 'center' }} >
                                            <Typography variant='subtitle1' fontWeight='bold' >Dashboard</Typography>
                                        </Box>
                                    </>
                            }
                        </Box>
                    </Paper>
                </Desktop>
                {
                    this.state.rooms.length == 0 ? null :
                        <Card variant='outlined' >
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
                                    <Button onClick={() => { this.executeAction() }} size='large' style={{ width: '50%', marginTop: 6 }} variant='contained'>
                                        <Typography variant='body2' >
                                            {String.capitalizeFirstLetter("Execute")}
                                        </Typography>
                                    </Button>
                                </Card>
                            </Modal>
                            <Grid container spacing={1} >
                                {
                                    this.state.rooms.map(room => {
                                        let CurrentIcon = AbstractIcon[room.icon]
                                        return (
                                            <Grid item xs={12} md={4} lg={3} style={{ justifyContent: 'center', display: 'flex' }} >
                                                <Box style={{ padding: 12, width: '90%', display: 'flex', flexDirection: 'column' }}>
                                                    <Box style={{ display: 'flex', justifyContent: 'center', alignSelf: 'center' }}>
                                                        <CurrentIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} fontSize='large' />
                                                    </Box>
                                                    <Typography variant='subtitle1' textAlign='center' >{String.capitalizeFirstLetter(room.name)}</Typography>
                                                    <Grid container spacing={1} style={{ marginTop: 4 }}>

                                                        {
                                                            this.state.processes.filter(process => {
                                                                return process.room.id == room.id
                                                            }).map(process => {
                                                                return (
                                                                    <Grid item xs={12} md={12} lg={12} style={{ justifyContent: 'center', display: 'flex' }}>
                                                                        <Button variant='contained' onClick={() => { process.settings.length == 0 ? this.executeAction() : this.setState({ process: process, open: true }) }} style={{ backgroundColor: process.isDefault ? 'rgba(255, 17, 0, 0.46)' : 'rgb(0, 127, 255)', textTransform: 'none', textAlign: 'center', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                                                            <Typography variant='subtitle1'  >
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

                                                </Box>
                                            </Grid>
                                        )
                                    })
                                }
                            </Grid>
                        </Card>
                }
                {
                    this.state.rapports.length == 0 ? null :
                        <Card variant='outlined' style={{ marginTop: 12, marginBottom: 12 }} >
                            <Grid container spacing={1} style={{ padding: 4 }}  >
                                {
                                    this.state.rapports.map(rapport => {
                                        let unit = ""

                                        rapport.configuration.dataSources.forEach(dataSource => {
                                            if (dataSource.id == rapport.reference) {
                                                unit = dataSource.unit
                                            }
                                        })
                                        return (
                                            <Grid item xs={4} md={2} lg={2} style={{ justifyContent: 'center', display: 'flex' }}>
                                                <Typography variant='h6'  >
                                                    {String.capitalizeFirstLetter(rapport.lastData.value + " " + unit)}
                                                </Typography>
                                            </Grid>
                                        )
                                    })
                                }
                            </Grid>
                        </Card>
                }
                <Grid container spacing={1}   >
                    <Grid item xs={4} md={1} lg={1}>
                        <Card variant='outlined'  >
                            <Button variant='text' onClick={() => { this.setState({ loading: true,rapports: [], rooms: [], processes: [] }, () => { this.componentDidMount() }) }} style={{ textTransform: 'none', textAlign: 'center', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <AbstractIcon.Refresh sx={{ color: 'white' }} size='medium' />
                            </Button>
                        </Card>
                    </Grid>
                </Grid>
            </>
        )
    }
}

export default Home