import React from 'react'
import Request from '../../utils/Request'
import { Typography, Skeleton, Modal, Card, Box, Button, Grid, ButtonGroup } from '@mui/material'
import Action from '../Action'

class Process extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            process: {
                settings: []
            },
            open: false,
            settings: []
        }
    }

    async componentDidMount() {
        let result = await new Request().get().fetch("/api/processes/" + this.props.source.action)
        if (result.error) {
            this.props.onDelete()
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.setState({ loading: false, process: result.data, open: false, settings: [] })
        }
    }

    onClick() {
        switch (this.props.mode) {
            case "view":
                if (this.state.loading == false) {
                    this.checkAction()
                }
                break
            case "edit":
                break
            case "delete":
                this.props.onDelete()
                break
        }
    }

    async executeAction() {
        this.setState({ loading: true })
        let resetState = {}
        let tmp = {}
        for (let index = 0; index < this.state.process.settings.length; index++) {
            let input = this.state.process.settings[index]
            let value = this.state[input.id]
            resetState[input.id] = null
            if (value) {
                tmp[input.id] = value
            } else {
                tmp[input.id] = null
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
            this.setState({ loading: false })
        } else {
            this.setState(resetState)
            this.componentDidMount()
        }
    }

    checkAction() {
        let settings = this.state.process.settings
        if (settings.length == 0) {
            this.executeAction()
        } else {
            this.setState({ settings: settings, open: true })
        }
    }

    render() {
        if (this.state.loading) {
            return (
                <Box onClick={() => { this.onClick() }} style={{ height: '100%', width: '100%' }}>
                    <Skeleton style={{ height: '100%', width: '100%' }} />
                </Box>
            )
        }
        return (
            <>
                <Modal onClose={() => { this.setState({ open: false }) }} open={this.state.open}>
                    <Card variant='outlined' style={{ padding: 10, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 300 }}>
                        <Grid container spacing={1}>
                            {
                                this.state.process.settings.map((setting, index) => {
                                    return (
                                        <Grid item xs={12} md={12} lg={12}>
                                            <Action options={setting.options} label={String.capitalizeFirstLetter(setting.id)} setState={this.setState.bind(this)} id={setting.id} action={setting} />
                                        </Grid>
                                    )
                                })
                            }

                        </Grid>
                        <Button onClick={() => { this.executeAction() }} size='large' style={{ width: '50%', marginTop: 12 }} variant='contained'>
                            <Typography variant='body2' >
                                {
                                    String.capitalizeFirstLetter("Execute")
                                }
                            </Typography>
                        </Button>
                    </Card>
                </Modal>
                <ButtonGroup style={{ width: '100%', height: '100%' }}>
                    <Button variant='contained' onClick={() => this.onClick(false)} color={'primary'} style={{ backgroundColor: this.state.process.isDefault ?  'rgb(1, 67, 134)' : 'rgb(0, 127, 255)', textTransform: 'none', textAlign: 'center', width: this.state.process.mode == "switch" ? '90%' : '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant='caption' color="text.secondary" >
                            {
                                String.capitalizeFirstLetter(this.state.process.room.name)
                            }
                        </Typography>
                        <Typography variant='h6'  >
                            {
                                String.capitalizeFirstLetter(this.state.process.name)
                            }
                        </Typography>
                    </Button>
                </ButtonGroup>
            </>
        )
    }

}

export default Process