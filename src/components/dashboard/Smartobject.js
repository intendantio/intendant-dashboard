import React from 'react'
import Request from '../../utils/Request'
import { Typography, Skeleton, Modal, Card, Box, Button, Grid } from '@mui/material'
import Action from '../Action'

class Smartobject extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            smartobject: {},
            open: false,
            settings: []
        }
    }

    async componentDidMount() {
        let result = await new Request().get().fetch("/api/smartobjects/" + this.props.source.object)
        if (result.error) {
            this.props.onDelete()
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.setState({ loading: false, smartobject: result.data })
        }
    }

    onClick() {
        switch (this.props.mode) {
            case "view":
                this.checkAction()
                break
            case "edit":

                break
            case "delete":
                this.props.onDelete()
                break
        }
    }

    async executeAction(action) {
        this.setState({ loadingAction: action.id })
        let resetState = {}
        let tmp = {}
        for (let index = 0; index < action.settings.length; index++) {
            let setting = action.settings[index];
            let value = this.state[setting.id]
            resetState[setting.id] = null
            if (value) {
                tmp[setting.id] = value
            } else {
                tmp[setting.id] = null
            }
        }
        this.setState({ open: false })
        let result = await new Request().post({ settings: tmp }).fetch("/api/smartobjects/" + this.state.smartobject.id + "/actions/" + action.id)
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            this.componentDidMount()
        }
    }


    checkAction() {
        let action = {}
        this.state.smartobject.actions.forEach(pAction => {
            if (pAction.id == this.props.source.action) {
                action = pAction
            }
        })

        if (action.settings.length == 0) {
            this.executeAction(action.id,action.settings)
        } else {
            this.setState({
                open: true
            })
        }
    }

    render() {
        if (this.state.loading) {
            return (
                <Box style={{ height: '100%', width: '100%' }}>
                    <Skeleton style={{ height: '100%', width: '100%' }} />
                </Box>
            )
        }
        let action = {}
        this.state.smartobject.actions.forEach(pAction => {
            if (pAction.id == this.props.source.action) {
                action = pAction
            }
        })
        return (
        <>
            <Modal onClose={() => { this.setState({ open: false }) }} open={this.state.open}>
                <Card variant='outlined' style={{ padding: 10, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 300 }}>
                    <Grid container spacing={1}>
                        {
                            action.settings.map((setting, index) => {
                                return (
                                    <Grid item xs={12} md={12} lg={12}>
                                        <Action options={setting.options} label={String.capitalizeFirstLetter(setting.id)} setState={this.setState.bind(this)} id={setting.id} action={setting} />
                                    </Grid>
                                )
                            })
                        }
                    </Grid>
                    <Button onClick={() => { this.executeAction(action) }} size='large' style={{ width: '50%', marginTop: 12 }} variant='contained'>
                        <Typography variant='body2' >
                            {String.capitalizeFirstLetter(action.name)}
                        </Typography>
                    </Button>
                </Card>
            </Modal>
            <Button variant='contained' onClick={() => this.onClick()} style={{ backgroundColor: '#00afff82', textTransform: 'none', textAlign: 'center', width: '100%', height: '100%', padding: 10, display: 'flex', flexDirection: 'column' }}>
                <Typography variant='caption' color="text.secondary" >
                    {String.capitalizeFirstLetter(this.state.smartobject.room.name + " - " + this.state.smartobject.reference)}
                </Typography>
                <Typography variant='h6' color='white'  >
                    {String.capitalizeFirstLetter(action.name)}
                </Typography>
            </Button>
        </>
        )
    }

}

export default Smartobject